# Realtime events (FROZEN by S0-EVENTS, owner P2)

This document is the contract for three things: the **domain events** on the in-process bus, the **Socket.IO events** seen by the browser, and the **notification types**. The TypeScript source of truth is `backend/src/shared/events/domain-events.ts` (domain events) and `backend/src/shared/ports/ports.ts` (`NotificationType`, ports). Changing anything here needs a contract-change.

## 1. Domain events (in-process bus, Observer)

Rules:
- The owning module publishes an event **only after the DB commit**, so a subscriber never sees a change that was rolled back.
- Payloads carry **IDs and small facts**, never objective titles, descriptions, answers or proofs (A-07). A subscriber that needs more asks the owner's public API or a port.
- `Participant` is `{ type: 'USER', userId } | { type: 'TEAM', teamId }` (R11 works from day one). Recipients of a team are resolved at delivery time with `TeamMembershipPort.membersOf(teamId)`: the **current members** (decision 5b in `module-contracts.md`).
- Times are `Date` values from `Clock`.

| Event | Payload | Producer | Main subscribers |
|---|---|---|---|
| `user.registered` | `{ userId }` | auth (P1) | none yet |
| `mission.published` | `{ missionId, authorId }` | missions (P1) | none yet |
| `mission.updated` | `{ missionId, authorId }` | missions (P1) | none yet |
| `mission.closed` | `{ missionId, authorId, by: AUTHOR \| ADMIN \| SUSPENSION }` | missions (P1) | participations: cancel WAITING/OFFERED waitlist entries (R09) |
| `mission.access.granted` | `{ missionId, userId, source: MANUAL \| INVITE }` | missions (P1, `MissionAccessPort`) | none yet |
| `mission.access.revoked` | `{ missionId, userId, source }` | missions (P1, `MissionAccessPort`) | participations: drop the user's waitlist entry (R09) |
| `participation.accepted` | `{ participationId, missionId, authorId, participant, attemptNo, deadlineAt }` | participations (P2) | notifications → `mission.accepted` to the author |
| `participation.objective.submitted` | `{ participationId, missionId, authorId, objectiveId, contributorId, needsReview }` | participations (P2) | none yet (the author sees the review queue) |
| `participation.objective.reviewed` | `{ participationId, missionId, participant, objectiveId, verdict: APPROVED \| REJECTED }` | participations (P2) | notifications → `proof.reviewed` |
| `participation.status.changed` | `{ participationId, missionId, authorId, participant, from, to }` | participations (P2) | notifications → `participation.status.changed`; participations: offer the freed slot when `to` is ABANDONED, EXPIRED or FAILED (A-18) |
| `waitlist.offered` | `{ entryId, missionId, participant, offerExpiresAt }` | participations (P2) | notifications → `waitlist.offered` |
| `waitlist.offer.expired` | `{ entryId, missionId, participant }` | participations (P2) | notifications → `waitlist.offer.expired` |
| `invitation.created` | `{ invitationId, missionId, inviterId, inviteeId }` | invitations (P3) | notifications → `invitation.received` |
| `invitation.responded` | `{ invitationId, missionId, inviterId, inviteeId, response: ACCEPTED \| DECLINED }` | invitations (P3) | notifications → `invitation.responded` to the inviter |
| `invitation.revoked` | `{ invitationId, missionId, inviterId, inviteeId }` | invitations (P3) | notifications → `invitation.revoked` to the invitee |
| `team.invitation.created` | `{ invitationId, teamId, inviterId, inviteeId }` | teams (P3) | notifications → `team.invitation.received` |
| `team.invitation.responded` | `{ invitationId, teamId, inviterId, inviteeId, response }` | teams (P3) | none yet (a join also emits `team.member.joined`) |
| `team.member.joined` | `{ teamId, userId }` | teams (P3) | notifications → `team.member.joined` to the other members |
| `team.member.left` | `{ teamId, userId, by: SELF \| ADMIN }` | teams (P3) | notifications → `team.member.left`; teams: remove the user from the rooms of the team's participations (`RealtimePort.leaveRoom`) |
| `team.progress.updated` | `{ participationId, teamId, seq }` | teams (P3), after the commit of the `onCommit` hook | teams: emit `team-progress:update` |

## 2. Socket.IO

Transport: Socket.IO 4 on the same HTTP server as the REST API (ADR 0004).

**Handshake.** The client sends the JWT in `auth.token`. The server checks it like `requireAuth` (signature, expiry, `tokenVersion`, not suspended); on failure the connection is refused with `connect_error` message `UNAUTHORIZED`. Logout (A-02) disconnects the user's sockets. The `notifications` module owns the gateway (R06A) and binds `RealtimePort`.

**Rooms.**
| Room | Joined | Used for |
|---|---|---|
| `user:<userId>` | automatically, on every connection of that user (all tabs and devices) | `notification:new`, `participation:updated` |
| `team-participation:<participationId>` | only through `team-progress:join` | `team-progress:update`, `team-progress:presence` |

Socket.IO forgets rooms on reconnection: the client sends `team-progress:join` again after every `connect`.

