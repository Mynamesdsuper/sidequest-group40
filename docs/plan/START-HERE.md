# SideQuest – Group 40 – Start here (what each member does now)

Updated on Mon 23 Nov 2026, after the code scaffold (first written on Tue 17 Nov, after the setup). Repository: https://github.com/Mynamesdsuper/sidequest-group40. Details for each person are in the personal guide (`docs/guides/`); the full plan is `docs/plan/PLAN.md`; everything done so far, in order, is in `PROGRESS.md` and in the project history PDF.

**Where we are.** The setup (17 Nov) and the code scaffold (18–23 Nov) are done: backend, frontend, E2E tests, Docker and CI are on `develop` (SCAFFOLD-BE #57, SCAFFOLD-FE #60, SCAFFOLD-E2E #59, SCAFFOLD #63). Every PR to `develop` or `main` now needs the CI checks `backend`, `frontend`, `e2e` and `plan` green and one approval. No requirement is implemented yet: Sprint 0 freezes the contracts by Sun 29 Nov, and R01 starts on Wed 25 Nov.

## 1. Everyone, this week (23–29 Nov)

1. **Prepare your computer for the code:** pull `develop`, run `npm run setup:dev` (installs backend, frontend and e2e, downloads Chromium, creates the `.env` files), then follow the README quick start (database in Docker, `npm run db:migrate`, `npm run dev`, `npm start`). The home page must show "backend ok · database up".
2. **Read the kickoff notes** in `docs/meetings/2026-11-23.md` and the open points on #4 (data model) and #61 (REST contracts and public APIs).
3. **Review the PRs assigned to you within 48 hours**, and agree or object on the contract-change issues (#67 and #69 this week).
4. **Agree the weekly sync slot** (Monday) and keep logging every step in your section of `PROGRESS.md`.

## 2. Who does what now

### P3 – Domenico Panaro (coordinator)
| When | What | Task |
|---|---|---|
| Mon 23 Nov | Run the kickoff call and record the decisions. | – |
| Mon 23 → Sun 29 Nov | Apply the kickoff decisions: update `data-model.md` and the ER diagram; freeze the REST contracts and public APIs (#61); contract-change on A-20 if `maxTeamSize` is kept. | S0-DATAMODEL, S0-API |
| Mon 30 Nov → Sun 6 Dec | SonarCloud setup (exact steps in your guide, section 11) and the architecture draft. | SONAR-SETUP, DOC-ARCH-DRAFT |
| Always | Check open PRs older than 48 h, the directives and the milestones. | – |

### P1 – Vincenzo Pio Lubrano
| When | What | Task |
|---|---|---|
| Mon 23 → Sun 29 Nov | **Lead the ratification of the 26 assumptions** (turn each into ACCEPTED, or change it with a PR). Confirm your REST tables (`auth`, `users`, `missions`) in #61. | S0-ASSUMPTIONS (lead), S0-API (your part) |
| From Wed 25 Nov | **R01** (accounts, login, profile, admin): SCAFFOLD is merged, check with `npm run deps -- R01`. Due Sun 6 Dec. | R01 |

SCAFFOLD-FE, first planned for P1, was taken over by P3 on 19 Nov; your folders already contain placeholders marked `TODO(R01, P1)`.

### P2 – Matteo Marino
| When | What | Task |
|---|---|---|
| Mon 23 → Sun 29 Nov | **Lead the freeze of the domain events, realtime events and ports.** Confirm your REST tables (`participations`, `notifications`, `dashboard`) in #61. | S0-EVENTS (lead), S0-API (your part) |
| From Mon 30 Nov | State diagrams and the UC-01 use case draft (they unlock when the assumptions are ratified). | DOC-STATE, DOC-UC01-DRAFT |
| From Mon 7 Dec | Notification infrastructure (after R01). | R06A |

## 3. Sprint 0 kickoff, Monday 23 Nov

Agenda, decisions and actions are in `docs/meetings/2026-11-23.md`. The coordinator's proposals on the open points are posted on #4 (data model) and #61 (REST contracts and public APIs).

## 4. Dates to remember

| Date | What |
|---|---|
| Wed 18 – Mon 23 Nov | Code scaffold done: SCAFFOLD-BE, SCAFFOLD-FE, SCAFFOLD-E2E, SCAFFOLD (CI, branch protection) |
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
