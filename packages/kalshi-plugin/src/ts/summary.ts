function toNumber(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function summarizeBalance(balance: any) {
  return {
    balanceCents: balance?.balance ?? 0,
    portfolioValueCents: balance?.portfolio_value ?? 0,
    balanceDollars: toNumber(balance?.balance) / 100,
    portfolioValueDollars: toNumber(balance?.portfolio_value) / 100,
    updatedTs: balance?.updated_ts ?? null,
  };
}

export function summarizePositions(payload: any) {
  const positions = Array.isArray(payload?.market_positions) ? payload.market_positions : [];
  return {
    count: positions.length,
    positions: positions.map((position: any) => ({
      ticker: position.ticker,
      position: position.position_fp,
      exposureDollars: position.market_exposure_dollars,
      realizedPnlDollars: position.realized_pnl_dollars,
      totalTradedDollars: position.total_traded_dollars,
      feesPaidDollars: position.fees_paid_dollars,
      lastUpdatedTs: position.last_updated_ts,
    })),
  };
}

export function summarizeOrders(payload: any) {
  const orders = Array.isArray(payload?.orders) ? payload.orders : [];
  return {
    count: orders.length,
    orders: orders.map((order: any) => ({
      orderId: order.order_id,
      ticker: order.ticker,
      side: order.side,
      action: order.action,
      status: order.status,
      yesPriceDollars: order.yes_price_dollars,
      noPriceDollars: order.no_price_dollars,
      remainingCount: order.remaining_count_fp,
      initialCount: order.initial_count_fp,
      createdTime: order.created_time,
      updatedTime: order.last_update_time,
    })),
    cursor: payload?.cursor ?? "",
  };
}
