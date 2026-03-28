# Node Pivot Notes

The final installable OpenClaw plugin implementation is now TypeScript/Node.

## Why
- OpenClaw plugin runtime is native Node/TypeScript.
- Kalshi publishes an official TypeScript SDK with RSA-PSS auth support.

## Current status
- plugin package compiles via `tsc`
- plugin npm package name now matches manifest id (`kalshi-plugin`)
- OpenClaw tool registration shape patched to match local SDK requirements
- Kalshi SDK is used for account, market, and order operations
- local JSON state tracks kill switch, arming, duplicate prevention audit

## Remaining v1 work
- expand tool coverage for close/reduce and portfolio summaries
- tighten config and setup UX
- add Node-side tests
- verify endpoint field mappings against live sandbox credentials
- package plugin + skill metadata for installation flow
