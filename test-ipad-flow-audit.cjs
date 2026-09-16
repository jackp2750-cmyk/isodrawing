const { chromium, webkit } = require(process.env.SPOOLMATE_PLAYWRIGHT_PATH || "playwright");
const fs = require("fs");

const APP_URL = process.env.SPOOLMATE_TEST_URL || "http://127.0.0.1:8765/";
const profiles = [
  { name: "ipad-portrait", width: 834, height: 1194 },
  { name: "ipad-landscape", width: 1194, height: 834 },
  { name: "ipad-small-landscape", width: 1024, height: 768 },
];
const browserName = process.env.SPOOLMATE_BROWSER === "webkit" ? "webkit" : "chromium";
const browserType = browserName === "webkit" ? webkit : chromium;

function check(condition, message) {
  if (!condition) throw new Error(message);
}

async function snapshot(page, label) {
  return page.evaluate((name) => {
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const bounds = (element) => {
      const rect = element.getBoundingClientRect();
      return { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) };
    };
    const panels = [
      "#homeDashboardDialog", "#authDialog", "#projectLibraryDialog", "#bigSpoolDialog",
      "#workshopStockDialog", "#tutorialDialog", "#videoTutorialDialog", "#helpDialog",
      "#drawingAssistantDialog", "#schematicTakeoffDialog", "#workflowStartDialog",
      "#projectDialog", "#newDrawingDialog", "#toolSettingsDialog", "#aiHelperDialog",
      "#workspaceSettingsPanel", "#actionMenuPanel", ".control-panel", ".preview-panel",
      "#drawingContextMenu", ".selection-action-bar",
    ].map((selector) => ({ selector, element: document.querySelector(selector) })).filter(({ element }) => element && !element.hidden && visible(element)).map(({ selector, element }) => ({ selector, bounds: bounds(element), z: getComputedStyle(element).zIndex }));
    const scroll = {
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      viewport,
    };
    const traps = [];
    for (const selector of ["#workspaceSettingsScrim", "#mobilePanelScrim", ".project-dialog-backdrop:not([hidden])", ".ai-helper-backdrop:not([hidden])"]) {
      for (const element of document.querySelectorAll(selector)) {
        if (!visible(element)) continue;
        const rect = element.getBoundingClientRect();
        const center = { x: Math.max(1, Math.min(viewport.width - 2, rect.left + rect.width / 2)), y: Math.max(1, Math.min(viewport.height - 2, rect.top + rect.height / 2)) };
        const hit = document.elementFromPoint(center.x, center.y);
        traps.push({ selector, bounds: bounds(element), hit: hit?.id || hit?.className || hit?.tagName || "", hidden: element.hidden });
      }
    }
    const primaryActions = ["#workspaceSettingsButton", "#actionMenuButton", "#previewShowButton", "#inspectorShowButton", "#drawingFullscreenButton", "#fitDrawingButton", "#previewOpenInspectorButton", "#inspectorOpenPreviewButton", ".control-panel [data-mobile-close-panel]", ".preview-panel [data-mobile-close-panel]", ".mobile-panel-dock [data-mobile-panel=\"drawing\"]", ".mobile-panel-dock [data-mobile-panel=\"inspector\"]", ".mobile-panel-dock [data-mobile-panel=\"preview\"]"].map((selector) => {
      const element = document.querySelector(selector);
      if (!element || !visible(element)) return null;
      const rect = element.getBoundingClientRect();
      const x = Math.min(viewport.width - 2, Math.max(1, rect.left + rect.width / 2));
      const y = Math.min(viewport.height - 2, Math.max(1, rect.top + rect.height / 2));
      const hit = document.elementFromPoint(x, y);
      return { selector, bounds: bounds(element), hit: hit?.id || hit?.className || hit?.tagName || "", hittable: element === hit || element.contains(hit) };
    }).filter(Boolean);
    const inspectorStyle = getComputedStyle(document.querySelector(".control-panel"));
    const previewStyle = getComputedStyle(document.querySelector(".preview-panel"));
    const canvasState = ["#threeCanvas", "#fallbackCanvas"].map((selector) => {
      const element = document.querySelector(selector);
      return { selector, hidden: element.hidden, width: element.width, height: element.height, bounds: bounds(element) };
    });
    const previewDiagnostics = name === "preview-open" && typeof three === "object" ? {
      ready: three.ready,
      geometryChildren: three.spoolGroup?.children.length ?? 0,
      cameraPosition: three.camera?.position.toArray() ?? [],
      renderInfo: three.renderer?.info?.render ? { ...three.renderer.info.render } : null,
      contextLost: three.renderer?.getContext()?.isContextLost() ?? null,
      canvasUrlLength: three.ready ? document.querySelector("#threeCanvas").toDataURL("image/png").length : 0,
    } : null;
    const settingsTargets = ["#workspaceSettingsCloseButton", "#pipeSpecSelect", "#pipeSizeSelect", "#dimensionToggle", "#dimensionStyleSelect"].map((selector) => {
      const element = document.querySelector(selector);
      if (!element || !visible(element)) return null;
      const rect = element.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return { selector, bounds: bounds(element), hit: hit?.id || hit?.className || hit?.tagName || "", hittable: hit === element || element.contains(hit) };
    }).filter(Boolean);
    return { name, bodyClass: document.body.className, appMode: document.body.dataset.appMode, mobilePanel: document.body.dataset.mobilePanel, panels, traps, primaryActions, scroll,
      settingsTargets, toastCount: document.querySelectorAll(".app-toast:not(.leaving)").length, canvasState, previewDiagnostics,
      inspector: { bounds: bounds(document.querySelector(".control-panel")), transform: inspectorStyle.transform, opacity: inspectorStyle.opacity, pointerEvents: inspectorStyle.pointerEvents, zIndex: inspectorStyle.zIndex },
      preview: { bounds: bounds(document.querySelector(".preview-panel")), transform: previewStyle.transform, opacity: previewStyle.opacity, pointerEvents: previewStyle.pointerEvents, zIndex: previewStyle.zIndex },
    };
  }, label);
}

