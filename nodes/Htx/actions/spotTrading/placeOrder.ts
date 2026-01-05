/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxSpotApiRequest } from '../../transport/htxClient';
import { buildExecutionData, cleanObject, normalizeSymbol } from '../../utils/helpers';
import { ORDER_TYPES, ORDER_SOURCES } from '../../constants/constants';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['spotTrading'],
			},
		},
		options: [
			{
				name: 'Place Order',
				value: 'placeOrder',
				description: 'Place a single order',
				action: 'Place order',
			},
			{
				name: 'Batch Place Orders',
				value: 'batchPlaceOrders',
				description: 'Place multiple orders at once (max 10)',
				action: 'Batch place orders',
			},
			{
				name: 'Cancel Order',
				value: 'cancelOrder',
				description: 'Cancel a single order',
				action: 'Cancel order',
			},
			{
				name: 'Batch Cancel Orders',
				value: 'batchCancelOrders',
				description: 'Cancel multiple orders',
				action: 'Batch cancel orders',
			},
			{
				name: 'Cancel All Orders',
				value: 'cancelAllOrders',
				description: 'Cancel all open orders',
				action: 'Cancel all orders',
			},
			{
				name: 'Get Open Orders',
				value: 'getOpenOrders',
				description: 'Get all open orders',
				action: 'Get open orders',
			},
			{
				name: 'Get Order',
				value: 'getOrder',
				description: 'Get details of a specific order',
				action: 'Get order',
			},
			{
				name: 'Get Order History',
				value: 'getOrderHistory',
				description: 'Get historical orders',
				action: 'Get order history',
			},
			{
				name: 'Get Match Results',
				value: 'getMatchResults',
				description: 'Get trade fill history',
				action: 'Get match results',
			},
		],
		default: 'placeOrder',
	},
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['placeOrder'],
			},
		},
		description: 'Trading account ID',
	},
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		required: true,
		default: 'btcusdt',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['placeOrder'],
			},
		},
		description: 'Trading pair symbol (e.g., btcusdt, ethusdt)',
	},
	{
		displayName: 'Order Type',
		name: 'orderType',
		type: 'options',
		required: true,
		options: ORDER_TYPES,
		default: 'buy-limit',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['placeOrder'],
			},
		},
		description: 'Type of order to place',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['placeOrder'],
			},
		},
		description: 'Order quantity',
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['placeOrder'],
				orderType: ['buy-limit', 'sell-limit', 'buy-limit-maker', 'sell-limit-maker', 'buy-stop-limit', 'sell-stop-limit', 'buy-limit-fok', 'sell-limit-fok'],
			},
		},
		description: 'Order price (for limit orders)',
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
				operation: ['placeOrder'],
			},
		},
		options: [
			{
				displayName: 'Client Order ID',
				name: 'clientOrderId',
				type: 'string',
				default: '',
				description: 'Custom order ID (max 64 characters)',
			},
			{
				displayName: 'Source',
				name: 'source',
				type: 'options',
				options: ORDER_SOURCES,
				default: 'spot-api',
				description: 'Order source',
			},
			{
				displayName: 'Stop Price',
				name: 'stopPrice',
				type: 'string',
				default: '',
				description: 'Stop price for stop-limit orders',
			},
			{
				displayName: 'Operator',
				name: 'operator',
				type: 'options',
				options: [
					{ name: 'Greater Than or Equal (>=)', value: 'gte' },
					{ name: 'Less Than or Equal (<=)', value: 'lte' },
				],
				default: 'gte',
				description: 'Stop price trigger condition',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const accountId = this.getNodeParameter('accountId', index) as string;
	const symbol = this.getNodeParameter('symbol', index) as string;
	const orderType = this.getNodeParameter('orderType', index) as string;
	const amount = this.getNodeParameter('amount', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		'account-id': accountId,
		symbol: normalizeSymbol(symbol),
		type: orderType,
		amount,
	};

	// Add price for limit orders
	if (!orderType.includes('market')) {
		const price = this.getNodeParameter('price', index) as string;
		body.price = price;
	}

	if (additionalFields.clientOrderId) {
		body['client-order-id'] = additionalFields.clientOrderId;
	}

	if (additionalFields.source) {
		body.source = additionalFields.source;
	}

	if (additionalFields.stopPrice) {
		body['stop-price'] = additionalFields.stopPrice;
	}

	if (additionalFields.operator) {
		body.operator = additionalFields.operator;
	}

	const response = await htxSpotApiRequest.call(
		this,
		'POST',
		'/v1/order/orders/place',
		cleanObject(body),
	);

	return buildExecutionData({ orderId: response }, index);
}
