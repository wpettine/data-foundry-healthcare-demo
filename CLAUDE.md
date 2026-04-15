# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

**Data Foundry Healthcare** — a non-functional, visually realistic walkthrough UI targeting M&A professionals in healthcare technology. The app demonstrates schema-first semantic integration that turns months of M&A data chaos into auditable financial intelligence.

**Stack:** Vite + React 19 + TypeScript + Tailwind CSS 4, with Zustand (state), ReactFlow (graph diagrams), Recharts (charts), TanStack Table (data tables), dagre (graph layout), lucide-react (icons), react-resizable-panels, and react-plotly.js (Annotation Studio only).

## Repository Structure

- `reference_docs/` — Research and UX analysis documents
  - `meridian_data_bible.md` — **Single source of truth** for all Meridian demo data (company profile, system counts, annotation buckets, ARR reconciliation, entity resolution, risk dashboard, exhibit readiness). If a number appears in a demo screen, it must match this file.
  - `ux_ui_report.md` — Full product UX/UI spec (user journeys, wireframe-level design guidance, 5 design principles)
  - `pipeline_comparison_ux_report.md` — UX pattern catalog for comparing data pipeline outputs (28 tools surveyed across 7 categories)
  - `prior_auth_pain.md` — Healthcare prior authorization pain points driving product design
  - `pain_points_report_post-acquisition.md` — Quantified analysis of KPI infrastructure failures in PE rollups across healthcare and B2B SaaS verticals
  - `deep_research_prompt_template.md` — Template for deep research prompts used to generate reference docs
  - `raw_sources/` — Source code and CLAUDE.md snapshots from prior builds (`adaptive-data-room-demo`, `mtn-annotation`)
- `design_docs/` — Architecture and implementation specs
  - `demo_overview_memo.md` — High-level objectives and business/technical application areas
  - `demo_data_architecture.md` — **Prescriptive data architecture** (data pipeline layers, import rules, state classification, scenario registration, build-time validation)
  - `demo_design_guide.md` — **Comprehensive visual/interaction design spec** (color tokens, typography, spacing, component patterns, tech stack versions, project initialization)
  - `code_architecture.md` — **Complete implementation blueprint**: file structure, all component/screen/store/hook/type interfaces, data pipeline, and scenario scaffold script. **If something in `demo_narratives.md` contradicts this file, this file wins.**
  - `demo_narratives.md` — Screen-by-screen narrative for the PE-backed orthopedic platform demo (Summit Orthopedics Group). Defines what the audience sees; `code_architecture.md` defines how the code delivers it.
  - `ortho_scenario.md` — Detailed Summit Orthopedics scenario data (systems, patients, clinical context)
  - `lvad_scenario.md` — LVAD prior authorization scenario ($150K–$300K decision on fragmented data across 8+ clinical systems)
  - `prior_auth_workbench_design.md` — UX design patterns for the PA workbench (worklist, split-view, confidence badges, timeline, keyboard shortcuts), synthesized from 6 adjacent-domain tools

## Document Hierarchy (Read Order for Implementation)

1. `code_architecture.md` — **Start here.** Complete file tree, all interfaces, implementation rules.
2. `demo_narratives.md` — What each screen shows and the presenter flow.
3. `demo_data_architecture.md` — Data pipeline invariants and procedures for adding scenarios/screens.
4. `demo_design_guide.md` — Visual tokens, spacing, component patterns.
5. `prior_auth_workbench_design.md` — Deep-dive patterns for PA screens specifically.
6. Reference docs as needed for domain data and clinical context.

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript check + Vite build (MUST run after changing constants, annotation data, or fixture files — build-time validation catches data inconsistencies)
npm run lint         # ESLint
npm run preview      # Preview production build locally

