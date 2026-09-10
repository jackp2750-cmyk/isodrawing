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
    page.on("pageerror", (error) => pageErrors.push(error.stack || error.message));
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
      previewPanelHidden = false;
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
      const modelBasis = {
        x: toModelUnits({ x: 1000, y: 0, z: 0 }),
        y: toModelUnits({ x: 0, y: 1000, z: 0 }),
        z: toModelUnits({ x: 0, y: 0, z: 1000 }),
      };
      enableThreeFreeRotate();
      const liveRotationUnlocked = three.controls.enableRotate === true;
      const liveFreeRotateZUp = three.camera.up.clone().normalize().dot(new three.module.Vector3(0, 0, 1));
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
        modelBasis,
        liveFreeRotateZUp,
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
    check(result.liveFreeRotateZUp > 0.999999, `Free rotate is not Z-up: ${JSON.stringify(result.liveCamera)}`);
    check(
      result.modelBasis.x.x === 1 && result.modelBasis.x.y === 0 && result.modelBasis.x.z === 0 &&
      result.modelBasis.y.x === 0 && result.modelBasis.y.y === -1 && result.modelBasis.y.z === 0 &&
      result.modelBasis.z.x === 0 && result.modelBasis.z.y === 0 && result.modelBasis.z.z === 1,
      `Drafting coordinates were not converted to the right-handed 3D basis: ${JSON.stringify(result.modelBasis)}`,
    );
    check(result.liveRotatedStatus.includes("left/right may appear reversed"), `Unexpected rotated status: ${result.liveRotatedStatus}`);
    check(result.liveResetStatus === "2D turn direction locked", `Unexpected reset status: ${result.liveResetStatus}`);
    check(result.liveOpenRotationLocked, "Opening live 3D did not restore the locked drawing comparison");
    check(result.liveSavedRestoreStatus === "2D turn direction locked", `A saved reverse-side camera overrode the drawing comparison: ${result.liveSavedRestoreStatus}`);
    check(result.liveSavedRestoreRotationLocked, "A saved spool view unlocked the drawing comparison");
    check(result.liveRunLabels.join(",") === "D1,D2,D3,D4", `Unexpected live run labels: ${result.liveRunLabels.join(",")}`);
    check(result.livePointLabels.join(",") === "A,B,C,D,E", `Unexpected live point labels: ${result.livePointLabels.join(",")}`);

    const stopOnBend = await page.evaluate(() => {
      state = {
        ...blankState({ userDefaults: false }),
        points: [
          { x: 0, y: 0, z: 0 },
          { x: 1000, y: 0, z: 0 },
          { x: 1000, y: 1000, z: 0 },
        ],
        edges: [
          { from: 0, to: 1, pipeSizeNb: 150 },
          { from: 1, to: 2, pipeSizeNb: 150 },
        ],
        activePoint: 2,
        pipeSizeNb: 150,
        pipeSpec: "carbon40",
        previewMode: "illustrated",
      };
      const originalEndSegment = segments()[1];
      drawingContextTarget = {
        segmentHit: { segment: originalEndSegment, t: 0.05 },
      };
      const target = bendStopTargetForHit(drawingContextTarget.segmentHit);
      const applied = stopContextBend();
      const stoppedSegment = segments()[1];
      const modelPoints = state.points.map((point) => {
        const modelPoint = toModelUnits(point);
        return new three.module.Vector3(modelPoint.x, modelPoint.y, modelPoint.z);
      });
      const segmentData = segments();
      const trims = computeGraphElbowTrims(modelPoints, segmentData, nodeConnections(segmentData));
      const elbow = trims.elbows[0];
      const curve = elbowCentrelineCurve(elbow.entry, elbow.joint, elbow.exit);
      const entryTangent = curve.getTangent(0);
      const exitTangent = curve.getTangent(1);
      const expectedEntryTangent = elbow.joint.clone().sub(elbow.entry).normalize();
      const expectedExitTangent = elbow.exit.clone().sub(elbow.joint).normalize();
      rebuildThreeSpool();
      let cylinders = 0;
      let tubes = 0;
      let terminalElbowCaps = 0;
      const cylinderHeights = [];
      three.spoolGroup.traverse((object) => {
        if (object.geometry?.type === "CylinderGeometry" && object.userData?.illustratedOutline !== true) {
          cylinders += 1;
          cylinderHeights.push(object.geometry.parameters?.height ?? null);
        }
        if (object.geometry?.type === "TubeGeometry") tubes += 1;
        if (object.userData?.terminalElbowCap === true) terminalElbowCaps += 1;
      });

      // Repeating the command should update the existing automatic note, not
      // stack another STOP ON BEND note on top of it.
      drawingContextTarget = { segmentHit: { segment: stoppedSegment, t: 0.05 } };
      stopContextBend();
      const automaticNotes = state.notes.filter((note) => String(note.text).startsWith("STOP ON BEND"));
      const stoppedQuantity = quantitySummary().segments.find(({ segment }) => segment.index === 1)?.quantity;
      const healthItems = drawingHealthItems();
      drawingContextTarget = { segmentHit: { segment: stoppedSegment, t: 0.05 } };
      renderDrawingContextMenu();
      const desktopActions = [...drawingContextMenu.querySelectorAll(".drawing-context-item > span")]
        .map((element) => element.textContent);
      renderMobileDrawingContextMenu(drawingContextTarget);
      const mobileActions = [...drawingContextMenu.querySelectorAll(".drawing-context-item > span")]
        .map((element) => element.textContent);
      return {
        targetCentreToEndMm: target?.centreToEndMm,
        targetEstimated: target?.estimated,
        applied,
        stoppedLengthMm: pointLength(stoppedSegment.vector),
        firstTrim: trims.segment.get("0:1"),
        secondTrim: trims.segment.get("1:1"),
        entryTangentDot: entryTangent.dot(expectedEntryTangent),
        exitTangentDot: exitTangent.dot(expectedExitTangent),
        cylinders,
        cylinderHeights,
        tubes,
        terminalElbowCaps,
        noteCount: automaticNotes.length,
        noteText: automaticNotes[0]?.text ?? "",
        stopWeldGapMm: stoppedQuantity?.weldGapMm,
        stopCutLengthMm: stoppedQuantity?.cutLengthMm,
        shortRunWarning: healthItems.some((item) => item.title === "Confirm very short pipe runs"),
        terminalOpenWarning: healthItems.some((item) => item.title === "Open pipe ends" && String(item.detail).includes("C on run 2")),
        desktopActions,
        mobileActions,
      };
    });
    check(stopOnBend.applied, "Stop on bend action did not apply");
    check(Math.abs(stopOnBend.targetCentreToEndMm - 229) < 0.001, `Unexpected NB150 90 degree C/E: ${stopOnBend.targetCentreToEndMm}`);
    check(stopOnBend.targetEstimated === false, `Atlas-backed NB150 90 degree C/E was marked estimated: ${JSON.stringify(stopOnBend)}`);
    check(Math.abs(stopOnBend.stoppedLengthMm - 229) < 0.001, `Stop on bend length was ${stopOnBend.stoppedLengthMm} mm`);
    check(Math.abs(stopOnBend.firstTrim - 0.229) < 0.000001, `First 3D elbow trim was ${stopOnBend.firstTrim} m`);
    check(Math.abs(stopOnBend.secondTrim - 0.229) < 0.000001, `Terminal 3D elbow trim was ${stopOnBend.secondTrim} m`);
    check(stopOnBend.entryTangentDot > 0.999, `3D elbow entry was not tangent: ${stopOnBend.entryTangentDot}`);
    check(stopOnBend.exitTangentDot > 0.999, `3D elbow exit was not tangent: ${stopOnBend.exitTangentDot}`);
    check(stopOnBend.cylinders === 1 && stopOnBend.tubes === 1, `Expected one straight pipe plus one complete elbow: ${JSON.stringify(stopOnBend)}`);
    check(stopOnBend.terminalElbowCaps === 1, `Stopped bend did not render one terminal end face: ${JSON.stringify(stopOnBend)}`);
    check(stopOnBend.noteCount === 1, `Stop on bend created ${stopOnBend.noteCount} notes`);
    check(stopOnBend.noteText.includes("90°") && stopOnBend.noteText.includes("229 mm"), `Unexpected stop note: ${stopOnBend.noteText}`);
    check(stopOnBend.stopWeldGapMm === 0 && stopOnBend.stopCutLengthMm === 0, `Stop-on-bend virtual leg produced pipe or a weld gap: ${JSON.stringify(stopOnBend)}`);
    check(!stopOnBend.shortRunWarning, "A documented stop-on-bend run triggered the short-run warning");
    check(!stopOnBend.terminalOpenWarning, "A documented stop-on-bend face was reported as an open pipe end");
    check(stopOnBend.desktopActions.includes("Stop on bend"), `Desktop context menu omitted Stop on bend: ${JSON.stringify(stopOnBend.desktopActions)}`);
    check(stopOnBend.mobileActions.includes("Stop on bend"), `Touch context menu omitted Stop on bend: ${JSON.stringify(stopOnBend.mobileActions)}`);

    const elbowCases = await page.evaluate(() => {
      const results = [];
      for (const nb of [15, 50, 150, 300]) {
        for (const bend of [45, 90]) {
          const radians = bend * Math.PI / 180;
          state = {
            ...blankState({ userDefaults: false }),
            points: [
              { x: -2000, y: 0, z: 0 },
              { x: 0, y: 0, z: 0 },
              { x: Math.cos(radians) * 2000, y: Math.sin(radians) * 2000, z: 0 },
            ],
            edges: [
              { from: 0, to: 1, pipeSizeNb: nb },
              { from: 1, to: 2, pipeSizeNb: nb },
            ],
            activePoint: 2,
            pipeSizeNb: nb,
            pipeSpec: "carbon40",
          };
          const segmentData = segments();
          const modelPoints = state.points.map((point) => {
            const modelPoint = toModelUnits(point);
            return new three.module.Vector3(modelPoint.x, modelPoint.y, modelPoint.z);
          });
          const trims = computeGraphElbowTrims(modelPoints, segmentData, nodeConnections(segmentData));
          const elbow = trims.elbows[0];
          const curve = elbowCentrelineCurve(elbow.entry, elbow.joint, elbow.exit);
          results.push({
            nb,
            bend,
            expected: bendTakeoffMm({ pipeSizeNb: nb }, bend) / 1000,
            expectedPipeRadius: pipeSizeForSegment(segmentData[0]).od / 2000,
            pipeRadius: pipeRadiusMetres(segmentData[0]),
            firstTrim: trims.segment.get("0:1"),
            secondTrim: trims.segment.get("1:1"),
            entryTangentDot: curve.getTangent(0).dot(elbow.joint.clone().sub(elbow.entry).normalize()),
            exitTangentDot: curve.getTangent(1).dot(elbow.exit.clone().sub(elbow.joint).normalize()),
          });
        }
      }
      return results;
    });
    for (const elbowCase of elbowCases) {
      check(Math.abs(elbowCase.firstTrim - elbowCase.expected) < 0.000001, `NB${elbowCase.nb} ${elbowCase.bend}° first trim mismatch: ${JSON.stringify(elbowCase)}`);
      check(Math.abs(elbowCase.secondTrim - elbowCase.expected) < 0.000001, `NB${elbowCase.nb} ${elbowCase.bend}° second trim mismatch: ${JSON.stringify(elbowCase)}`);
      check(Math.abs(elbowCase.pipeRadius - elbowCase.expectedPipeRadius) < 0.000001, `NB${elbowCase.nb} 3D pipe is not true OD scale: ${JSON.stringify(elbowCase)}`);
      check(elbowCase.entryTangentDot > 0.999 && elbowCase.exitTangentDot > 0.999, `NB${elbowCase.nb} ${elbowCase.bend}° elbow is not tangent: ${JSON.stringify(elbowCase)}`);
    }

    const adjacentBends = await page.evaluate(() => {
      state = {
        ...blankState({ userDefaults: false }),
        points: [
          { x: -2000, y: 0, z: 0 },
          { x: 0, y: 0, z: 0 },
          { x: 0, y: 100, z: 0 },
          { x: 2000, y: 100, z: 0 },
        ],
        edges: [
          { from: 0, to: 1, pipeSizeNb: 150 },
          { from: 1, to: 2, pipeSizeNb: 150 },
          { from: 2, to: 3, pipeSizeNb: 150 },
        ],
        activePoint: 3,
        pipeSizeNb: 150,
        pipeSpec: "carbon40",
        previewMode: "illustrated",
      };
      rebuildThreeSpool();
      let straightPipeCount = 0;
      three.spoolGroup.traverse((object) => {
        if (object.geometry?.type === "CylinderGeometry" && object.userData?.illustratedOutline !== true) straightPipeCount += 1;
      });
      const overlapIssue = drawingHealthItems().find((item) => item.title === "Fittings overlap on a short run");
      return {
        straightPipeCount,
        overlapSegments: overlapIssue?.target?.segmentIndexes ?? [],
      };
    });
    check(adjacentBends.straightPipeCount === 2, `A backwards middle pipe was rendered between overlapping elbows: ${JSON.stringify(adjacentBends)}`);
    check(adjacentBends.overlapSegments.includes(1), `The impossible adjacent-bend spacing was not reported: ${JSON.stringify(adjacentBends)}`);

    const fittingDimensions = await page.evaluate(() => {
      state = {
        ...blankState({ userDefaults: false }),
        points: [
          { x: 0, y: 0, z: 0 },
          { x: -2000, y: 0, z: 0 },
          { x: 2000, y: 0, z: 0 },
          { x: 0, y: 2000, z: 0 },
        ],
        edges: [
          { from: 0, to: 1, pipeSizeNb: 150 },
          { from: 0, to: 2, pipeSizeNb: 150 },
          { from: 0, to: 3, pipeSizeNb: 150 },
        ],
        activePoint: 3,
        pipeSizeNb: 150,
        pipeSpec: "carbon40",
      };
      const teeSegments = segments();
      const teeConnections = nodeConnections(teeSegments);
      const teeByIndex = new Map(teeSegments.map((segment) => [segment.index, segment]));
      const teeClearances = teeSegments.map((segment) => nodeFittingClearanceMetres(
        0,
        segment,
        teeConnections,
        teeByIndex,
        teeSegments,
        previewViewStyle(),
      ));
      const teeTakeoffs = takeoffData(teeSegments).tees[0]?.connections.map((entry) => entry.takeoffMm) ?? [];
      const socketRadius = socketRadiusMetres({ socketSizeNb: 50 });
      const expectedSocketRadius = pipeSizeByNb(50, "carbon40").od / 2000;

      state.points = [
        { x: 0, y: 0, z: 0 },
        { x: -100, y: 0, z: 0 },
        { x: 100, y: 0, z: 0 },
        { x: 0, y: 100, z: 0 },
      ];
      const shortTeeSegments = segments();
      const shortTeeData = takeoffData(shortTeeSegments);
      const overlap = drawingHealthItems().find((item) => item.title === "Fittings overlap on a short run");

      state = {
        ...blankState({ userDefaults: false }),
        points: [
          { x: -60, y: 0, z: 0 },
          { x: 0, y: 0, z: 0 },
          { x: 60, y: 0, z: 0 },
        ],
        edges: [
          { from: 0, to: 1, pipeSizeNb: 150 },
          { from: 1, to: 2, pipeSizeNb: 80 },
        ],
        activePoint: 2,
        pipeSizeNb: 80,
        pipeSpec: "carbon40",
      };
      const reducer = takeoffData().reducers[0];

      state = {
        ...blankState({ userDefaults: false }),
        points: [
          { x: -2000, y: 0, z: 0 },
          { x: 0, y: 0, z: 0 },
          { x: 0, y: 2000, z: 0 },
        ],
        edges: [
          { from: 0, to: 1, pipeSizeNb: 150 },
          { from: 1, to: 2, pipeSizeNb: 80 },
        ],
        activePoint: 2,
        pipeSizeNb: 80,
        pipeSpec: "carbon40",
        reducerSideOverrides: {},
      };
      const mixedSizeBend = (placementSide) => {
        state.reducerSideOverrides = placementSide === "large" ? { 1: "large" } : {};
        const bendSegments = segments();
        const takeoffs = takeoffData(bendSegments);
        const modelPoints = state.points.map((point) => {
          const modelPoint = toModelUnits(point);
          return new three.module.Vector3(modelPoint.x, modelPoint.y, modelPoint.z);
        });
        const trims = computeGraphElbowTrims(
          modelPoints,
          bendSegments,
          nodeConnections(bendSegments),
          takeoffs.reducers,
        );
        const elbow = trims.elbows[0];
        const stopTarget = bendStopTargetForHit({ segment: bendSegments[1], t: 0.05 }, bendSegments);
        const result = {
          placementSide,
          bendNb: takeoffs.elbows[0]?.nb,
          reducerBendNb: takeoffs.reducers[0]?.bendNb,
          firstTakeoffMm: takeoffs.elbows[0]?.firstTakeoffMm,
          secondTakeoffMm: takeoffs.elbows[0]?.secondTakeoffMm,
          modelFirstTrimMm: (elbow?.firstTrim ?? 0) * 1000,
          modelSecondTrimMm: (elbow?.secondTrim ?? 0) * 1000,
          modelRadiusMm: (elbow?.radius ?? 0) * 1000,
          expectedNb: placementSide === "large" ? 80 : 150,
          expectedRadiusMm: pipeSizeByNb(placementSide === "large" ? 80 : 150, "carbon40").od * 0.5,
          stopCentreToEndMm: stopTarget?.centreToEndMm,
          expectedStopCentreToEndMm: bendTakeoffMm(bendSegments[1], 90),
          stopMovesReducerTo: stopTarget?.moveReducerTo ?? null,
        };
        drawingContextTarget = { segmentHit: { segment: bendSegments[1], t: 0.05 } };
        result.stopApplied = stopContextBend();
        result.finalReducerPlacement = takeoffData().reducers[0]?.placementSide;
        result.finalOverlap = drawingHealthItems().some((item) => item.title === "Fittings overlap on a short run");
        result.finalQuantities = quantitySummary().segments.map(({ segment, quantity }) => ({
          segmentIndex: segment.index,
          centrelineMm: quantity.centrelineMm,
          takeoffMm: quantity.bendTakeoffMm,
          weldGapMm: quantity.weldGapMm,
          documentedStop: segmentIsDocumentedStopOnBend(segment),
        }));
        return result;
      };
      return {
        teeClearances,
        teeTakeoffs,
        socketRadius,
        expectedSocketRadius,
        shortTeeTakeoffs: shortTeeData.tees[0]?.connections.map((entry) => entry.takeoffMm) ?? [],
        shortTeeOverlapSegments: overlap?.target?.segmentIndexes ?? [],
        reducerLengthMm: reducer?.lengthMm,
        reducerFirstTakeoffMm: reducer?.firstTakeoffMm,
        reducerSecondTakeoffMm: reducer?.secondTakeoffMm,
        mixedSizeBends: [mixedSizeBend("small"), mixedSizeBend("large")],
      };
    });
    check(fittingDimensions.teeClearances.every((value) => Math.abs(value - 0.143) < 0.000001), `3D NB150 tee clearance is not the 143 mm C/E: ${JSON.stringify(fittingDimensions)}`);
    check(fittingDimensions.teeTakeoffs.every((value) => value === 143), `NB150 tee cut deduction is not 143 mm: ${JSON.stringify(fittingDimensions)}`);
    check(Math.abs(fittingDimensions.socketRadius - fittingDimensions.expectedSocketRadius) < 0.000001, `Socket is not true OD scale: ${JSON.stringify(fittingDimensions)}`);
    check(fittingDimensions.shortTeeTakeoffs.every((value) => value === 143), `A short run silently shrank the tee C/E: ${JSON.stringify(fittingDimensions)}`);
    check(fittingDimensions.shortTeeOverlapSegments.length === 3, `Impossible tee spacing was not reported on all legs: ${JSON.stringify(fittingDimensions)}`);
    check(Math.abs(fittingDimensions.reducerFirstTakeoffMm - fittingDimensions.reducerLengthMm * 0.5) < 0.001, `Reducer first F/F deduction was silently shrunk: ${JSON.stringify(fittingDimensions)}`);
    check(Math.abs(fittingDimensions.reducerSecondTakeoffMm - fittingDimensions.reducerLengthMm * 0.5) < 0.001, `Reducer second F/F deduction was silently shrunk: ${JSON.stringify(fittingDimensions)}`);
    for (const mixedBend of fittingDimensions.mixedSizeBends) {
      check(mixedBend.bendNb === mixedBend.expectedNb && mixedBend.reducerBendNb === mixedBend.expectedNb, `Mixed-size bend chose a fictitious reducing elbow: ${JSON.stringify(mixedBend)}`);
      check(Math.abs(mixedBend.firstTakeoffMm - mixedBend.secondTakeoffMm) < 0.001, `Mixed-size bend used different C/E values on one elbow: ${JSON.stringify(mixedBend)}`);
      check(Math.abs(mixedBend.modelFirstTrimMm - mixedBend.firstTakeoffMm) < 0.001 && Math.abs(mixedBend.modelSecondTrimMm - mixedBend.secondTakeoffMm) < 0.001, `Mixed-size 3D bend does not match cut deductions: ${JSON.stringify(mixedBend)}`);
      check(Math.abs(mixedBend.modelRadiusMm - mixedBend.expectedRadiusMm) < 0.001, `Mixed-size elbow body is not the selected bend OD: ${JSON.stringify(mixedBend)}`);
      check(Math.abs(mixedBend.stopCentreToEndMm - mixedBend.expectedStopCentreToEndMm) < 0.001, `Stop on bend did not plan a coherent terminal elbow size: ${JSON.stringify(mixedBend)}`);
      const expectedReducerMove = mixedBend.placementSide === "small" ? "large" : null;
      check(mixedBend.stopMovesReducerTo === expectedReducerMove, `Stop on bend did not move a conflicting reducer to the other leg: ${JSON.stringify(mixedBend)}`);
      check(mixedBend.stopApplied && mixedBend.finalReducerPlacement === "large" && !mixedBend.finalOverlap, `Stop on bend left an impossible mixed-size arrangement: ${JSON.stringify(mixedBend)}`);
    }

    const handednessCases = await page.evaluate(() => {
      const fixtures = [
        {
          name: "positive axes",
          points: [{ x: 0, y: 0, z: 0 }, { x: 1800, y: 0, z: 0 }, { x: 1800, y: 1200, z: 0 }, { x: 1800, y: 1200, z: 900 }],
        },
        {
          name: "negative axes",
          points: [{ x: 0, y: 0, z: 0 }, { x: -1800, y: 0, z: 0 }, { x: -1800, y: -1200, z: 0 }, { x: -1800, y: -1200, z: -900 }],
        },
        {
          name: "drop then screen-left",
          points: [{ x: 0, y: 0, z: 1200 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 3200, z: 0 }, { x: -1100, y: 3200, z: 0 }],
        },
        {
          name: "drop then screen-right",
          points: [{ x: 0, y: 0, z: 1200 }, { x: 0, y: 0, z: 0 }, { x: 0, y: -3200, z: 0 }, { x: 1100, y: -3200, z: 0 }],
        },
        {
          name: "reported long run drop and overlapping screen-left return",
          points: [
            { x: 0, y: 0, z: 0 },
            { x: 0, y: -3041, z: 0 },
            { x: 0, y: -3041, z: -1671 },
            { x: -1682, y: -3041, z: -1671 },
          ],
        },
        {
          name: "45 degree rise and return",
          points: [{ x: 0, y: 0, z: 0 }, { x: 2200, y: 0, z: 0 }, { x: 3200, y: 0, z: 1000 }, { x: 4700, y: 0, z: 1000 }],
        },
        {
          name: "45 degree horizontal offset",
          points: [{ x: 0, y: 0, z: 0 }, { x: 0, y: 1800, z: 0 }, { x: 900, y: 2700, z: 0 }, { x: 900, y: 4200, z: 0 }],
        },
      ];
      const results = [];
      for (const fixture of fixtures) {
        state = {
          ...blankState({ userDefaults: false }),
          points: fixture.points,
          edges: fixture.points.slice(1).map((_, index) => ({ from: index, to: index + 1, pipeSizeNb: 150 })),
          activePoint: fixture.points.length - 1,
          pipeSizeNb: 150,
          pipeSpec: "carbon40",
          previewMode: "illustrated",
        };
        rebuildThreeSpool();
        frameThreeCamera({ reset: true });
        const previewAspect = previewStage.getBoundingClientRect().width / Math.max(1, previewStage.getBoundingClientRect().height);
        const live = fixture.points.map((point) => {
          const modelPoint = toModelUnits(point);
          const projected = new three.module.Vector3(modelPoint.x, modelPoint.y, modelPoint.z).project(three.camera);
          return { x: projected.x * previewAspect, y: -projected.y };
        });
        const iso = fixture.points.map((point) => ({
          x: (point.x - point.y) * Math.cos(Math.PI / 6),
          y: (point.x + point.y) * 0.5 - point.z,
        }));
        const fallbackPoints = fixture.points.map(projectPreviewPoint);
        const dots = live.slice(1).map((point, index) => {
          const liveVector = { x: point.x - live[index].x, y: point.y - live[index].y };
          const isoVector = { x: iso[index + 1].x - iso[index].x, y: iso[index + 1].y - iso[index].y };
          const liveLength = Math.hypot(liveVector.x, liveVector.y);
          const isoLength = Math.hypot(isoVector.x, isoVector.y);
          return (liveVector.x * isoVector.x + liveVector.y * isoVector.y) / (liveLength * isoLength);
        });
        const reportCamera = new three.module.OrthographicCamera(-1, 1, 1, -1, 0.01, 1000);
        fitReportCameraToBox(reportCamera, reportSpoolBounds3d(three.module), 960 / 640, {
          direction: THREE_DRAWING_CAMERA_POSITION,
          up: THREE_DRAWING_CAMERA_UP,
        });
        const reportPoints = fixture.points.map((point) => {
          const modelPoint = toModelUnits(point);
          const projected = new three.module.Vector3(modelPoint.x, modelPoint.y, modelPoint.z).project(reportCamera);
          return { x: projected.x * (960 / 640), y: -projected.y };
        });
        const reportDots = reportPoints.slice(1).map((point, index) => {
          const reportVector = {
            x: point.x - reportPoints[index].x,
            y: point.y - reportPoints[index].y,
          };
          const isoVector = { x: iso[index + 1].x - iso[index].x, y: iso[index + 1].y - iso[index].y };
          const reportLength = Math.hypot(reportVector.x, reportVector.y);
          const isoLength = Math.hypot(isoVector.x, isoVector.y);
          return (reportVector.x * isoVector.x + reportVector.y * isoVector.y) / (reportLength * isoLength);
        });
        const fallbackDots = fallbackPoints.slice(1).map((point, index) => {
          const fallbackVector = {
            x: point.x - fallbackPoints[index].x,
            y: point.y - fallbackPoints[index].y,
          };
          const isoVector = { x: iso[index + 1].x - iso[index].x, y: iso[index + 1].y - iso[index].y };
          const fallbackLength = Math.hypot(fallbackVector.x, fallbackVector.y);
          const isoLength = Math.hypot(isoVector.x, isoVector.y);
          return (fallbackVector.x * isoVector.x + fallbackVector.y * isoVector.y) / (fallbackLength * isoLength);
        });
        results.push({
          name: fixture.name,
          minimumDirectionDot: Math.min(...dots),
          minimumReportDirectionDot: Math.min(...reportDots),
          minimumFallbackDirectionDot: Math.min(...fallbackDots),
        });
      }
      return results;
    });
    for (const handedness of handednessCases) {
      check(handedness.minimumDirectionDot > 0.999999, `Live 3D mirrored ${handedness.name}: ${JSON.stringify(handedness)}`);
      check(handedness.minimumReportDirectionDot > 0.999999, `PDF 3D mirrored ${handedness.name}: ${JSON.stringify(handedness)}`);
      check(handedness.minimumFallbackDirectionDot > 0.999999, `Fallback 3D mirrored ${handedness.name}: ${JSON.stringify(handedness)}`);
    }

    const selectedRunTrace = await page.evaluate(() => {
      state = {
        ...blankState({ userDefaults: false }),
        points: [
          { x: 0, y: 0, z: 0 },
          { x: 0, y: -3041, z: 0 },
          { x: 0, y: -3041, z: -1671 },
          { x: -1682, y: -3041, z: -1671 },
        ],
        edges: [
          { from: 0, to: 1, pipeSizeNb: 150 },
          { from: 1, to: 2, pipeSizeNb: 150 },
          { from: 2, to: 3, pipeSizeNb: 150 },
        ],
        activePoint: 3,
        selectedSegments: [2],
        selectedSegment: 2,
        pipeSizeNb: 150,
        pipeSpec: "carbon40",
        previewMode: "tricolor",
        show3dLabels: false,
      };
      rebuildThreeSpool();
      frameThreeCamera({ reset: true });
      const selectedGeometryTypes = [];
      three.spoolGroup.traverse((object) => {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        if (materials.some((material) => material?.userData?.spoolmateSelectedRun === true)) {
          selectedGeometryTypes.push(object.geometry?.type ?? object.type);
        }
      });
      enableThreeFreeRotate();
      const rotatedTarget = three.controls.target.clone();
      three.camera.position.copy(rotatedTarget).add(new three.module.Vector3(8, -8, 6));
      three.camera.lookAt(rotatedTarget);
      three.camera.updateMatrixWorld(true);
      updateThreeOrientationStatus();
      const rotatedStatus = previewOrientationStatus.textContent;
      const rotatedWarningVisible = !previewLabelLayer.querySelector(".selected-run-camera-warning")?.hidden;
      chooseSegmentFromPointer({ shiftKey: false, ctrlKey: false, metaKey: false }, 2);
      return {
        selectedGeometryTypes,
        runLabels: [...previewLabelLayer.querySelectorAll(".selected-run-label span")].map((element) => element.textContent),
        pointLabels: [...previewLabelLayer.querySelectorAll(".selected-run-point")].map((element) => element.textContent).sort(),
        labelLayerHidden: previewLabelLayer.hidden,
        allLabelCount: previewLabelLayer.children.length,
        rotatedStatus,
        rotatedWarningVisible,
        relockedStatus: previewOrientationStatus.textContent,
        relockedCamera: threeCameraMatches2dOrientation(),
        relockedComparison: three.comparisonLocked,
        relockedRotationDisabled: three.controls.enableRotate === false,
        warningHiddenAfterRelock: previewLabelLayer.querySelector(".selected-run-camera-warning")?.hidden === true,
      };
    });
    check(selectedRunTrace.selectedGeometryTypes.includes("CylinderGeometry"), `Selected straight run is not highlighted in 3D: ${JSON.stringify(selectedRunTrace)}`);
    check(selectedRunTrace.selectedGeometryTypes.includes("TubeGeometry"), `Elbow entering the selected run is not highlighted in 3D: ${JSON.stringify(selectedRunTrace)}`);
    check(selectedRunTrace.runLabels.join(",") === "D3 · C → D", `Selected 3D run direction is not explicit: ${JSON.stringify(selectedRunTrace)}`);
    check(selectedRunTrace.pointLabels.join(",") === "C,D", `Selected 3D endpoint labels are missing: ${JSON.stringify(selectedRunTrace)}`);
    check(!selectedRunTrace.labelLayerHidden && selectedRunTrace.allLabelCount === 3, `Selected 3D trace was hidden with general labels off: ${JSON.stringify(selectedRunTrace)}`);
    check(selectedRunTrace.rotatedStatus.includes("left/right may appear reversed") && selectedRunTrace.rotatedWarningVisible, `Reverse-side selected run did not warn directly: ${JSON.stringify(selectedRunTrace)}`);
    check(selectedRunTrace.relockedStatus === "2D turn direction locked" && selectedRunTrace.relockedCamera && selectedRunTrace.relockedComparison && selectedRunTrace.relockedRotationDisabled, `Selecting the 2D run did not restore the drawing-matched camera: ${JSON.stringify(selectedRunTrace)}`);
    check(selectedRunTrace.warningHiddenAfterRelock, `Rotated-view warning remained after the drawing camera was restored: ${JSON.stringify(selectedRunTrace)}`);

    const styleAudit = await page.evaluate(() => {
      state = {
        ...blankState({ userDefaults: false }),
        points: [
          { x: 0, y: 0, z: 0 },
          { x: 1800, y: 0, z: 0 },
          { x: 1800, y: 1200, z: 0 },
          { x: 1800, y: 1200, z: 900 },
        ],
        edges: [
          { from: 0, to: 1, pipeSizeNb: 150 },
          { from: 1, to: 2, pipeSizeNb: 150 },
          { from: 2, to: 3, pipeSizeNb: 150 },
        ],
        activePoint: 3,
        pipeSizeNb: 150,
        pipeSpec: "carbon40",
      };
      return ["tricolor", "illustrated", "carbon", "ghost", "outline"].map((mode) => {
        state.previewMode = mode;
        rebuildThreeSpool();
        frameThreeCamera({ reset: true });
        three.renderer.render(three.scene, three.camera);
        const box = new three.module.Box3().setFromObject(three.spoolGroup);
        let meshCount = 0;
        let lineCount = 0;
        three.spoolGroup.traverse((object) => {
          if (object.isMesh && object.userData?.illustratedOutline !== true) meshCount += 1;
          if (object.isLine || object.isLineSegments) lineCount += 1;
        });
        return {
          mode,
          empty: box.isEmpty(),
          finite: [...box.min.toArray(), ...box.max.toArray()].every(Number.isFinite),
          meshCount,
          lineCount,
        };
      });
    });
    for (const style of styleAudit) {
      check(!style.empty && style.finite, `3D ${style.mode} produced invalid bounds: ${JSON.stringify(style)}`);
      check(style.mode === "outline" ? style.lineCount > 0 : style.meshCount > 0, `3D ${style.mode} produced no visible geometry: ${JSON.stringify(style)}`);
    }
    check(pageErrors.length === 0, `Browser errors: ${pageErrors.join(" | ")}`);

    if (OUTPUT) {
      fs.writeFileSync(OUTPUT, Buffer.from(result.png.split(",")[1], "base64"));
    }
    if (LIVE_OUTPUT) {
      await page.evaluate(() => {
        document.documentElement.dataset.theme = "light";
        document.querySelectorAll(".project-dialog-backdrop").forEach((dialog) => { dialog.hidden = true; });
        state = {
          ...blankState({ userDefaults: false }),
          points: [
            { x: 0, y: 0, z: 0 },
            { x: 2400, y: 0, z: 0 },
            { x: 2400, y: 229, z: 0 },
          ],
          edges: [
            { from: 0, to: 1, pipeSizeNb: 150 },
            { from: 1, to: 2, pipeSizeNb: 150 },
          ],
          activePoint: 2,
          pipeSizeNb: 150,
          pipeSpec: "carbon40",
          previewMode: "illustrated",
        };
        previewPanel.hidden = false;
        previewPanel.style.position = "fixed";
        previewPanel.style.inset = "20px";
        previewPanel.style.width = "900px";
        previewPanel.style.height = "650px";
        previewStage.style.width = "900px";
        previewStage.style.height = "600px";
        rebuildThreeSpool();
        resizeThree();
        resetThreeView({ silent: true });
      });
      await page.waitForTimeout(350);
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
