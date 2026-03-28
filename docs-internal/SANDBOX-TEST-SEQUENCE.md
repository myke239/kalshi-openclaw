# Sandbox Test Sequence

## Safe v1 validation order
1. `kalshi_account_get`
2. `kalshi_positions_list`
3. `kalshi_markets_search`
4. `kalshi_market_get`
5. `kalshi_market_orderbook_get`
6. `kalshi_arm_market`
7. `kalshi_order_preview`
8. `kalshi_order_place`
9. `kalshi_orders_list`
10. `kalshi_order_cancel`
11. force fill with a priced order if needed
12. `kalshi_position_reduce`
13. `kalshi_position_close`
14. `kalshi_risk_status_get`

## Known validated demo market
- `KXCS2GAME-26MAR28EYEALL-ALL`

## Known test prices
- resting test order: `yesPrice = 0.50`
- forced fill test order: `yesPrice = 0.78`
- reduce test order: `yesPrice = 0.01` with reduce-only IoC semantics
