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
				operation: ['cancelTriggerOrder'],
			},
		},
		description: 'Underlying asset symbol (e.g., BTC, ETH)',
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
				operation: ['cancelTriggerOrder'],
			},
		},
		description: 'Trigger order ID to cancel (can be multiple IDs separated by commas, max 10)',
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
				operation: ['cancelTriggerOrder'],
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
				displayName: 'Contract Type',
				name: 'contractType',
				type: 'options',
				options: [
					{ name: 'This Week', value: 'this_week' },
					{ name: 'Next Week', value: 'next_week' },
					{ name: 'Quarter', value: 'quarter' },
					{ name: 'Next Quarter', value: 'next_quarter' },
				],
				default: 'quarter',
				description: 'Contract type',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const symbol = this.getNodeParameter('symbol', index) as string;
	const orderId = this.getNodeParameter('orderId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		symbol: symbol.toUpperCase(),
		order_id: orderId,
	};

	if (additionalFields.contractCode) {
		body.contract_code = additionalFields.contractCode;
	}

	if (additionalFields.contractType) {
		body.contract_type = additionalFields.contractType;
	}

	const response = await htxFuturesApiRequest.call(
		this,
		'POST',
		'/api/v1/contract_trigger_cancel',
		cleanObject(body),
	);

	return buildExecutionData(response, index);
}
