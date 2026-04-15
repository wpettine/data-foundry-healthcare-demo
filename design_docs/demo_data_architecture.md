# Demo Data Architecture

Pattern for organizing data and scenarios in static walkthrough demo apps. Applies regardless of domain, content, or audience. The primary consumers of this document are AI coding agents building or modifying demo applications.

---

## Core Invariant

**Screens are templates. Data is swappable.** No screen knows which scenario is active. No screen contains conditional logic for a specific scenario. The entire app is a parametric template: swap the data object and every screen adapts. Every rule below exists to protect this invariant.

---

## Data Pipeline

Data flows in one direction through four layers:

```
constants → domain fixtures → scenario assembly → context provider → screens
```

### Layer 1: Constants (`_constants.ts`)

One file per scenario. Defines every value that appears on more than one screen: financial figures, entity counts, system identifiers, threshold values, concept IDs, display names.

**Rules:**
- Any value referenced by 2+ screens MUST be in constants.
- Export `as const` objects only.
- MUST NOT import from any other data file. Constants are a leaf dependency.
- When changing a value, change it here. All downstream files derive from this.

**Exception — child module constants:** When a scenario has sub-modules (e.g., a post-acquisition phase that extends a diligence phase), the child module's `_constants.ts` MAY import from its parent scenario's `_constants.ts` for data continuity values. The child file defines only NEW constants and references parent values by import, never by duplication. This is the only permitted cross-file import for constants. Only parent-to-child within the same scenario — never between sibling or unrelated scenarios.

### Layer 2: Domain Fixtures (e.g., `annotations.ts`, `entities.ts`, `reconciliation.ts`)

One file per domain. Exports typed arrays/objects. Imports from the scenario's constants file and builds structured records around those values.

**Rules:**
- MUST import numeric values from constants. Never define standalone numbers that also appear elsewhere.
- MUST export types matching interfaces in the shared `types/` directory.
- MUST be pure data — no React components, no side effects (except build-time validation imports).

### Layer 3: Scenario Assembly (`index.ts`)

One file per scenario. Imports all domain fixtures and constants, composes them into a single object conforming to the `ScenarioData` interface.

**Rules:**
- This is the ONLY file that gathers a scenario's data files together.
- Produces exactly one typed object — the complete data payload.
- If a scenario doesn't support a module, set the field to `null`.
- No data transformations beyond trivial reshaping.

**Renderer registries:** The assembly file is the one place where React component imports are permitted in the data pipeline. When screens need to render scenario-specific visual components (e.g., chart types, preview cards, diagram layouts), the assembly file builds a renderer map that pairs data IDs with component functions. The pattern is: domain fixtures define WHAT to show (definitions + data keyed by ID), the assembly file defines HOW to show it (renderer functions keyed by the same ID, importing shared components from `src/components/`). The screen looks up the renderer by ID and calls it — no scenario branching.

### Layer 4: Context Provider (`ScenarioContext.tsx`)

Wraps the app. Exposes the active scenario's data via a hook (e.g., `useScenario()`).

**Responsibilities:**
1. Maintain a `Map<string, ScenarioData>` registry.
2. Read the active scenario ID from a state store.
3. Reinitialize interaction stores when the scenario changes.

---

## Import Rules (Enforced)

| Layer | Can import from | MUST NOT import from |
|---|---|---|
| Constants | Nothing (leaf) | Domain files, stores, components |
| Domain fixtures | Own scenario's constants, shared types | Other scenarios, stores, components |
| Scenario assembly | Own constants + domain files, shared types | Other scenarios, stores, components |
| Context provider | Scenario registry, interaction stores | Domain files directly |
| Screens | Context hook, interaction stores, components | Constants, domain files, assembly files |

Violating these rules creates hidden dependencies between screens and specific scenarios, which breaks the core invariant.

---

## Component Organization

`src/components/` is organized by role. Components are scenario-agnostic — they accept data via props, never call `useScenario()` directly.

| Directory | Role | Examples |
|---|---|---|
| `layout/` | Page-level shells and navigation | AppShell, TopBar, Sidebar, ScreenContainer |
| `data-display/` | Tables, charts, metric cards | DataTable, FinancialTable, WaterfallChart, MetricCard |
| `feedback/` | Status, progress, confidence indicators | ConfidenceBadge, StatusBadge, ProgressBar, DealTimer |
| `interactive/` | Controls that mutate store state | BulkAcceptButton, DrillDownPanel, EntityMergeCard |
| `visualization/` | Graphs, diagrams, spatial layouts | TopologyGraph, LineageDAG, ConcentrationChart |

When adding a new component, categorize by its primary role. If it reads or writes to a Zustand store, it goes in `interactive/`. If it only renders data passed via props, it goes in `data-display/` or `visualization/` depending on whether it's tabular/card-based or graph/spatial.

---

## The ScenarioData Interface

Single interface defining everything any screen can consume. Lives in `scenarios/types.ts`.