### Server → client
| Event | Payload | Room | Producer |
|---|---|---|---|
| `notification:new` | `{ id, type, payload, createdAt }` (the same item as `GET /me/notifications`) | `user:<recipientId>` | notifications (P2) |
| `participation:updated` | `{ participationId, missionId, status, version, deadlineAt, serverNow }` | `user:<id>` of the participant; for a team, of every current member | participations (P2) |
| `team-progress:update` | `{ participationId, seq, event: { type, objectiveId?, actorId }, state }` (`state` = the body of `GET /team-participations/:id` without `lastSeq`) | `team-participation:<id>` | teams (P3) |
| `team-progress:presence` | `{ participationId, online: string[] }` (user IDs) | `team-participation:<id>` | teams (P3) |

Times in socket payloads are ISO-8601 UTC strings, as in REST.

### Client → server
| Event | Payload | Ack |
|---|---|---|
| `team-progress:join` | `{ participationId }` | `{ ok: true, lastSeq, online }` or `{ ok: false, error: { code: 'NOT_FOUND' } }` |
| `team-progress:leave` | `{ participationId }` | `{ ok: true }` |

`join` is authorized in the `teams` service: current member of the participating team, the mission author, or an admin (the same rule as `GET /team-participations/:id`). Anyone else, or a participation that does not exist, gets the same `NOT_FOUND` (A-16) and never joins the room. A member who leaves the team is removed from the room by the server (`team.member.left`).

## 3. Ordering and reconnection protocol (A-21)

1. Every team state change appends a `TeamProgressEvent` with a per-participation, strictly increasing `seq` **in the same DB transaction** (the `onCommit` hook of `participations`); the server emits `team-progress:update` only **after** the commit.
2. **Join, then snapshot.** The client sends `team-progress:join` first and buffers every `team-progress:update` it receives; then it calls `GET /api/v1/team-participations/:id` (state + `lastSeq`). It replaces its state with the snapshot, sets `lastSeq` from it, drops buffered events with `seq ≤ lastSeq` and applies the rest in order. Joining first means no event can fall between the snapshot and the subscription.
3. Afterwards the client applies an update only if `seq = lastSeq + 1`; duplicates (`seq ≤ lastSeq`) are ignored.
4. On a gap (`seq > lastSeq + 1`) or on any reconnection, the client repeats step 2.
5. Concurrent submissions on one objective are serialized by optimistic locking (`version`): the loser gets 409 `VERSION_CONFLICT` with the latest state.

Individual participations need no sequence: `participation:updated` carries `version`, and the client ignores a payload whose `version` is not greater than the one it has (and reloads with `GET /participations/:id` after a reconnection).

## 4. Notification types (A-15)

`NotifierPort.notify(userId, type, payload)` persists the notification and pushes `notification:new`. The payload is what the frontend needs to render the text and the link, nothing secret.

| Type | Recipient | Payload |
|---|---|---|
| `mission.accepted` | mission author | `{ missionId, participationId, participant }` |
| `participation.status.changed` | participant (team: current members) | `{ missionId, participationId, status }` |
| `proof.reviewed` | participant (team: current members) | `{ missionId, participationId, objectiveId, verdict }` |
| `invitation.received` | invitee | `{ invitationId, missionId }` |
| `invitation.responded` | inviter | `{ invitationId, missionId, inviteeId, response }` |
| `invitation.revoked` | invitee | `{ invitationId, missionId }` |
| `waitlist.offered` | waiting user (team: the team admin) | `{ entryId, missionId, offerExpiresAt }` |
| `waitlist.offer.expired` | same as above | `{ entryId, missionId }` |
| `team.invitation.received` | invitee | `{ invitationId, teamId }` |
| `team.member.joined` | the other current members | `{ teamId, userId }` |
| `team.member.left` | the remaining members (and the removed user when `by = ADMIN`) | `{ teamId, userId, by }` |

The optional "5 minutes left" notification is not built (data-model review, issue #4): adding it later needs a contract-change.

## 5. Ports (frozen)

The interfaces are in `backend/src/shared/ports/ports.ts`; every port has a safe default until its owner binds it.

| Port | Methods | Bound by |
|---|---|---|
| `NotifierPort` | `notify(userId, type: NotificationType, payload)` | R06A (P2) |
| `RealtimePort` | `emitToUser(userId, event, payload)`, `emitToRoom(room, event, payload)`, `joinRoom(userId, room)`, `leaveRoom(userId, room)` | R06A (P2) |
| `ParticipationQueryPort` | `hasStarted(missionId)`, `availability(missionIds)`, `isUserEngaged(missionId, userId)` | R04 / R09 (P2) |
| `MissionAccessPort` | `canView(viewer, missionId)`, `grant(missionId, userId, source)`, `revoke(missionId, userId, source)` | R07 (P1) |
| `TeamMembershipPort` | `isMember(teamId, userId)`, `isAdmin(teamId, userId)`, `membersOf(teamId)`, **`teamsOf(userId)`** (new: the A-20 check at acceptance and `participations.listForUser`) | R10 (P3) |
