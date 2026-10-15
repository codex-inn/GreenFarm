# GreenFarm

**A simple farm workspace · TNAU AC&RI Vazhavachanur**

Record crops, livestock, field work and farm resources in one browser-based app.

## App sections

Home gives a quick overview. Workspace holds crop, livestock, weather, soil, irrigation, scouting, harvest, finance, inventory, profile and backup tools. Farm Center contains field plans, tasks, diary and related tools. Dashboard, Analytics and Reports provide summaries and print views.

## How it works

- Static HTML, CSS and vanilla JavaScript on GitHub Pages.
- Records stay in this browser using LocalStorage; there is no account, backend or cloud sync.
- Workspace and Farm Center keep separate local data stores.
- JSON backup and CSV export are available in the existing tools.
- The service worker keeps an offline app shell.

## Update

Edit the page or shared assets, commit to `main`, then confirm the GitHub Pages deployment. When shared files change, update the service-worker cache version in `sw.js`.
