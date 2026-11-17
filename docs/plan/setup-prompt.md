# SETUP PROMPT — SideQuest, Group 40 (paste this whole file into Claude Code)

## 0. Your role, scope and ground rules

You are creating, from zero, the GitHub repository and the **project-management kit** for **SideQuest**, a university group project at Università degli Studi di Napoli Federico II (A.A. 2026/27, Group **40**). The same software will be used for two exams: **Ingegneria del Software (INGSW)** and **Tecnologie Web (TECWEB)**. That makes this an *integrated* project, and the work is split among three students.

You are running on Domenico's laptop. **Nobody will work on this machine after you finish.** Each of the three members (Domenico included) will clone the repository on their own computer and carry on with Claude Code, using the personal guide and the starter prompts you produce. So everything must end up committed, pushed and self-explanatory.

### 0.1 SCOPE OF THIS SESSION — read this first, it overrides everything else in this file

This session is **only the initial setup**: an organized repository that tells the three members exactly what to do. **You write no application code at all.** Many later sections of this file (§6, §7) describe the code scaffold in detail: that text is a **specification to copy into the docs**, not work for you. The scaffold is built later, on Domenico's desktop, as the task **SCAFFOLD** (owner P3).

**You DO, and nothing more:**

1. Create the GitHub repo `sidequest-group40` (public), with the branches `main` and `develop`.
2. Write the **documentation and planning files only**:
   - `README.md` (short: group, members, packages, status "setup only, scaffold pending: task SCAFFOLD", links to the docs);
   - `CLAUDE.md` (§10), `CONTRIBUTING.md`, `.gitignore`, `.gitattributes`, `.editorconfig`;
   - `docs/reference/requirements.md` (§3);
   - `docs/decisions/assumptions.md` (§5) and the ADRs 0001–0006 (§4, §4.1), each short (at most one page);
   - `docs/design/data-model.md`, `docs/design/module-contracts.md`, `docs/api/realtime-events.md` (§6.4, as PROPOSED drafts in Markdown: tables and signatures, **no `.ts` files**);
   - `docs/design/scaffold-spec.md`: **a copy of §4 (the stack table and §4.1), §6.1–§6.3, §6.5, §7 and the `ci.yml` / `sonar.yml` part of §9 step 7 of this file, verbatim**, plus the SCAFFOLD checklist of §8.3, to be implemented later by the task SCAFFOLD;
   - `docs/plan/PLAN.md`, `docs/plan/tasks.json`, `docs/plan/team.json`;
   - `PROGRESS.md` at the repo root: the project's progress log (§0.2), created now and filled with this session's entries;
   - `docs/guides/P1-vincenzo-lubrano.md`, `P2-matteo-marino.md`, `P3-domenico-panaro.md` (§12);
   - `docs/tecweb/e2e-catalogue.md` (§8.5);
   - `docs/ingsw/README.md`: **one file only**, with the planned chapter structure, owners and due dates (from §7.8). Do **not** create the chapter files or the UML drafts; the DOC tasks create them.
3. Write the **planning tools only** (Node.js `.mjs`, no npm dependencies except those needed for the PDFs): `scripts/validate-plan.mjs`, `scripts/deps.mjs`, `scripts/create-issues.mjs`, `scripts/render-pdf.mjs`, plus a minimal root `package.json` with the scripts `deps`, `issues:sync`, `plan:validate`, `pdf:plan`, `pdf:guides`.
4. Generate and commit the PDFs: the master plan and the three guides (§11).
5. Configure GitHub (§9): `.github/CODEOWNERS`, PR and issue templates, labels, milestones, all the issues from `tasks.json`, collaborator invitations, the optional board, and **only two workflows**: `plan.yml` (runs `validate-plan.mjs`, job name `plan`) and `deps-labeler.yml`. Then branch protection, with required status check `plan` only.

**You DO NOT, under any circumstances:**

- create `backend/`, `frontend/`, `e2e/` or `docker/`, or run `ng new`, `npm init` inside them, `npx` generators, or any `npm install` other than the root PDF tooling;
- write any `.ts` file, migration, model, route, component, test, Dockerfile, `docker-compose.yml`, `.env.example`, `sonar-project.properties`, or the `ci.yml` / `sonar.yml` workflows: **all of that is the task SCAFFOLD**;
- start Docker, a database or any server (Docker is not needed in this session);
- implement or stub any requirement R01–R12.

If you notice you are about to write code, stop: put the information in `docs/design/scaffold-spec.md` or in the relevant issue body instead.

**Size target:** the whole commit of this session is documentation, plan, guides, PDFs, the four scripts and the GitHub config. If you find yourself spending more than a few minutes on anything else, you are out of scope.

**Existing repository:** in Step 1, check `gh repo view <OWNER>/sidequest-group40`. If it already exists (for example from a previous attempt), **stop and ask Domenico** whether to delete it (`gh repo delete`, which needs the `delete_repo` scope) or to stop. Never delete anything without his explicit yes.

Hard rules for this session:

1. **Do NOT implement any functional requirement (R01–R12) and do not write application code** (see §0.1). Requirement logic and the scaffold are written later by their owners.
2. **Precision over speed.** Run every command for real, read the output, and fix what fails. Never claim something works without having run it.
3. **Language.** Everything you write into the repository is in **English**: code, comments, commit messages, docs, guides, PDFs, issues, PR templates. **Speak Italian with Domenico.**
4. **Cross-platform.** The members may use Windows, macOS or Linux. Helper scripts must be Node.js (`.mjs`), never bash-only. Use LF line endings through `.gitattributes`.
5. **No secrets** in the repo. Never commit the course PDFs: the repository is public.
6. **Questions.** Ask Domenico questions only in Step 1 (preflight). After that, work autonomously to the end. Stop again only if something fails in a way you cannot fix, or before an action that cannot be undone and is not described in this prompt.
7. **Progress log.** Record this session in `PROGRESS.md` (§0.2), in the section "Setup (laptop session)": add an entry **after every completed step** (repo created, each group of docs written, scripts, PDFs, labels/milestones/issues, workflows, protection, verification), not only at the end. Commit it together with the work it describes.

### 0.2 The progress log `PROGRESS.md` (a permanent project rule, not only for this session)

`PROGRESS.md` at the repository root is the running log of **every change made to the project, with its explanation**. Its purpose is to let any member (and any Claude Code session) know at any moment what was done, by whom, why, and how to check it; it is also raw material for the Git analysis (DOC-GIT) and for exam preparation.

**Structure** (create it exactly like this):

```markdown
# SideQuest – Progress log

How to use this file: see "Progress log rules" in CLAUDE.md.
Newest entries go at the TOP of your own section. Never edit other members' sections.

## Setup (laptop session)
## P1 – Vincenzo Pio Lubrano
## P2 – Matteo Marino
## P3 – Domenico Panaro
```

**Entry format** (one entry per progress step, newest first inside the section):

```markdown
### 2026-11-25 14:30 · R01 · feat: JWT login and logout
- **What:** what was done, in 1–3 lines.
- **Why:** the reason or decision behind it (link the assumption A-xx, ADR or issue if relevant).
- **Files:** the main files or folders touched.
- **How to verify:** the command, test or screen that proves it works.
- **Next / open points:** what remains, blockers, questions for the team (or "none").
- **Commit/PR:** short hash or #PR (add it when known).
```

**Rules:**
- An entry is added **after every progress step**: every completed sub-step of a task, every commit that changes behaviour, every decision, every fix, every merged PR. Several entries per day are normal; a day of work with no entry is not.
- Each person writes **only in their own section**, always at the top of it, so that parallel branches do not conflict. If a merge conflict happens anyway in `PROGRESS.md`, keep both entries.
- The entry is committed **in the same commit** as the work it describes (or immediately after, in the same branch), never in a separate PR.
- Write in English, concise and concrete; explain the *why*, not only the *what*.
- When a task is closed, the last entry says "DONE" and links the merged PR.
- `PROGRESS.md` is a shared file (CODEOWNERS: all three), but appending in your own section never requires the contract-change process.

---

## 1. Preflight (the only interactive step)

1. Check the tools and report the versions:
   - `git` ≥ 2.40
   - `gh` CLI, logged in (`gh auth status`) with scopes `repo` and `workflow`
   - Node.js ≥ 22 LTS and npm (only for the planning scripts and the PDFs)
   - Optional: the `project` scope on `gh`, for the project board
   - Docker is **not** needed in this session.
   - Whether `<OWNER>/sidequest-group40` already exists (see §0.1, "Existing repository").

   If something is missing, give Domenico the exact install or fix command for his OS and wait. For the `project` scope, the command is `gh auth refresh -s project`.
2. Get Domenico's GitHub login with `gh api user -q .login`.
3. Ask Domenico **in one single message**:
   - (a) Matteo Marino's GitHub username
   - (b) Vincenzo Pio Lubrano's GitHub username
   - (c) the parent folder for the clone (default `~/Projects`)
   - (d) confirmation of the git `user.name` / `user.email` to use for the commits in this session. The email must be the one linked to his GitHub account, otherwise the commits will not be attributed to him in the Git analysis.
   - (e) whether to create the GitHub Project board (default: yes, if the `project` scope is available)
4. Validate both usernames with `gh api users/<login>`. If one does not exist, ask again.

From here on, `<OWNER>` = Domenico's login, `<GH_P1>` = Vincenzo's login, `<GH_P2>` = Matteo's login, `<GH_P3>` = `<OWNER>`.

