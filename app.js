const drawCanvas = document.querySelector("#drawCanvas");
const fallbackCanvas = document.querySelector("#fallbackCanvas");
const threeCanvas = document.querySelector("#threeCanvas");
const previewStage = document.querySelector("#previewStage");
const cursorReadout = document.querySelector("#cursorReadout");
const renderStatus = document.querySelector("#renderStatus");
const spoolStats = document.querySelector("#spoolStats");
const previewModeSelect = document.querySelector("#previewModeSelect");
const segmentList = document.querySelector("#segmentList");
const takeoffSummary = document.querySelector("#takeoffSummary");
const weightsSummary = document.querySelector("#weightsSummary");
const stepLengthInput = document.querySelector("#stepLengthInput");
const selectedRunLengthInput = document.querySelector("#selectedRunLengthInput");
const angleInput = document.querySelector("#angleInput");
const anglePlaneSelect = document.querySelector("#anglePlaneSelect");
const pipeSpecSelect = document.querySelector("#pipeSpecSelect");
const pipeSizeSelect = document.querySelector("#pipeSizeSelect");
const pipeSizeReadout = document.querySelector("#pipeSizeReadout");
const noteTextInput = document.querySelector("#noteTextInput");
const flangeModeSelect = document.querySelector("#flangeModeSelect");
const dimensionToggle = document.querySelector("#dimensionToggle");
const dimensionStyleSelect = document.querySelector("#dimensionStyleSelect");
const liftingToggle = document.querySelector("#liftingToggle");
const previewLabelLayer = document.querySelector("#previewLabelLayer");
const propertiesPanel = document.querySelector("#propertiesPanel");
const projectFileInput = document.querySelector("#projectFileInput");
const projectInputs = [...document.querySelectorAll("[data-project-field]")];

const STORAGE_KEY = "isospool-studio-state-v8";
const CONTROL_COLLAPSE_KEY = "isospool-control-collapse-v1";
const LEGACY_STORAGE_KEYS = ["isospool-studio-state-v7", "isospool-studio-state-v6", "isospool-studio-state-v5", "isospool-studio-state-v4", "isospool-studio-state-v3", "isospool-studio-state-v2", "isospool-studio-state-v1"];
const PROJECT_FILE_VERSION = 1;
const MM_PER_GRID = 1000;
const LENGTH_INCREMENT_MM = 50;
const MIN_LENGTH_MM = 50;
const MAX_LENGTH_MM = 12000;
const ISO_COS = Math.cos(Math.PI / 6);
const ISO_SIN = Math.sin(Math.PI / 6);
const FITTING_TOOLS = new Set(["flange", "valve", "weld", "reducer"]);
const FLANGE_MODES = new Set(["single", "double"]);
const PREVIEW_MODES = new Set(["carbon", "black", "stainless", "red", "ghost", "outline"]);
const DIMENSION_STYLES = new Set(["labels", "redline"]);
const NODE_CONNECTION_TYPES = new Set(["tee", "branch"]);
const PIPE_SPECS = {
  carbon40: {
    label: "Carbon steel Sch 40",
    shortLabel: "Carbon Sch 40",
    material: "Carbon steel",
    schedule: "Sch 40",
    wallKey: "wall40",
    kgPerMKey: "kgPerM40",
  },
  stainless10: {
    label: "Stainless steel Sch 10S",
    shortLabel: "Stainless Sch 10S",
    material: "Stainless steel",
    schedule: "Sch 10S",
    wallKey: "wall10",
    kgPerMKey: null,
  },
};
const PIPE_SPEC_KEYS = new Set(Object.keys(PIPE_SPECS));
const PIPE_WEIGHT_COEFFICIENT = 0.0246615;
const PROJECT_INFO_DEFAULT = {
  jobNumber: "",
  spoolNumber: "",
  revision: "",
  drawnBy: "",
  client: "",
};
const ATLAS_BUTTWELD_WEIGHTS = {
  carbon40: {
    15: { elbow90: 0.08, elbow45: 0.04, reducer: 0.12, tee: 0.09 },
    20: { elbow90: 0.11, elbow45: 0.06, reducer: 0.15, tee: 0.13 },
    25: { elbow90: 0.16, elbow45: 0.08, reducer: 0.12, tee: 0.25 },
    32: { elbow90: 0.26, elbow45: 0.13, reducer: 0.16, tee: 0.43 },
    40: { elbow90: 0.37, elbow45: 0.19, reducer: 0.25, tee: 0.61 },
    50: { elbow90: 0.66, elbow45: 0.33, reducer: 0.38, tee: 0.88 },
    65: { elbow90: 1.29, elbow45: 0.69, reducer: 0.73, tee: 1.74 },
    80: { elbow90: 2.04, elbow45: 1.02, reducer: 0.94, tee: 2.41 },
    90: { elbow90: 2.94, elbow45: 1.47, reducer: 1.19, tee: 3.26 },
    100: { elbow90: 3.84, elbow45: 1.92, reducer: 1.45, tee: 4.12 },
    125: { elbow90: 6.48, elbow45: 3.24, reducer: 2.5, tee: 6.54 },
    150: { elbow90: 9.94, elbow45: 4.97, reducer: 3.6, tee: 9.58 },
    200: { elbow90: 20.1, elbow45: 10.1, reducer: 5.7, tee: 17.9 },
    250: { elbow90: 35.4, elbow45: 17.7, reducer: 9.6, tee: 30.4 },
    300: { elbow90: 52.0, elbow45: 26.0, reducer: 13.6, tee: 43.6 },
  },
  stainless10: {
    8: { elbow90: 0.02, elbow45: 0.01, tee: 0.03 },
    10: { elbow90: 0.03, elbow45: 0.02, tee: 0.05 },
    15: { elbow90: 0.06, elbow45: 0.03, tee: 0.09, reducer: 0.05 },
    20: { elbow90: 0.07, elbow45: 0.03, tee: 0.13, reducer: 0.1 },
    25: { elbow90: 0.14, elbow45: 0.08, tee: 0.28, reducer: 0.12 },
    32: { elbow90: 0.23, elbow45: 0.11, tee: 0.49, reducer: 0.18 },
    40: { elbow90: 0.30, elbow45: 0.17, tee: 0.68, reducer: 0.19 },
    50: { elbow90: 0.50, elbow45: 0.25, tee: 0.85, reducer: 0.31 },
    65: { elbow90: 0.85, elbow45: 0.48, tee: 1.41, reducer: 0.47 },
    80: { elbow90: 1.25, elbow45: 0.63, tee: 1.77, reducer: 0.59 },
    90: { elbow90: 1.70, elbow45: 0.75, tee: 2.67, reducer: 0.73 },
    100: { elbow90: 2.10, elbow45: 1.08, tee: 3.46, reducer: 0.87 },
    125: { elbow90: 3.65, elbow45: 1.82, tee: 5.44, reducer: 1.49 },
    150: { elbow90: 5.45, elbow45: 2.72, tee: 8.03, reducer: 2.0 },
    200: { elbow90: 10.20, elbow45: 5.33, tee: 15.65, reducer: 3.19 },
    250: { elbow90: 18.15, elbow45: 9.75, tee: 26.76, reducer: 5.2 },
    300: { elbow90: 25.80, elbow45: 13.62, tee: 39.46, reducer: 7.98 },
  },
};
const ATLAS_FLANGE_WEIGHTS = {
  15: 0.4,
  20: 0.6,
  25: 0.8,
  32: 1.0,
  40: 1.3,
  50: 2.1,
  65: 3.3,
  80: 3.9,
  90: 4.8,
  100: 5.3,
  125: 6.1,
  150: 7.5,
  200: 12.1,
  250: 16.5,
  300: 26.2,
};
const TEE_TAKEOFF_MM = {
  6: 25,
  8: 25,
  10: 25,
  15: 25,
  20: 29,
  25: 38,
  32: 48,
  40: 57,
  50: 64,
  65: 76,
  80: 86,
  90: 95,
  100: 105,
  125: 124,
  150: 143,
  200: 178,
  250: 216,
  300: 254,
};
const FLANGE_BOLT_COUNTS = [
  { maxNb: 50, count: 4 },
  { maxNb: 150, count: 8 },
  { maxNb: 300, count: 12 },
];

const drawingContextMenu = document.createElement("div");
drawingContextMenu.className = "drawing-context-menu";
drawingContextMenu.hidden = true;
drawingContextMenu.setAttribute("role", "menu");
document.body.append(drawingContextMenu);
let drawingContextTarget = null;

const PIPE_SIZES = [
  { nb: 6, nps: '1/8"', od: 10.3, wall40: 1.73, wall10: 1.24, kgPerM40: 0.37, elbow90Kg: null, elbow45Kg: null, lrRadius: 38 },
  { nb: 8, nps: '1/4"', od: 13.7, wall40: 2.24, wall10: 1.65, kgPerM40: 0.63, elbow90Kg: null, elbow45Kg: null, lrRadius: 38 },
  { nb: 10, nps: '3/8"', od: 17.1, wall40: 2.31, wall10: 1.65, kgPerM40: 0.84, elbow90Kg: null, elbow45Kg: null, lrRadius: 38 },
  { nb: 15, nps: '1/2"', od: 21.3, wall40: 2.77, wall10: 2.11, kgPerM40: 1.27, elbow90Kg: 0.08, elbow45Kg: 0.04, lrRadius: 38 },
  { nb: 20, nps: '3/4"', od: 26.7, wall40: 2.87, wall10: 2.11, kgPerM40: 1.69, elbow90Kg: 0.11, elbow45Kg: 0.06, lrRadius: 38 },
  { nb: 25, nps: '1"', od: 33.4, wall40: 3.38, wall10: 2.77, kgPerM40: 2.50, elbow90Kg: 0.16, elbow45Kg: 0.08, lrRadius: 38 },
  { nb: 32, nps: '1 1/4"', od: 42.2, wall40: 3.56, wall10: 2.77, kgPerM40: 3.39, elbow90Kg: 0.26, elbow45Kg: 0.13, lrRadius: 48 },
  { nb: 40, nps: '1 1/2"', od: 48.3, wall40: 3.68, wall10: 2.77, kgPerM40: 4.05, elbow90Kg: 0.37, elbow45Kg: 0.19, lrRadius: 57 },
  { nb: 50, nps: '2"', od: 60.3, wall40: 3.91, wall10: 2.77, kgPerM40: 5.44, elbow90Kg: 0.66, elbow45Kg: 0.33, lrRadius: 76 },
  { nb: 65, nps: '2 1/2"', od: 73.0, wall40: 5.16, wall10: 3.05, kgPerM40: 8.63, elbow90Kg: 1.29, elbow45Kg: 0.69, lrRadius: 95 },
  { nb: 80, nps: '3"', od: 88.9, wall40: 5.49, wall10: 3.05, kgPerM40: 11.29, elbow90Kg: 2.04, elbow45Kg: 1.02, lrRadius: 114 },
  { nb: 90, nps: '3 1/2"', od: 101.6, wall40: 5.74, wall10: 3.05, kgPerM40: 13.57, elbow90Kg: 2.94, elbow45Kg: 1.47, lrRadius: 133 },
  { nb: 100, nps: '4"', od: 114.3, wall40: 6.02, wall10: 3.05, kgPerM40: 16.07, elbow90Kg: 3.84, elbow45Kg: 1.92, lrRadius: 152 },
  { nb: 125, nps: '5"', od: 141.3, wall40: 6.55, wall10: 3.40, kgPerM40: 21.77, elbow90Kg: 6.48, elbow45Kg: 3.24, lrRadius: 190 },
  { nb: 150, nps: '6"', od: 168.3, wall40: 7.11, wall10: 3.40, kgPerM40: 28.26, elbow90Kg: 9.94, elbow45Kg: 4.97, lrRadius: 229 },
  { nb: 200, nps: '8"', od: 219.1, wall40: 8.18, wall10: 3.76, kgPerM40: 42.55, elbow90Kg: 20.1, elbow45Kg: 10.1, lrRadius: 305 },
  { nb: 250, nps: '10"', od: 273.0, wall40: 9.27, wall10: 4.19, kgPerM40: 60.31, elbow90Kg: 35.4, elbow45Kg: 17.7, lrRadius: 381 },
  { nb: 300, nps: '12"', od: 323.8, wall40: 10.31, wall10: 4.57, kgPerM40: 79.73, elbow90Kg: 52.0, elbow45Kg: 26.0, lrRadius: 457 },
];

const AXES = [
  { key: "xp", label: "+X", vector: { x: 1, y: 0, z: 0 }, color: "#0f766e" },
  { key: "xn", label: "-X", vector: { x: -1, y: 0, z: 0 }, color: "#0f766e" },
  { key: "yp", label: "+Y", vector: { x: 0, y: 1, z: 0 }, color: "#2563eb" },
  { key: "yn", label: "-Y", vector: { x: 0, y: -1, z: 0 }, color: "#2563eb" },
  { key: "zp", label: "+Z", vector: { x: 0, y: 0, z: 1 }, color: "#b95436" },
  { key: "zn", label: "-Z", vector: { x: 0, y: 0, z: -1 }, color: "#b95436" },
];

const axisByKey = new Map(AXES.map((axis) => [axis.key, axis]));

let nextFittingId = 1;
let nextNoteId = 1;
let state = loadState() ?? blankState();
let noteDrag = null;
let three = {
  ready: false,
  module: null,
  renderer: null,
  scene: null,
  camera: null,
  controls: null,
  spoolGroup: null,
  labels: [],
  animationFrame: 0,
};

function sampleState() {
  return {
    points: [
      { x: 0, y: 0, z: 0 },
      { x: 4000, y: 0, z: 0 },
      { x: 4000, y: 3000, z: 0 },
      { x: 4000, y: 3000, z: 3000 },
      { x: 1000, y: 3000, z: 3000 },
      { x: 1000, y: 1000, z: 3000 },
      { x: 1000, y: 1000, z: 1000 },
    ],
    edges: [
      { from: 0, to: 1, pipeSizeNb: 25 },
      { from: 1, to: 2, pipeSizeNb: 25 },
      { from: 2, to: 3, pipeSizeNb: 25 },
      { from: 3, to: 4, pipeSizeNb: 40 },
      { from: 4, to: 5, pipeSizeNb: 40 },
      { from: 5, to: 6, pipeSizeNb: 25 },
    ],
    fittings: [
      { id: 1, type: "flange", segmentIndex: 0, t: 0.1 },
      { id: 2, type: "weld", segmentIndex: 1, t: 0.5 },
      { id: 3, type: "valve", segmentIndex: 3, t: 0.45 },
      { id: 4, type: "flange", segmentIndex: 5, t: 0.9 },
    ],
    activeTool: "draw",
    selectedSegment: null,
    selectedSegments: [],
    selectedFitting: null,
    selectedNote: null,
    selectedPoint: null,
    activePoint: 6,
    notes: [
      { id: 1, text: "SHOP WELD", point: { x: 2800, y: 1200, z: 0 } },
    ],
    nodeTypes: {},
    hoveredSegment: null,
    pointer: null,
    previewCandidate: null,
    pipeSizeNb: 25,
    pipeSpec: "carbon40",
    stepLength: 1000,
    angleDegrees: 45,
    anglePlane: "xy",
    flangeMode: "single",
    previewMode: "carbon",
    gridScale: 42,
    showDimensions: true,
    dimensionStyle: "labels",
    showLiftingPoints: false,
    projectInfo: {
      jobNumber: "DEMO-001",
      spoolNumber: "SP-001",
      revision: "A",
      drawnBy: "",
      client: "Workshop sample",
    },
    history: [],
  };
}

function blankState() {
  return {
    points: [{ x: 0, y: 0, z: 0 }],
    edges: [],
    fittings: [],
    activeTool: "draw",
    selectedSegment: null,
    selectedSegments: [],
    selectedFitting: null,
    selectedNote: null,
    selectedPoint: 0,
    activePoint: 0,
    notes: [],
    nodeTypes: {},
    hoveredSegment: null,
    pointer: null,
    previewCandidate: null,
    pipeSizeNb: 25,
    pipeSpec: "carbon40",
    stepLength: 1000,
    angleDegrees: 45,
    anglePlane: "xy",
    flangeMode: "single",
    previewMode: "carbon",
    gridScale: 42,
    showDimensions: true,
    dimensionStyle: "labels",
    showLiftingPoints: false,
    projectInfo: defaultProjectInfo(),
    history: [],
  };
}

function loadState() {
  for (const key of [STORAGE_KEY, ...LEGACY_STORAGE_KEYS]) {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      const legacyUnits = key === "isospool-studio-state-v2" || key === "isospool-studio-state-v1";
      const applyNewDefaults = key !== STORAGE_KEY;
      const restored = stateFromPayload(saved, { legacyUnits, applyNewDefaults });
      if (!restored) continue;

      setNextIdsFromState(restored);
      return restored;
    } catch {
      continue;
    }
  }

  return null;
}

function statePayload() {
  return {
    points: state.points,
    edges: state.edges,
    fittings: state.fittings,
    notes: state.notes,
    nodeTypes: normalizeNodeTypes(state.nodeTypes, state.points.length),
    activePoint: state.activePoint,
    selectedPoint: state.selectedPoint,
    selectedSegments: selectedSegmentIndexes(),
    pipeSizeNb: state.pipeSizeNb,
    pipeSpec: normalizePipeSpec(state.pipeSpec),
    stepLength: state.stepLength,
    angleDegrees: state.angleDegrees,
    anglePlane: state.anglePlane,
    flangeMode: state.flangeMode,
    previewMode: state.previewMode,
    gridScale: state.gridScale,
    showDimensions: state.showDimensions,
    dimensionStyle: normalizeDimensionStyle(state.dimensionStyle),
    showLiftingPoints: state.showLiftingPoints,
    projectInfo: normalizeProjectInfo(state.projectInfo),
  };
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statePayload()));
  } catch (error) {
    console.warn("Could not save spool state in this browser.", error);
  }
}

function stateFromPayload(payload, options = {}) {
  const saved = payload?.state && typeof payload.state === "object" ? payload.state : payload;
  if (!saved || !Array.isArray(saved.points) || saved.points.length === 0) return null;

  const legacyUnits = options.legacyUnits === true;
  const applyNewDefaults = options.applyNewDefaults === true;
  const points = saved.points.map((point) => {
    const cloned = clonePoint(point);
    return legacyUnits
      ? {
          x: Math.round(cloned.x * MM_PER_GRID),
          y: Math.round(cloned.y * MM_PER_GRID),
          z: Math.round(cloned.z * MM_PER_GRID),
        }
      : cloned;
  });
  const edges = normalizeEdges(saved.edges, points.length);

  return {
    ...blankState(),
    points,
    edges,
    fittings: normalizeFittings(saved.fittings, edges.length),
    notes: normalizeNotes(saved.notes),
    nodeTypes: normalizeNodeTypes(saved.nodeTypes, points.length),
    pipeSizeNb: normalizePipeSize(saved.pipeSizeNb),
    pipeSpec: normalizePipeSpec(saved.pipeSpec),
    stepLength: normalizeLength(legacyUnits ? Number(saved.stepLength) * MM_PER_GRID : saved.stepLength),
    angleDegrees: normalizeAngle(saved.angleDegrees),
    anglePlane: normalizeAnglePlane(saved.anglePlane),
    flangeMode: applyNewDefaults ? "single" : normalizeFlangeMode(saved.flangeMode),
    previewMode: normalizePreviewMode(saved.previewMode),
    selectedSegments: normalizeSelectedSegments(saved.selectedSegments, edges.length),
    activePoint: Number.isInteger(saved.activePoint) && saved.activePoint >= 0 && saved.activePoint < points.length ? saved.activePoint : points.length - 1,
    selectedPoint: Number.isInteger(saved.selectedPoint) && saved.selectedPoint >= 0 && saved.selectedPoint < points.length ? saved.selectedPoint : null,
    gridScale: Number(saved.gridScale) || 42,
    showDimensions: saved.showDimensions !== false,
    dimensionStyle: normalizeDimensionStyle(saved.dimensionStyle),
    showLiftingPoints: applyNewDefaults ? false : saved.showLiftingPoints === true,
    projectInfo: normalizeProjectInfo(saved.projectInfo),
    history: [],
  };
}

function setNextIdsFromState(sourceState) {
  nextFittingId =
    Math.max(0, ...sourceState.fittings.map((fitting) => Number(fitting.id) || 0)) + 1;
  nextNoteId =
    Math.max(0, ...sourceState.notes.map((note) => Number(note.id) || 0)) + 1;
}

function normalizeNodeTypes(nodeTypes, pointCount) {
  if (!nodeTypes || typeof nodeTypes !== "object") return {};

  const normalized = {};
  for (const [key, type] of Object.entries(nodeTypes)) {
    const index = Number(key);
    if (
      Number.isInteger(index) &&
      index >= 0 &&
      index < pointCount &&
      NODE_CONNECTION_TYPES.has(type)
    ) {
      normalized[index] = type;
    }
  }
  return normalized;
}

function nodeConnectionType(nodeIndex) {
  return state.nodeTypes?.[nodeIndex] === "branch" ? "branch" : "tee";
}

function setNodeConnectionType(nodeIndex, type, options = {}) {
  if (!Number.isInteger(nodeIndex) || nodeIndex < 0 || nodeIndex >= state.points.length) return;
  if (!NODE_CONNECTION_TYPES.has(type)) return;

  state.nodeTypes = normalizeNodeTypes(state.nodeTypes, state.points.length);
  if (type === "branch") {
    state.nodeTypes[nodeIndex] = "branch";
  } else {
    delete state.nodeTypes[nodeIndex];
  }
  if (options.update !== false) updateAll();
}

function reindexNodeTypesAfterPointRemoval(removedIndex) {
  if (!state.nodeTypes || typeof state.nodeTypes !== "object") return;

  const next = {};
  for (const [key, type] of Object.entries(state.nodeTypes)) {
    const index = Number(key);
    if (!Number.isInteger(index) || index === removedIndex || !NODE_CONNECTION_TYPES.has(type)) continue;
    next[index > removedIndex ? index - 1 : index] = type;
  }
  state.nodeTypes = next;
}

function normalizeEdges(edges, pointCount) {
  if (Array.isArray(edges) && edges.length) {
    return edges
      .map((edge) => ({
        from: Number(edge.from),
        to: Number(edge.to),
        pipeSizeNb: normalizePipeSize(edge.pipeSizeNb ?? 25),
      }))
      .filter((edge) =>
        Number.isInteger(edge.from) &&
        Number.isInteger(edge.to) &&
        edge.from >= 0 &&
        edge.to >= 0 &&
        edge.from < pointCount &&
        edge.to < pointCount &&
        edge.from !== edge.to,
      );
  }

  const linearEdges = [];
  for (let i = 0; i < pointCount - 1; i += 1) {
    linearEdges.push({ from: i, to: i + 1, pipeSizeNb: 25 });
  }
  return linearEdges;
}

function normalizeFittings(fittings, edgeCount) {
  if (!Array.isArray(fittings)) return [];
  return fittings
    .map((fitting) => {
      const type = String(fitting.type ?? "");
      const normalized = {
        id: Number(fitting.id) || nextFittingId++,
        type,
        segmentIndex: Number(fitting.segmentIndex),
        t: normalizeFittingPosition(type, fitting.t),
      };

      if (type === "flange") {
        normalized.flangeMode = normalizeFlangeMode(fitting.flangeMode);
      }

      const weightKg = Number(fitting.weightKg);
      if (Number.isFinite(weightKg) && weightKg >= 0) {
        normalized.weightKg = Math.round(weightKg * 10) / 10;
      }

      return normalized;
    })
    .filter((fitting) =>
      FITTING_TOOLS.has(fitting.type) &&
      Number.isInteger(fitting.segmentIndex) &&
      fitting.segmentIndex >= 0 &&
      fitting.segmentIndex < edgeCount,
    );
}

function defaultProjectInfo() {
  return { ...PROJECT_INFO_DEFAULT };
}

function normalizeProjectInfo(info) {
  const source = info && typeof info === "object" ? info : {};
  return Object.fromEntries(
    Object.keys(PROJECT_INFO_DEFAULT).map((key) => [
      key,
      String(source[key] ?? "").trim().slice(0, key === "client" ? 56 : 32),
    ]),
  );
}

function normalizeFittingPosition(type, value) {
  const fallback = Number.isFinite(Number(value)) ? Number(value) : 0.5;
  if (type === "flange") {
    return clampNumber(fallback, 0, 1);
  }
  return clampNumber(fallback, 0.04, 0.96);
}

function normalizeSelectedSegments(values, edgeCount) {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.map((value) => Number(value)))]
    .filter((value) =>
      Number.isInteger(value) &&
      value >= 0 &&
      value < edgeCount,
    );
}

function normalizeNotes(notes) {
  if (!Array.isArray(notes)) return [];
  return notes
    .map((note) => ({
      id: Number(note.id) || nextNoteId++,
      text: String(note.text ?? "").slice(0, 80),
      point: clonePoint(note.point ?? {}),
    }))
    .filter((note) => note.text.trim());
}

function normalizePipeSize(value) {
  const requested = Number(value);
  return PIPE_SIZES.some((size) => size.nb === requested) ? requested : 25;
}

function pipeSizeFromText(value) {
  const match = String(value).trim().match(/\d+/);
  if (!match) return null;
  const requested = Number(match[0]);
  return PIPE_SIZES.some((size) => size.nb === requested) ? requested : null;
}

function normalizePipeSpec(value) {
  return PIPE_SPEC_KEYS.has(value) ? value : "carbon40";
}

function normalizeFlangeMode(value) {
  return FLANGE_MODES.has(value) ? value : "double";
}

function normalizePreviewMode(value) {
  return PREVIEW_MODES.has(value) ? value : "carbon";
}

function normalizeDimensionStyle(value) {
  return DIMENSION_STYLES.has(value) ? value : "labels";
}

function fittingFlangeMode(fitting) {
  return normalizeFlangeMode(fitting?.flangeMode);
}

function selectedSegmentIndexes() {
  const edgeCount = state.edges.length;
  const values = Array.isArray(state.selectedSegments) && state.selectedSegments.length
    ? state.selectedSegments
    : Number.isInteger(state.selectedSegment)
    ? [state.selectedSegment]
    : [];
  return normalizeSelectedSegments(values, edgeCount);
}

function setSelectedSegments(indexes) {
  const selected = normalizeSelectedSegments(indexes, state.edges.length);
  state.selectedSegments = selected;
  state.selectedSegment = selected.length ? selected[selected.length - 1] : null;
}

function clearSelectedSegments() {
  setSelectedSegments([]);
}

function selectSingleSegment(index) {
  setSelectedSegments([index]);
}

function toggleSelectedSegment(index) {
  const selected = new Set(selectedSegmentIndexes());
  if (selected.has(index)) {
    selected.delete(index);
  } else {
    selected.add(index);
  }
  setSelectedSegments([...selected]);
}

function isSegmentSelected(index) {
  return selectedSegmentIndexes().includes(index);
}

function chooseSegmentFromPointer(event, index) {
  if (event.shiftKey || event.ctrlKey || event.metaKey) {
    toggleSelectedSegment(index);
    return;
  }
  selectSingleSegment(index);
}

function selectedPipeSize() {
  const selected = selectedSegmentsData();
  return selected.length ? pipeSizeForSegment(selected[0]) : pipeSizeByNb(state.pipeSizeNb);
}

function pipeSpec() {
  return PIPE_SPECS[normalizePipeSpec(state.pipeSpec)] ?? PIPE_SPECS.carbon40;
}

function pipeSpecShortLabel() {
  return pipeSpec().shortLabel;
}

function pipeSizeByNb(nb) {
  return PIPE_SIZES.find((size) => size.nb === normalizePipeSize(nb)) ?? PIPE_SIZES.find((size) => size.nb === 25);
}

function pipeSizeForSegment(segment) {
  return pipeSizeByNb(segment?.pipeSizeNb ?? state.pipeSizeNb);
}

function pipeMassPerMetre(segment) {
  return pipeMassPerMetreForSize(pipeSizeForSegment(segment));
}

function pipeWallForSize(size) {
  const spec = pipeSpec();
  return Number(size[spec.wallKey]) || size.wall40;
}

function pipeMassPerMetreForSize(size) {
  const spec = pipeSpec();
  if (spec.kgPerMKey && Number.isFinite(size[spec.kgPerMKey])) {
    return size[spec.kgPerMKey];
  }
  const wall = pipeWallForSize(size);
  return PIPE_WEIGHT_COEFFICIENT * wall * (size.od - wall);
}

function selectedSegmentsData() {
  const selected = selectedSegmentIndexes();
  return segments().filter((segment) => selected.includes(segment.index));
}

function activePointIndex() {
  if (Number.isInteger(state.activePoint) && state.activePoint >= 0 && state.activePoint < state.points.length) {
    return state.activePoint;
  }
  return Math.max(0, state.points.length - 1);
}

function activePoint() {
  return state.points[activePointIndex()];
}

function normalizeLength(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 1000;
  }
  return Math.max(MIN_LENGTH_MM, Math.min(MAX_LENGTH_MM, Math.round(numeric / LENGTH_INCREMENT_MM) * LENGTH_INCREMENT_MM));
}

function normalizeAngle(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 45;
  }
  return Math.max(1, Math.min(89, numeric));
}

function normalizeBendAngle(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 90;
  }
  return Math.max(1, Math.min(179, Math.round(numeric * 10) / 10));
}

function normalizeAnglePlane(value) {
  return ["xy", "xz", "yz"].includes(value) ? value : "xy";
}

function clonePoint(point) {
  return {
    x: Number(point.x) || 0,
    y: Number(point.y) || 0,
    z: Number(point.z) || 0,
  };
}

function addPoints(a, b, scale = 1) {
  return {
    x: a.x + b.x * scale,
    y: a.y + b.y * scale,
    z: a.z + b.z * scale,
  };
}

function subtractPoints(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  };
}

function scalePoint(point, scale) {
  return {
    x: point.x * scale,
    y: point.y * scale,
    z: point.z * scale,
  };
}