**Structure:**
- `id` — scenario identifier string
- `company` — display-level company info
- `constants` — the full constants bag (system IDs, financial values, annotation counts, entity counts, concentration thresholds, schema stats, concept IDs)
- Domain groups at the top level: `systems`, `annotations`, `matchCandidates`, `reconciliation`, `exhibits`, `waterfall`, `driftEvents`, `buyside`, `schemaTables`, etc.
- Nullable module fields for optional content: `holdPeriod: { ... } | null`, `navMigration: { ... } | null`
- Layout/display config: `problemScreen`, `sellSideLayout`, `buySideLayout`, `topology`
- `storeSnapshots` — pre-baked interaction states keyed by name
- `interactions` — IDs and labels for scenario-specific interactive elements

**When a screen needs data not on the interface:** Add the field to `ScenarioData`, populate it in every scenario's assembly file. Do not have screens import domain files directly.

---

## Scenario Registration

In the app entry point (`main.tsx`), before React renders:

```ts
registerScenario('scenario-a', scenarioAData)
registerScenario('scenario-b', scenarioBData)
```

**URL parameter contract:**
- `?demo=<scenario-id>` — selects which scenario to load
- `?scenario=<snapshot-name>` — loads a pre-baked store snapshot (e.g., `?scenario=midpoint`)

If no `demo` param is provided, fall back to the first registered scenario.

---

## State Classification

All state falls into exactly one of three buckets:

### 1. Scenario Data (`ScenarioData`)

The world the demo portrays. Static, immutable, set at load time. Managed by the context provider.

- When adding new data, modify domain fixtures and the scenario assembly. Never touch stores.

### 2. Demo Progression State (Zustand stores)

Interactions that change the demo's narrative state — the kind that should survive page navigation or be restorable via snapshots. Each domain of interactivity gets its own store.

Examples: bulk-accept completion, entity merge, drift resolution, processing animation phases, ingestion progress.

- When adding new interactivity, add a store. Never embed progression state in the data layer.
- Every store MUST expose a `reset()` method.

### 3. View State (React local `useState`)

UI-only state that doesn't affect the demo narrative. Resets naturally on component unmount. MUST NOT go in Zustand stores.

Examples: which tab is selected, table sort order, column resizing, accordion expand/collapse, popover/modal open/close, sidebar navigation clicks.

**Decision rule:** Does this interaction need to be restorable when jumping to a demo entry point via URL parameter? If yes, it belongs in a store (bucket 2). If it resets naturally when the user navigates away, use local state (bucket 3).

### Store Snapshots

Pre-baked store states that allow jumping to a specific point in the demo flow (e.g., "sell-side complete" or "mid-diligence"). A `ScenarioSnapshot` interface mirrors each store's state shape (without actions). Snapshots are defined per-scenario, keyed by named entry points, and live inside `ScenarioData.storeSnapshots` so they can differ per scenario.

**Loading mechanism:** The app entry point reads the `?scenario=<name>` URL parameter, looks up the matching snapshot, then calls `reset()` followed by `setState()` on each store. Stores for optional modules (matching nullable `ScenarioData` fields) are optional fields in the snapshot.

**Snapshot field names must stay in sync with store interfaces.** When adding a new field to a store, update the corresponding snapshot interface and all snapshot definitions.

### Demo Reset

A `resetAllStores()` function calls `reset()` on every store. Wire it to a global keyboard shortcut (e.g., Ctrl+Shift+R) for presenter use. For apps with persona sub-flows, also provide `resetPersonaStores()` that resets only the stores for the active persona, leaving scenario selection intact.

---

## Build-Time Validation

No backend enforces data integrity, so validation runs at build time and at dev-mode module load.

**What to validate:**
- Bucket counts sum to declared totals (e.g., annotation confidence tiers must equal total field count from constants).
- Cross-module numerical threads are consistent (a value appearing on N screens has one source in constants and all fixtures reference it).
- Every exhibit definition has a renderer and a data entry.

**How it works:**
- Validation files are side-effect imports. Importing them runs assertions.
- If an assertion fails, the build fails. In dev mode, the app crashes with an explicit error at load time.
- This is intentional. Silent data inconsistencies in a demo are worse than a loud crash.

**When to run:** Always run `npm run build` after changing constants, annotation data, or fixture files.

---

## Procedures

### Adding a New Scenario

1. Create `src/scenarios/<name>/` directory.
2. Create `_constants.ts` defining all shared values for this scenario.
3. Create domain fixture files importing from those constants.
4. Create `index.ts` assembling everything into a `ScenarioData` object.
5. In `main.tsx`, import and call `registerScenario('<name>', data)`.
6. No screen changes required.

### Adding a New Screen

1. Create the screen component.
2. Access data exclusively via `useScenario()`.
3. If the screen needs data not on `ScenarioData`, add the field to the interface and populate it in every scenario's assembly file.
4. If only some scenarios support this screen, use a nullable module field. The screen redirects when the field is null.
5. MUST NOT import from any scenario's constants or domain files.

### Changing a Shared Value

1. Update the value in the relevant scenario's `_constants.ts`.
2. Run `npm run build` to verify all validation passes.
3. Do not update domain fixture files unless the structure (not just the value) changes — they import from constants.

### Adding a New Module (e.g., a new section some scenarios support)

1. Define types for the module's data in `src/types/`.
2. Add a nullable field to `ScenarioData`: `newModule: { ... } | null`.
3. Create fixture files and populate the field in supporting scenarios. Set to `null` in others.
4. Screens for the module guard with `if (!scenario.newModule) return <Navigate to="/" />`.
