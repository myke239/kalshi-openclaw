from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from .storage import Storage


@dataclass
class MarketArmingRecord:
    market_id: str
    automation_allowed: bool = True
    max_exposure_dollars: float | None = None
    allowed_strategies_json: str | None = None
    stop_loss_pct: float | None = None
    take_profit_pct: float | None = None
    expires_mode: str = "market_close"
    expires_at: str | None = None
    created_by: str = "user"
    active: bool = True


@dataclass
class StrategyArmingRecord:
    strategy_id: str
    category_filters_json: str | None = None
    automation_allowed: bool = True
    max_per_trade_dollars: float | None = None
    max_per_market_exposure: float | None = None
    expires_mode: str = "market_close"
    expires_at: str | None = None
    created_by: str = "user"
    active: bool = True


class ArmingRepository:
    def __init__(self, storage: Storage) -> None:
        self.storage = storage

    def add_market_arming(self, record: MarketArmingRecord) -> None:
        with self.storage.connect() as connection:
            connection.execute(
                """
                INSERT INTO arming_market (
                    market_id, automation_allowed, max_exposure_dollars,
                    allowed_strategies_json, stop_loss_pct, take_profit_pct,
                    expires_mode, expires_at, created_by, active, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    record.market_id,
                    int(record.automation_allowed),
                    record.max_exposure_dollars,
                    record.allowed_strategies_json,
                    record.stop_loss_pct,
                    record.take_profit_pct,
                    record.expires_mode,
                    record.expires_at,
                    record.created_by,
                    int(record.active),
                    datetime.now(timezone.utc).isoformat(),
                ),
            )
            connection.commit()

    def add_strategy_arming(self, record: StrategyArmingRecord) -> None:
        with self.storage.connect() as connection:
            connection.execute(
                """
                INSERT INTO arming_strategy (
                    strategy_id, category_filters_json, automation_allowed,
                    max_per_trade_dollars, max_per_market_exposure,
                    expires_mode, expires_at, created_by, active, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    record.strategy_id,
                    record.category_filters_json,
                    int(record.automation_allowed),
                    record.max_per_trade_dollars,
                    record.max_per_market_exposure,
                    record.expires_mode,
                    record.expires_at,
                    record.created_by,
                    int(record.active),
                    datetime.now(timezone.utc).isoformat(),
                ),
            )
            connection.commit()

    def has_active_market_arming(self, market_id: str) -> bool:
        with self.storage.connect() as connection:
            row = connection.execute(
                "SELECT 1 FROM arming_market WHERE market_id = ? AND active = 1 LIMIT 1",
                (market_id,),
            ).fetchone()
        return row is not None

    def has_active_strategy_arming(self, strategy_id: str) -> bool:
        with self.storage.connect() as connection:
            row = connection.execute(
                "SELECT 1 FROM arming_strategy WHERE strategy_id = ? AND active = 1 LIMIT 1",
                (strategy_id,),
            ).fetchone()
        return row is not None

    def get_duplicate_open(self, market_id: str, strategy_id: str | None, side: str) -> dict[str, Any] | None:
        with self.storage.connect() as connection:
            row = connection.execute(
                """
                SELECT id, market_id, strategy_id, side, status, created_at
                FROM orders_audit
                WHERE market_id = ?
                  AND COALESCE(strategy_id, '') = COALESCE(?, '')
                  AND side = ?
                  AND action = 'place'
                  AND status IN ('approved', 'submitted', 'filled', 'open')
                ORDER BY id DESC
                LIMIT 1
                """,
                (market_id, strategy_id, side),
            ).fetchone()
        return dict(row) if row is not None else None
