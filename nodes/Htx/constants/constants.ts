/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodePropertyOptions } from 'n8n-workflow';

export const SPOT_API_HOSTS = {
	global: 'api.huobi.pro',
	aws: 'api-aws.huobi.pro',
} as const;

export const FUTURES_API_HOST = 'api.hbdm.com';

export const ORDER_TYPES: INodePropertyOptions[] = [
	{ name: 'Buy Limit', value: 'buy-limit' },
	{ name: 'Sell Limit', value: 'sell-limit' },
	{ name: 'Buy Market', value: 'buy-market' },
	{ name: 'Sell Market', value: 'sell-market' },
	{ name: 'Buy IOC', value: 'buy-ioc' },
	{ name: 'Sell IOC', value: 'sell-ioc' },
	{ name: 'Buy Limit Maker', value: 'buy-limit-maker' },
	{ name: 'Sell Limit Maker', value: 'sell-limit-maker' },
	{ name: 'Buy Stop Limit', value: 'buy-stop-limit' },
	{ name: 'Sell Stop Limit', value: 'sell-stop-limit' },
	{ name: 'Buy Limit FOK', value: 'buy-limit-fok' },
	{ name: 'Sell Limit FOK', value: 'sell-limit-fok' },
];

export const ORDER_STATES: INodePropertyOptions[] = [
	{ name: 'Submitted', value: 'submitted' },
	{ name: 'Partial Filled', value: 'partial-filled' },
	{ name: 'Partial Canceled', value: 'partial-canceled' },
	{ name: 'Filled', value: 'filled' },
	{ name: 'Canceled', value: 'canceled' },
	{ name: 'Created', value: 'created' },
];

export const ORDER_SOURCES: INodePropertyOptions[] = [
	{ name: 'Spot API', value: 'spot-api' },
	{ name: 'Margin API', value: 'margin-api' },
	{ name: 'Super Margin API', value: 'super-margin-api' },
	{ name: 'C2C Margin API', value: 'c2c-margin-api' },
];

export const KLINE_PERIODS: INodePropertyOptions[] = [
	{ name: '1 Minute', value: '1min' },
	{ name: '5 Minutes', value: '5min' },
	{ name: '15 Minutes', value: '15min' },
	{ name: '30 Minutes', value: '30min' },
	{ name: '60 Minutes', value: '60min' },
	{ name: '4 Hours', value: '4hour' },
	{ name: '1 Day', value: '1day' },
	{ name: '1 Week', value: '1week' },
	{ name: '1 Month', value: '1mon' },
	{ name: '1 Year', value: '1year' },
];

export const DEPTH_LEVELS: INodePropertyOptions[] = [
	{ name: '5 Levels', value: 'step0' },
	{ name: '10 Levels', value: 'step1' },
	{ name: '20 Levels', value: 'step2' },
	{ name: '20 Levels (Aggregated)', value: 'step3' },
	{ name: '20 Levels (More Aggregated)', value: 'step4' },
	{ name: '20 Levels (Most Aggregated)', value: 'step5' },
];

export const TRANSACT_TYPES: INodePropertyOptions[] = [
	{ name: 'Trade', value: 'trade' },
	{ name: 'ETF', value: 'etf' },
	{ name: 'Transfer In', value: 'transact-fee' },
	{ name: 'Transfer Out', value: 'fee-deduction' },
	{ name: 'Deposit', value: 'deposit' },
	{ name: 'Withdraw', value: 'withdraw' },
	{ name: 'Rebate', value: 'rebate' },
	{ name: 'Interest', value: 'interest' },
	{ name: 'Liquidation', value: 'liquidation' },
];

export const ACCOUNT_TYPES: INodePropertyOptions[] = [
	{ name: 'Spot', value: 'spot' },
	{ name: 'Margin', value: 'margin' },
	{ name: 'Super Margin', value: 'super-margin' },
	{ name: 'Point', value: 'point' },
	{ name: 'Minepool', value: 'minepool' },
	{ name: 'ETF', value: 'etf' },
];

export const FUTURES_CONTRACT_TYPES: INodePropertyOptions[] = [
	{ name: 'This Week', value: 'this_week' },
	{ name: 'Next Week', value: 'next_week' },
	{ name: 'Quarter', value: 'quarter' },
	{ name: 'Next Quarter', value: 'next_quarter' },
];

export const FUTURES_ORDER_PRICE_TYPES: INodePropertyOptions[] = [
	{ name: 'Limit', value: 'limit' },
	{ name: 'Opponent (Best)', value: 'opponent' },
	{ name: 'Lightning', value: 'lightning' },
	{ name: 'Optimal 5', value: 'optimal_5' },
	{ name: 'Optimal 10', value: 'optimal_10' },
	{ name: 'Optimal 20', value: 'optimal_20' },
	{ name: 'Fill or Kill', value: 'fok' },
	{ name: 'Immediate or Cancel', value: 'ioc' },
];

export const FUTURES_DIRECTIONS: INodePropertyOptions[] = [
	{ name: 'Buy', value: 'buy' },
	{ name: 'Sell', value: 'sell' },
];

export const FUTURES_OFFSETS: INodePropertyOptions[] = [
	{ name: 'Open', value: 'open' },
	{ name: 'Close', value: 'close' },
];

export const FUTURES_LEVERAGE_RATES: INodePropertyOptions[] = [
	{ name: '1x', value: 1 },
	{ name: '2x', value: 2 },
	{ name: '3x', value: 3 },
	{ name: '5x', value: 5 },
	{ name: '10x', value: 10 },
	{ name: '20x', value: 20 },
	{ name: '30x', value: 30 },
	{ name: '50x', value: 50 },
	{ name: '75x', value: 75 },
	{ name: '100x', value: 100 },
	{ name: '125x', value: 125 },
];

