/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

// API Response Types
export interface IHtxResponse {
	status: string;
	data: IDataObject | IDataObject[];
	'err-code'?: string;
	'err-msg'?: string;
	ts?: number;
}

export interface IHtxFuturesResponse {
	status: string;
	data: IDataObject | IDataObject[];
	err_code?: number;
	err_msg?: string;
	ts?: number;
}

// Account Types
export interface IHtxAccount {
	id: number;
	type: string;
	subtype: string;
	state: string;
}

export interface IHtxBalance {
	currency: string;
	type: string;
	balance: string;
}

export interface IHtxAccountBalance {
	id: number;
	type: string;
	state: string;
	list: IHtxBalance[];
}

// Order Types
export interface IHtxOrder {
	id: number;
	symbol: string;
	'account-id': number;
	'client-order-id'?: string;
	amount: string;
	price?: string;
	'created-at': number;
	type: string;
	'field-amount': string;
	'field-cash-amount': string;
	'field-fees': string;
	'finished-at'?: number;
	source: string;
	state: string;
	'canceled-at'?: number;
}

export interface IHtxPlaceOrderParams {
	'account-id': string;
	symbol: string;
	type: string;
	amount: string;
	price?: string;
	source?: string;
	'client-order-id'?: string;
	'stop-price'?: string;
	operator?: string;
}

// Market Data Types
export interface IHtxSymbol {
	'base-currency': string;
	'quote-currency': string;
	'price-precision': number;
	'amount-precision': number;
	'symbol-partition': string;
	symbol: string;
	state: string;
	'value-precision': number;
	'min-order-amt': number;
	'max-order-amt': number;
	'min-order-value': number;
}

export interface IHtxTicker {
	symbol: string;
	open: number;
	high: number;
	low: number;
	close: number;
	amount: number;
	vol: number;
	count: number;
	bid: number;
	bidSize: number;
	ask: number;
	askSize: number;
}

export interface IHtxKline {
	id: number;
	open: number;
	close: number;
	low: number;
	high: number;
	amount: number;
	vol: number;
	count: number;
}

export interface IHtxDepth {
	bids: [number, number][];
	asks: [number, number][];
	ts: number;
	version: number;
}

export interface IHtxTrade {
	id: number;
	ts: number;
	data: {
		id: number;
		ts: number;
		'trade-id': number;
		amount: number;
		price: number;
		direction: string;
	}[];
}

// Margin Types
export interface IHtxMarginBalance {
	id: number;
	type: string;
	state: string;
	symbol: string;
	'fl-price': string;
	'fl-type': string;
	'risk-rate': string;
	list: IHtxMarginBalanceDetail[];
}

export interface IHtxMarginBalanceDetail {
	currency: string;
	type: string;
	balance: string;
}

export interface IHtxLoanOrder {
	id: number;
	'user-id': number;
	'account-id': number;
	symbol: string;
	currency: string;
	'loan-amount': string;
	'loan-balance': string;
	'interest-rate': string;
	'interest-amount': string;
	'interest-balance': string;
	'created-at': number;
	'accrued-at': number;
	state: string;
}

// Futures Types
export interface IHtxFuturesAccount {
	symbol: string;
	margin_balance: number;
	margin_position: number;
	margin_frozen: number;
	margin_available: number;
	profit_real: number;
	profit_unreal: number;
	risk_rate: number;
	withdraw_available: number;
	liquidation_price: number;
	lever_rate: number;
	adjust_factor: number;
}

export interface IHtxFuturesPosition {
	symbol: string;
	contract_code: string;
	contract_type: string;
	volume: number;
	available: number;
	frozen: number;
	cost_open: number;
	cost_hold: number;
	profit_unreal: number;
	profit_rate: number;
	profit: number;
	position_margin: number;
	lever_rate: number;
	direction: string;
	last_price: number;
}

export interface IHtxFuturesOrder {
	order_id: number;
	order_id_str: string;
	symbol: string;
	contract_type: string;
	contract_code: string;
	direction: string;
	offset: string;
	volume: number;
	price: number;
	lever_rate: number;
	order_price_type: string;
	order_type: number;
	status: number;
	created_at: number;
}

// Wallet Types
export interface IHtxDepositAddress {
	currency: string;
	address: string;
	addressTag: string;
	chain: string;
}

export interface IHtxWithdrawQuota {
	currency: string;
	chains: {
		chain: string;
		maxWithdrawAmt: string;
		withdrawQuotaPerDay: string;
		remainWithdrawQuotaPerDay: string;
		withdrawQuotaPerYear: string;
		remainWithdrawQuotaPerYear: string;
		withdrawQuotaTotal: string;
		remainWithdrawQuotaTotal: string;
	}[];
}

export interface IHtxDeposit {
	id: number;
	type: string;
	currency: string;
	'tx-hash': string;
	chain: string;
	amount: number;
	address: string;
	'address-tag': string;
	fee: number;
	state: string;
	'created-at': number;
	'updated-at': number;
}

export interface IHtxWithdraw {
	id: number;
	type: string;
	currency: string;
	'tx-hash': string;
	chain: string;
	amount: number;
	address: string;
	'address-tag': string;
	fee: number;
	state: string;
	'created-at': number;
	'updated-at': number;
}

// Request Parameter Types
export type HtxOrderType =
	| 'buy-market'
	| 'sell-market'
	| 'buy-limit'
	| 'sell-limit'
	| 'buy-ioc'
	| 'sell-ioc'
	| 'buy-limit-maker'
	| 'sell-limit-maker'
	| 'buy-stop-limit'
	| 'sell-stop-limit'
	| 'buy-limit-fok'
	| 'sell-limit-fok'
	| 'buy-stop-limit-fok'
	| 'sell-stop-limit-fok';

export type HtxOrderState =
	| 'submitted'
	| 'partial-filled'
	| 'partial-canceled'
	| 'filled'
	| 'canceled'
	| 'created';

export type HtxKlinePeriod =
	| '1min'
	| '5min'
	| '15min'
	| '30min'
	| '60min'
	| '4hour'
	| '1day'
	| '1mon'
	| '1week'
	| '1year';

export type HtxFuturesContractType =
	| 'this_week'
	| 'next_week'
	| 'quarter'
	| 'next_quarter';

export type HtxFuturesOrderPriceType =
	| 'limit'
	| 'opponent'
	| 'lightning'
	| 'optimal_5'
	| 'optimal_10'
	| 'optimal_20'
	| 'fok'
	| 'ioc'
	| 'opponent_ioc'
	| 'lightning_ioc'
	| 'optimal_5_ioc'
	| 'optimal_10_ioc'
	| 'optimal_20_ioc'
	| 'opponent_fok'
	| 'lightning_fok'
	| 'optimal_5_fok'
	| 'optimal_10_fok'
	| 'optimal_20_fok';

// Resource and Operation Types
export type HtxResource =
	| 'spotAccount'
	| 'spotTrading'
	| 'margin'
	| 'futuresAccount'
	| 'futuresTrading'
	| 'marketData'
	| 'wallet';

export interface IHtxCredentials {
	accessKey: string;
	secretKey: string;
	baseUrl: 'global' | 'aws';
}
