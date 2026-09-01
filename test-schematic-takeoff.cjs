const path = require("path");
const os = require("os");
const { chromium } = require(process.env.SPOOLMATE_PLAYWRIGHT_PATH || "playwright");

const APP_URL = process.env.SPOOLMATE_TEST_URL || "http://127.0.0.1:8765/";
const FIXTURE = path.join(__dirname, "icons", "icon-512.png");
const devices = [
  ["desktop", 1440, 900],
  ["ipad", 1024, 768],
  ["android-tablet", 800, 1280],
  ["phone", 390, 844],
  ["phone-landscape", 844, 390],
].filter(([name]) => !process.env.TAKEOFF_TEST_DEVICE || name === process.env.TAKEOFF_TEST_DEVICE);

function check(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const [name, width, height] of devices) {
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: name === "desktop" ? 1 : 2,
        hasTouch: name !== "desktop",
        serviceWorkers: "block",
      });
      const page = await context.newPage();
      page.setDefaultTimeout(7000);
      const pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(400);
      await page.evaluate(() => {
        document.querySelectorAll(".project-dialog-backdrop").forEach((dialog) => { dialog.hidden = true; });
        cloudUser = { id: "takeoff-layout-test", email: "private-beta@example.test" };
        schematicTakeoffAccess = true;
        schematicTakeoffState = defaultSchematicTakeoffState();
        schematicTakeoffDialog.hidden = false;
        document.body.classList.add("schematic-takeoff-open");
        setSchematicTakeoffTool("rectangle");
        renderSchematicTakeoffPanels();
        renderSchematicTakeoffCanvas();
      });
      await page.setInputFiles("#schematicTakeoffFileInput", FIXTURE);
      await page.waitForFunction(() => Boolean(schematicTakeoffState?.sourceWidth && schematicTakeoffState?.sourceHeight));

      let canvas = await page.locator("#schematicTakeoffCanvas").boundingBox();
      const chrome = await page.evaluate(() => Object.fromEntries([".schematic-takeoff-card", ".schematic-takeoff-header", ".schematic-takeoff-identity", ".schematic-takeoff-toolbar", ".schematic-takeoff-workspace"].map((selector) => {
        const element = document.querySelector(selector);
        const rect = element.getBoundingClientRect();
        return [selector, { top: rect.top, height: rect.height, display: getComputedStyle(element).display }];
      })));
      check(canvas && canvas.width > 220 && canvas.height > 180, `${name}: schematic canvas is too small or hidden (${JSON.stringify({ canvas, chrome })})`);
      await page.mouse.move(canvas.x + canvas.width * 0.2, canvas.y + canvas.height * 0.22);
      await page.mouse.down();
      await page.mouse.move(canvas.x + canvas.width * 0.62, canvas.y + canvas.height * 0.64, { steps: 8 });
      await page.mouse.up();
      await page.waitForFunction(() => schematicTakeoffState?.selections?.length === 1);

      await page.locator('[data-schematic-tool="lasso"]').click();
      canvas = await page.locator("#schematicTakeoffCanvas").boundingBox();
      const lassoHit = await page.evaluate(({ x, y }) => {
        const target = document.elementFromPoint(x, y);
        return { tag: target?.tagName, id: target?.id, className: target?.className };
      }, { x: canvas.x + canvas.width * 0.35, y: canvas.y + canvas.height * 0.3 });
      await page.mouse.move(canvas.x + canvas.width * 0.35, canvas.y + canvas.height * 0.3);
      await page.mouse.down();
      for (const [x, y] of [[0.53, 0.32], [0.6, 0.5], [0.46, 0.62], [0.31, 0.48], [0.35, 0.3]]) {
        await page.mouse.move(canvas.x + canvas.width * x, canvas.y + canvas.height * y, { steps: 3 });
      }
      const lassoDraft = await page.evaluate(() => schematicTakeoffState?.activeSelection);
      await page.mouse.up();
      const lassoState = await page.evaluate(() => ({
        tool: schematicTakeoffState?.tool,
        selections: schematicTakeoffState?.selections?.length,
        active: schematicTakeoffState?.activeSelection,
        gesture: schematicTakeoffState?.gesture,
      }));
      check(lassoState.selections === 2, `${name}: lasso selection did not complete (${JSON.stringify({ lassoHit, lassoDraft, lassoState })})`);
      const cropState = await page.evaluate(() => {
        const crop = schematicTakeoffCropCanvasForSelection(schematicTakeoffSelectedArea(), 900);
        return {
          width: crop?.width || 0,
          height: crop?.height || 0,
          pngLength: crop?.toDataURL("image/png").length || 0,
          downloadDisabled: document.querySelector("#schematicTakeoffDownloadCropButton").disabled,
        };
      });
      check(cropState.width > 10 && cropState.height > 10 && cropState.pngLength > 100 && !cropState.downloadDisabled, `${name}: exact selected-area crop was not prepared (${JSON.stringify(cropState)})`);

      const detectedSystem = await page.evaluate(() => {
        const selection = schematicTakeoffSelectedArea();
        const bounds = schematicTakeoffAreaBounds(selection);
        schematicTakeoffState.pageTextByPage.set(selection.page, [{
          text: "CHWP-B4-1",
          x: bounds.x + bounds.width / 2,
          y: bounds.y + bounds.height / 2,
        }]);
        return schematicTakeoffDetectSystemContext(selection);
      });
      check(detectedSystem.systemCode === "CHWP" && detectedSystem.equipmentTags.includes("CHWP-B4-1"), `${name}: system was not derived from the selected equipment tag (${JSON.stringify(detectedSystem)})`);

      await page.locator("#schematicTakeoffSystemInput").fill("chwp");
      await page.locator("#schematicTakeoffSystemInput").press("Tab");
      await page.locator("#schematicTakeoffFittingTypeInput").selectOption("Valve");
      check(await page.locator("#schematicTakeoffValveQuestions").isVisible(), `${name}: valve classification questions did not open`);
      await page.locator("#schematicTakeoffValveConnectionInput").selectOption("Flanged");
      await page.locator("#schematicTakeoffValveBrandInput").selectOption("Ebro");
      await page.locator("#schematicTakeoffValveFlangeInput").fill("Wafer PN16");
      await page.locator("#schematicTakeoffFittingSizeInput").fill("NB 100");
      await page.locator("#schematicTakeoffFittingQuantityInput").fill("3");
      await page.locator("#schematicTakeoffAddFittingButton").click();
      const systemTable = await page.evaluate(() => ({
        systemCode: schematicTakeoffSelectedArea()?.systemCode,
        item: schematicTakeoffSelectedArea()?.items?.[0],
        summary: document.querySelector("#schematicTakeoffSummary")?.textContent || "",
      }));
      check(systemTable.systemCode === "CHWP", `${name}: system input did not normalize to CHWP`);
      check(systemTable.item?.type === "Valve" && systemTable.item?.quantity === 3 && systemTable.item?.connectionType === "Flanged" && systemTable.item?.brand === "Ebro" && systemTable.item?.flangeType === "Wafer PN16", `${name}: valve classification was not retained (${JSON.stringify(systemTable.item)})`);
      check(systemTable.summary.includes("CHWP") && systemTable.summary.includes("Ebro") && systemTable.summary.includes("Wafer PN16"), `${name}: CHWP side table did not include the classified valve (${systemTable.summary})`);
      await page.locator("#schematicTakeoffZoomInButton").click();
      check((await page.locator("#schematicTakeoffZoomReadout").evaluate((element) => element.value)) === "125%", `${name}: zoom control did not update`);

      const layout = await page.evaluate(() => {
        const card = document.querySelector(".schematic-takeoff-card");
        const sidebar = document.querySelector(".schematic-takeoff-sidebar");
        const close = document.querySelector("#schematicTakeoffCloseButton").getBoundingClientRect();
        const countButton = document.querySelector("#schematicTakeoffCountButton").getBoundingClientRect();
        const detectionReview = document.querySelector("#schematicTakeoffDetectionReview").getBoundingClientRect();
        return {
          card: { width: card.clientWidth, scrollWidth: card.scrollWidth, height: card.clientHeight, scrollHeight: card.scrollHeight },
          pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          sidebarWidth: sidebar.getBoundingClientRect().width,
          closeVisible: close.left >= 0 && close.right <= innerWidth && close.top >= 0 && close.bottom <= innerHeight,
          countControlUsable: countButton.width > 80 && countButton.height >= 36,
          detectionReviewUsable: detectionReview.width > 180,
          selectedCount: document.querySelector("#schematicTakeoffSelectionCount").textContent,
        };
      });
      check(layout.card.scrollWidth <= layout.card.width + 2, `${name}: takeoff card overflows horizontally`);
      check(layout.card.scrollHeight <= layout.card.height + 2, `${name}: takeoff card overflows vertically`);
      check(layout.pageOverflow <= 2, `${name}: page overflows horizontally`);
      check(layout.sidebarWidth > 200, `${name}: review sidebar is unusable`);
      check(layout.closeVisible, `${name}: close button is outside the viewport`);
      check(layout.countControlUsable && layout.detectionReviewUsable, `${name}: automatic-count review controls are unusable (${JSON.stringify(layout)})`);
      check(layout.selectedCount === "2 areas", `${name}: rectangle/lasso selections did not render`);
      check(pageErrors.length === 0, `${name}: ${pageErrors.join(" | ")}`);

      if (name === "ipad") {
        await page.screenshot({ path: path.join(os.tmpdir(), "spoolmate-schematic-takeoff-ipad.png"), fullPage: false });
      }
      await context.close();
      console.log(`${name}: ${width}x${height} passed`);
    }
  } finally {
    await browser.close();
  }
})();
