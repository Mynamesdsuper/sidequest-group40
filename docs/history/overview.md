# Questo documento

Questa è la **storia del progetto** SideQuest (Gruppo 40): tutto ciò che è stato fatto al repository, in ordine, con il motivo di ogni passo e il modo di verificarlo. È pensata per tre lettori:

- un membro che è stato via qualche giorno e deve rimettersi in pari;
- un membro che prepara l'esame, perché deve saper spiegare l'intero progetto e come è stato costruito;
- chi scrive i capitoli INGSW sul processo (analisi del repository Git, report Sonar, commento metodologico).

**Come viene costruito.** Il documento è generato da `npm run history` (`scripts/history.mjs`) a partire da tre fonti, così non va mai scritto due volte:

1. questa introduzione (`docs/history/overview.md`), scritta a mano: il contesto che serve per capire il registro;
2. il **registro cronologico**: tutte le voci di `PROGRESS.md`, di ogni membro, ordinate per data e ora. `PROGRESS.md` è il registro che ogni membro aggiorna già dopo ogni passo (`CLAUDE.md` §9b), quindi la qualità di questo documento è la qualità di quelle voci;
3. la **storia dei commit** del branch e una fotografia dello **stato dei task** (`npm run deps -- --all`).

**Come resta aggiornato.** Il workflow `.github/workflows/history.yml` ricostruisce il PDF a ogni push su `develop` (cioè dopo ogni PR mergiata) e lo pubblica sempre agli stessi due indirizzi: come file nel branch `history` (`https://github.com/Mynamesdsuper/sidequest-group40/blob/history/SideQuest_Group40_History.pdf`) e come allegato della pre-release `history-latest`. Il branch `history` ha un solo commit, sostituito a ogni aggiornamento, così i cloni non si appesantiscono: non ci si lavora sopra. I file generati non vengono committati (sono in `.gitignore`), così le PR parallele non vanno mai in conflitto su un file binario. Chiunque può rigenerarlo in locale con `npm run history` (il PDF finisce in `docs/history/`).

**Lingua.** La storia del progetto e `PROGRESS.md` sono in italiano. Tutto il resto del repository (codice, commenti, messaggi di commit, documentazione tecnica, piano, guide) resta in inglese, per questo nel registro compaiono nomi di file, comandi e messaggi di commit in inglese.

**Come leggere il registro.** Ogni passo ha gli stessi campi: **Cosa** è stato fatto, **Perché** (la decisione e le alternative, con i riferimenti alle assunzioni A-xx, agli ADR o alle issue), i **File** toccati, **Come verificare** che funziona, i **Prossimi passi** aperti, e il commit o la PR. Il titolo di ogni passo riporta data e ora, il task di riferimento e il tipo di modifica (`feat`, `docs`, `chore`, `ci`… secondo i Conventional Commits); sotto il titolo c'è la sezione di `PROGRESS.md`, cioè chi l'ha scritto.

# Il progetto in breve

**SideQuest** è un'applicazione web in cui gli utenti creano e giocano *missioni* (ordinarie, oppure segrete con un timer gestito dal server), le esplorano su una mappa, invitano altri utenti, formano squadre e seguono gli aggiornamenti in tempo reale. È l'unico prodotto di un progetto **integrato** per due esami dell'Università degli Studi di Napoli Federico II, A.A. 2026/27: *Ingegneria del Software* (INGSW) e *Tecnologie Web* (TECWEB). Il Gruppo 40 ha scelto la **consegna anticipata**: tutti i requisiti R01–R12 (base R01–R06, pacchetto A R07–R09, pacchetto B R10–R12), rilascio entro il 15 marzo 2027, consegna entro il 25 marzo 2027.

| Membro | GitHub | Requisiti | Altre responsabilità |
|---|---|---|---|
| P1 Vincenzo Pio Lubrano | `vincenzolubrano05` | R01 account, R02 missioni, R03 esplorazione, R07 visibilità ristretta | capitolo SRS, analisi Git, README e scheda sintetica, scaffold del frontend (SCAFFOLD-FE) |
| P2 Matteo Marino | `reverinn` | R04 timer, R05 avanzamento e prove, R06 notifiche, R09 capienza e lista d'attesa | UC-01, diagramma di stato, piano di test, unit test di `TimerPolicy`, scaffold E2E (SCAFFOLD-E2E) |
| P3 Domenico Panaro | `Mynamesdsuper` | R08 inviti, R10 squadre, R11 partecipazione in squadra, R12 aggiornamenti live | amministratore del repository e coordinatore, scaffold del backend e CI, capitolo di architettura, Sonar, tracciabilità, rilascio |

**Tecnologie** (fissate nell'ADR 0001 e giustificate rispetto al corso nell'ADR 0006): Node.js 22 + TypeScript + Express 5 + Sequelize 6 + PostgreSQL 17 + Socket.IO sul backend; Angular senza librerie di componenti UI + Leaflet/OpenStreetMap sul frontend; Jest + supertest e Playwright per i test; Docker, GitHub Actions e SonarCloud per il processo. L'architettura è un **monolite a strati diviso in moduli**: una cartella per modulo (routes → controller → service/dominio → repository/modelli); i moduli comunicano solo tramite il loro `index.ts` pubblico, i *port* (pattern Strategy + Dependency Injection) e un bus di eventi interno (pattern Observer).

# Come è organizzato il repository