async function inspectDialog(page, id, selector) {
  return page.evaluate(({ id: name, selector: target }) => {
    const backdrop = document.querySelector(target);
    const card = backdrop?.querySelector(".project-dialog-card, .ai-helper-panel");
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const rect = card?.getBoundingClientRect();
    const buttons = [...(card?.querySelectorAll("button") ?? [])].filter((button) => {
      const style = getComputedStyle(button);
      return !button.hidden && !button.disabled && style.display !== "none" && style.visibility !== "hidden";
    });
    const controls = buttons.map((button) => {
      const bounds = button.getBoundingClientRect();
      const onscreen = bounds.width > 0 && bounds.height > 0 && bounds.left >= -1 && bounds.right <= viewport.width + 1 && bounds.top >= -1 && bounds.bottom <= viewport.height + 1;
      const hit = onscreen ? document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2) : null;
      return { id: button.id || button.textContent.trim().slice(0, 40), onscreen, clickable: hit === button || button.contains(hit), x: Math.round(bounds.x), y: Math.round(bounds.y), width: Math.round(bounds.width), height: Math.round(bounds.height) };
    });
    return {
      name,
      open: Boolean(backdrop && !backdrop.hidden),
      viewport,
      card: rect && { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height), clientWidth: card.clientWidth, scrollWidth: card.scrollWidth, clientHeight: card.clientHeight, scrollHeight: card.scrollHeight, overflowX: getComputedStyle(card).overflowX, overflowY: getComputedStyle(card).overflowY },
      visibleButtonCount: buttons.length,
      controls: controls.filter((control) => control.onscreen).slice(0, 20),
      offscreenX: controls.filter((control) => control.x + control.width < 0 || control.x > viewport.width).map((control) => control.id),
      offscreenY: controls.filter((control) => control.y + control.height < 0 || control.y > viewport.height).map((control) => control.id).slice(0, 20),
    };
  }, { id, selector });
}

