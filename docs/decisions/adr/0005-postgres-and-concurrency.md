# ADR 0005 – PostgreSQL and concurrency control

Status: PROPOSED · Date: 2026-11-17

## Context
Last-slot competition (R09), concurrent invitations (R08), concurrent team progress (R11) and edit-vs-accept races (R02/R04) need real transactions.

## Decision
PostgreSQL 17. Pessimistic locking for capacity: a transaction with `SELECT … FOR UPDATE` on the mission row, then the count; the loser gets 409 `MISSION_FULL`. Optimistic locking (a `version` column) for mission edits, objective progress and team progress. Partial unique indexes enforce "one ACTIVE/SUBMITTED participation per (mission, user) and per (mission, team)" and unique (mission, invitee) invitations. Schema changes only through versioned Umzug migrations.

## Alternatives
- SQLite: weak concurrency semantics, unlike production-grade behaviour.
- Application-level locks only: not safe across processes and hard to test.

## Consequences
Behaviour is correct under concurrency and testable with integration tests against a real DB; Docker is required locally.
