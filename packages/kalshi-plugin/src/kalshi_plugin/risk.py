class RiskExecutor:
    """Central risk gate scaffold for order authorization."""

    def authorize_open(self) -> bool:
        raise NotImplementedError("Risk rules not implemented yet")
