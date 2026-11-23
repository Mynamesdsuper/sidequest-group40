# SideQuest – Registro di avanzamento

Come usare questo file: vedi "Progress log rules" in `CLAUDE.md` (§9b). Le voci si scrivono **in italiano**.
Le voci più recenti vanno IN CIMA alla propria sezione. Non modificare mai le sezioni degli altri membri.
Ogni titolo di voce ha data **e ora** (`AAAA-MM-GG HH:MM`): il PDF della storia del progetto ordina le voci in base a quelle.

## Setup (sessione sul laptop)

### 2026-11-17 18:32 · SETUP · feat(scripts): direttive del coordinatore (`npm run directive`)
- **Cosa:** aggiunto `scripts/directive.mjs`: il coordinatore (P3) crea issue GitHub con label `type:directive` per P1, P2, P3 o tutti (titolo, testo, scadenza, task collegato, priorità; opzioni `--dry-run` e `--list`). `deps --mine Px` ora termina con l'elenco delle direttive aperte. Create le label `type:directive` e `priority:high`. `CLAUDE.md` (nuova sezione 3b) fa sì che la sessione Claude Code di ogni membro le elenchi e le rispetti; contano solo le issue scritte dal coordinatore, perché il repository è pubblico. Aggiornati guide, pagina Start-here, CONTRIBUTING e un template di issue; PDF rigenerati.
- **Perché:** Domenico vuole assegnare istruzioni a tutti dalla propria sessione. Le issue danno notifica, assegnazione, storico e un posto dove confermare, senza strumenti nuovi; il controllo sull'autore impedisce a estranei di iniettare istruzioni. Le direttive non possono scavalcare le regole di ownership, di gating o di sicurezza.
- **File:** `scripts/directive.mjs`, `scripts/deps.mjs`, `scripts/create-issues.mjs`, `package.json`, `CLAUDE.md`, `CONTRIBUTING.md`, `.github/ISSUE_TEMPLATE/directive.md`, `docs/guides/*`, `docs/plan/START-HERE.md`.
- **Come verificare:** `npm run directive -- --to P3 --title test --dry-run`; create e chiuse due issue di prova (#49, #50); `npm run directive -- --list P3` ha elencato la #50 (l'indice di ricerca di GitHub ha qualche secondo di ritardo).
- **Prossimi passi:** funziona per tutti solo dopo il merge della PR #47 (gli script e `CLAUDE.md` sono su quel branch).
- **Commit/PR:** PR #47.

### 2026-11-17 18:12 · SETUP · docs(plan): pagina Start-here (cosa fa ogni membro adesso) + PDF
- **Cosa:** aggiunti `docs/plan/START-HERE.md` e il suo PDF: le azioni di questa settimana per tutti (invito, strumenti, Starter prompt 1, review della PR #47, kickoff), i primi task e le date di P1, P2 e P3, l'agenda del kickoff (lunedì 23 novembre), le date chiave, le regole e i comandi. Collegata dal README.
- **Perché:** Domenico ha chiesto un breve documento di passaggio di consegne da dare a Vincenzo e Matteo, così che tutti e tre partano nell'ordine giusto.
- **File:** `docs/plan/START-HERE.md`, `docs/plan/SideQuest_Group40_Start_Here.pdf`, `README.md`.
- **Come verificare:** aprire il PDF (5 pagine); le date coincidono con `npm run deps -- --all`.
- **Prossimi passi:** merge della PR #47 dopo l'approvazione di un code owner.
- **Commit/PR:** PR #47.

### 2026-11-17 18:06 · CLEANUP · chore(plan): aggiunto il task CLEANUP prima di REL-RC
- **Cosa:** aggiunto il task `CLEANUP` (P3, 2027-02-28, milestone M7, bloccato da STABILIZE, DOC-TRACE, DOC-GIT) e reso `REL-RC` dipendente da esso. Rimuove dal repository finale le tracce di Claude Code: i file (`CLAUDE.md`, i riferimenti in README, CONTRIBUTING, piano, guide, template) e la storia (i trailer dei commit). Aggiornati `tasks.json`, `task-details.json`, `PLAN.md` (checklist di rilascio, rischi, grafo, Gantt, piano di P3), la guida P3 e i PDF.
- **Perché:** Domenico vuole consegnare un prodotto senza quelle tracce, ma il team ha bisogno di `CLAUDE.md` e degli starter prompt fino alla fine; inoltre riscrivere la storia richiede un force-push (togliendo temporaneamente la branch protection) e un nuovo clone da parte di tutti: quindi si fa una volta sola, tardi, dopo DOC-GIT (decisione: opzione A).
- **File:** `docs/plan/tasks.json`, `docs/plan/task-details.json`, `docs/plan/PLAN.md`, `docs/plan/*.pdf`, `docs/guides/P3-domenico-panaro.*`.
- **Come verificare:** `node scripts/validate-plan.mjs` → "Plan OK: 47 tasks, no cycles, 0 warning(s)"; `npm run deps -- REL-RC` elenca CLEANUP tra i blocchi.
- **Prossimi passi:** creare la issue su GitHub (`npm run issues:sync -- --refresh-bodies`) e ottenere l'approvazione di Vincenzo o Matteo per fare il merge di questa PR (branch protection).
- **Commit/PR:** PR #47.

### 2026-11-17 17:59 · SETUP · chore(repo): verifica finale e passaggio di consegne (sessione di setup CONCLUSA)
- **Cosa:** eseguiti i controlli del §13 del prompt di setup. Evidenze:
  1. Perimetro: clone pulito di `develop` in una cartella temporanea → `ls backend frontend e2e docker` = "No such file or directory" per tutte e quattro; `git ls-files | grep -E "\.ts$|ci\.yml|sonar\.yml|Dockerfile|docker-compose|\.env"` = vuoto; `.github/workflows` = `deps-labeler.yml`, `plan.yml`. Nello stesso clone `npm ci` → "found 0 vulnerabilities" e `npm run deps -- --mine P1` funziona (prossimo task S0-ASSUMPTIONS).
  2. `node scripts/validate-plan.mjs` → "Plan OK: 46 tasks, no cycles, 0 warning(s)".
  3. `node scripts/deps.mjs --all` → 1 DONE (SETUP), 5 READY (SCAFFOLD, S0-ASSUMPTIONS, S0-DATAMODEL, S0-API, S0-EVENTS), 40 BLOCKED con i loro blocchi (es. R01 ← SCAFFOLD); `deps R01` esce con codice 1.
  4. Workflow `plan`: completato con successo su `develop`; `deps-labeler` eseguito alla chiusura della issue SETUP: successo.
  5. `docs/design/scaffold-spec.md` generato copiando alla lettera il prompt: §4 + §4.1, §6.1–§6.3, §6.5, §7, estratto ci/sonar del §9 passo 7, checklist di SCAFFOLD.
  6. GitHub: 9 milestone, 77 label, 46 issue ciascuna con i link "Blocked by" e una label di stato, 2 inviti da collaboratore in attesa, `develop` branch di default, board https://github.com/users/Mynamesdsuper/projects/1. La branch protection è applicata DOPO questo commit (dopo nessuno può più fare push diretti, nemmeno l'admin), quindi la sua rilettura non è in questo registro: vedi il messaggio di consegna ed esegui `gh api repos/Mynamesdsuper/sidequest-group40/branches/develop/protection`.
  7. PDF rasterizzati e controllati: il PDF del piano contiene il grafo delle dipendenze (pagina orizzontale) e il diagramma di Gantt, entrambi renderizzati.
  8. `git log -p | grep -i -E "secret|password|token"` → solo testo di documentazione (regole, esempi); nessun segreto reale.
- **Perché:** §13 del prompt di setup: dimostrare che il setup è completo e nel perimetro prima di passare le consegne.
- **File:** solo `PROGRESS.md`.
- **Come verificare:** ripetere i comandi sopra su un clone pulito.
- **Prossimi passi:** (a) Matteo (`reverinn`) e Vincenzo (`vincenzolubrano05`) devono accettare gli inviti da collaboratore; (b) mandare loro i PDF delle guide; (c) call di kickoff dello Sprint 0 lunedì 23 novembre; (d) P3 inizia SCAFFOLD con lo Starter prompt 1 e poi il 2; (e) SonarCloud più avanti (SONAR-SETUP). Scostamenti: aggiunti `task-details.json` e `scripts/lib.mjs`; PLAN e guide generati da uno script usa-e-getta non versionato; `git push` ha richiesto un credential helper locale perché in cache c'era un secondo account GitHub; l'elemento della board per la issue #24 è collegato ma non compare in `gh project item-list` (un difetto di elencazione, non bloccante).
- **Commit/PR:** questo commit.

### 2026-11-17 17:59 · SETUP · chore(github): label, milestone, issue, collaboratori, board
- **Cosa:** push di `main`, creato `develop` (branch di default), impostazioni del repo (wiki disattivata, squash e merge commit attivi, rebase disattivato, cancellazione automatica dei branch, suggerimento di aggiornare i branch). `create-issues.mjs` ha creato 77 label, 9 milestone e 46 issue (idempotente: una seconda esecuzione non ha creato nulla), invitato i 2 collaboratori, creato la board pubblica del progetto con i campi Owner e Window end, chiuso la issue SETUP e sincronizzato le label di stato.
- **Perché:** il piano deve vivere su GitHub perché `deps.mjs` possa regolare l'avvio dei lavori (gating); le issue di Domenico sono già assegnate a lui, gli altri se le auto-assegnano con lo Starter prompt 1.
- **File:** nessuno nel repo (configurazione GitHub); `docs/plan/task-details.json` alimenta il testo delle issue.
- **Come verificare:** `npm run deps -- --all`; `gh issue list --label task:R01`.
- **Prossimi passi:** verifica finale e branch protection.
- **Commit/PR:** il commit di verifica sopra.

### 2026-11-17 17:42 · SETUP · ci: CODEOWNERS, template di PR e issue, workflow plan e deps-labeler
- **Cosa:** aggiunti `CODEOWNERS` (ogni percorso ha un owner più un revisore di riferimento; le eccezioni sui singoli file in fondo), il template delle PR, tre template di issue e solo due workflow: `plan.yml` (il job `plan` esegue `validate-plan.mjs`) e `deps-labeler.yml` (ricalcola `status:blocked`/`status:ready` quando una issue viene chiusa o riaperta).
- **Perché:** il controllo dell'ownership e la regola di gating devono funzionare dal primo giorno. `ci.yml` e `sonar.yml` NON sono stati creati: appartengono al task SCAFFOLD (regola di perimetro §0.1).
- **File:** `.github/CODEOWNERS`, `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/*`, `.github/workflows/plan.yml`, `.github/workflows/deps-labeler.yml`.
- **Come verificare:** `ls .github/workflows` mostra esattamente due file; dopo il push, l'esecuzione di `plan` è verde su GitHub.
- **Prossimi passi:** push di `main`, creazione di `develop`, impostazioni del repo, label, milestone, issue, collaboratori, board, protezione.
- **Commit/PR:** questo commit.

### 2026-11-17 17:42 · SETUP · docs(plan): piano generale, tre guide personali e i loro PDF
- **Cosa:** scritti `PLAN.md` (15 sezioni, compresi il grafo delle dipendenze e il diagramma di Gantt in Mermaid generati da `tasks.json`), le guide P1/P2/P3 (perimetro, preparazione del computer, piano passo per passo, consegne reciproche, flusso di lavoro, Definition of Done, tecnologie da saper spiegare, preparazione all'esame, i quattro starter prompt alla lettera) e prodotti 4 PDF con `render-pdf.mjs`.
- **Perché:** ogni membro ha bisogno di una guida personale autosufficiente; il PDF del piano è la visione d'insieme condivisa. Le parti derivate dai task (grafo, Gantt, piani per persona, consegne) sono state generate da uno script usa-e-getta tenuto fuori dal repo: se `tasks.json` cambia vanno modificate a mano (lo script non è versionato di proposito, perché il setup ammetteva solo quattro script).
- **File:** `docs/plan/PLAN.md`, `docs/plan/SideQuest_Group40_Master_Plan.pdf`, `docs/guides/P*-*.md`, `docs/guides/P*-*.pdf`.
- **Come verificare:** PDF controllati a vista rasterizzando le pagine: grafo su pagina orizzontale, Gantt leggibile, tabelle delle guide non tagliate. `npm run pdf:plan` e `npm run pdf:guides` rigenerano i PDF.
- **Prossimi passi:** configurazione GitHub (`.github/`), label, milestone, issue.
- **Commit/PR:** questo commit.

### 2026-11-17 17:42 · SETUP · chore(plan): tasks.json, team.json, milestone e script di pianificazione
- **Cosa:** aggiunti `docs/plan/tasks.json` (46 task, esattamente come nel prompt di setup §8.3), `team.json` (i login GitHub reali), `milestones.json`, `task-details.json` (checklist di accettazione, file e ID E2E per ogni task) e gli script `validate-plan.mjs`, `deps.mjs`, `create-issues.mjs`, `render-pdf.mjs` (+ `lib.mjs`), più il `package.json` della root (+ lockfile; solo dipendenze di sviluppo `marked`, `playwright`, `mermaid` per i PDF).
- **Perché:** la regola di gating ("si inizia un task solo quando i suoi blocchi sono mergiati") ha bisogno di dati leggibili da una macchina e di un controllore; gli script sono `.mjs` per Node e funzionano su Windows, macOS e Linux. `task-details.json` è un'aggiunta rispetto al prompt: tiene le lunghe checklist delle issue fuori dallo script.
- **File:** `docs/plan/*.json`, `scripts/*.mjs`, `package.json`, `package-lock.json`.
- **Come verificare:** `node scripts/validate-plan.mjs` stampa "Plan OK: 46 tasks, no cycles, 0 warning(s)"; una dipendenza temporanea SETUP→SCAFFOLD lo ha fatto fallire con "dependency cycle" e codice di uscita 1.
- **Prossimi passi:** PLAN.md, guide e PDF; poi label, milestone e issue su GitHub.
- **Commit/PR:** questo commit.

### 2026-11-17 17:42 · SETUP · docs(repo): CLAUDE.md, CONTRIBUTING, README, struttura INGSW, catalogo E2E
- **Cosa:** aggiunte le regole per Claude Code (`CLAUDE.md`, comprese le regole del registro di avanzamento), la guida a git, review e Definition of Done (`CONTRIBUTING.md`), un breve `README.md` (stato: solo setup, scaffold in attesa: task SCAFFOLD), `docs/ingsw/README.md` (i capitoli previsti con owner e scadenze, senza i file dei capitoli), il catalogo dei 12 test E2E e un template per le note delle riunioni.
- **Perché:** dicono a ogni membro (e a ogni sessione di Claude Code) cosa può toccare e come lavorare, senza alcun codice applicativo (regola di perimetro §0.1).
- **File:** `CLAUDE.md`, `CONTRIBUTING.md`, `README.md`, `docs/ingsw/README.md`, `docs/tecweb/e2e-catalogue.md`, `docs/meetings/TEMPLATE.md`.
- **Come verificare:** aprire i file; `grep -c "E2E-" docs/tecweb/e2e-catalogue.md`.
- **Prossimi passi:** dati del piano (`tasks.json`) e script di pianificazione.
- **Commit/PR:** questo commit.

### 2026-11-17 17:32 · SETUP · docs(design): modello dei dati, contratti dei moduli, eventi realtime, specifica dello scaffold
- **Cosa:** scritte le bozze PROPOSED `data-model.md` (tabelle + diagramma ER in Mermaid), `module-contracts.md` (port, API pubbliche, eventi di dominio, superficie REST prevista) e `realtime-events.md`. Generato `scaffold-spec.md` come copia alla lettera di §4/§4.1, §6.1–§6.3, §6.5, §7, della parte ci/sonar del §9 passo 7 e della checklist di SCAFFOLD del prompt di setup (con uno script usa-e-getta, perché la copia fosse esatta).
- **Perché:** i contratti si congelano nello Sprint 0; la specifica dello scaffold permette di fare il task SCAFFOLD più tardi senza che questa sessione sul laptop scriva codice (regola di perimetro §0.1). Le firme sono solo in Markdown: nessun file `.ts`.
- **File:** `docs/design/data-model.md`, `docs/design/module-contracts.md`, `docs/design/scaffold-spec.md`, `docs/api/realtime-events.md`.
- **Come verificare:** `grep -n "^### 6\.\|^### 7\." docs/design/scaffold-spec.md`; `find . -name "*.ts"` non restituisce nulla.
- **Prossimi passi:** documenti della root (CLAUDE.md, CONTRIBUTING, README), poi i file del piano.
- **Commit/PR:** questo commit.

### 2026-11-17 17:31 · SETUP · docs(reference): requisiti, assunzioni A-01..A-26, ADR 0001-0006
- **Cosa:** scritte la parafrasi dei requisiti (R01–R12 con owner e ID dei task), le 26 assunzioni di dominio (tutte PROPOSED) e sei ADR brevi.
- **Perché:** sono l'unica fonte di verità su cui i tre membri costruiranno; lo Sprint 0 le ratifica (task S0-ASSUMPTIONS). L'ADR 0006 registra la regola di allineamento al corso (di default gli strumenti visti a lezione, altrimenti una motivazione scritta).
- **File:** `docs/reference/requirements.md`, `docs/decisions/assumptions.md`, `docs/decisions/adr/0001..0006-*.md`.
- **Come verificare:** `ls docs/decisions/adr` mostra sei file; `grep -c "^| A-" docs/decisions/assumptions.md` stampa 26.
- **Prossimi passi:** bozze di design (modello dei dati, contratti dei moduli, eventi realtime) e specifica dello scaffold.
- **Commit/PR:** questo commit.

### 2026-11-17 17:29 · SETUP · chore(repo): creazione del repository e file di configurazione di base
- **Cosa:** creato il repository pubblico `Mynamesdsuper/sidequest-group40`, clonato in locale, rinominato il branch iniziale in `main`, aggiunti `.gitignore`, `.gitattributes`, `.editorconfig`, questo registro e una copia del prompt di setup in `docs/plan/setup-prompt.md`.
- **Perché:** passo 1 del setup (vedi `docs/plan/setup-prompt.md` §0.1 e §9). La sessione è solo documentazione e pianificazione: nessun codice applicativo (regola di perimetro §0.1). I fine riga LF sono forzati per lavorare su sistemi diversi.
- **File:** `.gitignore`, `.gitattributes`, `.editorconfig`, `PROGRESS.md`, `docs/plan/setup-prompt.md`.
- **Come verificare:** `git log --oneline` mostra il commit; `gh repo view Mynamesdsuper/sidequest-group40`.
- **Prossimi passi:** documenti di riferimento (requisiti, assunzioni, ADR), poi documenti di design.
- **Commit/PR:** primo commit su `main`.

## P1 – Vincenzo Pio Lubrano

## P2 – Matteo Marino

### 2026-11-19 13:56 · SCAFFOLD-E2E · DONE: scaffold e2e mergiato in develop
- **Cosa:** SCAFFOLD-E2E chiuso. La PR #59 è stata mergiata in `develop` (squash `c233d2d`) dopo la #60 del frontend; la issue #53 è stata chiusa a mano.
- **Perché:** nel corpo della #59 c'era `Closes #<53>` con le parentesi angolari, quindi GitHub non ha collegato la issue e non l'ha chiusa al merge (il task risultava ancora READY in `npm run deps`). Da ora nei template si scrive `Closes #53`, senza parentesi.
- **File:** `PROGRESS.md`.
- **Come verificare:** `gh pr view 59` → MERGED; `gh issue view 53` → CLOSED; `npm run deps -- --mine P2`.
- **Prossimi passi:** S0-EVENTS (congelare eventi di dominio, eventi realtime e port), dal 23/11.
- **Commit/PR:** #59 (merge `c233d2d`).

### 2026-11-19 12:43 · SCAFFOLD-E2E · test(e2e): smoke test tutto verde e stack demo provato con backend e frontend reali
- **Cosa:** branch ribasato su `develop` (che contiene SCAFFOLD-BE, #57). In una copia di lavoro temporanea, unita al branch di Vincenzo `chore/scaffold-frontend` (PR #60, non ancora mergiata), ho eseguito l'intera suite: 6/6 verdi (health, home "backend ok", orologio; desktop e mobile). Lo stack demo parte con tutti e tre i container healthy: `/health` risponde `ok`/`up`, i deep link della SPA (`/missions`) danno 200 da nginx, i 7 seed vengono eseguiti, `POST /__test__/reset` dà 404 (il router di test non è esposto in demo).
- **Perché:** erano i due controlli rimasti in sospeso nella voce precedente, in attesa del frontend. Nessun file del codice cambia: le fixture e la configurazione combaciano già con quanto fatto da P1 e P3. Il DB dei test è stato avviato sulla porta 5433, perché sulla 5432 di questo PC gira un PostgreSQL locale (lo prevede già `DB_PORT` in `.env.example`).
- **File:** `PROGRESS.md`.
- **Come verificare:** con il frontend di #60 presente: `docker compose up -d db`, poi `cd e2e && npx playwright test` → 6 passed; `docker compose -f docker-compose.demo.yml up -d --build --wait` → 3 container healthy, http://localhost:4200 mostra "backend ok · database up".
- **Prossimi passi:** mergiare questa PR dopo la #60, altrimenti su `develop` i 2 test della home fallirebbero (manca il frontend); review di Domenico.
- **Commit/PR:** #59.

### 2026-11-18 18:15 · SCAFFOLD-E2E · fix(e2e): orologio ripristinato anche se il test fallisce, stack demo solo in locale
- **Cosa:** nello smoke test l'orologio del server torna a 0 in un `finally`; in `docker-compose.demo.yml` le porte di backend e frontend sono pubblicate solo su `127.0.0.1`.
- **Perché:** emerso dalla review del commit precedente. Se un controllo falliva dopo lo spostamento a +1h, tutti i test successivi vedevano il server avanti di un'ora (fallimenti a catena, gravi quando arriveranno i test del timer di R04). Il `TOKEN_SECRET` di default della demo è nel repo pubblico: con le porte aperte su tutta la rete (es. Wi-Fi dell'università) chiunque potrebbe firmare token validi.
- **File:** `e2e/tests/smoke.spec.ts`, `docker-compose.demo.yml`.
- **Come verificare:** `cd e2e && npx tsc --noEmit`; `docker compose -f docker-compose.demo.yml config` mostra `host_ip: 127.0.0.1` sulle due porte.
- **Prossimi passi:** invariati (rebase dopo SCAFFOLD-BE e SCAFFOLD-FE, smoke test verde, prova dello stack demo, PR).
- **Commit/PR:** da aggiungere.

### 2026-11-18 17:30 · SCAFFOLD-E2E · test(e2e): Playwright, fixture, smoke test e stack demo
- **Cosa:** creata la cartella `e2e/` (Playwright con i progetti `desktop-chromium` 1280×800 e `mobile-chromium` 390×844, `webServer` per backend in `NODE_ENV=test` con `db:reset` e frontend dev server, `globalSetup` che chiama `POST /api/v1/__test__/reset`), le fixture `api`, `auth` (stub `loginAs`, `TODO(R01, P1)`), `clock` (`setServerClockOffset`), `users` (account demo §7.6), `tests/smoke.spec.ts`; aggiunto `docker-compose.demo.yml` (db + backend + frontend).
- **Perché:** è la parte E2E dello scaffold (`docs/design/scaffold-spec.md` §7.3–§7.4, issue #53). Endpoint, variabili e porte sono presi dal branch `chore/scaffold-backend` di P3, così combaciano. I test girano con un solo worker perché condividono il DB di test. Lo stack demo ha un nome di progetto e un volume propri (non tocca il DB di sviluppo) e lancia anche i seed, altrimenti gli account demo non esisterebbero.
- **File:** `e2e/`, `docker-compose.demo.yml`.
- **Come verificare:** `cd e2e && npm ci && npx tsc --noEmit && npx playwright test --list` (6 test). Contro il backend di `chore/scaffold-backend` in `NODE_ENV=test`: 4/6 verdi (health, reset, orologio, su desktop e mobile); i 2 test della home attendono il frontend (SCAFFOLD-FE) e `npx playwright install chromium`.
- **Prossimi passi:** rebase dopo il merge di SCAFFOLD-BE e SCAFFOLD-FE, smoke test tutto verde, `docker compose -f docker-compose.demo.yml up --build` (da verificare: il Dockerfile del frontend deve servire nginx sulla porta 80), poi PR `chore/scaffold-e2e` → `develop` con review di Domenico.
- **Commit/PR:** da aggiungere.

## P3 – Domenico Panaro

### 2026-11-23 13:20 · SCAFFOLD · docs(plan): piano, Start here e guide personali aggiornati alla fine dello scaffold
- **Cosa:** tutti i documenti globali e personali raccontano ora lo stato reale dopo lo scaffold:
  - `tasks.json`: SCAFFOLD-FE passa a owner P3 (preso in carico il 19/11); label della issue #52 aggiornata (`owner:P3-domenico`); `npm run deps -- --mine P1/P3` lo mostrano al posto giusto.
  - `PLAN.md`: riga di stato, scadenze dello scaffold segnate come fatte, tabella del team, Gantt (SCAFFOLD-FE nella sezione P3, i task finiti segnati `done`), piano per persona (SCAFFOLD-FE spostato da P1 a P3 con la nota, i task finiti marcati DONE con la PR), struttura del repository senza i segni "[SCAFFOLD] non esiste ancora", "How to get started".
  - `START-HERE.md`: riscritte le sezioni 1–4 sulla settimana 23–29 novembre (preparare il computer con `setup:dev`, verbale del kickoff, review, chi fa cosa fino al 6/12, date).
  - Le tre guide: un riquadro "Status on 23 Nov" in cima con i prossimi task di ognuno; riga "Scaffold part" della tabella iniziale, piano passo per passo (P1 senza SCAFFOLD-FE, P3 con SCAFFOLD-FE), tabelle delle dipendenze con "done", lo starter prompt 1 con i primi task giusti; nella guida P3 la nota da coordinatore sullo scaffold racconta com'è andata.
  - Rigenerati i 5 PDF (Master Plan, Start here, tre guide).
- **Perché:** lo scaffold è chiuso e stasera parte la fase successiva: chi apre il piano, la guida o il PDF deve trovare lo stato vero e i propri prossimi task, non il piano del 17/11. Registrare SCAFFOLD-FE sotto P3 rende corretti `npm run deps`, la storia del progetto e l'analisi Git (DOC-GIT).
- **File:** `docs/plan/tasks.json`, `docs/plan/PLAN.md`, `docs/plan/START-HERE.md`, `docs/guides/P1-vincenzo-lubrano.md`, `docs/guides/P2-matteo-marino.md`, `docs/guides/P3-domenico-panaro.md`, i 5 PDF, `PROGRESS.md`.
- **Come verificare:** `npm run plan:validate` → "Plan OK"; `npm run deps -- --mine P3` → DONE: SETUP, SCAFFOLD-BE, SCAFFOLD-FE, SCAFFOLD; `npm run deps -- --mine P1` → nessun task DONE, NEXT S0-ASSUMPTIONS; aprire i PDF.
- **Prossimi passi:** approvazione di Vincenzo e Matteo (piano e guide sono di tutti); la fase successiva (Sprint 0) parte stasera.
- **Commit/PR:** PR #71.

### 2026-11-23 12:40 · SCAFFOLD · docs(history): chiusura dello scaffold nel registro e nella storia del progetto
- **Cosa:** aggiunte le voci DONE mancanti di SCAFFOLD-FE (#60) e SCAFFOLD (#63), con l'ora del merge; recuperate 4 voci del 18/11 (DONE di SCAFFOLD-BE, revisione del modello dei dati, osservazioni sulla #4, direttiva #58) rimaste su un branch locale mai pushato; in `docs/history/overview.md` la Fase 1 è segnata conclusa ed è stata aggiunta la "Fase 3 – Scaffold del codice". Eliminati i branch locali già mergiati (`chore/scaffold`, `chore/scaffold-frontend`, `docs/kickoff-2026-11-23`) e quello vecchio (`docs/s0-datamodel-review`, dopo averne recuperato le voci); i branch remoti erano già stati cancellati al merge.
- **Perché:** la regola §9b vuole che l'ultima voce di ogni task dica DONE con la PR mergiata, e il coordinatore aggiorna "Le fasi finora" a ogni traguardo: senza questo passo la storia del progetto (PDF) non racconterebbe la chiusura dello scaffold. Le voci recuperate sono storia vera del 18/11 e mancavano dal registro.
- **File:** `PROGRESS.md`, `docs/history/overview.md`.
- **Come verificare:** `node --test scripts/history.test.mjs` → 2 test verdi; nella sezione P3 di `PROGRESS.md` le voci sono in ordine di data e ora; `npm run history` mette le nuove voci al loro posto nel registro cronologico.
- **Prossimi passi:** merge di #68 e #70; poi le decisioni del kickoff (S0-DATAMODEL, S0-API) e SONAR-SETUP.
- **Commit/PR:** `722e9ec`, PR #71.

### 2026-11-23 12:40 · CLEANUP · chore(repo): prima pulizia delle tracce di Claude (dopo lo scaffold)
- **Cosa:** inventario di tutte le menzioni di Claude nel repository (104 in 15 file) e rimozione di quelle che non servono più al lavoro quotidiano:
  - eliminato `docs/plan/setup-prompt.md`, il prompt con cui è stato creato il repository, e tolti i suoi rimandi (`CLAUDE.md` §10, `PLAN.md`, `scaffold-spec.md`, `task-details.json`);
  - tolta da `scaffold-spec.md` la nota residua del prompt ("SPECIFICATION ONLY in this session") e riscritta l'intestazione: ora dice che è la specifica del task SCAFFOLD, implementata dalle PR #57, #60, #59, #63;
  - riformulate senza Claude due frasi di `CONTRIBUTING.md` (direttive) e `PLAN.md` (rischi);
  - rigenerato il PDF del Master Plan (`npm run pdf:plan`).
  Restano 84 menzioni (una, il commento di `scripts/directive.mjs`, va nella PR #68 per non creare conflitti), tutte necessarie fino al CLEANUP di febbraio.
- **Perché:** decisione del coordinatore: alla fine dello scaffold si tolgono le tracce di Claude che non servono, senza aspettare il CLEANUP (#48). Restano di proposito: `CLAUDE.md`, le guide e i loro PDF (le sessioni li usano ogni giorno), i rimandi al file `CLAUDE.md` (altrimenti link rotti), l'onboarding di `START-HERE.md`, i dati del task CLEANUP, le voci passate di `PROGRESS.md` (riscriverle falserebbe il registro), i messaggi di commit e i testi su GitHub (si sistemano con la riscrittura della history al CLEANUP).
- **File:** `docs/plan/setup-prompt.md` (eliminato), `CLAUDE.md`, `CONTRIBUTING.md`, `docs/design/scaffold-spec.md`, `docs/plan/PLAN.md`, `docs/plan/SideQuest_Group40_Master_Plan.pdf`, `docs/plan/task-details.json`, `PROGRESS.md`.
- **Come verificare:** `git grep -i -c claude` → 84 menzioni (erano 104); `git grep -i setup-prompt` trova solo le liste del task CLEANUP; `npm run plan:validate` → "Plan OK".
- **Prossimi passi:** accordo di Vincenzo e Matteo (file condivisi, contract-change) e merge; il resto al CLEANUP (#48).
- **Commit/PR:** `49ca239`, PR #70 (contract-change #69).


### 2026-11-23 12:04 · SCAFFOLD · fix(shared): quattro correzioni dopo la revisione dello scaffold
- **Cosa:** revisione completa dello scaffold su `develop` (backend, frontend, e2e, CI, script) e correzione dei 4 problemi concreti trovati:
  1. **Nomi delle migrazioni** (`shared/db/migrator.ts`): Umzug registrava in `SequelizeMeta` il nome del file *con l'estensione*, quindi `npm run db:migrate` (tsx, `.ts`) e l'immagine Docker (`node dist`, `.js`) vedevano due migrazioni diverse e la stessa migrazione poteva ripartire. Ora il nome è registrato senza estensione (`resolve` di Umzug).
  2. **Date impossibili** (`v.isoDate()`): `new Date('2026-02-31')` in Node diventa il 3 marzo senza errore; ora la data scritta viene controllata sul calendario e una data impossibile dà 400 `VALIDATION_ERROR`.
  3. **Direttive su Windows** (`scripts/directive.mjs`, `CLAUDE.md` §3b): npm passa gli argomenti attraverso `cmd.exe`, che tronca il comando al primo a capo dentro `--body` (così il 21/11 la #65 è stata creata troncata e senza `--dry-run`). Nuova opzione `--body-file`, da usare per i testi su più righe.
  4. **Errori del client** (`shared/errors/error-handler.ts`): gli errori 4xx di `express.json()` diversi da JSON non valido e body troppo grande (per esempio 415 charset non supportato) diventavano 500 `INTERNAL_ERROR`; ora mantengono il loro status con il codice `BAD_REQUEST`, solo se marcati `expose` (messaggio sicuro da mostrare).
- **Perché:** sono difetti della base condivisa che tutti useranno da R01 in poi; il primo costa sempre di più col tempo, perché i nomi registrati nei database andrebbero poi corretti a mano. Le altre 4 osservazioni minori della revisione (es. `v.number()` accetta `"Infinity"`, environment Angular duplicati) sono rimandate. File condivisi: contract-change.
- **File:** `backend/src/shared/db/migrator.ts`, `backend/src/shared/validation/validator.ts`, `backend/src/shared/errors/error-handler.ts`, `backend/tests/`, `scripts/directive.mjs`, `CLAUDE.md`, `PROGRESS.md`.
- **Come verificare:** in `backend/`: `npm run lint`, `npm run typecheck`, `npm test` (38 unit + 13 integration verdi, con i nuovi casi: `2026-02-31` rifiutata, 415 sul charset, migrazione registrata senza estensione), `npm run build`. Poi `npm run db:migrate` e `node dist/db/cli.js migrate` rispondono entrambi "none (up to date)". Nota: su un database già migrato la baseline riparte una volta sola (è `CREATE EXTENSION IF NOT EXISTS`, innocua) e la vecchia riga `…baseline.ts` resta in `SequelizeMeta` senza effetti. Direttive: `npm run directive -- --to P2 --title t --body-file file.md --dry-run` stampa il body intero.
- **Prossimi passi:** approvazione di Vincenzo e Matteo (file condivisi); poi la pulizia delle tracce di Claude nei file che non servono più alle sessioni.
- **Commit/PR:** `0ec375c`, PR #68 (contract-change #67).

### 2026-11-23 11:15 · SCAFFOLD · DONE: integrazione dello scaffold mergiata su `develop`
- **Cosa:** la PR #63 (`chore/scaffold`) è stata approvata da Matteo (P2) e mergiata con squash su `develop` (`dacfcbd`); la issue #2 è chiusa. Subito dopo la branch protection di `develop` e `main` è stata portata a richiedere i check `plan`, `backend`, `frontend` ed `e2e` (letta di nuovo con `gh api`), e le PR #64 e #61, aperte prima della CI, sono state ribasate su `develop`. Con questo lo scaffold è completo: SCAFFOLD-BE (#57), SCAFFOLD-FE (#60), SCAFFOLD-E2E (#59), SCAFFOLD (#63).
- **Perché:** la CI esisteva solo dopo il merge della #63: prima la branch protection poteva richiedere soltanto `plan`. Da ora nessuna PR entra in `develop` o `main` senza backend, frontend ed e2e verdi.
- **File:** nessuno in questo passo (registro del merge e della configurazione di GitHub).
- **Come verificare:** `gh api repos/Mynamesdsuper/sidequest-group40/branches/develop/protection -q .required_status_checks.contexts` → `plan`, `backend`, `frontend`, `e2e` (uguale per `main`); `npm run deps -- SCAFFOLD` → DONE.
- **Prossimi passi:** SONAR-SETUP (ora READY); le correzioni della revisione (#68) e la prima pulizia (#70) aspettano l'approvazione.
- **Commit/PR:** #63 (`dacfcbd`).


### 2026-11-21 01:22 · S0-DATAMODEL · docs(meetings): agenda del kickoff dello Sprint 0 (lun 23/11)
- **Cosa:** scritto `docs/meetings/2026-11-23.md` (45 minuti, 5 punti):
  - lo stato dello scaffold;
  - le assunzioni da discutere: A-11, A-20, A-12, A-17, A-19; tutte le altre si ratificano come sono;
  - le 8 decisioni principali sul modello dei dati di #4: `onDelete`, `CHECK` al posto degli enum, unicità su `lower()`, chiave di `MissionAccess`, `maxTeamSize`, rientro in squadra, regola A-20, `seq`;
  - le tabelle REST e le 6 modifiche alle API pubbliche della #61, più S0-EVENTS;
  - le date fino al 6/12 e le azioni con responsabile e scadenza.

  Le sezioni "Decisions" e lo slot della riunione settimanale si compilano durante la call.
- **Perché:** il kickoff deve solo chiudere i punti aperti: chi legge prima #4 e #61 commenta lì, e in call si decide il resto. Così entro il 29/11 S0-ASSUMPTIONS, S0-DATAMODEL, S0-API e S0-EVENTS possono essere congelati e R01 parte il 25/11.
- **File:** `docs/meetings/2026-11-23.md`, `PROGRESS.md`.
- **Come verificare:** aprire il file; i riferimenti puntano a #4, #61 e #63.
- **Prossimi passi:** condurre la call, compilare "Decisions" e lo slot settimanale, poi aggiornare `data-model.md` (S0-DATAMODEL) e la #61 (S0-API).
- **Commit/PR:** PR #64.

### 2026-11-21 01:07 · SCAFFOLD · ci: integrazione dello scaffold (CI, Sonar, setup:dev, README)
- **Cosa:** iniziato SCAFFOLD (#2, branch `chore/scaffold`), sbloccato dal merge di #60 e #59 il 19/11.
  - `.github/workflows/ci.yml` con i quattro job dai nomi fissi:
    - `backend`: Postgres 17 come servizio, lint, typecheck, migrazioni, Jest con copertura (artefatto), build;
    - `frontend`: lint, typecheck, unit test, test della regola `feature-boundaries`, build di produzione;
    - `e2e`: parte dopo i due precedenti; Postgres, Chromium, Playwright, report come artefatto;
    - `plan`.
  - Cancellato `plan.yml`: il job `plan` ora vive in `ci.yml`, con lo stesso nome, quindi il controllo obbligatorio `plan` della branch protection continua a funzionare.
  - `sonar.yml`: test del backend con copertura, poi la scansione SonarCloud. Senza il secret `SONAR_TOKEN` stampa "SonarCloud not configured yet (task SONAR-SETUP)" e termina con successo.
  - `npm run setup:dev` (`scripts/setup-dev.mjs`, multipiattaforma): installa backend, frontend ed e2e, scarica Chromium e crea i `.env` dai modelli senza mai sovrascriverli. Aggiunto anche `npm run test:all`.
  - README riscritto secondo §7.7: quick start, configurazione, account demo, test, stack demo, API, struttura. Riga di stato "scaffold ready" anche in `CLAUDE.md`.
- **Perché:** checklist di SCAFFOLD (§8.3 e §9 passo 7 della specifica). È l'ultimo blocco prima dei requisiti: con il merge R01 di Vincenzo diventa READY. Scelte da saper spiegare:
  - CI su ogni PR verso `develop`/`main`, con un database usa-e-getta nel container di servizio;
  - un nuovo push annulla l'esecuzione vecchia (`concurrency`);
  - lo script di setup è in Node e non in bash, così funziona anche su Windows;
  - `setup:dev` è un piccolo file nuovo in `scripts/`, perché il comando in linea nel `package.json` sarebbe stato illeggibile.
- **Correzione dopo la prima esecuzione in CI:** il job `e2e` falliva con "Port 3000 is already in use": `ng serve` prende la porta dalla variabile `PORT` (che in CI vale 3000 per il backend) anche se si passa `--port`. In `e2e/playwright.config.ts` il server del frontend ora riceve `PORT=4200`. Riprodotto e verificato in locale con `PORT=3000 CI=1 npx playwright test` (6 test verdi).
- **File:** `.github/workflows/ci.yml`, `.github/workflows/sonar.yml`, `.github/workflows/plan.yml` (cancellato), `scripts/setup-dev.mjs`, `package.json`, `README.md`, `CLAUDE.md`, `e2e/playwright.config.ts`, `PROGRESS.md`.
- **Come verificare:** tutta la catena in locale, verde:
  1. `npm run setup:dev`;
  2. `docker compose up -d db`, poi `db:migrate` e `db:seed`;
  3. backend: lint, typecheck, `npm test` (49 test);
  4. frontend: lint, `npm test` (12 test), build;
  5. `cd e2e && npx playwright test` (6 test, desktop e mobile);
  6. `docker compose -f docker-compose.demo.yml up --build`: health `db: up`, frontend 200.

  Sulla PR: i job `backend`, `frontend`, `e2e`, `plan` verdi.
- **Prossimi passi:** approvazione di Vincenzo o Matteo e merge; poi la branch protection di `develop` e `main` deve richiedere `backend`, `frontend`, `e2e`, `plan` (da rileggere con `gh api`); poi SONAR-SETUP.
- **Commit/PR:** `b237a11` + correzione, PR #63.

### 2026-11-19 13:47 · SCAFFOLD-FE · DONE: scaffold del frontend mergiato su `develop`
- **Cosa:** la PR #60 (`chore/scaffold-frontend`) è stata approvata da Vincenzo (P1) e Matteo (P2) e mergiata con squash su `develop` (`bbfaefe`); la issue #52 è chiusa. Voce scritta il 23/11, alla chiusura dello scaffold, con l'ora del merge.
- **Perché:** con il frontend su `develop`, Matteo ha potuto ribasare la #59 (SCAFFOLD-E2E) e far passare lo smoke test "backend ok · database up", e l'integrazione SCAFFOLD è diventata possibile.
- **File:** nessuno in questo passo (registro del merge).
- **Come verificare:** `git log --oneline -1 bbfaefe` su `develop`; `npm run deps -- SCAFFOLD-FE` → DONE.
- **Prossimi passi:** SCAFFOLD (integrazione).
- **Commit/PR:** #60 (`bbfaefe`).

### 2026-11-19 00:55 · SCAFFOLD-FE · feat(frontend): scaffold del frontend Angular (fatto da P3 al posto di P1)
- **Cosa:** creato `frontend/` con Angular 22 (standalone, signals, SCSS, routing, senza SSR, nessuna libreria di componenti UI), solo infrastruttura:
  - `src/styles/`: token di design come custom properties (colori, spaziature, raggi, font con `clamp()`), tema chiaro/scuro con `prefers-color-scheme`, reset, utility flex/grid con `gap`, classi `.btn` e `.card` (le card usano le container query).
  - `core/api`: `apiUrl()`, `Page<T>`, `ApiErrorBody`, `errorInterceptor` che trasforma ogni errore HTTP in un toast leggibile (anche l'errore di rete) e lo rilancia; con `SKIP_ERROR_TOAST` una pagina gestisce da sola i propri errori (es. gli errori di campo di un form). `HttpClient` usa `fetch()` (`withFetch`).
  - `core/layout`: shell con barra in alto, navigazione laterale che sotto i 48rem diventa un drawer (`aria-expanded`, Esc e click sullo sfondo chiudono), link "salta al contenuto", footer con il credito OpenStreetMap solo sulle rotte con `data.showsMap`, spazio vuoto per la campanella delle notifiche (P2); home page che chiama `GET /health` e mostra "backend ok · database up"; pagina 404.
  - `core/auth` (P1) e `core/realtime` (P2): stub con `TODO(R01, P1)` e `TODO(R06A, P2)`; le guardie lasciano passare tutto finché R01 non le sostituisce.
  - `shared/ui`: page header, empty state, spinner, confirm dialog (elemento nativo `<dialog>`), toast service + container (live region), error banner, form field, pagina segnaposto.
  - 12 feature (`auth`, `profile`, `admin`, `missions`, `explore`, `participation`, `waitlist`, `notifications`, `dashboard`, `invitations`, `teams`, `team-play`), ognuna con `<feature>.routes.ts` caricato in lazy da `app.routes.ts` e `public-api.ts`; ogni pagina mostra "<Feature> — coming in Rxx (owner Px)".
  - Regola ESLint scritta a mano `local/feature-boundaries` (una feature importa da un'altra solo il suo `public-api.ts`), con test `RuleTester` (`npm run test:lint-rules`); Leaflet (CSS in `angular.json`, icone copiate in `assets/leaflet/`), `socket.io-client`, angular-eslint + Prettier con le stesse convenzioni del backend, TypeScript `strict`.
  - `Dockerfile` (build, poi nginx con il fallback SPA `try_files … /index.html`), `nginx.conf`, `README.md` del frontend.
- **Perché:** il 19/11 Vincenzo non aveva ancora iniziato SCAFFOLD-FE (#52, direttiva #58), che è sul percorso critico: lo smoke test della PR #59 di Matteo ("la home mostra backend ok") e l'integrazione SCAFFOLD (23–24/11) dipendono dal frontend. Decisione del coordinatore: lo scaffold lo fa P3, Vincenzo parte direttamente da R01 e dalle sue cartelle (`core/auth`, feature `auth`/`profile`/`admin`/`missions`/`explore`), che qui contengono solo segnaposto. Scelte da saper spiegare: le pagine segnaposto usano un solo componente condiviso che legge i dati della rotta (12 componenti uguali sarebbero codice da buttare); `app.routes.ts` si scrive una volta e ogni feature aggiunge pagine solo nel proprio `*.routes.ts`, così le PR dei tre membri non si toccano; l'interceptor degli errori sta in `core/api` perché il formato degli errori è un contratto comune del backend.
- **File:** `frontend/`, `PROGRESS.md`.
- **Come verificare:** in `frontend/`: `npm ci`, `npm run lint` (tutto passa), `npm run typecheck`, `npm test` (4 file, 12 test verdi), `npm run test:lint-rules` (10 casi verdi), `npm run build` (nessun avviso di budget). Con DB e backend avviati, `npm start` e http://localhost:4200 mostra "backend ok · database up"; verificato con Chrome a 1280 px e 360 px (nessuno scroll orizzontale, drawer funzionante, 404, credito OSM su `/explore`, nessun errore in console). `docker build frontend` produce l'immagine; nginx risponde con `index.html` anche su `/teams/42`.
- **Prossimi passi:** approvazione della PR #60 (Matteo) e merge; poi Matteo ribasa la #59 e lo smoke test può passare; poi SCAFFOLD (integrazione: `ci.yml`, `sonar.yml`, `setup:dev`). Fatto su GitHub: #52 assegnata a P3 e messa in `status:in-progress`; direttiva #58 chiusa con un commento a Vincenzo (prossimi passi: S0-ASSUMPTIONS, S0-API, poi R01).
- **Commit/PR:** `dab3382`, PR #60.

### 2026-11-18 17:28 · S0-DATAMODEL · docs(design): osservazioni pubblicate nella issue #4
- **Cosa:** pubblicate come commento nella #4 le osservazioni della revisione del modello dei dati, in inglese e raggruppate per owner: trasversali G1–G6, P1 U1–MA1, P2 P1–W1, P3 I1–TPE1. Vincenzo e Matteo sono menzionati sulle loro sezioni.
- **Perché:** così tutti le leggono prima del kickoff dello Sprint 0 (lun 23 nov) e possono rispondere per iscritto; la discussione resta tracciata nella issue del task. `data-model.md` non si modifica finché non c'è l'accordo, perché è un file condiviso.
- **File:** nessuno (commento su GitHub).
- **Come verificare:** https://github.com/Mynamesdsuper/sidequest-group40/issues/4#issuecomment-6984694767
- **Prossimi passi:** raccogliere le risposte, decidere al kickoff, poi aggiornare `data-model.md` e il diagramma ER e marcarlo FROZEN.
- **Commit/PR:** nessuno (voce scritta il 18/11 su un branch locale mai pushato, recuperata il 23/11 nella PR di chiusura dello scaffold).

### 2026-11-18 17:26 · SCAFFOLD · chore(github): direttiva a Vincenzo per SCAFFOLD-FE
- **Cosa:** creata la direttiva #58 (`type:directive`, `priority:high`, scadenza 2026-11-22) a Vincenzo (P1): assegnarsi la #52, metterla in `status:in-progress`, lavorare su `chore/scaffold-frontend` e aprire la PR verso `develop` entro domenica 22 novembre (approvazione di Matteo e Domenico).
- **Perché:** il 18/11 SCAFFOLD-FE non aveva né branch né PR né assegnatario, ed è il percorso critico: lo smoke test di SCAFFOLD-E2E e l'integrazione SCAFFOLD (23–24 nov) lo aspettano. A Matteo nessuna direttiva, perché sta già lavorando a SCAFFOLD-E2E.
- **File:** nessuno (issue su GitHub).
- **Come verificare:** `npm run directive -- --list P1`, oppure la issue #58.
- **Prossimi passi:** controllare la conferma di Vincenzo nella #58 alla prossima sessione.
- **Commit/PR:** nessuno (voce scritta il 18/11 su un branch locale mai pushato, recuperata il 23/11 nella PR di chiusura dello scaffold).

### 2026-11-18 17:20 · S0-DATAMODEL · docs(design): revisione del modello dei dati rispetto alle assunzioni
- **Cosa:** iniziato S0-DATAMODEL (#4, branch `docs/s0-datamodel-review`, issue a `status:in-progress`). Confrontato `docs/design/data-model.md` campo per campo con A-05..A-21, `module-contracts.md`, ADR 0005 e i requisiti: vincoli, indici, enum, nullabilità, relazioni. Prodotta una lista di osservazioni raggruppate per owner (trasversali, P1, P2, P3), ognuna con una modifica proposta.
- **Perché:** il modello va congelato prima che R01–R12 scrivano le migrazioni; un errore trovato ora costa una riga di Markdown, dopo costa una contract-change e una migrazione. Punti principali: `MissionAccess` con PK senza `source` non regge `revoke(…, source)`; `TeamMembership` con PK `(teamId, userId)` impedisce di rientrare in una squadra; `timeLimitSec` per le missioni ORDINARY è ambiguo tra A-11 e il modello; mancano i vincoli CHECK "esattamente uno tra userId e teamId", gli indici sulle FK e quelli per i sweeper (A-08, A-18); la regola "non partecipare due volte, da solo e in squadra" (A-20) non è esprimibile con un indice e va fatta nel servizio sotto il lock della missione.
- **File:** nessuno ancora: `data-model.md` è condiviso e si modifica solo dopo l'accordo al kickoff dello Sprint 0 (lun 23 nov).
- **Come verificare:** la lista delle osservazioni nella sessione; verrà riportata come commento nella issue #4 per la discussione.
- **Prossimi passi:** OK di Domenico sulle osservazioni, discussione con Vincenzo e Matteo al kickoff, poi modifica di `data-model.md` e diagramma ER aggiornato.
- **Commit/PR:** nessuno (voce scritta il 18/11 su un branch locale mai pushato, recuperata il 23/11 nella PR di chiusura dello scaffold).

### 2026-11-18 17:02 · SCAFFOLD-BE · DONE: scaffold del backend mergiato su `develop`
- **Cosa:** la PR #57 (`chore/scaffold-backend`) è stata approvata da Vincenzo (P1) e Matteo (P2) e mergiata con squash su `develop` (`b7c6ad8`); la issue #51 è chiusa. Il backend ha il nucleo condiviso, gli 8 moduli vuoti, il database in Docker e 49 test verdi.
- **Perché:** SCAFFOLD-BE è la prima delle tre parti dello scaffold; servivano le approvazioni di entrambi perché lo scaffold crea cartelle di moduli di tutti e tre. Ora SCAFFOLD-FE (#52, P1) e SCAFFOLD-E2E (#53, P2) possono partire su una base comune, e SCAFFOLD (integrazione, P3) aspetta solo loro.
- **File:** nessuno in questo passo (registro del merge).
- **Come verificare:** `git log --oneline -1 b7c6ad8` su `develop`; `npm run deps -- SCAFFOLD-BE` → DONE; in `backend/` `npm test` → 49 test verdi.
- **Prossimi passi:** S0-DATAMODEL (#4) e S0-API (#5); SCAFFOLD (integrazione) dopo SCAFFOLD-FE e SCAFFOLD-E2E.
- **Commit/PR:** #57 (`b7c6ad8`).

### 2026-11-17 20:03 · SCAFFOLD-BE · test(shared): test unitari e di integrazione dello scaffold
- **Cosa:** 49 test Jest in due progetti. Unit (38): tutte le regole del `Validator` (input valido, errore di ogni regola, lunghezze ai limiti, campi opzionali, oggetti e array annidati con il percorso dell'errore, chiavi sconosciute scartate), `OffsetClock`, la mappatura degli errori (anche: un errore sconosciuto non espone il messaggio), il merge OpenAPI con il rilevamento dei duplicati, il bus degli eventi (ordine, disiscrizione, un subscriber che fallisce non blocca gli altri), i default e il binding dei port, la configurazione, e la regola ESLint `module-boundaries` con `RuleTester` (dimostra che scatta sugli import profondi tra moduli). Integration (11, su `sidequest_test` con supertest): health con `db: "up"`, rotta sconosciuta → 404 JSON, JSON non valido → 400 `INVALID_JSON`, `/api/docs.json` è un OpenAPI 3.1 valido, Swagger UI risponde, `validate()` → 400 `VALIDATION_ERROR` con il dettaglio per campo, il test router sposta l'orologio e azzera il DB, e il test router è **assente** quando `NODE_ENV` non è `test`. Helper `createTestApp()`, `migrateTestDb()`, `resetDb()`.
- **Perché:** specifica §7.1 ("working tests from setup"). Le basi condivise (validazione, errori, orologio, port) le useranno tutti: se si rompono, i test lo dicono subito. Gli integration test girano in sequenza (`--runInBand`) perché usano lo stesso database.
- **File:** `backend/tests/`, `PROGRESS.md`.
- **Come verificare:** in `backend/` con il DB avviato: `npm test` → 6 suite, 49 test verdi; `npm run test:coverage` → copertura ~95% e `coverage/lcov.info` per Sonar.
- **Prossimi passi:** PR `chore/scaffold-backend` → `develop`, con l'approvazione di Vincenzo e Matteo (i moduli hanno owner diversi).
- **Commit/PR:** questo commit.

### 2026-11-17 20:00 · SCAFFOLD-BE · feat(shared): scheletro del backend, nucleo condiviso e 8 moduli vuoti
- **Cosa:** creato `backend/` (Node 22, TypeScript strict, Express 5, Sequelize 6, Umzug, Socket.IO), solo infrastruttura:
  - `shared/`: `config` (il `.env` viene controllato all'avvio con il `Validator` e, se è sbagliato, l'avvio fallisce con l'elenco dei problemi), `validation` (il `Validator` scritto a mano con le regole `string`, `int`, `number`, `boolean`, `enum`, `email`, `uuid`, `isoDate`, `latitude`, `longitude`, `array`, `object`, `optional`, e il middleware `validate()` che risponde 400 `VALIDATION_ERROR` con l'errore di ogni campo), `errors` (gerarchia `AppError` ed error handler con il formato uniforme), `http` (paginazione), `clock` (`SystemClock`, `OffsetClock` nei test), `events` (bus degli eventi = Observer, catalogo degli eventi di dominio), `ports` (5 port = Strategy, registry `bindPort`/`getPort` = Dependency Injection, default sicuri), `db` (Sequelize, migratore Umzug, seed, registrazione dei modelli), `realtime/socket-server.ts` (senza autenticazione: è di R06A), `openapi` (`common.yaml` + merge dei frammenti, che fallisce sui duplicati), `testing/test-router.ts` (`/__test__/reset` e `/__test__/clock`, solo con `NODE_ENV=test`).
  - `app.ts` (helmet, cors, json con limite, morgan, `/api/v1`, `GET /health`, Swagger su `/api/docs` e `/api/docs.json`, 404 e error handler), `server.ts` (un solo server HTTP per REST e Socket.IO), `modules/registry.ts` con gli 8 moduli in ordine fisso; ogni modulo ha `index.ts` con `register(ctx)`, routes, controller, `services/`, `domain/`, `models/`, `dto/`, frammento OpenAPI e README.
  - Migrazione `000000000000-shared-baseline` (`pgcrypto`), 7 seed vuoti, script `db:migrate`, `db:migrate:undo`, `db:seed`, `db:reset` (rifiuta di girare in produzione).
  - ESLint (flat config + Prettier) con la regola locale `module-boundaries` (un modulo importa da un altro solo il suo `index.ts`) e il divieto di `Date.now()` nel codice applicativo; `Dockerfile` multi-stage; `sonar-project.properties`.
- **Perché:** specifica dello scaffold §6.1, §6.2, §6.5, §7.1. Scelte da saper spiegare: la regola sui confini è scritta a mano (30 righe) per non aggiungere un plugin; `validate()` mette i valori puliti in `res.locals.validated` perché in Express 5 `req.query` è in sola lettura; le chiavi sconosciute di un oggetto vengono scartate (nessun campo non previsto arriva ai servizi); i default dei port permettono di costruire un modulo prima di quello che lo fornisce. Deviazione dalla specifica: il default di `MissionAccessPort.canView` restituisce sempre `true`, perché senza i dati delle missioni (che sono del modulo `missions`) non può controllare "pubblicata e pubblica": fino a R07 tutte le missioni sono pubbliche e lo stato "pubblicata" lo controlla il modulo `missions`. `jsonwebtoken`, `bcryptjs`, `multer` ed `express-rate-limit` non sono installati: li aggiungono R01 e R05B. TypeScript 6 depreca `moduleResolution: node10`, quindi si usa `NodeNext`, che con questo `package.json` produce comunque CommonJS.
- **File:** `backend/` (tranne `tests/`), `sonar-project.properties`.
- **Come verificare:** in `backend/`: `npm ci`, copiare `.env.example` in `.env` (stessa porta del DB), `npm run db:migrate && npm run db:seed`, `npm run dev`, poi `GET http://localhost:3000/api/v1/health` → `{"status":"ok","db":"up",...}`; `npm run lint`, `npm run typecheck`, `npm run build`; `docker build backend` produce l'immagine.
- **Prossimi passi:** i test (commit successivo).
- **Commit/PR:** questo commit.

### 2026-11-17 19:50 · SCAFFOLD-BE · chore(repo): database in Docker e file di configurazione della root
- **Cosa:** iniziato SCAFFOLD-BE (#51, branch `chore/scaffold-backend`, issue a `status:in-progress`). Aggiunti `docker-compose.yml` (servizio `db` con `postgres:17-alpine`, volume nominato, healthcheck, credenziali e porta dal `.env` della root; servizio `adminer` opzionale nel profilo `tools`), `docker/postgres/init.sql` (crea `sidequest_test`; `sidequest_dev` lo crea `POSTGRES_DB`), `.env.example` della root, `.nvmrc` (22) e `.prettierrc`.
- **Perché:** specifica dello scaffold §7.4 e §7.5. La porta è configurabile (`DB_PORT`) perché sul PC di P3 la 5432 è già occupata da un PostgreSQL installato in locale: nel suo `.env` (non committato) usa 5433. Le credenziali sono solo per lo sviluppo locale. `init.sql` gira solo al primo avvio, quando il volume è vuoto.
- **File:** `docker-compose.yml`, `docker/postgres/init.sql`, `.env.example`, `.nvmrc`, `.prettierrc`.
- **Come verificare:** `cp .env.example .env`, poi `docker compose up -d db`; `docker compose ps` mostra `healthy`; `docker compose exec db psql -U sidequest -d sidequest_dev -c "\l"` elenca `sidequest_dev` e `sidequest_test`.
- **Prossimi passi:** il backend (commit successivo).
- **Commit/PR:** questo commit.

### 2026-11-17 19:45 · SCAFFOLD · docs(history): README della cartella `docs/history` con il link al PDF
- **Cosa:** aggiunto `docs/history/README.md`: link ben visibile al PDF nel branch `history` e alla release `history-latest`, spiegazione dei file della cartella e di come far comparire un passo nella storia. Prima, alle 19:42, la PR #55 era stata approvata e mergiata da Matteo (`0b869cb`); il primo aggiornamento automatico del branch `history` è andato a buon fine (commit di `github-actions[bot]` per `develop@0b869cb`).
- **Perché:** aprendo `docs/history/` su `develop` Domenico non trovava il PDF, che sta nel branch `history`; GitHub mostra il README sotto l'elenco dei file, così chiunque apra la cartella trova subito il link.
- **File:** `docs/history/README.md`, `PROGRESS.md`.
- **Come verificare:** aprire https://github.com/Mynamesdsuper/sidequest-group40/tree/develop/docs/history: sotto i file compare il link "Apri il PDF aggiornato".
- **Prossimi passi:** approvazione e merge di questa PR.
- **Commit/PR:** questo commit.

### 2026-11-17 19:39 · SCAFFOLD · ci(history): PDF della storia anche come file nel branch `history`
- **Cosa:** il workflow `history.yml`, oltre ad aggiornare la release `history-latest`, ora pubblica il PDF come file nel branch `history` (con un `README.md` preso da `docs/history/BRANCH-README.md`). Il branch ha un solo commit orfano, sostituito a ogni push su `develop` con un force-push. Creato subito a mano il branch con il PDF di `develop@cdfa2d7`, così il link funziona già. Aggiornati i link in README, `CLAUDE.md` (§9b, §10) e nell'introduzione della storia.
- **Perché:** Domenico vuole il PDF visibile come file nel repository, non solo come allegato di una release. Su `develop` il workflow non può fare commit (branch protection, che vale anche per i bot), e committare il PDF in ogni PR creerebbe conflitti sul file binario tra le PR parallele; un branch dedicato e non protetto risolve entrambi i problemi. Un solo commit sostituito ogni volta evita che i cloni di tutti crescano di circa 300 KB a ogni merge.
- **File:** `.github/workflows/history.yml`, `docs/history/BRANCH-README.md`, `README.md`, `CLAUDE.md`, `docs/history/overview.md`; branch `history` su GitHub.
- **Come verificare:** https://github.com/Mynamesdsuper/sidequest-group40/blob/history/SideQuest_Group40_History.pdf risponde; dopo il merge di questa PR l'esecuzione del workflow `history` è verde e il branch `history` ha un commit di `github-actions[bot]` che punta al nuovo `develop`.
- **Prossimi passi:** approvazione di questa PR (Vincenzo, revisore di P3) e merge.
- **Commit/PR:** questo commit.

### 2026-11-17 19:35 · SCAFFOLD · chore(repo): PR #47 mergiata su `develop`
- **Cosa:** Matteo ha approvato e mergiato con squash la PR #47 (commit `cdfa2d7` su `develop`), che conteneva anche la #54: task CLEANUP, pagina Start-here, direttive del coordinatore, scaffold diviso in tre parti, storia del progetto in PDF, registro in italiano, regola sull'attribuzione. Alle 19:36 il workflow `history` è andato a buon fine e ha sostituito da solo il PDF della release `history-latest`.
- **Perché:** con il piano nuovo su `develop`, Vincenzo e Matteo possono partire con lo Starter prompt 1 e poi con lo Starter prompt 2 sui loro task (SCAFFOLD-FE, SCAFFOLD-E2E). Un primo tentativo di merge era bloccato perché la PR non aveva ancora l'approvazione di un code owner (branch protection): Matteo ha prima approvato, poi mergiato.
- **File:** nessuno in più (merge).
- **Come verificare:** `git log --oneline -1 origin/develop` mostra `cdfa2d7`; `gh run list --workflow history` mostra l'esecuzione verde; `npm run deps -- --all` su `develop` elenca SCAFFOLD-BE/FE/E2E.
- **Prossimi passi:** il messaggio dello squash contiene i trailer `Co-Authored-By` dei commit del branch: si tolgono in CLEANUP; d'ora in poi cancellarli dal box di conferma dello squash-merge.
- **Commit/PR:** PR #47, `cdfa2d7`.

### 2026-11-17 19:33 · CLEANUP · docs(repo): nessuna attribuzione a strumenti di IA nei commit e nelle PR
- **Cosa:** aggiunta in `CLAUDE.md` §9 la regola: niente trailer `Co-Authored-By:` di Claude nei messaggi di commit e niente righe "Generated with Claude Code" nelle descrizioni di PR, issue e release. Tolta quella riga dalla descrizione della PR #54. Nota sul flusso: alle 19:26 Matteo ha mergiato la #54 dentro il branch della #47 (`chore/cleanup-task`, non protetto); quindi ora la #47 contiene tutto il lavoro di oggi e basta approvare e mergiare quella. Aggiornata la descrizione della #47 di conseguenza.
- **Perché:** il task CLEANUP (#48) dovrà togliere queste tracce prima del rilascio; se ogni sessione di ognuno continua ad aggiungerle, la pulizia finale cresce. La regola sta in `CLAUDE.md` perché la leggono le sessioni Claude Code di tutti e tre, non solo quelle di P3. Restano da pulire in CLEANUP i 7 commit già fatti con il trailer.
- **File:** `CLAUDE.md`, `PROGRESS.md`; descrizioni delle PR #47 e #54 su GitHub.
- **Come verificare:** `git log -1 --format=%B` di questo commit non contiene `Co-Authored-By`; `gh pr view 54 --json body` non contiene "Generated with".
- **Prossimi passi:** approvazione della #47 da parte di Vincenzo o Matteo, poi merge su `develop`.
- **Commit/PR:** questo commit, PR #47.

### 2026-11-17 19:19 · SCAFFOLD · chore(github): prima pubblicazione della storia del progetto su GitHub
- **Cosa:** creata a mano la pre-release `history-latest` (tag su `develop`) e caricato come allegato il PDF della storia generato da questo branch. Da ora è scaricabile al link fisso indicato nel README.
- **Perché:** Domenico vuole il PDF già su GitHub, non solo in locale. Il workflow `history.yml` che lo aggiorna esiste solo su questo branch e parte dal primo push su `develop`; fino al merge questa pubblicazione manuale fa da prima versione, poi ogni PR mergiata da chiunque lo ricostruisce e lo sovrascrive (`--clobber`). Nessuno deve rigenerarlo a mano: basta scrivere le voci in `PROGRESS.md`.
- **File:** nessuno nel repository oltre a questa voce (release GitHub).
- **Come verificare:** `gh release view history-latest` mostra l'allegato `SideQuest_Group40_History.pdf`; il link del README lo scarica.
- **Prossimi passi:** dopo il merge controllare che la prima esecuzione del workflow `history` sia verde e aggiorni l'allegato.
- **Commit/PR:** questo commit.

### 2026-11-17 19:16 · SCAFFOLD · fix(repo): autore dei commit collegato all'account giusto
- **Cosa:** i tre commit di questo branch (scaffold diviso, storia del progetto, storia in italiano) erano firmati con `panaro.domenico10@gmail.com`, che GitHub collega all'account `zZerith` e non a `Mynamesdsuper`. Impostato `user.email` del repository a `domenico.panaro1003@gmail.com` (la stessa email dei commit del setup), riscritto l'autore dei tre commit mantenendo le date originali (`git rebase --exec "git commit --amend --author=…"`), aggiornati gli hash citati in questo registro (`70cfef1` → `978dfbe`, `1389bd4` → `ad8cf80`) e fatto un force-push del solo branch `chore/split-scaffold`.
- **Perché:** l'analisi del repository Git (DOC-GIT) conta i commit per account GitHub: con l'email sbagliata questo lavoro sarebbe risultato di un altro account. Il force-push era sicuro perché il branch non è protetto, non è ancora mergiato e lo usa solo P3; `--force-with-lease` evita di sovrascrivere eventuali push altrui.
- **File:** `PROGRESS.md` (hash aggiornati e questa voce); configurazione git locale.
- **Come verificare:** `gh api repos/Mynamesdsuper/sidequest-group40/commits/978dfbe --jq .author.login` restituisce `Mynamesdsuper` (lo stesso per `ad8cf80` e per l'ultimo commit del branch).
- **Prossimi passi:** nessuno.
- **Commit/PR:** questo commit (riscritto insieme agli altri due).

### 2026-11-17 19:09 · SCAFFOLD · docs(history): storia del progetto e registro in italiano
- **Cosa:** la storia del progetto (PDF) e `PROGRESS.md` sono ora in italiano. Tradotte tutte le voci esistenti e aggiunta a ciascuna l'ora del commit che l'ha registrata; introduzione (`docs/history/overview.md`) ed etichette del PDF in italiano; `render-pdf.mjs` ha l'opzione `--lang it` (indice e copertina in italiano). L'ordine cronologico ora viene dalla data e ora nel titolo di ogni voce, non più da `git blame`. Aggiornate le regole in `CLAUDE.md` §9b, `CONTRIBUTING.md` e nelle tre guide (formato della voce con le etichette Cosa / Perché / File / Come verificare / Prossimi passi / Commit/PR); PDF delle guide rigenerati.
- **Perché:** Domenico vuole la storia del progetto in italiano da ora in poi, e il log del PDF è fatto con le voci di `PROGRESS.md`, quindi anche quelle passano all'italiano (eccezione alla regola "tutto il repository in inglese"; codice, commenti, messaggi di commit e gli altri documenti restano in inglese). `git blame` non andava più bene: tradurre una voce riscrive le sue righe, e su `develop` lo squash-merge mette tutte le voci di una PR nello stesso commit; l'ora scritta nel titolo invece resta stabile.
- **File:** `PROGRESS.md`, `scripts/history.mjs`, `scripts/history.test.mjs`, `scripts/render-pdf.mjs`, `docs/history/overview.md`, `.github/workflows/history.yml`, `CLAUDE.md`, `CONTRIBUTING.md`, `docs/guides/*`.
- **Come verificare:** `node --test scripts/history.test.mjs` (test verdi); `npm run history` produce il PDF in italiano con i passi in ordine; le voci senza ora generano un avviso.
- **Prossimi passi:** comunicare a Vincenzo e Matteo che le loro voci in `PROGRESS.md` vanno scritte in italiano, con l'ora.
- **Commit/PR:** questo commit.

### 2026-11-17 19:05 · SCAFFOLD · docs(history): storia del progetto ricostruita dopo ogni merge
- **Cosa:** aggiunto `npm run history` (`scripts/history.mjs`): costruisce un PDF con un'introduzione scritta a mano (`docs/history/overview.md`: scopo, il progetto, organizzazione del repository, modo di lavorare, fasi finora, glossario), poi tutte le voci di `PROGRESS.md` di tutte le sezioni in ordine cronologico, la storia dei commit e lo stato dei task. Il workflow `history.yml` lo ricostruisce a ogni push su `develop` e lo pubblica come allegato della pre-release `history-latest` (link fisso nel README). `CLAUDE.md` §9b e §10 e `CONTRIBUTING.md` lo spiegano. Un self-check con `node:test` copre l'ordinamento.
- **Perché:** Domenico vuole un unico documento che spieghi, in ordine, tutto ciò che è stato fatto al repository e che resti aggiornato dopo ogni modifica. `PROGRESS.md` contiene già queste informazioni, quindi il PDF viene generato da lì invece di essere scritto due volte. Il PDF non viene committato: tre PR corrono in parallelo e andrebbero in conflitto su un file binario; l'allegato di una release dà un link stabile senza fare push sui branch protetti. Nessuna dipendenza nuova: riusa `render-pdf.mjs` e il test runner integrato di Node.
- **File:** `scripts/history.mjs`, `scripts/history.test.mjs`, `docs/history/overview.md`, `.github/workflows/history.yml`, `package.json`, `.gitignore`, `CLAUDE.md`, `CONTRIBUTING.md`, `README.md`.
- **Come verificare:** `node --test scripts/history.test.mjs`; `npm run history` scrive `docs/history/SideQuest_Group40_History.pdf`; dopo il merge, l'esecuzione del workflow `history` è verde e l'allegato della release esiste.
- **Prossimi passi:** la prima build automatica avviene al merge di questa PR su `develop`; fino ad allora il PDF si costruisce in locale.
- **Commit/PR:** `ad8cf80`.

### 2026-11-17 18:58 · SCAFFOLD · chore(github): issue per le tre parti dello scaffold
- **Cosa:** eseguito `npm run issues:sync` da questo branch: create le label `task:SCAFFOLD-BE/FE/E2E` e le issue #51 (SCAFFOLD-BE, P3), #52 (SCAFFOLD-FE, P1), #53 (SCAFFOLD-E2E, P2), messe a `status:ready`; rinominata la #2 (SCAFFOLD) come task di integrazione con `status:blocked`; rigenerato il testo di tutte le issue dal piano (`--refresh-bodies`; prima verificato che nessuna issue avesse checkbox spuntate).
- **Perché:** Vincenzo e Matteo devono poter iniziare il 18 novembre con una issue, una checklist e lo Starter prompt 2, senza aspettare il merge di questa PR.
- **File:** nessuno nel repository (configurazione GitHub).
- **Come verificare:** `gh issue view 51` / `52` / `53`; `npm run deps -- --all` su questo branch mostra le tre parti READY e SCAFFOLD BLOCKED da esse.
- **Prossimi passi:** finché questa PR non è mergiata, `npm run deps` su `develop` non conosce i nuovi ID, e `deps-labeler` ricalcolerebbe le label con il vecchio piano alla chiusura di una issue: fare presto il merge della PR #47 e poi di questa.
- **Commit/PR:** nessuno (solo GitHub).

### 2026-11-17 18:57 · SCAFFOLD · chore(plan): scaffold del codice diviso in tre parti parallele
- **Cosa:** sostituito l'unico task SCAFFOLD con SCAFFOLD-BE (P3, 18–21 novembre: backend, nucleo condiviso, `docker-compose.yml`), SCAFFOLD-FE (P1, 18–22 novembre: frontend Angular, compresi gli stub `core/auth` e `core/realtime`) e SCAFFOLD-E2E (P2, 18–22 novembre: Playwright, fixture, smoke test, `docker-compose.demo.yml`). SCAFFOLD (P3, 23–24 novembre) ora li integra: `ci.yml`, `sonar.yml`, `setup:dev`, branch protection, quick start del README. Le checklist e i percorsi consentiti per ogni parte sono in `task-details.json`.
- **Perché:** ogni membro lavora dal primo giorno invece di aspettare una sola persona, e ognuno costruisce lo scheletro dell'area che poi possiederà (Vincenzo il frontend, Matteo i test E2E). L'ID SCAFFOLD resta come task di integrazione, così R01 e SONAR-SETUP mantengono gli stessi blocchi. SCAFFOLD-BE viene mergiato per primo perché fissa le convenzioni TypeScript/ESLint/Prettier che le altre due parti seguono.
- **File:** `docs/plan/tasks.json`, `docs/plan/task-details.json`, `docs/plan/PLAN.md`, `docs/plan/START-HERE.md`, le tre guide, i loro PDF, `CLAUDE.md` (riga di stato), `README.md` (riga di stato).
- **Come verificare:** `npm run plan:validate` stampa "Plan OK: 50 tasks, no cycles, 0 warning(s)"; `npm run deps -- SCAFFOLD` elenca le tre parti come blocchi.
- **Prossimi passi:** creare le tre issue, aggiornare titolo, testo e label di stato della issue SCAFFOLD (#2), mettere le nuove issue a `status:ready` (fatto alle 18:58, vedi sopra). Questo branch è costruito sopra la PR #47 e viene ribasato su `develop` dopo il suo merge.
- **Commit/PR:** `978dfbe`.
