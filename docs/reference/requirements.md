# Requirements reference (paraphrase of the official brief)

Group 40 · early delivery · integrated project (INGSW + TECWEB) · core R01–R06 + package A (R07–R09) + package B (R10–R12).
Task IDs refer to `docs/plan/tasks.json`. Assumptions (A-xx) are in `docs/decisions/assumptions.md`.

| Req | Title | Owner | Tasks | Assumptions |
|---|---|---|---|---|
| R01 | Accounts, access, profile | P1 | R01 | A-01..A-04, A-26 |
| R02 | Mission creation and publication | P1 | R02 | A-05, A-06, A-22, A-23 |
| R03 | Exploration and search | P1 | R03 | A-07, A-24 |
| R04 | Acceptance and timed missions | P2 | R04 | A-08, A-09, A-13 |
| R05 | Progress, proofs, completion | P2 | R05A, R05B | A-10..A-12, A-25 |
| R06 | Personal area and live notifications | P2 | R06A, R06B | A-15 |
| R07 | Restricted visibility | P1 | R07 | A-16 |
| R08 | Invitations | P3 | R08 | A-17 |
| R09 | Capacity and waitlist | P2 | R09 | A-18 |
| R10 | Exploration teams | P3 | R10 | A-19 |
| R11 | Team participation | P3 | R11 | A-20 |
| R12 | Live cooperative updates | P3 | R12 | A-21 |

## R01 Accounts, access, profile (P1 · task R01)
Users register, log in and log out. An authenticated user has a profile with a nickname and editable personal information. Platform managers need administrative functions. Data must stay confidential, and unauthorized parties must not be able to perform operations.

## R02 Mission creation and publication (P1 · task R02)
An authenticated user creates a mission with title, presentation, category, objectives, an optional place, the ordinary or secret-timed mode, and optional participation conditions. A mission can be edited while no participant has started it. A publication mechanism exists, and missions can appear on the map.

## R03 Exploration and search (P1 · task R03)
Users, guests included, explore published missions through a list and an interactive map. Search and filters cover at least keyword, category and availability. A secret-timed mission shows enough to decide whether to accept it, without revealing its objectives.

## R04 Acceptance and timed missions (P2 · task R04)
An authenticated user accepts an available mission. For secret-timed missions, acceptance starts the countdown and reveals the objectives. The remaining time derives from authoritative server information, so changing device, reloading or tampering with the local clock cannot extend it. Expired missions are recognized as such.

## R05 Progress, proofs and completion (P2 · tasks R05A, R05B)
The participant sees the objectives, marks the ones considered done and attaches proofs (text or image). The system stores progress and determines the outcome: success, abandoned or expired. Coherent criteria for verifying proofs and awarding points are required.

## R06 Personal area and live notifications (P2 · tasks R06A, R06B)
The user sees the missions they created and the ones they take part in, with their status. Notifications are produced for relevant events (acceptance, status change, proof verification). New notifications appear without a manual reload and can be consulted later.

## R07 Restricted visibility (P1 · package A · task R07)
A mission is public or restricted to selected users. Restricted content must never be reachable by unauthorized users through direct URLs or API calls.

## R08 Invitations (P3 · package A · task R08)
The author invites users to a restricted mission. Invitees accept or decline and are informed promptly. The author sees the invitation status. Revocation and multiple invitations need a defined behaviour.

## R09 Capacity and waitlist (P2 · package A · task R09)
A maximum number of participants can be set. When places are full, users can join a waitlist. The system handles withdrawals, places freeing up later, and several users competing for the last place at the same time.

## R10 Exploration teams (P3 · package B · task R10)
Users create a team, name it and invite others. Distinct roles exist for the team admin and the members, with the essential join and leave operations.

## R11 Team participation (P3 · package B · task R11)
Some missions are for teams. Progress is shared, and completion may depend on contributions from several members. No participant may obtain results inconsistent with the shared state.

## R12 Live cooperative updates (P3 · package B · task R12)
Connected members promptly see each other's progress. The logical order of updates and the consistency of the state are preserved, even when a member disconnects and reconnects.

## Cross-cutting requirements
Persistence, access control, input validation, understandable errors, desktop and mobile support, and demos that need neither physical travel nor unavailable external services.

## Ambiguities the brief asks us to resolve
Editing missions with active participants; reopening or repeating a mission; proofs sent just before the deadline; the meaning of withdrawal; visibility of personal data; scoring criteria; concurrent invitations and access; consistency of team progress. All are covered in `docs/decisions/assumptions.md`.

## What the early delivery requires

**Common:** frontend and backend in separate directories, config files and build scripts, dependency descriptors (no `node_modules`), a README with reproducible run instructions, demo database and demo accounts instructions, group ID and members, list of implemented features.

**TECWEB (Appendix B):** SPA with a framework, responsive on every flow; backend with a web framework, documented APIs, server-side authN/authZ; server-side persistence (accounts, missions, acceptances, progress, notifications); server-authoritative timer and no early leak of secret objectives; interactive Leaflet + OSM map with attribution; notifications without manual refresh; input validation, HTTP/network error handling, credential protection. Deliverables: README, **one-page summary sheet**, **at least 10 automated non-duplicate E2E tests including at least one negative/authorization case**, demo data and test-run instructions. Docker is appreciated.

**INGSW (Appendix C, early column):** a single PDF with: SRS (glossary; actors + a use case diagram of all R01–R12 use cases; personas; non-functional and domain requirements; one structured Cockburn use case that is not registration/login, plus mockups; rationale of the assumptions); architecture and design (components and responsibilities, technologies and FE/BE communication, persistence model, design class diagram, at least one sequence/state/activity diagram, one reasoned design example); process (version-control evidence with a short repository analysis; a SonarQube/SonarCloud report on the backend with commentary); testing (a test plan for 1 significant feature; documented xUnit-family unit tests for 2 non-trivial methods with ≥2 parameters; methodological comment). A traceability table is appreciated. UML must be drawn with a CASE tool (Visual Paradigm).
