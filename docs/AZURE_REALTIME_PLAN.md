# Azure Realtime Migration Plan

This branch is reserved for Azure voice migration.

## Branch
- `codex/azure-realtime-facilitator`

## Defaults
- Keep `GEMINI` as default provider until Azure realtime adapter is wired.

## Acceptance Gates
- `/api/health` returns 200
- live mic session connects
- transcript captured
- session-note write function still works
- diagnostics panel remains green for key/mic/network/session
