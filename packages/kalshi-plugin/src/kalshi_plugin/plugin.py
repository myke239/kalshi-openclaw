class Plugin:
    """OpenClaw Kalshi plugin scaffold.

    Real tool registration and runtime integration will be added after the
    concrete plugin API and auth flow are implemented.
    """

    def __init__(self) -> None:
        self.name = "kalshi-plugin"