---

## 2. Fixed project facts (single source of truth)

### 2.1 Team

| Role | Name | Student ID | GitHub | Exams | Reviews PRs of | PRs reviewed by |
|---|---|---|---|---|---|---|
| **P1** | Vincenzo Pio Lubrano | N86005417 | `<GH_P1>` | INGSW + TECWEB | P3 | P2 |
| **P2** | Matteo Marino | N86005461 | `<GH_P2>` | INGSW + TECWEB | P1 | P3 |
| **P3** | Domenico Panaro (repo owner/admin, coordinator) | N86005622 | `<GH_P3>` | INGSW + TECWEB | P2 | P1 |

### 2.2 Assignment

- Group ID **40**. The last digit is 0, and 0 mod 5 = 0, so the first package is **A**. With 3 members you get 2 packages: **A (R07–R09) + B (R10–R12)**, plus the mandatory core **R01–R06**.
- Delivery type: **early delivery** (by 31/03/2027), so the requirements are **R01–R12**. Project type: **integrated** (INGSW + TECWEB, one single product).
- Repository: `https://github.com/<OWNER>/sidequest-group40`, **public**. Submission is done by posting the repo URL in the Teams assignment.

### 2.3 What the early delivery requires (from the official brief)

**Common to both exams:** frontend and backend source in separate directories, config files and build scripts, dependency descriptors (no `node_modules`), a README with reproducible run instructions, instructions for the demo database and demo accounts, the group ID and members, and the list of implemented features.

**TECWEB (Appendix B):**
- an SPA built with a framework, responsive on every flow;
- a backend built with a web framework, with documented APIs and server-side authN/authZ;
- server-side persistence for accounts, missions, acceptances, progress and notifications;
- a server-authoritative timer, and the client must never receive secret objectives early;
- an interactive map with Leaflet + OSM, attribution included;
- notifications that appear without a manual refresh;
- input validation, HTTP and network error handling, and credential protection;
- deliverables: README (prerequisites, install and start commands, config, demo data, test credentials, features, technologies), a **one-page summary sheet** (group ID, members, type, packages, technologies, main APIs), **at least 10 automated, non-duplicate E2E tests including at least one negative or authorization case**, and demo data plus instructions to run the tests. Docker is appreciated.

**INGSW (Appendix C), early-delivery column.** A **single PDF** with these chapters:
- **SRS:** glossary; actors + a Use Case Diagram covering **all** use cases of R01–R12; personas; non-functional and domain requirements; **one** structured use case (Cockburn style, not registration or login) **plus mockups**; the rationale for the assumptions that resolve ambiguities.
- **Architecture & design:** architecture, components and responsibilities with rationale; technologies, trade-offs and FE/BE communication; persistence model and domain entities with constraints and relations; a design class diagram; at least one sequence, state or activity diagram for a non-trivial feature; at least one reasoned example of how the design supports a non-trivial feature.
- **Process:** evidence of version control with a short repository analysis (commits, contributors, trend); a SonarQube/SonarCloud report on the **backend** with commentary on the main issues and the fixes.
- **Testing:** a test plan for **1** significant feature (strategy, pre- and post-conditions); documented xUnit-family unit tests for **2** non-trivial methods with ≥2 parameters (equivalence classes, boundary values, coverage criteria, dependencies, pre/post-conditions, outcomes); a methodological comment.
- A traceability table (requirements → use cases → design components → tests) is appreciated.
- UML must be drawn with a CASE tool (Visual Paradigm). We keep PlantUML drafts in the repo and redraw them in Visual Paradigm for the final PDF.

### 2.4 Internal deadlines

| Date | Event |
|---|---|
| Tue 17 Nov 2026 | Setup done (this session: repo, plan, guides, issues; no code) |
| Tue 24 Nov 2026 | Code scaffold merged (task SCAFFOLD, P3, on his desktop) |
| Sun 29 Nov 2026 | Sprint 0 done: assumptions, data model, API and event contracts frozen |
| **Sun 31 Jan 2027** | **Feature freeze: all of R01–R12 merged into `develop`** |
| 1–7 Feb 2027 | Stabilization buffer (bug fixes only; R12 may close here at the latest) |
| Sun 28 Feb 2027 | All documentation complete |
| Mon 15 Mar 2027 | Release `v1.0.0` on `main` |
| Thu 25 Mar 2027 | Submission on Teams (the official hard deadline is 31 Mar 2027) |

---

## 3. Requirements reference

Write `docs/reference/requirements.md`: a faithful **paraphrase** (not a copy) of the brief. For every requirement, add the owner and the task IDs from §8.

- **R01 Accounts, access, profile (P1).** Register, log in, log out. Authenticated users have a profile with a nickname and editable personal info. Platform managers need admin functions. Data must stay confidential, and unauthorized parties must not be able to perform operations.
- **R02 Mission creation and publication (P1).** An authenticated user creates a mission with title, presentation, category, objectives, an optional place, the ordinary or secret-timed mode, and optional participation conditions. A mission can be edited while no participant has started it. There is a publication mechanism, and missions can appear on the map.
- **R03 Exploration and search (P1).** Users, guests included, explore published missions through a list and an interactive map. Search and filters cover at least keyword, category and availability. A secret-timed mission shows enough to decide whether to accept it, without revealing the objectives.
- **R04 Acceptance and timed missions (P2).** An authenticated user accepts an available mission. For secret-timed missions, accepting starts the countdown and reveals the objectives. The remaining time is based on authoritative server information, so changing device, reloading or tampering with the local clock cannot extend it. Expired missions are recognized as such.
- **R05 Progress, proofs and completion (P2).** The participant sees the objectives, marks the ones they consider done and attaches proofs (text or image). The system stores progress and determines the outcome: success, abandoned or expired. There must be coherent criteria for verifying proofs and awarding points.
- **R06 Personal area and live notifications (P2).** The user sees the missions they created and the ones they take part in, with their status. Notifications are produced for relevant events (acceptance, status change, proof verification). New notifications appear without a manual reload and can be consulted later.
- **R07 Restricted visibility (P1, package A).** A mission is public or restricted to selected users. Restricted content must never be reachable by unauthorized users through direct URLs or API calls.
- **R08 Invitations (P3, package A).** The author invites users to a restricted mission. Invitees accept or decline and are informed promptly. The author sees the invitation status. Revocation and multiple invitations need a defined behaviour.
- **R09 Capacity and waitlist (P2, package A).** A maximum number of participants. When the places are full, users can join a waitlist. The system handles withdrawals, places that free up later, and several users competing for the last place at the same time.
- **R10 Exploration teams (P3, package B).** Users create a team, name it and invite others. There are distinct roles for the team admin and the members, and the essential join and leave operations.
- **R11 Team participation (P3, package B).** Some missions are for teams. Progress is shared, and completion may depend on contributions from several members. No participant may obtain results that are inconsistent with the shared state.
- **R12 Live cooperative updates (P3, package B).** Connected members promptly see each other's progress. The logical order of updates and the consistency of the state are preserved, even when a member disconnects and reconnects.
- **Cross-cutting requirements:** persistence, access control, input validation, understandable errors, desktop and mobile support, and demos that do not need physical travel or unavailable external services.
- **Ambiguities the brief explicitly asks us to resolve:** editing missions with active participants; reopening or repeating a mission; proofs sent just before the deadline; the meaning of withdrawal; visibility of personal data; scoring criteria; concurrent invitations and access; consistency of team progress. These are covered in §5.

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

## 5. Domain assumptions (PROPOSED: the team ratifies them in Sprint 0)

Write `docs/decisions/assumptions.md` as a table with these columns: `ID | Topic | Decision | Rationale | Requirements | Status`. Every row starts with Status `PROPOSED`. Task S0-ASSUMPTIONS turns them into `ACCEPTED` (or changes them through a PR). Content:

- **A-01 Roles.** GUEST (not logged in), USER, ADMIN (admin = moderator). The "author" is the USER who created a mission. Team roles are TEAM_ADMIN and MEMBER.
- **A-02 Authentication.** Email + password (bcrypt). The JWT access token expires after 2 h and is stored in `localStorage`. Each `User` has a `tokenVersion` that goes into the JWT; logout, suspension and password change increment it, which invalidates all outstanding tokens (a real server-side logout). Login and register are rate-limited.
- **A-03 Personal data.** The public profile shows nickname, avatar URL, bio, city and total points. Email and full name are visible only to the user and to admins.
- **A-04 Admin functions.** List and search users; suspend or reactivate a user (a suspended user cannot log in, and their PUBLISHED missions become CLOSED); promote or demote admins (never yourself); close or archive any mission. One admin account is seeded.
- **A-05 Mission lifecycle.** DRAFT → PUBLISHED → CLOSED (no new acceptances; running participations continue) → ARCHIVED (hidden from explore; still visible to the author and to past participants in their history). Only DRAFT missions can be deleted. Archiving is allowed only when no participation is ACTIVE or SUBMITTED.
- **A-06 Editing.** DRAFT missions, and PUBLISHED missions that have never been accepted, are fully editable. After the first acceptance, only title, teaser, description and conditions can be edited. Objectives, mode, time limit, participation type, team sizes and maxAttempts are locked; capacity can only go up; visibility can only widen (RESTRICTED → PUBLIC). Optimistic locking (a `version` column) prevents races between edit and accept.
- **A-07 Secret-timed preview.** Before acceptance the user sees: title, teaser, category, time limit, number of objectives, total points, an approximate location (if any), participation type and conditions. Objective titles, descriptions and answers are **never** serialized before acceptance (dedicated DTO mappers, covered by tests). For ORDINARY missions the objectives are visible to anyone who can view the mission.
- **A-08 Timer.** On acceptance the server stores `deadlineAt = acceptedAt + timeLimit`, using the server `Clock`. Responses carry `deadlineAt` and `serverNow`; the client computes its offset and shows the countdown, but every decision is made on the server. Expiry is evaluated lazily on every read and write, and a background sweeper (every 30 s) marks participations EXPIRED and emits an event.
- **A-09 Last-second submissions.** A submission counts if the server receives it at most `deadlineAt + 10 s` (a grace period for network latency, documented). Anything later gets a 409 with code `DEADLINE_PASSED`. Reviews may happen after the deadline.
- **A-10 Verification types.**
  - SELF: auto-approved.
  - ANSWER: normalized (case and whitespace insensitive) and compared with a stored hash; immediate verdict; at most 5 wrong attempts per objective.
  - TEXT_PROOF and IMAGE_PROOF: the author approves, or rejects with a reason. A rejected objective can be resubmitted while time remains.
