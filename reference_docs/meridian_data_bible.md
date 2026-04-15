# Meridian Software Group — Canonical Data Reference

**Purpose:** Single source of truth for all demo data, fictional company details, and numeric constants. All design documents and implementation artifacts reference this file. If a number appears in a demo screen or design doc, it must match what's defined here.

---

## Company Profile

| Attribute | Value |
|---|---|
| Company name | Meridian Software Group |
| Industry | Healthcare IT (vertical SaaS) |
| ARR | $200M |
| Ownership | PE-backed |
| Acquisitions | 5 over 4 years |
| Exit status | LOI signed, 60-day exclusivity window |
| Fiscal calendar | January–December |
| Base currency | USD |

---

## Source Systems (9 total)

| # | System | Type | Entity | Notes |
|---|---|---|---|---|
| 1 | NetSuite | ERP | Parent | Multi-subsidiary enabled, ASC 606 |
| 2 | QuickBooks | ERP | Acquired entities A & B | Shared instance for 2 small acquisitions |
| 3 | SAP Business One | ERP | Acquired entity C | On-prem, EUR → USD translation |
| 4 | Salesforce Org 1 | CRM | Parent + entity A | Primary sales org |
| 5 | Salesforce Org 2 | CRM | Entities B & C | Inherited from acquisition |
| 6 | HubSpot | CRM | Acquired entity D | Marketing + sales, migrating to SF |
| 7 | Zuora | Billing | Parent | Subscription billing, ratable recognition |
| 8 | Stripe | Billing | Entities A & B | Usage-based + fixed billing |
| 9 | Chargebee | Billing | Entity C | Annual contracts only |

**Count rule:** Each distinct system instance = 1 system. QuickBooks serves 2 entities but is 1 system. Stripe serves 2 entities but is 1 system.

---

## Schema & Field Counts

| Metric | Value | Notes |
|---|---|---|
| Tables discovered | 127 tables across 9 systems | NetSuite: 47, QuickBooks: 12, SAP B1: 18, SF Org 1: 14, SF Org 2: 11, HubSpot: 6, Zuora: 9, Stripe: 6, Chargebee: 4 |
| Columns catalogued | 47,832 | Total across all tables |
| Business-critical fields for annotation | 342 | Revenue, customer, contract, and product fields requiring canonical concept mapping |

---

## Annotation Progress

These numbers describe the state shown in the demo at the point the user sees the Annotation Workspace.

| Category | Count | % of 342 | Confidence Range | Default Status |
|---|---|---|---|---|
| Auto-accepted (High) | 287 | 84% | ≥90% | Auto-accepted, logged |
| High (pending confirmation) | 34 | 10% | 85–89% | Needs review (borderline or cross-system conflict) |
| Medium | 14 | 4% | 60–84% | Needs review |
| Low | 7 | 2% | <60% | Requires manual mapping |

**Demo interaction:** Progress bar starts at "287 of 342 fields annotated (84%)." User clicks "Accept all High-confidence" → accepts the 34 pending High-confidence fields → progress bar animates to "321 of 342 fields annotated (94%)." 21 fields remain for manual review.

**Confidence tier thresholds (canonical):**

| Tier | Range | Visual | Default Action |
|---|---|---|---|
| High | ≥85% | Green badge | Auto-accepted (≥90%) or queued for confirmation (85–89%) |
| Medium | 60–84% | Amber badge | Queued for human review |
| Low | <60% | Red badge | Requires manual mapping |

---

## Customer & Entity Resolution

| Metric | Value | Notes |
|---|---|---|
| Raw customer-related records (all systems) | ~23,800 | CRM contacts, billing accounts, ERP customer records, support tickets |
| Apparent customer accounts (within-system dedup) | ~4,200 | After basic exact-match dedup within each system |
| Unique business entities (after cross-system resolution) | ~3,408 | After embedding-based entity resolution across systems |
| Cross-system deduplication rate | 18.8% (~19%) | (4,200 − 3,408) / 4,200 |
| Auto-merge threshold | ≥92% embedding similarity | Merges logged, auditable, reversible |
| Human review range | 65–91% similarity | Sorted by revenue impact (largest customers first) |
| Below-threshold | <65% similarity | Remain separate, "potential match" flag |

**Headline entity resolution examples:**

| Entity (Golden Record) | System A | System B | System C | Similarity |
|---|---|---|---|---|
| Apex Medical Systems | "Apex Medical Systems" (Salesforce, 127 opps, $4.2M ARR) | "Apex Med Sys Inc" (Zuora, 94 invoices, $3.8M billed) | "APEX MEDICAL" (NetSuite, 12 contracts) | 96.2% → Auto-merged |
| St. Luke's Health Network | "St. Luke's Health Network" (CRM) | "Saint Luke's Health" (billing) | "St Lukes Network LLC" (ERP) | 93.1% → Auto-merged |

---

## Customer Concentration Shift

This is the highest-impact demo moment. After entity resolution, subsidiary rollup reveals hidden concentration.

