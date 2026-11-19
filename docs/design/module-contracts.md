# Module contracts (PROPOSED draft, frozen in Sprint 0 by tasks S0-API and S0-EVENTS)

Signatures below are a **specification in TypeScript notation inside Markdown**; no `.ts` file exists yet. Modules interact only through their public API (`index.ts`), ports (`shared/ports`) or domain events. Port = **Strategy** interface; the registry (`bindPort` / `getPort`) = **Dependency Injection**; the event bus = **Observer**.

## Ports (`backend/src/shared/ports/`)

| Port | Methods | Default (null-object) | Bound by |
|---|---|---|---|
| `NotifierPort` | `notify(userId, type, payload)` | no-op + debug log | R06A (P2) |
| `RealtimePort` | `emitToUser`, `emitToRoom`, `joinRoom`, `leaveRoom` | no-op | R06A (P2) |
| `ParticipationQueryPort` | `hasStarted(missionId)`, `availability(missionIds)`, `isUserEngaged(missionId, userId)` | `false`, `AVAILABLE`, `false` | R04/R09 (P2) |
| `MissionAccessPort` | `canView(viewer \| null, missionId)`, `grant(missionId, userId, source)`, `revoke(missionId, userId, source)` | published and public, or the viewer is author or admin | R07 (P1) |
| `TeamMembershipPort` | `isMember`, `isAdmin`, `membersOf` | deny | R10 (P3) |

```ts
interface NotifierPort { notify(userId: string, type: string, payload: object): Promise<void>; }
interface RealtimePort {
  emitToUser(userId: string, event: string, payload: object): void;
  emitToRoom(room: string, event: string, payload: object): void;
  joinRoom(userId: string, room: string): void;
  leaveRoom(userId: string, room: string): void;
}
interface ParticipationQueryPort {
  hasStarted(missionId: string): Promise<boolean>;
  availability(missionIds: string[]): Promise<Record<string, 'AVAILABLE' | 'FULL' | 'CLOSED'>>;
  isUserEngaged(missionId: string, userId: string): Promise<boolean>;
}
interface MissionAccessPort {
  canView(viewer: Viewer | null, missionId: string): Promise<boolean>;
  grant(missionId: string, userId: string, source: 'MANUAL' | 'INVITE'): Promise<void>;
  revoke(missionId: string, userId: string, source: 'MANUAL' | 'INVITE'): Promise<void>;
}
interface TeamMembershipPort {
  isMember(teamId: string, userId: string): Promise<boolean>;
  isAdmin(teamId: string, userId: string): Promise<boolean>;
  membersOf(teamId: string): Promise<string[]>;
}
```

## Public API per module

### `participations` (P2)
```ts
accept(missionId: string, actor: Actor, participant: { type: 'USER' } | { type: 'TEAM'; teamId: string }): Promise<ParticipationDto>;
getForViewer(participationId: string, viewer: Viewer): Promise<ParticipationDto>;
submitObjective(participationId: string, objectiveId: string, contributorId: string, input: SubmissionInput, expectedVersion?: number): Promise<ParticipationDto>;
abandon(participationId: string, actor: Actor): Promise<ParticipationDto>;
review(progressId: string, reviewer: Actor, verdict: 'APPROVE' | 'REJECT', reason?: string): Promise<ParticipationDto>;
```
`participantType: USER | TEAM` is supported from day one, so R11 can build on it.

### `missions` (P1)
```ts
getMissionForParticipation(missionId: string): Promise<MissionInternal>; // internal, objectives included
canView(viewer: Viewer | null, missionId: string): Promise<boolean>;
grantAccess(missionId: string, userId: string, source: 'MANUAL' | 'INVITE'): Promise<void>;
revokeAccess(missionId: string, userId: string, source: 'MANUAL' | 'INVITE'): Promise<void>;
```

### `teams` (P3)
```ts
isMember(teamId: string, userId: string): Promise<boolean>;
isAdmin(teamId: string, userId: string): Promise<boolean>;
membersOf(teamId: string): Promise<string[]>;
```

### `users` (P1)
```ts
getPublicProfile(id: string): Promise<PublicProfileDto>;
findByNickname(nickname: string): Promise<UserSummary | null>;
```

### `auth` (P1)
Middleware exported for all modules: `requireAuth`, `optionalAuth`, `requireRole(role)`.

### `notifications`, `dashboard`, `invitations` (P2, P2, P3)
`notifications` binds `NotifierPort` and `RealtimePort`. `dashboard` aggregates the public APIs of `missions` and `participations` (read only). `invitations` grants access through `missions.grantAccess` and consumes `MissionAccessPort`.

## Domain events (`shared/events/domain-events`)

