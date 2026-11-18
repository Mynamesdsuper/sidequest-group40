# Module `dashboard`

| | |
|---|---|
| Owner | P2 – Matteo Marino |
| Requirements | R06 |
| Status | scaffold only (empty) |

## Responsibility
Personal area: aggregates (read only) the public APIs of `missions` and `participations`.

## Public API (`index.ts`)
None. Contract: `docs/design/module-contracts.md`.

## Events
- Emitted: to be listed when implemented (catalogue: `backend/src/shared/events/domain-events.ts`).
- Consumed: to be listed when implemented.

## Layout
`index.ts` (register + public API) · `dashboard.routes.ts` · `dashboard.controller.ts` · `services/` · `domain/` (pure OOP classes) · `models/` · `dto/` · `dashboard.openapi.yaml`.
