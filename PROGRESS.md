# SideQuest – Progress log

How to use this file: see "Progress log rules" in CLAUDE.md.
Newest entries go at the TOP of your own section. Never edit other members' sections.

## Setup (laptop session)

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
