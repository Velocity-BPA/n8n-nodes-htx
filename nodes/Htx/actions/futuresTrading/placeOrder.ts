/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxFuturesApiRequest } from '../../transport/htxClient';
import { buildExecutionData, cleanObject } from '../../utils/helpers';
import {
	FUTURES_CONTRACT_TYPES,
	FUTURES_DIRECTIONS,
	FUTURES_OFFSETS,
	FUTURES_ORDER_PRICE_TYPES,
	FUTURES_LEVERAGE_RATES,
} from '../../constants/constants';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
			},
		},
		options: [
			{
				name: 'Place Order',
				value: 'placeOrder',
				description: 'Place a futures order',
				action: 'Place order',
			},
			{
				name: 'Batch Place Orders',
				value: 'batchPlaceOrders',
				description: 'Place multiple orders at once',
				action: 'Batch place orders',
			},
			{
				name: 'Cancel Order',
				value: 'cancelOrder',
				description: 'Cancel a futures order',
				action: 'Cancel order',
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
				name: 'Get Order Info',
				value: 'getOrderInfo',
				description: 'Get order details',
				action: 'Get order info',
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
			{
				name: 'Place Trigger Order',
				value: 'placeTriggerOrder',
				description: 'Place a trigger (stop) order',
				action: 'Place trigger order',
			},
			{
				name: 'Cancel Trigger Order',
				value: 'cancelTriggerOrder',
				description: 'Cancel a trigger order',
				action: 'Cancel trigger order',
			},
		],
		default: 'placeOrder',
	},
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		required: true,
		default: 'BTC',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['placeOrder'],
			},
		},
		description: 'Underlying asset symbol (e.g., BTC, ETH)',
	},
	{
		displayName: 'Contract Type',
		name: 'contractType',
		type: 'options',
		options: FUTURES_CONTRACT_TYPES,
		required: true,
		default: 'quarter',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['placeOrder'],
			},
		},
		description: 'Contract type',
	},
	{
		displayName: 'Direction',
		name: 'direction',
		type: 'options',
		options: FUTURES_DIRECTIONS,
		required: true,
		default: 'buy',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['placeOrder'],
			},
		},
		description: 'Order direction (buy/sell)',
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'options',
		options: FUTURES_OFFSETS,
		required: true,
		default: 'open',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['placeOrder'],
			},
		},
		description: 'Open or close position',
	},
	{
		displayName: 'Volume',
		name: 'volume',
		type: 'number',
		required: true,
		default: 1,
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['placeOrder'],
			},
		},
		description: 'Number of contracts',
	},
	{
		displayName: 'Order Price Type',
		name: 'orderPriceType',
		type: 'options',
		options: FUTURES_ORDER_PRICE_TYPES,
		required: true,
		default: 'limit',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['placeOrder'],
			},
		},
		description: 'Order price type',
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['placeOrder'],
				orderPriceType: ['limit'],
			},
		},
		description: 'Order price (for limit orders)',
	},
	{
		displayName: 'Leverage Rate',
		name: 'leverageRate',
		type: 'options',
		options: FUTURES_LEVERAGE_RATES,
		required: true,
		default: 10,
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['placeOrder'],
			},
		},
		description: 'Leverage rate',
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
				operation: ['placeOrder'],
			},
		},
		options: [
			{
				displayName: 'Client Order ID',
				name: 'clientOrderId',
				type: 'number',
				default: undefined,
				description: 'Custom order ID',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const symbol = this.getNodeParameter('symbol', index) as string;
	const contractType = this.getNodeParameter('contractType', index) as string;
	const direction = this.getNodeParameter('direction', index) as string;
	const offset = this.getNodeParameter('offset', index) as string;
	const volume = this.getNodeParameter('volume', index) as number;
	const orderPriceType = this.getNodeParameter('orderPriceType', index) as string;
	const leverageRate = this.getNodeParameter('leverageRate', index) as number;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		symbol: symbol.toUpperCase(),
		contract_type: contractType,
		direction,
		offset,
		volume,
		order_price_type: orderPriceType,
		lever_rate: leverageRate,
	};

	if (orderPriceType === 'limit') {
		const price = this.getNodeParameter('price', index) as string;
		body.price = price;
	}

	if (additionalFields.clientOrderId) {
		body.client_order_id = additionalFields.clientOrderId;
	}

	const response = await htxFuturesApiRequest.call(
		this,
		'POST',
		'/api/v1/contract_order',
		cleanObject(body),
	);

	return buildExecutionData(response, index);
}
