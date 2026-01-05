/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxPublicApiRequest } from '../../transport/htxClient';
import { buildExecutionData, cleanObject } from '../../utils/helpers';

export const description: INodeProperties[] = [
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		required: true,
		default: 'btcusdt',
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getTrades'],
			},
		},
		description: 'Trading pair symbol (e.g., btcusdt, ethusdt)',
	},
	{
		displayName: 'Size',
		name: 'size',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 2000,
		},
		default: 100,
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getTrades'],
			},
		},
		description: 'Number of trades to return (max 2000)',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const symbol = this.getNodeParameter('symbol', index) as string;
	const size = this.getNodeParameter('size', index) as number;

	const query: IDataObject = {
		symbol: symbol.toLowerCase(),
		size,
	};

	const response = await htxPublicApiRequest.call(
		this,
		'GET',
		'/market/history/trade',
		cleanObject(query),
	);

	return buildExecutionData(response, index);
}
