/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { htxSpotApiRequest } from '../../transport/htxClient';
import { buildExecutionData } from '../../utils/helpers';

export const description: INodeProperties[] = [
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['getOrder'],
			},
		},
		description: 'The ID of the order to retrieve',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const orderId = this.getNodeParameter('orderId', index) as string;

	const response = await htxSpotApiRequest.call(
		this,
		'GET',
		`/v1/order/orders/${orderId}`,
	);

	return buildExecutionData(response, index);
}
