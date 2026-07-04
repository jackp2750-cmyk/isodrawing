# SpoolMate

Current app version: `v2.39`

SpoolMate is a browser-based pipe spool drawing app. It lets you sketch a spool in a 2D isometric drawing view, preview it as a 3D model, and export fabrication information such as cut lists, fitting takeoffs, weights, dimensions and PDF fab sheets.

See [CHANGELOG.md](CHANGELOG.md) for the detailed update log.

## What It Does

- Draw 2D isometric pipe runs in millimetres.
- Add exact X, Y and Z runs, plus angled offset runs.
- Hold Shift while drawing to use 45 degree offset snap guides.
- Edit run length, angle, pipe size and fitting details from the inspector or right-click/long-press menus.
- Select one run, multiple runs with Shift, or multiple runs with box select.
- Add reducers, sockets, welds, flanges, valves and roll grooves, with Tee and Branch available directly in Draw mode.
- Pick common flange standards from menus, including ANSI, PN, DIN, JIS and AS 2129 Table types.
- Pick socket size, quantity and spacing from a visual socket menu.
- Work with Carbon Sch 40 and Stainless Sch 10S pipe data up to NB 300.
- Show pipe size labels, red centre-to-centre dimensions, numbered dimension keys or chain-style dimensions.
- Use the numbered dimension key as the default readable dimension view, with editable `D/O` rows for centre-to-centre values.
- Drag red dimension labels away from clashes.
- Add manual measurements by clicking two points on the drawing.
- Add and drag text notes.
- Estimate cut lengths, bend deductions, fitting takeoffs and weights.
- Show drawing checks and click many check warnings to highlight the issue on the drawing.
- Calculate centre of gravity and optional suggested lifting lug points.
- Preview the spool in 3D with realistic, workshop, carbon, stainless, painted, transparent, outline and CAD-style views.
- Float, hide, minimize or fullscreen the 3D preview.
- Export fabrication PDF sheets, 3D images and project files, including workshop, client/approval and material order/take-off PDF styles.
- Use the Drawing import assistant to upload a supplied drawing/photo/PDF, calibrate a known dimension and trace centreline runs into a SpoolMate spool.
- Save projects locally in the browser or, when Supabase is configured, save projects to the cloud.
- See cloud save confidence at a glance with saved, unsaved, saving, failed and conflict states.
- Use the startup dashboard to continue drawing, start a new spool, open jobs, load the sample, manage account settings, open help or follow the interactive tool tutorial.
- Pick tutorial topics from the tutorial menu instead of stepping through every feature in order.
- Open the Job dashboard to search jobs, group spools by job/client, view the production board, and quickly save or start a new spool.
- Use the built-in Jobs `Guide` button to show the in-window guide only when needed.
- Use the Jobs `Comms` button for shared company messages and a combined view of active spool/yard notes.
- Generate a daily or weekly Jobs report from the dashboard, including stage counts, due/overdue work, hold items, assignees and recent progress.
- Assign saved spools to team members, set due dates, priority and hold notes, and move each spool through Draft, Ready to check, Checked, Issued, Cutting, Fit-up, Welded, Paint / finish and Fabricated stages.
- Drag production cards between stages, filter the board by active/due/overdue/hold/mine/all, or use quick Ready, Issued and Fabbed buttons on each card.
- See Team alerts for spools assigned to you, due today, overdue, ready to check or carrying an open production note.
- Keep an automatic activity history on each spool for status moves, assignment changes, due changes, hold changes and production notes.
- Open a job folder to see job-level totals for total, ready check, checked, issued, fabricated, overdue and on-hold spools, plus a clean needs-doing-today list.
- Use improved daily/weekly Jobs reports with next actions, checking queue, issue/fabrication queue, blockers, assignee workload and recent progress.
- Add short team/yard notes to production cards and mark notes done so they are cleaned up after one week.
- Use accounts, trials/licences, company/team projects, project comments and owner/admin/member team permissions through Supabase.
- Install as a Progressive Web App on iPad, Android and desktop when hosted over HTTPS.

