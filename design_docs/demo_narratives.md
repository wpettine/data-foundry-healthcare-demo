# Demo Narrative: PE-Backed Orthopedic Platform

## Target Audience

Healthcare operating partner with clinical decision support model experience. Interested in the larger business narrative of PE portfolio value creation and in how the medical data annotation suite applies to day-to-day clinical intelligence work. Familiar with the data wrangling burden of building models across heterogeneous clinical systems.

## Narrative Principles

- Stay at 10,000-ft finance level. The audience doesn't need clinical education — he needs to see his P&L problems reflected back, then realize the tool underneath is more powerful than the immediate use case.
- Each situation demonstrates a key business or technical idea by striking at a specific pain point the audience has today. They should see it as solving a problem they already have.
- The situations are sequential, not parallel. Each one builds on the last, and each reveals that the underlying capability is broader than the specific application. By Situation 4, the audience realizes the prior auth tool and the CDS feature assembly tool are the same product.
- **The application must feel like real software.** The audience is stepping into specific situations where the product is already in use. No "demo walkthrough" framing, no numbered scenes in the sidebar, no dark-mode problem screens with pain stats. The pain points surface through what the software reveals, not through slides that precede it.

## Scenario Context

Summit Orthopedics Group — PE-backed orthopedic platform. 20 locations across three states, 15+ payer relationships, 3,000–5,000 TKA cases annually. Multiple EHR systems across acquired practices. The platform has been growing through bolt-on acquisitions.

## The Patient Thread

A single patient anchors the demo: a 67-year-old female with progressive right knee osteoarthritis, conservative treatment history spread across three organizations (PCP, PT clinic, orthopedic surgeon), each on a different EHR. She needs a total knee arthroplasty. Her coverage is Medicare Advantage through a regional carrier.

This patient appears in Situation 2 as the PA case, and returns in Situation 4 post-surgery with a remote biometric monitoring kit. The continuity makes the "one data layer, multiple applications" realization land without having to state it explicitly.

---

## Product Navigation Structure

The sidebar is a real application navigation, not a numbered demo flow. Sections are organized as a user would expect in an enterprise data platform:

```
WORKSPACE
  Dashboard
  Sources

INTEGRATION
  Schema Explorer
  Concept Map
  Payer Criteria

CLINICAL
  Patient Records
  PA Workbench

ANALYTICS
  Model Builder
  Annotation Studio

SYSTEM
  Pipeline Health
```

The presenter navigates this like a user would — jumping to the relevant section for each situation. Some sections show completed work (the integration happened weeks ago), some show work in progress (the PA is being assembled right now).

### Landing Page

Workspace selector. Clean entry point with no sidebar or TopBar. Shows "Summit Orthopedics Group" as the active workspace with company name, industry, location count, and key stats. If the Meridian scenario is built later, it appears as a second selectable workspace. Below the workspace selector: persona entry points or a single "Enter Workspace" button that drops into the Dashboard.

### Deal Timer

Persistent in the TopBar: "Day 22 of 90 — Integration Sprint." Color transitions green → amber → red as time progresses. Configured via scenario data.

### Store Snapshots (URL Parameters)

Three jumpable states for presenter flexibility:

| Snapshot | URL | State |
|---|---|---|
| Post-integration | `?scenario=day-22` | Dashboard populated, 20 sources integrated, denial data visible |
| PA active | `?scenario=pa-active` | PA Workbench with the TKA case mid-assembly, evidence partially reviewed |
| Model ready | `?scenario=model-ready` | Model Builder with dataset assembled, Annotation Studio populated |

---

## Situation 1: "We closed three weeks ago. Here's where we are."

**Business idea:** The window between acquisition close and operational visibility is a value-creation dead zone. The industry median is 3–6 months to a first consolidated report. The data foundry compressed it to days.

**Pain point:** The operating partner has a 60–90 day window to demonstrate early operational control to the board. Today, getting a consolidated view means a dedicated integration team of 2–5 FTEs spending 3–6 months building custom pipelines, at a cost of $250K–$400K in Year 1. Meanwhile, each week without visibility is a week where denial patterns, coding errors, and revenue leakage go undetected.

### Screen: Dashboard

**Template:** Review Screen (Template A)

The audience opens the application. It looks like it's been in use for weeks. The deal timer reads Day 22 of 90.

**Metric cards (top row, max 4):**
- 20 sources connected
- 4,847 fields mapped
- 94.2% auto-annotated
- 12 payer criteria sets loaded

**Primary content:** Summary table of source systems. Each row is a practice/system:

| Column | Content |
|---|---|
| Name | Practice name |
| EHR Platform | System name with accent-color chip |
| Locations | Count |
| Fields Mapped | Number (JetBrains Mono) |
| Annotation Completion | Percentage with inline progress bar |
| Last Sync | Timestamp |
| Status | Badge: Integrated (green) / Review (amber) |

Most rows show "Integrated." Two recently onboarded practices show "Review" — a few fields need human confirmation. These are the hero rows.

This screen feels like a status board someone checks every morning. The audience infers the speed — Day 22 and 20 sources are already connected.

### Screen: Sources

**Template:** Visualization Screen (Template B)

ReactFlow topology graph. Nodes represent source systems:
- Epic (flagship, blue accent)
- Athenahealth (mid-size groups, purple accent)
- ModMed (smaller practices, orange accent)
- eClinicalWorks (smaller practices, amber accent)
- WebPT (PT clinics, green accent)
- Pharmacy feed, reference labs (additional nodes)

Each node shows: system name, accent-colored header, field count, confidence indicator badge. Edges show concept linkages between systems with hover labels showing the mapped concept. Animated edges for active/recent data flows.

Clicking a node navigates to Schema Explorer filtered to that system.

### Screen: Schema Explorer

**Template:** Review Screen (Template A)

Detail view for a single source system's schema. Reached by clicking a node in Sources or navigating directly.

**Filter bar:** System selector dropdown, confidence filter (All / Review / Manual), search by field name or concept.

**Primary table:**

| Column | Content |
|---|---|
| Source Table | Table name from source system |
| Source Field | Field name |
| Data Type | e.g., varchar, decimal(12,2), date |
| Sample Values | 2–3 representative values |
| Mapped Concept | Semantic concept label with confidence badge |
| Confidence | High / Review / Manual badge |

**Hero rows demonstrate semantic reconciliation:**
- "contractual_adj" in ModMed mapped to same concept as "writeoff_contractual" + "writeoff_promptpay" in Athenahealth — one-to-many mapping with High confidence
- A "Review" badge on a field where the system mapped "encounter_date" but the actual data contains posting dates, not service dates — the kind of semantic mismatch that causes reporting errors

**Expandable row detail (Layer 2):** Alternative mappings considered, match scores, provenance (which model version produced the mapping).

