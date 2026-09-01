const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
const REQUIRED_FILES = [
  "index.html",
  "styles.css",
  "app.js",
  "sw.js",
  "manifest.webmanifest",
  "README.md",
  "CHANGELOG.md",
  "supabase-setup.sql",
  "supabase-migration-v295-trial-access.sql",
  "supabase-migration-v296-ai-helper.sql",
  "supabase-migration-v318-business-workspaces.sql",
  "supabase-migration-v338-support-admin.sql",
  "supabase-migration-v339-jobs-dashboard-preferences.sql",
  "supabase/migrations/20260822050724_workshop_stock.sql",
  "supabase/migrations/20260822063407_smart_spool_kits.sql",
  "supabase/migrations/20260830090000_schematic_takeoff_private_beta.sql",
  "supabase/migrations/20260901080351_workshop_stock_fk_indexes.sql",
  "supabase/functions/delete-account/index.ts",
  "supabase/functions/ai-help/index.ts",
  "supabase/functions/support-admin/index.ts",
];

const failures = [];
const notes = [];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function fail(message) {
  failures.push(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function matches(text, pattern) {
  return [...text.matchAll(pattern)];
}

function duplicated(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
}

function constExpression(source, name) {
  const marker = `const ${name} =`;
  const declaration = source.indexOf(marker);
  if (declaration < 0) throw new Error(`Missing constant ${name}`);

  let index = declaration + marker.length;
  while (/\s/.test(source[index])) index += 1;
  const start = index;
  let depth = 0;
  let quote = "";
  let escaped = false;

  for (; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{" || char === "[" || char === "(") depth += 1;
    else if (char === "}" || char === "]" || char === ")") depth -= 1;
    else if (char === ";" && depth === 0) return source.slice(start, index);
  }

  throw new Error(`Unterminated constant ${name}`);
}

function constValue(source, name) {
  return vm.runInNewContext(`(${constExpression(source, name)})`);
}

for (const file of REQUIRED_FILES) {
  assert(fs.existsSync(path.join(ROOT, file)), `Required file is missing: ${file}`);
}

const html = read("index.html");
const css = read("styles.css");
const app = read("app.js");
const serviceWorker = read("sw.js");
const manifest = JSON.parse(read("manifest.webmanifest"));
const readme = read("README.md");
const changelog = read("CHANGELOG.md");
const supabaseSql = read("supabase-setup.sql");
const trialAccessMigration = read("supabase-migration-v295-trial-access.sql");
const aiHelperMigration = read("supabase-migration-v296-ai-helper.sql");
const businessWorkspaceMigration = read("supabase-migration-v318-business-workspaces.sql");
const supportAdminMigration = read("supabase-migration-v338-support-admin.sql");
const jobsDashboardPreferencesMigration = read("supabase-migration-v339-jobs-dashboard-preferences.sql");
const workshopStockMigration = read("supabase/migrations/20260822050724_workshop_stock.sql");
const smartSpoolKitsMigration = read("supabase/migrations/20260822063407_smart_spool_kits.sql");
const schematicTakeoffMigration = read("supabase/migrations/20260830090000_schematic_takeoff_private_beta.sql");
const workshopStockFkIndexesMigration = read("supabase/migrations/20260901080351_workshop_stock_fk_indexes.sql");
const jobsStoryboard = read("video-production/storyboard-jobs.json");
const jobsVoiceover = read("video-production/jobs-voiceover-script.txt");
const jobsCaptions = read("video-production/spoolmate-jobs-tutorial.srt");
const jobsCaptureScript = read("video-production/capture_real_tutorial.js");
const deleteAccountFunction = read("supabase/functions/delete-account/index.ts");
const aiHelpFunction = read("supabase/functions/ai-help/index.ts");
const supportAdminFunction = read("supabase/functions/support-admin/index.ts");

try {
  new Function(app);
} catch (error) {
  fail(`app.js syntax error: ${error.message}`);
}

try {
  new Function(serviceWorker);
} catch (error) {
  fail(`sw.js syntax error: ${error.message}`);
}

let cssDepth = 0;
for (const char of css.replace(/\/\*[\s\S]*?\*\//g, "")) {
  if (char === "{") cssDepth += 1;
  else if (char === "}") cssDepth -= 1;
  if (cssDepth < 0) break;
}
assert(cssDepth === 0, "styles.css has unbalanced braces");

const htmlIds = matches(html, /\bid="([^"]+)"/g).map((match) => match[1]);
const duplicateIds = duplicated(htmlIds);
assert(duplicateIds.length === 0, `Duplicate HTML IDs: ${duplicateIds.join(", ")}`);
const htmlIdSet = new Set(htmlIds);

const referencedHtmlIds = [
  ...matches(html, /\bfor="([^"]+)"/g).map((match) => match[1]),
  ...matches(html, /\baria-(?:controls|labelledby|describedby)="([^"]+)"/g)
    .flatMap((match) => match[1].split(/\s+/).filter(Boolean)),
];
const missingHtmlReferences = [...new Set(referencedHtmlIds.filter((id) => !htmlIdSet.has(id)))];
assert(missingHtmlReferences.length === 0, `HTML controls reference missing IDs: ${missingHtmlReferences.join(", ")}`);

const symbolIds = new Set(matches(html, /<symbol\b[^>]*\bid="([^"]+)"/gi).map((match) => match[1]));
const usedSymbols = matches(html, /<use\b[^>]*(?:href|xlink:href)="#([^"]+)"/gi).map((match) => match[1]);
const missingSymbols = [...new Set(usedSymbols.filter((id) => !symbolIds.has(id)))];
assert(missingSymbols.length === 0, `SVG uses missing symbols: ${missingSymbols.join(", ")}`);

const selectorIds = [
  ...matches(app, /querySelector\(\s*["']#([A-Za-z][\w:-]*)["']\s*\)/g),
  ...matches(app, /getElementById\(\s*["']([A-Za-z][\w:-]*)["']\s*\)/g),
].map((match) => match[1]);
const missingSelectorIds = [...new Set(selectorIds.filter((id) => !htmlIdSet.has(id)))];
if (missingSelectorIds.length) {
  notes.push(`${missingSelectorIds.length} optional selectors have no current HTML control (dormant/removed features)`);
}

const declaredFunctions = matches(app, /^function\s+([A-Za-z_$][\w$]*)\s*\(/gm).map((match) => match[1]);
const duplicateFunctions = duplicated(declaredFunctions);
assert(duplicateFunctions.length === 0, `Duplicate function declarations: ${duplicateFunctions.join(", ")}`);

const buttonIds = matches(html, /<button\b[^>]*\bid="([^"]+)"[^>]*>/gi).map((match) => match[1]);
const unreferencedButtons = buttonIds.filter((id) => !app.includes(`#${id}`));
assert(unreferencedButtons.length === 0, `Buttons are not wired in app.js: ${unreferencedButtons.join(", ")}`);

const appVersion = app.match(/const\s+APP_VERSION\s*=\s*["']([^"']+)["']/)?.[1];
const assetVersion = html.match(/app\.js\?v=(\d+)/)?.[1];
assert(Boolean(appVersion), "APP_VERSION is missing");
assert(Boolean(assetVersion), "index.html app.js cache-busting version is missing");
assert(appVersion?.replace(/\D/g, "") === assetVersion, "APP_VERSION and static asset version differ");
assert(html.includes(`styles.css?v=${assetVersion}`), "CSS and JS cache-busting versions differ");
assert(serviceWorker.includes(`./app.js?v=${assetVersion}`), "Service worker app.js version differs from index.html");
assert(serviceWorker.includes(`./styles.css?v=${assetVersion}`), "Service worker CSS version differs from index.html");
assert(readme.includes(`Current app version: \`${appVersion}\``), "README current version differs from app.js");
assert(changelog.includes(`Current app version: \`${appVersion}\``), "CHANGELOG current version differs from app.js");
assert(
  html.includes('id="selectionActionDragHandle"')
    && app.includes("selectionActionBarManualPosition")
    && app.includes('addEventListener("pointermove"')
    && css.includes(".selection-action-bar.user-positioned"),
  "Selected-run toolbar drag, redraw persistence or positioning styles are incomplete"
);
assert(
  html.includes('id="bigSpoolDialog"')
    && html.includes('id="bigSpoolMaxLengthInput"')
    && html.includes('id="bigSpoolManualDistanceInput"')
    && html.includes('id="bigSpoolDefaultJointTypeSelect"')
    && html.includes('id="bigSpoolMaxWeightInput"')
    && html.includes('id="bigSpoolExportPackageButton"')
    && html.includes('id="bigSpoolLoadPlannerButton"')
    && html.includes('id="loadPlanDialog"')
    && html.includes('id="loadPlanJobSelect"')
    && html.includes('id="loadPlanCanvas"')
    && /function\s+normalizeBigSpoolPlan\s*\(/.test(app)
    && /function\s+suggestedBigSpoolCuts\s*\(/.test(app)
    && /function\s+bigSpoolLayout\s*\(/.test(app)
    && /function\s+refineBigSpoolCutsForConstraints\s*\(/.test(app)
    && /function\s+bigSpoolChildState\s*\(/.test(app)
    && /function\s+bigSpoolJointPreparationText\s*\(/.test(app)
    && /function\s+bigSpoolJointRejoinItemText\s*\(/.test(app)
    && /function\s+bigSpoolFragmentScreenGeometry\s*\(/.test(app)
    && /function\s+exportBigSpoolChildFabPackage\s*\(/.test(app)
    && /function\s+buildBigSpoolFieldJointReportCanvas\s*\(/.test(app)
    && /function\s+loadPlanItemsFromPayload\s*\(/.test(app)
    && /function\s+regressionAutoCheckBigSpool\s*\(/.test(app)
    && app.includes('id: "big-spool"')
    && app.includes("bigSpool: normalizeBigSpoolPlan(state.bigSpool")
    && app.includes("bigSpoolFieldJoint: true")
    && app.includes('type: "rollGroove"')
    && app.includes('type: "flange"')
    && app.includes('weldGapMm: projectWeldGapMm(source)')
    && app.includes("rejoin on site with 1 grooved coupling")
    && app.includes("minimumHalfGapPx = 18")
    && app.includes("const fallbackDrawSegments = fallbackSegments")
    && !app.includes("pipeMaterialForBigSpoolPiece")
    && !app.includes("drawBigSpoolBreaks2d(ctx, projection, bigSpoolLayoutData")
    && css.includes(".big-spool-card")
    && css.includes(".big-spool-constraint-grid")
    && css.includes("@media (max-width: 620px)"),
  "Big Spool state, planner, split calculation, drawing colours or mobile layout is incomplete",
);
assert(
  html.includes('id="actionCommandInput"')
    && html.includes('id="actionCommandResults"')
    && app.includes("const ACTION_COMMANDS = [")
    && app.includes('id: "reducer"')
    && app.includes('id: "weld-register"')
    && app.includes('id: "export-pdf"')
    && app.includes("function matchingActionCommands")
    && app.includes("function runActionCommand")
    && app.includes('event.key.toLowerCase() === "k"')
    && css.includes(".action-command-result")
    && css.includes("max-height: min(52dvh, 420px)"),
  "Searchable command palette or keyboard/touch behavior is incomplete",
);
assert(
  html.includes('id="schematicTakeoffDialog"')
    && html.includes('id="schematicTakeoffFileInput"')
    && html.includes('id="schematicTakeoffCanvas"')
    && html.includes('data-schematic-tool="rectangle"')
    && html.includes('data-schematic-tool="lasso"')
    && html.includes('id="schematicTakeoffCropCanvas"')
    && html.includes('id="schematicTakeoffDownloadCropButton"')
    && html.includes('id="schematicTakeoffFittingForm"')
    && html.includes('id="schematicTakeoffSystemInput"')
    && html.includes('id="schematicTakeoffValveQuestions"')
    && html.includes('id="schematicTakeoffValveConnectionInput"')
    && html.includes('id="schematicTakeoffValveBrandInput"')
    && html.includes('id="schematicTakeoffExportButton"')
    && app.includes('const PRIVATE_FEATURE_ACCESS_TABLE = "private_feature_access"')
    && app.includes('const SCHEMATIC_TAKEOFF_FEATURE_KEY = "schematic_takeoff"')
    && app.includes('id: "schematic-takeoff"')
    && /function\s+refreshSchematicTakeoffAccess\s*\(/.test(app)
    && /function\s+handleSchematicTakeoffPointerDown\s*\(/.test(app)
    && /function\s+handleSchematicTakeoffPointerMove\s*\(/.test(app)
    && /function\s+renderSchematicTakeoffPdfPage\s*\(/.test(app)
    && /function\s+schematicTakeoffCropCanvasForSelection\s*\(/.test(app)
    && /function\s+downloadSchematicTakeoffCrop\s*\(/.test(app)
    && /function\s+schematicTakeoffDetectSystemContext\s*\(/.test(app)
    && /function\s+updateSchematicTakeoffValveQuestions\s*\(/.test(app)
    && html.includes('<option value="Victaulic">Victaulic</option>')
    && html.includes('<option value="Ebro">Ebro</option>')
    && html.includes('<option value="Hydroflow">Hydroflow</option>')
    && /function\s+exportSchematicTakeoffCsv\s*\(/.test(app)
    && css.includes(".schematic-takeoff-card")
    && css.includes("#schematicTakeoffCanvas")
    && css.includes("@media (max-height: 560px) and (orientation: landscape)")
    && /create table if not exists public\.private_feature_access/.test(schematicTakeoffMigration)
    && /alter table public\.private_feature_access enable row level security/.test(schematicTakeoffMigration)
    && /using \(\(select auth\.uid\(\)\) = user_id and active\)/.test(schematicTakeoffMigration)
    && /revoke all on table public\.private_feature_access from public, anon, authenticated/.test(schematicTakeoffMigration)
    && /grant select on table public\.private_feature_access to authenticated/.test(schematicTakeoffMigration)
    && !/grant (?:insert|update|delete|all).*private_feature_access.*authenticated/i.test(schematicTakeoffMigration)
    && schematicTakeoffMigration.includes("jpritchard@paragonplumbing.com.au"),
  "Private schematic takeoff selection, system/valve classification, account entitlement, RLS or responsive foundation is incomplete",
);
assert(
  html.includes('id="workshopStockDialog"')
    && html.includes('id="workshopStockSearchInput"')
    && html.includes('id="workshopStockScanButton"')
    && html.includes('id="workshopStocktakeButton"')
    && html.includes('id="workshopStockPrintButton"')
    && html.includes('id="workshopStockItemForm"')
    && app.includes('const WORKSHOP_STOCK_ITEMS_TABLE = "workshop_stock_items"')
    && app.includes('const WORKSHOP_STOCK_MOVEMENTS_TABLE = "workshop_stock_movements"')
    && /function\s+openWorkshopStock\s*\(/.test(app)
    && /function\s+printWorkshopStockLabels\s*\(/.test(app)
    && /function\s+recordWorkshopStockMovement\s*\(/.test(app)
    && /function\s+scannedSpoolMateTarget\s*\(/.test(app)
    && app.includes('p_movement_type: movementType')
    && app.includes('p_project_id: projectId')
    && app.includes('stockItem", "1"')
    && app.includes('This account does not have approved access to the QR label\'s business workspace.')
    && app.includes('ownedWorkshopStockItems: stockItemsResult.data ?? []')
    && css.includes(".workshop-stock-card")
    && css.includes(".workshop-stock-row")
    && css.includes("@media (max-width: 820px)")
    && /create table if not exists public\.workshop_stock_items/.test(workshopStockMigration)
    && /create table if not exists public\.workshop_stock_movements/.test(workshopStockMigration)
    && /alter table public\.workshop_stock_items enable row level security/.test(workshopStockMigration)
    && /create or replace function private\.record_workshop_stock_movement_internal/.test(workshopStockMigration)
    && /security definer/.test(workshopStockMigration)
    && /create or replace function public\.record_workshop_stock_movement/.test(workshopStockMigration)
    && /security invoker/.test(workshopStockMigration)
    && /owner_id uuid references auth\.users\(id\) on delete set null/.test(workshopStockMigration)
    && /stock_item_id uuid not null references public\.workshop_stock_items\(id\) on delete cascade/.test(workshopStockMigration)
    && /actor_id uuid references auth\.users\(id\) on delete set null/.test(workshopStockMigration)
    && /role in \('owner', 'admin', 'checker', 'workshop'\)/.test(workshopStockMigration)
    && deleteAccountFunction.includes('.from("workshop_stock_items")')
    && /grant select, insert on public\.workshop_stock_items to authenticated/.test(workshopStockMigration),
  "Workshop stock register, QR labels, stocktake, spool usage, RLS or responsive layout is incomplete",
);
assert(
  html.includes('id="workshopStockKitPanel"')
    && html.includes('id="workshopStockKitRefreshButton"')
    && html.includes('id="workshopStockKitScanButton"')
    && html.includes('id="workshopStockKitOrderListButton"')
    && app.includes('const WORKSHOP_STOCK_KIT_LINES_TABLE = "workshop_stock_kit_lines"')
    && /function\s+smartKitRequirementsForProject\s*\(/.test(app)
    && /function\s+openSmartSpoolKit\s*\(/.test(app)
    && /function\s+handleScannedSmartKitStock\s*\(/.test(app)
    && /function\s+syncSmartSpoolKitToGearCheck\s*\(/.test(app)
    && app.includes('id: "smart-spool-kit"')
    && app.includes('p_line_id: line.id')
    && app.includes('p_return: returning')
    && css.includes(".workshop-stock-kit-panel")
    && css.includes(".workshop-stock-kit-line")
    && /create table if not exists public\.workshop_stock_kit_lines/.test(smartSpoolKitsMigration)
    && /alter table public\.workshop_stock_kit_lines enable row level security/.test(smartSpoolKitsMigration)
    && /create or replace function private\.configure_spool_stock_kit_line_internal/.test(smartSpoolKitsMigration)
    && /create or replace function private\.record_spool_stock_kit_pick_internal/.test(smartSpoolKitsMigration)
    && /create or replace function private\.validate_spool_stock_kit_metadata_update/.test(smartSpoolKitsMigration)
    && /create or replace function public\.configure_spool_stock_kit_line/.test(smartSpoolKitsMigration)
    && /create or replace function public\.record_spool_stock_kit_pick/.test(smartSpoolKitsMigration)
    && /p_movement_type in \('used_on_spool', 'stocktake'\)/.test(smartSpoolKitsMigration)
    && /Return the picked quantity before changing the matched stock item/.test(smartSpoolKitsMigration)
    && /grant update \(label, detail, unit, required_quantity, note, active, updated_at\)/.test(smartSpoolKitsMigration),
  "Smart Spool Kit BOM generation, reservation, QR picking, Gear-check sync, database protection or responsive layout is incomplete",
);
assert(
  /create index if not exists workshop_stock_movements_actor_id_idx/.test(workshopStockFkIndexesMigration)
    && /on public\.workshop_stock_movements \(actor_id\)/.test(workshopStockFkIndexesMigration)
    && /create index if not exists workshop_stock_kit_lines_created_by_idx/.test(workshopStockFkIndexesMigration)
    && /on public\.workshop_stock_kit_lines \(created_by\)/.test(workshopStockFkIndexesMigration),
  "Workshop Stock audit foreign keys are missing their covering indexes",
);
assert(
  html.includes('id="spoolWorkspaceTabs"')
    && html.includes('id="spoolWorkspaceOpenButton"')
    && html.includes('id="spoolWorkspaceNewButton"')
    && html.includes('id="spoolWorkspaceWindowButton"')
    && html.includes('id="spoolWindowGrid"')
    && /function\s+captureCurrentSpoolWorkspaceTab\s*\(/.test(app)
    && /function\s+activateSpoolWorkspaceTab\s*\(/.test(app)
    && /function\s+openProjectInWorkspaceTab\s*\(/.test(app)
    && /function\s+flushActiveSpoolWorkspaceTab\s*\(/.test(app)
    && /function\s+renderSpoolWindowGrid\s*\(/.test(app)
    && app.includes("SPOOL_WORKSPACE_SESSION_KEY")
    && css.includes(".spool-workspace-tabs")
    && css.includes(".spool-window-grid")
    && css.includes("body.spool-windowed-mode"),
  "Multi-spool tabs, session isolation or windowed comparison mode is incomplete",
);
assert(
  /function\s+endpointHasFinish\s*\([\s\S]*?endpointSnappedFittingT\(segment, fitting\)/.test(app)
    && app.includes('key: "preparedEnds"')
    && app.includes("function regressionAutoCheckPreparedEnds"),
  "Prepared roll-grooved, flanged and threaded ends are not protected from open-end warnings",
);
assert(
  app.includes('["materialcheck", "Gear check"]')
    && /function\s+materialChecklistForState\s*\(/.test(app)
    && /function\s+materialChecklistCanStart\s*\(/.test(app)
    && app.includes('data-material-check-field="status"')
    && app.includes('data-production-action="add-material-item"')
    && app.includes('data-production-action="confirm-material-check"')
    && app.includes('data-production-action="override-material-check"')
    && app.includes('Complete the Gear check before starting Cutting')
    && css.includes(".production-material-checklist")
    && css.includes(".material-check-row"),
  "Allocated-spool Gear check generation, readiness controls or Cutting gate is incomplete",
);
assert(
  app.includes('data-weld-assignment-mode')
    && app.includes('data-weld-all-input')
    && app.includes('data-weld-action="apply-all-welder"')
    && /function\s+handleWeldRegisterAction\s*\(/.test(app)
    && app.includes("Mixed welders selected")
    && css.includes(".weld-register-bulk"),
  "All-welds-by and mixed-welder register controls are incomplete",
);
assert(
  matches(html, /\bdata-workspace-location\b/g).length >= 6 &&
    /function\s+captureTemporaryWorkspaceNavigation\s*\(/.test(app) &&
    /function\s+restoreTemporaryWorkspaceNavigation\s*\(/.test(app) &&
    /drawingViewOffset:\s*\{\s*\.\.\.drawingViewOffset\s*\}/.test(app) &&
    /surfaceState:\s*captureWorkspaceSurfaceState\(\)/.test(app) &&
    /function\s+renderWorkspaceLocationStrips\s*\(/.test(app) &&
    /data-workspace-return/.test(app),
  "Universal location strip or exact workspace-navigation restoration is incomplete",
);
assert(
    /function\s+openProjectInNewWindow\s*\(/.test(app) &&
    /function\s+updateWorkspaceDocumentTitle\s*\(/.test(app) &&
    /url\.searchParams\.set\("localProject",\s*id\)/.test(app) &&
    /data-open-project-window/.test(app) &&
    /params\.get\("localProject"\)/.test(app),
  "Separate local/cloud spool-window support is incomplete",
);
assert(
  html.includes('id="workspaceSwitcher"') &&
    html.includes('id="authAccountTypeInput"') &&
    html.includes('id="businessSeatSummary"') &&
    /const\s+BUSINESS_INCLUDED_SEATS\s*=\s*5/.test(app) &&
    /function\s+renderWorkspaceChoices\s*\(/.test(app) &&
    /function\s+completePendingBusinessSignup\s*\(/.test(app) &&
    /included_seats\s+integer/.test(businessWorkspaceMigration) &&
    /extra_seats\s+integer/.test(businessWorkspaceMigration) &&
    /create or replace function public\.enforce_company_seat_capacity/.test(businessWorkspaceMigration) &&
    /on delete set null/.test(businessWorkspaceMigration) &&
    /\.is\("company_id", null\)/.test(deleteAccountFunction) &&
    /\.in\("company_id", ownedCompanyIds\)/.test(deleteAccountFunction),
  "Personal/Business workspace switching, five-seat entitlement or business-owned project protection is incomplete",
);
assert(
  html.includes('id="supportAdminButton"') &&
    html.includes('id="supportAdminDialog"') &&
    html.includes('id="supportAdminSearchInput"') &&
    html.includes('id="supportAdminDetail"') &&
    /const\s+SUPPORT_ADMIN_FUNCTION\s*=\s*["']support-admin["']/.test(app) &&
    /function\s+refreshSupportAdminAccess\s*\(/.test(app) &&
    /function\s+runSupportAdminAction\s*\(/.test(app) &&
    /create table if not exists public\.platform_support_admins/.test(supportAdminMigration) &&
    /create table if not exists public\.support_admin_audit_log/.test(supportAdminMigration) &&
    /alter table public\.platform_support_admins enable row level security/.test(supportAdminMigration) &&
    /revoke all on table public\.platform_support_admins from public, anon, authenticated/.test(supportAdminMigration) &&
    /SUPABASE_SERVICE_ROLE_KEY/.test(supportAdminFunction) &&
    /\.from\(["']platform_support_admins["']\)/.test(supportAdminFunction) &&
    /auth\.admin\.listUsers\s*\(/.test(supportAdminFunction) &&
    /startAudit\s*\(/.test(supportAdminFunction) &&
    /sendPasswordReset\s*\(/.test(supportAdminFunction),
  "Private Support Admin access, repair controls or audit protection is incomplete",
);
assert(
  /function\s+regressionLargeOutletTeeState\s*\(/.test(app) &&
    /function\s+regressionAutoCheckLargeOutletTee\s*\(/.test(app) &&
    /const\s+largestEntry\s*=\s*\[\.\.\.entries\]\.sort/.test(app) &&
    /addTeeReducer\(largestEntry,\s*entry\)/.test(app),
  "Largest-outlet tee reducer regression coverage or all-leg reducer logic is missing",
);
assert(
  /function\s+teeNodeLegLengthMetres\s*\(/.test(app) &&
    /Math\.max\(startReducerTrim,\s*nodeClearances\.start\)/.test(app) &&
    /Math\.max\(endReducerTrim,\s*nodeClearances\.end\)/.test(app) &&
    /computeAutoReducerRenderTrims\(autoReducers,\s*style\)/.test(app),
  "3D tee/reducer endpoint trimming is incomplete",
);
assert(
  /A fabricated branch is a continuous main pipe with a welded outlet/.test(app) &&
    /quantities\.tees\.length\s*===\s*0/.test(app) &&
    /branchTakeoffOnlyOnOutlet/.test(app) &&
    /mergedMainIsFullLength/.test(app),
  "Tee and fabricated-branch calculation paths or regression checks are not explicitly separated",
);
assert(
  /offsetElbows\.length\s*===\s*2/.test(app) &&
    /offsetElbows\.every\(\(elbow\)\s*=>\s*Math\.abs\(elbow\.bend\s*-\s*45\)/.test(app) &&
    /expectedWeldGap\s*=\s*projectWeldGapMm\(\)\s*\*\s*2/.test(app) &&
    /offsetQuantity\?\.weldEndCount\)\s*===\s*2/.test(app) &&
    /offsetQuantity\?\.cutLengthMm/.test(app) &&
    /expectedCutLength/.test(app),
  "45 degree offset regression does not verify true travel, both bend take-offs, both weld gaps and final cut length",
);
assert(
  /const\s+WELD_GAP_CHOICES_MM\s*=\s*new\s+Set\(\[1\.6,\s*2\.4\]\)/.test(app) &&
    /function\s+weldedSegmentEndCounts\s*\(/.test(app) &&
    /weldedEnds\.add\(`\$\{segmentIndex\}:\$\{Number\(nodeIndex\)\}`\)/.test(app) &&
    /fitting\?\.type\s*!==\s*"flange"/.test(app) &&
    /flangeEndsHaveOneGap/.test(app) &&
    /centrelineMm\s*-\s*bendTakeoffMmTotal\s*-\s*weldGapMm/.test(app) &&
    /Open pipe ends receive no weld-gap deduction/.test(app) &&
    html.includes('id="projectDialogWeldGapMm"') &&
    html.includes('<option value="1.6">1.6 mm</option>') &&
    html.includes('<option value="2.4">2.4 mm</option>'),
  "Selectable per-welded-end gap calculation, de-duplication, open-end rule or project control is incomplete",
);
assert(
  /function\s+projectJobsOverview\s*\(/.test(app) &&
    /function\s+projectJobOverviewRow\s*\(/.test(app) &&
    /function\s+toggleProjectLibraryJobPin\s*\(/.test(app) &&
    /data-project-library-action="job-filter"/.test(app) &&
    /data-project-library-action="job-page"/.test(app) &&
    /windowCard\.append\(projectProductionBoard\(folder\.projects\)\)/.test(app) &&
    /\.job-overview-row/.test(css) &&
    /@media\s*\(max-width:\s*720px\)[\s\S]*?\.job-overview-open/.test(css),
  "Focused Jobs overview, job-level production board, or responsive controls are incomplete",
);
const htmlThemeColor = html.match(/<meta\s+name="theme-color"\s+content="([^"]+)"/)?.[1];
assert(Boolean(htmlThemeColor), "HTML theme colour is missing");
assert(manifest.theme_color === htmlThemeColor, "Manifest and HTML theme colours differ");
assert(manifest.background_color === htmlThemeColor, "Manifest splash background does not match the default theme");

assert(!/\b(?:service[_-]?role|sb_secret)[A-Za-z0-9_.-]*/i.test(app), "A privileged Supabase key appears in app.js");
assert(!/\bsk-[A-Za-z0-9_-]{12,}/.test(app + html + supabaseSql), "An OpenAI API key appears in public app files");
assert(
  /id="aiHelperButton"/.test(html) &&
    /id="aiHelperDialog"/.test(html) &&
    /id="aiHelperContext"/.test(html) &&
    /id="aiHelperForm"/.test(html) &&
    /\.ai-helper-panel/.test(css) &&
    /function\s+aiHelperCurrentSurface\s*\(/.test(app) &&
    /function\s+renderAiHelperSuggestions\s*\(/.test(app) &&
    /surface:\s*aiHelperCurrentSurface\(\)/.test(app) &&
    /hasMultipleOpenSpools/.test(app) &&
    /function\s+setupAiHelper\s*\(/.test(app) &&
    /functions\.invoke\(AI_HELPER_FUNCTION/.test(app),
  "Ask SpoolMate interface or frontend invocation wiring is incomplete",
);
assert(
  /id="videoTutorialButton"/.test(html) &&
    /id="homeDashboardVideoButton"/.test(html) &&
    /id="tutorialVideoButton"/.test(html) &&
    /id="helpVideoButton"/.test(html) &&
    /id="videoTutorialDialog"/.test(html) &&
    /id="videoTutorialLibrary"/.test(html) &&
    /id="videoTutorialPlayer"[\s\S]*playsinline/.test(html) &&
    /id="videoTutorialBackButton"/.test(html) &&
    /id="videoTutorialPlayButton"/.test(html) &&
    /id="videoTutorialForwardButton"/.test(html) &&
    /id="videoTutorialChapterSelect"/.test(html) &&
    /id="videoTutorialTime"/.test(html) &&
    /const\s+TUTORIAL_VIDEO_URL\s*=/.test(app) &&
    /const\s+JOBS_TUTORIAL_VIDEO_URL\s*=/.test(app) &&
    /const\s+DRAWING_TUTORIAL_VIDEO_URL\s*=/.test(app) &&
    /const\s+VIDEO_TUTORIALS\s*=/.test(app) &&
    /class="tutorial-header-actions"/.test(html) &&
    /id="tutorialCloseButton"/.test(html) &&
    /function\s+renderVideoTutorialLibrary\s*\(/.test(app) &&
    /function\s+selectVideoTutorial\s*\(/.test(app) &&
    /function\s+setupVideoTutorialDialog\s*\(/.test(app) &&
    /function\s+seekVideoTutorial\s*\(/.test(app) &&
    /function\s+toggleVideoTutorialPlayback\s*\(/.test(app) &&
    /function\s+jumpToVideoTutorialChapter\s*\(/.test(app) &&
    /\.video-tutorial-card/.test(css) &&
    /\.video-tutorial-library-item/.test(css) &&
    /\.tutorial-header-actions/.test(css) &&
    /\.video-tutorial-controls/.test(css) &&
    !/720p web edition/.test(html) &&
    !/Start from beginning/.test(html) &&
    /request\.destination\s*===\s*["']video["']/.test(serviceWorker),
  "Responsive video tutorial player, entry points or streaming cache bypass is incomplete",
);
assert(
  /function\s+markDraftPdfCanvas\s*\(/.test(app) &&
    /DRAFT — NOT FOR FABRICATION/.test(app) &&
    /DRAFT-NOT-FOR-FABRICATION/.test(app) &&
    /exportFabSheetPdf\(\{\s*draft\s*\}\)/.test(app) &&
    /issuedPdfReady\s*\?\s*["']Download issued PDF["']\s*:\s*["']Download draft PDF["']/.test(app) &&
    serviceWorker.includes(`spoolmate-v${assetVersion}`),
  "Simplified draft/issued PDF flow or draft safety marking is incomplete",
);
assert(
  /id="cloudSyncStatus"[^>]*role="status"[^>]*aria-live="polite"/.test(html) &&
    /canonicalMode\s*===\s*["']saving["'][\s\S]*?["']Saving…["']/.test(app) &&
    /canonicalMode\s*===\s*["']error["'][\s\S]*?["']Save failed["']/.test(app) &&
    /canonicalMode\s*===\s*["']saved["'][\s\S]*?["']Saved to cloud["']/.test(app) &&
    /["']Local only["']/.test(app) &&
    /\.cloud-status-pill::before/.test(css),
  "Clear cloud save-state indicator is incomplete",
);
assert(
  /<button[^>]*id="cloudSyncStatus"[^>]*type="button"/.test(html) &&
    /const\s+CLOUD_SAVE_QUEUE_KEY\s*=/.test(app) &&
    /function\s+queueCurrentCloudSave\s*\(/.test(app) &&
    /function\s+retryQueuedCloudSave\s*\(/.test(app) &&
    /localStorage\.setItem\(CLOUD_SAVE_QUEUE_KEY/.test(app) &&
    /Queued \/ Retry/.test(app) &&
    /Saved \$\{formatCloudSaveTime\(cloudLastSavedAt\)/.test(app) &&
    /retryQueuedCloudSave\(\{\s*automatic:\s*true\s*\}\)/.test(app) &&
    /\.cloud-status-pill\.queued/.test(css),
  "Visible last-saved time, offline queue or one-click cloud recovery is incomplete",
);
assert(
  /id="homeDashboardRestoreButton"/.test(html) &&
    /const\s+LAST_SESSION_RECOVERY_KEY\s*=/.test(app) &&
    /function\s+loadLastSessionRecovery\s*\(/.test(app) &&
    /async function\s+restoreLastSession\s*\(/.test(app) &&
    /restored\.projectId\s*=\s*null/.test(app) &&
    /createProjectBackup\(["']before last-session restore["']\)/.test(app) &&
    /\.home-dashboard-action\.recovery/.test(css) &&
    serviceWorker.includes(`spoolmate-v${assetVersion}`),
  "Last-session recovery protection or dashboard action is incomplete",
);
assert(
  /Deno\.env\.get\(["']OPENAI_API_KEY["']\)/.test(aiHelpFunction) &&
    /https:\/\/api\.openai\.com\/v1\/responses/.test(aiHelpFunction) &&
    /model:\s*MODEL/.test(aiHelpFunction) &&
    /const\s+MODEL\s*=\s*["']gpt-5\.6-luna["']/.test(aiHelpFunction) &&
    /store:\s*false/.test(aiHelpFunction) &&
    /safety_identifier/.test(aiHelpFunction) &&
    /You should see:/.test(aiHelpFunction) &&
    /"surface",\s*"inspectorTab"/.test(aiHelpFunction) &&
    /"previewOpen",\s*"windowedWorkspace",\s*"hasSelection",\s*"hasMultipleOpenSpools"/.test(aiHelpFunction) &&
    /auth\.getUser\s*\(/.test(aiHelpFunction),
  "Protected Ask SpoolMate Edge Function is incomplete",
);
assert(
  /create table if not exists public\.ai_help_usage/.test(aiHelperMigration) &&
    /create or replace function public\.consume_ai_help_allowance/.test(aiHelperMigration) &&
    /create or replace function public\.release_ai_help_allowance/.test(aiHelperMigration) &&
    /revoke all on function public\.consume_ai_help_allowance[\s\S]*authenticated/.test(aiHelperMigration) &&
    /grant execute on function public\.consume_ai_help_allowance[\s\S]*service_role/.test(aiHelperMigration) &&
    /create table if not exists public\.ai_help_usage/.test(supabaseSql),
  "Ask SpoolMate allowance migration or complete Supabase setup is incomplete",
);
assert(
  /resetPasswordForEmail\s*\(/.test(app) && /PASSWORD_RECOVERY/.test(app) && /updateUser\s*\(\s*\{\s*password\s*\}/.test(app),
  "Password recovery request, redirect or password update wiring is incomplete",
);
assert(
  /functions\.invoke\(\s*["']delete-account["']/.test(app) &&
    /SUPABASE_SERVICE_ROLE_KEY/.test(deleteAccountFunction) &&
    /auth\.admin\.deleteUser\s*\(/.test(deleteAccountFunction),
  "Protected cloud-account deletion wiring is incomplete",
);
assert(
  /function\s+diagnosticReportPayload\s*\(/.test(app) &&
    /privacyNote:/.test(app) &&
    /id="legalSupportDialog"/.test(html) &&
    /const\s+REGRESSION_LAUNCH_CHECKS\s*=/.test(app),
  "Launch diagnostics, privacy/support or acceptance checklist is missing",
);
assert(
  /function\s+hasCloudReadAccess\s*\(/.test(app) &&
    /function\s+cloudLicenceState\s*\(/.test(app) &&
    /function\s+licenceWarningModel\s*\(/.test(app) &&
    /async function\s+loadSavedCloudProjects\s*\(\)\s*\{[\s\S]{0,220}hasCloudReadAccess\(\)/.test(app),
  "Expired-account read-only cloud access wiring is incomplete",
);
assert(
  /id="licenceBanner"/.test(html) &&
    /id="accountPlanPanel"/.test(html) &&
    /id="accountPlanUpgradeButton"/.test(html) &&
    /id="projectLibrarySourceButton"/.test(html) &&
    /\.licence-banner/.test(css) &&
    /\.account-plan-panel/.test(css),
  "Trial countdown, upgrade or cloud/device source UI is incomplete",
);
assert(
  /license_status\s+in\s*\('trial',\s*'paid',\s*'grace',\s*'full',\s*'expired'\)/.test(supabaseSql) &&
    /license_status\s*=\s*'grace'\s+and\s+grace_ends_at\s*>\s*now\(\)/.test(supabaseSql) &&
    /create policy "Users can read their own spool projects"[\s\S]{0,240}using\s*\(\s*owner_id\s*=/.test(supabaseSql) &&
    /create policy "Users can read project comments"[\s\S]{0,260}using\s*\(\s*author_id\s*=/.test(supabaseSql),
  "Complete Supabase setup does not preserve expired read access or grace licensing",
);
assert(
  /add column if not exists grace_ends_at/.test(trialAccessMigration) &&
    /create policy "Users can read their own spool projects"[\s\S]{0,240}using\s*\(\s*owner_id\s*=/.test(trialAccessMigration) &&
    /create policy "Users can manage their comments"[\s\S]{0,260}public\.has_active_license/.test(trialAccessMigration) &&
    /create policy "Authors and admins can manage spool photos"[\s\S]{0,260}public\.has_active_license/.test(trialAccessMigration),
  "v2.95 trial-access migration is incomplete",
);
assert(
  /function\s+setupNetworkAwareness\s*\(/.test(app) &&
    /addEventListener\(\s*["']offline["']/.test(app) &&
    /addEventListener\(\s*["']online["']/.test(app),
  "Offline and reconnection status wiring is missing",
);
assert(
  /isEnterKey\s*&&\s*shouldStopDrawingOnEnter/.test(app) && /stopDrawingMode\(\)/.test(app),
  "Enter-to-stop drawing wiring is missing",
);
assert(
  /if\s*\(nodeConnectionType\(nodeIndex\)\s*===\s*["']branch["']\)\s*continue/.test(app),
  "Branch nodes are no longer protected from automatic reducers",
);
assert(
  /const\s+stainless\s*=\s*normalizePipeSpec\(state\.pipeSpec\)\s*!==\s*["']carbon40["']/.test(app),
  "3D/fallback stainless material handling is missing",
);
assert(
  /const\s+PREVIEW_MODES\s*=\s*new Set\(\[["']illustrated["']/.test(app) &&
    /previewMode:\s*["']tricolor["']/.test(app) &&
    /const\s+TRICOLOR_3D_DEFAULT_KEY/.test(app) &&
    /function\s+migrateTriColor3dDrawingDefaults\s*\(/.test(app) &&
    /const\s+LEGACY_PREVIEW_MODE_MAP/.test(app) &&
    /function\s+addIllustratedModelOutlines\s*\(/.test(app) &&
    /new THREE\.EdgesGeometry\(mesh\.geometry,\s*thresholdAngle\)/.test(app) &&
    /mesh\.geometry\.type\s*!==\s*["']TubeGeometry["']/.test(app) &&
    /shell\.scale\.setScalar\(1\.008\)/.test(app) &&
    /illustratedWeldSeam/.test(app) &&
    /elbowData\.radius\s*\*\s*1\.012/.test(app) &&
    /function\s+illustratedEdgesGeometry\s*\(/.test(app) &&
    /illustratedHideStartEdge/.test(app) &&
    /value="illustrated">Illustrated workshop/.test(html) &&
    /value="tricolor">Tri-colour by pipe size/.test(html) &&
    /triColorPalette/.test(app) &&
    /function\s+updatePreviewSizeColourLegend\s*\(/.test(app) &&
    /contactShadowOpacity:\s*0\.13/.test(app) &&
    /projectedHalfWidth\s*\/\s*Math\.max\(aspect,\s*0\.25\)/.test(app) &&
    /body:not\(\.preview-panel-hidden\)\s+\.ai-helper-launcher/.test(css),
  "Default tri-colour or illustrated 3D model rendering is incomplete",
);
assert(
  /ROLL_GROOVE_SETBACK_MM\s*=\s*18/.test(app) &&
    /ROLL_GROOVE_VISUAL_WIDTH_MM\s*=\s*9/.test(app) &&
    /function\s+rollGrooveAssembly\s*\(/.test(app) &&
    /gasket-seat land/.test(app) &&
    /grooveBand/.test(app),
  "Victaulic-style roll-groove representation is incomplete",
);
assert(
  /const\s+FITTING_TOOLS\s*=\s*new Set\(\[[^\]]*["']threadedEnd["']/.test(app) &&
    /label:\s*["']Add threaded pipe end["']/.test(app) &&
    /label:\s*["']Threaded pipe end["']/.test(app) &&
    /function\s+threadedPipeEndAssembly\s*\(/.test(app) &&
    /new THREE\.TubeGeometry\(curve,\s*pointCount/.test(app) &&
    /threadLength\s*\/\s*0\.017/.test(app) &&
    /clampNumber\([\s\S]*?0\.068,\s*0\.105\)/.test(app) &&
    /0x53615f/.test(app) &&
    /function\s+threadedPipeEndLength\s*\(/.test(app) &&
    /threadedEndSides\.has\(`\$\{segment\.index\}:start`\)/.test(app) &&
    /threadedEndSides\.has\(`\$\{segment\.index\}:end`\)/.test(app) &&
    /const\s+shoulderRadius\s*=\s*pipeRadius\s*\*\s*0\.92/.test(app) &&
    /const\s+endRadius\s*=\s*pipeRadius\s*\*\s*0\.84/.test(app) &&
    /threadedMachinedSection/.test(app) &&
    /for\s*\(const\s+fitting\s+of\s+state\.fittings\)[\s\S]*?const\s+segmentPipeMaterial\s*=\s*pipeMaterialForSegment\(segment\)/.test(app) &&
    /threadedEnd:\$\{size\.nb\}/.test(app) &&
    /fitting\.type\s*===\s*["']threadedEnd["']/.test(app),
  "Threaded pipe-end menu, takeoff or 3D rendering is incomplete",
);
const takeoffDataSource = app.match(/function\s+takeoffData\s*\([\s\S]*?\nfunction\s+autoReducerTransitions\s*\(/)?.[0] ?? "";
assert(
  /for\s*\(const\s+reducer\s+of\s+autoReducersForTeeNode\(nodeIndex,\s*connected,\s*segmentData\)\)/.test(takeoffDataSource) &&
    /applyReducerTakeoff\(segmentTakeoffs,\s*reducer\)/.test(takeoffDataSource) &&
    /reducers\.push\(reducer\)/.test(takeoffDataSource),
  "Reducing tee reducers are no longer included in shared take-off quantities",
);
const teeAssemblySource = app.match(/function\s+teeNodeAssembly\s*\([\s\S]*?\nfunction\s+outlineTeeMarker\s*\(/)?.[0] ?? "";
assert(
  /illustratedHideStartEdge/.test(teeAssemblySource) && !/torusRing\(/.test(teeAssemblySource),
  "Equal tee assembly has regained an internal construction ring",
);
assert(/\.slice\(-240\)/.test(app), "Expanded spool activity retention is missing");
assert(
  /Changed \$\{runText\} from \$\{previousLabel\} to \$\{nextLabel\}/.test(app),
  "Pipe-size activity history wiring is missing",
);
assert(
  /title:\s*["']Returned by checker["']/.test(app),
  "Checker-return team alert is missing",
);
assert(
  /title:\s*`Revision \$\{revision\} issued`/.test(app),
  "Revision-issued team alert is missing",
);
assert(
  /data-mode-settings="draw edit"/.test(html) && /data-mode-settings="review"/.test(html) && /data-mode-settings="export"/.test(html),
  "Focused workspace setting groups are missing",
);
assert(
  /data-mode-tabs="draw edit"/.test(html) && /data-mode-tabs="review export"/.test(html),
  "Mode-specific inspector tabs are missing",
);
assert(/function\s+updateAppModeVisibility\s*\(/.test(app), "Workspace visibility wiring is missing");
assert(
  /id="fittingsToolButton"/.test(html) && /id="fittingsToolMenu"/.test(html) &&
    ["tee", "branch", "flange", "reducer", "rollGroove", "valve", "socket"].every((tool) => html.includes(`data-tool="${tool}"`)),
  "Compact Fittings flyout is incomplete",
);
assert(
  /function\s+setInspectorDrawerOpen\s*\(/.test(app) && /inspector-drawer-open/.test(css) && /id="inspectorShowButton"/.test(html),
  "Inspector drawer wiring is incomplete",
);
assert(
  /target:\s*"#fittingsToolButton"/.test(app) && /data-tutorial-trainer-choice="open-fittings"/.test(app),
  "Tutorial no longer teaches the Fittings flyout",
);
assert(
  /id="touchShiftAngleButton"/.test(html) &&
    /function\s+setupTouchShiftAngleButton\s*\(/.test(app) &&
    /setShiftAngleSnap\(true\)/.test(app) &&
    /touch-shift-angle-button/.test(css),
  "Touch Hold 45 degree drawing control is incomplete",
);
assert(
  /TUTORIAL_PROGRESS_KEY/.test(app) &&
    /function\s+restoreTutorialProgress\s*\(/.test(app) &&
    /function\s+persistTutorialProgress\s*\(/.test(app) &&
    /function\s+tutorialResumeStepIndex\s*\(/.test(app) &&
    /Finish tour/.test(app),
  "Saved and resumable tutorial progress is incomplete",
);
assert(
  /QUICK_START_TUTORIAL_STEP_INDEXES/.test(app) &&
    /data-tutorial-mode="quick"/.test(app) &&
    /5-minute Quick Start/.test(app),
  "The 5-minute Quick Start tutorial path is incomplete",
);
assert(
  /data-tutorial-use-real/.test(app) &&
    /function\s+tryTutorialStepInDrawing\s*\(/.test(app) &&
    /tutorial-use-real-button/.test(css),
  "Try in drawing handoff is incomplete",
);
assert(
  /id="firstSpoolGuide"/.test(html) &&
    /FIRST_USE_GUIDE_KEY/.test(app) &&
    /function\s+setupFirstUseGuide\s*\(/.test(app) &&
    /body\.first-spool-mode/.test(css),
  "The progressive First Spool workspace is incomplete",
);
assert(
  /function\s+tutorialLaunchChecklistMarkup\s*\(/.test(app) &&
    /tutorial-launch-checklist/.test(css) &&
    /Workshop PDF exported/.test(app),
  "The final first-spool checklist is incomplete",
);
assert(
  /Weld markers are numbered W01, W02/.test(app) && /permanent spool\/revision QR traveller/.test(app),
  "Tutorial is missing weld-register or QR-traveller launch guidance",
);
assert(
  /function\s+projectTodayBoard\s*\(/.test(app) &&
    /Assigned to me/.test(app) &&
    /Ready for checking/.test(app) &&
    /On hold/.test(app) &&
    /function\s+projectTodayGroups\s*\(/.test(app) &&
    /data-project-library-action="scan-qr"/.test(app) &&
    /team-today-board/.test(css),
  "Simplified Today team dashboard or Scan QR entry point is incomplete",
);
assert(
  /const\s+JOB_DASHBOARD_PREFERENCES_VERSION\s*=\s*1/.test(app) &&
    /function\s+hydrateCloudDashboardPreferences\s*\(/.test(app) &&
    /function\s+flushCloudDashboardPreferences\s*\(/.test(app) &&
    /\.select\("dashboard_preferences"\)/.test(app) &&
    /\.update\(\{ dashboard_preferences: dashboardPreferences \}\)/.test(app) &&
    /add column if not exists dashboard_preferences jsonb/.test(jobsDashboardPreferencesMigration) &&
    /Users can update their dashboard preferences/.test(jobsDashboardPreferencesMigration) &&
    /revoke update on public\.profiles from authenticated/.test(jobsDashboardPreferencesMigration) &&
    /grant update \(dashboard_preferences\) on public\.profiles to authenticated/.test(jobsDashboardPreferencesMigration),
  "Per-workspace cloud Jobs dashboard preferences or protected migration is incomplete",
);
assert(
  app.includes('["active", "Active"]') &&
    app.includes('["mine", "My jobs"]') &&
    app.includes('["completed", "Completed"]') &&
    app.includes('["all", "All"]') &&
    /data-project-library-action="show-guide"/.test(app) &&
    /data-project-library-action="show-comms"/.test(app) &&
    /data-project-library-action="show-report"/.test(app) &&
    /id="projectLibraryGuideButton"[^>]*hidden/.test(html) &&
    /id="projectLibraryCommsButton"[^>]*hidden/.test(html) &&
    /id="projectLibraryReportButton"[^>]*hidden/.test(html) &&
    /id="projectLibrarySaveButton"[^>]*hidden/.test(html) &&
    /library-action[\s\S]{0,360}shouldSkipProjectLibraryActivation\(actionKey,\s*1500\)/.test(app) &&
    /function\s+bindRenderedProjectLibraryActions\s*\(/.test(app) &&
    /projectLibraryActionBound/.test(app) &&
    !/projectLibraryList\?\.addEventListener\("pointerdown"/.test(app) &&
    !/projectLibraryList\?\.addEventListener\("pointerup"/.test(app) &&
    /projectLibraryList\?\.addEventListener\("click"/.test(app),
  "Compact Jobs filters or consolidated More tools are incomplete",
);
assert(
  /previousLayout:\s*true/.test(app) &&
    /Use My day/.test(jobsStoryboard) &&
    /More/.test(jobsVoiceover) &&
    /Ready for checking/.test(jobsCaptions) &&
    /const\s+openMore\s*=\s*async\s*\(/.test(jobsCaptureScript),
  "Jobs tutorial sources or previous-layout video warning are not aligned with v3.39",
);
assert(
  /async function\s+openQrScanner\s*\(/.test(app) &&
    /facingMode:\s*\{\s*ideal:\s*"environment"/.test(app) &&
    /function\s+scanQrImageFile\s*\(/.test(app) &&
    /function\s+scannedSpoolTravellerUrl\s*\(/.test(app) &&
    /scanned\.origin\s*!==\s*location\.origin/.test(app) &&
    /qr-scanner-backdrop/.test(css),
  "Camera/photo QR scanner or same-origin traveller validation is incomplete",
);
assert(
  /function\s+resolveSpoolTravellerRevision\s*\(/.test(app) &&
    /requestedRevisionUid:\s*params\.get\("revision"\)/.test(app) &&
    /Revision could not be verified/.test(app) &&
    /Issued revision snapshot/.test(app),
  "QR traveller revision verification or snapshot handling is incomplete",
);
assert(
  /function\s+setFocusMode\s*\(/.test(app) && /body\.focus-mode/.test(css) && /data-tutorial-trainer-choice="focus-toggle"/.test(app),
  "Focus mode or its tutorial is incomplete",
);
assert(
  /PREVIEW_FLOAT_BOUNDS_KEY/.test(app) && /storePreviewFloatBoundsPreference\(previewFloatBounds\)/.test(app) && /id="previewShowButton"/.test(html),
  "Remembered compact 3D overlay wiring is incomplete",
);
assert(
  /id="projectLibrarySpoolConversation"/.test(html) && /id="projectCommentsList"/.test(html) && !/spool-conversation-section/.test(html),
  "Spool conversation is not isolated to the Jobs workspace",
);
assert(/id="projectAssigneeReadout"/.test(html), "Drawing header assignee readout is missing");
assert(
  /id="saveBrowserProjectButton"[^>]*class="[^"]*save-action/.test(html) ||
    /class="[^"]*save-action[^"]*"[^>]*id="saveBrowserProjectButton"/.test(html),
  "Primary Save action is missing its semantic style class",
);
assert(
  ["export3dButton", "exportReportButton", "exportProjectButton", "exportIsoButton"].every((id) => {
    const tag = html.match(new RegExp(`<button\\b[^>]*id=["']${id}["'][^>]*>`, "i"))?.[0] ??
      html.match(new RegExp(`<button\\b[^>]*class=["'][^"']*export-action[^"']*["'][^>]*id=["']${id}["'][^>]*>`, "i"))?.[0] ?? "";
    return /export-action/.test(tag);
  }),
  "Export controls are missing semantic export styling",
);
assert(
  /--primary-action:/.test(css) && /--save-action:/.test(css) && /--export-action:/.test(css) && /--danger-action-soft:/.test(css),
  "Semantic visual-hierarchy tokens are missing",
);
assert(
  /healthAcknowledgements:\s*normalizeHealthAcknowledgements\(state\.healthAcknowledgements\)/.test(app) &&
    /healthAcknowledgements:\s*normalizeHealthAcknowledgements\(saved\.healthAcknowledgements\)/.test(app),
  "Drawing-check acknowledgements are not persisted and restored",
);
assert(
  /Acknowledge & allow issue/.test(app) && /function\s+acknowledgeHealthIssue\s*\(/.test(app) && /function\s+reopenHealthIssue\s*\(/.test(app),
  "Actionable drawing-check acknowledgement controls are incomplete",
);
assert(
  /"Revision missing"/.test(app) && /\["set-revision-a",\s*"Set Rev A"/.test(app) &&
    /function\s+promptForMissingIssueRevision\s*\(/.test(app) && /checks\.projectMissing\.includes\("revision"\)/.test(app),
  "Missing revision is not actionable from Drawing checks and Issue drawing",
);
assert(
  /revision:\s*"A"/.test(constExpression(app, "PROJECT_INFO_DEFAULT")),
  "New drawings no longer default to Revision A",
);
assert(
  /state\.nodeTypes\[nodeIndex\]\s*=\s*type/.test(app) && /state\.nodeTypes\[key\]\s*===\s*["']tee["']/.test(app) &&
    /data-health-action="\$\{escapeHtml\(action\)\}"/.test(app),
  "Tee/branch health-check fixes are not retained or wired",
);
assert(
  /function\s+weldReadyIssueFindings\s*\(/.test(app) &&
    /if\s*\(checks\.blockers\.length\)\s*return\s+["']blocked["']/.test(app) &&
    /if\s*\(checks\.warnings\.length\)\s*return\s+["']review["']/.test(app) &&
    /const\s+warnings\s*=\s*\[\.\.\.checks\.warnings\]/.test(app),
  "Ready to Issue severity or warning handling is incomplete",
);
assert(
  /<strong>Ready to Issue<\/strong>/.test(app) &&
    /Spool is on hold/.test(app) &&
    /is missing a WPS/.test(app) &&
    /Drawing has not been approved/.test(app) &&
    /data-preissue-finding=/.test(app) &&
    /function\s+handlePreIssueFinding\s*\(/.test(app),
  "Ready to Issue gate or focused fix actions are incomplete",
);
assert(
  /id="roleAccessNotice"/.test(html) &&
    /function\s+currentRoleAccessText\s*\(/.test(app) &&
    /function\s+currentPermissionRestrictionText\s*\(/.test(app) &&
    /function\s+updateRoleRestrictedDrawingTools\s*\(/.test(app) &&
    /!permission\.canIssue/.test(app) &&
    /!currentDrawingProjectPermission\(\)\.canManageProduction/.test(app) &&
    /productionOnly:\s*true/.test(app) &&
    /`Fix:\s*\$\{actionLabel\s*\|\|\s*"Review checks"\}`/.test(app) &&
    /class="\$\{finding\.severity\s*===\s*"blocker"\s*\?\s*"primary-fix"/.test(app) &&
    /data-production-project-id/.test(app),
  "Role-specific controls or single-action QA blocker fixes are incomplete",
);
assert(
  /function\s+promptForIssueWarningOverride\s*\(/.test(app) &&
    /Required reason for issuing with warnings/.test(app) &&
    /function\s+recordReadyIssueAudit\s*\(/.test(app) &&
    /issueAudits:\s*normalizeIssueAudits\(state\.issueAudits\)/.test(app) &&
    /issueAudits:\s*normalizeIssueAudits\(saved\.issueAudits\)/.test(app) &&
    /addRevisionSnapshot\(["']Issued after Ready to Issue gate["']/.test(app),
  "Warning override or revision issue-audit persistence is incomplete",
);
assert(
  /function\s+latestIssueAudit\s*\([\s\S]*?currentRevisionUid\(source\)[\s\S]*?audit\.revisionUid\s*&&\s*audit\.revisionUid\s*===\s*revisionUid/.test(app) &&
    /state\s*=\s*restored;[\s\S]*?state\.checkedAt\s*=\s*"";[\s\S]*?state\.issuedAt\s*=\s*"";/.test(app),
  "Current-revision audit matching or restored-revision approval reset is incomplete",
);
assert(
  /async function\s+exportIsoImage\s*\([\s\S]*?const\s+draft\s*=\s*!state\.issuedAt[\s\S]*?exportFabSheetPdf\(\{\s*draft\s*\}\)/.test(app) &&
    /if\s*\(draft\)\s*\{[\s\S]*?markDraftPdfCanvas\(reportCanvas\)[\s\S]*?\}\s*else\s*\{[\s\S]*?drawTraceabilityQr\(reportCanvas\)/.test(app) &&
    /drawReportInfoTile\(ctx,\s*["']Ready to issue["']/.test(app) &&
    /<span>Issue audit<\/span>/.test(app),
  "Draft marking, issued QR protection or Ready to Issue audit display is incomplete",
);
assert(
  /\.preissue-card\.preissue-ready/.test(css) &&
    /\.preissue-review\s+\.preissue-heading span/.test(css) &&
    /\.preissue-blocked\s+\.preissue-heading span/.test(css) &&
    /\.ready-issue-finding[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/.test(css),
  "Ready to Issue colours or touch layout are incomplete",
);
assert(
  /--tool-rail-width:\s*84px/.test(css) &&
    /v3\.01 workspace layout polish/.test(css) &&
    /\.tool-rail \.tool-grid\s*\{[\s\S]*?grid-template-columns:\s*1fr/.test(css),
  "Calm desktop tool rail or canvas-width recovery is incomplete",
);
assert(
  /const\s+APP_MODE_WORKSPACE_TITLE\s*=/.test(app) &&
    /workspaceTitle\.textContent\s*=\s*APP_MODE_WORKSPACE_TITLE/.test(app) &&
    /id="workspaceTitle"/.test(html),
  "Mode-specific workspace heading is incomplete",
);
assert(
  /function\s+showMobilePanel\s*\([\s\S]*?requested\s*===\s*["']preview["'][\s\S]*?setInspectorDrawerOpen\(false\)[\s\S]*?previewPanelHidden\s*=\s*false/.test(app) &&
    /function\s+setInspectorDrawerOpen\s*\([\s\S]*?previewPanelHidden\s*=\s*true/.test(app) &&
    /previewShowButton\?\.addEventListener\([\s\S]*?showMobilePanel\("preview"\)/.test(app),
  "Details and 3D no longer enforce one contextual surface",
);
assert(
  /function\s+revealInspectorForSelection\s*\([\s\S]*?isTabletLayout\(\)\s*\|\|\s*!previewPanelHidden/.test(app) &&
    /function\s+reconcileWorkspaceLayout\s*\(/.test(app) &&
    /function\s+captureWorkspaceSurfaceState\s*\(/.test(app) &&
    /function\s+restoreWorkspaceSurfaceState\s*\(/.test(app) &&
    /function\s+resetWorkspaceLayout\s*\(/.test(app) &&
    /id="resetWorkspaceLayoutButton"/.test(html) &&
    /id="inspectorOpenPreviewButton"/.test(html) &&
    /id="previewOpenInspectorButton"/.test(html) &&
    /function\s+closePrimaryWorkspaceDialogs\s*\(/.test(app) &&
    /body\.mobile-touch-layout #previewMinimizeButton/.test(css) &&
    /body\.mobile-panel-open \.ai-helper-launcher/.test(css) &&
    /\.control-panel,[\s\S]*?\.preview-panel\s*\{[\s\S]*?z-index:\s*360/.test(css),
  "Cross-platform workspace surface coordination is incomplete",
);
assert(
  /body\.tablet-layout\.field-layout \.mobile-panel-dock\s*\{\s*display:\s*none/.test(css) &&
    /body\.tablet-layout\.field-layout \.inspector-show-button\s*\{\s*display:\s*inline-flex/.test(css) &&
    /height:\s*min\(74dvh,\s*680px\)/.test(css),
  "Tablet single-dock or large-sheet layout is incomplete",
);
assert(
  !/id="accountMenuButton"/.test(html) &&
    !/id="newRevisionButton"/.test(html) &&
    !/id="shareReadOnlyButton"/.test(html) &&
    !/data-workflow-action="save-defaults"/.test(app) &&
    /#exportIsoButton\s*\{\s*display:\s*none\s*!important/.test(css),
  "Duplicate permanent, Review or PDF actions remain visible",
);
assert(
  /function\s+branchMainLinkedSegmentIndexes\s*\(/.test(app) &&
    /const\s+selected\s*=\s*branchMainLinkedSegmentIndexes\(requestedSelected\)/.test(app) &&
    /return\s+branchMainLinkedSegmentIndexes\(requested\)/.test(app),
  "Pipe-size changes no longer propagate across a continuous welded-branch main",
);
assert(
  /const\s+mainPair\s*=\s*mostOppositeEntryPair\(entries\)/.test(app) &&
    /mainSizePropagationExact/.test(app) && /branchIndexes\.every\(\(index\)\s*=>\s*!linkedFromFirstMain\.includes\(index\)\)/.test(app),
  "Branch main geometry or outlet-exclusion regression coverage is missing",
);
const focusHealthIssueSource = app.match(/async function\s+focusHealthIssue\s*\([\s\S]*?\nfunction\s+startHealthIssueHighlight\s*\(/)?.[0] ?? "";
assert(
  /applyAppMode\(["']review["']/.test(focusHealthIssueSource) &&
    /activateInspectorTab\(["']checks["']\)/.test(focusHealthIssueSource) &&
    /showMobilePanel\(["']inspector["']\)/.test(focusHealthIssueSource) &&
    !/applyAppMode\(["']edit["']/.test(focusHealthIssueSource) &&
    !/activateInspectorTab\(["']properties["']\)/.test(focusHealthIssueSource),
  "Show on drawing no longer preserves Review and the Checks inspector",
);
assert(
  [
    "workspaceSettingsButton",
    "workspaceSettingsPanel",
    "workspaceSettingsCloseButton",
    "workspaceSettingsScrim",
    "simpleControlsButton",
    "fullControlsButton",
    "actionMenuJobsButton",
    "actionMenuBigSpoolButton",
    "actionMenuAccountButton",
  ].every((id) => html.includes(`id="${id}"`)),
  "Simple / Full workspace controls or Menu fallbacks are missing",
);
assert(
  /const\s+INTERFACE_DENSITY_KEY\s*=\s*["']spoolmate-interface-density-v1["']/.test(app) &&
    /function\s+setInterfaceDensity\s*\(/.test(app) &&
    /classList\.toggle\(["']simple-controls["'],\s*simple\)/.test(app) &&
    /localStorage\.setItem\(INTERFACE_DENSITY_KEY,\s*interfaceDensity\)/.test(app),
  "The permanent Simple / Full preference is not wired or persisted",
);
assert(
  /function\s+openWorkspaceSettings\s*\(/.test(app) &&
    /function\s+closeWorkspaceSettings\s*\(/.test(app) &&
    /updateWorkspaceSettingsSummary\(\)/.test(app),
  "Pipe & display sheet behaviour or summary is missing",
);
assert(
  /classList\.toggle\(["']single-spool["'],\s*singleSpool\)/.test(app) &&
    /\.spool-workspace-shell\.single-spool\s+\.spool-workspace-tabs/.test(css),
  "Single-spool tab-strip compaction is missing",
);
assert(
  /body:not\(\[data-app-mode=["']draw["']\]\)\s+#touchShiftAngleButton/.test(css) &&
    /body\[data-app-mode=["']review["']\]\s+\.tool-flyout-wrap/.test(css),
  "Drawing actions are no longer restricted to their relevant workflow modes",
);
assert(
  /body\.phone-layout\.field-layout\.mobile-touch-layout\s+\.topbar-settings[\s\S]*?display:\s*none\s*!important/.test(css) &&
    /mobile-touch-layout\.workspace-settings-open\s+\.topbar-settings[\s\S]*?display:\s*grid\s*!important/.test(css) &&
    /grid-template-areas:[\s\S]*?["']primary primary["'][\s\S]*?["']settings-trigger actions["']/.test(css),
  "Phone and tablet two-row header or settings-sheet layout is missing",
);
assert(
  html.includes("Simple and Full controls") &&
    app.includes("Use Simple controls for the clearest drawing workspace") &&
    app.includes("Open Pipe & display"),
  "Help and tutorial guidance does not explain the simplified workspace",
);

const cachedAssets = matches(serviceWorker, /["'](\.\/[^"']+)["']/g).map((match) => match[1].split("?")[0]);
for (const asset of cachedAssets) {
  assert(fs.existsSync(path.join(ROOT, asset.slice(2))), `Service worker asset is missing: ${asset}`);
}
for (const icon of manifest.icons ?? []) {
  const iconPath = path.join(ROOT, icon.src);
  assert(fs.existsSync(iconPath), `Manifest icon is missing: ${icon.src}`);
  if (fs.existsSync(iconPath) && icon.type === "image/png" && /^\d+x\d+$/.test(icon.sizes ?? "")) {
    const image = fs.readFileSync(iconPath);
    const [expectedWidth, expectedHeight] = icon.sizes.split("x").map(Number);
    const pngSignature = image.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
    const actualWidth = pngSignature && image.length >= 24 ? image.readUInt32BE(16) : 0;
    const actualHeight = pngSignature && image.length >= 24 ? image.readUInt32BE(20) : 0;
    assert(
      actualWidth === expectedWidth && actualHeight === expectedHeight,
      `Manifest icon dimensions differ for ${icon.src}: expected ${icon.sizes}, got ${actualWidth}x${actualHeight}`,
    );
  }
}

try {
  const specs = constValue(app, "PIPE_SPECS");
  const fittingProfiles = constValue(app, "FITTING_DATA_PROFILES");
  const sizes = constValue(app, "PIPE_SIZES");
  const teeTakeoffs = constValue(app, "TEE_TAKEOFF_MM");
  const elbow45Takeoffs = constValue(app, "ELBOW_45_TAKEOFF_MM");
  const reducerLengths = constValue(app, "REDUCER_LENGTH_MM");
  const buttweldWeights = constValue(app, "ATLAS_BUTTWELD_WEIGHTS");
  const stainlessReducers = constValue(app, "ATLAS_STAINLESS10_REDUCER_WEIGHTS");
  const eccentricReducerWeightOverrides = constValue(app, "ATLAS_STAINLESS10_ECCENTRIC_REDUCER_WEIGHT_OVERRIDES");
  const flangeTables = constValue(app, "FLANGE_DRILLING_TABLES");
  const pipeSizes = sizes.filter((size) => size.kind !== "tube");
  const tubeSizes = sizes.filter((size) => size.kind === "tube");
  const atlasPipe45Dimensions = {
    15: 16, 20: 19, 25: 22, 32: 25, 40: 29, 50: 35, 65: 44, 80: 51,
    90: 57, 100: 64, 125: 79, 150: 95, 200: 127, 250: 159, 300: 190,
  };
  const atlasPipe90Dimensions = {
    15: 38, 20: 38, 25: 38, 32: 48, 40: 57, 50: 76, 65: 95, 80: 114,
    90: 133, 100: 152, 125: 190, 150: 229, 200: 305, 250: 381, 300: 457,
  };
  const atlasTeeDimensions = {
    15: 25, 20: 29, 25: 38, 32: 48, 40: 57, 50: 64, 65: 76, 80: 86,
    90: 95, 100: 105, 125: 124, 150: 143, 200: 178, 250: 216, 300: 254,
  };
  const atlasReducerDimensions = {
    15: 38, 20: 38, 25: 51, 32: 51, 40: 64, 50: 76, 65: 89, 80: 89,
    90: 102, 100: 102, 125: 127, 150: 140, 200: 152, 250: 178, 300: 203,
  };
  const atlasCarbonWeights = {
    15: { elbow90: 0.08, elbow45: 0.04, tee: 0.09 },
    20: { elbow90: 0.11, elbow45: 0.06, reducer: 0.06, tee: 0.13 },
    25: { elbow90: 0.16, elbow45: 0.08, reducer: 0.12, tee: 0.25 },
    32: { elbow90: 0.26, elbow45: 0.13, reducer: 0.16, tee: 0.43 },
    40: { elbow90: 0.37, elbow45: 0.19, reducer: 0.25, tee: 0.61 },
    50: { elbow90: 0.66, elbow45: 0.33, reducer: 0.38, tee: 0.88 },
    65: { elbow90: 1.29, elbow45: 0.69, reducer: 0.73, tee: 1.74 },
    80: { elbow90: 2.04, elbow45: 1.02, reducer: 0.94, tee: 2.41 },
    90: { elbow90: 2.94, elbow45: 1.47, reducer: 1.19, tee: 3.26 },
    100: { elbow90: 3.84, elbow45: 1.92, reducer: 1.45, tee: 4.12 },
    125: { elbow90: 6.48, elbow45: 3.24, reducer: 2.5, tee: 6.54 },
    150: { elbow90: 9.94, elbow45: 4.97, reducer: 3.6, tee: 9.58 },
    200: { elbow90: 20.1, elbow45: 10.1, reducer: 5.7, tee: 17.9 },
    250: { elbow90: 35.4, elbow45: 17.7, reducer: 9.6, tee: 30.4 },
    300: { elbow90: 52, elbow45: 26, reducer: 13.6, tee: 43.6 },
  };

  assert(
    Object.keys(fittingProfiles).join(",") === "atlasAsmeB169,as1528Supplier,workshopBranch",
    "Fitting data profiles are missing or out of order",
  );
  assert(
    fittingProfiles.atlasAsmeB169.sourceStatus === "verified" &&
      fittingProfiles.as1528Supplier.sourceStatus === "supplier confirmation" &&
      fittingProfiles.workshopBranch.sourceStatus === "workshop confirmation",
    "Fitting data profile source statuses are incorrect",
  );
  assert(html.includes('id="projectDialogFittingProfile"'), "Project fitting data profile selector is missing");
  assert(html.includes('id="projectDialogFittingProfileReference"'), "Project fitting profile reference input is missing");
  assert(html.includes('id="projectDialogWeldGapMm"'), "Project weld-gap selector is missing");
  assert(
    app.includes('key === "fittingProfile"') && app.includes("normalizeFittingDataProfile(source[key]"),
    "Fitting profile is not normalized with project data",
  );
  assert(app.includes("fittingCalculationSourceSummary"), "Fitting calculation source summary is missing");
  assert(app.includes('[\"Fitting data\", fittingSource.shortProfileText]'), "Client PDF fitting data row is missing");
  assert(app.includes('[\"Weld gap\", `${formatWeldGapMm(quantities.weldGapPerEndMm)} mm per welded pipe end'), "Client PDF weld-gap row is missing");
  assert(app.includes("regressionAutoCheck45OffsetSizeMatrix"), "Multi-size 45 degree offset regression is missing");
  assert(
    [25, 50, 100, 150, 300].every((nb) => app.includes(`[${nb}, ${atlasPipe45Dimensions[nb]}]`)),
    "45 degree offset regression size matrix is incomplete",
  );

  assert(new Set(sizes.map((size) => size.nb)).size === sizes.length, "Pipe/tube size keys are not unique");
  for (const size of pipeSizes) {
    assert(size.od > size.wall40 * 2 && size.od > size.wall10 * 2, `Invalid wall thickness for NB ${size.nb}`);
    assert(size.kgPerM40 > 0 && size.kgPerM10 > 0, `Missing pipe weight for NB ${size.nb}`);
    assert(teeTakeoffs[size.nb] > 0, `Missing tee takeoff for NB ${size.nb}`);
    assert(reducerLengths[size.nb] > 0, `Missing reducer length for NB ${size.nb}`);
    if (Object.hasOwn(atlasPipe45Dimensions, size.nb)) {
      assert(
        elbow45Takeoffs[size.nb] === atlasPipe45Dimensions[size.nb],
        `Atlas 45 degree elbow takeoff differs for NB ${size.nb}`,
      );
      assert(size.lrRadius === atlasPipe90Dimensions[size.nb], `Atlas 90 degree elbow takeoff differs for NB ${size.nb}`);
      assert(teeTakeoffs[size.nb] === atlasTeeDimensions[size.nb], `Atlas tee takeoff differs for NB ${size.nb}`);
      assert(reducerLengths[size.nb] === atlasReducerDimensions[size.nb], `Atlas reducer length differs for NB ${size.nb}`);
      assert(
        JSON.stringify(buttweldWeights.carbon40[size.nb]) === JSON.stringify(atlasCarbonWeights[size.nb]),
        `Atlas carbon fitting weights differ for NB ${size.nb}`,
      );
    }
    const carbonCalculated = specs.carbon40.weightCoefficient * (size.od - size.wall40) * size.wall40;
    const stainlessCalculated = specs.stainless10.weightCoefficient * (size.od - size.wall10) * size.wall10;
    assert(Math.abs(carbonCalculated - size.kgPerM40) <= 0.08, `Carbon kg/m is inconsistent for NB ${size.nb}`);
    assert(Math.abs(stainlessCalculated - size.kgPerM10) <= 0.08, `Stainless kg/m is inconsistent for NB ${size.nb}`);
  }

  assert(!Object.hasOwn(buttweldWeights.carbon40[15], "reducer"), "DN15 carbon reducer must not use the Atlas stub-end weight");
  assert(buttweldWeights.carbon40[20].reducer === 0.06, "DN20 carbon reducer weight must match the Atlas reducer column");
  assert(stainlessReducers["40:32"] === 0.21, "DN40 x DN32 concentric Schedule 10S reducer must be 0.21 kg");
  assert(eccentricReducerWeightOverrides["40:32"] === 0.24, "DN40 x DN32 eccentric Schedule 10S reducer must be 0.24 kg");
  assert(
    app.includes("ELBOW_45_TAKEOFF_MM[size.nb]"),
    "45 degree pipe elbows are not using the explicit Atlas centre-to-end table",
  );
  assert(
    app.includes("Sanitary tube fitting dimensions need supplier confirmation"),
    "Sanitary tube fitting dimension source warning is missing",
  );
  assert(
    app.includes("Fabricated branch take-off uses a workshop estimate"),
    "Fabricated branch dimension source warning is missing",
  );

  for (const size of tubeSizes) {
    assert(size.od > size.wallTube * 2, `Invalid stainless tube wall at OD ${size.od}`);
    assert(size.kgPerMTube > 0 && size.tubeTeeTakeoffMm > 0 && size.tubeReducerLengthMm > 0, `Incomplete stainless tube row at OD ${size.od}`);
    const calculated = specs.stainlessTube.weightCoefficient * (size.od - size.wallTube) * size.wallTube;
    // Atlas marks tube weights as approximate and publishes some rows with 0.1 kg/m rounding.
    assert(Math.abs(calculated - size.kgPerMTube) <= 0.12, `Tube kg/m is inconsistent at OD ${size.od}`);
  }

  for (const [pair, weight] of Object.entries(stainlessReducers)) {
    const [large, small] = pair.split(":").map(Number);
    assert(large > small && weight > 0, `Invalid stainless reducer pair ${pair}`);
    assert(pipeSizes.some((size) => size.nb === large), `Unknown large end in stainless reducer pair ${pair}`);
    assert(pipeSizes.some((size) => size.nb === small), `Unknown small end in stainless reducer pair ${pair}`);
  }

  let flangeRowCount = 0;
  for (const [standard, rows] of Object.entries(flangeTables)) {
    let previousNb = 0;
    for (const [nb, od, thickness, pcd, hole, count] of rows) {
      flangeRowCount += 1;
      assert(nb > previousNb, `Flange table ${standard} is not sorted at NB ${nb}`);
      assert(od > pcd && pcd > hole && thickness > 0, `Invalid flange dimensions for ${standard} NB ${nb}`);
      assert(Number.isInteger(count) && count >= 4 && count % 4 === 0, `Invalid bolt count for ${standard} NB ${nb}`);
      previousNb = nb;
    }
  }
  notes.push(`${pipeSizes.length} pipe rows, ${tubeSizes.length} tube rows, ${Object.keys(stainlessReducers).length} stainless reducer pairs, ${flangeRowCount} flange rows`);
} catch (error) {
  fail(`Engineering table validation failed: ${error.message}`);
}

assert(
  html.includes('id="reducerTypeSelect"') &&
    app.includes('const REDUCER_TYPE_OPTIONS = new Set(["concentric", "eccentric"])') &&
    app.includes("reducerTypeOverrides: normalizeReducerTypeOverrides(state.reducerTypeOverrides") &&
    app.includes("function toggleContextAutoReducerType") &&
    app.includes("function toggleContextManualReducerType") &&
    app.includes("function reducerEccentricOffsetMm") &&
    app.includes("function reducerProfile2d") &&
    app.includes('className = "pipe-size-label reducer-type-label"') &&
    app.includes("reducerDimensionDetail(reducer)") &&
    css.includes(".reducer-type-label"),
  "Concentric/eccentric reducer selection, saved state, iso shape, dimensions or 3D labels are incomplete",
);

const rpcCalls = matches(app, /\.rpc\(\s*["']([^"']+)["']/g).map((match) => match[1]);
for (const rpc of new Set(rpcCalls)) {
  const definition = new RegExp(
    `create\\s+(?:or\\s+replace\\s+)?function\\s+public\\.${rpc}\\s*\\(`,
    "i",
  );
  assert(definition.test(supabaseSql), `Supabase RPC is used by the app but missing from supabase-setup.sql: ${rpc}`);
}

const dollarTags = matches(supabaseSql, /\$[A-Za-z_][A-Za-z0-9_]*\$/g).map((match) => match[0]);
for (const tag of new Set(dollarTags)) {
  const count = dollarTags.filter((value) => value === tag).length;
  assert(count % 2 === 0, `Unpaired SQL dollar quote ${tag}`);
}

if (failures.length) {
  console.error(`SpoolMate verification failed (${failures.length} issue${failures.length === 1 ? "" : "s"}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`SpoolMate ${appVersion} verification passed.`);
  console.log(`- ${htmlIds.length} unique HTML IDs`);
  console.log(`- ${declaredFunctions.length} unique function declarations`);
  console.log(`- ${cachedAssets.length} cached PWA assets and ${(manifest.icons ?? []).length} manifest icons`);
  for (const note of notes) console.log(`- ${note}`);
  console.log(`- ${new Set(rpcCalls).size} Supabase RPC definitions matched`);
}
