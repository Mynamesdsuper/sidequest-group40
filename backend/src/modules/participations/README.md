# Module `participations`

| | |
|---|---|
| Owner | P2 – Matteo Marino |
| Requirements | R04, R05, R09 |
| Status | scaffold only (empty) |

## Responsibility
Acceptance, server-authoritative timer, progress, proofs, reviews, outcome, points ledger, capacity and waitlist. Supports `participantType: USER | TEAM` from day one so that R11 can build on it (binds `ParticipationQueryPort`).

## Public API (`index.ts`)
`accept`, `getForViewer`, `submitObjective`, `abandon`, `review` (signatures in `docs/design/module-contracts.md`). Contract: `docs/design/module-contracts.md`.

## Events
- Emitted: to be listed when implemented (catalogue: `backend/src/shared/events/domain-events.ts`).
- Consumed: to be listed when implemented.

## Layout
`index.ts` (register + public API) · `participations.routes.ts` · `participations.controller.ts` · `services/` · `domain/` (pure OOP classes) · `models/` · `dto/` · `participations.openapi.yaml`.