function dotPoints(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function crossPoints(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function lerpPoint(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

function pointLength(point) {
  return Math.hypot(point.x, point.y, point.z);
}

function normalizePoint(point) {
  const length = pointLength(point) || 1;
  return { x: point.x / length, y: point.y / length, z: point.z / length };
}

function almostSamePoint(a, b) {
  return Math.abs(a.x - b.x) < 0.001 && Math.abs(a.y - b.y) < 0.001 && Math.abs(a.z - b.z) < 0.001;
}

function segments() {
  const list = [];
  const edges = state.edges?.length ? state.edges : normalizeEdges(null, state.points.length);
  for (let i = 0; i < edges.length; i += 1) {
    const edge = edges[i];
    const start = state.points[edge.from];
    const end = state.points[edge.to];
    if (!almostSamePoint(start, end)) {
      list.push({
        index: i,
        from: edge.from,
        to: edge.to,
        pipeSizeNb: normalizePipeSize(edge.pipeSizeNb ?? state.pipeSizeNb),
        start,
        end,
        vector: subtractPoints(end, start),
      });
    }
  }
  return list;
}

function runLabelForVector(vector) {
  const normalized = normalizePoint(vector);
  let best = AXES[0];
  let bestScore = -Infinity;
  for (const axis of AXES) {
    const score =
      normalized.x * axis.vector.x +
      normalized.y * axis.vector.y +
      normalized.z * axis.vector.z;
    if (score > bestScore) {
      best = axis;
      bestScore = score;
    }
  }

  if (bestScore > 0.999) {
    return best.label;
  }

  const abs = {
    x: Math.abs(vector.x),
    y: Math.abs(vector.y),
    z: Math.abs(vector.z),
  };

  if (abs.z < 0.001 && abs.x > 0.001 && abs.y > 0.001) {
    return `${formatAngle(Math.atan2(vector.y, vector.x) * 180 / Math.PI)} XY`;
  }
  if (abs.y < 0.001 && abs.x > 0.001 && abs.z > 0.001) {
    return `${formatAngle(Math.atan2(vector.z, vector.x) * 180 / Math.PI)} XZ`;
  }
  if (abs.x < 0.001 && abs.y > 0.001 && abs.z > 0.001) {
    return `${formatAngle(Math.atan2(vector.z, vector.y) * 180 / Math.PI)} YZ`;
  }

  return "Angled";
}

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: rect.width, height: rect.height, dpr };
}

function rawIso(point, scale = state.gridScale) {
  const x = point.x / MM_PER_GRID;
  const y = point.y / MM_PER_GRID;
  const z = point.z / MM_PER_GRID;
  return {
    x: (x - y) * ISO_COS * scale,
    y: (x + y) * ISO_SIN * scale - z * scale,
  };
}

function getProjection() {
  const rect = drawCanvas.getBoundingClientRect();
  const relevantPoints = state.previewCandidate
    ? [...state.points, state.previewCandidate.point]
    : state.points;
  const rawPoints = relevantPoints.map((point) => rawIso(point));
  const minX = Math.min(...rawPoints.map((point) => point.x));
  const maxX = Math.max(...rawPoints.map((point) => point.x));
  const minY = Math.min(...rawPoints.map((point) => point.y));
  const maxY = Math.max(...rawPoints.map((point) => point.y));

  return {
    offsetX: rect.width * 0.5 - (minX + maxX) * 0.5,
    offsetY: rect.height * 0.55 - (minY + maxY) * 0.5,
  };
}

function projectIso(point, projection = getProjection()) {
  const raw = rawIso(point);
  return {
    x: raw.x + projection.offsetX,
    y: raw.y + projection.offsetY,
  };
}

function drawIso() {
  const { ctx, width, height } = resizeCanvas(drawCanvas);
  const projection = getProjection();
  ctx.clearRect(0, 0, width, height);
  drawGrid(ctx, width, height, projection);
  drawEndpointGuides(ctx, projection);
  drawSpool2d(ctx, projection);
  drawNotes2d(ctx, projection);
  if (state.showLiftingPoints) {
    drawSuggestedLugs2d(ctx, projection);
    drawLiftPoint2d(ctx, projection);
  }
  drawPreviewRun(ctx, projection);
}

function drawGrid(ctx, width, height, projection) {
  ctx.save();
  ctx.fillStyle = "#f7f3e9";
  ctx.fillRect(0, 0, width, height);

  const bounds = worldBounds(8);
  const range = Math.min(34, Math.max(8, Math.ceil(Math.max(bounds.maxAbsX, bounds.maxAbsY) + 8)));

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(112, 124, 116, 0.08)";

  for (let i = -range; i <= range; i += 1) {
    drawLine(
      ctx,
      projectIso({ x: i * MM_PER_GRID, y: -range * MM_PER_GRID, z: 0 }, projection),
      projectIso({ x: i * MM_PER_GRID, y: range * MM_PER_GRID, z: 0 }, projection),
    );
    drawLine(
      ctx,
      projectIso({ x: -range * MM_PER_GRID, y: i * MM_PER_GRID, z: 0 }, projection),
      projectIso({ x: range * MM_PER_GRID, y: i * MM_PER_GRID, z: 0 }, projection),
    );
  }

  drawIsoPaperDots(ctx, width, height, projection, range);

  const origin = projectIso({ x: 0, y: 0, z: 0 }, projection);
  drawAxis(ctx, origin, projectIso({ x: 3000, y: 0, z: 0 }, projection), "#0f766e", "X");
  drawAxis(ctx, origin, projectIso({ x: 0, y: 3000, z: 0 }, projection), "#2563eb", "Y");
  drawAxis(ctx, origin, projectIso({ x: 0, y: 0, z: 3000 }, projection), "#b95436", "Z");
  ctx.restore();
}

function drawIsoPaperDots(ctx, width, height, projection, range) {
  ctx.save();
  for (let x = -range; x <= range; x += 1) {
    for (let y = -range; y <= range; y += 1) {
      const dot = projectIso({ x: x * MM_PER_GRID, y: y * MM_PER_GRID, z: 0 }, projection);
      if (dot.x < -8 || dot.x > width + 8 || dot.y < -8 || dot.y > height + 8) {
        continue;
      }

      const major = x % 5 === 0 && y % 5 === 0;
      ctx.beginPath();
      ctx.fillStyle = major ? "rgba(38, 80, 78, 0.38)" : "rgba(72, 86, 82, 0.24)";
      ctx.arc(dot.x, dot.y, major ? 1.9 : 1.25, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawEndpointGuides(ctx, projection) {
  if (state.activeTool !== "draw") return;

  const start = activePoint();
  const startScreen = projectIso(start, projection);

  ctx.save();
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 8]);
  ctx.lineCap = "round";

  for (const axis of AXES) {
    const endScreen = projectIso(addPoints(start, axis.vector, state.stepLength), projection);
    ctx.strokeStyle = axis.color;
    ctx.globalAlpha = 0.28;
    drawLine(ctx, startScreen, endScreen);
    ctx.globalAlpha = 0.74;
    ctx.beginPath();
    ctx.fillStyle = axis.color;
    ctx.arc(endScreen.x, endScreen.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawAxis(ctx, from, to, color, label) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  drawLine(ctx, from, to);
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - Math.cos(angle - 0.42) * 9, to.y - Math.sin(angle - 0.42) * 9);
  ctx.lineTo(to.x - Math.cos(angle + 0.42) * 9, to.y - Math.sin(angle + 0.42) * 9);
  ctx.closePath();
  ctx.fill();
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  ctx.fillText(label, to.x + 8, to.y + 4);
  ctx.restore();
}

function worldBounds(padding = 0) {
  const xs = state.points.map((point) => point.x / MM_PER_GRID);
  const ys = state.points.map((point) => point.y / MM_PER_GRID);
  const zs = state.points.map((point) => point.z / MM_PER_GRID);
  return {
    minX: Math.min(...xs) - padding,
    maxX: Math.max(...xs) + padding,
    minY: Math.min(...ys) - padding,
    maxY: Math.max(...ys) + padding,
    minZ: Math.min(...zs) - padding,
    maxZ: Math.max(...zs) + padding,
    maxAbsX: Math.max(...xs.map(Math.abs)),
    maxAbsY: Math.max(...ys.map(Math.abs)),
    maxAbsZ: Math.max(...zs.map(Math.abs)),
  };
}

function drawSpool2d(ctx, projection) {
  const pipeWidth = 4;
  const segmentListForDraw = segments();
  const connections = nodeConnections(segmentListForDraw);
  const dimensionLayout = {
    labels: [],
    lines: [],
    pipes: segmentListForDraw.map((segment) => ({
      index: segment.index,
      start: projectIso(segment.start, projection),
      end: projectIso(segment.end, projection),
    })),
  };

  ctx.save();
  ctx.lineCap = "butt";
  ctx.lineJoin = "round";

  for (const segment of segmentListForDraw) {
    const start = projectIso(segment.start, projection);
    const end = projectIso(segment.end, projection);
    const selected = isSegmentSelected(segment.index);
    const hovered = state.hoveredSegment === segment.index;

    ctx.shadowColor = "rgba(31, 42, 47, 0.12)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.strokeStyle = selected ? "#b95436" : hovered ? "#2563eb" : "#1f5f68";
    ctx.lineWidth = selected || hovered ? 7 : pipeWidth;
    drawLine(ctx, start, end);

    if (selected || hovered) {
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = "#fffdf8";
      ctx.lineWidth = 2;
      drawLine(ctx, start, end);
    }

  }

  drawFlushEndCaps2d(ctx, projection, segmentListForDraw, connections, pipeWidth);

  if (state.showDimensions) {
    const dimensionSegments = segmentListForDraw
      .map((segment) => ({
        segment,
        start: projectIso(segment.start, projection),
        end: projectIso(segment.end, projection),
      }))
      .sort((a, b) => Math.hypot(b.end.x - b.start.x, b.end.y - b.start.y) - Math.hypot(a.end.x - a.start.x, a.end.y - a.start.y));
    for (const item of dimensionSegments) {
      drawDimension(ctx, item.segment, item.start, item.end, dimensionLayout);
    }
  }

  if (state.showDimensions) {
    drawBendAngles(ctx, projection);
  }

  for (const fitting of state.fittings) {
    const segment = segmentListForDraw.find((item) => item.index === fitting.segmentIndex);
    if (!segment) continue;
    drawFitting2d(ctx, projection, fitting, segment, pipeWidth);
  }

  drawAutoReducers2d(ctx, projection, segmentListForDraw);
  drawTeeMarkers2d(ctx, projection, segmentListForDraw, connections, pipeWidth);
  drawPipePointMarkers(ctx, projection, connections);

  ctx.restore();
}

function drawLiftPoint2d(ctx, projection, quantities = quantitySummary()) {
  const liftPoint = centreOfGravityData(quantities);
  if (!liftPoint) return;

  const point = projectIso(liftPoint.point, projection);

  ctx.save();
  ctx.shadowColor = "rgba(31, 42, 47, 0.18)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 2;
  ctx.strokeStyle = "#c1121f";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(point.x - 11, point.y - 11);
  ctx.lineTo(point.x + 11, point.y + 11);
  ctx.moveTo(point.x + 11, point.y - 11);
  ctx.lineTo(point.x - 11, point.y + 11);
  ctx.stroke();

  ctx.shadowColor = "transparent";
  ctx.font = "900 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255, 253, 248, 0.96)";
  ctx.fillStyle = "#c1121f";
  ctx.strokeText("COG", point.x, point.y - 24);
  ctx.fillText("COG", point.x, point.y - 24);
  ctx.restore();
}

function drawSuggestedLugs2d(ctx, projection, quantities = quantitySummary()) {
  const lugPlan = suggestedLugPlan(quantities);
  if (!lugPlan) return;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 11px Inter, system-ui, sans-serif";

  for (const lug of lugPlan.points) {
    const point = projectIso(lug.point, projection);
    ctx.fillStyle = "#0f766e";
    ctx.strokeStyle = "#fffdf8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y - 11);
    ctx.lineTo(point.x + 11, point.y);
    ctx.lineTo(point.x, point.y + 11);
    ctx.lineTo(point.x - 11, point.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const label = `LUG ${lug.number}`;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(255, 253, 248, 0.96)";
    ctx.fillStyle = "#0f766e";
    ctx.strokeText(label, point.x, point.y - 25);
    ctx.fillText(label, point.x, point.y - 25);
  }

  ctx.restore();
}

function drawAutoReducers2d(ctx, projection, segmentData) {
  const reducers = autoReducerTransitions(segmentData);
  if (!reducers.length) return;

  ctx.save();
  ctx.lineCap = "butt";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#7a4dc2";
  ctx.fillStyle = "#f1ebff";
  ctx.lineWidth = 3;

  for (const reducer of reducers) {
    const joint = projectIso(state.points[reducer.nodeIndex], projection);
    const largeOther = projectIso(state.points[reducer.largeOtherIndex], projection);
    const smallOther = projectIso(state.points[reducer.smallOtherIndex], projection);
    const along = reducer.kind === "tee"
      ? normalizeScreenVector({ x: smallOther.x - joint.x, y: smallOther.y - joint.y })
      : normalizeScreenVector({ x: smallOther.x - largeOther.x, y: smallOther.y - largeOther.y });
    const normal = { x: -along.y, y: along.x };
    const length = 26;
    const largeWidth = Math.max(14, visualPipeWidth(reducer.largeSegment) * 1.45);
    const smallWidth = Math.max(8, visualPipeWidth(reducer.smallSegment) * 0.95);
    const start = reducer.kind === "tee"
      ? { x: joint.x + along.x * 2, y: joint.y + along.y * 2 }
      : { x: joint.x - along.x * length * 0.5, y: joint.y - along.y * length * 0.5 };
    const end = reducer.kind === "tee"
      ? { x: joint.x + along.x * length, y: joint.y + along.y * length }
      : { x: joint.x + along.x * length * 0.5, y: joint.y + along.y * length * 0.5 };

    ctx.beginPath();
    ctx.moveTo(start.x + normal.x * largeWidth * -0.5, start.y + normal.y * largeWidth * -0.5);
    ctx.lineTo(end.x + normal.x * smallWidth * -0.5, end.y + normal.y * smallWidth * -0.5);
    ctx.lineTo(end.x + normal.x * smallWidth * 0.5, end.y + normal.y * smallWidth * 0.5);
    ctx.lineTo(start.x + normal.x * largeWidth * 0.5, start.y + normal.y * largeWidth * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawFlushEndCaps2d(ctx, projection, segmentData, connections, pipeWidth) {
  ctx.save();
  ctx.shadowColor = "transparent";
  ctx.lineCap = "butt";

  for (const segment of segmentData) {
    const selected = isSegmentSelected(segment.index);
    const hovered = state.hoveredSegment === segment.index;
    const width = selected || hovered ? 7 : pipeWidth;
    const color = selected ? "#b95436" : hovered ? "#2563eb" : "#1f5f68";

    for (const [nodeIndex, otherIndex] of [[segment.from, segment.to], [segment.to, segment.from]]) {
      if ((connections.get(nodeIndex)?.length ?? 0) !== 1) continue;
      const end = projectIso(state.points[nodeIndex], projection);
      const other = projectIso(state.points[otherIndex], projection);
      const angle = Math.atan2(end.y - other.y, end.x - other.x);
      const normal = { x: -Math.sin(angle), y: Math.cos(angle) };
      const capHalf = width * 0.62;

      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(2, width * 0.48);
      drawLine(
        ctx,
        { x: end.x + normal.x * capHalf, y: end.y + normal.y * capHalf },
        { x: end.x - normal.x * capHalf, y: end.y - normal.y * capHalf },
      );
    }
  }

  ctx.restore();
}

function drawTeeMarkers2d(ctx, projection, segmentData, connections, pipeWidth) {
  const segmentByIndex = new Map(segmentData.map((segment) => [segment.index, segment]));

  ctx.save();
  ctx.shadowColor = "rgba(31, 42, 47, 0.12)";
  ctx.shadowBlur = 3;
  ctx.lineCap = "butt";
  ctx.lineJoin = "round";

  for (const [nodeIndex, connected] of connections.entries()) {
    if (connected.length < 3) continue;

    const joint = projectIso(state.points[nodeIndex], projection);
    if (nodeConnectionType(nodeIndex) === "branch") {
      const info = branchNodeInfo(nodeIndex, connected, segmentData);
      const branchEntries = info?.branchEntries?.length ? info.branchEntries : [];
      ctx.shadowColor = "rgba(31, 42, 47, 0.14)";
      ctx.strokeStyle = "#b95436";
      ctx.lineWidth = Math.max(3, pipeWidth * 0.42);

      for (const entry of branchEntries) {
        const other = projectIso(state.points[entry.other], projection);
        const vector = normalizeScreenVector({ x: other.x - joint.x, y: other.y - joint.y });
        const normal = { x: -vector.y, y: vector.x };
        const weldHalf = Math.max(6, visualPipeWidth(entry.segment) * 0.7);
        const weldOffset = Math.max(4, visualPipeWidth(entry.segment) * 0.28);

        drawLine(
          ctx,
          { x: joint.x + vector.x * weldOffset + normal.x * -weldHalf, y: joint.y + vector.y * weldOffset + normal.y * -weldHalf },
          { x: joint.x + vector.x * weldOffset + normal.x * weldHalf, y: joint.y + vector.y * weldOffset + normal.y * weldHalf },
        );
        drawLine(
          ctx,
          { x: joint.x + vector.x * 2, y: joint.y + vector.y * 2 },
          { x: joint.x + vector.x * 18, y: joint.y + vector.y * 18 },
        );
      }

      ctx.shadowColor = "transparent";
      ctx.fillStyle = "#fffdf8";
      ctx.strokeStyle = "#b95436";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(joint.x, joint.y, Math.max(4, pipeWidth * 0.45), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      continue;
    }

    ctx.strokeStyle = "#1f5f68";
    ctx.lineWidth = pipeWidth + 4;

    for (const connection of connected) {
      const segment = segmentByIndex.get(connection.segmentIndex);
      if (!segment) continue;
      const other = projectIso(state.points[connection.other], projection);
      const vector = normalizeScreenVector({ x: other.x - joint.x, y: other.y - joint.y });
      drawLine(
        ctx,
        { x: joint.x - vector.x * 2, y: joint.y - vector.y * 2 },
        { x: joint.x + vector.x * 18, y: joint.y + vector.y * 18 },
      );
    }

    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(255, 253, 248, 0.82)";
    ctx.lineWidth = 2;
    for (const connection of connected) {
      const other = projectIso(state.points[connection.other], projection);
      const vector = normalizeScreenVector({ x: other.x - joint.x, y: other.y - joint.y });
      drawLine(
        ctx,
        { x: joint.x, y: joint.y },
        { x: joint.x + vector.x * 15, y: joint.y + vector.y * 15 },
      );
    }
  }

  ctx.restore();
}

function drawPipePointMarkers(ctx, projection, connections = nodeConnections(segments())) {
  const activeIndex = activePointIndex();
  for (const [index, point] of state.points.entries()) {
    const isCurrent = index === activeIndex;
    const isSelected = index === state.selectedPoint;
    const connectionCount = connections.get(index)?.length ?? 0;
    if (!isCurrent && !isSelected && (connectionCount <= 1 || connectionCount >= 3)) {
      continue;
    }

    const screen = projectIso(point, projection);
    ctx.beginPath();
    ctx.fillStyle = isCurrent ? "#f6c45c" : isSelected ? "#d8f1ed" : "#fff";
    ctx.strokeStyle = isSelected ? "#0f766e" : "#1e2a2f";
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.arc(screen.x, screen.y, isCurrent || isSelected ? 5 : 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (state.showDimensions && (connectionCount !== 2 || isCurrent || isSelected)) {
      const label = pointLabel(index);
      ctx.font = "900 10px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(255, 253, 248, 0.96)";
      ctx.fillStyle = isSelected ? "#0f766e" : "#263538";
      ctx.strokeText(label, screen.x, screen.y - 16);
      ctx.fillText(label, screen.x, screen.y - 16);
    }
  }
}

function drawNotes2d(ctx, projection) {
  if (!state.notes.length) return;

  ctx.save();
  ctx.font = "900 12px Inter, system-ui, sans-serif";
  ctx.textBaseline = "middle";

  for (const note of state.notes) {
    const point = projectIso(note.point, projection);
    const text = note.text.trim();
    const metrics = ctx.measureText(text);
    const selected = state.selectedNote === note.id;
    const paddingX = 8;
    const width = metrics.width + paddingX * 2;
    const height = 24;
    const x = point.x + 10;
    const y = point.y - 18;

    ctx.strokeStyle = selected ? "#0f766e" : "rgba(31, 42, 47, 0.28)";
    ctx.fillStyle = selected ? "rgba(216, 241, 237, 0.96)" : "rgba(255, 253, 248, 0.94)";
    ctx.lineWidth = selected ? 2 : 1;
    roundRect(ctx, x, y - height / 2, width, height, 6);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.fillStyle = "#263d45";
    ctx.fillText(text, x + paddingX, y + 1);
  }

  ctx.restore();
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawDimension(ctx, segment, start, end, dimensionLayout = []) {
  if (normalizeDimensionStyle(state.dimensionStyle) === "redline") {
    drawRedCentreDimension(ctx, segment, start, end, dimensionLayout);
    return;
  }

  const midpoint = {
    x: (start.x + end.x) * 0.5,
    y: (start.y + end.y) * 0.5,
  };
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const normal = { x: -Math.sin(angle), y: Math.cos(angle) };
  const text = `C/C ${formatLength(pointLength(segment.vector))} mm`;
  const x = midpoint.x + normal.x * 20;
  const y = midpoint.y + normal.y * 20;

  ctx.save();
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255, 253, 248, 0.92)";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = "#42505a";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawRedCentreDimension(ctx, segment, start, end, dimensionLayout = []) {
  const layoutState = Array.isArray(dimensionLayout)
    ? { labels: dimensionLayout, lines: [], pipes: [] }
    : dimensionLayout;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const screenLength = Math.hypot(dx, dy);
  if (screenLength < 8) return;

  const along = { x: dx / screenLength, y: dy / screenLength };
  const baseNormal = { x: -along.y, y: along.x };
  const pipeGap = 9;
  const tick = 6;
  const text = `${formatLength(pointLength(segment.vector))} mm`;
  const baseOffset = Math.min(64, Math.max(42, screenLength * 0.065));
  let labelAngle = Math.atan2(along.y, along.x);
  if (labelAngle > Math.PI / 2 || labelAngle < -Math.PI / 2) {
    labelAngle += Math.PI;
  }

  ctx.save();
  ctx.font = "900 13px Inter, system-ui, sans-serif";
  const metrics = ctx.measureText(text);
  const labelWidth = metrics.width + 20;
  const labelHeight = 23;
  const layout = redDimensionLayout(start, end, baseNormal, baseOffset, pipeGap, labelWidth, labelHeight, labelAngle, layoutState, segment.index);
  const { lineStart, lineEnd, midpoint, normal } = layout;
  const { extensionStart, extensionEnd } = layout;

  ctx.shadowColor = "rgba(31, 42, 47, 0.12)";
  ctx.shadowBlur = 2;
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";

  for (const stroke of [
    { color: "rgba(255, 253, 248, 0.9)", width: 5 },
    { color: "#c1121f", width: 2 },
  ]) {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    drawLine(ctx, lineStart, lineEnd);
    drawLine(ctx, extensionStart, lineStart);
    drawLine(ctx, extensionEnd, lineEnd);
    for (const point of [lineStart, lineEnd]) {
      drawLine(
        ctx,
        { x: point.x + normal.x * tick + along.x * -tick, y: point.y + normal.y * tick + along.y * -tick },
        { x: point.x + normal.x * -tick + along.x * tick, y: point.y + normal.y * -tick + along.y * tick },
      );
    }
  }

  ctx.shadowColor = "transparent";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.translate(midpoint.x, midpoint.y);
  ctx.rotate(labelAngle);
  roundRect(ctx, -labelWidth * 0.5, -labelHeight * 0.5, labelWidth, labelHeight, 6);
  ctx.fillStyle = "rgba(255, 253, 248, 0.96)";
  ctx.fill();
  ctx.strokeStyle = "rgba(193, 18, 31, 0.28)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#c1121f";
  ctx.fillText(text, 0, 0.5);
  layoutState.labels.push(layout.bounds);
  layoutState.lines.push(...layout.lines);
  ctx.restore();
}

function redDimensionLayout(start, end, baseNormal, baseOffset, pipeGap, labelWidth, labelHeight, labelAngle, dimensionLayout, segmentIndex) {
  const midpointBase = {
    x: (start.x + end.x) * 0.5,
    y: (start.y + end.y) * 0.5,
  };
  const labels = Array.isArray(dimensionLayout) ? dimensionLayout : dimensionLayout.labels ?? [];
  const existingLines = Array.isArray(dimensionLayout) ? [] : dimensionLayout.lines ?? [];
  const pipes = Array.isArray(dimensionLayout) ? [] : dimensionLayout.pipes ?? [];
  let best = null;

  for (let level = 0; level < 12; level += 1) {
    const offset = baseOffset + level * 38;
    for (const [sideIndex, side] of [1, -1].entries()) {
      const normal = { x: baseNormal.x * side, y: baseNormal.y * side };
      const lineStart = { x: start.x + normal.x * offset, y: start.y + normal.y * offset };
      const lineEnd = { x: end.x + normal.x * offset, y: end.y + normal.y * offset };
      const extensionStart = { x: start.x + normal.x * pipeGap, y: start.y + normal.y * pipeGap };
      const extensionEnd = { x: end.x + normal.x * pipeGap, y: end.y + normal.y * pipeGap };
      const candidateLines = [
        { start: lineStart, end: lineEnd },
        { start: extensionStart, end: lineStart },
        { start: extensionEnd, end: lineEnd },
      ];
      const midpoint = {
        x: midpointBase.x + normal.x * offset,
        y: midpointBase.y + normal.y * offset,
      };
      const bounds = rotatedLabelBounds(midpoint, labelWidth, labelHeight, labelAngle, 12);
      const overlapArea = labels.reduce((sum, existing) => sum + boundsOverlapArea(bounds, existing), 0);
      const labelPipePenalty = pipes.reduce((sum, pipe) => {
        if (pipe.index === segmentIndex) return sum;
        if (segmentIntersectsBounds(pipe.start, pipe.end, bounds)) return sum + 18000;
        const clearance = Math.hypot(labelWidth, labelHeight) * 0.5 + 18;
        const distance = distancePointToSegment(midpoint, pipe.start, pipe.end);
        return distance < clearance ? sum + Math.pow(clearance - distance, 2) : sum;
      }, 0);
      const linePipePenalty = candidateLines.reduce((sum, line) => sum + pipes.reduce((pipeSum, pipe) => {
        if (pipe.index === segmentIndex) return pipeSum;
        if (segmentsIntersect(line.start, line.end, pipe.start, pipe.end)) return pipeSum + 14000;
        const clearance = 14;
        const distance = distanceSegmentToSegment(line.start, line.end, pipe.start, pipe.end);
        return distance < clearance ? pipeSum + Math.pow(clearance - distance, 2) * 12 : pipeSum;
      }, 0), 0);
      const dimensionLinePenalty = candidateLines.reduce((sum, line) => sum + existingLines.reduce((lineSum, existing) => {
        if (segmentsIntersect(line.start, line.end, existing.start, existing.end)) return lineSum + 1600;
        const clearance = 8;
        const distance = distanceSegmentToSegment(line.start, line.end, existing.start, existing.end);
        return distance < clearance ? lineSum + Math.pow(clearance - distance, 2) * 3 : lineSum;
      }, 0), 0);
      const score = overlapArea * 90 + labelPipePenalty * 4 + linePipePenalty + dimensionLinePenalty + level * 10 + sideIndex * 2;
      const candidate = {
        lineStart,
        lineEnd,
        extensionStart,
        extensionEnd,
        midpoint,
        normal,
        bounds,
        lines: candidateLines,
        score,
      };

      if (overlapArea === 0 && labelPipePenalty === 0 && linePipePenalty === 0 && dimensionLinePenalty === 0) {
        return candidate;
      }
      if (!best || score < best.score) {
        best = candidate;
      }
    }
  }

  return best;
}

function rotatedLabelBounds(center, width, height, angle, padding = 0) {
  const cos = Math.abs(Math.cos(angle));
  const sin = Math.abs(Math.sin(angle));
  const halfWidth = (width * cos + height * sin) * 0.5 + padding;
  const halfHeight = (width * sin + height * cos) * 0.5 + padding;
  return {
    left: center.x - halfWidth,
    right: center.x + halfWidth,
    top: center.y - halfHeight,
    bottom: center.y + halfHeight,
  };
}

function boundsOverlap(first, second) {
  return first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top;
}

function boundsOverlapArea(first, second) {
  const width = Math.max(0, Math.min(first.right, second.right) - Math.max(first.left, second.left));
  const height = Math.max(0, Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top));
  return width * height;
}

function segmentIntersectsBounds(start, end, bounds) {
  if (pointInBounds(start, bounds) || pointInBounds(end, bounds)) return true;

  const corners = [
    { x: bounds.left, y: bounds.top },
    { x: bounds.right, y: bounds.top },
    { x: bounds.right, y: bounds.bottom },
    { x: bounds.left, y: bounds.bottom },
  ];

  for (let index = 0; index < corners.length; index += 1) {
    const next = corners[(index + 1) % corners.length];
    if (segmentsIntersect(start, end, corners[index], next)) return true;
  }
  return false;
}

function pointInBounds(point, bounds) {
  return point.x >= bounds.left && point.x <= bounds.right && point.y >= bounds.top && point.y <= bounds.bottom;
}

function segmentsIntersect(a, b, c, d) {
  const o1 = segmentOrientation(a, b, c);
  const o2 = segmentOrientation(a, b, d);
  const o3 = segmentOrientation(c, d, a);
  const o4 = segmentOrientation(c, d, b);

  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && pointOnSegment(a, c, b)) return true;
  if (o2 === 0 && pointOnSegment(a, d, b)) return true;
  if (o3 === 0 && pointOnSegment(c, a, d)) return true;
  if (o4 === 0 && pointOnSegment(c, b, d)) return true;
  return false;
}

function segmentOrientation(a, b, c) {
  const value = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
  if (Math.abs(value) < 0.001) return 0;
  return value > 0 ? 1 : 2;
}

function pointOnSegment(a, point, b) {
  return (
    point.x <= Math.max(a.x, b.x) + 0.001 &&
    point.x >= Math.min(a.x, b.x) - 0.001 &&
    point.y <= Math.max(a.y, b.y) + 0.001 &&
    point.y >= Math.min(a.y, b.y) - 0.001
  );
}

function distancePointToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy || 1;
  const t = clampNumber(((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared, 0, 1);
  const closest = {
    x: start.x + dx * t,
    y: start.y + dy * t,
  };
  return Math.hypot(point.x - closest.x, point.y - closest.y);
}

function distanceSegmentToSegment(firstStart, firstEnd, secondStart, secondEnd) {
  if (segmentsIntersect(firstStart, firstEnd, secondStart, secondEnd)) return 0;
  return Math.min(
    distancePointToSegment(firstStart, secondStart, secondEnd),
    distancePointToSegment(firstEnd, secondStart, secondEnd),
    distancePointToSegment(secondStart, firstStart, firstEnd),
    distancePointToSegment(secondEnd, firstStart, firstEnd),
  );
}

function drawBendAngles(ctx, projection) {
  const segmentData = segments();
  const connections = nodeConnections(segmentData);

  ctx.save();
  ctx.font = "900 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const [nodeIndex, connected] of connections.entries()) {
    if (connected.length !== 2) continue;

    const first = subtractPoints(state.points[connected[0].other], state.points[nodeIndex]);
    const second = subtractPoints(state.points[connected[1].other], state.points[nodeIndex]);
    const angle = bendAngle(first, second);
    const bend = Math.abs(180 - angle);
    if (bend < 0.5) continue;

    const joint = projectIso(state.points[nodeIndex], projection);
    const firstScreen = projectIso(state.points[connected[0].other], projection);
    const secondScreen = projectIso(state.points[connected[1].other], projection);
    const away = normalizeScreenVector({
      x: (firstScreen.x - joint.x) + (secondScreen.x - joint.x),
      y: (firstScreen.y - joint.y) + (secondScreen.y - joint.y),
    });
    const label = `${formatAngle(bend)} deg`;
    const x = joint.x + away.x * 34;
    const y = joint.y + away.y * 34;

    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(255, 253, 248, 0.95)";
    ctx.strokeText(label, x, y);
    ctx.fillStyle = "#7b3f2e";
    ctx.fillText(label, x, y);
  }

  ctx.restore();
}

function bendAngle(previous, next) {
  const a = normalizePoint(previous);
  const b = normalizePoint(next);
  const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
  return Math.acos(dot) * 180 / Math.PI;
}

function normalizeScreenVector(vector) {
  const length = Math.hypot(vector.x, vector.y) || 1;
  return { x: vector.x / length, y: vector.y / length };
}

function drawFitting2d(ctx, projection, fitting, segment, pipeWidth) {
  const start = projectIso(segment.start, projection);
  const end = projectIso(segment.end, projection);
  const point = projectIso(lerpPoint(segment.start, segment.end, fitting.t), projection);
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const along = { x: Math.cos(angle), y: Math.sin(angle) };
  const normal = { x: -Math.sin(angle), y: Math.cos(angle) };
  const selected = state.selectedFitting === fitting.id;
  const fittingWidth = Math.max(14, pipeWidth * 2.8);

  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = selected ? "#b42318" : fittingColor(fitting.type);
  ctx.fillStyle = selected ? "#fff1ee" : fittingFill(fitting.type);
  ctx.lineWidth = 3;

  if (fitting.type === "flange") {
    const offsets = fittingFlangeMode(fitting) === "single" ? [0] : [-6, 6];
    for (const offset of offsets) {
      ctx.beginPath();
      ctx.moveTo(along.x * offset + normal.x * fittingWidth * -0.78, along.y * offset + normal.y * fittingWidth * -0.78);
      ctx.lineTo(along.x * offset + normal.x * fittingWidth * 0.78, along.y * offset + normal.y * fittingWidth * 0.78);
      ctx.stroke();
    }
    ctx.fillStyle = selected ? "#b42318" : "#2f3a3d";
    for (const offset of offsets) {
      for (const side of [-0.48, 0.48]) {
        ctx.beginPath();
        ctx.arc(along.x * offset + normal.x * fittingWidth * side, along.y * offset + normal.y * fittingWidth * side, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (fitting.type === "valve") {
    ctx.beginPath();
    ctx.moveTo(along.x * -11, along.y * -11);
    ctx.lineTo(normal.x * 13, normal.y * 13);
    ctx.lineTo(along.x * 11, along.y * 11);
    ctx.lineTo(normal.x * -13, normal.y * -13);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(normal.x * -2, normal.y * -2);
    ctx.lineTo(normal.x * -2 + 0, normal.y * -2 - 18);
    ctx.stroke();
  } else if (fitting.type === "weld") {
    for (const offset of [-3, 3]) {
      ctx.beginPath();
      ctx.moveTo(along.x * offset + normal.x * fittingWidth * -0.58, along.y * offset + normal.y * fittingWidth * -0.58);
      ctx.lineTo(along.x * offset + normal.x * fittingWidth * 0.58, along.y * offset + normal.y * fittingWidth * 0.58);
      ctx.stroke();
    }
  } else if (fitting.type === "reducer") {
    ctx.beginPath();
    ctx.moveTo(along.x * -12 + normal.x * fittingWidth * -0.6, along.y * -12 + normal.y * fittingWidth * -0.6);
    ctx.lineTo(along.x * 12 + normal.x * fittingWidth * -0.32, along.y * 12 + normal.y * fittingWidth * -0.32);
    ctx.lineTo(along.x * 12 + normal.x * fittingWidth * 0.32, along.y * 12 + normal.y * fittingWidth * 0.32);
    ctx.lineTo(along.x * -12 + normal.x * fittingWidth * 0.6, along.y * -12 + normal.y * fittingWidth * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function fittingColor(type) {
  if (type === "valve") return "#d99a23";
  if (type === "weld") return "#2563eb";
  if (type === "reducer") return "#7a4dc2";
  return "#3f484b";
}

function fittingFill(type) {
  if (type === "valve") return "#fff4cf";
  if (type === "weld") return "#eff6ff";
  if (type === "reducer") return "#f1ebff";
  return "#eef2f0";
}

function drawPreviewRun(ctx, projection) {
  if (!state.previewCandidate || state.activeTool !== "draw") {
    return;
  }

  const start = projectIso(activePoint(), projection);
  const end = projectIso(state.previewCandidate.point, projection);

  ctx.save();
  ctx.setLineDash([8, 8]);
  ctx.lineCap = "round";
  ctx.lineWidth = Math.max(6, visualPipeWidth() * 0.82);
  ctx.strokeStyle = "rgba(185, 84, 54, 0.74)";
  drawLine(ctx, start, end);
  ctx.setLineDash([]);
  ctx.fillStyle = "#b95436";
  ctx.beginPath();
  ctx.arc(end.x, end.y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawLine(ctx, from, to) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

function formatLength(value) {
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return text.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatMass(value) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatPoint(point) {
  return `X ${formatLength(point.x)} mm, Y ${formatLength(point.y)} mm, Z ${formatLength(point.z)} mm`;
}

function formatPointCompact(point) {
  return `X ${formatLength(point.x)} / Y ${formatLength(point.y)} / Z ${formatLength(point.z)}`;
}

function pointLabel(index) {
  let value = Math.max(0, Number(index) || 0);
  let label = "";
  do {
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26) - 1;
  } while (value >= 0);
  return label;
}

function formatAngle(value) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function visualPipeWidth(segment = null) {
  const od = (segment ? pipeSizeForSegment(segment) : selectedPipeSize()).od;
  return Math.max(9, Math.min(34, 6 + Math.sqrt(od) * 1.35));
}

function pipeRadiusMetres(segment = null) {
  const od = (segment ? pipeSizeForSegment(segment) : selectedPipeSize()).od;
  const maxOd = PIPE_SIZES[PIPE_SIZES.length - 1].od;
  return 0.055 + (od / maxOd) * 0.255;
}

function toModelUnits(point) {
  return {
    x: point.x / 1000,
    y: point.y / 1000,
    z: point.z / 1000,
  };
}

function pointerPosition(event, canvas = drawCanvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function unprojectIsoGround(pointer) {
  return unprojectIsoAtZ(pointer, 0, true);
}

function unprojectIsoAtZ(pointer, z = 0, snap = false) {
  const projection = getProjection();
  const rawX = pointer.x - projection.offsetX;
  const rawY = pointer.y - projection.offsetY;
  const u = rawX / (ISO_COS * state.gridScale);
  const v = (rawY + (z / MM_PER_GRID) * state.gridScale) / (ISO_SIN * state.gridScale);
  const point = {
    x: (u + v) * 0.5 * MM_PER_GRID,
    y: (v - u) * 0.5 * MM_PER_GRID,
    z: 0,
  };
  point.z = z;
  if (!snap) {
    point.x = Math.round(point.x);
    point.y = Math.round(point.y);
    return point;
  }
  return {
    x: Math.round(point.x / LENGTH_INCREMENT_MM) * LENGTH_INCREMENT_MM,
    y: Math.round(point.y / LENGTH_INCREMENT_MM) * LENGTH_INCREMENT_MM,
    z,
  };
}

function getSnappedCandidate(pointer) {
  const start = activePoint();
  const startScreen = projectIso(start);
  const delta = {
    x: pointer.x - startScreen.x,
    y: pointer.y - startScreen.y,
  };
  const distance = Math.hypot(delta.x, delta.y);

  if (distance < 10) {
    const axis = axisByKey.get("xp");
    return {
      point: addPoints(start, axis.vector, state.stepLength),
      axis,
      length: state.stepLength,
    };
  }

  let best = null;
  for (const axis of AXES) {
    const axisScreen = projectIso(addPoints(start, axis.vector));
    const projected = {
      x: axisScreen.x - startScreen.x,
      y: axisScreen.y - startScreen.y,
    };
    const axisLength = Math.hypot(projected.x, projected.y) || 1;
    const unit = {
      x: projected.x / axisLength,
      y: projected.y / axisLength,
    };
    const score = delta.x * unit.x + delta.y * unit.y;
    if (!best || score > best.score) {
      best = { axis, score };
    }
  }

  if (!best) {
    return null;
  }

  const length = normalizeLength((best.score / state.gridScale) * MM_PER_GRID);
  const point = addPoints(start, best.axis.vector, length);
  return {
    point,
    axis: best.axis,
    length,
  };
}

function findNearestSegment(pointer) {
  let nearest = null;
  for (const segment of segments()) {
    const projection = getProjection();
    const start = projectIso(segment.start, projection);
    const end = projectIso(segment.end, projection);
    const hit = distanceToSegment(pointer, start, end);
    if (!nearest || hit.distance < nearest.distance) {
      nearest = { segment, distance: hit.distance, t: hit.t };
    }
  }

  return nearest && nearest.distance <= 18 ? nearest : null;
}

function findNearestPoint(pointer) {
  const projection = getProjection();
  let nearest = null;
  for (const [index, point] of state.points.entries()) {
    const screen = projectIso(point, projection);
    const distance = Math.hypot(pointer.x - screen.x, pointer.y - screen.y);
    if (!nearest || distance < nearest.distance) {
      nearest = { index, point, distance };
    }
  }
  return nearest && nearest.distance <= 14 ? nearest : null;
}

function findNearestNote(pointer) {
  const projection = getProjection();
  let nearest = null;
  for (const note of state.notes) {
    const screen = projectIso(note.point, projection);
    const labelWidth = Math.max(42, Math.min(280, String(note.text ?? "").length * 7.2 + 16));
    const labelHeight = 24;
    const labelLeft = screen.x + 10;
    const labelTop = screen.y - 18 - labelHeight * 0.5;
    const inLabel =
      pointer.x >= labelLeft - 8 &&
      pointer.x <= labelLeft + labelWidth + 8 &&
      pointer.y >= labelTop - 8 &&
      pointer.y <= labelTop + labelHeight + 8;
    const distance = inLabel
      ? 0
      : Math.hypot(pointer.x - (labelLeft + labelWidth * 0.5), pointer.y - (labelTop + labelHeight * 0.5));
    if (!nearest || distance < nearest.distance) {
      nearest = { note, distance };
    }
  }
  return nearest && nearest.distance <= 38 ? nearest : null;
}

function findNearestFitting(pointer) {
  const projection = getProjection();
  const segmentByIndex = new Map(segments().map((segment) => [segment.index, segment]));
  let nearest = null;

  for (const fitting of state.fittings) {
    const segment = segmentByIndex.get(fitting.segmentIndex);
    if (!segment) continue;

    const point = lerpPoint(segment.start, segment.end, fitting.t);
    const screen = projectIso(point, projection);
    const distance = Math.hypot(pointer.x - screen.x, pointer.y - screen.y);
    if (!nearest || distance < nearest.distance) {
      nearest = {
        fitting,
        segmentHit: { segment, distance, t: fitting.t },
        point,
        distance,
      };
    }
  }

  return nearest && nearest.distance <= 26 ? nearest : null;
}

function distanceToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy || 1;
  const rawT = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared;
  const t = Math.max(0, Math.min(1, rawT));
  const closest = {
    x: start.x + dx * t,
    y: start.y + dy * t,
  };
  return {
    distance: Math.hypot(point.x - closest.x, point.y - closest.y),
    t,
  };
}

function addRun(axis, length) {
  const from = activePointIndex();
  const start = state.points[from];
  const next = addPoints(start, axis.vector, length);
  if (almostSamePoint(start, next)) {
    return;
  }

  const to = state.points.length;
  state.points.push(next);
  state.edges.push({ from, to, pipeSizeNb: state.pipeSizeNb });
  selectSingleSegment(state.edges.length - 1);
  state.selectedFitting = null;
  state.selectedPoint = to;
  state.activePoint = to;
  state.previewCandidate = null;
  state.history.push({ type: "edge", pointIndex: to, edgeIndex: state.edges.length - 1 });
  updateAll();
}

function addAngledRun(direction) {
  const angle = normalizeAngle(state.angleDegrees);
  const radians = angle * Math.PI / 180;
  const sign = direction >= 0 ? 1 : -1;
  let vector;

  if (state.anglePlane === "xz") {
    vector = { x: Math.cos(radians), y: 0, z: Math.sin(radians) * sign };
  } else if (state.anglePlane === "yz") {
    vector = { x: 0, y: Math.cos(radians), z: Math.sin(radians) * sign };
  } else {
    vector = { x: Math.cos(radians), y: Math.sin(radians) * sign, z: 0 };
  }

  addRun({ vector }, state.stepLength);
}

function selectedSegmentData() {
  const selected = selectedSegmentIndexes();
  if (selected.length !== 1) return null;
  return segments().find((segment) => segment.index === selected[0]) ?? null;
}

function selectedFittingData() {
  if (!state.selectedFitting) return null;
  const fitting = state.fittings.find((item) => item.id === state.selectedFitting);
  if (!fitting) return null;

  const segment = segments().find((item) => item.index === fitting.segmentIndex);
  if (!segment) return null;

  return {
    fitting,
    segment,
    point: lerpPoint(segment.start, segment.end, fitting.t),
    weightKg: fittingWeightKg(fitting, segment),
    weightSource: fittingWeightSource(fitting, segment),
  };
}

function setSelectedSegmentLength(length) {
  const segment = selectedSegmentData();
  if (!segment) return;

  const normalizedLength = normalizeLength(length);
  const anchorIndex =
    state.selectedPoint === segment.to ? segment.to :
    state.selectedPoint === segment.from ? segment.from :
    segment.from;
  const targetIndex = anchorIndex === segment.from ? segment.to : segment.from;
  const anchor = state.points[anchorIndex];
  const target = state.points[targetIndex];
  const direction = normalizePoint(subtractPoints(target, anchor));

  translateSegmentSide(segment, anchorIndex, targetIndex, addPoints(anchor, direction, normalizedLength));
  state.activePoint = targetIndex;
  state.selectedPoint = targetIndex;
  updateAll();
}

function editSegmentBendAngle(segment, anchorIndex, bendAngleValue) {
  const reference = referenceConnectionForSegment(segment, anchorIndex);
  if (!reference) return false;

  const targetIndex = anchorIndex === segment.from ? segment.to : segment.from;
  const anchor = state.points[anchorIndex];
  const target = state.points[targetIndex];
  const referenceVector = subtractPoints(state.points[reference.other], anchor);
  const segmentVector = subtractPoints(target, anchor);
  const newDirection = segmentDirectionForBend(referenceVector, segmentVector, normalizeBendAngle(bendAngleValue));
  const newTarget = addPoints(anchor, newDirection, pointLength(segmentVector));

  rotateSegmentSide(segment, anchorIndex, targetIndex, newTarget);
  selectSingleSegment(segment.index);
  state.selectedPoint = targetIndex;
  state.activePoint = targetIndex;
  state.selectedFitting = null;
  state.selectedNote = null;
  updateAll();
  return true;
}

function segmentDirectionForBend(referenceVector, segmentVector, bendAngleValue) {
  const includedRadians = (180 - normalizeBendAngle(bendAngleValue)) * Math.PI / 180;
  const referenceDirection = normalizePoint(referenceVector);
  const segmentDirection = normalizePoint(segmentVector);
  const projected = subtractPoints(segmentDirection, scalePoint(referenceDirection, dotPoints(segmentDirection, referenceDirection)));
  const perpendicular = pointLength(projected) > 0.0001
    ? normalizePoint(projected)
    : fallbackPerpendicular(referenceDirection);

  return normalizePoint(addPoints(
    scalePoint(referenceDirection, Math.cos(includedRadians)),
    scalePoint(perpendicular, Math.sin(includedRadians)),
  ));
}

function fallbackPerpendicular(direction) {
  const abs = {
    x: Math.abs(direction.x),
    y: Math.abs(direction.y),
    z: Math.abs(direction.z),
  };
  const reference = abs.z < 0.9 ? { x: 0, y: 0, z: 1 } : { x: 1, y: 0, z: 0 };
  return normalizePoint(crossPoints(reference, direction));
}

function translateSegmentSide(segment, anchorIndex, targetIndex, newTargetPoint) {
  const delta = subtractPoints(newTargetPoint, state.points[targetIndex]);
  const moving = movablePointIndexes(segment, anchorIndex, targetIndex);
  for (const pointIndex of moving) {
    state.points[pointIndex] = addPoints(state.points[pointIndex], delta);
  }
}

function rotateSegmentSide(segment, anchorIndex, targetIndex, newTargetPoint) {
  const anchor = state.points[anchorIndex];
  const oldVector = subtractPoints(state.points[targetIndex], anchor);
  const newVector = subtractPoints(newTargetPoint, anchor);
  const oldDirection = normalizePoint(oldVector);
  const newDirection = normalizePoint(newVector);
  const axisRaw = crossPoints(oldDirection, newDirection);
  const axisLength = pointLength(axisRaw);

  if (axisLength < 0.0001) {
    translateSegmentSide(segment, anchorIndex, targetIndex, newTargetPoint);
    return;
  }

  const axis = scalePoint(axisRaw, 1 / axisLength);
  const angle = Math.atan2(axisLength, Math.max(-1, Math.min(1, dotPoints(oldDirection, newDirection))));
  const moving = movablePointIndexes(segment, anchorIndex, targetIndex);
  for (const pointIndex of moving) {
    const relative = subtractPoints(state.points[pointIndex], anchor);
    state.points[pointIndex] = addPoints(anchor, rotateVectorAroundAxis(relative, axis, angle));
  }
}

function rotateVectorAroundAxis(vector, axis, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const parallel = scalePoint(axis, dotPoints(axis, vector) * (1 - cos));
  const crossed = scalePoint(crossPoints(axis, vector), sin);
  return addPoints(addPoints(scalePoint(vector, cos), crossed), parallel);
}

function movablePointIndexes(segment, anchorIndex, targetIndex) {
  const moving = new Set([targetIndex]);
  const stack = [targetIndex];

  while (stack.length) {
    const pointIndex = stack.pop();
    for (const [edgeIndex, edge] of state.edges.entries()) {
      if (edgeIndex === segment.index) continue;
      let next = null;
      if (edge.from === pointIndex) next = edge.to;
      if (edge.to === pointIndex) next = edge.from;
      if (next === null || next === anchorIndex || moving.has(next)) continue;
      moving.add(next);
      stack.push(next);
    }
  }

  return moving;
}

function referenceConnectionForSegment(segment, anchorIndex) {
  for (const [edgeIndex, edge] of state.edges.entries()) {
    if (edgeIndex === segment.index) continue;
    if (edge.from === anchorIndex) return { edgeIndex, other: edge.to };
    if (edge.to === anchorIndex) return { edgeIndex, other: edge.from };
  }
  return null;
}

function bendEditAnchorForHit(hit) {
  if (!hit) return null;
  const candidates = [
    { index: hit.segment.from, distance: hit.t },
    { index: hit.segment.to, distance: 1 - hit.t },
  ].filter((candidate) => referenceConnectionForSegment(hit.segment, candidate.index));

  if (!candidates.length) return null;
  candidates.sort((a, b) => a.distance - b.distance);
  return candidates[0].index;
}

function bendAngleForSegmentAt(segment, anchorIndex) {
  const reference = referenceConnectionForSegment(segment, anchorIndex);
  if (!reference) return null;
  const targetIndex = anchorIndex === segment.from ? segment.to : segment.from;
  const first = subtractPoints(state.points[reference.other], state.points[anchorIndex]);
  const second = subtractPoints(state.points[targetIndex], state.points[anchorIndex]);
  return Math.abs(180 - bendAngle(first, second));
}

function takeoffData(segmentData = segments()) {
  const connections = nodeConnections(segmentData);
  const segmentTakeoffs = new Map(segmentData.map((segment) => [segment.index, 0]));
  const elbows = [];
  const reducers = [];
  const tees = [];
  const branches = [];

  for (const [nodeIndex, connected] of connections.entries()) {
    if (connected.length >= 3) {
      const nodeTakeoff = nodeConnectionType(nodeIndex) === "branch"
        ? branchTakeoffForNode(nodeIndex, connected, segmentData)
        : teeTakeoffForNode(nodeIndex, connected, segmentData);
      if (nodeTakeoff) {
        for (const connection of nodeTakeoff.connections) {
          segmentTakeoffs.set(connection.segmentIndex, (segmentTakeoffs.get(connection.segmentIndex) ?? 0) + connection.takeoffMm);
        }
        if (nodeTakeoff.type === "branch") {
          branches.push(nodeTakeoff);
        } else {
          tees.push(nodeTakeoff);
        }
      }
      continue;
    }

    if (connected.length !== 2) continue;

    const firstSegment = segmentData.find((segment) => segment.index === connected[0].segmentIndex);
    const secondSegment = segmentData.find((segment) => segment.index === connected[1].segmentIndex);
    if (!firstSegment || !secondSegment) continue;

    const firstVector = subtractPoints(state.points[connected[0].other], state.points[nodeIndex]);
    const secondVector = subtractPoints(state.points[connected[1].other], state.points[nodeIndex]);
    const bend = Math.abs(180 - bendAngle(firstVector, secondVector));
    if (bend < 0.5) {
      const reducer = autoReducerForConnection(nodeIndex, connected[0], connected[1], firstSegment, secondSegment);
      if (reducer) {
        applyReducerTakeoff(segmentTakeoffs, reducer);
        reducers.push(reducer);
      }
      continue;
    }

    const firstTakeoff = bendTakeoffMm(firstSegment, bend);
    const secondTakeoff = bendTakeoffMm(secondSegment, bend);
    segmentTakeoffs.set(firstSegment.index, (segmentTakeoffs.get(firstSegment.index) ?? 0) + firstTakeoff);
    segmentTakeoffs.set(secondSegment.index, (segmentTakeoffs.get(secondSegment.index) ?? 0) + secondTakeoff);

    const bendSize = largerPipeSize(firstSegment, secondSegment);
    elbows.push({
      nodeIndex,
      bend,
      nb: bendSize.nb,
      takeoffMm: Math.max(firstTakeoff, secondTakeoff),
      firstSegmentIndex: firstSegment.index,
      secondSegmentIndex: secondSegment.index,
      firstTakeoffMm: firstTakeoff,
      secondTakeoffMm: secondTakeoff,
      weightKg: elbowWeightKg(bendSize, bend),
    });
  }

  return { segmentTakeoffs, elbows, reducers, tees, branches };
}

function autoReducerTransitions(segmentData = segments()) {
  const connections = nodeConnections(segmentData);
  const segmentByIndex = new Map(segmentData.map((segment) => [segment.index, segment]));
  const reducers = [];

  for (const [nodeIndex, connected] of connections.entries()) {
    if (connected.length >= 3) {
      continue;
    }

    if (connected.length !== 2) continue;
    const firstSegment = segmentByIndex.get(connected[0].segmentIndex);
    const secondSegment = segmentByIndex.get(connected[1].segmentIndex);
    if (!firstSegment || !secondSegment) continue;

    const firstVector = subtractPoints(state.points[connected[0].other], state.points[nodeIndex]);
    const secondVector = subtractPoints(state.points[connected[1].other], state.points[nodeIndex]);
    const bend = Math.abs(180 - bendAngle(firstVector, secondVector));
    if (bend >= 0.5) continue;

    const reducer = autoReducerForConnection(nodeIndex, connected[0], connected[1], firstSegment, secondSegment);
    if (reducer) reducers.push(reducer);
  }

  return reducers;
}

function applyReducerTakeoff(segmentTakeoffs, reducer) {
  if (!reducer) return;
  if (Number.isInteger(reducer.firstSegmentIndex)) {
    segmentTakeoffs.set(reducer.firstSegmentIndex, (segmentTakeoffs.get(reducer.firstSegmentIndex) ?? 0) + (reducer.firstTakeoffMm ?? 0));
  }
  if (Number.isInteger(reducer.secondSegmentIndex)) {
    segmentTakeoffs.set(reducer.secondSegmentIndex, (segmentTakeoffs.get(reducer.secondSegmentIndex) ?? 0) + (reducer.secondTakeoffMm ?? 0));
  }
}

function teeTakeoffForNode(nodeIndex, connected, segmentData = segments()) {
  const entries = nodeConnectionEntries(nodeIndex, connected, segmentData)
    .map((entry) => ({
      ...entry,
      takeoffMm: Math.min(teeTakeoffMm(entry.size), entry.lengthMm * 0.45),
    }));

  if (entries.length < 3) return null;

  const largestSize = entries
    .map((entry) => entry.size)
    .sort((a, b) => b.od - a.od)[0];
  const smallestSize = entries
    .map((entry) => entry.size)
    .sort((a, b) => a.od - b.od)[0];
  const atlasWeightKg = atlasButtweldWeight(largestSize, "tee");
  const weightKg = atlasWeightKg ?? estimatedTeeWeightKg(largestSize);

  return {
    type: "tee",
    nodeIndex,
    nb: largestSize.nb,
    branchNb: smallestSize.nb,
    reducing: entries.some((entry) => entry.size.nb !== largestSize.nb),
    weightKg,
    source: atlasWeightKg === null ? "estimated" : "Atlas table",
    connections: entries.map((entry) => ({
      segmentIndex: entry.segment.index,
      nb: entry.size.nb,
      takeoffMm: entry.takeoffMm,
    })),
  };
}

function branchTakeoffForNode(nodeIndex, connected, segmentData = segments()) {
  const info = branchNodeInfo(nodeIndex, connected, segmentData);
  if (!info || info.entries.length < 3) return null;

  const branchEntries = info.branchEntries.length ? info.branchEntries : info.entries.slice(2);
  if (!branchEntries.length) return null;

  const connections = branchEntries.map((entry) => ({
    segmentIndex: entry.segment.index,
    nb: entry.size.nb,
    takeoffMm: Math.min(branchTakeoffMm(info.mainSize, entry.size), entry.lengthMm * 0.45),
  }));
  const branchSize = branchEntries
    .map((entry) => entry.size)
    .sort((a, b) => a.od - b.od)[0] ?? info.mainSize;
  const weightKg = branchEntries.reduce((sum, entry) => sum + estimatedBranchWeldWeightKg(info.mainSize, entry.size), 0);

  return {
    type: "branch",
    nodeIndex,
    nb: info.mainSize.nb,
    branchNb: branchSize.nb,
    reducing: branchEntries.some((entry) => entry.size.nb !== info.mainSize.nb),
    weightKg,
    source: "branch weld estimate",
    connections,
  };
}

function nodeConnectionEntries(nodeIndex, connected, segmentData = segments()) {
  const segmentByIndex = new Map(segmentData.map((segment) => [segment.index, segment]));
  return connected
    .map((connection) => {
      const segment = segmentByIndex.get(connection.segmentIndex);
      if (!segment) return null;
      const vector = subtractPoints(state.points[connection.other], state.points[nodeIndex]);
      const lengthMm = pointLength(vector);
      if (lengthMm <= 0.001) return null;
      return {
        ...connection,
        segment,
        size: pipeSizeForSegment(segment),
        vector: normalizePoint(vector),
        lengthMm,
      };
    })
    .filter(Boolean);
}

function branchNodeInfo(nodeIndex, connected, segmentData = segments()) {
  const entries = nodeConnectionEntries(nodeIndex, connected, segmentData);
  if (entries.length < 3) return null;

  const largestOd = Math.max(...entries.map((entry) => entry.size.od));
  const largestEntries = entries.filter((entry) => Math.abs(entry.size.od - largestOd) < 0.001);
  const mainPair = mostOppositeEntryPair(largestEntries.length >= 2 ? largestEntries : entries);
  const mainSegments = new Set(mainPair ? mainPair.map((entry) => entry.segment.index) : []);
  const branchEntries = entries.filter((entry) => !mainSegments.has(entry.segment.index));
  const mainSize = (mainPair?.[0]?.size ?? entries.find((entry) => Math.abs(entry.size.od - largestOd) < 0.001)?.size) ?? pipeSizeByNb(state.pipeSizeNb);

  return {
    entries,
    mainPair,
    mainSegments,
    mainSize,
    branchEntries,
  };
}

function mostOppositeEntryPair(entries) {
  if (entries.length < 2) return null;

  let best = null;
  let bestDot = Infinity;
  for (let i = 0; i < entries.length; i += 1) {
    for (let j = i + 1; j < entries.length; j += 1) {
      const dot = dotPoints(entries[i].vector, entries[j].vector);
      if (dot < bestDot) {
        bestDot = dot;
        best = [entries[i], entries[j]];
      }
    }
  }
  return best;
}

function teeTakeoffMm(size) {
  return TEE_TAKEOFF_MM[size.nb] ?? Math.max(size.od * 0.85, size.lrRadius * 0.68);
}

function branchTakeoffMm(mainSize, branchSize) {
  return Math.max(mainSize.od * 0.5, branchSize.od * 0.35, 25);
}

function estimatedTeeWeightKg(size) {
  const scale = Math.max(0.12, Math.pow(size.od / 60.3, 2));
  return Math.max(0.2, scale * 0.9);
}

function estimatedBranchWeldWeightKg(mainSize, branchSize) {
  const scale = Math.max(0.08, Math.pow(branchSize.od / 60.3, 2));
  const mainScale = Math.max(0.9, mainSize.od / Math.max(branchSize.od, 1));
  return Math.max(0.06, scale * 0.16 * Math.min(mainScale, 1.8));
}

function autoReducerForConnection(nodeIndex, firstConnection, secondConnection, firstSegment, secondSegment) {
  const firstSize = pipeSizeForSegment(firstSegment);
  const secondSize = pipeSizeForSegment(secondSegment);
  if (firstSize.nb === secondSize.nb) return null;

  const lengthMm = reducerLengthMm(firstSize, secondSize);
  const firstTakeoffMm = Math.min(lengthMm * 0.5, pointLength(firstSegment.vector) * 0.45);
  const secondTakeoffMm = Math.min(lengthMm * 0.5, pointLength(secondSegment.vector) * 0.45);
  const firstIsLarge = firstSize.od >= secondSize.od;
  const largeSegment = firstIsLarge ? firstSegment : secondSegment;
  const smallSegment = firstIsLarge ? secondSegment : firstSegment;
  const largeSize = firstIsLarge ? firstSize : secondSize;
  const smallSize = firstIsLarge ? secondSize : firstSize;
  const largeOtherIndex = firstIsLarge ? firstConnection.other : secondConnection.other;
  const smallOtherIndex = firstIsLarge ? secondConnection.other : firstConnection.other;
  const atlasWeightKg = atlasReducerWeightForSizes(largeSize, smallSize);
  const reducerWeightKg = atlasWeightKg ?? (lengthMm / 1000) * ((pipeMassPerMetreForSize(firstSize) + pipeMassPerMetreForSize(secondSize)) * 0.5) * 1.12;

  return {
    nodeIndex,
    firstSegmentIndex: firstSegment.index,
    secondSegmentIndex: secondSegment.index,
    firstTakeoffMm,
    secondTakeoffMm,
    lengthMm,
    weightKg: reducerWeightKg,
    source: atlasWeightKg === null ? "estimated" : "Atlas table",
    largeNb: largeSize.nb,
    smallNb: smallSize.nb,
    largeSegment,
    smallSegment,
    largeOtherIndex,
    smallOtherIndex,
  };
}

function atlasReducerWeightForSizes(largeSize, smallSize) {
  if (!largeSize || !smallSize) return null;
  return atlasButtweldWeight(largeSize, "reducer");
}

function reducerLengthMm(firstSize, secondSize) {
  const largeOd = Math.max(firstSize.od, secondSize.od);
  const difference = Math.abs(firstSize.od - secondSize.od);
  return clampNumber(largeOd * 2.4 + difference * 0.8, 100, 450);
}

function bendTakeoffMm(segment, bendDegrees) {
  const size = pipeSizeForSegment(segment);
  return size.lrRadius * Math.tan((normalizeBendAngle(bendDegrees) * Math.PI / 180) / 2);
}

function largerPipeSize(firstSegment, secondSegment) {
  const first = pipeSizeForSegment(firstSegment);
  const second = pipeSizeForSegment(secondSegment);
  return first.od >= second.od ? first : second;
}

function elbowWeightKg(size, bendDegrees) {
  const table = atlasButtweldWeight(size, "elbow90");
  if (table !== null) {
    return table * (normalizeBendAngle(bendDegrees) / 90);
  }
  const bendRadians = normalizeBendAngle(bendDegrees) * Math.PI / 180;
  return pipeMassPerMetreForSize(size) * (size.lrRadius / 1000) * bendRadians;
}

function segmentQuantity(segment, takeoffs = takeoffData(segments()).segmentTakeoffs) {
  const centrelineMm = pointLength(segment.vector);
  const bendTakeoffMmTotal = takeoffs.get(segment.index) ?? 0;
  const cutLengthMm = Math.max(0, centrelineMm - bendTakeoffMmTotal);
  const pipeWeightKg = (cutLengthMm / 1000) * pipeMassPerMetre(segment);
  return {
    centrelineMm,
    bendTakeoffMm: bendTakeoffMmTotal,
    cutLengthMm,
    pipeWeightKg,
  };
}

function fittingWeightOverride(fitting) {
  const weightKg = Number(fitting?.weightKg);
  return Number.isFinite(weightKg) && weightKg >= 0 ? weightKg : null;
}

function fittingWeightSource(fitting, segment = null) {
  if (fittingWeightOverride(fitting) !== null) return "manual";
  return atlasFittingWeightKg(fitting, segment) === null ? "estimated" : "Atlas table";
}

function fittingWeightKg(fitting, segment) {
  return fittingWeightOverride(fitting) ?? atlasFittingWeightKg(fitting, segment) ?? estimatedFittingWeightKg(fitting, segment);
}

function atlasSpecKey() {
  return normalizePipeSpec(state.pipeSpec);
}

function atlasButtweldWeight(size, key) {
  const table = ATLAS_BUTTWELD_WEIGHTS[atlasSpecKey()] ?? {};
  const weight = table[size.nb]?.[key];
  return Number.isFinite(weight) ? weight : null;
}

function atlasFittingWeightKg(fitting, segment) {
  if (!fitting || !segment) return null;
  const size = pipeSizeForSegment(segment);

  if (fitting.type === "flange") {
    const single = ATLAS_FLANGE_WEIGHTS[size.nb];
    if (!Number.isFinite(single)) return null;
    return fittingFlangeMode(fitting) === "single" ? single : single * 2;
  }

  if (fitting.type === "reducer") {
    return atlasButtweldWeight(size, "reducer");
  }

  if (fitting.type === "tee") {
    return atlasButtweldWeight(size, "tee");
  }

  return null;
}

function estimatedFittingWeightKg(fitting, segment) {
  const size = pipeSizeForSegment(segment);
  const scale = Math.max(0.12, Math.pow(size.od / 60.3, 2));

  if (fitting.type === "flange") {
    const single = Math.max(0.4, scale * 2.2);
    return fittingFlangeMode(fitting) === "single" ? single : single * 2.12;
  }
  if (fitting.type === "valve") return Math.max(0.6, scale * 5.6);
  if (fitting.type === "weld") return Math.max(0.05, scale * 0.12);
  if (fitting.type === "reducer") return Math.max(0.25, scale * 1.35);
  return 0;
}

function fittingQuantities(segmentData = segments()) {
  const segmentByIndex = new Map(segmentData.map((segment) => [segment.index, segment]));
  return state.fittings
    .map((fitting) => {
      const segment = segmentByIndex.get(fitting.segmentIndex);
      if (!segment) return null;
      return {
        fitting,
        segment,
        point: lerpPoint(segment.start, segment.end, fitting.t),
        weightKg: fittingWeightKg(fitting, segment),
        weightSource: fittingWeightSource(fitting, segment),
      };
    })
    .filter(Boolean);
}

function quantitySummary(segmentData = segments()) {
  const data = takeoffData(segmentData);
  const segmentsWithQuantity = segmentData.map((segment) => ({
    segment,
    quantity: segmentQuantity(segment, data.segmentTakeoffs),
  }));
  const centrelineMm = segmentsWithQuantity.reduce((sum, item) => sum + item.quantity.centrelineMm, 0);
  const cutLengthMm = segmentsWithQuantity.reduce((sum, item) => sum + item.quantity.cutLengthMm, 0);
  const bendTakeoffMm = segmentsWithQuantity.reduce((sum, item) => sum + item.quantity.bendTakeoffMm, 0);
  const pipeWeightKg = segmentsWithQuantity.reduce((sum, item) => sum + item.quantity.pipeWeightKg, 0);
  const bendWeightKg = data.elbows.reduce((sum, elbow) => sum + elbow.weightKg, 0);
  const reducerWeightKg = data.reducers.reduce((sum, reducer) => sum + reducer.weightKg, 0);
  const teeWeightKg = data.tees.reduce((sum, tee) => sum + tee.weightKg, 0);
  const branchWeightKg = data.branches.reduce((sum, branch) => sum + branch.weightKg, 0);
  const fittings = fittingQuantities(segmentData);
  const fittingWeightKg = fittings.reduce((sum, fitting) => sum + fitting.weightKg, 0);

  return {
    segments: segmentsWithQuantity,
    elbows: data.elbows,
    reducers: data.reducers,
    tees: data.tees,
    branches: data.branches,
    fittings,
    centrelineMm,
    cutLengthMm,
    bendTakeoffMm,
    pipeWeightKg,
    bendWeightKg,
    reducerWeightKg,
    teeWeightKg,
    branchWeightKg,
    fittingWeightKg,
    totalWeightKg: pipeWeightKg + bendWeightKg + reducerWeightKg + teeWeightKg + branchWeightKg + fittingWeightKg,
  };
}

function centreOfGravityData(quantities = quantitySummary()) {
  const components = [];
  const addComponent = (weightKg, point, type) => {
    if (!Number.isFinite(weightKg) || weightKg <= 0 || !point) return;
    components.push({
      weightKg,
      point: clonePoint(point),
      type,
    });
  };

  for (const { segment, quantity } of quantities.segments) {
    addComponent(quantity.pipeWeightKg, lerpPoint(segment.start, segment.end, 0.5), "pipe");
  }

  for (const elbow of quantities.elbows) {
    addComponent(elbow.weightKg, state.points[elbow.nodeIndex], "elbow");
  }

  for (const reducer of quantities.reducers) {
    addComponent(reducer.weightKg, reducerCentrePoint(reducer), "reducer");
  }

  for (const tee of quantities.tees) {
    addComponent(tee.weightKg, state.points[tee.nodeIndex], "tee");
  }

  for (const branch of quantities.branches) {
    addComponent(branch.weightKg, state.points[branch.nodeIndex], "branch");
  }

  for (const fitting of quantities.fittings) {
    addComponent(fitting.weightKg, fitting.point, fitting.fitting.type);
  }

  const totalWeightKg = components.reduce((sum, component) => sum + component.weightKg, 0);
  if (totalWeightKg <= 0) return null;

  const weighted = components.reduce((sum, component) => ({
    x: sum.x + component.point.x * component.weightKg,
    y: sum.y + component.point.y * component.weightKg,
    z: sum.z + component.point.z * component.weightKg,
  }), { x: 0, y: 0, z: 0 });

  return {
    point: {
      x: weighted.x / totalWeightKg,
      y: weighted.y / totalWeightKg,
      z: weighted.z / totalWeightKg,
    },
    totalWeightKg,
    components,
  };
}

function reducerCentrePoint(reducer) {
  const joint = state.points[reducer.nodeIndex];
  const smallOther = state.points[reducer.smallOtherIndex];
  if (!joint || !smallOther || reducer.kind !== "tee") return joint;

  const direction = normalizePoint(subtractPoints(smallOther, joint));
  const distance = Math.min((reducer.lengthMm ?? 0) * 0.5, pointLength(subtractPoints(smallOther, joint)) * 0.45);
  return addPoints(joint, direction, distance);
}

function centreOfGravityReferenceData(quantities = quantitySummary(), liftPoint = centreOfGravityData(quantities)) {
  if (!liftPoint) return null;

  const references = [];
  const segmentByIndex = new Map(quantities.segments.map(({ segment }) => [segment.index, segment]));
  for (const [index, elbow] of quantities.elbows.entries()) {
    const point = state.points[elbow.nodeIndex];
    if (point) {
      references.push({
        label: `Bend ${index + 1}`,
        type: "bend",
        point,
        nodeIndex: elbow.nodeIndex,
        firstSegment: segmentByIndex.get(elbow.firstSegmentIndex),
        secondSegment: segmentByIndex.get(elbow.secondSegmentIndex),
      });
    }
  }

  const connections = nodeConnections(quantities.segments.map(({ segment }) => segment));
  let teeIndex = 0;
  let branchIndex = 0;
  for (const [nodeIndex, connected] of connections.entries()) {
    if (connected.length < 3) continue;
    const point = state.points[nodeIndex];
    if (!point) continue;
    const connectionType = nodeConnectionType(nodeIndex);
    if (connectionType === "branch") branchIndex += 1;
    else teeIndex += 1;
    references.push({
      label: connectionType === "branch" ? `Branch ${branchIndex}` : `Tee ${teeIndex}`,
      type: connectionType,
      point,
    });
  }

  if (!references.length) return null;

  const reference = references
    .map((reference) => ({
      ...reference,
      distanceMm: pointLength(subtractPoints(liftPoint.point, reference.point)),
    }))
    .sort((a, b) => a.distanceMm - b.distanceMm)[0];

  if (reference.type === "bend") {
    reference.offsetsMm = bendReferenceOffsets(reference, liftPoint.point);
  }
  return reference;
}

function bendReferenceOffsets(reference, liftPoint) {
  if (!reference.firstSegment || !reference.secondSegment || !state.points[reference.nodeIndex]) return null;

  const bendPoint = state.points[reference.nodeIndex];
  const firstOther = reference.firstSegment.from === reference.nodeIndex ? reference.firstSegment.to : reference.firstSegment.from;
  const secondOther = reference.secondSegment.from === reference.nodeIndex ? reference.secondSegment.to : reference.secondSegment.from;
  const firstDirection = normalizePoint(subtractPoints(state.points[firstOther], bendPoint));
  const secondDirection = normalizePoint(subtractPoints(state.points[secondOther], bendPoint));
  const relative = subtractPoints(liftPoint, bendPoint);
  const cross = pointLength(crossPoints(firstDirection, secondDirection));
  if (cross < 0.001) return null;

  const dot = dotPoints(firstDirection, secondDirection);
  const firstProjection = dotPoints(relative, firstDirection);
  const secondProjection = dotPoints(relative, secondDirection);
  const denominator = 1 - dot * dot;
  if (Math.abs(denominator) < 0.001) return null;

  return [
    Math.abs((firstProjection - dot * secondProjection) / denominator),
    Math.abs((secondProjection - dot * firstProjection) / denominator),
  ];
}

function centreOfGravityReferenceText(quantities = quantitySummary(), liftPoint = centreOfGravityData(quantities)) {
  const reference = centreOfGravityReferenceData(quantities, liftPoint);
  if (!reference) {
    return liftPoint ? formatPointCompact(liftPoint.point) : "No lift point";
  }
  if (reference.type === "bend" && reference.offsetsMm) {
    const [firstOffset, secondOffset] = reference.offsetsMm;
    if (Math.abs(firstOffset - secondOffset) < 5) {
      return `COG ${formatLength(firstOffset)} mm along each leg from ${reference.label}`;
    }
    return `COG ${formatLength(firstOffset)} / ${formatLength(secondOffset)} mm along legs from ${reference.label}`;
  }
  return `COG ${formatLength(reference.distanceMm)} mm from ${reference.label}`;
}

function centreOfGravityReferenceLines(quantities = quantitySummary(), liftPoint = centreOfGravityData(quantities)) {
  const reference = centreOfGravityReferenceData(quantities, liftPoint);
  if (!reference) return ["COG"];

  if (reference.type === "bend" && reference.offsetsMm) {
    const [firstOffset, secondOffset] = reference.offsetsMm;
    if (Math.abs(firstOffset - secondOffset) < 5) {
      return [`COG ${formatLength(firstOffset)} mm`, `each leg from ${reference.label}`];
    }
    return [`COG ${formatLength(firstOffset)} / ${formatLength(secondOffset)} mm`, `from ${reference.label} legs`];
  }

  return [`COG ${formatLength(reference.distanceMm)} mm`, `from ${reference.label}`];
}

function suggestedLugPlan(quantities = quantitySummary(), liftPoint = centreOfGravityData(quantities)) {
  if (!liftPoint || !quantities.segments.length) return null;

  const segmentEntries = quantities.segments
    .filter(({ segment, quantity }) => quantity.pipeWeightKg > 0 && pointLength(segment.vector) > 200);
  if (!segmentEntries.length) return null;

  const span = spoolSpanMm(segmentEntries.map(({ segment }) => segment));
  const candidates = [];
  for (const { segment } of segmentEntries) {
    const length = pointLength(segment.vector);
    const clearance = clampNumber(300 / length, 0.08, 0.28);
    const steps = 20;
    for (let index = 0; index <= steps; index += 1) {
      const t = clearance + ((1 - clearance * 2) * index) / steps;
      const point = lerpPoint(segment.start, segment.end, t);
      candidates.push({ segment, t, point });
    }
  }

  if (candidates.length < 2) return null;

  const minSeparation = Math.min(Math.max(600, span * 0.12), Math.max(600, span * 0.7));
  const targetSeparation = clampNumber(span * 0.45, 900, 4500);
  let best = null;

  for (let firstIndex = 0; firstIndex < candidates.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < candidates.length; secondIndex += 1) {
      const first = candidates[firstIndex];
      const second = candidates[secondIndex];
      const separationMm = pointLength(subtractPoints(first.point, second.point));
      if (separationMm < minSeparation) continue;

      const midpoint = midpointPoint(first.point, second.point);
      const midpointErrorMm = pointLength(subtractPoints(midpoint, liftPoint.point));
      const loadSplit = liftingPointLoadSplit(first.point, second.point, liftPoint.point, liftPoint.totalWeightKg);
      const firstFromCog = subtractPoints(first.point, liftPoint.point);
      const secondFromCog = subtractPoints(second.point, liftPoint.point);
      const sameSidePenalty = dotPoints(firstFromCog, secondFromCog) > 0 ? span * 0.4 : 0;
      const separationPenalty = Math.abs(separationMm - targetSeparation) * 0.12;
      const outsidePenalty = loadSplit.withinSpan ? 0 : span * 2;
      const imbalancePenalty = liftPoint.totalWeightKg > 0
        ? (Math.abs(loadSplit.firstLoadKg - loadSplit.secondLoadKg) / liftPoint.totalWeightKg) * span * 0.18
        : 0;
      const score = midpointErrorMm * 1.4 + loadSplit.offLineErrorMm * 2.2 + sameSidePenalty + separationPenalty + imbalancePenalty + outsidePenalty;

      if (!best || score < best.score) {
        best = {
          score,
          midpoint,
          midpointErrorMm,
          separationMm,
          loadSplit,
          points: [first, second],
        };
      }
    }
  }

  if (!best) return null;

  best.points = best.points
    .map((point, index) => ({
      ...point,
      number: index + 1,
      distanceFromRunStartMm: pointLength(subtractPoints(point.point, point.segment.start)),
    }))
    .sort((a, b) => a.segment.index - b.segment.index || a.t - b.t)
    .map((point, index) => ({ ...point, number: index + 1 }));

  const loadSplit = liftingPointLoadSplit(best.points[0].point, best.points[1].point, liftPoint.point, liftPoint.totalWeightKg);
  best.loadSplit = loadSplit;
  best.midpoint = midpointPoint(best.points[0].point, best.points[1].point);
  best.midpointErrorMm = pointLength(subtractPoints(best.midpoint, liftPoint.point));
  best.separationMm = pointLength(subtractPoints(best.points[0].point, best.points[1].point));
  best.points[0].loadKg = loadSplit.firstLoadKg;
  best.points[1].loadKg = loadSplit.secondLoadKg;

  return best;
}

function liftingPointLoadSplit(firstPoint, secondPoint, cogPoint, totalWeightKg) {
  const span = subtractPoints(secondPoint, firstPoint);
  const spanLengthSq = Math.max(dotPoints(span, span), 1);
  const rawT = dotPoints(subtractPoints(cogPoint, firstPoint), span) / spanLengthSq;
  const t = clampNumber(rawT, 0, 1);
  const projected = addPoints(firstPoint, span, t);
  const offLineErrorMm = pointLength(subtractPoints(cogPoint, projected));
  const safeWeight = Math.max(0, Number(totalWeightKg) || 0);

  return {
    t: rawT,
    withinSpan: rawT >= 0 && rawT <= 1,
    projected,
    offLineErrorMm,
    firstLoadKg: safeWeight * (1 - t),
    secondLoadKg: safeWeight * t,
  };
}

function midpointPoint(first, second) {
  return {
    x: (first.x + second.x) * 0.5,
    y: (first.y + second.y) * 0.5,
    z: (first.z + second.z) * 0.5,
  };
}

function spoolSpanMm(segmentData) {
  const points = segmentData.flatMap((segment) => [segment.start, segment.end]);
  let span = 0;
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      span = Math.max(span, pointLength(subtractPoints(points[i], points[j])));
    }
  }
  return Math.max(span, 1000);
}

function lugPointText(lug) {
  return `Lug ${lug.number}: run ${lug.segment.index + 1}, ${formatLength(lug.distanceFromRunStartMm)} mm from run start, est. vertical share ${formatMass(lug.loadKg ?? 0)} kg`;
}

function liftingPointPlanSummary(lugPlan) {
  if (!lugPlan) return "No calculated lifting points yet.";
  const offLine = lugPlan.loadSplit?.offLineErrorMm ?? 0;
  return `Spacing ${formatLength(lugPlan.separationMm)} mm; COG ${formatLength(offLine)} mm off lug line; midpoint ${formatLength(lugPlan.midpointErrorMm)} mm from COG.`;
}

function splitSegmentAt(segmentIndex, t) {
  const edge = state.edges[segmentIndex];
  if (!edge || t <= 0.02 || t >= 0.98) return null;

  const splitPoint = lerpPoint(state.points[edge.from], state.points[edge.to], t);
  const splitIndex = state.points.length;
  state.points.push(splitPoint);
  state.edges.splice(
    segmentIndex,
    1,
    { from: edge.from, to: splitIndex, pipeSizeNb: normalizePipeSize(edge.pipeSizeNb ?? state.pipeSizeNb) },
    { from: splitIndex, to: edge.to, pipeSizeNb: normalizePipeSize(edge.pipeSizeNb ?? state.pipeSizeNb) },
  );

  state.fittings = state.fittings.map((fitting) => {
    if (fitting.segmentIndex < segmentIndex) return fitting;
    if (fitting.segmentIndex > segmentIndex) {
      return { ...fitting, segmentIndex: fitting.segmentIndex + 1 };
    }
    if (fitting.t <= t) {
      return { ...fitting, t: Math.max(0.04, Math.min(0.96, fitting.t / t)) };
    }
    return {
      ...fitting,
      segmentIndex: segmentIndex + 1,
      t: Math.max(0.04, Math.min(0.96, (fitting.t - t) / (1 - t))),
    };
  });

  state.selectedPoint = splitIndex;
  state.activePoint = splitIndex;
  clearSelectedSegments();
  state.selectedFitting = null;
  return splitIndex;
}

function placeFitting(type, segmentIndex, t, options = {}) {
  const fitting = {
    id: nextFittingId,
    type,
    segmentIndex,
    t: normalizeFittingPosition(type, t),
  };
  if (type === "flange") {
    fitting.flangeMode = normalizeFlangeMode(options.flangeMode ?? state.flangeMode);
  }

  state.fittings.push(fitting);
  state.selectedFitting = nextFittingId;
  selectSingleSegment(segmentIndex);
  state.selectedNote = null;
  nextFittingId += 1;
  state.history.push({ type: "fitting" });
  updateAll();
}

function placeNote(point, textOverride = null) {
  const text = String(textOverride ?? noteTextInput.value).trim() || "NOTE";
  noteTextInput.value = text.slice(0, 80);
  const note = {
    id: nextNoteId,
    text: text.slice(0, 80),
    point,
  };
  state.notes.push(note);
  state.selectedNote = nextNoteId;
  state.selectedFitting = null;
  clearSelectedSegments();
  nextNoteId += 1;
  state.history.push({ type: "note", noteId: note.id });
  updateAll();
}

function undo() {
  const last = state.history.pop();
  if (!last) return;

  if (last.type === "edge" && state.points.length > 1) {
    state.edges.splice(last.edgeIndex, 1);
    state.points.splice(last.pointIndex, 1);
    reindexNodeTypesAfterPointRemoval(last.pointIndex);
    state.edges = state.edges.map((edge) => ({
      ...edge,
      from: edge.from > last.pointIndex ? edge.from - 1 : edge.from,
      to: edge.to > last.pointIndex ? edge.to - 1 : edge.to,
    }));
    state.fittings = state.fittings.filter((fitting) => fitting.segmentIndex !== last.edgeIndex);
    state.fittings = state.fittings.map((fitting) => ({
      ...fitting,
      segmentIndex: fitting.segmentIndex > last.edgeIndex ? fitting.segmentIndex - 1 : fitting.segmentIndex,
    }));
    clearSelectedSegments();
    state.selectedPoint = Math.max(0, last.pointIndex - 1);
    state.activePoint = state.selectedPoint;
  } else if (last.type === "fitting") {
    state.fittings.pop();
    state.selectedFitting = null;
  } else if (last.type === "note") {
    state.notes = state.notes.filter((note) => note.id !== last.noteId);
    state.selectedNote = null;
  }

  updateAll();
}

function deleteSelection() {
  if (state.selectedNote) {
    state.notes = state.notes.filter((note) => note.id !== state.selectedNote);
    state.selectedNote = null;
    updateAll();
    return;
  }

  if (state.selectedFitting) {
    state.fittings = state.fittings.filter((fitting) => fitting.id !== state.selectedFitting);
    state.selectedFitting = null;
    updateAll();
    return;
  }

  const selectedSegments = selectedSegmentIndexes().sort((a, b) => b - a);
  if (selectedSegments.length) {
    deleteSegmentsByIndex(selectedSegments);
  }
}

function deleteSegmentsByIndex(indexes) {
  const selectedSegments = normalizeSelectedSegments(indexes, state.edges.length).sort((a, b) => b - a);
  if (!selectedSegments.length) return false;

  for (const removedEdgeIndex of selectedSegments) {
    state.edges.splice(removedEdgeIndex, 1);
    state.fittings = state.fittings.filter((fitting) => fitting.segmentIndex !== removedEdgeIndex);
    state.fittings = state.fittings.map((fitting) => ({
      ...fitting,
      segmentIndex: fitting.segmentIndex > removedEdgeIndex ? fitting.segmentIndex - 1 : fitting.segmentIndex,
    }));
  }
  clearSelectedSegments();
  state.selectedFitting = null;
  updateAll();
  return true;
}

function setTool(tool) {
  state.activeTool = tool;
  state.previewCandidate = null;
  document.querySelectorAll("[data-tool]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === tool);
  });
  drawIso();
}

function updateSegmentList() {
  const segmentData = segments();
  const quantities = quantitySummary(segmentData);
  const quantityBySegment = new Map(quantities.segments.map((item) => [item.segment.index, item.quantity]));
  segmentList.innerHTML = "";

  if (segmentData.length === 0) {
    const empty = document.createElement("div");
    empty.className = "segment-row";
    empty.innerHTML = '<span class="segment-index">0</span><span class="segment-main"><strong>Start point</strong><small>Origin ready</small></span><span class="segment-fit">0</span>';
    segmentList.append(empty);
    return;
  }

  for (const segment of segmentData) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "segment-row";
    row.classList.toggle("active", isSegmentSelected(segment.index));
    row.dataset.segmentIndex = String(segment.index);

    const fittingCount = state.fittings.filter((fitting) => fitting.segmentIndex === segment.index).length;
    const quantity = quantityBySegment.get(segment.index);
    row.innerHTML = `
      <span class="segment-index">${segment.index + 1}</span>
      <span class="segment-main">
        <strong>${pointLabel(segment.from)}-${pointLabel(segment.to)} ${runLabelForVector(segment.vector)} run</strong>
        <small>Cut ${formatLength(quantity.cutLengthMm)} mm / CL ${formatLength(quantity.centrelineMm)} mm / ${formatMass(quantity.pipeWeightKg)} kg</small>
        <small>NB ${pipeSizeForSegment(segment).nb} ${pipeSpec().schedule} / deductions ${formatLength(quantity.bendTakeoffMm)} mm</small>
      </span>
      <span class="segment-fit">${fittingCount}</span>
    `;
    row.addEventListener("click", (event) => {
      chooseSegmentFromPointer(event, segment.index);
      state.selectedFitting = null;
      state.selectedNote = null;
      state.selectedPoint = segment.to;
      state.activePoint = segment.to;
      state.activeTool = "select";
      setTool("select");
      updateAll({ save: false });
    });
    segmentList.append(row);
  }
}

function updateStats() {
  const quantities = quantitySummary();
  spoolStats.textContent = `${quantities.segments.length} runs / ${formatMass(quantities.totalWeightKg)} kg`;
}

function updateWeightsSummary() {
  if (!weightsSummary) return;
  const quantities = quantitySummary();
  const liftPoint = centreOfGravityData(quantities);

  if (!quantities.segments.length) {
    weightsSummary.innerHTML = '<div class="takeoff-empty">No pipe weight yet</div>';
    return;
  }

  weightsSummary.innerHTML = `
    <div class="weight-card-grid">
      <div class="weight-card"><span>Pipe</span><strong>${formatMass(quantities.pipeWeightKg)} kg</strong></div>
      <div class="weight-card"><span>Elbows</span><strong>${formatMass(quantities.bendWeightKg)} kg</strong></div>
      <div class="weight-card"><span>Tees</span><strong>${formatMass(quantities.teeWeightKg)} kg</strong></div>
      <div class="weight-card"><span>Branches</span><strong>${formatMass(quantities.branchWeightKg)} kg</strong></div>
      <div class="weight-card"><span>Reducers</span><strong>${formatMass(quantities.reducerWeightKg)} kg</strong></div>
      <div class="weight-card"><span>Fittings</span><strong>${formatMass(quantities.fittingWeightKg)} kg</strong></div>
      <div class="weight-card total"><span>Total estimated</span><strong>${formatMass(quantities.totalWeightKg)} kg</strong></div>
      <div class="weight-card"><span>COG</span><strong>${liftPoint ? formatPointCompact(liftPoint.point) : "N/A"}</strong></div>
    </div>
    <p class="weight-note">${pipeSpec().label}. Atlas table weights are used where available. Branch welds, valves and custom weld allowances remain estimates unless set manually.</p>
  `;
}

function updateTakeoffSummary() {
  const quantities = quantitySummary();
  if (!takeoffSummary) return;

  if (!quantities.segments.length) {
    takeoffSummary.innerHTML = '<div class="takeoff-empty">No pipe runs yet</div>';
    return;
  }

  const bendNotes = quantities.elbows.length
    ? quantities.elbows.map((elbow, index) => {
        const sameTakeoff = Math.abs(elbow.firstTakeoffMm - elbow.secondTakeoffMm) < 0.5;
        const takeoffText = sameTakeoff
          ? `${formatLength(elbow.takeoffMm)} mm each side`
          : `run ${elbow.firstSegmentIndex + 1}: ${formatLength(elbow.firstTakeoffMm)} mm, run ${elbow.secondSegmentIndex + 1}: ${formatLength(elbow.secondTakeoffMm)} mm`;
        return `<li>Bend ${index + 1}: NB ${elbow.nb} / ${formatAngle(elbow.bend)} deg - take off ${takeoffText}</li>`;
      }).join("")
    : "<li>No bend take-off yet.</li>";
  const reducerNotes = quantities.reducers.length
    ? quantities.reducers.map((reducer, index) => {
        return `<li>Reducer ${index + 1}: NB ${reducer.largeNb} to NB ${reducer.smallNb} - take off ${formatLength(reducer.firstTakeoffMm + reducer.secondTakeoffMm)} mm total / ${formatMass(reducer.weightKg)} kg ${reducer.source ?? "estimated"}</li>`;
      }).join("")
    : "<li>No automatic reducers yet.</li>";
  const teeNotes = quantities.tees.length
    ? quantities.tees.map((tee, index) => {
        const legs = tee.connections.map((connection) => `run ${connection.segmentIndex + 1}: ${formatLength(connection.takeoffMm)} mm`).join(", ");
        const label = tee.reducing ? `Reducing tee ${index + 1}` : `Tee ${index + 1}`;
        return `<li>${label}: NB ${tee.nb}${tee.reducing ? ` to NB ${tee.branchNb}` : ""} - take off ${legs} / ${formatMass(tee.weightKg)} kg ${tee.source}</li>`;
      }).join("")
    : "<li>No tee take-off yet.</li>";
  const branchNotes = quantities.branches.length
    ? quantities.branches.map((branch, index) => {
        const legs = branch.connections.map((connection) => `run ${connection.segmentIndex + 1}: ${formatLength(connection.takeoffMm)} mm`).join(", ");
        return `<li>Branch ${index + 1}: main NB ${branch.nb} to branch NB ${branch.branchNb} - take off ${legs} / ${formatMass(branch.weightKg)} kg ${branch.source}</li>`;
      }).join("")
    : "<li>No branch weld take-off yet.</li>";
  const fittingNotes = quantities.fittings.length
    ? quantities.fittings.map((item) => {
        const label = fittingActionLabel(item.fitting.type);
        return `<li>${label} on run ${item.segment.index + 1} at ${formatLength(pointLength(subtractPoints(item.point, item.segment.start)))} mm - ${formatMass(item.weightKg)} kg ${item.weightSource}</li>`;
      }).join("")
    : "<li>No fittings with weight yet.</li>";
  const liftPoint = centreOfGravityData(quantities);
  const liftPointText = centreOfGravityReferenceText(quantities, liftPoint);
  const lugPlan = suggestedLugPlan(quantities, liftPoint);
  const lugNotes = lugPlan
    ? lugPlan.points.map((lug) => `<li>${lugPointText(lug)}</li>`).join("")
    : "<li>No calculated lifting points yet.</li>";
  const liftRows = state.showLiftingPoints
    ? `<span>COG</span><strong>${liftPointText}</strong>
      <span>Lift point spread</span><strong>${lugPlan ? `${formatLength(lugPlan.separationMm)} mm` : "N/A"}</strong>`
    : "";
  const liftSection = state.showLiftingPoints
    ? `<div class="bend-notes">
      <strong>Calculated lifting points</strong>
      <ul>${lugNotes}</ul>
      ${lugPlan ? `<p>${liftingPointPlanSummary(lugPlan)} Verify lug design, welds and sling angles.</p>` : ""}
    </div>`
    : "";
  const liftDisclaimer = state.showLiftingPoints
    ? " Branch weld weights, automatic reducer weights, COG and lifting points are estimates. Verify all lifting points, sling angles and attachments before lifting."
    : " Branch weld weights, automatic reducer weights and COG are estimates.";

  takeoffSummary.innerHTML = `
    <div class="takeoff-grid">
      <span>Centreline</span><strong>${formatLength(quantities.centrelineMm)} mm</strong>
      <span>Deductions</span><strong>${formatLength(quantities.bendTakeoffMm)} mm</strong>
      <span>Cut pipe</span><strong>${formatLength(quantities.cutLengthMm)} mm</strong>
      <span>Pipe weight</span><strong>${formatMass(quantities.pipeWeightKg)} kg</strong>
      <span>Elbows</span><strong>${quantities.elbows.length} / ${formatMass(quantities.bendWeightKg)} kg</strong>
      <span>Tees</span><strong>${quantities.tees.length} / ${formatMass(quantities.teeWeightKg)} kg</strong>
      <span>Branches</span><strong>${quantities.branches.length} / ${formatMass(quantities.branchWeightKg)} kg</strong>
      <span>Reducers</span><strong>${quantities.reducers.length} / ${formatMass(quantities.reducerWeightKg)} kg</strong>
      <span>Fittings</span><strong>${quantities.fittings.length} / ${formatMass(quantities.fittingWeightKg)} kg</strong>
      <span>Total est.</span><strong>${formatMass(quantities.totalWeightKg)} kg</strong>
      ${liftRows}
    </div>
    <div class="bend-notes">
      <strong>Bend notes</strong>
      <ul>${bendNotes}</ul>
    </div>
    <div class="bend-notes">
      <strong>Tee notes</strong>
      <ul>${teeNotes}</ul>
    </div>
    <div class="bend-notes">
      <strong>Branch notes</strong>
      <ul>${branchNotes}</ul>
    </div>
    <div class="bend-notes">
      <strong>Reducer notes</strong>
      <ul>${reducerNotes}</ul>
    </div>
    <div class="bend-notes">
      <strong>Fitting weights</strong>
      <ul>${fittingNotes}</ul>
    </div>
    ${liftSection}
    <p>${pipeSpec().label}, LR elbows.${liftDisclaimer} Atlas table weights are used where available. Valves and weld allowances remain estimated unless set manually.</p>
  `;
}

function populatePipeSizeOptions() {
  pipeSizeSelect.innerHTML = "";
  for (const size of PIPE_SIZES) {
    const option = document.createElement("option");
    option.value = String(size.nb);
    option.textContent = `NB ${size.nb} / NPS ${size.nps} / OD ${size.od.toFixed(1)} mm`;
    pipeSizeSelect.append(option);
  }
}

function updatePipeSizeReadout() {
  const selected = selectedSegmentsData();
  const size = selectedPipeSize();
  const wall = pipeWallForSize(size);
  const mass = pipeMassPerMetreForSize(size);
  if (selected.length > 1) {
    const sizes = new Set(selected.map((segment) => pipeSizeForSegment(segment).nb));
    const prefix = sizes.size === 1 ? `Selected ${selected.length} sections` : `Selected ${selected.length} sections / mixed`;
    pipeSizeReadout.textContent = `${prefix}: ${pipeSpecShortLabel()} - choose a NB size to update all selected sections`;
    return;
  }

  const prefix = selected.length === 1 ? "Selected section" : "Default";
  pipeSizeReadout.textContent = `${prefix}: NB ${size.nb} ${pipeSpecShortLabel()} - OD ${size.od.toFixed(1)} mm / wall ${wall.toFixed(2)} mm / ${formatMass(mass)} kg/m`;
}

function updatePipeSizeControls() {
  const selected = selectedSegmentsData();
  pipeSizeSelect.value = String(selected.length ? pipeSizeForSegment(selected[0]).nb : state.pipeSizeNb);
  updatePipeSizeReadout();
}

function setPipeSizeForSegments(indexes, pipeSizeNb) {
  const selected = normalizeSelectedSegments(indexes, state.edges.length);
  if (!selected.length) {
    state.pipeSizeNb = pipeSizeNb;
    updateAll();
    return;
  }

  for (const segmentIndex of selected) {
    if (state.edges[segmentIndex]) {
      state.edges[segmentIndex].pipeSizeNb = pipeSizeNb;
    }
  }
  setSelectedSegments(selected);
  updateAll();
}

function updateSelectionControls() {
  const selectedSegment = selectedSegmentData();
  selectedRunLengthInput.disabled = !selectedSegment;
  selectedRunLengthInput.value = selectedSegment ? String(Math.round(pointLength(selectedSegment.vector))) : "";
}

function updateProjectInputs() {
  const project = normalizeProjectInfo(state.projectInfo);
  for (const input of projectInputs) {
    const field = input.dataset.projectField;
    input.value = project[field] ?? "";
  }
}

function updatePropertiesPanel() {
  if (!propertiesPanel) return;

  const fitting = selectedFittingData();
  if (fitting) {
    const distance = pointLength(subtractPoints(fitting.point, fitting.segment.start));
    renderProperties(
      `${fittingActionLabel(fitting.fitting.type)} fitting`,
      [
        ["Run", fitting.segment.index + 1],
        ["Position", `${formatLength(distance)} mm`],
        ["NB", pipeSizeForSegment(fitting.segment).nb],
        ["Mode", fitting.fitting.type === "flange" ? fittingFlangeMode(fitting.fitting) : fitting.weightSource],
        ["Weight", `${formatMass(fitting.weightKg)} kg ${fitting.weightSource}`],
      ],
      [
        ["set-fitting-weight", "Set weight"],
        ...(fitting.weightSource === "manual" ? [["clear-fitting-weight", "Clear manual"]] : []),
        ["delete-fitting", "Delete", "danger"],
      ],
    );
    return;
  }

  if (state.selectedNote) {
    const note = state.notes.find((item) => item.id === state.selectedNote);
    if (note) {
      renderProperties(
        "Text note",
        [
          ["Text", note.text],
          ["X", `${formatLength(note.point.x)} mm`],
          ["Y", `${formatLength(note.point.y)} mm`],
          ["Z", `${formatLength(note.point.z)} mm`],
        ],
        [
          ["edit-note", "Edit note"],
          ["delete-note", "Delete", "danger"],
        ],
      );
      return;
    }
  }

  const selected = selectedSegmentIndexes();
  if (selected.length) {
    const selectedSegments = segments().filter((segment) => selected.includes(segment.index));
    const allQuantities = quantitySummary();
    const quantityBySegment = new Map(allQuantities.segments.map((item) => [item.segment.index, item.quantity]));
    const selectedQuantities = selectedSegments.map((segment) => ({
      segment,
      quantity: quantityBySegment.get(segment.index) ?? segmentQuantity(segment),
    }));
    const selectedTotals = selectedQuantities.reduce((totals, item) => ({
      centrelineMm: totals.centrelineMm + item.quantity.centrelineMm,
      cutLengthMm: totals.cutLengthMm + item.quantity.cutLengthMm,
      pipeWeightKg: totals.pipeWeightKg + item.quantity.pipeWeightKg,
    }), { centrelineMm: 0, cutLengthMm: 0, pipeWeightKg: 0 });
    if (selectedSegments.length === 1) {
      const segment = selectedSegments[0];
      const quantity = selectedQuantities[0].quantity;
      const size = pipeSizeForSegment(segment);
      renderProperties(
        `Run ${segment.index + 1}`,
        [
          ["NB", `${size.nb} ${pipeSpec().schedule}`],
          ["C/C", `${formatLength(quantity.centrelineMm)} mm`],
          ["Cut", `${formatLength(quantity.cutLengthMm)} mm`],
          ["Deduct", `${formatLength(quantity.bendTakeoffMm)} mm`],
          ["Weight", `${formatMass(quantity.pipeWeightKg)} kg`],
        ],
        [
          ["edit-run-length", "Edit length"],
          ["delete-run", "Delete", "danger"],
        ],
      );
      return;
    }

    renderProperties(
      `${selectedSegments.length} runs selected`,
      [
        ["Centreline", `${formatLength(selectedTotals.centrelineMm)} mm`],
        ["Cut pipe", `${formatLength(selectedTotals.cutLengthMm)} mm`],
        ["Pipe weight", `${formatMass(selectedTotals.pipeWeightKg)} kg`],
        ["Sizes", new Set(selectedSegments.map((segment) => pipeSizeForSegment(segment).nb)).size === 1 ? `NB ${pipeSizeForSegment(selectedSegments[0]).nb}` : "Mixed"],
      ],
      [
        ["delete-run", "Delete selected", "danger"],
      ],
    );
    return;
  }

  if (state.selectedPoint !== null && state.points[state.selectedPoint]) {
    const point = state.points[state.selectedPoint];
    const connected = segments().filter((segment) => segment.from === state.selectedPoint || segment.to === state.selectedPoint);
    const connectionType = connected.length >= 3 ? nodeConnectionType(state.selectedPoint) : null;
    renderProperties(
      `Point ${pointLabel(state.selectedPoint)}`,
      [
        ["X", `${formatLength(point.x)} mm`],
        ["Y", `${formatLength(point.y)} mm`],
        ["Z", `${formatLength(point.z)} mm`],
        ["Runs", connected.length],
        ...(connectionType ? [["Connection", connectionType === "branch" ? "Branch weld" : "Buttweld tee"]] : []),
      ],
      connectionType
        ? [[connectionType === "branch" ? "mark-point-tee" : "mark-point-branch", connectionType === "branch" ? "Mark as tee" : "Mark as branch"]]
        : [],
    );
    return;
  }

  const quantities = quantitySummary();
  const liftPoint = centreOfGravityData(quantities);
  renderProperties(
    "Spool summary",
    [
      ["Runs", quantities.segments.length],
      ["Material", pipeSpecShortLabel()],
      ["Total weight", `${formatMass(quantities.totalWeightKg)} kg`],
      ["COG", liftPoint ? formatPointCompact(liftPoint.point) : "N/A"],
    ],
    [],
  );
}

function renderProperties(title, rows, actions) {
  propertiesPanel.innerHTML = `
    <div class="property-grid">
      <span>Selection</span><strong>${escapeHtml(title)}</strong>
      ${rows.map(([label, value]) => `<span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>`).join("")}
    </div>
    ${actions.length ? `<div class="property-actions">${actions.map(([action, label, tone]) => `<button type="button" data-property-action="${action}" class="${tone === "danger" ? "danger" : ""}">${escapeHtml(label)}</button>`).join("")}</div>` : ""}
  `;

  propertiesPanel.querySelectorAll("[data-property-action]").forEach((button) => {
    button.addEventListener("click", () => handlePropertyAction(button.dataset.propertyAction));
  });
}

function handlePropertyAction(action) {
  if (action === "set-fitting-weight") setSelectedFittingWeight();
  if (action === "clear-fitting-weight") clearSelectedFittingWeight();
  if (action === "delete-fitting") deleteSelectedFitting();
  if (action === "edit-note") editSelectedNote();
  if (action === "delete-note") deleteSelectedNote();
  if (action === "edit-run-length") editSelectedRunLength();
  if (action === "delete-run") deleteSegmentsByIndex(selectedSegmentIndexes());
  if (action === "mark-point-branch") setSelectedPointConnectionType("branch");
  if (action === "mark-point-tee") setSelectedPointConnectionType("tee");
}

function setSelectedFittingWeight() {
  const data = selectedFittingData();
  if (!data) return;

  const text = window.prompt("Fitting weight kg", formatMass(data.weightKg));
  if (text === null) return;

  const weightKg = Number(text);
  if (!Number.isFinite(weightKg) || weightKg < 0) {
    window.alert("Enter a valid fitting weight in kg.");
    return;
  }

  data.fitting.weightKg = Math.round(weightKg * 10) / 10;
  updateAll();
}

function clearSelectedFittingWeight() {
  const data = selectedFittingData();
  if (!data) return;
  delete data.fitting.weightKg;
  updateAll();
}

function deleteSelectedFitting() {
  if (!state.selectedFitting) return;
  state.fittings = state.fittings.filter((fitting) => fitting.id !== state.selectedFitting);
  state.selectedFitting = null;
  updateAll();
}

function editSelectedNote() {
  const note = state.notes.find((item) => item.id === state.selectedNote);
  if (note) editContextNote(note);
}

function deleteSelectedNote() {
  if (!state.selectedNote) return;
  state.notes = state.notes.filter((note) => note.id !== state.selectedNote);
  state.selectedNote = null;
  updateAll();
}

function editSelectedRunLength() {
  const segment = selectedSegmentData();
  if (!segment) return;
  const text = window.prompt("Pipe length mm", String(Math.round(pointLength(segment.vector))));
  if (text === null) return;
  setSelectedSegmentLength(text);
}

function setSelectedPointConnectionType(type) {
  if (state.selectedPoint === null || !state.points[state.selectedPoint]) return;
  const connected = segments().filter((segment) => segment.from === state.selectedPoint || segment.to === state.selectedPoint);
  if (connected.length < 3) return;
  setNodeConnectionType(state.selectedPoint, type);
}

function updateControls() {
  stepLengthInput.value = String(state.stepLength);
  updateSelectionControls();
  updateProjectInputs();
  angleInput.value = String(state.angleDegrees);
  anglePlaneSelect.value = state.anglePlane;
  pipeSpecSelect.value = normalizePipeSpec(state.pipeSpec);
  flangeModeSelect.value = normalizeFlangeMode(state.flangeMode);
  previewModeSelect.value = normalizePreviewMode(state.previewMode);
  updatePipeSizeControls();
  dimensionToggle.checked = state.showDimensions;
  dimensionStyleSelect.value = normalizeDimensionStyle(state.dimensionStyle);
  dimensionStyleSelect.disabled = !state.showDimensions;
  liftingToggle.checked = state.showLiftingPoints;
  setTool(state.activeTool);
}

function updateAll(options = {}) {
  const save = options.save !== false;
  drawIso();
  updateSegmentList();
  updateStats();
  updateTakeoffSummary();
  updateWeightsSummary();
  updateSelectionControls();
  updatePipeSizeControls();
  updatePropertiesPanel();
  update3dPreview();
  if (save) persistState();
}

function setupCollapsibleControls() {
  let savedState = {};
  try {
    savedState = JSON.parse(localStorage.getItem(CONTROL_COLLAPSE_KEY)) ?? {};
  } catch {
    savedState = {};
  }

  document.querySelectorAll(".control-panel .control-section[data-collapsible]").forEach((section) => {
    const heading = section.querySelector("h2");
    if (!heading || section.querySelector(".control-section-toggle")) return;

    const title = heading.textContent.trim();
    const key = title.toLowerCase();
    const body = document.createElement("div");
    body.className = "control-section-body";
    while (heading.nextSibling) {
      body.append(heading.nextSibling);
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "control-section-toggle";
    button.innerHTML = `<span>${title}</span><span class="collapse-icon" aria-hidden="true"></span>`;
    heading.classList.add("control-section-heading");
    heading.replaceChildren(button);
    section.append(body);

    const setCollapsed = (collapsed) => {
      section.classList.toggle("collapsed", collapsed);
      button.setAttribute("aria-expanded", String(!collapsed));
    };

    setCollapsed(Boolean(savedState[key]));
    button.addEventListener("click", () => {
      const collapsed = !section.classList.contains("collapsed");
      setCollapsed(collapsed);
      savedState[key] = collapsed;
      try {
        localStorage.setItem(CONTROL_COLLAPSE_KEY, JSON.stringify(savedState));
      } catch {
        // Collapsing still works even when browser storage is unavailable.
      }
    });
  });
}

function setupInspectorTabs() {
  const tabs = [...document.querySelectorAll("[data-inspector-tab]")];
  const panels = [...document.querySelectorAll("[data-inspector-panel]")];
  if (!tabs.length || !panels.length) return;

  const activate = (name) => {
    for (const tab of tabs) {
      const active = tab.dataset.inspectorTab === name;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    }
    for (const panel of panels) {
      panel.classList.toggle("active", panel.dataset.inspectorPanel === name);
    }
  };

  for (const tab of tabs) {
    tab.addEventListener("click", () => activate(tab.dataset.inspectorTab));
  }
  activate(tabs.find((tab) => tab.classList.contains("active"))?.dataset.inspectorTab ?? tabs[0].dataset.inspectorTab);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol === "file:") return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Service worker registration failed.", error);
    });
  });
}

async function initThree() {
  renderStatus.textContent = "Canvas fallback active";
  renderFallbackPreview();

  try {
    const [THREE, controlsModule] = await Promise.all([
      import("three"),
      import("three/addons/controls/OrbitControls.js"),
    ]);
    setupThree(THREE, controlsModule.OrbitControls);
  } catch (error) {
    console.warn("Three.js failed to load; using fallback renderer.", error);
    renderStatus.textContent = "Canvas 3D preview";
    threeCanvas.hidden = true;
    fallbackCanvas.hidden = false;
    clear3dPipeLabels();
    renderFallbackPreview();
  }
}

function setupThree(THREE, OrbitControls) {
  three.module = THREE;
  three.scene = new THREE.Scene();
  three.scene.background = new THREE.Color(0xf8fbfb);

  three.camera = new THREE.OrthographicCamera(-8, 8, 6, -6, 0.1, 1000);
  three.camera.up.set(-0.5, -0.5, 1).normalize();

  three.renderer = new THREE.WebGLRenderer({
    canvas: threeCanvas,
    antialias: true,
    preserveDrawingBuffer: true,
    alpha: false,
  });
  three.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  three.renderer.shadowMap.enabled = true;
  three.renderer.outputColorSpace = THREE.SRGBColorSpace;
  three.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  three.renderer.toneMappingExposure = 1.05;

  const ambient = new THREE.HemisphereLight(0xffffff, 0xaeb8b5, 2.15);
  three.scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
  keyLight.position.set(9, -12, 13);
  keyLight.castShadow = true;
  three.scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xe5efec, 1.15);
  fillLight.position.set(-8, 7, 8);
  three.scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xf7efe3, 0.9);
  rimLight.position.set(-5, 12, 6);
  three.scene.add(rimLight);

  const grid = new THREE.GridHelper(24, 24, 0x9aaaa5, 0xdce2df);
  grid.rotation.x = Math.PI / 2;
  grid.position.z = -0.02;
  three.scene.add(grid);

  three.controls = new OrbitControls(three.camera, three.renderer.domElement);
  three.controls.enableDamping = true;
  three.controls.dampingFactor = 0.08;
  three.controls.screenSpacePanning = true;

  three.ready = true;
  threeCanvas.hidden = false;
  fallbackCanvas.hidden = true;
  renderStatus.textContent = "Three.js viewport";
  resizeThree();
  update3dPreview();
  animateThree();
}

function animateThree() {
  if (!three.ready) return;
  three.animationFrame = requestAnimationFrame(animateThree);
  three.controls.update();
  three.renderer.render(three.scene, three.camera);
  update3dLabelPositions();
}

function resizeThree() {
  if (!three.ready) return;

  const rect = previewStage.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  three.renderer.setSize(width, height, false);
  frameThreeCamera();
  update3dLabelPositions();
}

function update3dPreview() {
  if (!three.ready) {
    clear3dPipeLabels();
    renderFallbackPreview();
    return;
  }

  rebuildThreeSpool();
  frameThreeCamera();
}

function rebuildThreeSpool() {
  const THREE = three.module;
  const style = previewViewStyle();
  clear3dPipeLabels();
  if (three.spoolGroup) {
    three.scene.remove(three.spoolGroup);
    disposeObject3d(three.spoolGroup);
  }

  const group = new THREE.Group();
  const pipeMaterial = previewMaterial(style, "pipe");
  const jointMaterial = previewMaterial(style, "joint");
  const flangeMaterial = previewMaterial(style, "flange");
  const boltMaterial = previewMaterial(style, "bolt");
  const gasketMaterial = previewMaterial(style, "gasket");
  const valveMaterial = previewMaterial(style, "valve");
  const weldMaterial = previewMaterial(style, "weld");
  const reducerMaterial = previewMaterial(style, "reducer");

  const modelPoints = state.points.map((point) => {
    const modelPoint = toModelUnits(point);
    return new THREE.Vector3(modelPoint.x, modelPoint.y, modelPoint.z);
  });
  const segmentData = segments();
  const connections = nodeConnections(segmentData);
  const elbowTrims = computeGraphElbowTrims(modelPoints, segmentData, connections);
  const segmentByIndex = new Map(segmentData.map((segment) => [segment.index, segment]));

  for (const segment of segmentData) {
    const segmentRadius = pipeRadiusMetres(segment);
    const start = modelPoints[segment.from].clone();
    const end = modelPoints[segment.to].clone();
    const direction = end.clone().sub(start).normalize();
    const startTrim = elbowTrims.segment.get(`${segment.index}:${segment.from}`) ?? 0;
    const endTrim = elbowTrims.segment.get(`${segment.index}:${segment.to}`) ?? 0;
    start.addScaledVector(direction, startTrim);
    end.addScaledVector(direction, -endTrim);

    if (start.distanceTo(end) < segmentRadius * 0.5) {
      continue;
    }

    if (style.lineDrawing) {
      group.add(outlinePipeBetween(start, end, segmentRadius, pipeMaterial, {
        startCap: (connections.get(segment.from)?.length ?? 0) <= 1,
        endCap: (connections.get(segment.to)?.length ?? 0) <= 1,
      }));
    } else {
      const pipe = cylinderBetween(
        start,
        end,
        segmentRadius,
        pipeMaterial,
        32,
      );
      pipe.castShadow = true;
      pipe.receiveShadow = true;
      group.add(pipe);
    }
  }

  for (const elbowData of elbowTrims.elbows) {
    const elbow = style.lineDrawing
      ? outlineElbowBetween(
        elbowData.entry,
        elbowData.joint,
        elbowData.exit,
        elbowData.radius,
        pipeMaterial,
      )
      : curvedElbowBetween(
        elbowData.entry,
        elbowData.joint,
        elbowData.exit,
        elbowData.radius,
        pipeMaterial,
        32,
      );
    if (!style.lineDrawing) {
      elbow.castShadow = true;
      elbow.receiveShadow = true;
    }
    group.add(elbow);
  }

  for (const [index, point] of modelPoints.entries()) {
    if (elbowTrims.smoothNodes.has(index)) {
      continue;
    }

    const connected = connections.get(index) ?? [];
    const nodeRadius = radiusForNode(index, connections, segmentByIndex);
    if (connected.length >= 3) {
      const connectionType = nodeConnectionType(index);
      const nodeObject = connectionType === "branch"
        ? (style.lineDrawing
          ? outlineBranchMarker(index, point, connected, modelPoints, segmentData, jointMaterial)
          : branchNodeAssembly(index, point, connected, modelPoints, segmentData, jointMaterial))
        : (style.lineDrawing
          ? outlineTeeMarker(point, connected, modelPoints, nodeRadius, jointMaterial)
          : teeNodeAssembly(point, connected, modelPoints, nodeRadius, jointMaterial));
      group.add(nodeObject);
      continue;
    }

    if (style.lineDrawing) {
      continue;
    }

    if (connected.length <= 2) {
      continue;
    }

    const jointGeometry = new THREE.SphereGeometry(nodeRadius * 1.14, 24, 16);
    const joint = new THREE.Mesh(jointGeometry, jointMaterial);
    joint.position.copy(point);
    joint.castShadow = true;
    group.add(joint);
  }

  for (const fitting of state.fittings) {
    const segment = segments().find((item) => item.index === fitting.segmentIndex);
    if (!segment) continue;
    const startModel = toModelUnits(segment.start);
    const endModel = toModelUnits(segment.end);
    const start = new THREE.Vector3(startModel.x, startModel.y, startModel.z);
    const end = new THREE.Vector3(endModel.x, endModel.y, endModel.z);
    const position = start.clone().lerp(end, fitting.t);
    const direction = end.clone().sub(start).normalize();
    const radius = pipeRadiusMetres(segment);

    if (fitting.type === "flange") {
      if (style.lineDrawing) {
        group.add(outlineFlangeMarker(position, direction, radius, pipeSizeForSegment(segment).nb, fittingFlangeMode(fitting), flangeMaterial));
      } else {
        group.add(
          flangeAssembly(position, direction, radius, pipeSizeForSegment(segment).nb, fittingFlangeMode(fitting), {
            flange: flangeMaterial,
            bolt: boltMaterial,
            gasket: gasketMaterial,
          }),
        );
      }
    } else if (fitting.type === "weld") {
      const weld = style.lineDrawing
        ? outlineBandMarker(position, direction, radius * 1.35, weldMaterial, 0.12)
        : cylinderBetween(
          position.clone().addScaledVector(direction, -0.035),
          position.clone().addScaledVector(direction, 0.035),
          radius * 1.25,
          weldMaterial,
          32,
        );
      group.add(weld);
    } else if (fitting.type === "valve") {
      if (style.lineDrawing) {
        group.add(outlineValveMarker(position, direction, radius, valveMaterial));
      } else {
        const valve = new THREE.Mesh(new THREE.OctahedronGeometry(radius * 2.15, 0), valveMaterial);
        valve.position.copy(position);
        valve.castShadow = true;
        group.add(valve);

        const stemBase = position.clone().add(new THREE.Vector3(0, 0, radius * 0.8));
        const stemTop = position.clone().add(new THREE.Vector3(0, 0, radius * 3.8));
        group.add(cylinderBetween(stemBase, stemTop, radius * 0.28, valveMaterial, 16));
        group.add(
          cylinderBetween(
            stemTop.clone().add(new THREE.Vector3(-radius * 1.5, 0, 0)),
            stemTop.clone().add(new THREE.Vector3(radius * 1.5, 0, 0)),
            radius * 0.2,
            valveMaterial,
            16,
          ),
        );
      }
    } else if (fitting.type === "reducer") {
      if (style.lineDrawing) {
        group.add(outlineReducerMarker(position, direction, radius, reducerMaterial));
      } else {
        const reducer = taperedCylinderBetween(
          position.clone().addScaledVector(direction, -0.18),
          position.clone().addScaledVector(direction, 0.18),
          radius * 1.55,
          radius * 0.82,
          reducerMaterial,
          32,
        );
        reducer.castShadow = true;
        group.add(reducer);
      }
    }
  }

  for (const reducer of autoReducerTransitions(segmentData)) {
    group.add(autoReducerAssembly(reducer, modelPoints, reducerMaterial, style));
  }

  const liftPoint = centreOfGravityData(quantitySummary(segmentData));
  if (state.showLiftingPoints && liftPoint) {
    const modelPoint = toModelUnits(liftPoint.point);
    group.add(liftPointMarker3d(new THREE.Vector3(modelPoint.x, modelPoint.y, modelPoint.z), style));
  }
  const lugPlan = suggestedLugPlan(quantitySummary(segmentData), liftPoint);
  if (state.showLiftingPoints && lugPlan) {
    for (const lug of lugPlan.points) {
      const modelPoint = toModelUnits(lug.point);
      group.add(lugPointMarker3d(new THREE.Vector3(modelPoint.x, modelPoint.y, modelPoint.z), style));
    }
  }

  three.spoolGroup = group;
  three.scene.add(group);
  build3dPipeLabels(segmentData, modelPoints);
}

function previewViewStyle() {
  const mode = normalizePreviewMode(state.previewMode);
  const stainless = normalizePipeSpec(state.pipeSpec) === "stainless10";
  const carbonColors = {
    pipe: 0x252c2f,
    joint: 0x394145,
    flange: 0x4a5053,
    bolt: 0x171b1d,
    gasket: 0x0f1213,
    valve: 0x5f696c,
    weld: 0x667681,
    reducer: 0x40484b,
  };
  const stainlessColors = {
    pipe: 0xfbfcfc,
    joint: 0xf4f7f8,
    flange: 0xffffff,
    bolt: 0xd5dde0,
    gasket: 0x303638,
    valve: 0xf8fbfb,
    weld: 0xffffff,
    reducer: 0xf5f8f9,
  };
  const styles = {
    carbon: {
      basic: false,
      physical: stainless,
      wireframe: false,
      opacity: 1,
      metalness: stainless ? 0.52 : 0.62,
      roughness: stainless ? 0.16 : 0.38,
      clearcoat: stainless ? 0.82 : 0.08,
      clearcoatRoughness: stainless ? 0.08 : 0.28,
      emissive: stainless ? 0x2f3638 : 0x000000,
      emissiveIntensity: stainless ? 0.1 : 0,
      colors: stainless ? stainlessColors : carbonColors,
    },
    black: {
      basic: false,
      wireframe: false,
      opacity: 1,
      metalness: 0.62,
      roughness: 0.38,
      clearcoat: 0.08,
      clearcoatRoughness: 0.28,
      colors: carbonColors,
    },
    stainless: {
      basic: false,
      physical: true,
      wireframe: false,
      opacity: 1,
      metalness: 0.52,
      roughness: 0.16,
      clearcoat: 0.84,
      clearcoatRoughness: 0.08,
      emissive: 0x2f3638,
      emissiveIntensity: 0.1,
      colors: stainlessColors,
    },
    red: {
      basic: false,
      wireframe: false,
      opacity: 1,
      metalness: 0.38,
      roughness: 0.36,
      colors: {
        pipe: 0xb42318,
        joint: 0x8f1f16,
        flange: 0xd0442e,
        bolt: 0x47110d,
        gasket: 0x2b0b08,
        valve: 0xc03a25,
        weld: 0xf9735b,
        reducer: 0xa72a1b,
      },
    },
    ghost: {
      basic: false,
      wireframe: false,
      opacity: 0.34,
      metalness: 0.16,
      roughness: 0.56,
      colors: {
        pipe: 0xb8cfcd,
        joint: 0x9fb8b4,
        flange: 0x9aa9a7,
        bolt: 0x56615f,
        gasket: 0x44504d,
        valve: 0xaebdbb,
        weld: 0x88a6b4,
        reducer: 0x9aa9a7,
      },
    },
    outline: {
      basic: true,
      wireframe: false,
      opacity: 1,
      outline: true,
      lineDrawing: true,
      metalness: 0,
      roughness: 1,
      colors: {
        pipe: 0xc1121f,
        joint: 0xc1121f,
        flange: 0xc1121f,
        bolt: 0xc1121f,
        gasket: 0xc1121f,
        valve: 0xc1121f,
        weld: 0xc1121f,
        reducer: 0xc1121f,
      },
    },
  };
  return styles[mode] ?? styles.carbon;
}

function previewMaterial(style, part) {
  const THREE = three.module;
  const color = style.colors[part] ?? style.colors.pipe;
  if (style.lineDrawing) {
    return new THREE.LineBasicMaterial({
      color,
      transparent: false,
      opacity: 1,
    });
  }

  const params = {
    color,
    transparent: style.opacity < 1,
    opacity: style.opacity,
    wireframe: style.wireframe,
    depthWrite: style.opacity >= 0.5,
  };

  if (style.basic) {
    return new THREE.MeshBasicMaterial(params);
  }

  const materialParams = {
    ...params,
    metalness: part === "bolt" ? Math.min(0.78, style.metalness + 0.12) : style.metalness,
    roughness: part === "gasket" ? Math.max(0.62, style.roughness + 0.16) : style.roughness,
    emissive: style.emissive ?? 0x000000,
    emissiveIntensity: style.emissiveIntensity ?? 0,
  };

  if (style.physical || style.clearcoat) {
    return new THREE.MeshPhysicalMaterial({
      ...materialParams,
      clearcoat: style.clearcoat ?? 0,
      clearcoatRoughness: style.clearcoatRoughness ?? 0.22,
    });
  }

  return new THREE.MeshStandardMaterial(materialParams);
}

function cylinderBetween(start, end, radius, material, radialSegments) {
  const THREE = three.module;
  const direction = end.clone().sub(start);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(radius, radius, length, radialSegments, 1);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function lineBetween(start, end, material) {
  const THREE = three.module;
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  return new THREE.Line(geometry, material);
}

function curvedLineBetween(entry, joint, exit, material) {
  const THREE = three.module;
  const curve = new THREE.QuadraticBezierCurve3(entry, joint, exit);
  const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(18));
  return new THREE.Line(geometry, material);
}

function outlinePipeBetween(start, end, radius, material, caps = {}) {
  const THREE = three.module;
  const group = new THREE.Group();
  const axisVector = end.clone().sub(start);
  if (axisVector.length() < 0.0001) return group;

  const axis = axisVector.normalize();
  const basis = radialBasis(axis);
  const railOffsets = [
    basis.u.clone().multiplyScalar(radius),
    basis.u.clone().multiplyScalar(-radius),
    basis.v.clone().multiplyScalar(radius),
    basis.v.clone().multiplyScalar(-radius),
  ];

  for (const offset of railOffsets) {
    group.add(lineBetween(start.clone().add(offset), end.clone().add(offset), material));
  }

  if (caps.startCap) group.add(outlineFlatPipeCap(start, axis, radius, material));
  if (caps.endCap) group.add(outlineFlatPipeCap(end, axis, radius, material));

  return group;
}

function outlineFlatPipeCap(position, direction, radius, material) {
  const THREE = three.module;
  const group = new THREE.Group();
  const basis = radialBasis(direction);
  const points = [
    position.clone().add(basis.u.clone().multiplyScalar(radius)),
    position.clone().add(basis.v.clone().multiplyScalar(radius)),
    position.clone().add(basis.u.clone().multiplyScalar(-radius)),
    position.clone().add(basis.v.clone().multiplyScalar(-radius)),
    position.clone().add(basis.u.clone().multiplyScalar(radius)),
  ];
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
  return group;
}

function outlineElbowBetween(entry, joint, exit, radius, material) {
  const THREE = three.module;
  const group = new THREE.Group();
  const curve = new THREE.QuadraticBezierCurve3(entry, joint, exit);
  const incoming = entry.clone().sub(joint).normalize();
  const outgoing = exit.clone().sub(joint).normalize();
  const bendNormal = incoming.clone().cross(outgoing);

  if (bendNormal.length() < 0.0001) {
    return outlinePipeBetween(entry, exit, radius, material);
  }

  bendNormal.normalize();
  const centerPoints = curve.getPoints(30);
  const rails = [[], [], [], []];
  for (let index = 0; index < centerPoints.length; index += 1) {
    const previous = centerPoints[Math.max(0, index - 1)];
    const next = centerPoints[Math.min(centerPoints.length - 1, index + 1)];
    const tangent = next.clone().sub(previous).normalize();
    const side = bendNormal.clone().cross(tangent).normalize();
    const point = centerPoints[index];

    rails[0].push(point.clone().addScaledVector(bendNormal, radius));
    rails[1].push(point.clone().addScaledVector(bendNormal, -radius));
    rails[2].push(point.clone().addScaledVector(side, radius));
    rails[3].push(point.clone().addScaledVector(side, -radius));
  }

  for (const points of rails) {
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
  }

  return group;
}

function outlineBandMarker(position, direction, radius, material, width = 0.18) {
  const THREE = three.module;
  const group = new THREE.Group();
  const axis = direction.clone().normalize();
  for (const offset of [-width * 0.5, width * 0.5]) {
    group.add(outlineRing(position.clone().addScaledVector(axis, offset), axis, radius, material));
  }
  return group;
}

function outlineFlangeMarker(position, direction, radius, nominalBore, flangeMode, material) {
  const THREE = three.module;
  const group = new THREE.Group();
  const axis = direction.clone().normalize();
  const boltCount = boltCountForNb(nominalBore);
  const isSingle = normalizeFlangeMode(flangeMode) === "single";
  const plateThickness = clampNumber(radius * 0.42, 0.045, 0.14);
  const gasketThickness = clampNumber(plateThickness * 0.32, 0.018, 0.038);
  const plateOffset = plateThickness * 0.62 + gasketThickness * 0.5;
  const plateCenters = isSingle
    ? [position.clone()]
    : [-1, 1].map((side) => position.clone().addScaledVector(axis, side * plateOffset));

  for (const plateCenter of plateCenters) {
    group.add(outlineFlangePlate(
      plateCenter,
      axis,
      radius * 2.15,
      radius * 1.07,
      plateThickness,
      boltCount,
      radius * 1.58,
      clampNumber(radius * 0.15, 0.018, 0.05),
      material,
    ));
  }

  if (!isSingle) {
    group.add(outlineRing(position, axis, radius * 1.82, material));
    group.add(outlineRing(position, axis, radius * 1.05, material));
  }

  return group;
}

function outlineFlangePlate(position, axis, outerRadius, innerRadius, thickness, boltCount, boltCircleRadius, boltHoleRadius, material) {
  const THREE = three.module;
  const group = new THREE.Group();
  const basis = radialBasis(axis);
  const faces = [-0.5, 0.5].map((side) => position.clone().addScaledVector(axis, side * thickness));

  for (const face of faces) {
    group.add(outlineRing(face, axis, outerRadius, material));
    group.add(outlineRing(face, axis, innerRadius, material));

    for (let index = 0; index < boltCount; index += 1) {
      const angle = (Math.PI * 2 * index) / boltCount;
      const boltCenter = face.clone()
        .add(basis.u.clone().multiplyScalar(Math.cos(angle) * boltCircleRadius))
        .add(basis.v.clone().multiplyScalar(Math.sin(angle) * boltCircleRadius));
      group.add(outlineRing(boltCenter, axis, boltHoleRadius, material));
    }
  }

  for (const radial of [
    basis.u,
    basis.u.clone().multiplyScalar(-1),
    basis.v,
    basis.v.clone().multiplyScalar(-1),
  ]) {
    group.add(lineBetween(
      faces[0].clone().add(radial.clone().multiplyScalar(outerRadius)),
      faces[1].clone().add(radial.clone().multiplyScalar(outerRadius)),
      material,
    ));
    group.add(lineBetween(
      faces[0].clone().add(radial.clone().multiplyScalar(innerRadius)),
      faces[1].clone().add(radial.clone().multiplyScalar(innerRadius)),
      material,
    ));
  }

  return group;
}

function outlineValveMarker(position, direction, radius, material) {
  const THREE = three.module;
  const group = new THREE.Group();
  const axis = direction.clone().normalize();
  const basis = radialBasis(axis);
  const size = radius * 1.85;
  const points = [
    position.clone().addScaledVector(axis, -size),
    position.clone().add(basis.u.clone().multiplyScalar(size)),
    position.clone().addScaledVector(axis, size),
    position.clone().add(basis.u.clone().multiplyScalar(-size)),
    position.clone().addScaledVector(axis, -size),
  ];
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));

  const stemBase = position.clone().add(basis.v.clone().multiplyScalar(radius * 0.8));
  const stemTop = position.clone().add(basis.v.clone().multiplyScalar(radius * 3.6));
  group.add(lineBetween(stemBase, stemTop, material));
  group.add(lineBetween(
    stemTop.clone().add(basis.u.clone().multiplyScalar(-radius * 1.45)),
    stemTop.clone().add(basis.u.clone().multiplyScalar(radius * 1.45)),
    material,
  ));
  return group;
}

function outlineReducerMarker(position, direction, radius, material) {
  const THREE = three.module;
  const group = new THREE.Group();
  const axis = direction.clone().normalize();
  const basis = radialBasis(axis);
  const start = position.clone().addScaledVector(axis, -0.17);
  const end = position.clone().addScaledVector(axis, 0.17);
  const startRadius = radius * 1.45;
  const endRadius = radius * 0.86;
  const railDirections = [
    basis.u,
    basis.u.clone().multiplyScalar(-1),
    basis.v,
    basis.v.clone().multiplyScalar(-1),
  ];

  group.add(outlineRing(start, axis, startRadius, material));
  group.add(outlineRing(end, axis, endRadius, material));
  for (const railDirection of railDirections) {
    group.add(lineBetween(
      start.clone().add(railDirection.clone().multiplyScalar(startRadius)),
      end.clone().add(railDirection.clone().multiplyScalar(endRadius)),
      material,
    ));
  }
  return group;
}

function autoReducerAssembly(reducer, modelPoints, material, style) {
  const THREE = three.module;
  const group = new THREE.Group();
  const joint = modelPoints[reducer.nodeIndex];
  const largeOther = modelPoints[reducer.largeOtherIndex];
  const smallOther = modelPoints[reducer.smallOtherIndex];
  if (!joint || !largeOther || !smallOther) return group;

  const largeDirection = largeOther.clone().sub(joint);
  const smallDirection = smallOther.clone().sub(joint);
  if (largeDirection.length() < 0.0001 || smallDirection.length() < 0.0001) return group;

  largeDirection.normalize();
  smallDirection.normalize();
  const modelLength = Math.max(0.08, reducer.lengthMm / 1000);
  const halfLength = modelLength * 0.5;
  const start = reducer.kind === "tee"
    ? joint.clone().addScaledVector(smallDirection, 0.015)
    : joint.clone().addScaledVector(largeDirection, halfLength);
  const end = reducer.kind === "tee"
    ? joint.clone().addScaledVector(smallDirection, modelLength)
    : joint.clone().addScaledVector(smallDirection, halfLength);
  const startRadius = pipeRadiusMetres(reducer.largeSegment) * 1.18;
  const endRadius = pipeRadiusMetres(reducer.smallSegment) * 0.94;

  const reducerObject = style.lineDrawing
    ? outlineReducerBetween(start, end, startRadius, endRadius, material)
    : taperedCylinderBetween(start, end, startRadius, endRadius, material, 32);
  if (!style.lineDrawing) {
    reducerObject.castShadow = true;
  }
  group.add(reducerObject);
  return group;
}

function outlineReducerBetween(start, end, startRadius, endRadius, material) {
  const THREE = three.module;
  const group = new THREE.Group();
  const axis = end.clone().sub(start);
  if (axis.length() < 0.0001) return group;
  axis.normalize();
  const basis = radialBasis(axis);
  const railDirections = [
    basis.u,
    basis.u.clone().multiplyScalar(-1),
    basis.v,
    basis.v.clone().multiplyScalar(-1),
  ];

  group.add(outlineRing(start, axis, startRadius, material));
  group.add(outlineRing(end, axis, endRadius, material));
  for (const railDirection of railDirections) {
    group.add(lineBetween(
      start.clone().add(railDirection.clone().multiplyScalar(startRadius)),
      end.clone().add(railDirection.clone().multiplyScalar(endRadius)),
      material,
    ));
  }
  return group;
}

function connectionDirections(position, connected, modelPoints) {
  const directions = [];
  for (const connection of connected) {
    const target = modelPoints[connection.other];
    if (!target) continue;
    const direction = target.clone().sub(position);
    if (direction.length() < 0.0001) continue;
    direction.normalize();
    if ([direction.x, direction.y, direction.z].every(Number.isFinite)) {
      directions.push(direction);
    }
  }
  return directions;
}

function teeNodeAssembly(position, connected, modelPoints, radius, material) {
  const THREE = three.module;
  const group = new THREE.Group();
  const directions = connectionDirections(position, connected, modelPoints);
  const mainPair = mostOppositeDirectionPair(directions);
  const length = Math.max(radius * 3.0, 0.16);

  if (mainPair) {
    const main = cylinderBetween(
      position.clone().addScaledVector(mainPair[0], length),
      position.clone().addScaledVector(mainPair[1], length),
      radius * 1.08,
      material,
      28,
    );
    main.castShadow = true;
    main.receiveShadow = true;
    group.add(main);
  }

  for (const direction of directions) {
    if (mainPair && (direction === mainPair[0] || direction === mainPair[1])) continue;
    const branch = cylinderBetween(
      position.clone().addScaledVector(direction, -radius * 0.12),
      position.clone().addScaledVector(direction, length),
      radius * 1.08,
      material,
      28,
    );
    branch.castShadow = true;
    branch.receiveShadow = true;
    group.add(branch);
  }

  const core = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.05, 24, 16), material);
  core.position.copy(position);
  core.castShadow = true;
  core.receiveShadow = true;
  group.add(core);

  return group;
}

function outlineTeeMarker(position, connected, modelPoints, radius, material) {
  const THREE = three.module;
  const group = new THREE.Group();
  const directions = connectionDirections(position, connected, modelPoints);
  const mainPair = mostOppositeDirectionPair(directions);
  const length = Math.max(radius * 3.8, 0.2);
  const pipeRadius = radius * 1.08;

  if (mainPair) {
    group.add(outlinePipeBetween(
      position.clone().addScaledVector(mainPair[0], length),
      position.clone().addScaledVector(mainPair[1], length),
      pipeRadius,
      material,
    ));
  }

  for (const direction of directions) {
    if (mainPair && (direction === mainPair[0] || direction === mainPair[1])) continue;
    const branchStart = position.clone().addScaledVector(direction, pipeRadius * 0.42);
    const branchEnd = position.clone().addScaledVector(direction, length);

    group.add(outlineRing(branchStart, direction, pipeRadius * 1.03, material));
    group.add(outlinePipeBetween(
      branchStart,
      branchEnd,
      pipeRadius,
      material,
      { endCap: true },
    ));
  }

  return group;
}

function branchNodeAssembly(nodeIndex, position, connected, modelPoints, segmentData, material) {
  const THREE = three.module;
  const group = new THREE.Group();
  const info = branchNodeInfo(nodeIndex, connected, segmentData);
  const branchSegmentIndexes = new Set((info?.branchEntries ?? []).map((entry) => entry.segment.index));
  if (!branchSegmentIndexes.size) return group;
  const segmentByIndex = new Map(segmentData.map((segment) => [segment.index, segment]));

  for (const connection of connected) {
    if (!branchSegmentIndexes.has(connection.segmentIndex)) continue;
    const segment = segmentByIndex.get(connection.segmentIndex);
    const target = modelPoints[connection.other];
    if (!segment || !target) continue;

    const direction = target.clone().sub(position);
    if (direction.length() < 0.0001) continue;
    direction.normalize();
    const radius = pipeRadiusMetres(segment);
    const collarLength = Math.max(radius * 3.2, 0.08);
    const collar = cylinderBetween(
      position.clone().addScaledVector(direction, -radius * 0.18),
      position.clone().addScaledVector(direction, collarLength),
      radius * 1.14,
      material,
      24,
    );
    collar.castShadow = true;
    collar.receiveShadow = true;
    group.add(collar);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 1.18, Math.max(radius * 0.12, 0.004), 8, 28),
      material,
    );
    ring.position.copy(position).addScaledVector(direction, radius * 0.1);
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
    ring.castShadow = true;
    ring.receiveShadow = true;
    group.add(ring);
  }

  return group;
}

