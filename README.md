# SideQuest – Group 40

University project (Università degli Studi di Napoli Federico II, A.A. 2026/27) for two exams with one product: **Ingegneria del Software (INGSW)** and **Tecnologie Web (TECWEB)**. Type: **integrated**. Delivery: **early** (requirements R01–R12). Packages: core R01–R06 + **A** (R07–R09) + **B** (R10–R12).

SideQuest is a web app where users create and play missions (ordinary or secret-timed), explore them on a map, invite others, form teams and follow live updates.

> **Status: scaffold ready.** Backend, frontend, E2E tests, Docker and CI are in place, with no requirement implemented yet (every feature is `planned`). Requirements are built from now on, following `docs/plan/PLAN.md`.

## Group

| Role | Name | Student ID | GitHub |
|---|---|---|---|
| P1 | Vincenzo Pio Lubrano | N86005417 | [@vincenzolubrano05](https://github.com/vincenzolubrano05) |
| P2 | Matteo Marino | N86005461 | [@reverinn](https://github.com/reverinn) |
| P3 | Domenico Panaro (coordinator) | N86005622 | [@Mynamesdsuper](https://github.com/Mynamesdsuper) |

## Prerequisites
- Node.js **22** (see `.nvmrc`) and npm
- Docker Desktop (or Docker Engine + Compose), running
- Git; the GitHub CLI (`gh`) for the planning tools

## Quick start

```bash
npm ci                              # root tools (plan, PDFs)
npm run setup:dev                   # installs backend, frontend, e2e + Chromium; creates .env files from .env.example
docker compose up -d db             # PostgreSQL 17 (databases sidequest_dev and sidequest_test)

cd backend
npm run db:migrate && npm run db:seed
npm run dev                         # API on http://localhost:3000

cd ../frontend                      # in a second terminal
npm start                           # app on http://localhost:4200
```

The home page shows **"backend ok · database up"** when the whole chain works.

## Configuration
- **Root `.env`** (read by `docker-compose.yml`): database credentials and `DB_PORT`. If port 5432 is already used (for example by a local PostgreSQL), set `DB_PORT=5433` and use the same port in `backend/.env`.
- **`backend/.env`**: `DATABASE_URL`, `TEST_DATABASE_URL`, `TOKEN_SECRET` (set a long random value: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`), `TOKEN_EXPIRES_IN`, `FRONTEND_ORIGIN`, `UPLOAD_DIR`, `MAX_UPLOAD_MB`. It is checked at boot: a wrong value stops the server with the list of problems.
- **Frontend**: `frontend/src/environments/` (`apiBaseUrl`, `socketUrl`).
- `.env` files are never committed; only the `.env.example` templates are.

## Demo data and accounts
The seeds (`backend/src/db/seeds/`) are empty until the requirements add data. These accounts will be created by the `users` seed (R01):

| Email | Password | Role | Nickname |
|---|---|---|---|
| `admin@sidequest.test` | `Admin123!` | ADMIN | `admin` |
| `alice@sidequest.test`, `bob@…`, `carol@…`, `dave@…`, `erin@…` | `Password123!` | USER | `alice`, `bob`, `carol`, `dave`, `erin` |

## Running the tests

| What | Command |
|---|---|
| Backend unit + integration (needs the db container) | `cd backend && npm test` (`npm run test:coverage` for the lcov report) |
| Frontend unit | `cd frontend && npm test` |
| E2E (Playwright; starts backend and frontend by itself, or reuses running ones) | `cd e2e && npx playwright test` |
| Everything | `npm run test:all` |

Lint and type checks: `npm run lint` and `npm run typecheck` in `backend/` and `frontend/`.

## Demo stack with Docker

```bash
docker compose -f docker-compose.demo.yml up --build    # then open http://localhost:4200
docker compose -f docker-compose.demo.yml down          # add -v to wipe the demo data
```

It builds and runs database, backend and frontend with a separate volume, so it never touches the development database.

## API documentation
With the backend running: Swagger UI at http://localhost:3000/api/docs, raw OpenAPI at http://localhost:3000/api/docs.json. One fragment per module (`backend/src/modules/<module>/<module>.openapi.yaml`); the planned surface is in `docs/design/module-contracts.md`.

## Features

| Req | Feature | Owner | Status |
|---|---|---|---|
| R01 | Accounts, access, profile | P1 | planned |
| R02 | Mission creation and publication | P1 | planned |
| R03 | Exploration and search | P1 | planned |
| R04 | Acceptance and server-authoritative timer | P2 | planned |
| R05 | Progress, proofs, completion | P2 | planned |
| R06 | Personal area and live notifications | P2 | planned |
| R07 | Restricted visibility | P1 | planned |
| R08 | Invitations | P3 | planned |
| R09 | Capacity and waitlist | P2 | planned |
| R10 | Exploration teams | P3 | planned |
| R11 | Team participation | P3 | planned |
| R12 | Live cooperative updates | P3 | planned |

## Technologies
Node.js 22, TypeScript, Express 5, Sequelize 6 (Umzug migrations), PostgreSQL 17, Socket.IO; Angular (no UI component library), Leaflet + OpenStreetMap; Jest + supertest, Vitest, Playwright; Docker, GitHub Actions, SonarCloud. Rationale: `docs/decisions/adr/` (course alignment: ADR 0006).

## Repository structure

| Path | Content |
|---|---|
| `backend/` | Express API: `src/shared/` (config, validation, errors, clock, events, ports, db, OpenAPI), `src/modules/<module>/` (one per area), `src/db/` (migrations, seeds), `tests/` |
| `frontend/` | Angular SPA: `core/` (api, auth, realtime, layout), `shared/ui/`, `features/<feature>/` |
| `e2e/` | Playwright tests (`tests/`) and fixtures |
| `docker/`, `docker-compose.yml`, `docker-compose.demo.yml` | database for development, full stack for the demo |
| `docs/` | plan, guides, requirements, decisions, design, INGSW and TECWEB material |
| `scripts/` | planning, setup and PDF tools |
| `.github/` | CI (`ci.yml`: jobs `backend`, `frontend`, `e2e`, `plan`), SonarCloud, templates, CODEOWNERS |

## Planning tools

```bash
npm run deps -- --mine P1      # your tasks (P1, P2 or P3)
npm run deps -- <TASK-ID>      # is a task READY or BLOCKED?
npm run deps -- --all          # whole-team view
npm run plan:validate          # check docs/plan/tasks.json
```

## Documentation
- **Start here (what to do now):** [`docs/plan/START-HERE.md`](docs/plan/START-HERE.md) · [PDF](docs/plan/SideQuest_Group40_Start_Here.pdf)
- Master plan: [`docs/plan/PLAN.md`](docs/plan/PLAN.md) · [PDF](docs/plan/SideQuest_Group40_Master_Plan.pdf)
- Personal guides: [`docs/guides/`](docs/guides/) (P1, P2, P3, Markdown + PDF)
- Requirements: [`docs/reference/requirements.md`](docs/reference/requirements.md)
- Assumptions and ADRs: [`docs/decisions/`](docs/decisions/)
- Design: [`docs/design/`](docs/design/), [`docs/api/realtime-events.md`](docs/api/realtime-events.md)
- E2E catalogue: [`docs/tecweb/e2e-catalogue.md`](docs/tecweb/e2e-catalogue.md)
- INGSW document structure: [`docs/ingsw/README.md`](docs/ingsw/README.md)
- Progress log: [`PROGRESS.md`](PROGRESS.md) · Project history (everything done, in order): [latest PDF on the `history` branch](https://github.com/Mynamesdsuper/sidequest-group40/blob/history/SideQuest_Group40_History.pdf) (also on the [`history-latest` release](https://github.com/Mynamesdsuper/sidequest-group40/releases/tag/history-latest)), built by `npm run history` · Rules: [`CLAUDE.md`](CLAUDE.md), [`CONTRIBUTING.md`](CONTRIBUTING.md)

The final README (complete demo data, features status, summary of the delivery) is written by P1 in task TW-README.
