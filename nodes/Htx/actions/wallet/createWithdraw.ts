/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxSpotApiRequest } from '../../transport/htxClient';
import { buildExecutionData, cleanObject } from '../../utils/helpers';

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
				operation: ['createWithdraw'],
			},
		},
		description: 'Currency symbol (e.g., btc, eth, usdt)',
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['createWithdraw'],
			},
		},
		description: 'Withdrawal address',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		required: true,
		typeOptions: {
			numberPrecision: 8,
		},
		default: 0,
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['createWithdraw'],
			},
		},
		description: 'Amount to withdraw',
	},
	{
		displayName: 'Fee',
		name: 'fee',
		type: 'number',
		required: true,
		typeOptions: {
			numberPrecision: 8,
		},
		default: 0,
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['createWithdraw'],
			},
		},
		description: 'Withdrawal fee',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['createWithdraw'],
			},
		},
		options: [
			{
				displayName: 'Chain',
				name: 'chain',
				type: 'string',
				default: '',
				description: 'Blockchain network (e.g., eth, bsc, trc20usdt)',
			},
			{
				displayName: 'Address Tag',
				name: 'addrTag',
				type: 'string',
				default: '',
				description: 'Address tag/memo (required for some currencies like XRP, EOS)',
			},
			{
				displayName: 'Client Order ID',
				name: 'clientOrderId',
				type: 'string',
				default: '',
				description: 'Custom order ID',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const currency = this.getNodeParameter('currency', index) as string;
	const address = this.getNodeParameter('address', index) as string;
	const amount = this.getNodeParameter('amount', index) as number;
	const fee = this.getNodeParameter('fee', index) as number;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		currency: currency.toLowerCase(),
		address,
		amount: amount.toString(),
		fee: fee.toString(),
	};

	if (additionalFields.chain) {
		body.chain = additionalFields.chain;
	}

	if (additionalFields.addrTag) {
		body['addr-tag'] = additionalFields.addrTag;
	}

	if (additionalFields.clientOrderId) {
		body['client-order-id'] = additionalFields.clientOrderId;
	}

	const response = await htxSpotApiRequest.call(
		this,
		'POST',
		'/v1/dw/withdraw/api/create',
		cleanObject(body),
	);

	return buildExecutionData(response, index);
}
