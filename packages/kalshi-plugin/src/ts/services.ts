import type { KalshiPluginConfig } from "./config.js";
import { createStateRoot, JsonStateStore } from "./storage.js";
import { normalizeConfig } from "./config.js";
import { KalshiClient } from "./client.js";
import { RiskEngine } from "./risk.js";
import { LocalStateService } from "./state.js";
import { summarizeBalance, summarizeOrders, summarizePositions } from "./summary.js";
import type {
  ArmMarketParams,
  ArmStrategyParams,
  OrderParams,
  SearchMarketsParams,
} from "./types.js";

function getPluginConfig(api: { config?: unknown }): KalshiPluginConfig {
  return normalizeConfig((api.config ?? {}) as Partial<KalshiPluginConfig>);
}

function requireCredentials(config: KalshiPluginConfig): void {
  if (!config.apiKey || !config.apiSecret) {
    throw new Error("Kalshi plugin is missing apiKey or apiSecret in plugin config");
  }
}

function invertSide(side: "yes" | "no"): "yes" | "no" {
  return side === "yes" ? "no" : "yes";
}

export function createKalshiServices(api: { config?: unknown }) {
  const config = getPluginConfig(api);
  const state = new LocalStateService(new JsonStateStore(createStateRoot()));
  const risk = new RiskEngine(config, state);

  function client(): KalshiClient {
    requireCredentials(config);
    return new KalshiClient(config);
  }

  return {
    account: {
      async getAccount() {
        const result = await client().portfolio.getBalance();
        return summarizeBalance(result.data);
      },
      async getPositions() {
        const result = await client().portfolio.getPositions();
        return summarizePositions(result.data);
      },
      async getOrders() {
        const result = await client().orders.getOrders();
        return summarizeOrders(result.data);
      },
      async getFills() {
        const result = await client().portfolio.getFills();
        return result.data;
      },
    },
    markets: {
      async searchMarkets(params: SearchMarketsParams) {
        const result = await client().markets.getMarkets(
          params.limit,
          params.cursor,
          params.eventTicker,
          params.seriesTicker,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          params.status,
          params.query,
        );
        return result.data;
      },
      async getMarket(ticker: string) {
        const result = await client().markets.getMarket(ticker);
        return result.data;
      },
      async getOrderbook(ticker: string, depth?: number) {
        const result = await client().markets.getMarketOrderbook(ticker, depth);
        return result.data;
      },
      async getTrades(ticker?: string, limit?: number, cursor?: string) {
        const result = await client().markets.getTrades(limit, cursor, ticker);
        return result.data;
      },
    },
    orders: {
      async previewOrder(params: OrderParams) {
        return {
          ok: true,
          risk: risk.previewOpen(params),
          order: params,
        };
      },
      async placeOrder(params: OrderParams) {
        const riskResult = risk.previewOpen(params);
        if (!riskResult.allowed) {
          state.appendAudit({ type: "place-order-rejected", order: params, risk: riskResult });
          return { ok: false, risk: riskResult };
        }

        const payload = {
          ticker: params.ticker,
          side: params.side,
          action: params.action,
          count: params.count,
          yes_price: params.yesPrice,
          no_price: params.noPrice,
          client_order_id: params.clientOrderId,
          reduce_only: params.reduceOnly,
        };

        const result = await client().orders.createOrder(payload as any);
        state.appendAudit({ type: "place-order", order: params, result: result.data });
        return result.data;
      },
      async cancelOrder(orderId: string) {
        const result = await client().orders.cancelOrder(orderId);
        state.appendAudit({ type: "cancel-order", orderId, result: result.data });
        return result.data;
      },
      async reducePosition(params: { ticker: string; count: number; side: "yes" | "no"; clientOrderId?: string }) {
        const payload = {
          ticker: params.ticker,
          side: params.side,
          action: "sell",
          count: params.count,
          client_order_id: params.clientOrderId,
          reduce_only: true,
        };
        const result = await client().orders.createOrder(payload as any);
        state.appendAudit({ type: "reduce-position", params, result: result.data });
        return result.data;
      },
      async closePosition(ticker: string) {
        const positions = await client().portfolio.getPositions(undefined, undefined, undefined, ticker);
        const match = positions.data.market_positions?.find((position: any) => position.ticker === ticker);
        if (!match) {
          return { ok: false, reason: "no position found for ticker" };
        }

        const rawPosition = Number(match.position_fp ?? 0);
        if (!Number.isFinite(rawPosition) || rawPosition === 0) {
          return { ok: false, reason: "position size is zero" };
        }

        const side = rawPosition > 0 ? "yes" : "no";
        const count = Math.abs(Math.trunc(rawPosition));
        const payload = {
          ticker,
          side,
          action: "sell",
          count,
          reduce_only: true,
        };
        const result = await client().orders.createOrder(payload as any);
        state.appendAudit({ type: "close-position", ticker, payload, result: result.data });
        return result.data;
      },
    },
    controls: {
      getRiskStatus() {
        return state.getState();
      },
      setKillSwitch(enabled: boolean) {
        return state.setKillSwitch(enabled);
      },
      armMarket(params: ArmMarketParams) {
        return state.armMarket(params);
      },
      armStrategy(params: ArmStrategyParams) {
        return state.armStrategy(params);
      },
      disarmMarket(ticker: string) {
        return state.disarmMarket(ticker);
      },
      disarmStrategy(strategyId: string) {
        return state.disarmStrategy(strategyId);
      },
    },
    analysis: {
      async rankOpportunities(params: SearchMarketsParams & { count?: number }) {
        const result = await client().markets.getMarkets(
          params.count ?? 5,
          undefined,
          params.eventTicker,
          params.seriesTicker,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          params.status ?? "open",
          params.query,
        );
        const markets = Array.isArray((result.data as any)?.markets) ? (result.data as any).markets : [];
        const ranked = markets.slice(0, params.count ?? 5).map((market: any, index: number) => ({
          rank: index + 1,
          ticker: market.ticker,
          title: market.title ?? market.subtitle ?? market.ticker,
          confidence: Math.max(0.5, 0.9 - index * 0.05),
          suggestedSizeDollars: 25,
          yesBidDollars: market.yes_bid_dollars,
          yesAskDollars: market.yes_ask_dollars,
          noBidDollars: market.no_bid_dollars,
          noAskDollars: market.no_ask_dollars,
        }));
        state.appendAudit({ type: "analysis-run", params, ranked });
        return { ok: true, ranked };
      },
    },
  };
}
