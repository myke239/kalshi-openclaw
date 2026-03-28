# kalshi-plugin

Native OpenClaw plugin for Kalshi API integration.

## v1 scope
- account balance / positions / orders / fills
- market search and orderbook reads
- order preview and live order placement
- local arming and kill switch controls
- duplicate-trade prevention
- simple ranked opportunity output

## Config
The plugin expects OpenClaw plugin config fields:
- `environment`: `sandbox` or `production`
- `productionEnabled`: boolean
- `apiKey`: Kalshi API key id
- `apiSecret`: Kalshi RSA private key PEM
- `baseUrl`: optional override

## Safety model
- live production trading must be explicitly enabled
- opening trades require market or strategy arming
- kill switch blocks new opens
- duplicate trades are blocked for same market + strategy + side

## Status
This package is now the canonical implementation path. The earlier Python scaffolding is retained only as reference/prototyping material and should not be treated as the final plugin runtime.
