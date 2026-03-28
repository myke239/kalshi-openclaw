import { Type } from "@sinclair/typebox";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createKalshiServices } from "./src/ts/services.js";
import { toolResult } from "./src/ts/result.js";

export default definePluginEntry({
  id: "kalshi-plugin",
  name: "Kalshi Plugin",
  description: "Kalshi API integration plugin for OpenClaw with risk-gated trading workflows.",
  register(api) {
    const services = createKalshiServices(api);

    api.registerTool({
      label: "Kalshi account get",
      name: "kalshi_account_get",
      description: "Return account balance and buying power for the configured Kalshi account.",
      parameters: Type.Object({}),
      async execute(_id) {
        return toolResult(await services.account.getAccount());
      },
    });

    api.registerTool({
      label: "Kalshi positions list",
      name: "kalshi_positions_list",
      description: "List current positions for the configured Kalshi account.",
      parameters: Type.Object({}),
      async execute(_id) {
        return toolResult(await services.account.getPositions());
      },
    });

    api.registerTool({
      label: "Kalshi orders list",
      name: "kalshi_orders_list",
      description: "List current orders for the configured Kalshi account.",
      parameters: Type.Object({}),
      async execute(_id) {
        return toolResult(await services.account.getOrders());
      },
    });

    api.registerTool({
      label: "Kalshi fills list",
      name: "kalshi_fills_list",
      description: "List fills for the configured Kalshi account.",
      parameters: Type.Object({}),
      async execute(_id) {
        return toolResult(await services.account.getFills());
      },
    });

    api.registerTool({
      label: "Kalshi markets search",
      name: "kalshi_markets_search",
      description: "Search Kalshi markets by status, event, series, or ticker query.",
      parameters: Type.Object({
        query: Type.Optional(Type.String()),
        category: Type.Optional(Type.String()),
        status: Type.Optional(Type.String()),
        limit: Type.Optional(Type.Number()),
        cursor: Type.Optional(Type.String()),
        eventTicker: Type.Optional(Type.String()),
        seriesTicker: Type.Optional(Type.String()),
      }),
      async execute(_id, params) {
        return toolResult(await services.markets.searchMarkets(params));
      },
    });

    api.registerTool({
      label: "Kalshi market get",
      name: "kalshi_market_get",
      description: "Fetch detailed Kalshi market metadata.",
      parameters: Type.Object({
        ticker: Type.String(),
      }),
      async execute(_id, params) {
        return toolResult(await services.markets.getMarket(params.ticker));
      },
    });

    api.registerTool({
      label: "Kalshi market orderbook get",
      name: "kalshi_market_orderbook_get",
      description: "Fetch the current orderbook for a Kalshi market.",
      parameters: Type.Object({
        ticker: Type.String(),
        depth: Type.Optional(Type.Number()),
      }),
      async execute(_id, params) {
        return toolResult(await services.markets.getOrderbook(params.ticker, params.depth));
      },
    });

    api.registerTool({
      label: "Kalshi order preview",
      name: "kalshi_order_preview",
      description: "Preview an order against local risk gates without placing it.",
      parameters: Type.Object({
        ticker: Type.String(),
        side: Type.Union([Type.Literal("yes"), Type.Literal("no")]),
        action: Type.Union([Type.Literal("buy"), Type.Literal("sell")]),
        count: Type.Number(),
        yesPrice: Type.Optional(Type.Number()),
        noPrice: Type.Optional(Type.Number()),
        strategyId: Type.Optional(Type.String()),
        clientOrderId: Type.Optional(Type.String()),
        reduceOnly: Type.Optional(Type.Boolean()),
      }),
      async execute(_id, params) {
        return toolResult(await services.orders.previewOrder(params));
      },
    });

    api.registerTool({
      label: "Kalshi order place",
      name: "kalshi_order_place",
      description: "Place an order after environment, arming, and risk validation.",
      parameters: Type.Object({
        ticker: Type.String(),
        side: Type.Union([Type.Literal("yes"), Type.Literal("no")]),
        action: Type.Union([Type.Literal("buy"), Type.Literal("sell")]),
        count: Type.Number(),
        yesPrice: Type.Optional(Type.Number()),
        noPrice: Type.Optional(Type.Number()),
        strategyId: Type.Optional(Type.String()),
        clientOrderId: Type.Optional(Type.String()),
        reduceOnly: Type.Optional(Type.Boolean()),
      }),
      async execute(_id, params) {
        return toolResult(await services.orders.placeOrder(params));
      },
    });

    api.registerTool({
      label: "Kalshi order cancel",
      name: "kalshi_order_cancel",
      description: "Cancel an open Kalshi order.",
      parameters: Type.Object({
        orderId: Type.String(),
      }),
      async execute(_id, params) {
        return toolResult(await services.orders.cancelOrder(params.orderId));
      },
    });

    api.registerTool({
      label: "Kalshi position reduce",
      name: "kalshi_position_reduce",
      description: "Reduce an existing position using a reduce-only sell order.",
      parameters: Type.Object({
        ticker: Type.String(),
        side: Type.Union([Type.Literal("yes"), Type.Literal("no")]),
        count: Type.Number(),
        clientOrderId: Type.Optional(Type.String()),
      }),
      async execute(_id, params) {
        return toolResult(await services.orders.reducePosition(params));
      },
    });

    api.registerTool({
      label: "Kalshi position close",
      name: "kalshi_position_close",
      description: "Attempt to close an existing position for a market using a reduce-only sell order.",
      parameters: Type.Object({
        ticker: Type.String(),
      }),
      async execute(_id, params) {
        return toolResult(await services.orders.closePosition(params.ticker));
      },
    });

    api.registerTool({
      label: "Kalshi arm market",
      name: "kalshi_arm_market",
      description: "Arm a market for bounded automated or low-friction opening trades.",
      parameters: Type.Object({
        ticker: Type.String(),
        maxExposureDollars: Type.Optional(Type.Number()),
        expiryMode: Type.Optional(Type.String()),
        expiresAt: Type.Optional(Type.String()),
        createdBy: Type.Optional(Type.String()),
      }),
      async execute(_id, params) {
        return toolResult(services.controls.armMarket(params));
      },
    });

    api.registerTool({
      label: "Kalshi disarm market",
      name: "kalshi_disarm_market",
      description: "Disarm a market.",
      parameters: Type.Object({
        ticker: Type.String(),
      }),
      async execute(_id, params) {
        return toolResult(services.controls.disarmMarket(params.ticker));
      },
    });

    api.registerTool({
      label: "Kalshi arm strategy",
      name: "kalshi_arm_strategy",
      description: "Arm a strategy for bounded automated or low-friction opening trades.",
      parameters: Type.Object({
        strategyId: Type.String(),
        categoryFilters: Type.Optional(Type.Array(Type.String())),
        maxPerTradeDollars: Type.Optional(Type.Number()),
        maxPerMarketExposure: Type.Optional(Type.Number()),
        expiryMode: Type.Optional(Type.String()),
        expiresAt: Type.Optional(Type.String()),
        createdBy: Type.Optional(Type.String()),
      }),
      async execute(_id, params) {
        return toolResult(services.controls.armStrategy(params));
      },
    });

    api.registerTool({
      label: "Kalshi disarm strategy",
      name: "kalshi_disarm_strategy",
      description: "Disarm a strategy.",
      parameters: Type.Object({
        strategyId: Type.String(),
      }),
      async execute(_id, params) {
        return toolResult(services.controls.disarmStrategy(params.strategyId));
      },
    });

    api.registerTool({
      label: "Kalshi kill switch set",
      name: "kalshi_kill_switch_set",
      description: "Enable or disable the global kill switch for new opening trades.",
      parameters: Type.Object({
        enabled: Type.Boolean(),
      }),
      async execute(_id, params) {
        return toolResult(services.controls.setKillSwitch(params.enabled));
      },
    });

    api.registerTool({
      label: "Kalshi risk status get",
      name: "kalshi_risk_status_get",
      description: "Return current local risk, arming, and audit state.",
      parameters: Type.Object({}),
      async execute(_id) {
        return toolResult(services.controls.getRiskStatus());
      },
    });

    api.registerTool({
      label: "Kalshi opportunities rank",
      name: "kalshi_opportunities_rank",
      description: "Rank up to N Kalshi opportunities with suggested size and confidence.",
      parameters: Type.Object({
        query: Type.Optional(Type.String()),
        status: Type.Optional(Type.String()),
        count: Type.Optional(Type.Number()),
        eventTicker: Type.Optional(Type.String()),
        seriesTicker: Type.Optional(Type.String()),
      }),
      async execute(_id, params) {
        return toolResult(await services.analysis.rankOpportunities(params));
      },
    });
  },
});
