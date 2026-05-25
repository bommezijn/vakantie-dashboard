# Vakantie Dashboard 2026

Interactief dashboard voor het vergelijken van 31 zomervakantiedeals (1–12 juli 2026, 3 personen, vertrek Amsterdam Schiphol). Providers: TUI, Sunweb, Corendon en ByJune.

## Features

- Budget slider (€300–1500 p.p.)
- 21 keywords verdeeld over 4 categorieën
- Sorteren op prijs, rating of vluchttijd
- Filteren op land en provider
- Toggle "toon boven budget"
- Deal-cards met uitklapbare highlights

## Gebruik

Open `standalone.html` direct in een willekeurige moderne browser — dubbelklik volstaat. Er is geen build-stap nodig: React 18, Babel en Tailwind 3.4 worden via CDN geladen.

```bash
# macOS / Linux
open standalone.html

# Windows
start standalone.html
```

## Deployment

### GitHub Pages
Push de repository naar GitHub en activeer Pages op branch `main` met root (`/`) als source. De app is dan bereikbaar op `https://<gebruikersnaam>.github.io/vakantie-dashboard/standalone.html`.

### Vercel
```bash
vercel --prod
```
Vercel serveert `standalone.html` direct als statische site.

## Tech stack

- React 18 (via CDN)
- Babel standalone (in-browser JSX)
- Tailwind CSS 3.4 (via CDN)
- Eén bestand, geen dependencies, geen build
