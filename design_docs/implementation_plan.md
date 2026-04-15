# Implementation Plan: Data Foundry Healthcare Demo

> **Audience:** AI coding agents (Claude Code, Cursor, etc.)
> **Source of truth:** `code_architecture.md` — when in doubt, that document wins.
> **Estimated task count:** ~45 subtasks across 7 phases.

---

## How to Use This Plan

Each **phase** is a sequential gate — Phase N+1 cannot start until Phase N's exit criteria pass. Within each phase, **subtasks** are grouped into **parallel tracks** that can run concurrently. Subtasks within a track are sequential (top to bottom).

**Context budget per subtask:** Each subtask is scoped to fit within a single agent session (~60K tokens of context). Subtasks list the exact files to create/modify and the reference docs to read. Do not read files not listed — it wastes context.

**Test-first convention:** Every phase starts with a validation or test subtask that defines "done." Write the test/validation first, then implement until it passes.

**File references use this format:** `src/types/scenario.ts` means `<project-root>/src/types/scenario.ts`.

---

## Phase Mapping

This plan intentionally separates data authoring (Phase 2) and component building (Phase 3) from screen integration (Phases 4–6) to maximize parallelism. The architecture doc's phases group these together by situation. Cross-reference:

| Plan Phase | Architecture Doc Phase | What Changed |
|---|---|---|
| 0 + 1 | Phase 1: Skeleton | Split scaffold from types/routing |
| 2 | Phase 2: Constants + Core Types | Expanded to all fixture data |
| 3 | (new) | Components extracted as standalone phase |
| 4 | Phase 3: Situation 1 | Screens only — data already authored |
| 5 | Phase 4: Situation 2 | Screens only |
| 4 (Track B) | Phase 5: Situation 3 | Merged payer criteria into integration screens |
| 6 | Phase 6: Situation 4 | Screens only |
| 7 | Phase 7: System + Polish | Same scope |

---

## Phase 0: Project Scaffold

**Goal:** Empty Vite + React + TypeScript project that compiles and renders a blank page.

**Parallel tracks:** None — single sequential track.

### 0.1 — Initialize project and install dependencies

**Create:** Project root via Vite CLI
**Reference:** `code_architecture.md` → Tech Stack section

```bash
npm create vite@latest data-foundry-healthcare -- --template react-ts
cd data-foundry-healthcare
npm install react-router-dom zustand recharts @tanstack/react-table reactflow dagre lucide-react date-fns react-plotly.js plotly.js-dist-min react-resizable-panels
npm install -D @tailwindcss/vite @types/dagre
```

