# E2E catalogue (TECWEB)

The brief requires **at least 10** automated, non-duplicate E2E tests including **at least one negative or authorization case**. We plan 12, plus a smoke test (`tests/smoke.spec.ts`, created by SCAFFOLD).

Playwright (Chromium desktop 1280×800 and mobile 390×844). File naming: `e2e/tests/p<1|2|3>-e2e-<NN>-<slug>.spec.ts`. The task `E2E-CATALOGUE` (P1) verifies the catalogue is complete, non-duplicate and green in CI.

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

Task mapping (where each spec is delivered): E2E-01 → R01; E2E-02 → R02; E2E-03 → R03; E2E-04 → R07; E2E-05, E2E-06 → R04; E2E-07 → R05B (needs R06A); E2E-08 → R09; E2E-09 → R10; E2E-10 → R08; E2E-11 → R12; E2E-12 → R11.

Unit-test methods for the INGSW document (pure domain classes, dependencies injected so stubs can replace Clock and membership):
- **UT-1 (P2):** `TimerPolicy.evaluate(participation: { status, acceptedAt, deadlineAt | null }, now: Date): { state: 'NOT_TIMED' | 'RUNNING' | 'EXPIRED' | 'ENDED', remainingSeconds: number | null }`. Classes: not timed, running, exactly at the deadline, inside the grace period, after the grace period, already-ended states, invalid input.
- **UT-2 (P3):** `TeamProgressReducer.apply(state: TeamProgressState, update: ProgressUpdate): ApplyResult`. Covers: in-order update, duplicate `seq`, gap, stale `version` conflict, update from a non-member, completion with fewer or with at least `minContributors` contributors.
