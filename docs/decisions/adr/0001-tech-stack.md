# ADR 0001 – Technology stack

Status: PROPOSED · Date: 2026-11-17

## Context
One product serves two exams (INGSW and TECWEB), built by three students. The brief allows technologies not seen in class if they are technically motivated.

## Decision
- Backend: Node.js 22 LTS, TypeScript (strict), Express 5, Sequelize 6 + `pg`, Umzug migrations, JWT (`jsonwebtoken`, HS256), `bcryptjs`, Socket.IO 4, `multer`, `dotenv`, `cors`, `morgan`, `helmet`, `express-rate-limit`, `swagger-ui-express`.
- Database: PostgreSQL 17 in Docker (`sidequest_dev`, `sidequest_test`).
- Frontend: latest stable Angular (standalone, signals, SCSS, no SSR), no UI library, Leaflet + OpenStreetMap, `socket.io-client`.
- Tests: Jest + ts-jest + supertest; Playwright for E2E. Quality: ESLint, Prettier, SonarCloud on the backend.
- API: REST under `/api/v1`, JSON, uniform error format, OpenAPI 3.1 fragments per module.

## Alternatives
- Plain JavaScript (taught) instead of TypeScript: rejected, see ADR 0006.
- Vue/React instead of Angular: Angular is announced for the course; re-check later.
- MongoDB: rejected, the domain is relational and needs transactions and row locks (ADR 0005).

## Consequences
Strong typing between modules; more tooling to explain at the exam (see ADR 0006 for the rationale of each non-taught choice).
