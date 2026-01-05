/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxSpotApiRequest } from '../../transport/htxClient';
import { buildExecutionData, cleanObject, normalizeSymbol } from '../../utils/helpers';
import { ORDER_STATES, ORDER_TYPES } from '../../constants/constants';

export const description: INodeProperties[] = [
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		required: true,
		default: 'btcusdt',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['getOrderHistory'],
			},
		},
		description: 'Trading pair symbol (e.g., btcusdt)',
	},
	{
		displayName: 'States',
		name: 'states',
		type: 'multiOptions',
		required: true,
		options: ORDER_STATES,
		default: ['filled', 'canceled'],
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['getOrderHistory'],
			},
		},
		description: 'Order states to filter by',
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
				operation: ['getOrderHistory'],
			},
		},
		options: [
			{
				displayName: 'Order Types',
				name: 'types',
				type: 'multiOptions',
				options: ORDER_TYPES,
				default: [],
				description: 'Filter by order types',
			},
			{
				displayName: 'Start Time',
				name: 'startTime',
				type: 'dateTime',
				default: '',
				description: 'Filter orders after this time',
			},
			{
				displayName: 'End Time',
				name: 'endTime',
				type: 'dateTime',
				default: '',
				description: 'Filter orders before this time',
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
	const states = this.getNodeParameter('states', index) as string[];
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const query: IDataObject = {
		symbol: normalizeSymbol(symbol),
		states: states.join(','),
	};

	if (additionalFields.types && (additionalFields.types as string[]).length > 0) {
		query.types = (additionalFields.types as string[]).join(',');
	}

	if (additionalFields.startTime) {
		query['start-time'] = new Date(additionalFields.startTime as string).getTime();
	}

	if (additionalFields.endTime) {
		query['end-time'] = new Date(additionalFields.endTime as string).getTime();
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
		'/v1/order/orders',
		{},
		cleanObject(query),
	);

	return buildExecutionData(response, index);
}
