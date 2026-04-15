# Demo Design Guide for AI Coding Agents

> **Purpose:** This document provides prescriptive design specifications for AI coding agents building interactive product demos. It encodes the visual language, interaction patterns, data architecture, and component patterns proven in the Data Foundry demo series. Follow these rules to produce demos that look and feel like professionally designed enterprise SaaS applications, regardless of the specific product domain or customer profile.

---

## 1. Design Principles

Five named principles govern every screen in every demo. When a specific implementation rule in this guide doesn't cover your situation, reason from these principles to make the right call.

**Principle 1: Confidence-forward.** Users must never wonder "did a machine decide this or a human?" Every automated output — AI annotations, entity matches, computed metrics, generated recommendations — displays a categorical confidence indicator (High / Review / Manual) with numeric detail on hover and provenance badges showing origin. If you're building an element that displays an AI-generated result, it needs a confidence signal. *Implemented in:* Section 5.1 (Confidence Badges), Section 8.1 (Progressive Disclosure layer 2 hover details).

**Principle 2: Progressive disclosure across three layers.** Layer 1 is the dashboard (scannable in under 5 seconds). Layer 2 is the detail view (full tables, reconciliation status, annotation state). Layer 3 is the deep dive (complete lineage graph, change history, raw field details). This accommodates executives who need a status check in 30 seconds and analysts who need to trace a number through four systems. If you're unsure how much detail to show on a screen, default to Layer 1 with expand affordances to Layer 2. *Implemented in:* Section 8.1 (Progressive Disclosure), Section 5.3 (Metric Cards), Section 5.7 (Graph/DAG visualizations).

**Principle 3: Auditability is the product.** Immutable change logs, version-controlled snapshots, and "click to trace" lineage are not features bolted on after launch. They are the reason the platform exists. Any number displayed anywhere should be traceable to its source. Any action taken by a user should be logged visually. *Implemented in:* Section 8.4 (Click-to-trace Lineage), Section 5.6 (Reconciliation Rows).

**Principle 4: Time-aware design.** Demos simulate environments under time pressure (60–90 day deal windows, quarterly reporting deadlines, post-close integration milestones). Every workflow should surface a "what's blocking completion" view. Batch actions, "accept all high-confidence" buttons, and one-click refresh workflows exist because time kills deals. A persistent timer reinforces urgency. *Implemented in:* Section 5.8 (Deal Timer), Section 8.2 (Bulk Actions), Section 8.3 (Simulated Processing).

**Principle 5: Two audiences, one truth.** When a demo serves multiple personas (e.g., seller and buyer, clinician and administrator, operator and executive), show the same underlying data with persona-adapted views — never maintain two different versions of the truth. Information density, available actions, and labeling vary by persona; the data does not. *Implemented in:* Section 8.6 (Persona-Adapted Views), Section 6.3 (Multi-Scenario Support).

---

## 2. Technology Stack

Every demo uses this exact stack unless a specific constraint forces a substitution:

| Layer | Tool | Version guidance |
|---|---|---|
| Build tool | Vite | Latest stable (currently 7.x) |
| UI framework | React | 19.x |
| Language | TypeScript | 5.9+ with strict mode |
| Styling | Tailwind CSS | 4.x (via `@tailwindcss/vite` plugin) |
| Routing | React Router | 7.x |
| State management | Zustand | 5.x (with `persist` middleware where needed) |
| Charts | Recharts | 3.x |
| Interactive time-series | Plotly.js (react-plotly.js) | 2.x (see Section 16 — documented exception) |
| Data tables | TanStack Table | 8.x |
| Graph/DAG diagrams | ReactFlow | 11.x |
| Graph layout | dagre | 0.8.x |
| Icons | lucide-react | Latest |
| Date utilities | date-fns | 3.x (for clinical time formatting) |

**No other UI libraries.** No Material UI, Chakra, Ant Design, Radix, or shadcn. All components are hand-built with Tailwind classes. This ensures visual consistency and keeps bundle sizes small for demos.

### Project initialization

```bash
npm create vite@latest demo-name -- --template react-ts
cd demo-name
npm install react-router-dom zustand recharts @tanstack/react-table reactflow dagre lucide-react date-fns
npm install -D @tailwindcss/vite @types/dagre

# If the demo includes time-series annotation screens (Section 16):
npm install react-plotly.js plotly.js-dist-min
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

---

## 3. Visual Design System

### 3.1 Color tokens

Define these in both CSS custom properties (for globals) and a TypeScript constants file (for component logic). Every demo uses these exact colors:

```css
:root {
  /* Brand */
  --color-primary: #1A56DB;
  --color-primary-light: #3B82F6;

  /* Status — the RAG (Red/Amber/Green) system */
  --color-verified: #059669;    /* Green — reconciled, healthy, complete */
  --color-warning: #D97706;     /* Amber — review needed, minor discrepancy */
  --color-error: #DC2626;       /* Red — critical, material discrepancy, failure */
  --color-neutral: #6B7280;     /* Gray — informational, disabled, immaterial */

  /* Confidence badges (same as status, named for semantic clarity) */
  --color-confidence-high: #059669;
  --color-confidence-medium: #D97706;
  --color-confidence-low: #DC2626;

  /* AI annotation overlays — used exclusively in clinical time-series screens (Section 16) */
  --color-overlay-anomaly: #E91E63;
  --color-overlay-noise: #9E9E9E;
}
```

```ts
// src/utils/colors.ts
export const COLORS = {
  primary: "#1A56DB",
  primaryLight: "#3B82F6",
  verified: "#059669",
  warning: "#D97706",
  error: "#DC2626",
  neutral: "#6B7280",
  confidenceHigh: "#059669",
  confidenceMedium: "#D97706",
  confidenceLow: "#DC2626",

  // AI annotation overlays — clinical time-series screens only (Section 16)
  overlayAnomaly: "#E91E63",
  overlayNoise: "#9E9E9E",
} as const;
```

**Critical rule:** Never use color alone to convey meaning. Always pair color with a text label, icon, or pattern. (Principle: Confidence-forward)

### 3.2 Source system accent colors

When a demo involves multiple data sources, systems, or entities, assign each a unique accent color. Use these for provenance chips, graph nodes, and timeline markers:

```ts
systemColors: {
  // Assign from this palette based on the domain
  orange:  "#F97316",  // e.g., NetSuite, HubSpot
  blue:    "#3B82F6",  // e.g., Salesforce
  purple:  "#8B5CF6",  // e.g., Zuora
  indigo:  "#6366F1",  // e.g., Stripe
  amber:   "#F59E0B",  // e.g., Chargebee
  green:   "#22C55E",  // e.g., QuickBooks
  sky:     "#0EA5E9",  // e.g., SAP
  rose:    "#F43F5E",  // additional
  teal:    "#14B8A6",  // additional
}
```

### 3.3 Typography

Import exactly these two font families:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
```

| Usage | Font | Weight | Size |
|---|---|---|---|
| Body text, labels | Inter | 400 (regular) | 14px base |
| Subheadings, emphasis | Inter | 600 (semibold) | 14–16px |
| Section headers | Inter | 700 (bold) | 18–20px |
| Dashboard KPI values | JetBrains Mono | 700 (bold) | 24px+ |
| Table cell numbers | JetBrains Mono | 400 (regular) | 14px |
| Table headers | Inter | 600, uppercase | 12px, letter-spaced |
| Small labels, captions | Inter | 400 | 12px |

**All financial/numerical data must use JetBrains Mono.** This ensures decimal alignment and prevents digit confusion. Apply via inline style or utility class:

```tsx
<span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
  {formatCurrency(value)}
</span>
```

### 3.4 Spacing and density

- **8px base grid.** Use 8px, 16px, 24px, 32px increments for all spacing.
- **Card padding:** `p-4` (16px) standard, `p-6` (24px) for hero/dashboard cards.
- **Table row height:** 36px default ("comfortable"). Offer 28px compact option for dense data views.
- **Border radius:** `rounded-lg` (8px) for cards, `rounded-full` for badges/pills.
- **Card borders:** `border border-gray-200` (light gray, 1px). Hover state: `hover:border-blue-300 hover:shadow-sm`.
- **Section spacing:** 24px between major sections, 16px between related elements.

### 3.5 Accessibility baseline

