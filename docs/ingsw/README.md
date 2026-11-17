# INGSW document – planned structure

The INGSW deliverable is a **single PDF** (early delivery, Appendix C). **Only this file exists now**: each DOC task creates its own files later. Every chapter file, when created, starts with a header block giving the **owner, the task ID, the due date and the exact Appendix C items it must cover**. UML is drafted in PlantUML under `docs/uml/` (created by the DOC tasks) and **redrawn in Visual Paradigm**; exported PNGs go into `docs/ingsw/img/`.

| File | Owner | Task | Due | Appendix C items to cover |
|---|---|---|---|---|
| `00-cover.md` | P3 | DOC-TRACE | 2027-02-28 | Group ID, members, project type, packages |
| `01-srs/glossary.md` | P1 | DOC-SRS | 2027-02-21 | SRS: glossary |
| `01-srs/actors-and-use-cases.md` | P1 | DOC-SRS | 2027-02-21 | Actors + Use Case Diagram covering **all** use cases of R01–R12 |
| `01-srs/personas.md` | P1 | DOC-SRS | 2027-02-21 | Personas |
| `01-srs/nfr-and-domain.md` | P1 | DOC-SRS | 2027-02-21 | Non-functional and domain requirements |
| `01-srs/assumptions.md` | P1 | DOC-SRS | 2027-02-21 | Rationale of the assumptions resolving ambiguities (links `docs/decisions/assumptions.md`) |
| `01-srs/uc-01-accept-and-complete-secret-timed-mission.md` | P2 | DOC-UC01-DRAFT, DOC-UC01 | 2026-12-20 / 2027-02-14 | One structured Cockburn use case (not registration/login) |
| `01-srs/mockups.md` | P2 | DOC-UC01-DRAFT, DOC-UC01 | 2026-12-20 / 2027-02-14 | Mockups of the use case |
| `02-design/architecture.md` | P3 | DOC-ARCH-DRAFT, DOC-ARCH | 2026-12-06 / 2027-02-21 | Architecture, components and responsibilities with rationale |
| `02-design/technologies-and-communication.md` | P3 | DOC-ARCH-DRAFT, DOC-ARCH | 2026-12-06 / 2027-02-21 | Technologies, trade-offs, FE/BE communication |
| `02-design/persistence.md` | P3 | DOC-DESIGN-DRAFT, DOC-ARCH | 2027-01-03 / 2027-02-21 | Persistence model, domain entities, constraints and relations |
| `02-design/class-diagram.md` | P3 | DOC-DESIGN-DRAFT, DOC-ARCH | 2027-01-03 / 2027-02-21 | Design class diagram |
| `02-design/dynamic-diagrams.md` | P3 (state diagram: P2; sequence diagram: P3) | DOC-STATE, DOC-ARCH | 2026-12-13 / 2027-02-21 | At least one sequence, state or activity diagram for a non-trivial feature |
| `02-design/design-example.md` | P2 | DOC-DESIGN-EXAMPLE | 2027-02-28 | A reasoned example of how the design supports a non-trivial feature |
| `03-process/git-analysis.md` | P1 | DOC-GIT | 2027-02-28 | Version-control evidence and short repository analysis (commits, contributors, trend) |
| `03-process/sonar-report.md` | P3 | DOC-SONAR | 2027-02-21 | SonarQube/SonarCloud report on the backend, commentary and fixes |
| `04-testing/test-plan.md` | P2 | DOC-TESTPLAN | 2027-02-21 | Test plan for 1 significant feature (strategy, pre/post-conditions) |
| `04-testing/unit-test-timer-policy.md` | P2 | DOC-UNIT-TIMER | 2027-02-21 | Documented unit tests, method 1: `TimerPolicy.evaluate(participation, now)` |
| `04-testing/unit-test-team-progress.md` | P3 | DOC-UNIT-TEAM | 2027-02-21 | Documented unit tests, method 2: `TeamProgressReducer.apply(state, update)` |
| `04-testing/methodology.md` | P2 | DOC-TESTPLAN | 2027-02-21 | Methodological comment |
| `05-traceability/P1.md`, `P2.md`, `P3.md` | each owner | DOC-TRACE | 2027-02-28 | Table `Requirement \| Use case(s) \| Design components \| Tests` |
| `img/` | all | all DOC tasks | — | Exported Visual Paradigm diagrams (PNG) |

Unit-test requirements (per method): equivalence classes, boundary values, coverage criteria, dependencies, pre/post-conditions, outcomes; both methods have at least two parameters.

The PDF is assembled by task DOC-TRACE (`pdf:ingsw` script, added then).
