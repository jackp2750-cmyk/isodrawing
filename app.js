const drawCanvas = document.querySelector("#drawCanvas");
const fallbackCanvas = document.querySelector("#fallbackCanvas");
const threeCanvas = document.querySelector("#threeCanvas");
const previewStage = document.querySelector("#previewStage");
const controlPanel = document.querySelector(".control-panel");
const previewPanel = document.querySelector(".preview-panel");
const cursorReadout = document.querySelector("#cursorReadout");
const renderStatus = document.querySelector("#renderStatus");
const spoolStats = document.querySelector("#spoolStats");
const previewModeSelect = document.querySelector("#previewModeSelect");
const previewModePanelSelect = document.querySelector("#previewModePanelSelect");
const previewLabelToggle = document.querySelector("#previewLabelToggle");
const previewRotateButton = document.querySelector("#previewRotateButton");
const previewMoveButton = document.querySelector("#previewMoveButton");
const previewResetButton = document.querySelector("#previewResetButton");
const loadPlanButton = document.querySelector("#loadPlanButton");
const loadPlanDialog = document.querySelector("#loadPlanDialog");
const loadPlanProjectList = document.querySelector("#loadPlanProjectList");
const loadPlanStage = document.querySelector("#loadPlanStage");
const loadPlanCanvas = document.querySelector("#loadPlanCanvas");
const loadPlanThreeCanvas = document.querySelector("#loadPlanThreeCanvas");
const loadPlanSummary = document.querySelector("#loadPlanSummary");
const loadPlanPlayButton = document.querySelector("#loadPlanPlayButton");
const loadPlanCloseButton = document.querySelector("#loadPlanCloseButton");
const loadPlanTraySelect = document.querySelector("#loadPlanTraySelect");
const loadPlanRackSelect = document.querySelector("#loadPlanRackSelect");
const loadPlanJobSelect = document.querySelector("#loadPlanJobSelect");
const loadPlanLayoutButton = document.querySelector("#loadPlanLayoutButton");
const loadPlanModelButton = document.querySelector("#loadPlanModelButton");
const loadPlanAnimateButton = document.querySelector("#loadPlanAnimateButton");
const loadPlanSpinButton = document.querySelector("#loadPlanSpinButton");
const loadPlanResetButton = document.querySelector("#loadPlanResetButton");
const loadPlanSelectAllButton = document.querySelector("#loadPlanSelectAllButton");
const loadPlanDeselectAllButton = document.querySelector("#loadPlanDeselectAllButton");
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
const liftingAngleSelect = document.querySelector("#liftingAngleSelect");
const previewLabelLayer = document.querySelector("#previewLabelLayer");
const propertiesPanel = document.querySelector("#propertiesPanel");
const projectFileInput = document.querySelector("#projectFileInput");
const projectReadout = document.querySelector("#projectReadout");
const appVersionBadge = document.querySelector("#appVersionBadge");
const saveBrowserProjectButton = document.querySelector("#saveBrowserProjectButton");
const openBrowserProjectButton = document.querySelector("#openBrowserProjectButton");
const accountButton = document.querySelector("#accountButton");
const accountButtonLabel = document.querySelector("#accountButtonLabel");
const cloudSyncStatus = document.querySelector("#cloudSyncStatus");
const authDialog = document.querySelector("#authDialog");
const authDialogForm = document.querySelector("#authDialogForm");
const authDialogTitle = document.querySelector("#authDialogTitle");
const authDialogStatus = document.querySelector("#authDialogStatus");
const authSignInModeButton = document.querySelector("#authSignInModeButton");
const authCreateModeButton = document.querySelector("#authCreateModeButton");
const authEmailInput = document.querySelector("#authEmailInput");
const authPasswordInput = document.querySelector("#authPasswordInput");
const authRememberDeviceInput = document.querySelector("#authRememberDeviceInput");
const authModeHelp = document.querySelector("#authModeHelp");
const authCloseButton = document.querySelector("#authCloseButton");
const authSignInButton = document.querySelector("#authSignInButton");
const authSignUpButton = document.querySelector("#authSignUpButton");
const authResendButton = document.querySelector("#authResendButton");
const authSignOutButton = document.querySelector("#authSignOutButton");
const projectDialog = document.querySelector("#projectDialog");
const projectDialogForm = document.querySelector("#projectDialogForm");
const projectDialogTitle = document.querySelector("#projectDialogTitle");
const projectDialogSubmitButton = document.querySelector("#projectDialogSubmitButton");
const projectDialogCancelButton = document.querySelector("#projectDialogCancelButton");
const projectDialogJobPickerButton = document.querySelector("#projectDialogJobPickerButton");
const projectJobQuickPick = document.querySelector("#projectJobQuickPick");
const newDrawingDialog = document.querySelector("#newDrawingDialog");
const newDrawingCancelButton = document.querySelector("#newDrawingCancelButton");
const newDrawingDiscardButton = document.querySelector("#newDrawingDiscardButton");
const newDrawingSaveButton = document.querySelector("#newDrawingSaveButton");
const projectLibraryDialog = document.querySelector("#projectLibraryDialog");
const projectLibraryList = document.querySelector("#projectLibraryList");
const projectLibraryCloseButton = document.querySelector("#projectLibraryCloseButton");
const projectLibrarySubtitle = document.querySelector("#projectLibrarySubtitle");
const projectDialogInputs = {
  jobNumber: document.querySelector("#projectDialogJobNumber"),
  spoolNumber: document.querySelector("#projectDialogSpoolNumber"),
  revision: document.querySelector("#projectDialogRevision"),
  drawnBy: document.querySelector("#projectDialogDrawnBy"),
  client: document.querySelector("#projectDialogClient"),
};
const mobilePanelScrim = document.querySelector("#mobilePanelScrim");
const mobilePanelButtons = [...document.querySelectorAll("[data-mobile-panel]")];
const mobilePanelCloseButtons = [...document.querySelectorAll("[data-mobile-close-panel]")];
const projectInputs = [...document.querySelectorAll("[data-project-field]")];

const STORAGE_KEY = "isospool-studio-state-v8";
const CONTROL_COLLAPSE_KEY = "isospool-control-collapse-v1";
const SAVED_PROJECTS_KEY = "isospool-saved-projects-v1";
const LEGACY_STORAGE_KEYS = ["isospool-studio-state-v7", "isospool-studio-state-v6", "isospool-studio-state-v5", "isospool-studio-state-v4", "isospool-studio-state-v3", "isospool-studio-state-v2", "isospool-studio-state-v1"];
const APP_VERSION = "v1.29";
const APP_BUILD_DATE = "2026-06-08";
const SUPABASE_URL = "https://wsrfxqnsquzzwqijfmec.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzcmZ4cW5zcXV6endxaWpmbWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTgyMTcsImV4cCI6MjA5NjQzNDIxN30.sg_8KInh9fRG5Lmz3jHCZxkYZqRhzZuTqsB7rzddBx4";
const SUPABASE_JS_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const CLOUD_PROJECTS_TABLE = "spool_projects";
const CLOUD_PROFILES_TABLE = "profiles";
const CLOUD_AUTOSAVE_DELAY_MS = 1600;
const AUTH_PROMPT_SESSION_KEY = "isospool-auth-prompt-shown-v1";
const AUTH_REMEMBER_DEVICE_KEY = "isospool-auth-remember-device-v1";
const VERSION_CHECK_INTERVAL_MS = 10 * 60 * 1000;
const PROJECT_FILE_VERSION = 1;
const MM_PER_GRID = 1000;
const LENGTH_INCREMENT_MM = 50;
const MIN_LENGTH_MM = 50;
const MAX_LENGTH_MM = 12000;
const RUN_CONNECTION_TOLERANCE_MM = 8;
const ISO_COS = Math.cos(Math.PI / 6);
const ISO_SIN = Math.sin(Math.PI / 6);
const FITTING_TOOLS = new Set(["flange", "rollGroove", "valve", "weld", "reducer", "socket"]);
const FLANGE_MODES = new Set(["single", "double"]);
const END_FITTING_SNAP_TOLERANCE = 0.015;
const REDUCER_SIDE_OPTIONS = new Set(["small", "large"]);
const PREVIEW_MODES = new Set(["carbon", "black", "stainless", "red", "ghost", "outline"]);
const DIMENSION_STYLES = new Set(["labels", "redline", "numbered", "chain"]);
const NODE_CONNECTION_TYPES = new Set(["tee", "branch"]);
const LIFTING_SLING_ANGLES = new Set([30, 45, 60, 75, 90]);
const LOAD_PLAN_TRAYS = {
  medium: { key: "medium", label: "3460 x 2040 mm tray", lengthMm: 3460, widthMm: 2040 },
  long: { key: "long", label: "4490 x 2040 mm tray", lengthMm: 4490, widthMm: 2040 },
};
const LOAD_PLAN_TRAY_KEYS = new Set(Object.keys(LOAD_PLAN_TRAYS));
const LOAD_PLAN_RACKS = {
  off: null,
  standard: { key: "standard", label: "6500 x 2040 mm roof racks", lengthMm: 6500, widthMm: 2040 },
  long: { key: "long", label: "7500 x 2040 mm roof racks", lengthMm: 7500, widthMm: 2040 },
};
const LOAD_PLAN_RACK_KEYS = new Set(Object.keys(LOAD_PLAN_RACKS));
const LOAD_PLAN_PACK_STEP_MM = 100;
const LOAD_PLAN_CLEARANCE_MM = 20;
const LOAD_PLAN_MAX_SPOOLS = 30;
const LOAD_PLAN_DEFAULT_SPOOLS = 0;
const LOAD_PLAN_TRAY_LAYERS = 6;
const LOAD_PLAN_RACK_LAYERS = 3;
const LOAD_PLAN_ROTATION_STEP_DEG = 15;
const LOAD_PLAN_DEPTH_SKEW_X = 0.24;
const LOAD_PLAN_DEPTH_SKEW_Y = 0.34;
const LOAD_PLAN_Z_SKEW = 0.58;
const LOAD_PLAN_LAYER_RISE_MM = 320;
const LOAD_PLAN_3D_SCALE = 0.001;
const LOAD_PLAN_VISIBLE_SEGMENT_LIMIT = 80;
const LOAD_PLAN_TIMBER_THICKNESS_MM = 90;
const LOAD_PLAN_TIMBER_WIDTH_MM = 140;
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
const TOUCH_CONTEXT_PRESS_MS = 560;
const TOUCH_CONTEXT_MOVE_LIMIT = 14;
const DRAW_COMMIT_MOVE_LIMIT = 8;
const SOCKET_SIZE_NB = 15;
const MAX_SOCKET_COUNT = 24;
const DEFAULT_SOCKET_SPACING_MM = 150;
const SOCKET_ROTATION_STEP_DEG = 90;

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
let socketDrag = null;
let dimensionDrag = null;
let dimensionHitTargets = [];
let boxSelectDrag = null;
let touchContextPress = null;
let pendingDraw = null;
let activeTouchPointers = new Map();
let pinchGesture = null;
let projectDialogResolver = null;
let newDrawingDialogResolver = null;
let appUpdatePromptOpen = false;
let appUpdateReloadPending = false;
let startupProjectPromptPending = false;
let authMode = "signin";
let supabaseClient = null;
let cloudUser = null;
let cloudProfile = null;
let cloudInitStarted = false;
let cloudInitPromise = null;
let cloudProjectCache = null;
let cloudAutosaveTimer = null;
let cloudAutosaveBusy = false;
let projectLibrarySource = "browser";
let loadPlanSelection = new Set();
let loadPlanAnimationFrame = 0;
let currentLoadPlan = null;
let loadPlanTrayKey = "medium";
let loadPlanRackKey = "standard";
let loadPlanJobKey = "";
let loadPlanViewMode = "layout";
let three = {
  ready: false,
  module: null,
  OrbitControls: null,
  renderer: null,
  scene: null,
  camera: null,
  controls: null,
  spoolGroup: null,
  labels: [],
  animationFrame: 0,
  navigationMode: "orbit",
  userMovedCamera: false,
  modelCenter: null,
};
let loadPlanThree = {
  ready: false,
  renderer: null,
  scene: null,
  camera: null,
  controls: null,
  group: null,
  animationFrame: 0,
  spinning: false,
  bounds: null,
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
    reducerSideOverrides: {},
    dimensionOffsets: {},
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
    show3dLabels: true,
    gridScale: 42,
    showDimensions: true,
    dimensionStyle: "labels",
    showLiftingPoints: false,
    liftingSlingAngleDegrees: 60,
    projectId: null,
    projectInfoPrompted: true,
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
    reducerSideOverrides: {},
    dimensionOffsets: {},
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
    show3dLabels: true,
    gridScale: 42,
    showDimensions: true,
    dimensionStyle: "labels",
    showLiftingPoints: false,
    liftingSlingAngleDegrees: 60,
    projectId: null,
    projectInfoPrompted: false,
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
    appVersion: APP_VERSION,
    points: state.points,
    edges: state.edges,
    fittings: state.fittings.map((fitting) => ({
      ...fitting,
      t: normalizeFittingPosition(fitting.type, fitting.t),
    })),
    notes: state.notes,
    nodeTypes: normalizeNodeTypes(state.nodeTypes, state.points.length),
    reducerSideOverrides: normalizeReducerSideOverrides(state.reducerSideOverrides, state.points.length),
    dimensionOffsets: normalizeDimensionOffsets(state.dimensionOffsets, state.edges.length),
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
    show3dLabels: state.show3dLabels !== false,
    gridScale: state.gridScale,
    showDimensions: state.showDimensions,
    dimensionStyle: normalizeDimensionStyle(state.dimensionStyle),
    showLiftingPoints: state.showLiftingPoints,
    liftingSlingAngleDegrees: normalizeLiftingSlingAngle(state.liftingSlingAngleDegrees),
    projectId: state.projectId,
    projectInfoPrompted: state.projectInfoPrompted === true,
    projectInfo: normalizeProjectInfo(state.projectInfo),
  };
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statePayload()));
    autoSaveCurrentBrowserProject();
  } catch (error) {
    console.warn("Could not save spool state in this browser.", error);
  }
  queueCloudAutosave();
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
  const selectedSegments = normalizeSelectedSegments(saved.selectedSegments, edges.length);

  return {
    ...blankState(),
    points,
    edges,
    fittings: normalizeFittings(saved.fittings, edges.length),
    notes: normalizeNotes(saved.notes),
    nodeTypes: normalizeNodeTypes(saved.nodeTypes, points.length),
    reducerSideOverrides: normalizeReducerSideOverrides(saved.reducerSideOverrides, points.length),
    dimensionOffsets: normalizeDimensionOffsets(saved.dimensionOffsets, edges.length),
    pipeSizeNb: defaultPipeSizeFromSaved(saved, edges, selectedSegments),
    pipeSpec: normalizePipeSpec(saved.pipeSpec),
    stepLength: normalizeLength(legacyUnits ? Number(saved.stepLength) * MM_PER_GRID : saved.stepLength),
    angleDegrees: normalizeAngle(saved.angleDegrees),
    anglePlane: normalizeAnglePlane(saved.anglePlane),
    flangeMode: applyNewDefaults ? "single" : normalizeFlangeMode(saved.flangeMode),
    previewMode: normalizePreviewMode(saved.previewMode),
    show3dLabels: saved.show3dLabels !== false,
    selectedSegments,
    activePoint: Number.isInteger(saved.activePoint) && saved.activePoint >= 0 && saved.activePoint < points.length ? saved.activePoint : points.length - 1,
    selectedPoint: Number.isInteger(saved.selectedPoint) && saved.selectedPoint >= 0 && saved.selectedPoint < points.length ? saved.selectedPoint : null,
    gridScale: Number(saved.gridScale) || 42,
    showDimensions: saved.showDimensions !== false,
    dimensionStyle: normalizeDimensionStyle(saved.dimensionStyle),
    showLiftingPoints: applyNewDefaults ? false : saved.showLiftingPoints === true,
    liftingSlingAngleDegrees: normalizeLiftingSlingAngle(saved.liftingSlingAngleDegrees),
    projectId: normalizeProjectId(saved.projectId),
    projectInfoPrompted: saved.projectInfoPrompted === true || hasProjectInfo(saved.projectInfo),
    projectInfo: normalizeProjectInfo(saved.projectInfo),
    history: [],
  };
}