function outlineBranchMarker(nodeIndex, position, connected, modelPoints, segmentData, material) {
  const group = new three.module.Group();
  const info = branchNodeInfo(nodeIndex, connected, segmentData);
  const branchSegmentIndexes = new Set((info?.branchEntries ?? []).map((entry) => entry.segment.index));
  if (!branchSegmentIndexes.size) return group;
  const segmentByIndex = new Map(segmentData.map((segment) => [segment.index, segment]));

  for (const connection of connected) {
    if (!branchSegmentIndexes.has(connection.segmentIndex)) continue;
    const segment = segmentByIndex.get(connection.segmentIndex);
    const target = modelPoints[connection.other];
    if (!segment || !target) continue;

    const direction = target.clone().sub(position);
    if (direction.length() < 0.0001) continue;
    direction.normalize();
    const radius = pipeRadiusMetres(segment);
    const length = Math.max(radius * 3.6, 0.11);
    const start = position.clone().addScaledVector(direction, radius * 0.22);
    const end = position.clone().addScaledVector(direction, length);
    group.add(outlineRing(start, direction, radius * 1.18, material));
    group.add(outlinePipeBetween(start, end, radius * 1.1, material, { endCap: true }));
  }

  return group;
}

function mostOppositeDirectionPair(directions) {
  if (directions.length < 2) return null;

  let best = null;
  let bestDot = Infinity;
  for (let i = 0; i < directions.length; i += 1) {
    for (let j = i + 1; j < directions.length; j += 1) {
      const dot = directions[i].dot(directions[j]);
      if (dot < bestDot) {
        bestDot = dot;
        best = [directions[i], directions[j]];
      }
    }
  }
  return best;
}

