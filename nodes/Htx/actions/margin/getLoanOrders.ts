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
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		required: true,
		default: 'btcusdt',
		displayOptions: {
			show: {
				resource: ['margin'],
				operation: ['getLoanOrders'],
			},
		},
		description: 'Trading pair symbol (e.g., btcusdt)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['margin'],
				operation: ['getLoanOrders'],
			},
		},
		options: [
			{
				displayName: 'States',
				name: 'states',
				type: 'multiOptions',
				options: [
					{ name: 'Created', value: 'created' },
					{ name: 'Accrual', value: 'accrual' },
					{ name: 'Cleared', value: 'cleared' },
					{ name: 'Invalid', value: 'invalid' },
				],
				default: [],
				description: 'Filter by loan states',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Filter loans after this date',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Filter loans before this date',
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
				default: 'prev',
				description: 'Pagination direction',
			},
			{
				displayName: 'Size',
				name: 'size',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 100,
				description: 'Maximum number of orders to return (1-100)',
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

	const query: IDataObject = {
		symbol: normalizeSymbol(symbol),
	};

	if (additionalFields.states && (additionalFields.states as string[]).length > 0) {
		query.states = (additionalFields.states as string[]).join(',');
	}

	if (additionalFields.startDate) {
		query['start-date'] = new Date(additionalFields.startDate as string).toISOString().split('T')[0];
	}

	if (additionalFields.endDate) {
		query['end-date'] = new Date(additionalFields.endDate as string).toISOString().split('T')[0];
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
		'/v1/margin/loan-orders',
		{},
		cleanObject(query),
	);

	return buildExecutionData(response, index);
}
