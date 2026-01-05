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
		displayName: 'Withdraw ID',
		name: 'withdrawId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['cancelWithdraw'],
			},
		},
		description: 'Withdrawal request ID to cancel',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const withdrawId = this.getNodeParameter('withdrawId', index) as string;

	const response = await htxSpotApiRequest.call(
		this,
		'POST',
		`/v1/dw/withdraw-virtual/${withdrawId}/cancel`,
	);

	return buildExecutionData(response, index);
}
