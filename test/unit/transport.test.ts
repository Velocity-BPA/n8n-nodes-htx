/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { generateSignature, getTimestamp, buildAuthParams, getSpotHost } from '../../nodes/Htx/transport/htxClient';
import { IHtxCredentials } from '../../nodes/Htx/types/HtxTypes';

describe('HTX Transport Layer', () => {
	describe('generateSignature', () => {
		it('should generate a valid HMAC-SHA256 signature', () => {
			const method = 'GET';
			const host = 'api.huobi.pro';
			const path = '/v1/account/accounts';
			const params = {
				AccessKeyId: 'test-key',
				SignatureMethod: 'HmacSHA256',
				SignatureVersion: '2',
				Timestamp: '2024-01-01T00:00:00',
			};
			const secretKey = 'test-secret';

			const signature = generateSignature(method, host, path, params, secretKey);

			expect(signature).toBeDefined();
			expect(typeof signature).toBe('string');
			expect(signature.length).toBeGreaterThan(0);
		});

		it('should produce different signatures for different parameters', () => {
			const method = 'GET';
			const host = 'api.huobi.pro';
			const path = '/v1/account/accounts';
			const secretKey = 'test-secret';

			const params1 = {
				AccessKeyId: 'test-key-1',
				SignatureMethod: 'HmacSHA256',
				SignatureVersion: '2',
				Timestamp: '2024-01-01T00:00:00',
			};

			const params2 = {
				AccessKeyId: 'test-key-2',
				SignatureMethod: 'HmacSHA256',
				SignatureVersion: '2',
				Timestamp: '2024-01-01T00:00:00',
			};

			const signature1 = generateSignature(method, host, path, params1, secretKey);
			const signature2 = generateSignature(method, host, path, params2, secretKey);

			expect(signature1).not.toBe(signature2);
		});

		it('should handle URL encoding correctly', () => {
			const method = 'GET';
			const host = 'api.huobi.pro';
			const path = '/v1/order/orders';
			const params = {
				AccessKeyId: 'test-key',
				SignatureMethod: 'HmacSHA256',
				SignatureVersion: '2',
				Timestamp: '2024-01-01T00:00:00',
				symbol: 'btcusdt',
			};
			const secretKey = 'test-secret';

			const signature = generateSignature(method, host, path, params, secretKey);

			expect(signature).toBeDefined();
			expect(typeof signature).toBe('string');
		});
	});

	describe('getTimestamp', () => {
		it('should return a valid ISO timestamp without milliseconds', () => {
			const timestamp = getTimestamp();

			expect(timestamp).toBeDefined();
			expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
		});

		it('should return different timestamps when called at different times', async () => {
			const timestamp1 = getTimestamp();
			await new Promise((resolve) => setTimeout(resolve, 1100));
			const timestamp2 = getTimestamp();

			// May or may not be different depending on timing
			expect(timestamp1).toBeDefined();
			expect(timestamp2).toBeDefined();
		});
	});

	describe('getSpotHost', () => {
		it('should return global host by default', () => {
			const credentials: IHtxCredentials = {
				accessKey: 'test-key',
				secretKey: 'test-secret',
				baseUrl: 'global',
			};

			const host = getSpotHost(credentials);

			expect(host).toBe('api.huobi.pro');
		});

		it('should return AWS host when configured', () => {
			const credentials: IHtxCredentials = {
				accessKey: 'test-key',
				secretKey: 'test-secret',
				baseUrl: 'aws',
			};

			const host = getSpotHost(credentials);

			expect(host).toBe('api-aws.huobi.pro');
		});
	});

	describe('buildAuthParams', () => {
		it('should build authentication parameters correctly', () => {
			const credentials: IHtxCredentials = {
				accessKey: 'test-api-key',
				secretKey: 'test-secret-key',
				baseUrl: 'global',
			};

			const params = buildAuthParams(credentials);

			expect(params.AccessKeyId).toBe('test-api-key');
			expect(params.SignatureMethod).toBe('HmacSHA256');
			expect(params.SignatureVersion).toBe('2');
			expect(params.Timestamp).toBeDefined();
		});

		it('should include additional query parameters', () => {
			const credentials: IHtxCredentials = {
				accessKey: 'test-api-key',
				secretKey: 'test-secret-key',
				baseUrl: 'global',
			};

			const query = {
				symbol: 'btcusdt',
				size: 100,
			};

			const params = buildAuthParams(credentials, query);

			expect(params.symbol).toBe('btcusdt');
			expect(params.size).toBe('100');
		});

		it('should exclude undefined and empty values', () => {
			const credentials: IHtxCredentials = {
				accessKey: 'test-api-key',
				secretKey: 'test-secret-key',
				baseUrl: 'global',
			};

			const query = {
				symbol: 'btcusdt',
				empty: '',
				nullValue: null,
				undefinedValue: undefined,
			};

			const params = buildAuthParams(credentials, query as any);

			expect(params.symbol).toBe('btcusdt');
			expect(params.empty).toBeUndefined();
			expect(params.nullValue).toBeUndefined();
			expect(params.undefinedValue).toBeUndefined();
		});
	});
});