- **A-11 Outcomes.** ACTIVE → SUBMITTED (everything submitted, waiting for reviews) → COMPLETED (all objectives approved) or FAILED (rejections after the deadline, or answer attempts exhausted). ACTIVE → ABANDONED (explicit withdrawal). ACTIVE → EXPIRED (deadline passed with objectives still unsubmitted). ORDINARY missions without a time limit never expire.
- **A-12 Scoring.** Each objective has points (0–100, default 10). Mission points are their sum, multiplied by 1.5 (rounded) for SECRET_TIMED. Points are awarded exactly once, on COMPLETED, through a `PointsLedger` entry. In team missions, every member who contributed at least one approved objective receives the full mission points.
- **A-13 Repetition.** `maxAttempts` (default 1, max 3). After ABANDONED, EXPIRED or FAILED the user may accept again if attempts remain and the mission is still PUBLISHED; never after COMPLETED. Authors cannot accept their own missions. Archived missions cannot be reopened; the author can duplicate them as a new DRAFT.
- **A-14 Withdrawal.** An explicit, confirmed, irreversible action. It counts as an attempt and frees the capacity slot.
- **A-15 Notifications.** Persisted, pushed live through the Socket.IO event `notification:new`, shown with an unread badge, paginated, and can be marked read one by one or all at once. Producers: mission accepted (to the author); participation status changed (to the participant or the team members); proof reviewed; invitation received, responded or revoked; waitlist offer and offer expiry; team invitation; member joined or left; optionally "5 minutes left".
- **A-16 Restricted visibility.** A RESTRICTED mission is visible only to its author, admins and users in the `MissionAccess` allow-list (granted manually by the author, or by an accepted invitation). Anyone else gets **404** (no existence leak) from detail, objectives, proofs and every related endpoint, and the mission never appears in the list, the map or search results for them.
- **A-17 Invitations (R08).** Only for RESTRICTED missions, sent by nickname. There is one record per (mission, invitee): re-inviting after DECLINED or REVOKED reopens it as PENDING, while a duplicate PENDING gets 409. Accepting grants access (it does not accept the mission and does not reserve a slot). Revoking a PENDING or ACCEPTED invitation removes the access; a participation already started continues. The author sees the status of every invitation.
- **A-18 Capacity and waitlist (R09).** `maxParticipants = null` means unlimited. Occupied slots are participations in ACTIVE, SUBMITTED or COMPLETED; ABANDONED, EXPIRED and FAILED free their slot. For TEAM missions the slots count teams. Last-slot race: a transaction with `SELECT … FOR UPDATE` on the mission row, then the count; the loser gets 409 `MISSION_FULL` and is offered the waitlist. The waitlist is FIFO. When a slot frees up, the first WAITING entry becomes OFFERED with a 15-minute hold on the slot, and the user must *claim* it, which is the actual acceptance (so a secret timer starts only at that moment). When the hold expires, the offer goes to the next entry. Users can leave the waitlist at any time, and cannot be on the waitlist and active on the same mission.
- **A-19 Teams (R10).** Unique name (3–30 chars), at most 6 members. The creator is TEAM_ADMIN. The admin invites members by nickname, and invitees accept or decline. Members can leave; the admin can remove members. The admin must transfer the role before leaving, and if they are the last member the team is disbanded. A user can belong to several teams.
- **A-20 Team participation (R11).** A mission has `participationType: INDIVIDUAL | TEAM`, plus `minTeamSize` and `minContributors`. Only the TEAM_ADMIN accepts on behalf of the team, and the team needs at least `minTeamSize` members. One ACTIVE participation per (mission, team). A user cannot take part in the same mission both individually and through a team, or through two teams (409 `ALREADY_PARTICIPATING`). Progress is shared. Concurrent submissions on the same objective are serialized with optimistic locking (`version`): the loser gets 409 together with the latest state. Completion requires every objective approved **and** at least `minContributors` distinct contributors. Members who leave lose access; their contributions stay.
- **A-21 Live team updates (R12).** One Socket.IO room per team participation. Every state change appends a `TeamProgressEvent` with a per-participation, strictly increasing `seq`, in the same DB transaction, and the server emits only after the commit. The client applies only `seq = lastSeq + 1`; on a gap or a reconnection it fetches the snapshot (`GET /api/v1/team-participations/:id` returns the state plus `lastSeq`) and resumes. Online presence is shown.
- **A-22 Location.** Optional latitude/longitude plus a place name, chosen by clicking on the Leaflet map. There is no geocoding service and no GPS check; browser geolocation is not used.
- **A-23 Categories.** A fixed seeded list: Exploration, Puzzle, Culture, Photography, Creative challenge, Outdoor.
- **A-24 Search (R03).** Keyword (ILIKE on title and teaser), category, availability (AVAILABLE / FULL / CLOSED), mode, participation type, and the map bounding box. Availability comes from a port that returns AVAILABLE until R09 binds the real implementation.
- **A-25 Images.** JPEG, PNG or WebP, at most 5 MB. Stored on server disk (`backend/uploads/`, gitignored) under random names, and served only to the participant(s), the author and admins, through an authenticated endpoint.
- **A-26 Validation.** The shared hand-written `Validator` on every endpoint (body, params, query), with length limits on every text field. Times are stored in UTC and shown in local time.

---

## 6. Architecture and ownership (what goes where)

> **SPECIFICATION ONLY in this session (see §0.1).** Use §6 to write the ownership tables in PLAN.md, the guides, CLAUDE.md and CODEOWNERS, and the PROPOSED drafts of §6.4 in Markdown. Copy §6.1–§6.3 and §6.5 verbatim into `docs/design/scaffold-spec.md`. **Do not create any of the folders or files described here**: the task SCAFFOLD (P3) builds them later. Wherever §6 or §7 says "setup creates" or "from setup", read it as "the task SCAFFOLD creates".

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

### 6.4 Contracts frozen in Sprint 0 (setup writes PROPOSED drafts)

- `docs/design/data-model.md`: one table per entity with fields, types, constraints and owner, plus a Mermaid `erDiagram`. Entities:
  - **P1:** `User` (id uuid, email unique, passwordHash, nickname unique, fullName, bio, city, avatarUrl, role, status, tokenVersion, timestamps); `Category`; `Mission` (id, authorId, title, teaser, description, categoryId, mode, timeLimitSec, lat, lng, placeName, conditions, status, visibility, participationType, minTeamSize, maxTeamSize, minContributors, maxParticipants, maxAttempts, publishedAt, version, timestamps); `Objective` (id, missionId, position, title, description, verificationType, answerHash, points); `MissionAccess` (missionId, userId, source MANUAL | INVITE, grantedAt).
  - **P2:** `Participation` (id, missionId, participantType, userId?, teamId?, acceptedById, status, acceptedAt, deadlineAt, endedAt, attemptNo, pointsAwarded, version; partial unique index: one ACTIVE or SUBMITTED per (mission, user) and per (mission, team)); `ObjectiveProgress` (id, participationId, objectiveId, status PENDING | SUBMITTED | APPROVED | REJECTED, contributorUserId, wrongAnswers, submittedAt, reviewedAt, reviewerId, rejectionReason, version; unique (participationId, objectiveId)); `Proof` (id, objectiveProgressId, type, text, filePath, mimeType, sizeBytes, receivedAt); `PointsLedger` (id, userId, participationId, points, reason, createdAt); `Notification` (id, userId, type, payload jsonb, readAt, createdAt); `WaitlistEntry` (id, missionId, userId?, teamId?, status WAITING | OFFERED | CLAIMED | EXPIRED | LEFT, offerExpiresAt, createdAt).
  - **P3:** `MissionInvitation` (id, missionId, inviterId, inviteeId, status, timestamps; unique (missionId, inviteeId)); `Team` (id, name unique, createdById, timestamps); `TeamMembership` (teamId, userId, role, joinedAt, leftAt); `TeamInvitation` (id, teamId, inviterId, inviteeId, status, timestamps); `TeamProgressEvent` (id, participationId, seq, type, actorId, payload jsonb, createdAt; unique (participationId, seq)).
