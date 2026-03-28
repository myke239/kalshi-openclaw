from __future__ import annotations

import sqlite3
from pathlib import Path


class Storage:
    """SQLite-backed audit and state storage scaffold."""

    def __init__(self, db_path: str | Path) -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)

    def connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.db_path)
        connection.row_factory = sqlite3.Row
        return connection

    def apply_migration(self, sql_text: str) -> None:
        with self.connect() as connection:
            connection.executescript(sql_text)
            connection.commit()
