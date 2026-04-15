# Evidence assembly and requirements-matching workbench design patterns

**The most effective prior authorization workbench combines five proven patterns from adjacent regulated-industry tools: Relativity's AI-prioritized queue with compound keyboard shortcuts, a three-panel evidence-to-requirements split view with bidirectional linked highlighting, a three-tier confidence badge system with progressive provenance disclosure, accordion-based requirements hierarchy with worst-case status roll-up, and a horizontal swim-lane timeline for longitudinal evidence verification.** These patterns, drawn from e-discovery, compliance audit, life sciences regulatory submission, and clinical informatics platforms, directly address the core challenge of processing 3,000–5,000 TKA cases annually under extreme time pressure. The research identifies a critical gap: no single commercial product adequately handles the evidence-assembly-to-requirements-matching workflow end-to-end, meaning the PA workbench must compose best-of-breed patterns from six adjacent domains. The design recommendations below are specific to a desktop-only (1280px+) React 19 / TypeScript / Tailwind CSS 4 implementation using Inter for text, JetBrains Mono for numerical values, and a High/green, Review/amber, Manual/red confidence tier system.

---

## 1. Case worklist design

### Pattern analysis

Four dominant worklist architectures emerge from the six products analyzed, each optimized for different processing rhythms.

**AI-prioritized queue (Relativity).** Relativity's Review Center represents the gold standard for high-volume document processing. It offers dual queue modes: saved-search queues serving documents by metadata sort order, and prioritized review queues where an ML model ranks documents on a 0–100 relevance scale with a configurable cutoff threshold (default 50). Documents are served to the next available reviewer automatically. Custom dashboards built from data analysis widgets let teams monitor progress, pivot by metadata dimension, and create interactive filtering by clicking chart elements. Relativity also supports relational grouping, keeping family documents (email + attachments) together for the same reviewer — directly analogous to keeping a PA case with its supporting clinical documents. **What breaks down:** Setup complexity is high, the folder-based UI confuses administrators, and there are no SLA countdown timers since the platform is deadline-agnostic.

**Inbox-based workspace (ServiceNow).** ServiceNow's Configurable Workspace uses a single-pane-of-glass approach where agents never leave the workspace context. Work items arrive via Service Channels in a real-time inbox. **Playbook progress indicators** appear as horizontal steppers on each case record (e.g., "Intake → Review → Decision → Notification"), providing at-a-glance workflow state. Advanced Work Assignment routes cases in real time based on agent skills, capacity, geography, and "Agent Affinity" — preferring the same agent who handled related cases previously. Built-in SLA tracking triggers automatic escalation, priority changes, and reassignment when SLAs breach. **What breaks down:** Queue-level granularity is limited out of the box; the inbox shows Service Channels rather than individual queues, and not all field types render properly in the workspace.

**Task-centric home page (Veeva Vault).** Veeva's default landing surfaces "My Tasks" with due-within-7-days filtering, status indicator icons, and a dedicated workflow viewer with per-document verdicts. The "nudge" function — contextual reminders sent to participants with incomplete tasks — is a standout micro-interaction for keeping PA cases moving. Lifecycle-driven automation triggers task assignment, notifications, and security changes based on state transitions. **What breaks down:** No dynamic priority scoring exists, task counts can be misleading due to permission-checking gaps, and completing tasks often requires navigating to a detail page rather than acting inline.

**Hierarchical priority tree (PracticeSuite / claims processing).** The most directly relevant real-world pattern uses a left-pane tree hierarchy organized as Priority → Rule → Function → Worklist. Each priority level carries a colored badge (Priority 1: Red through Priority 5: Green). Numeric bubbles on each node show total remaining balance and A/R percentage. The right pane shows the claim list for the selected worklist, with multi-select and batch "Next Action" for bulk status changes. Enhanced pagination supports **500 entries per page**, and claim rows include hyperlinked patient names and dates of service.

### Visual description

The recommended worklist layout at 1280px minimum allocates a **240px collapsible left panel** for queue navigation as a priority-coded tree, with the remaining width devoted to the worklist table. The table header contains a filter bar with saved-views dropdown, quick search input, and column configuration toggle. Each worklist row displays: checkbox (24×24px), priority indicator (4px left border colored by urgency tier), patient name and procedure in Inter `text-sm font-medium`, payer name in `text-sm text-gray-600`, submission date and days-to-surgery in JetBrains Mono `font-mono text-sm`, a mini stacked progress bar (4px height, 120px wide) showing met/review/missing proportions, and an SLA countdown using a three-state color system (green for >48h, amber for 24–48h, red for <24h). A summary metrics bar above the table shows aggregate counts: total cases, by-status breakdown, and at-risk count. When one or more rows are selected, a sticky bulk action bar slides in from the top with Accept, Flag, and Reassign buttons.

### Tradeoffs

AI-prioritized queues (Relativity) maximize throughput for homogeneous document review but require ML model training and don't accommodate business-rule-driven prioritization like SLA deadlines. ServiceNow's inbox model excels at real-time routing but its channel-based architecture doesn't map cleanly to a worklist that is never empty. Veeva's task-centric approach works well for lifecycle-driven document workflows but lacks the queue density needed for 3,000+ annual cases. The hierarchical priority tree provides the best information density for claims-style processing but can become unwieldy with more than five priority tiers.

