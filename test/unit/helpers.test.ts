/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	formatAmount,
	normalizeSymbol,
	normalizeCurrency,
	parseOrderType,
	parseOrderState,
	calculateFillPercentage,
	cleanObject,
	timestampToDate,
	dateToTimestamp,
	validateRequiredFields,
	delay,
	flattenAccountBalance,
} from '../../nodes/Htx/utils/helpers';

describe('HTX Helper Utilities', () => {
	describe('formatAmount', () => {
		it('should format amount with default precision', () => {
			const result = formatAmount(1.23456789);
			expect(result).toBe('1.23456789');
		});

		it('should format amount with specified precision', () => {
			const result = formatAmount(1.23456789, 4);
			expect(result).toBe('1.2346');
		});

		it('should handle zero', () => {
			const result = formatAmount(0);
			expect(result).toBe('0');
		});

		it('should handle string input', () => {
			const result = formatAmount('1.23456789' as any, 2);
			expect(result).toBe('1.23');
		});
	});

	describe('normalizeSymbol', () => {
		it('should convert symbol to lowercase', () => {
			expect(normalizeSymbol('BTCUSDT')).toBe('btcusdt');
		});

		it('should remove separators', () => {
			expect(normalizeSymbol('BTC/USDT')).toBe('btcusdt');
			expect(normalizeSymbol('BTC-USDT')).toBe('btcusdt');
			expect(normalizeSymbol('BTC_USDT')).toBe('btcusdt');
		});

		it('should handle already normalized symbols', () => {
			expect(normalizeSymbol('btcusdt')).toBe('btcusdt');
		});
	});

	describe('normalizeCurrency', () => {
		it('should convert currency to lowercase', () => {
			expect(normalizeCurrency('BTC')).toBe('btc');
		});

		it('should handle lowercase input', () => {
			expect(normalizeCurrency('eth')).toBe('eth');
		});

		it('should trim whitespace', () => {
			expect(normalizeCurrency(' USDT ')).toBe('usdt');
		});
	});

	describe('parseOrderType', () => {
		it('should parse buy-limit order type', () => {
			expect(parseOrderType('buy-limit')).toBe('Buy Limit');
		});

		it('should parse sell-market order type', () => {
			expect(parseOrderType('sell-market')).toBe('Sell Market');
		});

		it('should handle unknown types', () => {
			expect(parseOrderType('unknown-type')).toBe('Unknown Type');
		});
	});

	describe('parseOrderState', () => {
		it('should parse submitted state', () => {
			expect(parseOrderState('submitted')).toBe('Submitted');
		});

		it('should parse partial-filled state', () => {
			expect(parseOrderState('partial-filled')).toBe('Partial Filled');
		});

		it('should parse filled state', () => {
			expect(parseOrderState('filled')).toBe('Filled');
		});

		it('should parse canceled state', () => {
			expect(parseOrderState('canceled')).toBe('Canceled');
		});
	});

	describe('calculateFillPercentage', () => {
		it('should calculate fill percentage correctly', () => {
			expect(calculateFillPercentage(50, 100)).toBe(50);
			expect(calculateFillPercentage(100, 100)).toBe(100);
			expect(calculateFillPercentage(25, 200)).toBe(12.5);
		});

		it('should handle zero total amount', () => {
			expect(calculateFillPercentage(50, 0)).toBe(0);
		});

		it('should handle string inputs', () => {
			expect(calculateFillPercentage('50' as any, '100' as any)).toBe(50);
		});
	});

	describe('cleanObject', () => {
		it('should remove undefined values', () => {
			const obj = { a: 1, b: undefined, c: 'test' };
			expect(cleanObject(obj)).toEqual({ a: 1, c: 'test' });
		});

		it('should remove null values', () => {
			const obj = { a: 1, b: null, c: 'test' };
			expect(cleanObject(obj)).toEqual({ a: 1, c: 'test' });
		});

		it('should remove empty strings', () => {
			const obj = { a: 1, b: '', c: 'test' };
			expect(cleanObject(obj)).toEqual({ a: 1, c: 'test' });
		});

		it('should keep zero and false values', () => {
			const obj = { a: 0, b: false, c: 'test' };
			expect(cleanObject(obj)).toEqual({ a: 0, b: false, c: 'test' });
		});
	});

	describe('timestampToDate', () => {
		it('should convert millisecond timestamp to ISO string', () => {
			const timestamp = 1704067200000; // 2024-01-01T00:00:00.000Z
			const result = timestampToDate(timestamp);
			expect(result).toBe('2024-01-01T00:00:00.000Z');
		});

		it('should handle string timestamp', () => {
			const timestamp = '1704067200000';
			const result = timestampToDate(timestamp);
			expect(result).toBe('2024-01-01T00:00:00.000Z');
		});
	});

	describe('dateToTimestamp', () => {
		it('should convert ISO string to millisecond timestamp', () => {
			const dateString = '2024-01-01T00:00:00.000Z';
			const result = dateToTimestamp(dateString);
			expect(result).toBe(1704067200000);
		});

		it('should handle Date object', () => {
			const date = new Date('2024-01-01T00:00:00.000Z');
			const result = dateToTimestamp(date);
			expect(result).toBe(1704067200000);
		});
	});

	describe('validateRequiredFields', () => {
		it('should not throw for valid data', () => {
			const data = { field1: 'value1', field2: 'value2' };
			expect(() => validateRequiredFields(data, ['field1', 'field2'])).not.toThrow();
		});

		it('should throw for missing fields', () => {
			const data = { field1: 'value1' };
			expect(() => validateRequiredFields(data, ['field1', 'field2'])).toThrow('Missing required field: field2');
		});

		it('should throw for empty string fields', () => {
			const data = { field1: '', field2: 'value2' };
			expect(() => validateRequiredFields(data, ['field1', 'field2'])).toThrow('Missing required field: field1');
		});
	});

	describe('delay', () => {
		it('should delay for specified milliseconds', async () => {
			const start = Date.now();
			await delay(100);
			const elapsed = Date.now() - start;
			expect(elapsed).toBeGreaterThanOrEqual(90);
			expect(elapsed).toBeLessThan(200);
		});
	});

	describe('flattenAccountBalance', () => {
		it('should flatten account balance data', () => {
			const accountData = {
				id: 12345,
				type: 'spot',
				list: [
					{ currency: 'btc', type: 'trade', balance: '1.5' },
					{ currency: 'btc', type: 'frozen', balance: '0.5' },
					{ currency: 'usdt', type: 'trade', balance: '1000' },
				],
			};

			const result = flattenAccountBalance(accountData as any);

			expect(result).toHaveProperty('accountId', 12345);
			expect(result).toHaveProperty('accountType', 'spot');
			expect(result.balances).toBeDefined();
			const balances = result.balances as any;
			expect(balances.btc).toBeDefined();
			expect(balances.btc.trade).toBe('1.5');
			expect(balances.btc.frozen).toBe('0.5');
			expect(balances.usdt.trade).toBe('1000');
		});
	});
});
