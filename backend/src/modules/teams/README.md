# Module `teams`

| | |
|---|---|
| Owner | P3 – Domenico Panaro |
| Requirements | R10, R11, R12 |
| Status | scaffold only (empty) |

## Responsibility
Teams, membership and team invitations (R10), team participation wrapping the `participations` public API (R11), the progress event log and the live rooms (R12); binds `TeamMembershipPort`.

## Public API (`index.ts`)
`isMember(teamId, userId)`, `isAdmin(teamId, userId)`, `membersOf(teamId)`. Contract: `docs/design/module-contracts.md`.

## Events
- Emitted: to be listed when implemented (catalogue: `backend/src/shared/events/domain-events.ts`).
- Consumed: to be listed when implemented.

## Layout
`index.ts` (register + public API) · `teams.routes.ts` · `teams.controller.ts` · `services/` · `domain/` (pure OOP classes) · `models/` · `dto/` · `teams.openapi.yaml`.
