# Personal guide – Domenico Panaro (P3)

SideQuest · Group 40 · Federico II · A.A. 2026/27. Repository: https://github.com/Mynamesdsuper/sidequest-group40 · your GitHub login: `Mynamesdsuper`.

This guide is for **you**. Read it once fully, then use the starter prompts (section 10) with Claude Code. The master plan is `docs/plan/PLAN.md` (PDF next to it).

## 1. You and your scope

| Item | Detail |
|---|---|
| **Requirements** | R08 (invitations, package A), R10 (teams), R11 (team participation), R12 (live cooperative updates) – package B |
| **Backend modules** | `invitations`, `teams` (team participation wraps the `participations` public API; progress event log; live rooms; `TeamMembershipPort`) |
| **Frontend features** | `features/invitations`, `teams`, `team-play` |
| **Repo admin / coordinator** | SCAFFOLD-BE, SCAFFOLD (integration of the three scaffold parts), SONAR-SETUP, FREEZE, STABILIZE, REL-RC, REL-DRYRUN, REL-V1, SUBMIT; open PRs older than 48 h; milestone status |
| **INGSW** | Architecture and design chapter (components, technologies, persistence, class diagram, sequence diagram, ER), Sonar report, `TeamProgressReducer` documented unit tests, traceability and PDF assembly |
| **TECWEB** | Docker and CI setup (SCAFFOLD-BE, SCAFFOLD), E2E specs of your requirements |
| **E2E specs** | E2E-09, E2E-10, E2E-11, E2E-12 |
| **Unit-test method** | UT-2: `TeamProgressReducer.apply(state, update)` |
| **Seeds** | `04-teams`, `06-invitations` |
| **Your reviewer** | Vincenzo Pio Lubrano (P1) reviews your PRs |
| **You review** | PRs of Matteo Marino (P2) |

## 2. One-time machine setup

Install:
- **Git** (≥ 2.40) and set your identity: `git config --global user.name "Domenico Panaro"` and `git config --global user.email "<the email linked to your GitHub account>"`. This matters: commits are attributed through that email, and the Git analysis (DOC-GIT) counts them.
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

1. **SETUP** – Repository, plan, guides and GitHub setup (no code)
   - Dates: 2026-11-17 → 2026-11-17 (milestone M0)
   - Blocked by: none
   - Deliverables: Repository, branches, labels, milestones and issues created; Documentation, plan, guides and PDFs committed (no application code)
   - You hand over to: S0-ASSUMPTIONS (P1), S0-EVENTS (P2), R01 (P1)
2. **SCAFFOLD-BE** – Scaffold part 1: backend, shared core, docker-compose (db)
   - Dates: 2026-11-18 → 2026-11-21 (milestone M1)
   - Blocked by: SETUP
   - Deliverables: Backend part of `docs/design/scaffold-spec.md` (§6.1, §6.2, §6.5, §7.1, `docker-compose.yml` of §7.4): 8 empty modules, all of `shared/`, Jest unit + integration, Dockerfile; sets the TypeScript/ESLint/Prettier conventions the other two parts follow. Merge it first: SCAFFOLD-FE and SCAFFOLD-E2E rebase on it
   - You hand over to: SCAFFOLD (P3)
3. **SCAFFOLD** – Scaffold integration: ci.yml, sonar.yml, setup:dev, branch protection, README quick start
   - Dates: 2026-11-23 → 2026-11-24 (milestone M1)
   - Blocked by: SCAFFOLD-BE, SCAFFOLD-FE, SCAFFOLD-E2E
   - Deliverables: Create `ci.yml` (jobs `backend`, `frontend`, `e2e`, `plan`) and `sonar.yml`, then delete `plan.yml`; root `setup:dev` and `test:all`; end-to-end local checks; branch protection requires the four checks
   - You hand over to: R01 (P1)
4. **S0-DATAMODEL** – Freeze data model and ER diagram
   - Dates: 2026-11-23 → 2026-11-29 (milestone M1)
   - Blocked by: SETUP
   - Deliverables: Review `docs/design/data-model.md` against assumptions A-05..A-21 (every field, constraint and index); Resolve open points with the module owners; update the Mermaid ER diagram
   - You hand over to: R02 (P1)