| Metric | Before Resolution | After Resolution | Delta |
|---|---|---|---|
| Top customer % of ARR | 7.8% (reported) | 11.2% (true, after subsidiary rollup) | +3.4 pts |
| Cause | 3 subsidiaries of same parent reported as separate accounts | Rolled up to single parent entity | — |
| Valuation impact | Below 10% threshold ("no concern") | Above 10% threshold (20–40% haircut risk on that customer's revenue) | Material |

---

## ARR Reconciliation

All figures use the $200M scale appropriate for Meridian.

### Sell-side view (3-source reconciliation)

| Source | Reported ARR | Variance vs. Billing | Notes |
|---|---|---|---|
| CRM (Salesforce + HubSpot) | $203.2M | +$4.5M | Includes pipeline bookings not yet billed |
| Billing (Zuora + Stripe + Chargebee) | $198.7M | — (baseline) | Invoice-based, most conservative |
| GL (NetSuite + QuickBooks + SAP) | $196.1M | −$2.6M | ASC 606 timing differences |

**Variance decomposition (CRM → Billing, $4.5M gap):**
- $3.2M: 47 contracts where CRM booking date precedes billing start date by >30 days (timing)
- $1.3M: Pipeline deals marked "closed-won" in CRM but not yet invoiced

**Variance decomposition (Billing → GL, $2.6M gap):**
- $1.8M: Multi-year prepayments recognized differently across Zuora (ratably) vs. QuickBooks (at invoice)
- $800K: Revenue classification differences (services vs. subscription)

### Buy-side view (independent reconstruction)

| Metric | Seller-Reported | Independent Reconstruction | Delta | Materiality |
|---|---|---|---|---|
| ARR | $198.7M | $196.3M | −$2.4M | Material |
| Net Revenue Retention | 112% | 109% | −3 pts | Material |
| Gross Margin | 74.2% | 73.8% | −0.4 pts | Immaterial |
| Customer Count | 3,408 | 3,391 | −17 | Immaterial |

**$2.4M ARR gap decomposition:**
- $1.1M: Timing differences in revenue recognition (resolves within quarter — immaterial)
- $800K: Entity resolution disagreement — 3 accounts the seller merged that the buyer keeps separate
- $500K: Classification dispute — seller counts professional services as recurring (material)

---

## Risk Dashboard (Buy-side)

| Risk Factor | Impact | Confidence | Detail |
|---|---|---|---|
| Customer concentration (true) | Top customer 11.2% (reported 7.8%) | High | Entity rollup reveals 3 subsidiaries of same parent |
| Change-of-control exposure | $8.3M ARR at risk | Medium | 12 contracts with CoC termination clauses |
| Revenue classification | $500K ARR reclassifiable as non-recurring | High | Professional services booked as subscription |
| Retention overstatement | NRR 109% vs. reported 112% | High | Cohort methodology disagreement |
| Schema drift risk | 3 active drift events in last 90 days | Medium | Zuora and Salesforce Org 2 schema changes |

---

## Exhibit Readiness (Sell-side)

| Exhibit | Status | Notes |
|---|---|---|
| ARR Waterfall (trailing 12 months) | Ready | — |
| Net Revenue Retention by Cohort | Ready | — |
| Customer Concentration (top 25) | Ready | — |
| Gross Margin by Product Line | Needs review | 1 variance: discount classification |
| Normalized EBITDA Bridge | Needs review | 2 adjustments pending |
| Deferred Revenue Schedule | Ready | — |
| Revenue by Geography | Ready | — |
| Revenue by Product Line | Ready | — |
| Customer Acquisition Cost | Ready | — |
| Cohort Retention Curves | Ready | — |
| Working Capital Summary | Ready | — |
| Proof of Cash | Ready | — |
| Billings vs. Revenue Bridge | Needs review | Timing classification |
| Contract Summary (top 50) | Ready | — |
| Headcount & Compensation | Ready | — |

**Summary:** 12 of 15 exhibits ready. 3 pending review.

---

## Quarterly Refresh (Q3 2026)

| Item | Value |
|---|---|
| Trigger | Q3 2026 close detected |
| Systems refreshed | 9 |
| Exhibits auto-updated | 23 |
| Exhibits requiring human review | 2 |
| Reconciliation breaks | 0 |

**Review items:**
1. New customer entered top 10: HealthBridge Corp, $2.1M ARR
2. Schema change detected: Zuora added new field `discountType` to invoice object

**Schema drift detail:**
- Zuora source ontology re-derived: v12 → v13
- Unified ontology re-derived from updated source ontologies
- 22 of 23 exhibits unaffected
- 1 exhibit flagged: Gross Margin by Product Line (new field `discountType` may affect net revenue calculation)
- Suggested re-mapping provided for review

---

## Integration Planner (Buy-side)

| Item | Value |
|---|---|
| System consolidation timeline | 4 months (vs. industry average 12–18 months) |
| Estimated TSA cost | $2.1M (40% below comparable deals) |
| Entity pre-mapping coverage | 96% of top 50 customers |
| Day 1 action items | 3 auto-generated from diligence findings |

**Day 1 actions:**
1. Consolidate 3 billing systems onto Zuora by Day 90 (mappings ready)
2. Resolve entity hierarchy for top 50 customers by Day 30 (96% pre-mapped)
3. Reclassify $500K professional services revenue by Day 15

---

## Data Quality Score (Buy-side import)

| Dimension | Grade | Notes |
|---|---|---|
| Completeness | A− | 94% field annotation coverage; 2 systems missing historical data pre-2023 |
| Consistency | B | 3 material reconciliation variances identified; entity resolution at 96% confidence-weighted match rate |
| Timeliness | B+ | All systems synced within last 24 hours; 1 system (SAP B1) has batch sync (daily) |
| **Overall** | **B+** | Weighted average across dimensions |
