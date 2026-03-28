from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml

from .models import PluginConfig


def load_default_config() -> PluginConfig:
    return PluginConfig()


def load_config_file(path: str | Path) -> dict[str, Any]:
    config_path = Path(path)
    with config_path.open("r", encoding="utf-8") as handle:
        data = yaml.safe_load(handle) or {}
    if not isinstance(data, dict):
        raise ValueError("config file must contain a mapping at the top level")
    return data


def resolve_db_path(config: PluginConfig) -> Path:
    return Path(config.storage.path).expanduser().resolve()
