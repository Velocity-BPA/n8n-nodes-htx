/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxFuturesApiRequest } from '../../transport/htxClient';
import { buildExecutionData, cleanObject } from '../../utils/helpers';
import { FUTURES_CONTRACT_TYPES } from '../../constants/constants';

export const description: INodeProperties[] = [
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		required: true,
		default: 'BTC',
		displayOptions: {
			show: {
				resource: ['futuresAccount'],
				operation: ['getPositionInfo'],
			},
		},
		description: 'Underlying asset symbol (e.g., BTC, ETH)',
	},
	{
		displayName: 'Contract Type',
		name: 'contractType',
		type: 'options',
		options: FUTURES_CONTRACT_TYPES,
		required: true,
		default: 'quarter',
		displayOptions: {
			show: {
				resource: ['futuresAccount'],
				operation: ['getPositionInfo'],
			},
		},
		description: 'Contract type (this_week, next_week, quarter, next_quarter)',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const symbol = this.getNodeParameter('symbol', index) as string;
	const contractType = this.getNodeParameter('contractType', index) as string;

	const body: IDataObject = {
		symbol: symbol.toUpperCase(),
		contract_type: contractType,
	};

	const response = await htxFuturesApiRequest.call(
		this,
		'POST',
		'/api/v1/contract_position_info',
		cleanObject(body),
	);

	return buildExecutionData(response, index);
}
