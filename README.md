# SideQuest – Group 40

University project (Università degli Studi di Napoli Federico II, A.A. 2026/27) for two exams with one product: **Ingegneria del Software (INGSW)** and **Tecnologie Web (TECWEB)**. Type: **integrated**. Delivery: **early** (requirements R01–R12). Packages: core R01–R06 + **A** (R07–R09) + **B** (R10–R12).

> **Status: setup only, scaffold pending: task SCAFFOLD.** The repository currently contains documentation, the plan, the personal guides and the planning scripts. There is no application code yet, so there is nothing to run apart from the planning tools below.

## Group

| Role | Name | Student ID | GitHub |
|---|---|---|---|
| P1 | Vincenzo Pio Lubrano | N86005417 | [@vincenzolubrano05](https://github.com/vincenzolubrano05) |
| P2 | Matteo Marino | N86005461 | [@reverinn](https://github.com/reverinn) |
| P3 | Domenico Panaro (coordinator) | N86005622 | [@Mynamesdsuper](https://github.com/Mynamesdsuper) |

## Features

| Req | Feature | Owner | Status |
|---|---|---|---|
| R01 | Accounts, access, profile | P1 | planned |
| R02 | Mission creation and publication | P1 | planned |
| R03 | Exploration and search | P1 | planned |
| R04 | Acceptance and server-authoritative timer | P2 | planned |
| R05 | Progress, proofs, completion | P2 | planned |
| R06 | Personal area and live notifications | P2 | planned |
| R07 | Restricted visibility | P1 | planned |
| R08 | Invitations | P3 | planned |
| R09 | Capacity and waitlist | P2 | planned |
| R10 | Exploration teams | P3 | planned |
| R11 | Team participation | P3 | planned |
| R12 | Live cooperative updates | P3 | planned |

## Planned technologies
Node.js 22, TypeScript, Express 5, Sequelize 6, PostgreSQL 17, Socket.IO; Angular, Leaflet + OpenStreetMap; Jest, supertest, Playwright; Docker, GitHub Actions, SonarCloud. Rationale: `docs/decisions/adr/`.

## Planning tools (available now)
Prerequisites: Node.js ≥ 22, npm, the GitHub CLI (`gh`) logged in.

```bash
npm ci                         # tooling for the plan and the PDFs
npm run plan:validate          # check docs/plan/tasks.json
npm run deps -- --mine P1      # your tasks (P1, P2 or P3)
npm run deps -- <TASK-ID>      # is a task READY or BLOCKED?
npm run deps -- --all          # whole-team view
```

## Documentation
- Master plan: [`docs/plan/PLAN.md`](docs/plan/PLAN.md) · [PDF](docs/plan/SideQuest_Group40_Master_Plan.pdf)
- Personal guides: [`docs/guides/`](docs/guides/) (P1, P2, P3, Markdown + PDF)
- Requirements: [`docs/reference/requirements.md`](docs/reference/requirements.md)
- Assumptions and ADRs: [`docs/decisions/`](docs/decisions/)
- Design drafts: [`docs/design/`](docs/design/), [`docs/api/realtime-events.md`](docs/api/realtime-events.md)
- Scaffold specification: [`docs/design/scaffold-spec.md`](docs/design/scaffold-spec.md)
- E2E catalogue: [`docs/tecweb/e2e-catalogue.md`](docs/tecweb/e2e-catalogue.md)
- INGSW document structure: [`docs/ingsw/README.md`](docs/ingsw/README.md)
- Progress log: [`PROGRESS.md`](PROGRESS.md) · Rules: [`CLAUDE.md`](CLAUDE.md), [`CONTRIBUTING.md`](CONTRIBUTING.md)

The final README (quick start, configuration, demo accounts, tests, Docker demo) is written by P1 in task TW-README, after the scaffold exists.
