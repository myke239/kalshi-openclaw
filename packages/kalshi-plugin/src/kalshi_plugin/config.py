from dataclasses import dataclass


@dataclass(slots=True)
class EnvironmentConfig:
    environment: str = "sandbox"
    production_enabled: bool = False


@dataclass(slots=True)
class CredentialConfig:
    api_key: str = ""
    api_secret: str = ""
