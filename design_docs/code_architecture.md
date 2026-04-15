# Code Architecture: Data Foundry Healthcare Demo

This document specifies the file structure, key interfaces, data pipeline, stores, and component inventory required to implement the demo described in `demo_narratives.md`. It follows the patterns established in `demo_data_architecture.md` and the visual/interaction rules from `demo_design_guide.md`.

**Before writing code, read this document and the three documents it references.** If something in `demo_narratives.md` contradicts this architecture, this document wins — the narrative describes *what* the audience sees, this document describes *how* the code delivers it.

---

## Guiding Principles for Implementation

1. **Think before coding.** Don't assume. State ambiguity explicitly. If a narrative screen description is unclear, present multiple interpretations rather than silently picking one. Push back if a simpler approach exists. Stop and ask rather than guess.

2. **Simplicity first.** No features beyond what was asked. No abstractions for single-use code. No "flexibility" that wasn't requested. No error handling for impossible scenarios. The test: would a senior engineer say this is overcomplicated? If yes, rewrite it.

3. **Surgical changes.** Don't "improve" adjacent code. Don't refactor things that aren't broken. Match the existing style even if you'd do it differently. If you notice unrelated dead code, mention it, don't delete it. Every changed line should trace directly to the request.

4. **Goal-driven execution.** Transform "fix the bug" into "write a test that reproduces it, then make it pass." Transform "add a screen" into "add the type, add the fixture, add the component, verify it renders from `useScenario()`." Give it success criteria and loop until done.

---

## Tech Stack (Exact Versions)

```bash
npm create vite@latest data-foundry-healthcare -- --template react-ts
cd data-foundry-healthcare
npm install react-router-dom zustand recharts @tanstack/react-table reactflow dagre lucide-react date-fns react-plotly.js plotly.js-dist-min react-resizable-panels
npm install -D @tailwindcss/vite @types/dagre
```

| Layer | Tool | Version |
|---|---|---|
| Build | Vite | 7.x |
| UI | React | 19.x |
| Language | TypeScript | 5.9+ strict |
| Styling | Tailwind CSS | 4.x via `@tailwindcss/vite` |
| Routing | React Router | 7.x |
| State | Zustand | 5.x |
| Charts | Recharts | 3.x (dashboards, progress bars) |
| Time-series | Plotly.js (`react-plotly.js` + `plotly.js-dist-min`) | 2.x (Annotation Studio only) |
| Tables | TanStack Table | 8.x |
| Graph/DAG | ReactFlow + dagre | 11.x / 0.8.x |
| Icons | lucide-react | latest |
| Dates | date-fns | 3.x |
| Resizable panels | react-resizable-panels | latest |

**No other UI libraries.** No MUI, Chakra, Ant, Radix, shadcn. All components hand-built with Tailwind.