**Bulk action:** "Accept all High-confidence" button with count of affected items.

**Key numbers surfaced through the product (not stated separately):**
- Industry median: 3–6 months to first consolidated report — the Day 22 timer communicates this implicitly
- The annotation completion percentages and field counts tell the scale story
- The "Review" items show the system isn't a black box — it flags uncertainty

---

## Situation 2: "A PA specialist is working a TKA case right now."

**Business idea:** Most TKA denials happen because documentation didn't travel, not because treatment didn't happen.

**Pain point:** 71% of TKA denials cite "nonoperative treatment had not been tried." The treatment was tried — the records are in three different systems. The PA specialist spends hours requesting records and manually assembling a timeline. Mean time to denial: 63.4 days per cycle.

### Screen: PA Workbench — Case Worklist

**Template:** Review Screen (Template A), enhanced with priority queue navigation.

A worklist designed for high-volume case processing under time pressure. This is the tool a PA specialist uses daily across 20 locations.

**Layout:**

```
┌── TopBar: [Logo] Data Foundry ──────────── [Day 22 of 90 │ Integration Sprint] ──┐
├── Sidebar ──┬────────────────────────────────────────────────────────────────────┤
│  Product    │  Summary Bar: 34 pending │ 12 ready │ 8 need evidence │ 14 review │
│  nav        ├────────────────────────────────────────────────────────────────────┤
│             │  Filter Bar: [Saved Views ▾] [Search...] [Payer ▾] [Status ▾]     │
│  WORKSPACE  ├────────────────────────────────────────────────────────────────────┤
│   Dashboard │  ☐ │▌Patient  │ Procedure  │ Payer    │ Deadlines      │Evidence  │
│   Sources   │────│──────────│────────────│──────────│────────────────│──────────│
│             │  ☐ │▌R.T.     │ 27447 TKA  │ Aetna MA │ Surg: 12d 🟡  │ ████░░   │
│  INTEG...   │    │          │ Right Knee │          │ SLA:  3d 🔴   │ 8/12 ⚠   │
│             │────│──────────│────────────│──────────│────────────────│──────────│
│  CLINICAL   │  ☐ │▌M.K.     │ 27447 TKA  │ BCBS MA  │ Surg: 18d 🟢  │ ███░░░   │
│   Patient.. │    │          │ Right Knee │          │ SLA:  6d 🟡   │ 7/12 ⚠   │
│  ►PA Work.. │────│──────────│────────────│──────────│────────────────│──────────│
│             │  ☐ │▌J.P.     │ 27447 TKA  │ United   │ Surg: 24d 🟢  │ ██████   │
│  ANALYTICS  │    │          │ Left Knee  │          │ SLA: 14d 🟢   │ 12/12 ✓  │
│   Model B.. │────│──────────│────────────│──────────│────────────────│──────────│
│   Annot..   │                                                                   │
│             │  [When ≥1 selected: sticky bulk action bar]                        │
│  SYSTEM     │  [  ☑ 3 selected  │ Accept All High │ Flag │ Reassign  ]          │
│   Pipeline  │                                                                   │
├─────────────┴────────────────────────────────────────────────────────────────────┤
```

**Summary metrics bar (above filter bar):** Aggregate counts: total cases, by-status breakdown (pending / ready / need evidence / in payer review), and at-risk count (SLA <24h). These are not metric cards — they're a compact inline summary in `text-sm`, leaving maximum space for the table.

**Filter bar:** Saved-views dropdown (e.g., "My Cases — Urgent," "All TKA — This Week"), quick search input, payer filter, status filter, procedure type filter. Saved views are convertible to named queues. Column configuration toggle on the right edge.

**Worklist table columns:**

| Column | Content | Notes |
|---|---|---|
| Checkbox | 24x24px | Multi-select for bulk actions |
| Priority | 4px left border | Color-coded: red (<24h SLA), amber (24–48h), green (>48h) |
| Patient | Initials, MRN | Inter `text-sm font-medium` |
| Procedure | CPT + description + laterality | e.g., "27447 — TKA, Right Knee" |
| Payer | Name with accent-color pill | Payer-specific color for at-a-glance identification |
| Deadlines | Dual countdown: Days to Surgery + Payer SLA | JetBrains Mono, three-state color (green >48h, amber 24–48h, red <24h). Two lines per cell. |
| Evidence | Mini stacked progress bar + fraction | 4px height, 120px wide. Green/amber/gray segments for met/review/missing. Fraction "8/12" in `text-xs font-mono`. |
| Status | Overall badge | "Ready" (green pill), "In Review" (amber), "Incomplete" (red) |

Default sort: composite priority score weighting SLA deadline proximity, days-to-surgery, denial likelihood, and revenue impact. Sortable on any column. The hero row is M.K. (the 67-year-old patient) — evidence shows "7/12" with amber status.

**Bulk action bar:** Slides in as a sticky top bar (CSS transition) when one or more rows are selected. Shows: selected count ("3 of 34 cases selected"), "Accept All High Confidence" button with count badge ("Accept 12 high-confidence matches across 3 cases"), Flag button, Reassign button. When items are ineligible for a bulk action, tooltip explains why. Bulk actions execute with a toast notification (bottom-left, 8-second undo window): "12 high-confidence items accepted across 3 cases — Undo."

**Keyboard shortcuts (active when focus is in table, disabled in text inputs):**
- `J` / `↓` = next row, `K` / `↑` = previous row
- `Enter` = open case detail
- `A` = accept highlighted row's high-confidence items
- `Shift+A` = accept and advance to next row
- `?` = show shortcut legend modal

Clicking a case row navigates to the case detail.

### Screen: PA Workbench — Case Detail

**Template:** Three-panel evidence-to-requirements workspace with collapsible context. This is the most important screen in the demo.

**Layout:**

