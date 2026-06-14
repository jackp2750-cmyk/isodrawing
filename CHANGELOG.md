# SpoolMate Update Log

This log was reconstructed from the current project history and app state. Early work is grouped by feature area because the first prototype changes were not recorded as separate formal releases. Current app version: `v1.52`.

## v1.52 - Clickable Drawing Checks

- Made drawing-related Checks rows clickable.
- Clicking open-end, missing-reducer or tee/branch warnings now selects the related run/point and draws a temporary callout circle on the 2D drawing.
- Added quick actions for project-detail and dimension warnings.
- Bumped app cache to `spoolmate-v100`.

## v1.51 - 3D Reducer Placement Fix

- Moved tee/reducing-tee reducers outside the tee body in the 3D model so they are visible instead of buried inside the fitting.
- Matched the 3D pipe trims to the moved reducer position so smaller pipe does not overlap through the reducer.
- Added reducer shoulder rings in the 3D model so reducers read more clearly as fittings.
- Bumped app cache to `spoolmate-v99`.

## v1.50 - Floating Preview And 3D Stability

- Added a movable, resizable floating 3D preview while the drawing area is full screen.
- Strengthened 3D preview redraw recovery when switching Properties, Cut List, Weights and Notes tabs.
- Kept the Three.js canvas visibility in sync after layout changes so the model should not disappear.
- Bumped app cache to `spoolmate-v98`.

## v1.49 - Dark Theme Logo Colour Pass

- Added more electric blue from the SpoolMate logo into the dark theme.
- Strengthened blue borders, glows and gradients on the top bar, tool rail, side tools, menu groups and panels.
- Improved dark-mode hover and active states for tool buttons and main controls.
- Added clearer blue focus styling for inputs and selects.
- Bumped app cache to `spoolmate-v97`.

## v1.48 - Interface, Login, Offset And Cut-List Polish

- Moved Undo from the main menu into the side tool rail.
- Made drawing fullscreen keep the side tools visible.
- Added a startup login gate before the app begins.
- Added Continue as guest for local-only use without cloud login.
- Added brighter dark-mode icon styling so tool icons are easier to see.
- Added the small SpoolMate logo mark to the PWA/service-worker cache for iPad/mobile.
- Changed run length inputs to support exact 1 mm steps.
- Renamed the exact input to Next run / offset set mm.
- Changed angled runs so the input is treated as offset set, then travel is calculated with `set / sin(angle)`.
- Added 45 degree travel calculation support, so 400 mm set becomes about 566 mm travel.
- Added offset run metadata so offset set, travel, angle and multiplier are remembered.
- Added offset C/C travel and SET values to the drawing dimensions.
- Added offset set, travel factor and angle to selected-run Properties.
- Right-click Length on an offset now edits the offset set and recalculates travel.
- Branch connections now keep the main pipe as one cut-list item where possible.
- Tee connections still split the pipe as separate cut runs.
- Added compact 2D pipe-size labels on the drawing.
- Improved saved project folder scrolling so collapsed/open folders show all spools more reliably.
- Added Select tool hint: hold Shift to select multiple runs.
- Bumped app cache to `spoolmate-v96`.

## v1.47 - Preview And Measurement Fixes

- Fixed the action menu being overlapped by the 3D preview/canvas.
- Fixed the 3D preview disappearing after clicking Properties, Cut List, Weights or Notes.
- Added preview refresh and resize after inspector tab changes.
- Changed displayed pipe lengths to whole millimetres.
- Changed length snapping from 50 mm to 1 mm.
- Bumped the visible app version to `v1.47`.

## Branding And Theme Updates

- Renamed the app from IsoSpool to SpoolMate.
- Added SpoolMate logo assets.
- Made dark mode the default theme.
- Added a light/dark theme selector.
- Adjusted the header, buttons and panels to suit the SpoolMate blue/black logo style.
- Added version display in the app header.

## Interface And Workflow Updates

- Reworked the top bar to reduce clutter.
- Added a Menu drawer for project, review, export and setup tools.
- Added side-tool settings so users can choose which tools appear.
- Added collapsible middle control sections.
- Added full-screen view options for the drawing and 3D preview.
- Added clearer buttons for zoom, dimensions, lifting points, preview styles, export and sheet actions.
- Improved mobile and iPad layout with bottom panel navigation.
- Added guards to reduce accidental text selection on iPad.
- Added right-click and long-press context actions.
- Added right-click delete options for runs, fittings, notes and points.
- Added drag support for text notes.
- Added drag support for red dimension offsets.

## Drawing And Editing Updates

- Added 2D isometric drawing on dot-grid isometric paper.
- Added straight pipe drawing from selected points.
- Added exact X, Y and Z run buttons.
- Added angled runs in X-Y, X-Z and Y-Z planes.
- Added Enter key to stop drawing and return to Select.
- Added run selection and selected-run length editing.
- Added bend angle editing from right-click.
- Added multi-select through box select.
- Added Shift/Ctrl multi-select support for runs.
- Added drawing from an existing endpoint or selected point.
- Added tee-point creation by splitting an existing run.
- Added branch-point creation for welded branch connections.
- Added detection when a new run connects back into an existing run.
- Improved reducer placement around bends and tee connections.