---

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx              # TopBar + Sidebar + Outlet wrapper
│   │   ├── TopBar.tsx                # Logo, workspace name, deal timer, status indicators
│   │   ├── Sidebar.tsx               # Product navigation (WORKSPACE, INTEGRATION, CLINICAL, ANALYTICS, SYSTEM)
│   │   └── ScreenContainer.tsx       # Consistent padding + max-width for screen content
│   │
│   ├── data-display/
│   │   ├── DataTable.tsx             # Generic TanStack Table wrapper — sortable, filterable, expandable rows
│   │   ├── MetricCard.tsx            # Dashboard KPI card (label, value in JetBrains Mono, optional trend icon)
│   │   ├── MiniProgressBar.tsx       # 4px stacked bar (green/amber/gray) for worklist rows
│   │   ├── StackedProgressBar.tsx    # 8px stacked bar with fraction text for panel headers
│   │   ├── EvidenceCard.tsx          # PA evidence item: source badge, content, confidence, date
│   │   ├── RequirementRow.tsx        # PA requirement child row: status icon, text, confidence tier
│   │   ├── RequirementCategory.tsx   # PA requirement parent: chevron, name, fractional badge, children
│   │   ├── FindingCard.tsx           # AI finding: collapsed/expanded states, reasoning trace
│   │   ├── ClinicalEventCard.tsx     # Clinical event: icon, date, description, provenance chip
│   │   └── FeatureRow.tsx            # Model Builder feature row: name, sources, coverage, literature
│   │
│   ├── feedback/
│   │   ├── ConfidenceBadge.tsx       # Three-tier: High (green dot), Review (amber + %), Manual (red + %)
│   │   ├── StatusBadge.tsx           # Pill badges: Integrated/Review, Ready/In Review/Incomplete, Met/Missing
│   │   ├── SourceBadge.tsx           # Color-coded provenance pill with system icon, hover tooltip
│   │   ├── DealTimer.tsx             # "Day N of M — Label" with progress bar, color transitions
│   │   ├── SLACountdown.tsx          # Dual countdown (Days to Surgery + Payer SLA), three-state color
│   │   ├── ProcessingOverlay.tsx     # Multi-step processing animation (connecting, discovering, annotating...)
│   │   └── Toast.tsx                 # Bottom-left toast with undo, stacks to 3, auto-dismiss
│   │
│   ├── interactive/
│   │   ├── BulkActionBar.tsx         # Sticky top bar on selection: count, Accept All High, Flag, Reassign
│   │   ├── AccordionChecklist.tsx    # Two-level accordion with worst-case roll-up, expand/collapse controls
│   │   ├── ViewToggle.tsx            # Cards | Timeline toggle for evidence panel
│   │   ├── SourceCategoryTabs.tsx    # All | EMR | Lab | Imaging | PT | Pharmacy tab bar
│   │   ├── PatientSwitcher.tsx       # Horizontal strip of patient cards with risk indicators
│   │   └── KeyboardShortcutLegend.tsx # Modal triggered by `?`, grouped by context
│   │
│   ├── visualization/
│   │   ├── TopologyGraph.tsx         # ReactFlow: source system nodes, concept linkage edges
│   │   ├── ConceptDAG.tsx            # ReactFlow: clinical concept → coding systems → payer criteria
│   │   ├── SwimLaneTimeline.tsx      # Horizontal timeline: lanes by source, zoom, minimap, requirement bands
│   │   └── TimeSeriesChart.tsx       # Plotly: dual-trace (actual + expected), change-point annotations, anomaly overlay
│   │
│   ├── clinical/
│   │   ├── PatientInfoPanel.tsx      # Left panel: demographics, diagnoses, meds, allergies, pre-op values
│   │   ├── ClinicalEventsTimeline.tsx # Plotly: event markers on categorical timeline, source-colored
│   │   └── ReasoningNarrative.tsx    # Structured clinical reasoning document (hero fixture rendering)
│   │
│   └── ErrorBoundary.tsx
│
├── screens/
│   ├── LandingPage.tsx               # Workspace selector: Summit Orthopedics Group card
│   ├── workspace/
│   │   ├── Dashboard.tsx             # Metric cards + source system summary table
│   │   └── Sources.tsx               # ReactFlow topology graph of connected systems
│   ├── integration/
│   │   ├── SchemaExplorer.tsx        # Field mapping table with confidence, expandable detail
│   │   ├── ConceptMap.tsx            # DAG visualization of concept linkages across coding systems
│   │   └── PayerCriteria.tsx         # Comparison grid: criteria × payers, divergence indicators
│   ├── clinical/
│   │   ├── PatientRecords.tsx        # All-records table with raw/normalized side-by-side expansion
│   │   ├── PAWorklist.tsx            # Case queue with priority, deadlines, mini progress bars
│   │   └── PADetail.tsx              # Three-panel workspace: context + evidence + requirements
│   ├── analytics/
│   │   ├── ModelBuilderProject.tsx   # Feature table, literature, coverage, assembly action
│   │   ├── ModelBuilderDataset.tsx   # Assembled training data table with quality indicators
│   │   └── AnnotationStudio.tsx      # Three-panel: clinical info + time-series + context (findings/reasoning)
│   └── system/
│       └── PipelineHealth.tsx        # Alert feed: schema drift, sync status, criteria updates
│
├── scenarios/
│   ├── ScenarioContext.tsx           # Provider: Map<string, ScenarioData>, useScenario() hook, resets stores on scenario change
│   ├── manifest.ts                   # Scenario registry — the ONE file to edit when adding a scenario
│   ├── types.ts                      # ScenarioData interface, all domain type imports
│   └── summit-ortho/
│       ├── _constants.ts             # All shared values for Summit Orthopedics scenario (authoring convenience — values flow into domain fields at assembly)
│       ├── systems.ts                # Source system definitions (Epic, Athenahealth, ModMed, eCW, WebPT, etc.)
│       ├── schema-fields.ts          # Hero + filler field annotations with confidence tiers
│       ├── payer-criteria.ts         # Named payer criteria per procedure type (BCBS MA, Aetna MA, United, Humana)
│       ├── patients.ts               # Patient records: hero patient M.K. + filler patients
│       ├── pa-cases.ts               # PA worklist cases with evidence and requirement linkages
│       ├── pa-requirements.ts        # Payer-specific requirement hierarchies (TKA criteria per payer)
│       ├── pa-evidence.ts            # Evidence items with source provenance, confidence, extracted values
│       ├── model-features.ts         # Feature definitions with coverage, literature citations
│       ├── training-data.ts          # Assembled training dataset (filler rows via deterministic PRNG)
│       ├── biometric-streams.ts      # Temp + HR time-series data, expected curves, change-point data
│       ├── clinical-events.ts        # Post-op events timeline (surgery, ambulation, wound check, etc.)
│       ├── ai-findings.ts            # AI finding definitions with reasoning traces, knowledge base citations
│       ├── pipeline-alerts.ts        # Schema drift alerts, criteria update alerts
│       ├── snapshots.ts              # Store snapshot definitions: day-22, pa-active, model-ready
│       ├── validate.ts               # Build-time validation (collect-then-throw, not console.assert)
│       └── index.ts                  # Assembly: imports all above → single ScenarioData object
│
├── scripts/
│   └── new-scenario.ts              # Scaffold script: generates scenario directory with boilerplate files
│
├── store/
│   ├── scenarioStore.ts              # Active scenario ID, persisted to sessionStorage
│   ├── paStore.ts                    # PA workflow: case selection, requirement acceptance, bulk actions
│   ├── schemaStore.ts                # Schema Explorer: field acceptance, bulk accept progress
│   ├── modelStore.ts                 # Model Builder: feature selection, assembly state, processing phase
│   ├── annotationStore.ts            # Annotation Studio: finding approval, patient selection
│   └── resetDemo.ts                  # resetAllStores() — wired to Ctrl+Shift+R
│
├── hooks/
│   ├── useAnimatedCounter.ts         # Ease-out cubic counter animation
│   ├── useKeyboardShortcuts.ts       # Global keyboard shortcut registration, context-aware
│   ├── useLinkedHighlight.ts         # Bidirectional highlight state: selected requirement ↔ evidence
│   ├── usePanelResize.ts             # react-resizable-panels localStorage persistence
│   └── useUrlParams.ts              # ?demo= and ?scenario= URL parameter reading
│
├── types/
│   ├── system.ts                     # SourceSystem, SystemField, SchemaAnnotation
│   ├── patient.ts                    # Patient, PatientRecord, IdentityMatch
│   ├── pa.ts                         # PACase, PARequirementCategory, PARequirement, PAEvidence
│   ├── payer.ts                      # PayerCriteria, PayerCriterionCell, PayerDivergence
│   ├── model.ts                      # ModelProject, ModelFeature, TrainingRecord, LiteratureCitation
│   ├── clinical.ts                   # BiometricStream, ClinicalEvent, ExpectedCurve, ChangePoint
│   ├── annotation.ts                 # AIFinding, ReasoningTrace, SignalContribution, DifferentialItem, KBSource
│   ├── pipeline.ts                   # PipelineAlert, SchemaChange, CriteriaUpdate
│   └── scenario.ts                   # ScenarioData, ScenarioSnapshot, CompanyInfo, DealTimerConfig, DashboardSummary, PAWorkbenchData, AnalyticsModuleData
│
├── utils/
│   ├── colors.ts                     # COLORS constant, SOURCE_COLORS per system, CHANNEL_COLORS
│   ├── formatters.ts                 # formatCurrency, formatPercentage, formatNumber, formatDelta, formatDate
│   ├── prng.ts                       # mulberry32 deterministic PRNG
│   ├── layoutGraph.ts                # dagre layout helpers for TopologyGraph and ConceptDAG
│   └── validation.ts                 # Assertion helpers used by scenario validate.ts files
│
├── styles/
│   └── globals.css                   # CSS custom properties, font imports (Inter, JetBrains Mono)
│
├── App.tsx                           # React Router config, AppShell wrapper, route definitions
└── main.tsx                          # Scenario registration, URL param reading, snapshot loading, React render
```

---

## Core Invariant

**Screens are templates. Data is swappable.** No screen knows which scenario is active. No screen contains conditional logic for "Summit Orthopedics." All screens consume data exclusively through `useScenario()`. The Summit Orthopedics scenario is the only scenario currently, but the architecture supports adding Meridian or any other scenario without touching screen code.

---

## Scenario Manifest and Registration

### `manifest.ts` — The Scenario Registry

`main.tsx` never imports scenario assemblies directly. It imports only from the manifest. This is the single file an AI agent edits when adding a new scenario.

```ts
// src/scenarios/manifest.ts
// To add a new scenario, run: npx tsx scripts/new-scenario.ts <id> "<Company Name>"
import { summitOrthoData } from './summit-ortho';
// import { meridianData } from './meridian';

