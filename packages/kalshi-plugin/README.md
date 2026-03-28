# kalshi-plugin

Private-first OpenClaw plugin scaffold for Kalshi API integration.

## Planned v1
- signed auth client
- sandbox / production environment separation
- account, portfolio, and market tools
- order preview / place / cancel / reduce / close
- central risk executor
- market / strategy arming
- kill switch
- SQLite audit trail
- opportunity ranking and size suggestion helpers

## Current scaffold
- config model draft
- tool schema draft
- SQLite migration scaffold
- initial risk gate skeleton

## Dev setup

Create a virtual environment and install dev dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -e .[dev]
.\.venv\Scripts\python.exe -m pytest
```
