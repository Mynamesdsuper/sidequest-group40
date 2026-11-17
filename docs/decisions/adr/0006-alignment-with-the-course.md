# ADR 0006 – Alignment with the course

Status: PROPOSED · Date: 2026-11-17

## Context
The brief allows technologies not covered in class, but this "does not automatically give an advantage and must be technically motivated". Rule: **use what was taught by default; anything else needs a written rationale every member can repeat at the exam.** New dependencies need a `contract-change` PR amending this ADR.

## Decision
**Taught and used as taught:**
- Node.js 22 and npm.
- Express 5: routers, middleware, async error handling, error-handler middleware, `express.json`, `cors`, `morgan`, `dotenv` with `.env` + `.env.example`.
- Sequelize 6: models, associations, transactions.
- REST design rules: plural nouns for collections, controller resources as verbs, filtering and pagination in the query string, correct status codes, no trailing slash, lowercase-hyphen URIs.
- JWT in the Authorization header with `jsonwebtoken` (secret in `TOKEN_SECRET`) plus authorization middleware.
- OpenAPI.
- On the client: `fetch`, Promises, async/await, `localStorage`, ES classes and modules; modern responsive CSS.
- INGSW: Git, Docker, GitHub Actions, SonarCloud; Cockburn use cases, personas, mockups; UML class, sequence and state diagrams; patterns Singleton, Adapter, Decorator, Composite, Observer, Strategy, Repository, MVC, Dependency Injection; layered and monolithic architectures.
- Leaflet + OpenStreetMap.

**Not taught (or not yet), kept with rationale:**

| Choice | Rationale |
|---|---|
| TypeScript | Static types make module contracts between 3 developers explicit and checked at compile time. Angular requires TypeScript anyway. Typed classes and interfaces map 1:1 to the UML class diagram. |
| Socket.IO | R06/R12 need prompt updates; R12 needs ordering and reconnection handling. Socket.IO adds rooms, automatic reconnection and acks over WebSocket. Polling was considered and rejected for R12 latency and server load. |
| Umzug migrations instead of `sequelize.sync()` | `sync()` suits one developer. With three people changing the schema, versioned migrations are reviewable, ordered and reproducible on every machine and in CI. |
| bcryptjs | Credentials must be protected: passwords are never stored in clear text (the lecture demo did so only for simplicity). |
| helmet, express-rate-limit | Cheap standard hardening (security headers; brute-force protection on login and register). |
| Hand-written validation | Taught concepts only: a small `Validator` class with rules, used by a `validate()` middleware. No extra dependency. |
| Jest + supertest, Playwright | The brief requires xUnit-family unit tests and ≥10 automated E2E tests; no testing tool has been covered yet. Playwright supports several browser contexts (needed for live-update tests). **Re-check when the course covers testing; switch if prescribed.** |
| Angular | The SPA framework is announced for the next lectures; a course slide names "Angular App". **Re-check when the course covers SPAs.** |
| Swagger UI | Required "documented APIs"; it only displays the OpenAPI spec. |

## Alternatives
Strictly plain JavaScript and `sequelize.sync()`: simpler to defend, but weaker for a three-person team and for the contract-based design.

## Consequences
Every guide has a section "Technologies you must be able to explain"; the REL-DRYRUN task rehearses the rationale of the second group.
