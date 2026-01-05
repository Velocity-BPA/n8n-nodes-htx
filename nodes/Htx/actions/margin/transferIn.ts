/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxSpotApiRequest } from '../../transport/htxClient';
import { buildExecutionData, normalizeSymbol, normalizeCurrency } from '../../utils/helpers';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['margin'],
			},
		},
		options: [
			{
				name: 'Transfer In',
				value: 'transferIn',
				description: 'Transfer assets to margin account',
				action: 'Transfer in',
			},
			{
				name: 'Transfer Out',
				value: 'transferOut',
				description: 'Transfer assets from margin account',
				action: 'Transfer out',
			},
			{
				name: 'Apply Loan',
				value: 'applyLoan',
				description: 'Apply for a margin loan',
				action: 'Apply loan',
			},
			{
				name: 'Repay Loan',
				value: 'repayLoan',
				description: 'Repay a margin loan',
				action: 'Repay loan',
			},
			{
				name: 'Get Loan Orders',
				value: 'getLoanOrders',
				description: 'Get loan order history',
				action: 'Get loan orders',
			},
			{
				name: 'Get Margin Balance',
				value: 'getMarginBalance',
				description: 'Get margin account balance',
				action: 'Get margin balance',
			},
			{
				name: 'Get Repayment Reference',
				value: 'getRepaymentReference',
				description: 'Get repayment reference information',
				action: 'Get repayment reference',
			},
		],
		default: 'transferIn',
	},
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		required: true,
		default: 'btcusdt',
		displayOptions: {
			show: {
				resource: ['margin'],
				operation: ['transferIn'],
			},
		},
		description: 'Trading pair symbol (e.g., btcusdt)',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		default: 'usdt',
		displayOptions: {
			show: {
				resource: ['margin'],
				operation: ['transferIn'],
			},
		},
		description: 'Currency to transfer (e.g., btc, usdt)',
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
				operation: ['transferIn'],
			},
		},
		description: 'Amount to transfer',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const symbol = this.getNodeParameter('symbol', index) as string;
	const currency = this.getNodeParameter('currency', index) as string;
	const amount = this.getNodeParameter('amount', index) as string;

	const body: IDataObject = {
		symbol: normalizeSymbol(symbol),
		currency: normalizeCurrency(currency),
		amount,
	};

	const response = await htxSpotApiRequest.call(
		this,
		'POST',
		'/v1/dw/transfer-in/margin',
		body,
	);

	return buildExecutionData({ transferId: response }, index);
}
