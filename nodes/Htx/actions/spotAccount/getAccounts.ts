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
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['spotAccount'],
			},
		},
		options: [
			{
				name: 'Get Accounts',
				value: 'getAccounts',
				description: 'Get all accounts for the current user',
				action: 'Get accounts',
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get the balance of a specific account',
				action: 'Get balance',
			},
			{
				name: 'Get Account History',
				value: 'getAccountHistory',
				description: 'Get account history records',
				action: 'Get account history',
			},
			{
				name: 'Get Account Ledger',
				value: 'getAccountLedger',
				description: 'Get account ledger entries',
				action: 'Get account ledger',
			},
			{
				name: 'Transfer',
				value: 'transfer',
				description: 'Transfer assets between accounts',
				action: 'Transfer',
			},
			{
				name: 'Get Sub-Accounts',
				value: 'getSubAccounts',
				description: 'Get list of sub-accounts',
				action: 'Get sub accounts',
			},
			{
				name: 'Get Sub-Account Balance',
				value: 'getSubAccountBalance',
				description: 'Get balance of a sub-account',
				action: 'Get sub account balance',
			},
		],
		default: 'getAccounts',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const response = await htxSpotApiRequest.call(this, 'GET', '/v1/account/accounts');
	return buildExecutionData(response, index);
}