function defaultPipeSizeFromSaved(saved, edges, selectedSegments) {
  const savedNb = normalizePipeSize(saved?.pipeSizeNb);
  if (savedNb !== 25) return savedNb;

  const selectedEdge = edges[selectedSegments[selectedSegments.length - 1]];
  const selectedNb = selectedEdge ? normalizePipeSize(selectedEdge.pipeSizeNb) : 25;
  if (selectedNb !== 25) return selectedNb;

  const edgeSizes = [...new Set(edges.map((edge) => normalizePipeSize(edge.pipeSizeNb)))];
  if (edgeSizes.length === 1 && edgeSizes[0] !== 25) return edgeSizes[0];

  return savedNb;
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

function normalizeReducerSideOverrides(overrides, pointCount) {
  if (!overrides || typeof overrides !== "object") return {};

  const normalized = {};
  for (const [key, value] of Object.entries(overrides)) {
    const index = Number(key);
    if (
      Number.isInteger(index) &&
      index >= 0 &&
      index < pointCount &&
      REDUCER_SIDE_OPTIONS.has(value)
    ) {
      normalized[index] = value;
    }
  }
  return normalized;
}

function normalizeDimensionOffsets(offsets, edgeCount) {
  if (!offsets || typeof offsets !== "object") return {};

  const normalized = {};
  for (const [key, value] of Object.entries(offsets)) {
    const index = Number(key);
    if (!Number.isInteger(index) || index < 0 || index >= edgeCount) continue;

    const raw = typeof value === "object" && value !== null
      ? value
      : { offset: Number(value), side: 1 };
    const side = Number(raw.side) < 0 ? -1 : 1;
    const offset = clampNumber(Number(raw.offset) || 0, 0, 520);
    if (offset <= 0.5) continue;
    normalized[index] = { side, offset: Math.round(offset) };
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

function reindexReducerSideOverridesAfterPointRemoval(removedIndex) {
  if (!state.reducerSideOverrides || typeof state.reducerSideOverrides !== "object") return;

  const next = {};
  for (const [key, value] of Object.entries(state.reducerSideOverrides)) {
    const index = Number(key);
    if (!Number.isInteger(index) || index === removedIndex || !REDUCER_SIDE_OPTIONS.has(value)) continue;
    next[index > removedIndex ? index - 1 : index] = value;
  }
  state.reducerSideOverrides = next;
}

function reindexDimensionOffsetsAfterSegmentSplit(splitIndex) {
  state.dimensionOffsets = normalizeDimensionOffsets(state.dimensionOffsets, state.edges.length);
  const next = {};
  for (const [key, value] of Object.entries(state.dimensionOffsets)) {
    const index = Number(key);
    if (!Number.isInteger(index)) continue;
    if (index < splitIndex) {
      next[index] = value;
    } else if (index === splitIndex) {
      next[index] = value;
      next[index + 1] = { ...value };
    } else {
      next[index + 1] = value;
    }
  }
  state.dimensionOffsets = normalizeDimensionOffsets(next, state.edges.length);
}

function reindexDimensionOffsetsAfterSegmentRemoval(removedIndex) {
  if (!state.dimensionOffsets || typeof state.dimensionOffsets !== "object") return;

  const next = {};
  for (const [key, value] of Object.entries(state.dimensionOffsets)) {
    const index = Number(key);
    if (!Number.isInteger(index) || index === removedIndex) continue;
    next[index > removedIndex ? index - 1 : index] = value;
  }
  state.dimensionOffsets = normalizeDimensionOffsets(next, state.edges.length);
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
      if (type === "socket") {
        normalized.socketSizeNb = normalizePipeSize(fitting.socketSizeNb ?? SOCKET_SIZE_NB);
        normalized.socketAngle = normalizeSocketAngle(fitting.socketAngle);
      }

      const weightKg = Number(fitting.weightKg);
      if (type !== "rollGroove" && Number.isFinite(weightKg) && weightKg >= 0) {
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

function normalizeProjectId(value) {
  const text = String(value ?? "").trim();
  return text ? text.slice(0, 80) : null;
}

function hasProjectInfo(info = state.projectInfo) {
  return Object.values(normalizeProjectInfo(info)).some(Boolean);
}

function hasDrawingContent() {
  return Boolean(state.edges.length || state.fittings.length || state.notes.length);
}

function projectDisplayName(info = state.projectInfo) {
  const project = normalizeProjectInfo(info);
  const parts = [
    project.jobNumber ? `Job ${project.jobNumber}` : "",
    project.spoolNumber ? `Spool ${project.spoolNumber}` : "",
    project.client,
  ].filter(Boolean);
  return parts.join(" - ") || "Untitled project";
}

function createProjectId() {
  return `project-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeFittingPosition(type, value) {
  const fallback = Number.isFinite(Number(value)) ? Number(value) : 0.5;
  if (type === "flange" || type === "rollGroove") {
    const clamped = clampNumber(fallback, 0, 1);
    if (clamped <= END_FITTING_SNAP_TOLERANCE) return 0;
    if (clamped >= 1 - END_FITTING_SNAP_TOLERANCE) return 1;
    return clamped;
  }
  return clampNumber(fallback, 0.04, 0.96);
}

function normalizeStateFittingPositions() {
  for (const fitting of state.fittings) {
    const current = Number(fitting.t);
    const normalized = normalizeFittingPosition(fitting.type, fitting.t);
    if (!Number.isFinite(current) || Math.abs(normalized - current) > 0.000001) {
      fitting.t = normalized;
    }
  }
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

function isLineDimensionStyle(value = state.dimensionStyle) {
  const style = normalizeDimensionStyle(value);
  return style === "redline" || style === "numbered" || style === "chain";
}

function dimensionLinePalette() {
  const chain = normalizeDimensionStyle(state.dimensionStyle) === "chain";
  return chain
    ? {
        line: "#1f2a2f",
        halo: "rgba(255, 253, 248, 0.94)",
        text: "#1f2a2f",
        fill: "rgba(255, 253, 248, 0.96)",
        border: "rgba(31, 42, 47, 0.28)",
        shadow: "rgba(31, 42, 47, 0.08)",
      }
    : {
        line: "#c1121f",
        halo: "rgba(255, 253, 248, 0.9)",
        text: "#c1121f",
        fill: "rgba(255, 253, 248, 0.96)",
        border: "rgba(193, 18, 31, 0.28)",
        shadow: "rgba(31, 42, 47, 0.12)",
      };
}

function normalizeLiftingSlingAngle(value) {
  const numeric = Math.round(Number(value));
  return LIFTING_SLING_ANGLES.has(numeric) ? numeric : 60;
}

function fittingFlangeMode(fitting) {
  return normalizeFlangeMode(fitting?.flangeMode);
}

function fittingSocketSizeNb(fitting) {
  return normalizePipeSize(fitting?.socketSizeNb ?? SOCKET_SIZE_NB);
}

function normalizeSocketAngle(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  const stepped = Math.round(numeric / SOCKET_ROTATION_STEP_DEG) * SOCKET_ROTATION_STEP_DEG;
  return ((stepped % 360) + 360) % 360;
}

function fittingSocketAngle(fitting) {
  return normalizeSocketAngle(fitting?.socketAngle);
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

function dimensionOffsetForSegment(segmentIndex) {
  const normalized = normalizeDimensionOffsets(state.dimensionOffsets, state.edges.length);
  const value = normalized[segmentIndex];
  return value ?? { side: 1, offset: 0 };
}

function setDimensionOffsetForSegment(segmentIndex, value) {
  if (!Number.isInteger(segmentIndex) || segmentIndex < 0 || segmentIndex >= state.edges.length) return;
  const next = normalizeDimensionOffsets(state.dimensionOffsets, state.edges.length);
  const offset = clampNumber(Number(value?.offset) || 0, 0, 520);
  if (offset <= 0.5) {
    delete next[segmentIndex];
  } else {
    next[segmentIndex] = {
      side: Number(value?.side) < 0 ? -1 : 1,
      offset: Math.round(offset),
    };
  }
  state.dimensionOffsets = next;
}

function resetDimensionHitTargets() {
  dimensionHitTargets = [];
}

function addDimensionHitTarget(target) {
  if (!target || !Number.isInteger(target.segmentIndex)) return;
  dimensionHitTargets.push(target);
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
  resetDimensionHitTargets();
  drawSpool2d(ctx, projection);
  drawNotes2d(ctx, projection);
  if (state.showLiftingPoints) {
    drawSuggestedLugs2d(ctx, projection);
    drawLiftPoint2d(ctx, projection);
  }
  drawPreviewRun(ctx, projection);
  drawSocketDragDimension(ctx, projection);
  drawBoxSelectOverlay(ctx);
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

function dimensionViewport(ctx, padding = 18) {
  const rect = ctx?.canvas?.getBoundingClientRect?.();
  const width = rect?.width || ctx?.canvas?.width || 0;
  const height = rect?.height || ctx?.canvas?.height || 0;
  const safeRight = Math.max(padding, width - padding);
  const safeBottom = Math.max(padding, height - padding);
  return {
    left: padding,
    top: padding,
    right: safeRight,
    bottom: safeBottom,
  };
}

function drawSpool2d(ctx, projection) {
  const pipeWidth = 4;
  const segmentListForDraw = segments();
  const connections = nodeConnections(segmentListForDraw);
  const dimensionLayout = {
    labels: [],
    lines: [],
    viewport: dimensionViewport(ctx, 18),
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
    if (isLineDimensionStyle()) {
      drawSocketPositionDimensions(ctx, projection, segmentListForDraw, dimensionLayout);
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
  drawNumberedDimensionLegend(ctx, dimensionLayout);

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
  const segmentData = quantities.segments.map(({ segment }) => segment);
  const dimensionLayout = {
    labels: [],
    lines: [],
    viewport: dimensionViewport(ctx, 18),
    pipes: segmentData.map((segment) => ({
      index: segment.index,
      start: projectIso(segment.start, projection),
      end: projectIso(segment.end, projection),
    })),
  };

  for (const [index, lug] of lugPlan.points.entries()) {
    drawLugPositionDimension2d(ctx, projection, lug, dimensionLayout, index);
  }

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
    const placementOther = reducerPlacementSide(reducer) === "large" ? largeOther : smallOther;
    const startsAtJoint = reducerStartsAtJoint(reducer);
    const startsAfterBend = reducer.kind === "bend";
    const along = startsAtJoint || startsAfterBend
      ? normalizeScreenVector({ x: placementOther.x - joint.x, y: placementOther.y - joint.y })
      : normalizeScreenVector({ x: smallOther.x - largeOther.x, y: smallOther.y - largeOther.y });
    const normal = { x: -along.y, y: along.x };
    const length = 26;
    const largeWidth = Math.max(14, visualPipeWidth(reducer.largeSegment) * 1.45);
    const smallWidth = Math.max(8, visualPipeWidth(reducer.smallSegment) * 0.95);
    const startWidth = startsAfterBend && reducerPlacementSide(reducer) === "large" ? smallWidth : largeWidth;
    const endWidth = startsAfterBend && reducerPlacementSide(reducer) === "large" ? largeWidth : smallWidth;
    let start;
    let end;
    if (startsAfterBend) {
      const offset = reducerScreenOffsetPixels(reducer, joint, placementOther, length);
      start = { x: joint.x + along.x * offset, y: joint.y + along.y * offset };
      end = { x: start.x + along.x * length, y: start.y + along.y * length };
    } else if (startsAtJoint) {
      start = { x: joint.x + along.x * 2, y: joint.y + along.y * 2 };
      end = { x: joint.x + along.x * length, y: joint.y + along.y * length };
    } else {
      start = { x: joint.x - along.x * length * 0.5, y: joint.y - along.y * length * 0.5 };
      end = { x: joint.x + along.x * length * 0.5, y: joint.y + along.y * length * 0.5 };
    }

    ctx.beginPath();
    ctx.moveTo(start.x + normal.x * startWidth * -0.5, start.y + normal.y * startWidth * -0.5);
    ctx.lineTo(end.x + normal.x * endWidth * -0.5, end.y + normal.y * endWidth * -0.5);
    ctx.lineTo(end.x + normal.x * endWidth * 0.5, end.y + normal.y * endWidth * 0.5);
    ctx.lineTo(start.x + normal.x * startWidth * 0.5, start.y + normal.y * startWidth * 0.5);
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
  const dimensionStyle = normalizeDimensionStyle(state.dimensionStyle);
  if (isLineDimensionStyle(dimensionStyle)) {
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
  const fullText = `${formatLength(pointLength(segment.vector))} mm`;
  const text = dimensionLabelText(layoutState, fullText, `Run ${segment.index + 1}: C/C ${fullText}`, "D");
  const baseOffset = Math.min(64, Math.max(42, screenLength * 0.065));
  const manualOffset = dimensionOffsetForSegment(segment.index);
  let labelAngle = Math.atan2(along.y, along.x);
  if (labelAngle > Math.PI / 2 || labelAngle < -Math.PI / 2) {
    labelAngle += Math.PI;
  }

  ctx.save();
  ctx.font = "900 13px Inter, system-ui, sans-serif";
  const metrics = ctx.measureText(text);
  const labelWidth = metrics.width + 20;
  const labelHeight = 23;
  const layout = redDimensionLayout(start, end, baseNormal, baseOffset, pipeGap, labelWidth, labelHeight, labelAngle, layoutState, segment.index, {
    manual: manualOffset.offset > 0.5 ? manualOffset : null,
  });
  const { lineStart, lineEnd, midpoint, normal } = layout;
  const { extensionStart, extensionEnd } = layout;
  const palette = dimensionLinePalette();

  ctx.shadowColor = palette.shadow;
  ctx.shadowBlur = 2;
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";

  for (const stroke of [
    { color: palette.halo, width: 5 },
    { color: palette.line, width: 2 },
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
  ctx.fillStyle = palette.fill;
  ctx.fill();
  ctx.strokeStyle = palette.border;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = palette.text;
  ctx.fillText(text, 0, 0.5);
  layoutState.labels.push(layout.bounds);
  layoutState.lines.push(...layout.lines);
  addDimensionHitTarget({
    type: "segment",
    segmentIndex: segment.index,
    bounds: layout.bounds,
    lines: layout.lines,
    normal,
    side: layout.side,
    offset: layout.offset,
    baseOffset,
  });
  ctx.restore();
}

function dimensionLabelText(layoutState, displayText, legendText, prefix = "D") {
  if (normalizeDimensionStyle(state.dimensionStyle) !== "numbered") return displayText;
  layoutState.numberedItems ??= [];
  const code = `${prefix}${layoutState.numberedItems.length + 1}`;
  layoutState.numberedItems.push({
    code,
    text: legendText,
  });
  return code;
}

function drawNumberedDimensionLegend(ctx, dimensionLayout) {
  if (normalizeDimensionStyle(state.dimensionStyle) !== "numbered") return;
  const items = dimensionLayout?.numberedItems ?? [];
  if (!items.length) return;

  const viewport = dimensionViewport(ctx, 12);
  const maxItems = 18;
  const visibleItems = items.slice(0, maxItems);
  const overflowCount = items.length - visibleItems.length;

  ctx.save();
  ctx.font = "900 11px Inter, system-ui, sans-serif";
  const maxTextWidth = Math.min(210, Math.max(118, (viewport.right - viewport.left) * 0.36));
  const lineHeight = 16;
  const titleHeight = 21;
  const columns = visibleItems.length > 9 && viewport.right - viewport.left > 560 ? 2 : 1;
  const rows = Math.ceil((visibleItems.length + (overflowCount > 0 ? 1 : 0)) / columns);
  const colWidth = maxTextWidth + 36;
  const gap = columns > 1 ? 12 : 0;
  const padding = 10;
  const cardWidth = Math.min(viewport.right - viewport.left, columns * colWidth + gap + padding * 2);
  const cardHeight = titleHeight + rows * lineHeight + padding * 2;
  const x = viewport.right - cardWidth;
  const y = viewport.top;

  ctx.shadowColor = "rgba(31, 42, 47, 0.14)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  roundRect(ctx, x, y, cardWidth, cardHeight, 8);
  ctx.fillStyle = "rgba(255, 253, 248, 0.94)";
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(193, 18, 31, 0.2)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#7f1d1d";
  ctx.font = "950 11px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Dimension key", x + padding, y + padding + 10);

  ctx.font = "850 10.5px Inter, system-ui, sans-serif";
  const listItems = overflowCount > 0
    ? [...visibleItems, { code: "...", text: `${overflowCount} more in Cut List` }]
    : visibleItems;

  listItems.forEach((item, index) => {
    const column = columns > 1 ? Math.floor(index / rows) : 0;
    const row = columns > 1 ? index % rows : index;
    const itemX = x + padding + column * (colWidth + gap);
    const itemY = y + padding + titleHeight + row * lineHeight + 10;
    ctx.fillStyle = item.code === "..." ? "#657579" : "#c1121f";
    ctx.fillText(item.code, itemX, itemY);
    ctx.fillStyle = "#263538";
    ctx.fillText(fitCanvasText(ctx, item.text, maxTextWidth), itemX + 28, itemY);
  });

  ctx.restore();
}

function fitCanvasText(ctx, text, maxWidth) {
  const value = String(text ?? "");
  if (ctx.measureText(value).width <= maxWidth) return value;
  let trimmed = value;
  while (trimmed.length > 4 && ctx.measureText(`${trimmed}...`).width > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return `${trimmed.trimEnd()}...`;
}

function drawSocketPositionDimensions(ctx, projection, segmentData, dimensionLayout = []) {
  const segmentByIndex = new Map(segmentData.map((segment) => [segment.index, segment]));
  const socketFittings = state.fittings
    .filter((fitting) => fitting.type === "socket")
    .sort((first, second) => first.segmentIndex - second.segmentIndex || first.t - second.t);

  for (const [socketIndex, fitting] of socketFittings.entries()) {
    const segment = segmentByIndex.get(fitting.segmentIndex);
    if (!segment) continue;
    const start = projectIso(segment.start, projection);
    const socketPoint = projectIso(lerpPoint(segment.start, segment.end, fitting.t), projection);
    const distanceMm = pointLength(subtractPoints(lerpPoint(segment.start, segment.end, fitting.t), segment.start));
    drawRedSocketPositionDimension(ctx, start, socketPoint, segment.index, distanceMm, socketIndex, dimensionLayout);
  }
}

function drawRedSocketPositionDimension(ctx, start, socketPoint, segmentIndex, distanceMm, socketIndex, dimensionLayout = []) {
  const layoutState = Array.isArray(dimensionLayout)
    ? { labels: dimensionLayout, lines: [], pipes: [] }
    : dimensionLayout;
  const dx = socketPoint.x - start.x;
  const dy = socketPoint.y - start.y;
  const screenLength = Math.hypot(dx, dy);
  if (screenLength < 8) return;

  const along = { x: dx / screenLength, y: dy / screenLength };
  const baseNormal = { x: -along.y, y: along.x };
  const pipeGap = 11;
  const tick = 5;
  const fullText = `1/2" SOCK ${formatLength(distanceMm)} mm`;
  const text = dimensionLabelText(layoutState, fullText, `Run ${segmentIndex + 1}: ${fullText}`, "S");
  const baseOffset = Math.min(92, Math.max(56, screenLength * 0.08)) + (socketIndex % 3) * 18;
  let labelAngle = Math.atan2(along.y, along.x);
  if (labelAngle > Math.PI / 2 || labelAngle < -Math.PI / 2) {
    labelAngle += Math.PI;
  }

  ctx.save();
  ctx.font = "900 11px Inter, system-ui, sans-serif";
  const metrics = ctx.measureText(text);
  const labelWidth = metrics.width + 18;
  const labelHeight = 21;
  const layout = redDimensionLayout(start, socketPoint, baseNormal, baseOffset, pipeGap, labelWidth, labelHeight, labelAngle, layoutState, segmentIndex);
  const { lineStart, lineEnd, midpoint, normal } = layout;
  const { extensionStart, extensionEnd } = layout;
  const palette = dimensionLinePalette();

  ctx.shadowColor = palette.shadow;
  ctx.shadowBlur = 2;
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";

  for (const stroke of [
    { color: palette.halo, width: 5 },
    { color: palette.line, width: 2 },
  ]) {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    drawLine(ctx, lineStart, lineEnd);
    drawLine(ctx, extensionStart, lineStart);
    drawLine(ctx, extensionEnd, lineEnd);
    drawLine(
      ctx,
      { x: lineEnd.x + normal.x * tick + along.x * -tick, y: lineEnd.y + normal.y * tick + along.y * -tick },
      { x: lineEnd.x + normal.x * -tick + along.x * tick, y: lineEnd.y + normal.y * -tick + along.y * tick },
    );
  }

  ctx.shadowColor = "transparent";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.translate(midpoint.x, midpoint.y);
  ctx.rotate(labelAngle);
  roundRect(ctx, -labelWidth * 0.5, -labelHeight * 0.5, labelWidth, labelHeight, 6);
  ctx.fillStyle = palette.fill;
  ctx.fill();
  ctx.strokeStyle = palette.border;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = palette.text;
  ctx.fillText(text, 0, 0.5);
  layoutState.labels.push(layout.bounds);
  layoutState.lines.push(...layout.lines);
  ctx.restore();
}

function drawLugPositionDimension2d(ctx, projection, lug, dimensionLayout = [], lugIndex = 0) {
  if (!lug?.segment || !lug?.point) return;

  const start = projectIso(lug.segment.start, projection);
  const lugPoint = projectIso(lug.point, projection);
  const distanceMm = Number.isFinite(lug.distanceFromRunStartMm)
    ? lug.distanceFromRunStartMm
    : pointLength(subtractPoints(lug.point, lug.segment.start));
  const text = `LUG ${lug.number ?? lugIndex + 1} ${formatLength(distanceMm)} mm`;

  drawLugDimensionLine(ctx, start, lugPoint, lug.segment.index, text, dimensionLayout, lugIndex);
}

function drawLugDimensionLine(ctx, start, end, segmentIndex, text, dimensionLayout = [], lugIndex = 0) {
  const layoutState = Array.isArray(dimensionLayout)
    ? { labels: dimensionLayout, lines: [], pipes: [] }
    : dimensionLayout;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const screenLength = Math.hypot(dx, dy);
  if (screenLength < 10) return;

  const along = { x: dx / screenLength, y: dy / screenLength };
  const baseNormal = { x: -along.y, y: along.x };
  const pipeGap = 12;
  const baseOffset = Math.min(96, Math.max(54, screenLength * 0.1)) + (lugIndex % 2) * 20;
  let labelAngle = Math.atan2(along.y, along.x);
  if (labelAngle > Math.PI / 2 || labelAngle < -Math.PI / 2) {
    labelAngle += Math.PI;
  }

  ctx.save();
  ctx.font = "950 11px Inter, system-ui, sans-serif";
  const labelWidth = ctx.measureText(text).width + 18;
  const labelHeight = 22;
  const layout = redDimensionLayout(start, end, baseNormal, baseOffset, pipeGap, labelWidth, labelHeight, labelAngle, layoutState, segmentIndex);
  const { lineStart, lineEnd, midpoint } = layout;
  const { extensionStart, extensionEnd } = layout;
  const lineAngle = Math.atan2(lineEnd.y - lineStart.y, lineEnd.x - lineStart.x);

  ctx.shadowColor = "rgba(31, 42, 47, 0.12)";
  ctx.shadowBlur = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const stroke of [
    { color: "rgba(255, 253, 248, 0.94)", width: 6 },
    { color: "#0f766e", width: 2.2 },
  ]) {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    drawLine(ctx, lineStart, lineEnd);
    drawLine(ctx, extensionStart, lineStart);
    drawLine(ctx, extensionEnd, lineEnd);
    drawArrowHead(ctx, lineStart, lineAngle, stroke.width);
    drawArrowHead(ctx, lineEnd, lineAngle + Math.PI, stroke.width);
  }

  ctx.shadowColor = "transparent";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.translate(midpoint.x, midpoint.y);
  ctx.rotate(labelAngle);
  roundRect(ctx, -labelWidth * 0.5, -labelHeight * 0.5, labelWidth, labelHeight, 6);
  ctx.fillStyle = "rgba(255, 253, 248, 0.98)";
  ctx.fill();
  ctx.strokeStyle = "rgba(15, 118, 110, 0.34)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#0f766e";
  ctx.fillText(text, 0, 0.5);
  layoutState.labels.push(layout.bounds);
  layoutState.lines.push(...layout.lines);
  ctx.restore();
}

function drawSocketDragDimension(ctx, projection) {
  if (!socketDrag) return;

  const fitting = state.fittings.find((item) => item.id === socketDrag.fittingId);
  const segmentData = segments();
  const segment = segmentData.find((item) => item.index === socketDrag.segmentIndex);
  if (!fitting || fitting.type !== "socket" || !segment) return;

  const lengthMm = pointLength(segment.vector);
  if (lengthMm <= 0.001) return;

  const socketPointWorld = lerpPoint(segment.start, segment.end, fitting.t);
  const fromDistance = lengthMm * fitting.t;
  const toDistance = lengthMm - fromDistance;
  const useFrom = fromDistance <= toDistance;
  const referenceWorld = useFrom ? segment.start : segment.end;
  const referenceIndex = useFrom ? segment.from : segment.to;
  const distanceMm = useFrom ? fromDistance : toDistance;
  const referencePoint = projectIso(referenceWorld, projection);
  const socketPoint = projectIso(socketPointWorld, projection);
  const referenceLabel = socketReferenceLabel(referenceIndex, segment, segmentData);
  const text = `SOCKET ${formatLength(distanceMm)} mm FROM ${referenceLabel}`;
  const dimensionLayout = {
    labels: [],
    lines: [],
    viewport: dimensionViewport(ctx, 18),
    pipes: segmentData.map((item) => ({
      index: item.index,
      start: projectIso(item.start, projection),
      end: projectIso(item.end, projection),
    })),
  };

  drawRedArrowDimension(ctx, referencePoint, socketPoint, segment.index, text, dimensionLayout);
}

function socketReferenceLabel(nodeIndex, currentSegment, segmentData) {
  const connections = nodeConnections(segmentData);
  const connected = connections.get(nodeIndex) ?? [];
  if (connected.length <= 1) return "END";
  if (connected.length >= 3) return nodeConnectionType(nodeIndex) === "branch" ? "BRANCH" : "TEE";
  if (connected.length === 2) {
    const first = segmentData.find((segment) => segment.index === connected[0].segmentIndex);
    const second = segmentData.find((segment) => segment.index === connected[1].segmentIndex);
    if (!first || !second) return "JOINT";
    const firstVector = subtractPoints(state.points[connected[0].other], state.points[nodeIndex]);
    const secondVector = subtractPoints(state.points[connected[1].other], state.points[nodeIndex]);
    const bend = Math.abs(180 - bendAngle(firstVector, secondVector));
    if (bend >= 0.5) return "BEND";
    const firstSize = pipeSizeForSegment(first).nb;
    const secondSize = pipeSizeForSegment(second).nb;
    if (firstSize !== secondSize) return "REDUCER";
  }
  return currentSegment ? "JOINT" : "POINT";
}

function drawRedArrowDimension(ctx, start, end, segmentIndex, text, dimensionLayout = []) {
  const layoutState = Array.isArray(dimensionLayout)
    ? { labels: dimensionLayout, lines: [], pipes: [] }
    : dimensionLayout;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const screenLength = Math.hypot(dx, dy);
  if (screenLength < 10) return;

  const along = { x: dx / screenLength, y: dy / screenLength };
  const baseNormal = { x: -along.y, y: along.x };
  const pipeGap = 13;
  const baseOffset = Math.min(112, Math.max(70, screenLength * 0.12));
  let labelAngle = Math.atan2(along.y, along.x);
  if (labelAngle > Math.PI / 2 || labelAngle < -Math.PI / 2) {
    labelAngle += Math.PI;
  }

  ctx.save();
  ctx.font = "950 12px Inter, system-ui, sans-serif";
  const metrics = ctx.measureText(text);
  const labelWidth = metrics.width + 22;
  const labelHeight = 24;
  const layout = redDimensionLayout(start, end, baseNormal, baseOffset, pipeGap, labelWidth, labelHeight, labelAngle, layoutState, segmentIndex);
  const { lineStart, lineEnd, midpoint } = layout;
  const { extensionStart, extensionEnd } = layout;
  const lineAngle = Math.atan2(lineEnd.y - lineStart.y, lineEnd.x - lineStart.x);

  ctx.shadowColor = "rgba(31, 42, 47, 0.16)";
  ctx.shadowBlur = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const stroke of [
    { color: "rgba(255, 253, 248, 0.94)", width: 6 },
    { color: "#c1121f", width: 2.4 },
  ]) {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    drawLine(ctx, lineStart, lineEnd);
    drawLine(ctx, extensionStart, lineStart);
    drawLine(ctx, extensionEnd, lineEnd);
    drawArrowHead(ctx, lineStart, lineAngle, stroke.width);
    drawArrowHead(ctx, lineEnd, lineAngle + Math.PI, stroke.width);
  }

  ctx.shadowColor = "transparent";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.translate(midpoint.x, midpoint.y);
  ctx.rotate(labelAngle);
  roundRect(ctx, -labelWidth * 0.5, -labelHeight * 0.5, labelWidth, labelHeight, 6);
  ctx.fillStyle = "rgba(255, 253, 248, 0.98)";
  ctx.fill();
  ctx.strokeStyle = "rgba(193, 18, 31, 0.36)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#c1121f";
  ctx.fillText(text, 0, 0.5);
  layoutState.labels.push(layout.bounds);
  layoutState.lines.push(...layout.lines);
  ctx.restore();
}

function drawArrowHead(ctx, point, angle, strokeWidth = 2) {
  const size = strokeWidth > 4 ? 9 : 8;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(point.x + Math.cos(angle + 0.48) * size, point.y + Math.sin(angle + 0.48) * size);
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(point.x + Math.cos(angle - 0.48) * size, point.y + Math.sin(angle - 0.48) * size);
  ctx.stroke();
}

function redDimensionLayout(start, end, baseNormal, baseOffset, pipeGap, labelWidth, labelHeight, labelAngle, dimensionLayout, segmentIndex, options = {}) {
  const midpointBase = {
    x: (start.x + end.x) * 0.5,
    y: (start.y + end.y) * 0.5,
  };
  const labels = Array.isArray(dimensionLayout) ? dimensionLayout : dimensionLayout.labels ?? [];
  const existingLines = Array.isArray(dimensionLayout) ? [] : dimensionLayout.lines ?? [];
  const pipes = Array.isArray(dimensionLayout) ? [] : dimensionLayout.pipes ?? [];
  const viewport = Array.isArray(dimensionLayout) ? null : dimensionLayout.viewport ?? null;
  const manual = options.manual && Number(options.manual.offset) > 0.5
    ? {
        side: Number(options.manual.side) < 0 ? -1 : 1,
        offset: clampNumber(Number(options.manual.offset) || 0, 0, 520),
      }
    : null;
  const sideOptions = manual ? [manual.side] : [1, -1];
  const maxLevels = manual ? 3 : 12;
  let best = null;

  for (let level = 0; level < maxLevels; level += 1) {
    const offset = baseOffset + (manual?.offset ?? 0) + level * 38;
    for (const [sideIndex, side] of sideOptions.entries()) {
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
      const rawBounds = rotatedLabelBounds(midpoint, labelWidth, labelHeight, labelAngle, 12);
      const labelShift = dimensionLabelShiftForViewport(rawBounds, viewport);
      const shiftedMidpoint = {
        x: midpoint.x + labelShift.x,
        y: midpoint.y + labelShift.y,
      };
      const bounds = shiftBounds(rawBounds, labelShift.x, labelShift.y);
      const labelShiftPenalty = labelShift.x * labelShift.x + labelShift.y * labelShift.y;
      const overlapArea = labels.reduce((sum, existing) => sum + boundsOverlapArea(bounds, existing), 0);
      const labelPipePenalty = pipes.reduce((sum, pipe) => {
        if (pipe.index === segmentIndex) return sum;
        if (segmentIntersectsBounds(pipe.start, pipe.end, bounds)) return sum + 18000;
        const clearance = Math.hypot(labelWidth, labelHeight) * 0.5 + 18;
        const distance = distancePointToSegment(shiftedMidpoint, pipe.start, pipe.end);
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
      const score = overlapArea * 90 + labelPipePenalty * 4 + linePipePenalty + dimensionLinePenalty + labelShiftPenalty * 80 + level * 10 + sideIndex * 2;
      const candidate = {
        lineStart,
        lineEnd,
        extensionStart,
        extensionEnd,
        midpoint: shiftedMidpoint,
        normal,
        bounds,
        lines: candidateLines,
        side,
        offset,
        score,
      };

      if (overlapArea === 0 && labelPipePenalty === 0 && linePipePenalty === 0 && dimensionLinePenalty === 0 && labelShiftPenalty === 0) {
        return candidate;
      }
      if (!best || score < best.score) {
        best = candidate;
      }
    }
  }

  return best;
}

function dimensionLabelShiftForViewport(bounds, viewport) {
  if (!viewport) return { x: 0, y: 0 };

  const labelWidth = bounds.right - bounds.left;
  const labelHeight = bounds.bottom - bounds.top;
  const viewportWidth = Math.max(1, viewport.right - viewport.left);
  const viewportHeight = Math.max(1, viewport.bottom - viewport.top);
  let x = 0;
  let y = 0;

  if (labelWidth > viewportWidth) {
    x = (viewport.left + viewport.right - bounds.left - bounds.right) * 0.5;
  } else if (bounds.left < viewport.left) {
    x = viewport.left - bounds.left;
  } else if (bounds.right > viewport.right) {
    x = viewport.right - bounds.right;
  }

  if (labelHeight > viewportHeight) {
    y = (viewport.top + viewport.bottom - bounds.top - bounds.bottom) * 0.5;
  } else if (bounds.top < viewport.top) {
    y = viewport.top - bounds.top;
  } else if (bounds.bottom > viewport.bottom) {
    y = viewport.bottom - bounds.bottom;
  }

  return { x, y };
}

function shiftBounds(bounds, x, y) {
  if (!x && !y) return bounds;
  return {
    left: bounds.left + x,
    right: bounds.right + x,
    top: bounds.top + y,
    bottom: bounds.bottom + y,
  };
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

function inflateBounds(bounds, amount) {
  return {
    left: bounds.left - amount,
    right: bounds.right + amount,
    top: bounds.top - amount,
    bottom: bounds.bottom + amount,
  };
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

function socketRadialDirectionPoint(direction, angleDegrees = 0) {
  const axis = normalizePoint(direction);
  const reference = Math.abs(axis.z) > 0.82 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 0, z: 1 };
  const u = normalizePoint(crossPoints(reference, axis));
  const v = normalizePoint(crossPoints(axis, u));
  const angle = normalizeSocketAngle(angleDegrees) * Math.PI / 180;
  return normalizePoint(addPoints(scalePoint(v, Math.cos(angle)), scalePoint(u, Math.sin(angle))));
}

function socketScreenDirection(segment, fitting, projection) {
  const base = lerpPoint(segment.start, segment.end, fitting.t);
  const radial = socketRadialDirectionPoint(segment.vector, fittingSocketAngle(fitting));
  const start = projectIso(base, projection);
  const end = projectIso(addPoints(base, radial, 1000), projection);
  const screenVector = { x: end.x - start.x, y: end.y - start.y };
  if (Math.hypot(screenVector.x, screenVector.y) > 0.001) {
    return normalizeScreenVector(screenVector);
  }

  const segmentStart = projectIso(segment.start, projection);
  const segmentEnd = projectIso(segment.end, projection);
  const along = normalizeScreenVector({ x: segmentEnd.x - segmentStart.x, y: segmentEnd.y - segmentStart.y });
  return { x: -along.y, y: along.x };
}

function drawFitting2d(ctx, projection, fitting, segment, pipeWidth) {
  const start = projectIso(segment.start, projection);
  const end = projectIso(segment.end, projection);
  const point = projectIso(lerpPoint(segment.start, segment.end, fitting.t), projection);
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const along = { x: Math.cos(angle), y: Math.sin(angle) };
  const normal = { x: -Math.sin(angle), y: Math.cos(angle) };
  const socketDirection = fitting.type === "socket" ? socketScreenDirection(segment, fitting, projection) : null;
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
  } else if (fitting.type === "rollGroove") {
    ctx.lineWidth = selected ? 3.2 : 2.4;
    for (const offset of [-4, 4]) {
      ctx.beginPath();
      ctx.moveTo(along.x * offset + normal.x * fittingWidth * -0.58, along.y * offset + normal.y * fittingWidth * -0.58);
      ctx.lineTo(along.x * offset + normal.x * fittingWidth * 0.58, along.y * offset + normal.y * fittingWidth * 0.58);
      ctx.stroke();
    }
    ctx.font = "900 8px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255, 253, 248, 0.95)";
    ctx.fillStyle = selected ? "#b42318" : "#0f766e";
    const labelX = normal.x * (fittingWidth * 0.95 + 8);
    const labelY = normal.y * (fittingWidth * 0.95 + 8);
    ctx.strokeText("RG", labelX, labelY);
    ctx.fillText("RG", labelX, labelY);
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
  } else if (fitting.type === "socket") {
    const branch = socketDirection ?? normal;
    const branchLength = Math.max(19, fittingWidth * 1.45);
    const socketRadius = Math.max(4.2, fittingWidth * 0.32);
    ctx.lineCap = "butt";
    ctx.lineWidth = selected ? 4 : 3;
    drawLine(
      ctx,
      { x: branch.x * 2, y: branch.y * 2 },
      { x: branch.x * branchLength, y: branch.y * branchLength },
    );
    ctx.beginPath();
    ctx.arc(branch.x * (branchLength + socketRadius * 0.35), branch.y * (branchLength + socketRadius * 0.35), socketRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.font = "900 8px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = selected ? "#b42318" : "#0f766e";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255, 253, 248, 0.95)";
    const label = '1/2"';
    const labelX = branch.x * (branchLength + socketRadius * 1.9);
    const labelY = branch.y * (branchLength + socketRadius * 1.9);
    ctx.strokeText(label, labelX, labelY);
    ctx.fillText(label, labelX, labelY);
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
  if (type === "socket") return "#0f766e";
  if (type === "rollGroove") return "#0f766e";
  return "#3f484b";
}

function fittingFill(type) {
  if (type === "valve") return "#fff4cf";
  if (type === "weld") return "#eff6ff";
  if (type === "reducer") return "#f1ebff";
  if (type === "socket") return "#dcfce7";
  if (type === "rollGroove") return "#d8f1ed";
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

function isCoarseInput() {
  return Boolean(
    window.matchMedia?.("(pointer: coarse)")?.matches ||
      window.matchMedia?.("(hover: none)")?.matches,
  );
}

function isTabletLayout() {
  return Boolean(window.matchMedia?.("(max-width: 1024px)")?.matches || isCoarseInput());
}

function isTouchLikeEvent(event) {
  return event.pointerType === "touch" || event.pointerType === "pen" || (!event.pointerType && isCoarseInput());
}

function hitLimit(mouseLimit, touchLimit) {
  return isCoarseInput() ? touchLimit : mouseLimit;
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

  return nearest && nearest.distance <= hitLimit(18, 34) ? nearest : null;
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
  return nearest && nearest.distance <= hitLimit(14, 28) ? nearest : null;
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
  return nearest && nearest.distance <= hitLimit(38, 56) ? nearest : null;
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

  return nearest && nearest.distance <= hitLimit(26, 40) ? nearest : null;
}

function findNearestDimensionTarget(pointer) {
  if (!state.showDimensions || !isLineDimensionStyle()) return null;
  let nearest = null;

  for (const target of dimensionHitTargets) {
    const labelBounds = inflateBounds(target.bounds, hitLimit(10, 16));
    const labelHit = pointInBounds(pointer, labelBounds);
    const lineDistance = (target.lines ?? []).reduce((best, line) => {
      const hit = distanceToSegment(pointer, line.start, line.end);
      return Math.min(best, hit.distance);
    }, Infinity);
    const distance = labelHit ? 0 : lineDistance;
    if (distance <= hitLimit(12, 22) && (!nearest || distance < nearest.distance)) {
      nearest = { ...target, distance };
    }
  }

  return nearest;
}

function findNearestAutoReducer(pointer) {
  const projection = getProjection();
  let nearest = null;

  for (const reducer of autoReducerTransitions(segments())) {
    if (reducer.kind !== "bend") continue;
    const segment = reducerPlacementSegment(reducer);
    if (!segment) continue;

    const point = reducerCentrePoint(reducer);
    const screen = projectIso(point, projection);
    const distance = Math.hypot(pointer.x - screen.x, pointer.y - screen.y);
    const lengthSq = Math.max(dotPoints(segment.vector, segment.vector), 1);
    const t = clampNumber(dotPoints(subtractPoints(point, segment.start), segment.vector) / lengthSq, 0, 1);
    if (!nearest || distance < nearest.distance) {
      nearest = {
        reducer,
        point,
        distance,
        segmentHit: { segment, distance, t },
      };
    }
  }

  return nearest && nearest.distance <= hitLimit(30, 46) ? nearest : null;
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

function closestSegmentParameters3d(firstStart, firstEnd, secondStart, secondEnd) {
  const u = subtractPoints(firstEnd, firstStart);
  const v = subtractPoints(secondEnd, secondStart);
  const w = subtractPoints(firstStart, secondStart);
  const a = dotPoints(u, u);
  const b = dotPoints(u, v);
  const c = dotPoints(v, v);
  const d = dotPoints(u, w);
  const e = dotPoints(v, w);
  const denominator = a * c - b * b;
  let firstT = 0;
  let secondT = 0;

  if (a <= 0.001 && c <= 0.001) {
    return { firstT: 0, secondT: 0, distance: pointLength(subtractPoints(firstStart, secondStart)) };
  }

  if (a <= 0.001) {
    secondT = clampNumber(e / c, 0, 1);
  } else if (c <= 0.001) {
    firstT = clampNumber(-d / a, 0, 1);
  } else if (Math.abs(denominator) > 0.001) {
    firstT = clampNumber((b * e - c * d) / denominator, 0, 1);
    secondT = clampNumber((a * e - b * d) / denominator, 0, 1);
  } else {
    const overlap = collinearOverlapParameters(firstStart, firstEnd, secondStart, secondEnd);
    if (overlap) {
      firstT = overlap.firstT;
      secondT = overlap.secondT;
    }
  }

  const firstPoint = lerpPoint(firstStart, firstEnd, firstT);
  const secondPoint = lerpPoint(secondStart, secondEnd, secondT);
  return {
    firstT,
    secondT,
    distance: pointLength(subtractPoints(firstPoint, secondPoint)),
  };
}

function collinearOverlapParameters(firstStart, firstEnd, secondStart, secondEnd) {
  const firstVector = subtractPoints(firstEnd, firstStart);
  const secondVector = subtractPoints(secondEnd, secondStart);
  const firstLengthSq = dotPoints(firstVector, firstVector);
  const secondLengthSq = dotPoints(secondVector, secondVector);
  if (firstLengthSq <= 0.001 || secondLengthSq <= 0.001) return null;

  const cross = pointLength(crossPoints(firstVector, secondVector));
  const relativeCross = cross / Math.max(1, Math.sqrt(firstLengthSq * secondLengthSq));
  const offLine = pointLength(crossPoints(subtractPoints(secondStart, firstStart), firstVector)) / Math.sqrt(firstLengthSq);
  if (relativeCross > 0.001 || offLine > RUN_CONNECTION_TOLERANCE_MM) return null;

  const tA = dotPoints(subtractPoints(secondStart, firstStart), firstVector) / firstLengthSq;
  const tB = dotPoints(subtractPoints(secondEnd, firstStart), firstVector) / firstLengthSq;
  const overlapStart = Math.max(0, Math.min(tA, tB));
  const overlapEnd = Math.min(1, Math.max(tA, tB));
  if (overlapEnd <= Math.max(overlapStart, 0.02)) return null;

  const firstT = Math.max(overlapStart, 0.02);
  const point = lerpPoint(firstStart, firstEnd, firstT);
  const secondT = clampNumber(dotPoints(subtractPoints(point, secondStart), secondVector) / secondLengthSq, 0, 1);
  return { firstT, secondT };
}

function findRunConnectionForNewSegment(startIndex, endPoint) {
  const start = state.points[startIndex];
  if (!start || almostSamePoint(start, endPoint)) return null;

  let best = null;
  for (const segment of segments()) {
    if (segment.from === startIndex || segment.to === startIndex) continue;

    const closest = closestSegmentParameters3d(start, endPoint, segment.start, segment.end);
    if (closest.distance > RUN_CONNECTION_TOLERANCE_MM) continue;
    if (closest.firstT <= 0.025 || closest.firstT > 1.001) continue;

    let candidate = null;
    if (closest.secondT > 0.025 && closest.secondT < 0.975) {
      candidate = {
        type: "segment",
        firstT: closest.firstT,
        segmentIndex: segment.index,
        segmentT: closest.secondT,
        point: lerpPoint(segment.start, segment.end, closest.secondT),
      };
    } else {
      const pointIndex = closest.secondT <= 0.5 ? segment.from : segment.to;
      if (pointIndex === startIndex) continue;
      candidate = {
        type: "point",
        firstT: closest.firstT,
        pointIndex,
        point: state.points[pointIndex],
      };
    }

    if (!best || candidate.firstT < best.firstT || (Math.abs(candidate.firstT - best.firstT) < 0.001 && candidate.type === "segment")) {
      best = candidate;
    }
  }

  return best;
}

function addRun(axis, length) {
  const from = activePointIndex();
  const start = state.points[from];
  const next = addPoints(start, axis.vector, length);
  addRunToPoint(from, next);
}

function addRunToPoint(from, next) {
  const start = state.points[from];
  if (!start || almostSamePoint(start, next)) {
    return;
  }

  const connection = findRunConnectionForNewSegment(from, next);
  if (connection) {
    const snapshot = createUndoSnapshot();
    const to = connection.type === "segment"
      ? splitSegmentAt(connection.segmentIndex, connection.segmentT)
      : connection.pointIndex;
    if (to === null || to === from) return;
    if (connection.type === "segment") {
      setNodeConnectionType(to, "tee", { update: false });
    }
    state.edges.push({ from, to, pipeSizeNb: state.pipeSizeNb });
    selectSingleSegment(state.edges.length - 1);
    state.selectedFitting = null;
    state.selectedNote = null;
    state.selectedPoint = to;
    state.activePoint = to;
    state.previewCandidate = null;
    state.history.push({ type: "snapshot", snapshot });
    updateAll();
    return;
  }

  const to = state.points.length;
  state.points.push(next);
  state.edges.push({ from, to, pipeSizeNb: state.pipeSizeNb });
  selectSingleSegment(state.edges.length - 1);
  state.selectedFitting = null;
  state.selectedNote = null;
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
    const reducer = autoReducerForConnection(nodeIndex, connected[0], connected[1], firstSegment, secondSegment, { bend });
    if (reducer) {
      applyReducerTakeoff(segmentTakeoffs, reducer);
      reducers.push(reducer);
    }

    if (bend < 0.5) {
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
      reducers.push(...autoReducersForTeeNode(nodeIndex, connected, segmentData));
      continue;
    }

    if (connected.length !== 2) continue;
    const firstSegment = segmentByIndex.get(connected[0].segmentIndex);
    const secondSegment = segmentByIndex.get(connected[1].segmentIndex);
    if (!firstSegment || !secondSegment) continue;

    const firstVector = subtractPoints(state.points[connected[0].other], state.points[nodeIndex]);
    const secondVector = subtractPoints(state.points[connected[1].other], state.points[nodeIndex]);
    const bend = Math.abs(180 - bendAngle(firstVector, secondVector));

    const reducer = autoReducerForConnection(nodeIndex, connected[0], connected[1], firstSegment, secondSegment, { bend });
    if (reducer) reducers.push(reducer);
  }

  return reducers;
}

function autoReducersForTeeNode(nodeIndex, connected, segmentData = segments()) {
  if (nodeConnectionType(nodeIndex) === "branch") return [];

  const entries = nodeConnectionEntries(nodeIndex, connected, segmentData);
  const mainPair = mostOppositeEntryPair(entries);
  if (!mainPair) return [];

  const reducers = [];
  const addTeeReducer = (first, second) => {
    const reducer = teeReducerFromEntries(nodeIndex, first, second);
    if (!reducer) return;
    const duplicate = reducers.some((item) => item.smallSegment.index === reducer.smallSegment.index);
    if (!duplicate) reducers.push(reducer);
  };

  const [first, second] = mainPair;
  addTeeReducer(first, second);

  const mainSegments = new Set(mainPair.map((entry) => entry.segment.index));
  const largestMainEntry = [...mainPair].sort((a, b) => b.size.od - a.size.od)[0];
  for (const entry of entries) {
    if (mainSegments.has(entry.segment.index)) continue;
    if (entry.size.od >= largestMainEntry.size.od || entry.size.nb === largestMainEntry.size.nb) continue;
    addTeeReducer(largestMainEntry, entry);
  }

  return reducers;
}

function teeReducerFromEntries(nodeIndex, first, second) {
  const reducer = autoReducerForConnection(nodeIndex, first, second, first.segment, second.segment, { bend: 0 });
  if (!reducer) return null;

  const takeoffMm = Math.min(reducer.lengthMm, pointLength(reducer.smallSegment.vector) * 0.45);
  return {
    ...reducer,
    kind: "tee",
    firstTakeoffMm: reducer.firstSegmentIndex === reducer.smallSegment.index ? takeoffMm : 0,
    secondTakeoffMm: reducer.secondSegmentIndex === reducer.smallSegment.index ? takeoffMm : 0,
    source: reducer.source === "Atlas table" ? "Atlas table tee reducer" : "estimated tee reducer",
  };
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

function autoReducerForConnection(nodeIndex, firstConnection, secondConnection, firstSegment, secondSegment, options = {}) {
  const firstSize = pipeSizeForSegment(firstSegment);
  const secondSize = pipeSizeForSegment(secondSegment);
  if (firstSize.nb === secondSize.nb) return null;

  const lengthMm = reducerLengthMm(firstSize, secondSize);
  const isBendReducer = Number(options.bend) >= 0.5;
  const firstIsLarge = firstSize.od >= secondSize.od;
  const largeSegment = firstIsLarge ? firstSegment : secondSegment;
  const smallSegment = firstIsLarge ? secondSegment : firstSegment;
  const largeSize = firstIsLarge ? firstSize : secondSize;
  const smallSize = firstIsLarge ? secondSize : firstSize;
  const largeOtherIndex = firstIsLarge ? firstConnection.other : secondConnection.other;
  const smallOtherIndex = firstIsLarge ? secondConnection.other : firstConnection.other;
  const placementSide = isBendReducer ? reducerSideForNode(nodeIndex) : "small";
  const placementSegment = placementSide === "large" ? largeSegment : smallSegment;
  const inlineFirstTakeoffMm = Math.min(lengthMm * 0.5, pointLength(firstSegment.vector) * 0.45);
  const inlineSecondTakeoffMm = Math.min(lengthMm * 0.5, pointLength(secondSegment.vector) * 0.45);
  const bendReducerTakeoffMm = Math.min(lengthMm, pointLength(placementSegment.vector) * 0.45);
  const firstTakeoffMm = isBendReducer
    ? (firstSegment.index === placementSegment.index ? bendReducerTakeoffMm : 0)
    : inlineFirstTakeoffMm;
  const secondTakeoffMm = isBendReducer
    ? (secondSegment.index === placementSegment.index ? bendReducerTakeoffMm : 0)
    : inlineSecondTakeoffMm;
  const firstBendTakeoffMm = isBendReducer ? bendTakeoffMm(firstSegment, options.bend) : 0;
  const secondBendTakeoffMm = isBendReducer ? bendTakeoffMm(secondSegment, options.bend) : 0;
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
    kind: isBendReducer ? "bend" : "inline",
    placementSide,
    bend: Number(options.bend) || 0,
    largeBendTakeoffMm: firstIsLarge ? firstBendTakeoffMm : secondBendTakeoffMm,
    smallBendTakeoffMm: firstIsLarge ? secondBendTakeoffMm : firstBendTakeoffMm,
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
  if (fitting?.type === "rollGroove") return null;
  const weightKg = Number(fitting?.weightKg);
  return Number.isFinite(weightKg) && weightKg >= 0 ? weightKg : null;
}

function fittingWeightSource(fitting, segment = null) {
  if (fitting?.type === "rollGroove") return "zero weight";
  if (fittingWeightOverride(fitting) !== null) return "manual";
  return atlasFittingWeightKg(fitting, segment) === null ? "estimated" : "Atlas table";
}

function fittingWeightKg(fitting, segment) {
  if (fitting?.type === "rollGroove") return 0;
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
  if (fitting.type === "socket") {
    const socketSize = pipeSizeByNb(fittingSocketSizeNb(fitting));
    return Math.max(0.06, pipeMassPerMetreForSize(socketSize) * 0.05 + 0.03);
  }
  if (fitting.type === "rollGroove") return 0;
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

function takeoffCountRows(quantities = quantitySummary()) {
  const rows = new Map();
  const spec = pipeSpec();
  const add = (key, label, quantity = 1, weightKg = 0, detail = "", order = 50) => {
    const existing = rows.get(key) ?? {
      key,
      label,
      quantity: 0,
      weightKg: 0,
      detail,
      order,
      lengthMm: 0,
      runCount: 0,
      singleFlanges: 0,
      doubleFlangeSets: 0,
    };
    existing.quantity += quantity;
    existing.weightKg += Number(weightKg) || 0;
    rows.set(key, existing);
    return existing;
  };

  for (const { segment, quantity } of quantities.segments) {
    const size = pipeSizeForSegment(segment);
    const row = add(
      `pipe:${size.nb}:${spec.schedule}`,
      `Pipe NB ${size.nb} ${spec.schedule}`,
      0,
      quantity.pipeWeightKg,
      `${spec.material} pipe`,
      0,
    );
    row.lengthMm += quantity.cutLengthMm;
    row.runCount += 1;
  }

  for (const elbow of quantities.elbows) {
    const angle = formatAngle(elbow.bend);
    add(
      `elbow:${elbow.nb}:${angle}`,
      `LR elbow NB ${elbow.nb} ${angle} deg`,
      1,
      elbow.weightKg,
      "buttweld bend",
      10,
    );
  }

  for (const tee of quantities.tees) {
    const label = tee.reducing
      ? `Reducing tee NB ${tee.nb} x NB ${tee.branchNb}`
      : `Tee NB ${tee.nb}`;
    add(
      `tee:${tee.nb}:${tee.branchNb}:${tee.reducing ? "reducing" : "equal"}`,
      label,
      1,
      tee.weightKg,
      tee.source,
      20,
    );
  }

  for (const branch of quantities.branches) {
    add(
      `branch:${branch.nb}:${branch.branchNb}`,
      `Branch weld NB ${branch.nb} x NB ${branch.branchNb}`,
      1,
      branch.weightKg,
      branch.source,
      25,
    );
  }

  for (const reducer of quantities.reducers) {
    add(
      `reducer:auto:${reducer.largeNb}:${reducer.smallNb}`,
      `Reducer NB ${reducer.largeNb} x NB ${reducer.smallNb}`,
      1,
      reducer.weightKg,
      reducer.source ?? "auto size change",
      30,
    );
  }

  for (const item of quantities.fittings) {
    const size = pipeSizeForSegment(item.segment);
    const type = item.fitting?.type;
    if (type === "flange") {
      const mode = fittingFlangeMode(item.fitting);
      const row = add(
        `flange:${size.nb}`,
        `Flange NB ${size.nb}`,
        mode === "double" ? 2 : 1,
        item.weightKg,
        "physical flange plates",
        40,
      );
      if (mode === "double") row.doubleFlangeSets += 1;
      else row.singleFlanges += 1;
      continue;
    }

    if (type === "reducer") {
      add(
        `reducer:manual:${size.nb}`,
        `Manual reducer on NB ${size.nb}`,
        1,
        item.weightKg,
        "confirm outlet size",
        31,
      );
      continue;
    }

    if (type === "socket") {
      const socketNb = fittingSocketSizeNb(item.fitting);
      add(
        `socket:${socketNb}:host:${size.nb}`,
        `Socket NB ${socketNb} on NB ${size.nb}`,
        1,
        item.weightKg,
        `${formatAngle(fittingSocketAngle(item.fitting))} deg rotation`,
        70,
      );
      continue;
    }

    if (type === "rollGroove") {
      add(
        `rollGroove:${size.nb}`,
        `Roll groove NB ${size.nb}`,
        1,
        0,
        "0 kg allowance",
        60,
      );
      continue;
    }

    if (type === "valve") {
      add(`valve:${size.nb}`, `Valve NB ${size.nb}`, 1, item.weightKg, item.weightSource, 50);
      continue;
    }

    if (type === "weld") {
      add(`weld:${size.nb}`, `Weld mark NB ${size.nb}`, 1, item.weightKg, item.weightSource, 55);
    }
  }

  return [...rows.values()]
    .map((row) => {
      let countText = row.lengthMm > 0
        ? `${formatLength(row.lengthMm)} mm`
        : `x${row.quantity}`;
      let detail = row.detail;
      if (row.runCount) {
        detail = `${detail}; ${row.runCount} cut run${row.runCount === 1 ? "" : "s"}`;
      }
      if (row.singleFlanges || row.doubleFlangeSets) {
        detail = `${row.singleFlanges} single / ${row.doubleFlangeSets} double set${row.doubleFlangeSets === 1 ? "" : "s"}`;
      }
      return {
        ...row,
        countText,
        detail,
      };
    })
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
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
  const placementOther = state.points[reducerPlacementOtherIndex(reducer)];
  if (!joint || !placementOther) return joint;
  if (reducer.kind !== "bend" && !reducerStartsAtJoint(reducer)) return joint;

  const direction = normalizePoint(subtractPoints(placementOther, joint));
  const segmentLength = pointLength(subtractPoints(placementOther, joint));
  const offset = reducer.kind === "bend" ? reducerLegOffsetMm(reducer) : 0;
  const distance = Math.min(offset + (reducer.lengthMm ?? 0) * 0.5, segmentLength * 0.95);
  return addPoints(joint, direction, distance);
}

function reducerStartsAtJoint(reducer) {
  return reducer?.kind === "tee";
}

function reducerSideForNode(nodeIndex) {
  const value = state.reducerSideOverrides?.[nodeIndex];
  return value === "large" ? "large" : "small";
}

function reducerPlacementSide(reducer) {
  return reducer?.kind === "bend" && reducer.placementSide === "large" ? "large" : "small";
}

function reducerPlacementSegment(reducer) {
  return reducerPlacementSide(reducer) === "large" ? reducer.largeSegment : reducer.smallSegment;
}

function reducerPlacementOtherIndex(reducer) {
  return reducerPlacementSide(reducer) === "large" ? reducer.largeOtherIndex : reducer.smallOtherIndex;
}

function reducerPlacementBendTakeoffMm(reducer) {
  return reducerPlacementSide(reducer) === "large"
    ? Number(reducer.largeBendTakeoffMm) || 0
    : Number(reducer.smallBendTakeoffMm) || 0;
}

function reducerLegOffsetMm(reducer) {
  if (reducer?.kind !== "bend") return 0;
  const placementSegment = reducerPlacementSegment(reducer);
  const smallLength = pointLength(placementSegment?.vector ?? { x: 0, y: 0, z: 0 });
  const bendTakeoff = reducerPlacementBendTakeoffMm(reducer);
  const reducerLength = Number(reducer.lengthMm) || 0;
  return clampNumber(bendTakeoff, 0, Math.max(0, smallLength - reducerLength));
}

function reducerScreenOffsetPixels(reducer, joint, placementOther, reducerLengthPx) {
  const screenLength = Math.hypot(placementOther.x - joint.x, placementOther.y - joint.y);
  const placementLength = pointLength(reducerPlacementSegment(reducer)?.vector ?? { x: 0, y: 0, z: 0 });
  if (screenLength <= reducerLengthPx + 4 || placementLength <= 0) return 2;

  const raw = (reducerLegOffsetMm(reducer) / placementLength) * screenLength;
  const visibleOffset = Math.max(raw, 18);
  return clampNumber(visibleOffset, 2, Math.max(2, screenLength - reducerLengthPx - 2));
}

function computeAutoReducerRenderTrims(reducers) {
  const trims = new Map();
  const addTrim = (segment, nodeIndex, amount) => {
    if (!segment || !Number.isInteger(nodeIndex) || !Number.isFinite(amount) || amount <= 0) return;
    const key = `${segment.index}:${nodeIndex}`;
    trims.set(key, Math.max(trims.get(key) ?? 0, amount));
  };

  for (const reducer of reducers) {
    const modelLength = Math.max(0.08, (Number(reducer.lengthMm) || 0) / 1000);
    if (reducer.kind === "bend") {
      addTrim(reducerPlacementSegment(reducer), reducer.nodeIndex, modelLength);
    } else if (reducerStartsAtJoint(reducer)) {
      addTrim(reducer.smallSegment, reducer.nodeIndex, modelLength);
    } else {
      addTrim(reducer.largeSegment, reducer.nodeIndex, modelLength * 0.5);
      addTrim(reducer.smallSegment, reducer.nodeIndex, modelLength * 0.5);
    }
  }

  return trims;
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

  const slingAngleDegrees = normalizeLiftingSlingAngle(state.liftingSlingAngleDegrees);
  const slingLoadFactor = slingAngleLoadFactor(slingAngleDegrees);
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

  const spreadRatio = slingAngleSpreadRatio(slingAngleDegrees);
  const targetMin = Math.min(900, Math.max(350, span * 0.18));
  const targetMax = Math.min(7000, Math.max(targetMin, span * 0.86));
  const targetSeparation = clampNumber(span * spreadRatio, targetMin, targetMax);
  const minSeparation = Math.min(Math.max(350, targetSeparation * 0.48), Math.max(350, span * 0.72));
  const separationWeight = slingAngleSeparationWeight(slingAngleDegrees);
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
      const separationPenalty = Math.abs(separationMm - targetSeparation) * separationWeight;
      const halfTargetSeparation = targetSeparation * 0.5;
      const angleDistancePenalty = (
        Math.abs(pointLength(firstFromCog) - halfTargetSeparation) +
        Math.abs(pointLength(secondFromCog) - halfTargetSeparation)
      ) * 0.55;
      const outsidePenalty = loadSplit.withinSpan ? 0 : span * 2;
      const imbalancePenalty = liftPoint.totalWeightKg > 0
        ? (Math.abs(loadSplit.firstLoadKg - loadSplit.secondLoadKg) / liftPoint.totalWeightKg) * span * 0.18
        : 0;
      const score = midpointErrorMm * 1.15 + loadSplit.offLineErrorMm * 2.2 + sameSidePenalty + separationPenalty + angleDistancePenalty + imbalancePenalty + outsidePenalty;

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
  best.points[0].slingTensionKg = loadSplit.firstLoadKg * slingLoadFactor;
  best.points[1].slingTensionKg = loadSplit.secondLoadKg * slingLoadFactor;
  best.points[0].slingAngleDegrees = slingAngleDegrees;
  best.points[1].slingAngleDegrees = slingAngleDegrees;
  best.slingAngleDegrees = slingAngleDegrees;
  best.slingLoadFactor = slingLoadFactor;
  best.targetSeparationMm = targetSeparation;
  best.minSeparationMm = minSeparation;

  return best;
}

function slingAngleSpreadRatio(angleDegrees = state.liftingSlingAngleDegrees) {
  const angle = normalizeLiftingSlingAngle(angleDegrees);
  const flatness = clampNumber((90 - angle) / 60, 0, 1);
  return clampNumber(0.2 + flatness * 0.56, 0.2, 0.76);
}

function slingAngleSeparationWeight(angleDegrees = state.liftingSlingAngleDegrees) {
  const angle = normalizeLiftingSlingAngle(angleDegrees);
  const flatness = clampNumber((90 - angle) / 60, 0, 1);
  return clampNumber(1.15 + flatness * 1.35, 1.15, 2.5);
}

function slingAngleLoadFactor(angleDegrees = state.liftingSlingAngleDegrees) {
  const angle = normalizeLiftingSlingAngle(angleDegrees);
  const sine = Math.sin((angle * Math.PI) / 180);
  return 1 / Math.max(0.001, sine);
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
  const angle = normalizeLiftingSlingAngle(lug.slingAngleDegrees ?? state.liftingSlingAngleDegrees);
  const slingTension = lug.slingTensionKg ?? ((lug.loadKg ?? 0) * slingAngleLoadFactor(angle));
  return `Lug ${lug.number}: run ${lug.segment.index + 1}, ${formatLength(lug.distanceFromRunStartMm)} mm from run start, est. vertical share ${formatMass(lug.loadKg ?? 0)} kg / sling tension ${formatMass(slingTension)} kg @ ${angle} deg`;
}

function liftingPointPlanSummary(lugPlan) {
  if (!lugPlan) return "No calculated lifting points yet.";
  const offLine = lugPlan.loadSplit?.offLineErrorMm ?? 0;
  const angle = normalizeLiftingSlingAngle(lugPlan.slingAngleDegrees ?? state.liftingSlingAngleDegrees);
  const factor = lugPlan.slingLoadFactor ?? slingAngleLoadFactor(angle);
  const target = Number.isFinite(lugPlan.targetSeparationMm) ? `target ${formatLength(lugPlan.targetSeparationMm)} mm; ` : "";
  return `Spacing ${formatLength(lugPlan.separationMm)} mm; ${target}COG ${formatLength(offLine)} mm off lug line; midpoint ${formatLength(lugPlan.midpointErrorMm)} mm from COG; sling angle ${angle} deg from horizontal, load factor x${factor.toFixed(2)}.`;
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
  reindexDimensionOffsetsAfterSegmentSplit(segmentIndex);

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
  } else if (type === "socket") {
    fitting.socketSizeNb = normalizePipeSize(options.socketSizeNb ?? SOCKET_SIZE_NB);
    fitting.socketAngle = normalizeSocketAngle(options.socketAngle);
  }

  state.fittings.push(fitting);
  state.selectedFitting = nextFittingId;
  selectSingleSegment(segmentIndex);
  state.selectedNote = null;
  nextFittingId += 1;
  state.history.push({ type: "fitting" });
  updateAll();
}

function placeSocketFittings(segmentIndex, positions) {
  const fittingIds = [];
  for (const t of positions) {
    const fitting = {
      id: nextFittingId,
      type: "socket",
      segmentIndex,
      t: normalizeFittingPosition("socket", t),
      socketSizeNb: SOCKET_SIZE_NB,
      socketAngle: 0,
    };
    state.fittings.push(fitting);
    fittingIds.push(fitting.id);
    nextFittingId += 1;
  }

  if (!fittingIds.length) return;
  state.selectedFitting = fittingIds[fittingIds.length - 1];
  selectSingleSegment(segmentIndex);
  state.selectedNote = null;
  state.history.push({ type: "fittings", fittingIds });
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

function createUndoSnapshot() {
  return {
    payload: statePayload(),
    nextFittingId,
    nextNoteId,
  };
}

function undo() {
  const last = state.history.pop();
  if (!last) return;

  if (last.type === "snapshot") {
    const remainingHistory = state.history;
    const restored = stateFromPayload(last.snapshot?.payload);
    if (restored) {
      state = restored;
      state.history = remainingHistory;
      nextFittingId = Number(last.snapshot?.nextFittingId) || nextFittingId;
      nextNoteId = Number(last.snapshot?.nextNoteId) || nextNoteId;
    }
  } else if (last.type === "edge" && state.points.length > 1) {
    state.edges.splice(last.edgeIndex, 1);
    state.points.splice(last.pointIndex, 1);
    reindexNodeTypesAfterPointRemoval(last.pointIndex);
    reindexReducerSideOverridesAfterPointRemoval(last.pointIndex);
    reindexDimensionOffsetsAfterSegmentRemoval(last.edgeIndex);
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
  } else if (last.type === "fittings") {
    const fittingIds = new Set(last.fittingIds ?? []);
    state.fittings = state.fittings.filter((fitting) => !fittingIds.has(fitting.id));
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
    reindexDimensionOffsetsAfterSegmentRemoval(removedEdgeIndex);
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
  if (tool !== "boxSelect") {
    cancelBoxSelect({ redraw: false });
  }
  cancelDimensionDrag({ redraw: false });
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
    <p class="weight-note">${pipeSpec().label}. Atlas table weights are used where available. Roll grooves add 0 kg. Branch welds, valves, sockets and custom weld allowances remain estimates unless set manually.</p>
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
  const takeoffCounts = takeoffCountRows(quantities)
    .map((row) => `
      <span>${row.label}</span>
      <strong>${row.countText}${row.weightKg ? ` / ${formatMass(row.weightKg)} kg` : ""}</strong>
      <small>${row.detail}</small>
    `)
    .join("");

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
    <div class="bend-notes takeoff-counts">
      <strong>Take-off list by size</strong>
      <div class="takeoff-count-grid">${takeoffCounts}</div>
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
    <p>${pipeSpec().label}, LR elbows.${liftDisclaimer} Atlas table weights are used where available. Roll grooves add 0 kg. Valves, sockets and weld allowances remain estimated unless set manually.</p>
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
  state.pipeSizeNb = pipeSizeNb;
  const selected = normalizeSelectedSegments(indexes, state.edges.length);
  if (!selected.length) {
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
  updateProjectReadout();
}

function updateProjectReadout() {
  if (!projectReadout) return;
  const title = projectDisplayName();
  projectReadout.textContent = hasProjectInfo() ? title : "No project set";
  projectReadout.title = state.projectId
    ? `${title} - saved in this browser`
    : hasProjectInfo()
    ? `${title} - not saved in project list yet`
    : "No project details entered";
}

function updatePropertiesPanel() {
  if (!propertiesPanel) return;

  const fitting = selectedFittingData();
  if (fitting) {
    const distance = pointLength(subtractPoints(fitting.point, fitting.segment.start));
    const fittingActions = fitting.fitting.type === "rollGroove"
      ? [["delete-fitting", "Delete", "danger"]]
      : [
          ["set-fitting-weight", "Set weight"],
          ...(fitting.weightSource === "manual" ? [["clear-fitting-weight", "Clear manual"]] : []),
          ["delete-fitting", "Delete", "danger"],
        ];
    renderProperties(
      `${fittingActionLabel(fitting.fitting.type)} fitting`,
      [
        ["Run", fitting.segment.index + 1],
        ["Position", `${formatLength(distance)} mm`],
        ["NB", pipeSizeForSegment(fitting.segment).nb],
        ["Mode", fittingModeText(fitting)],
        ["Weight", `${formatMass(fitting.weightKg)} kg ${fitting.weightSource}`],
      ],
      fittingActions,
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
  if (data.fitting.type === "rollGroove") return;

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

function setPreviewMode(value) {
  state.previewMode = normalizePreviewMode(value);
  if (previewModeSelect) previewModeSelect.value = state.previewMode;
  if (previewModePanelSelect) previewModePanelSelect.value = state.previewMode;
  update3dPreview();
  renderFallbackPreview();
  persistState();
}

function updateControls() {
  if (appVersionBadge) {
    appVersionBadge.textContent = APP_VERSION;
    appVersionBadge.title = `IsoSpool Studio ${APP_VERSION} build ${APP_BUILD_DATE}`;
  }
  stepLengthInput.value = String(state.stepLength);
  updateSelectionControls();
  updateProjectInputs();
  angleInput.value = String(state.angleDegrees);
  anglePlaneSelect.value = state.anglePlane;
  pipeSpecSelect.value = normalizePipeSpec(state.pipeSpec);
  flangeModeSelect.value = normalizeFlangeMode(state.flangeMode);
  const previewMode = normalizePreviewMode(state.previewMode);
  if (previewModeSelect) previewModeSelect.value = previewMode;
  if (previewModePanelSelect) previewModePanelSelect.value = previewMode;
  if (previewLabelToggle) previewLabelToggle.checked = state.show3dLabels !== false;
  updatePipeSizeControls();
  dimensionToggle.checked = state.showDimensions;
  dimensionStyleSelect.value = normalizeDimensionStyle(state.dimensionStyle);
  dimensionStyleSelect.disabled = !state.showDimensions;
  liftingToggle.checked = state.showLiftingPoints;
  liftingAngleSelect.value = String(normalizeLiftingSlingAngle(state.liftingSlingAngleDegrees));
  liftingAngleSelect.disabled = !state.showLiftingPoints;
  setTool(state.activeTool);
}

function updateAll(options = {}) {
  const save = options.save !== false;
  normalizeStateFittingPositions();
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

function setupMobilePanels() {
  if (!mobilePanelButtons.length) return;

  for (const button of mobilePanelButtons) {
    button.addEventListener("click", () => showMobilePanel(button.dataset.mobilePanel));
  }

  for (const button of mobilePanelCloseButtons) {
    button.addEventListener("click", () => showMobilePanel("drawing"));
  }

  mobilePanelScrim?.addEventListener("click", () => showMobilePanel("drawing"));
  showMobilePanel("drawing");
}

function showMobilePanel(panel = "drawing") {
  let normalized = panel === "inspector" || panel === "preview" ? panel : "drawing";
  if (!isTabletLayout()) {
    normalized = "drawing";
  }
  const sheetOpen = normalized !== "drawing";

  document.body.dataset.mobilePanel = normalized;
  document.body.classList.toggle("mobile-panel-open", sheetOpen);
  controlPanel?.classList.toggle("mobile-sheet-open", normalized === "inspector");
  previewPanel?.classList.toggle("mobile-sheet-open", normalized === "preview");

  if (mobilePanelScrim) {
    mobilePanelScrim.hidden = !sheetOpen;
  }

  for (const button of mobilePanelButtons) {
    button.classList.toggle("active", button.dataset.mobilePanel === normalized);
    button.setAttribute("aria-pressed", String(button.dataset.mobilePanel === normalized));
  }

  if (normalized === "preview") {
    renderFallbackPreview();
    resizeThree();
  } else if (normalized === "drawing") {
    closeDrawingContextMenu();
  }
}

function setupAuthDialog() {
  loadAuthRememberPreference();
  updateCloudStatus();
  setAuthMode("signin");

  accountButton?.addEventListener("click", () => {
    openAuthDialog();
  });

  authSignInModeButton?.addEventListener("click", () => setAuthMode("signin"));
  authCreateModeButton?.addEventListener("click", () => setAuthMode("signup"));
  authRememberDeviceInput?.addEventListener("change", saveAuthRememberPreference);

  authCloseButton?.addEventListener("click", closeAuthDialog);
  authDialog?.addEventListener("pointerdown", (event) => {
    if (event.target === authDialog) {
      closeAuthDialog();
    }
  });

  authDialogForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (authMode === "signup") {
      signUpWithSupabase();
    } else {
      signInWithSupabase();
    }
  });

  authSignUpButton?.addEventListener("click", () => {
    signUpWithSupabase();
  });

  authResendButton?.addEventListener("click", () => {
    resendSignupEmail();
  });

  authSignOutButton?.addEventListener("click", () => {
    signOutFromSupabase();
  });
}

function setAuthMode(mode, options = {}) {
  authMode = mode === "signup" ? "signup" : "signin";
  const createMode = authMode === "signup";

  authSignInModeButton?.classList.toggle("active", !createMode);
  authCreateModeButton?.classList.toggle("active", createMode);
  authSignInModeButton?.setAttribute("aria-selected", String(!createMode));
  authCreateModeButton?.setAttribute("aria-selected", String(createMode));

  if (authDialogTitle) authDialogTitle.textContent = createMode ? "Create account" : "Sign in";
  if (authSignInButton) {
    authSignInButton.hidden = createMode;
    authSignInButton.disabled = Boolean(cloudUser);
  }
  if (authSignUpButton) {
    authSignUpButton.hidden = !createMode;
    authSignUpButton.disabled = Boolean(cloudUser);
  }
  if (authResendButton) authResendButton.hidden = !createMode || Boolean(cloudUser);
  if (authPasswordInput) {
    authPasswordInput.autocomplete = createMode ? "new-password" : "current-password";
  }
  if (authModeHelp) {
    authModeHelp.textContent = createMode
      ? "Create an account, then check your inbox for the confirmation email. If it does not arrive, press Resend email."
      : "Use the email and password you created for IsoSpool.";
  }
  if (authDialogStatus && !options.keepStatus) {
    authDialogStatus.textContent = cloudUser
      ? `${cloudUser.email || "Signed in"} - ${cloudLicenseText()}`
      : createMode
      ? "Create an account to start a free trial and save spool projects to the cloud."
      : "Sign in to save and open spool projects from the cloud.";
  }
}

function openAuthDialog(options = {}) {
  if (!authDialog) return;
  loadAuthRememberPreference();
  updateCloudStatus();
  setAuthMode(options.mode ?? authMode, { keepStatus: options.startup });
  if (options.startup) {
    startupProjectPromptPending = true;
    if (authDialogStatus) {
      authDialogStatus.textContent = "Sign in or create an account to save your spool projects to the cloud. You can close this and keep working locally.";
    }
  }
  authDialog.hidden = false;
  if (cloudUser) {
    authSignOutButton?.focus();
  } else {
    authEmailInput?.focus();
  }
}

function closeAuthDialog() {
  saveAuthRememberPreference();
  if (authDialog) authDialog.hidden = true;
  if (startupProjectPromptPending) {
    startupProjectPromptPending = false;
    window.setTimeout(() => promptForProjectDetails(), 150);
  }
}

function loadAuthRememberPreference() {
  if (!authRememberDeviceInput) return;
  try {
    authRememberDeviceInput.checked = localStorage.getItem(AUTH_REMEMBER_DEVICE_KEY) === "yes";
  } catch {
    authRememberDeviceInput.checked = false;
  }
}

function saveAuthRememberPreference() {
  if (!authRememberDeviceInput) return;
  try {
    if (authRememberDeviceInput.checked) {
      localStorage.setItem(AUTH_REMEMBER_DEVICE_KEY, "yes");
    } else {
      localStorage.removeItem(AUTH_REMEMBER_DEVICE_KEY);
    }
  } catch {
    // The checkbox still works visually if browser storage is unavailable.
  }
}

function authPromptRememberedOnDevice() {
  try {
    return localStorage.getItem(AUTH_REMEMBER_DEVICE_KEY) === "yes";
  } catch {
    return false;
  }
}

async function runStartupPrompts() {
  await initSupabase();
  if (maybeOpenStartupAuthPrompt()) return;
  promptForProjectDetails();
}

function maybeOpenStartupAuthPrompt() {
  if (!authDialog || !supabaseClient || cloudUser) return false;
  if (authDialog.hidden === false) return true;
  if (authPromptRememberedOnDevice()) return false;

  try {
    if (sessionStorage.getItem(AUTH_PROMPT_SESSION_KEY) === "shown") return false;
    sessionStorage.setItem(AUTH_PROMPT_SESSION_KEY, "shown");
  } catch {
    // If session storage is unavailable, still show the first-run prompt.
  }

  openAuthDialog({ startup: true });
  return true;
}

function authCredentials() {
  const email = authEmail();
  const password = String(authPasswordInput?.value ?? "");
  if (!email) return null;
  if (password.length < 6) {
    window.alert("Password must be at least 6 characters.");
    return null;
  }
  return { email, password };
}

function authEmail() {
  const email = String(authEmailInput?.value ?? "").trim();
  if (!email || !email.includes("@")) {
    window.alert("Enter a valid email address.");
    return null;
  }
  return email;
}

function isEmailNotConfirmedError(error) {
  const message = String(error?.message ?? error?.error_description ?? "").toLowerCase();
  const code = String(error?.code ?? "").toLowerCase();
  return code.includes("email_not_confirmed") ||
    message.includes("email not confirmed") ||
    message.includes("not confirmed");
}

function showConfirmationResendState(email = authEmailInput?.value) {
  if (email && authEmailInput) authEmailInput.value = String(email).trim();
  setAuthMode("signup");
  if (authDialogStatus) {
    authDialogStatus.textContent = "This email is registered but not confirmed yet. Press Resend email, then check your inbox and junk/spam folders.";
  }
  if (authModeHelp) {
    authModeHelp.textContent = "If your work email scans incoming mail, the confirmation can take a few minutes. You can resend it from here.";
  }
  if (authResendButton) {
    authResendButton.hidden = false;
    authResendButton.focus();
  }
}

async function ensureSupabaseClient() {
  await initSupabase();
  if (!supabaseClient) {
    window.alert("Cloud login is not available right now. Check your internet connection and Supabase setup.");
    return false;
  }
  return true;
}

async function signInWithSupabase() {
  const credentials = authCredentials();
  if (!credentials || !(await ensureSupabaseClient())) return;
  if (await reloadIfOutdatedBeforeAuth()) return;

  authSignInButton.disabled = true;
  updateCloudStatus("Signing in...", "");
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword(credentials);
    if (error) throw error;
    await applyCloudSession(data?.session ?? null);
    saveAuthRememberPreference();
    authPasswordInput.value = "";
    closeAuthDialog();
  } catch (error) {
    console.warn("Sign in failed.", error);
    if (isEmailNotConfirmedError(error)) {
      showConfirmationResendState(credentials.email);
      updateCloudStatus("Email not confirmed", "warning");
    } else {
      updateCloudStatus("Sign in failed", "warning");
      window.alert(error?.message || "Sign in failed.");
    }
  } finally {
    authSignInButton.disabled = false;
  }
}

async function signUpWithSupabase() {
  const credentials = authCredentials();
  if (!credentials || !(await ensureSupabaseClient())) return;
  if (await reloadIfOutdatedBeforeAuth()) return;

  authSignUpButton.disabled = true;
  updateCloudStatus("Creating account...", "");
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        emailRedirectTo: location.href.split("#")[0],
      },
    });
    if (error) throw error;
    if (data?.session) {
      await applyCloudSession(data.session);
      saveAuthRememberPreference();
      authPasswordInput.value = "";
      closeAuthDialog();
    } else {
      saveAuthRememberPreference();
      setAuthMode("signup");
      if (authDialogStatus) {
        authDialogStatus.textContent = "Account created. Check your email for the confirmation link. You can press Resend email if it does not arrive.";
      }
      if (authResendButton) authResendButton.hidden = false;
      updateCloudStatus("Check email", "");
      window.alert("Account created. Check your email for the Supabase confirmation link, then sign in here.");
    }
  } catch (error) {
    console.warn("Sign up failed.", error);
    updateCloudStatus("Sign up failed", "warning");
    window.alert(error?.message || "Sign up failed.");
  } finally {
    authSignUpButton.disabled = false;
    setAuthMode("signup", { keepStatus: true });
  }
}

async function resendSignupEmail() {
  const email = authEmail();
  if (!email || !(await ensureSupabaseClient())) return;
  if (await reloadIfOutdatedBeforeAuth()) return;

  authResendButton.disabled = true;
  updateCloudStatus("Resending email...", "");
  try {
    const { error } = await supabaseClient.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: location.href.split("#")[0],
      },
    });
    if (error) throw error;
    saveAuthRememberPreference();
    setAuthMode("signup");
    updateCloudStatus("Email resent", "");
    window.alert("Confirmation email sent again. Check your inbox and junk/spam folders.");
  } catch (error) {
    console.warn("Confirmation resend failed.", error);
    updateCloudStatus("Resend failed", "warning");
    window.alert(error?.message || "Could not resend the confirmation email.");
  } finally {
    authResendButton.disabled = false;
    setAuthMode("signup", { keepStatus: true });
  }
}

async function signOutFromSupabase() {
  if (!supabaseClient) return;

  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    await applyCloudSession(null);
    closeAuthDialog();
  } catch (error) {
    console.warn("Sign out failed.", error);
    window.alert(error?.message || "Sign out failed.");
  }
}

function setupProjectDialog() {
  if (!projectDialogForm || !projectDialogCancelButton) return;

  projectDialogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    closeProjectDetailsDialog(projectDetailsFromDialog());
  });

  projectDialogCancelButton.addEventListener("click", () => {
    closeProjectDetailsDialog(null);
  });

  projectDialog?.addEventListener("pointerdown", (event) => {
    if (event.target === projectDialog) {
      closeProjectDetailsDialog(null);
    }
  });

  newDrawingCancelButton?.addEventListener("click", () => closeNewDrawingDialog("cancel"));
  newDrawingDiscardButton?.addEventListener("click", () => closeNewDrawingDialog("discard"));
  newDrawingSaveButton?.addEventListener("click", () => closeNewDrawingDialog("save"));
  newDrawingDialog?.addEventListener("pointerdown", (event) => {
    if (event.target === newDrawingDialog) {
      closeNewDrawingDialog("cancel");
    }
  });

  projectDialogJobPickerButton?.addEventListener("click", () => {
    if (!projectJobQuickPick || projectDialogJobPickerButton.disabled) return;
    if (projectJobQuickPick.hidden) {
      openProjectJobPicker();
    } else {
      closeProjectJobPicker();
    }
  });

  projectDialogInputs.jobNumber?.addEventListener("contextmenu", (event) => {
    if (!recentProjectChoices().length) return;
    event.preventDefault();
    openProjectJobPicker();
  });

  projectDialogInputs.jobNumber?.addEventListener("input", () => {
    if (projectJobQuickPick && !projectJobQuickPick.hidden) renderProjectJobPicker();
  });

  projectJobQuickPick?.addEventListener("click", (event) => {
    const choiceButton = event.target.closest("[data-project-job-number]");
    if (!choiceButton) return;
    applyProjectJobChoice(choiceButton);
  });

  document.addEventListener("pointerdown", (event) => {
    if (!projectJobQuickPick || projectJobQuickPick.hidden) return;
    const target = event.target;
    if (
      projectJobQuickPick.contains(target) ||
      projectDialogJobPickerButton?.contains(target) ||
      projectDialogInputs.jobNumber?.contains(target)
    ) {
      return;
    }
    closeProjectJobPicker();
  });

  projectLibraryCloseButton?.addEventListener("click", closeProjectLibrary);
  projectLibraryDialog?.addEventListener("pointerdown", (event) => {
    if (event.target === projectLibraryDialog) {
      closeProjectLibrary();
    }
  });
  projectLibraryList?.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("[data-delete-project-id]");
    if (deleteButton) {
      if (deleteButton.dataset.projectSource === "cloud") {
        deleteSavedCloudProject(deleteButton.dataset.deleteProjectId).catch((error) => {
          console.warn("Could not delete cloud project.", error);
          updateCloudStatus("Cloud delete failed", "warning");
        });
      } else {
        deleteSavedBrowserProject(deleteButton.dataset.deleteProjectId);
      }
      return;
    }

    const openTarget = event.target.closest("[data-open-project-id]");
    if (openTarget) {
      if (openTarget.dataset.projectSource === "cloud") {
        openSavedCloudProject(openTarget.dataset.openProjectId).catch((error) => {
          console.warn("Could not open cloud project.", error);
          updateCloudStatus("Cloud open failed", "warning");
        });
      } else {
        openSavedBrowserProject(openTarget.dataset.openProjectId);
      }
    }
  });
}

function setupLoadPlanner() {
  loadPlanButton?.addEventListener("click", openLoadPlanDialog);
  loadPlanCloseButton?.addEventListener("click", closeLoadPlanDialog);
  loadPlanPlayButton?.addEventListener("click", playTruckLoadAnimation);
  loadPlanProjectList?.addEventListener("change", handleLoadPlanChoiceChange);
  loadPlanJobSelect?.addEventListener("change", () => {
    loadPlanJobKey = loadPlanJobSelect.value;
    loadPlanSelection.clear();
    currentLoadPlan = createTruckLoadPlan([]);
    renderLoadPlanProjectChoices();
  });
  loadPlanSelectAllButton?.addEventListener("click", () => setVisibleLoadPlanSelection(true));
  loadPlanDeselectAllButton?.addEventListener("click", () => setVisibleLoadPlanSelection(false));
  loadPlanLayoutButton?.addEventListener("click", () => setLoadPlanViewMode("layout"));
  loadPlanModelButton?.addEventListener("click", () => setLoadPlanViewMode("model"));
  loadPlanAnimateButton?.addEventListener("click", () => {
    if (currentLoadPlan?.placements?.length) {
      startTruckLoadAnimation(currentLoadPlan);
    }
  });
  loadPlanTraySelect?.addEventListener("change", () => {
    loadPlanTrayKey = normalizeLoadPlanTrayKey(loadPlanTraySelect.value);
    loadPlanTraySelect.value = loadPlanTrayKey;
    renderLoadPlanProjectChoices();
  });
  loadPlanRackSelect?.addEventListener("change", () => {
    loadPlanRackKey = normalizeLoadPlanRackKey(loadPlanRackSelect.value);
    loadPlanRackSelect.value = loadPlanRackKey;
    renderLoadPlanProjectChoices();
  });
  loadPlanSpinButton?.addEventListener("click", () => setLoadPlanSpin(!loadPlanThree.spinning));
  loadPlanResetButton?.addEventListener("click", () => resetLoadPlanThreeView());
  loadPlanDialog?.addEventListener("pointerdown", (event) => {
    if (event.target === loadPlanDialog) {
      closeLoadPlanDialog();
    }
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol === "file:") return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then((registration) => {
        setupServiceWorkerUpdateChecks(registration);
      })
      .catch((error) => {
        console.warn("Service worker registration failed.", error);
      });
  });
}

