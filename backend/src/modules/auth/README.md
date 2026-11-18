# Module `auth`

| | |
|---|---|
| Owner | P1 – Vincenzo Pio Lubrano |
| Requirements | R01 |
| Status | scaffold only (empty) |

## Responsibility
Register, login, logout with JWT (`tokenVersion`, A-02) and the authentication middleware exported to every module: `requireAuth`, `optionalAuth`, `requireRole(role)`.

## Public API (`index.ts`)
Middleware `requireAuth`, `optionalAuth`, `requireRole(role)`. Contract: `docs/design/module-contracts.md`.

## Events
- Emitted: to be listed when implemented (catalogue: `backend/src/shared/events/domain-events.ts`).
- Consumed: to be listed when implemented.

## Layout
`index.ts` (register + public API) · `auth.routes.ts` · `auth.controller.ts` · `services/` · `domain/` (pure OOP classes) · `models/` · `dto/` · `auth.openapi.yaml`.
