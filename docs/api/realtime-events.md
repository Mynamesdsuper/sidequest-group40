# Realtime events (PROPOSED draft, frozen in Sprint 0 by task S0-EVENTS, owner P2)

Transport: Socket.IO 4 on the same HTTP server as the REST API. The JWT is sent in `auth.token` during the handshake (implemented in task R06A). Invalid or outdated tokens (`tokenVersion` mismatch) are refused at connection time.

## Server → client

| Event | Payload | Room / target | Producer |
|---|---|---|---|
| `notification:new` | `{ id, type, payload, createdAt }` | user room `user:<userId>` | notifications (P2) |
| `participation:updated` | `{ participationId, status, deadlineAt?, serverNow }` | user room, or team room | participations (P2) |
| `team-progress:update` | `{ participationId, seq, event, state }` | team room `team-participation:<id>` | teams (P3) |
| `team-progress:presence` | `{ participationId, online: string[] }` | team room | teams (P3) |

## Client → server

| Event | Payload | Ack |
|---|---|---|
| `team-progress:join` | `{ participationId }` | `{ ok: boolean, lastSeq?: number }` |
| `team-progress:leave` | `{ participationId }` | `{ ok: boolean }` |

`join` is authorized through `TeamMembershipPort`: a non-member gets `{ ok: false }` and never receives events.

## Ordering and reconnection protocol (A-21)

1. Every state change appends a `TeamProgressEvent` with a strictly increasing per-participation `seq` **in the same DB transaction**; the server emits only **after** the commit.
2. The client keeps `lastSeq` and applies an update only if `seq = lastSeq + 1`. Duplicates (`seq ≤ lastSeq`) are ignored.
3. On a gap (`seq > lastSeq + 1`) or on any reconnection, the client calls `GET /api/v1/team-participations/:id`, which returns the full state plus `lastSeq`, replaces its state and resumes.
4. Concurrent submissions on one objective are serialized by optimistic locking (`version`): the loser gets 409 with the latest state.

## Notification types (A-15)

`mission.accepted`, `participation.status.changed`, `proof.reviewed`, `invitation.received`, `invitation.responded`, `invitation.revoked`, `waitlist.offered`, `waitlist.offer.expired`, `team.invitation.received`, `team.member.joined`, `team.member.left`, optionally `participation.time.warning` (5 minutes left).
