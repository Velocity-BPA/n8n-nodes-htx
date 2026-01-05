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
		displayName: 'Loan Order ID',
		name: 'loanOrderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['margin'],
				operation: ['repayLoan'],
			},
		},
		description: 'The ID of the loan order to repay',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['margin'],
				operation: ['repayLoan'],
			},
		},
		description: 'Amount to repay',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const loanOrderId = this.getNodeParameter('loanOrderId', index) as string;
	const amount = this.getNodeParameter('amount', index) as string;

	const body: IDataObject = {
		amount,
	};

	const response = await htxSpotApiRequest.call(
		this,
		'POST',
		`/v1/margin/orders/${loanOrderId}/repay`,
		body,
	);

	return buildExecutionData({ repaymentId: response }, index);
}
