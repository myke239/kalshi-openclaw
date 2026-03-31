# kalshi-plugin

Native OpenClaw plugin for Kalshi API integration.

## v1 scope
- account balance / positions / orders / fills
- market search and orderbook reads
- order preview and live order placement
- local arming and kill switch controls
- duplicate-trade prevention
- simple ranked opportunity output
- reduce / close helpers for sandbox-tested lifecycle checks

## Config
The plugin supports these OpenClaw plugin config fields:
- `environment`: `sandbox` or `production` (defaults to `sandbox`)
- `productionEnabled`: boolean (defaults to `false`)
- `apiKey`: Kalshi API key id
- `apiSecret`: Kalshi RSA private key PEM
- `baseUrl`: optional override

Install-time config may be empty. Live API calls fail until credentials are configured.

## Safety model
- live production trading must be explicitly enabled
- opening trades require market or strategy arming
- kill switch blocks new opens
- duplicate trades are blocked for same market + strategy + side

## Local install / update
From the monorepo root:

```powershell
.\scripts\install-local-plugin.ps1
```

Or cross-platform: `npm run install:openclaw` (see repo root `README.md`).

By default this syncs into the current user’s OpenClaw extensions folder (`%USERPROFILE%\.openclaw\extensions\kalshi-plugin` on Windows, `~/.openclaw/extensions/kalshi-plugin` on Unix), installs runtime deps there, and inspects the loaded plugin.

## Status
This package is sandbox-test ready, not production-ready. Core sandbox reads, place/cancel, and filled-position reduce lifecycle have been validated. Packaging for public beta still needs cleanup.