5. **S0-API** – Freeze REST contracts (OpenAPI fragments) and module public APIs
   - Dates: 2026-11-23 → 2026-11-29 (milestone M1)
   - Blocked by: SETUP
   - Deliverables: Review the REST surface in `docs/design/module-contracts.md` and the public API signatures of every module; Once SCAFFOLD is merged: each owner fills the OpenAPI fragment of their module with placeholder paths (method, path, summary, `x-owner`, `x-requirement`, `x-status: planned`)
   - You hand over to: R02 (P1), R06A (P2)
6. **SONAR-SETUP** – SonarCloud project, token secret and first green analysis
   - Dates: 2026-11-30 → 2026-12-06 (milestone M2)
   - Blocked by: SCAFFOLD
   - Deliverables: Log in at sonarcloud.io with GitHub; Import the repo under the owner's organization
   - You hand over to: nobody directly (internal or later gating)
7. **DOC-ARCH-DRAFT** – Architecture draft: components, technologies, communication, ER
   - Dates: 2026-11-30 → 2026-12-06 (milestone M2)
   - Blocked by: S0-DATAMODEL, S0-API
   - Deliverables: Architecture draft: components, technologies, communication, ER
   - You hand over to: nobody directly (internal or later gating)
8. **R10** – R10 Exploration teams
   - Dates: 2026-12-07 → 2026-12-20 (milestone M3)
   - Blocked by: R01, S0-DATAMODEL, S0-API, S0-EVENTS
   - Deliverables: Create team (unique name 3–30, max 6 members), TEAM_ADMIN and MEMBER roles; Invite by nickname, accept/decline; leave; admin removes members; admin transfers role before leaving; last member disbands
   - You hand over to: nobody directly (internal or later gating)
9. **DOC-DESIGN-DRAFT** – Design drafts: domain class diagram, persistence chapter, components diagram
   - Dates: 2026-12-21 → 2027-01-03 (milestone M4)
   - Blocked by: DOC-ARCH-DRAFT
   - Deliverables: Design drafts: domain class diagram, persistence chapter, components diagram
   - You hand over to: nobody directly (internal or later gating)
10. **R08** – R08 Invitations to restricted missions
   - Dates: 2027-01-04 → 2027-01-17 (milestone M5)
   - Blocked by: R07, R06A
   - Deliverables: Invitations by nickname to RESTRICTED missions; one record per (mission, invitee); re-invite reopens as PENDING; duplicate PENDING → 409; Accept grants access through `missions.grantAccess` (does not accept the mission nor reserve a slot); decline; revoke removes access, started participation continues
   - You hand over to: nobody directly (internal or later gating)
11. **R11** – R11 Team participation with shared, consistent progress
   - Dates: 2027-01-18 → 2027-01-26 (milestone M6)
   - Blocked by: R10, R04, R05A, R05B
   - Deliverables: TEAM missions: only TEAM_ADMIN accepts on behalf of the team; team needs at least `minTeamSize` members; Wraps the `participations` public API; 409 `ALREADY_PARTICIPATING` for individual + team or two teams
   - You hand over to: nobody directly (internal or later gating)
12. **R12** – R12 Live cooperative updates with ordering and reconnection
   - Dates: 2027-01-27 → 2027-01-31 (milestone M6)
   - Blocked by: R11, R06A
   - Deliverables: One Socket.IO room per team participation; `team-progress:join/leave` with ack `{ ok, lastSeq }` authorized through `TeamMembershipPort`; `TeamProgressEvent` appended with strictly increasing `seq` in the same transaction; emit only after commit
   - You hand over to: nobody directly (internal or later gating)
13. **FREEZE** – Feature freeze: R01-R12 merged into develop
   - Dates: 2027-01-31 → 2027-01-31 (milestone M6)
   - Blocked by: R01, R02, R03, R04, R05A, R05B, R06A, R06B, R07, R08, R09, R10, R11, R12
   - Deliverables: Every R task issue is closed and merged into `develop`; CI green on `develop`; announce the freeze to the team (bug fixes only from now)
   - You hand over to: TW-README (P1), TW-SCHEDA (P1), DOC-GIT (P1)
14. **STABILIZE** – Stabilization week: bug fixes only
   - Dates: 2027-02-01 → 2027-02-07 (milestone M7)
   - Blocked by: FREEZE
   - Deliverables: Stabilization week: bug fixes only
   - You hand over to: nobody directly (internal or later gating)
