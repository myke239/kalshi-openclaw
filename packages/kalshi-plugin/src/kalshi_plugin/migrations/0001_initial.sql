CREATE TABLE IF NOT EXISTS config_revisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    revision_label TEXT NOT NULL,
    payload_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS arming_market (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    market_id TEXT NOT NULL,
    automation_allowed INTEGER NOT NULL DEFAULT 1,
    max_exposure_dollars REAL,
    allowed_strategies_json TEXT,
    stop_loss_pct REAL,
    take_profit_pct REAL,
    expires_mode TEXT NOT NULL,
    expires_at TEXT,
    created_by TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS arming_strategy (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    strategy_id TEXT NOT NULL,
    category_filters_json TEXT,
    automation_allowed INTEGER NOT NULL DEFAULT 1,
    max_per_trade_dollars REAL,
    max_per_market_exposure REAL,
    expires_mode TEXT NOT NULL,
    expires_at TEXT,
    created_by TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT,
    market_id TEXT NOT NULL,
    strategy_id TEXT,
    side TEXT NOT NULL,
    contracts REAL NOT NULL,
    price REAL,
    action TEXT NOT NULL,
    status TEXT NOT NULL,
    details_json TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS fills_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fill_id TEXT,
    order_id TEXT,
    market_id TEXT NOT NULL,
    side TEXT NOT NULL,
    contracts REAL NOT NULL,
    price REAL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS positions_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    market_id TEXT NOT NULL,
    snapshot_json TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pnl_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    realized_pnl REAL,
    unrealized_pnl REAL,
    snapshot_json TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS risk_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    market_id TEXT,
    strategy_id TEXT,
    details_json TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS kill_switch_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enabled INTEGER NOT NULL,
    changed_by TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS analysis_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    strategy_id TEXT,
    request_json TEXT NOT NULL,
    result_json TEXT NOT NULL,
    created_at TEXT NOT NULL
);