- `docs/design/module-contracts.md`: the ports above, plus the **public API of each module** (method signatures in TypeScript), including:
  - `participations`: `accept(missionId, actor, participant: {type:'USER'} | {type:'TEAM', teamId})`, `getForViewer(participationId, viewer)`, `submitObjective(participationId, objectiveId, contributorId, input, expectedVersion?)`, `abandon(participationId, actor)`, `review(progressId, reviewer, verdict, reason?)`.
  - `missions`: `getMissionForParticipation(missionId)` (internal, objectives included), `canView(viewer, missionId)`, `grantAccess / revokeAccess`.
  - `teams`: `isMember / isAdmin / membersOf`.
  - `users`: `getPublicProfile(id)`, `findByNickname(nickname)`.
- `backend/src/shared/events/domain-events.ts` plus `docs/api/realtime-events.md`.
  - Domain events: `user.registered`, `mission.published`, `mission.updated`, `mission.closed`, `mission.access.granted`, `mission.access.revoked`, `participation.accepted`, `participation.objective.submitted`, `participation.objective.reviewed`, `participation.status.changed`, `waitlist.offered`, `waitlist.offer.expired`, `invitation.created`, `invitation.responded`, `invitation.revoked`, `team.invitation.created`, `team.invitation.responded`, `team.member.joined`, `team.member.left`, `team.progress.updated`.
  - Socket server → client: `notification:new`, `participation:updated`, `team-progress:update` `{ participationId, seq, event, state }`, `team-progress:presence`.
  - Socket client → server: `team-progress:join` / `team-progress:leave` `{ participationId }` (with an ack that returns `{ ok, lastSeq }`).
- OpenAPI fragments: one per module with its tag and **placeholder paths that list the endpoints planned for its requirements** (method, path, a one-line summary, `x-owner`, `x-requirement`, `x-status: planned`). Propose a sensible REST design, for example `POST /missions`, `PATCH /missions/{id}`, `POST /missions/{id}/publish`, `GET /missions?q=&category=&availability=&bbox=`, `POST /missions/{id}/participations`, `GET /participations/{id}`, `POST /participations/{id}/objectives/{objectiveId}/submissions`, `POST /participations/{id}/abandon`, `POST /progress/{id}/review`, `GET /me/notifications`, `POST /missions/{id}/waitlist`, `POST /waitlist/{id}/claim`, `POST /missions/{id}/invitations`, `POST /invitations/{id}/accept`, `POST /teams`, `POST /teams/{id}/invitations`, `POST /team-invitations/{id}/accept`, `POST /teams/{id}/leave`, `GET /team-participations/{id}`, and so on.

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

> **SPECIFICATION ONLY in this session (see §0.1).** Copy §7.1–§7.7 verbatim into `docs/design/scaffold-spec.md`. The only items of §7 that this session actually produces are: the root `CLAUDE.md`, a short `README.md` (see §0.1), `CONTRIBUTING.md`, `.gitignore` (written already with the entries of §7.5, so the scaffold needs no change there), `.gitattributes`, `.editorconfig`, the `.github/` templates, `CODEOWNERS`, the two workflows `plan.yml` and `deps-labeler.yml`, and `docs/ingsw/README.md` (the structure of §7.8 as a list). Everything else in §7, including the demo-account fixtures, `.nvmrc`, `.prettierrc`, `ci.yml` and `sonar.yml`, belongs to the task SCAFFOLD.

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

## 8. The plan: tasks, blocking dependencies and timeline

### 8.1 Gating rule (the most important rule of the project)

A task may be **started** only when every task in its `blockedBy` list is **DONE**. **DONE** means the task's issue is closed by a PR merged into `develop` that satisfies the Definition of Done. The script `npm run deps -- <TASK-ID>` checks this through `gh`, and exits non-zero if the task is blocked. If you are blocked, work on your next READY task; the fallback order is in your guide. If a blocker is more than 3 days late, raise it at the weekly sync. The owner may then merge a *minimal vertical slice* first (enough to satisfy the contract), so the dependent work can start.

### 8.2 Definition of Done (for every R task)

- Backend: migration(s), models, domain classes, service, controller, routes; input validation with the shared `Validator`; authorization checked in the service layer; meaningful error codes; domain events emitted; OpenAPI fragment updated (`x-status: done`).
- Frontend: screens responsive at 360 px and at desktop size; loading, empty and error states; no secret data in the network responses where it is forbidden.
- Tests: unit tests for the domain classes; integration tests with supertest, including **at least one authorization-negative case**; the assigned E2E specs from §8.5 pass in CI.
- Seeds updated with demo data that makes the feature demonstrable without physical travel.
- `PROGRESS.md` updated in your section after every step of the task, with a final "DONE" entry linking the PR (§0.2).
- Docs updated: the module README, your traceability row (`docs/ingsw/05-traceability/Px.md`), the README features table (via a short PR touching only that row).
- CI green. PR approved by your reviewer buddy. Squash-merged with `Closes #<issue>`.

### 8.3 `docs/plan/tasks.json` (write exactly this content; dates are ISO and inclusive)

