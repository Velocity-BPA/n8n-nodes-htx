/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxFuturesApiRequest } from '../../transport/htxClient';
import { buildExecutionData } from '../../utils/helpers';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['futuresAccount'],
			},
		},
		options: [
			{
				name: 'Get Account Info',
				value: 'getAccountInfo',
				description: 'Get futures account information',
				action: 'Get account info',
			},
			{
				name: 'Get Positions',
				value: 'getPositions',
				description: 'Get all positions',
				action: 'Get positions',
			},
			{
				name: 'Get Position Info',
				value: 'getPositionInfo',
				description: 'Get specific position information',
				action: 'Get position info',
			},
			{
				name: 'Set Leverage',
				value: 'setLeverage',
				description: 'Set leverage for a contract',
				action: 'Set leverage',
			},
			{
				name: 'Get Account Records',
				value: 'getAccountRecords',
				description: 'Get account transaction records',
				action: 'Get account records',
			},
			{
				name: 'Get Settlement Records',
				value: 'getSettlementRecords',
				description: 'Get settlement history',
				action: 'Get settlement records',
			},
		],
		default: 'getAccountInfo',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['futuresAccount'],
				operation: ['getAccountInfo'],
			},
		},
		options: [
			{
				displayName: 'Symbol',
				name: 'symbol',
				type: 'string',
				default: '',
				description: 'Filter by underlying asset symbol (e.g., BTC, ETH)',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {};

	if (additionalFields.symbol) {
		body.symbol = (additionalFields.symbol as string).toUpperCase();
	}

	const response = await htxFuturesApiRequest.call(
		this,
		'POST',
		'/api/v1/contract_account_info',
		body,
	);

	return buildExecutionData(response, index);
}