### Recommendation

Adopt a **hybrid model** combining Relativity's prioritized queue logic with PracticeSuite's hierarchical tree navigation and ServiceNow's SLA countdown timers. Cases should be scored using a composite priority that weights days-to-surgery, payer SLA deadline proximity, denial likelihood, and revenue impact. The left-panel tree organizes queues by priority tier with badge counts, while the main table supports inline sorting on any column, saved filter views convertible to named queues, and multi-select with bulk actions. Dual countdown timers per case — "Days to Surgery" and "Payer Response Deadline" — should be rendered in JetBrains Mono with color transitions at threshold boundaries.

---

## 2. Where evidence meets requirements in a split-view layout

### Pattern analysis

**Three-panel with collapsible context (Relativity, Everlaw).** E-discovery review tools consistently use a three-zone layout: document list or case context on the left, source document viewer in the center, and coding/classification panel on the right. Relativity offers a "Swap Layout" button that lets users move the coding panel to the opposite side. Everlaw extends this with a collapsible left context panel (hidden by default) showing document relationships — email threads, attachment families, duplicates — while the right panel organizes codes, metadata, and notes in tabs. Everlaw's "Quick Review" mode opens a resizable document viewer inline within the results table, avoiding full context switching.

**Horizontal cascading columns (Jama Connect).** Jama's Trace View uses a multi-column horizontal layout where the source column on the left shows selected items, with downstream relationship levels cascading rightward. Red exclamation marks flag missing relationships, and a Live Trace Explorer generates overview diagrams with coverage percentages per specification. **What breaks down:** Multi-level cascading becomes very wide, requiring horizontal scrolling at standard monitor widths, and the interface lacks synchronized highlighting between columns.

**Evidence panel positioning research.** Nielsen Norman Group's eyetracking data confirms that users spend **80% of viewing time on the left half** of the page, with 94% of fixations on search result pages falling on the left side. The F-shaped scanning pattern concentrates initial attention in the leftmost 400px. Every comparable tool — Relativity, Everlaw, Jama Connect, IBM DOORS — places source material on the left and evaluation/classification on the right, aligning with the Gutenberg principle where the left panel is the "primary optical area" and the right panel is the "terminal area" where decision-making happens.

**Bidirectional linked highlighting.** The formal information visualization term for this pattern is "brushing and linking" (Roberts, 2007). Research in Computer Graphics Forum (Doerr et al., 2024) confirms that **color is the de facto highlighting technique** for brushing and linking due to pre-attentive "pop-out" effects, but semitransparent tints alone are insufficient — solid color changes or outlines are more effective. Connected tree views from academic research (Chen, Marcus) demonstrate the closest analog to the PA workbench's needs: selecting an element in either tree highlights corresponding elements in the other, with bidirectional navigation.

### Visual description

The case detail view uses a three-panel layout with `react-resizable-panels` (bvaughn) for drag-to-resize behavior with localStorage persistence. Default proportions at 1280px: case context at **20% (~256px, collapsible to 0)**, clinical evidence at **45% (~576px, min 320px)**, and payer requirements at **35% (~448px, min 256px)**. At 1920px, the context panel locks to 250–300px with evidence and requirements splitting the remainder equally.

The **case context panel** (left, collapsible) contains patient demographics, PA request summary, identity resolution banner, and case history links. The **evidence panel** (center) has a tab bar for source categories (EMR, Lab, Imaging, PT, Pharmacy) with evidence content displayed as scrollable cards, each carrying a color-coded source badge, extraction date, and confidence tier indicator. The **requirements panel** (right) shows the payer policy identifier, procedure name, and an accordion-based requirements checklist with per-item match status.

When a PA specialist **clicks a requirement** in the right panel, matching evidence in the center panel receives a 2px left border plus a light background tint using the requirement's assigned color (from a 6-color palette: blue-500, green-500, amber-500, purple-500, rose-500, teal-500). The evidence panel auto-scrolls to the first match. Non-selected requirements dim to `opacity-70`. A floating pill indicator appears at the panel's top or bottom edge ("↓ 2 more matches below") when linked items are off-screen. Reverse linking works identically — clicking evidence highlights the corresponding requirement and scrolls it into view.

Resize handles use a 1px visible border with an **invisible 17px grab zone** (8px padding on each side). On hover, the divider changes to `border-blue-400` with `cursor: col-resize`; during drag, it becomes 2px solid blue-500. Double-clicking a divider toggles between the panel's current size and its collapsed state. Each panel header (40–48px fixed height, sticky during content scroll) includes the panel title, sub-view tabs, and collapse/expand chevron.

### Tradeoffs

Two-panel layouts (omitting case context) maximize space for evidence and requirements but force patient demographics into a header bar that competes with the primary workspace. Three-panel layouts provide rich context but at 1280px, the context panel must stay narrow (~250px) or be collapsible. Linked highlighting with color coding works well for up to 6–8 requirement-evidence pairs but becomes confusing with more than 10 simultaneous colors. Connector lines between panels (SVG curves) add visual clarity for power users but create clutter in dense views; they should be hover-only at 60% opacity.

### Recommendation

