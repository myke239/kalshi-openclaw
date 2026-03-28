import crypto from "node:crypto";

import type { KalshiPluginConfig } from "./config.js";

export class KalshiClient {
  constructor(private readonly config: KalshiPluginConfig) {}

  private sign(path: string, method: string): { timestamp: string; signature: string } {
    const timestamp = Date.now().toString();
    const url = new URL(`${this.config.baseUrl}${path}`);
    const msgString = timestamp + method + url.pathname;
    const signature = crypto.sign("RSA-SHA256", Buffer.from(msgString), {
      key: this.config.apiSecret,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
    });
    return {
      timestamp,
      signature: signature.toString("base64"),
    };
  }

  private async request(path: string, init?: RequestInit): Promise<any> {
    const method = init?.method ?? "GET";
    const { timestamp, signature } = this.sign(path, method);
    const response = await fetch(`${this.config.baseUrl}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
        "KALSHI-ACCESS-KEY": this.config.apiKey,
        "KALSHI-ACCESS-TIMESTAMP": timestamp,
        "KALSHI-ACCESS-SIGNATURE": signature,
      },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok) {
      throw new Error(`Kalshi request failed (${response.status}): ${text}`);
    }
    return data;
  }

  getBalance() {
    return this.request("/portfolio/balance");
  }

  getPositions(ticker?: string) {
    const search = new URLSearchParams();
    if (ticker) search.set("ticker", ticker);
    const suffix = search.size ? `?${search.toString()}` : "";
    return this.request(`/portfolio/positions${suffix}`);
  }

  getOrders() {
    return this.request("/portfolio/orders");
  }

  getFills() {
    return this.request("/portfolio/fills");
  }

  getMarkets(params: {
    limit?: number;
    cursor?: string;
    eventTicker?: string;
    seriesTicker?: string;
    status?: string;
    query?: string;
  }) {
    const search = new URLSearchParams();
    if (params.limit) search.set("limit", String(params.limit));
    if (params.cursor) search.set("cursor", params.cursor);
    if (params.eventTicker) search.set("event_ticker", params.eventTicker);
    if (params.seriesTicker) search.set("series_ticker", params.seriesTicker);
    if (params.status) search.set("status", params.status);
    if (params.query) search.set("tickers", params.query);
    const suffix = search.size ? `?${search.toString()}` : "";
    return this.request(`/markets${suffix}`);
  }

  getMarket(ticker: string) {
    return this.request(`/markets/${ticker}`);
  }

  getOrderbook(ticker: string, depth?: number) {
    const suffix = depth ? `?depth=${depth}` : "";
    return this.request(`/markets/${ticker}/orderbook${suffix}`);
  }

  getTrades(ticker?: string, limit?: number, cursor?: string) {
    const search = new URLSearchParams();
    if (limit) search.set("limit", String(limit));
    if (cursor) search.set("cursor", cursor);
    if (ticker) search.set("ticker", ticker);
    const suffix = search.size ? `?${search.toString()}` : "";
    return this.request(`/markets/trades${suffix}`);
  }

  createOrder(payload: Record<string, unknown>) {
    return this.request("/portfolio/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  cancelOrder(orderId: string) {
    return this.request(`/portfolio/orders/${orderId}`, {
      method: "DELETE",
    });
  }
}
