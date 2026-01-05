/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxFuturesApiRequest } from '../../transport/htxClient';
import { buildExecutionData } from '../../utils/helpers';
import { FUTURES_LEVERAGE_RATES } from '../../constants/constants';

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
				operation: ['setLeverage'],
			},
		},
		description: 'Underlying asset symbol (e.g., BTC, ETH)',
	},
	{
		displayName: 'Leverage Rate',
		name: 'leverageRate',
		type: 'options',
		options: FUTURES_LEVERAGE_RATES,
		required: true,
		default: 10,
		displayOptions: {
			show: {
				resource: ['futuresAccount'],
				operation: ['setLeverage'],
			},
		},
		description: 'Leverage rate (1-125x depending on contract)',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const symbol = this.getNodeParameter('symbol', index) as string;
	const leverageRate = this.getNodeParameter('leverageRate', index) as number;

	const body: IDataObject = {
		symbol: symbol.toUpperCase(),
		lever_rate: leverageRate,
	};

	const response = await htxFuturesApiRequest.call(
		this,
		'POST',
		'/api/v1/contract_switch_lever_rate',
		body,
	);

	return buildExecutionData(response, index);
}
