/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxSpotApiRequest } from '../../transport/htxClient';
import { buildExecutionData } from '../../utils/helpers';

export const description: INodeProperties[] = [
	{
		displayName: 'Order IDs',
		name: 'orderIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['batchCancelOrders'],
			},
		},
		description: 'Comma-separated list of order IDs to cancel (max 50)',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const orderIdsInput = this.getNodeParameter('orderIds', index) as string;
	const orderIds = orderIdsInput.split(',').map((id) => id.trim());

	if (orderIds.length > 50) {
		throw new Error('Maximum 50 orders allowed per batch cancel');
	}

	const body: IDataObject = {
		'order-ids': orderIds,
	};

	const response = await htxSpotApiRequest.call(
		this,
		'POST',
		'/v1/order/orders/batchcancel',
		body,
	);

	return buildExecutionData(response, index);
}
