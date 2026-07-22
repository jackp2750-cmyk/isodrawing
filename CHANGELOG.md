# SpoolMate Update Log

This log was reconstructed from the current project history and app state. Early work is grouped by feature area because the first prototype changes were not recorded as separate formal releases. Current app version: `v2.99.1`.

## v2.99.1 - Simple Team Dashboard and QR Workshop Flow
- Replaced the dense default team dashboard with Today, Full board and More views.
- Added three focused Today queues: Needs attention, My work and Ready next, with compact spool cards and one clear open action.
- Moved reports, team communications and recent activity behind More, while preserving the complete stage board for supervisors.
- Collapsed full-board assignment, due-date, priority, hold and message fields under Details and updates.
- Added an in-app rear-camera QR scanner with Android/iPad-friendly touch controls, saved-photo scanning and a paste-link fallback.
- Kept QR navigation on the current SpoolMate origin and continued to rely on signed-in project permissions for cloud access.
- Made the mobile spool traveller workshop-first with hold warnings, live stage/assignment/due details, drawing access, notes, photos and weld acceptance progress.
- Honoured the revision identifier carried by QR links by showing saved issued snapshots when available and warning clearly when a requested revision cannot be verified.
- Made project forms scroll safely on short landscape tablet screens so their Save actions stay reachable.
- Bumped the PWA cache to `spoolmate-v2991`.

## v2.98 - First Spool Launch Experience
- Added a recommended 5-minute Quick Start path covering drawing, exact and 45-degree runs, fittings, dimensions, checks and export.
- Added Try in drawing after every completed mini practice so the tutorial hands users directly to the correct live mode, panel or tool.
- Added a temporary First Spool workspace that reduces early visual density to Draw, exact length, Fittings, Select and Save, with an immediate Show all controls option.
- Added contextual real-app prompts that advance as users draw, add exact runs, open fittings, select, save, review checks and export.
- Added a live final checklist for drawing content, project details, checks, saved state and workshop PDF export.
- Kept the new guide responsive for desktop, iPad and Android tablet layouts, with persisted progress and a clear End tips action.
- Bumped the PWA cache to `spoolmate-v298`.

## v2.97 - New User Tutorial Polish
- Saved tutorial path, last topic and completed practice tasks locally so new users continue where they left off after closing or reloading the app.
- Added clearer progress wording and a Finish tour action with a useful completion/resume message.
- Added a real Hold 45° drawing control for iPad, Android and compact layouts so the touch tutorial now matches the live drawing workflow.
- Expanded Review guidance for automatic W01 weld numbering, welder/WPS and inspection/NDT tracking.
- Expanded Export guidance for issued spool/revision QR travellers and their mobile production information.
- Clarified the tutorial header and dashboard entry so users know practice is safe and resumable.
- Bumped the PWA cache to `spoolmate-v297`.

## v2.96 - Ask SpoolMate In-App Helper
- Added a responsive Ask SpoolMate panel for desktop, iPad and Android with large touch targets, suggested questions and safe-area-aware bottom-sheet behaviour.
- Added instant built-in answers for drawing, 45 degree offsets, fittings, checks, cloud spools, fabrication PDFs, weld registers and production workflows.
- Added direct Open tutorial, Open help, Solved and Still stuck actions so answers lead back into the existing learning tools.
- Added a protected authenticated Supabase `ai-help` Edge Function using the OpenAI Responses API and the cost-sensitive `gpt-5.6-luna` model.
- Kept the OpenAI API key server-side, whitelisted the small app context, omitted drawing/client content by default, disabled response storage and sent a hashed safety identifier.
- Added atomic daily allowances of 10 AI answers for trials and 50 for paid/full/grace accounts. Expired and guest users retain built-in help without API cost.
- Added `supabase-migration-v296-ai-helper.sql`, setup documentation, privacy wording and release checks for the helper.
- Bumped the PWA cache to `spoolmate-v296-helper`.

## v2.95 - Fair Trial Expiry and Read-Only Cloud Access
- Kept permitted cloud spools visible after trial expiry instead of making the account appear empty.
- Opened expired cloud spools in enforced read-only mode while preserving drawing, PDF, project and account-data exports.
- Kept existing cloud comments, workshop photos and team-message history readable after expiry while blocking new cloud activity.
- Added a 30-day trial plan panel, persistent seven/three/one-day warning stages and a clear expired-account banner.
- Added an Upgrade licence action with an honest manual-contact fallback until online checkout is connected.
- Added a seven-day payment-grace licence state for future billing recovery.
- Added a Cloud / This device switch to Jobs so signed-in users can always reach local browser projects.
- Hardened Supabase write policies for company administration, memberships, comments and workshop photos.
- Added `supabase-migration-v295-trial-access.sql` for existing databases and updated the complete setup SQL.
- Documented that expiry does not delete customer cloud data and that no automatic inactive-data deletion is enabled.
- Bumped app cache to `spoolmate-v295`.

## v2.94 - Launch Readiness Accounts and Support
- Added Supabase password-reset email requests and a recovery callback flow for choosing a new password.
- Added account-data export covering owned cloud drawings, memberships, authored messages and local browser projects.
- Added privacy, fabrication terms and support guidance inside the app, with a clear pre-launch legal/contact-details reminder.
- Added privacy-safe diagnostic downloads with app, device, PWA, cloud, drawing-health and regression status while excluding drawing content, credentials and raw error messages.
- Added clear offline/online status so workshop users know local projects remain available while cloud sync, team data and QR travellers are unavailable.
- Added a ten-step production launch smoke test to the existing regression Test Kit.
- Added a protected Supabase Edge Function for permanent account deletion, private-photo cleanup and team-owner safeguards.
- Bumped app cache to `spoolmate-v243`.

## v2.93 - True Shift 45 Tutorial
- Changed the 45-degree offset tutorial to match the real drawing workflow: enter the offset set, hold Shift for the angled travel, release Shift, draw the return and finish.
- Required Shift to remain held while the tutorial travel piece is dragged, with corrective guidance when it is not.
- Added a holdable on-screen Shift key so iPad and Android tablet users can complete the same practice with two-finger touch.
- Bumped app cache to `spoolmate-v242`.

## v2.92 - Tablet Tutorial Launch Polish
- Fixed the Beginner tutorial so it starts with drawing instead of checker approval.
- Replaced the oversized touch-device topic grid with a compact topic selector so the current lesson stays visible.
- Kept Back, Practice and Next controls reachable throughout the tutorial.
- Tuned the tutorial for iPad and Android tablets in portrait and landscape, including larger touch targets and safe-area padding.
- Bumped app cache to `spoolmate-v241`.

## v2.91 - Spool Traveller and Weld Traceability
- Added permanent spool and revision traceability identifiers that migrate automatically into existing saved drawings.
- Added automatic W01, W02 and later numbering for placed weld markers, with labels shown directly on the drawing.
- Added a weld register for welder ID, WPS, fabrication state, visual/NDT inspection, inspector and repair history.
- Added the weld register as a fabrication PDF page.
- Added QR spool travellers to issued fabrication PDFs, linked to the current authenticated cloud spool and revision.
- Added a mobile scan destination showing the current drawing, revision, production stage, assignment, due date, holds, active notes, private workshop photos and weld status.
- Kept traveller access behind the existing Supabase company/project permissions so private drawing and photo data is not made public.
- Bumped app cache to `spoolmate-v240`.

## v2.90 - Clear Revision Fix
- Added Revision missing as a visible, actionable Drawing checks card instead of reporting it only in a blocked-issue toast.
- Added a one-tap Set Rev A action that works while a checked drawing is locked.
- Made Issue drawing prompt for a missing revision with A prefilled, then continue the pre-issue check automatically.
- Stopped project-detail failures being counted again as generic drawing errors.
- Kept acknowledged reducer and tee/branch exceptions separate from missing project details in blocked-issue guidance.
- Set Revision A as the default for new drawings.
- Bumped app cache to `spoolmate-v238`.

## v2.89 - Checks Stay in Review
- Changed Show on drawing into a highlight-only inspection action.
- Kept Review mode and the Checks tab active while a reducer, tee, branch, open-end or other drawing finding is highlighted.
- Stopped Show on drawing from selecting the pipe, changing the active drawing tool or opening Properties.
- Kept the Inspector/Checks panel open on desktop, iPad and phone so users can work through findings without losing their place.
- Updated Review tutorial and Help guidance for the non-destructive inspection behavior.
- Bumped app cache to `spoolmate-v237`.

## v2.88 - Continuous Branch Main Sizing
- Made pipe-size changes propagate across both straight-through sections of a welded branch main.
- Kept the side branch outlet independent so its nominated size is never changed with the main.
- Applied the rule to top pipe-size controls, right-click/long-press size menus and multi-select edits.
- Followed linked main sections through multiple welded branch points and kept the whole continuous main consistent.
- Changed branch-main detection to geometry-first, using the most straight-through pair rather than assuming the largest connected legs are the main.
- Added clear context-menu guidance and a notice showing that linked main sections changed while the outlet remained untouched.
- Expanded the branch regression check and Pipe Size tutorial/help guidance for this fabrication rule.
- Bumped app cache to `spoolmate-v236`.