function setupServiceWorkerUpdateChecks(registration) {
  if (!registration) return;

  if (registration.waiting && navigator.serviceWorker.controller) {
    promptForAppUpdate(registration.waiting);
  }

  registration.addEventListener("updatefound", () => {
    const worker = registration.installing;
    if (!worker) return;
    worker.addEventListener("statechange", () => {
      if (worker.state === "installed" && navigator.serviceWorker.controller) {
        promptForAppUpdate(worker);
      }
    });
  });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!appUpdateReloadPending) return;
    window.location.reload();
  });

  const checkForUpdate = () => {
    registration.update().catch((error) => {
      console.warn("Could not check for app updates.", error);
    });
  };

  setTimeout(checkForUpdate, 3000);
  setInterval(checkForUpdate, 15 * 60 * 1000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkForUpdate();
  });
}

function promptForAppUpdate(worker) {
  if (!worker || appUpdatePromptOpen || appUpdateReloadPending) return;

  appUpdatePromptOpen = true;
  const reloadNow = window.confirm("A new IsoSpool update is ready. Reload now to use it?");
  appUpdatePromptOpen = false;
  if (!reloadNow) return;

  appUpdateReloadPending = true;
  worker.postMessage({ type: "SKIP_WAITING" });
  setTimeout(() => window.location.reload(), 1500);
}

function appVersionNumber(value) {
  const match = String(value ?? "").match(/\d+/);
  return match ? Number(match[0]) : 0;
}

async function latestAvailableAppVersion() {
  if (location.protocol === "file:") return null;

  const response = await fetch(`./app.js?version-check=${Date.now()}`, {
    cache: "no-store",
  });
  if (!response.ok) return null;
  const source = await response.text();
  const match = source.match(/const\s+APP_VERSION\s*=\s*["']([^"']+)["']/);
  return match?.[1] ?? null;
}

async function checkForNewerAppVersion(options = {}) {
  try {
    const latest = await latestAvailableAppVersion();
    if (!latest || appVersionNumber(latest) <= appVersionNumber(APP_VERSION)) return false;

    const message = `IsoSpool ${latest} is available. You are using ${APP_VERSION}.`;
    if (options.autoReload) {
      window.alert(`${message} The app will reload before continuing.`);
      reloadToLatestApp(latest);
      return true;
    }

    updateCloudStatus(`Update ${latest} ready`, "warning");
    const reloadNow = window.confirm(`${message} Reload now?`);
    if (reloadNow) {
      reloadToLatestApp(latest);
    }
    return true;
  } catch (error) {
    console.warn("Could not check for latest app version.", error);
    return false;
  }
}

function reloadToLatestApp(latestVersion = "") {
  appUpdateReloadPending = true;
  const url = new URL(location.href);
  url.searchParams.set("v", String(appVersionNumber(latestVersion) || Date.now()));
  url.searchParams.set("reload", String(Date.now()));
  window.location.replace(url.toString());
}

function setupAppVersionChecks() {
  if (location.protocol === "file:") return;
  setTimeout(() => checkForNewerAppVersion(), 4500);
  setInterval(() => checkForNewerAppVersion(), VERSION_CHECK_INTERVAL_MS);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkForNewerAppVersion();
  });
}

async function reloadIfOutdatedBeforeAuth() {
  return checkForNewerAppVersion({ autoReload: true });
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
  three.OrbitControls = OrbitControls;
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
  three.controls.dampingFactor = 0.16;
  three.controls.screenSpacePanning = true;
  three.controls.enablePan = true;
  three.controls.enableZoom = true;
  three.controls.rotateSpeed = 0.48;
  three.controls.panSpeed = 0.7;
  three.controls.zoomSpeed = 0.72;
  three.controls.minZoom = 0.35;
  three.controls.maxZoom = 8;
  three.controls.addEventListener("start", () => {
    three.userMovedCamera = true;
    previewStage?.classList.add("preview-interacting");
  });
  three.controls.addEventListener("end", () => {
    previewStage?.classList.remove("preview-interacting");
  });
  applyThreeNavigationMode(three.navigationMode);

  three.ready = true;
  threeCanvas.hidden = false;
  fallbackCanvas.hidden = true;
  renderStatus.textContent = "Three.js viewport";
  resizeThree();
  update3dPreview();
  redrawLoadPlanIfOpen();
  animateThree();
}

function animateThree() {
  if (!three.ready) return;
  three.animationFrame = requestAnimationFrame(animateThree);
  three.controls.update();
  three.renderer.render(three.scene, three.camera);
  update3dLabelPositions();
}

function setThreeNavigationMode(mode) {
  three.navigationMode = mode === "pan" ? "pan" : "orbit";
  applyThreeNavigationMode(three.navigationMode);
}

function applyThreeNavigationMode(mode = three.navigationMode) {
  if (previewStage) {
    previewStage.dataset.navMode = mode === "pan" ? "pan" : "orbit";
  }

  for (const [button, active] of [
    [previewRotateButton, mode !== "pan"],
    [previewMoveButton, mode === "pan"],
  ]) {
    if (!button) continue;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  }

  if (!three.controls || !three.module) return;
  const THREE = three.module;
  three.controls.mouseButtons = mode === "pan"
    ? {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
      }
    : {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      };
  three.controls.touches = mode === "pan"
    ? {
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.DOLLY_ROTATE,
      }
    : {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      };
}

