/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxSpotApiRequest } from '../../transport/htxClient';
import { buildExecutionData, cleanObject, normalizeSymbol } from '../../utils/helpers';

export const description: INodeProperties[] = [
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['getOpenOrders'],
			},
		},
		description: 'Trading account ID',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['getOpenOrders'],
			},
		},
		options: [
			{
				displayName: 'Symbol',
				name: 'symbol',
				type: 'string',
				default: '',
				description: 'Filter by trading pair symbol',
			},
			{
				displayName: 'Side',
				name: 'side',
				type: 'options',
				options: [
					{ name: 'Buy', value: 'buy' },
					{ name: 'Sell', value: 'sell' },
				],
				default: '',
				description: 'Filter by order side',
			},
			{
				displayName: 'From Order ID',
				name: 'from',
				type: 'string',
				default: '',
				description: 'Start from this order ID (for pagination)',
			},
			{
				displayName: 'Direct',
				name: 'direct',
				type: 'options',
				options: [
					{ name: 'Next (Ascending)', value: 'next' },
					{ name: 'Previous (Descending)', value: 'prev' },
				],
				default: 'next',
				description: 'Pagination direction',
			},
			{
				displayName: 'Size',
				name: 'size',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 500,
				},
				default: 100,
				description: 'Maximum number of orders to return (1-500)',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const accountId = this.getNodeParameter('accountId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const query: IDataObject = {
		'account-id': accountId,
	};

	if (additionalFields.symbol) {
		query.symbol = normalizeSymbol(additionalFields.symbol as string);
	}

	if (additionalFields.side) {
		query.side = additionalFields.side;
	}

	if (additionalFields.from) {
		query.from = additionalFields.from;
	}

	if (additionalFields.direct) {
		query.direct = additionalFields.direct;
	}

	if (additionalFields.size) {
		query.size = additionalFields.size;
	}

	const response = await htxSpotApiRequest.call(
		this,
		'GET',
		'/v1/order/openOrders',
		{},
		cleanObject(query),
	);

	return buildExecutionData(response, index);
}
