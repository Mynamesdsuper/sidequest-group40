# Module `notifications`

| | |
|---|---|
| Owner | P2 – Matteo Marino |
| Requirements | R06 |
| Status | scaffold only (empty) |

## Responsibility
Notification persistence and REST, the Socket.IO gateway with the JWT handshake; binds the real `NotifierPort` and `RealtimePort`.

## Public API (`index.ts`)
None: other modules notify through `NotifierPort` and `RealtimePort`. Contract: `docs/design/module-contracts.md`.

## Events
- Emitted: to be listed when implemented (catalogue: `backend/src/shared/events/domain-events.ts`).
- Consumed: to be listed when implemented.

## Layout
`index.ts` (register + public API) · `notifications.routes.ts` · `notifications.controller.ts` · `services/` · `domain/` (pure OOP classes) · `models/` · `dto/` · `notifications.openapi.yaml`.
