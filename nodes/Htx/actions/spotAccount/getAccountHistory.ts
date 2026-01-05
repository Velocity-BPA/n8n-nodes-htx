/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxSpotApiRequest } from '../../transport/htxClient';
import { buildExecutionData, cleanObject } from '../../utils/helpers';
import { TRANSACT_TYPES } from '../../constants/constants';

export const description: INodeProperties[] = [
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spotAccount'],
				operation: ['getAccountHistory'],
			},
		},
		description: 'The ID of the account to get history for',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['spotAccount'],
				operation: ['getAccountHistory'],
			},
		},
		options: [
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				description: 'Filter by currency (e.g., btc, eth, usdt)',
			},
			{
				displayName: 'Transaction Types',
				name: 'transactTypes',
				type: 'multiOptions',
				options: TRANSACT_TYPES,
				default: [],
				description: 'Filter by transaction type',
			},
			{
				displayName: 'Start Time',
				name: 'startTime',
				type: 'dateTime',
				default: '',
				description: 'Filter records after this time',
			},
			{
				displayName: 'End Time',
				name: 'endTime',
				type: 'dateTime',
				default: '',
				description: 'Filter records before this time',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				default: 'desc',
				description: 'Sort order for results',
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
				description: 'Max number of records to return (1-500)',
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

	const query: IDataObject = {
		'account-id': accountId,
	};

	if (additionalFields.currency) {
		query.currency = (additionalFields.currency as string).toLowerCase();
	}

	if (additionalFields.transactTypes && (additionalFields.transactTypes as string[]).length > 0) {
		query['transact-types'] = (additionalFields.transactTypes as string[]).join(',');
	}

	if (additionalFields.startTime) {
		query['start-time'] = new Date(additionalFields.startTime as string).getTime();
	}

	if (additionalFields.endTime) {
		query['end-time'] = new Date(additionalFields.endTime as string).getTime();
	}

	if (additionalFields.sort) {
		query.sort = additionalFields.sort;
	}

	if (additionalFields.size) {
		query.size = additionalFields.size;
	}

	const response = await htxSpotApiRequest.call(
		this,
		'GET',
		'/v1/account/history',
		{},
		cleanObject(query),
	);

	return buildExecutionData(response, index);
}
