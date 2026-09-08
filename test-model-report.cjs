const fs = require("fs");
const { chromium } = require(process.env.SPOOLMATE_PLAYWRIGHT_PATH || "playwright");

const APP_URL = process.env.SPOOLMATE_TEST_URL || "http://127.0.0.1:8765/";
const OUTPUT = process.env.SPOOLMATE_MODEL_QA_OUTPUT || "";

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
      const testPoints = [
        { x: 0, y: 0, z: -2726 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 4518, z: 0 },
        { x: 5000, y: 4518, z: 7865 },
        { x: 6064, y: 4518, z: 7189 },
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

      const canvas = await buildModelReportCanvas(views);
      return {
        title: iso.title,
        pointLabels: iso.pointLabels.map((entry) => entry.label),
        segmentLabels: iso.segmentLabels.map((entry) => entry.label),
        maxAngleDifference: Math.max(...angleDifference),
        png: canvas.toDataURL("image/png"),
      };
    });

    check(!result.error, result.error);
    check(result.pointLabels.join(",") === "A,B,C,D,E", `Unexpected point labels: ${result.pointLabels.join(",")}`);
    check(result.segmentLabels.join(",") === "D1,D2,D3,D4", `Unexpected run labels: ${result.segmentLabels.join(",")}`);
    check(result.maxAngleDifference < 0.0001, `3D isometric projection differs from 2D by ${result.maxAngleDifference} radians`);
    check(pageErrors.length === 0, `Browser errors: ${pageErrors.join(" | ")}`);

    if (OUTPUT) {
      fs.writeFileSync(OUTPUT, Buffer.from(result.png.split(",")[1], "base64"));
    }
    console.log(`3D report orientation passed: ${result.title}; A-E; D1-D4`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
