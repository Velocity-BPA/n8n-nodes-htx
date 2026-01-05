/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxSpotApiRequest } from '../../transport/htxClient';
import { buildExecutionData, normalizeSymbol } from '../../utils/helpers';

export const description: INodeProperties[] = [
	{
		displayName: 'Orders (JSON)',
		name: 'orders',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['batchPlaceOrders'],
			},
		},
		description: 'Array of orders to place (max 10). Each order should have: account-id, symbol, type, amount, and price (for limit orders).',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const ordersJson = this.getNodeParameter('orders', index) as string;

	let orders: IDataObject[];
	try {
		orders = typeof ordersJson === 'string' ? JSON.parse(ordersJson) : ordersJson;
	} catch {
		throw new Error('Invalid JSON format for orders');
	}

	if (!Array.isArray(orders)) {
		throw new Error('Orders must be an array');
	}

	if (orders.length > 10) {
		throw new Error('Maximum 10 orders allowed per batch');
	}

	// Normalize symbols in orders
	const normalizedOrders = orders.map((order) => ({
		...order,
		symbol: normalizeSymbol(order.symbol as string),
	}));

	const response = await htxSpotApiRequest.call(
		this,
		'POST',
		'/v1/order/batch-orders',
		normalizedOrders as unknown as IDataObject,
	);

	return buildExecutionData(response, index);
}
