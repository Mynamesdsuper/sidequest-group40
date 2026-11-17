# SideQuest – Progress log

How to use this file: see "Progress log rules" in CLAUDE.md.
Newest entries go at the TOP of your own section. Never edit other members' sections.

## Setup (laptop session)

### 2026-11-17 · SETUP · chore(plan): tasks.json, team.json, milestones and the planning scripts
- **What:** Added `docs/plan/tasks.json` (46 tasks, exactly as in the setup prompt §8.3), `team.json` (real GitHub logins), `milestones.json`, `task-details.json` (acceptance checklists, files and E2E IDs per task), and the scripts `validate-plan.mjs`, `deps.mjs`, `create-issues.mjs`, `render-pdf.mjs` (+ `lib.mjs`), plus the root `package.json` (+ lockfile; dev deps only `marked`, `playwright`, `mermaid` for the PDFs).
- **Why:** The gating rule ("start a task only when its blockers are merged") needs machine-readable data and a checker; the scripts are Node `.mjs` so they work on Windows, macOS and Linux. `task-details.json` is an addition to the prompt: it keeps the long issue checklists out of the script.
- **Files:** `docs/plan/*.json`, `scripts/*.mjs`, `package.json`, `package-lock.json`.
- **How to verify:** `node scripts/validate-plan.mjs` prints "Plan OK: 46 tasks, no cycles, 0 warning(s)"; a temporary SETUP→SCAFFOLD dependency made it fail with "dependency cycle" and exit code 1.
- **Next / open points:** PLAN.md, guides and PDFs; then GitHub labels, milestones and issues.
- **Commit/PR:** this commit.

### 2026-11-17 · SETUP · docs(repo): CLAUDE.md, CONTRIBUTING, README, INGSW structure, E2E catalogue
- **What:** Added the Claude Code rules (`CLAUDE.md`, incl. the progress-log rules), the git/review/DoD guide (`CONTRIBUTING.md`), a short `README.md` (status: setup only, scaffold pending: task SCAFFOLD), `docs/ingsw/README.md` (planned chapters with owners and due dates, no chapter files), the 12-test E2E catalogue and a meeting-notes template.
- **Why:** These tell each member (and each Claude Code session) what they may touch and how to work, without any application code (scope rule §0.1).
- **Files:** `CLAUDE.md`, `CONTRIBUTING.md`, `README.md`, `docs/ingsw/README.md`, `docs/tecweb/e2e-catalogue.md`, `docs/meetings/TEMPLATE.md`.
- **How to verify:** open the files; `grep -c "E2E-" docs/tecweb/e2e-catalogue.md`.
- **Next / open points:** plan data (`tasks.json`) and the planning scripts.
- **Commit/PR:** this commit.

### 2026-11-17 · SETUP · docs(design): data model, module contracts, realtime events, scaffold spec
- **What:** Wrote the PROPOSED drafts `data-model.md` (tables + Mermaid ER), `module-contracts.md` (ports, public APIs, domain events, planned REST surface) and `realtime-events.md`. Generated `scaffold-spec.md` as a verbatim copy of §4/§4.1, §6.1–§6.3, §6.5, §7, the ci/sonar part of §9 step 7 and the SCAFFOLD checklist of the setup prompt (by a throwaway script, so the copy is exact).
- **Why:** Contracts are frozen in Sprint 0; the scaffold spec lets the task SCAFFOLD be done later without this laptop session writing any code (scope rule §0.1). Signatures are Markdown only: no `.ts` files.
- **Files:** `docs/design/data-model.md`, `docs/design/module-contracts.md`, `docs/design/scaffold-spec.md`, `docs/api/realtime-events.md`.
- **How to verify:** `grep -n "^### 6\.\|^### 7\." docs/design/scaffold-spec.md`; `find . -name "*.ts"` returns nothing.
- **Next / open points:** root docs (CLAUDE.md, CONTRIBUTING, README), then the plan files.
- **Commit/PR:** this commit.

### 2026-11-17 · SETUP · docs(reference): requirements, assumptions A-01..A-26, ADRs 0001-0006
- **What:** Wrote the requirements paraphrase (R01–R12 with owners and task IDs), the 26 domain assumptions (all PROPOSED) and six short ADRs.
- **Why:** These are the single source of truth the three members will build on; Sprint 0 ratifies them (task S0-ASSUMPTIONS). ADR 0006 records the course-alignment rule (taught tools by default, written rationale otherwise).
- **Files:** `docs/reference/requirements.md`, `docs/decisions/assumptions.md`, `docs/decisions/adr/0001..0006-*.md`.
- **How to verify:** `ls docs/decisions/adr` shows six files; `grep -c "^| A-" docs/decisions/assumptions.md` prints 26.
- **Next / open points:** design drafts (data model, module contracts, realtime events) and the scaffold spec.
- **Commit/PR:** this commit.

### 2026-11-17 · SETUP · chore(repo): create repository and base config files
- **What:** Created the public repository `Mynamesdsuper/sidequest-group40`, cloned it locally, renamed the initial branch to `main`, added `.gitignore`, `.gitattributes`, `.editorconfig`, this log, and a copy of the setup prompt in `docs/plan/setup-prompt.md`.
- **Why:** Step 1 of the setup (see `docs/plan/setup-prompt.md` §0.1 and §9). The session is documentation and planning only: no application code (scope rule §0.1). LF line endings are forced for cross-platform work.
- **Files:** `.gitignore`, `.gitattributes`, `.editorconfig`, `PROGRESS.md`, `docs/plan/setup-prompt.md`.
- **How to verify:** `git log --oneline` shows the commit; `gh repo view Mynamesdsuper/sidequest-group40`.
- **Next / open points:** reference docs (requirements, assumptions, ADRs), then design docs.
- **Commit/PR:** first commit on `main`.

## P1 – Vincenzo Pio Lubrano

## P2 – Matteo Marino

## P3 – Domenico Panaro
