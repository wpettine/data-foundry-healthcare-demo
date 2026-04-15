# Data Foundry: UX/UI Design Memo

> **Scope note:** This document describes the **full product** — a functional SaaS application with a 3-phase MVP roadmap (see Section 8). The demo (a static, scripted walkthrough) is specified in `demo_design_memo.md`. See `sequencing.md` for how the demo relates to the product and the build order. Example data in this document uses the Meridian Software Group scenario defined in `meridian_data_bible.md`; update there first if numbers change.

**Data Foundry is the schema-first semantic integration layer that turns months of M&A data chaos into auditable, version-controlled financial intelligence.** This memo provides wireframe-level design guidance for a desktop-first web application that serves two fundamentally different audiences (sell-side preparers and buy-side verifiers) under extreme time pressure (60–90 day exclusivity windows). The core design challenge is building trust through transparency: every number must trace to a source record, every annotation must carry a confidence signal, and every change must be logged immutably. What follows is an opinionated, practical blueprint for a product designer to begin wireframing the first release.

The platform operates on schemas and metadata, not raw transaction records. It sits outside the customer's data plane. These constraints shape every design decision: the UI must convey that Data Foundry understands data structure and meaning without ever displaying raw PII or transaction-level records to unauthorized viewers.

---

## 1. Executive Summary

### Five design principles that govern every screen

**Principle 1: Confidence-forward.** Every automated output (schema annotation, entity match, metric computation) displays a categorical confidence indicator (High / Medium / Low) with numeric detail on hover. Users never wonder "did a machine decide this or a human?" because provenance badges answer that question on every field.

**Principle 2: Progressive disclosure across three layers.** Layer 1 is the dashboard (scannable in under 5 seconds). Layer 2 is the detail view (full tables, reconciliation status, annotation state). Layer 3 is the deep dive (complete lineage graph, change history, raw schema details). This accommodates CFOs who need a status check in 30 seconds and QoE providers who need to trace a number through four systems.

**Principle 3: Auditability is the product.** Immutable change logs, version-controlled snapshots, and "click to trace" lineage are not features bolted on after launch. They are the reason the platform exists. The audit trail is the most defensible moat.

**Principle 4: Time-aware design.** The 60–90 day exclusivity clock is the defining constraint. Every workflow should surface a "what's blocking close" view. Batch actions, "accept all high-confidence" buttons, and one-click quarterly refreshes exist because time kills deals.

**Principle 5: Two audiences, one truth.** Sell-side users build the narrative. Buy-side users stress-test the narrative. The platform shows the same underlying data with persona-adapted views, never two different versions of the truth.

### Top-level recommendations

| Recommendation | Rationale |
|---|---|
| Adopt a **spreadsheet-as-interface** paradigm for financial data review (borrow from Sigma Computing) | CFOs and FP&A leads live in Excel; a familiar interaction model eliminates the learning curve |
| Use a **DAG-based lineage graph** (borrow from dbt) as the primary trust artifact | QoE providers need to trace any metric to source; the DAG makes this visual and auditable |
| Build the **schema annotation experience as a reviewable table**, not a drag-and-drop canvas | Drag-and-drop is fragile for non-technical users; a suggestion-based table with bulk-accept is faster under time pressure |
| Implement **Fivetran-style schema drift detection** with Monte Carlo-style alert triage | Schema changes during a live deal are high-severity events that need immediate, prioritized surfacing |
| Design the **reconciliation layer as a side-by-side comparison** with materiality thresholds (borrow from Modern Treasury) | Financial professionals expect variance analysis in a familiar format |
| Create **persona-specific entry points** that route to shared underlying views | A CFO dashboard, a QoE workspace, and an integration planning view are three lenses on one data model |

---

## 2. User Journey Maps

### Sell-side journey: from system connection to data room handoff

The sell-side journey spans 4–12 months and involves increasing data refinement under increasing time pressure. Below is the journey as a sequence of stages, key screens, decision points, and emotional states.

**Stage 1: System onboarding (Week 1–2)**
The CFO or CIO connects 2–8 source systems (ERPs, CRMs, billing platforms). The primary screen is a **Connector Dashboard** showing tiles for each system type, modeled after Fivetran's connector catalog. Each tile displays the system logo, connection status (Connected / Syncing / Failed), and last sync timestamp. The setup flow follows a guided wizard: Select system type → Enter credentials → Test connection → Review discovered schemas → Confirm sync scope. The emotional state here is cautious optimism mixed with anxiety about what the data will reveal.

*Key decision point:* Which schemas and tables to include. The platform presents a **checkbox tree** (Fivetran pattern) showing discovered schemas → tables → columns with recommended selections pre-checked. A "Review Changes" confirmation step prevents accidental omissions.

**Stage 2: Schema discovery and annotation (Week 2–4)**
Once systems sync, Data Foundry's ensemble models automatically annotate fields, mapping them to canonical business concepts (e.g., `invoice_amount` → `Revenue.Recognized.Gross`). The primary screen is the **Annotation Workspace**, a tabular review interface (detailed in Section 4.1). The CFO/Controller reviews automated annotations, confirms high-confidence mappings in bulk, and resolves low-confidence flags one by one.

*Emotional state:* Focused but overwhelmed by volume. The platform mitigates this by sorting annotations by confidence (lowest first) and providing an "Accept all High-confidence" bulk action. A progress bar shows "287 of 342 fields annotated (84%)" — the 287 are auto-accepted at ≥90% confidence, with 34 additional High-confidence fields (85–89%) queued for confirmation and 21 Medium/Low fields requiring manual review. (See `meridian_data_bible.md` → Annotation Progress for the full breakdown.)

**Stage 3: Entity resolution (Week 3–5)**
With schemas annotated, the platform runs embedding-based entity matching across systems. The **Entity Resolution Queue** surfaces match candidates grouped by confidence tier. The VP Sales Ops reviews fuzzy matches, confirms parent-child hierarchies, and resolves duplicates. A running counter shows "4,200 accounts → 3,408 unique entities (19% deduplication)." (The ~23,800 raw customer-related records across all systems collapse to ~4,200 apparent accounts after within-system dedup, then to ~3,408 unique entities after cross-system resolution. See `meridian_data_bible.md` → Customer & Entity Resolution.)