Configure `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### 0.2 — Global styles and CSS custom properties

**Create:** `src/styles/globals.css`
**Reference:** `demo_design_guide.md` → Section 3.1 (color tokens), Section 3.3 (typography)

Contents:
- Google Fonts import (Inter, JetBrains Mono)
- Tailwind directives (`@import "tailwindcss"`)
- CSS custom properties for all color tokens (brand, status/RAG, confidence, overlay)
- Base styles: `font-family: 'Inter', sans-serif`, `font-size: 14px`

### 0.3 — Utility constants file

**Create:** `src/utils/colors.ts`
**Reference:** `demo_design_guide.md` → Section 3.1, `code_architecture.md` → utils section

Export `COLORS` constant object mirroring CSS custom properties (brand, status/RAG, confidence, overlay colors from `demo_design_guide.md`). Do NOT include `SOURCE_COLORS` here — those are scenario-specific and belong in each scenario's `_constants.ts` per the architecture doc's import rules.

### 0.4 — Utility functions

**Create (all in parallel):**
- `src/utils/formatters.ts` — `formatCurrency`, `formatPercentage`, `formatNumber`, `formatDelta`, `formatDate`
- `src/utils/prng.ts` — `mulberry32` deterministic PRNG (seed → () => number). Convention: `mulberry32(seedContext.length * 1000 + count)`
- `src/utils/layoutGraph.ts` — dagre layout helpers: `layoutNodes(nodes, edges, direction)` returning positioned nodes
- `src/utils/validation.ts` — `createValidator(scenarioId)` returning `{ check, finish }`

**Reference:** `code_architecture.md` → utils section, Build-Time Validation section

**Exit criteria:**
- `npm run dev` serves a blank page with correct fonts loaded
- `npm run build` exits 0
- Importing any utility function compiles without error

---

## Phase 1: Type Definitions and Scenario Infrastructure

**Goal:** All TypeScript interfaces defined. Scenario context provider and manifest wired up. Empty scenario skeleton compiles. Stores exist with `reset()`. Routing shell in place.

**Why this is one phase:** Types, stores, context, and routing are tightly coupled — a type change ripples into stores, context, and screens. Getting them right together prevents churn.

### Track A: Type Definitions

#### 1.A.1 — Core type files

**Create (all files in parallel):**
- `src/types/scenario.ts` — `ScenarioData`, `CompanyInfo`, `DealTimerConfig`, `TopologyConfig`, `TopologyNode`, `TopologyEdge`, `DashboardSummary`, `PAWorkbenchData`, `AnalyticsModuleData`, `PayerCriteriaSet`, `ScenarioSnapshot`
- `src/types/system.ts` — `SourceSystem`, `SchemaAnnotation`
- `src/types/patient.ts` — `Patient`, `PatientRecord`, `IdentityResolution`
- `src/types/pa.ts` — `PACase`, `PARequirementCategory`, `PARequirement`, `PAEvidence`
- `src/types/payer.ts` — `PayerCriteria`, `PayerCriterionCell`, `PayerDivergence`
- `src/types/model.ts` — `ModelProject`, `ModelFeature`, `TrainingRecord`, `LiteratureCitation`
- `src/types/clinical.ts` — `BiometricStreamSet`, `BiometricChannel`, `TimeSeriesPoint`, `ChangePoint`, `ClinicalEvent`
- `src/types/annotation.ts` — `AIFinding`, `SignalContribution`, `KBSource`, `DifferentialItem`
- `src/types/pipeline.ts` — `PipelineAlert`, `SchemaChange`, `CriteriaUpdate`

**Reference:** `code_architecture.md` → Key Type Definitions section (copy interfaces verbatim)

### Track B: Zustand Stores (depends on Track A — stores import from `src/types/`)

#### 1.B.1 — All store files

**Create (all files in parallel):**
- `src/store/scenarioStore.ts` — `scenarioId`, `setScenario()`, persisted to `sessionStorage`
- `src/store/paStore.ts` — `PAStoreState` interface per architecture doc
- `src/store/schemaStore.ts` — `SchemaStoreState` interface per architecture doc
- `src/store/modelStore.ts` — `ModelStoreState` interface per architecture doc, `assemblyPhase` union type
- `src/store/annotationStore.ts` — `AnnotationStoreState` interface per architecture doc, `AnnotationTab` type
- `src/store/resetDemo.ts` — `resetAllStores()` calling `reset()` on every store

**Reference:** `code_architecture.md` → Zustand Stores section

### Track C: Scenario Infrastructure (depends on Tracks A and B)

#### 1.C.1 — Scenario context and manifest

**Create:**
- `src/scenarios/types.ts` — re-exports all types needed by scenario files
- `src/scenarios/ScenarioContext.tsx` — `ScenarioProvider`, `useScenario()` hook, store-reset-on-change via `useEffect`, `?snapshot=` parameter reading and application
- `src/scenarios/manifest.ts` — `SCENARIOS` array with Summit Ortho stub entry (data satisfies `ScenarioData` with all required fields populated minimally and optional modules set to `null`)

**Reference:** `code_architecture.md` → Scenario Manifest section, ScenarioContext code sample

#### 1.C.2 — Summit Ortho constants stub

**Create:**
- `src/scenarios/summit-ortho/_constants.ts` — all constant groups from architecture doc (`COMPANY`, `DEAL_TIMER`, `SCHEMA_COUNTS`, `SYSTEM_IDS`, `PA_COUNTS`, `PA_HERO_CASE`, `REQUIREMENT_COUNTS`, `PAYER_IDS`, `MODEL_COUNTS`, `SOURCE_COLORS`, `LINKING_COLORS`)
- `src/scenarios/summit-ortho/index.ts` — imports constants, exports `summitOrthoData: ScenarioData` with all core fields populated from constants, optional modules set to `null`

**Reference:** `code_architecture.md` → Constants File Structure section, Assembly example

#### 1.C.3 — Scaffold script

**Create:** `src/scripts/new-scenario.ts`

Generates: scenario directory, `_constants.ts` stub, empty fixture files with correct type imports, `index.ts` stub satisfying `ScenarioData`, `validate.ts` template, and adds import + registration line to `manifest.ts`.

**Reference:** `code_architecture.md` → Scaffold Script section

### Track D: App Shell and Routing (depends on Tracks A, B, C)

#### 1.D.1 — Layout components

**Create:**
- `src/components/layout/AppShell.tsx` — TopBar + Sidebar + `<Outlet />`
- `src/components/layout/TopBar.tsx` — logo placeholder, workspace name from `useScenario().company.name`, deal timer placeholder
- `src/components/layout/Sidebar.tsx` — navigation sections (WORKSPACE, INTEGRATION, CLINICAL, ANALYTICS, SYSTEM) with active-route highlighting; reads `useScenario()` to hide items for null optional modules
- `src/components/layout/ScreenContainer.tsx` — consistent padding + max-width wrapper

**Reference:** `code_architecture.md` → File Structure (layout section), Routing section; `demo_design_guide.md` → Section 4 (sidebar), Section 3.4 (spacing)

#### 1.D.2 — Routing and entry point

**Create:**
- `src/App.tsx` — React Router config per architecture doc route table
- `src/main.tsx` — imports from manifest, registers scenarios, reads `?demo=` URL param, renders `ScenarioProvider` wrapping `App`
- `src/screens/LandingPage.tsx` — workspace selector with Summit Ortho card, "Enter Workspace" button navigating to `/dashboard`
- Placeholder screens (each file exports a component rendering its name): `Dashboard.tsx`, `Sources.tsx`, `SchemaExplorer.tsx`, `ConceptMap.tsx`, `PayerCriteria.tsx`, `PatientRecords.tsx`, `PAWorklist.tsx`, `PADetail.tsx`, `ModelBuilderProject.tsx`, `ModelBuilderDataset.tsx`, `AnnotationStudio.tsx`, `PipelineHealth.tsx`
- `src/components/ErrorBoundary.tsx`

**Reference:** `code_architecture.md` → Routing section, File Structure (screens section)

#### 1.D.3 — Hooks

**Create:**
- `src/hooks/useUrlParams.ts` — reads `?demo=` and `?snapshot=` URL parameters
- `src/hooks/useKeyboardShortcuts.ts` — global keyboard shortcut registration, wires `Ctrl+Shift+R` to `resetAllStores()`
- `src/hooks/useAnimatedCounter.ts` — ease-out cubic counter animation
- `src/hooks/useLinkedHighlight.ts` — bidirectional highlight state (stub — full implementation in Phase 4)
- `src/hooks/usePanelResize.ts` — react-resizable-panels localStorage persistence

**Reference:** `code_architecture.md` → hooks section

**Phase 1 exit criteria:**
- `npm run dev` renders AppShell with sidebar navigation between placeholder screens
- Landing page shows "Summit Orthopedics Group" workspace card; clicking it navigates to Dashboard
- TopBar shows "Day 22 of 90 — Integration Sprint"
- Sidebar highlights active route; PA Workbench and Analytics items hidden (modules are null)
- `Ctrl+Shift+R` resets to landing page
- `npm run build` exits 0
- `npx tsx src/scripts/new-scenario.ts test-scenario "Test"` creates a compilable scenario skeleton (delete after verifying)

---

## Phase 2: Summit Ortho Data Layer

**Goal:** All fixture data authored for the Summit Orthopedics scenario. Validation passes. `useScenario()` returns a fully populated `ScenarioData` object. No screens built yet (except placeholders).

**Why separate from screens:** Data authoring is the bottleneck — it requires careful cross-referencing against `ortho_scenario.md` and `meridian_data_bible.md`. Getting data right before building UI prevents rework.

**Filler generators:** All filler generators must follow the function signatures documented in `code_architecture.md` → "Filler Generator Contracts" subsection. PRNG seeding convention: `mulberry32(seedContext.length * 1000 + count)`.

### Track A: Validation First

#### 2.A.1 — Validation skeleton

**Create:** `src/scenarios/summit-ortho/validate.ts`
**Reference:** `code_architecture.md` → Build-Time Validation section

Write all validation assertions FIRST, referencing the constants. The validation will fail until fixture data is authored — that's intentional. Assertions to include:
- `dashboardSummary.totalSystems === systems.length`
- PA requirement counts: met + review + missing = total (8 + 2 + 2 = 12)
- Every `linkedEvidenceIds` entry in requirements maps to a real `PAEvidence.id`
- Every `linkedRequirementIds` entry in evidence maps to a real `PARequirement.id`
- Identity resolution `matchedSystems` IDs exist in `systems` array
- Model features count > 0, all have non-empty `coverageSites`
- Biometric stream lengths match (temperature.actual.length === heartRate.actual.length)
- Expected curve length matches actual curve length
- Pipeline alerts reference valid system IDs

Wire into `index.ts` as unconditional side-effect call (no DEV guard).

### Track B: Core Fixtures (parallel subtasks, depends on 2.A.1 existing)

#### 2.B.1 — Source systems

**Create:** `src/scenarios/summit-ortho/systems.ts`
**Reference:** `code_architecture.md` → Data Authoring section, `ortho_scenario.md`

Author 7 hero systems (Epic, Athenahealth, ModMed, eCW, WebPT, Pharmacy, Radiology) with full `SourceSystem` fields. Hand-author 13 additional filler systems to reach 20 total (no filler generator — the architecture doc doesn't define one for systems, and 20 records is small enough to hand-author with realistic names/platforms). Export `TOPOLOGY_CONFIG` (nodes + edges for ReactFlow graph).

#### 2.B.2 — Schema fields

**Create:** `src/scenarios/summit-ortho/schema-fields.ts`
**Reference:** `code_architecture.md` → Data Authoring section, Filler Generator Contracts subsection (`generateFillerSchemaFields` signature)

Author 5–8 hero `SchemaAnnotation` records showing interesting mappings (contractual adjustment, encounter date, etc.) with confidence tiers spanning high/medium/low. Generate ~4,800 filler fields via `generateFillerSchemaFields()`.

#### 2.B.3 — Pipeline alerts

**Create:** `src/scenarios/summit-ortho/pipeline-alerts.ts`

Author 2 hero alerts (schema drift, criteria update). Generate additional filler alerts.

### Track C: PA Fixtures (parallel with Track B)

#### 2.C.1 — Patients

**Create:** `src/scenarios/summit-ortho/patients.ts`
**Reference:** `code_architecture.md` → Data Authoring section, `ortho_scenario.md`, `demo_narratives.md` → Situation 2

Author hero patient M.K. (67F, right knee OA, TKA candidate) with full demographics, diagnoses, medications, allergies, pre-op values, and identity resolution across 3 systems. Generate 5–7 filler patients.

#### 2.C.2 — PA requirements and evidence

**Create (sequentially — evidence references requirements):**
- `src/scenarios/summit-ortho/pa-requirements.ts` — payer-specific TKA requirement hierarchies: 4 categories, 12 total requirements (8 met, 2 review, 2 missing). Each requirement has `linkedEvidenceIds`, `highlightColor` from linking palette, semantic inference for review items, missing explanation for missing items.
- `src/scenarios/summit-ortho/pa-evidence.ts` — ~15 evidence items with source provenance, confidence tiers, extracted values, linked requirement IDs, identity notes. Evidence types: PT sessions, office visits, radiology reports, lab results, pharmacy records.

**Reference:** `code_architecture.md` → pa.ts types, `prior_auth_workbench_design.md` → evidence patterns, `ortho_scenario.md` → clinical details

#### 2.C.3 — PA cases

**Create:** `src/scenarios/summit-ortho/pa-cases.ts`
**Depends on:** 2.C.1 (patients), 2.C.2 (requirements/evidence)

Author hero PA case for M.K. (case-mk) with full requirement and evidence linkages. Generate ~30 filler cases via `generateFillerPACases()`.

### Track D: Payer Criteria (parallel with Tracks B, C)

#### 2.D.1 — Payer criteria fixtures

**Create:** `src/scenarios/summit-ortho/payer-criteria.ts`
**Reference:** `code_architecture.md` → payer.ts types, `demo_narratives.md` → Situation 3

Author criteria for 4 payers (BCBS MA, Aetna MA, United, Humana) across TKA procedure type. Include divergence indicators between payers.

### Track E: Analytics Fixtures (parallel with Tracks B, C, D)

#### 2.E.1 — Model features and training data

**Create (sequentially — training data references features):**
- `src/scenarios/summit-ortho/model-features.ts` — 11 features (5 pre-op, 4 procedure, 2 biometric) with coverage, literature citations, mapping confidence
- `src/scenarios/summit-ortho/training-data.ts` — generate ~3,200 training rows via `generateFillerTrainingRows()` using feature definitions and deterministic PRNG

**Reference:** `code_architecture.md` → model.ts types, `demo_narratives.md` → Situation 4

#### 2.E.2 — Biometric streams and clinical events

**Create (parallel with each other):**
- `src/scenarios/summit-ortho/biometric-streams.ts` — temperature + heart rate channels: actual traces, expected recovery curves, confidence bands, change-point data, anomaly regions. ~30 days of post-op data.
- `src/scenarios/summit-ortho/clinical-events.ts` — 6 hero events (surgery, ambulation, PT eval, discharge, wound check, antibiotic start) with source provenance, lucide icon names, knowledge context annotations.

**Reference:** `code_architecture.md` → clinical.ts types, `ortho_scenario.md`

#### 2.E.3 — AI findings

**Create:** `src/scenarios/summit-ortho/ai-findings.ts`
**Depends on:** 2.E.2 (references clinical event IDs)

Author 1 hero AI finding with: signal contributions (stacked bar percentages summing to 100), knowledge base sources with excerpts, differential diagnosis items, clinical correlates linking to event IDs, full reasoning narrative in Markdown.

### Track F: Assembly and Snapshots (depends on ALL of Tracks B–E)

#### 2.F.1 — Scenario assembly

**Update:** `src/scenarios/summit-ortho/index.ts`

Import all fixture files. Populate full `ScenarioData` object with all optional modules non-null. Wire validation call at bottom of file (unconditional).

#### 2.F.2 — Store snapshots

**Create:** `src/scenarios/summit-ortho/snapshots.ts`
**Reference:** `code_architecture.md` → Store Snapshots section

Define 3 snapshots:
- `day-22` — default state (no bulk accepts, no case selected, model idle)
- `pa-active` — hero case M.K. selected, evidence view on cards, 0 requirements accepted
- `model-ready` — model assembly complete, hero patient selected, active tab = reasoning

**Phase 2 exit criteria:**
- `npm run build` exits 0 with zero type errors
- Validation runs and passes (all assertions green)
- Sidebar now shows PA Workbench and Analytics items (modules are no longer null)
- `useScenario()` returns a fully populated `ScenarioData` with: 20 systems, ~4,800 schema fields, 1 hero + filler patients, ~30 PA cases, 4 payer criteria sets, 11 model features, ~3,200 training rows, biometric streams, clinical events, AI findings, 3 snapshots

---

## Phase 3: Shared Components

**Goal:** All reusable components built and visually verified in isolation. No screen-level integration yet. Each component accepts data via props and renders correctly.

**Why before screens:** Components are the atomic building blocks. Building them first means screen implementation is pure composition — faster and less error-prone.

### Track A: Feedback Components (no dependencies between them)

All components in this track can be built in parallel.

#### 3.A.1 — ConfidenceBadge

**Create:** `src/components/feedback/ConfidenceBadge.tsx`
**Reference:** `demo_design_guide.md` → Section 5.1

Props: `level: 'high' | 'medium' | 'low'`, `value?: number`. Three variants: High = green dot + "High", Review = amber dot + percentage, Manual = red dot + percentage. Never color alone — always includes text label.

#### 3.A.2 — StatusBadge

**Create:** `src/components/feedback/StatusBadge.tsx`

Props: `status: string`, `variant?: 'default' | 'success' | 'warning' | 'error'`. Pill-shaped badge with configurable background color. Used for: Integrated/Review, Ready/In Review/Incomplete, Met/Missing.

#### 3.A.3 — SourceBadge

**Create:** `src/components/feedback/SourceBadge.tsx`

Props: `systemName: string`, `accentColor: string`. Color-coded provenance pill with hover tooltip showing full system name.

#### 3.A.4 — DealTimer

**Create:** `src/components/feedback/DealTimer.tsx`
**Reference:** `demo_design_guide.md` → Section 5.8

Props: `currentDay: number`, `totalDays: number`, `label: string`. Renders "Day N of M — Label" with progress bar. Color transitions: green (< 50%) → amber (50–80%) → red (> 80%).

#### 3.A.5 — SLACountdown

**Create:** `src/components/feedback/SLACountdown.tsx`
**Reference:** `prior_auth_workbench_design.md` → countdown patterns

Props: `surgeryDate: string`, `slaDeadline: string`. Dual countdown (Days to Surgery + Payer SLA). Three-state color: green (> 7 days), amber (3–7 days), red (< 3 days).

#### 3.A.6 — ProcessingOverlay

**Create:** `src/components/feedback/ProcessingOverlay.tsx`
**Reference:** `demo_design_guide.md` → Section 8.3

Props: `phases: string[]`, `currentPhase: number`, `isActive: boolean`. Full-screen overlay with phase list, active phase spinner, completed phase checkmarks.

#### 3.A.7 — Toast

**Create:** `src/components/feedback/Toast.tsx`

Props: `message: string`, `onUndo?: () => void`, `onDismiss: () => void`. Bottom-left position. Stacks to 3. Auto-dismiss after 5 seconds.

### Track B: Data Display Components (no dependencies between them)

#### 3.B.1 — MetricCard

**Create:** `src/components/data-display/MetricCard.tsx`
**Reference:** `demo_design_guide.md` → Section 5.3

Props: `label: string`, `value: string | number`, `trend?: { direction: 'up' | 'down' | 'flat', label: string }`. Value rendered in JetBrains Mono 700 24px. Card with `p-6`, `rounded-lg`, `border border-gray-200`.

#### 3.B.2 — DataTable

**Create:** `src/components/data-display/DataTable.tsx`
**Reference:** `demo_design_guide.md` → Section 5.5

Generic TanStack Table wrapper. Props: `columns: ColumnDef[]`, `data: T[]`, `expandable?: boolean`, `onRowClick?: (row: T) => void`. Sortable headers, filterable columns, expandable row detail. Table headers: Inter 600 uppercase 12px. Cell numbers: JetBrains Mono 400 14px. Row height: 36px.

#### 3.B.3 — MiniProgressBar and StackedProgressBar

**Create:**
- `src/components/data-display/MiniProgressBar.tsx` — 4px height, three segments (green/amber/gray). Props: `met: number`, `review: number`, `missing: number`.
- `src/components/data-display/StackedProgressBar.tsx` — 8px height with fraction text. Props: `segments: Array<{ value: number, color: string, label: string }>`, `total: number`.

#### 3.B.4 — EvidenceCard

**Create:** `src/components/data-display/EvidenceCard.tsx`
**Reference:** `prior_auth_workbench_design.md` → evidence display patterns

Props: `evidence: PAEvidence`, `isHighlighted: boolean`, `onSelect: () => void`. Renders: SourceBadge, description, extracted values, confidence badge, date. Highlighted state: colored left border from linking palette.

#### 3.B.5 — RequirementRow and RequirementCategory

**Create:**
- `src/components/data-display/RequirementRow.tsx` — Props: `requirement: PARequirement`, `isHighlighted: boolean`, `onAccept?: () => void`, `onSelect: () => void`. Status icon (checkmark/amber circle/red X), criterion text, confidence badge for review items, linked evidence count.
- `src/components/data-display/RequirementCategory.tsx` — Props: `category: PARequirementCategory`, `highlightedRequirementId: string | null`, callbacks. Collapsible section: chevron, category name, fractional badge (e.g., "6/8 met"), children.

#### 3.B.6 — FindingCard

**Create:** `src/components/data-display/FindingCard.tsx`

Props: `finding: AIFinding`, `isSelected: boolean`, `onApprove: () => void`, `onReject: () => void`, `onSelect: () => void`. Collapsed: title, onset day, confidence badge, status. Expanded: signal contribution stacked bar, knowledge base pills, differential table, clinical correlates list.

#### 3.B.7 — ClinicalEventCard

**Create:** `src/components/data-display/ClinicalEventCard.tsx`

Props: `event: ClinicalEvent`, `accentColor: string`. Icon (lucide), date, description, provenance chip.

#### 3.B.8 — FeatureRow

**Create:** `src/components/data-display/FeatureRow.tsx`

Props: `feature: ModelFeature`, `onToggle: () => void`. Name, source badges, coverage fraction, confidence badge, literature citation count, include/exclude toggle.

### Track C: Interactive Components (no dependencies between them)

#### 3.C.1 — BulkActionBar

**Create:** `src/components/interactive/BulkActionBar.tsx`
**Reference:** `demo_design_guide.md` → Section 8.2

Props: `selectedCount: number`, `onAcceptAllHigh: () => void`, `onFlag?: () => void`, `onReassign?: () => void`, `onDismiss: () => void`. Sticky top bar. Appears when items are selected.

#### 3.C.2 — AccordionChecklist

**Create:** `src/components/interactive/AccordionChecklist.tsx`

Props: `categories: PARequirementCategory[]`, `highlightedId: string | null`, callbacks. Two-level accordion with worst-case status roll-up (any missing → category shows red). Expand/collapse all controls.

#### 3.C.3 — ViewToggle, SourceCategoryTabs, PatientSwitcher

**Create (parallel):**
- `src/components/interactive/ViewToggle.tsx` — Props: `options: string[]`, `active: string`, `onChange: (value: string) => void`. Segmented control.
- `src/components/interactive/SourceCategoryTabs.tsx` — Props: `categories: string[]`, `active: string`, `onChange: (value: string) => void`. Tab bar: All | EMR | Lab | Imaging | PT | Pharmacy.
- `src/components/interactive/PatientSwitcher.tsx` — Props: `patients: Patient[]`, `selectedId: string`, `onSelect: (id: string) => void`. Horizontal scrollable strip of patient cards with risk indicators.

#### 3.C.4 — KeyboardShortcutLegend

**Create:** `src/components/interactive/KeyboardShortcutLegend.tsx`

Props: `shortcuts: Array<{ key: string, description: string, context: string }>`, `isOpen: boolean`, `onClose: () => void`. Modal triggered by `?`. Shortcuts grouped by context.

### Track D: Visualization Components

#### 3.D.1 — TopologyGraph

**Create:** `src/components/visualization/TopologyGraph.tsx`
**Reference:** `demo_design_guide.md` → Section 5.7

Props: `config: TopologyConfig`, `onNodeClick?: (nodeId: string) => void`. ReactFlow graph with dagre auto-layout. Nodes styled with system accent colors. Edges show integration type labels.

#### 3.D.2 — ConceptDAG

**Create:** `src/components/visualization/ConceptDAG.tsx`

Props: `schemaFields: SchemaAnnotation[]`, `payerCriteria: PayerCriteriaSet`. ReactFlow DAG: clinical concept nodes → coding system nodes → payer criteria nodes. Dagre layout.

#### 3.D.3 — SwimLaneTimeline

**Create:** `src/components/visualization/SwimLaneTimeline.tsx`
**Reference:** `prior_auth_workbench_design.md` → timeline patterns

Props: `evidence: PAEvidence[]`, `requirements: PARequirementCategory[]`, `highlightedRequirementId: string | null`, `onEvidenceSelect: (id: string) => void`. Horizontal timeline with lanes by source system. Minimap. Requirement highlight bands.

#### 3.D.4 — TimeSeriesChart

**Create:** `src/components/visualization/TimeSeriesChart.tsx`

Props: `channel: BiometricChannel`, `events?: ClinicalEvent[]`, `onEventClick?: (id: string) => void`. Plotly dual-trace chart (actual + expected) with confidence band shading, change-point vertical markers with annotations, anomaly region overlay. Event markers on x-axis.

### Track E: Clinical Components

#### 3.E.1 — PatientInfoPanel

**Create:** `src/components/clinical/PatientInfoPanel.tsx`

Props: `patient: Patient`. Left-panel layout: demographics section, diagnoses list, medications, allergies, pre-op values. Compact, scannable format.

#### 3.E.2 — ClinicalEventsTimeline

**Create:** `src/components/clinical/ClinicalEventsTimeline.tsx`

Props: `events: ClinicalEvent[]`, `systems: SourceSystem[]`, `selectedEventId: string | null`, `onEventSelect: (id: string) => void`. Plotly categorical timeline with event markers colored by source system.

#### 3.E.3 — ReasoningNarrative

**Create:** `src/components/clinical/ReasoningNarrative.tsx`

Props: `narrative: string`, `finding: AIFinding`. Renders structured clinical reasoning document from Markdown. Highlights signal contributions and knowledge base references inline.

**Phase 3 exit criteria:**
- `npm run build` exits 0
- All component files exist with correct prop type signatures matching the architecture doc
- No component imports from `src/scenarios/` or calls `useScenario()` directly (except layout components built in Phase 1)
- Visual verification deferred to Phases 4–6, where screens render components with real data from `useScenario()`

---

## Phase 4: Screens — Workspace and Integration

**Goal:** Dashboard, Sources, SchemaExplorer, ConceptMap, PayerCriteria screens fully functional with real data from `useScenario()`.

### Track A: Workspace Screens (parallel with Track B)

#### 4.A.1 — Dashboard

**Replace placeholder:** `src/screens/workspace/Dashboard.tsx`
**Reference:** `demo_narratives.md` → Situation 1 "Dashboard" section

Template A (Review Screen). Reads: `dashboardSummary`, `systems`, `dealTimer`. 4 MetricCards (20 sources, 4,847 fields, 94.2% auto-annotated, 12 payer criteria sets). DataTable of source systems: name, platform chip, locations, fields mapped (JetBrains Mono), annotation completion with inline progress bar, status badge.

#### 4.A.2 — Sources

**Replace placeholder:** `src/screens/workspace/Sources.tsx`
**Reference:** `demo_narratives.md` → Situation 1 "Sources" section

Template B (Visualization Screen). Reads: `systems`, `topology`. Full-viewport TopologyGraph. Clicking a node navigates to `/schema-explorer?system=<id>`.

### Track B: Integration Screens (parallel with Track A)

#### 4.B.1 — SchemaExplorer

**Replace placeholder:** `src/screens/integration/SchemaExplorer.tsx`
**Reference:** `demo_narratives.md` → Situation 1 "Schema Explorer" section

Template A (Review Screen). Reads: `schemaFields`, `systems`. Uses `schemaStore`. DataTable with expandable rows showing field detail (source table, source field, data type, sample values, mapped concept, alternatives). ConfidenceBadge per row. BulkActionBar: "Accept all High-confidence" triggers `schemaStore.bulkAcceptHigh()`. Filterable by system (reads `?system=` URL param from Sources click-through).

#### 4.B.2 — PayerCriteria

**Replace placeholder:** `src/screens/integration/PayerCriteria.tsx`
**Reference:** `demo_narratives.md` → Situation 3

Null-guard: redirect to `/dashboard` if `scenario.payerCriteria` is null. Comparison grid: rows = criteria, columns = BCBS MA / Aetna MA / United / Humana. Divergence column highlighting where payers disagree.

#### 4.B.3 — ConceptMap

**Replace placeholder:** `src/screens/integration/ConceptMap.tsx`
**Reference:** `demo_narratives.md` → Situation 3

Template B. Null-guard on `payerCriteria`, then pass the non-null value to `ConceptDAG` (the component receives `PayerCriteriaSet` as a non-nullable prop). ConceptDAG visualization for "right knee osteoarthritis" concept linkages.

**Phase 4 exit criteria:**
- Visit `/dashboard?demo=summit-ortho` — 4 metric cards show 20 / 4,847 / 94.2% / 12
- Visit `/sources` — TopologyGraph renders 20 nodes; click a node → navigates to Schema Explorer filtered to that system
- Visit `/schema-explorer` — table renders; "Accept all High-confidence" works
- Visit `/payer-criteria` — grid shows 4 payers with divergence indicators
- Visit `/concept-map` — DAG renders for "right knee osteoarthritis"
- `npm run build` exits 0

---

## Phase 5: Screens — Clinical (PA Workbench)

**Goal:** PAWorklist, PADetail, and PatientRecords screens fully functional. Bidirectional evidence-requirement linking works. Keyboard shortcuts work.

### Track A: Worklist (no dependencies)

#### 5.A.1 — PAWorklist

**Replace placeholder:** `src/screens/clinical/PAWorklist.tsx`
**Reference:** `demo_narratives.md` → Situation 2 "PA Worklist", `prior_auth_workbench_design.md` → worklist patterns

Null-guard on `paWorkbench`. DataTable of PA cases: patient initials, procedure, payer, filed date, SLACountdown (dual timer), MiniProgressBar (met/review/missing), assigned to. Sortable columns. BulkActionBar for multi-select. Clicking a row navigates to `/pa-workbench/:caseId`.

#### 5.A.2 — PatientRecords

**Replace placeholder:** `src/screens/clinical/PatientRecords.tsx`

Null-guard on `paWorkbench`. DataTable of all patient records with expandable rows showing raw vs. normalized side-by-side. SourceBadge per record. ConfidenceBadge for identity resolution confidence.

### Track B: Detail View (depends on 5.A.1 for navigation)

#### 5.B.1 — PADetail

**Replace placeholder:** `src/screens/clinical/PADetail.tsx`
**Reference:** `demo_narratives.md` → Situation 2 "PA Detail", `prior_auth_workbench_design.md` → three-panel layout

Template C (Three-Panel Workspace). Uses `paStore` extensively. Three resizable panels via `react-resizable-panels`:

**Left panel — Patient Context:** PatientInfoPanel with demographics, diagnoses, identity resolution summary.

**Center panel — Evidence:** ViewToggle (Cards | Timeline). Cards view: EvidenceCard list, filterable by SourceCategoryTabs. Timeline view: SwimLaneTimeline. Evidence items highlight when linked requirement is selected.

**Right panel — Requirements:** AccordionChecklist of requirement categories. Accept/reject actions on review items. StackedProgressBar header showing overall met/review/missing. Clicking a requirement highlights linked evidence (bidirectional via `useLinkedHighlight`).

Wire `useLinkedHighlight` hook: selecting a requirement in the right panel highlights linked evidence in the center panel and vice versa, using `paStore.highlightedRequirementId` and `paStore.highlightedEvidenceId`.

Wire keyboard shortcuts: `a` = accept highlighted requirement, `j/k` = navigate requirements, `e` = toggle evidence view, `?` = show shortcuts legend.

**Phase 5 exit criteria:**
- Visit `/pa-workbench?demo=summit-ortho` — worklist renders with sortable columns, dual countdowns, mini progress bars
- Click M.K. row → three-panel detail view opens
- Click a requirement → linked evidence highlights in center panel (and vice versa)
- Toggle to Timeline view → swim lanes render with requirement bands
- Accept a Review requirement → progress bar updates
- Press `?` → keyboard shortcut legend opens
- `npm run build` exits 0

---

## Phase 6: Screens — Analytics

**Goal:** ModelBuilderProject, ModelBuilderDataset, and AnnotationStudio screens fully functional. Processing animation works. Time-series charts render with change-point annotations.

### Track A: Model Builder (no dependencies on Track B)

#### 6.A.1 — ModelBuilderProject

**Replace placeholder:** `src/screens/analytics/ModelBuilderProject.tsx`
**Reference:** `demo_narratives.md` → Situation 4 "Model Builder"

Null-guard on `analytics`. MetricCards (eligible cases, contributing sites, feature completeness, cases with biometrics). FeatureRow list with include/exclude toggles using `modelStore`. "Assemble Dataset" button triggers `modelStore.startAssembly()` → ProcessingOverlay with 6 phases (connecting → resolving → normalizing → validating → assembling → complete). Phase auto-advances via `modelStore.advancePhase()` on timed intervals.

#### 6.A.2 — ModelBuilderDataset

**Replace placeholder:** `src/screens/analytics/ModelBuilderDataset.tsx`

Null-guard on `analytics`. Guard: redirect if `modelStore.assemblyPhase !== 'complete'`. MetricCards (total rows, feature count, completeness). DataTable of training data with quality indicators.

### Track B: Annotation Studio (no dependencies on Track A)

#### 6.B.1 — AnnotationStudio

**Replace placeholder:** `src/screens/analytics/AnnotationStudio.tsx`
**Reference:** `demo_narratives.md` → Situation 4 "Annotation Studio"

Null-guard on `analytics`. Three-panel layout via `react-resizable-panels`. Uses `annotationStore`. **Cross-module note:** This screen also reads `paWorkbench.patients` — this data is available from Phase 2 and the `PatientSwitcher`/`PatientInfoPanel` components are built in Phase 3. No dependency on Phase 5 screen implementations.

**Left panel — Patient Context:** PatientSwitcher strip (from `paWorkbench.patients`). PatientInfoPanel for selected patient.

**Center panel — Time-Series:** TimeSeriesChart for temperature channel. TimeSeriesChart for heart rate channel. ClinicalEventsTimeline below charts. Clicking an event updates `annotationStore.selectedEventId`.

**Right panel — Context (4 tabs):**
- Timeline: ClinicalEventsTimeline (redundant but shows full list)
- Events: ClinicalEventCard list
- Findings: FindingCard list with approve/reject actions
- Reasoning: ReasoningNarrative for selected finding

Wire `annotationStore` tab switching, finding selection, patient switching.

**Phase 6 exit criteria:**
- Visit `/model-builder?demo=summit-ortho` — feature table shows 11 features with coverage and literature
- Click "Assemble Dataset" → overlay runs through all 6 phases
- Navigate to `/model-builder/dataset` — training data table renders
- Visit `/annotation-studio?demo=summit-ortho&snapshot=model-ready` — patient switcher shows M.K.; time-series renders dual traces with confidence band and change-point annotations
- Click a finding → expands with signal contributions, KB pills, differential, correlates
- Switch to Reasoning tab → narrative renders
- `npm run build` exits 0

---

## Phase 7: System, Snapshots, and Polish

**Goal:** All screens functional. All snapshots load correctly. Global reset works. Build passes clean.

### Track A: Pipeline Health

#### 7.A.1 — PipelineHealth

**Replace placeholder:** `src/screens/system/PipelineHealth.tsx`

MetricCards (active alerts, resolved today, systems affected). DataTable of pipeline alerts: type badge, system name, description, timestamp, severity. Hero alerts (schema drift, criteria update) at top.

### Track B: Snapshot Wiring (parallel with Track A)

#### 7.B.1 — Snapshot loading and DealTimer integration

**Update:** `src/components/feedback/DealTimer.tsx` (integrate into TopBar), `src/scenarios/ScenarioContext.tsx` (verify snapshot loading)

Verify all 3 snapshots load correctly via URL:
- `?demo=summit-ortho&snapshot=day-22` — default state
- `?demo=summit-ortho&snapshot=pa-active` — PA case selected
- `?demo=summit-ortho&snapshot=model-ready` — model assembled, reasoning tab active

### Track C: Integration Polish (depends on Tracks A, B)

#### 7.C.1 — Cross-screen navigation and edge cases

Verify and fix:
- Sidebar active-route highlighting across all routes
- Optional module null-guards redirect correctly
- Navigation from Sources → SchemaExplorer preserves system filter
- `Ctrl+Shift+R` resets all stores and navigates to landing page
- Landing page workspace card shows correct stats
- DealTimer color transitions work (test by temporarily changing `currentDay` in constants)
- No console errors or warnings on any screen

#### 7.C.2 — Final validation pass

Run `npm run build` and verify:
- Zero TypeScript errors
- Zero validation assertion failures
- All screens render without runtime errors
- All three snapshot URLs produce the expected state

**Phase 7 exit criteria:**
- Visit `/pipeline-health?demo=summit-ortho` — hero alerts render
- All 3 snapshot URLs load correct state
- `Ctrl+Shift+R` resets to landing page
- `npm run build` exits 0 with no warnings
- No console errors on any screen at any snapshot state

---

## Dependency Graph (Summary)

```
Phase 0: Project Scaffold
    │
    ▼