```json
[
 {"id":"SETUP","title":"Repository, plan, guides and GitHub setup (no code)","owner":"P3","type":"infra","milestone":"M0","start":"2026-11-17","due":"2026-11-17","blockedBy":[],"requirements":[]},
 {"id":"SCAFFOLD","title":"Code scaffold from docs/design/scaffold-spec.md: backend, frontend, e2e, docker, ci.yml, sonar.yml","owner":"P3","type":"infra","milestone":"M1","start":"2026-11-18","due":"2026-11-24","blockedBy":["SETUP"],"requirements":[]},
 {"id":"S0-ASSUMPTIONS","title":"Ratify domain assumptions A-01..A-26","owner":"P1","type":"docs","milestone":"M1","start":"2026-11-23","due":"2026-11-29","blockedBy":["SETUP"],"requirements":["R01","R02","R03","R04","R05","R06","R07","R08","R09","R10","R11","R12"]},
 {"id":"S0-DATAMODEL","title":"Freeze data model and ER diagram","owner":"P3","type":"docs","milestone":"M1","start":"2026-11-23","due":"2026-11-29","blockedBy":["SETUP"],"requirements":[]},
 {"id":"S0-API","title":"Freeze REST contracts (OpenAPI fragments) and module public APIs","owner":"P3","type":"contract-change","milestone":"M1","start":"2026-11-23","due":"2026-11-29","blockedBy":["SETUP"],"requirements":[]},
 {"id":"S0-EVENTS","title":"Freeze domain events, realtime events and ports","owner":"P2","type":"contract-change","milestone":"M1","start":"2026-11-23","due":"2026-11-29","blockedBy":["SETUP"],"requirements":["R06","R12"]},
 {"id":"R01","title":"R01 Accounts, authentication, profile, admin","owner":"P1","type":"feature","milestone":"M2","start":"2026-11-25","due":"2026-12-06","blockedBy":["SETUP","SCAFFOLD"],"requirements":["R01"]},
 {"id":"SONAR-SETUP","title":"SonarCloud project, token secret and first green analysis","owner":"P3","type":"infra","milestone":"M2","start":"2026-11-30","due":"2026-12-06","blockedBy":["SCAFFOLD"],"requirements":[]},
 {"id":"DOC-ARCH-DRAFT","title":"Architecture draft: components, technologies, communication, ER","owner":"P3","type":"docs","milestone":"M2","start":"2026-11-30","due":"2026-12-06","blockedBy":["S0-DATAMODEL","S0-API"],"requirements":[]},
 {"id":"DOC-STATE","title":"Participation and mission state diagrams (PlantUML draft)","owner":"P2","type":"docs","milestone":"M3","start":"2026-11-30","due":"2026-12-13","blockedBy":["S0-ASSUMPTIONS"],"requirements":["R04","R05"]},
 {"id":"DOC-UC01-DRAFT","title":"UC-01 Cockburn description and low-fi mockups","owner":"P2","type":"docs","milestone":"M3","start":"2026-11-30","due":"2026-12-20","blockedBy":["S0-ASSUMPTIONS"],"requirements":["R04","R05"]},
 {"id":"R02","title":"R02 Mission creation, editing, publication, map picker","owner":"P1","type":"feature","milestone":"M3","start":"2026-12-07","due":"2026-12-20","blockedBy":["R01","S0-ASSUMPTIONS","S0-DATAMODEL","S0-API"],"requirements":["R02"]},
 {"id":"R06A","title":"R06 part A: notification infrastructure (persistence, REST, Socket.IO gateway, bell)","owner":"P2","type":"feature","milestone":"M3","start":"2026-12-07","due":"2026-12-16","blockedBy":["R01","S0-EVENTS","S0-API"],"requirements":["R06"]},
 {"id":"R10","title":"R10 Exploration teams","owner":"P3","type":"feature","milestone":"M3","start":"2026-12-07","due":"2026-12-20","blockedBy":["R01","S0-DATAMODEL","S0-API","S0-EVENTS"],"requirements":["R10"]},
 {"id":"R07","title":"R07 Restricted visibility and access enforcement","owner":"P1","type":"feature","milestone":"M4","start":"2026-12-21","due":"2027-01-03","blockedBy":["R02"],"requirements":["R07"]},
 {"id":"R04","title":"R04 Acceptance and server-authoritative timer","owner":"P2","type":"feature","milestone":"M4","start":"2026-12-21","due":"2027-01-03","blockedBy":["R02","R06A"],"requirements":["R04"]},
 {"id":"DOC-DESIGN-DRAFT","title":"Design drafts: domain class diagram, persistence chapter, components diagram","owner":"P3","type":"docs","milestone":"M4","start":"2026-12-21","due":"2027-01-03","blockedBy":["DOC-ARCH-DRAFT"],"requirements":[]},
 {"id":"R03","title":"R03 Exploration and search: list, map, filters, secret preview","owner":"P1","type":"feature","milestone":"M5","start":"2027-01-04","due":"2027-01-17","blockedBy":["R02","R07"],"requirements":["R03"]},
 {"id":"R05A","title":"R05 part A: progress, SELF/ANSWER verification, abandon, outcomes (USER and TEAM capable)","owner":"P2","type":"feature","milestone":"M5","start":"2027-01-04","due":"2027-01-10","blockedBy":["R04"],"requirements":["R05"]},
 {"id":"R05B","title":"R05 part B: text/image proofs, author review, points ledger, reusable FE components","owner":"P2","type":"feature","milestone":"M5","start":"2027-01-11","due":"2027-01-17","blockedBy":["R05A"],"requirements":["R05"]},
 {"id":"R08","title":"R08 Invitations to restricted missions","owner":"P3","type":"feature","milestone":"M5","start":"2027-01-04","due":"2027-01-17","blockedBy":["R07","R06A"],"requirements":["R08"]},
 {"id":"R09","title":"R09 Capacity, waitlist and last-slot concurrency","owner":"P2","type":"feature","milestone":"M6","start":"2027-01-18","due":"2027-01-24","blockedBy":["R04","R05A"],"requirements":["R09"]},
 {"id":"R11","title":"R11 Team participation with shared, consistent progress","owner":"P3","type":"feature","milestone":"M6","start":"2027-01-18","due":"2027-01-26","blockedBy":["R10","R04","R05A","R05B"],"requirements":["R11"]},
 {"id":"QA-SEED","title":"Consolidated demo dataset covering every feature","owner":"P1","type":"test","milestone":"M6","start":"2027-01-18","due":"2027-01-24","blockedBy":["R03"],"requirements":[]},
 {"id":"R06B","title":"R06 part B: personal area (created, participating, waitlist, notification history)","owner":"P2","type":"feature","milestone":"M6","start":"2027-01-25","due":"2027-01-31","blockedBy":["R04","R05B","R09"],"requirements":["R06"]},
 {"id":"R12","title":"R12 Live cooperative updates with ordering and reconnection","owner":"P3","type":"feature","milestone":"M6","start":"2027-01-27","due":"2027-01-31","blockedBy":["R11","R06A"],"requirements":["R12"]},
 {"id":"QA-RESPONSIVE","title":"Responsive and error-handling audit of all screens (issues filed to owners)","owner":"P1","type":"test","milestone":"M6","start":"2027-01-25","due":"2027-01-31","blockedBy":["R03"],"requirements":[]},
 {"id":"E2E-CATALOGUE","title":"Verify the >=10 E2E catalogue is complete, non-duplicate and green in CI","owner":"P1","type":"test","milestone":"M6","start":"2027-01-25","due":"2027-01-31","blockedBy":["R03"],"requirements":[]},
 {"id":"FREEZE","title":"Feature freeze: R01-R12 merged into develop","owner":"P3","type":"infra","milestone":"M6","start":"2027-01-31","due":"2027-01-31","blockedBy":["R01","R02","R03","R04","R05A","R05B","R06A","R06B","R07","R08","R09","R10","R11","R12"],"requirements":[]},
 {"id":"STABILIZE","title":"Stabilization week: bug fixes only","owner":"P3","type":"bug","milestone":"M7","start":"2027-02-01","due":"2027-02-07","blockedBy":["FREEZE"],"requirements":[]},
 {"id":"DOC-SRS","title":"SRS: glossary, actors, use case diagram (VP), personas, NFR and domain requirements, assumptions rationale","owner":"P1","type":"docs","milestone":"M7","start":"2027-02-01","due":"2027-02-21","blockedBy":["S0-ASSUMPTIONS"],"requirements":[]},
 {"id":"TW-README","title":"Final README (TECWEB B.3)","owner":"P1","type":"docs","milestone":"M7","start":"2027-02-01","due":"2027-02-21","blockedBy":["FREEZE"],"requirements":[]},
 {"id":"TW-SCHEDA","title":"One-page summary sheet (TECWEB B.3)","owner":"P1","type":"docs","milestone":"M7","start":"2027-02-15","due":"2027-02-21","blockedBy":["FREEZE"],"requirements":[]},
 {"id":"DOC-GIT","title":"Git repository analysis (commits, contributors, trend)","owner":"P1","type":"docs","milestone":"M7","start":"2027-02-15","due":"2027-02-28","blockedBy":["FREEZE"],"requirements":[]},
 {"id":"DOC-UC01","title":"UC-01 final with mockups from the real app","owner":"P2","type":"docs","milestone":"M7","start":"2027-02-01","due":"2027-02-14","blockedBy":["DOC-UC01-DRAFT","R06B"],"requirements":["R04","R05"]},
 {"id":"DOC-TESTPLAN","title":"System test plan for secret timed missions + methodology","owner":"P2","type":"docs","milestone":"M7","start":"2027-02-01","due":"2027-02-21","blockedBy":["R04","R05B"],"requirements":["R04","R05"]},
 {"id":"DOC-UNIT-TIMER","title":"Documented unit tests: TimerPolicy.evaluate(participation, now)","owner":"P2","type":"docs","milestone":"M7","start":"2027-02-08","due":"2027-02-21","blockedBy":["R04"],"requirements":["R04"]},
 {"id":"DOC-DESIGN-EXAMPLE","title":"Design example: server-authoritative timer and secret objective protection","owner":"P2","type":"docs","milestone":"M7","start":"2027-02-15","due":"2027-02-28","blockedBy":["R04"],"requirements":["R04"]},
 {"id":"DOC-ARCH","title":"Architecture and design chapter final (VP class, sequence, ER diagrams)","owner":"P3","type":"docs","milestone":"M7","start":"2027-02-01","due":"2027-02-21","blockedBy":["FREEZE","DOC-DESIGN-DRAFT","DOC-STATE"],"requirements":[]},
 {"id":"DOC-SONAR","title":"SonarCloud report, commentary and fixes","owner":"P3","type":"docs","milestone":"M7","start":"2027-02-01","due":"2027-02-21","blockedBy":["FREEZE","SONAR-SETUP"],"requirements":[]},
 {"id":"DOC-UNIT-TEAM","title":"Documented unit tests: TeamProgressReducer.apply(state, update)","owner":"P3","type":"docs","milestone":"M7","start":"2027-02-08","due":"2027-02-21","blockedBy":["R11"],"requirements":["R11"]},
 {"id":"DOC-TRACE","title":"Traceability table and INGSW PDF assembly","owner":"P3","type":"docs","milestone":"M7","start":"2027-02-22","due":"2027-02-28","blockedBy":["DOC-SRS","DOC-ARCH","DOC-TESTPLAN","DOC-UC01"],"requirements":[]},
 {"id":"REL-RC","title":"Release candidate: code and docs frozen, full CI green, tag v1.0.0-rc.1","owner":"P3","type":"infra","milestone":"M8","start":"2027-03-01","due":"2027-03-08","blockedBy":["STABILIZE","DOC-TRACE","DOC-SONAR","DOC-UNIT-TIMER","DOC-UNIT-TEAM","DOC-DESIGN-EXAMPLE","DOC-GIT","TW-README","TW-SCHEDA"],"requirements":[]},
 {"id":"REL-DRYRUN","title":"Exam dry-run: demo rehearsal and cross-module knowledge sessions (everyone explains everyone's code)","owner":"P3","type":"docs","milestone":"M8","start":"2027-03-09","due":"2027-03-14","blockedBy":["REL-RC"],"requirements":[]},
 {"id":"REL-V1","title":"Release v1.0.0: merge develop into main, tag, final PDFs","owner":"P3","type":"infra","milestone":"M8","start":"2027-03-15","due":"2027-03-15","blockedBy":["REL-DRYRUN"],"requirements":[]},
 {"id":"SUBMIT","title":"Submit repository URL on the Teams assignment","owner":"P3","type":"infra","milestone":"M8","start":"2027-03-16","due":"2027-03-25","blockedBy":["REL-V1"],"requirements":[]}
]
```

Validate the file: unique IDs, every `blockedBy` refers to an existing ID, **no cycles**, every task starts no earlier than the latest due date among its blockers (warn, and log it in PROGRESS.md, if not), and every task's dates fall inside its milestone. Write the validator as `scripts/validate-plan.mjs` and run it in CI.

The issue body of **SCAFFOLD** must contain this acceptance checklist:
- implement `docs/design/scaffold-spec.md` exactly: §6.1–§6.3, §6.5 and §7 of the setup prompt; infrastructure only, no requirement logic, stubs only where the spec says so;
- create `ci.yml` (jobs `backend`, `frontend`, `e2e`, `plan`) and `sonar.yml`, then delete `plan.yml`;
- local checks green: lint, typecheck, unit and integration tests, frontend production build, E2E smoke test, `docker compose up -d db`, migrations and empty seeds;
- open the PR from `chore/scaffold` to `develop`; it touches shared paths, so it needs the approval of Vincenzo or Matteo;
- after the merge, update the branch protection of `develop` and `main` to require `["backend","frontend","e2e","plan"]`, then read it back;
- update the README quick start and the status line ("scaffold ready").

