# Module `users`

| | |
|---|---|
| Owner | P1 – Vincenzo Pio Lubrano |
| Requirements | R01 |
| Status | scaffold only (empty) |

## Responsibility
Own profile, public profile (A-03) and admin user management (A-04).

## Public API (`index.ts`)
`getPublicProfile(id)`, `findByNickname(nickname)`. Contract: `docs/design/module-contracts.md`.

## Events
- Emitted: to be listed when implemented (catalogue: `backend/src/shared/events/domain-events.ts`).
- Consumed: to be listed when implemented.

## Layout
`index.ts` (register + public API) · `users.routes.ts` · `users.controller.ts` · `services/` · `domain/` (pure OOP classes) · `models/` · `dto/` · `users.openapi.yaml`.