`user.registered`, `mission.published`, `mission.updated`, `mission.closed`, `mission.access.granted`, `mission.access.revoked`, `participation.accepted`, `participation.objective.submitted`, `participation.objective.reviewed`, `participation.status.changed`, `waitlist.offered`, `waitlist.offer.expired`, `invitation.created`, `invitation.responded`, `invitation.revoked`, `team.invitation.created`, `team.invitation.responded`, `team.member.joined`, `team.member.left`, `team.progress.updated`.

Events are published by the owning module and consumed through the typed in-process bus. Each module README lists the events it emits and consumes.

## REST surface (S0-API, PROPOSED until the Sprint 0 kickoff, then FROZEN)

Every row becomes one operation in the OpenAPI fragment of the owning module (`backend/src/modules/<module>/<module>.openapi.yaml`) with `x-owner`, `x-requirement` and `x-status: planned` (→ `done` when implemented). The owner of each module writes their own fragment from this table.

### Conventions (REST rules of the course, Massé)
- Base path `/api/v1`, JSON only, no trailing slash, lowercase-hyphen URIs, **plural nouns** for collections (`/missions`, `/waitlist-entries`).
- **Controller resources** (verbs) only for actions that are not plain CRUD: `/publish`, `/close`, `/archive`, `/duplicate`, `/accept`, `/decline`, `/revoke`, `/claim`, `/abandon`, `/leave`, `/transfer-admin`, `/read`, `/read-all`.
- `/me` is the document of the logged-in user; `/me/<collection>` are the user's own items (no user ID ever comes from the client).
- Filters, sorting and pagination in the query string: `?page=1&pageSize=20` → `{ items, page, pageSize, total }`.
- Status codes: `200` read/update/action, `201` created (body = the created resource), `204` no body, `400 VALIDATION_ERROR`, `401` not logged in, `403` logged in but not allowed **on a resource the caller can see**, `404` missing **or not visible** (A-16), `409` state conflict, `413`/`415` upload too large / wrong type, `429` rate limit.
- Optimistic locking: the client sends the `version` it read; a stale version gets `409 VERSION_CONFLICT` with the current state in `details.current`.
- Auth column: **G** guest allowed (optional token), **U** logged-in user, **A** admin; "author", "participant", "team admin", "invitee" are checked **in the service**.

### `auth` (P1 · R01)
| Method | Path | Auth | Success | Main errors |
|---|---|---|---|---|
| POST | `/auth/register` | G | 201 `{ user, token }` | 400, 409 `EMAIL_TAKEN` / `NICKNAME_TAKEN`, 429 |
| POST | `/auth/login` | G | 200 `{ user, token }` | 401 `INVALID_CREDENTIALS` (also for suspended accounts, no enumeration), 429 |
| POST | `/auth/logout` | U | 204 (increments `tokenVersion`, A-02) | 401 |

### `users` (P1 · R01)
| Method | Path | Auth | Success | Main errors |
|---|---|---|---|---|
| GET | `/me` | U | 200 private profile (email, full name) | 401 |
| PATCH | `/me` | U | 200 | 400, 409 `NICKNAME_TAKEN` |
| PUT | `/me/password` | U | 204 (increments `tokenVersion`) | 400, 401 `INVALID_CREDENTIALS` (old password) |
| GET | `/users/{id}` | G | 200 public profile (A-03) | 404 |
| GET | `/users?q=&status=&page=&pageSize=` | A | 200 page | 401, 403 |
| PATCH | `/users/{id}/status` | A | 200 `{ status: ACTIVE \| SUSPENDED }` | 403, 404, 409 `CANNOT_CHANGE_SELF` |
| PATCH | `/users/{id}/role` | A | 200 `{ role: USER \| ADMIN }` | 403, 404, 409 `CANNOT_CHANGE_SELF` |

### `missions` (P1 · R02, R03, R07)
| Method | Path | Auth | Success | Main errors |
|---|---|---|---|---|
| GET | `/categories` | G | 200 list (A-23) | – |
| GET | `/missions?q=&category=&availability=&mode=&participationType=&bbox=&page=&pageSize=` | G | 200 page of summaries; RESTRICTED missions only for allowed viewers; `bbox=minLng,minLat,maxLng,maxLat` | 400 |
| GET | `/missions/{id}` | G | 200 detail; SECRET_TIMED → preview DTO without objectives (A-07) unless the viewer is author, admin or engaged | 404 |
| POST | `/missions` | U | 201 DRAFT (objectives in the body) | 400 |
| PATCH | `/missions/{id}` | author | 200 (objectives replaced as a whole while editable, A-06) | 400, 403, 404, 409 `VERSION_CONFLICT` / `MISSION_LOCKED` |
| DELETE | `/missions/{id}` | author | 204 (DRAFT only) | 403, 404, 409 `INVALID_STATE` |
| POST | `/missions/{id}/publish` | author | 200 | 400 (no objectives), 409 `INVALID_STATE` |
| POST | `/missions/{id}/close` | author, A | 200 | 409 `INVALID_STATE` |
| POST | `/missions/{id}/archive` | author, A | 200 | 409 `HAS_ACTIVE_PARTICIPATIONS` |
| POST | `/missions/{id}/duplicate` | author | 201 new DRAFT (A-13) | 404 |
| GET | `/missions/{id}/access` | author | 200 allow-list `[{ user, source }]` (R07) | 403, 404 |
| POST | `/missions/{id}/access` | author | 201 MANUAL grant `{ nickname }` | 404 (mission or user), 409 `MISSION_NOT_RESTRICTED` / `ALREADY_GRANTED` |
| DELETE | `/missions/{id}/access/{userId}` | author | 204 (removes the MANUAL grant only) | 404 |

