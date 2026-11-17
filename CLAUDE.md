# CLAUDE.md – SideQuest, Group 40

Read this file at the start of every session. Speak the member's language (the team speaks Italian); **everything written into the repository is in English**.

## 1. The project in 5 lines
- **SideQuest**: a web app where users create and play missions (ordinary or secret-timed), explore them on a map, invite others, form teams and follow live updates.
- Group **40** · Federico II · A.A. 2026/27 · **integrated** project for INGSW + TECWEB · early delivery (R01–R12: core R01–R06 + package A R07–R09 + package B R10–R12).
- Stack: Node.js 22 + TypeScript + Express 5 + Sequelize 6 + PostgreSQL 17 + Socket.IO; Angular (no UI library) + Leaflet/OSM; Jest/supertest + Playwright; Docker; GitHub Actions + SonarCloud.
- Monorepo: `backend/`, `frontend/`, `e2e/`, `docs/`, `scripts/`, `docker/`, `.github/`. **Current status: setup only; the code scaffold is the task SCAFFOLD (P3).**
- Plan: `docs/plan/PLAN.md`. Progress log: `PROGRESS.md`. Task dependencies: `npm run deps`.

## 2. Who owns what
| Member | Role | GitHub | Backend modules | Frontend features | Reviewer (reviews their PRs) | Reviews PRs of |
|---|---|---|---|---|---|---|
| **P1** Vincenzo Pio Lubrano | R01, R02, R03, R07 | `vincenzolubrano05` | `auth`, `users`, `missions` | `auth`, `profile`, `admin`, `missions`, `explore`, `shared/map` | P2 | P3 |
| **P2** Matteo Marino | R04, R05, R06, R09 | `reverinn` | `participations`, `notifications`, `dashboard` | `participation`, `waitlist`, `notifications`, `dashboard`, `core/realtime` | P3 | P1 |
| **P3** Domenico Panaro (admin, coordinator) | R08, R10, R11, R12 + SCAFFOLD | `Mynamesdsuper` | `invitations`, `teams` | `invitations`, `teams`, `team-play` | P1 | P2 |

Shared (everyone, changed only through the `contract-change` process): `backend/src/shared/`, `app.ts`, `server.ts`, `modules/registry.ts`, `frontend/src/app/core/{api,layout}/`, `shared/ui/`, `app.routes.ts`, `e2e/fixtures/`, `docs/decisions/`, `docs/design/`, `.github/`, root configs. `PROGRESS.md` is shared but append-only inside your own section. `.github/CODEOWNERS` is the authority.

## 3. Non-negotiable rules for Claude Code sessions
a. **Identify the current member** (ask if unknown) and **only edit files that member owns**. If a change to another member's or a shared file is needed, stop, explain why, and draft a `contract-change` issue or a message for the owner.
b. **Before starting a task run `npm run deps -- <ID>`.** If it is BLOCKED, do not start it.
c. **Never push to `develop` or `main`.** Always use a branch and a PR.
d. **Never commit** secrets, `.env`, uploads or the course PDFs (the repo is public).
e. Respect `docs/decisions/assumptions.md`; changing an assumption needs a contract-change.
f. **Explain what you build** so the member can defend it at the exam: every member must know the whole project.

## 4. Security invariants
- Secret objectives are **never serialized before acceptance**.
- Time always comes from `Clock` (server); never `Date.now()` in domain code.
- Authorization is checked **in services**, not only in routes.
- Restricted resources return **404** to unauthorized users.
- Validate every input with the shared `Validator` / `validate()` middleware.
- Never trust client-sent user IDs or roles.
- Uploads are type- and size-checked and served only through authenticated endpoints.

## 5. Course alignment
Prefer what was taught in the lectures (`docs/decisions/adr/0006-alignment-with-the-course.md`). Before adding **any** new dependency, check whether a taught tool or plain TypeScript does the job; if not, stop and ask the member, and record the rationale in ADR 0006 through a contract-change PR. **Never add a UI component library.** Name the patterns as the course does: ports = **Strategy** + **Dependency Injection**, event bus = **Observer**, data access = **Repository**.