*Key decision point:* Merge threshold. The platform recommends auto-merging above 92% confidence and human review between 65–91%. Below 65%, records remain separate with a "potential match" flag. (See `meridian_data_bible.md` → Customer & Entity Resolution for threshold definitions.)

**Stage 4: Metric construction and reconciliation (Week 4–8)**
The FP&A Lead builds financial metrics (ARR waterfall, NRR, cohort retention) from annotated source data. The **Metric Builder** presents a spreadsheet-like interface (Sigma Computing pattern) where users define calculations referencing canonical concepts. The **Reconciliation Dashboard** shows side-by-side comparisons across systems (CRM-reported ARR vs. billing-computed ARR vs. GL-recognized revenue) with variance highlighting.

*Emotional state:* This is the highest-anxiety phase. Discrepancies between systems are common (typically 3–15% variance), and every gap must be explained before the data room opens. The platform surfaces a "Tie to bank statement" workflow that walks users through proof-of-cash reconciliation.

**Stage 5: Data room population (Week 6–10)**
Reconciled metrics flow into **Exhibit Templates** (financial schedules, customer analyses, cohort tables). The Exhibit Manager maps reconciled data to standard data room formats. Version control is critical: each exhibit is timestamped and snapshotted. The CFO reviews generated exhibits in a preview mode before publishing to the data room.

*Key decision point:* What to publish. The platform shows a readiness checklist ("12 of 15 exhibits ready, 3 pending reconciliation") with blocking issues highlighted in red.

**Stage 6: Quarterly refresh (ongoing, every 90 days)**
During a 6–9 month sale process, quarterly financials must be refreshed. The **Refresh Workflow** is designed for one-click propagation: re-sync sources → re-run annotations (flagging any new drift) → re-compute metrics → generate updated exhibits → present diff view against previous quarter. The target is same-day refresh.

*Emotional state:* Deal fatigue. The platform must minimize manual work to prevent the CFO from burning out. Every refresh should require fewer than 10 human decisions.

**Stage 7: Handoff to buy-side**
The data room opens. Schema annotations, entity mappings, and metric definitions become persistent integration assets. The **Handoff Package** includes a machine-readable export of all mappings, entity graphs, and metric lineage that the buy-side can import into their own Data Foundry workspace.

### Buy-side journey: from data room access to integration planning

The buy-side journey is shorter (6–12 weeks) but more adversarial. The buy-side user is looking for what the seller missed or obscured.

**Stage 1: Data room ingestion (Day 1–3)**
The PE Deal Lead or QoE provider receives access to the seller's Data Foundry workspace (read-only) or imports the handoff package. The **Import Dashboard** shows a topology map of source systems, annotation coverage, and overall data quality score.

*Emotional state:* Skeptical but hopeful. The buy-side wants to trust the seller's work but must verify independently.

**Stage 2: Independent metric reconstruction (Day 3–14)**
The QoE provider rebuilds key metrics (Adjusted EBITDA, ARR, NRR) from the annotated source data using their own methodology. The **Verification Workspace** displays seller-reported metrics alongside independently reconstructed metrics in a side-by-side comparison. Discrepancies are highlighted with materiality flags.

*Key decision point:* Which discrepancies are material? The platform applies user-configurable materiality thresholds (e.g., >$50K or >2% of total). Material discrepancies route to a **Discrepancy Log** that becomes a negotiation artifact.

**Stage 3: Risk quantification (Day 7–21)**
The Deal Lead quantifies financial risk from data quality issues: customer concentration, revenue recognition anomalies, entity resolution gaps. The **Risk Dashboard** surfaces confidence-weighted risk factors with dollar-value impact estimates.

*Emotional state:* Analytical intensity. The platform must support deep drill-downs without losing the big picture. The DAG lineage view is the primary tool here.

**Stage 4: Integration planning (Day 14–42)**
The Operating Partner and Integration PMO use the entity graph, system topology, and schema annotations to plan Day 1 post-close infrastructure. The **Integration Planner** shows a system topology diagram (which systems, how they connect, what data flows where), TSA scope estimates, and a "carry-forward" button that converts diligence-mode annotations into production integration mappings.

*Key handoff:* Diligence findings → integration action items. The platform translates "revenue recognition discrepancy in System B" into "System B requires GL reclassification by Day 30."

### Sell-side vs. buy-side tension points

| Tension | How the platform resolves it |
|---|---|
| Seller wants to control the narrative; buyer wants raw access | Seller publishes curated exhibits; buyer can independently query annotated source data within the platform's metadata layer |
| Seller may exclude unfavorable annotations; buyer needs completeness | Platform logs annotation coverage percentage and flags unannotated fields visibly to both sides |
| Seller prefers higher entity match thresholds (fewer duplicates = more customers); buyer prefers lower thresholds | Platform shows sensitivity analysis: "At 90% threshold: 19,214 entities. At 85%: 18,607 entities. At 80%: 17,982 entities." Both sides see the same analysis. |
| Seller updates exhibits quarterly; buyer wants to see what changed | Every exhibit carries a version diff. Buyer can compare Q3 vs. Q2 exhibits field by field. |
| Seller's QoE may use different adjustments than buyer's QoE | Platform supports parallel metric definitions with labeled methodology tags ("Seller QoE methodology" vs. "Buyer QoE methodology") on the same underlying data |

---

## 3. Information Architecture

### Navigation model: a persistent left sidebar with contextual workspace

The primary navigation uses a **persistent left sidebar** (IBM Carbon pattern) with five top-level objects, each expanding into sub-navigation. The right 80% of the screen is a contextual workspace that changes based on selection.

**Top-level navigation objects:**

| Nav item | Icon | Contains |
|---|---|---|
| **Sources** | Database icon | Connected systems, sync status, schema browser, drift alerts |
| **Annotations** | Tag icon | Annotated fields grouped by canonical concept, confidence filters, unmapped queue |
| **Entities** | People icon | Entity resolution results, golden records, parent-child hierarchies, duplicate queue |
| **Metrics** | Chart icon | Metric definitions, reconciliation dashboard, ARR waterfall, cohort tables |
| **Exhibits** | Document icon | Data room exhibits, version history, refresh status, publish controls |

