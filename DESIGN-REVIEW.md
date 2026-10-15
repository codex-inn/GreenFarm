# GreenFarm: design and quality review

## Current architecture

GreenFarm is a GitHub Pages application built from static HTML, CSS and vanilla JavaScript. Workspace records and Farm Center records remain in separate browser LocalStorage keys. No backend, cloud sync or live weather feed is used. The crop outlook is rule-based decision support, not a yield forecast.

## Design and feature improvements

- Shared app navigation and green-and-gold visual system across desktop, tablet and phones.
- Five primary destinations on mobile, with secondary destinations inside the More menu.
- Dashboard reads both local stores and shows fields, crops, livestock, pending work, entered income/expenses, overdue items, recent entries and quick actions.
- Crop, livestock and activity summaries include search, filters, sorting, pagination and CSV export.
- Analytics compare monthly finance, calculate crop harvest value from entered quantity × price, and include only expenses tagged to a crop. Missing values remain labeled as unavailable.
- Reports have date filters, print/PDF layout and CSV export.
- Workspace records are searchable and individually exportable; delete actions require confirmation. Crop and scouting photos are resized before browser-only storage.
- Irrigation rows estimate applied water volume from entered depth and a matching saved field area, with the calculation disclosed in the UI.
- Farm Center lists support search and edit/delete. Tasks can be marked complete or reopened.
- Restore validates the selected backup before replacing data. CSV fields escape quotes and guard spreadsheet formula prefixes.
- Service worker caches only successful same-origin responses, refreshes cached assets, removes older caches and does not return HTML for missing scripts or stylesheets.
- GreenFarm Home project credit preserves the TNAU identity and student attribution.

## Limitations

- LocalStorage data belongs to the current browser profile and device; there is no account or synchronization.
- Weather values are manually entered.
- Crop outlook uses broad heuristics and should not be used as a crop-specific recommendation or yield estimate.
- Crop and scouting photos are optional, resized to fit local storage and are not uploaded.
- Crop costs and returns are incomplete unless users tag expenses to a crop and enter harvest price and quantity.
- Analytics reflect only dated, numeric transactions entered by the user.

## Recommended next steps

1. Keep a manual acceptance checklist for add/edit/delete, search, CSV, print, backup/restore and offline behavior.
2. Verify the app in a second browser before relying on backup restore.
3. Keep the TNAU project report and its stated data limitations current.
