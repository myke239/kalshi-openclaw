# Local Testing

## Goal
Make the local Kalshi plugin usable in OpenClaw with minimal manual fiddling.

## One-step local install/update

From the repo root.

**Windows (PowerShell):**

```powershell
.\scripts\install-local-plugin.ps1
```

**macOS / Linux / CI (Node):**

```bash
npm run install:openclaw
```

The scripts:
1. build the TypeScript plugin
2. sync the package into the OpenClaw extensions folder for the current user:
   - Windows: `%USERPROFILE%\.openclaw\extensions\kalshi-plugin`
   - Unix: `~/.openclaw/extensions/kalshi-plugin`
3. install runtime dependencies in the extension root
4. run `openclaw plugins inspect kalshi-plugin --json`

Override the repo root or extension path with `-RepoRoot` / `-ExtensionRoot` (PowerShell) or `KALSHI_REPO_ROOT` / `KALSHI_EXTENSION_ROOT` (Node).

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