A secondary **top bar** provides: workspace switcher (for multi-deal support), user/role indicator, notification bell (drift alerts, review requests), and a global search bar.

### Object hierarchy and relationship map

The information architecture follows a directed flow from raw sources to published exhibits. The key architectural differentiator is the **ontology derivation chain**: each source system gets an automatically derived source ontology, and the unified ontology is algorithmically derived as a function of all source ontologies. This is not a flat mapping table — it is a semantic model that absorbs schema drift by re-deriving only the affected parts of the chain.

```
Source Systems (ERP, CRM, Billing)
  └── Schemas (Tables, Fields)
       └── Source Ontologies (auto-derived per system)
            │   Captures: field semantics, table relationships,
            │   constraints, fiscal calendars, provenance
            │
            └── Unified Ontology (algorithmically derived from all source ontologies)
                 └── Canonical Concepts (Revenue.*, Customer.*, Contract.*)
                      └── Field-to-Concept Annotations (with confidence scores)
                           └── Business Metrics (ARR, NRR, Retention...)
                                └── Exhibits (Financial Schedules, Cohort Tables...)

Entity Graph (parallel structure):
  Source Records → Match Candidates → Golden Records → Parent-Child Hierarchy
```

**Source Ontologies** are automatically derived semantic models — one per connected system. Each captures what fields mean in the source system's context, not just their names and types. For example, the NetSuite source ontology knows that `tranSales.amount` represents recognized revenue under ASC 606, that the fiscal calendar is Jan–Dec, and that the multi-subsidiary flag is enabled. When a source system's schema changes, only its source ontology re-derives.

**Unified Ontology** is algorithmically derived as a function of all source ontologies. It produces the canonical concept hierarchy (e.g., `Revenue.Billed.Gross`, `Revenue.Recognized.Net`). It is not hand-built. When a source ontology changes, the unified ontology re-derives automatically. Downstream exhibits that don't depend on the changed concept are unaffected — drift is absorbed by the derivation chain, not fought by humans.

**Canonical Concepts** are the leaf nodes of the unified ontology. They sit between raw fields and business metrics. Examples: `Revenue.Recognized.Net`, `Customer.Active.Enterprise`, `Contract.Term.Months`. The platform ships with a standard taxonomy of ~200 canonical concepts for B2B SaaS, extensible by users.

### How ontology derivation appears in the UI

The Sources nav section includes an **Ontology View** per system, showing the derived source ontology as an expandable panel with discovered concepts, relationships, constraints, and provenance. The Annotations nav section shows the **Unified Ontology** as a visual diagram (source ontologies on the perimeter feeding into the unified ontology at center) above the field-to-concept mapping table.

Schema drift alerts (Section 4.4) include a diff of the affected source ontology (before/after version) and a propagation analysis showing which canonical concepts and downstream exhibits are affected by the re-derivation. See `sequencing.md` for the full ontology architecture definition shared between the demo and the product.

### How entity resolution results integrate

Entity resolution results are surfaced in two places: (1) the **Entities** section of the left nav, which shows the master entity list with golden records, and (2) inline within the **Metrics** section, where entity-level metrics (customer concentration, cohort membership) reference resolved entities. Clicking any entity name anywhere in the platform opens a **side panel** showing the golden record, source system contributions, match confidence, and linked records.

### How the reconciliation layer is surfaced

The reconciliation layer appears as a **persistent status bar** within the Metrics section. Each metric card shows a reconciliation badge:

- **Green checkmark**: All sources agree within tolerance
- **Amber triangle**: Variance exists but within materiality threshold
- **Red circle**: Material discrepancy requiring resolution

Clicking the badge opens the **Reconciliation Detail View**: a side-by-side table showing each source system's value, the computed canonical value, and the variance. A "Trace" button on any cell launches the lineage DAG focused on that specific data path.

---

## 4. Core Interaction Patterns

### 4.1 Schema annotation and mapping

The annotation experience is the platform's first impression. It must convince a CFO that the AI understands their data while making it easy to correct mistakes.

**Layout description:** The Annotation Workspace is a full-width table with the following columns: Source System (icon + name), Source Field Name, Data Type, Sample Values (3–5 examples), Mapped Canonical Concept (editable dropdown with search), Confidence (categorical badge), Status (Auto-mapped / Human-confirmed / Flagged), and an expand chevron.

**Confidence visualization:** Each annotation carries a categorical confidence badge using the three-tier system recommended by Google's People + AI Guidebook:

| Confidence tier | Visual treatment | Meaning | Default action |
|---|---|---|---|
| **High** (≥85%) | Green badge, "High" label | Model ensemble agrees with low semantic entropy | Auto-accepted; user can review |
| **Medium** (60–84%) | Amber badge, "Review" label | Partial agreement or moderate entropy | Queued for human review |
| **Low** (<60%) | Red badge, "Manual" label | High disagreement or novel field type | Requires manual mapping |

On hover, the badge expands to show: numeric confidence percentage, ensemble model agreement ratio, conformal prediction interval, and top 3 alternative mappings with their scores. This progressive disclosure follows Nielsen Norman Group's guideline of showing "only a few of the most important options initially."

**Interaction flow for reviewing annotations:**

1. User opens the Annotation Workspace and sees all fields sorted by confidence (lowest first by default, toggleable)
2. A top action bar shows: "342 total fields | 287 auto-accepted (≥90%) | 34 High (85–89%, pending) | 14 Medium | 7 Low | **Accept all High** [button]"
3. User clicks "Accept all High" to batch-confirm the 34 pending High-confidence annotations → progress jumps from 84% to 94%
4. The workspace now shows 21 remaining fields needing review (14 Medium + 7 Low)
5. For each medium-confidence field, the user sees the suggested mapping, sample values, and alternatives in a dropdown
6. Clicking the dropdown shows canonical concepts ranked by model confidence, with a search box for manual lookup
7. For low-confidence fields, the platform shows a "No confident match" state with suggested candidates and a "Create new concept" option
8. Each confirmed or overridden annotation is logged with user, timestamp, and previous value

