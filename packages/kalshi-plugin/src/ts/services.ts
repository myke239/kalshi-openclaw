import type { KalshiPluginConfig } from "./config.js";
import { createStateRoot, JsonStateStore } from "./storage.js";
import { normalizeConfig } from "./config.js";
import { KalshiClient } from "./client.js";
import { RiskEngine } from "./risk.js";
import { LocalStateService } from "./state.js";
import { summarizeBalance, summarizeOrders, summarizePositions } from "./summary.js";
import { buildCreateOrderPayload } from "./order-payload.js";
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
        return summarizeBalance(await client().getBalance());
      },
      async getPositions() {
        return summarizePositions(await client().getPositions());
      },
      async getOrders() {
        return summarizeOrders(await client().getOrders());
      },
      async getFills() {
        return await client().getFills();
      },
    },
    markets: {
      async searchMarkets(params: SearchMarketsParams) {
        return await client().getMarkets(params);
      },
      async getMarket(ticker: string) {
        return await client().getMarket(ticker);
      },
      async getOrderbook(ticker: string, depth?: number) {
        return await client().getOrderbook(ticker, depth);
      },
      async getTrades(ticker?: string, limit?: number, cursor?: string) {
        return await client().getTrades(ticker, limit, cursor);
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

        const payload = buildCreateOrderPayload(params);
        const result = await client().createOrder(payload);
        state.appendAudit({ type: "place-order", order: params, result });
        return result;
      },
      async cancelOrder(orderId: string) {
        const result = await client().cancelOrder(orderId);
        state.appendAudit({ type: "cancel-order", orderId, result });
        return result;
      },
      async reducePosition(params: { ticker: string; count: number; side: "yes" | "no"; clientOrderId?: string; yesPrice?: number; noPrice?: number }) {
        const payload = buildCreateOrderPayload({
          ticker: params.ticker,
          side: params.side,
          action: "sell",
          count: params.count,
          clientOrderId: params.clientOrderId,
          yesPrice: params.yesPrice,
          noPrice: params.noPrice,
          reduceOnly: true,
        });
        const result = await client().createOrder(payload);
        state.appendAudit({ type: "reduce-position", params, result });
        return result;
      },
      async closePosition(ticker: string) {
        const positions = await client().getPositions(ticker);
        const match = Array.isArray(positions?.market_positions)
          ? positions.market_positions.find((position: any) => position.ticker === ticker)
          : null;
        if (!match) {
          return { ok: false, reason: "no position found for ticker" };
        }

        const rawPosition = Number(match.position ?? match.position_fp ?? 0);
        if (!Number.isFinite(rawPosition) || rawPosition === 0) {
          return { ok: false, reason: "position size is zero" };
        }

        const side = rawPosition > 0 ? "yes" : "no";
        const count = Math.abs(Math.trunc(rawPosition));
        const payload = buildCreateOrderPayload({
          ticker,
          side,
          action: "sell",
          count,
          yesPrice: 0.01,
          noPrice: undefined,
          reduceOnly: true,
        });
        const result = await client().createOrder(payload);
        state.appendAudit({ type: "close-position", ticker, payload, result });
        return result;
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
        const result = await client().getMarkets({
          limit: params.count ?? 5,
          eventTicker: params.eventTicker,
          seriesTicker: params.seriesTicker,
          status: params.status ?? "open",
          query: params.query,
        });
        const markets = Array.isArray(result?.markets) ? result.markets : [];
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
