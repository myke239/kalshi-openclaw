export type OrderParams = {
  ticker: string;
  side: "yes" | "no";
  action: "buy" | "sell";
  count: number;
  yesPrice?: number;
  noPrice?: number;
  strategyId?: string;
  clientOrderId?: string;
  reduceOnly?: boolean;
};

export type SearchMarketsParams = {
  query?: string;
  category?: string;
  status?: "unopened" | "open" | "paused" | "closed" | "settled";
  limit?: number;
  cursor?: string;
  eventTicker?: string;
  seriesTicker?: string;
};

export type RiskResult = {
  allowed: boolean;
  reasons: string[];
};

export type ArmMarketParams = {
  ticker: string;
  maxExposureDollars?: number;
  expiryMode?: "market_close" | "timestamp" | "no_open_positions" | "manual";
  expiresAt?: string;
  createdBy?: string;
};

export type ArmStrategyParams = {
  strategyId: string;
  categoryFilters?: string[];
  maxPerTradeDollars?: number;
  maxPerMarketExposure?: number;
  expiryMode?: "market_close" | "timestamp" | "no_open_positions" | "manual";
  expiresAt?: string;
  createdBy?: string;
};