**Handling ambiguity:** When the ensemble model produces high semantic entropy (multiple plausible mappings), the platform displays a **disambiguation card** below the field row. This card shows the top 3 candidate concepts side-by-side with: concept name, concept definition, sample values from other systems already mapped to that concept, and confidence score. The user selects one or flags for expert review. This pattern is borrowed from Kira Systems' approach of showing AI extractions with linked citations for transparency.

**What to avoid:** Do not use drag-and-drop as the primary mapping interaction. Research from Pencil & Paper confirms that "having only drag and drop in place to achieve a goal is fragile, because if it isn't usable by someone, that's a blocker." The dropdown-with-search pattern is accessible to all users and faster under time pressure.

### 4.2 Entity resolution

Entity resolution is the most cognitively demanding workflow. Users must make high-stakes merge/split decisions on potentially thousands of records.

**Layout description:** The Entity Resolution Queue uses a **three-panel layout**. The left panel is a filterable list of match candidates grouped by confidence tier, showing entity name, match score, and source system count. The center panel shows the selected match pair (or group) in a **side-by-side comparison** (Profisee/Tamr pattern). The right panel shows the **golden record preview** that would result from merging.

**Side-by-side comparison design:** For a match pair, display two record cards with field-level alignment:

| Field | System A (NetSuite) | System B (Salesforce) | Conflict? |
|---|---|---|---|
| Company Name | Acme Corp | ACME Corporation | No (fuzzy match) |
| Address | 123 Main St, NY | 123 Main Street, New York | No (normalized match) |
| Annual Revenue | $2.4M | $3.1M | **Yes** (amber highlight) |
| Primary Contact | J. Smith | Jane Smith | No (fuzzy match) |
| Account Status | Active | Active | No |

Conflicting fields show both values with an amber background. The user selects the surviving value by clicking it (the selected value gets a blue border). For automated survivorship, the platform applies configurable rules: source system ranking (ERP > CRM for financial data, CRM > ERP for contact data), recency, or completeness.

**Golden record preview:** The right panel shows the merged entity as it would appear after confirmation. Each field displays a small **provenance chip** (colored by source system) showing where the value originated. Example: "Annual Revenue: $2.4M `[NetSuite]`". Hovering the chip shows the competing values and the rule that selected the winner.

**Parent-child hierarchy:** A collapsible tree diagram (Microsoft Dynamics pattern) shows corporate entity relationships. Each node is an entity card displaying: entity name, jurisdiction, status, revenue contribution, and data completeness indicator. The tree supports: drag-and-drop reparenting, right-click context menu for merge/split/edit, and keyboard navigation (arrow keys for traversal, Enter to expand).

**Batch processing under time pressure:** To handle 15,000–40,000+ records efficiently:

- Auto-merge above configurable threshold (default: 92% confidence) with full audit log
- Surface only medium-confidence matches (65–92%) for human review, sorted by revenue impact (largest customers first)
- Provide batch actions: "Accept top 50 matches," "Reject all below 65%," "Flag all with revenue conflict for CFO review"
- Show running statistics: "Processed: 1,247 / 3,891 review candidates | Auto-merged: 12,456 | Rejected: 891"

**Handling conflicts across systems:** When source systems disagree on a material field (e.g., revenue), the platform does not auto-resolve. Instead, it surfaces a **Conflict Card** with both values, source timestamps, and a required resolution action: Accept A, Accept B, Enter manual value, or Flag for investigation. Every resolution is logged.

### 4.3 Financial metric construction and reconciliation

This is the highest-stakes workflow. The metrics built here become the basis for valuation.

**Metric Builder layout:** A spreadsheet-like interface (Sigma Computing pattern) where the left column lists canonical concepts and the formula bar allows constructing metrics from them. Example: `ARR = SUM(Revenue.Recognized.Recurring.Monthly) × 12 WHERE Customer.Status = Active`. The interface supports Excel-like formulas that compile to queries against the annotated metadata layer. Auto-complete suggests canonical concepts as the user types.

**ARR Waterfall construction:** A dedicated waterfall template pre-builds the standard structure:

```
Beginning ARR
  + New Business (new logos)
  + Expansion (upsell/cross-sell on existing)
  + Reactivation (previously churned)
  - Contraction (downsell)
  - Churn (lost logos)
= Ending ARR
```

Each line item links to the underlying entity-level transactions. Clicking "New Business" shows the list of new customer entities with their first contract dates and ARR contributions. The source of truth is configurable (CRM bookings, billing records, or GL), and the platform shows the waterfall computed from each source with variance analysis between them.

**Reconciliation Dashboard:** A central dashboard with one card per metric showing three source values side by side:

| Metric | CRM (Salesforce + HubSpot) | Billing (Zuora + Stripe + Chargebee) | GL (NetSuite + QuickBooks + SAP) | Variance | Status |
|---|---|---|---|---|---|
| Total ARR | $203.2M | $198.7M | $196.1M | $7.1M (3.6%) | 🔴 Material |
| Customer Count | 3,408 | 3,391 | N/A | 17 (0.5%) | 🟡 Review |
| NRR (LTM) | 112% | 109% | N/A | 3pp | 🟡 Review |
| Gross Margin | N/A | N/A | 74.2% | — | 🟢 Single source |

(See `meridian_data_bible.md` → ARR Reconciliation for variance decomposition details.)

Material discrepancies (above user-configured thresholds) appear in red. Clicking any variance opens a drill-down showing the contributing differences at the entity level, sorted by magnitude.

**"Tie to bank statement" workflow:** A guided, step-by-step reconciliation (TurboTax wizard pattern):

1. Upload or connect bank statement data (last 24 months)
2. Platform auto-matches deposits to recognized revenue line items
3. Unmatched items surface in an exception queue
4. User categorizes each exception: timing difference, reclassification, or true discrepancy
5. A summary "Proof of Cash" exhibit is generated showing the full bridge from GL revenue to bank deposits

