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

## P3 – Domenico Panaro

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