```
┌─ Case Header (56px, sticky) ─────────────────────────────────────────────────────┐
│  [← Back] M.K., 67F │ DOB 1958-09-14 │ 27447 TKA Right Knee │ BCBS MA          │
│  🔗 Matched across 4 systems (96.2%)           [Save Draft] [Submit to BCBS MA] │
├──────────────┬───────────────────────────────────┬───────────────────────────────┤
│  Context     │  Evidence                         │  Requirements                │
│  (20%,       │  (45%)                            │  (35%)                       │
│  collapsible)│                                   │                              │
│              │  [Cards│Timeline]  [EMR│Lab│PT│Rx│ │  ████░░░░ 8/12 met          │
│  Demographics│   Imaging│All]                     │  ──────────────────────      │
│  - 67F       │                                   │                              │
│  - BMI 31.2  │  ┌─ Evidence Card ──────────────┐ │  ▼ Conservative Therapy 3/3  │
│  - MRN 482.. │  │ 🟣 PT — WebPT               │ │    ✅ NSAID trial            │
│              │  │ PT Session #12, 2025-11-08   │ │    ✅ Supervised PT ≥3mo     │
│  PA Summary  │  │ LEFS Score: 28/80            │ │    ✅ Documented failure     │
│  - Request # │  │ Confidence: High ●           │ │  ▼ Radiographic Evidence 1/2 │
│  - Filed:    │  │ "Continued limitation in     │ │    ✅ WB films <12mo         │
│    2026-03.. │  │  stair climbing, grocery     │ │    ⚠ KL Grade 3+ (88%)      │
│              │  │  carrying"                   │ │  ▶ Functional Status 1/1     │
│  Identity    │  └──────────────────────────────┘ │  ▼ Comorbidity Clear. 2/3    │
│  Resolution  │  ┌─ Evidence Card ──────────────┐ │    ✅ BMI documented          │
│  [Expand ▾]  │  │ 🔵 PCP — Epic               │ │    ⚠ HbA1c threshold        │
│              │  │ Office Visit, 2025-08-15     │ │    ✅ Smoking status          │
│  Case History│  │ Ibuprofen 800mg TID started  │ │  ▶ Laterality 1/1            │
│  [Expand ▾]  │  │ Confidence: High ●           │ │  ▼ Surgical History 0/1      │
│              │  └──────────────────────────────┘ │    ✖ Prior ipsilateral surg  │
│              │                                   │  ▼ PT Attendance 0/1         │
│              │                                   │    ✖ Session-level detail    │
│              │                                   │                              │
│              │                                   │  [Accept all High (8)]       │
│              │                                   │                              │
├──────────────┴───────────────────────────────────┴───────────────────────────────┤
```

**Case header bar (56px, sticky at top of detail view):**
- Back-to-worklist button (`Escape` keyboard shortcut)
- Patient name, sex, DOB in Inter `text-base font-semibold`
- PA request number, procedure (CPT 27447 — TKA, Right Knee), payer in `text-sm text-gray-600`
- Identity resolution summary badge: link icon + "Matched across 4 systems" + confidence badge (green/amber/red). Green = proceed; amber/red = auto-expand the identity detail in the context panel. Follows the research principle: if provenance metadata is hard to access, users skip it entirely.
- Primary action buttons: "Save Draft" (secondary), "Submit to [Payer Name]" (primary, active when all requirements Met or accepted at Review, disabled with tooltip showing remaining items when not ready)

**Panel layout:** Three resizable panels with drag-to-resize handles (1px visible border, invisible 17px grab zone, `cursor: col-resize` on hover). Default proportions at 1280px: context 20% (~256px, collapsible to 0), evidence 45% (~576px, min 320px), requirements 35% (~448px, min 256px). Double-click a divider to toggle between current and collapsed size. Each panel header is 40–48px fixed height, sticky during content scroll.

**Left panel — Case Context (20%, collapsible):**

Defaults to visible on case entry, remembers collapsed preference. Contains:

- **Patient demographics:** Age, sex, BMI, MRN. Compact layout.
- **PA request summary:** Request number, date filed, procedure, payer, assigned specialist.
- **Identity resolution detail:** Summary bar in `bg-slate-50 border border-slate-200 rounded-lg px-4 py-3`. Shows link icon, "Patient Matched Across 4 Systems," overall confidence badge in JetBrains Mono, primary match criteria ("DOB + Last Name + Address"). Expandable to per-system breakdown table:

| System | Patient ID | Match Method | Confidence | Verified |
|---|---|---|---|---|
| PCP — Epic | MRN 7291034 | DOB + Last + Address | 96.2% | Auto |
| PT — WebPT | PT-4821 | DOB + Last | 92.8% | Auto |
| Ortho — Athenahealth | MRN 4821937 | Direct (primary) | — | — |
| Pharmacy — Surescripts | Rx-991284 | DOB + Last + DOB | 98.1% | Auto |

- **Case history:** Links to prior PA submissions for this patient, if any.
- **Mini timeline preview:** A compact horizontal timeline (40px tall) showing the full treatment history at a glance, clickable to open the full timeline in the evidence panel.

**Center panel — Evidence (45%):**

**View toggle:** Cards view (default) | Timeline view — toggled via buttons in the panel header.

**Source category tabs:** All | EMR | Lab | Imaging | PT | Pharmacy. Tabs filter evidence to the selected source category. "All" is default.

**Cards view (default):** Scrollable evidence cards, each carrying:

- **Source badge:** Color-coded pill (`rounded-full px-2.5 py-0.5 text-xs font-medium`) with five fixed colors:
  - PCP — Epic: `bg-blue-100 text-blue-700`
  - PT — WebPT: `bg-purple-100 text-purple-700`
  - Ortho — Athenahealth: `bg-teal-100 text-teal-700`
  - Pharmacy — Surescripts: `bg-amber-100 text-amber-700`
  - Radiology: `bg-rose-100 text-rose-700`
  Each badge includes a small system-type icon (16px). Hover reveals tooltip with full system name, facility, record date, document type.

- **Event description:** Clinical content in Inter `text-sm`. E.g., "PT Session #12 — LEFS Score: 28/80. Continued limitation in stair climbing, grocery carrying, and prolonged walking."
- **Date:** In `text-xs text-gray-500`.
- **Confidence display (three-tier, progressive disclosure):**
  - **Layer 1 (always visible):** High-confidence items show only a green dot (`h-2 w-2 rounded-full bg-emerald-500`) with no percentage — these items fade into the background visually. Review items show amber dot plus percentage in JetBrains Mono (`text-xs text-amber-600`) with `border-l-2 border-amber-400` left accent. Manual items show red dot plus percentage in `text-sm font-semibold text-red-600` with `border-l-3 border-red-500` and inline prompt "Manual verification required."
  - **Layer 2 (hover tooltip):** Extraction confidence, semantic match confidence, combined score in JetBrains Mono.
  - **Layer 3 (click to expand):** Original text snippet with highlighted extraction, confidence factor breakdown, historical accuracy note ("This extraction type is typically 94% accurate"), override controls.

- **Linked highlighting state:** When a requirement is selected in the right panel, matching evidence cards receive a 2px left border plus light background tint using the requirement's assigned color (from a 6-color palette: blue-500, green-500, amber-500, purple-500, rose-500, teal-500). Non-matching cards dim to `opacity-70`. The panel auto-scrolls to the first match. A floating pill indicator appears at the top or bottom edge ("↓ 2 more matches below") when linked items are off-screen.

The PT clinic entries are the hero moment: LEFS scores extracted from WebPT, tagged with extraction confidence, linked to a patient matched across systems under a different MRN. The identity resolution is visible on the card as secondary text: "Patient matched via DOB + last name (92.8%)" in `text-xs text-gray-400`.

