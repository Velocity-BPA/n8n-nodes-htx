/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';
import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	JsonObject,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { SPOT_API_HOSTS, FUTURES_API_HOST, ERROR_CODES } from '../constants/constants';
import type { IHtxCredentials, IHtxResponse, IHtxFuturesResponse } from '../types/HtxTypes';

/**
 * Generate HMAC-SHA256 signature for HTX API requests
 */
export function generateSignature(
	method: string,
	host: string,
	path: string,
	params: Record<string, string>,
	secretKey: string,
): string {
	// Sort parameters alphabetically
	const sortedParams = Object.keys(params)
		.sort()
		.map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
		.join('&');

	// Create payload
	const payload = `${method}\n${host}\n${path}\n${sortedParams}`;

	// Generate HMAC-SHA256 signature and encode as Base64
	return crypto.createHmac('sha256', secretKey).update(payload).digest('base64');
}

/**
 * Get current timestamp in UTC ISO format (without milliseconds)
 */
export function getTimestamp(): string {
	return new Date().toISOString().slice(0, 19);
}

/**
 * Get the appropriate API host based on credentials
 */
export function getSpotHost(credentials: IHtxCredentials): string {
	return credentials.baseUrl === 'aws' ? SPOT_API_HOSTS.aws : SPOT_API_HOSTS.global;
}

/**
 * Build authentication parameters for HTX API requests
 */
export function buildAuthParams(
	credentials: IHtxCredentials,
	query: IDataObject = {},
): Record<string, string> {
	const params: Record<string, string> = {
		AccessKeyId: credentials.accessKey,
		SignatureMethod: 'HmacSHA256',
		SignatureVersion: '2',
		Timestamp: getTimestamp(),
	};

	// Add query parameters
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined && value !== null && value !== '') {
			params[key] = String(value);
		}
	}

	return params;
}

/**
 * Make authenticated request to HTX Spot API
 */
export async function htxSpotApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const credentials = (await this.getCredentials('htxApi')) as unknown as IHtxCredentials;
	const host = getSpotHost(credentials);

	// Build authentication parameters
	const params = buildAuthParams(credentials, method === 'GET' ? query : {});

	// Generate signature
	params.Signature = generateSignature(method, host, endpoint, params, credentials.secretKey);

	const options: IDataObject = {
		method,
		url: `https://${host}${endpoint}`,
		qs: params,
		json: true,
	};

	if (method === 'POST' && Object.keys(body).length > 0) {
		options.body = body;
		options.headers = {
			'Content-Type': 'application/json',
		};
	}

	try {
		const response = (await this.helpers.request(options)) as IHtxResponse;

		if (response.status !== 'ok') {
			const errorCode = response['err-code'] || 'unknown-error';
			const errorMessage = ERROR_CODES[errorCode] || response['err-msg'] || 'Unknown error';
			throw new NodeApiError(this.getNode(), response as unknown as JsonObject, {
				message: `HTX API Error: ${errorMessage}`,
				description: `Error Code: ${errorCode}`,
			});
		}

		return response.data;
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: 'HTX API Request Failed',
			description: errorMessage,
		});
	}
}

/**
 * Make authenticated request to HTX Futures API
 */
export async function htxFuturesApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const credentials = (await this.getCredentials('htxApi')) as unknown as IHtxCredentials;

	// Build authentication parameters
	const params = buildAuthParams(credentials, method === 'GET' ? query : {});

	// Generate signature
	params.Signature = generateSignature(method, FUTURES_API_HOST, endpoint, params, credentials.secretKey);

	const options: IDataObject = {
		method,
		url: `https://${FUTURES_API_HOST}${endpoint}`,
		qs: params,
		json: true,
	};

	if (method === 'POST' && Object.keys(body).length > 0) {
		options.body = body;
		options.headers = {
			'Content-Type': 'application/json',
		};
	}

	try {
		const response = (await this.helpers.request(options)) as IHtxFuturesResponse;

		if (response.status !== 'ok') {
			const errorCode = response.err_code?.toString() || 'unknown-error';
			const errorMessage = response.err_msg || 'Unknown error';
			throw new NodeApiError(this.getNode(), response as unknown as JsonObject, {
				message: `HTX Futures API Error: ${errorMessage}`,
				description: `Error Code: ${errorCode}`,
			});
		}

		return response.data;
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: 'HTX Futures API Request Failed',
			description: errorMessage,
		});
	}
}

/**
 * Make public (unauthenticated) request to HTX API
 */
export async function htxPublicApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	query: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	let host: string;

	try {
		const credentials = (await this.getCredentials('htxApi')) as unknown as IHtxCredentials;
		host = getSpotHost(credentials);
	} catch {
		// If no credentials, use global host for public endpoints
		host = SPOT_API_HOSTS.global;
	}

	const options: IDataObject = {
		method,
		url: `https://${host}${endpoint}`,
		qs: query,
		json: true,
	};

	try {
		const response = (await this.helpers.request(options)) as IHtxResponse;

		if (response.status !== 'ok') {
			const errorCode = response['err-code'] || 'unknown-error';
			const errorMessage = ERROR_CODES[errorCode] || response['err-msg'] || 'Unknown error';
			throw new NodeApiError(this.getNode(), response as unknown as JsonObject, {
				message: `HTX API Error: ${errorMessage}`,
				description: `Error Code: ${errorCode}`,
			});
		}

		return response.data;
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: 'HTX API Request Failed',
			description: errorMessage,
		});
	}
}

/**
 * Handle pagination for HTX API requests
 */
export async function htxSpotApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
	limit = 500,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let fromId: string | undefined;

	query.size = limit;

	do {
		if (fromId) {
			query['from-id'] = fromId;
		}

		const response = (await htxSpotApiRequest.call(this, method, endpoint, body, query)) as IDataObject[];

		if (!Array.isArray(response)) {
			returnData.push(response);
			break;
		}

		returnData.push(...response);

		if (response.length < limit) {
			break;
		}

		// Get the last ID for pagination
		const lastItem = response[response.length - 1];
		fromId = String(lastItem.id || lastItem['order-id'] || lastItem['trade-id']);
	} while (fromId);

	return returnData;
}
