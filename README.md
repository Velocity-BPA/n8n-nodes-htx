# n8n-nodes-htx

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for HTX (formerly Huobi), one of the world's leading cryptocurrency exchanges serving 10M+ users globally. This node provides complete integration with HTX's REST API v2, enabling workflow automation for spot trading, futures trading, margin trading, account management, market data access, and wallet operations.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![HTX API](https://img.shields.io/badge/HTX-API%20v2-blue)

## Features

- **7 Resource Categories** - Complete coverage of HTX exchange functionality
- **50+ Operations** - Comprehensive API operation support
- **Spot Trading** - Place, cancel, and manage spot orders with all order types
- **Futures Trading** - Full futures support including leverage, trigger orders, and position management
- **Margin Trading** - Loan management, transfers, and margin account operations
- **Market Data** - Real-time tickers, order books, klines, and trade history
- **Wallet Management** - Deposits, withdrawals, and address management
- **HMAC-SHA256 Authentication** - Secure API signature authentication
- **Multi-Region Support** - Global and AWS API endpoints
- **Error Handling** - Comprehensive error mapping and retry logic

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Select **Install**
4. Enter `n8n-nodes-htx` and click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-htx
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-htx.git
cd n8n-nodes-htx

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-htx

# Restart n8n
n8n start
```

## Credentials Setup

Before using the HTX node, you need to configure your API credentials.

### HTX API Credentials

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| API Key | String | Yes | Your HTX API key |
| Secret Key | Password | Yes | Your HTX API secret key |
| API Region | Options | No | `global` (default) or `aws` |

### Obtaining API Keys

1. Log in to your HTX account at [htx.com](https://www.htx.com)
2. Navigate to **API Management** in your account settings
3. Create a new API key with appropriate permissions
4. Configure IP whitelist for security (recommended)
5. Copy the API Key and Secret Key

**Security Recommendations:**
- Enable IP whitelist restrictions
- Use separate API keys for different applications
- Never share your secret key
- Regularly rotate API credentials

## Resources & Operations

### Spot Account

| Operation | Description |
|-----------|-------------|
| Get Accounts | List all spot accounts |
| Get Balance | Get account balance details |
| Get Account History | Get transaction history with filters |
| Get Account Ledger | Get account ledger entries |
| Transfer | Transfer between accounts |
| Get Sub-Accounts | List all sub-accounts |
| Get Sub-Account Balance | Get sub-account balance |

### Spot Trading

| Operation | Description |
|-----------|-------------|
| Place Order | Place a single order (limit, market, IOC, FOK, stop-limit) |
| Batch Place Orders | Place multiple orders (max 10) |
| Cancel Order | Cancel a single order |
| Batch Cancel Orders | Cancel multiple orders (max 50) |
| Cancel All Orders | Cancel all open orders with filters |
| Get Open Orders | Get all open orders |
| Get Order | Get order details by ID |
| Get Order History | Get historical orders |
| Get Match Results | Get trade fill history |

### Margin Trading

| Operation | Description |
|-----------|-------------|
| Transfer In | Transfer assets to margin account |
| Transfer Out | Transfer assets from margin account |
| Apply for Loan | Apply for a margin loan |
| Repay Loan | Repay a margin loan |
| Get Loan Orders | Get loan order history |
| Get Margin Balance | Get margin account balance |
| Get Repayment Reference | Get repayment information |

### Futures Account

| Operation | Description |
|-----------|-------------|
| Get Account Info | Get futures account information |
| Get Positions | Get all open positions |
| Get Position Info | Get specific position details |
| Set Leverage | Set leverage (1x-125x) |
| Get Account Records | Get transaction records |
| Get Settlement Records | Get settlement history |

### Futures Trading

| Operation | Description |
|-----------|-------------|
| Place Order | Place a futures order |
| Batch Place Orders | Place multiple futures orders |
| Cancel Order | Cancel a futures order |
| Cancel All Orders | Cancel all futures orders |
| Get Open Orders | Get open futures orders |
| Get Order Info | Get futures order details |
| Get Order History | Get futures order history |
| Get Match Results | Get futures trade history |
| Place Trigger Order | Place a conditional trigger order |
| Cancel Trigger Order | Cancel a trigger order |

### Market Data (Public)

| Operation | Description |
|-----------|-------------|
| Get Symbols | Get all trading pairs |
| Get Currencies | Get supported currencies |
| Get Ticker | Get ticker for a symbol |
| Get All Tickers | Get all market tickers |
| Get Depth | Get order book depth |
| Get Trades | Get recent trades |
| Get Klines | Get candlestick/OHLCV data |
| Get 24hr Stats | Get 24-hour statistics |

### Wallet

| Operation | Description |
|-----------|-------------|
| Get Deposit Address | Get deposit address for a currency |
| Get Withdraw Quota | Get withdrawal limits and quotas |
| Create Withdraw | Create a withdrawal request |
| Cancel Withdraw | Cancel a pending withdrawal |
| Get Deposit History | Get deposit history |
| Get Withdraw History | Get withdrawal history |

## Usage Examples

### Place a Spot Limit Order

```javascript
// Configuration
Resource: Spot Trading
Operation: Place Order
Account ID: 12345678
Symbol: btcusdt
Order Type: Buy Limit
Amount: 0.001
Price: 40000
```

### Get Market Ticker

```javascript
// Configuration
Resource: Market Data
Operation: Get Ticker
Symbol: ethusdt
```

### Place a Futures Order with Leverage

```javascript
// Configuration
Resource: Futures Trading
Operation: Place Order
Contract Code: BTC-USDT
Direction: Buy
Offset: Open
Volume: 1
Leverage Rate: 10
Order Price Type: Limit
Price: 40000
```

## HTX API Concepts

### Trading Pairs (Symbols)

HTX uses lowercase trading pair symbols without separators:
- `btcusdt` - BTC/USDT
- `ethbtc` - ETH/BTC
- `solusdt` - SOL/USDT

### Order Types

| Type | Description |
|------|-------------|
| `buy-limit` | Limit buy order |
| `sell-limit` | Limit sell order |
| `buy-market` | Market buy order |
| `sell-market` | Market sell order |
| `buy-ioc` | Immediate-or-cancel buy |
| `sell-ioc` | Immediate-or-cancel sell |
| `buy-limit-fok` | Fill-or-kill buy |
| `sell-limit-fok` | Fill-or-kill sell |

### Futures Contracts

| Type | Description |
|------|-------------|
| `this_week` | Current week contract |
| `next_week` | Next week contract |
| `quarter` | Current quarter contract |
| `next_quarter` | Next quarter contract |

### API Endpoints

| Type | Endpoint |
|------|----------|
| Spot (Global) | api.huobi.pro |
| Spot (AWS) | api-aws.huobi.pro |
| Futures | api.hbdm.com |

## Error Handling

The node includes comprehensive error handling with mapped error codes:

| Code | Description |
|------|-------------|
| `base-symbol-error` | Invalid trading symbol |
| `account-frozen-balance-insufficient-error` | Insufficient balance |
| `order-limitorder-price-error` | Price out of range |
| `order-value-min-error` | Order value too small |
| `invalid-signature` | Authentication failed |

Use n8n's built-in error handling with "Continue on Fail" for robust workflows.

## Security Best Practices

1. **API Key Permissions** - Only enable required permissions
2. **IP Whitelist** - Restrict API access to specific IPs
3. **Separate Keys** - Use different keys for different environments
4. **Environment Variables** - Store credentials securely
5. **Regular Rotation** - Rotate API keys periodically
6. **Monitor Activity** - Review API usage logs

## Rate Limits

HTX enforces rate limits on API requests:

| Endpoint Type | Rate Limit |
|--------------|------------|
| Market Data | 10 requests/second |
| Trading | 10 requests/second |
| Account | 100 requests/second |
| Wallet | 20 requests/second |

The node includes automatic retry logic for rate limit errors.

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)
- Email: licensing@velobpa.com

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code passes linting and tests before submitting.

## Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Velocity-BPA/n8n-nodes-htx/issues)
- **Documentation**: [HTX API Documentation](https://huobiapi.github.io/docs/)
- **Email**: support@velobpa.com

## Acknowledgments

- [HTX (Huobi)](https://www.htx.com) for providing the API
- [n8n](https://n8n.io) for the workflow automation platform
- The open-source community for their contributions
