from __future__ import annotations

from importlib import resources

from .storage import Storage


def apply_all_migrations(storage: Storage) -> None:
    migration_package = "kalshi_plugin.migrations"
    migration_files = sorted(
        name
        for name in resources.contents(migration_package)
        if name.endswith(".sql")
    )

    for name in migration_files:
        sql_text = resources.read_text(migration_package, name, encoding="utf-8")
        storage.apply_migration(sql_text)