## v2.87 - Actionable Drawing Checks
- Rebuilt drawing check cards with plain-English fix guidance and dedicated actions instead of a single unexplained highlight.
- Added Set as tee and Set as branch actions so connection intent can be corrected directly from Review.
- Added Acknowledge & allow issue for intentional reducer or tee/branch exceptions, with a required reason, reviewer and timestamp saved in the spool.
- Added Reopen check so an acknowledgement can be withdrawn and made blocking again.
- Added acknowledged check decisions to production activity history and the pre-issue summary.
- Printed active acknowledged check reasons in fabrication-sheet notes so exported workshop documents retain the exception record.
- Changed internal regression test-kit failures from hard spool blockers to visible application diagnostics with an Open app test kit action.
- Improved blocked-issue notices and added a direct Review drawing checks action to the pre-issue card.
- Updated Review tutorial and Help guidance for the fix, acknowledge and self-test workflow.
- Bumped app cache to `spoolmate-v235`.

## v2.86 - Clear Visual Hierarchy
- Reserved blue for active tools, selected tabs and primary next actions instead of using it for ordinary hover states.
- Gave Save actions a consistent green treatment, destructive actions a consistent red treatment and export actions a distinct neutral treatment with the primary export remaining blue.
- Flattened the top action and settings groups, reduced nested borders and used spacing plus quiet separators to organise controls.
- Made version, sync, status, assignee, pipe-size and helper text less visually dominant while preserving readable state colours for saved, unsaved, warning and error states.
- Simplified inactive side tools and Inspector tabs while retaining clear touch boundaries on iPad and Android.
- Applied the same hierarchy to light and dark themes and documented the action colours in the Start tutorial.
- Added regression checks for semantic action classes and hierarchy tokens.
- Bumped app cache to `spoolmate-v234`.

## v2.85 - Focus Drawing and Jobs Separation
- Kept the 3D preview hidden by default and placed one clear 3D launcher beside Focus, Details and PDF in the drawing toolbar.
- Made 3D reopen as a compact movable overlay and saved its last position and size on the current device.
- Removed the dock/float choice from the compact 3D header while retaining Rotate, Move, Fit, Full, Minimize, Hide and view styles.
- Added Focus mode: the drawing fills the screen, a slim tool rail remains available, and Inspector or 3D open temporarily above the drawing.
- Added Escape and an explicit Exit control for leaving Focus without changing Draw, Edit, Review or Export mode.
- Moved the cloud spool conversation, @mentions and workshop-photo controls from the drawing Inspector into Jobs > Comms.
- Removed assignment, due-date, hold and activity editing from Review; it now shows a compact production summary with one Open Jobs action.
- Kept current status, assignee and save state visible in the drawing header.
- Quieted secondary borders and hover colours, reserved blue for active/primary actions, kept destructive actions red and gave Save a distinct green treatment.
- Added an interactive Focus tutorial topic and updated Help for the new 3D, Focus and Jobs communication workflows.
- Added release-verifier checks for Focus mode, remembered preview bounds and Jobs-only spool conversations.
- Bumped app cache to `spoolmate-v233`.

## v2.84 - Compact Tools and Inspector Drawer
- Reduced the permanent side rail to the six everyday tools: Draw, Select, Undo, Redo, Measure and Note.
- Grouped Tee, Branch, Flange, Reducer, Groove, Valve, Socket and Weld into a compact Fittings flyout, with the active fitting shown on its trigger.
- Kept Box Select and Delete available as clearly labelled selection utilities inside the flyout without taking permanent rail space.
- Turned the desktop Inspector into an on-demand right drawer that stays closed with no selection and opens automatically for selected runs, points, notes, measurements and fittings.
- Made Review and Export Inspector views full height so Cut List, Weights, BOM, Checks and Notes no longer squeeze the drawing into a permanent third column.
- Added a visible Details button to reopen the Inspector after closing it.
- Updated the Tee and end-fitting tutorial practices to teach the new Fittings-menu workflow before placement.
- Added release-verifier protection for the compact tool rail, Fittings flyout and Inspector drawer wiring.
- Bumped app cache to `spoolmate-v232`.

## v2.83 - Focused Workspaces
- Turned Draw, Edit, Review and Export into distinct workspaces that only show their relevant top settings, side tools and inspector tabs.
- Reduced the permanent action bar to Save, Jobs, Account, cloud-save state and Menu, with the current job/spool kept beside the mode switcher.
- Moved New spool and theme selection into the Setup/Project menu to remove rarely used controls from the drawing surface.
- Put PDF style, Export 3D, Fab PDF and Project file actions directly in the Export workspace.
- Limited Draw/Edit to the Properties inspector, Review to checks/workflow/notes plus fabrication summaries, and Export to Cut List, Weights and BOM.
- Made health checks switch cleanly into Review and prevented hidden inspector panels from opening behind the selected workspace.
- Added compact desktop, tablet, phone and dark-theme styling for the new workspace settings strip.
- Updated the tutorial and README for the simplified navigation.
- Bumped app cache to `spoolmate-v231`.

## v2.82 - Team Accountability Timeline
- Expanded each spool's activity history to retain up to 240 actor-and-time events, with the latest eight visible and older events available from an expandable timeline.
- Added activity records for single and multi-run pipe-size changes, checker returns, revision creation/restoration and revision issue.
- Added Jobs alerts for work due soon, spools returned by a checker and newly issued revision numbers, while avoiding duplicate return comments.
- Kept existing assigned-to-you, due-today, overdue, ready-to-check, comment and fabricated alerts in the same prioritized list.
- Updated the Production tutorial and README to explain the expanded timeline and alerts.
- Added release-verifier coverage for the new timeline retention and lifecycle alert wiring.
- Bumped app cache to `spoolmate-v230`.

## v2.81 - Full Release Integrity Audit
- Audited drawing, fitting, dimension, weight, pressure, lifting, 3D, export, save/open, cloud, PWA, tutorial and touch code paths.
- Corrected size-changing tee calculations to use an equal line-size tee plus a separate reducer, keeping tee deductions and weights from being mixed or double-counted.
- Added Atlas stainless Schedule 10S reducer weights by exact large/small size pair and kept unsupported/manual cases clearly estimated.
- Fixed iPad and Android long-press gesture ownership so pipe action sheets no longer compete with the inspector or selection underneath.
- Fixed touch selection of manual measurements and cleared stale selections when dragging notes, sockets, dimensions or using box select.
- Stopped the Tutorial action from opening twice through the main Menu event delegation.
- Corrected stainless steel tube to use the silver 3D and fallback material paths instead of carbon-black rendering.
- Aligned the installed PWA splash and theme colours with the light-mode default while preserving the saved dark-mode option.
- Added automatic save/open round-trip and stainless 3D material checks to the built-in Review Test Kit.
- Added `verify-app.cjs` to check syntax, UI references, icon/ARIA targets, version/cache wiring, PWA assets, engineering tables, frontend key safety and Supabase RPC definitions before release.
- Bumped app cache to `spoolmate-v229`.

## v2.80 - Standards-Accurate 3D Flanges
- Replaced generic scaled flange drilling with table-backed dimensions for ASME Class 150/300/600, AS 2129 Tables D/E/F/H, EN/DIN PN 10/16/25/40 and JIS 10K.
- Made flange outside diameter, plate thickness, bolt PCD, hole diameter and hole count respond to the selected flange standard and pipe NB.
- Kept unsupported intermediate sizes conservative by selecting the next available nominal flange table row rather than an undersized row.
- Showed open bolt holes on single flanges and bolts, gasket and both plates on double flange assemblies.
- Corrected bolt-hole rotation so holes straddle flange centre lines and reduced oversized gasket/fastener proportions.
- Added a flange drilling table check to the built-in regression kit and documented the behavior in Help and the tutorial.
- Bumped app cache to `spoolmate-v228`.

## v2.79 - Spool Conversation and Review Approval
- Replaced basic project comments with a spool conversation containing teammate @mentions and Resolve/Reopen controls.
- Added private workshop photo attachments using a secured Supabase Storage bucket and temporary signed image links.
- Fixed view/comment team members being blocked from commenting when they did not have permission to resave the drawing.
- Added Approve drawing with checker identity and an optional spool conversation comment.
- Added Return for changes with a required reason recorded in both conversation and activity history.
- Kept issued drawings locked and preserved the issued snapshot before automatically starting the next revision when returned.
- Required checker approval before a spool can be issued or moved into fabrication stages.
- Added checked-by and issued-by details to every saved revision entry.
- Prevented Jobs board stage menus and drag/drop from bypassing the approve/return review path.
- Added interactive tutorial practices for spool conversation, photos, resolution, approval, issue and return.
- Updated `supabase-setup.sql` with conversation columns, secure resolve RPC and private spool-photo policies.
- Bumped app cache to `spoolmate-v227`.

