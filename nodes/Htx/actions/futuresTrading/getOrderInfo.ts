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
				operation: ['getOrderInfo'],
			},
		},
		description: 'Underlying asset symbol (e.g., BTC, ETH)',
	},
	{
		displayName: 'Order ID Type',
		name: 'orderIdType',
		type: 'options',
		options: [
			{ name: 'Order ID', value: 'orderId' },
			{ name: 'Client Order ID', value: 'clientOrderId' },
		],
		default: 'orderId',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['getOrderInfo'],
			},
		},
		description: 'Type of order identifier to use',
	},
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['getOrderInfo'],
				orderIdType: ['orderId'],
			},
		},
		description: 'The order ID to query',
	},
	{
		displayName: 'Client Order ID',
		name: 'clientOrderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['getOrderInfo'],
				orderIdType: ['clientOrderId'],
			},
		},
		description: 'The client order ID to query',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const symbol = this.getNodeParameter('symbol', index) as string;
	const orderIdType = this.getNodeParameter('orderIdType', index) as string;

	const body: IDataObject = {
		symbol: symbol.toUpperCase(),
	};

	if (orderIdType === 'orderId') {
		body.order_id = this.getNodeParameter('orderId', index) as string;
	} else {
		body.client_order_id = this.getNodeParameter('clientOrderId', index) as string;
	}

	const response = await htxFuturesApiRequest.call(
		this,
		'POST',
		'/api/v1/contract_order_info',
		cleanObject(body),
	);

	return buildExecutionData(response, index);
}