**Timeline view (toggled from Cards):** Horizontal swim-lane timeline with lanes organized by source system. This is the tool for verifying temporal requirements ("3 months of supervised PT") and investigating gaps.

- **Fixed left column (160px):** Lane labels with source system names, icons, and color dots matching the five-color source badge system.
- **Scrollable timeline canvas:** Common time axis (sticky at top), zoom controls. Five semantic zoom levels: Year → Quarter → Month (primary working zoom) → Week → Day. Mouse wheel zooms, arrow keys pan.
- **Event rendering:** Duration events (PT courses, medication trials) as horizontal bars with width proportional to duration — 28px tall rounded cards with 4px left border in source system color, truncated title in Inter `text-xs font-medium`, key values in JetBrains Mono `text-[10px]`. Point events (visits, injections, imaging) as diamond or circle icons at specific dates.
- **Requirement highlighting:** When a temporal requirement is selected in the right panel (e.g., "≥3 months supervised PT"), a semi-transparent band (`bg-amber-100/40`) spans the required time window with an annotation label pinned above ("Requirement: ≥3 months supervised PT") and a compliance indicator ("Met: 14 weeks documented" or "Gap: 2-week break in sessions, Mar 5–19"). Gaps in the event sequence within the highlighted band are immediately visible.
- **Minimap (40px tall, full width):** Above the main canvas. Complete timeline compressed as an event-density heatmap with the current viewport as a draggable overlay rectangle.
- **Filtering:** Persistent pills above the timeline — source system toggles (checkbox pills with source colors), event type dropdown, date range. Filtered-out events dim to `opacity-0.2` rather than disappearing, preserving temporal context.

**Right panel — Payer Requirements (35%):**

**Panel header (sticky):** Stacked progress bar (8px height, `rounded-full`, three segments: green/amber/gray for met/review/missing) with fraction text ("8/12 met") in JetBrains Mono. Below it: "Accept all High-confidence (8)" button — this refers to evidence-level matches within the Met requirements that were auto-accepted but haven't been explicitly confirmed by the specialist.

**Accordion-based hierarchy (two levels: parent categories, child requirements):**

Each parent category row (48px, 16px horizontal padding):
- Rotation-animated chevron (`w-5 h-5 text-gray-400 transition-transform duration-200`)
- Category name in `text-sm font-medium text-gray-900`
- Fractional badge (`rounded-full px-2.5 py-0.5 text-xs font-medium`) colored by **worst-case child status**: `bg-emerald-50 text-emerald-700` if all children High, `bg-amber-50 text-amber-700` if any child Review (none Manual), `bg-red-50 text-red-700` if any child Manual

Child requirement rows (40px, 32px left indent `ml-8`, connected by `border-l-2 border-gray-200` vertical line):
- Status icon (20x20px): CheckCircle in emerald-500, AlertCircle in amber-500, XCircle in red-500
- Requirement text in `text-sm text-gray-700` — the payer's specific language
- Confidence tier label in `text-xs font-semibold uppercase tracking-wide`

**Default expand/collapse behavior (priority-based disclosure):**
- Categories with any Manual/red children: auto-expand on case load
- Categories with any Review/amber children: auto-expand, but collapsible
- All-green categories: default collapsed
- "Expand Failing" button in panel header auto-expands only red/amber categories
- Multi-expand allowed — specialists need to compare across categories

**Bidirectional linked highlighting:** Clicking a child requirement highlights matching evidence in the center panel with the requirement's assigned color (from the 6-color palette), auto-scrolls to the first match, dims non-matching items. Reverse: clicking an evidence card highlights the requirements it satisfies in the right panel and scrolls them into view. Non-selected requirements dim to `opacity-70`.

**Review item detail (expandable, same chevron pattern as Schema Explorer):** For Review items, expanding shows:
- The payer's criterion text (exact language from coverage policy)
- The extracted evidence text (original clinical note snippet, highlighted)
- The semantic inference: "Radiology report describes 'severe tricompartmental OA' — inferred equivalent to KL Grade 3+ at 88% confidence"
- Alternative interpretations considered with lower scores
- [Accept] [Override] [Flag] action buttons

**Hero requirements for the demo:**
- "Supervised PT ≥3 months with documented functional outcome scores" — Met. Linked to 12 PT session cards from WebPT. Clicking this requirement in Cards view highlights all 12. Switching to Timeline view and clicking it shows the requirement band spanning the PT course duration with compliance indicator.
- "Kellgren-Lawrence Grade 3 or greater" — Review (88%). The radiology report says "severe tricompartmental osteoarthritis" without using KL grading language. Expanding this requirement shows the semantic inference and the original text. This is the moment the audience sees the system reasoning about clinical language, not just keyword matching.
- "HbA1c within threshold" — Review. The most recent HbA1c (7.8) is from 4 months ago in the PCP's Epic system. The payer requires a value within 3 months. The system flags this as temporally stale, not clinically inappropriate — a nuance that demonstrates semantic understanding.
- "Prior ipsilateral knee surgery documented" — Missing. No prior surgical records found for the right knee across any source system. The system searched all connected sources and found no matches. This is a documentation gap — the payer requires explicit confirmation that this is a primary (not revision) arthroplasty, and the absence of prior surgery records must be documented as a negative finding.
- "PT session-level attendance record" — Missing. The system has aggregate PT data from WebPT (12 sessions, LEFS scores) but the payer requires individual session-level attendance records with dates, duration, and modalities. The PT clinic's export doesn't include session-level detail. This demonstrates the "documentation didn't travel" problem at a granular level — the treatment happened, the summary is available, but the specific format the payer requires is missing.

**Interaction flow for the demo walkthrough:**

1. Presenter opens the case. Categories with Review or Missing items auto-expand. The progress bar shows "8/12 met, 2 review, 2 missing."
2. Presenter clicks "Supervised PT ≥3 months" requirement → evidence panel highlights 12 PT session cards from WebPT, auto-scrolls to the first one. The identity resolution note on the PT cards is visible: "Patient matched via DOB + last name (92.8%)."
3. Presenter switches evidence panel to Timeline view → the horizontal swim lanes show PT sessions as duration bars in the WebPT lane, NSAID trial as a bar in the PCP lane, injection as a point event. The requirement band highlights the 3-month window with "Met: 14 weeks documented."
4. Presenter clicks the "KL Grade 3+" Review item → expands to show the semantic inference. Presenter clicks "Accept" to confirm the inference.
5. Progress bar animates: "9/12 met."
6. `Escape` returns to the worklist. The case row's mini progress bar has updated.

**Keyboard shortcuts (active in case detail):**
- `A` = accept current Review item
- `Shift+A` = accept and advance to next Review item
- `J` / `K` = next / previous requirement
- `E` = expand/collapse current requirement detail
- `T` = toggle evidence panel between Cards and Timeline
- `Escape` = return to worklist

### Screen: Patient Records

