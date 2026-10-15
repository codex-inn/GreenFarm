# GreenFarm

**Smart Digital Farm Management System · TNAU AC&RI Vazhavachanur**

GreenFarm is a browser-based farm record workspace for crop plans, livestock, field observations, soil, irrigation, scouting, harvest, finance, inventory and farm tasks.

See [PROJECT-REPORT.md](PROJECT-REPORT.md) for the project objectives, methodology, architecture and limitations.

## App sections

- **Home:** farm overview, quick navigation and project credit.
- **Dashboard:** field, crop, livestock, pending-work, income and expense totals, overdue work, recent entries and quick actions.
- **Crops, Livestock and Activities:** searchable, filterable, sortable and paginated summaries drawn from saved Workspace and Farm Center data.
- **Analytics:** monthly income and expense comparisons, crop-wise harvest value, tagged costs and yield per acre from entered records.
- **Reports:** date-filtered printable record summary and CSV export.
- **Workspace:** crop, livestock, weather, soil, irrigation, scouting, harvest, finance, inventory, profile, prediction and backup tools. Crop and scouting records can include compressed local photos.
- **Farm Center:** fields, crop plans, irrigation schedules, inputs, pest logs, finance, harvest, inventory, equipment, tasks, diary and farmer profile.

## Architecture and data

- Static HTML, CSS and vanilla JavaScript on GitHub Pages.
- No backend, account, API key, external database or cloud sync.
- Workspace records remain in the browser under `greenfarm.v2`; Farm Center records remain under `greenfarm.advanced.v1`.
- Workspace and Farm Center remain separate stores. Dashboard, Analytics and Reports read both without migrating or combining the saved data.
- JSON backup and CSV exports are available. Data is browser- and device-specific; export a JSON backup before switching devices or clearing browser data.
- Weather is manually entered. Irrigation volume is estimated only from entered water depth and a matched saved field area. Crop outlook is a simple rule-based decision aid, not a yield prediction or crop-specific recommendation. Crop economics only include costs tagged with a crop and harvest values with entered quantity and price.

## Update and deployment

1. Edit the source pages, shared assets or `build.py`.
2. Keep generated pages synchronized with the builder.
3. When changing shared or cached assets, increment the cache name and versioned asset URLs in `sw.js` and the page references.
4. Commit to `main`; GitHub Pages deploys from the repository’s configured source.
5. Confirm the live page after the deployment finishes. Existing browsers update their service-worker cache automatically.

## Limitations and next steps

Data is local to one browser and does not synchronize across devices. It is not a live weather or agronomy service. If expanding the app, keep the academic project report and manual acceptance checklist current while keeping existing records and static deployment intact.