/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { htxPublicApiRequest } from '../../transport/htxClient';
import { buildExecutionData } from '../../utils/helpers';

export const description: INodeProperties[] = [
	{
		displayName: 'Notice',
		name: 'notice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getSymbols'],
			},
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-description-unneeded-backticks
		description: 'Retrieves all trading symbols (pairs) available on HTX',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const response = await htxPublicApiRequest.call(
		this,
		'GET',
		'/v2/settings/common/symbols',
	);

	return buildExecutionData(response, index);
}
