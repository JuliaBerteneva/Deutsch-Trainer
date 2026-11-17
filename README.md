# Deutsch-Trainer

Vokabel- und Grammatiktrainer (eine HTML-Datei, ohne Server). Öffnen: `index.html` (GitHub Pages).

- `vocab/` — Wortlisten (`*.md`), aus den Hausaufgaben
- `src/` — Quellcode; Build: `python3 src/build.py vocab index.html`
- `src/make_grammar.py` → `src/grammar.json` (Grammatikaufgaben)

Der Lernfortschritt wird nicht hier gespeichert, sondern im Browser (Export/Import-Code in den Einstellungen).