function outlineRing(position, direction, radius, material) {
  const THREE = three.module;
  const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
  const points = curve.getPoints(36).map((point) => new THREE.Vector3(point.x, point.y, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const ring = new THREE.LineLoop(geometry, material);
  ring.position.copy(position);
  ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.clone().normalize());
  return ring;
}

function flangeAssembly(position, direction, pipeRadius, nominalBore, flangeMode, materials) {
  const THREE = three.module;
  const axis = direction.clone().normalize();
  const boltCount = boltCountForNb(nominalBore);
  const isSingle = normalizeFlangeMode(flangeMode) === "single";
  const plateThickness = clampNumber(pipeRadius * 0.42, 0.045, 0.14);
  const gasketThickness = clampNumber(plateThickness * 0.32, 0.018, 0.038);
  const plateOffset = plateThickness * 0.62 + gasketThickness * 0.5;
  const totalHalfDepth = isSingle ? plateThickness * 0.58 : plateOffset + plateThickness * 0.52;
  const outerRadius = pipeRadius * 2.15;
  const innerRadius = pipeRadius * 1.07;
  const boltCircleRadius = pipeRadius * 1.58;
  const boltHoleRadius = clampNumber(pipeRadius * 0.15, 0.018, 0.05);
  const boltBodyRadius = boltHoleRadius * 0.62;
  const boltHeadRadius = boltHoleRadius * 1.18;
  const boltHeadDepth = clampNumber(plateThickness * 0.26, 0.018, 0.04);
  const basis = radialBasis(axis);
  const group = new THREE.Group();

  const plateCenters = isSingle ? [position.clone()] : [-1, 1].map((side) => position.clone().addScaledVector(axis, side * plateOffset));
  for (const plateCenter of plateCenters) {
    group.add(
      flangePlate(
        plateCenter,
        axis,
        outerRadius,
        innerRadius,
        plateThickness,
        boltCount,
        boltCircleRadius,
        boltHoleRadius,
        materials.flange,
      ),
    );
  }

  if (isSingle) {
    group.add(
      flangePlate(
        position,
        axis,
        pipeRadius * 1.38,
        pipeRadius * 1.06,
        boltHeadDepth,
        0,
        0,
        0,
        materials.flange,
      ),
    );
  } else {
    for (const side of [-1, 1]) {
      const faceCenter = position.clone().addScaledVector(axis, side * (totalHalfDepth + boltHeadDepth * 0.5));
      group.add(
        flangePlate(
          faceCenter,
          axis,
          pipeRadius * 1.38,
          pipeRadius * 1.06,
          boltHeadDepth,
          0,
          0,
          0,
          materials.flange,
        ),
      );
    }

    group.add(
      flangePlate(
        position,
        axis,
        pipeRadius * 1.82,
        pipeRadius * 1.05,
        gasketThickness,
        0,
        0,
        0,
        materials.gasket,
      ),
    );
  }

  for (let index = 0; index < boltCount; index += 1) {
    const angle = (Math.PI * 2 * index) / boltCount;
    const radialOffset = basis.u.clone().multiplyScalar(Math.cos(angle) * boltCircleRadius)
      .add(basis.v.clone().multiplyScalar(Math.sin(angle) * boltCircleRadius));
    const boltCenter = position.clone().add(radialOffset);
    const boltStart = boltCenter.clone().addScaledVector(axis, -totalHalfDepth - boltHeadDepth);
    const boltEnd = boltCenter.clone().addScaledVector(axis, totalHalfDepth + boltHeadDepth);
    const bolt = cylinderBetween(boltStart, boltEnd, boltBodyRadius, materials.bolt, 12);
    bolt.castShadow = true;
    group.add(bolt);

    for (const side of [-1, 1]) {
      const headCenter = boltCenter.clone().addScaledVector(axis, side * (totalHalfDepth + boltHeadDepth * 0.42));
      const head = cylinderBetween(
        headCenter.clone().addScaledVector(axis, -side * boltHeadDepth * 0.45),
        headCenter.clone().addScaledVector(axis, side * boltHeadDepth * 0.45),
        boltHeadRadius,
        materials.bolt,
        12,
      );
      head.castShadow = true;
      group.add(head);
    }
  }

  return group;
}

function flangePlate(position, direction, outerRadius, innerRadius, thickness, boltCount, boltCircleRadius, boltHoleRadius, material) {
  const THREE = three.module;
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

  const pipeHole = new THREE.Path();
  pipeHole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(pipeHole);

  for (let index = 0; index < boltCount; index += 1) {
    const angle = (Math.PI * 2 * index) / boltCount;
    const boltHole = new THREE.Path();
    boltHole.absarc(
      Math.cos(angle) * boltCircleRadius,
      Math.sin(angle) * boltCircleRadius,
      boltHoleRadius,
      0,
      Math.PI * 2,
      true,
    );
    shape.holes.push(boltHole);
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: false,
    curveSegments: 48,
    steps: 1,
  });
  geometry.translate(0, 0, -thickness / 2);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.clone().normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function radialBasis(direction) {
  const THREE = three.module;
  const axis = direction.clone().normalize();
  const reference = Math.abs(axis.z) > 0.82 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1);
  const u = reference.clone().cross(axis).normalize();
  const v = axis.clone().cross(u).normalize();
  return { u, v };
}