export const SCENARIOS: Array<{ id: string; data: ScenarioData }> = [
  { id: 'summit-ortho', data: summitOrthoData },
  // { id: 'meridian', data: meridianData },
];
```

TypeScript enforces that every entry's `data` field conforms to `ScenarioData` at the import boundary. If a scenario is missing a required field, the build fails here — not at runtime.

### `scripts/new-scenario.ts` — Scaffold Script

Generates the directory structure for a new scenario. Run:

```bash
npx tsx scripts/new-scenario.ts meridian "Meridian Software Group"
```

Creates:
- `src/scenarios/meridian/` directory
- `_constants.ts` with company name and empty constant groups
- Empty fixture files (one per domain) with correct type imports
- `index.ts` stub that satisfies `ScenarioData` (core fields populated from constants, optional modules set to `null`)
- `validate.ts` template with the collect-then-throw pattern
- Adds the import and registration line to `manifest.ts`

The generated code compiles immediately. The AI agent's job is to fill in the fixture data, not to wire up the plumbing.

---

## Data Pipeline

```
_constants.ts → domain fixtures → index.ts (assembly) → ScenarioContext → screens
```

This is the same four-layer pipeline from `demo_data_architecture.md`. Every rule in that document applies here without modification.

**Important:** The `_constants.ts` file is an authoring convenience for the scenario author. At the assembly layer (`index.ts`), constant values are mapped into the typed domain fields on `ScenarioData` (e.g., `SCHEMA_COUNTS.totalSystems` becomes `dashboardSummary.totalSystems`). Screens never read from `_constants.ts` — they read from the typed fields on the `ScenarioData` interface via `useScenario()`.

---

## Key Type Definitions

These are the primary interfaces that shape the `ScenarioData` object. Each type lives in the corresponding file under `src/types/`.

### `scenario.ts` — Top-Level Data Shape

Fields are grouped into **core** (required for all scenarios) and **optional modules** (nullable — set to `null` for scenarios that don't support a feature). Screens for optional modules guard with `if (!scenario.paWorkbench) return <Navigate to="/" />`.

There is no generic `constants` bag on this interface. The `_constants.ts` file in each scenario directory is an authoring convenience — the assembly file (`index.ts`) maps constant values into the typed domain fields below. This means every screen reads from fully typed fields, not an untyped bag, and adding a new scenario never requires changing this interface.

```ts
export interface ScenarioData {
  id: string;
  company: CompanyInfo;
  dealTimer: DealTimerConfig;

  // Core — required for all scenarios
  dashboardSummary: DashboardSummary;
  systems: SourceSystem[];
  schemaFields: SchemaAnnotation[];
  topology: TopologyConfig;
  pipelineAlerts: PipelineAlert[];
  storeSnapshots: Record<string, ScenarioSnapshot>;

  // Optional modules — null if the scenario doesn't support them
  paWorkbench: PAWorkbenchData | null;
  payerCriteria: PayerCriteriaSet | null;
  analytics: AnalyticsModuleData | null;
}

export interface DashboardSummary {
  totalSystems: number;
  totalFields: number;
  autoAnnotatedPercent: number;
  payerCriteriaSets: number;
}

export interface PAWorkbenchData {
  patients: Patient[];
  cases: PACase[];
}

export interface AnalyticsModuleData {
  modelProject: ModelProject;
  trainingData: TrainingRecord[];
  biometricStreams: BiometricStreamSet;
  clinicalEvents: ClinicalEvent[];
  aiFindings: AIFinding[];
}
```

### `system.ts` — Source Systems and Schema

```ts
export interface SourceSystem {
  id: string;
  name: string;            // "Summit Flagship — Epic"
  platform: string;        // "Epic", "Athenahealth", "ModMed", etc.
  accentColor: string;     // From SOURCE_COLORS
  locationCount: number;
  fieldCount: number;
  annotationCompletion: number; // 0–100
  lastSync: string;        // ISO timestamp
  status: 'integrated' | 'review';
}