export const WITHDRAWAL_STATES: INodePropertyOptions[] = [
	{ name: 'Verifying', value: 'verifying' },
	{ name: 'Failed', value: 'failed' },
	{ name: 'Submitted', value: 'submitted' },
	{ name: 'Reexamine', value: 'reexamine' },
	{ name: 'Canceled', value: 'canceled' },
	{ name: 'Pass', value: 'pass' },
	{ name: 'Reject', value: 'reject' },
	{ name: 'Pre Transfer', value: 'pre-transfer' },
	{ name: 'Wallet Transfer', value: 'wallet-transfer' },
	{ name: 'Wallet Reject', value: 'wallet-reject' },
	{ name: 'Confirmed', value: 'confirmed' },
	{ name: 'Confirm Error', value: 'confirm-error' },
	{ name: 'Repealed', value: 'repealed' },
];

export const DEPOSIT_STATES: INodePropertyOptions[] = [
	{ name: 'Unknown', value: 'unknown' },
	{ name: 'Confirming', value: 'confirming' },
	{ name: 'Confirmed', value: 'confirmed' },
	{ name: 'Safe', value: 'safe' },
	{ name: 'Orphan', value: 'orphan' },
];

export const TRANSFER_TYPES: INodePropertyOptions[] = [
	{ name: 'Spot to Futures', value: 'spot-to-futures' },
	{ name: 'Futures to Spot', value: 'futures-to-spot' },
	{ name: 'Spot to Margin', value: 'spot-to-margin' },
	{ name: 'Margin to Spot', value: 'margin-to-spot' },
];

export const COMMON_CURRENCIES: INodePropertyOptions[] = [
	{ name: 'Bitcoin (BTC)', value: 'btc' },
	{ name: 'Ethereum (ETH)', value: 'eth' },
	{ name: 'Tether (USDT)', value: 'usdt' },
	{ name: 'USD Coin (USDC)', value: 'usdc' },
	{ name: 'BNB', value: 'bnb' },
	{ name: 'XRP', value: 'xrp' },
	{ name: 'Solana (SOL)', value: 'sol' },
	{ name: 'Cardano (ADA)', value: 'ada' },
	{ name: 'Dogecoin (DOGE)', value: 'doge' },
	{ name: 'Polygon (MATIC)', value: 'matic' },
	{ name: 'Litecoin (LTC)', value: 'ltc' },
	{ name: 'Polkadot (DOT)', value: 'dot' },
	{ name: 'Avalanche (AVAX)', value: 'avax' },
	{ name: 'Chainlink (LINK)', value: 'link' },
	{ name: 'Tron (TRX)', value: 'trx' },
];

export const COMMON_SYMBOLS: INodePropertyOptions[] = [
	{ name: 'BTC/USDT', value: 'btcusdt' },
	{ name: 'ETH/USDT', value: 'ethusdt' },
	{ name: 'ETH/BTC', value: 'ethbtc' },
	{ name: 'XRP/USDT', value: 'xrpusdt' },
	{ name: 'SOL/USDT', value: 'solusdt' },
	{ name: 'ADA/USDT', value: 'adausdt' },
	{ name: 'DOGE/USDT', value: 'dogeusdt' },
	{ name: 'MATIC/USDT', value: 'maticusdt' },
	{ name: 'DOT/USDT', value: 'dotusdt' },
	{ name: 'LTC/USDT', value: 'ltcusdt' },
	{ name: 'AVAX/USDT', value: 'avaxusdt' },
	{ name: 'LINK/USDT', value: 'linkusdt' },
	{ name: 'TRX/USDT', value: 'trxusdt' },
	{ name: 'BNB/USDT', value: 'bnbusdt' },
	{ name: 'UNI/USDT', value: 'uniusdt' },
];

export const FUTURES_COMMON_CONTRACTS: INodePropertyOptions[] = [
	{ name: 'BTC-USD', value: 'BTC-USD' },
	{ name: 'ETH-USD', value: 'ETH-USD' },
	{ name: 'BTC-USDT', value: 'BTC-USDT' },
	{ name: 'ETH-USDT', value: 'ETH-USDT' },
	{ name: 'XRP-USD', value: 'XRP-USD' },
	{ name: 'LTC-USD', value: 'LTC-USD' },
	{ name: 'EOS-USD', value: 'EOS-USD' },
	{ name: 'BCH-USD', value: 'BCH-USD' },
	{ name: 'TRX-USD', value: 'TRX-USD' },
	{ name: 'LINK-USD', value: 'LINK-USD' },
];

export const ERROR_CODES: Record<string, string> = {
	'base-symbol-error': 'Invalid trading symbol',
	'base-currency-error': 'Invalid currency',
	'account-frozen-balance-insufficient-error': 'Insufficient frozen balance',
	'account-transfer-balance-insufficient-error': 'Insufficient transfer balance',
	'order-limitorder-price-error': 'Limit order price is out of range',
	'order-value-min-error': 'Order value is below minimum',
	'order-orderprice-precision-error': 'Order price precision error',
	'order-orderamount-precision-error': 'Order amount precision error',
	'invalid-signature': 'Invalid API signature',
	'api-signature-not-valid': 'API signature validation failed',
	'gateway-internal-error': 'Gateway internal error, please try again',
	'account-not-exist': 'Account does not exist',
	'order-not-exist': 'Order does not exist',
	'order-state-error': 'Order state does not allow this operation',
	'api-not-support-temp-addr': 'API does not support temporary addresses',
	'dw-withdraw-min-limit': 'Withdrawal amount is below minimum',
	'dw-withdraw-max-limit': 'Withdrawal amount exceeds maximum',
	'dw-insufficient-balance': 'Insufficient balance for withdrawal',
};

export const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;