Phase 1: Types + Stores + Context + Routing + AppShell
    │
    ▼
Phase 2: Summit Ortho Data Layer (all fixtures + validation)
    │
    ├──────────────────────┐
    ▼                      ▼
Phase 3: Shared        (can start components
Components             that don't need data)
    │
    ├──────────────┬───────────────┐
    ▼              ▼               ▼
Phase 4:       Phase 5:       Phase 6:
Workspace +    Clinical       Analytics
Integration    (PA Workbench) (Model Builder +
                               Annotation Studio)
    │              │               │
    └──────────────┴───────────────┘
                   │
                   ▼
            Phase 7: System + Snapshots + Polish
```

**Key parallelism opportunities:**
- Phase 1 Tracks A→B are sequential (stores import types), but C and D parallelize once A+B complete
- Phase 2 Tracks B/C/D/E (fixture domains) are mostly parallel
- Phase 3 Tracks A/B/C/D/E (component categories) are fully parallel
- Phases 4/5/6 (screen groups) are fully parallel once Phase 3 completes

---

## Agent Context Budget Guide

| Subtask type | Typical context needed | Files to load |
|---|---|---|
| Type definition | ~8K tokens | `code_architecture.md` types section only |
| Fixture authoring | ~15K tokens | Relevant types + constants + `ortho_scenario.md` or `demo_narratives.md` section |
| Component build | ~12K tokens | Relevant type(s) + `demo_design_guide.md` relevant section + component spec from `code_architecture.md` |
| Screen build | ~20K tokens | Screen's data dependencies (types + store) + `demo_narratives.md` screen section + components used |
| Validation | ~10K tokens | All constants + type interfaces + fixture imports |

**Rule of thumb:** If a subtask requires reading more than 3 design doc sections, split it further.