function resetThreeView() {
  if (!three.ready) return;
  three.userMovedCamera = false;
  frameThreeCamera({ reset: true });
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
  const socketMaterial = previewMaterial(style, "socket");
  const grooveMaterial = previewMaterial(style, "groove");

  const modelPoints = state.points.map((point) => {
    const modelPoint = toModelUnits(point);
    return new THREE.Vector3(modelPoint.x, modelPoint.y, modelPoint.z);
  });
  const segmentData = segments();
  const connections = nodeConnections(segmentData);
  const elbowTrims = computeGraphElbowTrims(modelPoints, segmentData, connections);
  const autoReducers = autoReducerTransitions(segmentData);
  const reducerTrims = computeAutoReducerRenderTrims(autoReducers);
  const segmentByIndex = new Map(segmentData.map((segment) => [segment.index, segment]));

  for (const segment of segmentData) {
    const segmentRadius = pipeRadiusMetres(segment);
    const start = modelPoints[segment.from].clone();
    const end = modelPoints[segment.to].clone();
    const direction = end.clone().sub(start).normalize();
    const startTrim = elbowTrims.segment.get(`${segment.index}:${segment.from}`) ?? 0;
    const endTrim = elbowTrims.segment.get(`${segment.index}:${segment.to}`) ?? 0;
    const startReducerTrim = reducerTrims.get(`${segment.index}:${segment.from}`) ?? 0;
    const endReducerTrim = reducerTrims.get(`${segment.index}:${segment.to}`) ?? 0;
    start.addScaledVector(direction, startTrim + startReducerTrim);
    end.addScaledVector(direction, -(endTrim + endReducerTrim));

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
          ? outlineTeeMarker(point, connected, modelPoints, nodeRadius, jointMaterial, segmentData)
          : teeNodeAssembly(point, connected, modelPoints, nodeRadius, jointMaterial, segmentData));
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
          radius,
          radius * 0.72,
          reducerMaterial,
          32,
        );
        reducer.castShadow = true;
        group.add(reducer);
      }
    } else if (fitting.type === "socket") {
      group.add(socketAssembly(position, direction, radius, fitting, socketMaterial, style));
    } else if (fitting.type === "rollGroove") {
      group.add(rollGrooveAssembly(position, direction, radius, grooveMaterial, style));
    }
  }

  for (const reducer of autoReducers) {
    group.add(autoReducerAssembly(reducer, modelPoints, reducerMaterial, style, elbowTrims));
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
    socket: 0x0f766e,
    groove: 0x111719,
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
    socket: 0xe8f4f2,
    groove: 0x9aa6aa,
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
        socket: 0xb42318,
        groove: 0x5f1410,
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
        socket: 0x78aaa4,
        groove: 0x4d6561,
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
        socket: 0xc1121f,
        groove: 0xc1121f,
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
  const railOffsets = Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 6;
    return basis.u.clone()
      .multiplyScalar(Math.cos(angle) * radius)
      .add(basis.v.clone().multiplyScalar(Math.sin(angle) * radius));
  });

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
  const rails = Array.from({ length: 6 }, () => []);
  for (let index = 0; index < centerPoints.length; index += 1) {
    const previous = centerPoints[Math.max(0, index - 1)];
    const next = centerPoints[Math.min(centerPoints.length - 1, index + 1)];
    const tangent = next.clone().sub(previous).normalize();
    const side = bendNormal.clone().cross(tangent).normalize();
    const point = centerPoints[index];

    for (let railIndex = 0; railIndex < rails.length; railIndex += 1) {
      const angle = (Math.PI * 2 * railIndex) / rails.length;
      rails[railIndex].push(
        point.clone()
          .addScaledVector(side, Math.cos(angle) * radius)
          .addScaledVector(bendNormal, Math.sin(angle) * radius),
      );
    }
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

function outlineRollGrooveMarker(position, direction, radius, material, width = 0.12) {
  const group = outlineBandMarker(position, direction, radius * 1.03, material, width);
  const axis = direction.clone().normalize();
  const basis = radialBasis(axis);
  group.add(outlineRing(position, axis, radius * 1.06, material));

  for (const radial of [
    basis.u,
    basis.u.clone().multiplyScalar(-1),
    basis.v,
    basis.v.clone().multiplyScalar(-1),
  ]) {
    group.add(lineBetween(
      position.clone().addScaledVector(axis, -width * 0.5).add(radial.clone().multiplyScalar(radius * 1.03)),
      position.clone().addScaledVector(axis, width * 0.5).add(radial.clone().multiplyScalar(radius * 1.03)),
      material,
    ));
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
  const startRadius = radius;
  const endRadius = radius * 0.72;
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

function socketAssembly(position, direction, pipeRadius, fitting, material, style) {
  const THREE = three.module;
  const group = new THREE.Group();
  const radial = socketRadialDirection(direction, fitting);
  const socketRadius = socketRadiusMetres(fitting);
  const socketLength = Math.max(0.12, socketRadius * 3.2);
  const start = position.clone().addScaledVector(radial, pipeRadius * 0.72);
  const end = position.clone().addScaledVector(radial, pipeRadius + socketLength);

  if (style.lineDrawing) {
    group.add(lineBetween(start, end, material));
    group.add(outlineRing(start, radial, socketRadius * 1.05, material));
    group.add(outlineRing(end, radial, socketRadius, material));
    return group;
  }

  const socket = cylinderBetween(start, end, socketRadius, material, 18);
  socket.castShadow = true;
  socket.receiveShadow = true;
  group.add(socket);

  const weld = cylinderBetween(
    position.clone().addScaledVector(radial, pipeRadius * 0.65),
    position.clone().addScaledVector(radial, pipeRadius * 0.86),
    socketRadius * 1.22,
    material,
    18,
  );
  weld.castShadow = true;
  group.add(weld);
  return group;
}

function rollGrooveAssembly(position, direction, pipeRadius, material, style) {
  const THREE = three.module;
  const axis = direction.clone().normalize();
  const markerLength = clampNumber(pipeRadius * 0.95, 0.07, 0.16);
  const grooveSpacing = markerLength * 0.28;

  if (style.lineDrawing) {
    return outlineRollGrooveMarker(position, axis, pipeRadius, material, markerLength);
  }

  const group = new THREE.Group();
  const grooveColor = material.color?.getHex?.() ?? 0x111719;
  const brightColor = new THREE.Color(grooveColor).offsetHSL(0, 0, 0.18).getHex();
  const darkColor = new THREE.Color(grooveColor).offsetHSL(0, 0, -0.16).getHex();
  const baseMaterialParams = {
    transparent: style.opacity < 1,
    opacity: Math.min(0.92, (style.opacity ?? 1) + 0.04),
    metalness: Math.min(0.72, style.metalness ?? 0.35),
    roughness: Math.max(0.22, style.roughness ?? 0.36),
  };
  const bandMaterial = style.basic
    ? new THREE.MeshBasicMaterial({ color: grooveColor, transparent: baseMaterialParams.transparent, opacity: baseMaterialParams.opacity })
    : new THREE.MeshStandardMaterial({ ...baseMaterialParams, color: grooveColor });
  const darkBandMaterial = style.basic
    ? new THREE.MeshBasicMaterial({ color: darkColor, transparent: baseMaterialParams.transparent, opacity: baseMaterialParams.opacity })
    : new THREE.MeshStandardMaterial({ ...baseMaterialParams, color: darkColor, roughness: Math.max(0.38, baseMaterialParams.roughness) });
  const lipMaterial = style.basic
    ? new THREE.MeshBasicMaterial({ color: brightColor, transparent: baseMaterialParams.transparent, opacity: 1 })
    : new THREE.MeshStandardMaterial({ ...baseMaterialParams, color: brightColor, metalness: Math.min(0.82, baseMaterialParams.metalness + 0.1), roughness: Math.max(0.18, baseMaterialParams.roughness - 0.08) });
  const lineMaterial = new THREE.LineBasicMaterial({
    color: brightColor,
    transparent: style.opacity < 1,
    opacity: Math.min(0.94, (style.opacity ?? 1) + 0.08),
  });

  const sleeveStart = position.clone().addScaledVector(axis, -markerLength * 0.5);
  const sleeveEnd = position.clone().addScaledVector(axis, markerLength * 0.5);
  const sleeve = cylinderBetween(sleeveStart, sleeveEnd, pipeRadius * 1.028, bandMaterial, 36);
  sleeve.castShadow = true;
  sleeve.receiveShadow = true;
  group.add(sleeve);

  const centreBand = cylinderBetween(
    position.clone().addScaledVector(axis, -grooveSpacing * 0.55),
    position.clone().addScaledVector(axis, grooveSpacing * 0.55),
    pipeRadius * 1.036,
    darkBandMaterial,
    36,
  );
  centreBand.castShadow = true;
  centreBand.receiveShadow = true;
  group.add(centreBand);

  const lipTube = clampNumber(pipeRadius * 0.055, 0.004, 0.012);
  for (const offset of [-markerLength * 0.42, markerLength * 0.42]) {
    group.add(torusRing(position.clone().addScaledVector(axis, offset), axis, pipeRadius * 1.035, lipTube, lipMaterial));
  }
  for (const offset of [-grooveSpacing, grooveSpacing]) {
    group.add(outlineRing(position.clone().addScaledVector(axis, offset), axis, pipeRadius * 1.046, lineMaterial));
  }
  return group;
}

function socketRadialDirection(direction, fitting = null) {
  const basis = radialBasis(direction);
  const angle = fittingSocketAngle(fitting) * Math.PI / 180;
  const radial = basis.v.clone()
    .multiplyScalar(Math.cos(angle))
    .add(basis.u.clone().multiplyScalar(Math.sin(angle)));
  return radial.normalize();
}

function socketRadiusMetres(fitting) {
  const size = pipeSizeByNb(fittingSocketSizeNb(fitting));
  const maxOd = PIPE_SIZES[PIPE_SIZES.length - 1].od;
  return Math.max(0.035, (0.055 + (size.od / maxOd) * 0.255) * 0.72);
}

function autoReducerAssembly(reducer, modelPoints, material, style, elbowTrims = null) {
  const THREE = three.module;
  const group = new THREE.Group();
  const joint = modelPoints[reducer.nodeIndex];
  const largeOther = modelPoints[reducer.largeOtherIndex];
  const smallOther = modelPoints[reducer.smallOtherIndex];
  if (!joint || !largeOther || !smallOther) return group;

  const largeDirection = largeOther.clone().sub(joint);
  const smallDirection = smallOther.clone().sub(joint);
  const placementDirection = reducerPlacementSide(reducer) === "large" ? largeDirection.clone() : smallDirection.clone();
  if (largeDirection.length() < 0.0001 || smallDirection.length() < 0.0001) return group;

  const placementLength = placementDirection.length();
  largeDirection.normalize();
  smallDirection.normalize();
  placementDirection.normalize();
  const modelLength = Math.max(0.08, reducer.lengthMm / 1000);
  const halfLength = modelLength * 0.5;
  const startsAtJoint = reducerStartsAtJoint(reducer);
  const startsAfterBend = reducer.kind === "bend";
  let start;
  let end;
  if (startsAfterBend) {
    const placementSegment = reducerPlacementSegment(reducer);
    const renderedBendOffset = elbowTrims?.segment?.get(`${placementSegment.index}:${reducer.nodeIndex}`) ?? (reducerLegOffsetMm(reducer) / 1000);
    const offset = clampNumber(renderedBendOffset, 0.015, Math.max(0.015, placementLength - modelLength));
    start = joint.clone().addScaledVector(placementDirection, offset);
    end = start.clone().addScaledVector(placementDirection, modelLength);
  } else if (startsAtJoint) {
    start = joint.clone().addScaledVector(smallDirection, 0.015);
    end = joint.clone().addScaledVector(smallDirection, modelLength);
  } else {
    start = joint.clone().addScaledVector(largeDirection, halfLength);
    end = joint.clone().addScaledVector(smallDirection, halfLength);
  }
  const largeRadius = pipeRadiusMetres(reducer.largeSegment);
  const smallRadius = pipeRadiusMetres(reducer.smallSegment);
  const startRadius = startsAfterBend && reducerPlacementSide(reducer) === "large"
    ? smallRadius
    : largeRadius;
  const endRadius = startsAfterBend && reducerPlacementSide(reducer) === "large"
    ? largeRadius
    : smallRadius;

  const reducerObject = style.lineDrawing
    ? outlineReducerBetween(start, end, startRadius, endRadius, material)
    : taperedCylinderBetween(start, end, startRadius, endRadius, material, 32);
  if (!style.lineDrawing) {
    reducerObject.castShadow = true;
    const axis = end.clone().sub(start);
    if (axis.length() > 0.0001) {
      axis.normalize();
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: material?.color?.getHex?.() ?? 0x7a4dc2,
        transparent: true,
        opacity: 0.9,
      });
      group.add(outlineRing(start, axis, startRadius, edgeMaterial));
      group.add(outlineRing(end, axis, endRadius, edgeMaterial));
    }
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

function connectionRenderEntries(position, connected, modelPoints, segmentData = []) {
  const segmentByIndex = new Map(segmentData.map((segment) => [segment.index, segment]));
  return connected
    .map((connection) => {
      const target = modelPoints[connection.other];
      if (!target) return null;
      const direction = target.clone().sub(position);
      if (direction.length() < 0.0001) return null;
      direction.normalize();
      return {
        connection,
        direction,
        segment: segmentByIndex.get(connection.segmentIndex) ?? null,
      };
    })
    .filter(Boolean)
    .map((entry) => ({
      ...entry,
      radius: entry.segment ? pipeRadiusMetres(entry.segment) : pipeRadiusMetres(),
    }));
}

function mostOppositeRenderEntryPair(entries) {
  if (entries.length < 2) return null;

  let best = null;
  let bestDot = Infinity;
  for (let i = 0; i < entries.length; i += 1) {
    for (let j = i + 1; j < entries.length; j += 1) {
      const dot = entries[i].direction.dot(entries[j].direction);
      if (dot < bestDot) {
        bestDot = dot;
        best = [entries[i], entries[j]];
      }
    }
  }
  return best;
}

function teeNodeAssembly(position, connected, modelPoints, radius, material, segmentData = []) {
  const THREE = three.module;
  const group = new THREE.Group();
  const entries = connectionRenderEntries(position, connected, modelPoints, segmentData);
  const mainPair = mostOppositeRenderEntryPair(entries);
  const coreRadius = Math.max(radius, ...entries.map((entry) => entry.radius));
  const length = Math.max(coreRadius * 3.0, 0.16);

  if (mainPair) {
    const mainRadius = Math.max(...mainPair.map((entry) => entry.radius));
    const main = cylinderBetween(
      position.clone().addScaledVector(mainPair[0].direction, length),
      position.clone().addScaledVector(mainPair[1].direction, length),
      mainRadius,
      material,
      28,
    );
    main.castShadow = true;
    main.receiveShadow = true;
    group.add(main);
  }

  for (const entry of entries) {
    if (mainPair && mainPair.includes(entry)) continue;
    const branchRadius = entry.radius;
    const branchLength = Math.max(length, branchRadius * 4.0, 0.16);
    const branch = cylinderBetween(
      position.clone().addScaledVector(entry.direction, -branchRadius * 0.04),
      position.clone().addScaledVector(entry.direction, branchLength),
      branchRadius,
      material,
      28,
    );
    branch.castShadow = true;
    branch.receiveShadow = true;
    group.add(branch);
  }

  const core = new THREE.Mesh(new THREE.SphereGeometry(coreRadius * 0.96, 24, 16), material);
  core.position.copy(position);
  core.castShadow = true;
  core.receiveShadow = true;
  group.add(core);

  return group;
}

function outlineTeeMarker(position, connected, modelPoints, radius, material, segmentData = []) {
  const THREE = three.module;
  const group = new THREE.Group();
  const entries = connectionRenderEntries(position, connected, modelPoints, segmentData);
  const mainPair = mostOppositeRenderEntryPair(entries);
  const coreRadius = Math.max(radius, ...entries.map((entry) => entry.radius));
  const length = Math.max(coreRadius * 3.8, 0.2);

  if (mainPair) {
    const mainRadius = Math.max(...mainPair.map((entry) => entry.radius));
    group.add(outlinePipeBetween(
      position.clone().addScaledVector(mainPair[0].direction, length),
      position.clone().addScaledVector(mainPair[1].direction, length),
      mainRadius,
      material,
    ));
  }

  for (const entry of entries) {
    if (mainPair && mainPair.includes(entry)) continue;
    const branchRadius = entry.radius;
    const branchLength = Math.max(length, branchRadius * 4.0, 0.2);
    const branchStart = position.clone().addScaledVector(entry.direction, branchRadius * 0.2);
    const branchEnd = position.clone().addScaledVector(entry.direction, branchLength);

    group.add(outlineRing(branchStart, entry.direction, branchRadius, material));
    group.add(outlinePipeBetween(
      branchStart,
      branchEnd,
      branchRadius,
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
    const collarLength = Math.max(radius * 2.8, 0.07);
    const collar = cylinderBetween(
      position.clone().addScaledVector(direction, -radius * 0.04),
      position.clone().addScaledVector(direction, collarLength),
      radius * 1.02,
      material,
      24,
    );
    collar.castShadow = true;
    collar.receiveShadow = true;
    group.add(collar);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 1.03, Math.max(radius * 0.055, 0.003), 8, 28),
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
    const start = position.clone().addScaledVector(direction, radius * 0.12);
    const end = position.clone().addScaledVector(direction, length);
    group.add(outlineRing(start, direction, radius * 1.03, material));
    group.add(outlinePipeBetween(start, end, radius, material, { endCap: true }));
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

function torusRing(position, direction, radius, tubeRadius, material, radialSegments = 10, tubularSegments = 48) {
  const THREE = three.module;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments),
    material,
  );
  ring.position.copy(position);
  ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.clone().normalize());
  ring.castShadow = true;
  ring.receiveShadow = true;
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
  previewLabelLayer.hidden = state.show3dLabels === false;
}

function build3dPipeLabels(segmentData, modelPoints) {
  clear3dPipeLabels();
  previewLabelLayer.hidden = state.show3dLabels === false;
  if (!three.ready || state.show3dLabels === false) return;

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
  return [`NB ${pipeSizeForSegment(segment).nb} ${pipeSpec().schedule}`];
}

function update3dLabelPositions() {
  if (!three.ready || state.show3dLabels === false || !three.labels.length) return;

  const rect = previewStage.getBoundingClientRect();
  for (const label of three.labels) {
    const projected = label.point.clone().project(three.camera);
    const visible = projected.z > -1 && projected.z < 1;
    label.element.hidden = !visible;
    if (!visible) continue;
    const labelWidth = label.element.offsetWidth || 90;
    const labelHeight = label.element.offsetHeight || 24;
    const rawX = (projected.x * 0.5 + 0.5) * rect.width;
    const rawY = (-projected.y * 0.5 + 0.5) * rect.height;
    const x = clampNumber(rawX, labelWidth * 0.5 + 8, Math.max(labelWidth * 0.5 + 8, rect.width - labelWidth * 0.5 - 8));
    const y = clampNumber(rawY, labelHeight * 0.5 + 8, Math.max(labelHeight * 0.5 + 8, rect.height - labelHeight * 0.5 - 8));
    label.element.style.left = `${x}px`;
    label.element.style.top = `${y}px`;
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

function frameThreeCamera(options = {}) {
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
  const preserveView = three.userMovedCamera && options.reset !== true && three.controls;
  const previousTarget = preserveView ? three.controls.target.clone() : null;
  const previousOffset = preserveView ? three.camera.position.clone().sub(previousTarget) : null;
  const previousTargetOffset = preserveView && three.modelCenter
    ? previousTarget.clone().sub(three.modelCenter)
    : new THREE.Vector3(0, 0, 0);
  const previousZoom = preserveView ? three.camera.zoom : 1;
  const target = preserveView ? center.clone().add(previousTargetOffset) : center.clone();

  three.camera.left = -halfWidth;
  three.camera.right = halfWidth;
  three.camera.top = halfHeight;
  three.camera.bottom = -halfHeight;
  three.camera.near = 0.1;
  three.camera.far = maxDim * 20 + 100;
  if (preserveView && previousOffset.length() > 0.001) {
    const distance = Math.max(previousOffset.length(), maxDim * 1.35);
    three.camera.position.copy(target).add(previousOffset.normalize().multiplyScalar(distance));
    three.camera.zoom = clampNumber(previousZoom, three.controls.minZoom ?? 0.35, three.controls.maxZoom ?? 8);
  } else {
    three.camera.position.copy(target).add(new THREE.Vector3(-maxDim * 1.25, -maxDim * 1.25, -maxDim * 1.25));
    three.camera.zoom = 1;
  }
  three.camera.lookAt(target);
  three.camera.updateProjectionMatrix();

  if (three.controls) {
    three.controls.target.copy(target);
    three.controls.update();
  }
  three.modelCenter = center.clone();
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

    if (state.show3dLabels !== false) {
      drawFallbackPipeSizeLabel(ctx, segment, {
        x: (segment.start2.x + segment.end2.x) * 0.5,
        y: (segment.start2.y + segment.end2.y) * 0.5,
      });
    }
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
    const dx = segment.end2.x - segment.start2.x;
    const dy = segment.end2.y - segment.start2.y;
    const length = Math.hypot(dx, dy);
    if (length < 0.001) return;
    const along = { x: dx / length, y: dy / length };
    const normal = { x: -along.y, y: along.x };
    const halfWidth = segmentPipeWidth * 0.5;

    ctx.strokeStyle = style.pipeStops[0];
    ctx.lineCap = "round";
    ctx.lineWidth = 2.5;
    drawLine(
      ctx,
      { x: segment.start2.x + normal.x * halfWidth, y: segment.start2.y + normal.y * halfWidth },
      { x: segment.end2.x + normal.x * halfWidth, y: segment.end2.y + normal.y * halfWidth },
    );
    drawLine(
      ctx,
      { x: segment.start2.x - normal.x * halfWidth, y: segment.start2.y - normal.y * halfWidth },
      { x: segment.end2.x - normal.x * halfWidth, y: segment.end2.y - normal.y * halfWidth },
    );
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.5;
    drawLine(
      ctx,
      { x: segment.start2.x + normal.x * halfWidth * 0.42, y: segment.start2.y + normal.y * halfWidth * 0.42 },
      { x: segment.end2.x + normal.x * halfWidth * 0.42, y: segment.end2.y + normal.y * halfWidth * 0.42 },
    );
    ctx.globalAlpha = 1;
    ctx.lineCap = "butt";

    drawFallbackPipeSectionRing(ctx, segment.start2, Math.atan2(dy, dx), halfWidth, 0.22);
    drawFallbackPipeSectionRing(ctx, segment.end2, Math.atan2(dy, dx), halfWidth, 0.22);
    const sectionCount = Math.min(4, Math.floor(length / 155));
    for (let index = 1; index <= sectionCount; index += 1) {
      const t = index / (sectionCount + 1);
      drawFallbackPipeSectionRing(ctx, {
        x: segment.start2.x + dx * t,
        y: segment.start2.y + dy * t,
      }, Math.atan2(dy, dx), halfWidth, 0.14);
    }
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

      if (style.outline) {
        drawFallbackPipeEndRing(ctx, point, angle, capHalf, Math.max(4, capHalf * 0.38));
      } else {
        ctx.lineWidth = capLineWidth;
        drawLine(
          ctx,
          { x: point.x + normal.x * capHalf, y: point.y + normal.y * capHalf },
          { x: point.x - normal.x * capHalf, y: point.y - normal.y * capHalf },
        );
      }
    }
  }

  ctx.restore();
}

function drawFallbackPipeEndRing(ctx, point, angle, radius, minorRadius) {
  drawFallbackPipeSectionRing(ctx, point, angle, radius, 1, minorRadius, 2.5);
}

function drawFallbackPipeSectionRing(ctx, point, angle, radius, alpha = 1, minorRadius = Math.max(4, radius * 0.36), lineWidth = 1.5) {
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(angle);
  ctx.globalAlpha *= alpha;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.ellipse(0, 0, minorRadius, radius, 0, 0, Math.PI * 2);
  ctx.stroke();
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
    const placementOther = reducerPlacementSide(reducer) === "large" ? largeOther : smallOther;
    const startsAtJoint = reducerStartsAtJoint(reducer);
    const startsAfterBend = reducer.kind === "bend";
    const along = startsAtJoint || startsAfterBend
      ? normalizeScreenVector({ x: placementOther.x - joint.x, y: placementOther.y - joint.y })
      : normalizeScreenVector({ x: smallOther.x - largeOther.x, y: smallOther.y - largeOther.y });
    const normal = { x: -along.y, y: along.x };
    const length = 30;
    const largeWidth = Math.max(10, visualPipeWidth(reducer.largeSegment));
    const smallWidth = Math.max(7, visualPipeWidth(reducer.smallSegment));
    const startWidth = startsAfterBend && reducerPlacementSide(reducer) === "large" ? smallWidth : largeWidth;
    const endWidth = startsAfterBend && reducerPlacementSide(reducer) === "large" ? largeWidth : smallWidth;
    let start;
    let end;
    if (startsAfterBend) {
      const offset = reducerScreenOffsetPixels(reducer, joint, placementOther, length);
      start = { x: joint.x + along.x * offset, y: joint.y + along.y * offset };
      end = { x: start.x + along.x * length, y: start.y + along.y * length };
    } else if (startsAtJoint) {
      start = { x: joint.x + along.x * 2, y: joint.y + along.y * 2 };
      end = { x: joint.x + along.x * length, y: joint.y + along.y * length };
    } else {
      start = { x: joint.x - along.x * length * 0.5, y: joint.y - along.y * length * 0.5 };
      end = { x: joint.x + along.x * length * 0.5, y: joint.y + along.y * length * 0.5 };
    }

    ctx.beginPath();
    ctx.moveTo(start.x + normal.x * startWidth * -0.5, start.y + normal.y * startWidth * -0.5);
    ctx.lineTo(end.x + normal.x * endWidth * -0.5, end.y + normal.y * endWidth * -0.5);
    ctx.lineTo(end.x + normal.x * endWidth * 0.5, end.y + normal.y * endWidth * 0.5);
    ctx.lineTo(start.x + normal.x * startWidth * 0.5, start.y + normal.y * startWidth * 0.5);
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

  if (state.show3dLabels !== false) {
    ctx.font = "900 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 5;
    ctx.strokeStyle = style.background;
    ctx.fillStyle = "#c1121f";
    ctx.strokeText("COG", point.x, point.y - 24);
    ctx.fillText("COG", point.x, point.y - 24);
  }
  ctx.restore();
}

function drawSuggestedLugsFallback(ctx, toScreen, quantities, style) {
  const lugPlan = suggestedLugPlan(quantities);
  if (!lugPlan) return;

  if (state.show3dLabels !== false) {
    const dimensionLayout = {
      labels: [],
      lines: [],
      viewport: dimensionViewport(ctx, 18),
      pipes: quantities.segments.map(({ segment }) => ({
        index: segment.index,
        start: toScreen(projectPreviewPoint(segment.start)),
        end: toScreen(projectPreviewPoint(segment.end)),
      })),
    };

    for (const [index, lug] of lugPlan.points.entries()) {
      const start = toScreen(projectPreviewPoint(lug.segment.start));
      const point = toScreen(projectPreviewPoint(lug.point));
      const distanceMm = Number.isFinite(lug.distanceFromRunStartMm)
        ? lug.distanceFromRunStartMm
        : pointLength(subtractPoints(lug.point, lug.segment.start));
      drawLugDimensionLine(ctx, start, point, lug.segment.index, `LUG ${lug.number ?? index + 1} ${formatLength(distanceMm)} mm`, dimensionLayout, index);
    }
  }

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

    if (state.show3dLabels !== false) {
      const label = `LUG ${lug.number}`;
      ctx.lineWidth = 5;
      ctx.strokeStyle = style.background;
      ctx.fillStyle = "#0f766e";
      ctx.strokeText(label, point.x, point.y - 25);
      ctx.fillText(label, point.x, point.y - 25);
    }
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
  } else if (fitting.type === "rollGroove") {
    const halfLength = Math.max(9, pipeWidth * 0.48);
    const halfWidth = pipeWidth * 0.62;
    ctx.beginPath();
    ctx.moveTo(along.x * -halfLength + normal.x * -halfWidth, along.y * -halfLength + normal.y * -halfWidth);
    ctx.lineTo(along.x * halfLength + normal.x * -halfWidth, along.y * halfLength + normal.y * -halfWidth);
    ctx.lineTo(along.x * halfLength + normal.x * halfWidth, along.y * halfLength + normal.y * halfWidth);
    ctx.lineTo(along.x * -halfLength + normal.x * halfWidth, along.y * -halfLength + normal.y * halfWidth);
    ctx.closePath();
    if (!style.outline) {
      ctx.globalAlpha = 0.86;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.lineWidth = style.outline ? 2.6 : 3.2;
    ctx.stroke();
    ctx.lineWidth = style.outline ? 2.2 : 2.6;
    for (const offset of [-halfLength * 0.52, 0, halfLength * 0.52]) {
      ctx.beginPath();
      ctx.moveTo(along.x * offset + normal.x * -halfWidth, along.y * offset + normal.y * -halfWidth);
      ctx.lineTo(along.x * offset + normal.x * halfWidth, along.y * offset + normal.y * halfWidth);
      ctx.stroke();
    }
    ctx.font = "900 9px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 4;
    ctx.strokeStyle = style.background;
    ctx.fillStyle = style.fittingStroke;
    const labelX = normal.x * (pipeWidth * 0.95 + 8);
    const labelY = normal.y * (pipeWidth * 0.95 + 8);
    ctx.strokeText("RG", labelX, labelY);
    ctx.fillText("RG", labelX, labelY);
  } else if (fitting.type === "socket") {
    const socketAngle = fittingSocketAngle(fitting) * Math.PI / 180;
    const branch = normalizeScreenVector({
      x: normal.x * Math.cos(socketAngle) + along.x * Math.sin(socketAngle),
      y: normal.y * Math.cos(socketAngle) + along.y * Math.sin(socketAngle),
    });
    const branchLength = Math.max(22, pipeWidth * 1.18);
    const socketRadius = Math.max(5, pipeWidth * 0.28);
    ctx.lineCap = "butt";
    ctx.lineWidth = style.outline ? 3 : 4;
    drawLine(
      ctx,
      { x: branch.x * pipeWidth * 0.25, y: branch.y * pipeWidth * 0.25 },
      { x: branch.x * branchLength, y: branch.y * branchLength },
    );
    ctx.beginPath();
    ctx.arc(branch.x * (branchLength + socketRadius * 0.25), branch.y * (branchLength + socketRadius * 0.25), socketRadius, 0, Math.PI * 2);
    if (!style.outline) ctx.fill();
    ctx.stroke();
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

function supabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
}

function updateCloudStatus(message = null, mode = "") {
  const signedIn = Boolean(cloudUser);
  const active = signedIn && hasActiveCloudLicense();
  const defaultMessage = signedIn
    ? active
      ? cloudLicenseText()
      : cloudProfile
      ? "Trial expired"
      : "Cloud setup needed"
    : "Local only";
  const text = message || defaultMessage;

  if (cloudSyncStatus) {
    cloudSyncStatus.textContent = text;
    cloudSyncStatus.title = signedIn && cloudUser?.email ? cloudUser.email : "Not signed in";
    cloudSyncStatus.classList.toggle("signed-in", signedIn && active && mode !== "warning");
    cloudSyncStatus.classList.toggle("warning", mode === "warning" || (signedIn && !active));
  }
  if (accountButtonLabel) {
    accountButtonLabel.textContent = signedIn ? "Account" : "Sign in";
  }
  if (authDialogStatus) {
    authDialogStatus.textContent = signedIn
      ? `${cloudUser.email || "Signed in"} - ${cloudLicenseText()}`
      : authMode === "signup"
      ? "Create an account to start a free trial and save spool projects to the cloud."
      : "Sign in to save and open spool projects from the cloud.";
  }
  if (authEmailInput && signedIn) authEmailInput.value = cloudUser.email || "";
  if (authSignOutButton) authSignOutButton.hidden = !signedIn;
  if (authSignInButton) authSignInButton.disabled = signedIn;
  if (authSignUpButton) authSignUpButton.disabled = signedIn;
  setAuthMode(authMode, { keepStatus: true });
  if (saveBrowserProjectButton) {
    saveBrowserProjectButton.title = signedIn && active
      ? "Save project to cloud and this browser"
      : "Save project in this browser";
  }
  if (openBrowserProjectButton) {
    openBrowserProjectButton.title = signedIn && active
      ? "Open cloud saved project"
      : "Open saved project from this browser";
  }
}

function cloudLicenseText(profile = cloudProfile) {
  if (!cloudUser) return "Local only";
  if (!profile) return "No licence profile";
  const status = String(profile.license_status ?? "trial").toLowerCase();
  if (status === "full") return "Full licence";
  if (status === "paid") return "Paid licence";
  const trialEnds = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
  if (status === "trial" && trialEnds && trialEnds > new Date()) {
    const days = Math.max(1, Math.ceil((trialEnds - new Date()) / 86400000));
    return `Trial ${days} day${days === 1 ? "" : "s"} left`;
  }
  return "Trial expired";
}

function hasActiveCloudLicense(profile = cloudProfile) {
  if (!cloudUser || !profile) return false;
  const status = String(profile.license_status ?? "trial").toLowerCase();
  if (status === "full" || status === "paid") return true;
  if (status !== "trial") return false;
  const trialEnds = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
  return Boolean(trialEnds && trialEnds > new Date());
}

function cloudProjectRecord() {
  const projectInfo = normalizeProjectInfo(state.projectInfo);
  const id = normalizeProjectId(state.projectId) ?? createProjectId();
  state.projectId = id;
  return {
    id,
    owner_id: cloudUser?.id,
    name: projectDisplayName(projectInfo),
    project_info: projectInfo,
    drawing_state: statePayload(),
    updated_at: new Date().toISOString(),
  };
}

function mapCloudProject(row) {
  return {
    id: normalizeProjectId(row.id),
    name: String(row.name ?? "").trim().slice(0, 120),
    updatedAt: String(row.updated_at ?? row.created_at ?? ""),
    projectInfo: normalizeProjectInfo(row.project_info),
    state: row.drawing_state,
    source: "cloud",
  };
}

async function initSupabase() {
  if (cloudInitStarted) return cloudInitPromise;
  if (!supabaseConfigured()) return null;
  cloudInitStarted = true;
  cloudInitPromise = (async () => {
    updateCloudStatus("Connecting...", "");

    try {
      const { createClient } = await import(SUPABASE_JS_URL);
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      await applyCloudSession(data?.session ?? null);
      supabaseClient.auth.onAuthStateChange((_event, session) => {
        applyCloudSession(session).catch((sessionError) => {
          console.warn("Cloud session update failed.", sessionError);
          updateCloudStatus("Cloud setup needed", "warning");
        });
      });
    } catch (error) {
      console.warn("Supabase failed to initialise.", error);
      updateCloudStatus("Cloud unavailable", "warning");
    }
    return supabaseClient;
  })();
  return cloudInitPromise;
}

async function applyCloudSession(session) {
  cloudUser = session?.user ?? null;
  cloudProjectCache = null;
  if (!cloudUser) {
    cloudProfile = null;
    updateCloudStatus();
    return;
  }

  cloudProfile = await ensureCloudProfile();
  updateCloudStatus();
  if (hasActiveCloudLicense() && state.projectId && hasDrawingContent()) {
    queueCloudAutosave();
  }
}

async function ensureCloudProfile() {
  if (!supabaseClient || !cloudUser) return null;

  const selectProfile = async () => {
    const { data, error } = await supabaseClient
      .from(CLOUD_PROFILES_TABLE)
      .select("id,email,license_status,trial_started_at,trial_ends_at")
      .eq("id", cloudUser.id)
      .maybeSingle();
    if (error) throw error;
    return data;
  };

  try {
    const existing = await selectProfile();
    if (existing) return existing;

    const { error: insertError } = await supabaseClient
      .from(CLOUD_PROFILES_TABLE)
      .insert({
        id: cloudUser.id,
        email: cloudUser.email ?? "",
      });
    if (insertError) throw insertError;
    return await selectProfile();
  } catch (error) {
    console.warn("Could not load cloud profile.", error);
    return null;
  }
}

function queueCloudAutosave() {
  if (!supabaseClient || !cloudUser || !hasActiveCloudLicense() || !state.projectId || !hasDrawingContent()) return;
  window.clearTimeout(cloudAutosaveTimer);
  cloudAutosaveTimer = window.setTimeout(() => {
    saveCloudProject({ silent: true }).catch((error) => {
      console.warn("Cloud autosave failed.", error);
      updateCloudStatus("Cloud save failed", "warning");
    });
  }, CLOUD_AUTOSAVE_DELAY_MS);
}

async function saveCloudProject(options = {}) {
  if (!supabaseClient || !cloudUser) return false;
  if (!hasActiveCloudLicense()) {
    updateCloudStatus(cloudLicenseText(), "warning");
    if (!options.silent) window.alert("This account does not have an active trial or licence.");
    return false;
  }
  if (cloudAutosaveBusy) return false;

  cloudAutosaveBusy = true;
  if (!options.silent) updateCloudStatus("Saving cloud...", "");
  try {
    const record = cloudProjectRecord();
    const { data, error } = await supabaseClient
      .from(CLOUD_PROJECTS_TABLE)
      .upsert(record, { onConflict: "id" })
      .select("id,name,updated_at,project_info,drawing_state")
      .single();
    if (error) throw error;
    cloudProjectCache = null;
    if (data) {
      state.projectId = data.id;
    }
    updateCloudStatus("Cloud saved", "");
    window.setTimeout(() => updateCloudStatus(), 1600);
    return true;
  } finally {
    cloudAutosaveBusy = false;
  }
}

async function loadSavedCloudProjects() {
  if (!supabaseClient || !cloudUser || !hasActiveCloudLicense()) return [];
  if (cloudProjectCache) return cloudProjectCache;

  const { data, error } = await supabaseClient
    .from(CLOUD_PROJECTS_TABLE)
    .select("id,name,updated_at,created_at,project_info,drawing_state")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  cloudProjectCache = (data ?? [])
    .map(mapCloudProject)
    .filter((project) => project.id && stateFromPayload(project.state));
  return cloudProjectCache;
}

async function openSavedCloudProject(projectId) {
  let record = (cloudProjectCache ?? []).find((project) => project.id === projectId);
  if (!record) {
    const projects = await loadSavedCloudProjects();
    record = projects.find((project) => project.id === projectId);
  }
  if (!record) {
    window.alert("That cloud project was not found.");
    return;
  }

  if (state.projectId !== record.id && hasDrawingContent()) {
    const proceed = window.confirm("Open this cloud project? Your current drawing will be replaced.");
    if (!proceed) return;
    persistState();
  }

  const restored = stateFromPayload(record.state);
  if (!restored) {
    window.alert("That cloud project could not be opened.");
    return;
  }

  state = restored;
  state.projectId = record.id;
  state.projectInfo = normalizeProjectInfo(record.projectInfo);
  state.projectInfoPrompted = true;
  three.userMovedCamera = false;
  setNextIdsFromState(state);
  updateControls();
  updateAll();
  closeProjectLibrary();
  updateCloudStatus("Cloud project opened", "");
  window.setTimeout(() => updateCloudStatus(), 1600);
}

async function deleteSavedCloudProject(projectId) {
  let record = (cloudProjectCache ?? []).find((project) => project.id === projectId);
  if (!record) {
    const projects = await loadSavedCloudProjects();
    record = projects.find((project) => project.id === projectId);
  }
  if (!record) return;

  const proceed = window.confirm(`Delete ${record.name || projectDisplayName(record.projectInfo)} from the cloud?`);
  if (!proceed) return;

  const { error } = await supabaseClient
    .from(CLOUD_PROJECTS_TABLE)
    .delete()
    .eq("id", projectId);
  if (error) {
    window.alert("Could not delete that cloud project.");
    throw error;
  }
  cloudProjectCache = null;
  if (state.projectId === projectId) {
    state.projectId = null;
    updateControls();
    persistState();
  }
  const projects = await loadSavedCloudProjects();
  renderProjectLibrary(projects, { source: "cloud" });
}

function loadSavedBrowserProjects() {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVED_PROJECTS_KEY));
    if (!Array.isArray(raw)) return [];
    return raw
      .map((project) => ({
        id: normalizeProjectId(project.id),
        name: String(project.name ?? "").trim().slice(0, 120),
        updatedAt: String(project.updatedAt ?? ""),
        projectInfo: normalizeProjectInfo(project.projectInfo),
        state: project.state,
      }))
      .filter((project) => project.id && stateFromPayload(project.state));
  } catch {
    return [];
  }
}

function storeSavedBrowserProjects(projects) {
  localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(projects));
}

function browserProjectRecord() {
  const projectInfo = normalizeProjectInfo(state.projectInfo);
  const id = normalizeProjectId(state.projectId) ?? createProjectId();
  state.projectId = id;
  return {
    id,
    name: projectDisplayName(projectInfo),
    updatedAt: new Date().toISOString(),
    projectInfo,
    state: statePayload(),
  };
}

function autoSaveCurrentBrowserProject() {
  if (!state.projectId) return;
  const projects = loadSavedBrowserProjects();
  const record = browserProjectRecord();
  const existingIndex = projects.findIndex((project) => project.id === record.id);
  if (existingIndex >= 0) {
    projects[existingIndex] = record;
  } else {
    projects.unshift(record);
  }
  storeSavedBrowserProjects(projects);
}

async function saveBrowserProject(options = {}) {
  const info = await openProjectDetailsDialog({
    title: state.projectId ? "Save project" : cloudUser && hasActiveCloudLicense() ? "Save cloud project" : "Save as project",
    action: "Save project",
    defaults: state.projectInfo,
  });
  if (!info) return false;

  state.projectInfo = info;
  state.projectInfoPrompted = true;
  if (!state.projectId) {
    state.projectId = createProjectId();
  }
  updateControls();
  updateAll();
  const savedToCloud = cloudUser && hasActiveCloudLicense()
    ? await saveCloudProject({ silent: true }).catch((error) => {
        console.warn("Cloud save failed.", error);
        updateCloudStatus("Cloud save failed", "warning");
        return false;
      })
    : false;
  if (!options.silent) {
    window.alert(`Saved ${projectDisplayName(info)} ${savedToCloud ? "to the cloud and this browser" : "in this browser"}.`);
  }
  return true;
}

async function openBrowserProject() {
  const useCloud = Boolean(cloudUser && hasActiveCloudLicense());
  let projects = [];
  if (useCloud) {
    try {
      updateCloudStatus("Loading cloud...", "");
      projects = await loadSavedCloudProjects();
      updateCloudStatus();
    } catch (error) {
      console.warn("Could not load cloud projects.", error);
      updateCloudStatus("Cloud load failed", "warning");
      window.alert("Cloud projects could not be loaded. Showing projects saved in this browser instead.");
      projects = loadSavedBrowserProjects();
    }
  } else {
    projects = loadSavedBrowserProjects();
  }

  projects = projects
    .sort((first, second) => String(second.updatedAt).localeCompare(String(first.updatedAt)));
  renderProjectLibrary(projects, { source: useCloud && projects.every((project) => project.source === "cloud") ? "cloud" : "browser" });
  if (projectLibraryDialog) {
    projectLibraryDialog.hidden = false;
  } else if (!projects.length) {
    window.alert(useCloud ? "No cloud projects saved yet." : "No saved projects in this browser yet.");
  }
}

