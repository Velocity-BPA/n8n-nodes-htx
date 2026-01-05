/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxSpotApiRequest } from '../../transport/htxClient';
import { buildExecutionData, cleanObject, normalizeSymbol } from '../../utils/helpers';
import { ACCOUNT_TYPES } from '../../constants/constants';

export const description: INodeProperties[] = [
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['cancelAllOrders'],
			},
		},
		description: 'Trading account ID',
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
				operation: ['cancelAllOrders'],
			},
		},
		options: [
			{
				displayName: 'Symbol',
				name: 'symbol',
				type: 'string',
				default: '',
				description: 'Filter by trading pair symbol',
			},
			{
				displayName: 'Account Type',
				name: 'accountType',
				type: 'options',
				options: ACCOUNT_TYPES,
				default: 'spot',
				description: 'Account type filter',
			},
			{
				displayName: 'Side',
				name: 'side',
				type: 'options',
				options: [
					{ name: 'Buy', value: 'buy' },
					{ name: 'Sell', value: 'sell' },
				],
				default: '',
				description: 'Filter by order side',
			},
			{
				displayName: 'Order Size',
				name: 'size',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 100,
				description: 'Maximum number of orders to cancel (1-100)',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const accountId = this.getNodeParameter('accountId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		'account-id': accountId,
	};

	if (additionalFields.symbol) {
		body.symbol = normalizeSymbol(additionalFields.symbol as string);
	}

	if (additionalFields.accountType) {
		body.types = additionalFields.accountType;
	}

	if (additionalFields.side) {
		body.side = additionalFields.side;
	}

	if (additionalFields.size) {
		body.size = additionalFields.size;
	}

	const response = await htxSpotApiRequest.call(
		this,
		'POST',
		'/v1/order/orders/batchCancelOpenOrders',
		cleanObject(body),
	);

	return buildExecutionData(response, index);
}
