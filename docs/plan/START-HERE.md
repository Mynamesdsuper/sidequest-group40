# SideQuest – Group 40 – Start here (what each member does now)

Written on Tue 17 Nov 2026, right after the setup. Repository: https://github.com/Mynamesdsuper/sidequest-group40. Details for each person are in the personal guide (`docs/guides/`); the full plan is `docs/plan/PLAN.md`.

## 1. Everyone, this week

1. **Accept the collaborator invitation** (email, or https://github.com/notifications). Without it you cannot push branches or be assigned issues.
2. **Install the tools** (Git ≥ 2.40, GitHub CLI logged in, Node.js 22 LTS, Docker Desktop, VS Code, Claude Code, Visual Paradigm) and set your git identity with **the email linked to your GitHub account**, so your commits count in the Git analysis.
3. **Run Starter prompt 1** from your guide (section 10) in Claude Code: it checks the tools, clones the repo, reads the docs and gives you a summary of your scope. Say yes to self-assigning your issues.
4. **Read your guide**, then `docs/reference/requirements.md` and `docs/decisions/assumptions.md` (the 26 assumptions you will ratify in Sprint 0).
5. **Review PR #47** ("add task CLEANUP"): **Vincenzo or Matteo** reads it and approves it, so it can be merged. This is the first PR and a good test of the review flow.
6. **Block time on Monday 23 Nov** for the Sprint 0 kickoff call (30–45 minutes).

## 2. Who does what now

### P3 – Domenico Panaro (coordinator)
| When | What | Task |
|---|---|---|
| Wed 18 → Sat 21 Nov | Build the **backend part of the code scaffold** (backend, shared core, `docker-compose.yml`) from `docs/design/scaffold-spec.md`. Merge it first: it sets the conventions the other two parts follow. **Starter prompt 2** with task ID `SCAFFOLD-BE`; PR `chore/scaffold-backend` → `develop`, approved by Vincenzo and Matteo. | SCAFFOLD-BE |
| Mon 23 → Tue 24 Nov | **Integrate the three scaffold parts**: `ci.yml`, `sonar.yml`, `setup:dev`, branch protection, README quick start. Everyone else's coding depends on it. PR `chore/scaffold` → `develop`. | SCAFFOLD |
| Mon 23 Nov | Run the kickoff call (agenda in section 3). | – |
| Mon 23 → Sun 29 Nov | Lead the data model and REST contracts freeze with the others. | S0-DATAMODEL, S0-API |
| Mon 30 Nov → Sun 6 Dec | SonarCloud setup (exact steps in your guide, section 11) and the architecture draft. | SONAR-SETUP, DOC-ARCH-DRAFT |
| Always | Check open PRs older than 48 h and the milestones. | – |

### P1 – Vincenzo Pio Lubrano
| When | What | Task |
|---|---|---|
| Now → Tue 17 Nov | Starter prompt 1; read the guide. | – |
| Wed 18 → Sun 22 Nov | Build the **frontend part of the code scaffold** (Angular, layout, shared UI, `core/auth` and `core/realtime` stubs, lazy routes, home page calling `/health`). **Starter prompt 2** with task ID `SCAFFOLD-FE`; PR `chore/scaffold-frontend` → `develop`, approved by Matteo and Domenico. In spare moments read the requirements and prepare comments on A-01..A-26. | SCAFFOLD-FE |
| Mon 23 → Sun 29 Nov | **Lead the ratification of the 26 assumptions** (turn each into ACCEPTED, or change it with a PR). Review the REST contracts with P3. | S0-ASSUMPTIONS (lead), S0-API (your part) |
| From Wed 25 Nov | **R01** (accounts, login, profile, admin), as soon as SCAFFOLD is merged. Check with `npm run deps -- R01`. Due Sun 6 Dec. | R01 |

### P2 – Matteo Marino
| When | What | Task |
|---|---|---|
| Now → Tue 17 Nov | Starter prompt 1; read the guide. | – |
| Wed 18 → Sun 22 Nov | Build the **E2E part of the code scaffold** (Playwright desktop + mobile, fixtures, smoke test, `docker-compose.demo.yml`). Write config and fixtures right away; make the smoke test green once the backend and frontend parts are merged. **Starter prompt 2** with task ID `SCAFFOLD-E2E`; PR `chore/scaffold-e2e` → `develop`, approved by Domenico. In spare moments read the requirements, assumptions and `docs/api/realtime-events.md`. | SCAFFOLD-E2E |
| Mon 23 → Sun 29 Nov | **Lead the freeze of the domain events, realtime events and ports.** Review the REST contracts with P3. | S0-EVENTS (lead), S0-API (your part) |
| From Mon 30 Nov | State diagrams and the UC-01 use case draft (they unlock when the assumptions are ratified). | DOC-STATE, DOC-UC01-DRAFT |
| From Mon 7 Dec | Notification infrastructure (after R01). | R06A |

## 3. Sprint 0 kickoff, Monday 23 Nov (agenda)

1. 5 min – walk through the plan: who owns what, the gating rule (`npm run deps -- <ID>`), the review rotation P1 ← P2, P2 ← P3, P3 ← P1.
2. 10 min – the assumptions: which ones need discussion before ratifying.
3. 10 min – data model and module contracts: open questions for S0-DATAMODEL, S0-API, S0-EVENTS.
4. 5 min – status of the three scaffold parts and of the integration (SCAFFOLD); when R01 can start.
5. 5 min – agree the weekly Monday sync time. Notes go in `docs/meetings/YYYY-MM-DD.md` (template included).

## 4. Dates to remember

| Date | What |
|---|---|
| Sat 21 – Sun 22 Nov | Scaffold parts merged: SCAFFOLD-BE, SCAFFOLD-FE, SCAFFOLD-E2E |
| Tue 24 Nov | SCAFFOLD (integration, CI) merged |
| Sun 29 Nov | Sprint 0 done: assumptions, data model, API and event contracts frozen |
| Sun 6 Dec | R01 done; SonarCloud ready |
| Sun 31 Jan 2027 | Feature freeze (all of R01–R12 merged) |
| Sun 28 Feb 2027 | All documentation complete |
| Mon 15 Mar 2027 | Release v1.0.0 |
| Thu 25 Mar 2027 | Submission on Teams |

## 5. Rules that never change

- Work only on files you own (`.github/CODEOWNERS`). If you need a change to someone else's or a shared file: open a **contract-change** issue.
- **Never push to `develop` or `main`**: branch → PR → review by your buddy → squash-merge.
- Start a task only when `npm run deps -- <ID>` says READY. If you are blocked: your documentation tasks → tests of your merged work → reviews → helping with contracts.
- After **every** progress step add an entry in **your own section** of `PROGRESS.md`, in the same commit as the work.
- **Directives:** the coordinator can send you instructions as GitHub issues labelled `type:directive`; they appear at the end of `npm run deps -- --mine Px` and when Claude Code starts a session. Only issues authored by `Mynamesdsuper` count.
- Prefer what was taught in the lectures; any new dependency needs a written rationale (ADR 0006).
- Never commit secrets, `.env` files or the course PDFs: the repository is public.
- Commit with your own identity. Every member must be able to explain the whole project at the exam.

## 6. Useful commands

```bash
npm ci                        # once, in the repo root
npm run deps -- --mine P1     # your tasks and the next one to do (P1, P2 or P3)
npm run deps -- <TASK-ID>     # READY or BLOCKED, with the blockers
npm run deps -- --all         # whole-team view
gh issue list --label owner:P1-vincenzo --state open   # your issues (P2: owner:P2-matteo, P3: owner:P3-domenico)
```