For each R task, the issue body must also contain a precise **acceptance checklist** derived from §3, §5 (the A-xx rows it implements), §6 and §8.2, plus the E2E IDs from §8.5 and the files and folders the owner may touch.

### 8.4 Milestones (create them on GitHub with these due dates)

| ID | Title | Due |
|---|---|---|
| M0 | Setup | 2026-11-17 |
| M1 | Sprint 0 – Analysis and contracts | 2026-11-29 |
| M2 | Foundations (R01) | 2026-12-06 |
| M3 | Missions, notifications, teams | 2026-12-20 |
| M4 | Holiday sprint | 2027-01-03 |
| M5 | Core gameplay | 2027-01-17 |
| M6 | Feature freeze | 2027-01-31 |
| M7 | Documentation and quality | 2027-02-28 |
| M8 | Release and submission | 2027-03-25 |

### 8.5 E2E catalogue (≥10 required, 12 planned, plus the smoke test). Write it to `docs/tecweb/e2e-catalogue.md`

| ID | Owner | Req | Scenario | Negative? |
|---|---|---|---|---|
| E2E-01 | P1 | R01 | Sign up, log in, edit profile nickname, log out; the old token is rejected afterwards | partly |
| E2E-02 | P1 | R02 | Author creates a SECRET_TIMED mission, picks a location on the map, publishes it; the marker appears on the map | |
| E2E-03 | P1 | R03 | A guest searches by keyword + category + availability, opens a secret mission preview: no objectives in the DOM **or** in the API response | yes (leak) |
| E2E-04 | P1 | R07 | A non-authorized user opens a restricted mission URL and gets "not found"; the API returns 404; the mission is absent from search and map | **yes (authz)** |
| E2E-05 | P2 | R04 | Accept a secret mission: objectives revealed, countdown visible; reload and a second browser context show the same deadline (±2 s) | |
| E2E-06 | P2 | R04/R05 | Server clock moved past the deadline: status EXPIRED, submission rejected with a clear message | **yes** |
| E2E-07 | P2 | R05/R06 | Participant submits a text proof; the author approves it in another context; the participant gets a notification **without reload** and receives the points | |
| E2E-08 | P2 | R09 | Capacity 1: A accepts, B joins the waitlist, A abandons, B receives an offer notification and claims the slot | |
| E2E-09 | P3 | R10 | Create a team, invite by nickname, the invitee accepts, a member leaves, the admin transfers the role | |
| E2E-10 | P3 | R08 | Author invites a user to a restricted mission; the invitee accepts and can view it; the author sees the statuses; after revoke, the access is lost | partly |
| E2E-11 | P3 | R11/R12 | Two members in two contexts: A completes an objective, B sees it live; B's concurrent attempt on the same objective is handled; the team completes | |
| E2E-12 | P3 | R11 | A non-member cannot read or post progress (404/403); a user already in the mission individually cannot join it through a team (409) | **yes (authz)** |

### 8.6 INGSW unit-test methods (two documented, as the early delivery requires)

- **UT-1 (P2):** `TimerPolicy.evaluate(participation: { status, acceptedAt, deadlineAt | null }, now: Date): { state: 'NOT_TIMED' | 'RUNNING' | 'EXPIRED' | 'ENDED', remainingSeconds: number | null }`. Equivalence classes: not timed, running, exactly at the deadline, inside the grace period, after the grace period, already-ended states, invalid input.
- **UT-2 (P3):** `TeamProgressReducer.apply(state: TeamProgressState, update: ProgressUpdate): ApplyResult`. Covers: in-order update, duplicate `seq`, gap, stale `version` conflict, update from a non-member, completion with fewer or with at least `minContributors` contributors.

Both are pure domain classes (no DB). Their dependencies (Clock, membership) are injected, so they can be tested with stubs. Setup creates **no** implementation of these; only the file names and the documentation skeletons.

### 8.7 Weekly rhythm

A 30-minute sync every Monday (the team picks the time): what got merged, which blockers are open (`npm run deps -- --all`), and any contract-change requests. Notes go in `docs/meetings/YYYY-MM-DD.md` (create a template). Reviews are done within 48 hours.

---

## 9. GitHub automation

Do the steps in this order. Every script must be **idempotent** (safe to re-run).

1. **Create the repo:** `gh repo create <OWNER>/sidequest-group40 --public --description "SideQuest – Group 40 – Integrated project INGSW + TECWEB, Federico II 2026/27"`. Clone it into the chosen folder. Set the local git identity for this repo.
2. **Write only the files listed in §0.1** (documentation, plan, guides, the four scripts, the GitHub config), run `node scripts/validate-plan.mjs` until it passes, and generate the PDFs. Commit in a few logical Conventional Commits on `main` (for example `docs(plan): …`, `docs(guides): …`, `chore(repo): …`, `ci: …`). Push `main`, then create `develop` from `main`, push it and **make `develop` the default branch**.
3. **Repository settings:** issues on, wiki off, squash merge **and** merge commits allowed, rebase merge off, auto-delete head branches on, "always suggest updating PR branches" on.
4. **Labels** (`scripts/create-issues.mjs` creates them too):
   - `owner:P1-vincenzo`, `owner:P2-matteo`, `owner:P3-domenico`
   - `type:feature`, `type:docs`, `type:infra`, `type:test`, `type:bug`, `type:contract-change`
   - `status:blocked`, `status:ready`, `status:in-progress`, `status:in-review`, `status:done`
   - `req:R01` … `req:R12`, `pkg:core`, `pkg:A`, `pkg:B`, `exam:ingsw`, `exam:tecweb`
   - one `task:<ID>` label per task (this is how scripts find the issue for a task ID)
5. **Milestones** from §8.4 (via `gh api repos/<OWNER>/sidequest-group40/milestones`).
6. **Issues:** `scripts/create-issues.mjs` reads `docs/plan/tasks.json` and creates one issue per task, skipping it if an issue with label `task:<ID>` already exists.
   - Title: `[<ID>] <title>`.
   - Labels: owner, type, task, req/pkg/exam where they apply, plus `status:blocked` or `status:ready`.
   - Milestone.
   - Body: Owner, window (start → due), Reviewer, "Blocked by" (as a list of **issue links**, filled in during a second pass after all issues exist), the acceptance checklist, the files and folders the owner may touch, the related docs, and the DoD link.
   - Assign Domenico's issues to him now. The other members cannot be assigned until they accept the collaborator invitation; their onboarding prompt self-assigns them.
   - Finally close the `SETUP` issue with a summary comment.
7. **Workflows** (`.github/workflows/`). **In this session create only `plan.yml` and `deps-labeler.yml`.** `plan.yml` runs on PRs to `develop`/`main` and on pushes to `develop`, with a single job named exactly `plan` that runs `node scripts/validate-plan.mjs`. The `ci.yml` and `sonar.yml` described below are written into `docs/design/scaffold-spec.md` and created by the task SCAFFOLD (which then moves the `plan` job into `ci.yml` and deletes `plan.yml`):
   - `ci.yml` (task SCAFFOLD), on PRs to `develop`/`main` and pushes to `develop`. Jobs with **exactly** these names:
     - `backend`: Postgres 17 service, `npm ci`, lint, typecheck, migrate the test DB, Jest with coverage, upload coverage as an artifact;
     - `frontend`: `npm ci`, lint, production build;
     - `e2e`: needs both; Postgres service; installs Chromium; Playwright; uploads the report artifact;
     - `plan`: runs `node scripts/validate-plan.mjs`.
   - `sonar.yml` (task SCAFFOLD), on pushes to `develop` and on PRs: runs backend tests with coverage, then the SonarCloud scan (official `SonarSource/sonarqube-scan-action`). If the `SONAR_TOKEN` secret is empty, the job prints "SonarCloud not configured yet (task SONAR-SETUP)" and exits successfully.
   - `deps-labeler.yml`, on `issues: [closed, reopened]` and `workflow_dispatch`: runs `node scripts/deps.mjs --sync-labels`. It recomputes `status:blocked` → `status:ready` for every open task. For each newly unblocked task it comments `@<owner-login> <ID> is now unblocked (all blockers merged).` (`permissions: issues: write`; uses `GH_TOKEN: ${{ github.token }}`).
8. **`scripts/deps.mjs`** (Node, no npm dependencies; uses the `gh` CLI):
   - `npm run deps -- <ID>`: prints each blocker with its issue number, state and link, then **READY** or **BLOCKED**. Exit code 0 or 1.
   - `npm run deps -- --mine P2`: prints the person's tasks grouped as DONE, READY, BLOCKED (with what blocks them), PLANNED, in date order, and marks the **next task to do**.
   - `npm run deps -- --all`: the whole team view.
   - `--sync-labels`: used by the workflow above.
   - The mapping from P1/P2/P3 to logins comes from `docs/plan/team.json` (write it with the real logins).