**Data lineage for QoE providers:** Any number displayed anywhere in the Metrics section has a "Why this number?" interaction. Click the number → a lineage panel opens on the right showing: calculation formula, each input concept, each source field contributing to that concept, and a "Trace to source" button that opens the DAG lineage graph focused on this specific data path. The DAG uses the dbt-style visualization with nodes for each transformation step and edges showing data flow. Column-level lineage allows tracing a single metric back through every computation to the specific field in the specific source system.

### 4.4 Schema drift monitoring and alerting

Schema drift during a live deal is a high-severity event. A field rename or type change can silently invalidate an entire annotation chain.

**Alert prioritization:** Alerts are scored using two factors: (1) the **table importance score** (computed from downstream dependencies: a table feeding 12 metrics is more important than one feeding 2) and (2) the **change severity** (column removal > type change > column addition > distribution shift).

**Alert Triage Interface layout:** A priority-sorted list in the Sources section, each alert showing:

| Priority | System | Change | Affected Annotations | Affected Metrics | Status |
|---|---|---|---|---|---|
| 🔴 Critical | NetSuite | `revenue_type` column removed | 4 annotations broken | ARR Waterfall, NRR | New |
| 🟡 High | Salesforce | `account_status` type changed (string → int) | 1 annotation at risk | Customer Count | Investigating |
| 🟢 Low | Stripe | New column `promo_code` added | None (new field) | None | Auto-acknowledged |

Each alert expands to show: old schema vs. new schema (diff view with additions in green, removals in red, changes in amber), impact analysis ("this change breaks 4 downstream annotations and 2 metrics"), and remediation options.

**Remediation workflow for broken annotations:**

1. Alert fires → notification appears in top bar and via email/Slack
2. User opens alert detail → sees the broken annotation with old field → canonical concept mapping
3. Platform suggests remediation: "Field `revenue_type` was removed. Candidate replacement: `rev_category` (87% semantic similarity)"
4. User confirms the replacement, rejects it, or remaps manually
5. Downstream metrics auto-recompute and show a "Recomputed after schema change" badge
6. The event is logged in the audit trail