**Template:** Review Screen (Template A)

Accessed from the case context panel or via the Clinical > Patient Records navigation. Shows the full assembled patient record across all sources — the Layer 3 deep dive.

**Primary table:**

| Column | Content |
|---|---|
| Record Type | Clinical note, lab result, imaging report, Rx, PT session |
| Source System | System name with accent-color pill (same 5-color system) |
| Date | Service date |
| Key Fields Extracted | Summary of structured data pulled |
| Confidence | Three-tier badge (dot + label for Review/Manual) |

Expandable rows show raw content alongside normalized extraction — original clinical text on the left, structured extracted fields on the right, with highlighted spans showing what was extracted and the confidence on each extraction. This is the full audit trail for any evidence item in the PA Workbench.

---

## Situation 3: "An ops manager is reviewing payer coverage across the platform."

**Business idea:** Integration complexity is nonlinear — every acquisition makes the payer documentation burden worse, and institutional knowledge doesn't scale.

**Pain point:** 20 locations, 15 payers, 300 distinct documentation requirement combinations. Staff learn payer patterns through experience. When a key PA specialist leaves or a new practice is acquired, that knowledge walks out the door.

**Operational trigger:** The group just onboarded three new practices in Ohio (two of the "Review" status systems visible on the Dashboard). The ops manager needs to verify that the existing payer criteria mappings cover the new practices' payer mix before PA submissions begin from those sites. She opens the Payer Criteria screen to check coverage.

### Screen: Payer Criteria

**Template:** Comparison Screen (Template C)

**Filter bar:** Procedure type selector (TKA selected), payer filter (showing 4–5 of 15, with "15 total" indicator and dropdown to switch).

**Comparison grid:**

| Criterion | LCD Baseline | BCBS MA | Aetna MA | UnitedHealthcare | Humana MA | Divergence |
|---|---|---|---|---|---|---|
| Conservative therapy duration | ≥3 months | ≥3 months | ≥6 months | ≥90 days PT + 30 days NSAID | ≥3 months | 2 of 4 diverge |
| Radiographic grading | KL Grade 3+ | KL Grade 3+ | "≥50% joint space narrowing" | "bone-on-bone contact" | KL Grade 3+ | 2 of 4 diverge |
| BMI threshold | Not specified | <40 | <45 | Not specified | <40, or documented weight mgmt | 3 of 4 add |
| HbA1c threshold | Not specified | <8.0 | <9.0 | <8.0 | Not specified | 3 of 4 add |
| Smoking cessation | Not specified | Not required | 30-day documented | Not required | 90-day documented | 2 of 4 add |

Each cell shows the payer's specific language. Cells diverging from the LCD baseline are highlighted with an amber background. A "Last Updated" timestamp per payer column, with amber badges on stale entries (90+ days since last refresh). Payer names match the named payers in the PA Workbench worklist; criteria values are illustrative, not sourced from actual payer policies.

**Divergence column** quantifies how many payers differ from baseline — the visual proof that institutional knowledge doesn't scale.

**Row expansion:** Click a criterion row to see the concept linkage — how the platform maps between the clinical documentation language and each payer's terminology. This is the Concept Map in context.

### Screen: Concept Map

**Template:** Visualization Screen (Template B)

DAG showing how a clinical concept flows across coding systems. Presenter picks "right knee osteoarthritis" from a concept search/selector and sees:

```
Clinical Note: "severe tricompartmental OA, right knee"
    ↓ (extraction, 94%)
SNOMED: Osteoarthritis of right knee (concept ID)
    ↓ (mapping)
ICD-10: M17.11 — Primary osteoarthritis, right knee
    ↓ (payer criteria mapping)
├── Payer A: "Kellgren-Lawrence Grade 3 or greater"
├── Payer B: "documented joint space narrowing ≥50%"
└── Payer C: "radiographic evidence of bone-on-bone contact"
```

Nodes show concept label, coding system, confidence badge. Edges show the mapping relationship. ReactFlow with dagre layout, zoom/pan controls.

The new acquisition moment surfaces here naturally: the ops manager sees that a recently onboarded practice (one of the "Review" status systems from the Dashboard) has fields mapping to existing concepts — the payer criteria apply immediately. The linear-not-quadratic economics are visible through the product, not stated as a talking point.

---

## Situation 4: "The analytics team is building a post-TKA complication model."

**Business idea:** The same data layer that assembles PA documentation assembles training features for clinical models. The operating partner's team can build clinical intelligence instead of wrangling data.

**Pain point:** The operating partner was supposed to build predictive models across the platform. His team spends all their time on data wrangling. Getting linked pre-op records, procedure details, and post-op biometric streams for 3,000 patients across 20 sites into a clean training table takes months. The model is straightforward. The data assembly is what kills it.

### Screen: Model Builder — Project View

**Template:** New pattern — mature product interface. This should feel like a fully realized feature, not a prototype.

**Layout:**

```
┌─ Project Header ────────────────────────────────────────────────────────────┐
│  Post-TKA Complication Risk    [Status: Dataset Assembled]    [Run Model ▶] │
│  Target: Infection / DVT / Readmission within 90 days                       │
│  Population: All TKA cases, platform-wide                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Metric cards: 3,247 eligible cases │ 18 sites │ 94% completeness │ 2,891  │
│                                     │          │                  │ w/ bio  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Feature Table                                                    [Filters] │
│                                                                             │
│  Category tabs: All │ Pre-Op │ Procedure │ Post-Op Biometrics               │
├─────────────────────────────────────────────────────────────────────────────┤
```

**Project header:**
- Model name, target variable, population definition
- Status badge: Draft → Features Selected → Dataset Assembling → Dataset Assembled → Model Training
- Action button appropriate to current state ("Assemble Dataset" or "Run Model")

**Metric cards (visible after dataset assembly):**
- 3,247 eligible cases
- 18 of 20 sites contributing
- 94% feature completeness
- 2,891 cases with biometric streams

**Feature table — the core of the screen:**

| Column | Content |
|---|---|
| Feature Name | Descriptive name |
| Category | Pre-op / Procedure / Post-op Biometric (filterable via tabs) |
| Source(s) | Source system names with accent chips (multiple chips when data spans systems) |
| Coverage | "18/20 sites, 89% of cases" — site count and case percentage |
| Mapping Confidence | Badge |
| Literature | Citation count with expandable references showing which papers suggest this feature |
| Include | Toggle (checked by default for suggested features) |

**Feature categories and hero rows:**

*Pre-op (from PA data already assembled):*
- HbA1c — Sources: PCP EHR (Epic, Athenahealth) — Coverage: 16/20 sites, 78% — Literature: 4 citations
- BMI — Sources: PCP EHR, Ortho EHR — Coverage: 20/20, 96% — Literature: 6 citations
- Smoking status — Sources: PCP EHR — Coverage: 18/20, 84% — Literature: 3 citations
- Conservative treatment duration — Sources: assembled PA record — Coverage: 20/20, 91% — Literature: 2 citations
- Comorbidity index — Sources: PCP EHR, specialist records — Coverage: 17/20, 82% — Literature: 5 citations