Target **WCAG 2.1 AA compliance** across all demos. Demos are shown on projectors and shared screens where washed-out contrast can undermine perceived quality.

- **Text contrast:** Minimum 4.5:1 for normal text (14px regular), 3:1 for large text (18px+ or 14px bold)
- **Non-text contrast:** Minimum 3:1 for UI components and graphical elements (badge backgrounds, chart bars, status indicators)
- **Color independence:** Never use color alone to convey meaning — always pair with text labels, icons, or patterns (per IBM Carbon guidance)
- **Keyboard access:** All interactive elements (buttons, expandable rows, tabs) must be reachable via Tab and activatable via Enter/Space
- **Badge text labels:** Every confidence badge and status badge includes a text label ("High", "Review", "Reconciled") — not just a colored dot

Note on current color pairings: `text-gray-500` (#6B7280) on white background yields ~4.6:1 contrast — this passes AA for normal text but is the minimum. Avoid going lighter than `gray-500` for any text that must be readable.

### 3.6 What to avoid

- No decorative elements, gradients, or playful illustrations
- No auto-playing animations or decorative transitions
- No emojis in the UI (except in alert/notification content when mimicking real system output)
- No rounded avatars or profile pictures — this is enterprise software
- No dark backgrounds in the main workspace (reserve dark mode for problem/intro screens only)
- No mobile breakpoints or responsive collapse behaviors (see Section 4.4)

---

## 4. Layout Architecture

### 4.1 App shell pattern

Every demo uses a three-part app shell:

```
┌──────────────────────────────────────────────────┐
│  TopBar (h-14, fixed top)                        │
├──────────┬───────────────────────────────────────┤
│ Sidebar  │  Main Content (scrollable)            │
│ (w-60,   │                                       │
│  fixed   │  ┌─ ScreenContainer ───────────────┐   │
│  left)   │  │  Screen content here            │   │
│          │  │                                 │   │
│          │  └─────────────────────────────────┘   │
│          │                                       │
├──────────┴───────────────────────────────────────┤
```

**TopBar** contains: product logo/name (left), workspace/context indicator (center-left), and status indicators (right — deal timer, notification bell, user role).

**Sidebar** contains: numbered screen navigation items with labels, active state indicated by `bg-blue-50 text-blue-700 border-l-2 border-blue-700`. Previous screens show checkmarks. Future screens show step numbers.

**ScreenContainer** provides consistent padding (`px-8 py-6`) and max-width constraints.

### 4.2 Routing structure

Organize screens by persona/workflow into linear flows with a shared layout:

```tsx
// Each persona gets a layout wrapper with AppShell (TopBar + Sidebar + Outlet)
<Route path="/sell-side" element={<SellSideLayout />}>
  <Route index element={<Navigate to="1" replace />} />
  <Route path="1" element={<S1_SystemTopology />} />
  <Route path="2" element={<S2_AnnotationWorkspace />} />
  <Route path="3" element={<S3_EntityResolution />} />
</Route>
```

**Naming convention:** Screen components use the pattern `{ScreenNumber}_{DescriptiveName}.tsx` (e.g., `S1_SystemTopology.tsx`, `B2_MetricReconstruction.tsx`). This makes the demo flow order immediately obvious in the file system.

### 4.3 Problem screens (dark-mode intros)

Each demo flow begins with a dark-background "problem" screen that sets context before the product screens. These are the first thing a viewer sees — they set the emotional frame for the entire flow.

**Visual structure:**

- Full-viewport dark background (`bg-gray-900` or `bg-slate-900`)
- Large, centered headline text in white (`text-3xl font-bold text-white`)
- 3–4 pain-point statistics in a responsive grid
- A single CTA button to enter the product demo (`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg`)
- No sidebar or TopBar — these are standalone pages

**Content guidelines for pain-point statistics:**

Each stat card shows a large number and a one-line label. The stats should:
1. **Quantify the pain the product solves** — time wasted, money lost, error rates, manual effort hours
2. **Use industry-realistic numbers** sourced from the scenario's `_constants.ts`
3. **Create urgency** — frame numbers as costs, delays, or risks
4. **Connect to the product screens that follow** — each stat should set up a specific capability the demo will show

```tsx
interface PainStat {
  value: string;       // The large number: "$2.4M", "47 days", "34%"
  label: string;       // One-line description: "average revenue discrepancy found post-close"
  icon?: ReactNode;    // Optional lucide icon
}

// Example: healthcare operations demo
const PAIN_STATS: PainStat[] = [
  { value: '34%', label: 'of claims denied on first submission due to data inconsistencies' },
  { value: '$4.7M', label: 'annual revenue leakage from unresolved coding errors' },
  { value: '47 days', label: 'average time to reconcile payer data across 12 systems' },
  { value: '3,200', label: 'manual worklist items reviewed per analyst per month' },
];

// Render pattern:
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
  {stats.map(stat => (
    <div key={stat.label} className="text-center">
      <p className="text-4xl font-bold text-white mb-2"
         style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {stat.value}
      </p>
      <p className="text-sm text-gray-400">{stat.label}</p>
    </div>
  ))}
</div>
```

### 4.4 Viewport and responsive behavior

Demos are **desktop-only**. They are presented in controlled environments — conference rooms, screen shares, and investor meetings.

- **Minimum supported viewport:** 1280px wide
- **The sidebar is always visible** — no collapse, no hamburger menu
- **Tables use `overflow-x-auto`** for horizontal scrolling when content exceeds available width
- **Do not add mobile breakpoints** — no `sm:`, `md:` responsive prefixes for layout changes. Use them only for minor spacing adjustments within the desktop viewport.
- **Cards use `flex-wrap`** to handle minor width variations, not media queries

### 4.5 Screen anatomy templates

Every screen follows one of three templates. Pick the one that fits the screen's purpose.

**Template A: Review Screen** (for annotation review, entity resolution, alert triage)

```
┌─ Screen Title ─────────────────── Action Bar (bulk actions, filters) ─┐
├─ MetricCard │ MetricCard │ MetricCard │ MetricCard ───────────────────┤
├───────────────────────────────────────────────────────────────────────┤
│  Primary table or list with expandable rows                          │
│  (sorted by priority/confidence, lowest-confidence first)            │
│                                                                      │
└───────────────────────────────────────────────────────────────────────┘
```

- Title: `text-xl font-semibold text-gray-900`
- Subtitle: `text-sm text-gray-500 mt-1`
- Action bar: right-aligned, same row as title
- Metric cards row: `flex gap-4 overflow-x-auto py-4`

**Template B: Visualization Screen** (for system topology, lineage DAG, entity graph)

```
┌─ Screen Title ─────────────────── Toggle / Filter Controls ──────────┐
├─ MetricCard │ MetricCard │ MetricCard ───────────────────────────────┤
├───────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Full-width graph / DAG visualization                                │
│  (ReactFlow with zoom/pan, min-height 500px)                         │
│                                                                      │
└───────────────────────────────────────────────────────────────────────┘
```

- Graph area fills remaining vertical space
- Metric cards are optional — use when summary stats provide context for the graph
- Sidebar legend for node/edge types when the graph has >3 visual categories

**Template C: Comparison Screen** (for reconciliation, verification, before/after)

```
┌─ Screen Title ─────────────────── Action Bar ────────────────────────┐
├───────────────────────────────────────────────────────────────────────┤
│  Comparison header row (Source A label │ Source B label │ Variance)   │
├───────────────────────────────────────────────────────────────────────┤
│  ReconciliationRow                                                   │
│  ReconciliationRow                                                   │
│  ReconciliationRow (expandable → drill-down detail)                  │
│                                                                      │
├───────────────────────────────────────────────────────────────────────┤
│  Optional: Variance decomposition panel (below or right side panel)  │
└───────────────────────────────────────────────────────────────────────┘
```

- Source labels use system accent colors for identification
- Variance column is always rightmost before the status badge
- Expanded rows show entity-level or line-item detail

---

## 5. Component Patterns

### 5.1 Confidence badges

The three-tier confidence system is the most important UI pattern. Use it on every AI/automated output. (Principle: Confidence-forward — users must never wonder whether a machine or human made a decision.)

```tsx
const LEVEL_CONFIG = {
  high:   { label: 'High',   color: '#059669' },  // Green
  medium: { label: 'Review', color: '#D97706' },  // Amber
  low:    { label: 'Manual', color: '#DC2626' },  // Red
};

// Render as a colored pill
<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
      style={{ backgroundColor: config.color }}>
  {config.label}
</span>
```

**Progressive disclosure on hover:** Show a tooltip with numeric score and one-line explanation. On click/expand, show full detail (model agreement, alternative mappings, conformal interval).

### 5.2 Status badges

For reconciliation and workflow states, use a lighter badge style with colored backgrounds:

```tsx
const STATUS_CONFIG = {
  reconciled:            { label: 'Reconciled',           className: 'bg-green-100 text-green-800' },
  review:                { label: 'Review',               className: 'bg-amber-100 text-amber-800' },
  'material-discrepancy': { label: 'Material Discrepancy', className: 'bg-red-100 text-red-800' },
};
```

### 5.3 Metric cards

Dashboard-level KPIs use cards with this structure:

```tsx
<div className="min-w-[200px] bg-white border border-gray-200 rounded-lg p-4
                cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all">
  <p className="text-sm text-gray-500 mb-1">{label}</p>
  <div className="flex items-center gap-2">
    <span className="font-bold text-gray-700"
          style={{ fontSize: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      {value}
    </span>
    {trend === 'up' && <TrendingUp className="w-5 h-5 text-green-600" />}
    {trend === 'down' && <TrendingDown className="w-5 h-5 text-red-600" />}
  </div>
</div>
```

- Max 4 cards per row
- Min width 200px per card
- Use `TrendingUp`/`TrendingDown` icons from lucide-react for trends
- Financial values always in JetBrains Mono

### 5.4 Data tables

Tables follow a consistent pattern:

- White background, `border border-gray-200 rounded-lg` container
- Header row: `text-xs uppercase tracking-wider text-gray-500 bg-gray-50`
- Body rows: `text-sm text-gray-900`, with `hover:bg-gray-50` on interactive rows
- Expandable rows use a `ChevronRight` icon that rotates 90 degrees when expanded
- Financial columns right-aligned with JetBrains Mono
- Frozen first 1–2 columns for wide tables with horizontal scroll (`overflow-x-auto`)

### 5.5 Processing overlays

For simulated AI/processing steps, show a full-screen or section overlay:

- Semi-transparent backdrop
- Centered card with step list
- Each step: icon + label + status (pending/running/complete)
- Running step shows a spinner or pulse animation
- Complete steps show green checkmark
- Use `setTimeout` chains to simulate processing duration (500ms–2s per step)

### 5.6 Reconciliation rows

For side-by-side comparisons across data sources (Principle: Auditability — every number traces to a source):

```tsx
<div className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3
                hover:border-blue-200 transition-colors cursor-pointer">
  <div className="flex items-center gap-4">
    <ChevronRight className="w-4 h-4 text-gray-400" />
    <div className="flex-1 min-w-[160px]">
      <span className="text-sm font-medium text-gray-900">{metric.name}</span>
    </div>
    {/* Source values in monospace */}
    {metric.sources.map(source => (
      <div key={source.name} className="text-right min-w-[100px]">
        <p className="text-xs text-gray-500">{source.name}</p>
        <p className="text-sm text-gray-900"
           style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {formatCurrency(source.value)}
        </p>
      </div>
    ))}
    {/* Variance with color coding */}
    <div className="text-right min-w-[100px]">
      <p className="text-xs text-gray-500">Variance</p>
      <p className={`text-sm font-semibold ${varianceColor}`}
         style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {formatCurrency(variance)}
      </p>
    </div>
    {/* Status badge */}
    <StatusBadge status={metric.status} />
  </div>
</div>
```

### 5.7 Graph/DAG visualizations

When showing system topology, data lineage, or entity relationships:

- Use ReactFlow with dagre for automatic layout
- Nodes: white background, `border border-gray-200 rounded-lg`, 8px padding
- Each node shows: icon/logo, name, 1–2 key stats
- Edges: `stroke: #94A3B8` (gray-400), animated for active data flows
- Wrap all ReactFlow usage in `<ReactFlowProvider>`
- Include zoom/pan controls

### 5.8 Deal timer

A persistent timer in the TopBar reinforces time pressure (Principle: Time-aware design). It shows elapsed progress against a total window — "Day 34 of 90" for deal exclusivity, "Week 3 of 12" for integration milestones.

```tsx
interface DealTimerConfig {
  currentDay: number;
  totalDays: number;
  label: string;  // e.g., "Exclusivity Window", "Integration Sprint"
}

export default function DealTimer({ config }: { config: DealTimerConfig }) {
  const { currentDay, totalDays, label } = config;
  const percentage = totalDays > 0 ? Math.round((currentDay / totalDays) * 100) : 0;

  // Color transitions: green → amber → red as time progresses
  const barColor = percentage < 50 ? 'bg-green-500'
                 : percentage < 75 ? 'bg-amber-500'
                 : 'bg-red-500';

  return (
    <div className="inline-flex w-[200px] flex-col gap-0.5">
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <span>
          Day{' '}
          <span className="font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {currentDay}
          </span>{' '}
          of {totalDays}
        </span>
        <span className="text-gray-400">|</span>
        <span>{label}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div className={`h-full rounded-full ${barColor} transition-all`}
             style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
```

Configure the timer via `DealTimerConfig` in the scenario data. The timer is optional but recommended for any demo involving time-bounded workflows.

---

## 6. Data Architecture

### 6.1 The single source of truth pattern

**This is the most important architectural rule.** Every number that appears on multiple screens is defined exactly once in a `_constants.ts` file.

```ts
// src/data/_constants.ts

// Every financial value, count, threshold, and ID that appears on >1 screen
export const REVENUE_VALUES = {
  source_a: 203_200_000,
  source_b: 198_700_000,
  source_c: 196_100_000,
  variance: 2_400_000,
} as const;

export const ANNOTATION_COUNTS = {
  total: 342,
  autoAccepted: 287,
  pendingHigh: 34,
  medium: 14,
  low: 7,
} as const;

export const SYSTEM_IDS = {
  SYSTEM_A: 'system-a',
  SYSTEM_B: 'system-b',
} as const;
```

**Rules:**
- All data files import from `_constants.ts` — never define a number inline that also appears elsewhere
- Use `as const` for all constant objects to get literal types
- Use numeric underscores for readability: `203_200_000` not `203200000`
- Compute derived values from constants: `deduplicationRate: Math.round((1 - uniqueEntities / rawRecords) * 100)`

### 6.2 Static data fixtures

Demos use pre-built data, not API calls. Data files export typed arrays and objects:

```ts
// src/data/metrics.ts
import { REVENUE_VALUES } from './_constants';
import type { ReconciliationMetric } from '../types/metric';

export const RECONCILIATION_METRICS: ReconciliationMetric[] = [
  {
    name: 'Total ARR',
    sources: [
      { sourceName: 'CRM', value: REVENUE_VALUES.source_a },
      { sourceName: 'Billing', value: REVENUE_VALUES.source_b },
      { sourceName: 'GL', value: REVENUE_VALUES.source_c },
    ],
    variance: { amount: -REVENUE_VALUES.variance, percent: -1.2 },
    status: 'material-discrepancy',
  },
  // ...
];
```

### 6.3 Multi-scenario support

When a demo supports multiple fictional companies or customer profiles, use a scenario system:

```ts
// src/scenarios/types.ts
export interface ScenarioData {
  company: CompanyInfo;
  systems: SystemDefinition[];
  annotations: Annotation[];
  entities: Entity[];
  metrics: ReconciliationMetric[];
  exhibits: Exhibit[];
  dealTimer: DealTimerConfig;
  storeSnapshots: Record<string, StoreSnapshot>;
}
```

```ts
// src/scenarios/ScenarioContext.tsx
const registry = new Map<string, ScenarioData>();

export function registerScenario(id: string, data: ScenarioData) {
  registry.set(id, data);
}

// In main.tsx:
registerScenario('scenario-a', scenarioAData);
registerScenario('scenario-b', scenarioBData);
```

**Key principle:** Screens call `useScenario()` to get data. No screen has conditional logic for specific scenarios. All scenario differences are expressed in the data, never in the UI code. (Principle: Two audiences, one truth)

### 6.4 URL parameters for demo control

Support these URL parameters for jumping to specific demo states:

- `?demo=scenario-id` — selects which scenario to load
- `?snapshot=state-name` — loads a store snapshot for a specific point in the demo flow

This lets presenters skip to any point in the demo without clicking through every screen.

### 6.5 Data validation

Add build-time validation to catch data inconsistencies:

```ts
// src/data/validate.ts
export function validateDemoData(): string[] {
  const errors: string[] = [];
  // Annotation buckets must sum to total
  const sum = COUNTS.autoAccepted + COUNTS.pendingHigh + COUNTS.medium + COUNTS.low;
  if (sum !== COUNTS.total) {
    errors.push(`Annotation count mismatch: ${sum} !== ${COUNTS.total}`);
  }
  return errors;
}

// Run in dev mode at startup:
if (import.meta.env.DEV) {
  const errors = validateDemoData();
  errors.forEach(err => console.warn(`[Validation] ${err}`));
}
```

---

## 7. Data Authoring

Demo data must look realistic to domain experts watching a live presentation. This section covers how to produce convincing data fixtures efficiently.

### 7.1 The hero-plus-filler pattern

Every data collection (annotations, entities, metrics, records) uses a two-tier approach:

1. **Hero records (5–15 per collection):** Hand-written entries that appear on showcase screens — the ones the presenter clicks on and expands. These carry domain-realistic field names, plausible sample values, realistic edge cases, and carefully tuned confidence scores that demonstrate the full range (high, medium, low). Hero records tell the demo's story.

2. **Filler records (the rest):** Programmatically generated entries that round out counts and provide visual density in tables and lists. Filler uses a deterministic PRNG so builds are reproducible — the same data appears on every page load, every `npm run build`, and every screen recording.

```ts
// Hero records — hand-crafted for the screens the presenter walks through
const HERO_ANNOTATIONS: Annotation[] = [
  makeAnnotation('ann-hero-001', SYSTEM_IDS.ATHENA, 'claims', 'totalCharge',
    'decimal(12,2)', ['1450.00', '820.50', '3100.00'],
    CONCEPT_IDS.CHARGE_AMOUNT, 'Charge > Total > Gross',
    95, 'auto-accepted',
    [{ conceptId: CONCEPT_IDS.ALLOWED_AMOUNT, conceptLabel: 'Payment > Allowed', confidence: 68 }]),
  // ... 4-10 more hero records covering high, medium, and low confidence
];

// Filler — generated to hit the target total
const FILLER = generatePlaceholderAnnotations(
  ANNOTATION_COUNTS.total - HERO_ANNOTATIONS.length,
  SYSTEM_IDS.ATHENA,
  'auto-accepted',
  [90, 99],
);

export const ALL_ANNOTATIONS = [...HERO_ANNOTATIONS, ...FILLER];
```

### 7.2 Deterministic pseudo-random generation

Never use `Math.random()` for data generation — it produces different data on every page load, making demos unpredictable and screenshots unreproducible. Use a seeded PRNG:

```ts
/**
 * Deterministic PRNG (mulberry32). Returns a function that yields values in [0, 1).
 * Same seed always produces the same sequence.
 */
function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

Seed the PRNG with a value derived from the data context (e.g., `systemId.length * 1000 + count`) so different collections produce different-looking data.

### 7.3 Domain-constrained generation pools

Filler records must be plausible for their context. Use per-entity pools that constrain which field names, data types, sample values, and mapped concepts are valid:

```ts
// Per-system field pools — realistic table/field combinations
const SYSTEM_FIELD_POOLS: Record<string, FieldEntry[]> = {
  [SYSTEM_IDS.ATHENA]: [
    { table: 'claims', field: 'totalCharge', dataType: 'decimal(12,2)', samples: ['1450.00', '820.50', '3100.00'] },
    { table: 'claims', field: 'payerName', dataType: 'varchar', samples: ['Aetna', 'UnitedHealthcare', 'BCBS'] },
    { table: 'encounters', field: 'visitDate', dataType: 'date', samples: ['2025-12-01', '2025-12-15', '2026-01-03'] },
    // ... 10-15 entries per system for variety
  ],
  [SYSTEM_IDS.KAREO]: [
    // Different field names and data types appropriate to this system
  ],
};

// Per-system concept pools — only concepts this system would realistically contain
const SYSTEM_CONCEPT_POOLS: Record<string, ConceptEntry[]> = {
  // An EHR has patient, encounter, diagnosis, procedure — NOT GL revenue
  [SYSTEM_IDS.ATHENA]: [
    { id: CONCEPT_IDS.PATIENT, label: 'Patient' },
    { id: CONCEPT_IDS.ENCOUNTER, label: 'Encounter' },
    { id: CONCEPT_IDS.DIAGNOSIS, label: 'Diagnosis' },
    { id: CONCEPT_IDS.PROCEDURE, label: 'Procedure' },
  ],
  // A billing system has claim, payment, denial, payer — NOT diagnosis
  [SYSTEM_IDS.KAREO]: [
    { id: CONCEPT_IDS.CLAIM, label: 'Claim' },
    { id: CONCEPT_IDS.PAYMENT, label: 'Payment' },
    { id: CONCEPT_IDS.DENIAL, label: 'Denial' },
    { id: CONCEPT_IDS.PAYER, label: 'Payer' },
  ],
};
```

The generator function draws from these pools using the deterministic PRNG:

```ts
export function generatePlaceholderAnnotations(
  count: number,
  systemId: string,
  status: AnnotationStatus,
  confidenceRange: [number, number],
): Annotation[] {
  const rng = mulberry32(systemId.length * 1000 + count);
  const fieldPool = SYSTEM_FIELD_POOLS[systemId];
  const conceptPool = SYSTEM_CONCEPT_POOLS[systemId];
  const results: Annotation[] = [];

  for (let i = 0; i < count; i++) {
    const field = fieldPool[Math.floor(rng() * fieldPool.length)];
    const concept = conceptPool[Math.floor(rng() * conceptPool.length)];
    const [lo, hi] = confidenceRange;
    const confidence = Math.round(lo + rng() * (hi - lo));

    results.push({
      id: `ann-gen-${systemId}-${status}-${i.toString().padStart(4, '0')}`,
      systemId,
      tableName: field.table,
      fieldName: `${field.field}_${i}`,
      dataType: field.dataType,
      sampleValues: field.samples,
      mappedConceptId: concept.id,
      mappedConceptLabel: concept.label,
      confidence,
      confidenceLevel: confidence >= 85 ? 'high' : confidence >= 60 ? 'medium' : 'low',
      status,
    });
  }
  return results;
}
```

### 7.4 Authoring rules

- Hero records use named IDs (`ann-hero-001`) and filler uses generated IDs (`ann-gen-athena-auto-accepted-0042`)
- Sample values in field pools must look like real data from the target domain — use actual field names from the real systems (e.g., athenahealth table names, HL7 field names, FHIR resource types)
- Distribute filler records across systems proportionally to the system's table/field count (larger systems get more records)
- After generating, validate that bucket counts sum correctly (see Section 6.5)

---

## 8. Interaction Patterns

### 8.1 Progressive disclosure (three layers)

Every data element follows this hierarchy (Principle: Progressive disclosure):

| Layer | What the user sees | When | Time to scan |
|---|---|---|---|
| **Layer 1: Dashboard** | Summary metric, RAG badge, trend arrow | Default view | < 5 seconds |
| **Layer 2: Detail** | Full table, source breakdown, status per item | Click to expand | 30–60 seconds |
| **Layer 3: Deep dive** | Lineage DAG, change history, raw field details | Click "Trace" or "Details" | Minutes |

### 8.2 Bulk actions for time pressure

Every review-type screen must include a bulk action that accelerates the workflow (Principle: Time-aware design):

- "Accept all High-confidence" — batch-confirm items above a threshold
- "Merge all above 92%" — auto-merge high-confidence matches
- "Acknowledge low-priority alerts" — dismiss non-critical items

These buttons should:
1. Show a count of affected items
2. Trigger a brief processing animation (1–3 seconds)
3. Update counters and progress bars with animated transitions
4. Log the action visually (show a success toast or status update)

### 8.3 Simulated processing

Demo interactions that represent real-world compute (ingestion, annotation, reconciliation) should show a multi-step processing overlay:

```ts
const PROCESSING_STEPS = [
  { label: 'Connecting to source systems', durationMs: 800 },
  { label: 'Discovering schemas', durationMs: 1200 },
  { label: 'Running annotation models', durationMs: 1500 },
  { label: 'Computing confidence scores', durationMs: 600 },
];
```

Each step transitions from pending → running (with spinner) → complete (with checkmark). Total processing time should be 3–6 seconds — long enough to feel real, short enough to not bore the viewer.

### 8.4 Click-to-trace lineage

Any number displayed in a metric or table should be clickable (Principle: Auditability). Clicking opens a side panel or navigates to a lineage view showing:

1. The calculation formula
2. Each input concept
3. Each source field contributing to that concept
4. A "Trace to source" button that opens the DAG view

### 8.5 Animated counters

When values change (after bulk accept, processing complete, etc.), animate the transition:

```ts
function useAnimatedCounter(target: number, duration = 1000, enabled = true) {
  const [value, setValue] = useState(enabled ? 0 : target);
  useEffect(() => {
    if (!enabled) { setValue(target); return; }
    const start = value;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, enabled]);
  return value;
}
```

### 8.6 Persona-adapted views

When a demo serves multiple personas, all personas consume the same `ScenarioData` — never maintain parallel datasets. Persona differences are expressed through layout, filtering, density, and available actions. (Principle: Two audiences, one truth)

**Rules:**
1. **One data source.** Every persona's screen reads from the same scenario data arrays via `useScenario()`. No persona-specific data files.
2. **Layout varies, data doesn't.** An operations user sees the full data table with inline edit controls and action buttons. An executive user sees the same data as a 4-card summary dashboard. Both read from `scenario.metrics`.
3. **Information density by role.** Analyst/operator personas default to "compact" density (28px rows, more columns visible). Executive personas default to "comfortable" density (36px rows, summary cards).
4. **Actions vary by role.** Sell-side/preparer views show "Resolve", "Accept", "Edit" actions. Buy-side/verifier views show "Flag Discrepancy", "Compare", "Trace to Source" (read-only with audit affordances).
5. **Labeling adapts.** The same metric might be labeled "Reported ARR" in the sell-side view and "Seller-Reported ARR" in the buy-side view. The underlying value is identical.

```tsx
// Example: same ReconciliationMetric rendered differently per persona
// Sell-side view — editable, with resolve actions
<ReconciliationRow metric={metric} onExpand={expand}
  actions={<button onClick={resolve}>Resolve</button>} />

// Buy-side view — read-only, with flag action
<ReconciliationRow metric={metric} onExpand={expand}
  actions={<button onClick={flag}>Flag Discrepancy</button>} />

// Both read from: const { metrics } = useScenario();
```

---

## 9. Number Formatting

Use consistent formatters everywhere. Define them once in `src/utils/formatters.ts`:

```ts
// Currency: $203.2M, $1.1M, $500K, $47,832
export function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000) {
    const m = abs / 1_000_000;
    return `${sign}$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (abs >= 100_000) {
    const k = abs / 1_000;
    return `${sign}$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return `${sign}$${abs.toLocaleString('en-US')}`;
}

