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

## Planned REST surface (OpenAPI fragments, `x-status: planned`)

`POST /missions`, `PATCH /missions/{id}`, `POST /missions/{id}/publish`, `GET /missions?q=&category=&availability=&bbox=`, `POST /missions/{id}/participations`, `GET /participations/{id}`, `POST /participations/{id}/objectives/{objectiveId}/submissions`, `POST /participations/{id}/abandon`, `POST /progress/{id}/review`, `GET /me/notifications`, `POST /missions/{id}/waitlist`, `POST /waitlist/{id}/claim`, `POST /missions/{id}/invitations`, `POST /invitations/{id}/accept`, `POST /teams`, `POST /teams/{id}/invitations`, `POST /team-invitations/{id}/accept`, `POST /teams/{id}/leave`, `GET /team-participations/{id}`. Conventions: `/api/v1`, plural nouns, lowercase-hyphen URIs, error format `{ "error": { "code", "message", "details" } }`, pagination `?page=&pageSize=` returning `{ items, page, pageSize, total }`.