9. **Collaborators:** `gh api -X PUT repos/<OWNER>/sidequest-group40/collaborators/<login> -f permission=push` for `<GH_P1>` and `<GH_P2>`. Tell Domenico they must accept the invitation by email or on github.com/notifications.
10. **Project board** (if enabled): `gh project create --owner <OWNER> --title "SideQuest Group 40"`; link it to the repo, add every issue, and add the fields `Owner` (single select P1/P2/P3) and `Window end` (date) where possible. If any project command fails, log it and continue; the board is optional.
11. **Branch protection — LAST, after the final push and after one green `plan` run on `develop`.** Use `gh api -X PUT repos/<OWNER>/sidequest-group40/branches/<branch>/protection` on **both** `develop` and `main`:
    - `required_status_checks: { strict: true, contexts: ["plan"] }` (the task SCAFFOLD later changes this to `["backend","frontend","e2e","plan"]`; write that step in the SCAFFOLD issue)
    - `enforce_admins: true`
    - `required_pull_request_reviews: { required_approving_review_count: 1, require_code_owner_reviews: true, dismiss_stale_reviews: true }`
    - `restrictions: null`, `allow_force_pushes: false`, `allow_deletions: false`, `required_conversation_resolution: true`
    - `required_linear_history: true` on `develop` only.

    Read the result back with `gh api` and show it.
12. **SonarCloud:** this cannot be fully automated. Do **not** do it now. It is task SONAR-SETUP in P3's guide. Write the exact steps there:
    - log in at sonarcloud.io with GitHub;
    - import the repo under `<OWNER>`'s organization;
    - choose "GitHub Actions" analysis and turn **off** automatic analysis;
    - copy the organization and project key into `sonar-project.properties`;
    - create a token, then `gh secret set SONAR_TOKEN`;
    - push and check the first analysis.

---

## 10. `CLAUDE.md` (root; write this content, adapted with the real logins)

It must contain, concisely:

1. **The project in 5 lines** (SideQuest, Group 40, integrated INGSW + TECWEB, early delivery R01–R12, stack).
2. **Who owns what:** the ownership tables from §6.1 and §6.3, plus the reviewer rotation.
3. **Non-negotiable rules for Claude Code sessions:**
   - (a) Identify the current member (ask if unknown) and **only edit files that member owns**. If a change to another member's or a shared file is needed, stop, explain why, and draft a `contract-change` issue or a message for the owner.
   - (b) Before starting a task, run `npm run deps -- <ID>`; if it is BLOCKED, do not start it.
   - (c) Never push to `develop` or `main`; always use a branch and a PR.
   - (d) Never commit secrets, `.env`, uploads or the course PDFs.
   - (e) Respect the assumptions in `docs/decisions/assumptions.md`; changing them needs a contract-change.
   - (f) Explain what you built so the member can defend it at the exam (every member must know the whole project: brief §3).
4. **Security invariants:**
   - secret objectives are never serialized before acceptance;
   - time always comes from `Clock` (server);
   - authorization is checked in services, not only in routes;
   - restricted resources return 404 to unauthorized users;
   - validate every input with the shared `Validator` / `validate()` middleware;
   - never trust client-sent user IDs or roles;
   - uploads are type- and size-checked and served only through authenticated endpoints.
5. **Course alignment:** prefer what was taught in the lectures (§4.1). Before adding **any** new dependency, check whether a taught tool or plain TypeScript does the job; if not, stop and ask the member, and record the rationale in ADR 0006 through a contract-change PR. Never add a UI component library. Name the patterns as the course does: ports = Strategy + Dependency Injection, event bus = Observer, data access = Repository.
6. **Coding conventions:** the module layout, cross-module access only through `index.ts` or ports or events, OOP domain classes for the non-trivial logic (policies and state machines, so they are unit-testable and easy to show in UML), error codes, the migration and seed naming, the OpenAPI fragment rules.
7. **Commands cheat-sheet** (setup, dev, tests, E2E, deps, PDFs, db reset).
8. **Testing rules** (the DoD in §8.2; E2E naming).
9. **Commit and PR conventions.**
9b. **Progress log rules:** the full text of §0.2. Claude Code must append an entry to the current member's section of `PROGRESS.md` after **every** progress step (not only at the end of the session) and include it in the same commit as the work.
10. **Where to find things** (`docs/` map).

---

## 11. PDFs