// Percentage: 7.8%, 84%, 96.2%
export function formatPercentage(value: number): string {
  return `${value % 1 === 0 ? value.toFixed(0) : value.toString()}%`;
}

// Number with commas: 47,832
export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

// Signed delta: +$500K, -$2.4M
export function formatDelta(value: number): string {
  const formatted = formatCurrency(value);
  return value > 0 ? `+${formatted}` : formatted;
}
```

---

## 10. File Organization

```
src/
├── components/
│   ├── layout/          # AppShell, TopBar, Sidebar, ScreenContainer
│   ├── clinical/        # TimeSeriesPanel, PatientInfoPanel, EventContextPanel, PatientTable (Section 16)
│   ├── data-display/    # DataTable, MetricCard, ReconciliationRow, WaterfallChart
│   ├── feedback/        # ConfidenceBadge, StatusBadge, ProgressBar, ProcessingOverlay, DealTimer
│   ├── interactive/     # BulkAcceptButton, DrillDownPanel, ToggleTabs, DiffView
│   ├── visualization/   # TopologyGraph, LineageDAG, ConcentrationChart
│   └── ErrorBoundary.tsx
├── data/
│   ├── _constants.ts    # THE single source of truth for all shared values
│   ├── validate.ts      # Build-time data validation
│   ├── [domain].ts      # Domain-specific data fixtures
│   └── ...
├── hooks/
│   ├── useAnimatedCounter.ts
│   ├── useScreenNavigation.ts
│   └── ...
├── scenarios/           # Multi-scenario support (if applicable)
│   ├── ScenarioContext.tsx
│   ├── types.ts
│   └── [scenario-name]/
├── screens/
│   ├── LandingPage.tsx
│   └── [persona]/       # e.g., sell-side/, buy-side/, hold-period/
│       ├── [Persona]Layout.tsx
│       ├── [Persona]Problem.tsx  # Dark-mode intro
│       ├── S1_ScreenName.tsx
│       ├── S2_ScreenName.tsx
│       └── ...
├── store/
│   ├── resetDemo.ts     # Global reset function
│   ├── scenarioStore.ts
│   └── [domain]Store.ts
├── styles/
│   └── globals.css
├── types/
│   └── [domain].ts      # TypeScript interfaces per domain
├── utils/
│   ├── colors.ts
│   ├── formatters.ts
│   └── layoutGraph.ts   # dagre layout helpers
├── App.tsx
└── main.tsx
```

**Naming rules:**
- Components: PascalCase (`MetricCard.tsx`)
- Screens: `{Number}_{DescriptiveName}.tsx` (`S1_SystemTopology.tsx`)
- Data files: lowercase kebab-case (`annotations.ts`, `dbt-models.ts`)
- Types: lowercase kebab-case matching the domain (`annotation.ts`, `metric.ts`)
- Constants: SCREAMING_SNAKE_CASE for values, PascalCase for type exports

---

## 11. State Management

### 11.1 Zustand stores

Each major interaction gets its own Zustand store. Stores track demo interaction state, not persistent data (data comes from fixtures).

```ts
// src/store/annotationStore.ts
import { create } from 'zustand';

