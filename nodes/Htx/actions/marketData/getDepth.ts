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
				operation: ['getDepth'],
			},
		},
		description: 'Trading pair symbol (e.g., btcusdt, ethusdt)',
	},
	{
		displayName: 'Depth',
		name: 'depth',
		type: 'options',
		options: [
			{ name: '5 Levels', value: 5 },
			{ name: '10 Levels', value: 10 },
			{ name: '20 Levels', value: 20 },
		],
		default: 20,
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getDepth'],
			},
		},
		description: 'Number of order book levels to return',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'Step 0 (No Aggregation)', value: 'step0' },
			{ name: 'Step 1 (Aggregation Level 1)', value: 'step1' },
			{ name: 'Step 2 (Aggregation Level 2)', value: 'step2' },
			{ name: 'Step 3 (Aggregation Level 3)', value: 'step3' },
			{ name: 'Step 4 (Aggregation Level 4)', value: 'step4' },
			{ name: 'Step 5 (Aggregation Level 5)', value: 'step5' },
		],
		default: 'step0',
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getDepth'],
			},
		},
		description: 'Aggregation level for the order book',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const symbol = this.getNodeParameter('symbol', index) as string;
	const depth = this.getNodeParameter('depth', index) as number;
	const type = this.getNodeParameter('type', index) as string;

	const query: IDataObject = {
		symbol: symbol.toLowerCase(),
		depth,
		type,
	};

	const response = await htxPublicApiRequest.call(
		this,
		'GET',
		'/market/depth',
		cleanObject(query),
	);

	return buildExecutionData(response, index);
}
