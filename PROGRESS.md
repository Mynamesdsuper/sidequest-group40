# SideQuest – Progress log

How to use this file: see "Progress log rules" in CLAUDE.md.
Newest entries go at the TOP of your own section. Never edit other members' sections.

## Setup (laptop session)

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
