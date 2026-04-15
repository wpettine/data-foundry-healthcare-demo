# UX patterns for comparing data pipeline outputs

**The strongest pattern for this use case is a reconciliation-style variance table with typed discrepancies and inline root-cause expansion** — a design borrowed from financial close software (BlackLine, FloQast) and adapted with progressive disclosure techniques from data diff tools (Datafold) and entity resolution UIs (OpenRefine, Senzing). This hybrid approach serves all three audiences simultaneously: PE operators scan dollar impact, PMO leads filter by discrepancy type to triage system issues, and CFOs read the summary bar to gauge platform reliability. The pattern is table-first, information-dense, and immediately legible — precisely what production enterprise software demands.

The research below surveys 28 production tools across seven categories, evaluates each pattern against the healthcare PE scenario, and delivers three implementation-ready recommendations.

---

## Part 1: Pattern catalog

### Pattern 1 — Reconciliation variance table

A full-width sortable table where each row represents a reconciliation unit (account, entity, or metric). Columns display the value from each source, the absolute and percentage delta, a materiality indicator, and a discrepancy classification. Rows exceeding materiality thresholds receive background tinting. An inline expansion reveals line-item detail, resolution status, and audit trail.

**Used by:** BlackLine (Account Reconciliation Detail — Balance Grid with Net Unexplained Difference), FloQast (Flux Analysis — period-over-period variance with required explanations gate), Trintech Cadency (Reconciliation Detail — Balance Grid with currency-aware variance).

**Layout:** Summary bar (match rate, total variance exposure, items requiring attention) → filterable/sortable table (Entity | Source A Value | Source B Value | Δ | Δ% | Materiality Flag | Type | Status) → inline row expansion (transaction-level detail, audit trail, comments). Color encodes severity: green within threshold, amber approaching, red exceeding.

**Best for:** Comparisons where the audience expects financial-grade precision, dollar-denominated impact, and workflow resolution. Handles mixed numeric and categorical discrepancies.

**Limitations:** Requires pre-defined materiality thresholds. Does not natively explain *why* values differ — only *that* and *by how much*. The discrepancy type column must be engineered separately.

---

### Pattern 2 — Data diff with progressive tabs

A tabbed interface that moves from high-level summary statistics through column-level health to row-level value diffs. The overview tab shows aggregate match rates and row counts. The columns tab lists every field with its match percentage. The values tab shows individual differing rows with character-level highlighting.

**Used by:** Datafold (Data Diff — Overview → Columns → Primary Keys → Column Profiles → Values → Timeline → Downstream Impact), SQLMesh (Table Diff — Schema Diff → Row Counts → Column Match % → Sample Differences), dbt Cloud (CI Compare Tab — Overview → Primary Keys → Modified Rows → Columns).

**Layout:** Horizontal tab bar across top. Each tab is a full-width table or visualization. Overview tab contains 4–6 summary statistics in a compact bar. Columns tab is a table: Column Name | Source Type | Target Type | Status (with percentage-different indicators). Values tab shows row-level diffs with character highlighting toggle.

**Best for:** Data engineers investigating where and how deeply two datasets disagree. Excels at surfacing schema drift and column-level anomalies. The tab-based progressive disclosure prevents information overload.

**Limitations:** Designed for two-table comparison, not entity-by-entity rollup. Requires a primary key for row matching. The tab-based navigation adds clicks compared to inline expansion. Not immediately legible to financial audiences without column relabeling.

---

### Pattern 3 — Diff-only comparison grid

A transposed table where rows are metrics or parameters and columns are the items being compared (runs, pipelines, entities). A "diff only" toggle hides all identical values, instantly focusing on disagreements. Each compared item gets a persistent color used across all views.

**Used by:** Weights & Biases (Run Comparer — transposed grid with diff-only toggle organized by Config/Summary/System sections), Comet ML (Experiment Diff — up to 4 experiments with changed-parameters tab), MLflow (Compare View — parameters and metrics as rows, runs as columns).

**Layout:** Column 1 = metric/parameter name. Columns 2–N = one column per compared item. "Diff only" toggle in toolbar hides identical rows. Delta column optionally shown. Searchable/filterable by metric name.

