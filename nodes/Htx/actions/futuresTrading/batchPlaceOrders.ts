/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxFuturesApiRequest } from '../../transport/htxClient';
import { buildExecutionData } from '../../utils/helpers';

export const description: INodeProperties[] = [
	{
		displayName: 'Orders JSON',
		name: 'ordersJson',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['batchPlaceOrders'],
			},
		},
		description: 'JSON array of orders to place (max 10). Each order should include: contract_code, direction, offset, price, volume, lever_rate, order_price_type',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const ordersJson = this.getNodeParameter('ordersJson', index) as string;

	let orders: IDataObject[];
	try {
		orders = JSON.parse(ordersJson);
	} catch {
		throw new Error('Invalid JSON format for orders');
	}

	if (!Array.isArray(orders)) {
		throw new Error('Orders must be an array');
	}

	if (orders.length > 10) {
		throw new Error('Maximum 10 orders allowed per batch');
	}

	const body = {
		orders_data: orders,
	};

	const response = await htxFuturesApiRequest.call(
		this,
		'POST',
		'/api/v1/contract_batchorder',
		body,
	);

	return buildExecutionData(response, index);
}
