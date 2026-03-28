import type { KalshiPluginConfig } from "./config.js";
import { LocalStateService } from "./state.js";
import type { OrderParams, RiskResult } from "./types.js";

export class RiskEngine {
  constructor(
    private readonly config: KalshiPluginConfig,
    private readonly state: LocalStateService,
  ) {}

  previewOpen(order: OrderParams): RiskResult {
    const reasons: string[] = [];

    if (order.count <= 0) reasons.push("count must be greater than zero");
    if (this.state.getState().killSwitch) reasons.push("kill switch enabled");
    if (this.config.environment === "production" && !this.config.productionEnabled) {
      reasons.push("production trading is not enabled");
    }
    if (!this.state.isMarketArmed(order.ticker) && !this.state.isStrategyArmed(order.strategyId)) {
      reasons.push("market or strategy must be armed before opening positions");
    }
    if (this.state.hasDuplicateOpen(order.ticker, order.side, order.strategyId)) {
      reasons.push("duplicate trade prevented for same market + strategy + side");
    }

    return { allowed: reasons.length === 0, reasons };
  }
}
