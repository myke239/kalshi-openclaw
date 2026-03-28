TOOL_SCHEMAS = {
    "kalshi_account_get": {
        "description": "Return account balance and buying power for the configured Kalshi account.",
        "input": {}
    },
    "kalshi_portfolio_get": {
        "description": "Return portfolio summary including exposure and open positions.",
        "input": {}
    },
    "kalshi_positions_list": {
        "description": "List open or closed positions.",
        "input": {
            "status": {"type": "string", "enum": ["open", "closed", "all"], "required": False}
        }
    },
    "kalshi_markets_search": {
        "description": "Search Kalshi markets by keyword, category, or status.",
        "input": {
            "query": {"type": "string", "required": False},
            "category": {"type": "string", "required": False},
            "status": {"type": "string", "required": False}
        }
    },
    "kalshi_market_get": {
        "description": "Fetch detailed market metadata and rules for a market.",
        "input": {
            "market_id": {"type": "string", "required": True}
        }
    },
    "kalshi_market_orderbook_get": {
        "description": "Fetch current orderbook depth for a market.",
        "input": {
            "market_id": {"type": "string", "required": True}
        }
    },
    "kalshi_order_preview": {
        "description": "Preview an order against the central risk executor without placing it.",
        "input": {
            "market_id": {"type": "string", "required": True},
            "side": {"type": "string", "required": True},
            "contracts": {"type": "number", "required": True},
            "price": {"type": "number", "required": False},
            "strategy_id": {"type": "string", "required": False}
        }
    },
    "kalshi_order_place": {
        "description": "Place an order after passing environment, arming, and risk checks.",
        "input": {
            "market_id": {"type": "string", "required": True},
            "side": {"type": "string", "required": True},
            "contracts": {"type": "number", "required": True},
            "price": {"type": "number", "required": False},
            "strategy_id": {"type": "string", "required": False}
        }
    },
    "kalshi_order_cancel": {
        "description": "Cancel a single open order.",
        "input": {
            "order_id": {"type": "string", "required": True}
        }
    },
    "kalshi_position_close": {
        "description": "Close an existing position, subject to close/reduce policy.",
        "input": {
            "market_id": {"type": "string", "required": True}
        }
    },
    "kalshi_arm_market": {
        "description": "Arm a market for bounded automated or low-friction opening trades until expiry.",
        "input": {
            "market_id": {"type": "string", "required": True},
            "max_exposure_dollars": {"type": "number", "required": False},
            "expiry_mode": {"type": "string", "required": False}
        }
    },
    "kalshi_arm_strategy": {
        "description": "Arm a strategy for matching markets until expiry.",
        "input": {
            "strategy_id": {"type": "string", "required": True},
            "category_filters": {"type": "array", "required": False},
            "expiry_mode": {"type": "string", "required": False}
        }
    },
    "kalshi_kill_switch_set": {
        "description": "Enable or disable the global kill switch for new opening trades.",
        "input": {
            "enabled": {"type": "boolean", "required": True}
        }
    },
    "kalshi_opportunities_rank": {
        "description": "Rank up to N Kalshi opportunities with suggested size and confidence.",
        "input": {
            "category": {"type": "string", "required": False},
            "count": {"type": "integer", "required": False},
            "strategy_id": {"type": "string", "required": False}
        }
    },
    "kalshi_position_size_suggest": {
        "description": "Suggest position sizing using configured risk defaults and opportunity confidence.",
        "input": {
            "market_id": {"type": "string", "required": True},
            "confidence": {"type": "number", "required": False},
            "strategy_id": {"type": "string", "required": False}
        }
    }
}