**Best for:** Comparing a small number of items (2–10) across many dimensions simultaneously. The diff-only toggle is the key innovation — it eliminates noise. Works well when the comparison question is "what's different and by how much?"

**Limitations:** Does not scale well beyond ~10 compared items as columns. Transposed orientation (metrics as rows) is unfamiliar to finance audiences accustomed to entities as rows. Does not natively encode discrepancy *type* — only value differences. Cross-domain transfer from MLOps to finance/healthcare requires relabeling.

---

### Pattern 4 — Validation result table (pass/fail with expandable detail)

A table where each row is a validation check or expectation. Columns show the check description, pass/fail/warn status, the observed value, the expected value, and an expandable detail area showing failed samples. Status is encoded with iconography (checkmark, X, warning triangle) and color.

**Used by:** Great Expectations (Data Docs — per-expectation table with human-readable descriptions, observed vs. expected values, and unexpected value samples), Soda (Check Results Dashboard — three-state pass/fail/warn with Check History timeline and Failed Rows Analysis tab), dbt (Test Results — pass/fail with `store_failures` audit tables).

**Layout:** Full-width table. Columns: Check Name | Status Icon | Observed Value | Expected Value | Detail. Status icons: ✓ green (pass), ✗ red (fail), ⚠ amber (warn). Click row to expand and see failed samples. Summary bar above table shows X/Y checks passed.

**Best for:** Rule-based validation results where each row represents a discrete quality assertion. Maps well to "does this entity's data pass harmonization checks?" framing.

**Limitations:** Binary pass/fail framing loses the nuance of *degree* of discrepancy. Does not show dollar impact natively. Better for data engineering audiences than financial audiences.

---

### Pattern 5 — Data quality scorecard with drill-down

A dashboard-style summary showing aggregate health scores across dimensions (freshness, completeness, validity), with each score clicking through to underlying tables and metrics. Often includes a heatmap or matrix showing health over time.

**Used by:** Anomalo (Pulse Dashboard — 8 KPIs + Repeat Offender matrix with day-by-day status grid), Bigeye (Scorecards — organizational health across 70+ metrics with Lineage Plus for root cause), Atlan (Quality Scores — freshness/completeness/validation aggregated at column level with companion sidebar).

**Layout:** Top section: 4–8 KPI tiles (monitored entities, pass rate, total variance, items requiring attention). Middle section: time-series trend or heatmap matrix. Bottom section: sortable table of entities ranked by health score.

**Best for:** Executive-level "how healthy is our data?" overview. Provides immediate visual triage of which entities need attention.

**Limitations:** Scorecard tiles read as "dashboard" rather than "working software." Risk of looking like a marketing dashboard unless tiles are minimal and the table dominates. Does not inherently compare two pipelines — it reports health of one.

---

### Pattern 6 — Cluster/mapping table (entity resolution)

A table where each group represents a cluster of duplicate values mapping to one canonical value. The cluster shows all variant values with their frequency counts and the selected canonical output. Optionally includes confidence scores and source system provenance.

**Used by:** OpenRefine (Cluster and Edit — flat table with Merge checkbox, Values in Cluster column with row counts, editable New Cell Value), Senzing (Entity Resume — three-column table showing Source/Record, Resolution Data, and Other Data with color-coded match scores), Tamr (Cluster Verification — pairs view with High/Medium/Low confidence labels and merge/split actions).

**Layout:** Each cluster is a visually grouped row set. Columns: Canonical Value | Variant Values (with counts) | Source System | Match Confidence. Variants are listed vertically within the cluster, indented under the canonical value. Cluster boundaries marked by subtle horizontal rules or alternating background.

**Best for:** Showing *why* Pipeline A and Pipeline B disagree on entity names — "these 5 raw payer names all resolve to one canonical payer." Directly demonstrates the value of semantic harmonization.

**Limitations:** Focused on entity names/categories, not numeric values. Must be combined with a variance table to show dollar impact. Cluster tables can get long if there are many variants.

---

### Pattern 7 — Anomaly detail view with root cause

A single-entity deep-dive view showing the detected anomaly, its historical context via time-series chart, root cause analysis with segment breakdown, and sample good/bad rows side by side.

