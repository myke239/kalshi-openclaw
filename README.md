# kalshi-openclaw

Private-first monorepo for Kalshi support in OpenClaw.

## Packages

- `packages/kalshi-plugin` - native OpenClaw Kalshi plugin (`kalshi-plugin`), including bundled skills:
  - `packages/kalshi-plugin/skills/kalshi-trading-skill` - safe operational trading skill
  - `packages/kalshi-plugin/skills/kalshi-strategy-lab` - experimental strategy and simulation skill

## Current status

The repo includes a loading native TypeScript OpenClaw plugin with sandbox-validated Kalshi integration and two companion skills.

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
- position reduce
- position close
- market arming
- strategy arming
- market/strategy disarm
- kill switch toggle
- local risk status
- ranked opportunities

## Local developer workflow

### Install / update locally

```powershell
.\scripts\install-local-plugin.ps1
```

### Then verify

```powershell
openclaw plugins inspect kalshi-plugin --json
openclaw plugins doctor
```

## Current caveat

The plugin is sandbox-test ready, but the local install/update flow still relies on the helper script rather than a polished package release path.
