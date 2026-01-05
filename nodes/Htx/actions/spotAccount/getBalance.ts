/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { htxSpotApiRequest } from '../../transport/htxClient';
import { buildExecutionData, flattenAccountBalance } from '../../utils/helpers';
import type { IDataObject } from 'n8n-workflow';

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
				operation: ['getBalance'],
			},
		},
		description: 'The ID of the account to get balance for',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const accountId = this.getNodeParameter('accountId', index) as string;

	const response = await htxSpotApiRequest.call(
		this,
		'GET',
		`/v1/account/accounts/${accountId}/balance`,
	);

	// Flatten the balance data for easier use
	const flattenedResponse = flattenAccountBalance(response as IDataObject);

	return buildExecutionData(flattenedResponse, index);
}
