/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxFuturesApiRequest } from '../../transport/htxClient';
import { buildExecutionData, cleanObject } from '../../utils/helpers';

export const description: INodeProperties[] = [
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		required: true,
		default: 'BTC',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['getOpenOrders'],
			},
		},
		description: 'Underlying asset symbol (e.g., BTC, ETH)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['getOpenOrders'],
			},
		},
		options: [
			{
				displayName: 'Page Index',
				name: 'pageIndex',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Page number',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 50,
				},
				default: 20,
				description: 'Records per page (max 50)',
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				options: [
					{ name: 'Created At (Descending)', value: 'created_at' },
					{ name: 'Update Time (Descending)', value: 'update_time' },
				],
				default: 'created_at',
				description: 'Sort field',
			},
			{
				displayName: 'Trade Type',
				name: 'tradeType',
				type: 'options',
				options: [
					{ name: 'All', value: '0' },
					{ name: 'Open Long', value: '1' },
					{ name: 'Open Short', value: '2' },
					{ name: 'Close Long', value: '3' },
					{ name: 'Close Short', value: '4' },
				],
				default: '0',
				description: 'Trade type filter',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const symbol = this.getNodeParameter('symbol', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		symbol: symbol.toUpperCase(),
	};

	if (additionalFields.pageIndex) {
		body.page_index = additionalFields.pageIndex;
	}

	if (additionalFields.pageSize) {
		body.page_size = additionalFields.pageSize;
	}

	if (additionalFields.sortBy) {
		body.sort_by = additionalFields.sortBy;
	}

	if (additionalFields.tradeType) {
		body.trade_type = additionalFields.tradeType;
	}

	const response = await htxFuturesApiRequest.call(
		this,
		'POST',
		'/api/v1/contract_openorders',
		cleanObject(body),
	);

	return buildExecutionData(response, index);
}
