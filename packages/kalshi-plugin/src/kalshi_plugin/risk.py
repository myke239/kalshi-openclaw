from __future__ import annotations

from dataclasses import dataclass

from .models import PluginConfig


@dataclass
class OrderIntent:
    market_id: str
    side: str
    contracts: float
    price: float | None = None
    strategy_id: str | None = None
    opens_position: bool = True


@dataclass
class AuthorizationResult:
    allowed: bool
    reasons: list[str]


class RiskExecutor:
    """Central risk gate scaffold for order authorization."""

    def __init__(self, config: PluginConfig) -> None:
        self.config = config

    def authorize_open(self, intent: OrderIntent) -> AuthorizationResult:
        reasons: list[str] = []

        if self.config.risk.kill_switch:
            reasons.append("kill switch enabled")

        if (
            self.config.environment.environment == "production"
            and not self.config.environment.production_enabled
        ):
            reasons.append("production environment not enabled")

        if self.config.risk.opening_requires_arming:
            reasons.append("arming verification not implemented")

        if intent.contracts <= 0:
            reasons.append("contracts must be greater than zero")

        return AuthorizationResult(allowed=not reasons, reasons=reasons)

    def authorize_close_or_reduce(self, intent: OrderIntent) -> AuthorizationResult:
        reasons: list[str] = []
        if intent.contracts <= 0:
            reasons.append("contracts must be greater than zero")
        return AuthorizationResult(allowed=not reasons, reasons=reasons)