function boltCountForNb(nominalBore) {
  const match = FLANGE_BOLT_COUNTS.find((item) => nominalBore <= item.maxNb);
  return match ? match.count : FLANGE_BOLT_COUNTS[FLANGE_BOLT_COUNTS.length - 1].count;
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function taperedCylinderBetween(start, end, startRadius, endRadius, material, radialSegments) {
  const THREE = three.module;
  const direction = end.clone().sub(start);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(endRadius, startRadius, length, radialSegments, 1);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function liftPointMarker3d(position, style) {
  const THREE = three.module;
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: 0xc1121f });
  const length = 0.2;
  group.add(lineBetween(
    position.clone().add(new THREE.Vector3(-length, -length, 0)),
    position.clone().add(new THREE.Vector3(length, length, 0)),
    material,
  ));
  group.add(lineBetween(
    position.clone().add(new THREE.Vector3(length, -length, 0)),
    position.clone().add(new THREE.Vector3(-length, length, 0)),
    material,
  ));
  group.add(lineBetween(
    position.clone().add(new THREE.Vector3(-length, 0, -length)),
    position.clone().add(new THREE.Vector3(length, 0, length)),
    material,
  ));
  group.add(lineBetween(
    position.clone().add(new THREE.Vector3(length, 0, -length)),
    position.clone().add(new THREE.Vector3(-length, 0, length)),
    material,
  ));
  return group;
}