## v2.78 - Team Production Dashboard
- Consolidated the Jobs overview into one team dashboard instead of repeating separate alert and command panels.
- Added clickable Assigned to me, Due today, Overdue, Ready to check and On hold queues above the production board.
- Added a recent team activity feed that opens the affected spool directly.
- Kept Daily report, Weekly report and Team comms actions together in the dashboard header.
- Required a clear reason whenever a spool is placed on hold from either the open spool or a Jobs board card.
- Expanded the interactive Production tutorial to cover queues, assignment, stage changes, holds and hold reasons.
- Bumped app cache to `spoolmate-v226`.

## v2.77 - Tutorial Real-Workflow Pass
- Reworked tutorial steps to use the mini drawing itself instead of duplicate shortcut buttons.
- Added real inputs and menus for exact lengths, 45 offset set, flange standard, pipe sizes, messages and editable dimensions.
- Added a clear highlight around the exact next control for every tutorial phase.
- Preserved tutorial scroll position between phases and stopped the panel jumping after drawing a run or tee.
- Kept the practice layout stable after completion so the tutorial no longer appears to close or resize when a task is finished.
- Replaced the unclear 3D practice graphic with a recognisable shaded pipe spool that responds to drag rotation.
- Hardened tutorial pointer capture for iPad/Safari and kept long-press socket practice stable.
- Bumped app cache to `spoolmate-v225`.

## v2.76 - Tutorial Slow Pass Polish
- Hid the animated demo while a mini practice is active so new users focus on the actual try-it task.
- Cleaned up Draw, Tee and 45 offset mini drawings so points only appear when they are relevant.
- Changed the socket practice to require a real hold gesture on the mini pipe/socket before the action menu appears.
- Reduced tutorial jumpiness by only scrolling the next control into view when it is actually outside the tutorial card.
- Bumped app cache to `spoolmate-v224`.

## v2.75 - iPad Long-Press Menu Cleanup
- Fixed iPad long-press on pipe runs so the inspector/selection sheet closes before the pipe action menu opens.
- Prevented the pipe actions such as Add flange, Add sockets and Change pipe size from being covered by the tablet panel layer.
- Bumped app cache to `spoolmate-v223`.

## v2.74 - iPad Layout Tidy Pass
- Added a tablet-specific compact layout for iPad/field use so the drawing gets more space.
- Tightened the topbar by hiding brand copy, compacting workflow/action buttons and keeping settings in a horizontal quick-controls strip.
- Reduced iPad bottom tool rail height and button size while keeping touch targets usable.
- Tuned iPad inspector/preview sheets and context menus so they cover less of the drawing.
- Bumped app cache to `spoolmate-v222`.

## v2.73 - Tutorial Completion Stays Open
- Changed completed tutorial practices so the mini task stays visible instead of being replaced by only a small finished panel.
- Kept the completed example on screen with a Done message so new users can review what they just did.
- Updated the complete-state message to point users toward Try again or Next without making the practice feel closed.
- Bumped app cache to `spoolmate-v221`.

## v2.72 - Socket Tutorial Real App Flow
- Reworked the socket mini practice to follow the real app flow: pipe context menu, Add sockets, size, quantity, spacing, Apply, socket context menu and Rotate.
- Added a mini socket setup panel with preview, socket size choices, count choices and spacing choices instead of skipping straight to Apply.
- Changed socket practice so sockets only appear on the mini drawing after the Apply step.
- Added light and dark styling for the tutorial socket context/setup panels.
- Bumped app cache to `spoolmate-v220`.

## v2.71 - 3D Tutorial Mode Clarity
- Changed the 3D tutorial progress labels to Style, Mode and Drag.
- Reworked the 3D mini practice controls so view style and navigation mode are shown as separate controls.
- Added compact mode-row styling so Rotate, Move and Fit read like 3D preview controls instead of unrelated big buttons.
- Bumped app cache to `spoolmate-v219`.

## v2.70 - 3D Tutorial Step Order Fix
- Changed the 3D tutorial mini practice so the drag model appears as an active target only after Rotate is selected.
- Renamed the 3D practice progress from Spin to Drag so it matches the real action.
- Added a muted locked state for the mini 3D model before it is ready to drag.
- Bumped app cache to `spoolmate-v218`.

## v2.69 - 3D Tutorial Practice Cleanup
- Changed the 3D preview mini practice so the model must be dragged sideways instead of completed with a simple tap.
- Added clearer "drag sideways" cueing and live mini-model rotation while practising the 3D preview.
- Added dark-mode styling for the 3D tutorial model cue.
- Bumped app cache to `spoolmate-v217`.

## v2.68 - 45 Tutorial Marker Cleanup
- Removed the generic sample-pipe dots from the 45 degree offset tutorial diagram.
- Simplified the 45 tutorial markers so only A start, B travel end and C return end are shown.
- Added quieter completed-point styling for the 45 tutorial in light and dark themes.
- Bumped app cache to `spoolmate-v216`.

## v2.67 - Tutorial Teaching Pass
- Live-tested the beginner tutorial in the local app and tightened the lessons around actual user actions.
- Stopped the Tee mini practice from jumping straight to completion after drawing the branch; it now shows the branch and asks users to finish drawing.
- Cleaned up the 45 degree offset mini practice with A/B/C points, clearer set/travel/return labels and less repeated instruction text.
- Fixed tutorial SVG touch targeting so decorative points do not block the active drag target.
- Clarified Pipe Size wording so reducer practice does not describe the smaller pipe as a branch weld-in.
- Bumped app cache to `spoolmate-v215`.

## v2.66 - Tutorial Action Pass
- Reworked the 45 degree offset tutorial so users pick 45 degrees, set the offset distance, drag the angled travel piece, drag the straight return run and finish drawing.
- Reworked the Tee tutorial so users tap the main run and then drag the branch from the tee point instead of clicking through a fake endpoint.
- Added shared tutorial drag handling for Draw, Tee and 45 offset mini-practice steps.
- Updated beginner tutorial wording so the practice cues match the real action users need to perform.
- Bumped app cache to `spoolmate-v214`.

## v2.65 - Draw Tutorial Drag Fix
- Changed the first Draw tutorial mini practice so it starts with a blank isometric pad instead of a pre-drawn pipe.
- Made the Draw tutorial require an actual drag from the yellow start point to the blue end point before it advances.
- Reworded the Draw beginner lesson to explain press-and-drag drawing clearly for new users.
- Added visible drag preview, end target and miss guidance for the mini practice.
- Added matching dark-mode styling for the tutorial drag target and preview line.
- Bumped app cache to `spoolmate-v213`.

## v2.64 - Beginner Tutorial Path
- Made the tutorial open to a Beginner tour by default instead of Jobs/team workflow topics.
- Added Beginner tour / All topics switching so new users see drawing basics first and advanced workflow topics remain available.
- Updated tutorial Next/Back, topic counts and menu filtering to follow the selected path.
- Reworded the first drawing lessons for brand-new users learning their first spool.
- Added light/dark styling for the tutorial path switch and beginner explanation card.
- Bumped app cache to `spoolmate-v212`.

## v2.63 - Tutorial Reliability Pass

- Fixed the Draw tutorial mini flow so it now advances through Draw, start point, end point and Finish drawing.
- Moved the mini practice panel above the demo so the next action is visible first instead of buried below the lesson content.
- Added automatic scrolling to keep the current tutorial practice action in view as each step advances.
- Replaced fake tutorial buttons with passive labels so every button that looks clickable has a purpose.
- Hardened tutorial click handling for SVG hotspots and buttons by reading the choice attribute consistently.
- Added a clean completed-state panel so finished lessons do not leave stale clickable practice controls behind.
- Bumped app cache to `spoolmate-v211`.

## v2.62 - Self-Contained Tutorial Flow

- Reworked tutorial practice so lessons stay inside a stable full-size tutorial window instead of moving into a small floating coach panel.
- Stopped tutorial topics from changing the live drawing mode, opening hidden panels or highlighting giant controls while users are learning.
- Added clearer visible next-action buttons for drawing, tee, socket, fitting, measuring and exact-length mini practice steps.
- Changed tutorial buttons to consistently use Start practice, Restart practice and Try again wording.
- Kept the real 3D preview minimized while the tutorial is open so it cannot cover the lesson.
- Replaced the old Tool to try label with a simple Safe practice note so long pipe-size menus do not clutter the tutorial.
- Bumped app cache to `spoolmate-v210`.

## v2.61 - Tutorial Polish Pass

- Stopped mini tutorial practices from auto-completing just because a real app panel opened.
- Added step-by-step progress chips to every mini practice so users can see exactly where they are.
- Made only the current highlighted target clickable inside mini isometric practice drawings.
- Disabled future-step buttons until the tutorial is ready for them, removing dead-click moments.
- Cleaned up the socket and exact-length mini practices so they feel more like guided workflows.
- Improved active target cues and dark-mode styling for tutorial practice controls.
- Bumped app cache to `spoolmate-v209`.

## v2.60 - Realistic Tutorial Mini Workflows

- Reworked tutorial mini practice boxes so each topic follows a realistic app workflow instead of a generic click-to-complete demo.
- Made Tee practice use the actual sequence: choose Tee, click the main run, then pick the branch endpoint.
- Added richer guided mini flows for Jobs, team comms, production board, pipe size reducers, sockets, dimensions, 3D preview, checks and export.
- Improved tutorial trainer button, menu, reducer and socket styling in light and dark themes.
- Bumped app cache to `spoolmate-v208`.

