/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, INodeExecutionData } from 'n8n-workflow';

/**
 * Convert timestamp to ISO date string
 */
export function timestampToDate(timestamp: number | string): string {
	const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
	return new Date(ts).toISOString();
}

/**
 * Alias for backwards compatibility
 */
export const timestampToIsoDate = timestampToDate;

/**
 * Convert ISO date string or Date to timestamp
 */
export function dateToTimestamp(date: string | Date): number {
	return new Date(date).getTime();
}

/**
 * Alias for backwards compatibility
 */
export const isoDateToTimestamp = (isoDate: string): number => dateToTimestamp(isoDate);

/**
 * Format amount to string with proper precision
 */
export function formatAmount(amount: number | string, precision = 8): string {
	const num = typeof amount === 'string' ? parseFloat(amount) : amount;
	return num.toFixed(precision).replace(/\.?0+$/, '');
}

/**
 * Normalize symbol to lowercase (HTX format)
 */
export function normalizeSymbol(symbol: string): string {
	return symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Normalize currency to lowercase
 */
export function normalizeCurrency(currency: string): string {
	return currency.toLowerCase().trim();
}

/**
 * Build output from API response
 */
export function buildExecutionData(
	items: IDataObject | IDataObject[],
	itemIndex: number,
): INodeExecutionData[] {
	if (Array.isArray(items)) {
		return items.map((item) => ({
			json: item,
			pairedItem: { item: itemIndex },
		}));
	}

	return [
		{
			json: items,
			pairedItem: { item: itemIndex },
		},
	];
}

/**
 * Parse HTX order type to human readable format
 */
export function parseOrderType(orderType: string): string {
	const parts = orderType.split('-');
	return parts
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

/**
 * Parse HTX order type to components
 */
export function parseOrderTypeComponents(orderType: string): { side: string; type: string } {
	const parts = orderType.split('-');
	const side = parts[0]; // buy or sell
	const type = parts.slice(1).join('-'); // limit, market, ioc, etc.

	return {
		side: side.charAt(0).toUpperCase() + side.slice(1),
		type: type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' '),
	};
}

/**
 * Parse HTX order state to human readable format
 */
export function parseOrderState(state: string): string {
	const stateMap: Record<string, string> = {
		submitted: 'Submitted',
		'partial-filled': 'Partial Filled',
		'partial-canceled': 'Partial Canceled',
		filled: 'Filled',
		canceled: 'Canceled',
		created: 'Created',
	};

	return stateMap[state] || state;
}

/**
 * Calculate fill percentage
 */
export function calculateFillPercentage(
	filledAmount: string | number,
	totalAmount: string | number,
): number {
	const filled =
		typeof filledAmount === 'string' ? parseFloat(filledAmount) : filledAmount;
	const total =
		typeof totalAmount === 'string' ? parseFloat(totalAmount) : totalAmount;

	if (total === 0) return 0;

	return Math.round((filled / total) * 10000) / 100;
}

/**
 * Validate trading symbol format
 */
export function isValidSymbol(symbol: string): boolean {
	return /^[a-z0-9]+$/.test(symbol);
}

/**
 * Validate currency format
 */
export function isValidCurrency(currency: string): boolean {
	return /^[a-z0-9]+$/.test(currency);
}

/**
 * Parse number from string safely
 */
export function safeParseNumber(value: string | number | undefined): number | undefined {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}

	const num = typeof value === 'string' ? parseFloat(value) : value;

	return isNaN(num) ? undefined : num;
}

/**
 * Clean object by removing undefined/null/empty values
 */
export function cleanObject(obj: IDataObject): IDataObject {
	const cleaned: IDataObject = {};

	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined && value !== null && value !== '') {
			cleaned[key] = value;
		}
	}

	return cleaned;
}

/**
 * Flatten nested account balance data
 */
export function flattenAccountBalance(account: IDataObject): IDataObject {
	const result: IDataObject = {
		accountId: account.id,
		accountType: account.type,
		state: account.state,
	};

	if (Array.isArray(account.list)) {
		const balances: IDataObject = {};

		for (const item of account.list as IDataObject[]) {
			const currency = item.currency as string;
			const balanceType = item.type as string;
			const balance = item.balance as string;

			if (!balances[currency]) {
				balances[currency] = {};
			}

			(balances[currency] as IDataObject)[balanceType] = balance;
		}

		result.balances = balances;
	}

	return result;
}

/**
 * Parse futures contract code
 */
export function parseContractCode(contractCode: string): {
	symbol: string;
	currency: string;
} {
	const parts = contractCode.split('-');
	return {
		symbol: parts[0],
		currency: parts[1] || 'USD',
	};
}

/**
 * Calculate unrealized PnL percentage
 */
export function calculatePnlPercentage(
	unrealizedPnl: number,
	positionMargin: number,
): number {
	if (positionMargin === 0) return 0;
	return Math.round((unrealizedPnl / positionMargin) * 10000) / 100;
}

/**
 * Format leverage rate display
 */
export function formatLeverageRate(leverageRate: number): string {
	return `${leverageRate}x`;
}

/**
 * Delay execution for rate limiting
 */
export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validate required fields exist and are not empty
 */
export function validateRequiredFields(
	data: IDataObject,
	requiredFields: string[],
): void {
	for (const field of requiredFields) {
		const value = data[field];
		if (value === undefined || value === null || value === '') {
			throw new Error(`Missing required field: ${field}`);
		}
	}
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	maxRetries = 3,
	baseDelay = 1000,
): Promise<T> {
	let lastError: Error | undefined;

	for (let i = 0; i < maxRetries; i++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error as Error;

			if (i < maxRetries - 1) {
				const delayMs = baseDelay * Math.pow(2, i);
				await delay(delayMs);
			}
		}
	}

	throw lastError;
}
