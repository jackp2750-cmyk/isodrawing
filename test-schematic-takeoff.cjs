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
      await page.waitForTimeout(1600);
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
          text: "CHWP-B4-1 100NB",
          x: bounds.x + bounds.width / 2,
          y: bounds.y + bounds.height / 2,
        }]);
        return schematicTakeoffDetectSystemContext(selection);
      });
      check(detectedSystem.systemCode === "CHWP" && detectedSystem.equipmentTags.includes("CHWP-B4-1"), `${name}: system was not derived from the selected equipment tag (${JSON.stringify(detectedSystem)})`);
      check(detectedSystem.suggestedPipeSize === "NB 100", `${name}: pipe size was not derived from the selected pipework label (${JSON.stringify(detectedSystem)})`);
      const labelledSymbols = await page.evaluate(() => {
        const selection = schematicTakeoffSelectedArea();
        const bounds = schematicTakeoffAreaBounds(selection);
        const labels = ["CHWP-B4-1 500kPa", "CH-B4-1 2945kW", "HX-B4-2", "T", "M", "DP"];
        schematicTakeoffState.pageTextByPage.set(selection.page, labels.map((text, index) => ({
          text,
          x: bounds.x + bounds.width * (0.18 + index * 0.11),
          y: bounds.y + bounds.height * 0.55,
          width: Math.max(8, text.length * 6),
          height: 10,
        })));
        return schematicTakeoffDetectTextGuidedSymbols(selection).map((group) => ({ type: group.type, count: group.markers.length }));
      });
      for (const type of ["Pump", "Chiller", "Heat exchanger", "Temperature sensor", "Mag flow meter", "Differential pressure switch"]) {
        check(labelledSymbols.some((group) => group.type === type && group.count === 1), `${name}: labelled ${type} symbol was not recognised (${JSON.stringify(labelledSymbols)})`);
      }

      await page.locator("#schematicTakeoffSystemInput").fill("chwp");
      await page.locator("#schematicTakeoffSystemInput").press("Tab");
      await page.locator("#schematicTakeoffFittingTypeInput").selectOption("Isolation valve");
      check(await page.locator("#schematicTakeoffValveQuestions").isVisible(), `${name}: valve classification questions did not open`);
      await page.locator("#schematicTakeoffValveConnectionInput").selectOption("Flanged");
      await page.locator("#schematicTakeoffValveBrandInput").selectOption("Ebro");
      await page.locator("#schematicTakeoffValveFlangeInput").fill("Wafer PN16");
      await page.locator("#schematicTakeoffFittingSizeInput").fill("NB 100");
      await page.locator("#schematicTakeoffFittingQuantityInput").fill("3");
      if (name === "ipad") {
        await page.locator("#schematicTakeoffEbroBolting").screenshot({ path: path.join(os.tmpdir(), "spoolmate-ebro-hp112-ipad.png") });
      }
      await page.locator("#schematicTakeoffAddFittingButton").click();
      const systemTable = await page.evaluate(() => ({
        systemCode: schematicTakeoffSelectedArea()?.systemCode,
        item: schematicTakeoffSelectedArea()?.items?.[0],
        summary: document.querySelector("#schematicTakeoffSummary")?.textContent || "",
        rowCount: ebroHp112Rows().length,
        additionalBoltExample: ebroHp112Lookup("DN300", "PN 16", 1),
        unavailableArrangementExample: ebroHp112Lookup("DN150", "PN 25", 3),
      }));
      check(systemTable.systemCode === "CHWP", `${name}: system input did not normalize to CHWP`);
      check(systemTable.item?.type === "Isolation valve" && systemTable.item?.quantity === 3 && systemTable.item?.connectionType === "Flanged" && systemTable.item?.brand === "Ebro" && systemTable.item?.flangeType === "Wafer PN16", `${name}: valve classification was not retained (${JSON.stringify(systemTable.item)})`);
      check(systemTable.summary.includes("CHWP") && systemTable.summary.includes("Ebro") && systemTable.summary.includes("Wafer PN16"), `${name}: CHWP side table did not include the classified valve (${systemTable.summary})`);
      check(systemTable.rowCount === 206, `${name}: the complete EBRO HP112 table was not loaded (${systemTable.rowCount})`);
      check(systemTable.item?.ebroBolting?.matched && systemTable.item.ebroBolting.primaryBoltSpec === "8 x M16 x 200", `${name}: DN100 PN16 EBRO bolt length did not match the verified table (${JSON.stringify(systemTable.item?.ebroBolting)})`);
      check(systemTable.summary.includes("24 × M16 × 200"), `${name}: EBRO bolt quantity was not multiplied across three valves (${systemTable.summary})`);
      check(systemTable.additionalBoltExample?.matched && systemTable.additionalBoltExample.primaryBoltSpec === "10 x M24 x 270" && systemTable.additionalBoltExample.additionalBoltSpec === "4 x M24 x 55", `${name}: mandatory EBRO connection-5 bolts were not returned (${JSON.stringify(systemTable.additionalBoltExample)})`);
      check(systemTable.unavailableArrangementExample?.status === "arrangement-unavailable", `${name}: unavailable EBRO connection arrangement was not held for review (${JSON.stringify(systemTable.unavailableArrangementExample)})`);
      await page.locator(`[data-edit-schematic-fitting="${systemTable.item.id}"]`).click();
      await page.locator("#schematicTakeoffEbroModelInput").selectOption("HP114");
      const hp114Editor = await page.evaluate(() => ({
        connection: document.querySelector("#schematicTakeoffEbroConnectionInput")?.value,
        connectionOptions: [...document.querySelectorAll("#schematicTakeoffEbroConnectionInput option")].map((option) => option.value),
        result: document.querySelector("#schematicTakeoffEbroBoltingResult")?.textContent || "",
      }));
      check(hp114Editor.connection === "4" && JSON.stringify(hp114Editor.connectionOptions) === JSON.stringify(["4"]), `${name}: HP114 did not switch to its model-specific connection 4 (${JSON.stringify(hp114Editor)})`);
      check(hp114Editor.result.includes("HP114") && hp114Editor.result.includes("16 × M16 × 45"), `${name}: HP114 DN100 PN16 result was not shown (${hp114Editor.result})`);
      if (name === "ipad") {
        await page.locator("#schematicTakeoffEbroBolting").screenshot({ path: path.join(os.tmpdir(), "spoolmate-ebro-hp114-ipad.png") });
      }
      await page.locator("#schematicTakeoffAddFittingButton").click();
      const hp114State = await page.evaluate(() => ({
        item: schematicTakeoffSelectedArea()?.items?.[0],
        summary: document.querySelector("#schematicTakeoffSummary")?.textContent || "",
        rowCount: ebroHp114Rows().length,
        fractionalSize: ebroHp114Lookup('2 1/2"', "PN 16"),
        largeValve: ebroHp114Lookup("DN450", "PN 16"),
        australianFlange: ebroLookup("HP114", "DN300", "AS 4087 PN16", 4),
      }));
      check(hp114State.rowCount === 193, `${name}: the complete EBRO HP114 table was not loaded (${hp114State.rowCount})`);
      check(hp114State.fractionalSize?.dn === 65 && hp114State.fractionalSize?.primaryBoltSpec === "8 x M16 x 40", `${name}: HP114 2 1/2 inch size did not resolve to DN65 (${JSON.stringify(hp114State.fractionalSize)})`);
      check(hp114State.item?.ebroModel === "HP114" && hp114State.item?.ebroConnection === "4" && hp114State.item?.ebroBolting?.primaryBoltSpec === "16 x M16 x 45", `${name}: HP114 review was not retained (${JSON.stringify(hp114State.item?.ebroBolting)})`);
      check(hp114State.summary.includes("48 × M16 × 45"), `${name}: HP114 bolt quantity was not multiplied across three valves (${hp114State.summary})`);
      check(hp114State.largeValve?.primaryBoltSpec === "32 x M27 x 95" && hp114State.largeValve?.additionalBoltSpec === "8 x M27 x 75", `${name}: HP114 DN450 PN16 connection-5 bolts were not returned (${JSON.stringify(hp114State.largeValve)})`);
      check(hp114State.australianFlange?.primaryBoltSpec === "24 x M20 x 65", `${name}: HP114 AS4087 PN16 alias did not reach EW 1823 (${JSON.stringify(hp114State.australianFlange)})`);
      const materialRules = await page.evaluate(() => {
        const valve = schematicTakeoffSelectedArea()?.items?.[0];
        const valveRules = schematicTakeoffDerivedRequirements(valve);
        const pump = {
          type: "Pump",
          size: "NB 100",
          quantity: 1,
          equipmentConfig: {
            verified: true,
            suctionLineSize: "NB 100",
            suctionSize: "NB 100",
            dischargeLineSize: "NB 100",
            dischargeSize: "NB 80",
            flangeType: "PN 16",
            flexibleConnection: "Victaulic",
            suctionComponent: "Strainer",
          },
        };
        const suctionDiffuserPump = {
          ...pump,
          equipmentConfig: { ...pump.equipmentConfig, flexibleConnection: "Bellow", suctionComponent: "Suction diffuser" },
        };
        const checkValve = {
          type: "Check valve",
          size: "NB 100",
          quantity: 2,
          connectionType: "Flanged",
          brand: "Hydroflow",
          flangeType: "PN 16",
          boltSpec: "8 x M16 x 120",
          reviewed: true,
        };
        const heatExchanger = {
          type: "Heat exchanger",
          size: "NB 100",
          quantity: 2,
          equipmentConfig: { verified: true, connectionSize: "NB 80", connectionCount: 4, flangeType: "PN 16" },
        };
        const unverifiedPump = { type: "Pump", size: "NB 100", quantity: 1, equipmentConfig: { verified: false } };
        return {
          uniqueSize: schematicTakeoffPipeSizesFromText('CHWP DN100 and NPS 4"'),
          multipleSizes: schematicTakeoffPipeSizesFromText("100NB to DN80"),
          valveRules,
          checkValveRules: schematicTakeoffDerivedRequirements(checkValve),
          pumpRules: schematicTakeoffDerivedRequirements(pump),
          suctionDiffuserRules: schematicTakeoffDerivedRequirements(suctionDiffuserPump),
          heatExchangerRules: schematicTakeoffDerivedRequirements(heatExchanger),
          unverifiedPumpReview: schematicTakeoffItemNeedsReview(unverifiedPump),
        };
      });
      check(materialRules.uniqueSize.length === 1 && materialRules.uniqueSize[0].label === "NB 100", `${name}: equivalent DN/NPS pipe labels were not deduplicated (${JSON.stringify(materialRules.uniqueSize)})`);
      check(materialRules.multipleSizes.length === 2, `${name}: multiple pipe sizes were not kept for human selection (${JSON.stringify(materialRules.multipleSizes)})`);
      check(materialRules.valveRules.some((row) => row.type === "Connection flange" && row.quantity === 6), `${name}: two flanges per valve were not added (${JSON.stringify(materialRules.valveRules)})`);
      check(materialRules.valveRules.some((row) => row.type === "Gasket" && row.quantity === 6), `${name}: two gaskets per valve were not added (${JSON.stringify(materialRules.valveRules)})`);
      check(materialRules.valveRules.some((row) => row.type === "Bolt" && row.quantity === 48 && row.size === "M16 × 45 mm"), `${name}: verified EBRO bolts were not converted to actual order quantity (${JSON.stringify(materialRules.valveRules)})`);
      check(materialRules.checkValveRules.some((row) => row.type === "Connection flange" && row.quantity === 4) && materialRules.checkValveRules.some((row) => row.type === "Gasket" && row.quantity === 4) && materialRules.checkValveRules.some((row) => row.type === "Bolt" && row.quantity === 16), `${name}: check-valve flange, gasket or bolt rules failed (${JSON.stringify(materialRules.checkValveRules)})`);
      check(materialRules.pumpRules.some((row) => row.type === "Reducer" && row.quantity === 1 && row.size.includes("NB 100 → NB 80")), `${name}: pump discharge reducer rule failed (${JSON.stringify(materialRules.pumpRules)})`);
      check(!materialRules.pumpRules.some((row) => row.type === "Eccentric reducer"), `${name}: pump suction reducer was added when pipe and nozzle sizes match (${JSON.stringify(materialRules.pumpRules)})`);
      check(materialRules.pumpRules.filter((row) => row.type === "Flexible Victaulic").reduce((sum, row) => sum + row.quantity, 0) === 6, `${name}: three flexible Victaulics per pump side were not added (${JSON.stringify(materialRules.pumpRules)})`);
      check(materialRules.pumpRules.some((row) => row.type === "Strainer" && row.quantity === 1) && materialRules.pumpRules.filter((row) => row.type === "Connection flange").reduce((sum, row) => sum + row.quantity, 0) === 4, `${name}: suction strainer hardware rule failed (${JSON.stringify(materialRules.pumpRules)})`);
      check(materialRules.suctionDiffuserRules.some((row) => row.type === "Suction diffuser" && row.quantity === 1) && materialRules.suctionDiffuserRules.some((row) => row.type === "Coupling" && row.quantity === 1), `${name}: suction diffuser connection rule failed (${JSON.stringify(materialRules.suctionDiffuserRules)})`);
      check(materialRules.heatExchangerRules.some((row) => row.type === "Connection flange" && row.quantity === 8) && materialRules.heatExchangerRules.some((row) => row.type === "Reducer" && row.quantity === 8), `${name}: verified heat-exchanger connection count was not multiplied by equipment quantity (${JSON.stringify(materialRules.heatExchangerRules)})`);
      check(materialRules.unverifiedPumpReview, `${name}: an unverified pump was allowed through order review`);
      await page.locator("#schematicTakeoffFittingTypeInput").selectOption("Pump");
      await page.locator("#schematicTakeoffFittingSizeInput").fill("NB 100");
      const equipmentEditor = await page.evaluate(() => ({
        visible: !document.querySelector("#schematicTakeoffEquipmentQuestions").hidden,
        valveHidden: document.querySelector("#schematicTakeoffValveQuestions").hidden,
        suctionLineVisible: !document.querySelector("#schematicTakeoffPumpSuctionLineSizeField").hidden,
        dischargeLineVisible: !document.querySelector("#schematicTakeoffPumpDischargeLineSizeField").hidden,
        suctionLineSize: document.querySelector("#schematicTakeoffPumpSuctionLineSizeInput").value,
        dischargeLineSize: document.querySelector("#schematicTakeoffPumpDischargeLineSizeInput").value,
      }));
      check(equipmentEditor.visible && equipmentEditor.valveHidden && equipmentEditor.suctionLineVisible && equipmentEditor.dischargeLineVisible, `${name}: pump verification controls were not shown correctly (${JSON.stringify(equipmentEditor)})`);
      check(equipmentEditor.suctionLineSize === "NB 100" && equipmentEditor.dischargeLineSize === "NB 100", `${name}: nearby pipe size was not carried into pump line-size verification (${JSON.stringify(equipmentEditor)})`);
      if (name === "ipad") {
        await page.locator("#schematicTakeoffEquipmentQuestions").screenshot({ path: path.join(os.tmpdir(), "spoolmate-pump-material-rules-ipad.png") });
      }
      await page.locator("#schematicTakeoffFittingTypeInput").selectOption("Elbow");
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
