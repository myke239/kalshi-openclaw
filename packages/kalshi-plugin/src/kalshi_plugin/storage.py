class Storage:
    """SQLite-backed audit and state storage scaffold."""

    def connect(self) -> None:
        raise NotImplementedError("Storage not implemented yet")