Use the **three-panel layout with collapsible left context**, placing evidence on the left (center) and requirements on the right. This matches the universal convention from e-discovery, requirements traceability, and compliance tools, and aligns with F-pattern reading behavior. Implement bidirectional linked highlighting with a 6-color palette, auto-scroll-to-match, off-screen match indicators, and dimming of non-selected items. The context panel should default to visible on case entry but remember user preference for collapsed state via localStorage.

---

## 3. Making provenance and confidence visible without overwhelming the reviewer

### Pattern analysis

**Color-coded source badges (Relativity, Palantir Foundry).** Relativity treats "custodian" (source) as a first-class metadata field, enabling filtering, pivoting, and batch operations by source. Palantir Foundry uses property provenance to track which system contributed which field to a composite record, with gray nodes and warning icons for cross-ontology sources. Tamr's Curator Hub surfaces flagged data quality issues in an inbox paradigm with side-by-side record comparisons, match/no-match suggestions, and configurable confidence thresholds.

**Three-tier confidence display (Google PAIR, Microsoft Research).** Google's People + AI Research Guidebook identifies four approaches to showing model confidence: categorical buckets, N-best alternatives, numeric percentages, and graphical indicators. The guidebook explicitly warns that **percentages are risky because they presume users understand probability** — showing 97% instead of 100% for something users consider certain creates confusion. The categorical/bucketed approach (High/Medium/Low) is recommended for non-expert users making quick decisions. Microsoft Research published a "Communicating Confidence in UX Scorecards" pattern that defines a threshold dividing confidence into three states — clearly passing, clearly failing, and indeterminate — which maps directly to the High/Review/Manual tier system. Amazon Comprehend Medical provides a production example: every extracted entity carries a 0.0–1.0 confidence score, and AWS recommends identifying an appropriate confidence threshold and filtering below it.

**Identity resolution display (Tamr, NCBI registries, HL7 FAST).** MDM tools use a three-zone model for patient matching: above the upper threshold triggers automatic match, below the lower threshold creates a new record, and the middle zone requires manual review. An NCBI registry case study found that optimizing the manual review interface **reduced error resolution time from 3 minutes to 40 seconds**. The HL7 FAST Identity Implementation Guide specifies output match scores to "explicitly communicate the strength of each match."

### Visual description

**Source attribution** uses inline color-coded pill badges (`rounded-full px-2.5 py-0.5 text-xs font-medium`) with five fixed colors: Primary Care EHR in `bg-blue-100 text-blue-700`, PT EMR in `bg-purple-100 text-purple-700`, Orthopedic Surgeon in `bg-teal-100 text-teal-700`, Pharmacy in `bg-amber-100 text-amber-700`, and Radiology in `bg-rose-100 text-rose-700`. Each badge includes a small system-type icon (16px). Hovering a badge reveals a tooltip (200–250px width, `bg-slate-800 text-white text-xs rounded-lg px-3 py-2`) with full system name, facility, record date, and document type. Clicking opens the provenance detail in the right panel.

**Confidence tiers** use a progressive disclosure architecture across three layers. **Layer 1 (always visible):** High-confidence items show only a green dot (`h-2 w-2 rounded-full bg-emerald-500`) with no percentage — these items should "fade into the background" visually with `bg-white` row treatment. Review items show an amber dot plus the percentage in JetBrains Mono (`font-mono text-xs text-amber-600`) with a `border-l-2 border-amber-400` left accent. Manual items show a red dot plus percentage in `font-mono text-sm font-semibold text-red-600` with `border-l-3 border-red-500` and an inline action prompt "Manual verification required." **Layer 2 (hover tooltip):** Extraction confidence, semantic match confidence, and combined score with JetBrains Mono for all numbers. **Layer 3 (detail panel):** Original text snippet with highlighted extraction, confidence factor breakdown with mini bar charts, historical accuracy note ("This extraction type is typically 94% accurate"), and override controls.

**Identity resolution** appears as a fixed summary bar below the patient header: `bg-slate-50 border border-slate-200 rounded-lg px-4 py-3`. It shows a link icon, "Patient Matched Across 4 Systems," the overall confidence as a JetBrains Mono badge (`font-mono text-sm` in green/amber/red background), primary match criteria ("DOB + Last Name + MRN"), and a "View Match Details" link. Expanding reveals a per-system match breakdown table with system name, patient ID, match method, confidence percentage, and verification status.

### Tradeoffs

Showing exact percentages inline increases precision but creates decision paralysis when users see "87.2%" versus "89.1%" and cannot interpret the practical difference. Categorical tiers reduce cognitive load but sacrifice granularity for edge cases near tier boundaries. Source badges provide instant provenance recognition but consume horizontal space — more than five source colors risk visual noise. Identity resolution details are critical for trust but irrelevant for day-to-day processing when matches are high-confidence.

### Recommendation

Use the **three-tier categorical system as the primary display** with exact percentages available on hover for Review and Manual items only. High-confidence items should be visually quiet. Source badges should use the five-color system inline on every evidence item, with progressive detail disclosure on hover and click. Identity resolution should default to the summary bar (Layer 1) — if green, proceed; if amber or red, auto-expand to the per-system breakdown. This follows the key insight from clinical informatics research: **if provenance metadata is hard to access, clinicians will skip it entirely**.

---

