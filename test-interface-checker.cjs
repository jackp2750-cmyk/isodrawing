const { chromium, webkit } = require(process.env.SPOOLMATE_PLAYWRIGHT_PATH || "playwright");

const APP_URL = process.env.SPOOLMATE_TEST_URL || "http://127.0.0.1:8765/";
const engine = process.env.SPOOLMATE_BROWSER === "webkit" ? "webkit" : "chromium";

function check(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browserType = engine === "webkit" ? webkit : chromium;
  const browser = await browserType.launch(engine === "webkit" ? { headless: true } : { headless: true, channel: "msedge" });
  try {
    const context = await browser.newContext({
      viewport: { width: 834, height: 1194 },
      hasTouch: true,
      isMobile: true,
      deviceScaleFactor: 2,
      ignoreHTTPSErrors: true,
      serviceWorkers: "block",
      userAgent: "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
    });
    await context.addInitScript(() => localStorage.setItem("isospool-auth-guest-device-v1", "yes"));
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => typeof openInterfaceChecker === "function" && document.body.classList.contains("tablet-layout"));
    await page.evaluate(() => {
      document.querySelectorAll(".project-dialog-backdrop").forEach((dialog) => { dialog.hidden = true; });
      document.body.classList.remove("home-dashboard-open", "auth-gate-open");
      const first = blankState({ userDefaults: false });
      first.points = [{ x: 0, y: 0, z: 0 }, { x: 1000, y: 0, z: 0 }];
      first.edges = [{ from: 0, to: 1, pipeSizeNb: 150 }];
      first.fittings = [{ id: 1, type: "rollGroove", segmentIndex: 0, t: 1 }];
      first.projectInfo = { ...first.projectInfo, jobNumber: "TEST", spoolNumber: "A", revision: "B" };
      first.projectId = "project-current";
      const previous = JSON.parse(JSON.stringify(first));
      previous.projectInfo.revision = "A";
      previous.points[1].x = 900;
      first.revisionHistory = [{ id: "rev-a", revision: "A", createdAt: new Date().toISOString(), status: "issued", state: previous }];
      state = stateFromPayload(first);
      state.projectId = "project-current";

      const second = blankState({ userDefaults: false });
      second.points = [{ x: 1000, y: 0, z: 0 }, { x: 2000, y: 0, z: 0 }];
      second.edges = [{ from: 0, to: 1, pipeSizeNb: 150 }];
      second.fittings = [{ id: 2, type: "rollGroove", segmentIndex: 0, t: 0 }];
      second.projectInfo = { ...second.projectInfo, jobNumber: "TEST", spoolNumber: "B", revision: "A" };
      localStorage.setItem("isospool-saved-projects-v1", JSON.stringify([{ id: "project-b", name: "TEST / B", updatedAt: new Date().toISOString(), projectInfo: second.projectInfo, state: second }]));
      updateAll({ save: false });
      openInterfaceChecker();
    });

    const dialog = page.locator("#interfaceCheckerDialog");
    await dialog.waitFor({ state: "visible" });
    const resultText = await dialog.locator("[data-interface-result]").innerText();
    check(resultText.includes("Interface ready"), `Matching grooves were not accepted: ${resultText}`);
    check(!resultText.includes("blocker"), `Matching grooves reported a blocker: ${resultText}`);
    const geometry = await dialog.evaluate((element) => {
      const card = element.querySelector(".interface-checker-card").getBoundingClientRect();
      const close = element.querySelector("[data-interface-close]");
      const closeRect = close.getBoundingClientRect();
      const hit = document.elementFromPoint(closeRect.left + closeRect.width / 2, closeRect.top + closeRect.height / 2);
      return { left: card.left, right: card.right, top: card.top, bottom: card.bottom, width: innerWidth, height: innerHeight, closeHittable: hit === close || close.contains(hit) };
    });
    check(geometry.left >= 0 && geometry.right <= geometry.width && geometry.top >= 0 && geometry.bottom <= geometry.height, `Interface checker is offscreen: ${JSON.stringify(geometry)}`);
    check(geometry.closeHittable, "Interface checker Close button is blocked");
    check(await dialog.locator('[data-interface-open="b"]').isEnabled(), "Saved Spool B cannot be opened directly from the checker");
    await dialog.locator("[data-interface-note]").fill("Datum and match mark checked in test");
    await dialog.locator("[data-interface-save]").tap();
    const savedVerification = await page.evaluate(() => ({
      checks: state.interfaceChecks,
      activity: state.productionActivity.filter((entry) => entry.type === "interface"),
    }));
    check(savedVerification.checks.length === 1, `Interface verification was not retained: ${JSON.stringify(savedVerification)}`);
    check(savedVerification.checks[0].note.includes("Datum and match mark"), "Interface verification note was not retained");
    check(savedVerification.activity.length === 1, "Interface verification was not added to production activity");
    const roundTrip = await page.evaluate(() => stateFromPayload(JSON.parse(JSON.stringify(statePayload())))?.interfaceChecks);
    check(roundTrip?.length === 1 && roundTrip[0].first.endpoint.pipeSizeNb === 150, `Interface verification did not survive project save/load: ${JSON.stringify(roundTrip)}`);
    await dialog.locator("[data-interface-issue-note]").tap();
    check(await page.evaluate(() => state.productionActivity.filter((entry) => entry.type === "interface").length) === 2, "Direct interface issue note was not retained");
    if (process.env.SPOOLMATE_INTERFACE_SCREENSHOT) await page.screenshot({ path: process.env.SPOOLMATE_INTERFACE_SCREENSHOT });

    const mismatch = await page.evaluate(() => {
      const first = { point: { x: 0, y: 0, z: 0 }, direction: { x: 1, y: 0, z: 0 }, pipeSizeNb: 150, preparation: { type: "flange", key: "flange:pn16", standard: "pn16", label: "Flange · PN 16" } };
      const second = { point: { x: 20, y: 0, z: 0 }, direction: { x: -1, y: 0, z: 0 }, pipeSizeNb: 100, preparation: { type: "rollGroove", key: "rollGroove", label: "Roll-grooved end" } };
      return interfaceComparison(first, second, 5);
    });
    check(mismatch.blockers === 3, `Expected size, end-prep and coordinate blockers: ${JSON.stringify(mismatch)}`);

    await dialog.locator("[data-interface-close]").tap();
    check(await dialog.count() === 0, "Interface checker did not close by touch");
    await page.evaluate(() => openLatestRevisionComparison());
    const revision = page.locator("#revisionImpactDialog");
    await revision.waitFor({ state: "visible" });
    const revisionText = await revision.innerText();
    check(revisionText.toLowerCase().includes("changed runs") && revisionText.includes("Workshop review required") && revisionText.includes("Run 1"), `Revision impact did not identify the exact changed run: ${revisionText}`);
    check(await revision.locator("[data-revision-impact-copy]").isVisible(), "Revision impact copy action is missing");
    check(await revision.locator("[data-revision-impact-print]").isVisible(), "Revision impact print action is missing");
    await revision.locator("[data-revision-impact-close]").tap();
    check(errors.length === 0, `Page errors: ${errors.join("; ")}`);
    console.log(`Interface checker and revision impact passed in ${engine} at iPad portrait size.`);
    await context.close();
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