export interface SchemaAnnotation {
  id: string;
  systemId: string;
  sourceTable: string;
  sourceField: string;
  dataType: string;
  sampleValues: string[];
  mappedConceptId: string;
  mappedConceptLabel: string;
  confidence: number;      // 0–100
  confidenceLevel: 'high' | 'medium' | 'low';
  status: 'auto-accepted' | 'pending-review' | 'manual';
  alternatives?: Array<{ conceptId: string; conceptLabel: string; confidence: number }>;
}
```

### `pa.ts` — Prior Authorization

```ts
export interface PACase {
  id: string;
  patientId: string;
  procedure: { cpt: string; description: string; laterality: 'right' | 'left' | 'bilateral' };
  payerId: string;
  payerName: string;
  filedDate: string;
  surgeryDate: string;
  slaDeadline: string;
  assignedTo: string;
  requirements: PARequirementCategory[];
  evidence: PAEvidence[];
  identityResolution: IdentityResolution;
}

export interface PARequirementCategory {
  id: string;
  name: string;               // "Conservative Therapy", "Radiographic Evidence", etc.
  children: PARequirement[];
}

export interface PARequirement {
  id: string;
  categoryId: string;
  criterionText: string;       // The payer's exact language
  status: 'met' | 'review' | 'missing';
  confidence?: number;         // For 'review' items
  linkedEvidenceIds: string[];
  highlightColor: string;      // From 6-color linking palette
  semanticInference?: {        // For 'review' items
    sourceText: string;
    mappedConcept: string;
    explanation: string;
    alternatives: Array<{ concept: string; confidence: number }>;
  };
  missingExplanation?: string; // For 'missing' items — why it's missing
}

export interface PAEvidence {
  id: string;
  sourceSystemId: string;
  sourceSystemName: string;
  recordType: string;          // "PT Session", "Office Visit", "Radiology Report", etc.
  date: string;
  description: string;
  extractedValues?: Record<string, string>; // { "LEFS Score": "28/80", "Drug": "Ibuprofen 800mg" }
  confidence: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  linkedRequirementIds: string[];
  identityNote?: string;       // "Patient matched via DOB + last name (92.8%)"
}
```

### `clinical.ts` — Biometrics and Time-Series

```ts
export interface BiometricStreamSet {
  temperature: BiometricChannel;
  heartRate: BiometricChannel;
}

export interface BiometricChannel {
  label: string;
  unit: string;
  color: string;
  actual: TimeSeriesPoint[];
  expected: TimeSeriesPoint[];      // Patient-specific recovery curve
  confidenceBand: { upper: TimeSeriesPoint[]; lower: TimeSeriesPoint[] };
  changePoints: ChangePoint[];
  anomalyRegions: Array<{ startDay: number; endDay: number }>;
}

export interface TimeSeriesPoint {
  timestamp: string;   // ISO or day offset
  value: number | null; // null for gaps
}

export interface ChangePoint {
  day: number;
  posteriorProbability: number;
  method: string;      // "Bayesian online CPD"
  expectedValue: number;
  observedValue: number;
  unit: string;
}

export interface ClinicalEvent {
  id: string;
  day: number;
  type: string;         // "surgery", "ambulation", "pt-eval", "discharge", "wound-check", "antibiotic"
  title: string;
  description: string;
  sourceSystemId: string;
  icon: string;         // lucide icon name
  knowledgeContext?: string; // Knowledge-context annotation for events relevant to AI findings
}
```

### `annotation.ts` — AI Findings and Reasoning

```ts
export interface AIFinding {
  id: string;
  title: string;
  onsetDay: number;
  confidence: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  detectionMethod: string;
  signalContributions: SignalContribution[];
  knowledgeSources: KBSource[];
  differential: DifferentialItem[];
  clinicalCorrelates: Array<{ eventId: string; relationship: string }>;
  reasoningNarrative: string;  // The full structured narrative text (Markdown)
  status: 'pending' | 'approved' | 'rejected';
}

export interface SignalContribution {
  signal: string;       // "Temp trajectory deviation"
  percentage: number;   // 42
  color: string;        // Segment color for stacked bar
  detail: string;       // One-line explanation
}

export interface KBSource {
  id: string;
  label: string;        // "Post-TKA SSI risk factors (AAOS 2023)"
  excerpt: string;      // Brief quote shown on click
}

export interface DifferentialItem {
  condition: string;    // "DVT"
  probability: 'high' | 'low';
  reasoning: string;    // "No unilateral pattern, prophylactic anticoagulation active"
}
```

### `model.ts` — Model Builder

```ts
export interface ModelProject {
  name: string;
  targetVariable: string;
  population: string;
  status: 'draft' | 'features-selected' | 'assembling' | 'assembled' | 'training';
  eligibleCases: number;
  contributingSites: number;
  totalSites: number;
  featureCompleteness: number;   // 0–100
  casesWithBiometrics: number;
  features: ModelFeature[];
}

export interface ModelFeature {
  id: string;
  name: string;
  category: 'pre-op' | 'procedure' | 'post-op-biometric';
  sources: string[];             // Source system names
  coverageSites: string;         // "18/20 sites"
  coverageCases: string;         // "89% of cases"
  mappingConfidence: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  literatureCitations: LiteratureCitation[];
  included: boolean;
  normalizationNote?: string;    // "Normalized F→C across sites"
}