## 4. Requirements hierarchy with intelligent status roll-up

### Pattern analysis

**Tree-with-detail-pane (Jama Connect, IBM DOORS, Azure DevOps).** Requirements management tools uniformly use a left-side hierarchical tree with indentation and caret/chevron expand/collapse indicators, paired with a detail pane on the right. GitHub's Primer design system recommends that when a child node is active, all parent nodes should be expanded, and that expansion state should be preserved — if a user collapses a high-level parent, nested parents retain their expanded state for when the user re-expands. Jama Connect extends the tree with coverage gap indicators (red exclamation marks for missing downstream relationships) and suspect-link indicators when requirements have changed since last verification.

**Accordion with embedded checklist (TurboTax, Carbon Design System).** IBM Carbon's design system specifies that accordions are best for content "that only goes one level deep" and recommends tree views for 3+ nesting levels. NNGroup guidance favors multi-expand accordions (allowing multiple sections open simultaneously) over auto-collapse for task-completion contexts where sections need comparison. The TurboTax model — current step expanded, completed steps collapsed with completion indicator, future steps collapsed — is directly applicable.

**Worst-case escalation roll-up (SOX compliance, GRC platforms).** AuditBoard, MetricStream, and every GRC platform examined use a worst-case escalation model for parent status: **a single failing control makes the entire objective "needs attention."** Jira's Advanced Roadmaps implements roll-up with a segmented horizontal bar where the green portion represents done issues and gray represents remaining, with click-to-expand popup cards showing completed points, remaining points, total issues, and unestimated count.

**Fractional badge pattern (Monday.com, Jira).** Monday.com's "battery-like" Progress Tracking Column shows percentage complete with status color, and supports parent roll-up via "show summary progress on parent item." Jira displays fractional counts ("3/5 stories") in epic detail popovers. The fractional badge is the most compact, precise, and universally understood status roll-up indicator.

### Visual description

The requirements panel uses an **accordion pattern with embedded checklist**, limited to two hierarchy levels (parent categories and child requirements). Each parent category row is 48px tall with 16px horizontal padding, containing: a rotation-animated chevron (`w-5 h-5 text-gray-400 transition-transform duration-200`), category name in `text-sm font-medium text-gray-900`, and a fractional badge (`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`) colored by worst-case child status — `bg-emerald-50 text-emerald-700` if all children are High, `bg-amber-50 text-amber-700` if any child is Review (and none Manual), `bg-red-50 text-red-700` if any child is Manual.

Child requirement rows are 40px tall with 32px left indentation (`ml-8`) connected to the parent by a `border-l-2 border-gray-200` vertical line. Each row shows: a status icon at 20×20px (CheckCircle in emerald-500, AlertCircle in amber-500, or XCircle in red-500), requirement text in `text-sm text-gray-700`, and a confidence tier label in `text-xs font-semibold uppercase tracking-wide` colored by tier.

**Default expand/collapse behavior** follows a priority-based disclosure strategy: categories containing any Manual/red children auto-expand on case load; all-green categories default to collapsed; amber-only categories collapse but show prominent badge treatment. An "Expand Failing" smart button in the panel header auto-expands only red/amber categories. "Expand All / Collapse All" buttons provide manual control.

### Tradeoffs

Tree views handle 3+ levels of nesting but add visual clutter for the PA workbench's two-level structure. Accordions are simpler but don't scale beyond two levels. Fractional badges ("2/3") provide exact counts but don't communicate which specific children are failing without expansion. Segmented dot arrays (●●○) work for 2–5 children but break down at 8+. Progress bars show proportions visually but lack precision — always pair with fractional text.

### Recommendation

Use the **accordion with embedded checklist** since the PA requirements hierarchy is strictly two levels deep. Apply **worst-case escalation** for parent status (one Manual child turns the entire category red). Use fractional badges ("2/3") as the primary roll-up indicator with color coding by worst-case child status. Auto-expand categories with any Manual/red children on initial case load, and provide an "Expand Failing" button. Allow multi-expand so specialists can compare across categories. This approach balances information density with cognitive clarity and aligns with patterns validated across SOX compliance tools and requirements management platforms.

---

## 5. Gap analysis patterns that answer three questions at once

### Pattern analysis

**Stacked progress bar (Siteimprove, PatternFly, Veeva eTMF).** The most effective summary-level pattern is a single horizontal bar divided into colored segments representing each state. Siteimprove's MultiSegmentProgressBar component recommends using "distinct colors for each segment" and keeping segments to 5–7 maximum. Veeva Vault eTMF uses three-state milestone indicators (Complete/In Progress/Not Started) on interactive dashboards that provide "at-a-glance views of what's required, what's completed, and what's missing at all times." PatternFly's progress component supports stacked bars with outside fixed-width measures.

**Three-state status indicators (IBM Carbon).** Carbon's status indicator pattern library requires at least **three differentiating elements per status**: symbol + shape + color + text label. This WCAG-compliant approach uses filled checkmark circles for success, warning triangles for caution, and close-filled diamonds for errors — each with distinct shape, color, and icon to ensure accessibility. The pattern note that "colors and icons are able to live happily in a table, allowing for reporting of significant numbers of tasks and metrics without visually overloading the audience" directly validates the PA workbench's three-tier model.

