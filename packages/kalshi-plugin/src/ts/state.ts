import { JsonStateStore } from "./storage.js";
import type { ArmMarketParams, ArmStrategyParams } from "./types.js";

export class LocalStateService {
  constructor(private readonly store: JsonStateStore) {}

  getState() {
    return this.store.read();
  }

  setKillSwitch(enabled: boolean, changedBy = "user") {
    const state = this.store.read();
    state.killSwitch = enabled;
    state.audit.push({
      type: "kill-switch",
      enabled,
      changedBy,
      createdAt: new Date().toISOString(),
    });
    this.store.write(state);
    return { ok: true, enabled };
  }

  armMarket(params: ArmMarketParams) {
    const state = this.store.read();
    state.armedMarkets = state.armedMarkets.filter((x: any) => x.ticker !== params.ticker);
    state.armedMarkets.push({
      ...params,
      createdAt: new Date().toISOString(),
      active: true,
    });
    state.audit.push({ type: "arm-market", params, createdAt: new Date().toISOString() });
    this.store.write(state);
    return { ok: true, armed: params };
  }

  armStrategy(params: ArmStrategyParams) {
    const state = this.store.read();
    state.armedStrategies = state.armedStrategies.filter((x: any) => x.strategyId !== params.strategyId);
    state.armedStrategies.push({
      ...params,
      createdAt: new Date().toISOString(),
      active: true,
    });
    state.audit.push({ type: "arm-strategy", params, createdAt: new Date().toISOString() });
    this.store.write(state);
    return { ok: true, armed: params };
  }

  disarmMarket(ticker: string) {
    const state = this.store.read();
    state.armedMarkets = state.armedMarkets.filter((x: any) => x.ticker !== ticker);
    state.audit.push({ type: "disarm-market", ticker, createdAt: new Date().toISOString() });
    this.store.write(state);
    return { ok: true, ticker };
  }

  disarmStrategy(strategyId: string) {
    const state = this.store.read();
    state.armedStrategies = state.armedStrategies.filter((x: any) => x.strategyId !== strategyId);
    state.audit.push({ type: "disarm-strategy", strategyId, createdAt: new Date().toISOString() });
    this.store.write(state);
    return { ok: true, strategyId };
  }

  isMarketArmed(ticker: string): boolean {
    return this.store.read().armedMarkets.some((x: any) => x.ticker === ticker);
  }

  isStrategyArmed(strategyId?: string): boolean {
    if (!strategyId) return false;
    return this.store.read().armedStrategies.some((x: any) => x.strategyId === strategyId);
  }

  hasDuplicateOpen(ticker: string, side: string, strategyId?: string): boolean {
    return this.store.read().audit.some(
      (x: any) =>
        x.type === "place-order" &&
        x.order?.ticker === ticker &&
        x.order?.side === side &&
        (x.order?.strategyId ?? null) === (strategyId ?? null),
    );
  }

  appendAudit(event: any) {
    const state = this.store.read();
    state.audit.push({ ...event, createdAt: new Date().toISOString() });
    this.store.write(state);
  }
}
