# SpoolMate

Current app version: `v2.93`

SpoolMate is a browser-based pipe spool drawing app. It lets you sketch a spool in a 2D isometric drawing view, preview it as a 3D model, and export fabrication information such as cut lists, fitting takeoffs, weights, dimensions and PDF fab sheets.

See [CHANGELOG.md](CHANGELOG.md) for the detailed update log.

## What It Does

- Draw 2D isometric pipe runs in millimetres.
- Add exact X, Y and Z runs, plus angled offset runs.
- Hold Shift while drawing to use 45 degree offset snap guides.
- Edit run length, angle, pipe size and fitting details from the inspector or right-click/long-press menus.
- Select one run, multiple runs with Shift, or multiple runs with box select.
- Keep the side rail focused on Draw, Select, Undo, Redo, Measure and Note, with Tee, Branch, Flange, Reducer, Groove, Valve, Socket and Weld grouped in one Fittings flyout.
- The Fittings button shows the currently selected fitting so it stays clear what will be placed next.
- Pick common flange standards from menus, including ANSI, PN, DIN, JIS and AS 2129 Table types; 3D flange OD, thickness, PCD, bolt-hole diameter and hole count come from the selected standard's size table.
- Pick socket size, quantity and spacing from a visual socket menu.
- Work with Carbon Sch 40 and Stainless Sch 10S pipe data up to NB 300, plus Atlas stainless steel tube OD sizes and tube fitting weights.
- Show pipe size labels, red centre-to-centre dimensions, numbered dimension keys or chain-style dimensions.
- Control pipe-size labels separately with Auto, Key sizes, All sizes, Export only and Hide modes.
- Use the numbered dimension key as the default readable dimension view, with editable `D/O` rows for centre-to-centre values.
- Drag red dimension labels away from clashes.
- Add manual measurements by clicking two points on the drawing.
- Add and drag text notes.
- Calculate cut lengths, bend deductions, fitting takeoffs and table-backed or estimated weights.
- Show the weakest estimated pipe-wall pressure as a tidy drawing note using kPa with bar in brackets.
- Show drawing checks and click many check warnings to highlight the issue on the drawing.
- Keep Review and the Checks list open when using Show on drawing; highlighting a finding no longer switches to Edit, Properties or another mobile panel.
- Resolve reducer and tee/branch checks from actionable cards, or acknowledge an intentional exception with a required reason, reviewer and timestamp so the spool can still proceed to issue.
- Keep built-in regression test-kit failures visible as application diagnostics without incorrectly blocking the current spool drawing.
- Treat the two straight-through legs at every welded branch as one continuous main pipe: changing either leg's size updates the complete linked main while leaving the side outlet unchanged.
- Calculate centre of gravity and optional suggested lifting lug points.
- Preview the spool in 3D with realistic, workshop, carbon, stainless, painted, transparent, outline and CAD-style views.
- Keep 3D hidden until needed, open it from the drawing toolbar as a compact movable overlay, and remember its last size and position on that device.
- Use Focus mode to give the drawing the whole screen while retaining a slim tool rail; Details and 3D open temporarily over it without changing workflow mode.
- Export polished fabrication PDF sheets, 3D images and project files, including workshop, client/approval and material order/take-off PDF styles.
- Use the Drawing import assistant to upload a supplied drawing/photo/PDF, calibrate a known dimension and trace centreline runs into a SpoolMate spool.
- Learn the app with an interactive tutorial that includes topic-specific mini practice workflows, live prompts and completed topic states.
- Save projects locally in the browser or, when Supabase is configured, save projects to the cloud.
- See cloud save confidence at a glance with saved, unsaved, saving, failed and conflict states.
- Use the startup dashboard to continue drawing, start a new spool, open jobs, load the sample, manage account settings, open help or follow the interactive tool tutorial.
- Work in four focused modes: Draw for pipe and dimensions, Edit for selection and fittings, Review for checks/workflow/notes/history, and Export for cut lists, BOM and fabrication files.
- Use the desktop Inspector as an on-demand drawer: it stays closed when nothing is selected, opens for selected pipe/fittings, and gives Cut List, Weights and BOM full-height views.
- Keep only Save, Jobs, Account, cloud-save state and Menu in the permanent action bar; New spool and theme controls now live in Menu.
- Keep current status and assignee visible beside the job/spool while assignments, messages, reports and activity remain in the Jobs workspace.
- Read actions consistently across both themes: blue is reserved for active or primary actions, Save is green, destructive actions are red, exports are visually distinct, and supporting information is quieter.
- Pick tutorial topics from the tutorial menu instead of stepping through every feature in order.
- Open the Job dashboard to search jobs, group spools by job/client, view the production board, and quickly save or start a new spool.
- Use the built-in Jobs `Guide` button to show the in-window guide only when needed.
- Use the Jobs `Comms` button for shared company messages and a combined view of active spool/yard notes.
- Generate a daily or weekly Jobs report from the dashboard, including stage counts, due/overdue work, hold items, assignees and recent progress.
- Assign saved spools to team members, set due dates, priority and hold notes, and move each spool through Draft, Ready to check, Checked, Issued, Cutting, Fit-up, Welded, Paint / finish and Fabricated stages.
- Drag production cards between stages, filter the board by active/due/overdue/hold/mine/all, or use quick Ready, Issued and Fabbed buttons on each card.
- Use the team dashboard for Assigned to me, Due today, Overdue, Ready to check and On hold queues, recent team activity, Daily/Weekly reports and Team comms.
- A clear hold reason is required when a spool is placed on hold, so the team can see what must be resolved.
- Open Jobs and choose Comms for the direct cloud-spool conversation with @mentions, private workshop photos and Resolve/Reopen controls.
- Approve or return Ready to check spools with checker comments, then require approval before issue or fabrication.
- Keep issued drawings locked and preserve checked/issued names for every revision; returning an issued drawing starts the next revision.
- Run the Review Test Kit automatic checks for tee reducers, welded branches, flush flanges, 45 degree offsets and socket dimensions after changes.
- Use the pre-issue check flow to block issuing drawings until project details, drawing health and the test kit are clear.
- See Team alerts for spools assigned to you, due soon, overdue, ready to check, returned by a checker, carrying a new comment/message, or on a newly issued revision.
- Keep an actor-and-time activity timeline on each spool for status, assignment, due date, hold, pipe-size, review, issue/revision and production-note changes; expand older retained events when needed.
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
- `verify-app.cjs` - release integrity checks for code, controls, PWA assets, engineering tables and Supabase RPC wiring.
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

## Verifying A Release

Run the bundled integrity check before uploading an update:

```powershell
node verify-app.cjs
```

It checks JavaScript/CSS syntax and structure, control/icon references, app/cache version wiring, PWA files, pipe and fitting table consistency, flange drilling rows and Supabase RPC definitions. The built-in Review Test Kit covers drawing behaviour using known sample spools. A final real-device pass on PC, iPad and Android is still recommended for touch and visual layout.

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
- Team members can use a spool conversation with mentions, private workshop photos and resolved messages.
- Jobs Comms can share general team messages across an approved company.

## Supabase Setup

For an existing SpoolMate database, run `supabase-migration-v279.sql` as a new query in Supabase SQL Editor. For a brand-new database, run the complete `supabase-setup.sql`. The v2.79 migration adds spool conversation fields, the resolve function and the private photo bucket.

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
