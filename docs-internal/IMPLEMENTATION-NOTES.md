# Implementation Notes

## First pass completed
- plugin config datamodel scaffold
- tool schema draft
- SQLite initial migration scaffold
- storage helper scaffold
- risk executor skeleton
- skill reference expansion
- local Python dev setup scaffold via pyproject optional dependencies

## Environment note
Current host Python is 3.9, so package metadata has been aligned to `>=3.9` for local development.

## Immediate next tasks
1. replace placeholder config loading with validated file parsing
2. implement migration runner
3. add arming repository and duplicate-trade checks
4. implement Kalshi signed client
5. define concrete plugin tool registration layer
