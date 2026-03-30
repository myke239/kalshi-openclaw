---
name: kalshi-trading-skill
description: Safe Kalshi trading workflows for account inspection, market search, orderbook review, opportunity ranking, position sizing, arming, order preview, order placement, and lifecycle management through a Kalshi plugin. Use when working with Kalshi markets, balances, positions, orders, or risk-gated trade execution.
---

# Kalshi Trading Skill

Use the Kalshi plugin as the source of truth for account state, risk state, arming state, market data, and execution.

## Core rules

- Prefer sandbox for testing and unfamiliar workflows.
- Treat opening positions as gated by arming and central risk checks.
- Treat reduce/close actions as lower-friction protective actions when allowed by policy.
- Use order preview before order placement when practical.
- Keep default responses concise.
- Provide detailed reasoning only when requested.
- Do not imply production automation is enabled unless plugin state confirms it.

## Default workflows

### Inspect portfolio
1. Get account and portfolio state.
2. List positions and open orders.
3. Summarize exposure and P&L.

### Find opportunities
1. Search relevant markets.
2. Rank opportunities.
3. Suggest size with confidence.
4. Offer detailed reasoning only on request.

### Open a position
1. Confirm environment and production enablement.
2. Check kill switch and risk status.
3. Check whether market arming or strategy arming authorizes the trade.
4. Preview the order.
5. Place the order only if risk checks pass.

### Manage a position
1. Inspect current market and position state.
2. Reduce or close if requested or if protective logic requires it.
3. Summarize what changed.

## Structured command patterns

Support workflows like:
- show my Kalshi portfolio
- find the best politics opportunities
- analyze this Kalshi market
- suggest position sizing for this market
- arm this market with max exposure until close
- arm a strategy for a category until close
- open the top opportunity in sandbox
- close this position
- explain why this trade ranked first
