# kalshi-openclaw

Private-first monorepo for Kalshi support in OpenClaw.

## Packages

- `packages/kalshi-plugin` - Kalshi API integration plugin scaffold
- `packages/kalshi-trading-skill` - safe operational trading skill
- `packages/kalshi-strategy-lab` - experimental strategy and simulation skill

## Current status

Scaffolded repository structure only. No live trading logic is implemented yet.

## Next build targets

1. Define plugin config schema
2. Implement signed Kalshi client
3. Add SQLite state and audit storage
4. Implement risk executor and arming state
5. Add OpenClaw tool registration
6. Flesh out skill references and packaging