**Sort-to-top attention directing (e-discovery, content moderation).** Relativity and content moderation platforms sort items by ML confidence score, serving the most likely relevant (or most likely violating) items first. This pattern maps directly to the PA workbench: **default sort order of Missing → Review → Met** ensures items needing attention are always visible first without visual alarm. Carbon Design System's notification guidance classifies alerts by severity and warns against "flashing endless alerts without prioritization."

**Progressive zoom levels (Veeva, ServiceNow dashboards).** Leading enterprise tools layer completion information at different zoom levels: mini progress bar + fraction in the worklist row, full stacked bar + status summary cards in the case header, and detailed checklist with per-item status in the requirements panel. The transition from summary to detail should never require more than two clicks.

### Visual description

**Worklist level:** Each case row includes a mini stacked progress bar (4px height, 120px width) with green, amber, and gray segments proportional to met, review, and missing counts, plus a fraction display ("7/12") in `text-sm font-medium`. An overall status badge (pill-shaped: "Ready" in green, "In Review" in amber, "Incomplete" in red) provides binary triage information.

**Case header level:** Three status summary cards in a `grid grid-cols-3 gap-3` layout, each a `rounded-lg border p-3` container with a large count (`text-2xl font-bold`) and a label (`text-xs font-medium`), colored green/amber/red per state. Below the cards, a full-width stacked progress bar (8–10px height, `rounded-full`) shows the same three segments with a legend below using 8px dots and `text-xs` labels.

**Detail level:** Requirements sorted Missing → Review → Met, grouped into sections with a `border-l-4` accent (red, amber, or no accent for met). Each section header shows a count ("3 items need review"). Met items can be collapsed with a "Show completed (7)" toggle. Each requirement row carries an inline status chip (`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium` with `ring-1`) using the appropriate icon (CheckCircle, ExclamationTriangle, XCircle) and label.

### Tradeoffs

Stacked progress bars excel at proportional communication but don't identify which specific requirements are in each state — they require a companion detail view. Fraction displays ("7/12") provide exact counts but require mental math for percentage comprehension. Donut charts are visually compact for dashboards but hard to read precisely and unsuitable for inline/table use. Status summary cards provide clear at-a-glance counts but consume three times the horizontal space of a progress bar. The sort-to-top pattern eliminates the need for visual alarms but assumes users will process items sequentially from the top of the list.

### Recommendation

Use a **three-layer progressive disclosure architecture**: mini stacked bar + fraction in the worklist, status summary cards + full stacked bar in the case header, and grouped checklist with status icons in the detail view. Default sort order should be Missing → Review → Met. Avoid pulse animations, persistent toast notifications for each missing item, or modal alerts — these cause alarm fatigue. Instead, use subtle section-level left border accents and elevated font weight to draw attention. Met items should be collapsible to reduce visual noise during active review.

---

## 6. Bulk actions and keyboard shortcuts that save seconds per case

### Pattern analysis

**Compound code-and-advance shortcut (Relativity, Everlaw).** The single most impactful UX pattern for high-throughput review is the compound action: code the current item and automatically advance to the next. Relativity implements this as **`Alt+Enter` (Save and Next)** — the critical shortcut for throughput optimization. Everlaw extends this with numbered presets: `Shift+[1-9]` applies a coding preset AND advances. Everlaw's coding presets let users bundle multiple codes/ratings into a single keystroke, and pressing `A` opens a quick-search coding filter for keyboard-only code selection.

**"Accept all above threshold" (TAR/CAL, content moderation, claims adjudication).** Technology Assisted Review systems use cutoff thresholds (e.g., 70 on a 0–100 scale) where documents scoring above are auto-classified. Claims adjudication systems implement three-tier processing: **auto-approve** for claims meeting all business rules, **pend** for human judgment, and **auto-deny** for policy violations. Content moderation platforms (Stream, moderationapi.com) use configurable thresholds with three-tier action recommendations: Allow, Review, Reject. Oracle Health Insurance routes claims through Dynamic Checks, Pend Rules, and Call Out Rules with configurable confidence thresholds. The common pattern: filter by threshold → display affected count → bulk action button with confirmation → execution with summary and undo.

**Selection patterns (PatternFly, Gmail, Relativity).** PatternFly documents a split-button bulk selector combining a checkbox with a dropdown menu offering "Select all [N] items," "Select none," and "Select all matching filter." Gmail's pattern shows a banner after page selection: "All 25 conversations on this page are selected. Select all 1,247 conversations matching this search." Shift+Click range selection is standard across Relativity, Ant Design, and Google Drive. Selected count must always be visible.

**Undo as safety net (Gmail, Google PAIR).** For reversible actions, a toast notification with undo is more efficient and less friction-inducing than a confirmation dialog. The action executes immediately, a toast appears for 5–10 seconds with an undo button, and the action commits after the undo window expires. For regulated environments, the undo action itself must be logged in the audit trail. For irreversible or high-impact actions, a confirmation modal with explicit action verbs ("Reject 47 Items," not "OK") and affected-item counts provides the necessary safety gate.

### Visual description

