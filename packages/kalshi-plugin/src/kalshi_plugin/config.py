from __future__ import annotations

from pathlib import Path

from .models import PluginConfig


def load_default_config() -> PluginConfig:
    return PluginConfig()


def resolve_db_path(config: PluginConfig) -> Path:
    return Path(config.storage.path).expanduser().resolve()