*Procedure:*
- Duration — Sources: Ortho EHR (operative report) — Coverage: 20/20, 98%
- Implant type — Sources: Ortho EHR, implant vendor records — Coverage: 20/20, 97%
- Anesthesia type — Sources: anesthesia records — Coverage: 15/20, 71%
- Estimated blood loss — Sources: operative report — Coverage: 19/20, 88%

*Post-op biometrics:*
- Temp trajectory (deviation from expected post-op curve) — Sources: Masimo, Biobeat — Coverage: 14/20, 68% — Note: "Normalized F→C across sites"
- Resting HR deviation from pre-op baseline — Sources: Masimo, Biobeat — Coverage: 14/20, 67% — Note: "Baseline-adjusted by device type"

**Expandable row detail:** For each feature, show the semantic mapping chain (source field → normalized concept → training column), the normalization applied, and sample value distributions per source system.

**Literature panel:** Expandable section or side panel showing the clinical papers that informed the feature suggestions, with relevance scores. Not a search engine — a curated list the system produced based on the model target.

**Processing moment:** When the user clicks "Assemble Dataset," a processing overlay (Section 8.3 pattern) shows the real work: connecting to sources, resolving patient identities across sites, normalizing units and coding systems, validating completeness, assembling the output table. This is a legitimate action, not a showpiece — the data pull is real work.

### Screen: Model Builder — Dataset View

**Template:** Review Screen (Template A)

The assembled training data. Visible after assembly completes (or pre-loaded via store snapshot).

**Metric cards:** Same as project view (3,247 patients, 18 sites, 94% completeness, 2,891 with biometric streams).

**Primary content:** Data table showing the assembled training data.
- Columns are features (sortable)
- Rows are anonymized patient records
- Dense layout — compact 28px rows, horizontal scroll for many features
- Per-column quality indicators in the header: completeness %, small sparkline showing distribution, outlier flag count

**Filter bar:** Filter by site, by completeness threshold, by outcome label (complication vs. no complication).

### Screen: Annotation Studio

**Template:** Clinical Time-Series (adapted from Section 16 — two biometric channels, clinical events timeline, clinical info panel)

The patient from Situation 2, now two weeks post-TKA with a remote monitoring kit.

**Patient switcher strip (above three-panel layout):**

A horizontal strip showing 6–8 patient cards in a scrollable row. Each card: patient initials, procedure type, post-op day, and a risk indicator dot (green/amber/red). The currently selected patient (M.K.) is highlighted with blue border. This communicates "one of many being monitored" — the system is running at scale across sites, triaging by risk. Clicking a card updates all three panels below.

**Layout (three-panel within standard AppShell, below patient strip):**

```
┌── TopBar: [Logo] Data Foundry ──────────── [Day 22 of 90 │ Integration Sprint] ──┐
├── Sidebar ──┬──────────────────────────────────────────────────────────────────────┤
│  Product    │  [J.R. 72M TKA Day 8 🟢] [M.K. 67F TKA Day 14/90 🔴] [A.P. ...] │
│  nav        ├──────────────────────────────────────────────────────────────────────┤
│             │  Clinical Info    │  Time-Series Panels       │  Context Panel       │
│  WORKSPACE  │  (15% width)     │  (55% width)              │  (30% width)         │
│   Dashboard │                  │                            │                      │
│   Sources   │  Demographics    │  ┌─ Temperature ─────────┐ │  [Timeline│Events│   │
│             │  - 67F           │  │  ━━━━╌╌╌╌             │ │   Findings│       │
│  INTEG...   │  - BMI 31.2      │  │      ╱  ← expected    │ │   Reasoning]      │
│             │  - MRN 4821937   │  │     ╱   ← actual      │ │                    │
│  CLINICAL   │                  │  │    ▲ CPD p=0.94       │ │  Reasoning tab:    │
│   Patient.. │  Diagnoses       │  └───────────────────────┘ │                    │
│   PA Work.. │  - M17.11 OA,   │  ┌─ Heart Rate ──────────┐ │  Day 11: Temp      │
│             │    right knee    │  │  ━━━╌╌╌╌              │ │  began trending    │
│  ANALYTICS  │  - E11.65 T2DM  │  │     ╱  ← expected     │ │  above patient-    │
│   Model B.. │  - Z87.891      │  │    ╱   ← actual       │ │  specific expected │
│  ►Annot..   │    smoking hx   │  └───────────────────────┘ │  curve (37.2°C vs  │
│             │                  │  ┌─ Clinical Events ─────┐ │  expected 36.8°C,  │
│  SYSTEM     │  Medications     │  │  ▪Surg ▪Amb ▪PT  ▪DC  │ │  adjusted for T2DM │
│   Pipeline  │  - Metformin     │  │          ▪Wound ▪Abx  │ │  + BMI 31.2)...   │
│             │  - Enoxaparin    │  └───────────────────────┘ │                    │
│             │  - Acetaminophen │                            │  Sources:          │
│             │                  │  [◀ Prev] ─slider─        │  ▪ AAOS 2023       │
│             │  Allergies       │           [Next ▶]         │  ▪ J Arthroplasty  │
│             │  - Sulfa drugs   │                            │    2024            │
│             │                  │                            │                    │
│             │  Pre-op Values   │                            │  [Approve finding] │
│             │  - HbA1c: 7.8   │                            │  [Reject finding]  │
│             │  - LEFS: 28/80  │                            │                    │
├─────────────┴──────────────────┴────────────────────────────┴────────────────────┤
```

**Left panel — Clinical Info (15%):**
- Patient demographics: age, sex, BMI, MRN
- Diagnoses: ICD-10 coded problem list (M17.11, E11.65, Z87.891, etc.)
- Current medications: with start dates and source system provenance chips
- Allergies
- Relevant pre-op values: HbA1c 7.8 (from PCP labs, Epic), last LEFS score 28/80 (from PT records, WebPT)
- All data pulled from the same cross-system records assembled in Situation 2 — the provenance chips on medications and pre-op values reinforce that this is the same data layer

**Center panel — Time-Series (55%):**

Three stacked panels sharing a synchronized time x-axis (14-day post-op window). Plotly.js (Section 16 documented exception) for all three.

1. **Temperature**

