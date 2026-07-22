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
  "supabase/functions/delete-account/index.ts",
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
const deleteAccountFunction = read("supabase/functions/delete-account/index.ts");

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
  /if\s*\(checks\.projectMissing\.length\s*\|\|\s*checks\.errors\.length\)\s*return\s+["']blocked["']/.test(app) &&
    /data-workflow-action="open-test-kit"/.test(app),
  "App self-test failures may still hard-block a spool issue",
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