export interface LiteratureCitation {
  title: string;
  source: string;               // Journal/org name
  year: number;
  relevanceScore: number;
}
```

---

## Zustand Stores

Each store manages one domain of demo interaction state. Every store exposes `reset()`.

### Store Reset on Scenario Change

`ScenarioContext.tsx` resets all stores when the active scenario changes. This prevents stale state (e.g., Summit Ortho requirement IDs) from persisting into a different scenario.

```tsx
// In ScenarioContext.tsx
useEffect(() => {
  resetAllStores();
  // Apply snapshot AFTER reset, if a ?scenario= param is present
  const snapshotName = searchParams.get('scenario');
  if (snapshotName && activeScenario.storeSnapshots[snapshotName]) {
    applySnapshot(activeScenario.storeSnapshots[snapshotName]);
  }
}, [scenarioId]);
```

**Order matters:** reset first, then apply snapshot. If reversed, the snapshot state is immediately wiped.

### `scenarioStore.ts`

```ts
interface ScenarioStoreState {
  scenarioId: string;
  setScenario: (id: string) => void;
}
```

Persisted to `sessionStorage` via Zustand `persist` middleware.

### `paStore.ts`

```ts
interface PAStoreState {
  selectedCaseId: string | null;
  acceptedRequirementIds: string[];    // Requirements moved from 'review' to 'met'
  highlightedRequirementId: string | null;
  highlightedEvidenceId: string | null;
  evidenceView: 'cards' | 'timeline';
  bulkAcceptedCount: number;
  selectCase: (id: string) => void;
  acceptRequirement: (id: string) => void;
  setHighlightedRequirement: (id: string | null) => void;
  setHighlightedEvidence: (id: string | null) => void;
  setEvidenceView: (view: 'cards' | 'timeline') => void;
  bulkAcceptHigh: () => void;
  reset: () => void;
}
```

### `schemaStore.ts`

```ts
interface SchemaStoreState {
  acceptedFieldIds: string[];
  bulkAccepted: boolean;
  acceptField: (id: string) => void;
  bulkAcceptHigh: () => void;
  reset: () => void;
}
```

### `modelStore.ts`

```ts
interface ModelStoreState {
  excludedFeatureIds: string[];
  assemblyPhase: 'idle' | 'connecting' | 'resolving' | 'normalizing' | 'validating' | 'assembling' | 'complete';
  toggleFeature: (id: string) => void;
  startAssembly: () => void;
  advancePhase: () => void;
  reset: () => void;
}
```

### `annotationStore.ts`

```ts
interface AnnotationStoreState {
  selectedPatientId: string;
  approvedFindingIds: string[];
  rejectedFindingIds: string[];
  selectedFindingId: string | null;
  selectedEventId: string | null;
  activeTab: 'timeline' | 'events' | 'findings' | 'reasoning';
  selectPatient: (id: string) => void;
  approveFinding: (id: string) => void;
  rejectFinding: (id: string) => void;
  setSelectedFinding: (id: string | null) => void;
  setSelectedEvent: (id: string | null) => void;
  setActiveTab: (tab: string) => void;
  reset: () => void;
}
```

---

## Routing

```tsx
// App.tsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route element={<AppShell />}>
    {/* WORKSPACE */}
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/sources" element={<Sources />} />
    {/* INTEGRATION */}
    <Route path="/schema-explorer" element={<SchemaExplorer />} />
    <Route path="/concept-map" element={<ConceptMap />} />
    <Route path="/payer-criteria" element={<PayerCriteria />} />
    {/* CLINICAL */}
    <Route path="/patient-records" element={<PatientRecords />} />
    <Route path="/pa-workbench" element={<PAWorklist />} />
    <Route path="/pa-workbench/:caseId" element={<PADetail />} />
    {/* ANALYTICS */}
    <Route path="/model-builder" element={<ModelBuilderProject />} />
    <Route path="/model-builder/dataset" element={<ModelBuilderDataset />} />
    <Route path="/annotation-studio" element={<AnnotationStudio />} />
    {/* SYSTEM */}
    <Route path="/pipeline-health" element={<PipelineHealth />} />
  </Route>
</Routes>
```

The `AppShell` layout wraps all routes except the landing page. It renders `TopBar` + `Sidebar` + `<Outlet />`. The sidebar highlights the active route. The `TopBar` includes the deal timer, which reads from `useScenario().dealTimer`.

No persona-based routing in this demo — all screens are in a single flat navigation.

### Screens for Optional Modules

Screens that depend on optional module fields guard with a null check:

```tsx
// Example: PAWorklist.tsx
const scenario = useScenario();
if (!scenario.paWorkbench) return <Navigate to="/dashboard" replace />;
const { cases, patients } = scenario.paWorkbench;
```

The `Sidebar` reads the active scenario to show/hide navigation items for null modules — if `scenario.paWorkbench` is null, the PA Workbench sidebar item is not rendered.

---

## Constants File Structure (`_constants.ts`)

Every value that appears on more than one screen is defined in the scenario's `_constants.ts`. This file is the scenario author's single source of truth — change a value here and all downstream fixture files pick it up.

**However, screens never read from `_constants.ts` directly.** At assembly time (`index.ts`), constant values are mapped into the typed domain fields on `ScenarioData`. This is what makes the `ScenarioData` interface scenario-agnostic — it has no `SummitConstants` type, just typed domain fields that any scenario can populate.

```ts
// src/scenarios/summit-ortho/_constants.ts

// === Company ===
export const COMPANY = { name: 'Summit Orthopedics Group', industry: 'Orthopedics', locationCount: 20 } as const;
export const DEAL_TIMER = { currentDay: 22, totalDays: 90, label: 'Integration Sprint' } as const;

// === Dashboard Summary (maps to ScenarioData.dashboardSummary at assembly) ===
export const SCHEMA_COUNTS = { totalSystems: 20, totalFields: 4_847, autoAnnotated: 94.2, payerCriteriaSets: 12 } as const;

