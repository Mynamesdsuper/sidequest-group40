# Contributing to SideQuest (Group 40)

## Git workflow
- `main` holds releases only. `develop` is the integration and **default** branch.
- Work on short-lived branches from `develop`: `feature/<task-id>-<slug>`, `docs/<task-id>-<slug>`, `fix/<task-id>-<slug>`, `chore/<slug>`.
- **Never push directly** to `develop` or `main` (branch protection enforces it, admins included). Open a PR.
- Squash-merge into `develop`; release PRs `develop` → `main` use a merge commit.
- Commit with **your own identity** (`git config user.name` / `user.email`, the email linked to your GitHub account) so the Git analysis attributes the work correctly.
- Conventional Commits whose scope is the module: `feat(participations): store server deadline on accept`, `docs(ingsw): …`, `fix(missions): …`, `chore(repo): …`.

## Task gating
A task may be **started** only when every blocker is DONE (its issue closed by a PR merged into `develop`). Check with `npm run deps -- <TASK-ID>`; see your work with `npm run deps -- --mine P1|P2|P3`. If a blocker is more than 3 days late, raise it at the weekly sync; the owner may then merge a minimal vertical slice that satisfies the contract.

## Directives
The coordinator (P3) can assign work to any member with `npm run directive` (a GitHub issue labelled `type:directive`, authored by the coordinator). Members see them with `npm run deps -- --mine Px` and in every Claude Code session. Acknowledge with a comment, deliver through a normal PR, close the issue when done. Directives never override ownership, gating or security rules.

## Review rotation
| Author | Reviewer |
|---|---|
| P1 Vincenzo | P2 Matteo |
| P2 Matteo | P3 Domenico |
| P3 Domenico | P1 Vincenzo |

Reviews are done within 48 hours. `CODEOWNERS` gives every path an owner plus a reviewer buddy; code-owner review is required.

## Contract-change process
Shared code and contracts (`backend/src/shared/`, `docs/design/`, `docs/decisions/`, `docs/api/`, root configs, `.github/`, OpenAPI fragments of other modules, ports, events) change only through a **contract-change issue**: describe what and why, tag the other two members, wait for agreement, then open the PR (reviewed by both). Appending to your own section of `PROGRESS.md` never needs this process.

## Definition of Done
- Backend: migration(s), models, domain classes, service, controller, routes; input validation with the shared `Validator`; authorization checked in the service layer; meaningful error codes; domain events emitted; OpenAPI fragment updated (`x-status: done`).
- Frontend: screens responsive at 360 px and at desktop size; loading, empty and error states; no secret data in network responses where it is forbidden.
- Tests: unit tests for domain classes; integration tests with supertest, including **at least one authorization-negative case**; the assigned E2E specs pass in CI.
- Seeds updated so the feature is demonstrable without physical travel.
- `PROGRESS.md` updated in your section after every step, with a final "DONE" entry linking the PR.
- Docs updated: module README, your traceability row (`docs/ingsw/05-traceability/Px.md`), the README features table (a short PR touching only that row).
- CI green. PR approved by your reviewer buddy. Squash-merged with `Closes #<issue>`.

## Progress log
Add an entry at the top of **your** section of `PROGRESS.md` after every progress step, in the same commit as the work. Format and rules: `CLAUDE.md` §9b.

## Course alignment
Use what was taught by default. A new dependency needs a written rationale in `docs/decisions/adr/0006-alignment-with-the-course.md`, added through a contract-change PR. No UI component library.

## Secrets and files
Never commit secrets, `.env` files, uploads, or the course PDFs (the repository is public).

## Weekly rhythm
A 30-minute sync every Monday: what got merged, open blockers (`npm run deps -- --all`), contract-change requests. Notes go in `docs/meetings/YYYY-MM-DD.md` (use `docs/meetings/TEMPLATE.md`).