async function runProfile(browser, profile) {
  const context = await browser.newContext({
    viewport: { width: profile.width, height: profile.height },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
    serviceWorkers: "block",
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    userAgent: "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  });
  await context.addInitScript(() => localStorage.setItem("isospool-auth-guest-device-v1", "yes"));
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  const errors = [];
  const blocked = [];
  async function tap(selector, label) {
    try {
      await page.locator(selector).first().tap({ timeout: 7000 });
      return true;
    } catch (error) {
      blocked.push({ label, selector, message: error.message.split("Call log:")[0].trim(), state: await snapshot(page, `blocked-${label}`) });
      return false;
    }
  }
  async function waitForSheet() {
    await page.waitForFunction(() => {
      const panel = document.body.dataset.mobilePanel === "inspector"
        ? document.querySelector(".control-panel")
        : document.body.dataset.mobilePanel === "preview"
        ? document.querySelector(".preview-panel")
        : null;
      return !panel || (getComputedStyle(panel).transform === "none" && getComputedStyle(panel).opacity === "1");
    }, null, { timeout: 10000 });
  }
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.classList.contains("tablet-layout") && !document.querySelector("#homeDashboardDialog")?.hidden, null, { timeout: 15000 });
  const states = [await snapshot(page, "startup")];
  await page.locator("#homeDashboardQuickPdfButton").click();
  await page.waitForTimeout(150);
  states.push(await snapshot(page, "quick-pdf"));
  if (process.env.SPOOLMATE_AUDIT_SCREENSHOTS) await page.screenshot({ path: `${process.env.SPOOLMATE_AUDIT_SCREENSHOTS}-${profile.name}-home.png` });

  await page.evaluate(() => {
    const points = [{ x: 0, y: 0, z: 0 }];
    for (let index = 1; index <= 12; index += 1) {
      const previous = points[index - 1];
      const axis = (index - 1) % 3;
      points.push({ x: previous.x + (axis === 0 ? 600 : 0), y: previous.y + (axis === 1 ? 550 : 0), z: previous.z + (axis === 2 ? 450 : 0) });
    }
    state = { ...blankState({ userDefaults: false }), workflowKind: "managed", points, edges: points.slice(1).map((_, index) => ({ from: index, to: index + 1, pipeSizeNb: 150 })), pipeSizeNb: 150, pipeSpec: "carbon40", activePoint: 12 };
    updateControls();
    updateAll({ save: false });
  });

  for (const mode of ["draw", "edit", "review", "export"]) {
    if (await page.evaluate(() => document.body.dataset.mobilePanel === "inspector")) {
      await waitForSheet();
      await tap(".control-panel [data-mobile-close-panel]", `back-before-${mode}`);
    } else if (await page.evaluate(() => document.body.dataset.mobilePanel === "preview")) {
      await waitForSheet();
      await tap(".preview-panel [data-mobile-close-panel]", `back-before-${mode}`);
    }
    if (!await tap(`[data-app-mode="${mode}"]`, `mode-${mode}`)) {
      await page.evaluate((nextMode) => applyAppMode(nextMode), mode);
    }
    await waitForSheet();
    states.push(await snapshot(page, `mode-${mode}`));
    if (mode === "draw" || mode === "export") {
      if (await page.evaluate(() => document.body.dataset.mobilePanel === "inspector")) {
        await tap(".control-panel [data-mobile-close-panel]", `back-to-settings-${mode}`);
      }
      if (!await tap("#workspaceSettingsButton", `settings-${mode}`)) continue;
      states.push(await snapshot(page, `settings-${mode}`));
      if (mode === "draw" && process.env.SPOOLMATE_AUDIT_SCREENSHOTS) await page.screenshot({ path: `${process.env.SPOOLMATE_AUDIT_SCREENSHOTS}-${profile.name}-settings.png` });
      await tap("#workspaceSettingsCloseButton", `settings-close-${mode}`);
      states.push(await snapshot(page, `settings-closed-${mode}`));
    }
  }

  const pdf = { tapped: false, downloaded: false, filename: "", error: "" };
  try {
    await page.evaluate(() => { state.workflowKind = "quick"; updateControls(); });
    if (await page.evaluate(() => document.body.dataset.mobilePanel !== "inspector")) {
      await tap("#inspectorShowButton", "pdf-open-details");
      await waitForSheet();
    }
    const downloadPromise = page.waitForEvent("download", { timeout: 20000 });
    pdf.tapped = await tap("#exportPanelPdfButton", "pdf-export");
    const download = await downloadPromise;
    pdf.filename = download.suggestedFilename();
    pdf.error = (await download.failure()) || "";
    pdf.downloaded = !pdf.error && pdf.filename.toLowerCase().endsWith(".pdf");
  } catch (error) {
    pdf.error = error.message.split("Call log:")[0].trim();
  }

  if (await page.evaluate(() => document.body.dataset.mobilePanel === "inspector")) {
    await waitForSheet();
    await tap(".control-panel [data-mobile-close-panel]", "back-after-export");
  }
  if (!await tap('[data-app-mode="draw"]', "back-to-draw")) await page.evaluate(() => applyAppMode("draw"));
  if (!await tap('[data-tool="select"]', "select-tool")) await page.evaluate(() => setTool("select"));
  await page.evaluate(() => { selectSingleSegment(3); updateSelectionControls(); drawIso(); });
  states.push(await snapshot(page, "selected-run"));
  const selectionActions = [];
  for (const action of ["length", "size", "ends", "fittings"]) {
    const tapped = await tap(`[data-selection-action="${action}"]`, `selection-${action}`);
    const result = await page.evaluate(() => ({
      fieldInputOpen: !document.querySelector("#fieldInputDialog").hidden,
      contextMenuOpen: !document.querySelector(".drawing-context-menu").hidden,
      contextMenuBounds: (() => { const rect = document.querySelector(".drawing-context-menu").getBoundingClientRect(); return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }; })(),
      width: innerWidth, height: innerHeight,
    }));
    selectionActions.push({ action, tapped, ...result });
    if (result.fieldInputOpen) await tap("#fieldInputCancelButton", "length-cancel");
    await page.evaluate(() => closeDrawingContextMenu());
  }
  if (!await tap("#inspectorShowButton", "details-open")) await page.evaluate(() => showMobilePanel("inspector"));
  await waitForSheet();
  states.push(await snapshot(page, "details-open"));
  if (process.env.SPOOLMATE_AUDIT_SCREENSHOTS) await page.screenshot({ path: `${process.env.SPOOLMATE_AUDIT_SCREENSHOTS}-${profile.name}-details.png` });
  if (!await tap("#inspectorOpenPreviewButton", "preview-from-details")) await page.evaluate(() => showMobilePanel("preview"));
  await waitForSheet();
  await page.waitForTimeout(850);
  states.push(await snapshot(page, "preview-open"));
  if (process.env.SPOOLMATE_AUDIT_SCREENSHOTS) await page.screenshot({ path: `${process.env.SPOOLMATE_AUDIT_SCREENSHOTS}-${profile.name}-preview.png` });
  if (process.env.SPOOLMATE_AUDIT_SCREENSHOTS) {
    const dataUrl = await page.evaluate(() => document.querySelector("#threeCanvas").toDataURL("image/png"));
    fs.writeFileSync(`${process.env.SPOOLMATE_AUDIT_SCREENSHOTS}-${profile.name}-canvas.png`, Buffer.from(dataUrl.split(",")[1], "base64"));
  }
  if (!await tap("#previewOpenInspectorButton", "details-from-preview")) await page.evaluate(() => showMobilePanel("inspector"));
  await waitForSheet();
  states.push(await snapshot(page, "details-again"));
  await tap(".control-panel [data-mobile-close-panel]", "back-after-preview");
  states.push(await snapshot(page, "back-to-drawing"));

  await tap("#actionMenuButton", "menu-open");
  states.push(await snapshot(page, "menu-open"));
  await tap("#actionMenuCloseButton", "menu-close");
  states.push(await snapshot(page, "menu-closed"));

  await tap("#workspaceSettingsButton", "settings-before-rotation");
  await page.setViewportSize({ width: profile.height, height: profile.width });
  await page.waitForTimeout(180);
  states.push(await snapshot(page, "settings-rotated"));
  await tap("#workspaceSettingsCloseButton", "settings-close-rotated");
  await tap("#inspectorShowButton", "details-before-rotation");
  await waitForSheet();
  await page.setViewportSize({ width: profile.width, height: profile.height });
  await page.waitForTimeout(180);
  await waitForSheet();
  states.push(await snapshot(page, "details-rotated-back"));
  await tap(".control-panel [data-mobile-close-panel]", "details-close-rotated");

  const dialogScenarios = [
    { id: "jobs", selector: "#projectLibraryDialog", close: "#projectLibraryCloseButton" },
    { id: "big-spool", selector: "#bigSpoolDialog", close: "#bigSpoolCloseButton" },
    { id: "tutorial", selector: "#tutorialDialog", close: "#tutorialCloseButton" },
    { id: "videos", selector: "#videoTutorialDialog", close: "#videoTutorialCloseButton" },
    { id: "help", selector: "#helpDialog", close: "#helpCloseButton" },
    { id: "tool-settings", selector: "#toolSettingsDialog", close: "#toolSettingsDoneButton" },
    { id: "drawing-assistant", selector: "#drawingAssistantDialog", close: "#drawingAssistantCloseButton" },
    { id: "account", selector: "#authDialog", close: "#authCloseButton" },
    { id: "workflow-start", selector: "#workflowStartDialog", close: "#workflowStartCancelButton" },
    { id: "load-plan", selector: "#loadPlanDialog", close: "#loadPlanCloseButton" },
  ];
  const dialogs = [];
  for (const scenario of dialogScenarios) {
    try {
      await page.evaluate(async (id) => {
        closePrimaryWorkspaceDialogs();
        showMobilePanel("drawing");
        if (id === "jobs") await openBrowserProject({ source: "browser" });
        if (id === "big-spool") openBigSpoolDialog();
        if (id === "tutorial") openTutorialDialog();
        if (id === "videos") openVideoTutorialDialog();
        if (id === "help") openHelpDialog();
        if (id === "tool-settings") openToolSettingsDialog();
        if (id === "drawing-assistant") openDrawingAssistantDialog();
        if (id === "account") openAuthDialog();
        if (id === "workflow-start") openWorkflowStartDialog();
        if (id === "load-plan") openLoadPlanDialog();
      }, scenario.id);
      await page.waitForTimeout(100);
      const inspected = await inspectDialog(page, scenario.id, scenario.selector);
      inspected.closeTapped = await tap(scenario.close, `${scenario.id}-close`);
      inspected.closed = await page.locator(scenario.selector).evaluate((element) => element.hidden);
      dialogs.push(inspected);
    } catch (error) {
      dialogs.push({ name: scenario.id, error: error.message });
    } finally {
      await page.evaluate(() => {
        closePrimaryWorkspaceDialogs();
        closeDrawingAssistantDialog();
        closeLoadPlanDialog();
        showMobilePanel("drawing");
      }).catch(() => {});
    }
  }

  const result = { profile: profile.name, browser: browserName, states, selectionActions, pdf, blocked, dialogs, errors };
  await context.close();
  return result;
}

