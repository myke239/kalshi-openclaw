from kalshi_plugin.models import PluginConfig
from kalshi_plugin.risk import OrderIntent, RiskExecutor


def test_kill_switch_blocks_opens() -> None:
    config = PluginConfig()
    config.risk.kill_switch = True
    result = RiskExecutor(config).authorize_open(
        OrderIntent(market_id="TEST", side="yes", contracts=1)
    )
    assert result.allowed is False
    assert "kill switch enabled" in result.reasons


def test_close_reduce_allows_positive_contracts() -> None:
    config = PluginConfig()
    result = RiskExecutor(config).authorize_close_or_reduce(
        OrderIntent(market_id="TEST", side="yes", contracts=1, opens_position=False)
    )
    assert result.allowed is True
