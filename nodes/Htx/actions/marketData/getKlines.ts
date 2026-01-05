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
				operation: ['getKlines'],
			},
		},
		description: 'Trading pair symbol (e.g., btcusdt, ethusdt)',
	},
	{
		displayName: 'Period',
		name: 'period',
		type: 'options',
		required: true,
		options: [
			{ name: '1 Minute', value: '1min' },
			{ name: '5 Minutes', value: '5min' },
			{ name: '15 Minutes', value: '15min' },
			{ name: '30 Minutes', value: '30min' },
			{ name: '1 Hour', value: '60min' },
			{ name: '4 Hours', value: '4hour' },
			{ name: '1 Day', value: '1day' },
			{ name: '1 Week', value: '1week' },
			{ name: '1 Month', value: '1mon' },
			{ name: '1 Year', value: '1year' },
		],
		default: '1day',
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getKlines'],
			},
		},
		description: 'Candlestick interval',
	},
	{
		displayName: 'Size',
		name: 'size',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 2000,
		},
		default: 150,
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getKlines'],
			},
		},
		description: 'Number of candlesticks to return (max 2000)',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const symbol = this.getNodeParameter('symbol', index) as string;
	const period = this.getNodeParameter('period', index) as string;
	const size = this.getNodeParameter('size', index) as number;

	const query: IDataObject = {
		symbol: symbol.toLowerCase(),
		period,
		size,
	};

	const response = await htxPublicApiRequest.call(
		this,
		'GET',
		'/market/history/kline',
		cleanObject(query),
	);

	return buildExecutionData(response, index);
}
