# Scaffold specification (task SCAFFOLD, owner P3)

> **This file is the specification of the task SCAFFOLD**, written during the planning of the project and implemented by SCAFFOLD-BE, SCAFFOLD-FE, SCAFFOLD-E2E and SCAFFOLD (PRs #57, #60, #59, #63). Where the text says "setup creates" or "from setup", read "the task SCAFFOLD creates". Section numbers follow the original planning document.

Contents: §4 (stack table and §4.1), §6.1–§6.3, §6.5, §7, the `ci.yml` / `sonar.yml` part of §9 step 7, and the SCAFFOLD checklist of §8.3.

---

## 4. Technical decisions (fixed, do not change)

| Area | Decision |
|---|---|
| Repo shape | Monorepo: `backend/`, `frontend/`, `e2e/`, `docs/`, `scripts/`, `docker/`, `.github/` |
| Backend | Node.js 22 LTS (the course uses 22.14.0), **TypeScript (strict)**, **Express 5**, **Sequelize 6** + `pg`, **Umzug** migrations written in TS, **hand-written validation** (a small `Validator` in `shared/validation/`, no validation library; see §6.2), **JWT** (`jsonwebtoken`, HS256, as in the lectures), **bcryptjs** (pure JS, so it builds on every OS), **Socket.IO 4**, `multer` for uploads, `dotenv`, `cors`, `morgan` for request logging (as in the lectures), `helmet`, `express-rate-limit`, `swagger-ui-express` + `yaml` for API docs. Compile to CommonJS so that Jest stays simple. Dev runner: `tsx watch` (the lectures use nodemon; tsx watch is the TypeScript equivalent). |
| Database | **PostgreSQL 17** in Docker (`docker compose`). Databases `sidequest_dev` and `sidequest_test`. Host port 5432 (make it configurable). |
| Frontend | Latest stable **Angular** (standalone components, signals, SCSS, routing, **no SSR**), **no UI component library**: hand-written styles using the modern CSS taught in the course (custom properties for the theme, flexbox, grid with `gap`, media queries, container queries, `clamp()`/`min()`/`max()`, `dvh` units, `prefers-color-scheme`, native nesting kept shallow). **Leaflet** with OpenStreetMap tiles and the mandatory attribution, `socket.io-client`. Mobile-first: every flow must be usable at 360 px width. |
| Tests | Backend: **Jest + ts-jest**, unit and integration (with **supertest** against the real test DB). E2E: **Playwright** (Chromium desktop + a mobile-viewport project). Testing tools have not been covered in the lectures yet: keep them isolated in `backend/tests/` and `e2e/` so they can be swapped if the course prescribes different tools. |
| Quality | ESLint (typescript-eslint flat config; angular-eslint for the frontend) + Prettier. **SonarCloud** on the backend through GitHub Actions. |
| API | REST under `/api/v1`, JSON only. Error format `{ "error": { "code": "STRING_CODE", "message": "...", "details": {} } }`. Pagination `?page=1&pageSize=20` returns `{ items, page, pageSize, total }`. Auth header `Authorization: Bearer <jwt>`. OpenAPI 3.1 fragments per module, merged at boot and served at `/api/docs`. |
| Realtime | Socket.IO on the same HTTP server. The JWT is passed in `auth.token` during the handshake (the handshake is implemented in R06A). |
| Architecture | **Layered monolith split into modules** (routes → controller → service/domain → repository/models; this is the routes/controllers/models/middleware structure of the course, one folder per module). Modules talk to each other **only** through their `index.ts` public API, through **ports** in `shared/ports`, or through **domain events** on an in-process event bus. In every document and at the exam, describe these with the course's design-pattern vocabulary: a *port* is a **Strategy** interface whose concrete implementation is injected through a registry (**Dependency Injection**), and the event bus is the **Observer** pattern; data access per module follows the **Repository** pattern. ESLint must forbid deep imports into another module. |
| Git | `main` (releases only) + `develop` (integration, **default branch**) + short-lived branches `feature/<task-id>-<slug>`, `docs/<task-id>-<slug>`, `fix/<task-id>-<slug>`, `chore/<slug>`. Squash-merge into `develop`; merge commits for release PRs `develop` → `main`. Conventional Commits whose scope is the module name, e.g. `feat(participations): store server deadline on accept`. |

Also write short ADRs in `docs/decisions/adr/`, with Context, Decision, Alternatives and Consequences:
- `0001-tech-stack.md`
- `0002-modular-monolith-and-ownership.md`
- `0003-server-authoritative-timer.md`
- `0004-realtime-with-socketio.md`
- `0005-postgres-and-concurrency.md`
- `0006-alignment-with-the-course.md` (content in §4.1)

### 4.1 Alignment with what was taught (write it into ADR 0006 and summarize it in PLAN.md and in every guide)

The brief allows technologies not seen in class, but such a choice "does not automatically give an advantage and must be technically motivated". The rule of the project is therefore: **use what was taught by default; anything else must have a written rationale that every member can repeat at the exam.**

**Taught in the lectures, used as taught:**
- Node.js 22 and npm.
- Express 5: routers, middleware, the async error handling of Express 5, the error-handler middleware, `express.json`, `cors`, `morgan`, `dotenv` with `.env` + `.env.example`.
- Sequelize 6: models, associations, transactions.
- REST design rules (Massé): plural nouns for collections, controller resources as verbs, filtering and pagination in the query string, correct status codes, no trailing slash, lowercase-hyphen URIs.
- JWT in the Authorization header with `jsonwebtoken` (the secret lives in `TOKEN_SECRET`, as in the lectures), plus authorization middleware.
- OpenAPI (the course asks to know what it is and what it is for).
- On the client: `fetch`, Promises, async/await, `localStorage`, ES classes and modules.
- Modern responsive CSS.
- On the INGSW side: Git, Docker, GitHub Actions, SonarCloud; Cockburn use cases, personas and mockups; UML class, sequence and state diagrams; the design patterns Singleton, Adapter, Decorator, Composite, Observer, Strategy, Repository, MVC and Dependency Injection; layered and monolithic architectures.
- Leaflet + OpenStreetMap (suggested by the brief).

**Not taught (or not yet), kept, with the rationale to document:**

| Choice | Rationale to write in ADR 0006 |
|---|---|
| TypeScript | Static types make the module contracts between 3 developers explicit and are checked at compile time. Angular requires TypeScript anyway. The OOP requirement of INGSW is shown more clearly with typed classes and interfaces (they map 1:1 to the UML class diagram). |
| Socket.IO | R06 and R12 need prompt updates, and R12 needs ordering and reconnection handling. Socket.IO adds rooms, automatic reconnection and acks on top of WebSocket. The brief allows WebSocket, SSE or polling; polling was considered and rejected for R12 latency and server load (document the alternative). |
| Umzug migrations instead of `sequelize.sync()` | `sync()` (seen in class) is fine for one developer. With three people changing the schema in parallel, versioned migrations make every schema change reviewable, ordered and reproducible on every machine and in CI. |
| bcryptjs | The brief requires credentials to be protected: passwords are never stored in clear text (the lecture demo did so only for simplicity). |
| helmet, express-rate-limit | Cheap, standard hardening (security headers; brute-force protection on login and register). The brief evaluates security. |
| Hand-written validation (no library) | Taught concepts only: a small `Validator` class with rules, used by a `validate()` middleware. No extra dependency to justify. |
| Jest + supertest, Playwright | The brief requires xUnit-family unit tests and ≥10 automated E2E tests, and no testing tool has been covered yet. Jest is the most common xUnit-family framework for TypeScript/Node; Playwright supports several browser contexts (needed for the live-update tests). **Re-check when the course covers testing; switch if the professors prescribe a tool.** |
| Angular | The SPA framework is announced for the next lectures, and a course slide already names "Angular App". **Re-check when the course covers SPAs.** |
| Swagger UI to serve the OpenAPI spec | Required "documented APIs" (B.2); it only displays the spec. |

Every guide must contain a section "Technologies you must be able to explain" listing both groups, and the REL-DRYRUN task must rehearse the rationale of the second group.

---

## 6. Architecture and ownership (what goes where)


### 6.1 Backend modules (`backend/src/modules/`)

| Module | Owner | Requirements | Notes |
|---|---|---|---|
| `auth` | P1 | R01 | register, login, logout, JWT, `requireAuth`, `optionalAuth`, `requireRole` middleware |
| `users` | P1 | R01 | profile, public profile, admin user management |
| `missions` | P1 | R02, R03, R07 | missions, objectives, categories, publication, search, map data, `MissionAccess` allow-list and the access policy |
| `participations` | P2 | R04, R05, R09 | acceptance, timer, progress, proofs, reviews, outcome, points ledger, capacity, waitlist. **Supports `participantType: USER \| TEAM` from day one** (contract), so that R11 can build on it |
| `notifications` | P2 | R06 | persistence, REST, Socket.IO gateway and handshake auth, the real `NotifierPort` and `RealtimePort` |
| `dashboard` | P2 | R06 | personal area that aggregates the public APIs of `missions` and `participations` |
| `invitations` | P3 | R08 | invitations to restricted missions (grants access through the `missions` public API) |
| `teams` | P3 | R10, R11, R12 | teams, membership, team invitations, team participation (wraps the `participations` public API), the progress event log, live rooms |

Inside each module: `index.ts` (exports `register(ctx)` plus the public API), `<module>.routes.ts`, `<module>.controller.ts`, `services/`, `domain/` (pure OOP classes: policies, state machines), `models/`, `dto/`, `<module>.openapi.yaml`, `README.md` (responsibility, owner, requirements, public API, events emitted and consumed).

### 6.2 Shared backend code (`backend/src/shared/`, owned by everyone, changed only with the `contract-change` process)

- `config/`: env loading with `dotenv`, checked at boot with the shared `Validator`.
- `validation/`: a small hand-written validation toolkit, unit-tested in setup. It has a `Validator` class with chainable rules (`required`, `string({min,max})`, `int({min,max})`, `number({min,max})`, `boolean`, `enum([...])`, `email`, `uuid`, `isoDate`, `latitude`, `longitude`, `array(of, {min,max})`, `object(shape)`, `optional`) that returns typed values or a list of field errors, plus the `validate({ body, query, params })` middleware that turns errors into a 400 `VALIDATION_ERROR` with per-field details.
- `db/`: the Sequelize instance, Umzug migrator, seed runner, model registry.
- `errors/`: an `AppError` hierarchy (`ValidationError` 400, `UnauthorizedError` 401, `ForbiddenError` 403, `NotFoundError` 404, `ConflictError` 409) and the error-handler middleware.
- `http/`: pagination helpers (`?page=&pageSize=`) and response helpers. Express 5 already forwards rejected promises to the error handler (as shown in the lectures), so no `asyncHandler` wrapper is needed.
- `clock/`: a `Clock` interface with `SystemClock`, plus `OffsetClock` used only when `NODE_ENV=test`. **All** domain code gets time from the Clock, never from `Date.now()`.
- `events/`: a typed in-process event bus (an implementation of the **Observer** pattern: modules publish domain events, other modules subscribe) and the domain-event catalogue (see §6.4).
- `ports/`: port interfaces (**Strategy** interfaces), a registry (`bindPort` / `getPort`) through which the owning module injects the concrete strategy (**Dependency Injection**), and **safe default implementations** (null-object strategies). In the docs, write the pattern names alongside the word "port":
  - `NotifierPort.notify(userId, type, payload)`. Default: no-op plus a debug log. Bound by R06A (P2).
  - `RealtimePort.emitToUser / emitToRoom / joinRoom / leaveRoom`. Default: no-op. Bound by R06A (P2).
  - `ParticipationQueryPort.hasStarted(missionId)`, `.availability(missionIds)`, `.isUserEngaged(missionId, userId)`. Default: `false`, `AVAILABLE`, `false`. Bound by R04/R09 (P2).
  - `MissionAccessPort.canView(viewer | null, missionId)` and `.grant / revoke(missionId, userId, source)`. Default: published and public, or the viewer is author or admin. Bound by R07 (P1).
  - `TeamMembershipPort.isMember / isAdmin / membersOf`. Default: deny. Bound by R10 (P3).
- `realtime/socket-server.ts`: creates the Socket.IO server on the HTTP server and hands it to the modules through `ctx`. **No** auth and **no** handlers here; those belong to R06A.
- `openapi/merge.ts`: merges `info`, `paths`, `components` and `tags` from every `modules/*/*.openapi.yaml` plus `shared/openapi/common.yaml` (error schema, pagination, bearer security). It fails loudly on duplicate keys.
- `testing/test-router.ts`: mounted **only when `NODE_ENV=test`**. `POST /api/v1/__test__/reset` truncates every table and runs the seeds; `POST /api/v1/__test__/clock { offsetSeconds }` sets the OffsetClock.
- `app.ts`, `server.ts`, `modules/registry.ts`: the registry lists all 8 modules in a fixed order, so nobody needs to edit it later.

### 6.3 Frontend (`frontend/src/app/`)

- `core/api/`: config (base URL from `environment`) and an HTTP error interceptor that maps errors to a toast message (the `shared/ui` toast service) with readable messages, network errors included. Shared.
- `core/auth/` (**P1**): stubs for `AuthService` (signals `currentUser`, `isAuthenticated`, `token`), `authInterceptor` (adds the Bearer header), `authGuard`, `adminGuard`, all marked `TODO(R01, P1)`. The guards allow everything until R01 replaces them.
- `core/realtime/` (**P2**): a `RealtimeService` stub (`connect(token)`, `disconnect()`, `on<T>(event)`, `emit(event, payload)`), `TODO(R06A, P2)`.
- `core/layout/`: a responsive shell in plain HTML/SCSS: a top bar, plus a side navigation that becomes an off-canvas drawer below a breakpoint (CSS media queries + a toggle button with `aria-expanded`), and a footer with the OSM credit when the map is shown. The navigation links for every feature already exist; there is an empty slot for the notification bell (P2 fills it). Shared.
- `shared/ui/`: hand-written, accessible components: page header, empty state, loading spinner, confirm dialog (native `<dialog>` element), toast service + toast container, error banner, form-field wrapper showing validation errors, buttons and cards. Shared.
- `src/styles/`: the design tokens as CSS custom properties (`:root` colors, spacing, radius, font sizes with `clamp()`), a light/dark theme via `prefers-color-scheme`, base reset, layout utilities based on flex/grid with `gap`, and container-query-based cards. Shared.
- `features/<feature>/`: each one has a `<feature>.routes.ts` (lazy-loaded from `app.routes.ts`, which is written **once** in setup and never edited after) and a `public-api.ts` (the only file other features may import from). Initially every feature shows a placeholder page "<Feature> — coming in Rxx (owner Px)".

| Feature folder | Owner | Requirements |
|---|---|---|
| `auth`, `profile`, `admin` | P1 | R01 |
| `missions` (create/edit/my missions/publish), `explore` (list + map + filters + detail/preview) | P1 | R02, R03, R07 |
| `participation` (play screen: objectives, countdown, proofs, review screen for authors), `waitlist` | P2 | R04, R05, R09 |
| `notifications`, `dashboard` | P2 | R06 |
| `invitations` | P3 | R08 |
| `teams`, `team-play` | P3 | R10, R11, R12 |

Map component: P1 creates `shared/map/` during R02 (a reusable Leaflet component with OSM attribution, a picker mode and a markers mode). P2 publishes `ObjectiveListComponent` and `ProofFormComponent` through `features/participation/public-api.ts` during R05B, and P3 reuses them in `team-play`.

---

### 6.5 Ownership enforcement

- `.github/CODEOWNERS`. Every path has two owners (owner + reviewer buddy), so that a code-owner approval is always possible:
  - P1 paths (`backend/src/modules/{auth,users,missions}/`, the migrations and seeds of those modules, `frontend/src/app/core/auth/`, `frontend/src/app/features/{auth,profile,admin,missions,explore}/`, `frontend/src/app/shared/map/`, `e2e/tests/p1-*`, `docs/ingsw/01-srs/`, `docs/tecweb/`): `@<GH_P1> @<GH_P2>`.
  - P2 paths (modules `participations`, `notifications`, `dashboard`; `core/realtime/`; features `participation`, `waitlist`, `notifications`, `dashboard`; `e2e/tests/p2-*`; `docs/ingsw/04-testing/`; the UC-01 files): `@<GH_P2> @<GH_P3>`.
  - P3 paths (modules `invitations`, `teams`; features `invitations`, `teams`, `team-play`; `e2e/tests/p3-*`; `docs/ingsw/02-design/`, `docs/ingsw/03-process/sonar-report.md`): `@<GH_P3> @<GH_P1>`.
  - Shared paths (`PROGRESS.md` — append-only in your own section, no contract-change needed —, `backend/src/shared/`, `app.ts`, `server.ts`, `modules/registry.ts`, `frontend/src/app/core/{api,layout}/`, `shared/ui/`, `app.routes.ts`, `e2e/fixtures/`, `docs/decisions/`, `docs/design/`, `.github/`, root configs): `@<GH_P1> @<GH_P2> @<GH_P3>`.
  - Use glob patterns for migrations and seeds named `*-<module>-*`.
  - File-level exceptions must come **after** the folder rules (in CODEOWNERS the last matching pattern wins):
    - `docs/ingsw/01-srs/uc-01-*` and `docs/ingsw/01-srs/mockups.md` → P2
    - `docs/ingsw/02-design/design-example.md` → P2
    - `docs/ingsw/03-process/git-analysis.md` → P1
    - `docs/ingsw/04-testing/unit-test-team-progress.md` → P3
    - `docs/ingsw/05-traceability/Px.md` → its owner
    - `docs/uml/<file>` → the owner listed in §7.8
- **Migration naming:** `backend/src/db/migrations/YYYYMMDDHHmm-<module>-<description>.ts`. **Seed naming:** `backend/src/db/seeds/NN-<module>.ts` with fixed numbers: `01-users` (P1), `02-categories` (P1), `03-missions` (P1), `04-teams` (P3), `05-participations` (P2), `06-invitations` (P3), `07-notifications` (P2). Setup creates the empty seed files (exporting a no-op `up`) and a migration `000000000000-shared-baseline.ts` (the `pgcrypto` extension).
- **Model registration:** `shared/db/models.ts` calls `initModels(sequelize)` and `associate()` of every module listed in the registry; each module exports these from `models/index.ts` (empty in setup).
- **ESLint boundaries:** forbid `modules/<x>/**` from importing `modules/<y>/**` other than `modules/<y>/index`, and forbid `features/<x>/**` from importing `features/<y>/**` other than `features/<y>/public-api`. Add a test that proves the lint rule triggers.

---

## 7. What the scaffold must contain (infrastructure only) — the task SCAFFOLD, NOT this session

### 7.1 Backend

- `package.json` scripts: `dev`, `build`, `start`, `lint`, `format`, `typecheck`, `test`, `test:unit`, `test:integration`, `test:coverage` (lcov for Sonar), `db:migrate`, `db:migrate:undo`, `db:seed`, `db:reset` (migrate from scratch + seed; refuses to run when `NODE_ENV=production`).
- `.env.example`: `NODE_ENV`, `PORT=3000`, `DATABASE_URL`, `TEST_DATABASE_URL`, `TOKEN_SECRET=change-me` (same name as in the lectures), `TOKEN_EXPIRES_IN=2h`, `FRONTEND_ORIGIN=http://localhost:4200`, `UPLOAD_DIR=uploads`, `MAX_UPLOAD_MB=5`. Load it with `dotenv`, check it at boot with the shared `Validator`, and fail with a clear message.
- The middleware stack in `app.ts`: helmet, cors (origin from env), `express.json` with a size limit, `morgan('dev')` (silent when `NODE_ENV=test`), the `/api/v1` router, module registration, `/api/docs` (Swagger UI on the merged spec) plus `/api/docs.json`, the test router when `NODE_ENV=test`, a 404 handler and the error handler.
- `GET /api/v1/health` returns `{ status: "ok", db: "up" | "down", time: <server ISO> }`.
- Working tests from setup:
  - unit: `OffsetClock`, the error mapping, the `Validator` rules (valid input, each rule's failure, boundary lengths, optional fields, nested objects and arrays), the OpenAPI merge (including duplicate detection), the event bus, the port registry defaults;
  - integration: the `validate()` middleware returns 400 `VALIDATION_ERROR` with per-field details;
  - integration: health, unknown route returns 404 JSON, `/api/docs.json` is valid, and the test router is **absent** when `NODE_ENV≠test`.
- Jest: two projects (`unit`, `integration`); integration uses `TEST_DATABASE_URL` and a `tests/helpers/` factory (`createTestApp()`, `resetDb()`).
- `sonar-project.properties` at the repo root. Sources `backend/src`, tests `backend/tests`, coverage `backend/coverage/lcov.info`, exclusions for migrations and seeds. Leave `sonar.organization` and `sonar.projectKey` as `<to-be-set-in-SONAR-SETUP>`.
- `Dockerfile` (multi-stage, `node:22-alpine`).

### 7.2 Frontend

- Created with the Angular CLI (latest stable: standalone, routing, SCSS, no SSR). Do **not** add a UI component library (no Angular Material, Bootstrap, Tailwind or PrimeNG): styles are hand-written as described in §6.3. Add Leaflet + `@types/leaflet` (the Leaflet CSS goes in `angular.json`, the marker-icon assets are copied), `socket.io-client`, angular-eslint.
- `environment.ts` / `environment.development.ts` with `apiBaseUrl: 'http://localhost:3000/api/v1'` and `socketUrl: 'http://localhost:3000'`.
- The layout shell, the placeholder pages and the lazy routes described in §6.3. A home page that calls `/health` and shows the backend status (it proves the FE→BE wiring).
- `Dockerfile` (build, then nginx with the SPA fallback `try_files ... /index.html`).

### 7.3 E2E (`e2e/`)

- `@playwright/test`. Projects: `desktop-chromium` (1280×800) and `mobile-chromium` (390×844).
- `webServer`: starts the backend with `NODE_ENV=test` against `sidequest_test` (migrate + seed first) and the frontend dev server; reuse servers already running locally.
- `globalSetup` calls `POST /api/v1/__test__/reset`.
- `fixtures/`: `api.ts` (typed request helpers), `auth.ts` (a `loginAs(page, user)` stub with `TODO(R01, P1)` that P1 completes), `clock.ts` (`setServerClockOffset(seconds)`), `users.ts` (the demo users from §7.6).
- `tests/smoke.spec.ts`: the home page shows "backend ok"; the health API answers. The naming convention for real tests is `tests/p<1|2|3>-e2e-<NN>-<slug>.spec.ts` (see the catalogue in §8.5).

### 7.4 Docker and local environment

- `docker-compose.yml`: a `db` service (`postgres:17-alpine`, named volume, healthcheck, credentials from the root `.env`, port configurable) plus `docker/postgres/init.sql`, which creates `sidequest_test`. An optional `adminer` service under the profile `tools`.
- `docker-compose.demo.yml`: the full stack (db + backend + frontend) for the exam demo. Make sure it builds.

### 7.5 Root files

- `package.json` (no workspaces; only helper scripts and the dev deps for docs):
  - `setup:dev`: installs backend, frontend and e2e, then copies the `.env.example` files when missing.
  - `deps`: `node scripts/deps.mjs`.
  - `issues:sync`: `node scripts/create-issues.mjs`.
  - `pdf:plan`, `pdf:guides`, `pdf:ingsw`, `pdf:scheda`, all through `node scripts/render-pdf.mjs`.
  - `test:all`.
- `CLAUDE.md` (§10), `README.md` (§7.7), `CONTRIBUTING.md` (the git workflow, the review rotation, the contract-change process, the Definition of Done, the commit conventions, the rule "commit your own work with your own identity").
- `.gitignore` (node_modules, dist, `.angular`, coverage, playwright-report, test-results, `.env*` except `.env.example`, `backend/uploads/`, `*.log`, `docs/reference/private/`), `.gitattributes`, `.editorconfig`, `.nvmrc` (22), `.prettierrc`.
- `.github/`:
  - `pull_request_template.md`: the task ID, `Closes #`, what changed, how it was tested, the DoD checklist, "touches only files I own? yes/no (if no, link the contract-change issue)", screenshots at desktop and mobile size.
  - Issue templates: feature/task, bug, contract-change.
  - Workflows (§9, step 7).

### 7.6 Demo accounts

Document them in the README and in `e2e/fixtures/users.ts`. They are created by the seeds that their owners write later; setup only documents the list.
- `admin@sidequest.test` / `Admin123!` (ADMIN, nickname `admin`)
- `alice@sidequest.test`, `bob@sidequest.test`, `carol@sidequest.test`, `dave@sidequest.test`, `erin@sidequest.test`, all with password `Password123!` (USER; nicknames `alice`, `bob`, `carol`, `dave`, `erin`)

### 7.7 README skeleton (P1 owns the final version)

It must already be accurate for what exists. Sections:
- Group 40 and members (names + student IDs), type (integrated), packages A + B, early delivery;
- prerequisites;
- quick start (`npm run setup:dev`, `docker compose up -d db`, migrate and seed, `npm run dev` for backend and frontend);
- configuration;
- demo data and accounts;
- running the tests (unit, integration, E2E);
- the demo stack with Docker;
- the features table R01–R12 with an owner column and a status column (all "planned");
- technologies;
- the API docs URL;
- the repository structure;
- links to `docs/plan/` and `docs/guides/`.

### 7.8 Docs skeleton

- `docs/reference/requirements.md` (§3).
- `docs/decisions/assumptions.md` (§5) and the ADRs (§4).
- `docs/design/data-model.md` and `module-contracts.md` (§6.4).
- `docs/api/README.md` and `realtime-events.md`.
- `docs/plan/PLAN.md`, `tasks.json` and the PDFs (§8, §11); `PROGRESS.md` at the root (§0.2).
- `docs/guides/P1-vincenzo-lubrano.md`, `P2-matteo-marino.md`, `P3-domenico-panaro.md`, plus their PDFs (§12).
- `docs/ingsw/`: the planned chapter structure. **In this session, write only `docs/ingsw/README.md` with this structure as a list (file, owner, task ID, due date, Appendix C items to cover).** Each DOC task creates its own files later. Every chapter file, when created, starts with a header block giving the owner, the task ID, the due date, and the exact Appendix C items it must cover. Files:
  - `00-cover.md`
  - `01-srs/` (P1, except the UC-01 files): `glossary.md`, `actors-and-use-cases.md`, `personas.md`, `nfr-and-domain.md`, `assumptions.md` (links to `docs/decisions/assumptions.md` and explains the rationale), `uc-01-accept-and-complete-secret-timed-mission.md` (P2), `mockups.md` (P2)
  - `02-design/` (P3, except the files marked P2): `architecture.md`, `technologies-and-communication.md`, `persistence.md`, `class-diagram.md`, `dynamic-diagrams.md` (the state diagram is P2's, the sequence diagram is P3's), `design-example.md` (P2)
  - `03-process/`: `git-analysis.md` (P1), `sonar-report.md` (P3)
  - `04-testing/` (P2, except the file marked P3): `test-plan.md`, `unit-test-timer-policy.md`, `unit-test-team-progress.md` (P3), `methodology.md`
  - `05-traceability/`: `P1.md`, `P2.md`, `P3.md`, each with the table `Requirement | Use case(s) | Design components | Tests`
  - `img/`
- `docs/uml/` (**not in this session**: created by the DOC tasks of each owner): PlantUML drafts with owners in comments: `use-cases.puml` (P1), `participation-state.puml` (P2), `team-live-sequence.puml` (P3), `components.puml` (P3), `domain-class.puml` (P3, from the data model), `er.puml` (P3). Add a `README.md` explaining that they are drafts and must be redrawn in Visual Paradigm, with the exported PNGs going into `docs/ingsw/img/`.
- `docs/tecweb/e2e-catalogue.md` (§8.5, **written in this session**) and `scheda-sintetica.md` (P1, created later in TW-SCHEDA).

---

## §9 step 7 (excerpt): `ci.yml` and `sonar.yml`

7. **Workflows** (`.github/workflows/`). **In this session create only `plan.yml` and `deps-labeler.yml`.** `plan.yml` runs on PRs to `develop`/`main` and on pushes to `develop`, with a single job named exactly `plan` that runs `node scripts/validate-plan.mjs`. The `ci.yml` and `sonar.yml` described below are written into `docs/design/scaffold-spec.md` and created by the task SCAFFOLD (which then moves the `plan` job into `ci.yml` and deletes `plan.yml`):
   - `ci.yml` (task SCAFFOLD), on PRs to `develop`/`main` and pushes to `develop`. Jobs with **exactly** these names:
     - `backend`: Postgres 17 service, `npm ci`, lint, typecheck, migrate the test DB, Jest with coverage, upload coverage as an artifact;
     - `frontend`: `npm ci`, lint, production build;
     - `e2e`: needs both; Postgres service; installs Chromium; Playwright; uploads the report artifact;
     - `plan`: runs `node scripts/validate-plan.mjs`.
   - `sonar.yml` (task SCAFFOLD), on pushes to `develop` and on PRs: runs backend tests with coverage, then the SonarCloud scan (official `SonarSource/sonarqube-scan-action`). If the `SONAR_TOKEN` secret is empty, the job prints "SonarCloud not configured yet (task SONAR-SETUP)" and exits successfully.

---

## §8.3 (excerpt): SCAFFOLD acceptance checklist

The issue body of **SCAFFOLD** must contain this acceptance checklist:
- implement `docs/design/scaffold-spec.md` exactly: §6.1–§6.3, §6.5 and §7 of this specification; infrastructure only, no requirement logic, stubs only where the spec says so;
- create `ci.yml` (jobs `backend`, `frontend`, `e2e`, `plan`) and `sonar.yml`, then delete `plan.yml`;
- local checks green: lint, typecheck, unit and integration tests, frontend production build, E2E smoke test, `docker compose up -d db`, migrations and empty seeds;
- open the PR from `chore/scaffold` to `develop`; it touches shared paths, so it needs the approval of Vincenzo or Matteo;
- after the merge, update the branch protection of `develop` and `main` to require `["backend","frontend","e2e","plan"]`, then read it back;
- update the README quick start and the status line ("scaffold ready").
