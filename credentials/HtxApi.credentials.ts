/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HtxApi implements ICredentialType {
	name = 'htxApi';
	displayName = 'HTX (Huobi) API';
	documentationUrl = 'https://huobiapi.github.io/docs/spot/v1/en/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'accessKey',
			type: 'string',
			default: '',
			required: true,
			description: 'Your HTX API Key (Access Key)',
		},
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your HTX Secret Key',
		},
		{
			displayName: 'API Region',
			name: 'baseUrl',
			type: 'options',
			options: [
				{
					name: 'Global (api.huobi.pro)',
					value: 'global',
				},
				{
					name: 'AWS (api-aws.huobi.pro)',
					value: 'aws',
				},
			],
			default: 'global',
			description: 'The API region to use for requests',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl === "aws" ? "https://api-aws.huobi.pro" : "https://api.huobi.pro"}}',
			url: '/v1/account/accounts',
			method: 'GET',
		},
	};
}