**Keyboard shortcut scheme** follows the radiology PACS philosophy: no modifier keys for frequent actions, single keys mapped to the left-hand keyboard cluster. Primary actions: `A` = Accept, `R` = Reject, `F` = Flag for review, `S` = Skip, `J/↓` = Next item, `K/↑` = Previous item, `E` = Open detail, `Q` = Toggle quick review mode, `Space` = Expand/collapse detail, `1-9` = Apply preset decision, `?` = Show shortcut legend. Modified actions: `Shift+A` = Accept and advance, `Shift+R` = Reject and advance, `Ctrl+A` = Select all visible, `Ctrl+Shift+A` = Select all matching filter, `Ctrl+Z` = Undo. Shortcuts are disabled when focus is in a text input.

**Confidence threshold slider** renders as a horizontal range input with a distribution histogram behind the track. Live preview updates as the user drags: "At 95% threshold: 847 auto-accept (68%) | 312 review (25%) | 89 manual (7%)." A "Preview Changes" button shows the affected items, and "Apply Threshold" executes with confirmation. Historical accuracy appears below: "At 95%, historical accuracy is 99.2%."

**Bulk action bar** slides in from the top when ≥1 item is selected (CSS transition, sticky positioning). It displays: selected count ("47 of 1,248 items selected"), action buttons with icons (Accept, Reject, Flag), and "Accept All High Confidence" as a prominent button with a count badge. When items are ineligible for a bulk action, the button shows a tooltip ("3 items below threshold cannot be auto-accepted") and offers "Apply to eligible items only (44 of 47)."

**Toast notifications** use `aria-live="polite"`, position bottom-left, display for 6 seconds with an undo button, and stack up to three. Format: "✓ 47 High-confidence items accepted — Undo (8s)." Combined format: "Bulk action complete: 47 accepted, 12 flagged, 3 skipped — View Details | Undo." Row-level feedback includes a brief background color transition (green flash for accepted, amber for flagged) and inline state change.

### Tradeoffs

Single-key shortcuts maximize speed but risk accidental actions if focus management is imperfect. Compound code-and-advance shortcuts (Shift+A) dramatically increase throughput but reduce deliberation time, which may be inappropriate for the highest-stakes decisions. "Accept all above threshold" can process hundreds of items in seconds but requires careful threshold calibration — too aggressive reduces accuracy, too conservative negates the automation benefit. Toast+undo is more elegant than confirmation dialogs but in regulated environments, "soft delete" patterns may be needed where items enter a "pending" state for a configurable window before committing. Audit trail requirements (HIPAA mandates 6-year retention; CMS requires online logs for 12 months) add engineering complexity to bulk action implementations.

### Recommendation

Implement the **compound code-and-advance shortcut** (`Shift+A` = Accept and Next) as the primary throughput mechanism, modeled on Relativity's `Alt+Enter`. Use **single-key shortcuts without modifiers** for the five most common actions. The "Accept All High Confidence" bulk action should use a two-step flow: display affected count with threshold context → confirmation modal with explicit verb → execution with toast+undo (8-second window). Log every bulk action with full audit metadata including all affected item IDs, confidence threshold, selection method, and before/after states. Use toast+undo for reversible actions and confirmation modals only for irreversible ones — this prevents the confirmation fatigue that makes users click through dialogs without reading.

---

## 7. Horizontal swim lanes make treatment timelines legible

### Pattern analysis

**Horizontal swim lane with semantic zoom (LifeLines, Health Timeline, VisuExplore).** The foundational work in clinical timeline visualization — LifeLines from the University of Maryland HCIL — established the horizontal orientation as canonical for clinical data. Events appear as colored bars (duration events) or icons (point events) grouped in adjacent horizontal rows with labels on the left edge. A peer-reviewed study (Ledesma et al., 2019, BMC Medical Informatics) validated this approach with psychiatrists: the timeline improved insight quality from a mean of **1.26 to 1.70 (p<0.01)** and enabled seven highest-value insights that were impossible without visualization. VisuExplore extends this with parallel panels along a common time axis, using different visualization methods per panel (line plots for test values, bars for treatments, step charts for qualitative abstractions).

**Multi-source provenance on events (Palantir Foundry, KronoGraph).** Palantir's Workshop supports multiple timeline layers, each representing different object types on a single shared time axis, with color per event type and layer toggling via interactive legend. A "time-between-events" tooltip shows calculated duration on hover — critical for verifying "at least 3 months" requirements. KronoGraph (Cambridge Intelligence) scales from a handful to hundreds of thousands of events using aggregation at high zoom levels and smooth drill-down to individual records. It's available as a React SDK with a Figma Design Kit.

**Legal timeline tools (CaseFleet, LexisNexis TimeMap).** CaseFleet offers dual views — chronology (list) and visual timeline (horizontal) — switchable with one click, plus a scale slider for width/density, a minimap for navigation, and fact-to-evidence linking where every timeline event links to source documentation. These legal patterns are directly applicable: the PA specialist needs to link timeline events (PT sessions) to source clinical notes as evidence.

**Epic and Cerner gap.** Major EHR systems do **not** provide a unified cross-system visual timeline. Epic's CareEverywhere pulls external records but displays them as separate "outside records" sections rather than integrating into a unified timeline. This is precisely the gap the PA workbench timeline fills.

### Visual description

