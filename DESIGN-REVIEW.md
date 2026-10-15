# GreenFarm design review

Review performed against the public GitHub Pages site and the current main branch commit `b6ee05b4b1d024f82f8032b7db9e404a5ff178d4` on 15 October 2026.

## Current product shape

GreenFarm is a static farm-record application built with HTML, CSS and vanilla JavaScript. It stores records only in browser LocalStorage and is deployed from GitHub Pages. The Core Workspace uses `greenfarm.v2`; Farm Center uses a separate `greenfarm.advanced.v1` store. There is no server sign-in, backend or cloud sync.

## Visual and responsive audit

- Reviewed Home, Dashboard, Crops, Livestock, Activities, Analytics, Reports, Workspace, Farm Center, Admin and Farmer Access.
- Checked the live pages at 1440 px desktop, 768 px tablet and 390 px mobile widths.
- The document did not have horizontal overflow at those widths, and the page images loaded.
- On mobile, ten destinations shared a horizontally scrolling navigation strip. Some destinations and the active page could be out of view, so the navigation was difficult to scan.
- The Home page read like a public landing page, while most tools were behind Workspace and Farm Center. That made the app starting point less useful for returning farm work.
- Overview pages correctly avoided invented figures, but mostly showed empty states and links into the record tools.

## Design changes in this update

- Replaced the marketing-style Home page with an on-device farm overview: live counts from the two existing LocalStorage stores, direct actions for fields/crops/irrigation/tasks, and shortcuts to each tool.
- Kept Core Workspace and Farm Center counts separate because they use different data stores.
- Changed mobile navigation to four primary destinations plus an accessible More panel for the remaining pages. Desktop navigation still shows every destination.
- Applied one field-ready visual system across pages using deep greens, leaf and soil accents, soft canvas surfaces, clear cards, form controls, and responsive spacing.
- Kept all pages static and preserved browser-only storage, backup and print workflows.

## Known limitations

- LocalStorage is tied to one browser profile on one device. Clearing browser data can remove records; users should export a backup first.
- Core Workspace and Farm Center data are not unified and do not automatically sync or transfer between each other.
- Crops, Livestock, Activities, Analytics and Reports are overview/shortcut pages. Their underlying records are managed in Workspace and Farm Center.
- The crop outlook tool is a rule-based estimate, not a trained prediction model or agronomic guarantee.
- Weather is entered manually; the app does not fetch live weather.
- Authentication page is informational only; there are no user accounts.

## Recommended next steps

1. Add a versioned local data migration that can consolidate or clearly relate the two stores without losing existing records.
2. Turn overview pages into filtered views of the existing records, with honest empty states and local-only calculations.
3. Add an optional local backup reminder and validate backup/restore recovery on a second browser profile before transferring devices.
4. Replace the remaining emoji-only navigation and tool marks with a consistent, accessible SVG icon set.
5. Review keyboard, screen-reader, contrast and touch-target behavior on physical Android phones and tablets.
6. Keep optional integrations (weather or remote sync) out of the core app unless they are explicitly approved and retain a manual/offline path.

## Update workflow

Edit the static page and shared assets, commit to the GitHub repository, and let GitHub Pages publish from `main`. The service worker must receive a new cache version when shared CSS, JavaScript or pages change so returning users receive the new interface. Keep exports local and avoid introducing a backend unless the product requirements change.