function renderProjectLibrary(projects = loadSavedBrowserProjects(), options = {}) {
  if (!projectLibraryList) return;
  projectLibrarySource = options.source === "cloud" ? "cloud" : "browser";
  if (projectLibrarySubtitle) {
    projectLibrarySubtitle.textContent = projectLibrarySource === "cloud"
      ? "Projects are saved to your IsoSpool cloud account. Open a project folder, then tap a spool drawing."
      : "Projects are saved on this device/browser. Open a project folder, then tap a spool drawing.";
  }
  projectLibraryList.innerHTML = "";

  if (!projects.length) {
    const empty = document.createElement("div");
    empty.className = "project-library-empty";
    empty.textContent = projectLibrarySource === "cloud"
      ? "No cloud projects yet. Fill in the project details, then press Save."
      : "No saved projects yet. Fill in the project details, then press Save.";
    projectLibraryList.append(empty);
    return;
  }

  const folders = projectFolders(projects);
  for (const [folderIndex, folder] of folders.entries()) {
    const details = document.createElement("details");
    details.className = "project-folder";
    details.open = folder.active || folderIndex === 0;

    const summary = document.createElement("summary");
    summary.className = "project-folder-summary";

    const folderMain = document.createElement("div");
    folderMain.className = "project-folder-main";

    const title = document.createElement("strong");
    title.textContent = folder.title;

    const meta = document.createElement("span");
    meta.textContent = folder.meta;

    folderMain.append(title, meta);

    const count = document.createElement("span");
    count.className = "project-folder-count";
    count.textContent = `${folder.projects.length} spool${folder.projects.length === 1 ? "" : "s"}`;

    summary.append(folderMain, count);
    details.append(summary);

    const drawings = document.createElement("div");
    drawings.className = "project-folder-drawings";

    for (const project of folder.projects) {
      drawings.append(projectLibraryRow(project));
    }

    details.append(drawings);
    projectLibraryList.append(details);
  }
}

function recentProjectChoices(limit = 9) {
  const choices = new Map();
  const projects = loadSavedBrowserProjects()
    .sort((first, second) => String(second.updatedAt).localeCompare(String(first.updatedAt)));

  for (const project of projects) {
    const info = normalizeProjectInfo(project.projectInfo);
    if (!info.jobNumber) continue;
    const key = `${info.jobNumber.toLowerCase()}::${info.client.toLowerCase()}`;
    const existing = choices.get(key);
    if (existing) {
      existing.count += 1;
      continue;
    }

    choices.set(key, {
      key,
      jobNumber: info.jobNumber,
      client: info.client,
      revision: info.revision,
      drawnBy: info.drawnBy,
      updatedAt: project.updatedAt,
      count: 1,
    });
  }

  return [...choices.values()].slice(0, limit);
}

function updateProjectJobPickerButton() {
  if (!projectDialogJobPickerButton) return;
  const choices = recentProjectChoices();
  projectDialogJobPickerButton.disabled = choices.length === 0;
  projectDialogJobPickerButton.title = choices.length
    ? "Pick from previous project numbers. You can also right-click the Job no. field."
    : "No previous saved project numbers yet.";
}

function openProjectJobPicker() {
  if (!projectJobQuickPick) return;
  renderProjectJobPicker();
  projectJobQuickPick.hidden = false;
}

function closeProjectJobPicker() {
  if (projectJobQuickPick) projectJobQuickPick.hidden = true;
}

function renderProjectJobPicker() {
  if (!projectJobQuickPick) return;
  projectJobQuickPick.innerHTML = "";

  const query = projectDialogInputs.jobNumber?.value.trim().toLowerCase() ?? "";
  const choices = recentProjectChoices()
    .filter((choice) => {
      if (!query) return true;
      return choice.jobNumber.toLowerCase().includes(query) || choice.client.toLowerCase().includes(query);
    });

  if (!choices.length) {
    const empty = document.createElement("div");
    empty.className = "project-job-picker-empty";
    empty.textContent = query ? "No matching saved jobs." : "No saved project numbers yet.";
    projectJobQuickPick.append(empty);
    return;
  }

  for (const choice of choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "project-job-choice";
    button.dataset.projectJobNumber = choice.jobNumber;
    button.dataset.projectClient = choice.client;
    button.dataset.projectRevision = choice.revision;
    button.dataset.projectDrawnBy = choice.drawnBy;

    const title = document.createElement("strong");
    title.textContent = `Job ${choice.jobNumber}`;

    const detail = document.createElement("span");
    detail.textContent = [
      choice.client || "No client / area",
      `${choice.count} saved spool${choice.count === 1 ? "" : "s"}`,
    ].join(" / ");

    const meta = document.createElement("small");
    meta.textContent = choice.updatedAt ? `Last used ${new Date(choice.updatedAt).toLocaleDateString()}` : "Saved project";

    button.append(title, detail, meta);
    projectJobQuickPick.append(button);
  }
}

function applyProjectJobChoice(choiceButton) {
  const jobNumber = choiceButton.dataset.projectJobNumber ?? "";
  const client = choiceButton.dataset.projectClient ?? "";
  const revision = choiceButton.dataset.projectRevision ?? "";
  const drawnBy = choiceButton.dataset.projectDrawnBy ?? "";

  if (projectDialogInputs.jobNumber) projectDialogInputs.jobNumber.value = jobNumber;
  if (projectDialogInputs.client) projectDialogInputs.client.value = client;
  if (projectDialogInputs.revision && !projectDialogInputs.revision.value.trim()) {
    projectDialogInputs.revision.value = revision;
  }
  if (projectDialogInputs.drawnBy && !projectDialogInputs.drawnBy.value.trim()) {
    projectDialogInputs.drawnBy.value = drawnBy;
  }

  closeProjectJobPicker();
  projectDialogInputs.spoolNumber?.focus();
}

function projectLibraryRow(project) {
    const row = document.createElement("div");
    row.className = "project-library-row";
    row.classList.toggle("active", project.id === state.projectId);
    row.dataset.openProjectId = project.id;

    const main = document.createElement("div");
    main.className = "project-library-main";

    const title = document.createElement("strong");
    title.textContent = savedProjectSpoolTitle(project);

    const details = document.createElement("span");
    details.textContent = savedProjectDetailLine(project);

    const meta = document.createElement("span");
    meta.textContent = savedProjectMetaLine(project);

    main.append(title, details, meta);

    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.className = "project-library-action primary";
    openButton.textContent = "Open";
    openButton.dataset.openProjectId = project.id;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "project-library-action danger";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.deleteProjectId = project.id;
    deleteButton.dataset.projectSource = project.source ?? projectLibrarySource;

    row.dataset.projectSource = project.source ?? projectLibrarySource;
    openButton.dataset.projectSource = project.source ?? projectLibrarySource;
    row.append(main, openButton, deleteButton);
    return row;
}

function projectFolders(projects) {
  const folderMap = new Map();
  for (const project of projects) {
    const key = projectFolderKey(project);
    if (!folderMap.has(key)) {
      folderMap.set(key, {
        key,
        title: projectFolderTitle(project),
        projects: [],
        latest: "",
        active: false,
      });
    }

    const folder = folderMap.get(key);
    folder.projects.push(project);
    if (String(project.updatedAt) > String(folder.latest)) {
      folder.latest = project.updatedAt;
    }
    if (project.id === state.projectId) {
      folder.active = true;
    }
  }

  return [...folderMap.values()]
    .map((folder) => ({
      ...folder,
      projects: folder.projects.sort((first, second) => String(second.updatedAt).localeCompare(String(first.updatedAt))),
      meta: projectFolderMetaLine(folder),
    }))
    .sort((first, second) => {
      if (first.active !== second.active) return first.active ? -1 : 1;
      return String(second.latest).localeCompare(String(first.latest));
    });
}

function projectFolderKey(project) {
  const info = normalizeProjectInfo(project.projectInfo);
  const main = info.jobNumber || info.client || "unfiled";
  const client = info.jobNumber && info.client ? info.client : "";
  return `${main}::${client}`.toLowerCase();
}

function projectFolderTitle(project) {
  const info = normalizeProjectInfo(project.projectInfo);
  if (info.jobNumber && info.client) return `Job ${info.jobNumber} - ${info.client}`;
  if (info.jobNumber) return `Job ${info.jobNumber}`;
  if (info.client) return info.client;
  return "Unfiled project";
}

function projectFolderMetaLine(folder) {
  const updated = folder.latest ? new Date(folder.latest).toLocaleString() : "not dated";
  return `Last saved ${updated}`;
}

function savedProjectSpoolTitle(project) {
  const info = normalizeProjectInfo(project.projectInfo);
  const parts = [
    info.spoolNumber ? `Spool ${info.spoolNumber}` : "",
    info.revision ? `Rev ${info.revision}` : "",
  ].filter(Boolean);
  return parts.join(" - ") || project.name || "Untitled spool";
}

function savedProjectDetailLine(project) {
  const info = normalizeProjectInfo(project.projectInfo);
  const parts = [
    info.drawnBy ? `Drawn by ${info.drawnBy}` : "",
    info.client,
    info.jobNumber ? `Job ${info.jobNumber}` : "",
  ].filter(Boolean);
  return parts.join(" / ") || "No spool details";
}

function savedProjectMetaLine(project) {
  const savedState = project.state?.state && typeof project.state.state === "object" ? project.state.state : project.state;
  const runs = Array.isArray(savedState?.edges) ? savedState.edges.length : 0;
  const updated = project.updatedAt ? new Date(project.updatedAt).toLocaleString() : "not dated";
  return `${runs} run${runs === 1 ? "" : "s"} - saved ${updated}`;
}

function closeProjectLibrary() {
  if (projectLibraryDialog) projectLibraryDialog.hidden = true;
}

function openSavedBrowserProject(projectId) {
  const record = loadSavedBrowserProjects().find((project) => project.id === projectId);
  if (!record) {
    window.alert("That saved project was not found.");
    renderProjectLibrary();
    return;
  }

  if (state.projectId !== record.id && hasDrawingContent()) {
    const proceed = window.confirm("Open this project? Your current drawing will be replaced.");
    if (!proceed) return;
    persistState();
  }

  const restored = stateFromPayload(record.state);
  if (!restored) {
    window.alert("That saved project could not be opened.");
    return;
  }

  state = restored;
  state.projectId = record.id;
  state.projectInfo = normalizeProjectInfo(record.projectInfo);
  state.projectInfoPrompted = true;
  three.userMovedCamera = false;
  setNextIdsFromState(state);
  updateControls();
  updateAll();
  closeProjectLibrary();
}

function deleteSavedBrowserProject(projectId) {
  const projects = loadSavedBrowserProjects();
  const record = projects.find((project) => project.id === projectId);
  if (!record) return;

  const proceed = window.confirm(`Delete ${record.name || projectDisplayName(record.projectInfo)} from this browser?`);
  if (!proceed) return;

  storeSavedBrowserProjects(projects.filter((project) => project.id !== projectId));
  if (state.projectId === projectId) {
    state.projectId = null;
    updateControls();
    persistState();
  }
  renderProjectLibrary();
}

function withTemporaryState(tempState, callback) {
  const previousState = state;
  state = tempState;
  try {
    return callback();
  } finally {
    state = previousState;
  }
}

function normalizeLoadPlanTrayKey(value) {
  return LOAD_PLAN_TRAY_KEYS.has(value) ? value : "medium";
}

function normalizeLoadPlanRackKey(value) {
  return LOAD_PLAN_RACK_KEYS.has(value) ? value : "standard";
}

function selectedLoadPlanTray() {
  return LOAD_PLAN_TRAYS[normalizeLoadPlanTrayKey(loadPlanTrayKey)] ?? LOAD_PLAN_TRAYS.medium;
}

function selectedLoadPlanRack() {
  return LOAD_PLAN_RACKS[normalizeLoadPlanRackKey(loadPlanRackKey)] ?? LOAD_PLAN_RACKS.standard;
}

function loadPlanExtentsFromPoints(points) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const zs = points.map((point) => point.z);
  const min = { x: Math.min(...xs), y: Math.min(...ys), z: Math.min(...zs) };
  const max = { x: Math.max(...xs), y: Math.max(...ys), z: Math.max(...zs) };
  return {
    min,
    max,
    span: {
      x: max.x - min.x,
      y: max.y - min.y,
      z: max.z - min.z,
    },
  };
}

function loadPlanAxisValue(point, axis) {
  return Number(point?.[axis]) || 0;
}

function loadPlanFootprintForAxes(segmentData, extents, pipeSizes, largestPipe, axes) {
  const [primaryAxis, secondaryAxis, heightAxis] = axes;
  const label = `${primaryAxis.toUpperCase()}${secondaryAxis.toUpperCase()} lay`;
  const rawPoints = state.points.map((point) => ({
    x: loadPlanAxisValue(point, primaryAxis),
    y: loadPlanAxisValue(point, secondaryAxis),
  }));
  const minX = Math.min(...rawPoints.map((point) => point.x));
  const minY = Math.min(...rawPoints.map((point) => point.y));
  const rawWidthMm = Math.max(...rawPoints.map((point) => point.x)) - minX;
  const rawHeightMm = Math.max(...rawPoints.map((point) => point.y)) - minY;
  const paddingMm = Math.max(90, largestPipe.od * 1.3);
  const pointByIndex = rawPoints.map((point) => ({
    x: point.x - minX + paddingMm,
    y: point.y - minY + paddingMm,
  }));
  const segments = segmentData.map((segment) => {
    const size = pipeSizeForSegment(segment);
    return {
      from: pointByIndex[segment.from],
      to: pointByIndex[segment.to],
      nb: size.nb,
      od: size.od,
    };
  });
  const widthMm = Math.max(largestPipe.od * 4, rawWidthMm + paddingMm * 2);
  const heightMm = Math.max(largestPipe.od * 4, rawHeightMm + paddingMm * 2);
  const verticalMm = Math.max(largestPipe.od * 2, extents.span[heightAxis]);

  return {
    label,
    axes: { primary: primaryAxis, secondary: secondaryAxis, height: heightAxis },
    segments,
    widthMm,
    heightMm,
    verticalMm,
    maxPipeOdMm: largestPipe.od,
    pipeSizes,
    areaMm2: widthMm * heightMm,
  };
}

function loadPlanStackFootprintForAxis(segmentData, extents, pipeSizes, largestPipe, primaryAxis) {
  const otherAxes = ["x", "y", "z"].filter((axis) => axis !== primaryAxis);
  const sideAxis = otherAxes[0];
  const heightAxis = otherAxes[1];
  const rawPoints = state.points.map((point) => ({
    x: loadPlanAxisValue(point, primaryAxis),
    side: loadPlanAxisValue(point, sideAxis),
    height: loadPlanAxisValue(point, heightAxis),
  }));
  const minX = Math.min(...rawPoints.map((point) => point.x));
  const minSide = Math.min(...rawPoints.map((point) => point.side));
  const maxSide = Math.max(...rawPoints.map((point) => point.side));
  const rawWidthMm = Math.max(...rawPoints.map((point) => point.x)) - minX;
  const paddingMm = Math.max(90, largestPipe.od * 1.3);
  const pipeLaneMm = Math.max(420, largestPipe.od * 4.2);
  const sideSpanMm = Math.max(1, maxSide - minSide);
  const sideTravelMm = Math.min(pipeLaneMm * 0.58, Math.max(largestPipe.od * 1.5, 180));
  const pointByIndex = rawPoints.map((point) => ({
    x: point.x - minX + paddingMm,
    y: paddingMm + pipeLaneMm / 2 + ((point.side - minSide) / sideSpanMm - 0.5) * sideTravelMm,
  }));
  const segments = segmentData.map((segment) => {
    const size = pipeSizeForSegment(segment);
    return {
      from: pointByIndex[segment.from],
      to: pointByIndex[segment.to],
      nb: size.nb,
      od: size.od,
    };
  });
  const widthMm = Math.max(largestPipe.od * 4, rawWidthMm + paddingMm * 2);
  const heightMm = pipeLaneMm + paddingMm * 2;
  const verticalMm = Math.max(largestPipe.od * 2, extents.span[sideAxis], extents.span[heightAxis]);

  return {
    label: `${primaryAxis.toUpperCase()} edge stack`,
    axes: { primary: primaryAxis, secondary: "stack", height: `${sideAxis}${heightAxis}` },
    segments,
    widthMm,
    heightMm,
    verticalMm,
    maxPipeOdMm: largestPipe.od,
    pipeSizes,
    areaMm2: widthMm * heightMm,
    stackLay: true,
  };
}