function lugPointMarker3d(position, style) {
  const THREE = three.module;
  const group = new THREE.Group();
  const color = 0x0f766e;

  if (style.lineDrawing) {
    const material = new THREE.LineBasicMaterial({ color });
    const size = 0.16;
    const points = [
      position.clone().add(new THREE.Vector3(0, -size, 0)),
      position.clone().add(new THREE.Vector3(size, 0, 0)),
      position.clone().add(new THREE.Vector3(0, size, 0)),
      position.clone().add(new THREE.Vector3(-size, 0, 0)),
      position.clone().add(new THREE.Vector3(0, -size, 0)),
    ];
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
    return group;
  }

  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.32,
    roughness: 0.42,
  });
  const lug = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.06), material);
  lug.position.copy(position);
  lug.rotation.z = Math.PI * 0.25;
  lug.castShadow = true;
  group.add(lug);
  return group;
}

function clear3dPipeLabels() {
  three.labels = [];
  previewLabelLayer.innerHTML = "";
}

function build3dPipeLabels(segmentData, modelPoints) {
  clear3dPipeLabels();
  if (!three.ready) return;

  for (const segment of segmentData) {
    const midpoint = modelPoints[segment.from].clone().lerp(modelPoints[segment.to], 0.5);
    const label = document.createElement("div");
    label.className = "pipe-size-label";
    for (const [index, line] of pipePreviewLabelLines(segment).entries()) {
      const element = document.createElement(index === 0 ? "span" : "small");
      element.textContent = line;
      label.append(element);
    }
    previewLabelLayer.append(label);
    three.labels.push({ element: label, point: midpoint });
  }

  const quantities = quantitySummary(segmentData);
  const liftPoint = centreOfGravityData(quantities);
  if (state.showLiftingPoints && liftPoint) {
    const modelPoint = toModelUnits(liftPoint.point);
    const label = document.createElement("div");
    label.className = "pipe-size-label lift-point-label";
    for (const [index, line] of ["COG", formatPointCompact(liftPoint.point)].entries()) {
      const element = document.createElement(index === 0 ? "span" : "small");
      element.textContent = line;
      label.append(element);
    }
    previewLabelLayer.append(label);
    three.labels.push({ element: label, point: new three.module.Vector3(modelPoint.x, modelPoint.y, modelPoint.z) });
  }
  const lugPlan = suggestedLugPlan(quantities, liftPoint);
  if (state.showLiftingPoints && lugPlan) {
    for (const lug of lugPlan.points) {
      const modelPoint = toModelUnits(lug.point);
      const label = document.createElement("div");
      label.className = "pipe-size-label lug-point-label";
      for (const [index, line] of [`LUG ${lug.number}`, `Run ${lug.segment.index + 1}`, `${formatMass(lug.loadKg ?? 0)} kg`].entries()) {
        const element = document.createElement(index === 0 ? "span" : "small");
        element.textContent = line;
        label.append(element);
      }
      previewLabelLayer.append(label);
      three.labels.push({ element: label, point: new three.module.Vector3(modelPoint.x, modelPoint.y, modelPoint.z) });
    }
  }

  update3dLabelPositions();
}

function pipePreviewLabelLines(segment) {
  const lines = [`NB ${pipeSizeForSegment(segment).nb} ${pipeSpec().schedule}`];
  if (state.showDimensions) {
    const quantity = segmentQuantity(segment);
    lines.push(`Cut ${formatLength(quantity.cutLengthMm)} mm`);
  }
  return lines;
}

function update3dLabelPositions() {
  if (!three.ready || !three.labels.length) return;

  const rect = previewStage.getBoundingClientRect();
  for (const label of three.labels) {
    const projected = label.point.clone().project(three.camera);
    const visible = projected.z > -1 && projected.z < 1;
    label.element.hidden = !visible;
    if (!visible) continue;
    label.element.style.left = `${(projected.x * 0.5 + 0.5) * rect.width}px`;
    label.element.style.top = `${(-projected.y * 0.5 + 0.5) * rect.height}px`;
  }
}

function curvedElbowBetween(entry, joint, exit, radius, material, radialSegments = 32) {
  const THREE = three.module;
  const curve = new THREE.QuadraticBezierCurve3(entry, joint, exit);
  const geometry = new THREE.TubeGeometry(curve, 28, radius, radialSegments, false);
  return new THREE.Mesh(geometry, material);
}

function nodeConnections(segmentData) {
  const connections = new Map();
  for (const segment of segmentData) {
    for (const [node, other] of [[segment.from, segment.to], [segment.to, segment.from]]) {
      if (!connections.has(node)) connections.set(node, []);
      connections.get(node).push({ segmentIndex: segment.index, other });
    }
  }
  return connections;
}

function computeGraphElbowTrims(modelPoints, segmentData, connections) {
  const segmentTrims = new Map();
  const elbows = [];
  const smoothNodes = new Set();
  const segmentByIndex = new Map(segmentData.map((segment) => [segment.index, segment]));

  for (const [nodeIndex, connected] of connections.entries()) {
    if (connected.length !== 2) continue;

    const joint = modelPoints[nodeIndex];
    const first = connected[0];
    const second = connected[1];
    const firstSegment = segmentByIndex.get(first.segmentIndex);
    const secondSegment = segmentByIndex.get(second.segmentIndex);
    if (!firstSegment || !secondSegment) continue;
    const radius = Math.max(pipeRadiusMetres(firstSegment), pipeRadiusMetres(secondSegment));

    const firstDirection = modelPoints[first.other].clone().sub(joint);
    const secondDirection = modelPoints[second.other].clone().sub(joint);
    const firstLength = firstDirection.length();
    const secondLength = secondDirection.length();
    if (firstLength < 0.001 || secondLength < 0.001) continue;

    const angle = firstDirection.clone().normalize().angleTo(secondDirection.clone().normalize());
    if (Math.abs(Math.PI - angle) < 0.04) continue;

    const trim = Math.min(Math.max(radius * 4.5, 0.12), firstLength * 0.38, secondLength * 0.38);
    const firstUnit = firstDirection.normalize();
    const secondUnit = secondDirection.normalize();
    segmentTrims.set(`${first.segmentIndex}:${nodeIndex}`, trim);
    segmentTrims.set(`${second.segmentIndex}:${nodeIndex}`, trim);
    elbows.push({
      entry: joint.clone().addScaledVector(firstUnit, trim),
      joint: joint.clone(),
      exit: joint.clone().addScaledVector(secondUnit, trim),
      radius,
    });
    smoothNodes.add(nodeIndex);
  }

  return { segment: segmentTrims, elbows, smoothNodes };
}

function radiusForNode(nodeIndex, connections, segmentByIndex) {
  const connected = connections.get(nodeIndex) ?? [];
  if (!connected.length) return pipeRadiusMetres();

  return Math.max(
    ...connected.map((connection) => {
      const segment = segmentByIndex.get(connection.segmentIndex);
      return segment ? pipeRadiusMetres(segment) : pipeRadiusMetres();
    }),
  );
}

function frameThreeCamera() {
  if (!three.ready) return;

  const THREE = three.module;
  const rect = previewStage.getBoundingClientRect();
  const aspect = rect.width / Math.max(1, rect.height);
  const box = new THREE.Box3();

  if (three.spoolGroup && three.spoolGroup.children.length) {
    box.setFromObject(three.spoolGroup);
  } else {
    box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 4, 4));
  }

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 5);
  const halfHeight = maxDim * 0.78;
  const halfWidth = halfHeight * aspect;

  three.camera.left = -halfWidth;
  three.camera.right = halfWidth;
  three.camera.top = halfHeight;
  three.camera.bottom = -halfHeight;
  three.camera.near = 0.1;
  three.camera.far = maxDim * 20 + 100;
  three.camera.position.copy(center).add(new THREE.Vector3(-maxDim * 1.25, -maxDim * 1.25, -maxDim * 1.25));
  three.camera.lookAt(center);
  three.camera.updateProjectionMatrix();

  if (three.controls) {
    three.controls.target.copy(center);
    three.controls.update();
  }
}

function disposeObject3d(object) {
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
}

