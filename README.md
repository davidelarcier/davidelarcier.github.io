# Il Giornale dei Giornali — lettore

La stampa "mondiale", condensata in un'edizione quotidiana in italiano.
Il valore non è l'aggregazione ma il **confronto**: come lo stesso tema viene
raccontato in Italia, in Europa e negli altri continenti.

Questo è il **lettore**: un'app web (PWA installabile, con lettura offline) che
apre le edizioni quotidiane. Per ogni tema mostra la sintesi, il confronto per
aree geografiche e i link alle testate; gli articoli originali si aprono sul
sito della fonte.

## Struttura

- `app/` — lettore React + Vite (PWA installabile, lettura offline).
- `data/editions/` — le edizioni pubblicate: JSON + PDF scaricabili.
- `.github/workflows/deploy.yml` — build e deploy su GitHub Pages a ogni push.

## Sviluppo

```bash
cd app
npm ci
npm run dev      # sviluppo
npm run build    # build di produzione (con service worker)
npm run preview  # serve il build
```

Vincolo legale per costruzione: si mostra sempre e solo **titolo + nostra
sintesi + link alla fonte**, mai il testo integrale degli articoli.

Per i termini d'uso completi, i limiti di responsabilità e le informazioni su
fonti/diritto d'autore, vedi [NOTE-LEGALI.md](./NOTE-LEGALI.md).