## v2.59 - Tutorial Mini Trainer Boxes

- Added safe mini practice boxes inside the tutorial so users can click, select, type and complete small simulated tasks before using the real drawing.
- Added mini trainers for drawing, selecting, tees, flanges, measuring, pipe size, exact lengths, angles, dimensions, 3D, checks, export, Jobs and Comms topics.
- Changed Jobs and Comms tutorial Try actions to use the mini trainer instead of opening extra dashboards over the tutorial.
- Added dark-mode styling for the trainer practice boxes.
- Bumped app cache to `spoolmate-v207`.

## v2.58 - Interactive Tutorial Practice Mode

- Added guided tutorial practice mode so Try it starts a real task, shows a live coach prompt and marks the topic complete when the user performs the action.
- Made tutorial topics show completed states for tools that have been practised in the current session.
- Compact the tutorial card during practice so the drawing pad, Jobs dashboard or 3D preview is easier to use.
- Improved Jobs tutorial actions so Try it opens the Jobs dashboard instead of only highlighting the button.
- Bumped app cache to `spoolmate-v206`.

## v2.57 - Pressure Note and Title Block Polish

- Changed weakest pressure displays to use kPa first, with bar shown in brackets.
- Moved the live weakest pressure indicator off the pipe and into a tidy top-right drawing note.
- Combined job and spool details into a cleaner top-right drawing title/note block.
- Dropped the numbered dimension key below the top-right note so the two blocks do not sit on top of each other.
- Bumped app cache to `spoolmate-v205`.

## v2.56 - Live Pressure Drawing Callout

- Added a live 2D drawing callout on the weakest estimated pressure run, with a marker on the pipe and a compact pressure/size badge.
- Positioned the pressure badge using the existing drawing label layout so it tries to avoid dimension and pipe-size label clashes.
- Kept the callout advisory-style and consistent with the Checks/Weights weakest pressure result.
- Bumped app cache to `spoolmate-v204`.

## v2.55 - Weakest Pressure Advisory

- Added a weakest pressure point warning in Checks so the app identifies the lowest estimated pipe-wall pressure run in the current spool.
- Added the weakest pressure estimate to Properties, Weights and the takeoff summary.
- Made the pressure warning clickable so it highlights/selects the affected run on the drawing.
- Worded the result as a pipe-wall estimate only, excluding fittings, flanges, gaskets, corrosion allowance, temperature and final design-code verification.
- Bumped app cache to `spoolmate-v203`.

## v2.54 - Stainless Tube Material

- Added a separate Stainless tube 1.6 material/category using Atlas Section 4 stainless tube OD sizes.
- Added Atlas stainless tube bend, tee and reducer table weights where available, with tube-specific bend radius, tee takeoff and reducer length allowances instead of NB pipe fitting allowances.
- Updated the material and size pickers, drawing labels, inspector, takeoff list and PDF report wording so tube drawings show Tube OD labels instead of NB pipe labels.
- Kept socket selections on the normal NB socket-size list so small socket fittings do not get confused with tube OD sizes.
- Bumped app cache to `spoolmate-v202`.

## v2.53 - Fullscreen Dialog Fix

- Fixed fullscreen edits so field input dialogs, note dialogs, confirmations, context menus and tutorial/help overlays appear above the fullscreen drawing or preview panel.
- Changed panel fullscreen to use SpoolMate's app fullscreen layer instead of browser-native fullscreen, keeping edit popups in the visible app layer.
- Added stronger phone/tablet fullscreen menu z-index overrides so long-press menus are not hidden behind the panel.
- Bumped app cache to `spoolmate-v201`.

## v2.52 - Dimension Export Fit

- Fixed numbered export dimensions so the full red dimension line, extension lines and label are considered during layout, not just the small label box.
- Reduced numbered export dimension offsets so the D/O tags stay closer to the spool and rely on the editable dimension key for detail.
- Tightened the export safe margins back down so drawings use more of the sheet without throwing dimension lines outside the frame.
- Bumped app cache to `spoolmate-v200`.

## v2.51 - Fullscreen Tool Rail Fix

- Fixed drawing fullscreen so the tool rail sits above the normal topbar instead of being hidden behind it.
- Made the fullscreen desktop tool rail vertically scrollable when there are more tools than the screen height allows.
- Kept tablet and phone fullscreen tool rails above the drawing panel while preserving their horizontal scroll behavior.
- Bumped app cache to `spoolmate-v199`.

## v2.50 - Export Drawing Fit

- Added a print-safe viewport for 2D drawing exports so red dimension labels and extension lines stay away from the sheet edges.
- Moved the numbered dimension key lower in exported drawings so it no longer crowds the job/spool tag.
- Used the same safe viewport for export scaling so large spools leave room for dimensions instead of fitting only the pipe centreline.
- Bumped app cache to `spoolmate-v198`.

## v2.49 - Calculation Audit

- Added stainless Sch 10S kg/m values using the stainless steel pipe mass coefficient instead of reusing the carbon coefficient.
- Replaced automatic reducer end-to-end length estimates with fixed standard reducer lengths by large-end NB.
- Made 45 degree elbows use the separate 45 degree fitting weight table entry where available instead of halving the 90 degree elbow weight.
- Clarified weight notes so branch welds, valves, sockets, adjusted flange standards and manual allowances are shown as estimates unless manually set.
- Bumped app cache to `spoolmate-v197`.

## v2.48 - Fab Sheet Finish

- Tightened the workshop PDF drawing crop so the spool uses more of the available drawing area.
- Made the fabrication title block more document-like with a top accent bar, sheet-type badge and issued/draft badge.
- Gave the workshop cut summary clearer table headers with units and drawing-ID wording.
- Added fitting/material detail text to the compact BOM/take-off rows so ordering information is easier to read.
- Made compact workshop totals denser so the sheet keeps more information on one page.
- Bumped app cache to `spoolmate-v196`.

## v2.47 - Pre-Issue Polish

- Added a pre-issue check card to the workflow panel with project details, drawing health, Review Test Kit and checked-state status.
- Made Issued/Cutting/Fit-up/Welded/Paint/Fabricated status changes run through the issue gate when the spool has not been issued yet.
- Recorded issued-by and issued-at details in saved projects, workflow history and fabrication sheet title blocks.
- Improved phone field mode with cleaner bottom-sheet context menus, larger menu rows and one-time hidden 3D preview default on phones.
- Bumped app cache to `spoolmate-v195`.

## v2.46 - Drawing Trust and Team Alerts

- Added automatic Review Test Kit checks for tee reducers, welded branches with no reducers, flush end flanges, 45 degree offset travel and socket spacing.
- Added pass/fail cards to the Test Kit so risky drawing behaviours can be checked before showing or uploading a new build.
- Expanded Team alerts to include new comments/messages plus recent Issued and Fabricated status changes.
- Styled the new checks and alert types for both light and dark themes.
- Bumped app cache to `spoolmate-v194`.

## v2.45 - Production Command Centre

- Added a Production command centre above the Jobs board lanes with action shortcuts for Due today, Overdue, Ready check, Assigned to me, On hold and Messages.
- Added board filters for Due today, Ready check and open production Messages so supervisors can narrow the board faster.
- Added quick Daily report, Weekly report and Comms actions directly inside the production workflow area.
- Updated the Jobs tutorial wording to teach the new command-centre shortcuts.
- Bumped app cache to `spoolmate-v193`.

## v2.44 - Fab Sheet Polish

- Made the workshop PDF use a fixed landscape sheet so the drawing and tables stay readable instead of shrinking with long lists.
- Tightened the drawing crop around the actual spool centreline for less empty space on exports.
- Reworked the title block with clearer job, spool, revision, status, checked and export metadata.
- Cleaned up the workshop cut list and BOM/take-off summary with denser tables, row limits and links to the full material-order style for long lists.
- Improved the 3D model reference page with a cleaner layout, clearer view cards and better captions.
- Bumped app cache to `spoolmate-v192`.

## v2.43 - Drawing Label Clarity

- Added a Pipe labels control for Auto, Key sizes, All sizes, Export only and Hide.
- Let users keep the live drawing clean while still printing key pipe-size labels on fab sheets.
- Kept numbered dimensions and draggable dimension offsets independent from pipe-size label clutter.
- Bumped app cache to `spoolmate-v191`.

## v2.42 - Exact Isometric Export Camera

- Changed the fab-sheet/export 3D Isometric camera to the exact same axis relationship as the 2D isometric drawing.
- Replaced the previous approximate export direction with a true `[-X, -Y, -Z]` isometric view, so +X reads down-right, +Y down-left and +Z upward like the drawing.
- Bumped app cache to `spoolmate-v190`.

## v2.41 - 3D Isometric Orientation Match

- Verified the live 3D default camera against the 2D isometric axis projection: +X runs down-right, +Y runs down-left and +Z runs upward.
- Changed the fab-sheet/export 3D Isometric camera to use the same Z-side orientation as the live preview, preventing exported model views from looking backwards against the drawing.
- Bumped app cache to `spoolmate-v189`.