Write `scripts/render-pdf.mjs` (root dev deps: `marked`, `playwright`, `mermaid`). It:
- converts Markdown (GFM tables, code blocks) to HTML with a clean print stylesheet (A4, 18 mm margins, readable sans-serif, table borders, no page breaks inside table rows, page breaks before every `h1`, an auto-generated table of contents from the `h1`/`h2` headings);
- renders the ```` ```mermaid ```` blocks by loading `node_modules/mermaid/dist/mermaid.min.js` into the page and waiting until every diagram has rendered (no network access needed);
- prints with Playwright Chromium (`page.pdf`), with a header/footer showing the document title and "page X of Y";
- accepts `--title`, `--out` and several input files (concatenated in order).

Produce and commit:

1. **`docs/plan/SideQuest_Group40_Master_Plan.pdf`**, from `docs/plan/PLAN.md`. PLAN.md must contain:
   1. Project at a glance (exam type, group, packages and how they were derived, delivery type, internal and official deadlines).
   2. The team and their responsibilities (requirements, modules, frontend features, INGSW chapters, E2E tests, reviewer rotation).
   3. The requirements R01–R12 with owner and task IDs.
   4. The tech stack with a short rationale, including the §4.1 table (what comes from the lectures and what does not, and why).
   5. The architecture: a Mermaid diagram of the modules, ports and events, plus the ownership map.
   6. The repository structure (an annotated tree).
   7. Collaboration rules: git workflow, ownership, contract-change process, reviews, Definition of Done, weekly sync.
   8. **The dependency graph** (Mermaid `flowchart LR` of every task in tasks.json, coloured by owner).
   9. **The timeline** (Mermaid `gantt`, one section per person) plus the milestone table.
   10. **The step-by-step plan per person**: for P1, P2 and P3 separately, a numbered list of every task with dates, blockers, deliverables, and "what you hand over to whom".
   11. The documentation plan: INGSW chapter → owner → task → due date; the TECWEB deliverables → owner.
   12. The E2E catalogue and the unit-test methods.
   13. The release and submission checklist (every common, TECWEB and INGSW item from §2.3 as a checkbox, with its owner).
   14. Risks and mitigations: dependency delays; DB contention on the last slot; realtime ordering; holiday availability; Sonar setup; "everyone must know everything" (dry-run sessions).
   15. Appendix: a summary of the domain assumptions and how to get started (pointing to the guides).
2. **`docs/guides/P1-vincenzo-lubrano.pdf`**, **`P2-matteo-marino.pdf`**, **`P3-domenico-panaro.pdf`**, from the guides in §12.
3. Do **not** create the `pdf:ingsw` and `pdf:scheda` scripts now: the chapter files do not exist yet, so the DOC-TRACE and TW-SCHEDA tasks add them later. `render-pdf.mjs` must be generic enough to support them.

**Verify the PDFs visually:** export the first pages and the pages with diagrams to PNG (Playwright screenshots of the HTML, or `pdftoppm` if available), look at them, and fix the layout problems (tables cut off, diagrams not rendered, broken TOC) before committing.

---

## 12. Personal guides (`docs/guides/`)

Each guide is a Markdown file (plus its PDF) with these sections, filled with the person-specific data from the table below and with the person's tasks taken from tasks.json:

1. **You and your scope:** requirements, backend modules, frontend features, INGSW and TECWEB deliverables, E2E IDs, unit-test method (if any), your reviewer and whom you review.
2. **One-time machine setup:** install Git, GitHub CLI, Node 22 (nvm or nvm-windows), Docker Desktop, VS Code (recommended extensions), Claude Code, Visual Paradigm (university licence) — **or simply use Starter prompt 1**, which does all of it with you.
3. **Your step-by-step plan:** every task with dates, blockers and deliverables, in order (generated from tasks.json).
4. **What others need from you, and when** (handover points) and **what you need from others** (your blockers).
5. **How to check whether you can start:** `npm run deps -- <ID>` and `npm run deps -- --mine Px`. If you are blocked, the fallback order is: your docs tasks → E2E/tests of your merged tasks → reviews → Sonar fixes in your modules → helping by reviewing contracts.
6. **The daily workflow:** sync `develop`, read the latest `PROGRESS.md` entries, branch, small commits each with its `PROGRESS.md` entry in your section, rebase onto `develop`, PR, review, squash-merge. Commit with **your own** identity. Include the §0.2 entry format and rules in full.
7. **Definition of Done** (§8.2).
8. **Technologies you must be able to explain:** the two lists from §4.1, with the rationale of every non-taught choice in two or three sentences.
9. **Exam-prep checklist:** what you must be able to explain about **your** modules and about **every other** module (request path FE → API → service → DB, the timer, secret objectives, realtime, the auth flow, the concurrency on the last slot, the team ordering), plus the questions to rehearse in REL-DRYRUN.
10. **Starter prompts:** the four prompts below, **verbatim**, with the placeholders replaced.

| Placeholder | P1 | P2 | P3 |
|---|---|---|---|
| `{NAME}` | Vincenzo Pio Lubrano | Matteo Marino | Domenico Panaro |
| `{PX}` | P1 | P2 | P3 |
| `{GH}` | `<GH_P1>` | `<GH_P2>` | `<GH_P3>` |
| `{OWNER_LABEL}` | owner:P1-vincenzo | owner:P2-matteo | owner:P3-domenico |
| `{GUIDE}` | docs/guides/P1-vincenzo-lubrano.md | docs/guides/P2-matteo-marino.md | docs/guides/P3-domenico-panaro.md |
| `{REVIEWER}` | Matteo Marino (`<GH_P2>`) | Domenico Panaro (`<GH_P3>`) | Vincenzo Pio Lubrano (`<GH_P1>`) |
| `{FIRST_TASKS}` | S0-ASSUMPTIONS (lead) and your part of S0-API, then R01 as soon as SCAFFOLD is merged | S0-EVENTS (lead) and your part of S0-API, then DOC-STATE and DOC-UC01-DRAFT | SCAFFOLD first (by 24 Nov, everyone else's coding depends on it), then S0-DATAMODEL and S0-API (lead), then SONAR-SETUP and DOC-ARCH-DRAFT |
| `{EXTRA}` | — | — | "I am also the repo admin and coordinator: also check open PRs older than 48 h and the milestone status." |

**Starter prompt 1 — first session on a new computer**

```text
I am {NAME} ({PX}) of Group 40, working on the SideQuest project (integrated INGSW + TECWEB, Federico II).
Repository: https://github.com/<OWNER>/sidequest-group40 — my GitHub login is {GH}. Speak Italian with me; write everything in the repo in English.
This is my first session on this computer. Do the following, in order, and stop where I say to stop:
1. Check that git, the GitHub CLI (logged in as {GH}), Node.js 22 LTS + npm, Docker (daemon running) are installed. If anything is missing, give me the exact install commands for my OS and wait for me.
2. If I have not accepted the collaborator invitation yet, tell me to accept it at https://github.com/notifications and wait.
3. Ask me in which folder to clone, clone the repo, check out develop, and set git user.name "{NAME}" and the user.email I give you (it must be the email linked to my GitHub account, so my commits count in the Git analysis).
4. Read, in this order: CLAUDE.md, PROGRESS.md (to know what has been done so far), docs/plan/PLAN.md, {GUIDE}, docs/reference/requirements.md, docs/decisions/assumptions.md, docs/design/data-model.md, docs/design/module-contracts.md, CONTRIBUTING.md. Then summarise for me in Italian, in at most 15 lines: my scope, my files, my first tasks, my blockers.
5. Check whether the SCAFFOLD issue is closed (npm run deps -- SCAFFOLD). If it is NOT closed yet, the code does not exist: skip this step, tell me, and remind me to run it again later. If it is closed, prepare the local environment: install Docker Desktop if missing, npm run setup:dev, create the .env files from .env.example (generate a random TOKEN_SECRET), docker compose up -d db, run migrations and seeds on the dev DB, start backend and frontend, open the health page, run the backend tests and the E2E smoke test. Report what works and fix only problems that are inside my ownership or local configuration; for anything else, draft an issue for the owner.
6. Self-assign all my issues: gh issue list --label {OWNER_LABEL} --state open, then gh issue edit <n> --add-assignee @me for each.
7. Run npm run deps -- --mine {PX} and show me the result. My first tasks are: {FIRST_TASKS}. Propose which READY task to start and why. Do NOT start coding until I confirm.
Rules for this and every session: follow CLAUDE.md; prefer what was taught in the lectures and never add a dependency without asking me; only edit files I own; never push to develop or main; never start a task whose blockers are not merged; explain what you do so that I can defend it at the exam. {EXTRA}
```

**Starter prompt 2 — every work session on a task**

```text
I am {NAME} ({PX}), Group 40, SideQuest. Speak Italian with me; write everything in the repo in English. Today I want to work on task <TASK-ID>.
1. git fetch, switch to develop, pull. Run npm run deps -- <TASK-ID>. If it is BLOCKED, stop, tell me which blockers are still open, and propose my next READY task (npm run deps -- --mine {PX}).
2. Read the issue (gh issue list --label task:<TASK-ID> then gh issue view), CLAUDE.md, the recent entries of PROGRESS.md (all sections), the requirement in docs/reference/requirements.md, the related assumptions, the data model, the module contracts, my module's OpenAPI fragment, and ONLY the public API (index.ts / public-api.ts) of other modules I depend on.
3. If the branch does not exist yet, create it from develop: feature/<task-id-lowercase>-<short-slug> (docs/... for documentation tasks). Add the label status:in-progress to the issue (remove status:ready).
4. Write a short implementation plan, ordered: backend (migration, models, domain classes, service with authorization, controller, routes, validation with the shared Validator, events/ports), frontend (routes, components, services, responsive layout with the shared CSS tokens and no UI library, loading/empty/error states), tests (unit for domain classes, integration with supertest incl. at least one authorization-negative case, my E2E specs from docs/tecweb/e2e-catalogue.md), seeds, OpenAPI fragment, module README, my traceability row. Show it to me and wait for my OK.
5. Implement in small Conventional Commits (scope = my module). Only touch files I own. If a shared or another member's file must change, STOP and write a contract-change issue draft for the team instead.
6. Before opening the PR: lint, typecheck, backend unit and integration tests, frontend production build and the relevant E2E specs must all pass locally. Rebase on develop if needed.
7. Push and open a PR to develop using the template, with "Closes #<issue>", reviewer {REVIEWER}, label status:in-review.
8. Throughout the session, after EVERY progress step (each sub-step completed, each decision, each fix), add an entry at the top of my section of PROGRESS.md (format in CLAUDE.md: What / Why / Files / How to verify / Next / Commit) and include it in the same commit. At the end, add the final entry with the PR link (and "DONE" if the task is complete).
9. Finally explain to me, file by file, what you built and why, and give me 5 questions a professor could ask about this task, with the answers.
```

**Starter prompt 3 — reviewing a teammate's PR**

```text
I am {NAME} ({PX}), Group 40, SideQuest. Speak Italian with me. I must review PR #<n>.
Check it out locally (gh pr checkout <n>), run the tests and the relevant E2E specs, and review it against CLAUDE.md and the Definition of Done: ownership of touched files, adherence to contracts and assumptions, authorization on every endpoint (try at least one unauthorized call), input validation, no leak of secret objectives, server-side time only, error handling, responsiveness at 360 px, test quality, OpenAPI and docs updated, PROGRESS.md entries present and accurate for every step of the PR.
Explain the PR to me so that I understand it well enough to answer exam questions on it. Then draft the review (comments per file + overall verdict). Show it to me and submit it with gh pr review only after my confirmation.
```

**Starter prompt 4 — documentation task (INGSW / TECWEB)**

```text
I am {NAME} ({PX}), Group 40, SideQuest. Speak Italian with me; documents are in English. I want to work on documentation task <DOC-ID>.
1. Run npm run deps -- <DOC-ID>; if BLOCKED, stop and tell me.
2. Read the issue, the header of the target files in docs/ingsw/ or docs/tecweb/ (it lists exactly what the brief requires), and the actual code on develop: the documentation must match the delivered code exactly.
3. Draft the content. For UML, write or update the PlantUML draft in docs/uml/ and give me precise step-by-step instructions to redraw it in Visual Paradigm and export it as PNG into docs/ingsw/img/ (the brief requires a CASE tool). For tests, document equivalence classes, boundary values, coverage criteria, dependencies, pre/post-conditions and outcomes, and make sure the Jest tests actually exist and pass.
4. Regenerate the PDF with the matching npm script and let me check it. Then branch docs/<doc-id>-<slug>, commit, open a PR to develop with "Closes #<issue>" and reviewer {REVIEWER}.
5. After every progress step, add an entry at the top of my section of PROGRESS.md (What / Why / Files / How to verify / Next / Commit), committed together with the work.
```

---

## 13. Final verification and hand-over (do not skip anything)

Before you finish, check **all** of these and paste the evidence (command plus a short output) as the newest entry (at the top) of the "Setup (laptop session)" section of `PROGRESS.md`:

1. **Scope check:** the repository contains **no** `backend/`, `frontend/`, `e2e/` or `docker/` folder, no `.ts` file, no `ci.yml` and no `sonar.yml`. If any exists, remove it and log the mistake. Then make a fresh clone into a temp folder: `npm ci` at the root works, and `npm run deps -- --mine P1` runs.
2. `node scripts/validate-plan.mjs`: OK (no cycles; dates consistent).
3. `npm run deps -- --all` prints the correct statuses: SETUP done; SCAFFOLD and S0-* READY; R01 and everything else BLOCKED with the right reasons.
4. The `plan` workflow is green on `develop`.
5. `docs/design/scaffold-spec.md` contains §4 + §4.1, §6.1–§6.3, §6.5, §7, the `ci.yml` / `sonar.yml` part of §9 step 7 and the SCAFFOLD checklist, complete.
6. On GitHub: milestones, labels, issues (with "Blocked by" links and a correct status label on every issue), collaborator invitations pending, `develop` as default branch, branch protection active on `develop` and `main` with required check `plan` (read back).
7. The PDFs are visually checked; the plan PDF contains the dependency graph and the Gantt chart, rendered.
8. `git status` is clean, everything is pushed, and there are no secrets in the history (`git log -p | grep -i -E "secret|password|token"` returns only examples and docs).

Then reply to Domenico **in Italian** with:
- the repo URL and the board URL (if one was created);
- what was created (short list);
- **what he must do by hand:**
  - make sure Matteo and Vincenzo accept the collaborator invitations;
  - send each member their guide PDF (`docs/guides/…`) or tell them where to find it;
  - plan the Sprint 0 kickoff call for Monday 23 Nov;
  - SonarCloud comes later, in SONAR-SETUP;
- that from now on he works on his desktop starting with **Starter prompt 1** of his guide (P3), and that his first task is **SCAFFOLD** (due 24 Nov), to be started with **Starter prompt 2** and task ID `SCAFFOLD`, because R01 and all the coding of the others depend on it;
- every point where you deviated from this prompt, and why.
