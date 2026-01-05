/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { LICENSING_NOTICE } from './constants/constants';

import * as spotAccount from './actions/spotAccount';
import * as spotTrading from './actions/spotTrading';
import * as margin from './actions/margin';
import * as futuresAccount from './actions/futuresAccount';
import * as futuresTrading from './actions/futuresTrading';
import * as marketData from './actions/marketData';
import * as wallet from './actions/wallet';

// Log licensing notice once on node load
let licensingNoticeLogged = false;

export class Htx implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HTX',
		name: 'htx',
		icon: 'file:htx.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the HTX (Huobi) cryptocurrency exchange API',
		defaults: {
			name: 'HTX',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'htxApi',
				required: true,
				displayOptions: {
					show: {
						resource: ['spotAccount', 'spotTrading', 'margin', 'futuresAccount', 'futuresTrading', 'wallet'],
					},
				},
			},
			{
				name: 'htxApi',
				required: false,
				displayOptions: {
					show: {
						resource: ['marketData'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Futures Account',
						value: 'futuresAccount',
						description: 'Manage futures account positions and settings',
					},
					{
						name: 'Futures Trading',
						value: 'futuresTrading',
						description: 'Place and manage futures orders',
					},
					{
						name: 'Margin Trading',
						value: 'margin',
						description: 'Manage margin loans and transfers',
					},
					{
						name: 'Market Data',
						value: 'marketData',
						description: 'Get market data, tickers, and order books',
					},
					{
						name: 'Spot Account',
						value: 'spotAccount',
						description: 'Manage spot accounts and balances',
					},
					{
						name: 'Spot Trading',
						value: 'spotTrading',
						description: 'Place and manage spot orders',
					},
					{
						name: 'Wallet',
						value: 'wallet',
						description: 'Manage deposits and withdrawals',
					},
				],
				default: 'spotTrading',
			},

			// ==================== SPOT ACCOUNT ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['spotAccount'],
					},
				},
				options: [
					{
						name: 'Get Account History',
						value: 'getAccountHistory',
						description: 'Get account transaction history',
						action: 'Get account history',
					},
					{
						name: 'Get Account Ledger',
						value: 'getAccountLedger',
						description: 'Get account ledger entries',
						action: 'Get account ledger',
					},
					{
						name: 'Get Accounts',
						value: 'getAccounts',
						description: 'List all accounts',
						action: 'Get accounts',
					},
					{
						name: 'Get Balance',
						value: 'getBalance',
						description: 'Get account balance',
						action: 'Get balance',
					},
					{
						name: 'Get Sub-Account Balance',
						value: 'getSubAccountBalance',
						description: 'Get sub-account balance',
						action: 'Get sub account balance',
					},
					{
						name: 'Get Sub-Accounts',
						value: 'getSubAccounts',
						description: 'List all sub-accounts',
						action: 'Get sub accounts',
					},
					{
						name: 'Transfer',
						value: 'transfer',
						description: 'Transfer between accounts',
						action: 'Transfer between accounts',
					},
				],
				default: 'getAccounts',
			},
			...spotAccount.getAccounts.description,
			...spotAccount.getBalance.description,
			...spotAccount.getAccountHistory.description,
			...spotAccount.getAccountLedger.description,
			...spotAccount.transfer.description,
			...spotAccount.getSubAccounts.description,
			...spotAccount.getSubAccountBalance.description,

			// ==================== SPOT TRADING ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['spotTrading'],
					},
				},
				options: [
					{
						name: 'Batch Cancel Orders',
						value: 'batchCancelOrders',
						description: 'Cancel multiple orders',
						action: 'Batch cancel orders',
					},
					{
						name: 'Batch Place Orders',
						value: 'batchPlaceOrders',
						description: 'Place multiple orders',
						action: 'Batch place orders',
					},
					{
						name: 'Cancel All Orders',
						value: 'cancelAllOrders',
						description: 'Cancel all open orders',
						action: 'Cancel all orders',
					},
					{
						name: 'Cancel Order',
						value: 'cancelOrder',
						description: 'Cancel a single order',
						action: 'Cancel order',
					},
					{
						name: 'Get Match Results',
						value: 'getMatchResults',
						description: 'Get trade fill history',
						action: 'Get match results',
					},
					{
						name: 'Get Open Orders',
						value: 'getOpenOrders',
						description: 'Get all open orders',
						action: 'Get open orders',
					},
					{
						name: 'Get Order',
						value: 'getOrder',
						description: 'Get order details',
						action: 'Get order',
					},
					{
						name: 'Get Order History',
						value: 'getOrderHistory',
						description: 'Get historical orders',
						action: 'Get order history',
					},
					{
						name: 'Place Order',
						value: 'placeOrder',
						description: 'Place a single order',
						action: 'Place order',
					},
				],
				default: 'placeOrder',
			},
			...spotTrading.placeOrder.description,
			...spotTrading.batchPlaceOrders.description,
			...spotTrading.cancelOrder.description,
			...spotTrading.batchCancelOrders.description,
			...spotTrading.cancelAllOrders.description,
			...spotTrading.getOpenOrders.description,
			...spotTrading.getOrder.description,
			...spotTrading.getOrderHistory.description,
			...spotTrading.getMatchResults.description,

			// ==================== MARGIN ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['margin'],
					},
				},
				options: [
					{
						name: 'Apply for Loan',
						value: 'applyLoan',
						description: 'Apply for a margin loan',
						action: 'Apply for loan',
					},
					{
						name: 'Get Loan Orders',
						value: 'getLoanOrders',
						description: 'Get loan order history',
						action: 'Get loan orders',
					},
					{
						name: 'Get Margin Balance',
						value: 'getMarginBalance',
						description: 'Get margin account balance',
						action: 'Get margin balance',
					},
					{
						name: 'Get Repayment Reference',
						value: 'getRepaymentReference',
						description: 'Get loan repayment information',
						action: 'Get repayment reference',
					},
					{
						name: 'Repay Loan',
						value: 'repayLoan',
						description: 'Repay a margin loan',
						action: 'Repay loan',
					},
					{
						name: 'Transfer In',
						value: 'transferIn',
						description: 'Transfer to margin account',
						action: 'Transfer in',
					},
					{
						name: 'Transfer Out',
						value: 'transferOut',
						description: 'Transfer from margin account',
						action: 'Transfer out',
					},
				],
				default: 'getMarginBalance',
			},
			...margin.transferIn.description,
			...margin.transferOut.description,
			...margin.applyLoan.description,
			...margin.repayLoan.description,
			...margin.getLoanOrders.description,
			...margin.getMarginBalance.description,
			...margin.getRepaymentReference.description,

			// ==================== FUTURES ACCOUNT ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['futuresAccount'],
					},
				},
				options: [
					{
						name: 'Get Account Info',
						value: 'getAccountInfo',
						description: 'Get futures account information',
						action: 'Get account info',
					},
					{
						name: 'Get Account Records',
						value: 'getAccountRecords',
						description: 'Get account transaction records',
						action: 'Get account records',
					},
					{
						name: 'Get Position Info',
						value: 'getPositionInfo',
						description: 'Get specific position information',
						action: 'Get position info',
					},
					{
						name: 'Get Positions',
						value: 'getPositions',
						description: 'Get all positions',
						action: 'Get positions',
					},
					{
						name: 'Get Settlement Records',
						value: 'getSettlementRecords',
						description: 'Get settlement history',
						action: 'Get settlement records',
					},
					{
						name: 'Set Leverage',
						value: 'setLeverage',
						description: 'Set leverage for a contract',
						action: 'Set leverage',
					},
				],
				default: 'getAccountInfo',
			},
			...futuresAccount.getAccountInfo.description,
			...futuresAccount.getPositions.description,
			...futuresAccount.getPositionInfo.description,
			...futuresAccount.setLeverage.description,
			...futuresAccount.getAccountRecords.description,
			...futuresAccount.getSettlementRecords.description,

			// ==================== FUTURES TRADING ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['futuresTrading'],
					},
				},
				options: [
					{
						name: 'Batch Place Orders',
						value: 'batchPlaceOrders',
						description: 'Place multiple futures orders',
						action: 'Batch place orders',
					},
					{
						name: 'Cancel All Orders',
						value: 'cancelAllOrders',
						description: 'Cancel all futures orders',
						action: 'Cancel all orders',
					},
					{
						name: 'Cancel Order',
						value: 'cancelOrder',
						description: 'Cancel a futures order',
						action: 'Cancel order',
					},
					{
						name: 'Cancel Trigger Order',
						value: 'cancelTriggerOrder',
						description: 'Cancel a trigger order',
						action: 'Cancel trigger order',
					},
					{
						name: 'Get Match Results',
						value: 'getMatchResults',
						description: 'Get futures trade history',
						action: 'Get match results',
					},
					{
						name: 'Get Open Orders',
						value: 'getOpenOrders',
						description: 'Get open futures orders',
						action: 'Get open orders',
					},
					{
						name: 'Get Order History',
						value: 'getOrderHistory',
						description: 'Get futures order history',
						action: 'Get order history',
					},
					{
						name: 'Get Order Info',
						value: 'getOrderInfo',
						description: 'Get futures order details',
						action: 'Get order info',
					},
					{
						name: 'Place Order',
						value: 'placeOrder',
						description: 'Place a futures order',
						action: 'Place order',
					},
					{
						name: 'Place Trigger Order',
						value: 'placeTriggerOrder',
						description: 'Place a trigger order',
						action: 'Place trigger order',
					},
				],
				default: 'placeOrder',
			},
			...futuresTrading.placeOrder.description,
			...futuresTrading.batchPlaceOrders.description,
			...futuresTrading.cancelOrder.description,
			...futuresTrading.cancelAllOrders.description,
			...futuresTrading.getOpenOrders.description,
			...futuresTrading.getOrderInfo.description,
			...futuresTrading.getOrderHistory.description,
			...futuresTrading.getMatchResults.description,
			...futuresTrading.placeTriggerOrder.description,
			...futuresTrading.cancelTriggerOrder.description,

			// ==================== MARKET DATA ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['marketData'],
					},
				},
				options: [
					{
						name: 'Get 24hr Stats',
						value: 'get24hrStats',
						description: 'Get 24-hour market statistics',
						action: 'Get 24hr stats',
					},
					{
						name: 'Get All Tickers',
						value: 'getAllTickers',
						description: 'Get all market tickers',
						action: 'Get all tickers',
					},
					{
						name: 'Get Currencies',
						value: 'getCurrencies',
						description: 'Get supported currencies',
						action: 'Get currencies',
					},
					{
						name: 'Get Depth',
						value: 'getDepth',
						description: 'Get order book depth',
						action: 'Get depth',
					},
					{
						name: 'Get Klines',
						value: 'getKlines',
						description: 'Get candlestick data',
						action: 'Get klines',
					},
					{
						name: 'Get Symbols',
						value: 'getSymbols',
						description: 'Get trading pairs',
						action: 'Get symbols',
					},
					{
						name: 'Get Ticker',
						value: 'getTicker',
						description: 'Get ticker for a symbol',
						action: 'Get ticker',
					},
					{
						name: 'Get Trades',
						value: 'getTrades',
						description: 'Get recent trades',
						action: 'Get trades',
					},
				],
				default: 'getTicker',
			},
			...marketData.getSymbols.description,
			...marketData.getCurrencies.description,
			...marketData.getTicker.description,
			...marketData.getAllTickers.description,
			...marketData.getDepth.description,
			...marketData.getTrades.description,
			...marketData.getKlines.description,
			...marketData.get24hrStats.description,

			// ==================== WALLET ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['wallet'],
					},
				},
				options: [
					{
						name: 'Cancel Withdraw',
						value: 'cancelWithdraw',
						description: 'Cancel a pending withdrawal',
						action: 'Cancel withdraw',
					},
					{
						name: 'Create Withdraw',
						value: 'createWithdraw',
						description: 'Create a withdrawal request',
						action: 'Create withdraw',
					},
					{
						name: 'Get Deposit Address',
						value: 'getDepositAddress',
						description: 'Get deposit address for a currency',
						action: 'Get deposit address',
					},
					{
						name: 'Get Deposit History',
						value: 'getDepositHistory',
						description: 'Get deposit history',
						action: 'Get deposit history',
					},
					{
						name: 'Get Withdraw History',
						value: 'getWithdrawHistory',
						description: 'Get withdrawal history',
						action: 'Get withdraw history',
					},
					{
						name: 'Get Withdraw Quota',
						value: 'getWithdrawQuota',
						description: 'Get withdrawal limits',
						action: 'Get withdraw quota',
					},
				],
				default: 'getDepositAddress',
			},
			...wallet.getDepositAddress.description,
			...wallet.getWithdrawQuota.description,
			...wallet.createWithdraw.description,
			...wallet.cancelWithdraw.description,
			...wallet.getDepositHistory.description,
			...wallet.getWithdrawHistory.description,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Log licensing notice once per node load
		if (!licensingNoticeLogged) {
			this.logger.warn(LICENSING_NOTICE);
			licensingNoticeLogged = true;
		}

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[] = [];

				switch (resource) {
					case 'spotAccount':
						switch (operation) {
							case 'getAccounts':
								result = await spotAccount.getAccounts.execute.call(this, i);
								break;
							case 'getBalance':
								result = await spotAccount.getBalance.execute.call(this, i);
								break;
							case 'getAccountHistory':
								result = await spotAccount.getAccountHistory.execute.call(this, i);
								break;
							case 'getAccountLedger':
								result = await spotAccount.getAccountLedger.execute.call(this, i);
								break;
							case 'transfer':
								result = await spotAccount.transfer.execute.call(this, i);
								break;
							case 'getSubAccounts':
								result = await spotAccount.getSubAccounts.execute.call(this, i);
								break;
							case 'getSubAccountBalance':
								result = await spotAccount.getSubAccountBalance.execute.call(this, i);
								break;
						}
						break;

					case 'spotTrading':
						switch (operation) {
							case 'placeOrder':
								result = await spotTrading.placeOrder.execute.call(this, i);
								break;
							case 'batchPlaceOrders':
								result = await spotTrading.batchPlaceOrders.execute.call(this, i);
								break;
							case 'cancelOrder':
								result = await spotTrading.cancelOrder.execute.call(this, i);
								break;
							case 'batchCancelOrders':
								result = await spotTrading.batchCancelOrders.execute.call(this, i);
								break;
							case 'cancelAllOrders':
								result = await spotTrading.cancelAllOrders.execute.call(this, i);
								break;
							case 'getOpenOrders':
								result = await spotTrading.getOpenOrders.execute.call(this, i);
								break;
							case 'getOrder':
								result = await spotTrading.getOrder.execute.call(this, i);
								break;
							case 'getOrderHistory':
								result = await spotTrading.getOrderHistory.execute.call(this, i);
								break;
							case 'getMatchResults':
								result = await spotTrading.getMatchResults.execute.call(this, i);
								break;
						}
						break;

					case 'margin':
						switch (operation) {
							case 'transferIn':
								result = await margin.transferIn.execute.call(this, i);
								break;
							case 'transferOut':
								result = await margin.transferOut.execute.call(this, i);
								break;
							case 'applyLoan':
								result = await margin.applyLoan.execute.call(this, i);
								break;
							case 'repayLoan':
								result = await margin.repayLoan.execute.call(this, i);
								break;
							case 'getLoanOrders':
								result = await margin.getLoanOrders.execute.call(this, i);
								break;
							case 'getMarginBalance':
								result = await margin.getMarginBalance.execute.call(this, i);
								break;
							case 'getRepaymentReference':
								result = await margin.getRepaymentReference.execute.call(this, i);
								break;
						}
						break;

					case 'futuresAccount':
						switch (operation) {
							case 'getAccountInfo':
								result = await futuresAccount.getAccountInfo.execute.call(this, i);
								break;
							case 'getPositions':
								result = await futuresAccount.getPositions.execute.call(this, i);
								break;
							case 'getPositionInfo':
								result = await futuresAccount.getPositionInfo.execute.call(this, i);
								break;
							case 'setLeverage':
								result = await futuresAccount.setLeverage.execute.call(this, i);
								break;
							case 'getAccountRecords':
								result = await futuresAccount.getAccountRecords.execute.call(this, i);
								break;
							case 'getSettlementRecords':
								result = await futuresAccount.getSettlementRecords.execute.call(this, i);
								break;
						}
						break;

					case 'futuresTrading':
						switch (operation) {
							case 'placeOrder':
								result = await futuresTrading.placeOrder.execute.call(this, i);
								break;
							case 'batchPlaceOrders':
								result = await futuresTrading.batchPlaceOrders.execute.call(this, i);
								break;
							case 'cancelOrder':
								result = await futuresTrading.cancelOrder.execute.call(this, i);
								break;
							case 'cancelAllOrders':
								result = await futuresTrading.cancelAllOrders.execute.call(this, i);
								break;
							case 'getOpenOrders':
								result = await futuresTrading.getOpenOrders.execute.call(this, i);
								break;
							case 'getOrderInfo':
								result = await futuresTrading.getOrderInfo.execute.call(this, i);
								break;
							case 'getOrderHistory':
								result = await futuresTrading.getOrderHistory.execute.call(this, i);
								break;
							case 'getMatchResults':
								result = await futuresTrading.getMatchResults.execute.call(this, i);
								break;
							case 'placeTriggerOrder':
								result = await futuresTrading.placeTriggerOrder.execute.call(this, i);
								break;
							case 'cancelTriggerOrder':
								result = await futuresTrading.cancelTriggerOrder.execute.call(this, i);
								break;
						}
						break;

					case 'marketData':
						switch (operation) {
							case 'getSymbols':
								result = await marketData.getSymbols.execute.call(this, i);
								break;
							case 'getCurrencies':
								result = await marketData.getCurrencies.execute.call(this, i);
								break;
							case 'getTicker':
								result = await marketData.getTicker.execute.call(this, i);
								break;
							case 'getAllTickers':
								result = await marketData.getAllTickers.execute.call(this, i);
								break;
							case 'getDepth':
								result = await marketData.getDepth.execute.call(this, i);
								break;
							case 'getTrades':
								result = await marketData.getTrades.execute.call(this, i);
								break;
							case 'getKlines':
								result = await marketData.getKlines.execute.call(this, i);
								break;
							case 'get24hrStats':
								result = await marketData.get24hrStats.execute.call(this, i);
								break;
						}
						break;

					case 'wallet':
						switch (operation) {
							case 'getDepositAddress':
								result = await wallet.getDepositAddress.execute.call(this, i);
								break;
							case 'getWithdrawQuota':
								result = await wallet.getWithdrawQuota.execute.call(this, i);
								break;
							case 'createWithdraw':
								result = await wallet.createWithdraw.execute.call(this, i);
								break;
							case 'cancelWithdraw':
								result = await wallet.cancelWithdraw.execute.call(this, i);
								break;
							case 'getDepositHistory':
								result = await wallet.getDepositHistory.execute.call(this, i);
								break;
							case 'getWithdrawHistory':
								result = await wallet.getWithdrawHistory.execute.call(this, i);
								break;
						}
						break;
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({
						json: { error: errorMessage },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
