# GreenFarm

**Smart Digital Agriculture · TNAU AC&RI Vazhavachanur**

GreenFarm is a static farm-management app for recording crop, livestock, field, irrigation, soil, scouting, harvest, finance, inventory, task and diary information.

## App views

| Page | Purpose |
|---|---|
| Home | Local record overview, quick actions and links to farm tools |
| Dashboard | Core Workspace totals and shortcuts |
| Crops / Livestock | Entry points to crop and animal records |
| Activities | Entry point to farm operation records |
| Analytics / Reports | Overview and print/report entry points |
| Workspace | Core crop, livestock, weather, soil, irrigation, scouting, harvest, finance, inventory, prediction, profile and backup tools |
| Farm Center | Field, crop plan, irrigation, input, pest, finance, harvest, seed, equipment, task, diary, profile and report tools |
| Admin | Local workspace and backup information |
| Farmer Access | Information page; no server sign-in |

## Architecture and data

- Static HTML pages, shared CSS and vanilla JavaScript.
- Hosted on GitHub Pages from the repository root.
- No backend, Supabase, account system or cloud sync.
- Records live in browser LocalStorage on the current device.
- Core Workspace stores data in `greenfarm.v2`; Farm Center stores data separately in `greenfarm.advanced.v1`.
- JSON backup/restore and CSV export are available from the existing tools.
- PWA manifest and service worker provide an installable offline shell.

Because records belong to one browser profile, export a backup before clearing browser data or moving to another device. Core Workspace and Farm Center records are not automatically combined.

## Key files

| File | Role |
|---|---|
| `index.html` | Farm Home app overview |
| `dashboard.html` | Core record totals and quick access |
| `farm.html` + `assets/farm.js` | Core Workspace forms, tables, reports and JSON backup |
| `advanced.html` + `assets/advanced.js` | Farm Center forms, summaries and CSV export |
| `assets/greenfarm.css` | Original site styles |
| `assets/app-ui.css` + `assets/app-ui.js` | Shared application shell, responsive navigation and Home overview |
| `sw.js` + `manifest.webmanifest` | Offline shell and install metadata |
| `build.py` | Static page builder for the overview and Home pages |
| `DESIGN-REVIEW.md` | Responsive audit, design notes, limitations and next steps |

## Known limitations

- Browser LocalStorage is limited to one device and browser profile.
- Core Workspace and Farm Center use two separate data formats and do not sync.
- Crops, Livestock, Activities, Analytics and Reports are overview/shortcut pages; their records are managed in Workspace and Farm Center.
- Weather is entered manually.
- Crop outlook is a rule-based decision aid, not a trained model or a guarantee of yield.
- Farmer Access is informational; the app has no user authentication.
- Demo data is available only through the explicit Farm Center demo control and should be removed before recording real farm information.

## Design review and recommendations

See [DESIGN-REVIEW.md](DESIGN-REVIEW.md) for the page-by-page responsive checks, current design findings, changes in this update, and prioritized product suggestions.

## Update and deployment workflow

Edit the static HTML, shared CSS/JavaScript and service-worker cache version together. Commit to `main`; GitHub Pages publishes the repository root. Check the Pages deployment and inspect the live app at desktop, tablet and mobile widths after an update. Keep user records local and preserve the existing architecture unless product requirements explicitly change.