// === Source Systems (Situation 1) ===
export const SYSTEM_IDS = { EPIC: 'epic-flagship', ATHENA: 'athena-midsize', MODMED: 'modmed-small', ECW: 'ecw-small', WEBPT: 'webpt-pt', PHARMACY: 'pharmacy-feed', RADIOLOGY: 'radiology' } as const;

// === PA Workbench (Situation 2) ===
export const PA_COUNTS = { pending: 34, ready: 12, needEvidence: 8, inPayerReview: 14 } as const;
export const PA_HERO_CASE = { patientInitials: 'M.K.', mrn: '4821937' } as const;
export const REQUIREMENT_COUNTS = { total: 12, met: 8, review: 2, missing: 2 } as const;

// === Payer Names (Situation 3) ===
export const PAYER_IDS = { BCBS: 'bcbs-ma', AETNA: 'aetna-ma', UNITED: 'united', HUMANA: 'humana-ma' } as const;

// === Model Builder (Situation 4) ===
export const MODEL_COUNTS = { eligibleCases: 3_247, sites: 18, totalSites: 20, completeness: 94, withBiometrics: 2_891 } as const;

// === Source System Colors ===
export const SOURCE_COLORS = {
  [SYSTEM_IDS.EPIC]: '#3B82F6',
  [SYSTEM_IDS.ATHENA]: '#8B5CF6',
  [SYSTEM_IDS.MODMED]: '#F97316',
  [SYSTEM_IDS.ECW]: '#F59E0B',
  [SYSTEM_IDS.WEBPT]: '#22C55E',
  [SYSTEM_IDS.PHARMACY]: '#D97706',
  [SYSTEM_IDS.RADIOLOGY]: '#F43F5E',
} as const;

// === Linking Palette (PA bidirectional highlighting) ===
export const LINKING_COLORS = ['#3B82F6', '#22C55E', '#D97706', '#8B5CF6', '#F43F5E', '#14B8A6'] as const;
```

**Assembly example** — how constants flow into `ScenarioData`:

```ts
// src/scenarios/summit-ortho/index.ts (excerpt)
import { COMPANY, DEAL_TIMER, SCHEMA_COUNTS } from './_constants';
import type { ScenarioData } from '../types';

export const summitOrthoData: ScenarioData = {
  id: 'summit-ortho',
  company: { name: COMPANY.name, industry: COMPANY.industry, locationCount: COMPANY.locationCount },
  dealTimer: { ...DEAL_TIMER },
  dashboardSummary: {
    totalSystems: SCHEMA_COUNTS.totalSystems,
    totalFields: SCHEMA_COUNTS.totalFields,
    autoAnnotatedPercent: SCHEMA_COUNTS.autoAnnotated,
    payerCriteriaSets: SCHEMA_COUNTS.payerCriteriaSets,
  },
  systems: SYSTEMS,           // from systems.ts
  schemaFields: ALL_FIELDS,   // from schema-fields.ts
  topology: TOPOLOGY_CONFIG,  // from systems.ts
  pipelineAlerts: ALERTS,     // from pipeline-alerts.ts
  storeSnapshots: SNAPSHOTS,  // from snapshots.ts
  paWorkbench: { patients: PATIENTS, cases: PA_CASES },  // from patients.ts, pa-cases.ts
  payerCriteria: PAYER_CRITERIA_SET,                       // from payer-criteria.ts
  analytics: { modelProject: MODEL, trainingData: TRAINING, biometricStreams: STREAMS, clinicalEvents: EVENTS, aiFindings: FINDINGS },
};
```

---

## Build-Time Validation (`validate.ts`)

Validation runs at module load in dev mode and at build time. Uses a **collect-then-throw** pattern — all errors are gathered into an array, then a single error is thrown listing all of them. This matches `demo_design_guide.md` Section 6.5.

**Do not use `console.assert`.** In Node.js, `console.assert` logs but does not throw — the build will pass with broken data. Use the `check()` helper from `src/utils/validation.ts`:

```ts
// src/utils/validation.ts
export function createValidator(scenarioId: string) {
  const errors: string[] = [];

  function check(condition: boolean, message: string) {
    if (!condition) errors.push(message);
  }

  function finish() {
    if (errors.length > 0) {
      throw new Error(
        `[${scenarioId}] ${errors.length} validation error(s):\n${errors.map(e => `  - ${e}`).join('\n')}`
      );
    }
  }

  return { check, finish };
}
```

Each scenario's `validate.ts` uses this:

```ts
// src/scenarios/summit-ortho/validate.ts
import { createValidator } from '../../utils/validation';
import { REQUIREMENT_COUNTS, PA_COUNTS } from './_constants';
import { summitOrthoData } from './index';

