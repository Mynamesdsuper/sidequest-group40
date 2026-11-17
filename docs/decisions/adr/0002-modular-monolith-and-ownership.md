# ADR 0002 – Modular monolith and ownership

Status: PROPOSED · Date: 2026-11-17

## Context
Three developers work in parallel and must avoid merge conflicts and hidden coupling. Each must also be able to defend the whole project.

## Decision
A layered monolith (routes → controller → service/domain → repository/models) split into modules, one folder per module, with one owner each. Modules communicate only through their `index.ts` public API, through ports in `shared/ports`, or through domain events on an in-process bus. Pattern vocabulary: a port is a **Strategy** interface injected through a registry (**Dependency Injection**); the event bus is **Observer**; per-module data access is **Repository**. ESLint forbids deep imports across modules. `CODEOWNERS` gives every path an owner plus a reviewer buddy. Shared code changes only through the `contract-change` process.

## Alternatives
- Microservices: operational overhead unjustified for a university project.
- Unstructured monolith: parallel work would collide.

## Consequences
Clear ownership and testable boundaries; contracts must be frozen early (Sprint 0).
