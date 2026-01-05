/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxFuturesApiRequest } from '../../transport/htxClient';
import { buildExecutionData, cleanObject } from '../../utils/helpers';

export const description: INodeProperties[] = [
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		required: true,
		default: 'BTC',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['getMatchResults'],
			},
		},
		description: 'Underlying asset symbol (e.g., BTC, ETH)',
	},
	{
		displayName: 'Trade Type',
		name: 'tradeType',
		type: 'options',
		required: true,
		options: [
			{ name: 'All', value: '0' },
			{ name: 'Open Long', value: '1' },
			{ name: 'Open Short', value: '2' },
			{ name: 'Close Long', value: '3' },
			{ name: 'Close Short', value: '4' },
			{ name: 'Liquidation Long', value: '5' },
			{ name: 'Liquidation Short', value: '6' },
		],
		default: '0',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['getMatchResults'],
			},
		},
		description: 'Trade type filter',
	},
	{
		displayName: 'Create Date',
		name: 'createDate',
		type: 'number',
		required: true,
		typeOptions: {
			minValue: 1,
			maxValue: 90,
		},
		default: 7,
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['getMatchResults'],
			},
		},
		description: 'Number of days to query (max 90)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['getMatchResults'],
			},
		},
		options: [
			{
				displayName: 'Contract Code',
				name: 'contractCode',
				type: 'string',
				default: '',
				description: 'Contract code (e.g., BTC-USD)',
			},
			{
				displayName: 'Page Index',
				name: 'pageIndex',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Page number',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 50,
				},
				default: 20,
				description: 'Records per page (max 50)',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const symbol = this.getNodeParameter('symbol', index) as string;
	const tradeType = this.getNodeParameter('tradeType', index) as string;
	const createDate = this.getNodeParameter('createDate', index) as number;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		symbol: symbol.toUpperCase(),
		trade_type: tradeType,
		create_date: createDate,
	};

	if (additionalFields.contractCode) {
		body.contract_code = additionalFields.contractCode;
	}

	if (additionalFields.pageIndex) {
		body.page_index = additionalFields.pageIndex;
	}

	if (additionalFields.pageSize) {
		body.page_size = additionalFields.pageSize;
	}

	const response = await htxFuturesApiRequest.call(
		this,
		'POST',
		'/api/v1/contract_matchresults',
		cleanObject(body),
	);

	return buildExecutionData(response, index);
}