15. **DOC-ARCH** – Architecture and design chapter final (VP class, sequence, ER diagrams)
   - Dates: 2027-02-01 → 2027-02-21 (milestone M7)
   - Blocked by: FREEZE, DOC-DESIGN-DRAFT, DOC-STATE
   - Deliverables: Architecture and design chapter final (VP class, sequence, ER diagrams)
   - You hand over to: nobody directly (internal or later gating)
16. **DOC-SONAR** – SonarCloud report, commentary and fixes
   - Dates: 2027-02-01 → 2027-02-21 (milestone M7)
   - Blocked by: FREEZE, SONAR-SETUP
   - Deliverables: SonarCloud report, commentary and fixes
   - You hand over to: nobody directly (internal or later gating)
17. **DOC-UNIT-TEAM** – Documented unit tests: TeamProgressReducer.apply(state, update)
   - Dates: 2027-02-08 → 2027-02-21 (milestone M7)
   - Blocked by: R11
   - Deliverables: Documented unit tests: TeamProgressReducer.apply(state, update)
   - You hand over to: nobody directly (internal or later gating)
18. **DOC-TRACE** – Traceability table and INGSW PDF assembly
   - Dates: 2027-02-22 → 2027-02-28 (milestone M7)
   - Blocked by: DOC-SRS, DOC-ARCH, DOC-TESTPLAN, DOC-UC01
   - Deliverables: Traceability table and INGSW PDF assembly
   - You hand over to: nobody directly (internal or later gating)
19. **CLEANUP** – Remove Claude Code traces from the final repository (files and history)
   - Dates: 2027-02-28 → 2027-02-28 (milestone M7)
   - Blocked by: STABILIZE, DOC-TRACE, DOC-GIT
   - Deliverables: Agree the final list of what to remove at the Monday sync; everyone has merged their work, no open PRs, all member branches pushed; Files: remove or move out of the repository `CLAUDE.md`; remove the Claude Code references from README, CONTRIBUTING, docs/plan/ (PLAN.md, setup-prompt.md, task data and the PDFs), docs/guides/ (starter prompts and PDFs), docs/design/scaffold-spec.md, PROGRESS.md wording and the .github templates; regenerate the PDFs
   - You hand over to: nobody directly (internal or later gating)
20. **REL-RC** – Release candidate: code and docs frozen, full CI green, tag v1.0.0-rc.1
   - Dates: 2027-03-01 → 2027-03-08 (milestone M8)
   - Blocked by: CLEANUP, STABILIZE, DOC-TRACE, DOC-SONAR, DOC-UNIT-TIMER, DOC-UNIT-TEAM, DOC-DESIGN-EXAMPLE, DOC-GIT, TW-README, TW-SCHEDA
   - Deliverables: Release candidate: code and docs frozen, full CI green, tag v1.0.0-rc.1
   - You hand over to: nobody directly (internal or later gating)
