# ADR 0003 – Server-authoritative timer

Status: PROPOSED · Date: 2026-11-17

## Context
R04 requires that reloading, changing device or editing the local clock cannot extend a secret-timed mission.

## Decision
On acceptance the server stores `deadlineAt = acceptedAt + timeLimit` from the injected `Clock`. Responses carry `deadlineAt` and `serverNow`; the client only displays the countdown. Expiry is evaluated lazily on every read/write plus a 30 s sweeper. Submissions are accepted up to `deadlineAt + 10 s` (A-08, A-09). All domain code reads time from `Clock`, never `Date.now()`; `OffsetClock` (test only) lets E2E tests move time.

## Alternatives
- Client-side timer: trivially tampered, rejected.
- Only a background job: expiry would be late between sweeps; lazy evaluation fixes that.

## Consequences
Deterministic, testable time (`TimerPolicy`, UT-1). Requires a test-only clock endpoint guarded by `NODE_ENV=test`.