| Percorso | Cosa contiene |
|---|---|
| `PROGRESS.md` | il registro di ogni modifica, una sezione per membro (fonte del registro cronologico) |
| `CLAUDE.md`, `CONTRIBUTING.md` | le regole di lavoro: ownership, gating, invarianti di sicurezza, convenzioni di commit e PR, Definition of Done |
| `docs/reference/requirements.md` | parafrasi della traccia ufficiale, R01–R12 |
| `docs/decisions/` | le 26 assunzioni di dominio A-01..A-26 e gli ADR 0001–0006 |
| `docs/design/` | modello dei dati, contratti dei moduli (port, API pubbliche, eventi, superficie REST), specifica dello scaffold |
| `docs/plan/` | `tasks.json` (ogni task con owner, date, blocchi), `PLAN.md` e il suo PDF, `START-HERE.md`, milestone, team |
| `docs/guides/` | una guida personale per membro, con gli starter prompt per Claude Code |
| `docs/history/` | questo documento (introduzione a mano, il resto generato) |
| `scripts/` | script Node senza dipendenze: `validate-plan`, `deps` (gating), `create-issues` (sincronizzazione con GitHub), `directive`, `render-pdf`, `history` |
| `.github/` | `CODEOWNERS`, template di PR e issue, workflow |
| `backend/`, `frontend/`, `e2e/`, `docker/` | non ancora creati: arrivano dai task di scaffold |

# Come lavora il team

- **Branch.** `main` contiene solo i rilasci; `develop` è il branch di integrazione. Tutto il lavoro si fa su branch brevi (`feature/<task>-…`, `docs/…`, `fix/…`, `chore/…`) ed entra in `develop` con una pull request, mergiata con squash. La branch protection su `develop` e `main` richiede una PR, l'approvazione di un code owner e il check `plan`, vale anche per gli amministratori e vieta i force push.
- **Ownership.** `CODEOWNERS` assegna a ogni percorso un owner più un revisore di riferimento. Il codice condiviso e i contratti cambiano solo con una issue *contract-change* approvata da tutti e tre. Rotazione delle review: P1 ← P2, P2 ← P3, P3 ← P1, entro 48 ore.
- **Gating.** Un task può iniziare solo quando tutti i suoi blocchi sono DONE (issue chiusa da una PR mergiata). `npm run deps -- <TASK>` risponde READY o BLOCKED; un workflow mantiene allineate le label `status:ready` / `status:blocked` quando le issue si chiudono.
- **Registro di avanzamento.** Dopo ogni passo ogni membro aggiunge una voce in cima alla propria sezione di `PROGRESS.md`, in italiano, con data e ora, nello stesso commit del lavoro. È ciò che alimenta il registro cronologico.
- **Direttive.** Il coordinatore può assegnare istruzioni come issue GitHub con label `type:directive` (`npm run directive`); le sessioni dei membri le elencano all'avvio.

# Le fasi finora

*Questo riepilogo viene aggiornato dal coordinatore a ogni milestone; il resoconto dettagliato e sempre aggiornato è il registro cronologico che segue.*

**Fase 0 – Setup (17 novembre 2026, milestone M0, CONCLUSA).** Il repository è stato creato solo con documentazione e pianificazione, di proposito senza codice applicativo, perché il team potesse concordare requisiti, assunzioni e contratti prima di scrivere codice. In ordine: configurazione di base e registro di avanzamento; parafrasi dei requisiti, le 26 assunzioni e sei ADR; le bozze di design (modello dei dati, contratti dei moduli, eventi realtime) e la specifica dello scaffold; le regole di lavoro (`CLAUDE.md`, `CONTRIBUTING.md`, README, struttura INGSW, catalogo E2E); il piano leggibile da una macchina con i suoi script; il piano generale, le tre guide e i loro PDF; `CODEOWNERS`, template e i due workflow; infine la configurazione di GitHub (label, 9 milestone, una issue per task, la board, gli inviti ai collaboratori) e la branch protection.

**Fase 1 – Miglioramenti al passaggio di consegne (17 novembre 2026, PR #47, aperta).** Tre aggiunte dopo il setup: il task CLEANUP prima della release candidate, la pagina *Start here* per la prima settimana e le direttive del coordinatore.

**Fase 2 – Avvio dello Sprint 0 (dal 17 novembre 2026).** P3 ha preparato il computer fisso (Git, GitHub CLI, Node.js 22, Docker) e clonato il repository. Per avere tutti e tre i membri operativi dal primo giorno, lo scaffold del codice è stato diviso in tre parti parallele, una per membro (SCAFFOLD-BE, SCAFFOLD-FE, SCAFFOLD-E2E), integrate da SCAFFOLD; sono state create le issue #51–#53. È stato aggiunto questo documento, in italiano, perché ogni modifica resti spiegata e in ordine.

# Glossario

| Termine | Significato |
|---|---|
| Task / ID del task | un'unità di lavoro in `docs/plan/tasks.json` (es. `R01`, `SCAFFOLD-FE`), con una issue GitHub etichettata `task:<ID>` |
| Blocco (blocker) | un task che deve essere DONE prima che un altro possa iniziare (`blockedBy`) |
| Gating | la regola che impedisce di iniziare un task finché i suoi blocchi non sono chiusi |
| Milestone | un gruppo di task con una scadenza (M0–M8) |
| Code owner | i membri indicati da `CODEOWNERS` per un percorso; serve la loro approvazione per mergiare modifiche a quel percorso |
| Contract-change | la procedura per cambiare codice condiviso, contratti o assunzioni: issue, accordo di tutti e tre, PR revisionata dagli altri due |
| Port | un'interfaccia in `backend/src/shared/ports` che un modulo implementa e gli altri usano (Strategy + Dependency Injection), con un'implementazione di default sicura |
| Scaffold | lo scheletro del codice (cartelle, configurazioni, test di base) senza logica dei requisiti |
| Squash merge | una PR entra in `develop` come un solo commit |