## v2.40 - iPad Preview Dock Polish

- Hid the floating Show 3D restore button on tablet and phone layouts so it no longer overlaps the bottom drawing tools.
- Made tablet/touch devices default the 3D preview to the docked bottom-sheet panel instead of inheriting the desktop floating preview preference.
- Made the iPad 3D Preview dock button force the cleaner tablet sheet view, while still leaving the Float control available once the preview is open.
- Bumped app cache to `spoolmate-v188`.

## v2.39 - Hidden 3D Startup

- Made the 3D preview start hidden by default so the drawing canvas opens cleaner.
- Kept the existing Show 3D restore button and mobile 3D panel action for quick access when the preview is needed.
- Added the hidden state directly to the startup HTML to avoid the preview flashing open while the app loads.
- Bumped app cache to `spoolmate-v187`.

## v2.38 - Matched Cut List Labels

- Matched Cut List pipe-run labels to the numbered drawing key, so rows now use IDs such as `D1`, `D2` and merged branch cuts such as `D1+D2`.
- Kept point-to-point run detail as secondary information under the cut row instead of making it the main label.
- Updated fab sheet run tables to use the same cut-row IDs and branch-merged cut rows as the app Cut List tab.
- Bumped app cache to `spoolmate-v186`.

## v2.37 - Branch Reducer Separation

- Kept Branch and Tee behaviour separate when pipe sizes change.
- Preserved the branch marker after the Branch tool splits a straight main run, so it does not get cleaned up before the branch leg is drawn.
- Prevented automatic reducers from being generated at branch-weld nodes; reducers now stay limited to normal run/bend changes and tee connections.
- Updated the pipe-size tutorial text to clarify that branch welds are cut into the main pipe with no reducer.
- Bumped app cache to `spoolmate-v185`.

## v2.36 - Light Theme Refresh

- Made Light the default theme for new devices while preserving an existing saved Dark preference.
- Retuned the light UI palette from mint green to a cleaner steel/CAD look with warm white panels, graphite text and cyan-blue controls.
- Updated the topbar, action cluster, project chips, auth tabs, panel bars and dashboard primary action to match the refreshed light theme.
- Updated the browser/PWA theme colour for light mode.
- Bumped app cache to `spoolmate-v184`.

## v2.35 - App Notices and Confirmations

- Replaced native browser alert boxes with SpoolMate toast notices for saved, copied, imported, warning and error messages.
- Replaced native browser confirm boxes with a SpoolMate confirmation modal for delete, restore, open, reload, overwrite and replace actions.
- Added safer confirm styling for destructive actions, including red delete/overwrite confirmation buttons.
- Added mobile-friendly toast placement and dark-mode blue styling.
- Bumped app cache to `spoolmate-v183`.

## v2.34 - Polished Input Dialogs

- Replaced native browser prompt boxes with a SpoolMate-styled input dialog for pipe length, offset C/C, bend angle, measurement labels, fitting weights and checked-by names.
- Added unit pills for mm, kg and degrees so field edits are clearer.
- Added a larger read-only report text dialog when clipboard copy is blocked.
- Wired the new dialog into Escape handling and keyboard shortcut blocking.
- Bumped app cache to `spoolmate-v182`.

## v2.33 - Regression Test Kit
- Added a Review menu Test Kit with built-in regression sample spools for workshop basics, reducing tees, welded branches and 45 degree offsets with sockets.
- Added expected-behaviour checklists for each sample so updates can be checked against known examples.
- Added a manual post-update checklist for Enter-to-stop drawing, right-click/long-press menus, 3D movement, PDF export and mobile/tablet usability.
- Loading a test sample now clears cloud state, opens the review checks and resets next IDs safely.
- Bumped app cache to `spoolmate-v181`.

## v2.32 - Mobile and Tablet Field Mode
- Added an automatic field-layout mode for touch devices with a cleaner topbar, larger drawing tools and clearer panel access.
- Moved Account access into the main Menu so touch screens can keep the top action area focused on New, Save, Jobs and Menu.
- Improved long-press/right-click menus on touch screens with a bottom-sheet layout, larger actions, a grab handle and a visible Close button.
- Increased touch hit zones for tool buttons, mobile panel buttons and action-sheet controls.
- Bumped app cache to `spoolmate-v180`.

## v2.31 - Drawing Trust Pass
- Locked endpoint fittings tighter so flanges and roll grooves always store on a pipe end, including older saved drawings that had near-end positions.
- Added redraw-time geometry cleanup for stale branch flags, reducer-side overrides, invalid fitting references and invalid selections.
- Kept selected pipe sizes in sync with the drawing default so continuing from a selected run is less likely to fall back to the wrong NB.
- Normalized new run pipe sizes when pipes are created.
- Made Enter stop drawing from Draw, Tee and Branch states, including when a pending drag is active.
- Bumped app cache to `spoolmate-v179`.

## v2.30 - Fab Sheet and Field Export Polish

- Tightened fabrication PDF page margins and drawing report margins so exported spools fill more of the page.
- Enlarged the report drawing area and made the export projection use less blank padding while still leaving room for tags and dimensions.
- Renamed the take-off PDF style to Material order / take-off sheet and improved wide report tables so they use the available sheet width.
- Added safer empty-drawing handling for report projection and larger touch targets for tablet/phone workflow buttons.
- Bumped app cache to `spoolmate-v178`.

## v2.29 - Compact Header Spacing

- Reworked the top command bar into a tighter two-band layout so the mode/actions row and drawing setup controls use the available width more evenly.
- Split the setup controls into full-width grouped panels for project, pipe and drawing display settings.
- Bumped app cache to `spoolmate-v177`.

## v2.28 - Sorted Top Command Bar

- Reworked the top command area into clearer groups: brand/mode switching, project workflow, pipe setup, drawing view controls and project actions.
- Added responsive rules so the command bar stays organised on laptop, tablet and phone widths.
- Bumped app cache to `spoolmate-v176`.

## v2.27 - Code Audit and Status Metadata Fix

- Ran a code audit over the recent Jobs, activity history and production workflow changes.
- Fixed the top Status dropdown so setting a drawing to Fabricated now also records production completion metadata, matching the Jobs board quick action behaviour.
- Verified direct HTML listeners point at existing elements and service-worker cached files exist.
- Bumped app cache to `spoolmate-v175`.

## v2.26 - Activity History and Team Alerts

- Added automatic activity history on each spool for status changes, assignment changes, due-date changes, priority changes, hold changes and production notes.
- Show the latest activity on production cards and the last few activity items inside opened job folders.
- Added an Activity history card to the open drawing Workflow panel.
- Added Team alerts to the Jobs dashboard for overdue spools, due-today spools, spools assigned to you, ready-to-check spools and open production notes.
- Added a better job-level dashboard inside opened job folders with totals for total, ready check, checked, issued, fabricated, overdue and on hold.
- Added a clean Needs doing today list inside each opened job folder.
- Updated the Production board tutorial topic for alerts and activity history.
- Bumped app cache to `spoolmate-v174`.

## v2.25 - Production Board Workflow Polish

- Made the Jobs production board feel more like a workshop board with filters for Active, Due soon, Overdue, On hold, Mine and All.
- Added clearer production-card badges for stage, due state, priority and holds, plus a hold-reason field directly on each card.
- Added quick card actions for Ready, Issued and Fabbed so common stage changes do not require opening a dropdown.
- Reworked daily/weekly Jobs reports into a clearer handover format with next actions, checking queue, issue/fabrication queue, holds/blockers, assignee workload and recent progress.
- Added assignee suggestions from approved team members and saved project assignees.
- Added a Production board tutorial topic.
- Bumped app cache to `spoolmate-v173`.

## v2.24 - Team Roles and Fab Sheet Templates

- Added owner/admin/member permission handling in the app: owners can change member roles, admins can approve users and manage shared team spools, and members get view/comment access on shared spools they do not own.
- Made shared cloud spools read-only for members who should not edit them, including workflow controls, production board fields, drag/drop, undo/redo and drawing edits.
- Tightened Supabase policies so team members can read/comment shared spools, project owners or company admins can edit cloud spools, admins can approve normal member requests, and owners control role changes.
- Added fabrication PDF styles: Workshop cut sheet, Client / approval sheet and Fitting / take-off sheet.
- Updated tutorial copy for team roles and PDF style selection.
- Bumped app cache to `spoolmate-v172`.

## v2.23 - Cloud Save Confidence

- Made the cloud status pill visible so users can see Local only, Cloud ready, Not cloud saved, Unsaved changes, Saving to cloud, Saved, Cloud save failed and Cloud conflict states.
- Stored lightweight browser-side cloud save metadata so the last cloud save time survives refreshes for the current project.
- Added a remote updated-time check before cloud writes so autosave pauses on a newer cloud copy and manual Save asks before overwriting another device's changes.
- Reset cloud confidence cleanly when opening browser/cloud projects, deleting the active cloud project, loading the sample or starting a new spool.
- Bumped app cache to `spoolmate-v171`.

## v2.22 - Menu Button Reliability