## 6. Coding conventions
- Module layout: `index.ts` (exports `register(ctx)` + public API), `<module>.routes.ts`, `<module>.controller.ts`, `services/`, `domain/` (pure OOP classes: policies, state machines), `models/`, `dto/`, `<module>.openapi.yaml`, `README.md`.
- Cross-module access **only** through `index.ts`, ports or domain events. Frontend: `features/<x>` imports from another feature only through its `public-api.ts`.
- Non-trivial logic lives in OOP domain classes (unit-testable, easy to show in UML).
- Errors: `AppError` hierarchy, format `{ "error": { "code", "message", "details" } }`.
- Migrations: `backend/src/db/migrations/YYYYMMDDHHmm-<module>-<description>.ts`. Seeds: `backend/src/db/seeds/NN-<module>.ts` (`01-users` P1, `02-categories` P1, `03-missions` P1, `04-teams` P3, `05-participations` P2, `06-invitations` P3, `07-notifications` P2).
- OpenAPI: one fragment per module with `x-owner`, `x-requirement`, `x-status` (`planned` → `done`).

## 7. Commands cheat-sheet
Available now:
- `npm ci` – install the planning/PDF tooling
- `npm run deps -- <ID>` · `npm run deps -- --mine P1|P2|P3` · `npm run deps -- --all`
- `npm run plan:validate` · `npm run issues:sync` · `npm run pdf:plan` · `npm run pdf:guides`

After SCAFFOLD (see `docs/design/scaffold-spec.md`): `npm run setup:dev`, `docker compose up -d db`, backend `npm run dev|test|lint|typecheck|db:migrate|db:seed|db:reset`, frontend `npm start|build`, e2e `npx playwright test`.

## 8. Testing rules
Definition of Done: `CONTRIBUTING.md` and `docs/plan/PLAN.md` §7. Unit tests for domain classes; integration tests with supertest including at least one authorization-negative case; E2E specs named `e2e/tests/p<1|2|3>-e2e-<NN>-<slug>.spec.ts` following `docs/tecweb/e2e-catalogue.md`.

## 9. Commit and PR conventions
- Branches: `feature/<task-id>-<slug>`, `docs/<task-id>-<slug>`, `fix/<task-id>-<slug>`, `chore/<slug>`; squash-merge into `develop`; merge commits for release PRs `develop` → `main`.
- Conventional Commits with the module as scope: `feat(participations): store server deadline on accept`.
- Commit **with your own identity**. PR uses the template and `Closes #<issue>`.

### 9b. Progress log rules
`PROGRESS.md` at the repository root is the running log of **every change made to the project, with its explanation**. It lets any member (and any Claude Code session) know at any moment what was done, by whom, why, and how to check it; it is also raw material for the Git analysis (DOC-GIT) and exam preparation.

Entry format (one entry per progress step, newest first inside your section):

```markdown
### 2026-11-25 14:30 · R01 · feat: JWT login and logout
- **What:** what was done, in 1–3 lines.
- **Why:** the reason or decision behind it (link the assumption A-xx, ADR or issue if relevant).
- **Files:** the main files or folders touched.
- **How to verify:** the command, test or screen that proves it works.
- **Next / open points:** what remains, blockers, questions for the team (or "none").
- **Commit/PR:** short hash or #PR (add it when known).
```

Rules:
- An entry is added **after every progress step**: every completed sub-step of a task, every commit that changes behaviour, every decision, every fix, every merged PR. Several entries per day are normal; a day of work with no entry is not.
- Each person writes **only in their own section**, always at the top of it, so that parallel branches do not conflict. If a merge conflict happens anyway in `PROGRESS.md`, keep both entries.
- The entry is committed **in the same commit** as the work it describes (or immediately after, in the same branch), never in a separate PR.
- Write in English, concise and concrete; explain the *why*, not only the *what*.
- When a task is closed, the last entry says "DONE" and links the merged PR.
- `PROGRESS.md` is a shared file (CODEOWNERS: all three), but appending in your own section never requires the contract-change process.

## 10. Where to find things
| What | Where |
|---|---|
| The plan, dependency graph, timeline | `docs/plan/PLAN.md` (+ PDF), `docs/plan/tasks.json` |
| Your personal guide and starter prompts | `docs/guides/P<1-3>-*.md` (+ PDF) |
| Requirements (paraphrase of the brief) | `docs/reference/requirements.md` |
| Domain assumptions, ADRs | `docs/decisions/` |
| Data model, module contracts, scaffold spec | `docs/design/` |
| Realtime events | `docs/api/realtime-events.md` |
| E2E catalogue (TECWEB) | `docs/tecweb/e2e-catalogue.md` |
| INGSW document structure | `docs/ingsw/README.md` |
| Meeting notes | `docs/meetings/` |
| Setup prompt (history) | `docs/plan/setup-prompt.md` |