export function validateSummitOrtho() {
  const { check, finish } = createValidator('summit-ortho');

  // PA module must exist for this scenario
  check(summitOrthoData.paWorkbench !== null, 'PA workbench module is null');

  if (summitOrthoData.paWorkbench) {
    // Requirement math: met + review + missing = total
    const heroCase = summitOrthoData.paWorkbench.cases.find(c => c.id === 'case-mk');
    check(!!heroCase, 'Hero case case-mk not found');

    if (heroCase) {
      const reqs = heroCase.requirements.flatMap(cat => cat.children);
      const met = reqs.filter(r => r.status === 'met').length;
      const review = reqs.filter(r => r.status === 'review').length;
      const missing = reqs.filter(r => r.status === 'missing').length;
      check(met === REQUIREMENT_COUNTS.met, `Met count: ${met} !== ${REQUIREMENT_COUNTS.met}`);
      check(review === REQUIREMENT_COUNTS.review, `Review count: ${review} !== ${REQUIREMENT_COUNTS.review}`);
      check(missing === REQUIREMENT_COUNTS.missing, `Missing count: ${missing} !== ${REQUIREMENT_COUNTS.missing}`);
      check(met + review + missing === REQUIREMENT_COUNTS.total, `Total: ${met + review + missing} !== ${REQUIREMENT_COUNTS.total}`);
    }

    // PA worklist counts
    check(summitOrthoData.paWorkbench.cases.length >= PA_COUNTS.pending, 'PA case count too low');
  }

  // Analytics module must exist for this scenario
  check(summitOrthoData.analytics !== null, 'Analytics module is null');

  if (summitOrthoData.analytics) {
    const { modelProject, biometricStreams } = summitOrthoData.analytics;
    check(modelProject.features.length > 0, 'Model features empty');
    check(modelProject.features.every(f => f.coverageSites !== ''), 'Feature missing coverage');
    check(
      biometricStreams.temperature.actual.length === biometricStreams.heartRate.actual.length,
      'Biometric stream length mismatch'
    );
    check(
      biometricStreams.temperature.expected.length === biometricStreams.temperature.actual.length,
      'Expected curve length mismatch'
    );
  }

  // Dashboard summary consistency
  check(
    summitOrthoData.dashboardSummary.totalSystems === summitOrthoData.systems.length,
    `Dashboard totalSystems (${summitOrthoData.dashboardSummary.totalSystems}) !== systems array length (${summitOrthoData.systems.length})`
  );

  finish(); // throws if any errors were collected
}
```

The scenario's `index.ts` calls the validation function as a side-effect:

```ts
// src/scenarios/summit-ortho/index.ts (bottom of file)
if (import.meta.env.DEV) {
  validateSummitOrtho();
}
```

---

## Store Snapshots

Three snapshots defined in `src/scenarios/summit-ortho/snapshots.ts`, loaded via `?scenario=` URL param.

| Snapshot | What it sets |
|---|---|
| `day-22` | Default state. Schema store: no bulk accepts yet. PA store: no case selected. Model store: idle. |
| `pa-active` | PA store: hero case M.K. selected, evidence view on cards, 0 requirements accepted yet. |
| `model-ready` | Model store: assembly complete. Annotation store: hero patient M.K. selected, active tab = reasoning. |

---

## Screen → Data Dependencies

Each screen reads from `useScenario()` only. This table maps screens to the `ScenarioData` fields they consume and the stores they interact with.

| Screen | ScenarioData fields | Module | Stores | Key components |
|---|---|---|---|---|
| Dashboard | `dashboardSummary`, `systems`, `dealTimer` | core | — | MetricCard, DataTable, StatusBadge |
| Sources | `systems`, `topology` | core | — | TopologyGraph, ConfidenceBadge |
| SchemaExplorer | `schemaFields`, `systems` | core | `schemaStore` | DataTable, ConfidenceBadge, BulkActionBar |
| ConceptMap | `schemaFields`, `payerCriteria` | core + payerCriteria | — | ConceptDAG |
| PayerCriteria | `payerCriteria` | payerCriteria | — | DataTable, StatusBadge |
| PAWorklist | `paWorkbench.cases`, `paWorkbench.patients` | paWorkbench | `paStore` | DataTable, MiniProgressBar, SLACountdown, BulkActionBar |
| PADetail | `paWorkbench.cases`, `paWorkbench.patients` | paWorkbench | `paStore` | EvidenceCard, RequirementCategory, SwimLaneTimeline, SourceBadge, ConfidenceBadge, AccordionChecklist |
| PatientRecords | `paWorkbench.patients`, `paWorkbench.cases[].evidence` | paWorkbench | — | DataTable, SourceBadge, ConfidenceBadge |
| ModelBuilderProject | `analytics.modelProject` | analytics | `modelStore` | MetricCard, FeatureRow, ProcessingOverlay |
| ModelBuilderDataset | `analytics.modelProject`, `analytics.trainingData` | analytics | `modelStore` | DataTable, MetricCard |
| AnnotationStudio | `analytics.biometricStreams`, `analytics.clinicalEvents`, `analytics.aiFindings`, `paWorkbench.patients` | analytics + paWorkbench | `annotationStore` | PatientSwitcher, PatientInfoPanel, TimeSeriesChart, ClinicalEventsTimeline, FindingCard, ReasoningNarrative |
| PipelineHealth | `pipelineAlerts` | core | — | MetricCard, DataTable, StatusBadge |

**Module column** indicates which module field(s) each screen depends on. Screens depending on optional modules must null-guard and redirect if the module is null. The Sidebar hides navigation items for null modules.

---

## Data Authoring: Hero vs. Filler

Every data collection uses the hero-plus-filler pattern from `demo_design_guide.md` Section 7.

**Hero records** (hand-authored, appear in the screens the presenter clicks on):
- 7 source systems (Epic, Athenahealth, ModMed, eCW, WebPT, Pharmacy, Radiology)
- 5–8 hero schema fields showing interesting mappings (contractual adj, encounter date, etc.)
- 1 hero patient (M.K., 67F) with full clinical data
- 1 hero PA case with 12 requirements (8 met, 2 review, 2 missing) and ~15 evidence items
- 11 model features (5 pre-op, 4 procedure, 2 biometric)
- 1 hero AI finding with full reasoning trace
- 6 clinical events (surgery through antibiotic start)
- 2 hero pipeline alerts (schema drift, criteria update)

**Filler records** (deterministic PRNG, provide visual density):
- 13 additional source systems to reach 20 total
- ~4,800 additional schema fields (via `generatePlaceholderAnnotations`)
- 5–7 additional patients for the patient switcher strip
- ~30 additional PA cases for the worklist
- ~3,200 training data rows
- Additional pipeline alerts

All filler uses `mulberry32` seeded PRNG — same data on every page load.

### Filler Generator Contracts

Each domain has its own generator function. All generators share the same pattern: they take a count, a seed context string (used to derive the PRNG seed so different domains produce different-looking data), and domain-specific pools constraining which values are plausible. All generators live in the fixture file for their domain (e.g., `generateFillerPACases` lives in `pa-cases.ts`).

```ts
// Schema fields — generates field annotations for a specific system
function generateFillerSchemaFields(
  count: number,
  systemId: string,
  fieldPool: FieldEntry[],       // Realistic table/field combinations for this system type
  conceptPool: ConceptEntry[],   // Concepts this system type would realistically contain
  confidenceRange: [number, number],
): SchemaAnnotation[]