function loadPlanFootprintsFromSegments(segmentData) {
  const extents = loadPlanExtentsFromPoints(state.points);
  const pipeSizes = [...new Set(segmentData.map((segment) => pipeSizeForSegment(segment).nb))].sort((first, second) => first - second);
  const largestPipe = pipeSizeByNb(pipeSizes.length ? pipeSizes[pipeSizes.length - 1] : state.pipeSizeNb);
  const axisSets = [
    ["x", "y", "z"],
    ["x", "z", "y"],
    ["y", "z", "x"],
  ];
  const seen = new Set();
  const stackAxes = ["x", "y", "z"].sort((first, second) => extents.span[second] - extents.span[first]);
  const footprints = [
    ...axisSets.map((axes) => loadPlanFootprintForAxes(segmentData, extents, pipeSizes, largestPipe, axes)),
    ...stackAxes.map((axis) => loadPlanStackFootprintForAxis(segmentData, extents, pipeSizes, largestPipe, axis)),
  ]
    .filter((footprint) => {
      const key = `${footprint.stackLay ? "stack" : "flat"}:${Math.round(footprint.widthMm)}:${Math.round(footprint.heightMm)}:${Math.round(footprint.verticalMm)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((first, second) => {
      if (first.stackLay !== second.stackLay) return first.stackLay ? 1 : -1;
      const heightDiff = first.verticalMm - second.verticalMm;
      if (Math.abs(heightDiff) > 1) return heightDiff;
      return second.areaMm2 - first.areaMm2;
    });

  return {
    footprints,
    pipeSizes,
    largestPipe,
  };
}

function loadPlanItemFromPayload(id, name, payload, projectInfo, updatedAt = "", source = "saved") {
  const restored = stateFromPayload(payload);
  if (!restored) return null;

  return withTemporaryState(restored, () => {
    const segmentData = segments();
    if (!segmentData.length) return null;

    const quantities = quantitySummary(segmentData);
    const footprintSet = loadPlanFootprintsFromSegments(segmentData);
    const footprint = footprintSet.footprints[0];
    if (!footprint) return null;
    const normalizedInfo = normalizeProjectInfo(projectInfo ?? state.projectInfo);
    const displayName = name || projectDisplayName(normalizedInfo);

    return {
      id,
      name: displayName,
      projectInfo: normalizedInfo,
      updatedAt,
      source,
      segmentCount: segmentData.length,
      lengthMm: footprint.widthMm,
      widthMm: footprint.heightMm,
      heightMm: footprint.verticalMm,
      jobKey: loadPlanJobKeyFromInfo(normalizedInfo),
      jobLabel: loadPlanJobLabelFromInfo(normalizedInfo),
      footprint,
      footprints: footprintSet.footprints,
      footprintAreaMm2: Math.max(...footprintSet.footprints.map((item) => item.areaMm2)),
      weightKg: quantities.totalWeightKg,
      pipeSpecLabel: pipeSpecShortLabel(),
      pipeSizesLabel: footprintSet.pipeSizes.length ? `NB ${footprintSet.pipeSizes.join(", NB ")}` : `NB ${state.pipeSizeNb}`,
    };
  });
}

function loadPlanAvailableItems() {
  const items = [];
  const currentPayload = statePayload();
  const current = loadPlanItemFromPayload(
    "__current__",
    `${projectDisplayName(currentPayload.projectInfo)} (current)`,
    currentPayload,
    currentPayload.projectInfo,
    "",
    "current",
  );
  if (current) items.push(current);

  const projects = loadSavedBrowserProjects()
    .filter((project) => project.id !== state.projectId)
    .sort((first, second) => String(second.updatedAt).localeCompare(String(first.updatedAt)));

  for (const project of projects) {
    const item = loadPlanItemFromPayload(
      project.id,
      project.name || projectDisplayName(project.projectInfo),
      project.state,
      project.projectInfo,
      project.updatedAt,
    );
    if (item) items.push(item);
  }

  return items;
}

function loadPlanJobKeyFromInfo(info) {
  const normalized = normalizeProjectInfo(info);
  const jobNumber = String(normalized.jobNumber ?? "").trim();
  return jobNumber ? jobNumber.toLowerCase() : "__unassigned__";
}

function loadPlanJobLabelFromInfo(info) {
  const normalized = normalizeProjectInfo(info);
  const jobNumber = String(normalized.jobNumber ?? "").trim();
  const client = String(normalized.client ?? "").trim();
  if (!jobNumber) return client ? `Unassigned job - ${client}` : "Unassigned job";
  return client ? `${jobNumber} - ${client}` : jobNumber;
}

function loadPlanJobChoices(items = loadPlanAvailableItems()) {
  const byKey = new Map();
  for (const item of items) {
    if (!byKey.has(item.jobKey)) {
      byKey.set(item.jobKey, {
        key: item.jobKey,
        label: item.jobLabel,
        count: 0,
      });
    }
    byKey.get(item.jobKey).count += 1;
  }

  return [...byKey.values()].sort((first, second) => {
    if (first.key === "__unassigned__") return 1;
    if (second.key === "__unassigned__") return -1;
    return first.label.localeCompare(second.label, undefined, { numeric: true, sensitivity: "base" });
  });
}

function renderLoadPlanJobOptions(items = loadPlanAvailableItems()) {
  if (!loadPlanJobSelect) return;
  const choices = loadPlanJobChoices(items);
  const validKeys = new Set(choices.map((choice) => choice.key));
  if (loadPlanJobKey && !validKeys.has(loadPlanJobKey)) {
    loadPlanJobKey = "";
  }

  loadPlanJobSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = choices.length ? "Select job first" : "No jobs saved yet";
  loadPlanJobSelect.append(placeholder);

  for (const choice of choices) {
    const option = document.createElement("option");
    option.value = choice.key;
    option.textContent = `${choice.label} (${choice.count})`;
    loadPlanJobSelect.append(option);
  }

  loadPlanJobSelect.value = loadPlanJobKey;
  loadPlanJobSelect.disabled = !choices.length;
}

function loadPlanVisibleItems(items = loadPlanAvailableItems()) {
  if (!loadPlanJobKey) return [];
  return items.filter((item) => item.jobKey === loadPlanJobKey);
}

function selectedLoadPlanItems(items = loadPlanVisibleItems()) {
  return items.filter((item) => loadPlanSelection.has(item.id)).slice(0, LOAD_PLAN_MAX_SPOOLS);
}

function loadPlanItemMeta(item) {
  const size = `${formatLength(item.lengthMm)} x ${formatLength(item.widthMm)} footprint / ${formatLength(item.heightMm)} high`;
  return `${formatMass(item.weightKg)} kg / ${item.segmentCount} runs / ${size}`;
}

function loadPlanItemFitStatus(item) {
  const tray = selectedLoadPlanTray();
  const rack = selectedLoadPlanRack();
  const trayPlacement = findLoadPlanPlacement(item, [], tray, "tray");
  const rackPlacement = rack ? findLoadPlanPlacement(item, [], rack, "rack") : null;

  if (trayPlacement) {
    return {
      className: "fit-tray",
      text: "Fits tray",
    };
  }

  if (rackPlacement) {
    return {
      className: "fit-rack",
      text: "Won't fit tray - roof racks only",
    };
  }

  return {
    className: "fit-none",
    text: rack ? "Won't fit selected tray or roof racks" : "Won't fit selected tray",
  };
}

function renderLoadPlanProjectChoices() {
  if (!loadPlanProjectList) return [];

  if (loadPlanTraySelect) loadPlanTraySelect.value = normalizeLoadPlanTrayKey(loadPlanTrayKey);
  if (loadPlanRackSelect) loadPlanRackSelect.value = normalizeLoadPlanRackKey(loadPlanRackKey);
  const allItems = loadPlanAvailableItems();
  renderLoadPlanJobOptions(allItems);
  const items = loadPlanVisibleItems(allItems);
  const validIds = new Set(items.map((item) => item.id));
  loadPlanSelection = new Set([...loadPlanSelection].filter((id) => validIds.has(id)));

  loadPlanProjectList.innerHTML = "";
  if (!allItems.length) {
    const empty = document.createElement("div");
    empty.className = "project-library-empty";
    empty.textContent = "No pipe spools available yet. Draw or open a saved spool, then come back to Load plan.";
    loadPlanProjectList.append(empty);
    if (loadPlanPlayButton) loadPlanPlayButton.disabled = true;
    updateLoadPlanBulkButtons([]);
    drawLoadPlanEmpty();
    return allItems;
  }

  if (!loadPlanJobKey) {
    const empty = document.createElement("div");
    empty.className = "project-library-empty";
    empty.textContent = "Select a job first, then the spools for that job will show here.";
    loadPlanProjectList.append(empty);
    if (loadPlanPlayButton) loadPlanPlayButton.disabled = true;
    currentLoadPlan = createTruckLoadPlan([]);
    updateLoadPlanBulkButtons([]);
    updateLoadPlanPendingSelection([]);
    return allItems;
  }

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "project-library-empty";
    empty.textContent = "No spools found for this job.";
    loadPlanProjectList.append(empty);
    if (loadPlanPlayButton) loadPlanPlayButton.disabled = true;
    updateLoadPlanBulkButtons([]);
    updateLoadPlanPendingSelection([]);
    return allItems;
  }

  if (loadPlanPlayButton) loadPlanPlayButton.disabled = false;
  updateLoadPlanBulkButtons(items);

  for (const item of items) {
    const label = document.createElement("label");
    label.className = "load-plan-choice";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = item.id;
    checkbox.checked = loadPlanSelection.has(item.id);

    const body = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = item.name;

    const meta = document.createElement("span");
    meta.textContent = loadPlanItemMeta(item);

    const fitStatus = loadPlanItemFitStatus(item);
    const fit = document.createElement("em");
    fit.className = `load-plan-fit-status ${fitStatus.className}`;
    fit.textContent = fitStatus.text;

    const detail = document.createElement("small");
    detail.textContent = `${item.pipeSizesLabel} / ${item.pipeSpecLabel} / ${item.footprints.length} lay option${item.footprints.length === 1 ? "" : "s"}${item.source === "current" ? " / on screen now" : ""}`;

    body.append(title, meta, fit, detail);
    label.append(checkbox, body);
    loadPlanProjectList.append(label);
  }

  updateLoadPlanPendingSelection(items);
  return allItems;
}

function updateLoadPlanBulkButtons(items = loadPlanVisibleItems()) {
  const hasItems = Boolean(loadPlanJobKey && items.length);
  if (loadPlanSelectAllButton) loadPlanSelectAllButton.disabled = !hasItems;
  if (loadPlanDeselectAllButton) loadPlanDeselectAllButton.disabled = !hasItems;
}

function setVisibleLoadPlanSelection(selectAll) {
  const items = loadPlanVisibleItems();
  if (!items.length) return;

  if (selectAll) {
    loadPlanSelection = new Set(items.slice(0, LOAD_PLAN_MAX_SPOOLS).map((item) => item.id));
    if (items.length > LOAD_PLAN_MAX_SPOOLS) {
      window.alert(`Selected the first ${LOAD_PLAN_MAX_SPOOLS} spools. This load planner handles up to ${LOAD_PLAN_MAX_SPOOLS} at once.`);
    }
  } else {
    loadPlanSelection.clear();
  }

  renderLoadPlanProjectChoices();
}

function updateLoadPlanPendingSelection(items = loadPlanVisibleItems()) {
  const selectedItems = selectedLoadPlanItems(items);
  const selectedCount = selectedItems.length;
  currentLoadPlan = loadPlanViewMode === "model" && selectedCount
    ? createTruckLoadPlan(selectedItems)
    : createTruckLoadPlan([]);
  renderLoadPlan(currentLoadPlan);
  if (!loadPlanSummary) return;
  if (loadPlanViewMode === "model" && selectedCount) {
    updateLoadPlanSummary(currentLoadPlan);
    return;
  }
  loadPlanSummary.textContent = selectedCount
    ? `${selectedCount} spool${selectedCount === 1 ? "" : "s"} selected. Press Make layout.`
    : loadPlanJobKey ? "Select spools, then press Make layout." : "Select a job first.";
}

function handleLoadPlanChoiceChange(event) {
  const checkbox = event.target instanceof HTMLInputElement ? event.target : null;
  if (!checkbox || checkbox.type !== "checkbox") return;

  if (checkbox.checked && loadPlanSelection.size >= LOAD_PLAN_MAX_SPOOLS) {
    checkbox.checked = false;
    window.alert(`Pick up to ${LOAD_PLAN_MAX_SPOOLS} spools for this load plan.`);
    return;
  }

  if (checkbox.checked) {
    loadPlanSelection.add(checkbox.value);
  } else {
    loadPlanSelection.delete(checkbox.value);
  }

  updateLoadPlanPendingSelection(loadPlanVisibleItems());
}

function updateLoadPlanViewControls() {
  const modelActive = loadPlanViewMode === "model";
  const hasPlan = Boolean(currentLoadPlan?.placements?.length);
  loadPlanLayoutButton?.classList.toggle("active", !modelActive);
  loadPlanLayoutButton?.setAttribute("aria-pressed", String(!modelActive));
  loadPlanModelButton?.classList.toggle("active", modelActive);
  loadPlanModelButton?.setAttribute("aria-pressed", String(modelActive));
  if (loadPlanAnimateButton) loadPlanAnimateButton.disabled = !hasPlan;
  loadPlanSpinButton?.classList.toggle("active", modelActive && loadPlanThree.spinning);
  loadPlanSpinButton?.setAttribute("aria-pressed", String(modelActive && loadPlanThree.spinning));
  if (loadPlanSpinButton) loadPlanSpinButton.disabled = !modelActive;
  if (loadPlanResetButton) loadPlanResetButton.disabled = !modelActive;
  loadPlanStage?.classList.toggle("is-3d-model", modelActive);
}

function setLoadPlanViewMode(mode) {
  const nextMode = mode === "model" ? "model" : "layout";
  const selectedItems = selectedLoadPlanItems();
  loadPlanViewMode = nextMode;

  if (nextMode === "model") {
    if (selectedItems.length) {
      currentLoadPlan = createTruckLoadPlan(selectedItems);
      updateLoadPlanSummary(currentLoadPlan);
    } else if (!currentLoadPlan) {
      currentLoadPlan = createTruckLoadPlan([]);
    }
  }

  updateLoadPlanViewControls();
  renderLoadPlan(currentLoadPlan ?? createTruckLoadPlan([]));
}

function loadPlanNormalizeRotation(rotation) {
  return ((Number(rotation) || 0) % 360 + 360) % 360;
}

function loadPlanRotationOptions() {
  const preferred = [0, 180, 90, 270, 15, 345, 30, 330, 45, 315, 60, 300, 75, 285];
  const all = [];
  for (let angle = 0; angle < 360; angle += LOAD_PLAN_ROTATION_STEP_DEG) {
    all.push(angle);
  }
  return [...new Set([...preferred, ...all].map(loadPlanNormalizeRotation))];
}

function loadPlanRotatePointAroundCenter(point, footprint, rotation) {
  const radians = loadPlanNormalizeRotation(rotation) * Math.PI / 180;
  const centerX = footprint.widthMm / 2;
  const centerY = footprint.heightMm / 2;
  const dx = point.x - centerX;
  const dy = point.y - centerY;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return {
    x: dx * cos - dy * sin,
    y: dx * sin + dy * cos,
  };
}

function loadPlanRotationBounds(footprint, rotation) {
  const rotationKey = String(loadPlanNormalizeRotation(rotation));
  footprint.rotationBounds ??= {};
  if (footprint.rotationBounds[rotationKey]) return footprint.rotationBounds[rotationKey];

  const points = (footprint.segments ?? [])
    .flatMap((segment) => [segment.from, segment.to])
    .filter(Boolean);
  if (!points.length) {
    const fallback = {
      minX: 0,
      minY: 0,
      widthMm: footprint.widthMm,
      heightMm: footprint.heightMm,
      paddingMm: 0,
    };
    footprint.rotationBounds[rotationKey] = fallback;
    return fallback;
  }

  const rotated = points.map((point) => loadPlanRotatePointAroundCenter(point, footprint, rotation));
  const minX = Math.min(...rotated.map((point) => point.x));
  const maxX = Math.max(...rotated.map((point) => point.x));
  const minY = Math.min(...rotated.map((point) => point.y));
  const maxY = Math.max(...rotated.map((point) => point.y));
  const paddingMm = Math.max(70, (footprint.maxPipeOdMm ?? 50) * 0.85);
  const bounds = {
    minX,
    minY,
    widthMm: Math.max((footprint.maxPipeOdMm ?? 50) * 4, maxX - minX + paddingMm * 2),
    heightMm: Math.max((footprint.maxPipeOdMm ?? 50) * 4, maxY - minY + paddingMm * 2),
    paddingMm,
  };
  footprint.rotationBounds[rotationKey] = bounds;
  return bounds;
}

function loadPlanRotatedSize(footprint, rotation) {
  const bounds = loadPlanRotationBounds(footprint, rotation);
  return { widthMm: bounds.widthMm, heightMm: bounds.heightMm };
}

function loadPlanTransformPoint(point, footprint, rotation) {
  const bounds = loadPlanRotationBounds(footprint, rotation);
  const rotated = loadPlanRotatePointAroundCenter(point, footprint, rotation);
  return {
    x: rotated.x - bounds.minX + bounds.paddingMm,
    y: rotated.y - bounds.minY + bounds.paddingMm,
  };
}

function loadPlanAxisPositions(maxValue, step, centredValue = 0) {
  const values = new Set([0, Math.max(0, maxValue), clampNumber(centredValue, 0, Math.max(0, maxValue))]);
  for (let value = 0; value <= maxValue; value += step) {
    values.add(Math.round(value));
  }
  return [...values].sort((first, second) => first - second);
}

function loadPlanRectsOverlap(first, second, clearanceMm = LOAD_PLAN_CLEARANCE_MM) {
  return !(
    first.x + first.widthMm + clearanceMm <= second.x ||
    second.x + second.widthMm + clearanceMm <= first.x ||
    first.y + first.heightMm + clearanceMm <= second.y ||
    second.y + second.heightMm + clearanceMm <= first.y
  );
}

function loadPlanRectCenter(rect) {
  return {
    x: rect.x + rect.widthMm / 2,
    y: rect.y + rect.heightMm / 2,
  };
}

function loadPlanStackRepeatPenalty(rect, layer, placed) {
  if (layer <= 0) return 0;
  const center = loadPlanRectCenter(rect);
  return placed.reduce((penalty, placement) => {
    if ((placement.layer ?? 0) >= layer) return penalty;
    const otherCenter = loadPlanRectCenter(placement.rect);
    const distance = pointDistance2d(center, otherCenter);
    const repeatRange = Math.max(260, Math.min(rect.widthMm, rect.heightMm, placement.widthMm, placement.heightMm) * 0.85);
    if (distance >= repeatRange) return penalty;
    return penalty + (1 - distance / repeatRange) * 560000;
  }, 0);
}

function loadPlanFrontCrowdPenalty(rect, layer, placed, zoneType) {
  const sameLayer = placed.filter((placement) => (placement.layer ?? 0) === layer);
  if (!sameLayer.length) return 0;

  const center = loadPlanRectCenter(rect);
  return sameLayer.reduce((penalty, placement) => {
    const otherCenter = loadPlanRectCenter(placement.rect);
    const xGap = Math.abs(center.x - otherCenter.x);
    const xRange = clampNumber((rect.widthMm + placement.widthMm) * 0.34, 620, 1450);
    if (xGap >= xRange) return penalty;

    const yGap = Math.abs(center.y - otherCenter.y);
    const sideBySide = yGap > Math.min(rect.heightMm, placement.heightMm) * 0.55;
    const strength = zoneType === "rack" ? 7800000 : 9800000;
    return penalty + (1 - xGap / xRange) * strength * (sideBySide ? 1 : 0.62);
  }, 0);
}

function loadPlanLayerQueuePenalty(rect, layer, placed, loadZone) {
  const sameLayer = placed.filter((placement) => (placement.layer ?? 0) === layer);
  if (!sameLayer.length) return rect.x * 1200;

  const openEnd = Math.max(...sameLayer.map((placement) => placement.x + placement.widthMm));
  const targetX = clampNumber(openEnd + LOAD_PLAN_CLEARANCE_MM * 2, 0, Math.max(0, loadZone.lengthMm - rect.widthMm));
  return Math.abs(rect.x - targetX) * 2700;
}

function findLoadPlanPlacement(item, placed, loadZone, zoneType) {
  let best = null;
  const rotations = loadPlanRotationOptions();
  const footprints = item.footprints?.length ? item.footprints : [item.footprint].filter(Boolean);
  const maxLayers = zoneType === "tray" ? LOAD_PLAN_TRAY_LAYERS : LOAD_PLAN_RACK_LAYERS;

  for (const footprint of footprints) {
    for (const rotation of rotations) {
      const size = loadPlanRotatedSize(footprint, rotation);
      if (size.widthMm > loadZone.lengthMm || size.heightMm > loadZone.widthMm) continue;

      const maxX = loadZone.lengthMm - size.widthMm;
      const maxY = loadZone.widthMm - size.heightMm;
      const xPositions = loadPlanAxisPositions(maxX, LOAD_PLAN_PACK_STEP_MM, maxX / 2);
      const yPositions = loadPlanAxisPositions(maxY, LOAD_PLAN_PACK_STEP_MM, maxY / 2);

      for (let layer = 0; layer < maxLayers; layer += 1) {
        for (const x of xPositions) {
          for (const y of yPositions) {
            const rect = { x, y, widthMm: size.widthMm, heightMm: size.heightMm };
            const clearanceMm = layer > 0 ? Math.max(4, LOAD_PLAN_CLEARANCE_MM * 0.4) : LOAD_PLAN_CLEARANCE_MM;
            if (placed.some((placement) => placement.layer === layer && loadPlanRectsOverlap(rect, placement.rect, clearanceMm))) continue;

            const usedLengthMm = Math.max(
              x + size.widthMm,
              ...placed.map((placement) => placement.x + placement.widthMm),
              0,
            );
            const sideBalance = Math.abs(y + size.heightMm / 2 - loadZone.widthMm / 2);
            const normalizedRotation = loadPlanNormalizeRotation(rotation);
            const simpleAngle = normalizedRotation % 90 === 0;
            const diagonalBonus = simpleAngle ? 0 : -Math.min(90000, Math.abs(Math.sin(normalizedRotation * Math.PI / 180)) * 42000);
            const rotationPenalty = normalizedRotation === 0 ? 0 : simpleAngle ? 20 : 34;
            const layPenalty = footprint === item.footprint ? 0 : footprint.verticalMm * 5;
            const layerPenalty = layer * (zoneType === "tray" ? 220000 : 320000);
            const roofPenalty = zoneType === "rack" ? 180000 : 0;
            const xPositionPenalty = layer > 0 ? Math.abs(x - maxX / 2) * 18 : x * 2;
            const frontCrowdPenalty = loadPlanFrontCrowdPenalty(rect, layer, placed, zoneType);
            const queuePenalty = loadPlanLayerQueuePenalty(rect, layer, placed, loadZone);
            const repeatPenalty = loadPlanStackRepeatPenalty(rect, layer, placed);
            const score = usedLengthMm * 4200 + sideBalance * 24 + xPositionPenalty + queuePenalty + y + rotationPenalty + layPenalty + layerPenalty + roofPenalty + diagonalBonus + repeatPenalty + frontCrowdPenalty;
            if (!best || score < best.score) {
              best = {
                x,
                y,
                widthMm: size.widthMm,
                heightMm: size.heightMm,
                rotation,
                rect,
                zone: zoneType,
                layer,
                footprint,
                score,
              };
            }
          }
        }
      }
    }
  }

  return best;
}

function createTruckLoadPlan(items) {
  const tray = selectedLoadPlanTray();
  const rack = selectedLoadPlanRack();
  if (!items.length) return { tray, rack, placements: [], rejected: [], usedLengthMm: 0, rackUsedLengthMm: 0, totalDuration: 900 };

  const sorted = [...items].sort((first, second) => {
    const areaDiff = second.footprintAreaMm2 - first.footprintAreaMm2;
    if (Math.abs(areaDiff) > 1) return areaDiff;
    return second.weightKg - first.weightKg;
  });
  const placements = [];
  const trayPlacements = [];
  const rackPlacements = [];
  const rejected = [];

  for (const item of sorted) {
    const rackCandidate = rack ? findLoadPlanPlacement(item, rackPlacements, rack, "rack") : null;
    const trayCandidate = findLoadPlanPlacement(item, trayPlacements, tray, "tray");
    const placement = trayCandidate ?? rackCandidate;
    if (!placement) {
      rejected.push(item);
      continue;
    }

    const zonePlacements = placement.zone === "rack" ? rackPlacements : trayPlacements;
    zonePlacements.push(placement);
    placements.push({
      ...placement,
      item,
      order: placements.length + 1,
      delay: placements.length * 620,
      duration: 860,
    });
  }

  const usedLengthMm = trayPlacements.reduce((max, placement) => Math.max(max, placement.x + placement.widthMm), 0);
  const rackUsedLengthMm = rackPlacements.reduce((max, placement) => Math.max(max, placement.x + placement.widthMm), 0);
  return {
    tray,
    rack,
    placements,
    rejected,
    usedLengthMm,
    rackUsedLengthMm,
    totalWeightKg: placements.reduce((sum, placement) => sum + placement.item.weightKg, 0),
    totalDuration: placements.length
      ? placements[placements.length - 1].delay + placements[placements.length - 1].duration + 320
      : 900,
  };
}

function openLoadPlanDialog() {
  if (!loadPlanDialog) return;
  loadPlanSelection = new Set();
  loadPlanJobKey = "";
  loadPlanViewMode = "layout";
  updateLoadPlanViewControls();
  if (loadPlanTraySelect) loadPlanTraySelect.value = normalizeLoadPlanTrayKey(loadPlanTrayKey);
  if (loadPlanRackSelect) loadPlanRackSelect.value = normalizeLoadPlanRackKey(loadPlanRackKey);
  loadPlanDialog.hidden = false;
  renderLoadPlanProjectChoices();
  loadPlanPlayButton?.focus();
}

function closeLoadPlanDialog() {
  if (loadPlanAnimationFrame) {
    cancelAnimationFrame(loadPlanAnimationFrame);
    loadPlanAnimationFrame = 0;
  }
  setLoadPlanSpin(false);
  stopLoadPlanThreeLoop();
  currentLoadPlan = null;
  if (loadPlanDialog) loadPlanDialog.hidden = true;
}

function drawLoadPlanEmpty() {
  if (!loadPlanCanvas) return;
  if (loadPlanThreeCanvas) loadPlanThreeCanvas.hidden = true;
  loadPlanCanvas.hidden = false;
  const { ctx, width, height } = resizeCanvas(loadPlanCanvas);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f7fbfa";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#5b6b70";
  ctx.font = "900 14px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("No spools ready for load planning", width / 2, height / 2);
  if (loadPlanSummary) loadPlanSummary.textContent = "Draw or open saved spools first. The planner can use the current spool plus saved browser projects.";
}

function renderLoadPlan(plan, elapsed = 0, playing = false) {
  updateLoadPlanViewControls();
  if (loadPlanViewMode === "model") {
    if (renderLoadPlanThree(plan, elapsed, playing)) return;
    loadPlanViewMode = "layout";
    updateLoadPlanViewControls();
  }

  stopLoadPlanThreeLoop();
  setLoadPlanSpin(false);
  if (loadPlanThreeCanvas) loadPlanThreeCanvas.hidden = true;
  if (loadPlanCanvas) loadPlanCanvas.hidden = false;
  drawTruckLoadPlan(plan, elapsed, playing);
}

function renderLoadPlanThree(plan, elapsed = 0, playing = false) {
  if (!plan || !ensureLoadPlanThree()) return false;
  if (loadPlanCanvas) loadPlanCanvas.hidden = true;
  if (loadPlanThreeCanvas) loadPlanThreeCanvas.hidden = false;
  resizeLoadPlanThree();
  rebuildLoadPlanThree(plan, elapsed, playing);
  updateLoadPlanViewControls();
  return true;
}

function ensureLoadPlanThree() {
  if (!loadPlanThreeCanvas || !loadPlanStage || !three.module || !three.OrbitControls) return false;
  if (loadPlanThree.ready) {
    loadPlanThreeCanvas.hidden = false;
    if (loadPlanCanvas) loadPlanCanvas.hidden = true;
    resizeLoadPlanThree();
    startLoadPlanThreeLoop();
    return true;
  }

  try {
    const THREE = three.module;
    loadPlanThree.scene = new THREE.Scene();
    loadPlanThree.scene.background = new THREE.Color(0xf7fbfa);
    loadPlanThree.camera = new THREE.PerspectiveCamera(42, 1, 0.05, 100);
    loadPlanThree.camera.up.set(0, 0, 1);
    loadPlanThree.renderer = new THREE.WebGLRenderer({
      canvas: loadPlanThreeCanvas,
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
    });
    loadPlanThree.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    loadPlanThree.renderer.shadowMap.enabled = true;
    loadPlanThree.renderer.outputColorSpace = THREE.SRGBColorSpace;
    loadPlanThree.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    loadPlanThree.renderer.toneMappingExposure = 1.08;

    loadPlanThree.scene.add(new THREE.HemisphereLight(0xffffff, 0xb8c2c0, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(6, -8, 8);
    keyLight.castShadow = true;
    loadPlanThree.scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xe8f0ef, 1.25);
    fillLight.position.set(-7, 7, 6);
    loadPlanThree.scene.add(fillLight);

    loadPlanThree.controls = new three.OrbitControls(loadPlanThree.camera, loadPlanThree.renderer.domElement);
    loadPlanThree.controls.enableDamping = true;
    loadPlanThree.controls.dampingFactor = 0.12;
    loadPlanThree.controls.screenSpacePanning = true;
    loadPlanThree.controls.enablePan = true;
    loadPlanThree.controls.enableZoom = true;
    loadPlanThree.controls.rotateSpeed = 0.58;
    loadPlanThree.controls.panSpeed = 0.72;
    loadPlanThree.controls.zoomSpeed = 0.78;
    loadPlanThree.controls.autoRotateSpeed = 1.15;

    loadPlanThree.ready = true;
    loadPlanThreeCanvas.hidden = false;
    if (loadPlanCanvas) loadPlanCanvas.hidden = true;
    resizeLoadPlanThree();
    startLoadPlanThreeLoop();
    return true;
  } catch (error) {
    console.warn("Load planner 3D view failed; using canvas fallback.", error);
    return false;
  }
}

function startLoadPlanThreeLoop() {
  if (!loadPlanThree.ready || loadPlanThree.animationFrame) return;
  loadPlanThree.animationFrame = requestAnimationFrame(animateLoadPlanThree);
}

function stopLoadPlanThreeLoop() {
  if (!loadPlanThree.animationFrame) return;
  cancelAnimationFrame(loadPlanThree.animationFrame);
  loadPlanThree.animationFrame = 0;
}

function animateLoadPlanThree() {
  if (!loadPlanThree.ready) {
    loadPlanThree.animationFrame = 0;
    return;
  }
  loadPlanThree.animationFrame = requestAnimationFrame(animateLoadPlanThree);
  if (loadPlanThree.controls) {
    loadPlanThree.controls.autoRotate = loadPlanThree.spinning;
    loadPlanThree.controls.update();
  }
  loadPlanThree.renderer?.render(loadPlanThree.scene, loadPlanThree.camera);
}

function resizeLoadPlanThree() {
  if (!loadPlanThree.ready || !loadPlanStage) return;
  const rect = loadPlanStage.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  loadPlanThree.renderer.setSize(width, height, false);
  loadPlanThree.camera.aspect = width / height;
  loadPlanThree.camera.updateProjectionMatrix();
}

function rebuildLoadPlanThree(plan, elapsed = 0, playing = false) {
  if (!loadPlanThree.ready || !plan) return;
  const THREE = three.module;
  if (loadPlanThree.group) {
    loadPlanThree.scene.remove(loadPlanThree.group);
    disposeObject3d(loadPlanThree.group);
  }

  const group = new THREE.Group();
  buildLoadPlanTruckBody3d(group, plan);
  buildLoadPlanZone3d(group, plan.tray, "tray", plan.tray);
  if (plan.rack) buildLoadPlanZone3d(group, plan.rack, "rack", plan.tray);

  const drawPlacements = [...plan.placements].sort((first, second) => {
    if (first.zone !== second.zone) return first.zone === "rack" ? -1 : 1;
    if ((first.layer ?? 0) !== (second.layer ?? 0)) return (first.layer ?? 0) - (second.layer ?? 0);
    return first.order - second.order;
  });
  for (const placement of drawPlacements) {
    buildLoadPlanSpool3d(group, plan, placement, elapsed, playing);
  }

  loadPlanThree.scene.add(group);
  loadPlanThree.group = group;
  frameLoadPlanThreeCamera();
  loadPlanThree.renderer.render(loadPlanThree.scene, loadPlanThree.camera);
}

function buildLoadPlanTruckBody3d(group, plan) {
  const THREE = three.module;
  const trayLength = plan.tray.lengthMm * LOAD_PLAN_3D_SCALE;
  const trayWidth = plan.tray.widthMm * LOAD_PLAN_3D_SCALE;
  const trayStartX = -trayLength / 2;
  const trayEndX = trayLength / 2;
  const cabLength = clampNumber(trayLength * 0.32, 0.95, 1.25);
  const bonnetLength = clampNumber(trayLength * 0.16, 0.45, 0.62);
  const cabWidth = Math.min(trayWidth * 0.86, 1.72);
  const cabX = trayStartX - cabLength / 2 - 0.12;
  const bonnetX = cabX - cabLength / 2 - bonnetLength / 2 + 0.05;
  const frontX = bonnetX - bonnetLength / 2 - 0.08;
  const chassisLength = trayEndX - frontX + 0.16;
  const chassisX = (trayEndX + frontX) / 2;

  const chassisMaterial = new THREE.MeshStandardMaterial({ color: 0x2e383a, roughness: 0.48, metalness: 0.42 });
  const cabMaterial = new THREE.MeshStandardMaterial({ color: 0xe7eeee, roughness: 0.45, metalness: 0.18 });
  const trimMaterial = new THREE.MeshStandardMaterial({ color: 0x445154, roughness: 0.4, metalness: 0.35 });
  const glassMaterial = new THREE.MeshStandardMaterial({ color: 0x5f7c84, roughness: 0.18, metalness: 0.2 });
  const tyreMaterial = new THREE.MeshStandardMaterial({ color: 0x101516, roughness: 0.72, metalness: 0.05 });
  const hubMaterial = new THREE.MeshStandardMaterial({ color: 0xb8c4c2, roughness: 0.32, metalness: 0.62 });

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(chassisLength, trayWidth * 0.72, 0.12), chassisMaterial);
  chassis.position.set(chassisX, 0, -0.08);
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  group.add(chassis);

  const cab = new THREE.Mesh(new THREE.BoxGeometry(cabLength, cabWidth, 0.62), cabMaterial);
  cab.position.set(cabX, 0, 0.28);
  cab.castShadow = true;
  cab.receiveShadow = true;
  group.add(cab);

  const bonnet = new THREE.Mesh(new THREE.BoxGeometry(bonnetLength, cabWidth * 0.92, 0.32), cabMaterial);
  bonnet.position.set(bonnetX, 0, 0.16);
  bonnet.castShadow = true;
  bonnet.receiveShadow = true;
  group.add(bonnet);

  const windscreen = new THREE.Mesh(new THREE.BoxGeometry(0.045, cabWidth * 0.72, 0.28), glassMaterial);
  windscreen.position.set(cabX - cabLength * 0.28, 0, 0.56);
  windscreen.castShadow = true;
  group.add(windscreen);

  const trayApron = new THREE.Mesh(new THREE.BoxGeometry(trayLength, 0.08, 0.16), trimMaterial);
  for (const side of [-1, 1]) {
    const apron = trayApron.clone();
    apron.position.set(0, side * (trayWidth / 2 + 0.035), -0.01);
    apron.castShadow = true;
    group.add(apron);
  }

  const wheelXPositions = [
    bonnetX - bonnetLength * 0.12,
    trayStartX + trayLength * 0.28,
    trayEndX - trayLength * 0.18,
  ];
  for (const x of wheelXPositions) {
    for (const side of [-1, 1]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.16, 32), tyreMaterial);
      wheel.position.set(x, side * (trayWidth / 2 + 0.18), -0.13);
      wheel.castShadow = true;
      group.add(wheel);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.18, 20), hubMaterial);
      hub.position.copy(wheel.position);
      hub.castShadow = true;
      group.add(hub);
    }
  }

  if (plan.rack) {
    const rackLength = plan.rack.lengthMm * LOAD_PLAN_3D_SCALE;
    const rackStartX = trayStartX;
    const rackEndX = rackStartX + rackLength;
    const rackTopZ = loadPlanZoneBaseZ("rack") + 0.08;
    const rackY = trayWidth / 2;
    const mastMaterial = new THREE.MeshStandardMaterial({ color: 0x50676b, roughness: 0.42, metalness: 0.46 });
    const postXs = [
      rackStartX + Math.min(0.55, rackLength * 0.12),
      rackStartX + rackLength * 0.34,
      rackStartX + rackLength * 0.66,
      rackEndX - Math.min(0.55, rackLength * 0.12),
    ];
    for (const x of postXs) {
      const postBottom = x > trayEndX ? 0.18 : 0.08;
      for (const side of [-1, 1]) {
        const post = cylinderBetween(
          new THREE.Vector3(x, side * rackY, postBottom),
          new THREE.Vector3(x, side * rackY, rackTopZ),
          0.024,
          mastMaterial,
          14,
        );
        post.castShadow = true;
        group.add(post);
      }
    }
  }
}

function buildLoadPlanZone3d(group, loadZone, zone, tray = selectedLoadPlanTray()) {
  const THREE = three.module;
  const length = loadZone.lengthMm * LOAD_PLAN_3D_SCALE;
  const width = loadZone.widthMm * LOAD_PLAN_3D_SCALE;
  const offsetX = loadPlanZoneOffsetX(loadZone, zone, tray);
  const baseZ = loadPlanZoneBaseZ(zone);
  const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0x50676b, roughness: 0.5, metalness: 0.35 });

  if (zone === "tray") {
    const deckThickness = 0.09;
    const deckMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8e8e4,
      roughness: 0.62,
      metalness: 0.2,
    });
    const deck = new THREE.Mesh(new THREE.BoxGeometry(length, width, deckThickness), deckMaterial);
    deck.position.set(0, 0, baseZ - deckThickness * 0.5);
    deck.receiveShadow = true;
    deck.castShadow = true;
    group.add(deck);

    const railDepth = 0.16;
    for (const side of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.05, railDepth), edgeMaterial);
      rail.position.set(0, side * width * 0.5, baseZ + railDepth * 0.5);
      rail.castShadow = true;
      group.add(rail);
    }

    const headboard = new THREE.Mesh(new THREE.BoxGeometry(0.07, width + 0.12, 0.62), edgeMaterial);
    headboard.position.set(-length / 2 + 0.035, 0, baseZ + 0.31);
    headboard.castShadow = true;
    group.add(headboard);

    const tailBar = new THREE.Mesh(new THREE.BoxGeometry(0.07, width + 0.08, 0.18), edgeMaterial);
    tailBar.position.set(length / 2 - 0.035, 0, baseZ + 0.09);
    tailBar.castShadow = true;
    group.add(tailBar);
  } else {
    const railRadius = 0.035;
    const railY = width / 2;
    const railZ = baseZ + 0.08;
    const crossbarXs = [-length * 0.42, -length * 0.14, length * 0.14, length * 0.42];
    for (const side of [-1, 1]) {
      const start = new THREE.Vector3(offsetX - length / 2, side * railY, railZ);
      const end = new THREE.Vector3(offsetX + length / 2, side * railY, railZ);
      const rail = cylinderBetween(start, end, railRadius, edgeMaterial, 16);
      rail.castShadow = true;
      group.add(rail);
    }

    for (const x of crossbarXs) {
      const crossbar = cylinderBetween(
        new THREE.Vector3(offsetX + x, -railY, railZ + 0.012),
        new THREE.Vector3(offsetX + x, railY, railZ + 0.012),
        0.028,
        edgeMaterial,
        14,
      );
      crossbar.castShadow = true;
      group.add(crossbar);
    }
  }
}

function loadPlanAnimationProgress(placement, elapsed, playing) {
  if (!playing) return 1;
  return clampNumber((elapsed - placement.delay) / placement.duration, 0, 1);
}

function loadPlanAnimationOffset(placement, plan, progress) {
  if (progress >= 1) return new three.module.Vector3(0, 0, 0);
  const eased = 1 - Math.pow(1 - progress, 3);
  const trayLength = plan.tray.lengthMm * LOAD_PLAN_3D_SCALE;
  const trayWidth = plan.tray.widthMm * LOAD_PLAN_3D_SCALE;
  const side = placement.order % 2 ? -1 : 1;
  const lane = (placement.order - 1) % 4;
  const start = new three.module.Vector3(
    -trayLength * 0.58 - 0.72 - lane * 0.28,
    side * (trayWidth * 0.58 + 0.38 + lane * 0.14),
    0.46 + ((placement.order - 1) % 3) * 0.14,
  );
  const lift = Math.sin(progress * Math.PI) * 0.24;
  return start.multiplyScalar(1 - eased).add(new three.module.Vector3(0, 0, lift));
}

function buildLoadPlanSpool3d(group, plan, placement, elapsed = 0, playing = false) {
  const THREE = three.module;
  const loadZone = placement.zone === "rack" ? plan.rack : plan.tray;
  if (!loadZone) return;
  const progress = loadPlanAnimationProgress(placement, elapsed, playing);
  if (playing && progress <= 0) return;
  const spoolGroup = new THREE.Group();
  spoolGroup.position.copy(loadPlanAnimationOffset(placement, plan, progress));
  const drawPlacement = loadPlanSettledPlacement(plan, placement, loadZone);
  const pipeMaterial = new THREE.MeshStandardMaterial({
    color: 0x202524,
    metalness: 0.55,
    roughness: 0.34,
  });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x0b1112, metalness: 0.42, roughness: 0.5 });
  const zBase = loadPlanZoneBaseZ(placement.zone) + loadPlanLayerHeightMm(placement) * LOAD_PLAN_3D_SCALE + 0.08;
  const center = loadPlanPlacementCenter3d(drawPlacement, loadZone, zBase - 0.025, plan.tray);
  buildLoadPlanDunnage3d(spoolGroup, loadZone, drawPlacement, zBase, plan.tray);

  for (const segment of loadPlanVisibleSegments(drawPlacement)) {
    const from = loadPlanTransformPoint(segment.from, drawPlacement.footprint, drawPlacement.rotation);
    const to = loadPlanTransformPoint(segment.to, drawPlacement.footprint, drawPlacement.rotation);
    const start = loadPlanPoint3d(drawPlacement, loadZone, from, zBase, plan.tray);
    const end = loadPlanPoint3d(drawPlacement, loadZone, to, zBase, plan.tray);
    const radius = clampNumber(segment.od * LOAD_PLAN_3D_SCALE * 0.5, 0.018, 0.18);
    const shadowPipe = cylinderBetween(
      start.clone().add(new THREE.Vector3(0.035, -0.035, -0.035)),
      end.clone().add(new THREE.Vector3(0.035, -0.035, -0.035)),
      radius * 1.08,
      darkMaterial,
      18,
    );
    shadowPipe.castShadow = true;
    spoolGroup.add(shadowPipe);

    const pipe = cylinderBetween(start, end, radius, pipeMaterial, 28);
    pipe.castShadow = true;
    pipe.receiveShadow = true;
    spoolGroup.add(pipe);
  }

  for (const node of loadPlanPlacementNodePoints(drawPlacement)) {
    const point = loadPlanPoint3d(drawPlacement, loadZone, node.point, zBase, plan.tray);
    const radius = clampNumber(node.od * LOAD_PLAN_3D_SCALE * 0.43, 0.014, 0.13);
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: node.count >= 3 ? 0xf2f6f5 : 0x202524,
      metalness: 0.5,
      roughness: 0.34,
    });
    const marker = new THREE.Mesh(new THREE.SphereGeometry(radius, 18, 12), nodeMaterial);
    marker.position.copy(point);
    marker.castShadow = true;
    marker.receiveShadow = true;
    spoolGroup.add(marker);
  }

  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 18, 12),
    new THREE.MeshStandardMaterial({ color: loadPlanSpoolColor(placement.order - 1), roughness: 0.28, metalness: 0.2 }),
  );
  marker.position.copy(center).add(new THREE.Vector3(-drawPlacement.widthMm * LOAD_PLAN_3D_SCALE * 0.5, -drawPlacement.heightMm * LOAD_PLAN_3D_SCALE * 0.5, 0.16));
  marker.castShadow = true;
  spoolGroup.add(marker);
  group.add(spoolGroup);
}

function loadPlanSettledPlacement(plan, placement, loadZone) {
  const layer = placement.layer ?? 0;
  if (layer <= 0 || placement.zone !== "tray") return placement;

  const supports = plan.placements.filter((candidate) => {
    if (candidate.zone !== placement.zone || (candidate.layer ?? 0) !== layer - 1) return false;
    const firstRight = placement.x + placement.widthMm;
    const secondRight = candidate.x + candidate.widthMm;
    return Math.min(firstRight, secondRight) - Math.max(placement.x, candidate.x) > Math.min(placement.widthMm, candidate.widthMm) * 0.18;
  });
  if (!supports.length) return placement;

  const supportCenters = supports
    .map((support) => support.y + support.heightMm / 2)
    .sort((first, second) => first - second);
  const targetCenter = supportCenters.length >= 2
    ? (supportCenters[0] + supportCenters[supportCenters.length - 1]) / 2
    : supportCenters[0];
  const targetY = clampNumber(targetCenter - placement.heightMm / 2, 0, loadZone.widthMm - placement.heightMm);
  const settledY = placement.y + (targetY - placement.y) * 0.65;
  return { ...placement, y: settledY, settled: Math.abs(settledY - placement.y) > 1 };
}

function loadPlanVisibleSegments(placement) {
  const segments = placement.footprint.segments ?? [];
  if (segments.length <= LOAD_PLAN_VISIBLE_SEGMENT_LIMIT) return segments;
  return [...segments]
    .sort((first, second) => {
      const firstLength = pointDistance2d(first.from, first.to);
      const secondLength = pointDistance2d(second.from, second.to);
      return secondLength - firstLength;
    })
    .slice(0, LOAD_PLAN_VISIBLE_SEGMENT_LIMIT);
}

function loadPlanPlacementNodePoints(placement) {
  const nodes = new Map();
  for (const segment of loadPlanVisibleSegments(placement)) {
    for (const point of [segment.from, segment.to]) {
      const transformed = loadPlanTransformPoint(point, placement.footprint, placement.rotation);
      const key = `${Math.round(transformed.x)}:${Math.round(transformed.y)}`;
      const existing = nodes.get(key);
      nodes.set(key, {
        point: transformed,
        od: Math.max(existing?.od ?? 0, segment.od ?? 50),
        count: (existing?.count ?? 0) + 1,
      });
    }
  }
  return [...nodes.values()];
}

function buildLoadPlanDunnage3d(group, loadZone, placement, zBase, tray = selectedLoadPlanTray()) {
  const THREE = three.module;
  const timberMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a6a48,
    roughness: 0.78,
    metalness: 0.02,
  });
  const timberWidth = LOAD_PLAN_TIMBER_WIDTH_MM * LOAD_PLAN_3D_SCALE;
  const timberHeight = LOAD_PLAN_TIMBER_THICKNESS_MM * LOAD_PLAN_3D_SCALE * 0.62;
  const yLength = Math.min(loadZone.widthMm, Math.max(placement.heightMm, 520)) * LOAD_PLAN_3D_SCALE;
  const timberZ = zBase - timberHeight * 0.86;
  const supportCount = placement.widthMm > 3600 ? 3 : 2;
  const xPositions = Array.from({ length: supportCount }, (_, index) => {
    const fraction = supportCount === 2 ? 0.28 + index * 0.44 : 0.18 + index * 0.32;
    return placement.x + placement.widthMm * fraction;
  });

  for (const xMm of xPositions) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(timberWidth, yLength, timberHeight), timberMaterial);
    beam.position.copy(loadPlanPoint3d({ ...placement, x: xMm, y: placement.y + placement.heightMm / 2 }, loadZone, { x: 0, y: 0 }, timberZ, tray));
    beam.castShadow = true;
    beam.receiveShadow = true;
    group.add(beam);
  }
}

function loadPlanZoneBaseZ(zone) {
  return zone === "rack" ? 1.65 : 0.08;
}

function loadPlanZoneOffsetX(loadZone, zone, tray = selectedLoadPlanTray()) {
  if (zone !== "rack") return 0;
  return ((loadZone.lengthMm - tray.lengthMm) / 2) * LOAD_PLAN_3D_SCALE;
}

function loadPlanPoint3d(placement, loadZone, point, z, tray = selectedLoadPlanTray()) {
  const zone = placement.zone ?? "tray";
  const x = (placement.x + point.x - loadZone.lengthMm / 2) * LOAD_PLAN_3D_SCALE + loadPlanZoneOffsetX(loadZone, zone, tray);
  const y = (placement.y + point.y - loadZone.widthMm / 2) * LOAD_PLAN_3D_SCALE;
  return new three.module.Vector3(x, y, z);
}

function loadPlanPlacementCenter3d(placement, loadZone, z, tray = selectedLoadPlanTray()) {
  const zone = placement.zone ?? "tray";
  return new three.module.Vector3(
    (placement.x + placement.widthMm / 2 - loadZone.lengthMm / 2) * LOAD_PLAN_3D_SCALE + loadPlanZoneOffsetX(loadZone, zone, tray),
    (placement.y + placement.heightMm / 2 - loadZone.widthMm / 2) * LOAD_PLAN_3D_SCALE,
    z,
  );
}

function frameLoadPlanThreeCamera() {
  if (!loadPlanThree.ready || !loadPlanThree.group) return;
  const THREE = three.module;
  const box = new THREE.Box3().setFromObject(loadPlanThree.group);
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  box.getCenter(center);
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z, 2.5);
  loadPlanThree.bounds = { center, size };
  if (loadPlanThree.controls) {
    loadPlanThree.controls.target.copy(center);
  }
  loadPlanThree.camera.position.set(center.x + maxDim * 0.72, center.y - maxDim * 1.55, center.z + maxDim * 0.42);
  loadPlanThree.camera.near = 0.03;
  loadPlanThree.camera.far = Math.max(100, maxDim * 8);
  loadPlanThree.camera.updateProjectionMatrix();
  loadPlanThree.camera.lookAt(center);
  loadPlanThree.controls?.update();
}

function resetLoadPlanThreeView() {
  if (!ensureLoadPlanThree()) {
    renderLoadPlan(currentLoadPlan);
    return;
  }
  setLoadPlanSpin(false);
  if (loadPlanThree.group) loadPlanThree.group.rotation.set(0, 0, 0);
  frameLoadPlanThreeCamera();
}

function setLoadPlanSpin(active) {
  loadPlanThree.spinning = Boolean(active);
  if (loadPlanThree.controls) loadPlanThree.controls.autoRotate = loadPlanThree.spinning;
  loadPlanSpinButton?.classList.toggle("active", loadPlanThree.spinning);
  loadPlanSpinButton?.setAttribute("aria-pressed", String(loadPlanThree.spinning));
  updateLoadPlanViewControls();
}

function loadPlanZoneTitle(zone) {
  return zone === "rack" ? "Roof racks" : "Truck tray";
}

function loadPlanLayerGroups(plan, tray, rack = null) {
  const placements = plan?.placements ?? [];
  const groups = [];
  const addZone = (zone, loadZone) => {
    if (!loadZone) return;
    const zonePlacements = placements.filter((placement) => placement.zone === zone);
    const layers = [...new Set(zonePlacements.map((placement) => placement.layer ?? 0))]
      .sort((first, second) => first - second);
    for (const layer of layers) {
      groups.push({
        zone,
        loadZone,
        layer,
        placements: zonePlacements
          .filter((placement) => (placement.layer ?? 0) === layer)
          .sort((first, second) => first.x - second.x || first.y - second.y || first.order - second.order),
      });
    }
  };

  addZone("rack", rack);
  addZone("tray", tray);

  if (!groups.length && (plan?.rejected?.length || !placements.length)) {
    if (rack) groups.push({ zone: "rack", loadZone: rack, layer: 0, placements: [] });
    groups.push({ zone: "tray", loadZone: tray, layer: 0, placements: [] });
  }

  return groups;
}

function loadPlanTopViewTiles(width, height, groups, hasRejected = false) {
  const margin = Math.max(16, Math.min(30, width * 0.035));
  const headerHeight = 42;
  const footerHeight = hasRejected ? 72 : 34;
  const gap = 14;
  const count = Math.max(groups.length, 1);
  const columns = width >= 780 && count > 2 ? 2 : 1;
  const rows = Math.ceil(count / columns);
  const tileWidth = (width - margin * 2 - gap * (columns - 1)) / columns;
  const tileHeight = Math.max(78, (height - headerHeight - footerHeight - margin - gap * (rows - 1)) / rows);

  return groups.map((group, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      group,
      x: margin + column * (tileWidth + gap),
      y: headerHeight + row * (tileHeight + gap),
      width: tileWidth,
      height: tileHeight,
    };
  });
}

function loadPlanFitText(ctx, text, maxWidth) {
  const value = String(text ?? "");
  if (ctx.measureText(value).width <= maxWidth) return value;
  let trimmed = value;
  while (trimmed.length > 4 && ctx.measureText(`${trimmed}...`).width > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return `${trimmed}...`;
}

function loadPlanShortName(item) {
  const info = item?.projectInfo ?? {};
  const parts = [info.jobNumber, info.spoolNumber].map((part) => String(part ?? "").trim()).filter(Boolean);
  return parts.length ? parts.join(" ") : truncateLoadPlanName(item?.name ?? "Spool", 18);
}

function drawLoadPlanDirectionArrow(ctx, start, end, color) {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const head = 7;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  drawLine(ctx, start, end);
  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(end.x - Math.cos(angle - 0.58) * head, end.y - Math.sin(angle - 0.58) * head);
  ctx.lineTo(end.x - Math.cos(angle + 0.58) * head, end.y - Math.sin(angle + 0.58) * head);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawLoadPlanTopViewTile(ctx, tile) {
  const { group } = tile;
  const { loadZone } = group;
  const isRack = group.zone === "rack";
  const pad = 14;
  const titleY = tile.y + 18;
  const planX = tile.x + pad;
  const planY = tile.y + 34;
  const planMaxWidth = tile.width - pad * 2;
  const planMaxHeight = Math.max(48, tile.height - 48);
  const scaleX = planMaxWidth / loadZone.lengthMm;
  const scaleY = planMaxHeight / loadZone.widthMm;
  const zoneWidth = loadZone.lengthMm * scaleX;
  const zoneHeight = loadZone.widthMm * scaleY;
  const zoneX = tile.x + (tile.width - zoneWidth) / 2;
  const zoneY = planY + (planMaxHeight - zoneHeight) / 2;

  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "rgba(31, 42, 47, 0.14)";
  ctx.lineWidth = 1;
  roundRect(ctx, tile.x, tile.y, tile.width, tile.height, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#17282c";
  ctx.font = "950 13px Arial, sans-serif";
  ctx.textAlign = "left";
  const layerText = `${loadPlanZoneTitle(group.zone)} - Layer ${group.layer + 1}`;
  ctx.fillText(layerText, tile.x + pad, titleY);
  ctx.textAlign = "right";
  ctx.fillStyle = "#607176";
  ctx.font = "850 11px Arial, sans-serif";
  ctx.fillText(`${formatLength(loadZone.lengthMm)} x ${formatLength(loadZone.widthMm)} mm`, tile.x + tile.width - pad, titleY);

  ctx.fillStyle = isRack ? "#eef5f6" : "#eef7f3";
  ctx.strokeStyle = isRack ? "#789096" : "#5f8583";
  ctx.lineWidth = 2;
  roundRect(ctx, zoneX, zoneY, zoneWidth, zoneHeight, 4);
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.rect(zoneX, zoneY, zoneWidth, zoneHeight);
  ctx.clip();
  ctx.strokeStyle = "rgba(96, 113, 118, 0.18)";
  ctx.lineWidth = 1;
  for (let x = 1000; x < loadZone.lengthMm; x += 1000) {
    const sx = zoneX + x * scaleX;
    drawLine(ctx, { x: sx, y: zoneY }, { x: sx, y: zoneY + zoneHeight });
  }
  for (let y = 500; y < loadZone.widthMm; y += 500) {
    const sy = zoneY + y * scaleY;
    drawLine(ctx, { x: zoneX, y: sy }, { x: zoneX + zoneWidth, y: sy });
  }
  ctx.restore();

  if (isRack) {
    ctx.strokeStyle = "rgba(23, 40, 44, 0.32)";
    ctx.lineWidth = 3;
    for (const yFraction of [0.28, 0.72]) {
      const railY = zoneY + zoneHeight * yFraction;
      drawLine(ctx, { x: zoneX, y: railY }, { x: zoneX + zoneWidth, y: railY });
    }
  }

  for (const placement of group.placements) {
    drawLoadPlanTopViewPlacement(ctx, placement, zoneX, zoneY, scaleX, scaleY);
  }

  if (!group.placements.length) {
    ctx.fillStyle = "#6b7b80";
    ctx.font = "900 12px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No spools on this layer", zoneX + zoneWidth / 2, zoneY + zoneHeight / 2 + 4);
  }

  ctx.restore();
}

function drawLoadPlanTopViewPlacement(ctx, placement, zoneX, zoneY, scaleX, scaleY) {
  const x = zoneX + placement.x * scaleX;
  const y = zoneY + placement.y * scaleY;
  const width = Math.max(8, placement.widthMm * scaleX);
  const height = Math.max(8, placement.heightMm * scaleY);
  const pipeScale = Math.sqrt(scaleX * scaleY);
  const color = loadPlanSpoolColor(placement.order - 1);
  const label = `#${placement.order} ${loadPlanShortName(placement.item)}`;
  const detail = `${placement.item.pipeSizesLabel} / ${formatMass(placement.item.weightKg)} kg`;

  ctx.save();
  ctx.globalAlpha = 0.32;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.3;
  ctx.setLineDash([5, 5]);
  roundRect(ctx, x, y, width, height, 6);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  for (const segment of placement.footprint.segments ?? []) {
    const from = loadPlanTransformPoint(segment.from, placement.footprint, placement.rotation);
    const to = loadPlanTransformPoint(segment.to, placement.footprint, placement.rotation);
    const start = {
      x: zoneX + (placement.x + from.x) * scaleX,
      y: zoneY + (placement.y + from.y) * scaleY,
    };
    const end = {
      x: zoneX + (placement.x + to.x) * scaleX,
      y: zoneY + (placement.y + to.y) * scaleY,
    };
    const pipeWidth = clampNumber(segment.od * pipeScale * 0.72, 3.2, 13);
    ctx.lineCap = "butt";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(18, 32, 36, 0.34)";
    ctx.lineWidth = pipeWidth + 3;
    drawLine(ctx, { x: start.x + 2, y: start.y + 3 }, { x: end.x + 2, y: end.y + 3 });
    ctx.strokeStyle = "#122024";
    ctx.lineWidth = pipeWidth + 1.5;
    drawLine(ctx, start, end);
    ctx.strokeStyle = color;
    ctx.lineWidth = pipeWidth;
    drawLine(ctx, start, end);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.54)";
    ctx.lineWidth = Math.max(1.2, pipeWidth * 0.18);
    drawLine(ctx, { x: start.x, y: start.y - pipeWidth * 0.16 }, { x: end.x, y: end.y - pipeWidth * 0.16 });

    if (pointDistance2d(start, end) < 2) {
      ctx.fillStyle = color;
      ctx.strokeStyle = "#122024";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(start.x, start.y, Math.max(4, pipeWidth * 0.65), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  for (const node of loadPlanPlacementNodePoints(placement)) {
    const point = {
      x: zoneX + (placement.x + node.point.x) * scaleX,
      y: zoneY + (placement.y + node.point.y) * scaleY,
    };
    const radius = clampNumber(node.od * pipeScale * 0.36, 2.4, 7.5);
    ctx.fillStyle = node.count >= 3 ? "#ffffff" : color;
    ctx.strokeStyle = node.count >= 3 ? "#122024" : "rgba(18, 32, 36, 0.82)";
    ctx.lineWidth = node.count >= 3 ? 2.2 : 1.4;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  const arrowColor = "rgba(18, 32, 36, 0.82)";
  if (width >= height) {
    const arrowY = height >= 42 ? y + height - 11 : y + height / 2;
    drawLoadPlanDirectionArrow(ctx, { x: x + 10, y: arrowY }, { x: x + width - 10, y: arrowY }, arrowColor);
  } else {
    const arrowX = width >= 56 ? x + width - 11 : x + width / 2;
    drawLoadPlanDirectionArrow(ctx, { x: arrowX, y: y + 10 }, { x: arrowX, y: y + height - 10 }, arrowColor);
  }

  ctx.fillStyle = "#122024";
  ctx.font = "950 12px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const labelPadding = 6;
  const labelMax = Math.max(18, Math.min(260, width - labelPadding * 2));
  const cardWidth = Math.min(width - 4, Math.max(58, ctx.measureText(label).width + 12));
  const cardHeight = height >= 48 ? 34 : 20;
  const cardX = x + 3;
  const cardY = y + 3;
  if (width >= 64 && height >= 28) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 5);
    ctx.fill();
    ctx.strokeStyle = "rgba(18, 32, 36, 0.16)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#122024";
    ctx.fillText(loadPlanFitText(ctx, label, labelMax), cardX + labelPadding, cardY + 4);
    if (height >= 48) {
      ctx.font = "850 10px Arial, sans-serif";
      ctx.fillStyle = "#35474c";
      ctx.fillText(loadPlanFitText(ctx, detail, labelMax), cardX + labelPadding, cardY + 19);
    }
  } else {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`#${placement.order}`, x + width / 2, y + height / 2);
  }

  ctx.restore();
}

function loadPlanProjectIsoPoint(projector, xMm, yMm, zMm = 0) {
  return {
    x: projector.originX + (xMm + yMm * projector.skewX) * projector.scale,
    y: projector.originY + yMm * projector.skewY * projector.scale - zMm * projector.zLift * projector.scale,
  };
}

function drawLoadPlanIsoDeck(ctx, projector, loadZone, zone) {
  const corners = [
    loadPlanProjectIsoPoint(projector, 0, 0, 0),
    loadPlanProjectIsoPoint(projector, loadZone.lengthMm, 0, 0),
    loadPlanProjectIsoPoint(projector, loadZone.lengthMm, loadZone.widthMm, 0),
    loadPlanProjectIsoPoint(projector, 0, loadZone.widthMm, 0),
  ];
  ctx.save();
  ctx.fillStyle = zone === "rack" ? "#eef5f6" : "#edf6f2";
  ctx.strokeStyle = zone === "rack" ? "#789096" : "#5f8583";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);
  for (const corner of corners.slice(1)) ctx.lineTo(corner.x, corner.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(96, 113, 118, 0.18)";
  ctx.lineWidth = 1;
  for (let x = 1000; x < loadZone.lengthMm; x += 1000) {
    drawLine(ctx, loadPlanProjectIsoPoint(projector, x, 0, 0), loadPlanProjectIsoPoint(projector, x, loadZone.widthMm, 0));
  }
  for (let y = 500; y < loadZone.widthMm; y += 500) {
    drawLine(ctx, loadPlanProjectIsoPoint(projector, 0, y, 0), loadPlanProjectIsoPoint(projector, loadZone.lengthMm, y, 0));
  }

  if (zone === "rack") {
    ctx.strokeStyle = "rgba(23, 40, 44, 0.34)";
    ctx.lineWidth = 3;
    for (const yFraction of [0.28, 0.72]) {
      drawLine(
        ctx,
        loadPlanProjectIsoPoint(projector, 0, loadZone.widthMm * yFraction, 65),
        loadPlanProjectIsoPoint(projector, loadZone.lengthMm, loadZone.widthMm * yFraction, 65),
      );
    }
  }
  ctx.restore();
}

function drawLoadPlanIsoSpool(ctx, placement, projector) {
  const color = loadPlanSpoolColor(placement.order - 1);
  const zMm = (placement.layer ?? 0) * LOAD_PLAN_LAYER_RISE_MM + Math.max(40, placement.footprint.maxPipeOdMm * 0.5);
  const center = loadPlanProjectIsoPoint(
    projector,
    placement.x + placement.widthMm / 2,
    placement.y + placement.heightMm / 2,
    zMm + 70,
  );

  ctx.save();
  for (const segment of placement.footprint.segments ?? []) {
    const from = loadPlanTransformPoint(segment.from, placement.footprint, placement.rotation);
    const to = loadPlanTransformPoint(segment.to, placement.footprint, placement.rotation);
    const start = loadPlanProjectIsoPoint(projector, placement.x + from.x, placement.y + from.y, zMm);
    const end = loadPlanProjectIsoPoint(projector, placement.x + to.x, placement.y + to.y, zMm);
    const pipeWidth = clampNumber(segment.od * projector.scale * 0.58, 2.4, 9.5);

    ctx.lineCap = "butt";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(18, 32, 36, 0.26)";
    ctx.lineWidth = pipeWidth + 3;
    drawLine(ctx, { x: start.x + 2, y: start.y + 4 }, { x: end.x + 2, y: end.y + 4 });
    ctx.strokeStyle = "#102328";
    ctx.lineWidth = pipeWidth + 1.3;
    drawLine(ctx, start, end);
    ctx.strokeStyle = color;
    ctx.lineWidth = pipeWidth;
    drawLine(ctx, start, end);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = Math.max(1, pipeWidth * 0.18);
    drawLine(ctx, { x: start.x, y: start.y - pipeWidth * 0.18 }, { x: end.x, y: end.y - pipeWidth * 0.18 });
  }

  for (const node of loadPlanPlacementNodePoints(placement)) {
    const point = loadPlanProjectIsoPoint(projector, placement.x + node.point.x, placement.y + node.point.y, zMm);
    const radius = clampNumber(node.od * projector.scale * 0.28, 2.2, 6.5);
    ctx.fillStyle = node.count >= 3 ? "#ffffff" : color;
    ctx.strokeStyle = "#102328";
    ctx.lineWidth = node.count >= 3 ? 2 : 1.2;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(center.x, center.y, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#122024";
  ctx.font = "950 10px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(placement.order), center.x, center.y + 0.5);
  ctx.restore();
}

function drawLoadPlanIsoZone(ctx, zonePlacements, loadZone, zone, area) {
  const maxLayer = zonePlacements.reduce((max, placement) => Math.max(max, placement.layer ?? 0), 0);
  const maxZ = Math.max(260, maxLayer * LOAD_PLAN_LAYER_RISE_MM + 260);
  const skewX = 0.38;
  const skewY = 0.24;
  const zLift = 0.56;
  const projectedWidthMm = loadZone.lengthMm + loadZone.widthMm * skewX;
  const projectedHeightMm = loadZone.widthMm * skewY + maxZ * zLift;
  const scale = Math.min(
    (area.width - 28) / projectedWidthMm,
    Math.max(1, area.height - 42) / projectedHeightMm,
  );
  const projector = {
    scale,
    skewX,
    skewY,
    zLift,
    originX: area.x + (area.width - projectedWidthMm * scale) / 2,
    originY: area.y + 30 + maxZ * zLift * scale,
  };

  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "rgba(31, 42, 47, 0.14)";
  ctx.lineWidth = 1;
  roundRect(ctx, area.x, area.y, area.width, area.height, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#17282c";
  ctx.font = "950 13px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`${loadPlanZoneTitle(zone)} 3D guide`, area.x + 12, area.y + 19);
  ctx.textAlign = "right";
  ctx.fillStyle = "#607176";
  ctx.font = "850 11px Arial, sans-serif";
  ctx.fillText("order dots match top view", area.x + area.width - 12, area.y + 19);

  drawLoadPlanIsoDeck(ctx, projector, loadZone, zone);
  const sorted = [...zonePlacements].sort((first, second) => {
    if ((first.layer ?? 0) !== (second.layer ?? 0)) return (first.layer ?? 0) - (second.layer ?? 0);
    return first.y - second.y || first.x - second.x || first.order - second.order;
  });
  for (const placement of sorted) {
    drawLoadPlanIsoSpool(ctx, placement, projector);
  }

  if (!zonePlacements.length) {
    ctx.fillStyle = "#6b7b80";
    ctx.font = "900 12px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No spools here", area.x + area.width / 2, area.y + area.height / 2);
  }
  ctx.restore();
}

function drawLoadPlanIsoModel(ctx, plan, area) {
  const placements = plan?.placements ?? [];
  const zones = [];
  if (plan?.rack && placements.some((placement) => placement.zone === "rack")) {
    zones.push({ zone: "rack", loadZone: plan.rack });
  }
  if (placements.some((placement) => placement.zone === "tray") || !zones.length) {
    zones.push({ zone: "tray", loadZone: plan?.tray ?? selectedLoadPlanTray() });
  }

  const gap = 10;
  const zoneHeight = Math.max(86, (area.height - gap * (zones.length - 1)) / zones.length);
  for (const [index, zoneData] of zones.entries()) {
    const zoneArea = {
      x: area.x,
      y: area.y + index * (zoneHeight + gap),
      width: area.width,
      height: zoneHeight,
    };
    drawLoadPlanIsoZone(
      ctx,
      placements.filter((placement) => placement.zone === zoneData.zone),
      zoneData.loadZone,
      zoneData.zone,
      zoneArea,
    );
  }
}

function drawLoadPlanRejected(ctx, plan, tiles, width, height) {
  if (!plan.rejected.length) return;
  const x = Math.max(16, Math.min(...tiles.map((tile) => tile.x)));
  const right = Math.min(width - 16, Math.max(...tiles.map((tile) => tile.x + tile.width)));
  const y = height - 58;
  ctx.save();
  ctx.fillStyle = "#fff5f3";
  ctx.strokeStyle = "rgba(180, 35, 24, 0.35)";
  roundRect(ctx, x, y, right - x, 38, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#9f2d20";
  ctx.font = "900 11px Arial, sans-serif";
  ctx.textAlign = "left";
  const loadZones = plan.rack ? "tray or roof racks" : "tray";
  ctx.fillText(loadPlanFitText(ctx, `Does not fit ${loadZones}: ${plan.rejected.map((item) => item.name).join(", ")}`, right - x - 20), x + 10, y + 24);
  ctx.restore();
}

function loadPlanSpoolColor(index) {
  const colors = ["#0f6b73", "#b55532", "#6b5aa8", "#2f7d4f", "#9b4c72", "#4f6d7a"];
  return colors[index % colors.length];
}

function loadPlanLayerHeightMm(placement) {
  return (placement.layer ?? 0) * Math.max(
    LOAD_PLAN_LAYER_RISE_MM,
    Math.min(900, placement.footprint.verticalMm * 0.55 + placement.footprint.maxPipeOdMm * 1.5),
  );
}

function pointDistance2d(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function drawTruckLoadPlan(plan, elapsed = 0, playing = false) {
  if (!loadPlanCanvas) return;
  const { ctx, width, height } = resizeCanvas(loadPlanCanvas);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f8fbfa";
  ctx.fillRect(0, 0, width, height);

  const tray = plan?.tray ?? selectedLoadPlanTray();
  const rack = plan?.rack ?? selectedLoadPlanRack();

  if (!plan?.placements.length && !plan?.rejected.length) {
    ctx.fillStyle = "#17282c";
    ctx.font = "950 16px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Select spools to make a yard load layout", width / 2, height / 2);
    return;
  }

  const groups = loadPlanLayerGroups(plan, tray, rack);
  const margin = Math.max(14, Math.min(24, width * 0.03));
  const footerReserve = plan.rejected.length ? 68 : 30;
  const sideBySide = width >= 780;
  const topArea = sideBySide
    ? {
      x: margin,
      y: 36,
      width: Math.max(310, width * 0.56 - margin * 1.4),
      height: Math.max(190, height - 36 - footerReserve),
    }
    : {
      x: margin,
      y: 36,
      width: width - margin * 2,
      height: Math.max(150, (height - 36 - footerReserve) * 0.55),
    };
  const modelArea = sideBySide
    ? {
      x: topArea.x + topArea.width + 12,
      y: topArea.y,
      width: Math.max(220, width - (topArea.x + topArea.width + 12) - margin),
      height: topArea.height,
    }
    : {
      x: margin,
      y: topArea.y + topArea.height + 10,
      width: width - margin * 2,
      height: Math.max(118, height - (topArea.y + topArea.height + 10) - footerReserve),
    };
  const tiles = loadPlanTopViewTiles(topArea.width, topArea.height, groups, false)
    .map((tile) => ({
      ...tile,
      x: tile.x + topArea.x,
      y: tile.y + topArea.y,
    }));

  ctx.save();
  ctx.fillStyle = "#17282c";
  ctx.font = "950 15px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Top-view load layout", topArea.x, 24);
  ctx.textAlign = "right";
  ctx.fillStyle = "#607176";
  ctx.font = "850 11px Arial, sans-serif";
  ctx.fillText("3D guide shows loading height", modelArea.x + modelArea.width, 24);
  ctx.restore();

  for (const tile of tiles) {
    drawLoadPlanTopViewTile(ctx, tile);
  }
  drawLoadPlanIsoModel(ctx, plan, modelArea);
  drawLoadPlanRejected(ctx, plan, tiles, width, height);

  ctx.save();
  ctx.fillStyle = "#5b6b70";
  ctx.font = "850 11px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Use this as a basic yard guide only. Check the real tray, overhang and tie-downs before loading.", Math.max(16, tiles[0]?.x ?? 20), height - 14);
  ctx.restore();
}

function truncateLoadPlanName(value, maxLength) {
  const text = String(value ?? "").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

function updateLoadPlanSummary(plan) {
  if (!loadPlanSummary) return;
  if (!plan?.placements.length && !plan?.rejected.length) {
    loadPlanSummary.textContent = "Select spools, then press Make layout.";
    return;
  }

  const tray = plan.tray;
  const fitted = `${plan.placements.length}/${plan.placements.length + plan.rejected.length} fit`;
  const trayHasLoad = plan.placements.some((placement) => placement.zone === "tray");
  const rackHasLoad = plan.placements.some((placement) => placement.zone === "rack");
  const usedParts = [];
  const unusedParts = [];
  if (trayHasLoad) usedParts.push(`${formatLength(plan.usedLengthMm)} of ${formatLength(tray.lengthMm)} mm tray`);
  else unusedParts.push("tray unused");
  if (plan.rack && rackHasLoad) usedParts.push(`${formatLength(plan.rackUsedLengthMm)} of ${formatLength(plan.rack.lengthMm)} mm roof racks`);
  else if (plan.rack) unusedParts.push("roof racks unused");
  const used = plan.placements.length
    ? `using ${usedParts.join(" and ")}${unusedParts.length ? `; ${unusedParts.join(", ")}` : ""}`
    : plan.rack ? "no spool fits inside this tray or roof-rack footprint" : "no spool fits inside this tray footprint";
  const order = plan.placements
    .map((placement) => {
      const where = placement.zone === "rack" ? "roof racks" : "tray";
      const layer = placement.layer ? ` layer ${placement.layer + 1}` : "";
      const lay = placement.footprint?.label ? ` ${placement.footprint.label}` : "";
      return `${placement.order}. ${placement.item.name} on ${where}${layer}${lay}${placement.rotation ? ` rotated ${placement.rotation} deg` : ""}`;
    })
    .join("  ");
  const rejected = plan.rejected.length ? ` Not fitting: ${plan.rejected.map((item) => item.name).join(", ")}.` : "";
  loadPlanSummary.textContent = `${tray.label}: ${fitted}, ${used}. Load order: ${order}.${rejected} Basic yard guide only - check the real tray, overhang and tie-down points before loading.`;
}

function playTruckLoadAnimation() {
  const items = selectedLoadPlanItems();
  if (!items.length) {
    currentLoadPlan = createTruckLoadPlan([]);
    renderLoadPlan(currentLoadPlan);
    if (loadPlanSummary) {
      loadPlanSummary.textContent = "Tick one or more spools on the left, then press Make layout.";
    }
    return;
  }

  const plan = createTruckLoadPlan(items);
  currentLoadPlan = plan;
  if (!plan) {
    drawLoadPlanEmpty();
    return;
  }

  updateLoadPlanSummary(plan);
  startTruckLoadAnimation(plan);
}

function startTruckLoadAnimation(plan) {
  if (!plan) return;
  if (loadPlanAnimationFrame) {
    cancelAnimationFrame(loadPlanAnimationFrame);
    loadPlanAnimationFrame = 0;
  }

  loadPlanViewMode = "model";
  setLoadPlanSpin(false);
  updateLoadPlanViewControls();
  const startTime = performance.now();
  const duration = Math.max(900, plan.totalDuration + 360);

  const tick = (now) => {
    const elapsed = now - startTime;
    renderLoadPlan(plan, elapsed, true);
    if (elapsed < duration) {
      loadPlanAnimationFrame = requestAnimationFrame(tick);
      return;
    }
    loadPlanAnimationFrame = 0;
    renderLoadPlan(plan, duration, false);
  };

  loadPlanAnimationFrame = requestAnimationFrame(tick);
}

function redrawLoadPlanIfOpen() {
  if (!loadPlanDialog || loadPlanDialog.hidden) return;
  if (currentLoadPlan) {
    renderLoadPlan(currentLoadPlan);
  } else {
    renderLoadPlanProjectChoices();
  }
}

async function startNewDrawing() {
  if (hasDrawingContent()) {
    const choice = await openNewDrawingDialog();
    if (choice === "cancel") return;
    if (choice === "save") {
      const saved = await saveBrowserProject({ silent: true });
      if (!saved) return;
    }
  }

  state = blankState();
  nextFittingId = 1;
  nextNoteId = 1;
  three.userMovedCamera = false;
  updateControls();
  updateAll({ save: false });
  await promptForProjectDetails({ force: true });
}

function openNewDrawingDialog() {
  if (!newDrawingDialog || !newDrawingCancelButton || !newDrawingDiscardButton || !newDrawingSaveButton) {
    const saveFirst = window.confirm("Save this drawing before starting a new one?");
    return Promise.resolve(saveFirst ? "save" : "discard");
  }

  if (newDrawingDialogResolver) {
    newDrawingDialogResolver("cancel");
    newDrawingDialogResolver = null;
  }

  newDrawingDialog.hidden = false;
  newDrawingCancelButton.focus();
  return new Promise((resolve) => {
    newDrawingDialogResolver = resolve;
  });
}

function closeNewDrawingDialog(choice = "cancel") {
  if (newDrawingDialog) newDrawingDialog.hidden = true;
  const resolve = newDrawingDialogResolver;
  newDrawingDialogResolver = null;
  if (resolve) resolve(choice);
}

async function promptForProjectDetails(options = {}) {
  if (!options.force && (state.projectInfoPrompted || hasProjectInfo() || hasDrawingContent())) return;
  const info = await openProjectDetailsDialog({
    title: "New drawing details",
    action: "Start drawing",
    defaults: state.projectInfo,
  });

  state.projectInfoPrompted = true;
  if (info) {
    state.projectInfo = info;
    state.projectId = createProjectId();
  }
  updateControls();
  updateAll();
}

function openProjectDetailsDialog(options = {}) {
  const fallback = () => Promise.resolve(promptProjectDetailsFallback(options.defaults));
  if (!projectDialog || !projectDialogForm || !projectDialogSubmitButton) return fallback();

  if (projectDialogResolver) {
    projectDialogResolver(null);
    projectDialogResolver = null;
  }

  const defaults = normalizeProjectInfo(options.defaults ?? state.projectInfo);
  for (const [field, input] of Object.entries(projectDialogInputs)) {
    if (input) input.value = defaults[field] ?? "";
  }
  if (projectDialogTitle) projectDialogTitle.textContent = options.title ?? "Project details";
  projectDialogSubmitButton.textContent = options.action ?? "Save project";
  closeProjectJobPicker();
  updateProjectJobPickerButton();
  projectDialog.hidden = false;
  projectDialogInputs.jobNumber?.focus();

  return new Promise((resolve) => {
    projectDialogResolver = resolve;
  });
}

function closeProjectDetailsDialog(result) {
  closeProjectJobPicker();
  if (projectDialog) projectDialog.hidden = true;
  const resolve = projectDialogResolver;
  projectDialogResolver = null;
  resolve?.(result);
}

function projectDetailsFromDialog() {
  return normalizeProjectInfo(
    Object.fromEntries(
      Object.entries(projectDialogInputs).map(([field, input]) => [field, input?.value ?? ""]),
    ),
  );
}

function promptProjectDetailsFallback(defaults = state.projectInfo) {
  const current = normalizeProjectInfo(defaults);
  const jobNumber = window.prompt("Job no.", current.jobNumber);
  if (jobNumber === null) return null;
  const spoolNumber = window.prompt("Spool no.", current.spoolNumber);
  if (spoolNumber === null) return null;
  const client = window.prompt("Client / area", current.client);
  if (client === null) return null;
  const revision = window.prompt("Revision", current.revision || "A");
  if (revision === null) return null;
  const drawnBy = window.prompt("Drawn by", current.drawnBy);
  if (drawnBy === null) return null;
  return normalizeProjectInfo({ jobNumber, spoolNumber, client, revision, drawnBy });
}

function exportProjectFile() {
  const { name, payload } = exportedProjectPayload();
  const reportCanvas = buildSpoolReportCanvas();
  const modelImage = capture3dPreviewImage();
  const html = projectExportHtml(payload, reportCanvas.toDataURL("image/png"), modelImage);
  downloadTextFile(html, `${name}.html`, "text/html");
}

function exportedProjectPayload() {
  const project = normalizeProjectInfo(state.projectInfo);
  const stamp = new Date().toISOString().slice(0, 10);
  const name = [
    safeFilePart(project.jobNumber, "job"),
    safeFilePart(project.spoolNumber, "spool"),
    stamp,
  ].join("-");
  const payload = {
    app: "IsoSpool Studio",
    appVersion: APP_VERSION,
    appBuildDate: APP_BUILD_DATE,
    fileVersion: PROJECT_FILE_VERSION,
    exportedAt: new Date().toISOString(),
    state: statePayload(),
  };
  return { name, payload };
}

function capture3dPreviewImage() {
  try {
    if (three.ready) {
      update3dPreview();
      three.renderer.render(three.scene, three.camera);
      return threeCanvas.toDataURL("image/png");
    }

    renderFallbackPreview();
    return fallbackCanvas.toDataURL("image/png");
  } catch (error) {
    console.warn("Could not capture 3D model for export.", error);
    return "";
  }
}

function projectExportHtml(payload, reportImage, modelImage = "") {
  const project = normalizeProjectInfo(payload.state?.projectInfo);
  const title = projectDisplayName(project);
  const exportedAt = new Date(payload.exportedAt ?? Date.now()).toLocaleString();
  const data = jsonForHtmlScript(payload);
  const modelSection = modelImage
    ? `<section class="figure">
        <h2>3D model view</h2>
        <img class="model-image" src="${modelImage}" alt="3D pipe spool model" />
      </section>`
    : "";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} - IsoSpool export</title>
    <style>
      body { margin: 0; background: #eef4f2; color: #1f3438; font-family: Arial, Helvetica, sans-serif; }
      main { max-width: 1160px; margin: 0 auto; padding: 24px; }
      header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 18px; }
      h1 { margin: 0 0 6px; font-size: 24px; }
      h2 { margin: 0 0 10px; font-size: 18px; }
      p { margin: 4px 0; color: #516169; font-weight: 700; }
      button { border: 0; border-radius: 8px; padding: 10px 14px; background: #0f766e; color: white; font-weight: 800; cursor: pointer; }
      img { display: block; width: 100%; height: auto; border: 1px solid #bed8d1; border-radius: 10px; background: white; }
      .figure { margin: 0 0 20px; }
      .model-image { background: #f8fbfb; max-height: 680px; object-fit: contain; }
      .note { margin-top: 14px; font-size: 13px; }
      @media print {
        body { background: white; }
        main { max-width: none; padding: 0; }
        header, .note { display: none; }
        h2 { margin: 0 0 5mm; }
        img { border: 0; border-radius: 0; }
        .figure { break-inside: avoid; margin: 0 0 8mm; }
        .model-image { max-height: 42vh; }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <div>
          <h1>${escapeHtml(title)}</h1>
          <p>IsoSpool fabrication sheet export ${escapeHtml(payload.appVersion ?? APP_VERSION)}</p>
          <p>Exported ${escapeHtml(exportedAt)}</p>
        </div>
        <button type="button" onclick="window.print()">Print / Save PDF</button>
      </header>
      <section class="figure">
        <h2>Fabrication sheet</h2>
        <img src="${reportImage}" alt="Pipe spool fabrication sheet" />
      </section>
      ${modelSection}
      <p class="note">This HTML file opens in a browser. It also contains the IsoSpool project data, so it can be imported back into IsoSpool later.</p>
    </main>
    <script id="isospool-project-data" type="application/json">${data}</script>
  </body>
</html>`;
}

function jsonForHtmlScript(payload) {
  return JSON.stringify(payload)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function importProjectFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const payload = parseImportedProjectPayload(String(reader.result ?? ""));
      const restored = stateFromPayload(payload);
      if (!restored) {
        window.alert("That file does not look like an IsoSpool project.");
        return;
      }

      state = restored;
      three.userMovedCamera = false;
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

function parseImportedProjectPayload(text) {
  const source = String(text ?? "").trim();
  if (!source) return null;
  if (source.startsWith("{")) {
    return JSON.parse(source);
  }

  const match = source.match(/<script[^>]*id=["']isospool-project-data["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!match) return null;
  return JSON.parse(match[1]);
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
  downloadCanvas(buildSpoolReportCanvas(), "pipe-spool-cut-list.png");
}

function buildSpoolReportCanvas() {
  const quantities = quantitySummary();
  const rowCount = Math.max(quantities.segments.length, 1);
  const bendCount = Math.max(quantities.elbows.length, 1);
  const teeCount = Math.max(quantities.tees.length, 1);
  const branchCount = Math.max(quantities.branches.length, 1);
  const reducerCount = Math.max(quantities.reducers.length, 1);
  const fittingCount = Math.max(quantities.fittings.length, 1);
  const takeoffCount = Math.max(takeoffCountRows(quantities).length, 1);
  const canvas = document.createElement("canvas");
  canvas.width = 1800;
  canvas.height = Math.max(1240, 990 + takeoffCount * 22 + rowCount * 34 + bendCount * 28 + teeCount * 28 + branchCount * 28 + reducerCount * 28 + fittingCount * 24);
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
  return canvas;
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
  ctx.fillText(`IsoSpool ${APP_VERSION}`, width - 36, 82);
  if (project.drawnBy) {
    ctx.fillText(`Drawn by ${project.drawnBy}`, width - 36, 104);
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
  y = drawReportTakeoffList(ctx, x, y, area.width - 48, quantities);
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
      ? `${pipeSpec().label} pipe. Tee/elbow/reducer Atlas table weights used where available; roll grooves add 0 kg; branch welds, valves, sockets and weld allowances are estimated unless manually set. Verify lug design, welds, sling angles and ratings before lifting.`
      : `${pipeSpec().label} pipe. Tee/elbow/reducer Atlas table weights used where available; roll grooves add 0 kg; branch welds, valves, sockets and weld allowances are estimated unless manually set.`,
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

function drawReportTakeoffList(ctx, x, y, width, quantities) {
  const rows = takeoffCountRows(quantities);
  ctx.fillStyle = "#1f3438";
  ctx.font = "900 18px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Take-off list by size", x, y);
  y += 26;

  const columns = [
    { label: "Item", x: 0, align: "left" },
    { label: "Qty", x: width * 0.5, align: "left" },
    { label: "kg", x: width, align: "right" },
  ];

  ctx.fillStyle = "#eaf7f3";
  roundRect(ctx, x, y - 17, width, 28, 7);
  ctx.fill();
  ctx.font = "900 12px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#607174";
  for (const column of columns) {
    ctx.textAlign = column.align;
    ctx.fillText(column.label, x + column.x, y);
  }
  y += 16;

  for (const row of rows) {
    y += 24;
    ctx.strokeStyle = "rgba(31, 42, 47, 0.1)";
    ctx.beginPath();
    ctx.moveTo(x, y - 18);
    ctx.lineTo(x + width, y - 18);
    ctx.stroke();

    ctx.font = "900 13px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#263d45";
    ctx.textAlign = "left";
    ctx.fillText(row.label, x, y);
    ctx.fillText(row.countText, x + width * 0.5, y);
    ctx.textAlign = "right";
    ctx.fillText(row.weightKg ? `${formatMass(row.weightKg)} kg` : "-", x + width, y);
    ctx.textAlign = "left";
  }

  return y + 14;
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
  openDrawingContextMenuFromPointer(pointer, event.clientX, event.clientY);
}

function contextTargetFromPointer(pointer) {
  const segmentHit = findNearestSegment(pointer);
  const pointHit = findNearestPoint(pointer);
  const endpointHit = endpointSegmentHitForPoint(pointHit);
  const fittingHit = findNearestFitting(pointer);
  const reducerHit = findNearestAutoReducer(pointer);
  const pipeHit = endpointHit ?? fittingHit?.segmentHit ?? reducerHit?.segmentHit ?? segmentHit;
  const noteHit = findNearestNote(pointer);
  const notePoint = noteHit?.note.point ?? pointHit?.point ?? (
    pipeHit ? lerpPoint(pipeHit.segment.start, pipeHit.segment.end, pipeHit.t) : unprojectIsoGround(pointer)
  );

  return {
    segmentHit: pipeHit,
    fittingHit,
    reducerHit,
    pointHit,
    endpointHit,
    noteHit,
    notePoint,
  };
}

function openDrawingContextMenuFromPointer(pointer, clientX, clientY) {
  drawingContextTarget = contextTargetFromPointer(pointer);
  state.hoveredSegment = drawingContextTarget.segmentHit ? drawingContextTarget.segmentHit.segment.index : null;
  drawIso();
  renderDrawingContextMenu();
  positionDrawingContextMenu(clientX, clientY);
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

  if (isCoarseInput()) {
    renderMobileDrawingContextMenu(target);
    return;
  }

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
      keepOpen: true,
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
        label: "Add roll groove",
        detail: "Grooved pipe end / 0 kg added",
        action: () => placeContextFitting("rollGroove"),
      },
      {
        label: "Add reducer",
        detail: "On this run",
        action: () => placeContextFitting("reducer"),
      },
      {
        label: "Add 1/2 sockets",
        detail: "Choose count and spacing",
        action: () => addContextSockets(),
      },
    );

    actions.push({
      label: target.endpointHit ? "Delete end run" : "Delete pipe run",
      detail: deleteCount > 1 ? `Remove ${deleteCount} selected runs` : `Remove run ${target.segmentHit.segment.index + 1}`,
      danger: true,
      action: () => deleteContextSegments(),
    });
  }

  if (target?.reducerHit?.reducer?.kind === "bend") {
    actions.push({
      label: "Move reducer to other side",
      detail: reducerSideDetail(target.reducerHit.reducer),
      action: () => toggleContextBendReducerSide(),
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
    if (fittingData.fitting.type !== "rollGroove") {
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
    }

    if (target.fittingHit.fitting.type === "socket") {
      actions.push({
        label: "Spin socket 90 deg",
        detail: `Current ${formatAngle(fittingSocketAngle(target.fittingHit.fitting))} deg around pipe`,
        action: () => rotateContextSocket(),
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

  appendDrawingContextActions(actions);
}

function appendDrawingContextActions(actions) {
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
      if (!action.keepOpen) {
        closeDrawingContextMenu();
      }
    });
    drawingContextMenu.append(button);
  }
}

function addDrawingContextHeader(titleText, detailText) {
  const header = document.createElement("div");
  header.className = "drawing-context-header";
  const title = document.createElement("strong");
  title.textContent = titleText;
  const subtitle = document.createElement("small");
  subtitle.textContent = detailText;
  header.append(title, subtitle);
  drawingContextMenu.append(header);
}

function renderMobileDrawingContextMenu(target) {
  drawingContextMenu.innerHTML = "";
  const actions = [];

  if (target?.noteHit) {
    addDrawingContextHeader("Text note", "Quick note actions");
    actions.push(
      {
        label: "Edit note",
        detail: "Change note wording",
        action: () => editContextNote(target.noteHit.note),
      },
      {
        label: "Delete note",
        detail: "Remove this note",
        danger: true,
        action: () => deleteContextNote(),
      },
    );
    appendDrawingContextActions(actions);
    return;
  }

  if (target?.fittingHit) {
    const fitting = target.fittingHit.fitting;
    addDrawingContextHeader(`${fittingActionLabel(fitting.type)} fitting`, "Quick fitting actions");
    if (fitting.type === "socket") {
      actions.push({
        label: "Spin socket 90 deg",
        detail: `${formatAngle(fittingSocketAngle(fitting))} deg now`,
        action: () => rotateContextSocket(),
      });
    }
    actions.push({
      label: `Delete ${fittingActionLabel(fitting.type)}`,
      detail: "Remove this fitting only",
      danger: true,
      action: () => deleteContextFitting(),
    });
    appendDrawingContextActions(actions);
    return;
  }

  if (target?.reducerHit?.reducer?.kind === "bend") {
    addDrawingContextHeader("Reducer", "Bend reducer actions");
    actions.push({
      label: "Move reducer to other side",
      detail: reducerSideDetail(target.reducerHit.reducer),
      action: () => toggleContextBendReducerSide(),
    });
    appendDrawingContextActions(actions);
    return;
  }

  const pointConnections = target?.pointHit
    ? segments().filter((segment) => segment.from === target.pointHit.index || segment.to === target.pointHit.index)
    : [];
  if (target?.pointHit && pointConnections.length >= 3) {
    const type = nodeConnectionType(target.pointHit.index);
    addDrawingContextHeader("Connection point", `Point ${pointLabel(target.pointHit.index)}`);
    actions.push({
      label: type === "branch" ? "Mark as tee" : "Mark as branch",
      detail: type === "branch" ? "Use tee take-off" : "Use welded branch take-off",
      action: () => setContextPointConnectionType(type === "branch" ? "tee" : "branch"),
    });
    appendDrawingContextActions(actions);
    return;
  }

  if (target?.segmentHit) {
    const segment = target.segmentHit.segment;
    const bendAnchor = bendEditAnchorForHit(target.segmentHit);
    const currentBend = bendAnchor === null ? null : bendAngleForSegmentAt(segment, bendAnchor);
    const selected = selectedSegmentIndexes();
    const deleteCount = selected.includes(segment.index) && selected.length > 1 ? selected.length : 1;

    addDrawingContextHeader(`Run ${segment.index + 1}`, contextPipeSizeDetail(segment));
    actions.push(
      {
        label: "Pipe size",
        detail: "Pick NB from list",
        action: () => changeContextPipeSize(),
        keepOpen: true,
      },
      {
        label: "Length",
        detail: `${formatLength(pointLength(segment.vector))} mm now`,
        action: () => editContextSegmentLength(),
      },
      {
        label: "Add fitting",
        detail: "Flange, groove, reducer or sockets",
        action: () => renderMobileFittingMenu(),
        keepOpen: true,
      },
    );
    if (currentBend !== null) {
      actions.push({
        label: "Bend angle",
        detail: `${formatAngle(currentBend)} deg now`,
        action: () => editContextSegmentAngle(),
      });
    }
    actions.push(
      {
        label: "Add note",
        detail: "Text at this spot",
        action: () => addContextNote(target.notePoint),
      },
      {
        label: target.endpointHit ? "Delete end run" : "Delete run",
        detail: deleteCount > 1 ? `Remove ${deleteCount} selected runs` : `Remove run ${segment.index + 1}`,
        danger: true,
        action: () => deleteContextSegments(),
      },
    );
    appendDrawingContextActions(actions);
    return;
  }

  addDrawingContextHeader("Drawing", "Quick actions");
  actions.push({
    label: "Add note",
    detail: "Text on the iso paper",
    action: () => addContextNote(target?.notePoint),
  });
  appendDrawingContextActions(actions);
}

function renderMobileFittingMenu() {
  const target = drawingContextTarget;
  drawingContextMenu.innerHTML = "";
  addDrawingContextHeader("Add fitting", target?.endpointHit ? "End fittings" : "Pipe fittings");
  appendDrawingContextActions([
    {
      label: "Back",
      detail: "Return to pipe actions",
      action: () => renderMobileDrawingContextMenu(drawingContextTarget),
      keepOpen: true,
    },
    {
      label: "Single flange",
      detail: target?.endpointHit ? "Flush on pipe end" : "One flanged plate",
      action: () => placeContextFitting("flange", { flangeMode: "single" }),
    },
    {
      label: "Double flange",
      detail: target?.endpointHit ? "Flush on pipe end" : "Two plates and gasket",
      action: () => placeContextFitting("flange", { flangeMode: "double" }),
    },
    {
      label: "Roll groove",
      detail: "Grooved pipe end / 0 kg",
      action: () => placeContextFitting("rollGroove"),
    },
    {
      label: "Reducer",
      detail: "On this run",
      action: () => placeContextFitting("reducer"),
    },
    {
      label: "1/2 sockets",
      detail: "Choose count and spacing",
      action: () => addContextSockets(),
    },
  ]);
  clampDrawingContextMenuToViewport();
}

function renderContextPipeSizeMenu() {
  const hit = drawingContextTarget?.segmentHit;
  if (!hit) return;

  const targetIndexes = contextPipeSizeTargetIndexes(hit.segment);
  const segmentData = segments();
  const segmentByIndex = new Map(segmentData.map((segment) => [segment.index, segment]));
  const currentSizes = new Set(
    targetIndexes
      .map((index) => segmentByIndex.get(index))
      .filter(Boolean)
      .map((segment) => pipeSizeForSegment(segment).nb),
  );
  const countText = targetIndexes.length > 1 ? `${targetIndexes.length} selected runs` : `Run ${hit.segment.index + 1}`;

  drawingContextMenu.innerHTML = "";

  const header = document.createElement("div");
  header.className = "drawing-context-header";
  const title = document.createElement("strong");
  title.textContent = "Pipe size";
  const subtitle = document.createElement("small");
  subtitle.textContent = `${countText} - choose NB`;
  header.append(title, subtitle);
  drawingContextMenu.append(header);

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "drawing-context-item compact";
  backButton.innerHTML = "<span>Back</span><small>Return to pipe actions</small>";
  backButton.addEventListener("click", () => {
    renderDrawingContextMenu();
    clampDrawingContextMenuToViewport();
  });
  drawingContextMenu.append(backButton);

  for (const size of PIPE_SIZES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "drawing-context-item";
    if (currentSizes.size === 1 && currentSizes.has(size.nb)) {
      button.classList.add("active");
    }
    button.setAttribute("role", "menuitem");

    const label = document.createElement("span");
    label.textContent = `NB ${size.nb}`;
    const detail = document.createElement("small");
    detail.textContent = `NPS ${size.nps} / OD ${size.od.toFixed(1)} mm / ${pipeSpec().schedule}`;
    button.append(label, detail);

    button.addEventListener("click", () => {
      setPipeSizeForSegments(targetIndexes, size.nb);
      closeDrawingContextMenu();
    });
    drawingContextMenu.append(button);
  }

  clampDrawingContextMenuToViewport();
}

function positionDrawingContextMenu(clientX, clientY) {
  drawingContextMenu.hidden = false;
  drawingContextMenu.style.left = `${clientX}px`;
  drawingContextMenu.style.top = `${clientY}px`;

  clampDrawingContextMenuToViewport();
}

function clampDrawingContextMenuToViewport() {
  requestAnimationFrame(() => {
    const rect = drawingContextMenu.getBoundingClientRect();
    const currentLeft = Number.parseFloat(drawingContextMenu.style.left) || rect.left;
    const currentTop = Number.parseFloat(drawingContextMenu.style.top) || rect.top;
    const left = clampNumber(currentLeft, 8, Math.max(8, window.innerWidth - rect.width - 8));
    const top = clampNumber(currentTop, 8, Math.max(8, window.innerHeight - rect.height - 8));
    drawingContextMenu.style.left = `${left}px`;
    drawingContextMenu.style.top = `${top}px`;
  });
}

function closeDrawingContextMenu() {
  drawingContextMenu.hidden = true;
  drawingContextTarget = null;
}

function handleDocumentScrollForContextMenu(event) {
  if (drawingContextMenu.hidden) return;
  if (event.target && drawingContextMenu.contains(event.target)) return;
  closeDrawingContextMenu();
}

function hasContextHit(pointer) {
  const target = contextTargetFromPointer(pointer);
  return Boolean(target.segmentHit || target.fittingHit || target.pointHit || target.noteHit);
}

function startTouchContextPress(event, pointer) {
  if (!isTouchLikeEvent(event) || event.button !== 0) return false;
  if (state.activeTool !== "select") return false;

  cancelTouchContextPress();
  const hasHit = hasContextHit(pointer);
  if (!hasHit) return false;
  touchContextPress = {
    pointerId: event.pointerId,
    pointer,
    clientX: event.clientX,
    clientY: event.clientY,
    fired: false,
    timer: window.setTimeout(() => {
      if (!touchContextPress || touchContextPress.pointerId !== event.pointerId) return;
      touchContextPress.fired = true;
      state.previewCandidate = null;
      cancelPendingDraw({ redraw: false });
      openDrawingContextMenuFromPointer(touchContextPress.pointer, touchContextPress.clientX, touchContextPress.clientY);
      cursorReadout.textContent = "Tap an action";
    }, TOUCH_CONTEXT_PRESS_MS),
  };

  return false;
}

function updateTouchContextPress(event) {
  if (!touchContextPress || touchContextPress.pointerId !== event.pointerId) return false;

  const moved = Math.hypot(
    event.clientX - touchContextPress.clientX,
    event.clientY - touchContextPress.clientY,
  );
  if (moved > TOUCH_CONTEXT_MOVE_LIMIT) {
    cancelTouchContextPress();
    return false;
  }

  return touchContextPress.fired;
}

function cancelTouchContextPress() {
  if (!touchContextPress) return;
  window.clearTimeout(touchContextPress.timer);
  touchContextPress = null;
}

function trackTouchPointer(event) {
  if (!isTouchLikeEvent(event)) return;
  activeTouchPointers.set(event.pointerId, {
    clientX: event.clientX,
    clientY: event.clientY,
  });
  if (activeTouchPointers.size >= 2) {
    beginPinchGesture();
  }
}

function updateTrackedTouchPointer(event) {
  if (!activeTouchPointers.has(event.pointerId)) return;
  activeTouchPointers.set(event.pointerId, {
    clientX: event.clientX,
    clientY: event.clientY,
  });
}

function releaseTrackedTouchPointer(event) {
  activeTouchPointers.delete(event.pointerId);
}

function firstTwoTouchPointers() {
  return [...activeTouchPointers.entries()].slice(0, 2);
}

function touchDistance(pointerEntries) {
  if (pointerEntries.length < 2) return 0;
  const first = pointerEntries[0][1];
  const second = pointerEntries[1][1];
  return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
}

function beginPinchGesture() {
  const pointerEntries = firstTwoTouchPointers();
  const startDistance = touchDistance(pointerEntries);
  if (startDistance <= 0) return;

  cancelPendingDraw();
  cancelTouchContextPress();
  if (noteDrag) {
    try {
      drawCanvas.releasePointerCapture(noteDrag.pointerId);
    } catch {
      // Ignore browsers that have already released capture.
    }
    noteDrag = null;
  }
  if (socketDrag) {
    try {
      drawCanvas.releasePointerCapture(socketDrag.pointerId);
    } catch {
      // Ignore browsers that have already released capture.
    }
    socketDrag = null;
  }
  if (dimensionDrag) {
    try {
      drawCanvas.releasePointerCapture(dimensionDrag.pointerId);
    } catch {
      // Ignore browsers that have already released capture.
    }
    dimensionDrag = null;
  }

  pinchGesture = {
    ids: pointerEntries.map(([id]) => id),
    startDistance,
    startScale: state.gridScale,
  };
}

function updatePinchGesture() {
  if (!pinchGesture) return false;
  const pointerEntries = pinchGesture.ids
    .map((id) => [id, activeTouchPointers.get(id)])
    .filter((entry) => entry[1]);
  if (pointerEntries.length < 2) return false;

  const distance = touchDistance(pointerEntries);
  if (distance <= 0) return false;
  state.gridScale = clampNumber(pinchGesture.startScale * (distance / pinchGesture.startDistance), 24, 72);
  state.previewCandidate = null;
  cursorReadout.textContent = `Zoom ${Math.round(state.gridScale)}`;
  drawIso();
  return true;
}

function finishPinchGestureForPointer(event) {
  const wasPinching = Boolean(pinchGesture && pinchGesture.ids.includes(event.pointerId));
  releaseTrackedTouchPointer(event);
  if (!wasPinching) return false;

  if (activeTouchPointers.size >= 2) {
    beginPinchGesture();
  } else {
    pinchGesture = null;
    updateAll();
  }

  event.preventDefault();
  return true;
}

function finishTouchContextPress(event) {
  if (!touchContextPress || touchContextPress.pointerId !== event.pointerId) return false;

  const press = touchContextPress;
  cancelTouchContextPress();

  if (press.fired) {
    if (noteDrag) {
      finishNoteDrag(event);
    }
    if (socketDrag) {
      finishSocketDrag(event);
    }
    if (dimensionDrag) {
      finishDimensionDrag(event);
    }
    event.preventDefault();
    return true;
  }

  return false;
}

function startPendingDraw(event, pointer) {
  if (state.activeTool !== "draw") return false;

  const pointHit = findNearestPoint(pointer);
  if (pointHit) {
    state.selectedPoint = pointHit.index;
    state.activePoint = pointHit.index;
    state.selectedFitting = null;
    state.selectedNote = null;
    clearSelectedSegments();
  }

  const candidate = getSnappedCandidate(pointer);
  if (!candidate) return false;

  cancelPendingDraw();
  pendingDraw = {
    pointerId: event.pointerId,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startedOnPoint: pointHit?.index ?? null,
    candidate,
    moved: false,
  };
  state.previewCandidate = candidate;
  state.pointer = pointer;
  cursorReadout.textContent = pointHit ? "Drag to draw from point" : formatPoint(candidate.point);
  try {
    drawCanvas.setPointerCapture(event.pointerId);
  } catch {
    // Pointer capture keeps mouse, Pencil and finger drawing stable near the canvas edge.
  }
  drawIso();
  event.preventDefault();
  return true;
}

function updatePendingDraw(event) {
  if (!pendingDraw || pendingDraw.pointerId !== event.pointerId) return false;
  if (pinchGesture) return false;

  const pointer = pointerPosition(event);
  const candidate = getSnappedCandidate(pointer);
  if (!candidate) return false;

  const moved = Math.hypot(
    event.clientX - pendingDraw.startClientX,
    event.clientY - pendingDraw.startClientY,
  );
  pendingDraw.moved = pendingDraw.moved || moved >= hitLimit(DRAW_COMMIT_MOVE_LIMIT, DRAW_COMMIT_MOVE_LIMIT);
  pendingDraw.candidate = candidate;
  state.previewCandidate = candidate;
  state.pointer = pointer;
  cursorReadout.textContent = formatPoint(candidate.point);
  drawIso();
  event.preventDefault();
  return true;
}

function finishPendingDraw(event) {
  if (!pendingDraw || pendingDraw.pointerId !== event.pointerId) return false;
  const candidate = pendingDraw.candidate;
  const shouldCommit = pendingDraw.moved && candidate;
  const startedOnPoint = pendingDraw.startedOnPoint;
  cancelPendingDraw({ redraw: false });

  if (shouldCommit) {
    addRun(candidate.axis, candidate.length);
  } else if (startedOnPoint !== null) {
    state.selectedPoint = startedOnPoint;
    state.activePoint = startedOnPoint;
    updateAll({ save: false });
  } else {
    state.previewCandidate = null;
    state.pointer = null;
    drawIso();
  }
  event.preventDefault();
  return true;
}

function cancelPendingDraw(options = {}) {
  if (!pendingDraw) return;
  try {
    drawCanvas.releasePointerCapture(pendingDraw.pointerId);
  } catch {
    // Ignore browsers that have already released capture.
  }
  pendingDraw = null;
  state.previewCandidate = null;
  if (options.redraw !== false) {
    drawIso();
  }
}

function stopDrawingMode() {
  cancelPendingDraw({ redraw: false });
  cancelTouchContextPress();
  state.previewCandidate = null;
  state.pointer = null;
  state.hoveredSegment = null;
  setTool("select");
  updateAll({ save: false });
}

function selectContextHitOnTouch(pointer, event) {
  const target = contextTargetFromPointer(pointer);

  if (target.noteHit) {
    state.selectedNote = target.noteHit.note.id;
    state.selectedFitting = null;
    state.selectedPoint = null;
    clearSelectedSegments();
    setTool("select");
    updateAll({ save: false });
    showMobilePanel("inspector");
    return;
  }

  if (target.pointHit) {
    state.selectedPoint = target.pointHit.index;
    state.activePoint = target.pointHit.index;
    state.selectedFitting = null;
    state.selectedNote = null;
    clearSelectedSegments();
    setTool("select");
    updateAll({ save: false });
    showMobilePanel("inspector");
    return;
  }

  if (target.segmentHit) {
    chooseSegmentFromPointer(event, target.segmentHit.segment.index);
    state.selectedNote = null;
    state.selectedFitting = target.fittingHit ? target.fittingHit.fitting.id : null;
    state.selectedPoint = target.segmentHit.t < 0.5 ? target.segmentHit.segment.from : target.segmentHit.segment.to;
    state.activePoint = state.selectedPoint;
    setTool("select");
    updateAll({ save: false });
    showMobilePanel("inspector");
  }
}

function placeContextFitting(type, options = {}) {
  const hit = drawingContextTarget?.segmentHit;
  if (!hit) return;
  placeFitting(type, hit.segment.index, hit.t, options);
}

function addContextSockets() {
  const hit = drawingContextTarget?.segmentHit;
  if (!hit) return;

  const countText = window.prompt("How many 1/2 inch sockets?", "1");
  if (countText === null) return;

  const count = Math.round(Number(countText));
  if (!Number.isInteger(count) || count < 1 || count > MAX_SOCKET_COUNT) {
    window.alert(`Enter a socket count from 1 to ${MAX_SOCKET_COUNT}.`);
    return;
  }

  const evenSpaced = count > 1
    ? window.confirm("Evenly space the sockets along this pipe section?\nOK = even spaced\nCancel = grouped around the right-click spot")
    : false;
  const positions = socketPositionsForContext(hit, count, evenSpaced);
  if (!positions.length) return;
  placeSocketFittings(hit.segment.index, positions);
}

function socketPositionsForContext(hit, count, evenSpaced) {
  const lengthMm = Math.max(1, pointLength(hit.segment.vector));
  const endMarginT = clampNumber(50 / lengthMm, 0.04, 0.18);
  const minT = endMarginT;
  const maxT = 1 - endMarginT;

  if (count === 1) {
    return [clampNumber(hit.t, minT, maxT)];
  }

  if (evenSpaced) {
    return evenlySpacedSocketPositions(count, minT, maxT);
  }

  const spacingText = window.prompt("Socket spacing mm centre-to-centre", String(DEFAULT_SOCKET_SPACING_MM));
  if (spacingText === null) return [];

  const spacingMm = Number(spacingText);
  if (!Number.isFinite(spacingMm) || spacingMm <= 0) {
    window.alert("Enter a valid socket spacing in mm.");
    return [];
  }

  const stepT = spacingMm / lengthMm;
  const spanT = stepT * (count - 1);
  if (spanT >= maxT - minT) {
    window.alert("That spacing does not fit on this pipe section, so the sockets will be evenly spaced instead.");
    return evenlySpacedSocketPositions(count, minT, maxT);
  }

  const startT = clampNumber(hit.t - spanT * 0.5, minT, maxT - spanT);
  return Array.from({ length: count }, (_, index) => startT + index * stepT);
}

function evenlySpacedSocketPositions(count, minT, maxT) {
  const span = maxT - minT;
  return Array.from({ length: count }, (_, index) => minT + ((index + 1) / (count + 1)) * span);
}

function fittingActionLabel(type) {
  if (type === "flange") return "flange";
  if (type === "rollGroove") return "roll groove";
  if (type === "valve") return "valve";
  if (type === "weld") return "weld";
  if (type === "reducer") return "reducer";
  if (type === "socket") return "1/2 socket";
  return "fitting";
}

function fittingModeText(fittingData) {
  const fitting = fittingData?.fitting ?? fittingData;
  if (fitting?.type === "flange") return fittingFlangeMode(fitting);
  if (fitting?.type === "rollGroove") return "0 kg roll groove";
  if (fitting?.type === "socket") return `NB ${fittingSocketSizeNb(fitting)} socket / ${formatAngle(fittingSocketAngle(fitting))} deg`;
  return fittingData?.weightSource ?? "estimated";
}

function reducerSideDetail(reducer) {
  const current = reducerPlacementSide(reducer) === "large" ? "large pipe side" : "small pipe side";
  const next = reducerPlacementSide(reducer) === "large" ? "small pipe side" : "large pipe side";
  return `Currently on ${current}; move to ${next}`;
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

function toggleContextBendReducerSide() {
  const reducer = drawingContextTarget?.reducerHit?.reducer;
  if (!reducer || reducer.kind !== "bend") return;

  state.reducerSideOverrides = normalizeReducerSideOverrides(state.reducerSideOverrides, state.points.length);
  const current = reducerSideForNode(reducer.nodeIndex);
  if (current === "large") {
    delete state.reducerSideOverrides[reducer.nodeIndex];
  } else {
    state.reducerSideOverrides[reducer.nodeIndex] = "large";
  }
  updateAll();
}

function setContextFittingWeight() {
  const hit = drawingContextTarget?.fittingHit;
  if (!hit) return;
  if (hit.fitting.type === "rollGroove") return;

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

function rotateContextSocket() {
  const fitting = drawingContextTarget?.fittingHit?.fitting;
  if (!fitting || fitting.type !== "socket") return;
  fitting.socketAngle = normalizeSocketAngle(fittingSocketAngle(fitting) + SOCKET_ROTATION_STEP_DEG);
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
  reindexReducerSideOverridesAfterPointRemoval(pointHit.index);
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
  const count = contextPipeSizeTargetIndexes(segment).length;
  const nb = pipeSizeForSegment(segment).nb;
  return count > 1 ? `${count} selected sections` : `Current NB ${nb}`;
}

function contextPipeSizeTargetIndexes(segment) {
  if (!segment) return [];
  const selected = selectedSegmentIndexes();
  return selected.includes(segment.index) && selected.length > 1 ? selected : [segment.index];
}

function changeContextPipeSize() {
  const hit = drawingContextTarget?.segmentHit;
  if (!hit) return;
  renderContextPipeSizeMenu();
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

function beginDimensionDrag(event, target, pointer) {
  if (!target || !Number.isInteger(target.segmentIndex)) return false;

  const currentOffset = dimensionOffsetForSegment(target.segmentIndex);
  dimensionDrag = {
    pointerId: event.pointerId,
    segmentIndex: target.segmentIndex,
    startPointer: { ...pointer },
    normal: { ...target.normal },
    side: Number(target.side) < 0 ? -1 : 1,
    startOffset: currentOffset.offset > 0.5
      ? currentOffset.offset
      : Math.max(0, (Number(target.offset) || 0) - (Number(target.baseOffset) || 0)),
    moved: false,
  };
  state.selectedNote = null;
  state.selectedFitting = null;
  clearSelectedSegments();
  state.selectedPoint = null;
  cursorReadout.textContent = "Dragging dimension";
  cancelTouchContextPress();
  try {
    drawCanvas.setPointerCapture(event.pointerId);
  } catch {
    // Pointer capture is a nice-to-have for dragging outside the canvas.
  }
  event.preventDefault();
  return true;
}

function updateDimensionDrag(event) {
  if (!dimensionDrag || dimensionDrag.pointerId !== event.pointerId) return false;

  const pointer = pointerPosition(event);
  const delta = {
    x: pointer.x - dimensionDrag.startPointer.x,
    y: pointer.y - dimensionDrag.startPointer.y,
  };
  const pull = delta.x * dimensionDrag.normal.x + delta.y * dimensionDrag.normal.y;
  const offset = clampNumber(dimensionDrag.startOffset + pull, 0, 520);
  setDimensionOffsetForSegment(dimensionDrag.segmentIndex, {
    side: dimensionDrag.side,
    offset,
  });
  dimensionDrag.moved = true;
  state.pointer = pointer;
  cursorReadout.textContent = offset > 1
    ? `Dimension offset ${Math.round(offset)} px`
    : "Dimension offset reset";
  drawIso();
  event.preventDefault();
  return true;
}

function finishDimensionDrag(event) {
  if (!dimensionDrag) return false;

  try {
    drawCanvas.releasePointerCapture(dimensionDrag.pointerId);
  } catch {
    // Ignore browsers that have already released capture.
  }
  const moved = dimensionDrag.moved;
  dimensionDrag = null;
  state.pointer = null;
  cursorReadout.textContent = formatPoint(activePoint());
  if (moved) {
    updateAll();
  } else {
    drawIso();
  }
  event?.preventDefault?.();
  return true;
}

function cancelDimensionDrag(options = {}) {
  if (!dimensionDrag) return;
  try {
    drawCanvas.releasePointerCapture(dimensionDrag.pointerId);
  } catch {
    // Ignore browsers that have already released capture.
  }
  dimensionDrag = null;
  if (options.redraw !== false) drawIso();
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

function beginSocketDrag(event, fittingHit, pointer) {
  const fitting = fittingHit?.fitting;
  const segment = fittingHit?.segmentHit?.segment ?? segments().find((item) => item.index === fitting?.segmentIndex);
  if (!fitting || fitting.type !== "socket" || !segment) return false;

  socketDrag = {
    pointerId: event.pointerId,
    fittingId: fitting.id,
    segmentIndex: segment.index,
    moved: false,
  };
  state.selectedFitting = fitting.id;
  state.selectedNote = null;
  state.selectedPoint = null;
  selectSingleSegment(segment.index);
  cursorReadout.textContent = socketPositionReadout(segment, fitting.t);
  cancelTouchContextPress();
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

function updateSocketDrag(event) {
  if (!socketDrag) return false;

  const fitting = state.fittings.find((item) => item.id === socketDrag.fittingId);
  const segment = segments().find((item) => item.index === socketDrag.segmentIndex);
  if (!fitting || fitting.type !== "socket" || !segment) {
    socketDrag = null;
    return false;
  }

  const pointer = pointerPosition(event);
  const projection = getProjection();
  const start = projectIso(segment.start, projection);
  const end = projectIso(segment.end, projection);
  const hit = distanceToSegment(pointer, start, end);
  fitting.t = normalizeFittingPosition("socket", hit.t);
  socketDrag.moved = true;
  state.pointer = pointer;
  state.selectedFitting = fitting.id;
  cursorReadout.textContent = socketPositionReadout(segment, fitting.t);
  drawIso();
  updatePropertiesPanel();
  event.preventDefault();
  return true;
}

function finishSocketDrag(event) {
  if (!socketDrag) return false;

  try {
    drawCanvas.releasePointerCapture(socketDrag.pointerId);
  } catch {
    // Ignore browsers that have already released capture.
  }
  const moved = socketDrag.moved;
  socketDrag = null;
  state.pointer = null;
  cursorReadout.textContent = formatPoint(activePoint());
  if (moved) {
    updateAll();
  } else {
    updateAll({ save: false });
  }
  event?.preventDefault?.();
  return true;
}

function beginBoxSelect(event, pointer) {
  boxSelectDrag = {
    pointerId: event.pointerId,
    start: { ...pointer },
    current: { ...pointer },
    addMode: event.shiftKey || event.ctrlKey || event.metaKey,
    moved: false,
  };
  state.pointer = pointer;
  state.hoveredSegment = null;
  cursorReadout.textContent = "Drag box around pipe runs";
  try {
    drawCanvas.setPointerCapture(event.pointerId);
  } catch {
    // Pointer capture is a nice-to-have for dragging outside the canvas.
  }
  drawIso();
  event.preventDefault();
  return true;
}

function updateBoxSelect(event) {
  if (!boxSelectDrag) return false;

  const pointer = pointerPosition(event);
  boxSelectDrag.current = pointer;
  boxSelectDrag.moved =
    Math.hypot(pointer.x - boxSelectDrag.start.x, pointer.y - boxSelectDrag.start.y) > 6;
  state.pointer = pointer;

  const indexes = segmentsInBoxSelect(boxSelectRect(boxSelectDrag));
  state.hoveredSegment = indexes.length ? indexes[indexes.length - 1] : null;
  cursorReadout.textContent = indexes.length
    ? `${indexes.length} run${indexes.length === 1 ? "" : "s"} inside box`
    : "Drag box around pipe runs";
  drawIso();
  event.preventDefault();
  return true;
}

function finishBoxSelect(event) {
  if (!boxSelectDrag) return false;

  const drag = boxSelectDrag;
  if (event) {
    drag.current = pointerPosition(event);
  }
  const rect = boxSelectRect(drag);
  const chosen = boxSelectSelectionFromDrag(drag, rect);

  try {
    drawCanvas.releasePointerCapture(drag.pointerId);
  } catch {
    // Ignore browsers that have already released capture.
  }

  boxSelectDrag = null;
  setSelectedSegments(chosen);
  state.selectedFitting = null;
  state.selectedNote = null;
  const selectedSegments = segments().filter((segment) => chosen.includes(segment.index));
  if (selectedSegments.length) {
    const last = selectedSegments[selectedSegments.length - 1];
    state.activePoint = last.to;
    state.selectedPoint = selectedSegments.length === 1 ? last.to : null;
    showMobilePanel("inspector");
  } else {
    state.selectedPoint = null;
  }
  state.pointer = null;
  state.hoveredSegment = null;
  cursorReadout.textContent = chosen.length
    ? `${chosen.length} run${chosen.length === 1 ? "" : "s"} selected`
    : "No runs selected";
  updateAll({ save: false });
  event?.preventDefault?.();
  return true;
}

function cancelBoxSelect(options = {}) {
  if (!boxSelectDrag) return;
  try {
    drawCanvas.releasePointerCapture(boxSelectDrag.pointerId);
  } catch {
    // Ignore browsers that have already released capture.
  }
  boxSelectDrag = null;
  state.pointer = null;
  state.hoveredSegment = null;
  if (options.redraw !== false) {
    drawIso();
  }
}

function boxSelectSelectionFromDrag(drag, rect) {
  const current = selectedSegmentIndexes();
  const useBox = drag.moved || rect.width > 8 || rect.height > 8;
  if (useBox) {
    const boxed = segmentsInBoxSelect(rect);
    return drag.addMode ? normalizeSelectedSegments([...current, ...boxed], state.edges.length) : boxed;
  }

  const hit = findNearestSegment(drag.current);
  if (!hit) return drag.addMode ? current : [];
  if (!drag.addMode) return [hit.segment.index];

  const selected = new Set(current);
  if (selected.has(hit.segment.index)) {
    selected.delete(hit.segment.index);
  } else {
    selected.add(hit.segment.index);
  }
  return normalizeSelectedSegments([...selected], state.edges.length);
}

function boxSelectRect(drag) {
  const left = Math.min(drag.start.x, drag.current.x);
  const top = Math.min(drag.start.y, drag.current.y);
  const right = Math.max(drag.start.x, drag.current.x);
  const bottom = Math.max(drag.start.y, drag.current.y);
  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  };
}

function padScreenRect(rect, amount) {
  return {
    left: rect.left - amount,
    top: rect.top - amount,
    right: rect.right + amount,
    bottom: rect.bottom + amount,
    width: rect.width + amount * 2,
    height: rect.height + amount * 2,
  };
}

function segmentsInBoxSelect(rect) {
  if (!rect) return [];
  const pickRect = padScreenRect(rect, 6);
  const projection = getProjection();
  return segments()
    .filter((segment) =>
      screenSegmentIntersectsRect(
        projectIso(segment.start, projection),
        projectIso(segment.end, projection),
        pickRect,
      ),
    )
    .map((segment) => segment.index);
}

function screenSegmentIntersectsRect(start, end, rect) {
  const segmentMinX = Math.min(start.x, end.x);
  const segmentMaxX = Math.max(start.x, end.x);
  const segmentMinY = Math.min(start.y, end.y);
  const segmentMaxY = Math.max(start.y, end.y);
  if (segmentMaxX < rect.left || segmentMinX > rect.right || segmentMaxY < rect.top || segmentMinY > rect.bottom) {
    return false;
  }

  if (screenPointInRect(start, rect) || screenPointInRect(end, rect)) return true;

  const topLeft = { x: rect.left, y: rect.top };
  const topRight = { x: rect.right, y: rect.top };
  const bottomRight = { x: rect.right, y: rect.bottom };
  const bottomLeft = { x: rect.left, y: rect.bottom };
  return (
    screenSegmentsIntersect(start, end, topLeft, topRight) ||
    screenSegmentsIntersect(start, end, topRight, bottomRight) ||
    screenSegmentsIntersect(start, end, bottomRight, bottomLeft) ||
    screenSegmentsIntersect(start, end, bottomLeft, topLeft)
  );
}

function screenPointInRect(point, rect) {
  return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}

function screenSegmentsIntersect(firstStart, firstEnd, secondStart, secondEnd) {
  const o1 = screenOrientation(firstStart, firstEnd, secondStart);
  const o2 = screenOrientation(firstStart, firstEnd, secondEnd);
  const o3 = screenOrientation(secondStart, secondEnd, firstStart);
  const o4 = screenOrientation(secondStart, secondEnd, firstEnd);

  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && screenPointOnSegment(secondStart, firstStart, firstEnd)) return true;
  if (o2 === 0 && screenPointOnSegment(secondEnd, firstStart, firstEnd)) return true;
  if (o3 === 0 && screenPointOnSegment(firstStart, secondStart, secondEnd)) return true;
  if (o4 === 0 && screenPointOnSegment(firstEnd, secondStart, secondEnd)) return true;
  return false;
}

function screenOrientation(a, b, c) {
  const value = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
  if (Math.abs(value) < 0.001) return 0;
  return value > 0 ? 1 : 2;
}

function screenPointOnSegment(point, start, end) {
  return (
    point.x <= Math.max(start.x, end.x) + 0.001 &&
    point.x >= Math.min(start.x, end.x) - 0.001 &&
    point.y <= Math.max(start.y, end.y) + 0.001 &&
    point.y >= Math.min(start.y, end.y) - 0.001
  );
}

function drawBoxSelectOverlay(ctx) {
  if (!boxSelectDrag) return;

  const rect = boxSelectRect(boxSelectDrag);
  ctx.save();
  ctx.fillStyle = "rgba(13, 148, 136, 0.10)";
  ctx.strokeStyle = "#0f766e";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
  ctx.strokeRect(rect.left + 0.5, rect.top + 0.5, rect.width, rect.height);
  ctx.setLineDash([]);

  const count = segmentsInBoxSelect(rect).length;
  if (count) {
    const label = `${count} run${count === 1 ? "" : "s"}`;
    ctx.font = "900 13px Inter, system-ui, sans-serif";
    const metrics = ctx.measureText(label);
    const width = metrics.width + 14;
    const canvasRect = drawCanvas.getBoundingClientRect();
    const x = clampNumber(rect.left, 8, Math.max(8, canvasRect.width - width - 8));
    const y = rect.top > 32 ? rect.top - 28 : rect.bottom + 8;
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.strokeStyle = "rgba(15, 118, 110, 0.35)";
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, width, 22, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#0f766e";
    ctx.fillText(label, x + 7, y + 15);
  }
  ctx.restore();
}

function socketPositionReadout(segment, t) {
  const lengthMm = pointLength(segment.vector);
  const position = normalizeFittingPosition("socket", t);
  const fromDistance = lengthMm * position;
  const toDistance = lengthMm - fromDistance;
  const useFrom = fromDistance <= toDistance;
  const referenceIndex = useFrom ? segment.from : segment.to;
  const distanceMm = useFrom ? fromDistance : toDistance;
  const label = socketReferenceLabel(referenceIndex, segment, segments()).toLowerCase();
  return `Socket ${formatLength(distanceMm)} mm from ${label}`;
}

drawCanvas.addEventListener("contextmenu", openDrawingContextMenu);

drawCanvas.addEventListener("pointermove", (event) => {
  updateTrackedTouchPointer(event);
  if (updatePinchGesture()) {
    event.preventDefault();
    return;
  }
  if (updateBoxSelect(event)) return;
  if (updateNoteDrag(event)) return;
  if (updateSocketDrag(event)) return;
  if (updateDimensionDrag(event)) return;
  if (updateTouchContextPress(event)) {
    event.preventDefault();
    return;
  }
  if (updatePendingDraw(event)) return;

  const pointer = pointerPosition(event);
  state.pointer = pointer;

  if (state.activeTool === "draw") {
    state.previewCandidate = getSnappedCandidate(pointer);
    if (state.previewCandidate) {
      cursorReadout.textContent = formatPoint(state.previewCandidate.point);
    }
  } else {
    const noteHit = findNearestNote(pointer);
    const dimensionHit = state.activeTool === "select" ? findNearestDimensionTarget(pointer) : null;
    const pointHit = findNearestPoint(pointer);
    const hit = findNearestSegment(pointer);
    state.hoveredSegment = hit ? hit.segment.index : null;
    cursorReadout.textContent = noteHit
      ? "Text note"
      : dimensionHit
      ? "Drag dimension"
      : pointHit
      ? `Point ${pointHit.index + 1} / tee start`
      : state.activeTool === "note"
      ? "Click to place note"
      : state.activeTool === "boxSelect" && hit
      ? `Box select / run ${hit.segment.index + 1}`
      : state.activeTool === "boxSelect"
      ? "Box select"
      : state.activeTool === "tee" && hit
      ? `Tee on run ${hit.segment.index + 1}`
      : hit
      ? `Run ${hit.segment.index + 1} / ${Math.round(hit.t * 100)}%`
      : "No run";
  }

  drawIso();
});

drawCanvas.addEventListener("pointerleave", () => {
  if (noteDrag || socketDrag || dimensionDrag || pendingDraw || boxSelectDrag) return;
  cancelTouchContextPress();
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
  trackTouchPointer(event);
  if (pinchGesture) {
    event.preventDefault();
    return;
  }
  if (state.activeTool === "boxSelect") {
    beginBoxSelect(event, pointer);
    return;
  }
  const touchPressBlocksDraw = startTouchContextPress(event, pointer);
  if (touchPressBlocksDraw) {
    event.preventDefault();
    return;
  }
  if (state.activeTool === "draw") {
    startPendingDraw(event, pointer);
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
    cancelTouchContextPress();
    beginNoteDrag(event, noteHit, pointer);
    return;
  }

  const fittingHit = findNearestFitting(pointer);
  if (fittingHit?.fitting?.type === "socket" && state.activeTool === "select") {
    beginSocketDrag(event, fittingHit, pointer);
    return;
  }

  const dimensionHit = findNearestDimensionTarget(pointer);
  if (dimensionHit && state.activeTool === "select") {
    beginDimensionDrag(event, dimensionHit, pointer);
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
    showMobilePanel("inspector");
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
    showMobilePanel("inspector");
    return;
  }

  if (FITTING_TOOLS.has(state.activeTool)) {
    placeFitting(state.activeTool, hit.segment.index, hit.t);
  }
});

drawCanvas.addEventListener("pointerup", (event) => {
  if (finishPinchGestureForPointer(event)) return;
  if (finishBoxSelect(event)) {
    releaseTrackedTouchPointer(event);
    return;
  }
  if (finishTouchContextPress(event)) {
    releaseTrackedTouchPointer(event);
    return;
  }
  if (finishPendingDraw(event)) {
    releaseTrackedTouchPointer(event);
    return;
  }
  if (finishNoteDrag(event)) {
    releaseTrackedTouchPointer(event);
    return;
  }
  if (finishSocketDrag(event)) {
    releaseTrackedTouchPointer(event);
    return;
  }
  finishDimensionDrag(event);
  releaseTrackedTouchPointer(event);
});
drawCanvas.addEventListener("pointercancel", (event) => {
  releaseTrackedTouchPointer(event);
  cancelTouchContextPress();
  cancelPendingDraw();
  cancelBoxSelect();
  if (pinchGesture && !pinchGesture.ids.every((id) => activeTouchPointers.has(id))) {
    pinchGesture = null;
  }
  finishNoteDrag(event);
  finishSocketDrag(event);
  finishDimensionDrag(event);
});

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
    state.projectInfoPrompted = true;
    updateProjectReadout();
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
    if (previewModeSelect) previewModeSelect.value = "carbon";
    if (previewModePanelSelect) previewModePanelSelect.value = "carbon";
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
  liftingAngleSelect.disabled = !state.showLiftingPoints;
  updateAll();
});

liftingAngleSelect.addEventListener("change", () => {
  state.liftingSlingAngleDegrees = normalizeLiftingSlingAngle(liftingAngleSelect.value);
  updateAll();
});

flangeModeSelect.addEventListener("change", () => {
  state.flangeMode = normalizeFlangeMode(flangeModeSelect.value);
  persistState();
});

previewModeSelect?.addEventListener("change", () => setPreviewMode(previewModeSelect.value));
previewModePanelSelect?.addEventListener("change", () => setPreviewMode(previewModePanelSelect.value));
previewLabelToggle?.addEventListener("change", () => {
  state.show3dLabels = previewLabelToggle.checked;
  update3dPreview();
  renderFallbackPreview();
  persistState();
});

previewRotateButton?.addEventListener("click", () => setThreeNavigationMode("orbit"));
previewMoveButton?.addEventListener("click", () => setThreeNavigationMode("pan"));
previewResetButton?.addEventListener("click", resetThreeView);

document.querySelector("#sampleButton").addEventListener("click", () => {
  state = sampleState();
  nextFittingId = 5;
  nextNoteId = 2;
  three.userMovedCamera = false;
  updateControls();
  updateAll();
});

document.querySelector("#undoButton").addEventListener("click", undo);
document.querySelector("#resetButton").addEventListener("click", startNewDrawing);
saveBrowserProjectButton?.addEventListener("click", () => {
  saveBrowserProject().catch((error) => {
    console.warn("Save project failed.", error);
    window.alert(error?.message || "Save project failed.");
  });
});
openBrowserProjectButton?.addEventListener("click", () => {
  openBrowserProject().catch((error) => {
    console.warn("Open project failed.", error);
    window.alert(error?.message || "Open project failed.");
  });
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
  const isEnterKey = event.key === "Enter" || event.code === "NumpadEnter";
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    undo();
  } else if (isEnterKey && !isEditingField(event.target) && (state.activeTool === "draw" || pendingDraw)) {
    event.preventDefault();
    stopDrawingMode();
  } else if ((event.key === "Delete" || event.key === "Backspace") && !isEditingField(event.target)) {
    deleteSelection();
  } else if (event.key === "Escape") {
    if (loadPlanDialog && !loadPlanDialog.hidden) {
      closeLoadPlanDialog();
      return;
    }
    if (newDrawingDialog && !newDrawingDialog.hidden) {
      closeNewDrawingDialog("cancel");
      return;
    }
    if (authDialog && !authDialog.hidden) {
      closeAuthDialog();
      return;
    }
    if (projectJobQuickPick && !projectJobQuickPick.hidden) {
      closeProjectJobPicker();
      return;
    }
    closeDrawingContextMenu();
    closeProjectLibrary();
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

window.addEventListener("resize", () => {
  closeDrawingContextMenu();
  redrawLoadPlanIfOpen();
  if (!isTabletLayout()) {
    showMobilePanel("drawing");
  }
});
document.addEventListener("scroll", handleDocumentScrollForContextMenu, true);

const resizeObserver = new ResizeObserver(() => {
  drawIso();
  renderFallbackPreview();
  resizeThree();
  redrawLoadPlanIfOpen();
});

resizeObserver.observe(drawCanvas.parentElement);
resizeObserver.observe(previewStage);

setupCollapsibleControls();
setupInspectorTabs();
setupMobilePanels();
setupAuthDialog();
setupProjectDialog();
setupLoadPlanner();
registerServiceWorker();
setupAppVersionChecks();
populatePipeSizeOptions();
updateControls();
updateAll({ save: false });
initThree();
setTimeout(() => {
  runStartupPrompts().catch((error) => {
    console.warn("Startup prompts failed.", error);
    promptForProjectDetails();
  });
}, 250);
