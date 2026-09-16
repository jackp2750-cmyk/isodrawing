const { chromium, webkit } = require(process.env.SPOOLMATE_PLAYWRIGHT_PATH || "playwright");

const APP_URL = process.env.SPOOLMATE_TEST_URL || "http://127.0.0.1:8765/";

function check(condition, message) {
  if (!condition) throw new Error(message);
}

async function testViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport,
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 2,
    serviceWorkers: "block",
    ignoreHTTPSErrors: true,
    userAgent: "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  });
  await context.addInitScript(() => {
    localStorage.setItem("isospool-auth-guest-device-v1", "yes");
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.stack || error.message));

  await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => typeof updateAll === "function" && document.body.classList.contains("tablet-layout"));
  await page.waitForFunction(() => document.querySelector("#homeDashboardDialog")?.hidden === false, null, { timeout: 15000 });
  await page.evaluate(() => {
    document.querySelectorAll(".project-dialog-backdrop").forEach((dialog) => { dialog.hidden = true; });
    document.body.classList.remove("home-dashboard-open", "auth-gate-open");
    const points = [{ x: 0, y: 0, z: 0 }];
    for (let index = 1; index <= 60; index += 1) {
      const previous = points[index - 1];
      const axis = (index - 1) % 3;
      points.push({
        x: previous.x + (axis === 0 ? 600 + index * 7 : 0),
        y: previous.y + (axis === 1 ? (index % 2 ? 1 : -1) * (500 + index * 5) : 0),
        z: previous.z + (axis === 2 ? (index % 2 ? 1 : -1) * (400 + index * 3) : 0),
      });
    }
    state = {
      ...blankState({ userDefaults: false }),
      points,
      edges: points.slice(1).map((_, index) => ({ from: index, to: index + 1, pipeSizeNb: 150 })),
      activePoint: points.length - 1,
      pipeSizeNb: 150,
      pipeSpec: "carbon40",
      showDimensions: false,
      dimensionStyle: "none",
    };
    setInterfaceDensity("simple", { persist: false });
    updateAll({ save: false });
  });

  await page.locator("#workspaceSettingsButton").click();
  const openLayout = await page.evaluate(() => {
    const panel = workspaceSettingsPanel;
    const rect = panel.getBoundingClientRect();
    const controlRect = dimensionStyleSelect.getBoundingClientRect();
    const viewRow = dimensionStyleSelect.closest(".topbar-settings-row");
    const viewRowRect = viewRow.getBoundingClientRect();
    const controlHitTarget = document.elementFromPoint(
      controlRect.left + controlRect.width * 0.5,
      controlRect.top + controlRect.height * 0.5,
    );
    return {
      bodyClasses: document.body.className,
      panelDisplay: getComputedStyle(panel).display,
      panelGridColumns: getComputedStyle(panel).gridTemplateColumns,
      panelOverflowX: getComputedStyle(panel).overflowX,
      panelOverflowY: getComputedStyle(panel).overflowY,
      panelRect: { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left, width: rect.width, height: rect.height },
      controlRect: { top: controlRect.top, right: controlRect.right, bottom: controlRect.bottom, left: controlRect.left, width: controlRect.width, height: controlRect.height },
      viewRowDisplay: getComputedStyle(viewRow).display,
      viewRowGridColumns: getComputedStyle(viewRow).gridTemplateColumns,
      viewRowRect: { top: viewRowRect.top, right: viewRowRect.right, bottom: viewRowRect.bottom, left: viewRowRect.left, width: viewRowRect.width, height: viewRowRect.height },
      scrimHidden: workspaceSettingsScrim.hidden,
      controlHitId: controlHitTarget?.id || "",
      controlHitTag: controlHitTarget?.tagName || "",
      controlHitClass: controlHitTarget?.className || "",
      topbarZIndex: getComputedStyle(document.querySelector(".topbar")).zIndex,
      scrimZIndex: getComputedStyle(workspaceSettingsScrim).zIndex,
    };
  });

  const start = Date.now();
  await page.locator("#dimensionStyleSelect").selectOption("redline", { timeout: 10000 });
  await page.waitForTimeout(100);
  const elapsedMs = Date.now() - start;
  const changedLayout = await page.evaluate(() => {
    const panel = workspaceSettingsPanel;
    const rect = panel.getBoundingClientRect();
    return {
      settingsOpen: workspaceSettingsOpen(),
      panelDisplay: getComputedStyle(panel).display,
      panelRect: { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left, width: rect.width, height: rect.height },
      scrimHidden: workspaceSettingsScrim.hidden,
      style: state.dimensionStyle,
      dimensions: state.showDimensions,
    };
  });

  check(openLayout.panelDisplay !== "none", `${viewport.width}x${viewport.height}: settings sheet is hidden behind its scrim`);
  check(openLayout.panelRect.width > 100 && openLayout.panelRect.height > 100, `${viewport.width}x${viewport.height}: settings sheet has no usable size`);
  check(openLayout.panelRect.left >= -1 && openLayout.panelRect.right <= viewport.width + 1, `${viewport.width}x${viewport.height}: settings sheet is offscreen horizontally`);
  check(openLayout.panelRect.top >= -1 && openLayout.panelRect.bottom <= viewport.height + 1, `${viewport.width}x${viewport.height}: settings sheet is offscreen vertically`);
  check(openLayout.controlHitId === "dimensionStyleSelect", `${viewport.width}x${viewport.height}: blue scrim intercepts dimension controls (${JSON.stringify(openLayout)})`);
  check(changedLayout.style === "redline" && changedLayout.dimensions === true, `${viewport.width}x${viewport.height}: line dimensions did not apply`);
  check(changedLayout.settingsOpen === false, `${viewport.width}x${viewport.height}: settings sheet stayed open after choosing line dimensions`);
  check(changedLayout.scrimHidden === true, `${viewport.width}x${viewport.height}: blue settings scrim remained after choosing line dimensions`);
  check(changedLayout.panelDisplay === "none", `${viewport.width}x${viewport.height}: settings sheet remained over the drawing`);
  check(elapsedMs < 5000, `${viewport.width}x${viewport.height}: line dimension redraw took ${elapsedMs}ms`);

  await page.locator("#workspaceSettingsButton").click();
  await page.locator("#dimensionToggle").uncheck();
  await page.waitForTimeout(100);
  const toggledLayout = await page.evaluate(() => ({
    settingsOpen: workspaceSettingsOpen(),
    panelDisplay: getComputedStyle(workspaceSettingsPanel).display,
    scrimHidden: workspaceSettingsScrim.hidden,
    dimensions: state.showDimensions,
  }));
  check(toggledLayout.dimensions === false, `${viewport.width}x${viewport.height}: dimension toggle did not apply`);
  check(toggledLayout.settingsOpen === false, `${viewport.width}x${viewport.height}: settings sheet stayed open after toggling dimensions`);
  check(toggledLayout.scrimHidden === true, `${viewport.width}x${viewport.height}: blue settings scrim remained after toggling dimensions`);
  check(toggledLayout.panelDisplay === "none", `${viewport.width}x${viewport.height}: settings sheet remained after toggling dimensions`);
  check(pageErrors.length === 0, `${viewport.width}x${viewport.height}: page errors: ${pageErrors.join("\n")}`);

  await context.close();
  return { viewport, elapsedMs, openLayout, changedLayout, toggledLayout };
}

(async () => {
  const engine = process.env.SPOOLMATE_BROWSER === "webkit" ? "webkit" : "chromium";
  const browserType = engine === "webkit" ? webkit : chromium;
  const browser = await browserType.launch(engine === "webkit" ? { headless: true } : { channel: "msedge", headless: true });
  try {
    const results = [];
    results.push(await testViewport(browser, { width: 834, height: 1194 }));
    results.push(await testViewport(browser, { width: 1194, height: 834 }));
    console.log(JSON.stringify(results, null, 2));
    console.log(`iPad line-dimension regression checks passed in ${engine}.`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