// PA cases — generates worklist entries with requirements and evidence stubs
function generateFillerPACases(
  count: number,
  seedContext: string,
  patientPool: PatientPool,      // Name patterns, MRN ranges, age/sex distributions
  payerPool: string[],           // Payer IDs to distribute across
  procedurePool: ProcedureEntry[], // CPT codes and descriptions
): PACase[]

// Patients — generates patient records for the switcher strip and worklist
function generateFillerPatients(
  count: number,
  seedContext: string,
  demographicPool: DemographicPool, // Name patterns, age ranges, diagnosis distributions
): Patient[]

// Training data — generates anonymized training rows matching the feature set
function generateFillerTrainingRows(
  count: number,
  seedContext: string,
  features: ModelFeature[],      // The feature definitions — each row needs a value per feature
  outcomeDistribution: { complication: number; noComplication: number }, // Target variable ratio
): TrainingRecord[]

// Pipeline alerts — generates operational alerts
function generateFillerAlerts(
  count: number,
  seedContext: string,
  systemPool: string[],          // System IDs to distribute across
  alertTypePool: string[],       // Alert types to sample from
): PipelineAlert[]
```

**PRNG seeding convention:** Derive the seed from the seed context string: `mulberry32(seedContext.length * 1000 + count)`. This ensures different domains and different counts produce different sequences, but the same inputs always produce the same output.

---

## Implementation Order

Build in this order. Each phase has a clear success criterion.

### Phase 1: Skeleton

Create the project, install dependencies, configure Vite + Tailwind, set up the routing structure with placeholder screens, and implement `AppShell` (TopBar + Sidebar + Outlet). Create `manifest.ts` with Summit Ortho as the first entry. Wire up `ScenarioContext` with store-reset-on-change behavior. Create the `scripts/new-scenario.ts` scaffold script.

**Done when:** `npm run dev` renders the app shell with working sidebar navigation between placeholder screens. Deal timer shows "Day 22 of 90." Landing page shows workspace selector. `manifest.ts` registers Summit Ortho. `npx tsx scripts/new-scenario.ts test-scenario "Test"` creates a compilable scenario skeleton.

### Phase 2: Constants and Core Types

Author `_constants.ts` and all type definitions in `src/types/`. Create the `ScenarioData` interface. Wire up `validate.ts` with initial assertions.

**Done when:** `npm run build` passes with zero type errors. Validation assertions run at dev startup.

### Phase 3: Situation 1 — Dashboard, Sources, Schema Explorer

Author system fixtures (hero + filler). Build `Dashboard`, `Sources` (TopologyGraph), and `SchemaExplorer`. Implement `MetricCard`, `DataTable`, `ConfidenceBadge`, `StatusBadge`, `SourceBadge`.

**Done when:** Dashboard shows 20 sources with real data. Clicking a node in Sources navigates to Schema Explorer filtered to that system. "Accept all High-confidence" works in Schema Explorer.

### Phase 4: Situation 2 — PA Workbench

Author PA fixtures (hero case M.K. + filler cases). Build `PAWorklist` and `PADetail`. Implement `EvidenceCard`, `RequirementCategory`, `RequirementRow`, `MiniProgressBar`, `StackedProgressBar`, `SLACountdown`, `BulkActionBar`, `AccordionChecklist`, `SwimLaneTimeline`.

**Done when:** Worklist renders with sortable columns, dual countdown timers, mini progress bars. Clicking M.K. opens the three-panel detail view. Bidirectional linked highlighting works between evidence and requirements. Timeline view renders swim lanes with requirement highlighting. Progress bar updates when a Review item is accepted. Keyboard shortcuts work.

### Phase 5: Situation 3 — Payer Criteria, Concept Map

Author payer criteria fixtures with named payers. Build `PayerCriteria` and `ConceptMap`. Implement `ConceptDAG`.

**Done when:** Criteria grid shows BCBS MA, Aetna MA, United, Humana with divergence column. Concept Map renders a navigable DAG for "right knee osteoarthritis."

### Phase 6: Situation 4 — Model Builder, Annotation Studio

Author model features, training data, biometric streams, clinical events, AI findings. Build `ModelBuilderProject`, `ModelBuilderDataset`, `AnnotationStudio`. Implement `PatientSwitcher`, `PatientInfoPanel`, `TimeSeriesChart`, `ClinicalEventsTimeline`, `FindingCard`, `ReasoningNarrative`, `FeatureRow`, `ProcessingOverlay`.

**Done when:** Model Builder shows feature table with coverage and literature. Processing overlay runs on "Assemble Dataset." Dataset view renders training data. Annotation Studio shows patient switcher, dual-trace time-series with expected curves and change-point annotations, clinical events timeline, four-tab context panel with reasoning narrative. Finding card expands to show signal contributions, knowledge base pills, differential, and clinical correlates.

### Phase 7: System + Snapshots + Polish

Build `PipelineHealth`. Author snapshot definitions. Wire up `Ctrl+Shift+R` reset. Implement URL parameter loading for `?scenario=`. Test all three snapshots.

**Done when:** All three snapshots load correctly via URL. Pipeline Health shows hero alerts. Global reset returns to landing page. `npm run build` passes with zero errors and all validation assertions pass.