**Communicating silent failures:** The hardest UX challenge. A "silent failure" occurs when data syncs successfully but the semantic meaning of a field has shifted (e.g., a "revenue" field that previously included only recurring revenue now includes services revenue). The platform detects this via distribution monitoring (Monte Carlo's dimension tracking pattern). The alert presents:

- A histogram overlay showing historical distribution vs. current distribution
- A plain-language explanation: "The distribution of values in `revenue_type` has shifted significantly. Previously 92% of values were 'Recurring'; now only 64% are 'Recurring' with 28% 'Services'."
- A clear label: **"Semantic Drift Detected"** with amber priority
- Impact statement: "If this shift is unintentional, ARR may be overstated by up to $1.2M"

### 4.5 Data room exhibit generation and maintenance

**Exhibit Templates:** The platform ships with standard templates for software M&A data rooms:

- Revenue analysis (ARR bridge, MRR schedule, revenue by type)
- Customer analysis (concentration, cohort retention, top 20 customers)
- Financial schedules (P&L, balance sheet, working capital)
- SaaS metrics (NRR, GRR, LTV/CAC, payback period)

Each template is a structured layout that pulls from reconciled metrics and entity data. The **Exhibit Editor** shows a preview of the generated output alongside the template structure. Users can customize labels, add footnotes, and adjust formatting.

**Quarterly refresh workflow:**

1. User clicks "Refresh All" from the Exhibits dashboard
2. Platform re-syncs all connected sources (shows progress per system)
3. New data runs through existing annotations (flags any drift)
4. Metrics recompute automatically
5. Updated exhibits generate in draft mode
6. A **diff view** shows changes vs. previous quarter: new line items (green), removed items (red strikethrough), changed values (amber with old → new)
7. User reviews the diff, resolves any flagged items, and clicks "Publish Q3 Update"
8. Previous version is archived with full snapshot

**Version control:** Every published exhibit creates an immutable snapshot. The version history shows a timeline of all published versions with: date, publisher, change summary, and "Compare" links to diff any two versions. This is critical during a 6–9 month sale process where the buyer's QoE team will compare Q1 exhibits to Q3 exhibits and ask about every change.

### 4.6 Buy-side verification and integration planning

**Verification Workspace:** The buy-side sees a read-only view of the seller's annotations with an overlay showing their independent reconstruction. The primary screen is a **split view**:

| Metric | Seller-Reported | Independently Reconstructed | Delta | Materiality |
|---|---|---|---|---|
| ARR | $198.7M | $196.3M | −$2.4M (−1.2%) | 🔴 Material |
| NRR | 112% | 109% | −3pp | 🔴 Material |
| Customer Count | 3,408 | 3,391 | −17 (−0.5%) | 🟢 Immaterial |
| Gross Margin | 74.2% | 73.8% | −0.4pp | 🟢 Immaterial |

(See `meridian_data_bible.md` → ARR Reconciliation → Buy-side view for the $2.4M gap decomposition.)

Each delta is clickable, drilling into a detailed variance analysis showing which entities, time periods, or classification decisions account for the difference.

**System topology view for integration planning:** A visual diagram showing all connected source systems, the data flows between them, and Data Foundry's annotation/entity layer. Each system node shows: system name, version, hosting model (cloud/on-prem), record counts, and integration complexity score. This view directly informs TSA scoping: the Integration PMO can see which systems are entangled and which are independent.

**Carry-forward from diligence to integration mode:** A single toggle switches the workspace from "Diligence Mode" (read-only verification, discrepancy tracking) to "Integration Mode" (active planning, task assignment). In Integration Mode, annotations become editable mappings to the acquirer's target schema. Entity resolution results become the foundation for customer data migration. Metric definitions become KPI tracking templates for the first 100 days. Every asset created during diligence persists and evolves.

---

## 5. Design Pattern References

### What to borrow from each analogous product

| Product | Pattern to borrow | How to adapt for Data Foundry |
|---|---|---|
| **Sigma Computing** | Spreadsheet-as-interface for analytics | Use for Metric Builder and reconciliation tables; finance teams already think in cells and formulas |
| **dbt** | DAG lineage visualization with column-level tracing and lenses | Use for "click to trace" lineage from any metric to source; overlay annotation confidence and reconciliation status as lenses |
| **Fivetran** | Checkbox tree for schema selection; schema change handling tiers (Allow All / Allow Columns / Block All); "Save & Test" validation pattern | Use for source onboarding and drift detection; the "Review Changes" step before applying is essential for M&A |
| **Carta** | Rule-based permissions with four access levels; multi-stakeholder views of same underlying data; audit-defensible reports | Use for sell-side/buy-side access control; Carta's approach to showing different views per role is directly applicable |
| **Datasite** | Data room organization, Q&A workflows, "View As" feature, engagement tracking | Borrow "View As" for seller to preview what buyer sees; engagement tracking reveals which exhibits buyers focus on |
| **Kira/Luminance** | AI extraction with human review, confidence-based escalation tiers, linked citations | Borrow the human-in-the-loop review pattern for schema annotations; always link AI outputs to source evidence |
| **TurboTax** | Guided wizard for complex financial tasks, real-time impact preview, review checkpoints, anxiety-reducing copy | Use for "Tie to bank statement" workflow and quarterly refresh; the real-time reconciliation counter (like TurboTax's refund counter) builds confidence |
| **Airtable** | Linked records as first-class citizens, multiple views on same data, Interface Designer for role-specific views | Use linked records pattern for entity → contract → revenue relationships; multiple views (grid, kanban, timeline) for annotation status tracking |
| **Notion** | "Can Edit Content" vs. structural access permissions, block-based documentation alongside structured data, version history | Adapt for annotation workflows: architects define canonical concepts, business users confirm mappings without altering the concept taxonomy |
| **Ramp** | Real-time categorization, "bento box" dashboard cards, bulk upload with inline validation (via OneSchema) | Borrow dashboard card layout for system health and reconciliation status; inline validation during data import |
| **Pigment/Anaplan** | Cross-functional planning views, live collaboration, scenario modeling | Use scenario modeling for entity resolution sensitivity analysis; live collaboration for multi-user annotation sessions |
| **Monte Carlo** | Five-pillar observability (freshness, volume, schema, distribution, lineage), table importance scoring, alert routing | Directly applicable for schema drift detection; table importance scoring prioritizes alerts by downstream impact |

### What to avoid

| Anti-pattern | Source | Why to avoid |
|---|---|---|
| Drag-and-drop as the only mapping interaction | Pencil & Paper UX research | "If it isn't usable by someone, that's a blocker." Provide dropdown alternatives. |
| Raw numeric confidence without context | Google PAIR Guidebook | "Novice users may not know whether 80% is low or high for a certain context." Use categorical tiers. |
| Forcing all users into one complex interface | Anaplan's learning curve problem | Anaplan requires dedicated "model builders"; Data Foundry must be usable by CFOs directly. |
| Auto-playing animations or decorative elements | MindSing FinTech UX research | In financial contexts, visual gimmicks reduce perceived competence. |
| Hiding audit trails behind multiple clicks | SOX compliance requirements, Carta design patterns | Audit information should be two clicks away maximum from any data point. |

### Published UX case studies and design systems referenced

Authoritative design system documentation used in developing these recommendations: IBM Carbon Design System data table and data visualization guidelines; Ant Design enterprise layout templates and data display specifications; Material Design data table component guidance. Peer-reviewed and industry research includes: Google's People + AI Guidebook on explainability and trust calibration; Nielsen Norman Group articles on progressive disclosure and complex application design (8 design guidelines for complex apps); Stanford HAI principles for human-in-the-loop AI systems; ACM study on confidence rating interfaces in enterprise environments (2025); Mosqueira-Rey et al. (2022) survey on human-in-the-loop ML in *Artificial Intelligence Review*; and the Resolvi (2025) reference architecture for entity resolution on arXiv. Product-specific case studies include: Appcues' 9-tactic teardown of TurboTax onboarding UX; Modern Treasury's published reconciliation UI redesign case study; Ramp's Bakken & Baeck brand system case study; Carta's engineering blog on Zanzibar-based access control; and Fivetran's published design philosophy on schema change management.

---

## 6. Persona-Specific Views

The same underlying data powers four distinct entry points. Each persona sees a tailored dashboard that routes into shared detail views.

### CFO / Controller view: "Deal Readiness Dashboard"

**Default visible:** Overall readiness score (percentage of exhibits completed and reconciled), top 3 blocking issues, system sync status summary (all green / some amber), days since last refresh, and a "time since LOI" counter if in exclusivity.

**Key actions surfaced:** "Refresh All Exhibits," "Review Flagged Annotations," "Export Data Room Package."

**Drill-down available:** Click any readiness metric to see the underlying detail. Click a blocking issue to see the specific reconciliation discrepancy or annotation gap. Click "ARR Waterfall" to see the full waterfall with source-by-source reconciliation.

**Information density:** Medium. Cards and summary metrics. No raw field-level data on the default view.

### QoE Provider view: "Forensic Workspace"

**Default visible:** Full metric table with reconciliation status per metric, annotation coverage statistics, entity resolution summary, and data lineage access for every metric.

**Key actions surfaced:** "Trace to Source" on any number, "Compare Seller vs. Independent Metrics," "Export Audit Package," "View Full Change History."

**Drill-down available:** Every number is a hyperlink to its lineage DAG. Every annotation shows confidence breakdown. The QoE provider can inspect any field-level detail without restriction.

**Information density:** High. Dense tables with monospace numbers, expandable rows, minimal chrome. Power users who want to see everything. Offer a compact/comfortable/spacious density toggle (Google Workspace pattern) defaulting to compact.

### PE Deal Lead view: "Investment Confidence Dashboard"

**Default visible:** Key SaaS metrics (ARR, NRR, gross margin, customer concentration) with **confidence signals** (green = verified across sources, amber = minor discrepancies, red = material issues). A "Deal Risk Summary" card shows the top 5 risks with dollar-value impact estimates.

**Key actions surfaced:** "View Discrepancy Report," "Compare to Seller Claims," "Download IC Memo Exhibits."

**Drill-down available:** Click any metric to see the seller-reported vs. independently-reconstructed comparison. Click any risk to see the supporting evidence and recommended diligence question.

**Information density:** Low-to-medium. The Deal Lead needs the bottom line, not the methodology. Confidence badges and RAG indicators do the heavy lifting.

### Operating Partner / Integration PMO view: "Integration Planning Workspace"

**Default visible:** System topology diagram, entity graph summary (total entities, hierarchy depth, cross-system coverage), TSA scope indicators, and a "Day 1 Readiness" checklist.

**Key actions surfaced:** "Switch to Integration Mode," "Export System Inventory," "Generate TSA Scope Document," "Create Integration Workstream."

**Drill-down available:** Click any system node to see schema details, annotation coverage, and estimated migration complexity. Click entity graph to see the full parent-child hierarchy with data quality indicators per node.

**Information density:** Medium, visually oriented. Diagrams and topology maps dominate over tables.

### Role-based access control model

Borrowing from Carta's four-tier permission system:

| Role | Sources | Annotations | Entities | Metrics | Exhibits | Audit Log |
|---|---|---|---|---|---|---|
| **Admin** (CIO/Data Lead) | Full access | Full access | Full access | Full access | Full access | Full access |
| **Editor** (CFO, FP&A) | View + configure | Review + confirm | Review + confirm | Create + edit | Create + edit | View |
| **Reviewer** (VP Sales Ops, GC) | View | View + comment | Review + confirm (own domain) | View | View + comment | View (own actions) |
| **Viewer** (PE Deal Lead) | View topology only | View | View golden records | View + compare | View + download | View |
| **Auditor** (QoE Provider) | View | View + trace lineage | View + trace lineage | View + reconstruct independently | View + compare | Full read access |

---

## 7. Visual Design Principles

### Trust through visual consistency

Financial professionals judge competence through visual precision. Research shows that interfaces with strict grid layouts score **17% higher on perceived professionalism** (Phenomenon Studio). For Data Foundry:

- Use an **8px spacing grid** throughout, with 16px and 24px increments for section spacing
- Maintain strict column alignment in all tables; use monospace numerals for financial data to ensure decimal alignment
- Avoid decorative elements, gradients, or playful illustrations; use clean iconography from a single icon set (Lucide or Phosphor)
- Target **WCAG 2.1 AA compliance** for all color contrasts (minimum 3:1 for non-text elements per IBM Carbon guidance)

### Confidence visualization system

The platform's ensemble models produce three outputs: point confidence, semantic entropy, and conformal prediction intervals. These must be rendered accessibly:

**Primary display (always visible):** A categorical badge system. High confidence uses a small green circle with checkmark. Medium confidence uses an amber circle with question mark. Low confidence uses a red circle with exclamation mark. The badge includes a text label ("High" / "Review" / "Manual") for accessibility.

**Secondary display (on hover):** A tooltip showing: numeric confidence (e.g., "87%"), model agreement (e.g., "4/5 models agree"), and one-line explanation (e.g., "Field name and data type strongly match Revenue.Gross concept").

**Tertiary display (on click/expand):** A detail panel showing: the full ensemble breakdown, alternative mappings with scores, conformal prediction interval ("95% confidence this field maps to one of: Revenue.Gross, Revenue.Net, Revenue.Deferred"), semantic entropy score with a visual gauge, and sample data comparison.

### Color system for financial data

| Usage | Color | Hex (approximate) | When to use |
|---|---|---|---|
| Primary brand / trust | Deep blue | #1A56DB | Navigation, headers, primary actions |
| Verified / reconciled | Green | #059669 | Matched values, completed steps, healthy status |
| Warning / review needed | Amber | #D97706 | Medium confidence, minor discrepancies, stale data |
| Error / critical | Red | #DC2626 | Material discrepancies, broken annotations, sync failures |
| Neutral / informational | Gray | #6B7280 | Secondary text, immaterial items, disabled states |
| Source system provenance | System-specific accent colors | Varies | Each connected system gets a unique color chip (NetSuite = orange, Salesforce = blue, Stripe = purple) |

**Critical rule:** Never use color alone to convey meaning. Always pair with icons, text labels, or patterns (IBM Carbon principle: "Use text patterns + markers as substitutes for color-only encoding").

### Typography for financial data

- **Headers:** Inter or IBM Plex Sans, semibold, sentence case
- **Body text:** Same family, regular weight, 14px base
- **Financial data:** IBM Plex Mono or JetBrains Mono for all numerical displays; this ensures decimal alignment and prevents digit confusion
- **Table headers:** 12px, uppercase, letter-spaced, muted color
- **Metric values:** 24px+ bold for dashboard KPIs; 14px regular for table cells

### Data density guidelines

Data Foundry serves users who are accustomed to dense financial spreadsheets. Do not over-simplify.

- **Default density:** "Comfortable" (36px row height, 8px cell padding)
- **Compact option:** Available via toggle (28px row height, 4px cell padding) for power users reviewing large datasets
- **Dashboard cards:** Minimum 200px width, maximum 4 cards per row
- **Tables:** Support horizontal scroll with frozen first 2 columns (entity name + status); support column pinning and resizing
- **"Export to Excel" button:** Present on every table view. Finance teams will export. Do not fight this behavior; instead, make the exported file carry provenance metadata (source system, last updated, confidence tier) in additional columns.

---

## 8. MVP Scope Recommendation

### Build order: what to ship first and why

The MVP must demonstrate the core value proposition in a single sell-side engagement: connect systems, annotate schemas, resolve entities, and produce an auditable ARR waterfall. Below is a phased build plan.

**Phase 1 (Months 1–3): "Annotate and Reconcile"**

Build the schema annotation workflow and basic reconciliation. This is the minimum viable product that a sell-side CFO can use to prepare for QoE.

| Component | Scope | Rationale |
|---|---|---|
| Source connectors | Support 3 systems: one ERP (NetSuite or QuickBooks), one CRM (Salesforce or HubSpot), one billing (Stripe or Chargebee) | Covers the most common SaaS stack |
| Schema discovery | Auto-discover schemas, tables, fields from connected systems | Foundation for everything else |
| Annotation engine | Ensemble model annotations with confidence tiers; table-based review UI with bulk accept | Core differentiation; first "wow" moment |
| Canonical concept taxonomy | Ship 50 core concepts for B2B SaaS (Revenue.*, Customer.*, Contract.*) | Enough to build ARR waterfall and basic customer metrics |
| Metric builder | Spreadsheet-like formula builder for ARR, MRR, customer count | Delivers the first business-value output |
| Basic reconciliation | Side-by-side comparison of same metric from two sources | Proves the "single source of truth" value proposition |
| Audit trail | Immutable log of all annotation and metric changes | Non-negotiable for financial credibility |

**Phase 2 (Months 4–6): "Resolve and Exhibit"**

Add entity resolution and data room exhibit generation. This completes the sell-side workflow.

| Component | Scope | Rationale |
|---|---|---|
| Entity resolution engine | Embedding-based matching with confidence tiers; side-by-side review UI; golden record display | Addresses the 10–30% duplication problem; high-value for VP Sales Ops |
| Parent-child hierarchy | Tree visualization with entity cards | Required for customer concentration analysis |
| ARR waterfall template | Pre-built waterfall with entity-level drill-down | The single most requested data room exhibit |
| Exhibit generator | 5 standard templates (ARR waterfall, cohort retention, customer concentration, revenue by type, proof of cash) | Delivers the data room preparation value |
| Version control | Quarterly snapshots with diff views | Essential once the first quarterly refresh hits |
| Schema drift detection | Basic monitoring for column additions/removals/type changes with alert notifications | Prevents silent failures during the deal |

**Phase 3 (Months 7–9): "Verify and Integrate"**

Add the buy-side experience and integration planning tools.

| Component | Scope | Rationale |
|---|---|---|
| Buy-side workspace | Read-only view of seller data + independent metric reconstruction + comparison view | Opens the buy-side revenue stream |
| Handoff package | Machine-readable export of all annotations, entity graphs, metric definitions | Enables the "persistent integration asset" promise |
| Integration mode | Toggle from diligence to integration; system topology view; TSA scope indicators | Bridges diligence and post-close; differentiated from pure diligence tools |
| Quarterly refresh automation | One-click refresh with drift detection and exhibit regeneration | Reduces refresh from days to hours |
| Collaboration features | Comments, @mentions, task assignment on annotations and discrepancies | Required for multi-person deal teams |

### Phase 1 MVP: what to cut

Do not build in Phase 1: data room integration (use manual export to Datasite/Intralinks), buy-side features, collaboration/comments, advanced drift detection (semantic distribution analysis), parent-child hierarchies, or integration planning tools. These are Phase 2–3 features.

The Phase 1 test: Can a CFO connect their NetSuite and Salesforce, review automated schema annotations, build an ARR waterfall, see where it disagrees with the CRM's number, and export a reconciliation report? If yes, the MVP works.

---

## 9. Open Questions and Areas for User Research

### Questions requiring user research before wireframing

**Annotation workflow speed vs. accuracy tradeoff.** At what confidence threshold do sell-side users feel comfortable bulk-accepting automated annotations? The platform defaults to 85%, but this needs validation. Conduct a task-based usability study with 5–8 CFOs/Controllers, presenting annotated schemas and asking them to identify their comfort threshold. Measure both the threshold they state and the threshold revealed by their actual review behavior (do they actually inspect high-confidence annotations or skip them?).

**Entity resolution merge anxiety.** How much do users trust automated merges they did not individually review? When 12,000 records auto-merge above 92% confidence, do users feel comfortable or anxious? Test with VP Sales Ops users by showing them post-merge customer lists and measuring how many they spot-check. The answer determines whether auto-merge should be the default or opt-in.

**Reconciliation materiality expectations.** What variance thresholds do different personas consider "material"? A CFO may tolerate 2% variance; a QoE provider may flag 0.5%. Conduct structured interviews with both sell-side CFOs and buy-side QoE providers to calibrate default thresholds per role.

**Information density preferences by role.** Do PE Deal Leads actually want a summary dashboard, or do they prefer direct access to detailed tables? Early adopter interviews should include a preference test showing the same data in dashboard-card format vs. dense table format and measuring which view leads to faster decision-making and higher stated confidence.

**"Why this number?" interaction discovery.** Will users naturally discover the click-to-trace lineage feature, or does it need explicit onboarding? Run a think-aloud usability test where users are asked to verify a specific ARR figure. Measure whether they find the lineage view unprompted.

### Unresolved design tensions

**How much to automate in the MVP.** The platform's value is automation, but premature automation erodes trust. Research question: what is the minimum number of "human confirms" required before a user trusts the system's autonomous decisions? Consider a "trust ramp" where the first project requires more manual confirmation and subsequent projects increase automation.

**Canonical concept extensibility.** The platform ships with ~200 standard concepts, but every company has idiosyncratic fields. How should custom concept creation work? Should users propose new concepts that a team reviews, or can any editor create them? The risk of unrestricted creation is taxonomy sprawl; the risk of restricted creation is blocking users during a time-pressured deal.

**Multi-deal workspace management.** Investment banks and QoE firms manage multiple concurrent deals. How should the platform handle workspace switching, cross-deal pattern recognition ("we've seen this schema pattern in 3 other deals"), and analyst workload management? This is a Phase 3+ consideration but should influence the information architecture now.

**Offline/export parity.** Finance teams will export to Excel. Should the platform invest in making Excel exports carry full provenance and lineage metadata, or focus on keeping users inside the platform? The pragmatic answer is to support rich exports early (provenance columns, source system tags) because fighting Excel adoption is a losing battle in finance.

**Legal and compliance boundaries.** When the platform shows entity resolution results that reveal customer concentration patterns, is it creating new material non-public information? How should the platform handle the legal boundary between data preparation (the seller's responsibility) and data analysis (potentially subject to disclosure obligations)? This requires legal review, not just UX research.