21. **REL-DRYRUN** – Exam dry-run: demo rehearsal and cross-module knowledge sessions (everyone explains everyone's code)
   - Dates: 2027-03-09 → 2027-03-14 (milestone M8)
   - Blocked by: REL-RC
   - Deliverables: Exam dry-run: demo rehearsal and cross-module knowledge sessions (everyone explains everyone's code)
   - You hand over to: nobody directly (internal or later gating)
22. **REL-V1** – Release v1.0.0: merge develop into main, tag, final PDFs
   - Dates: 2027-03-15 → 2027-03-15 (milestone M8)
   - Blocked by: REL-DRYRUN
   - Deliverables: Release PR `develop` → `main` with a merge commit; tag `v1.0.0`; Final PDFs generated and committed; README and summary sheet up to date
   - You hand over to: nobody directly (internal or later gating)
23. **SUBMIT** – Submit repository URL on the Teams assignment
   - Dates: 2027-03-16 → 2027-03-25 (milestone M8)
   - Blocked by: REL-V1
   - Deliverables: Post the repository URL on the Teams assignment before 25 Mar 2027; Check the repo is public and contains no `node_modules`, secrets or course PDFs
   - You hand over to: nobody directly (internal or later gating)

## 4. What others need from you, and what you need from others

### What others need from you

| Your task | Unblocks | Whose | When they want to start |
|---|---|---|---|
| SETUP (due 2026-11-17) | S0-ASSUMPTIONS | P1 | starts 2026-11-23 |
| SETUP (due 2026-11-17) | S0-EVENTS | P2 | starts 2026-11-23 |
| SETUP (due 2026-11-17) | R01 | P1 | starts 2026-11-25 |
| SCAFFOLD-BE (due 2026-11-21) | SCAFFOLD-FE, SCAFFOLD-E2E rebase on it (not a formal blocker) | P1, P2 | already started 2026-11-18 |
| SCAFFOLD (due 2026-11-24) | R01 | P1 | starts 2026-11-25 |
| S0-DATAMODEL (due 2026-11-29) | R02 | P1 | starts 2026-12-07 |
| S0-API (due 2026-11-29) | R02 | P1 | starts 2026-12-07 |
| S0-API (due 2026-11-29) | R06A | P2 | starts 2026-12-07 |
| FREEZE (due 2027-01-31) | TW-README | P1 | starts 2027-02-01 |
| FREEZE (due 2027-01-31) | TW-SCHEDA | P1 | starts 2027-02-15 |
| FREEZE (due 2027-01-31) | DOC-GIT | P1 | starts 2027-02-15 |

### What you need from others

| Your task | Blocked by | Whose | Their due date |
|---|---|---|---|
| SCAFFOLD | SCAFFOLD-FE | P1 | due 2026-11-22 |
| SCAFFOLD | SCAFFOLD-E2E | P2 | due 2026-11-22 |
| R10 | R01 | P1 | due 2026-12-06 |
| R10 | S0-EVENTS | P2 | due 2026-11-29 |
| R08 | R07 | P1 | due 2027-01-03 |
| R08 | R06A | P2 | due 2026-12-16 |
| R11 | R04 | P2 | due 2027-01-03 |
| R11 | R05A | P2 | due 2027-01-10 |
| R11 | R05B | P2 | due 2027-01-17 |
| R12 | R06A | P2 | due 2026-12-16 |
| FREEZE | R01 | P1 | due 2026-12-06 |
| FREEZE | R02 | P1 | due 2026-12-20 |
| FREEZE | R03 | P1 | due 2027-01-17 |
| FREEZE | R04 | P2 | due 2027-01-03 |
| FREEZE | R05A | P2 | due 2027-01-10 |
| FREEZE | R05B | P2 | due 2027-01-17 |
| FREEZE | R06A | P2 | due 2026-12-16 |
| FREEZE | R06B | P2 | due 2027-01-31 |
| FREEZE | R07 | P1 | due 2027-01-03 |
| FREEZE | R09 | P2 | due 2027-01-24 |
| DOC-ARCH | DOC-STATE | P2 | due 2026-12-13 |
| DOC-TRACE | DOC-SRS | P1 | due 2027-02-21 |
| DOC-TRACE | DOC-TESTPLAN | P2 | due 2027-02-21 |
| DOC-TRACE | DOC-UC01 | P2 | due 2027-02-14 |
| CLEANUP | DOC-GIT | P1 | due 2027-02-28 |
| REL-RC | DOC-UNIT-TIMER | P2 | due 2027-02-21 |
| REL-RC | DOC-DESIGN-EXAMPLE | P2 | due 2027-02-28 |
| REL-RC | DOC-GIT | P1 | due 2027-02-28 |
| REL-RC | TW-README | P1 | due 2027-02-21 |
| REL-RC | TW-SCHEDA | P1 | due 2027-02-21 |

## 5. How to check whether you can start

```bash
npm run deps -- <TASK-ID>      # prints each blocker with state and link, then READY or BLOCKED (exit code 0 / 1)
npm run deps -- --mine P3    # your tasks grouped as DONE, READY, BLOCKED, PLANNED, with the next task marked
npm run deps -- --all          # whole-team view
```

If you are blocked, work on your next READY task. The **fallback order** is: (1) your documentation tasks; (2) E2E specs and tests of your merged tasks; (3) reviews of teammates' PRs; (4) Sonar fixes in your modules; (5) helping by reviewing contracts. If a blocker is more than 3 days late, raise it at the Monday sync; the owner may then merge a minimal vertical slice so you can start.

## 5b. Directives from the coordinator

The coordinator (Domenico, P3) can send instructions to anyone as GitHub issues labelled `type:directive`, authored by `Mynamesdsuper`. You see them at the end of `npm run deps -- --mine P3` and Claude Code lists them at the start of each session (rule in `CLAUDE.md`). Only issues authored by the coordinator count. Acknowledge with a comment, do the work through a branch + PR (only files you own, otherwise a contract-change), log it in `PROGRESS.md`, close the issue when done.

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
### 2026-11-25 14:30 · R01 · feat: login e logout con JWT
- **Cosa:** cosa è stato fatto, in 1–3 righe.
- **Perché:** il motivo o la decisione (con il riferimento all'assunzione A-xx, all'ADR o alla issue, se c'è).
- **File:** i file o le cartelle principali toccati.
- **Come verificare:** il comando, il test o la schermata che dimostra che funziona.
- **Prossimi passi:** cosa resta, blocchi, domande per il team (oppure "nessuno").
- **Commit/PR:** hash breve o #PR (da aggiungere quando si conosce).
```

- An entry is added after every progress step: each completed sub-step, each commit that changes behaviour, each decision, each fix, each merged PR. Several entries per day are normal; a day of work with no entry is not.
- Each person writes only in their own section, always at the top of it. If a merge conflict happens anyway, keep both entries.
- The entry is committed in the same commit as the work it describes, never in a separate PR.
- Write the entries **in Italian** (the only exception to "everything in the repository is in English"), concise and concrete; explain the *why*. The title always starts with date **and time** (`YYYY-MM-DD HH:MM`): the project history orders the entries by it.
- When a task is closed, the last entry says "DONE" and links the merged PR.

## 7. Definition of Done

- Backend: migration(s), models, domain classes, service, controller, routes; input validation with the shared `Validator`; authorization checked in the service layer; meaningful error codes; domain events emitted; OpenAPI fragment updated (`x-status: done`).
- Frontend: screens responsive at 360 px and desktop; loading, empty and error states; no secret data in network responses where forbidden.
- Tests: unit tests for the domain classes; integration tests with supertest incl. **at least one authorization-negative case**; the assigned E2E specs pass in CI.
- Seeds updated with demo data (no physical travel needed).
- `PROGRESS.md` updated after every step, with a final "DONE" entry linking the PR.
- Docs updated: module README, your traceability row (`docs/ingsw/05-traceability/P3.md`), the README features table.
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

**Your modules** (`invitations`, `teams`): responsibility, public API, data model, endpoints, events emitted/consumed, tests, and why each design choice was made.

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
I am Domenico Panaro (P3) of Group 40, working on the SideQuest project (integrated INGSW + TECWEB, Federico II).
Repository: https://github.com/Mynamesdsuper/sidequest-group40 — my GitHub login is Mynamesdsuper. Speak Italian with me; write everything in the repo in English, except the PROGRESS.md entries, which are in Italian.
This is my first session on this computer. Do the following, in order, and stop where I say to stop:
1. Check that git, the GitHub CLI (logged in as Mynamesdsuper), Node.js 22 LTS + npm, Docker (daemon running) are installed. If anything is missing, give me the exact install commands for my OS and wait for me.
2. If I have not accepted the collaborator invitation yet, tell me to accept it at https://github.com/notifications and wait.
3. Ask me in which folder to clone, clone the repo, check out develop, and set git user.name "Domenico Panaro" and the user.email I give you (it must be the email linked to my GitHub account, so my commits count in the Git analysis).
4. Read, in this order: CLAUDE.md, PROGRESS.md (to know what has been done so far), docs/plan/PLAN.md, docs/guides/P3-domenico-panaro.md, docs/reference/requirements.md, docs/decisions/assumptions.md, docs/design/data-model.md, docs/design/module-contracts.md, CONTRIBUTING.md. Then summarise for me in Italian, in at most 15 lines: my scope, my files, my first tasks, my blockers.
5. Check whether the SCAFFOLD issue is closed (npm run deps -- SCAFFOLD). If it is NOT closed yet, the code does not exist: skip this step, tell me, and remind me to run it again later. If it is closed, prepare the local environment: install Docker Desktop if missing, npm run setup:dev, create the .env files from .env.example (generate a random TOKEN_SECRET), docker compose up -d db, run migrations and seeds on the dev DB, start backend and frontend, open the health page, run the backend tests and the E2E smoke test. Report what works and fix only problems that are inside my ownership or local configuration; for anything else, draft an issue for the owner.
6. Self-assign all my issues: gh issue list --label owner:P3-domenico --state open, then gh issue edit <n> --add-assignee @me for each.
7. Run npm run deps -- --mine P3 and show me the result. My first tasks are: SCAFFOLD-BE first (by 21 Nov), then SCAFFOLD, the integration of the three scaffold parts (by 24 Nov, everyone else's coding depends on it), then S0-DATAMODEL and S0-API (lead), then SONAR-SETUP and DOC-ARCH-DRAFT. Propose which READY task to start and why. Do NOT start coding until I confirm.
Rules for this and every session: follow CLAUDE.md; prefer what was taught in the lectures and never add a dependency without asking me; only edit files I own; never push to develop or main; never start a task whose blockers are not merged; explain what you do so that I can defend it at the exam. "I am also the repo admin and coordinator: also check open PRs older than 48 h and the milestone status."
```

### Starter prompt 2 — every work session on a task

```text
I am Domenico Panaro (P3), Group 40, SideQuest. Speak Italian with me; write everything in the repo in English, except the PROGRESS.md entries, which are in Italian. Today I want to work on task <TASK-ID>.
1. git fetch, switch to develop, pull. Run npm run deps -- <TASK-ID>. If it is BLOCKED, stop, tell me which blockers are still open, and propose my next READY task (npm run deps -- --mine P3).
2. Read the issue (gh issue list --label task:<TASK-ID> then gh issue view), CLAUDE.md, the recent entries of PROGRESS.md (all sections), the requirement in docs/reference/requirements.md, the related assumptions, the data model, the module contracts, my module's OpenAPI fragment, and ONLY the public API (index.ts / public-api.ts) of other modules I depend on.
3. If the branch does not exist yet, create it from develop: feature/<task-id-lowercase>-<short-slug> (docs/... for documentation tasks). Add the label status:in-progress to the issue (remove status:ready).
4. Write a short implementation plan, ordered: backend (migration, models, domain classes, service with authorization, controller, routes, validation with the shared Validator, events/ports), frontend (routes, components, services, responsive layout with the shared CSS tokens and no UI library, loading/empty/error states), tests (unit for domain classes, integration with supertest incl. at least one authorization-negative case, my E2E specs from docs/tecweb/e2e-catalogue.md), seeds, OpenAPI fragment, module README, my traceability row. Show it to me and wait for my OK.
5. Implement in small Conventional Commits (scope = my module). Only touch files I own. If a shared or another member's file must change, STOP and write a contract-change issue draft for the team instead.
6. Before opening the PR: lint, typecheck, backend unit and integration tests, frontend production build and the relevant E2E specs must all pass locally. Rebase on develop if needed.
7. Push and open a PR to develop using the template, with "Closes #<issue>", reviewer Vincenzo Pio Lubrano (`vincenzolubrano05`), label status:in-review.
8. Throughout the session, after EVERY progress step (each sub-step completed, each decision, each fix), add an entry at the top of my section of PROGRESS.md (format in CLAUDE.md: What / Why / Files / How to verify / Next / Commit) and include it in the same commit. At the end, add the final entry with the PR link (and "DONE" if the task is complete).
9. Finally explain to me, file by file, what you built and why, and give me 5 questions a professor could ask about this task, with the answers.
```

### Starter prompt 3 — reviewing a teammate's PR

```text
I am Domenico Panaro (P3), Group 40, SideQuest. Speak Italian with me. I must review PR #<n>.
Check it out locally (gh pr checkout <n>), run the tests and the relevant E2E specs, and review it against CLAUDE.md and the Definition of Done: ownership of touched files, adherence to contracts and assumptions, authorization on every endpoint (try at least one unauthorized call), input validation, no leak of secret objectives, server-side time only, error handling, responsiveness at 360 px, test quality, OpenAPI and docs updated, PROGRESS.md entries present and accurate for every step of the PR.
Explain the PR to me so that I understand it well enough to answer exam questions on it. Then draft the review (comments per file + overall verdict). Show it to me and submit it with gh pr review only after my confirmation.
```

### Starter prompt 4 — documentation task (INGSW / TECWEB)

```text
I am Domenico Panaro (P3), Group 40, SideQuest. Speak Italian with me; documents are in English. I want to work on documentation task <DOC-ID>.
1. Run npm run deps -- <DOC-ID>; if BLOCKED, stop and tell me.
2. Read the issue, the header of the target files in docs/ingsw/ or docs/tecweb/ (it lists exactly what the brief requires), and the actual code on develop: the documentation must match the delivered code exactly.
3. Draft the content. For UML, write or update the PlantUML draft in docs/uml/ and give me precise step-by-step instructions to redraw it in Visual Paradigm and export it as PNG into docs/ingsw/img/ (the brief requires a CASE tool). For tests, document equivalence classes, boundary values, coverage criteria, dependencies, pre/post-conditions and outcomes, and make sure the Jest tests actually exist and pass.
4. Regenerate the PDF with the matching npm script and let me check it. Then branch docs/<doc-id>-<slug>, commit, open a PR to develop with "Closes #<issue>" and reviewer Vincenzo Pio Lubrano (`vincenzolubrano05`).
5. After every progress step, add an entry at the top of my section of PROGRESS.md (What / Why / Files / How to verify / Next / Commit), committed together with the work.
```

## 11. Coordinator notes (P3 only)

### SCAFFOLD-BE and SCAFFOLD (your first tasks, due 21 and 24 Nov 2026)
The scaffold is split in three parts that run in parallel from 18 Nov, so every member is active from day one: **SCAFFOLD-BE** (you: backend, shared core, `docker-compose.yml`), **SCAFFOLD-FE** (Vincenzo: Angular frontend) and **SCAFFOLD-E2E** (Matteo: Playwright and the demo stack). Merge SCAFFOLD-BE first, because it sets the TypeScript/ESLint/Prettier conventions and the other two rebase on it. Reviews: SCAFFOLD-BE needs Vincenzo **and** Matteo (module folders have different code owners); SCAFFOLD-FE needs Matteo and you (P3 feature folders); SCAFFOLD-E2E needs you. Then **SCAFFOLD** (integration) adds `ci.yml`, `sonar.yml`, `setup:dev` and the branch protection. Start each with **Starter prompt 2** and its task ID. Everyone else's coding depends on SCAFFOLD. The specification is `docs/design/scaffold-spec.md` (a verbatim copy of §4, §6.1–§6.3, §6.5, §7, the ci/sonar workflows and the SCAFFOLD checklist). Infrastructure only, no requirement logic. After the merge, update the branch protection of `develop` and `main` to require `["backend","frontend","e2e","plan"]` and read it back.

### SONAR-SETUP – exact steps (30 Nov – 6 Dec 2026)
1. Log in at https://sonarcloud.io with GitHub.
2. Import the repository under your organization.
3. Choose "GitHub Actions" analysis and turn **off** automatic analysis.
4. Copy the organization and project key into `sonar-project.properties`.
5. Create a token, then `gh secret set SONAR_TOKEN`.
6. Push and check that the first analysis is green.

### CLEANUP – remove the Claude Code traces (28 Feb 2027, before REL-RC)
Do this only after DOC-GIT and DOC-TRACE are done and everyone has merged. Files: remove or move out CLAUDE.md and the references in README, CONTRIBUTING, docs/plan, docs/guides (starter prompts and PDFs), scaffold-spec, PROGRESS wording, .github templates. History: rewrite commits to drop the Co-Authored-By trailers (authors and dates stay, so the Git analysis is unaffected). Needs a temporary lift of the branch protection and a force-push, then re-enable and read it back; everyone re-clones. Full checklist in the CLEANUP issue.

### Giving directives to the team
From your Claude Code session: npm run directive -- --to P1|P2|P3|all --title "..." --body "..." --due YYYY-MM-DD --task ID --priority high (add --dry-run to preview; --list to see the open ones). Each directive is a GitHub issue labelled type:directive and assigned to the member (if the invitation is not accepted yet it is created unassigned and mentions them). Members see it with deps --mine and in every session. Check acknowledgements at the start of each session.

### Weekly coordination
Monday sync (30 min): merged work, `npm run deps -- --all`, contract-change requests. Check PRs older than 48 h and the milestone status. Sprint 0 kickoff call: **Monday 23 Nov 2026**.