## Important Files

- `index.html` - app shell and UI markup.
- `app.js` - drawing logic, 3D model generation, project storage, Supabase/cloud logic and exports.
- `styles.css` - light/dark themes, desktop/tablet/phone layout and drawing UI styling.
- `manifest.webmanifest` - PWA install metadata.
- `sw.js` - service worker app-shell cache.
- `icons/` - SpoolMate app icons and logo assets.
- `supabase-setup.sql` - database tables, policies and helper functions for cloud accounts/team projects.
- `CHANGELOG.md` - current update log.

## Running Locally

For a quick local check, open `index.html` in a browser.

For the closest real app behaviour, serve the folder over local HTTP. This lets browser features behave more like GitHub Pages or another hosted site.

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

There is no build step and no npm install required. Three.js and Supabase JS are loaded from CDN URLs in `index.html` / `app.js`, so the 3D preview and cloud login need internet access.

## Hosting

The app can be hosted as static files. GitHub Pages works well.

Upload these files and folders to the repository root:

- `index.html`
- `app.js`
- `styles.css`
- `manifest.webmanifest`
- `sw.js`
- `CHANGELOG.md`
- `README.md`
- `icons/`

In GitHub Pages, set the source to:

- Branch: `main`
- Folder: `/ (root)`

Your app URL will look like:

```text
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPO-NAME/
```

## Updating A Hosted Copy

When you change the app, upload the changed root files to GitHub again. The app uses a service worker cache, so version numbers matter.

For an app-code update, make sure these stay in sync:

- `APP_VERSION` in `app.js`
- `styles.css?v=...` and `app.js?v=...` in `index.html`
- `CACHE_NAME` and cached file query strings in `sw.js`
- the top of `CHANGELOG.md`

If a phone or tablet still shows an old version, close the app fully and reopen it, or refresh the browser page. Android/Chrome may need a hard refresh or site-data clear if it is holding an old service worker cache.

## Installing On iPad Or Android

The app is set up as a PWA with:

- `manifest.webmanifest`
- `sw.js`
- icons in `icons/`
- offline app-shell caching

For install prompts to work properly, host it over HTTPS.

iPad:

1. Open the HTTPS app URL in Safari.
2. Tap Share.
3. Tap Add to Home Screen.

Android:

1. Open the HTTPS app URL in Chrome.
2. Tap Install app or Add to Home screen.

The current layout has specific desktop, iPad/tablet and Android phone behaviour. On phones, the 3D preview opens as a bottom sheet so it does not cover the drawing.

## Local Storage Vs Cloud

SpoolMate can run without accounts. In guest/local mode:

- Projects save in that browser on that device.
- Export/import project files are the easiest way to move drawings between devices.
- Clearing browser site data can remove local projects.

With Supabase configured:

- Users can create accounts and sign in.
- A trial/licence profile is created in Supabase.
- Projects can save to the cloud and be opened on other devices.
- Company/team workspaces can share projects.
- Team members can leave comments on a project.
- Jobs Comms can share general team messages across an approved company.

## Supabase Setup

Run `supabase-setup.sql` in the Supabase SQL Editor for the Supabase project used by the app.

In Supabase Auth settings:

- Set the Site URL to the hosted SpoolMate URL.
- Add the same hosted SpoolMate URL as a Redirect URL.
- Keep using the public anon/publishable key in the frontend. Do not put a service-role key in `app.js`.

For a different Supabase project, update these constants near the top of `app.js`:

```js
const SUPABASE_URL = "...";
const SUPABASE_PUBLISHABLE_KEY = "...";
```

## Safety Notes

SpoolMate is a fabrication aid, not a certified engineering package. Always verify cut lengths, weights, lifting/lug positions, materials and fitting selections before fabrication or lifting.
