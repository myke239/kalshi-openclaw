from pathlib import Path

from kalshi_plugin.arming import ArmingRepository, MarketArmingRecord, StrategyArmingRecord
from kalshi_plugin.migrate import apply_all_migrations
from kalshi_plugin.storage import Storage


def test_apply_migrations_and_store_arming(tmp_path: Path) -> None:
    db_path = tmp_path / "kalshi.db"
    storage = Storage(db_path)
    apply_all_migrations(storage)

    repo = ArmingRepository(storage)
    repo.add_market_arming(MarketArmingRecord(market_id="MARKET-1"))
    repo.add_strategy_arming(StrategyArmingRecord(strategy_id="momentum"))

    assert repo.has_active_market_arming("MARKET-1") is True
    assert repo.has_active_strategy_arming("momentum") is True