### `participations` (P2 · R04, R05, R09)
| Method | Path | Auth | Success | Main errors |
|---|---|---|---|---|
| POST | `/missions/{id}/participations` | U | 201 participation with `deadlineAt`, `serverNow`, objectives revealed (individual only; teams: see `teams`) | 404, 409 `MISSION_FULL` / `MISSION_NOT_OPEN` / `ALREADY_PARTICIPATING` / `NO_ATTEMPTS_LEFT` / `OWN_MISSION` |
| GET | `/missions/{id}/participations?status=&page=&pageSize=` | author | 200 page (review queue) | 403, 404 |
| GET | `/participations/{id}` | participant, author, A | 200 state + `serverNow` | 404 |
| POST | `/participations/{id}/objectives/{objectiveId}/submissions` | participant | 200 updated participation (JSON for SELF/ANSWER/TEXT_PROOF, `multipart/form-data` for IMAGE_PROOF) | 400, 404, 409 `DEADLINE_PASSED` / `ATTEMPTS_EXHAUSTED` / `VERSION_CONFLICT` / `INVALID_STATE`, 413, 415 |
| POST | `/participations/{id}/objectives/{objectiveId}/review` | author | 200 `{ verdict: APPROVE \| REJECT, reason? }` | 400, 403, 404, 409 `INVALID_STATE` |
| POST | `/participations/{id}/abandon` | participant | 200 (A-14) | 404, 409 `INVALID_STATE` |
| GET | `/proofs/{id}/file` | participant(s), author, A | 200 image (A-25) | 404 |
| POST | `/missions/{id}/waitlist-entries` | U | 201 WAITING entry (R09) | 404, 409 `MISSION_NOT_FULL` / `ALREADY_WAITING` / `ALREADY_PARTICIPATING` |
| DELETE | `/waitlist-entries/{id}` | owner of the entry | 204 | 404 |
| POST | `/waitlist-entries/{id}/claim` | owner of the entry | 201 participation (the real acceptance, A-18) | 404, 409 `OFFER_EXPIRED` / `NOT_OFFERED` |

### `notifications` (P2 · R06)
| Method | Path | Auth | Success | Main errors |
|---|---|---|---|---|
| GET | `/me/notifications?unread=&page=&pageSize=` | U | 200 page + `unreadCount` | 401 |
| POST | `/me/notifications/{id}/read` | U | 204 | 404 |
| POST | `/me/notifications/read-all` | U | 204 | 401 |

### `dashboard` (P2 · R06)
| Method | Path | Auth | Success | Main errors |
|---|---|---|---|---|
| GET | `/me/dashboard` | U | 200 `{ createdMissions, participations, waitlistEntries, points }` with statuses | 401 |

### `invitations` (P3 · R08)
| Method | Path | Auth | Success | Main errors |
|---|---|---|---|---|
| POST | `/missions/{id}/invitations` | author | 201 PENDING `{ nickname }` | 400, 403, 404 (mission or user), 409 `MISSION_NOT_RESTRICTED` / `INVITATION_PENDING` / `CANNOT_INVITE_SELF` |
| GET | `/missions/{id}/invitations?status=&page=&pageSize=` | author | 200 page with status of every invitation | 403, 404 |
| GET | `/me/invitations?status=&page=&pageSize=` | U | 200 page of received invitations | 401 |
| POST | `/invitations/{id}/accept` | invitee | 200 (grants access through `MissionAccessPort`, A-17) | 404, 409 `INVITATION_NOT_PENDING` |
| POST | `/invitations/{id}/decline` | invitee | 200 | 404, 409 `INVITATION_NOT_PENDING` |
| POST | `/invitations/{id}/revoke` | author | 200 (removes the INVITE grant) | 404, 409 `INVITATION_NOT_REVOCABLE` |

