# Storia del progetto – SideQuest, Gruppo 40

Questo branch contiene solo il PDF aggiornato della storia del progetto: **[SideQuest_Group40_History.pdf](SideQuest_Group40_History.pdf)**.

- Viene ricostruito automaticamente dal workflow `.github/workflows/history.yml` a ogni push su `develop` (cioè dopo ogni PR mergiata).
- Il branch ha sempre **un solo commit**, sostituito a ogni aggiornamento (force-push), così i cloni non si appesantiscono con le versioni vecchie. Non lavorare su questo branch e non aprire PR verso di esso.
- Il contenuto viene da `docs/history/overview.md` e da `PROGRESS.md` su `develop`: per cambiare il PDF si modificano quei file, con una PR verso `develop`.
- Lo stesso PDF è anche allegato alla pre-release `history-latest`.