The timeline uses a **horizontal swim lane** architecture with lanes organized by source system. A fixed left column (160–200px) shows lane labels with source system names, icons, and color dots. The scrollable timeline canvas to the right shares a common time axis across all lanes, with the axis sticky-positioned at the top within the canvas.

**Zoom levels** progress through five semantic stages: Year (2–5 years visible, aggregated counts), Quarter (6–12 months, category summaries), Month (2–4 months, individual events — the primary working zoom for PA), Week (2–6 weeks, events with detail cards), and Day (1–7 days, full event cards with clinical note content). Mouse wheel zooms, Ctrl+scroll zooms, and arrow keys pan. Transitions between zoom levels animate over 200–300ms.

**Event representation:** Duration events (PT courses, medications) render as horizontal bars with width proportional to duration, using 28px tall rounded cards (`h-7 rounded-md border-l-4 bg-white shadow-sm hover:shadow-md`) with a 4px left border in the source system's color. Each bar shows a truncated title in Inter `text-xs font-medium` and key numeric values in JetBrains Mono `font-mono text-[10px] text-gray-400`. Point events (visits, imaging studies) render as diamond or circle icons at specific dates. Concurrent items within a lane stack vertically, adding 24–32px per overlapping item.

**Requirement highlighting** overlays a semi-transparent band (`bg-amber-100/40`) spanning the required time window (e.g., 3-month PT minimum), with an annotation label pinned above ("Requirement: ≥3 months supervised PT") and a compliance indicator ("✅ Met: 14 weeks documented" or "⚠ Gap: 2-week break in sessions, Mar 5–19"). Clicking a requirement chip in the PA checklist auto-scrolls and zooms the timeline to the relevant window.

A **minimap** (40px tall, full width) above the main canvas shows the complete timeline compressed as an event-density heatmap, with the current viewport as a draggable semi-transparent overlay rectangle. Filtering uses persistent pills above the timeline: source system toggles (checkbox pills with source colors), event type dropdown, date range, and a relevance filter that shows only events matching the currently selected PA requirement. Filtered-out events **dim to opacity 0.2** rather than disappearing, preserving temporal context.

### Tradeoffs

Horizontal orientation maximizes duration perception and concurrent-activity visibility but requires horizontal scrolling for timelines exceeding the viewport width — the minimap mitigates this. Vertical orientation excels at activity-feed-style narrative reading but poorly communicates duration and concurrency. Lanes by source system (recommended) directly answer provenance questions but may scatter related treatment events across multiple lanes; lanes by treatment type consolidate clinical information but obscure provenance. Five source colors must be distinguishable for color-blind users — the design must use color plus shape/pattern, never color alone.

Known failure modes at scale: more than five swim lanes at 1280px leaves less than 150px per lane (solution: collapsible lanes with summary bars); many events on the same day cluster into unreadable density (solution: aggregate into grouped events with expand-on-click); a 2-year timeline with 15-minute PT sessions makes sessions invisible (solution: semantic zoom with minimum visual width of 4px); and two systems reporting different dates for the same event create confusion (solution: conflict icon with side-by-side comparison in detail panel).

### Recommendation

Use a **horizontal swim-lane timeline with lanes by source system** as the primary view, since the PA specialist's core verification task — confirming temporal requirements like "3 months of PT" — is fundamentally a duration measurement task that horizontal timelines excel at. Implement five zoom levels with semantic aggregation, a minimap for orientation, requirement-window highlighting with compliance indicators, and click-to-detail interaction that opens a slide-out panel (400px right-side) with full clinical note content. Offer a secondary vertical chronological feed view (toggled via a button) for detailed narrative reading when the specialist needs to review specific clinical notes. Filter-to-dim rather than filter-to-hide preserves temporal context. For implementation, consider vis-timeline (mature, supports ranges and points) or KronoGraph (React SDK, scales to 100K+ events) as the rendering engine.

---

## Recommended screen architecture combining all seven patterns

The PA Workbench consists of two primary views connected by a master-detail navigation pattern: the **Case Worklist** and the **Case Detail** view.

### Case worklist view

The worklist occupies the full viewport. A **240px collapsible left panel** contains the priority-coded queue tree with badge counts and a quick search input. The main content area contains a summary metrics bar (total cases, status breakdown, at-risk count), a filter bar with saved-views dropdown and column configuration, and a dense data table with checkbox selection, priority indicators, patient/procedure/payer information, mini stacked progress bars, SLA countdown timers, and overall status badges. When items are selected, a sticky bulk action bar appears at the top. The "Accept All High Confidence" button sits prominently in the bulk action bar with a count badge. Keyboard shortcuts are active: `J/K` for row navigation, `Enter` to open a case, `A` to accept highlighted row, `?` for shortcut legend.

### Case detail view

Clicking a case row transitions to the detail view (or opens in a new tab, user preference). The detail view has four major zones arranged vertically and horizontally.

**Zone 1: Case header bar (56px, sticky).** Contains a back-to-worklist button, patient name and DOB in Inter `text-base font-semibold`, PA request number and procedure in `text-sm text-gray-600`, identity resolution summary badge, overall status, and primary action buttons (Submit, Save Draft, Request Info). A keyboard shortcut `Escape` returns to the worklist.

