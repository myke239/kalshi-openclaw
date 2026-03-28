---
name: kalshi-strategy-lab
description: Experimental Kalshi simulation, strategy comparison, paper trading, parameter testing, and postmortem workflows. Use when evaluating strategies, comparing agent or strategy variants, reviewing closed markets, or preparing experimental changes for approval before production promotion.
---

# Kalshi Strategy Lab

Keep experiments separate from live production behavior.

## Core rules

- Treat simulation and production as separate modes.
- Version experimental parameter changes.
- Require approval before promoting experimental settings into production.
- Compare strategies using EV, win rate, and P&L.
- Avoid framing experiments as unrestricted self-improvement.

## Default workflows

### Paper trading
1. Select strategy and market universe.
2. Run simulated decisions.
3. Record results to the experiment ledger.

### Strategy comparison
1. Run strategy A and B on the same inputs.
2. Compare EV, win rate, and P&L.
3. Summarize strengths, weaknesses, and stability.

### Postmortem
1. Load resolved market context.
2. Compare predicted actions against outcome.
3. Record lessons and candidate parameter changes.

## Promotion rule

Temporary experimental changes may be tested, but production configuration changes require explicit approval and rollback support.
