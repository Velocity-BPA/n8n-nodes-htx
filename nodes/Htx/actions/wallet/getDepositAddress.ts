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
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		default: 'btc',
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['getDepositAddress'],
			},
		},
		description: 'Currency symbol (e.g., btc, eth, usdt)',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const currency = this.getNodeParameter('currency', index) as string;

	const response = await htxSpotApiRequest.call(
		this,
		'GET',
		'/v2/account/deposit/address',
		{},
		{ currency: currency.toLowerCase() },
	);

	return buildExecutionData(response, index);
}
