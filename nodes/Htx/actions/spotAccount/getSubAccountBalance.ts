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
		displayName: 'Sub-User ID',
		name: 'subUserId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spotAccount'],
				operation: ['getSubAccountBalance'],
			},
		},
		description: 'The ID of the sub-user to get balance for',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const subUserId = this.getNodeParameter('subUserId', index) as string;

	const response = await htxSpotApiRequest.call(
		this,
		'GET',
		`/v1/account/accounts/${subUserId}`,
	);

	return buildExecutionData(response, index);
}