**Used by:** Monte Carlo (Incident IQ — timeline + affected tables + lineage + query logs + historical context), Anomalo (Anomaly Detail — column distribution visualization + good/bad row samples + segment analysis rectangles), Bigeye (Anomaly Detection — ML-powered with Lineage Plus context and AI-suggested resolutions).

**Layout:** Header: entity name, anomaly type, severity, detected date. Section 1: time-series chart showing metric over time with anomaly point highlighted and confidence band. Section 2: root cause breakdown (which columns/segments contain anomalous data). Section 3: sample rows — good vs. bad side by side.

**Best for:** Deep investigation of a single discrepancy's root cause. Excellent for the PMO audience asking "what happened and when did it start?"

**Limitations:** Single-entity focus — not designed for comparing across entities. Requires time-series data. The chart-heavy layout conflicts with the "tables preferred" constraint.

---

### Pattern 8 — Conditional formatting table (spreadsheet-style)

A dense table where color is applied systematically to cell values based on rules — single-color highlighting for threshold violations, color scales (heatmaps) for continuous variables, and data bars for relative magnitude. Formatting rules reference other columns for cross-field logic.

**Used by:** Sigma Computing (Conditional Formatting — single color, color scale, data bars, custom formula rules, right-click quick highlight), DataGrip (Data Diff Viewer — color-coded cells with tolerance parameter for fuzzy matching), Excel/Google Sheets (universal conditional formatting with variance formulas).

**Layout:** Standard table grid. Each cell's background or text color is determined by data-driven rules. No separate status columns needed — the value *is* the indicator. Supports heatmap-style gradients across columns and in-cell data bars.

**Best for:** Dense information display where the audience is comfortable reading tables and color carries quantitative meaning. Familiar to financial analysts from spreadsheet workflows.

**Limitations:** Can become visually noisy with too many rules. Requires careful color palette design to avoid accessibility issues. The "spreadsheet" aesthetic may feel less polished than purpose-built UI.

---

## Part 2: Applicability analysis

| Pattern | Entity-level comparison (15 entities) | Surfaces reason for discrepancy | Summary → row → root cause drill-down | Mixed audience (finance + eng + exec) | Scales to 50 entities × 6 metrics |
|---|---|---|---|---|---|
| Reconciliation variance table | **Strong** — one row per entity, designed for account-level rollup | **Adequate** — needs a discrepancy type column, not built-in | **Strong** — summary bar → table → inline expansion is the native pattern | **Strong** — financial audiences use this daily; engineers understand it | **Strong** — pagination and filtering handle scale well |
| Data diff with progressive tabs | **Adequate** — designed for table-level, not entity-level rollup | **Strong** — column match %, schema diff, character-level highlighting explain *what* differs | **Strong** — tabs are progressive disclosure by design | **Weak** — tab navigation and technical framing loses financial audiences | **Adequate** — works but the tab model adds navigation friction at scale |
| Diff-only comparison grid | **Weak** — entities as columns does not scale beyond ~10; transposed layout is awkward for 15+ entities | **Adequate** — shows value differences, not typed discrepancies | **Weak** — flat grid without inline expansion | **Adequate** — simple and legible but unfamiliar orientation for finance | **Weak** — breaks down with many entities |
| Validation result table | **Adequate** — one row per check per entity is possible but verbose | **Adequate** — shows observed vs. expected but binary pass/fail loses nuance | **Adequate** — expandable rows work but summary level is just pass counts | **Adequate** — engineers like it; finance finds it reductive | **Adequate** — many rows but filterable |
| Data quality scorecard | **Strong** — designed for organizational rollup across entities | **Weak** — aggregate scores obscure specific discrepancies | **Adequate** — score → entity → metric works but scorecard tiles feel like dashboards | **Adequate** — executives like it; engineers find it shallow | **Strong** — designed for org-wide scale |
| Cluster/mapping table | **Weak** — focused on entities within one dimension, not cross-entity comparison | **Strong** — directly shows *which* raw values map to *which* canonical values and why | **Weak** — single-level display, not designed for hierarchical drill-down | **Adequate** — intuitive concept but niche presentation | **Adequate** — one cluster per payer, but payer count is the scaling dimension |
| Anomaly detail view | **Weak** — single-entity focus, not comparative | **Strong** — root cause analysis, time-series context, segment breakdown | **Adequate** — works as the deepest drill-down level but not as primary view | **Adequate** — visual but chart-heavy for a table-first constraint | **Weak** — does not scale as primary view |
| Conditional formatting table | **Strong** — standard table handles entities as rows natively | **Weak** — color shows magnitude, not type of discrepancy | **Adequate** — sorting and filtering work, but no built-in expansion | **Strong** — familiar to all audiences from spreadsheet experience | **Strong** — scales well with virtual scrolling |

