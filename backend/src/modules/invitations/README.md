# Module `invitations`

| | |
|---|---|
| Owner | P3 – Domenico Panaro |
| Requirements | R08 |
| Status | scaffold only (empty) |

## Responsibility
Invitations to RESTRICTED missions (A-17); accepting grants access through `missions.grantAccess`.

## Public API (`index.ts`)
None planned. Contract: `docs/design/module-contracts.md`.

## Events
- Emitted: to be listed when implemented (catalogue: `backend/src/shared/events/domain-events.ts`).
- Consumed: to be listed when implemented.

## Layout
`index.ts` (register + public API) · `invitations.routes.ts` · `invitations.controller.ts` · `services/` · `domain/` (pure OOP classes) · `models/` · `dto/` · `invitations.openapi.yaml`.
