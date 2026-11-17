# Storia del progetto

## 📄 [Apri il PDF aggiornato](https://github.com/Mynamesdsuper/sidequest-group40/blob/history/SideQuest_Group40_History.pdf)

Il PDF **non è in questa cartella**: sta nel branch [`history`](https://github.com/Mynamesdsuper/sidequest-group40/tree/history), che il workflow `.github/workflows/history.yml` aggiorna da solo dopo ogni PR mergiata su `develop`. Lo stesso PDF è anche nella release [`history-latest`](https://github.com/Mynamesdsuper/sidequest-group40/releases/tag/history-latest).

Cosa c'è in questa cartella:

| File | A cosa serve |
|---|---|
| `overview.md` | l'introduzione del PDF, scritta a mano (il coordinatore aggiorna "Le fasi finora" a ogni milestone) |
| `BRANCH-README.md` | il README che il workflow copia nel branch `history` |

Il resto del PDF viene generato da `PROGRESS.md`: per far comparire un passo nella storia basta scrivere la voce nella propria sezione (in italiano, con data e ora). Per rigenerarlo in locale: `npm run history` (il PDF finisce qui, ma non va committato).