- Reworked the Menu button toggle so touch/mouse pointer events no longer immediately double-toggle with the follow-up click.
- Kept the top action strip from clipping the open Menu panel.
- Raised the Menu panel above the floating preview and full-screen drawing layers.
- Bumped app cache to `spoolmate-v170`.

## v2.21 - Tutorial Clarity Fix

- Fixed tutorial target labels so dropdowns no longer dump every menu option into the "Tool to try" callout.
- Made tutorial target wording explicit for each topic, such as "Pipe NB menu" and "Dimension style menu".
- Put the tutorial card above the spotlight layer so the glow no longer draws an empty box over the tutorial panel.
- Strengthened tutorial light and dark mode contrast with solid card, menu, demo and callout backgrounds.
- Bumped app cache to `spoolmate-v169`.

## v2.20 - Larger Tutorial Layout

- Made the interactive tutorial a larger centered learning panel so it feels calmer and less cramped.
- Changed the tutorial into a two-column layout with the topic menu on the left and the current feature lesson/demo on the right.
- Removed the desktop internal tutorial scroll areas by giving topics and content more room.
- Added a smoother topic transition when switching tutorial sections.
- Bumped app cache to `spoolmate-v168`.

## v2.19 - Tutorial Topic Menu

- Reworked the interactive tutorial into a clickable topic menu so users can jump straight to the feature they want to learn.
- Added a Team Comms tutorial topic with a mini demo and an action that opens the Jobs Comms view.
- Kept Next and Back for guided walkthroughs while replacing the old dot-only progress strip.
- Added a small pattern for future feature work: each new feature should get a tutorial topic at the same time it is added.
- Bumped app cache to `spoolmate-v167`.

## v2.18 - Team Communication Dashboard

- Added a Jobs `Comms` view for shared company messages and active spool/yard notes in one place.
- Added Supabase `team_messages` setup with row-level security for approved company members.
- Kept team communication responsive on tablet/phone so the Jobs dashboard does not become another cramped side panel.
- Fixed the Jobs dashboard toolbar grid so Guide, Comms, Report, New spool and Save current all have defined space.
- Bumped app cache to `spoolmate-v166`.

## v2.17 - Flange End-Fitting Split Fix

- Fixed tee/branch splitting so flanges and roll grooves are no longer pushed 4% in from the pipe end when a run is split.
- Changed flange and roll groove placement to snap to the nearest run end by design, rather than relying on a short distance threshold.
- Migrated existing flange/groove positions to true endpoint values during normal app updates.
- Made inspector, weight and COG positions use the displayed endpoint location for flanges and roll grooves.
- Bumped app cache to `spoolmate-v165`.

## v2.16 - Tee-Side Flange Placement

- Made endpoint fitting placement keep the original right-click position so endpoint snaps can use screen distance as well as pipe distance.
- Allowed deliberate flange/groove snaps at tee and branch points when the point itself is clicked.
- Made the 3D flange and roll groove renderer respect tee and branch visual clearance, so endpoint fittings sit at the edge of the tee/branch body instead of floating or burying into it.
- Bumped app cache to `spoolmate-v164`.

## v2.15 - Endpoint Flange Snap Fix

- Added a physical end-snap rule so flanges and roll grooves within 150 mm of an open pipe end are treated as endpoint fittings.
- Made right-click fitting placement and direct Flange/Groove tool clicks snap to open pipe endpoints consistently.
- Updated open-end checks to recognise snapped endpoint flanges and grooves.
- Bumped app cache to `spoolmate-v163`.

## v2.14 - 3D Flange Anchor Fix

- Anchored endpoint flanges to the rendered 3D pipe endpoint after bend and reducer trims are applied.
- Kept single end flanges flush with the visible pipe instead of allowing them to float off trimmed pipe ends.
- Bumped app cache to `spoolmate-v162`.

## v2.13 - Note Callout Polish

- Split drawing notes into a fixed arrow anchor and a separately draggable text label.
- Replaced the browser note prompt with a SpoolMate note editor dialog.
- Added note text colour choices and a default note colour selector in the Notes panel.
- Included dragged note labels in drawing bounds so exports are less likely to crop them.
- Bumped app cache to `spoolmate-v161`.

## v2.12 - Menu Reliability Fix

- Made the Menu button respond to pointer release as well as normal clicks so touch devices and overlay-heavy states can still open it.
- Raised the top bar above the floating 3D preview so the preview cannot intercept taps on Menu or cover the opened menu.
- Bumped app cache to `spoolmate-v160`.

## v2.11 - Tutorial Clarity Pass

- Expanded the interactive tutorial with clearer feature steps for tees/branches, end fittings, pipe-size reducers and fab sheet exports.
- Added new mini demos for flanges/grooves/reducers, automatic reducers and fab PDF output.
- Minimized the 3D preview automatically while the tutorial is running, then restored the user's previous preview layout when the tutorial closes.
- Updated tutorial wording so the mini demo, highlighted control and Try it button flow is clearer.
- Bumped app cache to `spoolmate-v159`.

## v2.10 - Tablet and Mobile Layout Pass

- Reworked the top settings strip so it wraps into usable controls instead of acting like a horizontal slider.
- Added a separate tablet layout class so iPad can use a touch-first layout without inheriting every phone rule.
- Simplified phone top controls by hiding lower-priority setup items and giving the remaining controls larger tap zones.
- Enlarged mobile drawing tool buttons and bottom tool rails for Android/iPad touch use.
- Kept drawing tools visible in full-screen drawing mode and hid the mobile panel dock there to prevent overlap.
- Bumped app cache to `spoolmate-v158`.

## v2.07 - 3D Model Trust Pass

- Tightened roll groove geometry so end grooves read as narrow bands close to the pipe end instead of wide sleeves.
- Anchored endpoint flanges to the true spool end so bend/reducer pipe trimming cannot make a flange appear separated from the pipe.
- Added render-length limiting for automatic reducers so reducers cannot visually overpower short pipe sections.
- Made reducer trimming use the same length as the rendered reducer mesh.
- Reduced bulky 3D tee centre spheres and added branch rings for clearer tee joins.
- Slimmed welded branch collars so branches read more like pipe welded into a main run.
- Bumped app cache to `spoolmate-v155`.

## v2.06 - Interface and Dimension Cleanup

- Split the main header into a compact settings group and a separate action group for New, Save, Jobs, Account and Menu.
- Renamed dimension controls to make the default numbered key workflow clearer.
- Added an on-drawing hint when numbered dimensions are active, showing that `D/O` rows can be selected to edit centre-to-centre values.
- Improved the numbered dimension key contrast in dark mode.
- Tightened fabrication sheet/PDF drawing crop so the spool uses more of the drawing frame.
- Bumped app cache to `spoolmate-v154`.

## v2.05 - Drawing Import Assistant

- Added a side feature for uploading a supplied drawing, screenshot, photo or PDF and tracing it into a SpoolMate centreline.
- Added scale calibration from two picked points on a known measurement.
- Added editable traced leg rows for axis direction and millimetre length before building the spool.
- Added a demo trace and one-click build flow for testing the assistant.
- Bumped app cache to `spoolmate-v153`.

## v2.04 - Tighter Fab Sheet Drawing Crop

- Increased the fab sheet/PDF drawing scale so the actual spool fills more of the drawing panel.
- Reduced export-only padding around the isometric drawing while keeping room for the title and dimension key.
- Bumped app cache to `spoolmate-v152`.

## v2.03 - Editable Dimension Key Clarity

- Added an instruction line to the numbered dimension key explaining that `D/O` rows can be tapped/clicked in Select mode to edit C/C values.
- Highlighted editable dimension key rows and added a small `edit` marker so the feature is visible on the drawing.
- Changed the canvas cursor over editable dimension key rows to a pointer.
- Bumped app cache to `spoolmate-v151`.

## v2.02 - Socket Tutorial Step

- Added a dedicated tutorial step for sockets showing the right-click/long-press flow, socket count/spacing selection and 90 degree socket rotation.
- Added a compact animated socket demo that works in light and dark themes.
- Bumped app cache to `spoolmate-v150`.

## v2.01 - Editable Numbered Dimension Key

- Made numbered dimension key rows clickable in Select mode so `D` rows edit pipe C/C travel and `O` rows edit offset set C/C.
- Kept red dimension labels draggable for moving dimensions away from the pipe, separate from editing the measurement value.
- Changed fresh-install, sample and old saved label defaults to use numbered dimensions with callouts.
- Bumped app cache to `spoolmate-v149`.

## v2.00 - Unified Top Toolbar

- Moved New, Save, Jobs, Account, trial status and Menu into the main top settings toolbar so the header reads as one command strip instead of a separate right-side button island.
- Compactly sized the project action buttons and kept the overflow menu anchored to the action cluster.
- Adjusted tablet and phone header rules so the action cluster stays reachable inside the scrollable top strip.
- Updated the app version comparison so future `v2.x` releases still prompt users to refresh correctly.
- Bumped app cache to `spoolmate-v148`.

## v1.99 - Dark Pipe Contrast And End Flange Preview

