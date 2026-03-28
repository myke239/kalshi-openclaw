# Risk and Arming

## Opening positions

Before opening a position:
1. Check environment.
2. Check whether production is explicitly enabled when not in sandbox.
3. Check kill switch state.
4. Verify that either market arming or strategy arming authorizes the trade.
5. Preview before place when practical.

## Closing or reducing positions

Default policy allows lower-friction close or reduce actions, but still verify contract counts and current position state.

## Recommendation style

Default output should be concise:
- ranked opportunities
- suggested size
- confidence

Detailed reasoning should be available on request, not forced every time.