**Zone 2: Three-panel evidence-to-requirements workspace (occupies remaining height).** Left collapsible context panel (20%), center evidence panel (45%), right requirements panel (35%), all resizable. The context panel shows patient demographics, case timeline preview (mini horizontal timeline), payer information, and case history. The evidence panel uses tabbed source categories with scrollable evidence cards carrying source badges, confidence indicators, and linked highlighting. The requirements panel uses the accordion-with-checklist pattern with fractional badges, worst-case roll-up, and auto-expand of failing categories.

**Zone 3: Stacked progress bar + status summary (fixed footer or panel header).** Shows met/review/missing counts with the three-segment progress bar, positioned in the requirements panel header so it remains visible during scrolling.

**Zone 4: Timeline view (toggleable overlay or tab).** Accessed via a "Timeline" tab or toggle button in the evidence panel. Renders the horizontal swim-lane timeline with source-system lanes, zoom controls, minimap, and requirement-window highlighting. Clicking a timeline event populates the evidence panel with the corresponding clinical note.

### Component list with placement and behavior

| Component | Placement | Behavior |
|---|---|---|
| Queue Tree | Left panel, 240px | Collapsible, priority-coded badges, click to filter worklist |
| Worklist Table | Main content area | Virtualized rows, sortable columns, checkbox multi-select |
| Bulk Action Bar | Sticky top of worklist | Appears on selection, Accept/Reject/Flag buttons + "Accept All High" |
| Mini Progress Bar | Inline in worklist rows | 4px height, 120px width, three segments |
| SLA Countdown Timer | Inline in worklist rows | JetBrains Mono, three-state color transition |
| Case Header Bar | Top of case detail, sticky | Patient info, identity badge, primary actions |
| Context Panel | Left panel of detail view | Collapsible, patient demographics, mini timeline |
| Evidence Panel | Center panel of detail view | Tabbed by source, scrollable cards with source badges |
| Requirements Panel | Right panel of detail view | Accordion hierarchy, fractional badges, status roll-up |
| Linked Highlighting | Cross-panel interaction | Bidirectional click-to-highlight, 6-color palette, auto-scroll |
| Confidence Badges | Inline on evidence items | Three-tier (dot + label), progressive detail on hover/click |
| Source Badges | Inline on evidence items | Color-coded pills, hover for full provenance |
| Identity Resolution Bar | Below case header | Summary bar with expandable per-system breakdown |
| Stacked Progress Bar | Requirements panel header | 8px height, three segments, with fraction text |
| Status Summary Cards | Case header area | Three cards (met/review/missing) with large counts |
| Timeline | Toggleable view in evidence panel | Horizontal swim lanes, zoom, minimap, requirement highlighting |
| Keyboard Shortcut Legend | Modal triggered by `?` | Full shortcut reference with category grouping |
| Toast Notifications | Bottom-left of viewport | Bulk action results with undo, stacks to 3 |
| Confidence Threshold Slider | Settings or bulk action panel | Range input with histogram, live preview counts |

### Interaction flow from worklist to submission

**Step 1: Triage in worklist.** The PA specialist opens the workbench to their default saved view (e.g., "My Cases — Urgent"). Cases are sorted by composite priority score. The specialist scans the worklist, using mini progress bars and SLA timers to identify which cases need immediate attention. For high-confidence cases where all requirements show green, they use "Accept All High Confidence" to bulk-accept evidence matches across multiple cases without opening them.

**Step 2: Open case for review.** The specialist clicks a case (or presses `Enter`) to open the detail view. The three-panel workspace loads with evidence on the left-center, requirements on the right, and context on the far left. Categories with Manual/red children auto-expand. The stacked progress bar in the requirements header shows "8/12 met, 2 review, 2 missing."

**Step 3: Review evidence-requirement matches.** The specialist works through Review/amber items first (sorted to top). Clicking a requirement highlights matching evidence in the center panel with auto-scroll. They read the clinical note, confirm the match, and press `A` to accept. `Shift+A` accepts and advances to the next Review item. For each item, the confidence badge, source badge, and extracted value are visible inline; hovering shows the confidence breakdown and original text.

**Step 4: Resolve missing items.** For Manual/red requirements (no matching evidence found), the specialist opens the Timeline view to search for relevant clinical events across all source systems. They zoom to the relevant time window, identify a PT session that the system missed, click it to view the clinical note, and manually link it to the requirement using a "Link to Requirement" context action.

**Step 5: Verify timeline compliance.** The specialist clicks a temporal requirement ("≥3 months supervised PT") to activate the requirement highlight band on the timeline. The band spans the required window with a compliance indicator showing whether the documented PT sessions cover the full period. Gaps are visible as breaks in the event sequence within the highlighted band.

**Step 6: Submit.** When all requirements show green (or the specialist has documented override justifications for any remaining issues), they click "Submit Authorization Request" in the case header. A confirmation modal shows the complete requirement status, any overrides with justification, and the target payer. The case moves to "Submitted" status in the worklist and the specialist presses `J` to advance to the next case.

This architecture enables a PA specialist to process high-confidence cases in under 60 seconds (bulk accept from worklist), standard cases in 3–5 minutes (evidence review with keyboard navigation), and complex cases in 8–12 minutes (timeline investigation with manual linking) — supporting the throughput required for 3,000–5,000 annual TKA cases across 20 locations.
