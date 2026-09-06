const path = require("path");
const os = require("os");
const { chromium } = require(process.env.SPOOLMATE_PLAYWRIGHT_PATH || "playwright");

const APP_URL = process.env.SPOOLMATE_TEST_URL || "http://127.0.0.1:8765/";
const suppliedFixture = process.env.TAKEOFF_RECOGNITION_FIXTURE || "";
const suppliedSelection = process.env.TAKEOFF_RECOGNITION_SELECTION ? JSON.parse(process.env.TAKEOFF_RECOGNITION_SELECTION) : null;
const suppliedText = process.env.TAKEOFF_RECOGNITION_TEXT ? JSON.parse(process.env.TAKEOFF_RECOGNITION_TEXT) : null;

function check(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1600);
    await page.evaluate(() => {
      document.querySelectorAll(".project-dialog-backdrop").forEach((dialog) => { dialog.hidden = true; });
      cloudUser = { id: "recognition-test", email: "private-beta@example.test" };
      schematicTakeoffAccess = true;
      schematicTakeoffState = defaultSchematicTakeoffState();
      schematicTakeoffDialog.hidden = false;
      document.body.classList.add("schematic-takeoff-open");
    });

    if (suppliedFixture) {
      await page.setInputFiles("#schematicTakeoffFileInput", path.resolve(suppliedFixture));
      await page.waitForFunction(() => Boolean(schematicTakeoffState?.sourceWidth && schematicTakeoffState?.sourceHeight));
    } else {
      await page.evaluate(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 900;
        canvas.height = 420;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff3db";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#665e53";
        ctx.fillStyle = "#665e53";
        ctx.lineWidth = 3;
        ctx.font = "18px sans-serif";
        ctx.fillText("CHWP-B4-1", 390, 245);
        const drawValve = (x, y, direction = "horizontal", size = 15) => {
          ctx.save();
          ctx.translate(x, y);
          if (direction === "vertical") ctx.rotate(Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(-size, -size * 0.7);
          ctx.lineTo(0, 0);
          ctx.lineTo(-size, size * 0.7);
          ctx.closePath();
          ctx.moveTo(size, -size * 0.7);
          ctx.lineTo(0, 0);
          ctx.lineTo(size, size * 0.7);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        };
        ctx.beginPath();
        ctx.moveTo(60, 120);
        ctx.lineTo(840, 120);
        ctx.moveTo(60, 260);
        ctx.lineTo(840, 260);
        ctx.stroke();
        drawValve(190, 120);
        drawValve(520, 120);
        drawValve(260, 260);
        drawValve(680, 260);
        ctx.strokeRect(760, 88, 30, 30);
        ctx.fillText("T", 768, 111);
        ctx.beginPath();
        ctx.arc(430, 260, 24, 0, Math.PI * 2);
        ctx.stroke();
        schematicTakeoffState.source = canvas;
        schematicTakeoffState.sourceWidth = canvas.width;
        schematicTakeoffState.sourceHeight = canvas.height;
        schematicTakeoffState.fileName = "synthetic-CHWP.png";
        schematicTakeoffState.fileKind = "image";
        fitSchematicTakeoffView();
      });
    }

    const result = await page.evaluate(async ({ requestedSelection, requestedText }) => {
      const takeoff = ensureSchematicTakeoffState();
      if (requestedText) takeoff.pageTextByPage.set(takeoff.page, requestedText);
      addSchematicTakeoffSelection(requestedSelection
        ? { kind: "rectangle", ...requestedSelection }
        : { kind: "rectangle", x: 0, y: 0, width: takeoff.sourceWidth, height: takeoff.sourceHeight });
      const selected = schematicTakeoffSelectedArea();
      selected.systemCode = "CHWP";
      selected.systemSource = "manual";
      const direct = schematicTakeoffDetectValveSymbols(selected);
      await countSchematicTakeoffSymbols();
      const automatic = selected.items.find((item) => item.symbolClass === "Isolation valve");
      const uncertain = selected.items.filter((item) => item.unclassified);
      const stage3 = SCHEMATIC_TAKEOFF_STAGE3_SYMBOL_KNOWLEDGE;
      return {
        directCount: direct.markers.length,
        directUnknownCount: direct.unknownMarkers?.length || 0,
        classified: (direct.classifiedGroups || []).map((group) => ({ type: group.type, count: group.markers?.length || 0, markers: (group.markers || []).map((marker) => ({ x: Math.round(marker.x), y: Math.round(marker.y), width: Math.round(marker.width), height: Math.round(marker.height), source: marker.source })) })),
        automaticCount: schematicTakeoffItemQuantity(automatic),
        uncertainCount: uncertain.length,
        questionMarkCount: uncertain.flatMap((item) => item.markers || []).filter((marker) => marker.questionMark).length,
        confidences: automatic?.markers?.map((marker) => marker.confidence) || [],
        markers: automatic?.markers?.map((marker) => ({ x: Math.round(marker.x), y: Math.round(marker.y), width: Math.round(marker.width), height: Math.round(marker.height), confidence: marker.confidence, purity: Number(marker.shapePurity || 0).toFixed(3), orientation: marker.orientation })) || [],
        exportDisabled: document.querySelector("#schematicTakeoffExportButton").disabled,
        reviewText: document.querySelector("#schematicTakeoffDetectionReview").textContent,
        summaryText: document.querySelector("#schematicTakeoffSummary").textContent,
        itemId: automatic?.id || "",
        markerId: automatic?.markers?.[0]?.id || "",
        firstUnknownId: uncertain[0]?.id || "",
        stage3Count: stage3.length,
        stage3Symbol3: stage3.find((symbol) => symbol.number === 3),
        stage3Symbol11: stage3.find((symbol) => symbol.number === 11),
        stage3Symbol19: stage3.find((symbol) => symbol.number === 19),
        stage3Ignored: stage3.filter((symbol) => symbol.behavior === "ignore").map((symbol) => symbol.number),
        stage3LegendText: document.querySelector("#schematicTakeoffStage3Legend")?.textContent || "",
      };
    }, { requestedSelection: suppliedSelection, requestedText: suppliedText });

    if (suppliedFixture) {
      check(result.directCount > 0, `supplied fixture: no standard valve symbols detected (${JSON.stringify(result)})`);
      console.log(`supplied fixture: ${result.directCount} isolation valves and ${result.uncertainCount} ? review items detected; ${JSON.stringify(result.markers)}; classified ${JSON.stringify(result.classified)}`);
      await page.screenshot({ path: path.join(os.tmpdir(), "spoolmate-schematic-recognition-supplied.png"), fullPage: false });
      check(errors.length === 0, errors.join(" | "));
      return;
    } else {
      check(result.directCount === 4, `synthetic: expected 4 valve symbols, found ${result.directCount} (${JSON.stringify(result)})`);
      check(result.automaticCount === 4, `synthetic: automatic count did not create four review marks (${JSON.stringify(result)})`);
      check(result.uncertainCount > 0 && result.questionMarkCount === result.uncertainCount, `synthetic: uncertain symbol was not protected by a ? review mark (${JSON.stringify(result)})`);
    }
    check(result.exportDisabled, "unreviewed automatic count should block CSV export");
    check(result.reviewText.includes("included"), "detected-mark review controls did not render");
    check(result.summaryText.includes("CHWP") && result.summaryText.includes("Review required"), "system order table did not show the automatic review row");
    check(result.stage3Count === 28, `Stage 3 symbol profile is incomplete (${result.stage3Count})`);
    check(result.stage3Symbol3?.components?.some((component) => component.type === "Binder symbol" && component.quantity === 2), "Stage 3 symbol 3 lost its two binder components");
    check(result.stage3Symbol11?.type === "Unclassified symbol" && result.stage3Symbol11?.behavior === "review", "unlabelled Stage 3 symbol 11 must remain a ? review item");
    check(result.stage3Symbol19?.type === "Pump" && result.stage3Symbol19?.inferred && result.stage3Symbol19?.behavior === "review", "inferred Stage 3 symbol 19 pump must require review");
    check(JSON.stringify(result.stage3Ignored) === JSON.stringify([9, 24]), `Stage 3 ignored-symbol rules changed (${JSON.stringify(result.stage3Ignored)})`);
    check(result.stage3LegendText.includes("Motorised valve with two binder symbols") && result.stage3LegendText.includes("? Unconfirmed symbol"), "Stage 3 symbol profile did not render in the take-off workspace");

    if (result.itemId && result.markerId) {
      const toggled = await page.evaluate(({ itemId, markerId }) => {
        toggleSchematicTakeoffMarker(itemId, markerId);
        const item = schematicTakeoffSelectedArea().items.find((entry) => entry.id === itemId);
        return schematicTakeoffItemQuantity(item);
      }, result);
      check(toggled === result.automaticCount - 1, "excluding a coloured mark did not reduce the order quantity");
      await page.locator(`[data-edit-schematic-fitting="${result.itemId}"]`).click();
      await page.locator("#schematicTakeoffFittingSizeInput").fill("NB 100");
      await page.locator("#schematicTakeoffValveConnectionInput").selectOption("Flanged");
      await page.locator("#schematicTakeoffValveBrandInput").selectOption("Ebro");
      await page.locator("#schematicTakeoffValveFlangeInput").fill("Wafer PN16");
      await page.locator("#schematicTakeoffAddFittingButton").click();
      const reviewed = await page.evaluate(({ itemId }) => {
        const item = schematicTakeoffSelectedArea().items.find((entry) => entry.id === itemId);
        return {
          reviewed: item?.reviewed,
          source: item?.source,
          quantity: schematicTakeoffItemQuantity(item),
          exportDisabled: document.querySelector("#schematicTakeoffExportButton").disabled,
          summary: document.querySelector("#schematicTakeoffSummary").textContent,
        };
      }, result);
      check(reviewed.reviewed && reviewed.source === "automatic-reviewed", `automatic row was not confirmed (${JSON.stringify(reviewed)})`);
      check(reviewed.quantity === result.automaticCount - 1, "review changed the accepted coloured-mark quantity");
      check(reviewed.exportDisabled === (result.uncertainCount > 0), "unclassified ? items did not keep CSV export safely blocked");
      check(reviewed.summary.includes("NB 100") && reviewed.summary.includes("Ebro") && reviewed.summary.includes("Wafer PN16"), "reviewed valve details did not reach the CHWP order table");
      if (result.uncertainCount > 0) {
        await page.locator(`[data-edit-schematic-fitting="${result.firstUnknownId}"]`).click();
        await page.locator("#schematicTakeoffFittingTypeInput").selectOption("Pump");
        await page.locator("#schematicTakeoffFittingSizeInput").fill("NB 100");
        await page.locator("#schematicTakeoffPumpSuctionSizeInput").fill("NB 100");
        await page.locator("#schematicTakeoffPumpDischargeSizeInput").fill("NB 80");
        await page.locator("#schematicTakeoffEquipmentFlangeInput").fill("PN 16");
        await page.locator("#schematicTakeoffPumpFlexibleInput").selectOption("Bellow");
        await page.locator("#schematicTakeoffPumpSuctionComponentInput").selectOption("Strainer");
        await page.locator("#schematicTakeoffEquipmentVerifiedInput").check();
        await page.locator("#schematicTakeoffAddFittingButton").click();
        const classified = await page.evaluate(({ firstUnknownId }) => {
          const item = schematicTakeoffSelectedArea().items.find((entry) => entry.id === firstUnknownId);
          return { type: item?.type, reviewed: item?.reviewed, unclassified: item?.unclassified, questionMark: item?.markers?.[0]?.questionMark, equipmentConfig: item?.equipmentConfig };
        }, result);
        check(classified.type === "Pump" && classified.reviewed && !classified.unclassified && !classified.questionMark && classified.equipmentConfig?.verified, `? item could not be classified and equipment-verified individually (${JSON.stringify(classified)})`);
        const excludedUnknowns = await page.evaluate(() => {
          const selected = schematicTakeoffSelectedArea();
          selected.items.filter((item) => item.unclassified).forEach((item) => {
            (item.markers || []).filter((marker) => marker.included !== false).forEach((marker) => toggleSchematicTakeoffMarker(item.id, marker.id));
          });
          return {
            exportDisabled: document.querySelector("#schematicTakeoffExportButton").disabled,
            questionMarks: selected.items.filter((item) => item.unclassified).flatMap((item) => item.markers || []).filter((marker) => marker.questionMark).length,
          };
        });
        check(!excludedUnknowns.exportDisabled, "excluding every false ? mark did not unblock export");
        check(excludedUnknowns.questionMarks === Math.max(0, result.uncertainCount - 1), "question-mark identity was lost when excluding a possible item");
      }
    }
    const clearedQuestions = await page.evaluate(({ itemId }) => {
      const before = schematicTakeoffState.selections
        .flatMap((selection) => selection.items || [])
        .filter((item) => item.unclassified || (item.markers || []).some((marker) => marker.questionMark))
        .reduce((sum, item) => sum + Math.max(1, (item.markers || []).filter((marker) => marker.questionMark).length), 0);
      clearAllSchematicTakeoffQuestionMarks();
      const remainingItems = schematicTakeoffSelectedArea().items;
      return {
        before,
        after: remainingItems.filter((item) => item.unclassified || (item.markers || []).some((marker) => marker.questionMark)).length,
        automaticPreserved: remainingItems.some((item) => item.id === itemId),
        buttonDisabled: document.querySelector("#schematicTakeoffClearQuestionsButton").disabled,
      };
    }, result);
    if (result.uncertainCount > 1) {
      check(clearedQuestions.before > 0 && clearedQuestions.after === 0, `bulk orange ? cleanup failed (${JSON.stringify(clearedQuestions)})`);
      check(clearedQuestions.automaticPreserved, "bulk orange ? cleanup removed a confirmed coloured fitting");
      check(clearedQuestions.buttonDisabled, "bulk orange ? cleanup control did not disable after clearing every question mark");
    }
    if (!suppliedFixture) {
      const stackedValveCount = await page.evaluate(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 180;
        canvas.height = 170;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff3db";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#665e53";
        ctx.lineWidth = 3;
        const drawValve = (x, y, size = 15) => {
          ctx.beginPath();
          ctx.moveTo(8, y);
          ctx.lineTo(x - size, y);
          ctx.moveTo(x - size, y - size * 0.7);
          ctx.lineTo(x, y);
          ctx.lineTo(x - size, y + size * 0.7);
          ctx.closePath();
          ctx.moveTo(x + size, y - size * 0.7);
          ctx.lineTo(x, y);
          ctx.lineTo(x + size, y + size * 0.7);
          ctx.closePath();
          ctx.moveTo(x + size, y);
          ctx.lineTo(canvas.width - 8, y);
          ctx.stroke();
        };
        drawValve(90, 52);
        drawValve(90, 118);
        schematicTakeoffState = defaultSchematicTakeoffState();
        schematicTakeoffState.source = canvas;
        schematicTakeoffState.sourceWidth = canvas.width;
        schematicTakeoffState.sourceHeight = canvas.height;
        schematicTakeoffState.fileName = "stacked-isolation-valves.png";
        schematicTakeoffState.fileKind = "image";
        const selection = { id: "stacked", page: 1, kind: "rectangle", x: 0, y: 0, width: canvas.width, height: canvas.height, items: [] };
        schematicTakeoffState.selections = [selection];
        schematicTakeoffState.selectedId = selection.id;
        return schematicTakeoffDetectValveSymbols(selection).markers.length;
      });
      check(stackedValveCount === 2, `stacked isolation valves must remain two separate counted items (found ${stackedValveCount})`);

      const pumpAssembly = await page.evaluate(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 520;
        canvas.height = 210;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff3db";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#514c45";
        ctx.fillStyle = "#514c45";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(24, 90);
        ctx.lineTo(490, 90);
        ctx.stroke();

        // Y-strainer body and capped leg, upstream of the labelled pump.
        ctx.beginPath();
        ctx.moveTo(173, 82);
        ctx.lineTo(173, 98);
        ctx.moveTo(197, 82);
        ctx.lineTo(197, 98);
        ctx.moveTo(178, 90);
        ctx.lineTo(191, 102);
        ctx.lineTo(184, 109);
        ctx.stroke();

        // Pump body. Its equipment tag below supplies the pump context.
        ctx.beginPath();
        ctx.arc(260, 90, 18, 0, Math.PI * 2);
        ctx.moveTo(249, 78);
        ctx.lineTo(275, 90);
        ctx.lineTo(249, 102);
        ctx.closePath();
        ctx.stroke();

        // Swing-check symbol immediately downstream of the pump.
        ctx.beginPath();
        ctx.moveTo(323, 82);
        ctx.lineTo(323, 98);
        ctx.moveTo(347, 82);
        ctx.lineTo(347, 98);
        ctx.moveTo(323, 82);
        ctx.lineTo(335, 90);
        ctx.lineTo(323, 98);
        ctx.moveTo(335, 90);
        ctx.lineTo(344, 97);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(335, 90, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Flexible bellow: it must remain a review mark, not an isolation valve.
        ctx.beginPath();
        ctx.arc(405, 90, 10, 0, Math.PI * 2);
        ctx.moveTo(398, 84);
        ctx.lineTo(401, 96);
        ctx.lineTo(405, 84);
        ctx.lineTo(409, 96);
        ctx.lineTo(412, 84);
        ctx.stroke();

        // Vertical isolation valve on the pump bypass.
        ctx.beginPath();
        ctx.moveTo(460, 112);
        ctx.lineTo(460, 190);
        ctx.moveTo(451, 132);
        ctx.lineTo(460, 147);
        ctx.lineTo(469, 132);
        ctx.closePath();
        ctx.moveTo(451, 162);
        ctx.lineTo(460, 147);
        ctx.lineTo(469, 162);
        ctx.closePath();
        ctx.stroke();

        schematicTakeoffState = defaultSchematicTakeoffState();
        schematicTakeoffState.source = canvas;
        schematicTakeoffState.sourceWidth = canvas.width;
        schematicTakeoffState.sourceHeight = canvas.height;
        schematicTakeoffState.fileName = "synthetic-pump-assembly.png";
        schematicTakeoffState.fileKind = "image";
        schematicTakeoffState.pageTextByPage.set(1, [{ text: "CHWP-B4-2", x: 260, y: 122, width: 48, height: 10 }]);
        const selection = { id: "pump-assembly", page: 1, kind: "rectangle", x: 0, y: 0, width: canvas.width, height: canvas.height, items: [] };
        schematicTakeoffState.selections = [selection];
        schematicTakeoffState.selectedId = selection.id;
        const detected = schematicTakeoffDetectValveSymbols(selection);
        return {
          groups: (detected.classifiedGroups || []).map((group) => ({
            type: group.type,
            count: group.markers?.length || 0,
            centers: (group.markers || []).map((marker) => ({ x: marker.x + marker.width / 2, y: marker.y + marker.height / 2 })),
          })),
          unknownCenters: (detected.unknownMarkers || []).map((marker) => ({ x: marker.x + marker.width / 2, y: marker.y + marker.height / 2 })),
        };
      });
      const pumpGroupCount = (type) => pumpAssembly.groups.find((group) => group.type === type)?.count || 0;
      check(pumpGroupCount("Pump") === 1, `pump context was not detected (${JSON.stringify(pumpAssembly)})`);
      check(pumpGroupCount("Strainer") === 1, `pump strainer was not detected (${JSON.stringify(pumpAssembly)})`);
      check(pumpGroupCount("Check valve") === 1, `pump check valve was not detected (${JSON.stringify(pumpAssembly)})`);
      check(pumpGroupCount("Isolation valve") === 1, `vertical isolation valve was not detected exactly once (${JSON.stringify(pumpAssembly)})`);
      check(!pumpAssembly.groups.find((group) => group.type === "Isolation valve")?.centers.some((center) => Math.abs(center.x - 405) < 20), `flexible bellow was misclassified as an isolation valve (${JSON.stringify(pumpAssembly)})`);
      check(pumpAssembly.unknownCenters.some((center) => Math.abs(center.x - 405) < 20), `flexible bellow did not remain marked for review (${JSON.stringify(pumpAssembly)})`);
    }
    check(errors.length === 0, errors.join(" | "));
    console.log("Schematic local recognition review passed");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
