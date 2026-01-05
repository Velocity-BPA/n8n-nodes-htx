/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { htxSpotApiRequest } from '../../transport/htxClient';
import { buildExecutionData, cleanObject, normalizeSymbol } from '../../utils/helpers';

export const description: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['margin'],
				operation: ['getMarginBalance'],
			},
		},
		options: [
			{
				displayName: 'Symbol',
				name: 'symbol',
				type: 'string',
				default: '',
				description: 'Filter by trading pair symbol (e.g., btcusdt)',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const query: IDataObject = {};

	if (additionalFields.symbol) {
		query.symbol = normalizeSymbol(additionalFields.symbol as string);
	}

	const response = await htxSpotApiRequest.call(
		this,
		'GET',
		'/v1/margin/accounts/balance',
		{},
		cleanObject(query),
	);

	return buildExecutionData(response, index);
}
