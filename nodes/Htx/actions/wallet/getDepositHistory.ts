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
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['getDepositHistory'],
			},
		},
		options: [
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				description: 'Filter by currency symbol',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Deposit', value: 'deposit' },
					{ name: 'Withdraw', value: 'withdraw' },
				],
				default: 'deposit',
				description: 'Record type',
			},
			{
				displayName: 'From',
				name: 'from',
				type: 'string',
				default: '',
				description: 'Query start ID',
			},
			{
				displayName: 'Size',
				name: 'size',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 500,
				},
				default: 100,
				description: 'Records per page (max 500)',
			},
			{
				displayName: 'Direct',
				name: 'direct',
				type: 'options',
				options: [
					{ name: 'Next', value: 'next' },
					{ name: 'Previous', value: 'prev' },
				],
				default: 'next',
				description: 'Query direction',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const query: IDataObject = {
		type: 'deposit',
	};

	if (additionalFields.currency) {
		query.currency = (additionalFields.currency as string).toLowerCase();
	}

	if (additionalFields.type) {
		query.type = additionalFields.type;
	}

	if (additionalFields.from) {
		query.from = additionalFields.from;
	}

	if (additionalFields.size) {
		query.size = additionalFields.size;
	}

	if (additionalFields.direct) {
		query.direct = additionalFields.direct;
	}

	const response = await htxSpotApiRequest.call(
		this,
		'GET',
		'/v1/query/deposit-withdraw',
		{},
		cleanObject(query),
	);

	return buildExecutionData(response, index);
}