- Brightened the 2D pipe colour in dark mode so pipe runs, tee markers and end caps stand out from the dark iso grid.
- Changed 3D end flanges so single flanges mount outward from the pipe end instead of straddling the pipe like a mid-run fitting.
- Bumped app cache to `spoolmate-v147`.

## v1.98 - Jobs Menu Scroll Fix

- Restored scrolling inside the Jobs dashboard by giving the Jobs dialog a fixed internal grid height.
- Made the saved-jobs list the dedicated vertical scroll area with touch-friendly scrolling on iPad and phone.
- Bumped app cache to `spoolmate-v146`.

## v1.97 - Socket Chain Dimensions

- Changed socket position dimensions so a socket group measures from the pipe start/bend to the first socket, then centre-to-centre between following sockets.
- Added `SOCK C/C` wording to the between-socket labels so the fabrication mark-out is clearer.
- Bumped app cache to `spoolmate-v145`.

## v1.96 - Quieter Corner Branding

- Slimmed the top-left SpoolMate branding so it reads more like corner background branding instead of another control card.
- Hid the header subtitle, reduced the logo/version badge size and softened the dark-mode glow.
- Tightened the iPad and phone header breakpoints so the brand takes less room from working controls.
- Bumped app cache to `spoolmate-v144`.

## v1.95 - Jobs Reports And On-Demand Guide

- Changed the Jobs guide so it is hidden by default and only appears when the `Guide` button is pressed.
- Added a `Report` button to the Job dashboard with daily and weekly production snapshots.
- Jobs reports summarize stage counts, recently updated spools, completed spools, due/overdue work, hold items and assignee workload.
- Added a `Copy` action for pasting the daily/weekly report into messages, emails or handover notes.
- Bumped app cache to `spoolmate-v143`.

## v1.94 - Static Jobs Guide Link

- Made the Jobs `Guide` control a real in-dialog link to the guide panel, so it still has a working target if scripts or dynamic rendering are delayed.
- Moved the Jobs guide into a permanent slot above the job list instead of recreating it inside the list.
- Kept direct and dialog-level click handlers so the Guide button opens, scrolls to and highlights the guide.
- Bumped app cache to `spoolmate-v142`.

## v1.93 - Interactive Production Board

- Fixed the Jobs `Guide` button by handling it from the whole Jobs dialog, so it still works if the toolbar is rebuilt or cached.
- Made production cards draggable between stage lanes on desktop.
- Added quick card controls for stage, assignee, due date, due time, priority and hold.
- Added short production messages on cards, with `Done` marking messages complete and setting them to be cleaned up after one week.
- Added a `Complete` card action that moves the spool to Complete and sets it to hide from the board after one week.
- Bumped app cache to `spoolmate-v141`.

## v1.92 - Visible Jobs Guide Button

- Added a clear `Guide` button to the Job dashboard toolbar.
- The Guide button opens the Jobs guide, returns from an open job folder if needed, scrolls to the guide and briefly highlights it.
- Prevented older cached toolbar markup from creating duplicate job toolbars when the Guide button is injected.
- Bumped app cache to `spoolmate-v140`.

## v1.91 - Jobs Board Guide

- Added a collapsible `How to use this Jobs board` guide inside the Job dashboard, with its open/closed state remembered on the device.
- The guide explains saving spools, changing production stages, assigning work in Workflow, and using board cards/job folders to open spools.
- Shows the guide even when there are no saved spools yet so first-time users know the intended flow.
- Bumped app cache to `spoolmate-v139`.

## v1.90 - Production Workflow Board

- Expanded drawing status into a production flow: Draft, Ready to check, Checked, Issued, Cutting, Fit-up, Welded, Paint / finish and Complete.
- Added production allocation fields to the Workflow panel: assignee, due date, priority, hold flag and hold note.
- Added a production board to the Job dashboard so saved spools are grouped by production stage with assignee and due-date details.
- Kept old `Fabricated` saved statuses compatible by mapping them to Complete.
- Bumped app cache to `spoolmate-v138`.

## v1.89 - Compact Two-Column Tool Rail

- Changed the vertical drawing tool rail to a compact two-column grid so more tools fit without scrolling.
- Slightly widened the rail and aligned full-screen drawing mode with the same tool width.
- Tightened tool button spacing, text and icons while keeping the phone bottom tool strip touch-friendly.
- Bumped app cache to `spoolmate-v137`.

## v1.88 - Smoother 3D Navigation

- Tuned the Three.js orbit controls for smoother damping, pan speed and zoom speed.
- Added zoom-to-cursor support when the browser's Three.js controls support it.
- Kept middle mouse as pan, wheel/pinch as zoom, and updated touch Move mode for easier two-finger pan/zoom.
- Renamed the 3D Reset control to Fit and kept it as a fit-to-spool camera command.
- Faded and throttled 3D label updates while moving the model so rotation and panning feel lighter.
- Bumped app cache to `spoolmate-v136`.

## v1.87 - Drawing Detail Presets

- Added a `Drawing detail` top-bar menu with Clean, Fab dims, Sizes, Callouts and Full presets to reduce drawing clutter.
- Made compact pipe-size labelling show one label per same-size run plus both sides of size changes instead of repeating every section.
- Fixed numbered dimension legends on fabrication sheets by keeping the legend inside the exported drawing viewport.
- Bumped app cache to `spoolmate-v135`.

## v1.86 - Tutorial Demo Panel Height

- Reserved full card height for tutorial demo panels so animated examples cannot be clipped down to just their title row.
- Synced the Tee demo card height with its taller SVG animation on desktop and touch layouts.
- Bumped app cache to `spoolmate-v134`.

## v1.85 - Tutorial Demo Visibility

- Gave tutorial demo animations a fixed responsive drawing height so the SVG examples do not collapse inside the tutorial card.
- Made the Tee demo slightly taller on desktop and touch layouts so the branch animation is visible.
- Bumped app cache to `spoolmate-v133`.

## v1.84 - Floating 3D Header Wrap

- Made the floating 3D preview header wrap its controls instead of clipping the right-hand menu buttons.
- Slightly tightened the floating 3D preview button and view-select sizing so narrow preview windows remain usable.
- Bumped app cache to `spoolmate-v132`.

## v1.83 - Clickable Check Fixes

- Made project detail check rows open the Project details dialog and focus the exact missing field.
- Made drawing-target checks switch into Edit/Select mode before highlighting the issue.
- Changed open-end checks to highlight only the actual open endpoint instead of also marking the pipe run.
- Added a Draw-tool shortcut for the "No pipe runs drawn" check.
- Bumped app cache to `spoolmate-v131`.

## v1.82 - Tutorial Demo Animations

- Added compact looping tutorial demos so users can watch key actions before trying them.
- Added animated examples for opening jobs, drawing runs, exact lengths, offsets, selecting runs, making tees, manual measuring, clearing dimensions, 3D preview and review checks.
- Added a clear Tee demo showing: pick Tee, tap the main run, then draw the branch from the new point.
- Styled the demo panels for dark mode and smaller touch screens.
- Bumped app cache to `spoolmate-v130`.

## v1.81 - Job Window Picker

- Replaced expandable/minimized saved-job folders with a focused job window: tap a job, then pick a spool from that job only.
- Added a Back to jobs button inside the job window so the saved spool picker is clearer on iPad and phone.
- Kept spool open/delete actions inside the job window and preserved touch, mouse and keyboard activation.
- Bumped app cache to `spoolmate-v129`.

## v1.80 - Jobs Dashboard Opens Immediately

- Made the Jobs dashboard appear immediately with a loading message before cloud/local spool loading finishes.
- Added a cloud load timeout so a slow cloud request falls back to browser-saved spools instead of looking like nothing happened.
- Made saved spool rows respond to click, touch pointer-up and keyboard activation.
- Added duplicate tap protection so mobile taps do not open and then instantly close a saved job folder.
- Bumped app cache to `spoolmate-v128`.

## v1.79 - Interactive Tool Tutorial

- Turned the tutorial into an interactive coach that highlights the real app control for each step.
- Added safe Try buttons that switch tools, focus run/angle inputs, show dimension styles, open 3D controls and show the Checks tab.
- Added a non-blocking tutorial spotlight so users can still see and interact with the drawing tools while learning.
- Bumped app cache to `spoolmate-v127`.

## v1.78 - Saved Job Folder Reliability

- Made Job dashboard saved-spool folders remember their open/minimized state across rerenders.
- Replaced the decorative folder plus/minus with a real button element so tapping the minimized folder control is more reliable on touch devices.
- Stopped folder, open and delete clicks from bubbling into each other inside the saved spool list.
- Bumped app cache to `spoolmate-v126`.

## v1.76 - Built-In Tutorial

- Added a step-by-step SpoolMate tutorial covering dashboard setup, drawing, fittings, dimensions, review and export.
- Added Tutorial buttons to the startup dashboard and main menu so new users can find it quickly on desktop, iPad and phone.
- Styled the tutorial for light and dark themes with compact mobile layout and progress dots.
- Bumped app cache to `spoolmate-v124`.

## v1.75 - Reliable Enter To Stop Drawing

