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
  "supabase/functions/delete-account/index.ts",
  "supabase/functions/ai-help/index.ts",
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
const deleteAccountFunction = read("supabase/functions/delete-account/index.ts");
const aiHelpFunction = read("supabase/functions/ai-help/index.ts");

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
const htmlThemeColor = html.match(/<meta\s+name="theme-color"\s+content="([^"]+)"/)?.[1];
assert(Boolean(htmlThemeColor), "HTML theme colour is missing");
assert(manifest.theme_color === htmlThemeColor, "Manifest and HTML theme colours differ");
assert(manifest.background_color === htmlThemeColor, "Manifest splash background does not match the default theme");

assert(!/\b(?:service[_-]?role|sb_secret)[A-Za-z0-9_.-]*/i.test(app), "A privileged Supabase key appears in app.js");
assert(!/\bsk-[A-Za-z0-9_-]{12,}/.test(app + html + supabaseSql), "An OpenAI API key appears in public app files");
assert(
  /id="aiHelperButton"/.test(html) &&
    /id="aiHelperDialog"/.test(html) &&
    /id="aiHelperForm"/.test(html) &&
    /\.ai-helper-panel/.test(css) &&
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
    /data-open-video-tutorial="jobs"/.test(html) &&
    /data-open-video-tutorial="drawing"/.test(html) &&
    /function\s+renderVideoTutorialLibrary\s*\(/.test(app) &&
    /function\s+selectVideoTutorial\s*\(/.test(app) &&
    /function\s+setupVideoTutorialDialog\s*\(/.test(app) &&
    /function\s+seekVideoTutorial\s*\(/.test(app) &&
    /function\s+toggleVideoTutorialPlayback\s*\(/.test(app) &&
    /function\s+jumpToVideoTutorialChapter\s*\(/.test(app) &&
    /\.video-tutorial-card/.test(css) &&
    /\.video-tutorial-library-item/.test(css) &&
    /\.tutorial-video-shelf/.test(css) &&
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
    /issuedPdfReady\s*\?\s*["']Issued PDF["']\s*:\s*["']Draft PDF["']/.test(app) &&
    /spoolmate-v309/.test(serviceWorker),
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
  /id="homeDashboardRestoreButton"/.test(html) &&
    /const\s+LAST_SESSION_RECOVERY_KEY\s*=/.test(app) &&
    /function\s+loadLastSessionRecovery\s*\(/.test(app) &&
    /async function\s+restoreLastSession\s*\(/.test(app) &&
    /restored\.projectId\s*=\s*null/.test(app) &&
    /createProjectBackup\(["']before last-session restore["']\)/.test(app) &&
    /\.home-dashboard-action\.recovery/.test(css) &&
    /spoolmate-v309/.test(serviceWorker),
  "Last-session recovery protection or dashboard action is incomplete",
);
assert(
  /Deno\.env\.get\(["']OPENAI_API_KEY["']\)/.test(aiHelpFunction) &&
    /https:\/\/api\.openai\.com\/v1\/responses/.test(aiHelpFunction) &&
    /model:\s*MODEL/.test(aiHelpFunction) &&
    /const\s+MODEL\s*=\s*["']gpt-5\.6-luna["']/.test(aiHelpFunction) &&
    /store:\s*false/.test(aiHelpFunction) &&
    /safety_identifier/.test(aiHelpFunction) &&
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
    /Needs attention/.test(app) &&
    /My work/.test(app) &&
    /Ready next/.test(app) &&
    /data-project-library-action="scan-qr"/.test(app) &&
    /team-today-board/.test(css),
  "Simplified Today team dashboard or Scan QR entry point is incomplete",
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
    /checks\.warnings\.length\s*\|\|\s*checks\.regressionFailures\.length/.test(app) &&
    /data-workflow-action="open-test-kit"/.test(app),
  "Ready to Issue severity or app-diagnostic handling is incomplete",
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
  /function\s+setPreviewHidden\s*\([\s\S]*?!isTabletLayout\(\)\)\s*setInspectorDrawerOpen\(false\)/.test(app) &&
    /function\s+setInspectorDrawerOpen\s*\([\s\S]*?previewPanelHidden\s*=\s*true/.test(app) &&
    /previewShowButton\?\.addEventListener\([\s\S]*?showMobilePanel\("preview"\)/.test(app),
  "Details and 3D no longer enforce one contextual surface",
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
  const sizes = constValue(app, "PIPE_SIZES");
  const teeTakeoffs = constValue(app, "TEE_TAKEOFF_MM");
  const reducerLengths = constValue(app, "REDUCER_LENGTH_MM");
  const stainlessReducers = constValue(app, "ATLAS_STAINLESS10_REDUCER_WEIGHTS");
  const flangeTables = constValue(app, "FLANGE_DRILLING_TABLES");
  const pipeSizes = sizes.filter((size) => size.kind !== "tube");
  const tubeSizes = sizes.filter((size) => size.kind === "tube");

  assert(new Set(sizes.map((size) => size.nb)).size === sizes.length, "Pipe/tube size keys are not unique");
  for (const size of pipeSizes) {
    assert(size.od > size.wall40 * 2 && size.od > size.wall10 * 2, `Invalid wall thickness for NB ${size.nb}`);
    assert(size.kgPerM40 > 0 && size.kgPerM10 > 0, `Missing pipe weight for NB ${size.nb}`);
    assert(teeTakeoffs[size.nb] > 0, `Missing tee takeoff for NB ${size.nb}`);
    assert(reducerLengths[size.nb] > 0, `Missing reducer length for NB ${size.nb}`);
    const carbonCalculated = specs.carbon40.weightCoefficient * (size.od - size.wall40) * size.wall40;
    const stainlessCalculated = specs.stainless10.weightCoefficient * (size.od - size.wall10) * size.wall10;
    assert(Math.abs(carbonCalculated - size.kgPerM40) <= 0.08, `Carbon kg/m is inconsistent for NB ${size.nb}`);
    assert(Math.abs(stainlessCalculated - size.kgPerM10) <= 0.08, `Stainless kg/m is inconsistent for NB ${size.nb}`);
  }

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
