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
				operation: ['placeTriggerOrder'],
			},
		},
		description: 'Underlying asset symbol (e.g., BTC, ETH)',
	},
	{
		displayName: 'Contract Type',
		name: 'contractType',
		type: 'options',
		required: true,
		options: [
			{ name: 'This Week', value: 'this_week' },
			{ name: 'Next Week', value: 'next_week' },
			{ name: 'Quarter', value: 'quarter' },
			{ name: 'Next Quarter', value: 'next_quarter' },
		],
		default: 'quarter',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['placeTriggerOrder'],
			},
		},
		description: 'Contract type',
	},
	{
		displayName: 'Trigger Type',
		name: 'triggerType',
		type: 'options',
		required: true,
		options: [
			{ name: 'Greater Than or Equal (>=)', value: 'ge' },
			{ name: 'Less Than or Equal (<=)', value: 'le' },
		],
		default: 'ge',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['placeTriggerOrder'],
			},
		},
		description: 'Trigger condition (ge: price >= trigger_price, le: price <= trigger_price)',
	},
	{
		displayName: 'Trigger Price',
		name: 'triggerPrice',
		type: 'number',
		required: true,
		typeOptions: {
			numberPrecision: 8,
		},
		default: 0,
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['placeTriggerOrder'],
			},
		},
		description: 'Price that triggers the order',
	},
	{
		displayName: 'Direction',
		name: 'direction',
		type: 'options',
		required: true,
		options: [
			{ name: 'Buy', value: 'buy' },
			{ name: 'Sell', value: 'sell' },
		],
		default: 'buy',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['placeTriggerOrder'],
			},
		},
		description: 'Order direction',
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'options',
		required: true,
		options: [
			{ name: 'Open', value: 'open' },
			{ name: 'Close', value: 'close' },
		],
		default: 'open',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['placeTriggerOrder'],
			},
		},
		description: 'Order offset (open: open position, close: close position)',
	},
	{
		displayName: 'Volume',
		name: 'volume',
		type: 'number',
		required: true,
		typeOptions: {
			minValue: 1,
		},
		default: 1,
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['placeTriggerOrder'],
			},
		},
		description: 'Number of contracts',
	},
	{
		displayName: 'Leverage',
		name: 'leverRate',
		type: 'options',
		required: true,
		options: [
			{ name: '1x', value: 1 },
			{ name: '2x', value: 2 },
			{ name: '3x', value: 3 },
			{ name: '5x', value: 5 },
			{ name: '10x', value: 10 },
			{ name: '20x', value: 20 },
			{ name: '30x', value: 30 },
			{ name: '50x', value: 50 },
			{ name: '75x', value: 75 },
			{ name: '100x', value: 100 },
			{ name: '125x', value: 125 },
		],
		default: 10,
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['placeTriggerOrder'],
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
				operation: ['placeTriggerOrder'],
			},
		},
		options: [
			{
				displayName: 'Contract Code',
				name: 'contractCode',
				type: 'string',
				default: '',
				description: 'Contract code (e.g., BTC-USD)',
			},
			{
				displayName: 'Order Price',
				name: 'orderPrice',
				type: 'number',
				typeOptions: {
					numberPrecision: 8,
				},
				default: 0,
				description: 'Execution price after trigger (0 for market price)',
			},
			{
				displayName: 'Order Price Type',
				name: 'orderPriceType',
				type: 'options',
				options: [
					{ name: 'Limit', value: 'limit' },
					{ name: 'Optimal 5', value: 'optimal_5' },
					{ name: 'Optimal 10', value: 'optimal_10' },
					{ name: 'Optimal 20', value: 'optimal_20' },
				],
				default: 'limit',
				description: 'Order price type',
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
	const triggerType = this.getNodeParameter('triggerType', index) as string;
	const triggerPrice = this.getNodeParameter('triggerPrice', index) as number;
	const direction = this.getNodeParameter('direction', index) as string;
	const offset = this.getNodeParameter('offset', index) as string;
	const volume = this.getNodeParameter('volume', index) as number;
	const leverRate = this.getNodeParameter('leverRate', index) as number;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		symbol: symbol.toUpperCase(),
		contract_type: contractType,
		trigger_type: triggerType,
		trigger_price: triggerPrice,
		direction,
		offset,
		volume,
		lever_rate: leverRate,
	};

	if (additionalFields.contractCode) {
		body.contract_code = additionalFields.contractCode;
	}

	if (additionalFields.orderPrice) {
		body.order_price = additionalFields.orderPrice;
	}

	if (additionalFields.orderPriceType) {
		body.order_price_type = additionalFields.orderPriceType;
	}

	const response = await htxFuturesApiRequest.call(
		this,
		'POST',
		'/api/v1/contract_trigger_order',
		cleanObject(body),
	);

	return buildExecutionData(response, index);
}