- Fixed Enter/Numpad Enter so it stops drawing from the main app even after focus has been on controls such as run length inputs.
- Kept Enter normal inside blocking dialogs, dashboards, search fields and text-entry fields.
- Made Select available in Draw mode so stopping drawing can switch to Select instead of falling back to Draw.
- Bumped app cache to `spoolmate-v123`.

## v1.74 - Reliable Job Folder Toggle

- Replaced native saved-job folder toggles with explicit app-controlled open/closed state.
- Fixed collapsed job rows so tapping the plus/minus reliably shows or hides the spool drawings.
- Kept spool open/delete clicks separate from folder expand clicks.
- Bumped app cache to `spoolmate-v122`.

## v1.73 - Tee And Branch Draw Flow

- Made Tee and Branch available directly in Draw mode as well as Edit mode.
- Kept drawing workflow smooth by returning to the Draw tool after placing a tee or branch point.
- Updated branch hover feedback so the canvas says Branch on run instead of generic run text.
- Bumped app cache to `spoolmate-v121`.

## v1.72 - Startup Dashboard

- Added a proper startup dashboard after sign-in or Continue as guest.
- Dashboard actions now include Continue drawing, New spool, Jobs, Sample, Account, Side tools and Help.
- Added a Menu > Dashboard action so the home dashboard can be reopened later.
- Made the Jobs dashboard shell self-healing if cached/uploaded HTML is missing the new search toolbar.
- Widened the Jobs modal and gave folder expand controls more space.
- Bumped app cache to `spoolmate-v120`.

## v1.71 - Job Dashboard

- Changed the top Open action to Jobs so saved work is opened from a clearer job dashboard.
- Added dashboard search for job number, spool number, client, status and drawn-by fields.
- Added quick New spool and Save current actions inside the dashboard.
- Kept saved spools grouped by job/client with status counts and clearer matching-result counts.
- Bumped app cache to `spoolmate-v119`.

## v1.70 - Pre-Demo Stability Pass

- Fixed Undo/Redo button refresh after drawing exact runs.
- Fixed Redo restore by deep-cloning history snapshots instead of keeping live drawing references.
- Raised project/help/settings dialogs above the floating 3D panel so canvas layers cannot intercept dialog buttons.
- Smoke-tested desktop exact-run drawing, Undo/Redo, Menu, Help and Side tools.
- Smoke-tested phone touch drawing, mobile panel switching and Menu.
- Bumped app cache to `spoolmate-v118`.

## v1.69 - Option Menu Polish And Undo Consistency

- Added clear helper text to option menus so pipe sizes, flange types and socket sizes show whether choices apply immediately.
- Clarified that the socket layout picker updates the preview first, then needs Apply sockets to pipe.
- Made drawing-edit options undoable, including pipe size changes, length and bend edits, fitting weights, flange/socket changes, socket spin, reducer side, tee/branch toggles and dragged notes/sockets/dimensions.
- Clarified that Side tools settings save immediately.
- Bumped app cache to `spoolmate-v117`.

## v1.68 - Clear Socket Apply Action

- Added a clear Apply sockets to pipe action to the socket setup menu.
- Kept a sticky apply button visible at the bottom of the socket picker while scrolling.
- Bumped app cache to `spoolmate-v116`.

## v1.67 - README Refresh And Socket Preview Scale

- Rewrote the README so it matches the current SpoolMate app, cloud setup, PWA install flow and feature set.
- Updated the socket setup preview to use a fixed 1000 mm sample pipe.
- Made socket preview markers scale by the selected socket NB and show spacing/count differences more clearly.
- Bumped app cache to `spoolmate-v115`.

## v1.66 - Phone Layout Detection

- Made phone layout detection width-based so Android-sized browsers reliably get the phone UI layer.
- Bumped app cache to `spoolmate-v114`.

## v1.65 - Android Phone Touch Pass

- Added a dedicated phone layout for coarse-pointer Android screens.
- Stopped the floating 3D preview from covering the drawing on phones; it now opens as a 3D bottom sheet from the mobile dock.
- Made long-press actions on phones wait until finger-up, so a short tap selects and a long press opens actions without also dragging/selecting underneath.
- Added forgiving phone tap-to-draw support while keeping drag-to-draw.
- Tightened phone topbar, drawing controls, bottom tools and context menus for smaller screens.
- Bumped app cache to `spoolmate-v113`.

## v1.64 - Fab Sheet Views And Measure Undo

- Fixed Undo/Redo for manual measurements, including add, relabel and delete paths.
- Added undo snapshots for selected note, fitting, measurement and run deletes so keyboard and menu deletes behave consistently.
- Fab sheet PDF export now builds its own cropped 3D model page with isometric, plan and side views, even when the live 3D preview is minimized.
- Made offset C/C dimensions clearer with projection witness marks from the angled travel run.
- Bumped app cache to `spoolmate-v112`.

## v1.63 - Compact Socket Picker

- Reworked the Add sockets menu into a compact picker so it fits without needing to scroll on normal screens.
- Moved the Add sockets action to the top of the picker beside Back.
- Tightened the socket preview, size choices, quantity choices and spacing choices into denser grids.
- Bumped app cache to `spoolmate-v111`.

## v1.62 - Help Updates And Measure Tool

- Added more built-in Help notes for offsets, reducers, branches, dimensions, takeoff, exports and cloud/local saves.
- Added a Measure side tool for clicking two points and marking the measured length on the drawing.
- Measurements save with the project, appear on the fab drawing export and can be selected, relabelled or deleted.
- Clarified 45 degree offset measurements: set input, calculated travel and offset C/C.
- Bumped app cache to `spoolmate-v110`.

## v1.61 - Built-In Help

- Added a Help button to the main Menu.
- Added a built-in help dialog with sections for iPad/phone, Draw, Edit, Review, Export and Account workflows.
- Documented touch gestures for changing flanges: Select, long-press the flange marker, then choose Flange standard.
- Added fitting/socket instructions to make the new pick menus easier to discover.
- Bumped app cache to `spoolmate-v109`.

## v1.60 - Flange and Socket Pick Menus

- Added more common flange standards including ANSI 300/600, AS 2129 Table D/E/F/H, PN 10/16/25/40, DIN PN 10/16 and JIS 10K.
- Populated the default flange standard dropdown from the same shared flange list used by fittings.
- Replaced typed flange-standard changes with a right-click/inspector pick menu.
- Added a visual socket setup menu with a small socket layout sketch.
- Added menu choices for socket size, count and spacing presets such as 150 mm C/C.
- Replaced typed socket-size changes with a socket-size pick menu.
- Bumped app cache to `spoolmate-v108`.

## v1.59 - Flange Standards and Socket Spacing

- Added selectable flange standards: ANSI 150, PN 40 and DIN 16.
- Added a default flange standard control and right-click/inspector editing for existing flanges.
- Split flange takeoff rows by standard and adjusted PN/DIN visual sizing and weight estimates.
- Expanded socket placement to choose socket size, count and centre-to-centre spacing.
- Added socket size editing for existing socket fittings.
- Bumped app cache to `spoolmate-v107`.

## v1.58 - Cleaner Floating 3D Controls

- Added Minimize and Hide controls to the floating 3D preview.
- Added a Show 3D restore button when the preview is hidden.
- Cleaned up the floating preview header by hiding less important labels and tightening the controls.
- Collapsed the preview column while the 3D model is hidden so the drawing stays roomy.
- Bumped app cache to `spoolmate-v106`.

## v1.57 - Redo Button

- Added a Redo button directly under Undo in the side tool rail.
- Added redo support for undoable drawing actions, fittings, sockets, notes and snapshot-based edits.
- Added keyboard redo shortcuts with `Ctrl+Y` and `Ctrl+Shift+Z`.
- Bumped app cache to `spoolmate-v105`.

## v1.56 - Floating 3D Preview

- Added a Float/Dock control to the 3D preview header.
- Made the 3D preview float by default to reduce startup clutter, while remembering Dock/Float choice on the device.
- Let the 3D preview float, drag and resize from the normal drawing screen, not only when the drawing is fullscreen.
- Collapsed the fixed preview column while floating so the drawing and inspector have more room.
- Bumped app cache to `spoolmate-v104`.

## v1.55 - Shift 45 Draw Snap

- Added a Draw-mode shortcut where holding Shift swaps the draw snap guides from straight axes to 45 degree angled axes.
- Shift-drawn angled runs store offset set/travel metadata so the cut list and dimension logic can read them as 45 degree offsets.
- Added Shift-click support on the exact run axis buttons for quick 45 degree offset runs.
- Bumped app cache to `spoolmate-v103`.

## v1.54 - Workflow Modes And Touch Polish

- Added Draw, Edit, Review and Export workflow modes to simplify the visible side tools.
- Made the active workflow mode save on the device.
- Increased touch long-press timing and target sizes for iPad and Android use.
- Bumped app cache to `spoolmate-v102`.

## v1.53 - Offset Set Dimensions

- Added a dedicated C/C set dimension for angled offset runs, including 45 degree offsets.
- The offset set dimension uses the stored offset set value, while the angled run still keeps the calculated travel length for cut length.
- Offset set dimensions participate in the red dimension collision layout and can be dragged out like other run dimensions.
- Bumped app cache to `spoolmate-v101`.

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
