from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Literal

EnvironmentName = Literal["sandbox", "production"]
ExpiryMode = Literal["market_close", "timestamp", "no_open_positions", "manual"]
StrategyName = Literal["event-driven", "momentum", "edge-hunting"]
CategoryName = Literal["politics", "crypto", "weather"]


@dataclass
class StorageConfig:
    driver: Literal["sqlite"] = "sqlite"
    path: Path = Path("./data/kalshi.db")


@dataclass
class RiskDefaults:
    max_per_trade_dollars: float = 50.0
    max_per_market_exposure: float = 200.0
    max_daily_loss: float = 100.0
    stop_loss_pct: float = 20.0
    take_profit_pct: float = 35.0
    correlation_caps_enabled: bool = True


@dataclass
class RiskConfig:
    kill_switch: bool = False
    duplicate_trade_prevention: bool = True
    close_reduce_without_approval: bool = True
    opening_requires_arming: bool = True
    duplicate_key_same_market: bool = True
    duplicate_key_same_strategy: bool = True
    duplicate_key_same_side: bool = True
    defaults: RiskDefaults = field(default_factory=RiskDefaults)


@dataclass
class ArmingConfig:
    enabled: bool = True
    default_expiry: ExpiryMode = "market_close"
    permit_if_market_armed: bool = True
    permit_if_strategy_armed: bool = True
    permit_mode: Literal["either"] = "either"


@dataclass
class AnalysisConfig:
    default_opportunity_count: int = 5
    include_confidence: bool = True
    include_reasoning_by_default: bool = False
    tuned_categories: list[CategoryName] = field(default_factory=lambda: ["politics", "crypto", "weather"])
    enabled_strategies: list[StrategyName] = field(default_factory=lambda: ["event-driven", "momentum", "edge-hunting"])


@dataclass
class CredentialConfig:
    api_key: str = ""
    api_secret: str = ""


@dataclass
class EnvironmentConfig:
    environment: EnvironmentName = "sandbox"
    production_enabled: bool = False


@dataclass
class PluginConfig:
    environment: EnvironmentConfig = field(default_factory=EnvironmentConfig)
    credentials: CredentialConfig = field(default_factory=CredentialConfig)
    storage: StorageConfig = field(default_factory=StorageConfig)
    risk: RiskConfig = field(default_factory=RiskConfig)
    arming: ArmingConfig = field(default_factory=ArmingConfig)
    analysis: AnalysisConfig = field(default_factory=AnalysisConfig)