(async () => {
  const browser = await browserType.launch(browserName === "webkit" ? { headless: true } : { headless: true, channel: "msedge" });
  try {
    const results = [];
    for (const profile of profiles) {
      if (process.env.SPOOLMATE_TEST_PROFILE && process.env.SPOOLMATE_TEST_PROFILE !== profile.name) continue;
      const result = await runProfile(browser, profile);
      check(result.errors.length === 0, `${profile.name}: page errors: ${result.errors.join("; ")}`);
      check(result.blocked.length === 0, `${profile.name}: blocked taps: ${result.blocked.map(({ label }) => label).join(", ")}`);
      check(result.selectionActions.every(({ tapped }) => tapped), `${profile.name}: selection toolbar has an untappable action`);
      check(result.pdf.downloaded, `${profile.name}: Quick PDF download failed: ${result.pdf.error}`);
      check(result.dialogs.every(({ open, closeTapped, closed }) => open && closeTapped && closed), `${profile.name}: a dialog failed to open or close by touch`);
      check(result.states.every(({ scroll }) => scroll.documentWidth <= scroll.viewport.width), `${profile.name}: document has horizontal overflow`);
      results.push(result);
    }
    if (process.env.SPOOLMATE_AUDIT_VERBOSE) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      for (const result of results) {
        console.log(`${result.profile}: ${result.browser} passed (${result.states.length} flow states, ${result.dialogs.length} dialogs, ${result.selectionActions.length} selection actions)`);
      }
    }
    check(results.length > 0, "No iPad profile selected");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
