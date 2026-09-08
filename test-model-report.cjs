const fs = require("fs");
const { chromium } = require(process.env.SPOOLMATE_PLAYWRIGHT_PATH || "playwright");

const APP_URL = process.env.SPOOLMATE_TEST_URL || "http://127.0.0.1:8765/";
const OUTPUT = process.env.SPOOLMATE_MODEL_QA_OUTPUT || "";
const LIVE_OUTPUT = process.env.SPOOLMATE_LIVE_QA_OUTPUT || "";

function check(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => three?.ready === true, null, { timeout: 15000 });

    const result = await page.evaluate(async () => {
      document.querySelectorAll(".project-dialog-backdrop").forEach((dialog) => { dialog.hidden = true; });
      previewPanel.hidden = false;
      previewPanel.style.position = "fixed";
      previewPanel.style.inset = "20px";
      previewPanel.style.display = "grid";
      previewPanel.style.gridTemplateRows = "auto minmax(0, 1fr)";
      previewStage.style.width = "900px";
      previewStage.style.height = "600px";
      three.renderer.setSize(900, 600, false);
      // The reported failing layout: 980 up, 4,978 along -Y,
      // 1,738 along -X, then 1,342 up. All three joints are 90 degrees.
      const testPoints = [
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 980 },
        { x: 0, y: -4978, z: 980 },
        { x: -1738, y: -4978, z: 980 },
        { x: -1738, y: -4978, z: 2322 },
      ];
      state = {
        ...blankState({ userDefaults: false }),
        points: testPoints,
        edges: testPoints.slice(1).map((_, index) => ({ from: index, to: index + 1, pipeSizeNb: 250 })),
        activePoint: 4,
        selectedPoint: null,
        pipeSizeNb: 250,
        pipeSpec: "carbon40",
        previewMode: "illustrated",
      };
      rebuildThreeSpool();
      frameThreeCamera({ reset: true });
      const projectLivePoint = (point) => {
        const modelPoint = toModelUnits(point);
        const projected = new three.module.Vector3(modelPoint.x, modelPoint.y, modelPoint.z).project(three.camera);
        return { x: (projected.x + 1) * 450, y: (1 - projected.y) * 300 };
      };
      const liveProjected = testPoints.map(projectLivePoint);
      const liveMatchedStatus = previewOrientationStatus.textContent;
      const liveRotationLocked = three.controls.enableRotate === false;
      const liveRunLabels = [...previewLabelLayer.querySelectorAll(".pipe-size-label > span")].map((element) => element.textContent);
      const livePointLabels = [...previewLabelLayer.querySelectorAll(".three-point-label")].map((element) => element.textContent);
      enableThreeFreeRotate();
      const liveRotationUnlocked = three.controls.enableRotate === true;
      const target = three.controls.target.clone();
      three.camera.position.copy(target).add(new three.module.Vector3(8, -8, 6));
      three.camera.lookAt(target);
      three.camera.updateMatrixWorld(true);
      updateThreeOrientationStatus();
      const liveRotatedStatus = previewOrientationStatus.textContent;
      openPreviewPreservingWorkspace();
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const liveResetStatus = previewOrientationStatus.textContent;
      const liveOpenRotationLocked = three.controls.enableRotate === false;
      applyThreeViewState({
        position: target.clone().add(new three.module.Vector3(-8, 8, 6)).toArray(),
        target: target.toArray(),
        up: [0, 0, 1],
        zoom: 1,
        navigationMode: "orbit",
        userMoved: true,
      });
      const liveSavedRestoreStatus = previewOrientationStatus.textContent;
      const liveSavedRestoreRotationLocked = three.controls.enableRotate === false;
      const views = capture3dReportViews();
      const iso = views.find((view) => view.matchesDrawingOrientation);
      if (!iso) return { error: "No drawing-matched isometric view was captured." };

      const projected2d = testPoints.map((point) => ({
        x: (point.x - point.y) * Math.cos(Math.PI / 6),
        y: (point.x + point.y) * 0.5 - point.z,
      }));
      const angleDifference = projected2d.slice(1).map((point, index) => {
        const expected = { x: point.x - projected2d[index].x, y: point.y - projected2d[index].y };
        const actual = {
          x: iso.pointLabels[index + 1].x - iso.pointLabels[index].x,
          y: iso.pointLabels[index + 1].y - iso.pointLabels[index].y,
        };
        const cross = expected.x * actual.y - expected.y * actual.x;
        const dot = expected.x * actual.x + expected.y * actual.y;
        return Math.abs(Math.atan2(cross, dot));
      });
      const liveAngleDifference = projected2d.slice(1).map((point, index) => {
        const expected = { x: point.x - projected2d[index].x, y: point.y - projected2d[index].y };
        const actual = {
          x: liveProjected[index + 1].x - liveProjected[index].x,
          y: liveProjected[index + 1].y - liveProjected[index].y,
        };
        const cross = expected.x * actual.y - expected.y * actual.x;
        const dot = expected.x * actual.x + expected.y * actual.y;
        return Math.abs(Math.atan2(cross, dot));
      });

      const canvas = await buildModelReportCanvas(views);
      return {
        title: iso.title,
        pointLabels: iso.pointLabels.map((entry) => entry.label),
        segmentLabels: iso.segmentLabels.map((entry) => entry.label),
        maxAngleDifference: Math.max(...angleDifference),
        liveMaxAngleDifference: Math.max(...liveAngleDifference),
        liveAngleDifference,
        liveProjected,
        projected2d,
        liveCamera: {
          position: three.camera.position.toArray(),
          target: three.controls.target.toArray(),
          up: three.camera.up.toArray(),
        },
        liveMatchedStatus,
        liveRotationLocked,
        liveRotationUnlocked,
        liveRotatedStatus,
        liveResetStatus,
        liveOpenRotationLocked,
        liveSavedRestoreStatus,
        liveSavedRestoreRotationLocked,
        liveRunLabels,
        livePointLabels,
        png: canvas.toDataURL("image/png"),
      };
    });

    check(!result.error, result.error);
    check(result.pointLabels.join(",") === "A,B,C,D,E", `Unexpected point labels: ${result.pointLabels.join(",")}`);
    check(result.segmentLabels.join(",") === "D1,D2,D3,D4", `Unexpected run labels: ${result.segmentLabels.join(",")}`);
    check(result.maxAngleDifference < 0.0001, `3D isometric projection differs from 2D by ${result.maxAngleDifference} radians`);
    check(result.liveMaxAngleDifference < 0.0001, `Live 3D projection differs from 2D: ${JSON.stringify({ angles: result.liveAngleDifference, camera: result.liveCamera, live: result.liveProjected, iso: result.projected2d })}`);
    check(result.liveMatchedStatus === "2D turn direction locked", `Unexpected matched status: ${result.liveMatchedStatus}`);
    check(result.liveRotationLocked, "Live 3D rotation was not locked in drawing-comparison mode");
    check(result.liveRotationUnlocked, "Free rotate did not explicitly unlock live 3D orbiting");
    check(result.liveRotatedStatus.includes("left/right may appear reversed"), `Unexpected rotated status: ${result.liveRotatedStatus}`);
    check(result.liveResetStatus === "2D turn direction locked", `Unexpected reset status: ${result.liveResetStatus}`);
    check(result.liveOpenRotationLocked, "Opening live 3D did not restore the locked drawing comparison");
    check(result.liveSavedRestoreStatus === "2D turn direction locked", `A saved reverse-side camera overrode the drawing comparison: ${result.liveSavedRestoreStatus}`);
    check(result.liveSavedRestoreRotationLocked, "A saved spool view unlocked the drawing comparison");
    check(result.liveRunLabels.join(",") === "D1,D2,D3,D4", `Unexpected live run labels: ${result.liveRunLabels.join(",")}`);
    check(result.livePointLabels.join(",") === "A,B,C,D,E", `Unexpected live point labels: ${result.livePointLabels.join(",")}`);
    check(pageErrors.length === 0, `Browser errors: ${pageErrors.join(" | ")}`);

    if (OUTPUT) {
      fs.writeFileSync(OUTPUT, Buffer.from(result.png.split(",")[1], "base64"));
    }
    if (LIVE_OUTPUT) {
      await page.locator(".preview-panel").screenshot({ path: LIVE_OUTPUT });
    }
    console.log(`3D report orientation passed: ${result.title}; A-E; D1-D4`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
