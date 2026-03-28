import {
  Configuration,
  MarketApi,
  OrdersApi,
  PortfolioApi,
} from "kalshi-typescript";

import type { KalshiPluginConfig } from "./config.js";

export class KalshiClient {
  readonly portfolio: PortfolioApi;
  readonly markets: MarketApi;
  readonly orders: OrdersApi;

  constructor(config: KalshiPluginConfig) {
    const sdkConfig = new Configuration({
      apiKey: config.apiKey,
      privateKeyPem: config.apiSecret,
      basePath: config.baseUrl,
    });

    this.portfolio = new PortfolioApi(sdkConfig);
    this.markets = new MarketApi(sdkConfig);
    this.orders = new OrdersApi(sdkConfig);
  }
}
