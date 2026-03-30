# Kalshi OpenClaw Spec

This repository tracks a three-package design (skills are bundled under the plugin for OpenClaw):

- kalshi-plugin
- kalshi-trading-skill (`packages/kalshi-plugin/skills/kalshi-trading-skill`)
- kalshi-strategy-lab (`packages/kalshi-plugin/skills/kalshi-strategy-lab`)

## Locked product decisions

- Private first, public beta later
- Power-user target
- User-supplied credentials
- Signed Kalshi requests
- Sandbox and production support
- One account per installation
- Fully automated trading allowed only within explicit pre-approved limits
- Market arming and strategy arming both supported
- Opening trades require arming via either path plus central risk authorization
- Kill switch blocks new opens and still allows reduce/close
- Duplicate prevention defaults to same market + same strategy + same side
- Default opportunity output returns top 5 ideas with size and confidence
- Tuned categories start with politics, then crypto, then weather
- Storage uses SQLite
- News and realtime monitoring are deferred to v2
