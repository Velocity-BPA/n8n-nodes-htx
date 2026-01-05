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
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spotAccount'],
				operation: ['getAccountLedger'],
			},
		},
		description: 'The ID of the account to get ledger for',
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
				operation: ['getAccountLedger'],
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
				type: 'string',
				default: '',
				description: 'Filter by transaction types (comma-separated)',
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
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 500,
				},
				default: 100,
				description: 'Max number of records to return (1-500)',
			},
			{
				displayName: 'From ID',
				name: 'fromId',
				type: 'string',
				default: '',
				description: 'Start record ID for pagination',
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
		accountId,
	};

	if (additionalFields.currency) {
		query.currency = (additionalFields.currency as string).toLowerCase();
	}

	if (additionalFields.transactTypes) {
		query.transactTypes = additionalFields.transactTypes;
	}

	if (additionalFields.startTime) {
		query.startTime = new Date(additionalFields.startTime as string).getTime();
	}

	if (additionalFields.endTime) {
		query.endTime = new Date(additionalFields.endTime as string).getTime();
	}

	if (additionalFields.sort) {
		query.sort = additionalFields.sort;
	}

	if (additionalFields.limit) {
		query.limit = additionalFields.limit;
	}

	if (additionalFields.fromId) {
		query.fromId = additionalFields.fromId;
	}

	const response = await htxSpotApiRequest.call(
		this,
		'GET',
		'/v2/account/ledger',
		{},
		cleanObject(query),
	);

	return buildExecutionData(response, index);
}