### `teams` (P3 · R10, R11, R12)
| Method | Path | Auth | Success | Main errors |
|---|---|---|---|---|
| POST | `/teams` | U | 201 team, caller is TEAM_ADMIN | 400, 409 `TEAM_NAME_TAKEN` |
| GET | `/me/teams` | U | 200 list with the caller's role | 401 |
| GET | `/teams/{id}` | member | 200 team + members + roles | 404 |
| PATCH | `/teams/{id}` | team admin | 200 (rename) | 400, 403, 404, 409 `TEAM_NAME_TAKEN` |
| POST | `/teams/{id}/invitations` | team admin | 201 PENDING `{ nickname }` | 403, 404, 409 `TEAM_FULL` / `ALREADY_MEMBER` / `INVITATION_PENDING` |
| GET | `/teams/{id}/invitations?status=` | team admin | 200 list | 403, 404 |
| GET | `/me/team-invitations?status=` | U | 200 list of received team invitations | 401 |
| POST | `/team-invitations/{id}/accept` | invitee | 200 (re-checks the 6-member cap under lock) | 404, 409 `INVITATION_NOT_PENDING` / `TEAM_FULL` |
| POST | `/team-invitations/{id}/decline` | invitee | 200 | 404, 409 `INVITATION_NOT_PENDING` |
| POST | `/team-invitations/{id}/revoke` | team admin | 200 | 403, 404, 409 `INVITATION_NOT_PENDING` |
| POST | `/teams/{id}/leave` | member | 204 (last member → team disbanded, A-19) | 404, 409 `ADMIN_MUST_TRANSFER` |
| DELETE | `/teams/{id}/members/{userId}` | team admin | 204 | 403, 404, 409 `CANNOT_REMOVE_SELF` |
| POST | `/teams/{id}/transfer-admin` | team admin | 200 `{ userId }` | 403, 404 |
| POST | `/teams/{id}/participations` | team admin | 201 team participation `{ missionId }` (wraps `participations.accept`, A-20) | 403, 404, 409 `TEAM_TOO_SMALL` + the 409s of the individual accept |
| GET | `/team-participations/{id}` | member, author, A | 200 snapshot + `lastSeq` + `serverNow` (A-21) | 404 |
| POST | `/team-participations/{id}/objectives/{objectiveId}/submissions` | member | 200 snapshot + `seq` (wraps `participations.submitObjective`) | as individual submissions |
| POST | `/team-participations/{id}/abandon` | team admin | 200 | 403, 404, 409 `INVALID_STATE` |

Not REST: live updates use the Socket.IO events of `docs/api/realtime-events.md`; `GET /health` is in `shared/openapi/common.yaml`.

### Error codes
Shared: `VALIDATION_ERROR`, `INVALID_JSON`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VERSION_CONFLICT`, `INVALID_STATE`, `RATE_LIMITED`, `INTERNAL_ERROR`. Module codes are the ones in the tables; each module documents them in its fragment. A `409` always carries a code the client can switch on.

## Public API review (S0-API): proposed changes, to confirm at the kickoff

1. **Transactions across modules.** A-18 locks the mission row inside the acceptance transaction, and A-21 writes the `TeamProgressEvent` in the same transaction as the progress change. Proposal: `missions.getMissionForParticipation(missionId, opts?: { transaction?: Transaction; lock?: boolean })`, and `participations.accept/submitObjective/abandon(..., opts?: { onCommit?: (t: Transaction, result: ParticipationDto) => Promise<void> })`, a hook run inside the transaction before the commit. `teams` passes a hook that appends the event and returns `seq`; `participations` never imports `teams`.
2. **One way to grant access.** `missions.grantAccess/revokeAccess` and `MissionAccessPort.grant/revoke` do the same thing. Proposal: keep only the port (bound by R07); `invitations` uses `getPort('missionAccess')`.
3. **`users` lookups.** `invitations` and `teams` need nicknames for lists. Proposal: add `users.getSummaries(ids: string[]): Promise<Map<string, UserSummary>>` next to `findByNickname`.
4. **`dashboard` reads.** Proposal: `missions.listByAuthor(userId)` and `participations.listForUser(userId)` (includes team participations through `TeamMembershipPort`), both read only.
5. **Team participation endpoints live in `teams`** (as the `teams` README says), wrapping the `participations` public API: the team checks (team admin, `minTeamSize`, membership) stay with R11's owner, while capacity, timer, A-20 and the state machine stay in one place in `participations`. Open question for P2: who takes part for a team, the members at acceptance or the current members (see S0-DATAMODEL, issue #4, P2)?
6. **`auth` middleware** stays as listed (`requireAuth`, `optionalAuth`, `requireRole`); they put the `Viewer` (`shared/ports`) in `res.locals.viewer`, never read from the body.
