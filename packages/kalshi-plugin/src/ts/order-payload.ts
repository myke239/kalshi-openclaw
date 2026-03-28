import type { OrderParams } from "./types.js";

function toCentPrice(value: number): number {
  const cents = Math.round(value * 100);
  if (cents < 1 || cents > 99) {
    throw new Error("price must resolve to whole cents between 0.01 and 0.99 dollars");
  }
  return cents;
}

export function buildCreateOrderPayload(params: OrderParams) {
  const payload: Record<string, unknown> = {
    ticker: params.ticker,
    side: params.side,
    action: params.action,
    count: params.count,
    client_order_id: params.clientOrderId,
    reduce_only: params.reduceOnly,
  };

  if (params.reduceOnly) {
    payload.time_in_force = 'immediate_or_cancel';
  }

  const explicitYes = params.yesPrice;
  const explicitNo = params.noPrice;

  if (explicitYes != null && explicitNo != null) {
    throw new Error("provide only one of yesPrice or noPrice");
  }

  if (explicitYes != null) {
    payload.yes_price = toCentPrice(explicitYes);
    return payload;
  }

  if (explicitNo != null) {
    payload.no_price = toCentPrice(explicitNo);
    return payload;
  }

  if (params.side === "yes") {
    payload.yes_price = 50;
    return payload;
  }

  payload.no_price = 50;
  return payload;
}
