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
		displayName: 'From Account ID',
		name: 'fromAccountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spotAccount'],
				operation: ['transfer'],
			},
		},
		description: 'Source account ID',
	},
	{
		displayName: 'To Account ID',
		name: 'toAccountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spotAccount'],
				operation: ['transfer'],
			},
		},
		description: 'Destination account ID',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spotAccount'],
				operation: ['transfer'],
			},
		},
		description: 'Currency to transfer (e.g., btc, eth, usdt)',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spotAccount'],
				operation: ['transfer'],
			},
		},
		description: 'Amount to transfer',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const fromAccountId = this.getNodeParameter('fromAccountId', index) as string;
	const toAccountId = this.getNodeParameter('toAccountId', index) as string;
	const currency = this.getNodeParameter('currency', index) as string;
	const amount = this.getNodeParameter('amount', index) as string;

	const body: IDataObject = {
		'from-user': fromAccountId,
		'from-account-type': 'spot',
		'from-account': fromAccountId,
		'to-user': toAccountId,
		'to-account-type': 'spot',
		'to-account': toAccountId,
		currency: currency.toLowerCase(),
		amount,
	};

	const response = await htxSpotApiRequest.call(
		this,
		'POST',
		'/v1/account/transfer',
		body,
	);

	return buildExecutionData(response, index);
}