function renderFallbackPreview() {
  if (fallbackCanvas.hidden) return;

  const style = fallbackPreviewStyle();
  const { ctx, width, height } = resizeCanvas(fallbackCanvas);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = style.background;
  ctx.fillRect(0, 0, width, height);

  const projected = state.points.map(projectPreviewPoint);
  const minX = Math.min(...projected.map((point) => point.x));
  const maxX = Math.max(...projected.map((point) => point.x));
  const minY = Math.min(...projected.map((point) => point.y));
  const maxY = Math.max(...projected.map((point) => point.y));
  const span = Math.max(maxX - minX, maxY - minY, 1);
  const scale = Math.min(width, height) / (span * 1.55);
  const offset = {
    x: width * 0.5 - ((minX + maxX) * 0.5) * scale,
    y: height * 0.55 - ((minY + maxY) * 0.5) * scale,
  };
  const toScreen = (point) => ({
    x: point.x * scale + offset.x,
    y: point.y * scale + offset.y,
    depth: point.depth,
  });

  drawFallbackGrid(ctx, width, height);

  const pipeWidth = Math.max(12, visualPipeWidth() * 1.02);
  const connectionCounts = nodeConnections(segments());
  const fallbackSegments = segments()
    .map((segment) => ({
      ...segment,
      start2: toScreen(projectPreviewPoint(segment.start)),
      end2: toScreen(projectPreviewPoint(segment.end)),
      depth: (projectPreviewPoint(segment.start).depth + projectPreviewPoint(segment.end).depth) * 0.5,
    }))
    .sort((a, b) => a.depth - b.depth);

  ctx.save();
  ctx.lineCap = "butt";
  ctx.lineJoin = "round";

  for (const segment of fallbackSegments) {
    const segmentPipeWidth = Math.max(12, visualPipeWidth(segment) * 1.02);
    drawFallbackPreviewPipe(ctx, segment, segmentPipeWidth, style);

    drawFallbackPipeSizeLabel(ctx, segment, {
      x: (segment.start2.x + segment.end2.x) * 0.5,
      y: (segment.start2.y + segment.end2.y) * 0.5,
    });
  }

  drawFallbackFlushEndCaps(ctx, fallbackSegments, connectionCounts, style);

  for (const fitting of state.fittings) {
    const segment = segments().find((item) => item.index === fitting.segmentIndex);
    if (!segment) continue;
    const start2 = toScreen(projectPreviewPoint(segment.start));
    const end2 = toScreen(projectPreviewPoint(segment.end));
    const point2 = toScreen(projectPreviewPoint(lerpPoint(segment.start, segment.end, fitting.t)));
    drawFitting3dFallback(ctx, fitting, start2, end2, point2, pipeWidth, style);
  }

  drawAutoReducersFallback(ctx, fallbackSegments, connectionCounts, style);
  drawFallbackTeeMarkers(ctx, fallbackSegments, connectionCounts, style, pipeWidth);
  if (state.showLiftingPoints) {
    drawSuggestedLugsFallback(ctx, toScreen, quantitySummary(), style);
    drawFallbackLiftPoint(ctx, toScreen, quantitySummary(), style);
  }

  for (const [index, point] of state.points.entries()) {
    const connectionCount = connectionCounts.get(index)?.length ?? 0;
    if ((connectionCount === 2 || connectionCount >= 3) && index !== activePointIndex()) continue;
    if (connectionCount <= 1 && index !== activePointIndex() && index !== state.selectedPoint) continue;

    const point2 = toScreen(projectPreviewPoint(point));
    ctx.beginPath();
    ctx.fillStyle = style.nodeFill;
    ctx.strokeStyle = style.nodeStroke;
    ctx.lineWidth = 2;
    ctx.arc(point2.x, point2.y, pipeWidth * 0.38, 0, Math.PI * 2);
    if (!style.outline) ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function projectPreviewPoint(point) {
  return {
    x: (point.x - point.y) * ISO_COS,
    y: (point.x + point.y) * ISO_SIN - point.z,
    depth: (point.x + point.y) * ISO_COS + point.z * 0.35,
  };
}

function drawFallbackGrid(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = "rgba(99, 115, 109, 0.16)";
  ctx.lineWidth = 1;
  const spacing = 32;
  for (let x = -width; x < width * 2; x += spacing) {
    drawLine(ctx, { x, y: height * 0.78 }, { x: x + height, y: 0 });
  }
  for (let x = -width; x < width * 2; x += spacing) {
    drawLine(ctx, { x, y: height * 0.78 }, { x: x - height, y: 0 });
  }
  ctx.restore();
}

function fallbackPreviewStyle() {
  const mode = normalizePreviewMode(state.previewMode);
  const stainless = normalizePipeSpec(state.pipeSpec) === "stainless10";
  const carbonStyle = {
    background: "#f8fbfb",
    shadow: "rgba(31, 42, 47, 0.1)",
    pipeStops: ["#22282a", "#596164", "#171b1d"],
    highlight: "rgba(255, 255, 255, 0.56)",
    fittingStroke: "#3f484b",
    fittingFill: "#eef2f0",
    nodeFill: "#4b5355",
    nodeStroke: "#1d2325",
    outline: false,
    ghost: false,
  };
  const stainlessStyle = {
    background: "#fcfefe",
    shadow: "rgba(83, 98, 102, 0.07)",
    pipeStops: ["#d6dee1", "#ffffff", "#c4cdd1"],
    highlight: "rgba(255, 255, 255, 1)",
    fittingStroke: "#aab5b9",
    fittingFill: "#ffffff",
    nodeFill: "#f8fbfb",
    nodeStroke: "#a0abb0",
    outline: false,
    ghost: false,
  };
  const styles = {
    carbon: stainless ? stainlessStyle : carbonStyle,
    black: carbonStyle,
    stainless: stainlessStyle,
    red: {
      background: "#fff8f7",
      shadow: "rgba(127, 29, 29, 0.12)",
      pipeStops: ["#7f1d1d", "#ef4444", "#991b1b"],
      highlight: "rgba(255, 226, 222, 0.72)",
      fittingStroke: "#991b1b",
      fittingFill: "#fee2e2",
      nodeFill: "#ef4444",
      nodeStroke: "#7f1d1d",
      outline: false,
      ghost: false,
    },
    ghost: {
      background: "#f8fbfb",
      shadow: "rgba(31, 42, 47, 0.04)",
      pipeStops: ["rgba(129, 151, 148, 0.34)", "rgba(192, 214, 211, 0.46)", "rgba(104, 123, 121, 0.34)"],
      highlight: "rgba(255, 255, 255, 0.52)",
      fittingStroke: "rgba(82, 102, 99, 0.72)",
      fittingFill: "rgba(238, 242, 240, 0.38)",
      nodeFill: "rgba(129, 151, 148, 0.38)",
      nodeStroke: "rgba(64, 78, 76, 0.65)",
      outline: false,
      ghost: true,
    },
    outline: {
      background: "#fffafa",
      shadow: "rgba(0, 0, 0, 0)",
      pipeStops: ["#c1121f", "#c1121f", "#c1121f"],
      highlight: "#c1121f",
      fittingStroke: "#c1121f",
      fittingFill: "rgba(255, 255, 255, 0)",
      nodeFill: "rgba(255, 255, 255, 0)",
      nodeStroke: "#c1121f",
      outline: true,
      ghost: false,
    },
  };
  return styles[mode] ?? styles.carbon;
}

function drawFallbackPreviewPipe(ctx, segment, segmentPipeWidth, style) {
  if (style.outline) {
    ctx.lineWidth = segmentPipeWidth;
    ctx.strokeStyle = style.pipeStops[0];
    drawLine(ctx, segment.start2, segment.end2);

    ctx.lineWidth = Math.max(2, segmentPipeWidth - 5);
    ctx.strokeStyle = style.background;
    drawLine(ctx, segment.start2, segment.end2);

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = style.pipeStops[0];
    drawLine(ctx, segment.start2, segment.end2);
    return;
  }

  ctx.lineWidth = segmentPipeWidth + 7;
  ctx.strokeStyle = style.shadow;
  drawLine(ctx, { x: segment.start2.x + 4, y: segment.start2.y + 6 }, { x: segment.end2.x + 4, y: segment.end2.y + 6 });

  const gradient = ctx.createLinearGradient(segment.start2.x, segment.start2.y, segment.end2.x, segment.end2.y);
  gradient.addColorStop(0, style.pipeStops[0]);
  gradient.addColorStop(0.52, style.pipeStops[1]);
  gradient.addColorStop(1, style.pipeStops[2]);
  ctx.lineWidth = segmentPipeWidth;
  ctx.strokeStyle = gradient;
  drawLine(ctx, segment.start2, segment.end2);

  ctx.lineWidth = Math.max(2, segmentPipeWidth * 0.18);
  ctx.strokeStyle = style.highlight;
  drawLine(ctx, segment.start2, segment.end2);
}

function drawFallbackFlushEndCaps(ctx, fallbackSegments, connections, style) {
  ctx.save();
  ctx.lineCap = "butt";
  ctx.strokeStyle = style.pipeStops[0];

  for (const segment of fallbackSegments) {
    const segmentPipeWidth = Math.max(12, visualPipeWidth(segment) * 1.02);
    const capLineWidth = style.outline ? 2.5 : Math.max(2, segmentPipeWidth * 0.2);
    const capHalf = style.outline ? segmentPipeWidth * 0.52 : segmentPipeWidth * 0.52;

    for (const [nodeIndex, point, other] of [[segment.from, segment.start2, segment.end2], [segment.to, segment.end2, segment.start2]]) {
      if ((connections.get(nodeIndex)?.length ?? 0) !== 1) continue;
      const angle = Math.atan2(point.y - other.y, point.x - other.x);
      const normal = { x: -Math.sin(angle), y: Math.cos(angle) };

      ctx.lineWidth = capLineWidth;
      drawLine(
        ctx,
        { x: point.x + normal.x * capHalf, y: point.y + normal.y * capHalf },
        { x: point.x - normal.x * capHalf, y: point.y - normal.y * capHalf },
      );
    }
  }

  ctx.restore();
}

function drawAutoReducersFallback(ctx, fallbackSegments, connections, style) {
  const reducerData = autoReducerTransitions(segments());
  if (!reducerData.length) return;

  const screenSegments = new Map(fallbackSegments.map((segment) => [segment.index, segment]));
  ctx.save();
  ctx.lineCap = "butt";
  ctx.lineJoin = "round";
  ctx.strokeStyle = style.fittingStroke;
  ctx.fillStyle = style.fittingFill;
  ctx.lineWidth = style.outline ? 3 : 4;

  for (const reducer of reducerData) {
    const largeSegment = screenSegments.get(reducer.largeSegment.index);
    const smallSegment = screenSegments.get(reducer.smallSegment.index);
    const firstSegment = screenSegments.get(reducer.firstSegmentIndex);
    if (!largeSegment || !smallSegment || !firstSegment) continue;

    const joint = firstSegment.from === reducer.nodeIndex ? firstSegment.start2 : firstSegment.end2;
    const largeOther = largeSegment.from === reducer.nodeIndex ? largeSegment.end2 : largeSegment.start2;
    const smallOther = smallSegment.from === reducer.nodeIndex ? smallSegment.end2 : smallSegment.start2;
    const along = reducer.kind === "tee"
      ? normalizeScreenVector({ x: smallOther.x - joint.x, y: smallOther.y - joint.y })
      : normalizeScreenVector({ x: smallOther.x - largeOther.x, y: smallOther.y - largeOther.y });
    const normal = { x: -along.y, y: along.x };
    const length = 30;
    const largeWidth = Math.max(14, visualPipeWidth(reducer.largeSegment) * 1.25);
    const smallWidth = Math.max(8, visualPipeWidth(reducer.smallSegment) * 0.82);
    const start = reducer.kind === "tee"
      ? { x: joint.x + along.x * 2, y: joint.y + along.y * 2 }
      : { x: joint.x - along.x * length * 0.5, y: joint.y - along.y * length * 0.5 };
    const end = reducer.kind === "tee"
      ? { x: joint.x + along.x * length, y: joint.y + along.y * length }
      : { x: joint.x + along.x * length * 0.5, y: joint.y + along.y * length * 0.5 };

    ctx.beginPath();
    ctx.moveTo(start.x + normal.x * largeWidth * -0.5, start.y + normal.y * largeWidth * -0.5);
    ctx.lineTo(end.x + normal.x * smallWidth * -0.5, end.y + normal.y * smallWidth * -0.5);
    ctx.lineTo(end.x + normal.x * smallWidth * 0.5, end.y + normal.y * smallWidth * 0.5);
    ctx.lineTo(start.x + normal.x * largeWidth * 0.5, start.y + normal.y * largeWidth * 0.5);
    ctx.closePath();
    if (!style.outline) ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawFallbackLiftPoint(ctx, toScreen, quantities, style) {
  const liftPoint = centreOfGravityData(quantities);
  if (!liftPoint) return;

  const point = toScreen(projectPreviewPoint(liftPoint.point));

  ctx.save();
  ctx.strokeStyle = "#c1121f";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(point.x - 11, point.y - 11);
  ctx.lineTo(point.x + 11, point.y + 11);
  ctx.moveTo(point.x + 11, point.y - 11);
  ctx.lineTo(point.x - 11, point.y + 11);
  ctx.stroke();

  ctx.font = "900 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 5;
  ctx.strokeStyle = style.background;
  ctx.fillStyle = "#c1121f";
  ctx.strokeText("COG", point.x, point.y - 24);
  ctx.fillText("COG", point.x, point.y - 24);
  ctx.restore();
}

function drawSuggestedLugsFallback(ctx, toScreen, quantities, style) {
  const lugPlan = suggestedLugPlan(quantities);
  if (!lugPlan) return;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 11px Inter, system-ui, sans-serif";

  for (const lug of lugPlan.points) {
    const point = toScreen(projectPreviewPoint(lug.point));
    ctx.fillStyle = style.outline ? "rgba(255, 255, 255, 0)" : "#d8f1ed";
    ctx.strokeStyle = "#0f766e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y - 11);
    ctx.lineTo(point.x + 11, point.y);
    ctx.lineTo(point.x, point.y + 11);
    ctx.lineTo(point.x - 11, point.y);
    ctx.closePath();
    if (!style.outline) ctx.fill();
    ctx.stroke();

    const label = `LUG ${lug.number}`;
    ctx.lineWidth = 5;
    ctx.strokeStyle = style.background;
    ctx.fillStyle = "#0f766e";
    ctx.strokeText(label, point.x, point.y - 25);
    ctx.fillText(label, point.x, point.y - 25);
  }

  ctx.restore();
}

function drawFallbackTeeMarkers(ctx, fallbackSegments, connections, style, pipeWidth) {
  const segmentByIndex = new Map(fallbackSegments.map((segment) => [segment.index, segment]));
  ctx.save();
  ctx.lineCap = "butt";
  ctx.lineJoin = "round";
  ctx.strokeStyle = style.pipeStops[0];
  ctx.lineWidth = style.outline ? 3 : Math.max(7, pipeWidth * 0.48);

  for (const [nodeIndex, connected] of connections.entries()) {
    if (connected.length < 3) continue;
    const firstSegment = segmentByIndex.get(connected[0].segmentIndex);
    if (!firstSegment) continue;
    const joint = firstSegment.from === nodeIndex ? firstSegment.start2 : firstSegment.end2;

    if (nodeConnectionType(nodeIndex) === "branch") {
      const info = branchNodeInfo(nodeIndex, connected, segments());
      const branchSegmentIndexes = new Set((info?.branchEntries ?? []).map((entry) => entry.segment.index));
      ctx.strokeStyle = style.weldStroke ?? style.fittingStroke;
      ctx.lineWidth = style.outline ? 3 : Math.max(3, pipeWidth * 0.22);

      for (const connection of connected) {
        if (!branchSegmentIndexes.has(connection.segmentIndex)) continue;
        const segment = segmentByIndex.get(connection.segmentIndex);
        if (!segment) continue;
        const other = segment.from === nodeIndex ? segment.end2 : segment.start2;
        const vector = normalizeScreenVector({ x: other.x - joint.x, y: other.y - joint.y });
        const normal = { x: -vector.y, y: vector.x };
        const weldHalf = Math.max(7, visualPipeWidth(segment) * 0.68);
        const weldOffset = Math.max(5, visualPipeWidth(segment) * 0.24);
        drawLine(
          ctx,
          { x: joint.x + vector.x * weldOffset + normal.x * -weldHalf, y: joint.y + vector.y * weldOffset + normal.y * -weldHalf },
          { x: joint.x + vector.x * weldOffset + normal.x * weldHalf, y: joint.y + vector.y * weldOffset + normal.y * weldHalf },
        );
        drawLine(ctx, joint, { x: joint.x + vector.x * 22, y: joint.y + vector.y * 22 });
      }

      ctx.strokeStyle = style.pipeStops[0];
      ctx.lineWidth = style.outline ? 3 : Math.max(7, pipeWidth * 0.48);
      continue;
    }

    for (const connection of connected) {
      const segment = segmentByIndex.get(connection.segmentIndex);
      if (!segment) continue;
      const other = segment.from === nodeIndex ? segment.end2 : segment.start2;
      const vector = normalizeScreenVector({ x: other.x - joint.x, y: other.y - joint.y });
      drawLine(
        ctx,
        { x: joint.x - vector.x * 2, y: joint.y - vector.y * 2 },
        { x: joint.x + vector.x * 24, y: joint.y + vector.y * 24 },
      );
    }

    if (!style.outline) {
      ctx.strokeStyle = style.highlight;
      ctx.lineWidth = Math.max(2, pipeWidth * 0.16);
      for (const connection of connected) {
        const segment = segmentByIndex.get(connection.segmentIndex);
        if (!segment) continue;
        const other = segment.from === nodeIndex ? segment.end2 : segment.start2;
        const vector = normalizeScreenVector({ x: other.x - joint.x, y: other.y - joint.y });
        drawLine(ctx, joint, { x: joint.x + vector.x * 20, y: joint.y + vector.y * 20 });
      }
      ctx.strokeStyle = style.pipeStops[0];
      ctx.lineWidth = Math.max(7, pipeWidth * 0.48);
    }
  }

  ctx.restore();
}

function drawFitting3dFallback(ctx, fitting, start, end, point, pipeWidth, style = fallbackPreviewStyle()) {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const along = { x: Math.cos(angle), y: Math.sin(angle) };
  const normal = { x: -Math.sin(angle), y: Math.cos(angle) };

  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.strokeStyle = style.fittingStroke;
  ctx.fillStyle = style.fittingFill;
  ctx.lineWidth = 4;

  if (fitting.type === "valve") {
    ctx.beginPath();
    ctx.moveTo(along.x * -14, along.y * -14);
    ctx.lineTo(normal.x * 16, normal.y * 16);
    ctx.lineTo(along.x * 14, along.y * 14);
    ctx.lineTo(normal.x * -16, normal.y * -16);
    ctx.closePath();
    if (!style.outline) ctx.fill();
    ctx.stroke();
  } else if (fitting.type === "reducer") {
    ctx.beginPath();
    ctx.moveTo(along.x * -15 + normal.x * pipeWidth * -0.7, along.y * -15 + normal.y * pipeWidth * -0.7);
    ctx.lineTo(along.x * 15 + normal.x * pipeWidth * -0.38, along.y * 15 + normal.y * pipeWidth * -0.38);
    ctx.lineTo(along.x * 15 + normal.x * pipeWidth * 0.38, along.y * 15 + normal.y * pipeWidth * 0.38);
    ctx.lineTo(along.x * -15 + normal.x * pipeWidth * 0.7, along.y * -15 + normal.y * pipeWidth * 0.7);
    ctx.closePath();
    if (!style.outline) ctx.fill();
    ctx.stroke();
  } else if (fitting.type === "flange") {
    const offsets = fittingFlangeMode(fitting) === "single" ? [0] : [-8, 8];
    for (const offset of offsets) {
      ctx.beginPath();
      ctx.moveTo(along.x * offset + normal.x * pipeWidth * -0.8, along.y * offset + normal.y * pipeWidth * -0.8);
      ctx.lineTo(along.x * offset + normal.x * pipeWidth * 0.8, along.y * offset + normal.y * pipeWidth * 0.8);
      ctx.stroke();
    }
    ctx.fillStyle = style.nodeStroke;
    for (const offset of offsets) {
      for (const side of [-0.52, 0.52]) {
        ctx.beginPath();
        ctx.arc(along.x * offset + normal.x * pipeWidth * side, along.y * offset + normal.y * pipeWidth * side, 2.5, 0, Math.PI * 2);
        if (style.outline) ctx.stroke();
        else ctx.fill();
      }
    }
  } else {
    const offsets = [-4, 4];
    for (const offset of offsets) {
      ctx.beginPath();
      ctx.moveTo(along.x * offset + normal.x * pipeWidth * -0.72, along.y * offset + normal.y * pipeWidth * -0.72);
      ctx.lineTo(along.x * offset + normal.x * pipeWidth * 0.72, along.y * offset + normal.y * pipeWidth * 0.72);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawFallbackPipeSizeLabel(ctx, segment, point) {
  const lines = pipePreviewLabelLines(segment);
  ctx.save();
  ctx.font = "900 11px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const width = Math.max(...lines.map((line) => ctx.measureText(line).width)) + 12;
  const height = lines.length > 1 ? 31 : 20;
  roundRect(ctx, point.x - width / 2, point.y - height / 2 - 18, width, height, 5);
  ctx.fillStyle = "rgba(255, 253, 248, 0.92)";
  ctx.strokeStyle = "rgba(31, 42, 47, 0.18)";
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#263538";
  if (lines.length === 1) {
    ctx.fillText(lines[0], point.x, point.y - 18);
  } else {
    ctx.fillText(lines[0], point.x, point.y - 23);
    ctx.font = "800 10px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#667077";
    ctx.fillText(lines[1], point.x, point.y - 11);
  }
  ctx.restore();
}

function downloadCanvas(canvas, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function downloadTextFile(text, filename, type = "application/json") {
  const blob = new Blob([text], { type });
  const link = document.createElement("a");
  link.download = filename;
  link.href = URL.createObjectURL(blob);
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function safeFilePart(value, fallback) {
  const cleaned = String(value ?? "")
    .trim()
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}

function exportProjectFile() {
  const project = normalizeProjectInfo(state.projectInfo);
  const stamp = new Date().toISOString().slice(0, 10);
  const name = [
    safeFilePart(project.jobNumber, "job"),
    safeFilePart(project.spoolNumber, "spool"),
    stamp,
  ].join("-");
  const payload = {
    app: "IsoSpool Studio",
    fileVersion: PROJECT_FILE_VERSION,
    exportedAt: new Date().toISOString(),
    state: statePayload(),
  };
  downloadTextFile(JSON.stringify(payload, null, 2), `${name}.isospool.json`);
}

function importProjectFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const payload = JSON.parse(String(reader.result ?? ""));
      const restored = stateFromPayload(payload);
      if (!restored) {
        window.alert("That file does not look like an IsoSpool project.");
        return;
      }

      state = restored;
      setNextIdsFromState(state);
      updateControls();
      updateAll();
      window.alert("Project imported.");
    } catch {
      window.alert("Could not import that project file.");
    }
  });
  reader.readAsText(file);
}

function export3dImage() {
  if (three.ready) {
    three.renderer.render(three.scene, three.camera);
    downloadCanvas(threeCanvas, "pipe-spool-3d.png");
    return;
  }
  renderFallbackPreview();
  downloadCanvas(fallbackCanvas, "pipe-spool-3d.png");
}

function exportIsoImage() {
  exportSpoolReportImage();
}

function exportSpoolReportImage() {
  const quantities = quantitySummary();
  const rowCount = Math.max(quantities.segments.length, 1);
  const bendCount = Math.max(quantities.elbows.length, 1);
  const teeCount = Math.max(quantities.tees.length, 1);
  const branchCount = Math.max(quantities.branches.length, 1);
  const reducerCount = Math.max(quantities.reducers.length, 1);
  const fittingCount = Math.max(quantities.fittings.length, 1);
  const canvas = document.createElement("canvas");
  canvas.width = 1800;
  canvas.height = Math.max(1180, 910 + rowCount * 34 + bendCount * 28 + teeCount * 28 + branchCount * 28 + reducerCount * 28 + fittingCount * 24);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f7f3e9";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawReportHeader(ctx, canvas.width);

  const margin = 36;
  const gutter = 28;
  const reportWidth = 600;
  const drawingArea = {
    x: margin,
    y: 118,
    width: canvas.width - margin * 2 - gutter - reportWidth,
    height: canvas.height - 154,
  };
  const reportArea = {
    x: drawingArea.x + drawingArea.width + gutter,
    y: drawingArea.y,
    width: reportWidth,
    height: drawingArea.height,
  };

  drawReportDrawing(ctx, drawingArea);
  drawReportTakeoff(ctx, reportArea, quantities);
  downloadCanvas(canvas, "pipe-spool-cut-list.png");
}

function drawReportHeader(ctx, width) {
  const project = normalizeProjectInfo(state.projectInfo);
  const reference = [
    project.jobNumber ? `Job ${project.jobNumber}` : "",
    project.spoolNumber ? `Spool ${project.spoolNumber}` : "",
    project.revision ? `Rev ${project.revision}` : "",
    project.client,
  ].filter(Boolean).join("  |  ");

  ctx.save();
  ctx.fillStyle = "#1f3438";
  ctx.font = "900 34px Inter, system-ui, sans-serif";
  ctx.fillText("Pipe spool fabrication sheet", 36, 56);
  ctx.font = "800 14px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#6a7475";
  ctx.fillText(`Centre-to-centre drawing, cut lengths and estimated ${pipeSpec().material.toLowerCase()} weight`, 38, 82);
  if (reference) {
    ctx.fillText(reference, 38, 104);
  }
  ctx.textAlign = "right";
  ctx.fillText(new Date().toLocaleString(), width - 36, 56);
  if (project.drawnBy) {
    ctx.fillText(`Drawn by ${project.drawnBy}`, width - 36, 82);
  }
  ctx.restore();
}

function drawReportDrawing(ctx, area) {
  const saved = {
    gridScale: state.gridScale,
    showDimensions: state.showDimensions,
    selectedSegments: [...state.selectedSegments],
    selectedSegment: state.selectedSegment,
    selectedFitting: state.selectedFitting,
    selectedNote: state.selectedNote,
    selectedPoint: state.selectedPoint,
    hoveredSegment: state.hoveredSegment,
    activeTool: state.activeTool,
    previewCandidate: state.previewCandidate,
    pointer: state.pointer,
  };

  const scale = reportIsoScale(area.width, area.height);
  const projection = reportProjection(area.width, area.height, scale);

  try {
    state.gridScale = scale;
    state.showDimensions = true;
    state.selectedSegments = [];
    state.selectedSegment = null;
    state.selectedFitting = null;
    state.selectedNote = null;
    state.selectedPoint = null;
    state.hoveredSegment = null;
    state.activeTool = "select";
    state.previewCandidate = null;
    state.pointer = null;

    ctx.save();
    roundRect(ctx, area.x, area.y, area.width, area.height, 10);
    ctx.fillStyle = "#f7f3e9";
    ctx.fill();
    ctx.strokeStyle = "rgba(31, 42, 47, 0.18)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.clip();
    ctx.translate(area.x, area.y);
    drawGrid(ctx, area.width, area.height, projection);
    drawSpool2d(ctx, projection);
    drawNotes2d(ctx, projection);
    if (state.showLiftingPoints) {
      drawSuggestedLugs2d(ctx, projection);
      drawLiftPoint2d(ctx, projection);
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#31454c";
    ctx.font = "900 16px Inter, system-ui, sans-serif";
    ctx.fillText("2D isometric drawing", area.x + 18, area.y + 28);
    ctx.restore();
  } finally {
    state.gridScale = saved.gridScale;
    state.showDimensions = saved.showDimensions;
    state.selectedSegments = saved.selectedSegments;
    state.selectedSegment = saved.selectedSegment;
    state.selectedFitting = saved.selectedFitting;
    state.selectedNote = saved.selectedNote;
    state.selectedPoint = saved.selectedPoint;
    state.hoveredSegment = saved.hoveredSegment;
    state.activeTool = saved.activeTool;
    state.previewCandidate = saved.previewCandidate;
    state.pointer = saved.pointer;
  }
}

function reportIsoScale(width, height) {
  const rawPoints = reportRelevantPoints().map((point) => rawIso(point, 1));
  const minX = Math.min(...rawPoints.map((point) => point.x));
  const maxX = Math.max(...rawPoints.map((point) => point.x));
  const minY = Math.min(...rawPoints.map((point) => point.y));
  const maxY = Math.max(...rawPoints.map((point) => point.y));
  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);
  return Math.min(82, Math.max(6, Math.min((width - 120) / spanX, (height - 130) / spanY)));
}

function reportProjection(width, height, scale) {
  const rawPoints = reportRelevantPoints().map((point) => rawIso(point, scale));
  const minX = Math.min(...rawPoints.map((point) => point.x));
  const maxX = Math.max(...rawPoints.map((point) => point.x));
  const minY = Math.min(...rawPoints.map((point) => point.y));
  const maxY = Math.max(...rawPoints.map((point) => point.y));
  return {
    offsetX: width * 0.5 - (minX + maxX) * 0.5,
    offsetY: height * 0.55 - (minY + maxY) * 0.5,
  };
}

function reportRelevantPoints() {
  return [...state.points, ...state.notes.map((note) => note.point)];
}

function drawReportTakeoff(ctx, area, quantities) {
  ctx.save();
  roundRect(ctx, area.x, area.y, area.width, area.height, 10);
  ctx.fillStyle = "#fffdf8";
  ctx.fill();
  ctx.strokeStyle = "rgba(31, 42, 47, 0.18)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const x = area.x + 24;
  let y = area.y + 36;
  ctx.fillStyle = "#1f3438";
  ctx.font = "900 24px Inter, system-ui, sans-serif";
  ctx.fillText("Cut list", x, y);
  y += 30;

  y = drawReportTotals(ctx, x, y, area.width - 48, quantities);
  y += 18;
  if (state.showLiftingPoints) {
    y = drawReportLiftPoint(ctx, x, y, area.width - 48, quantities);
    y += 18;
    y = drawReportLugPlan(ctx, x, y, area.width - 48, quantities);
    y += 18;
  }
  y = drawReportRunTable(ctx, x, y, area.width - 48, quantities);
  y += 22;
  y = drawReportBendNotes(ctx, x, y, area.width - 48, quantities);
  y += 14;
  y = drawReportTeeNotes(ctx, x, y, area.width - 48, quantities);
  y += 14;
  y = drawReportBranchNotes(ctx, x, y, area.width - 48, quantities);
  y += 14;
  y = drawReportReducerNotes(ctx, x, y, area.width - 48, quantities);
  y += 14;
  y = drawReportFittingNotes(ctx, x, y, area.width - 48, quantities);

  ctx.fillStyle = "#6b7475";
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  drawWrappedReportText(
    ctx,
    state.showLiftingPoints
      ? `${pipeSpec().label} pipe. Tee/elbow/reducer Atlas table weights used where available; branch welds, valves and weld allowances are estimated unless manually set. Verify lug design, welds, sling angles and ratings before lifting.`
      : `${pipeSpec().label} pipe. Tee/elbow/reducer Atlas table weights used where available; branch welds, valves and weld allowances are estimated unless manually set.`,
    x,
    area.y + area.height - 36,
    area.width - 48,
    14,
  );
  ctx.restore();
}

function drawReportTotals(ctx, x, y, width, quantities) {
  const totals = [
    ["Centreline", `${formatLength(quantities.centrelineMm)} mm`],
    ["Deductions", `${formatLength(quantities.bendTakeoffMm)} mm`],
    ["Cut pipe", `${formatLength(quantities.cutLengthMm)} mm`],
    ["Pipe weight", `${formatMass(quantities.pipeWeightKg)} kg`],
    ["Elbow weight", `${formatMass(quantities.bendWeightKg)} kg`],
    ["Tee weight", `${formatMass(quantities.teeWeightKg)} kg`],
    ["Branch weight", `${formatMass(quantities.branchWeightKg)} kg`],
    ["Reducer weight", `${formatMass(quantities.reducerWeightKg)} kg`],
    ["Fitting weight", `${formatMass(quantities.fittingWeightKg)} kg`],
    ["Total est.", `${formatMass(quantities.totalWeightKg)} kg`],
  ];
  const columnWidth = (width - 12) / 2;
  const rowHeight = 54;

  for (const [index, total] of totals.entries()) {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const cardX = x + col * (columnWidth + 12);
    const cardY = y + row * (rowHeight + 10);
    roundRect(ctx, cardX, cardY, columnWidth, rowHeight, 8);
    ctx.fillStyle = index === totals.length - 1 ? "#d8f1ed" : "#f3f6f4";
    ctx.fill();
    ctx.fillStyle = "#6a7475";
    ctx.font = "800 12px Inter, system-ui, sans-serif";
    ctx.fillText(total[0], cardX + 12, cardY + 19);
    ctx.fillStyle = "#1f3438";
    ctx.font = "900 18px Inter, system-ui, sans-serif";
    ctx.fillText(total[1], cardX + 12, cardY + 41);
  }

  return y + Math.ceil(totals.length / 2) * (rowHeight + 10);
}

function drawReportLiftPoint(ctx, x, y, width, quantities) {
  const liftPoint = centreOfGravityData(quantities);
  const liftPointText = centreOfGravityReferenceText(quantities, liftPoint);
  ctx.fillStyle = "#1f3438";
  ctx.font = "900 18px Inter, system-ui, sans-serif";
  ctx.fillText("COG", x, y);
  y += 26;

  roundRect(ctx, x, y, width, 92, 8);
  ctx.fillStyle = "#fff6d8";
  ctx.fill();
  ctx.strokeStyle = "rgba(31, 42, 47, 0.18)";
  ctx.stroke();

  ctx.fillStyle = "#1f3438";
  ctx.font = "900 15px Inter, system-ui, sans-serif";
  ctx.fillText(liftPointText, x + 14, y + 24);
  ctx.fillStyle = "#3d4c52";
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  ctx.fillText(liftPoint ? formatPointCompact(liftPoint.point) : "No coordinates available", x + 14, y + 48);
  ctx.fillStyle = "#6a7475";
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  ctx.fillText("Estimated COG for lifting mark. Verify with the lift plan before use.", x + 14, y + 72);
  return y + 92;
}

function drawReportLugPlan(ctx, x, y, width, quantities) {
  const lugPlan = suggestedLugPlan(quantities);
  ctx.fillStyle = "#1f3438";
  ctx.font = "900 18px Inter, system-ui, sans-serif";
  ctx.fillText("Calculated lifting points", x, y);
  y += 24;

  ctx.font = "800 13px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#516169";
  if (!lugPlan) {
    ctx.fillText("No calculated lifting points yet.", x, y);
    return y + 18;
  }

  for (const lug of lugPlan.points) {
    y = drawWrappedReportText(ctx, lugPointText(lug), x, y, width, 18);
  }
  y = drawWrappedReportText(ctx, `${liftingPointPlanSummary(lugPlan)} Verify lug design, welds, sling angles and load ratings.`, x, y, width, 18);
  return y;
}

function drawReportRunTable(ctx, x, y, width, quantities) {
  ctx.fillStyle = "#1f3438";
  ctx.font = "900 18px Inter, system-ui, sans-serif";
  ctx.fillText("Pipe runs", x, y);
  y += 26;

  const columns = [
    { label: "Run", x: 0, align: "left" },
    { label: "NB", x: 54, align: "left" },
    { label: "C/C", x: 128, align: "right" },
    { label: "Deduct", x: 238, align: "right" },
    { label: "Cut", x: 350, align: "right" },
    { label: "kg", x: width, align: "right" },
  ];

  ctx.font = "900 12px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#6a7475";
  for (const column of columns) {
    ctx.textAlign = column.align;
    ctx.fillText(column.label, x + column.x, y);
  }
  ctx.textAlign = "left";
  y += 12;

  if (!quantities.segments.length) {
    ctx.fillStyle = "#6a7475";
    ctx.font = "800 14px Inter, system-ui, sans-serif";
    ctx.fillText("No pipe runs yet.", x, y + 18);
    return y + 44;
  }

  for (const { segment, quantity } of quantities.segments) {
    y += 30;
    ctx.strokeStyle = "rgba(31, 42, 47, 0.12)";
    ctx.beginPath();
    ctx.moveTo(x, y - 21);
    ctx.lineTo(x + width, y - 21);
    ctx.stroke();

    const size = pipeSizeForSegment(segment);
    const values = [
      `${pointLabel(segment.from)}-${pointLabel(segment.to)}`,
      `${size.nb}`,
      `${formatLength(quantity.centrelineMm)}`,
      `${formatLength(quantity.bendTakeoffMm)}`,
      `${formatLength(quantity.cutLengthMm)}`,
      `${formatMass(quantity.pipeWeightKg)}`,
    ];
    ctx.font = "800 14px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#263d45";
    for (const [index, column] of columns.entries()) {
      ctx.textAlign = column.align;
      ctx.fillText(values[index], x + column.x, y);
    }
    ctx.textAlign = "left";
  }

  return y + 18;
}

function drawReportBendNotes(ctx, x, y, width, quantities) {
  ctx.fillStyle = "#1f3438";
  ctx.font = "900 18px Inter, system-ui, sans-serif";
  ctx.fillText("Bend deductions", x, y);
  y += 24;

  ctx.font = "800 13px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#516169";

  if (!quantities.elbows.length) {
    ctx.fillText("No bend take-off yet.", x, y);
    return y + 18;
  }

  for (const [index, elbow] of quantities.elbows.entries()) {
    const sameTakeoff = Math.abs(elbow.firstTakeoffMm - elbow.secondTakeoffMm) < 0.5;
    const takeoff = sameTakeoff
      ? `${formatLength(elbow.takeoffMm)} mm each side`
      : `run ${elbow.firstSegmentIndex + 1}: ${formatLength(elbow.firstTakeoffMm)} mm, run ${elbow.secondSegmentIndex + 1}: ${formatLength(elbow.secondTakeoffMm)} mm`;
    const line = `B${index + 1} NB ${elbow.nb} ${formatAngle(elbow.bend)} deg - take off ${takeoff} / ${formatMass(elbow.weightKg)} kg`;
    y = drawWrappedReportText(ctx, line, x, y, width, 18);
  }

  return y;
}

function drawReportTeeNotes(ctx, x, y, width, quantities) {
  ctx.fillStyle = "#1f3438";
  ctx.font = "900 18px Inter, system-ui, sans-serif";
  ctx.fillText("Tee deductions", x, y);
  y += 24;

  ctx.font = "800 13px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#516169";

  if (!quantities.tees.length) {
    ctx.fillText("No tee take-off yet.", x, y);
    return y + 18;
  }

  for (const [index, tee] of quantities.tees.entries()) {
    const legs = tee.connections
      .map((connection) => `run ${connection.segmentIndex + 1}: ${formatLength(connection.takeoffMm)} mm`)
      .join(", ");
    const label = tee.reducing ? `T${index + 1} reducing tee NB ${tee.nb} to NB ${tee.branchNb}` : `T${index + 1} tee NB ${tee.nb}`;
    const line = `${label} - take off ${legs} / ${formatMass(tee.weightKg)} kg ${tee.source}`;
    y = drawWrappedReportText(ctx, line, x, y, width, 18);
  }

  return y;
}

function drawReportBranchNotes(ctx, x, y, width, quantities) {
  ctx.fillStyle = "#1f3438";
  ctx.font = "900 18px Inter, system-ui, sans-serif";
  ctx.fillText("Branch deductions", x, y);
  y += 24;

  ctx.font = "800 13px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#516169";

  if (!quantities.branches.length) {
    ctx.fillText("No branch weld take-off yet.", x, y);
    return y + 18;
  }

  for (const [index, branch] of quantities.branches.entries()) {
    const legs = branch.connections
      .map((connection) => `run ${connection.segmentIndex + 1}: ${formatLength(connection.takeoffMm)} mm`)
      .join(", ");
    const line = `BR${index + 1} main NB ${branch.nb} to branch NB ${branch.branchNb} - take off ${legs} / ${formatMass(branch.weightKg)} kg ${branch.source}`;
    y = drawWrappedReportText(ctx, line, x, y, width, 18);
  }

  return y;
}

function drawReportReducerNotes(ctx, x, y, width, quantities) {
  ctx.fillStyle = "#1f3438";
  ctx.font = "900 18px Inter, system-ui, sans-serif";
  ctx.fillText("Reducer deductions", x, y);
  y += 24;

  ctx.font = "800 13px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#516169";

  if (!quantities.reducers.length) {
    ctx.fillText("No automatic reducers yet.", x, y);
    return y + 18;
  }

  for (const [index, reducer] of quantities.reducers.entries()) {
    const line = `R${index + 1} NB ${reducer.largeNb} to NB ${reducer.smallNb} - take off ${formatLength(reducer.firstTakeoffMm + reducer.secondTakeoffMm)} mm total / ${formatMass(reducer.weightKg)} kg ${reducer.source ?? "estimated"}`;
    y = drawWrappedReportText(ctx, line, x, y, width, 18);
  }

  return y;
}

function drawReportFittingNotes(ctx, x, y, width, quantities) {
  ctx.fillStyle = "#1f3438";
  ctx.font = "900 18px Inter, system-ui, sans-serif";
  ctx.fillText("Fitting weights", x, y);
  y += 24;

  ctx.font = "800 13px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#516169";

  if (!quantities.fittings.length) {
    ctx.fillText("No fittings yet.", x, y);
    return y + 18;
  }

  for (const item of quantities.fittings) {
    const distance = pointLength(subtractPoints(item.point, item.segment.start));
    const line = `${fittingActionLabel(item.fitting.type)} run ${item.segment.index + 1} @ ${formatLength(distance)} mm - ${formatMass(item.weightKg)} kg ${item.weightSource}`;
    y = drawWrappedReportText(ctx, line, x, y, width, 18);
  }

  return y;
}

function drawWrappedReportText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      line = word;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y + 4;
}

function openDrawingContextMenu(event) {
  event.preventDefault();
  const pointer = pointerPosition(event);
  const segmentHit = findNearestSegment(pointer);
  const pointHit = findNearestPoint(pointer);
  const endpointHit = endpointSegmentHitForPoint(pointHit);
  const fittingHit = findNearestFitting(pointer);
  const pipeHit = endpointHit ?? fittingHit?.segmentHit ?? segmentHit;
  const noteHit = findNearestNote(pointer);
  const notePoint = noteHit?.note.point ?? pointHit?.point ?? (
    pipeHit ? lerpPoint(pipeHit.segment.start, pipeHit.segment.end, pipeHit.t) : unprojectIsoGround(pointer)
  );

  drawingContextTarget = {
    segmentHit: pipeHit,
    fittingHit,
    pointHit,
    endpointHit,
    noteHit,
    notePoint,
  };

  state.hoveredSegment = pipeHit ? pipeHit.segment.index : null;
  drawIso();
  renderDrawingContextMenu();
  positionDrawingContextMenu(event.clientX, event.clientY);
}

function endpointSegmentHitForPoint(pointHit) {
  if (!pointHit) return null;
  const connected = segments().filter((segment) => segment.from === pointHit.index || segment.to === pointHit.index);
  if (connected.length !== 1) return null;
  const segment = connected[0];
  return {
    segment,
    distance: pointHit.distance,
    t: segment.from === pointHit.index ? 0 : 1,
    endpointIndex: pointHit.index,
  };
}

function renderDrawingContextMenu() {
  drawingContextMenu.innerHTML = "";
  const actions = [];
  const target = drawingContextTarget;

  if (target?.segmentHit) {
    const bendAnchor = bendEditAnchorForHit(target.segmentHit);
    const currentBend = bendAnchor === null ? null : bendAngleForSegmentAt(target.segmentHit.segment, bendAnchor);
    const selected = selectedSegmentIndexes();
    const deleteCount = selected.includes(target.segmentHit.segment.index) && selected.length > 1 ? selected.length : 1;

    actions.push({
      label: "Edit length mm",
      detail: `${formatLength(pointLength(target.segmentHit.segment.vector))} mm now`,
      action: () => editContextSegmentLength(),
    });

    actions.push({
      label: "Change pipe size",
      detail: contextPipeSizeDetail(target.segmentHit.segment),
      action: () => changeContextPipeSize(),
    });

    if (currentBend !== null) {
      actions.push({
        label: "Edit bend angle",
        detail: `${formatAngle(currentBend)} deg now`,
        action: () => editContextSegmentAngle(),
      });
    }

    actions.push(
      {
        label: "Add single flange",
        detail: target.endpointHit ? "Flush on pipe end" : "One flanged plate",
        action: () => placeContextFitting("flange", { flangeMode: "single" }),
      },
      {
        label: "Add double flange",
        detail: target.endpointHit ? "Flush on pipe end" : "Two plates and gasket",
        action: () => placeContextFitting("flange", { flangeMode: "double" }),
      },
      {
        label: "Add reducer",
        detail: "On this run",
        action: () => placeContextFitting("reducer"),
      },
    );

    actions.push({
      label: target.endpointHit ? "Delete end run" : "Delete pipe run",
      detail: deleteCount > 1 ? `Remove ${deleteCount} selected runs` : `Remove run ${target.segmentHit.segment.index + 1}`,
      danger: true,
      action: () => deleteContextSegments(),
    });
  }

  const pointConnections = target?.pointHit
    ? segments().filter((segment) => segment.from === target.pointHit.index || segment.to === target.pointHit.index)
    : [];
  if (target?.pointHit && pointConnections.length >= 3) {
    const type = nodeConnectionType(target.pointHit.index);
    actions.push({
      label: type === "branch" ? "Mark as tee" : "Mark as branch",
      detail: type === "branch" ? "Use tee fitting take-off and weight" : "Use welded branch take-off",
      action: () => setContextPointConnectionType(type === "branch" ? "tee" : "branch"),
    });
  }

  if (target?.fittingHit) {
    const fittingData = {
      fitting: target.fittingHit.fitting,
      segment: target.fittingHit.segmentHit.segment,
    };
    const weightKg = fittingWeightKg(fittingData.fitting, fittingData.segment);
    actions.push({
      label: "Set fitting weight",
      detail: `${formatMass(weightKg)} kg ${fittingWeightSource(fittingData.fitting)}`,
      action: () => setContextFittingWeight(),
    });

    if (fittingWeightOverride(fittingData.fitting) !== null) {
      actions.push({
        label: "Clear manual weight",
        detail: "Use estimated fitting weight",
        action: () => clearContextFittingWeight(),
      });
    }

    actions.push({
      label: `Delete ${fittingActionLabel(target.fittingHit.fitting.type)}`,
      detail: "Remove this fitting only",
      danger: true,
      action: () => deleteContextFitting(),
    });
  }

  if (target?.noteHit) {
    actions.push({
      label: "Edit text note",
      detail: "Change note wording",
      action: () => editContextNote(target.noteHit.note),
    });

    actions.push({
      label: "Delete text note",
      detail: "Remove this note",
      danger: true,
      action: () => deleteContextNote(),
    });
  }

  if (target?.pointHit && !target.endpointHit && !target.segmentHit && !target.noteHit) {
    if (!pointConnections.length && state.points.length > 1) {
      actions.push({
        label: "Delete point",
        detail: `Remove point ${target.pointHit.index + 1}`,
        danger: true,
        action: () => deleteContextPoint(),
      });
    }
  }

  actions.push({
    label: "Add text note",
    detail: target?.segmentHit ? "Attached at this pipe spot" : "On the iso paper",
    action: () => addContextNote(target?.notePoint),
  });

  for (const action of actions) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "drawing-context-item";
    if (action.danger) button.classList.add("danger");
    button.setAttribute("role", "menuitem");

    const label = document.createElement("span");
    label.textContent = action.label;
    const detail = document.createElement("small");
    detail.textContent = action.detail;
    button.append(label, detail);

    button.addEventListener("click", () => {
      action.action();
      closeDrawingContextMenu();
    });
    drawingContextMenu.append(button);
  }
}

function positionDrawingContextMenu(clientX, clientY) {
  drawingContextMenu.hidden = false;
  drawingContextMenu.style.left = `${clientX}px`;
  drawingContextMenu.style.top = `${clientY}px`;

  requestAnimationFrame(() => {
    const rect = drawingContextMenu.getBoundingClientRect();
    const left = clampNumber(clientX, 8, window.innerWidth - rect.width - 8);
    const top = clampNumber(clientY, 8, window.innerHeight - rect.height - 8);
    drawingContextMenu.style.left = `${left}px`;
    drawingContextMenu.style.top = `${top}px`;
  });
}

function closeDrawingContextMenu() {
  drawingContextMenu.hidden = true;
  drawingContextTarget = null;
}

function placeContextFitting(type, options = {}) {
  const hit = drawingContextTarget?.segmentHit;
  if (!hit) return;
  placeFitting(type, hit.segment.index, hit.t, options);
}

function fittingActionLabel(type) {
  if (type === "flange") return "flange";
  if (type === "valve") return "valve";
  if (type === "weld") return "weld";
  if (type === "reducer") return "reducer";
  return "fitting";
}

function deleteContextSegments() {
  const hit = drawingContextTarget?.segmentHit;
  if (!hit) return;

  const selected = selectedSegmentIndexes();
  const targetIndexes = selected.includes(hit.segment.index) ? selected : [hit.segment.index];
  deleteSegmentsByIndex(targetIndexes);
}

function deleteContextFitting() {
  const fitting = drawingContextTarget?.fittingHit?.fitting;
  if (!fitting) return;

  state.fittings = state.fittings.filter((item) => item.id !== fitting.id);
  state.selectedFitting = null;
  updateAll();
}

function setContextFittingWeight() {
  const hit = drawingContextTarget?.fittingHit;
  if (!hit) return;

  const currentWeight = fittingWeightKg(hit.fitting, hit.segmentHit.segment);
  const text = window.prompt("Fitting weight kg", formatMass(currentWeight));
  if (text === null) return;

  const weightKg = Number(text);
  if (!Number.isFinite(weightKg) || weightKg < 0) {
    window.alert("Enter a valid fitting weight in kg.");
    return;
  }

  hit.fitting.weightKg = Math.round(weightKg * 10) / 10;
  state.selectedFitting = hit.fitting.id;
  updateAll();
}

function clearContextFittingWeight() {
  const fitting = drawingContextTarget?.fittingHit?.fitting;
  if (!fitting) return;

  delete fitting.weightKg;
  state.selectedFitting = fitting.id;
  updateAll();
}

function deleteContextNote() {
  const note = drawingContextTarget?.noteHit?.note;
  if (!note) return;

  state.notes = state.notes.filter((item) => item.id !== note.id);
  state.selectedNote = null;
  updateAll();
}

function deleteContextPoint() {
  const pointHit = drawingContextTarget?.pointHit;
  if (!pointHit || state.points.length <= 1) return;

  const connected = segments().filter((segment) => segment.from === pointHit.index || segment.to === pointHit.index);
  if (connected.length) return;

  state.points.splice(pointHit.index, 1);
  reindexNodeTypesAfterPointRemoval(pointHit.index);
  state.selectedPoint = null;
  state.activePoint = Math.max(0, Math.min(state.activePoint, state.points.length - 1));
  updateAll();
}

function setContextPointConnectionType(type) {
  const pointHit = drawingContextTarget?.pointHit;
  if (!pointHit) return;
  const connected = segments().filter((segment) => segment.from === pointHit.index || segment.to === pointHit.index);
  if (connected.length < 3) return;

  state.selectedPoint = pointHit.index;
  state.activePoint = pointHit.index;
  clearSelectedSegments();
  state.selectedFitting = null;
  state.selectedNote = null;
  setNodeConnectionType(pointHit.index, type);
}

function editContextSegmentLength() {
  const hit = drawingContextTarget?.segmentHit;
  if (!hit) return;

  const currentLength = Math.round(pointLength(hit.segment.vector));
  const text = window.prompt("Pipe length mm", String(currentLength));
  if (text === null) return;

  selectSingleSegment(hit.segment.index);
  state.selectedPoint = hit.t < 0.5 ? hit.segment.from : hit.segment.to;
  state.activePoint = state.selectedPoint;
  state.selectedFitting = null;
  state.selectedNote = null;
  setSelectedSegmentLength(text);
}

function editContextSegmentAngle() {
  const hit = drawingContextTarget?.segmentHit;
  if (!hit) return;

  const anchorIndex = bendEditAnchorForHit(hit);
  if (anchorIndex === null) return;

  const currentBend = bendAngleForSegmentAt(hit.segment, anchorIndex) ?? 90;
  const text = window.prompt("Bend angle degrees", formatAngle(currentBend));
  if (text === null) return;

  editSegmentBendAngle(hit.segment, anchorIndex, text);
}

function contextPipeSizeDetail(segment) {
  const selected = selectedSegmentIndexes();
  const targetIsSelected = selected.includes(segment.index);
  const count = targetIsSelected && selected.length > 1 ? selected.length : 1;
  const nb = pipeSizeForSegment(segment).nb;
  return count > 1 ? `${count} selected sections` : `Current NB ${nb}`;
}

function changeContextPipeSize() {
  const hit = drawingContextTarget?.segmentHit;
  if (!hit) return;

  const selected = selectedSegmentIndexes();
  const targetIndexes = selected.includes(hit.segment.index) ? selected : [hit.segment.index];
  const currentSize = pipeSizeForSegment(hit.segment).nb;
  const requested = window.prompt(`Pipe size NB (${PIPE_SIZES.map((size) => size.nb).join(", ")})`, String(currentSize));
  if (requested === null) return;

  const pipeSizeNb = pipeSizeFromText(requested);
  if (pipeSizeNb === null) {
    window.alert("That NB size is not in the pipe size list.");
    return;
  }
  setPipeSizeForSegments(targetIndexes, pipeSizeNb);
}

function addContextNote(point) {
  if (!point) return;
  const text = promptNoteText(noteTextInput.value);
  if (text === null) return;
  placeNote(point, text);
}

function editContextNote(note) {
  const text = promptNoteText(note.text);
  if (text === null) return;
  note.text = text.slice(0, 80);
  noteTextInput.value = note.text;
  state.selectedNote = note.id;
  state.selectedFitting = null;
  clearSelectedSegments();
  updateAll();
}

function promptNoteText(defaultText) {
  const text = window.prompt("Note text", defaultText || "FIELD NOTE");
  if (text === null) return null;
  return text.trim() || "NOTE";
}

function beginNoteDrag(event, noteHit, pointer) {
  const note = noteHit?.note;
  if (!note) return false;

  const anchor = projectIso(note.point);
  noteDrag = {
    pointerId: event.pointerId,
    note,
    z: Number(note.point.z) || 0,
    offset: {
      x: pointer.x - anchor.x,
      y: pointer.y - anchor.y,
    },
    moved: false,
  };
  state.selectedNote = note.id;
  state.selectedFitting = null;
  state.selectedPoint = null;
  clearSelectedSegments();
  cursorReadout.textContent = "Dragging note";
  try {
    drawCanvas.setPointerCapture(event.pointerId);
  } catch {
    // Pointer capture is a nice-to-have for dragging outside the canvas.
  }
  drawIso();
  updatePropertiesPanel();
  event.preventDefault();
  return true;
}

function updateNoteDrag(event) {
  if (!noteDrag) return false;

  const pointer = pointerPosition(event);
  const anchorPointer = {
    x: pointer.x - noteDrag.offset.x,
    y: pointer.y - noteDrag.offset.y,
  };
  noteDrag.note.point = unprojectIsoAtZ(anchorPointer, noteDrag.z, false);
  noteDrag.moved = true;
  state.pointer = pointer;
  cursorReadout.textContent = "Dragging note";
  drawIso();
  updatePropertiesPanel();
  event.preventDefault();
  return true;
}

function finishNoteDrag(event) {
  if (!noteDrag) return false;

  try {
    drawCanvas.releasePointerCapture(noteDrag.pointerId);
  } catch {
    // Ignore browsers that have already released capture.
  }
  noteDrag = null;
  state.pointer = null;
  cursorReadout.textContent = formatPoint(activePoint());
  updateAll();
  event?.preventDefault?.();
  return true;
}

drawCanvas.addEventListener("contextmenu", openDrawingContextMenu);

drawCanvas.addEventListener("pointermove", (event) => {
  if (updateNoteDrag(event)) return;

  const pointer = pointerPosition(event);
  state.pointer = pointer;

  if (state.activeTool === "draw") {
    state.previewCandidate = getSnappedCandidate(pointer);
    if (state.previewCandidate) {
      cursorReadout.textContent = formatPoint(state.previewCandidate.point);
    }
  } else {
    const noteHit = findNearestNote(pointer);
    const pointHit = findNearestPoint(pointer);
    const hit = findNearestSegment(pointer);
    state.hoveredSegment = hit ? hit.segment.index : null;
    cursorReadout.textContent = noteHit
      ? "Text note"
      : pointHit
      ? `Point ${pointHit.index + 1} / tee start`
      : state.activeTool === "note"
      ? "Click to place note"
      : state.activeTool === "tee" && hit
      ? `Tee on run ${hit.segment.index + 1}`
      : hit
      ? `Run ${hit.segment.index + 1} / ${Math.round(hit.t * 100)}%`
      : "No run";
  }

  drawIso();
});

drawCanvas.addEventListener("pointerleave", () => {
  if (noteDrag) return;
  state.pointer = null;
  state.previewCandidate = null;
  state.hoveredSegment = null;
  cursorReadout.textContent = formatPoint(activePoint());
  drawIso();
});

drawCanvas.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  closeDrawingContextMenu();
  const pointer = pointerPosition(event);

  if (state.activeTool === "draw") {
    const candidate = getSnappedCandidate(pointer);
    if (!candidate) return;
    addRun(candidate.axis, candidate.length);
    return;
  }

  if (state.activeTool === "note") {
    const text = promptNoteText(noteTextInput.value);
    if (text !== null) {
      placeNote(unprojectIsoGround(pointer), text);
    }
    return;
  }

  if (state.activeTool === "tee" || state.activeTool === "branch") {
    const hit = findNearestSegment(pointer);
    if (!hit || hit.t <= 0.02 || hit.t >= 0.98) return;
    const splitIndex = splitSegmentAt(hit.segment.index, hit.t);
    if (splitIndex !== null) {
      setNodeConnectionType(splitIndex, state.activeTool === "branch" ? "branch" : "tee", { update: false });
    }
    setTool("draw");
    updateAll();
    return;
  }

  const noteHit = findNearestNote(pointer);
  if (noteHit && state.activeTool === "select") {
    beginNoteDrag(event, noteHit, pointer);
    return;
  }

  const pointHit = findNearestPoint(pointer);
  if (pointHit && state.activeTool === "select") {
    state.selectedPoint = pointHit.index;
    state.activePoint = pointHit.index;
    clearSelectedSegments();
    state.selectedFitting = null;
    state.selectedNote = null;
    updateAll({ save: false });
    return;
  }

  const hit = findNearestSegment(pointer);
  if (!hit) return;

  chooseSegmentFromPointer(event, hit.segment.index);
  state.selectedNote = null;
  state.selectedPoint = hit.t < 0.5 ? hit.segment.from : hit.segment.to;
  state.activePoint = state.selectedPoint;
  const fittingAtHit = state.fittings.find((fitting) => {
    if (fitting.segmentIndex !== hit.segment.index) return false;
    return Math.abs(fitting.t - hit.t) < 0.06;
  });

  if (state.activeTool === "select") {
    state.selectedFitting = event.shiftKey || event.ctrlKey || event.metaKey ? null : fittingAtHit ? fittingAtHit.id : null;
    updateAll({ save: false });
    return;
  }

  if (FITTING_TOOLS.has(state.activeTool)) {
    placeFitting(state.activeTool, hit.segment.index, hit.t);
  }
});

drawCanvas.addEventListener("pointerup", finishNoteDrag);
drawCanvas.addEventListener("pointercancel", finishNoteDrag);

document.querySelectorAll("[data-tool]").forEach((button) => {
  button.addEventListener("click", () => setTool(button.dataset.tool));
});

document.querySelectorAll("[data-axis]").forEach((button) => {
  button.addEventListener("click", () => {
    const axis = axisByKey.get(button.dataset.axis);
    if (!axis) return;
    addRun(axis, state.stepLength);
  });
});

projectInputs.forEach((input) => {
  input.addEventListener("input", () => {
    const field = input.dataset.projectField;
    state.projectInfo = normalizeProjectInfo({
      ...state.projectInfo,
      [field]: input.value,
    });
    persistState();
  });
});

stepLengthInput.addEventListener("input", () => {
  state.stepLength = normalizeLength(stepLengthInput.value);
  stepLengthInput.value = String(state.stepLength);
  persistState();
});

selectedRunLengthInput.addEventListener("change", () => {
  setSelectedSegmentLength(selectedRunLengthInput.value);
});

angleInput.addEventListener("input", () => {
  state.angleDegrees = normalizeAngle(angleInput.value);
  persistState();
});

anglePlaneSelect.addEventListener("change", () => {
  state.anglePlane = normalizeAnglePlane(anglePlaneSelect.value);
  persistState();
});

document.querySelector("#anglePositiveButton").addEventListener("click", () => addAngledRun(1));
document.querySelector("#angleNegativeButton").addEventListener("click", () => addAngledRun(-1));

pipeSpecSelect.addEventListener("change", () => {
  state.pipeSpec = normalizePipeSpec(pipeSpecSelect.value);
  if (state.previewMode === "black" || state.previewMode === "stainless") {
    state.previewMode = "carbon";
    previewModeSelect.value = "carbon";
  }
  updateAll();
});

pipeSizeSelect.addEventListener("change", () => {
  const pipeSizeNb = normalizePipeSize(pipeSizeSelect.value);
  const selected = selectedSegmentIndexes();
  if (selected.length) {
    setPipeSizeForSegments(selected, pipeSizeNb);
  } else {
    state.pipeSizeNb = pipeSizeNb;
    updateAll();
  }
});

dimensionToggle.addEventListener("change", () => {
  state.showDimensions = dimensionToggle.checked;
  dimensionStyleSelect.disabled = !state.showDimensions;
  updateAll();
});

dimensionStyleSelect.addEventListener("change", () => {
  state.dimensionStyle = normalizeDimensionStyle(dimensionStyleSelect.value);
  updateAll();
});

liftingToggle.addEventListener("change", () => {
  state.showLiftingPoints = liftingToggle.checked;
  updateAll();
});

flangeModeSelect.addEventListener("change", () => {
  state.flangeMode = normalizeFlangeMode(flangeModeSelect.value);
  persistState();
});

previewModeSelect.addEventListener("change", () => {
  state.previewMode = normalizePreviewMode(previewModeSelect.value);
  update3dPreview();
  renderFallbackPreview();
  persistState();
});

document.querySelector("#sampleButton").addEventListener("click", () => {
  state = sampleState();
  nextFittingId = 5;
  nextNoteId = 2;
  updateControls();
  updateAll();
});

document.querySelector("#undoButton").addEventListener("click", undo);
document.querySelector("#resetButton").addEventListener("click", () => {
  state = blankState();
  nextFittingId = 1;
  nextNoteId = 1;
  updateControls();
  updateAll();
});
document.querySelector("#deleteButton").addEventListener("click", deleteSelection);
document.querySelector("#exportProjectButton").addEventListener("click", exportProjectFile);
document.querySelector("#importProjectButton").addEventListener("click", () => projectFileInput.click());
projectFileInput.addEventListener("change", () => {
  importProjectFile(projectFileInput.files?.[0]);
  projectFileInput.value = "";
});
document.querySelector("#export3dButton").addEventListener("click", export3dImage);
document.querySelector("#exportReportButton").addEventListener("click", exportIsoImage);
document.querySelector("#exportIsoButton").addEventListener("click", exportIsoImage);
document.querySelector("#zoomInButton").addEventListener("click", () => {
  state.gridScale = Math.min(72, state.gridScale + 5);
  updateAll();
});
document.querySelector("#zoomOutButton").addEventListener("click", () => {
  state.gridScale = Math.max(24, state.gridScale - 5);
  updateAll();
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    undo();
  } else if (event.key === "Enter" && state.activeTool === "draw" && !isEditingField(event.target)) {
    event.preventDefault();
    state.previewCandidate = null;
    state.pointer = null;
    setTool("select");
    updateAll({ save: false });
  } else if (event.key === "Delete" || event.key === "Backspace") {
    deleteSelection();
  } else if (event.key === "Escape") {
    closeDrawingContextMenu();
    state.selectedFitting = null;
    clearSelectedSegments();
    setTool("draw");
    updateAll({ save: false });
  }
});

function isEditingField(target) {
  if (!(target instanceof HTMLElement)) return false;
  return target.matches("input, select, textarea") || target.isContentEditable;
}

document.addEventListener("pointerdown", (event) => {
  if (drawingContextMenu.hidden) return;
  if (drawingContextMenu.contains(event.target) || event.target === drawCanvas) return;
  closeDrawingContextMenu();
});

window.addEventListener("resize", closeDrawingContextMenu);
document.addEventListener("scroll", closeDrawingContextMenu, true);

const resizeObserver = new ResizeObserver(() => {
  drawIso();
  renderFallbackPreview();
  resizeThree();
});

resizeObserver.observe(drawCanvas.parentElement);
resizeObserver.observe(previewStage);

setupCollapsibleControls();
setupInspectorTabs();
registerServiceWorker();
populatePipeSizeOptions();
updateControls();
updateAll({ save: false });
initThree();