# Add a new scenario
npx tsx src/scripts/new-scenario.ts <id> "<Company Name>"
```

## Code Structure

- `src/screens/` — Page-level components, organized by sidebar section: `workspace/`, `integration/`, `clinical/`, `analytics/`, `system/`
- `src/components/` — Reusable components: `layout/`, `feedback/`, `data-display/`, `interactive/`, `visualization/`, `clinical/`
- `src/scenarios/` — Scenario data modules. Each scenario is a directory (e.g., `summit-ortho/`) with `_constants.ts`, domain fixture files, and an `index.ts` assembly. `manifest.ts` is the registry.
- `src/store/` — Zustand stores for demo progression state (`paStore`, `schemaStore`, `modelStore`, `annotationStore`). `resetDemo.ts` exposes `resetAllStores()`.
- `src/types/` — Shared TypeScript interfaces (scenario, patient, PA, payer, clinical, pipeline, etc.)
- `src/hooks/` — Custom hooks (`useUrlParams`, `useKeyboardShortcuts`, `useAnimatedCounter`, `useLinkedHighlight`, `usePanelResize`)
- `src/utils/` — Pure utilities (colors, formatters, PRNG, graph layout, validation)
- `src/styles/globals.css` — Tailwind entry point

**Routes** (defined in `App.tsx`): `/` (landing) then inside `AppShell`: `/dashboard`, `/sources`, `/schema-explorer`, `/concept-map`, `/payer-criteria`, `/patient-records`, `/pa-workbench`, `/pa-workbench/:caseId`, `/model-builder`, `/model-builder/dataset`, `/annotation-studio`, `/pipeline-health`

## Data Architecture (Core Invariant)

**Screens are templates. Data is swappable.** No screen knows which scenario is active. No screen contains conditional logic for a specific scenario. The full architecture is documented in `design_docs/demo_data_architecture.md`.

Data flows through four layers:
```
constants → domain fixtures → scenario assembly → context provider → screens
```

**Import rules (enforced):**
- Constants (`_constants.ts`): leaf dependency, imports nothing. `as const` exports only.
- Domain fixtures: import only from own scenario's constants and shared types.
- Scenario assembly (`index.ts`): imports own constants + domain files, produces one `ScenarioData` object.
- Screens: access data exclusively via `useScenario()` hook. MUST NOT import constants or domain files directly.

**State classification (three buckets):**
1. **Scenario Data** — static/immutable, set at load time via context provider
2. **Demo Progression State** — Zustand stores for interactions that survive navigation (every store exposes `reset()`)
3. **View State** — React `useState` for UI-only state that resets on unmount

**Build-time validation:** Validation files are side-effect imports that run assertions at module load. Failing assertions crash the build intentionally — silent data inconsistencies are worse than loud crashes. Use collect-then-throw pattern (not `console.assert`).

## Key Architectural Patterns

- **Scenario registration**: `src/scenarios/manifest.ts` is the ONE file to edit when adding a scenario. `main.tsx` imports only from the manifest, never from scenario directories directly.
- **Scenario selection**: URL params (`?demo=summit-ortho`). Landing page shows workspace selector.
- **Store resets**: Every Zustand store exposes `reset()`. `resetAllStores()` wired to Ctrl+Shift+R. Stores reset automatically on scenario change.
- **Snapshots**: Pre-configured store states (e.g., `day-22`, `pa-active`, `model-ready`) loadable via `?snapshot=` URL param for jumping to specific demo moments.
- **Navigation**: Sidebar organized as WORKSPACE / INTEGRATION / CLINICAL / ANALYTICS / SYSTEM sections — matches real enterprise data platform, not a numbered demo flow.

## Key Reference: Prior Build

`reference_docs/raw_sources/adaptive-data-room-demo.md` contains a complete code snapshot of a closely related prior demo build. This is the secondary architectural reference (after `code_architecture.md`). Key reusable patterns: `ScenarioContext` + `registerScenario()`, multi-persona flows (sell-side/buy-side/hold-period), and cross-fixture build-time validation.

## Demo Scenarios

| Scenario | Domain | Systems | Key Metric |
|---|---|---|---|
| Summit Orthopedics Group | PE-backed orthopedic platform | 12 (EHRs, billing/RCM, GLs, CRM) | $78M net collections |
| Meridian Software Group | B2B SaaS, healthcare IT | 9 (ERPs, CRMs, billing) | $200M ARR |

Summit Orthopedics is the primary scenario for initial implementation. A single patient (67F, right knee OA, TKA candidate) threads through PA Workbench (Situation 2) and returns post-surgery in Annotation Studio (Situation 4), demonstrating "one data layer, multiple applications."

## Visual/Tech Constraints

- **No UI component libraries** (no MUI, Chakra, Ant, Radix, shadcn). All components hand-built with Tailwind.
- **JetBrains Mono** for all financial/numerical data. **Inter** for everything else.
- **Never use color alone** to convey meaning — always pair with text label, icon, or pattern.
- **8px spacing grid.** See `design_docs/demo_design_guide.md` for exact color tokens and component patterns.
- **Three-tier confidence system**: High (green dot), Review (amber + %), Manual (red + %) — used everywhere.

## Design Principles (from UX spec)

1. **Confidence-forward** — Every automated output shows High/Medium/Low confidence with provenance badges
2. **Progressive disclosure** — Dashboard (5s scan) → Detail view → Deep dive (full lineage)
3. **Auditability is the product** — Immutable change logs, version-controlled snapshots, click-to-trace lineage
4. **Time-aware** — 60–90 day exclusivity clock drives all workflows
5. **Two audiences, one truth** — Same underlying data, persona-adapted views (sell-side builds narrative, buy-side stress-tests it)

## Implementation Principles (from code_architecture.md)

1. **Think before coding.** State ambiguity explicitly. Present multiple interpretations rather than silently picking one.
2. **Simplicity first.** No features beyond what was asked. No abstractions for single-use code.
3. **Surgical changes.** Don't "improve" adjacent code. Match existing style.
4. **Goal-driven execution.** Transform requests into testable success criteria and loop until done.