**Verdict:** The reconciliation variance table scores highest across all criteria. Its primary gap — surfacing the *reason* for discrepancy — is addressed by combining it with a discrepancy type taxonomy (from ReconArt's automatic exception classification) and an inline expansion panel that borrows from the cluster/mapping table and anomaly detail patterns.

---

## Part 3: Financial reconciliation UX deep dive

### How production tools present matched versus unmatched items

Every major reconciliation platform uses a **three-category classification** as the foundational data model: **matched** (green indicator or checkmark), **suggested/potential match** (amber, requires human review), and **unmatched/exception** (red, requires investigation). BlackLine and Trintech Cadency both display this status as a dedicated column in the reconciling items grid, with ReconArt adding sub-classification for unmatched items — "discrepancy unmatched" (keys match but amounts differ) versus "exclusively unmatched" (no corresponding record exists on the other side).

The dominant layout is a **single table with side-by-side value columns** rather than split panels. Columns typically follow this structure: Transaction Date | Reference/ID | Description | **Source A Amount | Source B Amount | Difference** | Match Status | Match Rule Applied | Aging (Days) | Assigned To | Resolution Status. Running totals appear at the table footer, updating dynamically as users select checkboxes for specific line items.

### How variance is shown

**Absolute and percentage are always shown together** — this is universal across BlackLine, FloQast, Trintech, and ReconArt. The standard column pattern is: Current Value | Comparison Value | $ Change | % Change. BlackLine's Balance Grid prominently displays the **Net Unexplained Difference** as the critical KPI at the top of every reconciliation detail view.

**Materiality threshold indicators** use a three-tier color system: green (within threshold), amber (approaching), red (exceeding). Both BlackLine and FloQast implement a **gate mechanism** where reports cannot be signed off until all items exceeding materiality thresholds have written explanations. This creates a forcing function that ensures material discrepancies receive attention.

FloQast's flux analysis adds **required explanation fields** — when a variance exceeds a configured threshold, the system flags it as requiring an explanation before sign-off. The explanation field appears inline in the table row, not in a separate modal or panel.

### How discrepancy types are categorized

ReconArt provides the most sophisticated automatic classification of unmatched items, categorizing them into: **fees** (bank fees, FX differences), **timing delays** (expected timing differences that will clear next period), **duplicates**, **value mismatches**, and **custom categories** configurable by the organization. Items within specific tolerances (e.g., small FX differences, standard fees) can be automatically resolved without manual intervention.

For the pipeline comparison use case, the analogous discrepancy types would be: **definition conflict** (metric calculated differently), **missing data** (field absent in source system), **schema drift** (enum value removed, values stopped being categorized), **entity duplication** (payer name variants counted separately), and **coverage gap** (source system lacks the relevant data entirely).

### Resolution workflow patterns

The universal workflow pattern across all tools follows: **Open/New → Under Investigation → Pending Approval → Resolved → Archived**. Each exception is assigned to a specific user with a due date. Time-based escalation triggers when items remain unresolved beyond configurable periods.

BlackLine uses a three-role certification workflow: **Preparer → Reviewer → Approver**. Once certified, the reconciliation becomes read-only. Trintech Cadency adds Dynamic Account Maintenance, which automatically adjusts workflow routing based on changing risk levels — an account growing from $100K to $500K triggers automatic escalation to a senior manager.

### Summary-level presentation

Reconciliation dashboards universally show: **match rate** (% auto-matched, % manually matched, % unmatched), **completion rate** (% certified of total accounts), **total variance exposure** (aggregate dollar amount of unexplained differences), **items requiring attention** (count of open exceptions), and **on-time completion rate**. BlackLine reports that **43–85% of accounts** are typically auto-certified, with the remainder requiring manual review.

The drill-down hierarchy follows a consistent five-level pattern: **Organization → Entity → Account Group → Individual Account → Transaction → Detail**. This maps directly to the healthcare PE scenario: Platform → Practice Entity → Metric Category → Specific Metric × Payer → Source System Detail.

---

## Part 4: Entity resolution and deduplication UX

### How duplicate clusters are presented

The two dominant patterns for showing entity clusters are the **flat mapping table** (OpenRefine) and the **profile card with sources tab** (Reltio, Informatica, Tamr).

**OpenRefine's cluster-and-edit dialog** is the most transparent and directly applicable pattern. It presents a scrollable table where each row is one cluster. Three columns: a **Merge checkbox**, a **Values in Cluster** column listing all variant values with row counts in parentheses (e.g., "UnitedHealthcare (1,204 rows), UHC (892 rows), United Health Care (341 rows)"), and an editable **New Cell Value** field pre-populated with the most frequent variant. Histogram sliders on the right side filter clusters by number of variants, total row count, and value length variation.

**Reltio's profile view** takes a different approach: the golden record is shown as a profile card with an **Operational Value** (the surviving canonical value) for each attribute. A blue oval indicator with a number shows how many additional source variants exist. Clicking the oval navigates to a **Sources perspective** showing every source system's contributed value and which value won as the canonical representation. This vertical before/after table per attribute is elegant but requires more clicks to see the full picture.

### How confidence is communicated

Tools split into two camps: **categorical labels** and **numeric scores**. Tamr uses descriptive labels like "Strong Name Match" alongside High/Medium/Low confidence categories. Senzing uses **numeric scores (0–100) per feature** with color coding — green for above threshold, red for below, yellow for "different but doesn't detract" (e.g., address changed because people move). Informatica uses a 0–1 match score with configurable thresholds where scores above ~0.85 auto-merge and scores between 0.7–0.85 queue for human review.

Senzing's `why` command is the most sophisticated explainability pattern: it generates a **color-coded feature matrix** showing exactly why each record resolved to an entity, with numeric scores per feature (surname: 100, given name: 95, full name: 97) and entity frequency counts in brackets showing ambiguity (e.g., "[2] entities with name Robert Smith" signals higher ambiguity than "[1] entity with name Zdravko Nikolov").

### Before/after mapping for the payer name scenario

For the specific case of mapping "UnitedHealthcare," "UHC," and "United Health Care" to a canonical payer, the OpenRefine pattern translates directly into a **many-to-one mapping table**:

| Raw Value (Pipeline A) | Occurrences | Canonical Value (Pipeline B) | Resolution Method |
|---|---|---|---|
| UnitedHealthcare | 1,204 claims | UnitedHealthcare | Exact match |
| UHC | 892 claims | UnitedHealthcare | Alias mapping |
| United Health Care | 341 claims | UnitedHealthcare | Fuzzy match (92%) |
| UNITED HEALTHCARE | 128 claims | UnitedHealthcare | Case normalization |
| United Healthcare Inc | 47 claims | UnitedHealthcare | Fuzzy match (95%) |

This table structure — showing the raw variant, its frequency, the canonical target, and the resolution method — is the most information-dense way to demonstrate *why* Pipeline B produces different (better) payer-level aggregations than Pipeline A.

---

## Part 5: Three ranked recommendations

### Recommendation 1: Reconciliation variance table with typed discrepancies

This is the primary view and the strongest fit for all three audiences. It combines the financial reconciliation variance table pattern (BlackLine/FloQast) with ReconArt's automatic discrepancy categorization and Datafold's column-level match statistics.

**Summary bar (sticky, top of viewport):**
A single horizontal bar, 48px tall, with four segments rendered as inline key-value pairs separated by vertical dividers. Background: `bg-slate-50`, border-bottom: `border-slate-200`.

- **Entities analyzed:** "15 of 15" (text, no icon)
- **Agreement rate:** "73% of metric values match within 1%" — the percentage uses `text-emerald-600` if ≥90%, `text-amber-600` if 70–89%, `text-red-600` if <70%
- **Total dollar impact:** "$2.4M in identified discrepancies" — always `text-slate-900`, bold
- **Top discrepancy type:** "Entity duplication (38%)" — text only

No cards, no icons, no background colors on the bar itself. Just dense text with semantic color only on the agreement rate number.

**Primary table (TanStack Table v8):**

Columns, left to right:

1. **Entity** (string, frozen left, `w-48`): Practice name. Sortable alphabetically.
2. **Metric** (string, `w-40`): e.g., "Denial Rate — UHC." Sortable.
3. **Pipeline A** (number, right-aligned, `w-28`, `font-mono`): Raw/unharmonized value. Formatted as currency or percentage depending on metric type.
4. **Pipeline B** (number, right-aligned, `w-28`, `font-mono`): Harmonized value. Same formatting.
5. **Δ** (number, right-aligned, `w-24`, `font-mono`): Absolute difference. **Bold** if exceeds materiality threshold. Sign-prefixed ("+$142K" or "−3.2pp").
6. **Δ%** (number, right-aligned, `w-20`, `font-mono`): Percentage difference relative to Pipeline B value.
7. **Discrepancy type** (enum, `w-44`): Rendered as a plain text label with a small colored dot (4px, `rounded-full`) prefix. Types and colors:
   - `bg-purple-500` — Entity duplication (multiple raw names → one canonical)
   - `bg-orange-500` — Schema drift (field removed/renamed, causing 0% or null values)
   - `bg-blue-500` — Definition conflict (metric calculated differently across systems)
   - `bg-red-500` — Missing data (source system lacks the field entirely)
   - `bg-slate-400` — No discrepancy (values agree)
8. **Affected systems** (string, `w-36`): Comma-separated source system names, truncated with tooltip on overflow.
9. **Severity** (enum, `w-20`): Rendered as text with row-level background tinting. **Critical** (`bg-red-50`), **High** (`bg-amber-50`), **Low** (no tinting). Severity is computed: Critical = dollar impact > $100K or percentage > 25%; High = dollar impact > $10K or percentage > 10%; Low = everything else.

**Row grouping:** Group by Entity (default) with collapsible group headers showing entity name and aggregate variance for that entity. Group header row: `bg-slate-100`, `font-semibold`. Each entity group header shows: Entity Name | — | — | — | Σ Δ for entity | — | Most common discrepancy type | — | count of Critical+High items.

**Filtering:** Toolbar above table with: text search (entity/metric name), discrepancy type multi-select dropdown, severity dropdown, minimum Δ$ slider. A "Show discrepancies only" toggle (inspired by W&B's diff-only toggle) hides rows where Pipeline A and Pipeline B agree — this is the single most important filter for a 2-minute demo.

**Sorting:** Click any column header. Default sort: Severity descending, then Δ$ descending (largest problems first).

**Inline row expansion (click chevron or row):**

Expands below the row, within the table, using TanStack's `getExpandedRowModel()`. The expanded area has a `bg-slate-50` background, `pl-12` left padding (indented under the parent row), and contains three sections stacked vertically:

**Section A — Root cause** (2–3 lines of text): A plain-English explanation of why values differ. Example: "Pipeline A reports denial rate as 0.0% because the 'claim_status' enum in AdvancedMD dropped the 'denied' category after a June 2025 schema migration. Pipeline B detects this via schema drift monitoring and remaps using the `adjudication_code` field." This text is generated/stored, not computed live.

**Section B — Entity resolution detail** (only shown when discrepancy type = Entity duplication): A compact mapping table (OpenRefine-inspired):

| Raw payer name (Pipeline A) | Claims | → Canonical (Pipeline B) |
|---|---|---|
| UnitedHealthcare | 1,204 | UnitedHealthcare |
| UHC | 892 | UnitedHealthcare |
| United Health Care | 341 | UnitedHealthcare |

This table has no header row styling — just `text-xs`, `text-slate-600`, with a `→` character in the third column header to indicate directionality.

**Section C — Source system detail** (compact table):

| Source system | Field used | Pipeline A handling | Pipeline B handling | Status |
|---|---|---|---|---|
| AdvancedMD | claim_status | Direct query — 0% after enum removal | Remapped via adjudication_code | ✓ Corrected |
| Athenahealth | denial_flag | Boolean field, accurate | Boolean field, accurate | — No discrepancy |

Status column uses checkmark (✓, `text-emerald-600`) for corrected items and dash for no-discrepancy items.

---

### Recommendation 2: Entity-level health matrix as an alternate view

This view answers the CFO's question ("can this platform answer questions reliably?") by showing coverage and accuracy at the entity × metric level. Inspired by Anomalo's Repeat Offender matrix and Sigma Computing's conditional formatting heatmaps.

**Layout:** A pivot table. Rows = 15 entities (practice names). Columns = 6 metrics (e.g., Denial Rate, Days in AR, Net Collection Rate, Charge Volume, Payment Variance, Write-off Rate). Each cell shows the **percentage agreement** between Pipeline A and Pipeline B for that entity-metric combination, formatted as a number with one decimal place.

**Cell coloring (color scale, not discrete):**
- `bg-emerald-50` to `bg-emerald-100`: 95–100% agreement (essentially matching)
- `bg-amber-50` to `bg-amber-100`: 80–94% agreement (minor discrepancies)
- `bg-red-50` to `bg-red-100`: <80% agreement (material discrepancies)

**Cell interaction:** Hover shows a tooltip with: Pipeline A value, Pipeline B value, absolute delta, discrepancy type. Click navigates to the corresponding row in Recommendation 1's variance table (deep link via URL params or scroll-to-row).

**Row summary column (rightmost):** "Overall" — average agreement across all metrics for that entity. Sortable. Entities with lowest agreement sort to top by default.

**Column summary row (bottom):** "All entities" — average agreement across all entities for that metric. Reveals which metrics are systematically problematic (e.g., Denial Rate at 71% agreement vs. Charge Volume at 98%).

**Implementation:** Use TanStack Table with a custom cell renderer that applies `bg-*` classes based on the numeric value. The color mapping function: `(value) => value >= 95 ? 'bg-emerald-50' : value >= 80 ? 'bg-amber-50' : 'bg-red-50'`. No charts. The table *is* the visualization.

**Toggle between views:** A segmented control at the top of the page with two options: "Discrepancy detail" (Recommendation 1) and "Entity × metric matrix" (Recommendation 2). The segmented control uses Tailwind's `inline-flex rounded-md` pattern with `bg-slate-900 text-white` for the active segment.

---

### Recommendation 3: Payer resolution panel as a slide-over

When any row with discrepancy type "Entity duplication" is expanded in Recommendation 1, and the user clicks "View full payer mapping," a **right-side slide-over panel** (480px wide, `fixed inset-y-0 right-0`) appears showing the complete entity resolution context for that payer. This borrows from Senzing's Entity Resume pattern and Reltio's Sources perspective, adapted as a table-first layout.

**Panel header:** Canonical payer name (e.g., "UnitedHealthcare"), entity type badge ("Payer"), total raw variants count ("5 source variants from 4 systems").

**Panel body, Section 1 — Variant mapping table:**

| Source system | Raw name | Records | Resolution | Confidence |
|---|---|---|---|---|
| AdvancedMD | UnitedHealthcare | 1,204 | Exact | — |
| Athenahealth | UHC | 892 | Alias | High |
| DrChrono | United Health Care | 341 | Fuzzy | 92% |
| QuickBooks | UNITED HEALTHCARE | 128 | Normalization | High |
| Legacy CSV | United Healthcare Inc | 47 | Fuzzy | 95% |

Confidence column: "High" rendered as plain text, percentages for fuzzy matches rendered in `font-mono`. The dash for exact matches indicates no confidence calculation was needed.

**Panel body, Section 2 — Impact summary (compact):**

Three key-value pairs, stacked vertically, `text-sm`:
- **Total claims affected:** 2,612 (sum of all variant records)
- **Pipeline A result:** 5 separate payer line items, denial rates ranging 4.2%–18.7%
- **Pipeline B result:** 1 consolidated payer, denial rate 8.1%

**Panel body, Section 3 — Dollar impact:**

A single compact table:

| Metric | Pipeline A (fragmented) | Pipeline B (consolidated) | Δ |
|---|---|---|---|
| Total denied amount | $1.84M (sum of 5 fragments) | $2.12M | +$280K |
| Denial rate | 4.2%–18.7% (range across fragments) | 8.1% | — |
| Recoverable denials | Not calculable (fragmented) | $890K | — |

The "Not calculable" cell uses `text-slate-400 italic` to signal that Pipeline A *cannot* produce this metric due to fragmentation — this is a powerful pedagogical moment.

**Panel footer:** "Close" button (secondary style, `border-slate-300`) and "View in table" button (primary style, `bg-slate-900 text-white`) that closes the panel and scrolls to/highlights the corresponding rows in the main table.

**Implementation:** React `createPortal` for the slide-over. Panel state managed via URL search param (`?payer=unitedhealthcare`) so the view is shareable/bookmarkable. The panel uses a `transition-transform duration-300` for a smooth slide from right. Backdrop: `bg-black/20` with click-to-close. The panel itself is a standard `div` with internal scrolling, not a modal — the main table remains visible and interactive behind the semi-transparent backdrop.

---

## Part 6: References

**Data diff and pipeline comparison:**
- Datafold Data Diff documentation: https://docs.datafold.com/os_diff/how_it_works
- Datafold Cloud Diff UI guide: https://docs.datafold.com/cloud_diff
- SQLMesh Table Diff documentation: https://sqlmesh.readthedocs.io/en/stable/concepts/plans/#table-diff
- dbt Cloud CI Compare Tab: https://docs.getdbt.com/docs/deploy/ci-jobs

**Data quality and observability:**
- Great Expectations Data Docs: https://docs.greatexpectations.io/docs/reference/learn/terms/data_docs
- Soda Check Results and Anomaly Dashboard: https://docs.soda.io/soda-cloud/anomaly-dashboard.html
- Monte Carlo Incident IQ: https://docs.getmontecarlo.com/docs/monitors-overview
- Anomalo Pulse Dashboard: https://docs.anomalo.com/
- Bigeye Scorecards and Lineage Plus: https://docs.bigeye.com/

**Financial reconciliation:**
- BlackLine Account Reconciliation product documentation: https://www.blackline.com/products/account-reconciliations/
- BlackLine Transaction Matching: https://www.blackline.com/products/transaction-matching/
- Trintech Cadency Reconciliation Detail Screen: https://help.trintech.com/cadency/
- FloQast Flux Analysis workflow: https://floqast.com/products/flux-analysis/
- ReconArt Matching Engine and Exception Management: https://www.reconart.com/solutions/matching/

**MLOps experiment comparison:**
- MLflow Tracking UI and Compare Runs: https://mlflow.org/docs/latest/tracking.html
- Weights & Biases Run Comparer documentation: https://docs.wandb.ai/guides/app/features/panels/run-comparer
- W&B Tables merged view and side-by-side comparison: https://docs.wandb.ai/guides/tables
- Comet ML Experiment Diff: https://www.comet.com/docs/v2/guides/experiment-management/

**Database comparison:**
- DBeaver Schema Compare and Data Compare: https://dbeaver.com/docs/dbeaver/Data-compare/
- DataGrip Data Diff Viewer: https://www.jetbrains.com/help/datagrip/differences-viewer-for-db-objects.html

**Entity resolution and MDM:**
- OpenRefine Cluster and Edit: https://openrefine.org/docs/manual/cellediting#cluster-and-edit
- Senzing Entity Resolution documentation and EDA tools: https://senzing.zendesk.com/
- Tamr Mastering workflow: https://docs.tamr.com/
- Reltio Operational Values and Sources perspective: https://docs.reltio.com/
- Ataccama ONE MDM Compare and Merge: https://docs.ataccama.com/
- Informatica MDM Hub Console: https://docs.informatica.com/master-data-management.html

**BI conditional formatting:**
- Sigma Computing Conditional Formatting: https://help.sigmacomputing.com/docs/conditional-formatting
- Tableau Reference Lines and Bands: https://help.tableau.com/current/pro/desktop/en-us/reference_lines.htm

**Design systems and table patterns:**
- TanStack Table v8 documentation (expanding rows, column pinning, sorting, filtering): https://tanstack.com/table/v8
- Tailwind CSS color system: https://tailwindcss.com/docs/customizing-colors
