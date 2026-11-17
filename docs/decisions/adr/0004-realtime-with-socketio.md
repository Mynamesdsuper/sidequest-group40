# ADR 0004 – Realtime with Socket.IO

Status: PROPOSED · Date: 2026-11-17

## Context
R06 needs notifications without reload; R12 needs prompt, ordered team updates and recovery after reconnection.

## Decision
Socket.IO 4 on the same HTTP server, JWT in `auth.token` during the handshake. One room per team participation. State changes append a `TeamProgressEvent` with a strictly increasing `seq` in the same DB transaction; the server emits after commit; clients apply only `seq = lastSeq + 1` and otherwise fetch the snapshot (A-21). Events are listed in `docs/api/realtime-events.md`.

## Alternatives
- Polling: simple, but rejected for R12 latency and server load.
- SSE: one-directional; join/leave acks would need extra HTTP calls.
- Raw WebSocket: no rooms, reconnection or acks out of the box.

## Consequences
One extra dependency to justify (ADR 0006); reconnection is delegated to the library plus our snapshot protocol.