Continuous line chart showing two traces:
- **Actual** (solid green line, #22C55E): Normal post-op elevation Days 1–3, return toward baseline Days 4–10, then gradual upward trend starting Day 11
- **Patient-specific expected recovery curve** (dashed gray line with light confidence band): The model's prediction of what this patient's temp trajectory should look like, adjusted for her risk profile (age 67, T2DM, BMI 31.2, primary TKA). The expected curve shows a slightly higher Day 1–3 peak and slower return to baseline than a low-risk patient — the model accounts for her diabetes and BMI. The confidence band narrows as more post-op data accumulates.

Where the actual trace diverges from the expected curve beyond the confidence band (Day 11 onward), an anomaly overlay appears (pink/magenta shaded region, #E91E63).

**Change-point annotation:** At Day 11, a vertical annotation line labeled "CPD: p=0.94" — marking where the Bayesian online change-point detection algorithm identified a statistically significant departure from the expected trajectory. Hovering the annotation shows: "Bayesian online change-point detection. Posterior probability: 0.94. Expected temp at Day 11: 36.8°C. Observed: 37.2°C. Deviation: +0.4°C beyond patient-adjusted confidence interval."

Chart legend: "── Actual  ╌╌ Expected (post-TKA model, adjusted for patient risk profile)"

2. **Heart Rate**

Same dual-trace pattern:
- **Actual** (solid blue line, #3B82F6): Post-op elevation Days 1–5 (expected), return toward baseline, then subtle elevation correlating with temp trend starting Day 11–12
- **Patient-specific expected HR trajectory** (dashed gray line with confidence band): Pre-op resting HR as the asymptotic baseline, expected post-surgical elevation and return-to-baseline curve adjusted for age, BMI, and beta-blocker status (not on beta-blockers — relevant for HR interpretation)

The HR divergence is subtler than temperature — 8 bpm above the expected trajectory. The anomaly overlay is lighter, and the change-point annotation reads "CPD: p=0.78" — lower confidence on HR alone, but the multi-signal correlation with temperature raises the combined detection confidence.

3. **Clinical Events**

Event markers on a categorical timeline. Each marker is a clickable dot with an icon indicating event type:
- Day 0: Surgery (scalpel icon)
- Day 1: First ambulation (walking icon)
- Day 3: PT eval (clipboard icon)
- Day 4: Discharge (door icon)
- Day 10: Wound check (stethoscope icon) — "Mild erythema noted at incision site"
- Day 13: Antibiotic started (pill icon) — "Cephalexin 500mg QID initiated"

Events are color-coded by source system (provenance): Ortho EHR events in one accent color, PT events in another, pharmacy events in a third. Clicking an event marker highlights the corresponding card in the right panel.

**Right panel — Context Panel (30%):**

Four-tab view: **Timeline | Events | Findings | Reasoning**

The Reasoning tab is selected by default in the `?scenario=model-ready` store snapshot — the presenter lands here first.

*Timeline tab:* Interleaved chronological feed of clinical events and AI findings, ordered by date. Each entry is a compact card. This is the "everything in order" view.

*Events tab:* Clinical event cards only. Each card: event type icon, date, description text, source system provenance chip. Clicking a card highlights the corresponding marker in the center panel (bidirectional focus, blue border per Section 16.7 pattern).

When a clinical event is relevant to an AI finding, a small knowledge-context annotation appears below the event description: "Wound check findings correlate with AI thermal alert (Day 11). SSI presentation window: Days 7–14 post-op (AAOS Clinical Practice Guidelines, 2023)." This connects the clinical event to the AI system's reasoning without cluttering the event itself — it's secondary text in `text-xs text-gray-500`.

*Findings tab:* AI finding cards. Each card has two states — collapsed (Layer 1) and expanded (Layer 2) — using the same chevron-expand pattern as Schema Explorer rows, PA Workbench requirement rows, and every other expandable element in the product. The auditability principle requires that every AI output be traceable; the finding card's expanded state IS the audit trail.

**Finding card — collapsed (Layer 1, scannable in <5 seconds):**
- Title: "Early infection signal detected"
- Onset: Day 11
- Confidence badge: High (green)
- Detection method: "Multi-signal change-point detection" (small text, `text-xs text-gray-500`)
- [Chevron to expand]
- [Approve] [Reject] buttons

**Finding card — expanded (Layer 2, the reasoning trace):**

The expanded state reveals a structured audit panel with four sections, following the same visual language as other expanded rows in the product (indented content below a `border-t border-gray-200` divider):

**Signal contributions** — a horizontal stacked bar showing what contributed to the detection, with percentages:
- Temp trajectory deviation: 42% (green segment)
- HR baseline shift: 28% (blue segment)
- Patient risk profile (T2DM + BMI 31.2): 18% (amber segment)
- Conservative treatment duration: 12% (gray segment)

Below the bar, each signal expands to one line of detail:
- "Temperature: 37.2°C observed vs. 36.8°C expected at Day 11 (patient-adjusted model). Deviation exceeds confidence interval since Day 11 08:00."
- "Heart Rate: 82 bpm observed vs. 74 bpm expected at Day 11. Resting HR elevated 8 bpm above patient-adjusted baseline."
- "Risk profile: T2DM (HbA1c 7.8), BMI 31.2, age 67 — combined SSI risk multiplier 2.1x vs. baseline population."
- "Pre-op deconditioning: 14-month symptom duration, LEFS 28/80 — associated with delayed wound healing in post-TKA literature."

**Knowledge base sources** — 2–3 citation pills (compact, rounded-full badges in `bg-gray-100 text-gray-700`) showing the clinical literature the detection model draws on. Each pill is clickable; clicking shows a brief excerpt in a tooltip or inline expansion:
- "Post-TKA SSI risk factors (AAOS 2023)" → "Diabetes mellitus, BMI >30, and smoking history are independent risk factors for surgical site infection following TKA. SSI typically presents Days 7–14 post-operatively with thermal and inflammatory markers preceding clinical signs by 48–72 hours."
- "Temperature trajectory modeling in joint arthroplasty (J Arthroplasty 2024)" → "Patient-specific expected recovery curves incorporating comorbidity profiles reduced false-positive SSI alerts by 34% compared to fixed-threshold monitoring in a cohort of 2,847 primary TKA patients."
- "Multi-signal infection detection (Clin Orthop Relat Res 2025)" → "Bayesian online change-point detection applied to combined temperature and heart rate signals achieved sensitivity of 89% and specificity of 94% for early SSI detection, with median lead time of 2.8 days before clinical diagnosis."

**Differential assessment** — a compact list showing what the system considered and ruled out:
- "DVT risk: Low — no unilateral HR/temp dissociation pattern, patient on prophylactic enoxaparin"
- "Medication reaction: Low — no new agents introduced since Day 4 (acetaminophen)"
- "Surgical site infection: High — thermal + HR pattern match, patient risk factors, presentation timing consistent with SSI window"

**Clinical correlates** — links to related clinical events with relationship labels:
- "Day 10: Wound check — 'mild erythema noted at incision site' (clinical correlate, documented before thermal signal reached alert threshold)"
- "Day 13: Antibiotics initiated — cephalexin 500mg QID (clinical response, 2 days after detection)"

This section makes the temporal relationship between AI detection, clinical observation, and clinical action explicit and traceable. The "2 days after detection" label is the proof that the system caught it early.

*Reasoning tab (default selected in store snapshot):*

A structured clinical narrative that synthesizes the AI findings, clinical events, and knowledge base into a coherent explanation. This is the screen the CDS operating partner sees first. It reads like a clinical reasoning document, not a dashboard:

> **Day 11, 08:00 — Change-point detected (posterior probability 0.94)**
> Temperature began trending above patient-specific expected recovery curve. Observed 37.2°C vs. expected 36.8°C, adjusted for T2DM (HbA1c 7.8), BMI 31.2, and primary TKA. The expected curve for this patient's risk profile predicts a slower return to baseline than the general population, so the threshold for deviation is already elevated — this is not a generic fever alert, it's a departure from what was expected *for this patient*.
>
> Concurrent HR elevation of 8 bpm above adjusted baseline corroborates. Multi-signal correlation raised combined detection confidence. HR signal alone would not have triggered alert (CPD posterior: 0.78).
>
> **Knowledge base assessment**
> Presentation timing (Day 11) falls within the SSI presentation window of Days 7–14 (AAOS 2023). Patient's T2DM and BMI >30 are independent SSI risk factors, contributing a combined risk multiplier of 2.1x. Temperature trajectory modeling literature (J Arthroplasty 2024) indicates that patient-adjusted curves reduce false positives by 34% compared to fixed thresholds — this detection was generated against the adjusted curve, not a static cutoff.
>
> **Clinical correlation**
> Day 10: Wound check documented "mild erythema noted at incision site" — the clinical team observed a visual correlate one day before the biometric signal crossed the detection threshold. The biometric signal provides quantitative confirmation and temporal precision that the visual assessment alone does not.
>
> Day 13: Antibiotics (cephalexin 500mg QID) initiated. Clinical response occurred 2 days after algorithmic detection and 3 days after the earliest biometric deviation.
>
> **Differential**
> DVT: Low probability — no unilateral pattern, prophylactic anticoagulation active. Medication reaction: Low — no new agents since Day 4. Assessment: superficial SSI, early detection enabled pre-systemic intervention.

This narrative is authored as a hero fixture — one carefully written example. Other patients in the switcher strip would show simpler reasoning for lower-acuity cases.

**Key interaction moments:**
- The presenter lands on the Reasoning tab. The audience reads a clinical narrative that weaves biometric signals, knowledge base sources, clinical events, and differential assessment into a coherent story. This is the "power" moment — the system doesn't just detect, it reasons.
- Switching to the Findings tab and expanding the hero finding card shows the same information in structured/auditable form — signal contributions as a stacked bar, knowledge base pills, differential list. This is the same data as the Reasoning tab, presented for the analyst/auditor rather than the clinician.
- Clicking the finding card highlights the anomaly region on the temp and HR charts. The expected recovery curves make the deviation visually obvious — the actual trace pulls away from the dashed expected line. The change-point annotation marks exactly where the algorithm detected the departure.
- Switching to the Events tab and clicking "Wound check, Day 10" highlights the Day 10 marker on the clinical events timeline. The knowledge-context annotation below the event connects it to the AI finding: "SSI presentation window: Days 7–14 post-op (AAOS 2023)."
- "Approve all High-confidence" bulk action available for batch labeling across multiple patients (via the patient switcher strip).

**Channel configuration:**
- Temperature: actual as solid green line (#22C55E), expected as dashed gray (#94A3B8) with light green confidence band
- Heart Rate: actual as solid blue line (#3B82F6), expected as dashed gray (#94A3B8) with light blue confidence band
- Clinical Events: orange markers (#F97316), categorized by type icon, color-coded by source system
- AI anomaly overlay: pink/magenta (#E91E63) shaded region on affected time range
- Change-point annotations: vertical dashed line in dark gray (#374151) with label

---

## Situation 5: Technical depth — available everywhere, not a separate scene

The technical foundation is not a separate flow. It lives as Layer 3 throughout the product, accessible from any screen.

### Screen: Pipeline Health

**Template:** Review Screen (Template A)

Always accessible under System in the sidebar. An operational monitoring tool.

**Metric cards:**
- Sources active: 20/20
- Last full sync: timestamp
- Schema drift alerts: 2 active
- Data quality score: 96.8% (trailing 30 days)

**Primary content — alert feed:**

| Column | Content |
|---|---|
| Source | System name with accent chip |
| Alert Type | Schema change / Sync failure / Quality degradation / Criteria update |
| Description | What changed |
| Impact | Fields/mappings affected |
| Status | Auto-resolved (green) / Review needed (amber) / Action required (red) |
| Detected | Timestamp |

**Hero alert:** "Site 12 — eClinicalWorks schema change detected: field 'adj_type' renamed to 'adjustment_category'. 3 concept mappings affected. Auto-remapped at 97% confidence. Review recommended."

**Second hero alert:** "Payer B — TKA coverage criteria update detected. Conservative therapy duration changed from ≥3 months to ≥90 days PT + ≥30 days NSAID. 4 active cases affected. Payer Criteria screen updated."

Expandable detail shows the specific fields affected, the before/after mapping, and the confidence on the auto-resolution.

### Technical depth accessible from other screens:

- **Any confidence badge** throughout the product is clickable → shows numeric score, model version, alternative mappings considered
- **Any concept in Schema Explorer** → click "Trace" to open the Concept Map centered on that concept
- **Any provenance chip in PA Workbench** → expandable detail showing the extraction chain from source field to normalized value
- **Any feature in Model Builder** → expandable detail showing the semantic mapping chain and per-site normalization applied

---

## Narrative Arc Summary

| Situation | Audience steps into | Audience feels | Underlying capability |
|---|---|---|---|
| 1. Post-close integration | Dashboard and sources on Day 22 — integration already done | "I could have had this on Day 1 instead of Month 6" | Schema annotation, semantic reconciliation |
| 2. TKA prior auth | PA Workbench mid-case — evidence assembled, requirements being matched | "We're losing money on a data retrieval failure" | Identity resolution, longitudinal record assembly |
| 3. Payer mapping | Payer Criteria grid — 15 payers, each with different language for the same clinical reality | "Every acquisition makes this worse" | Semantic normalization, N+M economics |
| 4. Complication prediction | Model Builder with assembled dataset, Annotation Studio with AI-flagged signal | "This is the tool my data science team has been waiting for" | Feature assembly, biometric normalization, AI annotation |
| 5. Technical depth | Pipeline Health + Layer 3 drill-downs from any screen | "This gets better with scale, not worse" | Schema annotation, concept linkage, integrity monitoring |
