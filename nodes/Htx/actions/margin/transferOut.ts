/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxSpotApiRequest } from '../../transport/htxClient';
import { buildExecutionData, normalizeSymbol, normalizeCurrency } from '../../utils/helpers';

export const description: INodeProperties[] = [
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		required: true,
		default: 'btcusdt',
		displayOptions: {
			show: {
				resource: ['margin'],
				operation: ['transferOut'],
			},
		},
		description: 'Trading pair symbol (e.g., btcusdt)',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		default: 'usdt',
		displayOptions: {
			show: {
				resource: ['margin'],
				operation: ['transferOut'],
			},
		},
		description: 'Currency to transfer (e.g., btc, usdt)',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['margin'],
				operation: ['transferOut'],
			},
		},
		description: 'Amount to transfer',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const symbol = this.getNodeParameter('symbol', index) as string;
	const currency = this.getNodeParameter('currency', index) as string;
	const amount = this.getNodeParameter('amount', index) as string;

	const body: IDataObject = {
		symbol: normalizeSymbol(symbol),
		currency: normalizeCurrency(currency),
		amount,
	};

	const response = await htxSpotApiRequest.call(
		this,
		'POST',
		'/v1/dw/transfer-out/margin',
		body,
	);

	return buildExecutionData({ transferId: response }, index);
}