interface AnnotationState {
  acceptedCount: number;
  totalCount: number;
  bulkAccepted: boolean;
  progressPercent: number;
  isProcessing: boolean;
  // Actions
  bulkAccept: () => void;
  reset: () => void;
}

export const useAnnotationStore = create<AnnotationState>((set) => ({
  acceptedCount: ANNOTATION_COUNTS.autoAccepted,
  totalCount: ANNOTATION_COUNTS.total,
  bulkAccepted: false,
  progressPercent: ANNOTATION_COUNTS.initialProgressPercent,
  isProcessing: false,
  bulkAccept: () => set({
    bulkAccepted: true,
    acceptedCount: ANNOTATION_COUNTS.autoAccepted + ANNOTATION_COUNTS.pendingHigh,
    progressPercent: ANNOTATION_COUNTS.postBulkAcceptPercent,
  }),
  reset: () => set({ /* initial values */ }),
}));
```

### 11.2 Global reset

Implement a global reset shortcut (`Ctrl+Shift+R`) that clears all stores and returns to the landing page:

```ts
// src/store/resetDemo.ts
export function resetAllStores() {
  useAnnotationStore.getState().reset();
  useEntityStore.getState().reset();
  // ... all stores
}
```

### 11.3 Scenario store persistence

Use Zustand's `persist` middleware with `sessionStorage` for the active scenario ID, so page refresh stays on the correct scenario:

```ts
export const useScenarioStore = create(
  persist<ScenarioStoreState>(
    (set) => ({
      scenarioId: 'default',
      setScenario: (id: string) => set({ scenarioId: id }),
    }),
    { name: 'scenario-store', storage: createJSONStorage(() => sessionStorage) }
  )
);
```

---

## 12. Landing Page Pattern

Every demo starts with a landing page that provides:

1. **Product name and one-line value proposition** (centered, large text)
2. **Scenario selector** (if multiple scenarios exist) — cards showing company name, industry, key stats
3. **Persona entry points** — 2–4 buttons/cards, one per demo flow (e.g., "Sell-side Preparation", "Buy-side Verification", "Post-Acquisition Operations")
4. **Keyboard shortcut hint** — small text showing Ctrl+Shift+R to reset

The landing page has no sidebar or TopBar. It is a clean entry point.

---

## 13. Error Handling

### ErrorBoundary

Wrap the entire app in an ErrorBoundary that:
- In dev mode: shows the error message and stack trace with a red border
- In production: shows a friendly message with reset instructions

```tsx
// Minimal production fallback:
<div style={{ padding: 24, textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
  <p>Something went wrong — press Ctrl+Shift+R to reset.</p>
</div>
```

### Data validation errors

Surface data validation errors in the browser console during development, not in the UI. Use `console.warn` with a branded prefix: `[ProductName] Data validation errors:`.

---

## 14. Demo-Specific Adaptations

When adapting this system to a new product domain, change these elements:

| What changes | What stays the same |
|---|---|
| Company names, logos, industry terms | Color system, typography, spacing |
| Data fixture values and types | Component patterns, layout structure |
| Screen names and flow order | Routing architecture, state management |
| Domain-specific terminology | Confidence badges, status badges, reconciliation rows |
| Number of screens per flow | File organization, naming conventions |
| Specific chart types needed | Chart styling, axis formatting |
| Pain-point statistics on problem screens | Problem screen visual structure |
| Deal timer labels and durations | Deal timer component pattern |
| Field pools and concept pools for data generation | Hero-plus-filler architecture, deterministic PRNG |
| Persona names and role labels | Persona-adapted view pattern (shared data, varied presentation) |

**What never changes across demos:**
- JetBrains Mono for numbers, Inter for text
- Three-tier confidence system (High/Review/Manual)
- RAG status badges (green/amber/red)
- Progressive disclosure (dashboard → detail → deep dive)
- Single source of truth via `_constants.ts`
- Zustand for interaction state, static fixtures for data
- White-background workspace with persistent sidebar
- Dark-mode problem screens as flow intros
- Desktop-only, 1280px minimum viewport
- WCAG 2.1 AA accessibility baseline
- Deterministic data generation (seeded PRNG, never Math.random)

---

## 15. Checklist for New Demos

Before marking a demo complete, verify:

**Visual design:**
- [ ] All financial values use JetBrains Mono font
- [ ] Every status uses the RAG system (green/amber/red) with text labels
- [ ] Tables use consistent header styling (12px uppercase gray)
- [ ] Cards have consistent border, padding, and hover states
- [ ] All text meets WCAG 2.1 AA contrast requirements (4.5:1 normal, 3:1 large)
- [ ] All badges include text labels (not color alone)
- [ ] All interactive elements are keyboard-accessible (Tab + Enter/Space)

**Data integrity:**
- [ ] All numbers that appear on multiple screens are defined in `_constants.ts`
- [ ] No hardcoded numbers in screen components (all from constants or data fixtures)
- [ ] Data validation runs at startup in dev mode with zero errors
- [ ] Filler data uses deterministic PRNG (same data on every page load)
- [ ] Domain-constrained concept pools prevent nonsensical data combinations
- [ ] `npm run build` passes with zero errors (TypeScript strict mode)

**Interaction patterns:**
- [ ] Every AI/automated output has a confidence badge (High/Review/Manual)
- [ ] Processing animations show multi-step progress (not just a spinner)
- [ ] Bulk action buttons show affected item counts
- [ ] Click-to-trace lineage works on at least one key metric

**Structure:**
- [ ] Landing page has scenario selection and persona entry points
- [ ] Each demo flow starts with a dark-mode problem screen with 3–4 pain stats
- [ ] Problem screen stats use industry-realistic numbers from `_constants.ts`
- [ ] Ctrl+Shift+R resets all state and returns to landing page
- [ ] URL parameters work for scenario selection and state jumping
- [ ] Deal timer configured in TopBar (if the demo has a time-bounded workflow)

**Multi-persona (if applicable):**
- [ ] All personas consume the same `ScenarioData` via `useScenario()`
- [ ] No persona-specific data files — differences are layout/actions/density only
- [ ] Persona entry points on landing page route to distinct flows

**Clinical annotation screens (if applicable — see Section 16):**
- [ ] Plotly.js used only for interactive time-series panels, not for static charts
- [ ] All AI findings display confidence badges (High/Review/Manual) and provenance (model name)
- [ ] Approve/reject workflow on every pending AI finding
- [ ] "Approve all High-confidence" bulk action available with affected count
- [ ] Click-to-focus: selecting an AI finding highlights the corresponding chart region
- [ ] Drag-to-select creates human annotations on time-series charts
- [ ] Patient data fixtures use deterministic PRNG (no Math.random)
- [ ] Multi-patient table view shows summary for all patients
- [ ] Patient switching updates all panels and charts consistently

---

## 16. Clinical Time-Series Annotation Interface

This section specifies the patterns for clinical monitoring and annotation screens — interactive time-series visualization with AI-assisted anomaly detection and human review. These screens appear as individual screens within a larger multi-screen demo, using the standard AppShell (TopBar + Sidebar) from Section 4.1.

### 16.1 Plotly.js — documented exception

Plotly.js is used instead of Recharts for interactive time-series panels. This is the one permitted exception to the "Recharts only" charting rule. The justification:

- **Drag-to-select annotation creation** — Plotly's native box-select (`relayout` event) enables users to drag across a chart region to create an annotation. Recharts has no equivalent.
- **Stacked synchronized panels** — Plotly handles multiple vertically-stacked chart panels sharing a synchronized x-axis (time) with independent y-axes.
- **Performance at scale** — Plotly handles 1,000+ data points per channel with smooth panning and zooming via WebGL.

**Scope constraint:** Plotly is used exclusively for the interactive time-series panels described in this section. All other charts in the demo (dashboards, reconciliation, waterfall, cohort) still use Recharts.

Use the minified bundle to reduce payload:
```ts
import Plot from 'react-plotly.js';
// In package.json, use plotly.js-dist-min (not plotly.js-dist) to save ~1.5MB
```

### 16.2 Layout: three-panel clinical view

The clinical annotation screen uses a three-panel layout inside the standard AppShell. The TopBar shows the patient name, monitoring context timer (Section 5.8), and notification indicators. The Sidebar shows the demo screen navigation (this is one screen in a multi-screen flow).

```
┌── TopBar: [Logo] Patient: J. Doe, 45M — MRN 123456  ─── [Day 1 of 3 │ ICU] ──┐
├── Sidebar ──┬──────────────────────────────────────────────────────────────────┤
│  Screen nav │  PatientInfo │  Stacked Time-Series Panels  │ Event Context     │
│             │  (15% width) │  (55% width)                 │ Panel (30% width) │
│  1. Ingest  │              │                              │                   │
│  2. Monitor │  Demographics│  ┌─ Heart Rate ────────────┐ │ [Tabs: All | Notes│
│  3. Triage  │  Vitals      │  │  ▔▔▔▁▁▔▔▁▁▔▔▔▁▁▔▔▔    │ │  | Meds | Events │
│  ...        │  Diagnoses   │  └────────────────────────┘ │  | AI Findings]   │
│             │  Allergies   │  ┌─ ECG ──────────────────┐ │                   │
│             │  Medications │  │  ⋀⋁⋀⋁⋀⋁⋀⋁⋀⋁⋀⋁⋀⋁⋀⋁   │ │ Finding card     │
│             │              │  └────────────────────────┘ │ Finding card     │
│             │              │  ┌─ Medications ──────────┐ │ Finding card     │
│             │              │  │  ● ● ●   ●  ●         │ │                   │
│             │              │  └────────────────────────┘ │                   │
│             │              │  ┌─ Labs ─────────────────┐ │                   │
│             │              │  │  ○   ○   ○   ○         │ │                   │
│             │              │  └────────────────────────┘ │                   │
│             │              │  ┌─ Clinical Events ──────┐ │                   │
│             │              │  │  ▪   ▪     ▪   ▪       │ │                   │
│             │              │  └────────────────────────┘ │                   │
│             │              │  [◀ Prev] ──slider── [Next ▶] [🔖]             │
├─────────────┴──────────────┴──────────────────────────────┴───────────────────┤
```

**Width allocation** (of the main content area, excluding sidebar):
- Patient info panel: 15%, min-width 200px
- Time-series panels: 55%, flexible
- Event context panel: 30%, min-width 300px

All three panels fill the full viewport height (minus TopBar). Each panel scrolls independently.

### 16.3 Time-series channel types

Five channel types, each rendered as a stacked horizontal panel sharing a synchronized time x-axis:

| Channel | Rendering | Y-axis | Data shape |
|---|---|---|---|
| **Heart Rate** | Continuous line chart | BPM (40–200) | `{ timestamp, value }` — continuous signal with gaps |
| **ECG** | Continuous line chart | mV (−2 to 20) | `{ timestamp, value }` — waveform with QRS complexes |
| **Medications** | Event markers (vertical lines or dots) | Categorical (drug names) | `{ timestamp, name, dose, route }` |
| **Labs** | Scatter plot with reference range bands | Varies by test (e.g., mg/dL) | `{ timestamp, name, value, unit, referenceRange }` |
| **Clinical Events** | Event markers with category icons | Categorical | `{ timestamp, type, title, description }` |

**Channel colors** (from the system accent palette):

```ts
const CHANNEL_COLORS = {
  heart_rate: '#22C55E',   // green
  ecg:        '#3B82F6',   // blue
  medications: '#EC4899',  // pink — distinct from error-red and anomaly overlay
  labs:        '#8B5CF6',  // purple
  events:      '#F97316',  // orange
} as const;
```

**Continuous signal channels** (HR, ECG) use Plotly `scatter` traces with `mode: 'lines'`. Gaps in data render as breaks in the line (use `null` values).

**Event channels** (Medications, Labs, Clinical Events) use Plotly `scatter` traces with `mode: 'markers+text'` or custom shapes. Each event is a point on the timeline with hover details.

**Clinical event types:**

```ts
type ClinicalEventType =
  | 'admission'
  | 'discharge'
  | 'diagnosis'
  | 'prescription_refill'
  | 'procedure'
  | 'consultation'
  | 'transfer'
  | 'code_blue'
  | 'lab_order'
  | 'imaging';
```

### 16.4 AI annotation overlay pattern

AI-detected anomalies and artifacts render as colored semi-transparent rectangles overlaid on the time-series charts. Each overlay corresponds to an AI finding in the Event Context Panel.

```ts
interface AIAnnotation {
  id: string;
  source: 'ai';
  startTime: Date;
  endTime: Date;
  timeSeriesType: string;         // which channel this applies to
  artifactType: 'anomaly' | 'noise';
  confidence: number;             // 0–100 integer (matches Section 5.1 / 7.3 convention)
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  aiModel: string;                // provenance: which model flagged this
  detectionReason: string;        // plain-language explanation
  tags: string[];
  notes: string;
}
```

**Overlay rendering** via Plotly `shapes`:

```ts
// Each AI annotation becomes a Plotly shape overlaid on the chart
const shape = {
  type: 'rect',
  xref: 'x',
  yref: 'paper',           // full height of chart area
  x0: annotation.startTime,
  x1: annotation.endTime,
  y0: 0,
  y1: 1,
  fillcolor: getOverlayColor(annotation),
  opacity: getOverlayOpacity(annotation),
  line: { width: 1, color: getOverlayColor(annotation) },
};

function getOverlayColor(a: AIAnnotation): string {
  return a.artifactType === 'anomaly' ? COLORS.overlayAnomaly : COLORS.overlayNoise;
}

function getOverlayOpacity(a: AIAnnotation): number {
  if (a.approvalStatus === 'rejected') return 0.1;
  if (a.approvalStatus === 'approved') return 0.4;
  return 0.25; // pending
}
```

**Confidence badge on overlays:** Anomaly overlays are accompanied by a confidence badge mapped to the standard three-tier system (same thresholds as Section 5.1):

| Confidence | Tier | Badge |
|---|---|---|
| >= 85 | High | Green "High" pill |
| 60–84 | Review | Amber "Review" pill |
| < 60 | Manual | Red "Manual" pill |

Use the shared `getConfidenceLevel` utility for all confidence-to-tier mapping:

```ts
// src/utils/confidence.ts — single source of truth for confidence tier thresholds
export function getConfidenceLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 85) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}
```

### 16.5 Drag-to-select human annotation

Users create annotations by click-dragging across a region of any continuous signal chart. The interaction flow:

1. User drags on a chart panel → Plotly fires a `relayout` event with `x[0]`, `x[1]` selection range
2. A floating toolbar appears near the selection with two buttons: Confirm (checkmark) and Cancel (X)
3. On confirm, a `HumanAnnotation` is created and added to the Events panel

```ts
interface HumanAnnotation {
  id: string;
  source: 'human';
  startTime: Date;
  endTime: Date;
  timeSeriesType: string;
  tags: string[];
  notes: string;
  createdBy: string;
  createdAt: Date;
}
```

The confirm/cancel toolbar uses Tailwind-styled buttons positioned absolutely relative to the chart container:

```tsx
{currentSelection && (
  <div className="absolute top-2 right-2 z-10 flex gap-1">
    <button onClick={confirmSelection}
            className="p-1.5 rounded bg-green-600 text-white hover:bg-green-700">
      <Check className="w-4 h-4" />
    </button>
    <button onClick={cancelSelection}
            className="p-1.5 rounded bg-gray-400 text-white hover:bg-gray-500">
      <X className="w-4 h-4" />
    </button>
  </div>
)}
```

### 16.6 Event context panel

The right-side panel uses tabbed navigation to show different event types. All tabs draw from the same underlying event/annotation data.

**Tabs:**

| Tab | Contents | Badge |
|---|---|---|
| All Events | All events chronologically | — |
| Notes | Nurse notes, physician notes | — |
| Medications | Administered medications | — |
| Clinical Events | Admissions, discharges, diagnoses, refills, procedures | — |
| AI Findings | AI-detected anomalies and noise | Badge showing pending count |

**AI Findings tab layout:**

Each AI finding renders as a card:

```tsx
<div className={`mx-2 my-1 border rounded-lg overflow-hidden ${
  isFocused ? 'border-blue-500 border-2 bg-blue-50' :
  annotation.approvalStatus === 'pending' ? 'border-amber-300 border-2' :
  'border-gray-200'
}`}>
  <div className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50"
       onClick={() => handleFocusAnnotation(annotation)}>
    {/* AI icon */}
    <BotIcon className="w-6 h-6 flex-shrink-0" style={{ color: getOverlayColor(annotation) }} />

    <div className="flex-1 min-w-0">
      {/* Header: artifact type + badges */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-semibold text-gray-900">
          {annotation.artifactType}
        </span>
        <ConfidenceBadge level={getConfidenceLevel(annotation.confidence)}
                         score={annotation.confidence} />
        <ApprovalStatusBadge status={annotation.approvalStatus} />
      </div>

      {/* Detection reason */}
      <p className="text-sm text-gray-600 mb-1">{annotation.detectionReason}</p>

      {/* Provenance + time range */}
      <p className="text-xs text-gray-400">
        {annotation.aiModel} · {annotation.timeSeriesType} ·
        {format(annotation.startTime, 'HH:mm:ss')} – {format(annotation.endTime, 'HH:mm:ss')}
      </p>

      {/* Approve/Reject buttons (pending only) */}
      {annotation.approvalStatus === 'pending' && (
        <div className="flex gap-2 mt-2">
          <button onClick={(e) => { e.stopPropagation(); approve(annotation); }}
                  className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium
                             bg-green-600 text-white hover:bg-green-700">
            <Check className="w-3 h-3" /> Approve
          </button>
          <button onClick={(e) => { e.stopPropagation(); reject(annotation); }}
                  className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium
                             border border-red-300 text-red-700 hover:bg-red-50">
            <X className="w-3 h-3" /> Reject
          </button>
        </div>
      )}
    </div>
  </div>
</div>
```

**Approval status badge:**

```ts
const APPROVAL_CONFIG = {
  pending:  { label: 'Pending',  className: 'bg-amber-100 text-amber-800' },
  approved: { label: 'Approved', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
};
```

**Bulk approve action** — At the top of the AI Findings tab, above the card list:

```tsx
<div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
  <span className="text-xs text-gray-500">
    {pendingCount} findings pending review
  </span>
  {pendingHighConfidenceCount > 0 && (
    <button onClick={bulkApproveHighConfidence}
            className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium
                       bg-blue-600 text-white hover:bg-blue-700">
      <CheckCheck className="w-3 h-3" />
      Approve all High ({pendingHighConfidenceCount})
    </button>
  )}
</div>
```

### 16.7 Click-to-focus interaction

Clicking an AI finding card in the Event Context Panel focuses the corresponding chart region. This is the clinical equivalent of click-to-trace lineage (Principle: Auditability).

**Behavior:**
1. Click a finding card → the card gets a blue focus border (`border-blue-500 border-2 bg-blue-50`)
2. The corresponding chart panel scrolls into view (if not visible) and the annotation overlay increases opacity
3. Click the same card again → focus clears, overlay returns to default opacity
4. Switching away from the AI Findings tab clears all focus state

**Implementation** via a shared context or Zustand store:

```ts
interface FocusRegion {
  start: Date;
  end: Date;
  timeSeriesType: string;
}

// In the clinical annotation store:
interface ClinicalAnnotationState {
  focusRegion: FocusRegion | null;
  focusedAnnotationId: string | null;
  setFocus: (region: FocusRegion | null, annotationId: string | null) => void;
  clearFocus: () => void;
}
```

Charts read from the store and conditionally increase overlay opacity or add a highlight border when the focused region overlaps their time range.

### 16.8 Patient info panel

The left panel shows static patient context. It follows the standard card-based layout with the design system's typography and spacing.

```ts
interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  dob: string;
  mrn: string;
  admissionDate: string;
  primaryDiagnosis: string;
  allergies: string[];
  vitals: {
    bp: string;
    hr: number;
    temp: number;
    spo2: number;
    rr: number;
  };
  medications: { name: string; dose: string; route: string; frequency: string }[];
}
```

**Layout:**
- Patient name and demographics at top (name in `text-lg font-semibold`, age/gender in `text-sm text-gray-500`)
- Sections separated by `border-b border-gray-200` dividers
- Vitals displayed with JetBrains Mono for numerical values
- Allergy chips use `bg-red-100 text-red-800 rounded-full px-2 py-0.5 text-xs`
- Active medications as a compact list

No MUI Avatar — use a simple icon from lucide-react (`User` or `UserRound`) with a `bg-blue-100 text-blue-600 rounded-full p-2` container.

### 16.9 Multi-patient table view

In addition to the single-patient annotation screen, the demo includes a multi-patient summary view — a table listing all patients with brief status summaries. This serves as the entry point before drilling into a specific patient's time-series data.

**This is a separate screen** in the demo flow (e.g., `S1_PatientOverview.tsx`), using Screen Template A (Review Screen) from Section 4.5.

```ts
interface PatientSummary {
  id: string;
  name: string;
  age: number;
  gender: string;
  mrn: string;
  location: string;            // "ICU Bed 4", "Ward 3B Room 12"
  primaryDiagnosis: string;
  acuity: 'critical' | 'high' | 'medium' | 'low';
  aiFindings: {
    total: number;
    pendingReview: number;
    highConfidence: number;
  };
  lastVitals: {
    hr: number;
    bp: string;
    spo2: number;
    temp: number;
  };
  admissionDate: string;
  attendingPhysician: string;
}
```

**Table columns:**

| Column | Width | Content |
|---|---|---|
| Patient | 200px | Name + MRN + age/gender |
| Location | 120px | Bed/room assignment |
| Diagnosis | 180px | Primary diagnosis, truncated |
| Acuity | 80px | RAG badge: critical=red, high=amber, medium=gray, low=green |
| AI Findings | 140px | "{pending} pending / {total} total" with amber badge if pending > 0 |
| Latest HR | 80px | JetBrains Mono, colored if out of range |
| Latest SpO2 | 80px | JetBrains Mono, colored if < 95% |
| Admitted | 100px | Relative date ("2d ago", "14h ago") |
| Actions | 80px | "View" button → navigates to single-patient annotation screen |

**Metric cards** above the table show aggregate stats:

```ts
const OVERVIEW_METRICS = [
  { label: 'Total Patients', value: patients.length },
  { label: 'Critical Acuity', value: criticalCount, status: 'negative' },
  { label: 'AI Findings Pending', value: totalPending, status: 'negative' },
  { label: 'High-Confidence Findings', value: totalHighConfidence },
];
```

**Patient switching:** Clicking "View" on a patient row (or clicking the patient name) navigates to the annotation screen with that patient's data loaded. The TopBar updates to show the selected patient's name and MRN. A "Back to Patient List" link in the TopBar or breadcrumb returns to the table view.

Implement patient selection via a Zustand store:

```ts
interface PatientStore {
  activePatientId: string | null;
  setActivePatient: (id: string | null) => void;
  reset: () => void;
}
```

Screens read the active patient ID and filter scenario data accordingly:

```ts
const { activePatientId } = usePatientStore();
const patient = scenario.patients.find(p => p.id === activePatientId);
```

### 16.10 Navigation controls

A thin control bar (48px height) below the time-series panels provides temporal navigation:

```
[◀ Prev Event] [▶ Next Event] ────── time slider ────── [time range display] [🔖 Bookmark]
```

- **Prev/Next Event:** Jump to the previous/next AI finding or clinical event in chronological order
- **Time slider:** Scrub through the monitoring window
- **Time range display:** Shows current visible range in `HH:mm – HH:mm` format using JetBrains Mono
- **Bookmark:** Save the current view state (time range + focused annotation) for later reference

### 16.11 Signal generation for clinical demos

Clinical time-series data uses the same deterministic hero-plus-filler approach from Section 7, adapted for physiological signals.

**Continuous signals** (HR, ECG) are generated mathematically:

```ts
interface SignalGeneratorConfig {
  baselineHR: number;          // resting heart rate (e.g., 72)
  hrVariability: number;       // beat-to-beat variation (e.g., 3)
  circadianAmplitude: number;  // daily rhythm amplitude (e.g., 10)
  activitySpikeProbability: number;
  gapProbability: number;      // probability of data gaps
}
```

- **Heart Rate:** Baseline + circadian component + activity spikes + noise. Use the seeded PRNG for noise, but activity spike timing can use fixed positions (like artifact placement).
- **ECG:** Simplified waveform from three Gaussian components (P wave, QRS complex, T wave) parameterized by the current heart rate. Beat interval = 60 / HR.
- **Data gaps:** Random gaps (sensor disconnects) simulated by returning `null` values for short stretches.

**Event channels** (Medications, Labs, Clinical Events) use pre-defined fixture arrays:

```ts
// In _constants.ts or scenario data:
export const MEDICATIONS = [
  { timestamp: new Date('2025-01-15T08:00:00'), name: 'Metoprolol', dose: '25mg', route: 'PO' },
  { timestamp: new Date('2025-01-15T12:00:00'), name: 'Acetaminophen', dose: '500mg', route: 'PO' },
  // ...
] as const;

export const CLINICAL_EVENTS = [
  { timestamp: new Date('2025-01-14T14:30:00'), type: 'admission', title: 'ED Admission',
    description: 'Admitted via ED with chest pain' },
  { timestamp: new Date('2025-01-14T16:00:00'), type: 'diagnosis', title: 'Acute MI Diagnosed',
    description: 'Troponin elevated, ST changes on 12-lead' },
  { timestamp: new Date('2025-01-15T09:00:00'), type: 'procedure', title: 'Cardiac Catheterization',
    description: 'LAD 80% stenosis, stent placed' },
  // ...
] as const;
```

**Artifact placement** for AI detection uses fixed positions within the time range (same pattern as Section 7.3 — deterministic, not random):

```ts
const ANOMALY_POSITIONS = [0.1, 0.25, 0.5, 0.75, 0.9]; // % of time range
const NOISE_POSITIONS = [0.2, 0.6];                       // % of time range
```

### 16.12 Extending ScenarioData for clinical demos

Add a `patients` field to `ScenarioData` for demos that include clinical annotation screens:

```ts
interface ScenarioData {
  // ... existing fields from Section 6.3 ...
  patients?: PatientData[];              // multi-patient support
  clinicalEvents?: ClinicalEvent[];      // shared clinical event timeline
  aiAnnotationConfig?: {
    modelName: string;                   // e.g., 'MTN-CardioNet-v2.1'
    anomalyPositions: number[];          // fixed positions as % of time range
    noisePositions: number[];
    confidenceRange: [number, number];   // e.g., [55, 95] (0–100 integers)
  };
  monitoringWindow?: {
    durationHours: number;               // e.g., 72 for 3-day ICU stay
    label: string;                       // e.g., 'ICU Monitoring Window'
  };
}
