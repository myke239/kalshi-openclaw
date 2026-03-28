# Local Testing

## Goal
Make the local Kalshi plugin usable in OpenClaw with minimal manual fiddling.

## One-step local install/update

From the repo root:

```powershell
.\scripts\install-local-plugin.ps1
```

This script:
1. builds the TypeScript plugin
2. syncs the package into `C:\Users\Mr Claw\.openclaw\extensions\kalshi-plugin`
3. installs runtime dependencies in the extension root
4. runs `openclaw plugins inspect kalshi-plugin --json`

## Demo config
Use your Kalshi demo key and RSA private key in OpenClaw plugin config.

Required fields:
- `environment = sandbox`
- `productionEnabled = false`
- `apiKey`
- `apiSecret`
- optional `baseUrl = https://demo-api.kalshi.co/trade-api/v2`

## Recommended smoke test order
1. `kalshi_account_get`
2. `kalshi_markets_search`
3. `kalshi_arm_market`
4. `kalshi_order_preview`
5. `kalshi_order_place`
6. `kalshi_orders_list`
7. `kalshi_order_cancel`

## Current caveat
Local path installs are still less smooth than a proper npm/ClawHub install. The helper script is the current workaround.
