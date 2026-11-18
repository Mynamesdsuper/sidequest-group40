# Module `missions`

| | |
|---|---|
| Owner | P1 – Vincenzo Pio Lubrano |
| Requirements | R02, R03, R07 |
| Status | scaffold only (empty) |

## Responsibility
Missions, objectives, categories, publication, search and map data; the `MissionAccess` allow-list and the access policy (binds `MissionAccessPort` in R07).

## Public API (`index.ts`)
`getMissionForParticipation(missionId)`, `canView(viewer, missionId)`, `grantAccess(missionId, userId, source)`, `revokeAccess(missionId, userId, source)`. Contract: `docs/design/module-contracts.md`.

## Events
- Emitted: to be listed when implemented (catalogue: `backend/src/shared/events/domain-events.ts`).
- Consumed: to be listed when implemented.

## Layout
`index.ts` (register + public API) · `missions.routes.ts` · `missions.controller.ts` · `services/` · `domain/` (pure OOP classes) · `models/` · `dto/` · `missions.openapi.yaml`.