## Pipe Sizes, Materials And Weights

- Added NB pipe sizes up to NB 300.
- Added carbon steel Schedule 40 / standard-weight pipe data.
- Added stainless steel Schedule 10S option.
- Added material-dependent 3D colour styling.
- Added pipe-size selection per run.
- Added multi-run pipe-size changes.
- Added pipe-size scaling in the 3D preview.
- Added Atlas-table based pipe/fitting weights where available.
- Added estimated weights where no table data exists.
- Added cut length, centreline length, deduction and pipe weight summaries.
- Added take-off/order list grouped by size.
- Added fitting count/order list for flanges, tees, bends, reducers, sockets, roll grooves, valves and weld marks.

## Fittings And Fabrication Details

- Added flanges.
- Added single-flange and double-flange modes.
- Made single flange the default.
- Improved flange 3D model with bolt holes.
- Added reducers.
- Added automatic reducers when connected pipe sizes change.
- Added reducer side switching for reducers placed at bends.
- Added roll grooves with zero added weight.
- Improved roll groove visual placement near pipe ends.
- Added sockets with count and even spacing options.
- Added socket dragging along a pipe.
- Added socket rotation in 90 degree steps.
- Added socket position dimensions.
- Added weld markers.
- Replaced generic valves with butterfly valve-style 3D representation.
- Improved tee and branch rendering in 2D and 3D.
- Improved pipe ends to use flush-cut caps instead of rounded ends.

## Dimensioning Updates

- Added centre-to-centre pipe dimensions.
- Added cut length and deduction notes.
- Added red-line dimension style.
- Added numbered dimension style with a legend.
- Added chain-style dimension option.
- Improved dimension label placement to reduce overlaps.
- Added manual drag offsets for red dimension labels.
- Added socket measurement arrows and labels.
- Added lifting point dimensions.
- Added pipe-size labels on the 3D preview, with a toggle.
- Reduced 3D preview measurement clutter by moving cut detail into exports/cut list.

## 3D Preview Updates

- Added Three.js 3D pipe preview.
- Added fallback canvas 3D-style preview when Three.js is unavailable.
- Added carbon, stainless, workshop, red, ghost, outline and CAD-like preview modes.
- Improved carbon material appearance.
- Improved stainless material to appear more silver.
- Added smoother elbows.
- Added pipe diameter scaling based on NB size.
- Added flange, reducer, tee, branch, socket, valve and roll groove visual details.
- Added 3D labels for pipe sizes and lifting points.
- Added toggle to hide 3D labels.
- Improved mouse navigation, including smoother click-drag movement.
- Added reset, rotate and move controls.

## Export, Save And Project Management

- Added 3D image export.
- Added fabrication sheet/PDF-style export.
- Added project file export/import.
- Added local browser project saving.
- Added project details prompt with job number, spool number, revision, client and drawn-by fields.
- Added next-spool-number defaulting when starting a new drawing.
- Added Save and start new / Do not save / Cancel flow.
- Added saved project library grouped into project folders.
- Added previous project-number suggestions for faster project setup.
- Added project status workflow: draft, checked, issued and fabricated.
- Added locked drawing mode and revision history.
- Added project corner tag with job and spool number on drawings.
- Added backup snapshots.

## PWA, Mobile And Deployment Updates

- Added `manifest.webmanifest`.
- Added service worker app-shell caching.
- Added app icons.
- Added GitHub Pages/PWA deployment guidance.
- Added app version checking.
- Added update prompt/reload support when a newer version is available.
- Added cache-busting query strings for CSS and JavaScript.
- Improved iPad and Android layout behaviour.
- Added local-network testing guidance.

## Cloud Accounts And Teams

- Added Supabase authentication support.
- Added sign in and create account flows.
- Added remember me on this device.
- Added resend confirmation email.
- Added email-not-confirmed handling.
- Added trial/full licence profile fields.
- Added cloud project saving and opening.
- Added company/team tables and SQL setup.
- Added team creation and invite-code join flow.
- Added approved member access model.
- Added shared company project visibility.
- Added project comments/notes for team collaboration.
- Fixed Supabase SQL ambiguity issues around `company_id`.

## Lifting And Centre Of Gravity

- Added centre of gravity calculation from estimated component weights.
- Added COG marker.
- Added suggested lifting point calculation.
- Added lifting point toggle, default off.
- Added sling angle options.
- Added lifting point notes and dimensions.
- Added warnings that lifting points, COG, welds, sling angles and weights must be verified before lifting.

## Truck Loading Prototype

- Explored a truck loading planner for selected spools.
- Added tray and roof-rack size concepts.
- Tried top-view, isometric and 3D loading guides.
- Added selected-spool filtering by job and select all/deselect all controls.
- The feature was deprioritised because the result was not clear enough for real yard use.

## Known Follow-Up Areas

- Do a dedicated iPad workflow pass with fewer panels and bigger touch targets.
- Keep improving dimension label collision avoidance for dense spools.
- Verify all Atlas data and fitting weights against the latest supplier tables before production use.
- Decide whether branch-created split geometry should be visually merged as well as merged in the cut list.
- Consider a proper admin/licensing backend before public launch.
