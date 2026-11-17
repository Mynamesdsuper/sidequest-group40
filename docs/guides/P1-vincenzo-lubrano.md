# Personal guide – Vincenzo Pio Lubrano (P1)

SideQuest · Group 40 · Federico II · A.A. 2026/27. Repository: https://github.com/Mynamesdsuper/sidequest-group40 · your GitHub login: `vincenzolubrano05`.

This guide is for **you**. Read it once fully, then use the starter prompts (section 10) with Claude Code. The master plan is `docs/plan/PLAN.md` (PDF next to it).

## 1. You and your scope

| Item | Detail |
|---|---|
| **Requirements** | R01 (accounts, profile, admin), R02 (mission creation), R03 (exploration and search), R07 (restricted visibility, package A) |
| **Backend modules** | `auth`, `users`, `missions` (plus the `MissionAccess` allow-list and the access policy, and `MissionAccessPort`) |
| **Frontend features** | `core/auth`, `features/auth`, `profile`, `admin`, `missions`, `explore`, `shared/map` (reusable Leaflet component) |
| **INGSW** | SRS chapter (glossary, actors + use case diagram, personas, NFR and domain requirements, assumptions rationale; `use-cases.puml`), Git analysis |
| **Scaffold part** | SCAFFOLD-FE (18–22 Nov 2026): the Angular frontend skeleton from `docs/design/scaffold-spec.md` |
| **TECWEB** | Final README (TW-README), one-page summary sheet (TW-SCHEDA), E2E catalogue verification (E2E-CATALOGUE), responsive audit (QA-RESPONSIVE), demo dataset (QA-SEED) |
| **E2E specs** | E2E-01, E2E-02, E2E-03, E2E-04 |
| **Unit-test method** | none (UT-1 is P2, UT-2 is P3) |
| **Seeds** | `01-users`, `02-categories`, `03-missions` |
| **Your reviewer** | Matteo Marino (P2) reviews your PRs |
| **You review** | PRs of Domenico Panaro (P3) |

## 2. One-time machine setup

Install:
- **Git** (≥ 2.40) and set your identity: `git config --global user.name "Vincenzo Pio Lubrano"` and `git config --global user.email "<the email linked to your GitHub account>"`. This matters: commits are attributed through that email, and the Git analysis (DOC-GIT) counts them.
- **GitHub CLI** (`gh`), then `gh auth login` (scopes `repo` and `workflow`).
- **Node.js 22 LTS** (use nvm on macOS/Linux, nvm-windows on Windows) and npm.
- **Docker Desktop** (the daemon must be running when you work on backend or E2E).
- **VS Code** with the recommended extensions: ESLint, Prettier, EditorConfig, Angular Language Service, Docker, GitLens, Markdown Preview Mermaid Support, PlantUML.
- **Claude Code** (the CLI) and log in.
- **Visual Paradigm** (university licence): UML for the INGSW document must be drawn with a CASE tool.

**Or simply use Starter prompt 1** (section 10): it checks all of this with you, gives the exact install commands for your OS, clones the repo and prepares your environment.

