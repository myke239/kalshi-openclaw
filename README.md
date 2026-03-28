# kalshi-openclaw

Private-first monorepo for Kalshi support in OpenClaw.

## Packages

- `packages/kalshi-plugin` - native OpenClaw Kalshi plugin (`kalshi-plugin`)
- `packages/kalshi-trading-skill` - safe operational trading skill
- `packages/kalshi-strategy-lab` - experimental strategy and simulation skill

## Current status

The repo now includes a compiling native TypeScript OpenClaw plugin using Kalshi's official TypeScript SDK, plus two companion skills.

## Current v1 tool surface

- account balance
- positions list
- orders list
- fills list
- market search
- market details
- orderbook read
- order preview
- order placement
- order cancel
- market arming
- strategy arming
- market/strategy disarm
- kill switch toggle
- local risk status
- ranked opportunities

## Remaining work before v1 is actually done

1. add close/reduce position helpers
2. add stronger config/setup UX
3. add Node-side tests
4. validate against Kalshi sandbox credentials
5. package for install/testing in OpenClaw