Accept the collaborator invitation (email, or https://github.com/notifications) before cloning.

## 3. Your step-by-step plan

Ordered by start date. A task may be started only when all its blockers are DONE (`npm run deps -- <ID>`).

1. **SCAFFOLD-FE** – Scaffold part 2: Angular frontend, layout, shared UI, stubs, lazy routes
   - Dates: 2026-11-18 → 2026-11-22 (milestone M1)
   - Blocked by: SETUP
   - Deliverables: Frontend part of `docs/design/scaffold-spec.md` (§6.3, §7.2, ESLint boundary for `features/`): Angular CLI without UI library, `core/api`, `core/layout`, `shared/ui`, design tokens, `core/auth` and `core/realtime` stubs, lazy routes with placeholder pages, home page calling `/health`, nginx Dockerfile. Follow the TypeScript/ESLint/Prettier conventions set by SCAFFOLD-BE (P3). Full checklist in the issue. Start it with Starter prompt 2 and task ID `SCAFFOLD-FE`
   - You hand over to: SCAFFOLD (P3)
2. **S0-ASSUMPTIONS** – Ratify domain assumptions A-01..A-26
   - Dates: 2026-11-23 → 2026-11-29 (milestone M1)
   - Blocked by: SETUP
   - Deliverables: Review every row A-01..A-26 with the team (Sprint 0 call); Turn each row into ACCEPTED, or change it through a PR with the reason
   - You hand over to: DOC-STATE (P2), DOC-UC01-DRAFT (P2)
3. **R01** – R01 Accounts, authentication, profile, admin
   - Dates: 2026-11-25 → 2026-12-06 (milestone M2)
   - Blocked by: SETUP, SCAFFOLD
   - Deliverables: Register, login, logout with email + password (bcrypt); JWT HS256 with `tokenVersion`; logout/suspension/password change increment it (A-02); Rate limiting on login and register
   - You hand over to: R06A (P2), R10 (P3), FREEZE (P3)
4. **R02** – R02 Mission creation, editing, publication, map picker
   - Dates: 2026-12-07 → 2026-12-20 (milestone M3)
   - Blocked by: R01, S0-ASSUMPTIONS, S0-DATAMODEL, S0-API
   - Deliverables: Create/edit missions with title, teaser, description, category, objectives, optional place, ORDINARY or SECRET_TIMED mode, conditions; Lifecycle DRAFT → PUBLISHED → CLOSED → ARCHIVED; only DRAFT can be deleted (A-05)
   - You hand over to: R04 (P2), FREEZE (P3)
5. **R07** – R07 Restricted visibility and access enforcement
   - Dates: 2026-12-21 → 2027-01-03 (milestone M4)
   - Blocked by: R02
   - Deliverables: PUBLIC/RESTRICTED visibility; `MissionAccess` allow-list; bind `MissionAccessPort`; Unauthorized users get **404** from detail, objectives, proofs and every related endpoint; mission absent from list, map and search (A-16)
   - You hand over to: R08 (P3), FREEZE (P3)
6. **R03** – R03 Exploration and search: list, map, filters, secret preview
   - Dates: 2027-01-04 → 2027-01-17 (milestone M5)
   - Blocked by: R02, R07
   - Deliverables: List and interactive map for guests and users; search by keyword, category, availability, mode, participation type, bounding box (A-24); Availability read through `ParticipationQueryPort` (AVAILABLE until R09 binds it)
   - You hand over to: FREEZE (P3)
7. **QA-SEED** – Consolidated demo dataset covering every feature
   - Dates: 2027-01-18 → 2027-01-24 (milestone M6)
   - Blocked by: R03
   - Deliverables: Consolidated demo dataset covering every feature
   - You hand over to: nobody directly (internal or later gating)
8. **QA-RESPONSIVE** – Responsive and error-handling audit of all screens (issues filed to owners)
   - Dates: 2027-01-25 → 2027-01-31 (milestone M6)
   - Blocked by: R03
   - Deliverables: Responsive and error-handling audit of all screens (issues filed to owners)
   - You hand over to: nobody directly (internal or later gating)
9. **E2E-CATALOGUE** – Verify the >=10 E2E catalogue is complete, non-duplicate and green in CI
   - Dates: 2027-01-25 → 2027-01-31 (milestone M6)
   - Blocked by: R03
   - Deliverables: All 12 scenarios of `docs/tecweb/e2e-catalogue.md` exist, are non-duplicate and green in CI; At least one negative/authorization case present (E2E-04 and E2E-12)
   - You hand over to: nobody directly (internal or later gating)
10. **DOC-SRS** – SRS: glossary, actors, use case diagram (VP), personas, NFR and domain requirements, assumptions rationale
   - Dates: 2027-02-01 → 2027-02-21 (milestone M7)
   - Blocked by: S0-ASSUMPTIONS
   - Deliverables: SRS: glossary, actors, use case diagram (VP), personas, NFR and domain requirements, assumptions rationale
   - You hand over to: DOC-TRACE (P3)
11. **TW-README** – Final README (TECWEB B.3)
   - Dates: 2027-02-01 → 2027-02-21 (milestone M7)
   - Blocked by: FREEZE
   - Deliverables: Final README (TECWEB B.3)
   - You hand over to: REL-RC (P3)
12. **TW-SCHEDA** – One-page summary sheet (TECWEB B.3)
   - Dates: 2027-02-15 → 2027-02-21 (milestone M7)
   - Blocked by: FREEZE
   - Deliverables: One-page summary sheet (TECWEB B.3)
   - You hand over to: REL-RC (P3)
13. **DOC-GIT** – Git repository analysis (commits, contributors, trend)
   - Dates: 2027-02-15 → 2027-02-28 (milestone M7)
   - Blocked by: FREEZE
   - Deliverables: Git repository analysis (commits, contributors, trend)
   - You hand over to: CLEANUP (P3), REL-RC (P3)

## 4. What others need from you, and what you need from others

### What others need from you

| Your task | Unblocks | Whose | When they want to start |
|---|---|---|---|
| SCAFFOLD-FE (due 2026-11-22) | SCAFFOLD | P3 | starts 2026-11-23 |
| S0-ASSUMPTIONS (due 2026-11-29) | DOC-STATE | P2 | starts 2026-11-30 |
| S0-ASSUMPTIONS (due 2026-11-29) | DOC-UC01-DRAFT | P2 | starts 2026-11-30 |
| R01 (due 2026-12-06) | R06A | P2 | starts 2026-12-07 |
| R01 (due 2026-12-06) | R10 | P3 | starts 2026-12-07 |
| R01 (due 2026-12-06) | FREEZE | P3 | starts 2027-01-31 |
| R02 (due 2026-12-20) | R04 | P2 | starts 2026-12-21 |
| R02 (due 2026-12-20) | FREEZE | P3 | starts 2027-01-31 |
| R07 (due 2027-01-03) | R08 | P3 | starts 2027-01-04 |
| R07 (due 2027-01-03) | FREEZE | P3 | starts 2027-01-31 |
| R03 (due 2027-01-17) | FREEZE | P3 | starts 2027-01-31 |
| DOC-SRS (due 2027-02-21) | DOC-TRACE | P3 | starts 2027-02-22 |
| TW-README (due 2027-02-21) | REL-RC | P3 | starts 2027-03-01 |
| TW-SCHEDA (due 2027-02-21) | REL-RC | P3 | starts 2027-03-01 |
| DOC-GIT (due 2027-02-28) | CLEANUP | P3 | starts 2027-02-28 |
| DOC-GIT (due 2027-02-28) | REL-RC | P3 | starts 2027-03-01 |

### What you need from others

| Your task | Blocked by | Whose | Their due date |
|---|---|---|---|
| SCAFFOLD-FE | SETUP | P3 | due 2026-11-17 |
| S0-ASSUMPTIONS | SETUP | P3 | due 2026-11-17 |
| R01 | SETUP | P3 | due 2026-11-17 |
| R01 | SCAFFOLD | P3 | due 2026-11-24 |
| R02 | S0-DATAMODEL | P3 | due 2026-11-29 |
| R02 | S0-API | P3 | due 2026-11-29 |
| TW-README | FREEZE | P3 | due 2027-01-31 |
| TW-SCHEDA | FREEZE | P3 | due 2027-01-31 |
| DOC-GIT | FREEZE | P3 | due 2027-01-31 |

## 5. How to check whether you can start

```bash
npm run deps -- <TASK-ID>      # prints each blocker with state and link, then READY or BLOCKED (exit code 0 / 1)
npm run deps -- --mine P1    # your tasks grouped as DONE, READY, BLOCKED, PLANNED, with the next task marked
npm run deps -- --all          # whole-team view
```

If you are blocked, work on your next READY task. The **fallback order** is: (1) your documentation tasks; (2) E2E specs and tests of your merged tasks; (3) reviews of teammates' PRs; (4) Sonar fixes in your modules; (5) helping by reviewing contracts. If a blocker is more than 3 days late, raise it at the Monday sync; the owner may then merge a minimal vertical slice so you can start.

## 5b. Directives from the coordinator

The coordinator (Domenico, P3) can send instructions to anyone as GitHub issues labelled `type:directive`, authored by `Mynamesdsuper`. You see them at the end of `npm run deps -- --mine P1` and Claude Code lists them at the start of each session (rule in `CLAUDE.md`). Only issues authored by the coordinator count. Acknowledge with a comment, do the work through a branch + PR (only files you own, otherwise a contract-change), log it in `PROGRESS.md`, close the issue when done.

## 6. The daily workflow

1. `git fetch`, switch to `develop`, pull. Read the latest `PROGRESS.md` entries (all sections) to know what changed.
2. Create a branch from `develop`: `feature/<task-id>-<slug>` (or `docs/…`, `fix/…`, `chore/…`).
3. Work in small commits (Conventional Commits, scope = module, e.g. `feat(participations): store server deadline on accept`). **Each commit carries its `PROGRESS.md` entry** in your own section.
4. Rebase onto `develop` when needed. Run lint, typecheck, tests locally.
5. Push, open a PR with the template (`Closes #<issue>`), reviewer = your buddy.
6. Review, fix, then **squash-merge**. Never push to `develop` or `main`. Commit with **your own identity**.

### Progress log rules (`PROGRESS.md`)

Add an entry at the top of **your** section after **every** progress step. Format:

```markdown
### 2026-11-25 14:30 · R01 · feat: JWT login and logout
- **What:** what was done, in 1–3 lines.
- **Why:** the reason or decision behind it (link the assumption A-xx, ADR or issue if relevant).
- **Files:** the main files or folders touched.
- **How to verify:** the command, test or screen that proves it works.
- **Next / open points:** what remains, blockers, questions for the team (or "none").
- **Commit/PR:** short hash or #PR (add it when known).
```

- An entry is added after every progress step: each completed sub-step, each commit that changes behaviour, each decision, each fix, each merged PR. Several entries per day are normal; a day of work with no entry is not.
- Each person writes only in their own section, always at the top of it. If a merge conflict happens anyway, keep both entries.
- The entry is committed in the same commit as the work it describes, never in a separate PR.
- Write in English, concise and concrete; explain the *why*.
- When a task is closed, the last entry says "DONE" and links the merged PR.

## 7. Definition of Done

- Backend: migration(s), models, domain classes, service, controller, routes; input validation with the shared `Validator`; authorization checked in the service layer; meaningful error codes; domain events emitted; OpenAPI fragment updated (`x-status: done`).
- Frontend: screens responsive at 360 px and desktop; loading, empty and error states; no secret data in network responses where forbidden.
- Tests: unit tests for the domain classes; integration tests with supertest incl. **at least one authorization-negative case**; the assigned E2E specs pass in CI.
- Seeds updated with demo data (no physical travel needed).
- `PROGRESS.md` updated after every step, with a final "DONE" entry linking the PR.
- Docs updated: module README, your traceability row (`docs/ingsw/05-traceability/P1.md`), the README features table.
- CI green; PR approved by your reviewer buddy; squash-merged with `Closes #<issue>`.

## 8. Technologies you must be able to explain

The brief allows technologies not seen in class, but this "does not automatically give an advantage and must be technically motivated". Our rule: **use what was taught by default; anything else must have a written rationale that every member can repeat at the exam** (ADR 0006).

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

The REL-DRYRUN task rehearses the rationale of the second group.

## 9. Exam-prep checklist

You must be able to explain, with the code open:

**Your modules** (`auth`, `users`, `missions`): responsibility, public API, data model, endpoints, events emitted/consumed, tests, and why each design choice was made.

**Every other module** — the whole project:
- The request path **FE → API → service → DB** for one feature of each module (routes → controller → service/domain → repository/models).
- The **auth flow**: register/login, bcrypt, JWT with `tokenVersion`, `requireAuth`/`requireRole`, server-side logout, rate limiting.
- The **server-authoritative timer**: `deadlineAt`, `serverNow`, lazy expiry + sweeper, 10 s grace, the `Clock` abstraction and `OffsetClock` in tests.
- **Secret objectives**: dedicated DTO mappers, never serialized before acceptance, how the tests prove it.
- **Restricted visibility**: why 404 instead of 403, `MissionAccess`, invitations.
- **Realtime**: Socket.IO handshake with the JWT, rooms, `notification:new`, the `seq`-based ordering and the snapshot on reconnect.
- **Concurrency on the last slot**: transaction with `SELECT … FOR UPDATE`, 409 `MISSION_FULL`, waitlist offers and claims.
- **Team ordering and consistency**: optimistic locking with `version`, `minContributors`, `TeamProgressEvent`.
- **Architecture vocabulary**: layered modular monolith, ports = Strategy + Dependency Injection, event bus = Observer, Repository per module.
- Why TypeScript, Socket.IO, Umzug, bcryptjs, helmet, Jest/Playwright, Angular (section 8) and what the alternatives were.

**Questions to rehearse in REL-DRYRUN**
1. What happens, step by step, when a user accepts a secret-timed mission, and what stops them from extending the deadline?
2. How do you guarantee that a secret objective never reaches a user who has not accepted?
3. Two users click "accept" on the last slot at the same time: what happens in the database?
4. A team member disconnects and reconnects: how is the state recovered and kept in order?
5. Why does a restricted mission return 404 and not 403?
6. Why migrations and not `sequelize.sync()`? Why TypeScript? Why Socket.IO and not polling?
7. Which patterns from the course appear in the code, and where?
8. Walk through your traceability row: requirement → use case → design component → test.
9. How do the E2E tests prove an authorization case?
10. What does the SonarCloud report say about the backend, and what did you fix?

## 10. Starter prompts

Copy a prompt into Claude Code (started inside your clone of the repository). They are given verbatim.

### Starter prompt 1 — first session on a new computer

```text
I am Vincenzo Pio Lubrano (P1) of Group 40, working on the SideQuest project (integrated INGSW + TECWEB, Federico II).
Repository: https://github.com/Mynamesdsuper/sidequest-group40 — my GitHub login is vincenzolubrano05. Speak Italian with me; write everything in the repo in English.
This is my first session on this computer. Do the following, in order, and stop where I say to stop:
1. Check that git, the GitHub CLI (logged in as vincenzolubrano05), Node.js 22 LTS + npm, Docker (daemon running) are installed. If anything is missing, give me the exact install commands for my OS and wait for me.
2. If I have not accepted the collaborator invitation yet, tell me to accept it at https://github.com/notifications and wait.
3. Ask me in which folder to clone, clone the repo, check out develop, and set git user.name "Vincenzo Pio Lubrano" and the user.email I give you (it must be the email linked to my GitHub account, so my commits count in the Git analysis).
4. Read, in this order: CLAUDE.md, PROGRESS.md (to know what has been done so far), docs/plan/PLAN.md, docs/guides/P1-vincenzo-lubrano.md, docs/reference/requirements.md, docs/decisions/assumptions.md, docs/design/data-model.md, docs/design/module-contracts.md, CONTRIBUTING.md. Then summarise for me in Italian, in at most 15 lines: my scope, my files, my first tasks, my blockers.
5. Check whether the SCAFFOLD issue is closed (npm run deps -- SCAFFOLD). If it is NOT closed yet, the code does not exist: skip this step, tell me, and remind me to run it again later. If it is closed, prepare the local environment: install Docker Desktop if missing, npm run setup:dev, create the .env files from .env.example (generate a random TOKEN_SECRET), docker compose up -d db, run migrations and seeds on the dev DB, start backend and frontend, open the health page, run the backend tests and the E2E smoke test. Report what works and fix only problems that are inside my ownership or local configuration; for anything else, draft an issue for the owner.
6. Self-assign all my issues: gh issue list --label owner:P1-vincenzo --state open, then gh issue edit <n> --add-assignee @me for each.
7. Run npm run deps -- --mine P1 and show me the result. My first tasks are: SCAFFOLD-FE first (18–22 Nov, the frontend part of the code scaffold), then S0-ASSUMPTIONS (lead) and your part of S0-API, then R01 as soon as SCAFFOLD is merged. Propose which READY task to start and why. Do NOT start coding until I confirm.
Rules for this and every session: follow CLAUDE.md; prefer what was taught in the lectures and never add a dependency without asking me; only edit files I own; never push to develop or main; never start a task whose blockers are not merged; explain what you do so that I can defend it at the exam.
```

### Starter prompt 2 — every work session on a task

```text
I am Vincenzo Pio Lubrano (P1), Group 40, SideQuest. Speak Italian with me; write everything in the repo in English. Today I want to work on task <TASK-ID>.
1. git fetch, switch to develop, pull. Run npm run deps -- <TASK-ID>. If it is BLOCKED, stop, tell me which blockers are still open, and propose my next READY task (npm run deps -- --mine P1).
2. Read the issue (gh issue list --label task:<TASK-ID> then gh issue view), CLAUDE.md, the recent entries of PROGRESS.md (all sections), the requirement in docs/reference/requirements.md, the related assumptions, the data model, the module contracts, my module's OpenAPI fragment, and ONLY the public API (index.ts / public-api.ts) of other modules I depend on.
3. If the branch does not exist yet, create it from develop: feature/<task-id-lowercase>-<short-slug> (docs/... for documentation tasks). Add the label status:in-progress to the issue (remove status:ready).
4. Write a short implementation plan, ordered: backend (migration, models, domain classes, service with authorization, controller, routes, validation with the shared Validator, events/ports), frontend (routes, components, services, responsive layout with the shared CSS tokens and no UI library, loading/empty/error states), tests (unit for domain classes, integration with supertest incl. at least one authorization-negative case, my E2E specs from docs/tecweb/e2e-catalogue.md), seeds, OpenAPI fragment, module README, my traceability row. Show it to me and wait for my OK.
5. Implement in small Conventional Commits (scope = my module). Only touch files I own. If a shared or another member's file must change, STOP and write a contract-change issue draft for the team instead.
6. Before opening the PR: lint, typecheck, backend unit and integration tests, frontend production build and the relevant E2E specs must all pass locally. Rebase on develop if needed.
7. Push and open a PR to develop using the template, with "Closes #<issue>", reviewer Matteo Marino (`reverinn`), label status:in-review.
8. Throughout the session, after EVERY progress step (each sub-step completed, each decision, each fix), add an entry at the top of my section of PROGRESS.md (format in CLAUDE.md: What / Why / Files / How to verify / Next / Commit) and include it in the same commit. At the end, add the final entry with the PR link (and "DONE" if the task is complete).
9. Finally explain to me, file by file, what you built and why, and give me 5 questions a professor could ask about this task, with the answers.
```

### Starter prompt 3 — reviewing a teammate's PR

```text
I am Vincenzo Pio Lubrano (P1), Group 40, SideQuest. Speak Italian with me. I must review PR #<n>.
Check it out locally (gh pr checkout <n>), run the tests and the relevant E2E specs, and review it against CLAUDE.md and the Definition of Done: ownership of touched files, adherence to contracts and assumptions, authorization on every endpoint (try at least one unauthorized call), input validation, no leak of secret objectives, server-side time only, error handling, responsiveness at 360 px, test quality, OpenAPI and docs updated, PROGRESS.md entries present and accurate for every step of the PR.
Explain the PR to me so that I understand it well enough to answer exam questions on it. Then draft the review (comments per file + overall verdict). Show it to me and submit it with gh pr review only after my confirmation.
```

### Starter prompt 4 — documentation task (INGSW / TECWEB)

```text
I am Vincenzo Pio Lubrano (P1), Group 40, SideQuest. Speak Italian with me; documents are in English. I want to work on documentation task <DOC-ID>.
1. Run npm run deps -- <DOC-ID>; if BLOCKED, stop and tell me.
2. Read the issue, the header of the target files in docs/ingsw/ or docs/tecweb/ (it lists exactly what the brief requires), and the actual code on develop: the documentation must match the delivered code exactly.
3. Draft the content. For UML, write or update the PlantUML draft in docs/uml/ and give me precise step-by-step instructions to redraw it in Visual Paradigm and export it as PNG into docs/ingsw/img/ (the brief requires a CASE tool). For tests, document equivalence classes, boundary values, coverage criteria, dependencies, pre/post-conditions and outcomes, and make sure the Jest tests actually exist and pass.
4. Regenerate the PDF with the matching npm script and let me check it. Then branch docs/<doc-id>-<slug>, commit, open a PR to develop with "Closes #<issue>" and reviewer Matteo Marino (`reverinn`).
5. After every progress step, add an entry at the top of my section of PROGRESS.md (What / Why / Files / How to verify / Next / Commit), committed together with the work.
```

