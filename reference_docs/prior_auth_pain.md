# Prior Authorization in 2026: Where Data Breaks and Where MTN Can Fix It

**The prior authorization process remains one of the most expensive, clinically harmful, and operationally fragile workflows in American healthcare, and the root cause is not procedural but architectural: heterogeneous data systems that cannot speak to each other.** U.S. providers and payers spent an estimated **$35 billion on PA administration** in 2023 (Health Affairs Scholar, Sahni et al., September 2024), while physicians reported that **93% of PA interactions delay necessary care** and **82% of patients sometimes abandon treatment entirely** (AMA 2024 Prior Authorization Physician Survey, February 2025). With CMS-0057-F's FHIR API mandate now nine months from its January 2027 compliance deadline, and WEDI survey data showing **33% of providers have not started implementation** (WEDI, February 2026), the convergence of regulatory urgency and infrastructure fragility creates a narrow window for technology that solves the data layer, not just the transaction layer. This report maps the PA workflow, quantifies the executive-level pain, diagnoses the data integration failures underneath, surveys the technology investment landscape, and identifies where MTN's semantic data preparation capabilities can deliver measurable value.

---

## The end-to-end PA workflow reveals a system held together by manual handoffs

The prior authorization lifecycle moves through five stages, each introducing friction through system boundaries and format mismatches. What follows is the current state of how a PA request actually travels from clinical decision to payer adjudication and back.

### Identification and trigger

The process begins when a clinician orders a service, procedure, or medication and the system flags it as requiring payer approval. For pharmacy PAs, real-time benefit tools (primarily Surescripts) can surface PA requirements at the point of prescribing inside the EHR. For medical and procedural PAs, discovery is far less reliable. Providers learn that PA is required through payer portal lookups, eligibility verification responses, or, frequently, only when a claim is rejected after the service is rendered. The AMA's 2024 survey found that **65% of physicians find it difficult to determine whether a service requires PA**, and **30% report that PA requirement information in their EHR is rarely or never accurate**.

### Documentation assembly

Once a PA requirement is identified, clinical staff assemble supporting evidence from multiple systems: EHR chart notes, lab results, imaging reports, pathology, and treatment history. This process is overwhelmingly manual. Staff copy and paste from the EHR into payer-specific portal forms or compile documents for fax transmission. Only **32% of medical attachments were transmitted electronically** in 2023 (CAQH 2024 Index). Average processing time per PA ranges from **10 minutes for fully electronic submissions to 24 minutes for manual ones** (CAQH 2024 Index), with behavioral health and specialty providers averaging **25 minutes per request**.

### Submission

Submission channels remain remarkably fragmented. In 2023, only **35% of medical PA transactions were fully electronic** via the X12 278 standard, while **37% were fully manual** through phone, fax, mail, or email (CAQH 2024 Index). The 2025 CAQH Index (released February 2026, covering 2024 data) showed encouraging progress: manual PA volume dropped **37%**, portal volume increased **20%**, and electronic volume grew **6%**. Still, the majority of PAs require staff to re-key patient demographics, diagnosis codes, procedure codes, and clinical justification from the EHR into payer-specific interfaces.

### Adjudication

Payer processing varies dramatically by service type. Simple pharmacy PAs can be auto-adjudicated in near real-time through NCPDP SCRIPT electronic PA. Medical PAs frequently require clinical review by nurses or medical directors against criteria sets such as InterQual or MCG guidelines. When initial review trends toward denial, a peer-to-peer review may be triggered; **65% of physicians** report participating in P2P calls that disrupt their clinical schedules (AMA 2024 Survey). Under CMS-0057-F, effective January 1, 2026, impacted payers must now render standard decisions within **7 calendar days** and expedited decisions within **72 hours**.

### Decision communication and action

The PA decision must flow back to the provider and into the patient's record. In most workflows, this remains a manual step: staff log into payer portals, retrieve decision status, and manually update the EHR or practice management system. There is no standardized electronic mechanism for payer decisions to auto-populate provider systems outside of FHIR-based workflows that are not yet widely deployed. Each payer updates PA requirements approximately **four times per year per service category** (CAQH), meaning the integration maintenance burden is continuous.

### Pharmacy PA versus medical PA

Pharmacy PA is significantly more mature electronically. Surescripts' CompletEPA network reaches EHRs representing **75% of U.S. physicians**, and CoverMyMeds handles roughly **90% of ePA transactions** with 62% of requests resolved in under two hours. Medical and procedural PA lags considerably: it involves longer documentation requirements, more complex clinical evidence, payer-specific portals, and a higher proportion of manual submission. CMS-0057-F addresses medical PA; a separate proposed rule (CMS-0062-P, published 2026) would extend similar requirements to prescription drugs.

---

## Executive-level pain points carry billion-dollar price tags

For the C-suite, PA is simultaneously a cost center, a compliance obligation, a burnout accelerator, and a patient retention risk. The numbers frame it clearly.

### Administrative cost at scale

At the transaction level, manual PA costs providers **$10.97 to $12.88 per request** versus **$5.79 for fully electronic** (CAQH 2024 Index). On the payer side, manual processing costs **$3.52** per transaction; fully electronic drops to **$0.05**. The industry-wide opportunity cost of not automating is **$515 million per year** in direct transaction savings alone (CAQH 2024 Index). CMS projects **$15 billion in provider savings over 10 years** from the shift to digital PA mandated by CMS-0057-F.

### Labor allocation

Physicians complete an average of **39 PAs per week**, consuming **13 hours of physician and staff time weekly** (AMA 2024 Survey). The average practice dedicates **2.1 FTEs** exclusively to PA management (MGMA 2025 Practice Operations Survey), and **40% of physicians** have hired staff whose sole job is PA. MGMA reports that **PA staffing costs jumped 43% between 2019 and 2024**. For a multi-specialty group with 20 providers, this translates to 6 to 8 staff members navigating payer requirements full-time, representing several hundred thousand dollars in annual labor cost.

### Clinician burnout and attrition

PA is now the single most frequently cited administrative contributor to physician burnout. **89% of physicians** say PA contributes to their burnout (AMA 2024 Survey), and a separate AJMC study found that **64% of physicians** attribute burnout specifically to utilization management burden (AJMC, November 2024). Replacing a single physician costs **$500,000 to $1 million** in recruitment, lost revenue, and onboarding. Health Affairs Scholar estimated that if half of RN time currently spent on PA could be automated and redirected, it would be equivalent to adding **100,000 nurses** to the workforce.

### Patient care delays and treatment abandonment

The clinical toll is severe. **82% of physicians** report patients commonly abandon treatment due to PA (AMA 2024 Survey). **29% report PA caused a serious adverse event**, including hospitalization (23%), life-threatening events (18%), and disability or death (8%). Prescription abandonment rates approach **40%** when linked to PA delays, and patients in medically underserved areas abandon prescriptions at rates **14% higher** than those in better-resourced communities (PharmaLive/Develop Health, 2025). Downstream, **42% of physicians** say PA drives patients to emergency departments, the costliest point of care.

### Denial and appeal economics

Medicare Advantage plans processed **53 million PA requests in 2024**, denying **7.7%** (KFF, February 2026). Of those denials, only **11.5%** were appealed, but **80.7% of appeals were overturned**, indicating the original denial was inappropriate. Medicaid managed care denial rates run even higher at **12.5%**, with some MCOs denying over **25%** of requests (OIG, July 2023). The cost implications are stark: each appeal cycle adds **$30 to $50** in direct staff costs, weeks of delay, and the downstream clinical cost of deferred care. A 2022 OIG report found that **13% of Medicare Advantage PA denials met Medicare coverage rules** and should never have been denied.

### Compliance risk under CMS-0057-F

The regulatory clock creates a new category of executive risk. As of January 1, 2026, impacted payers must meet the 72-hour and 7-day decision timeframes, provide specific denial reasons, and report Patient Access API usage metrics to CMS. The first public reporting of PA metrics (approval rates, denial rates, processing times, appeal overturn rates) was due by **March 31, 2026**. Enforcement pathways include corrective action plans and civil monetary penalties for MA organizations, contract enforcement for Medicaid managed care, and potential decertification for QHP issuers. The public reporting requirement creates a separate reputational exposure: plans with high denial rates or slow turnaround times will face competitive disadvantage.

---

## Data integration failures are the root cause, not a side effect

The PA process does not fail primarily because of bad policy or insufficient staffing. It fails because the data required for automated, accurate adjudication cannot flow between systems without extensive manual translation. Four categories of data integration failure compound to make automation nearly impossible at scale.

### Semantic fragmentation across coding systems

U.S. healthcare operates on overlapping coding vocabularies that were never designed to interoperate. SNOMED CT contains over 350,000 clinical concepts and is required for EHR problem lists. ICD-10-CM provides roughly 72,000 diagnosis codes required for billing. CPT encodes procedures. LOINC covers laboratory observations. Each EHR vendor also maintains proprietary interface terminologies with backend mappings to these standards. A simulation study of 23 clinicians entering ICD-10 codes across two EHR platforms found that **only 50% of codes entered were appropriate**, with approximately **25% omitted entirely** (AMIA 2018, PMC5977598). JAMIA research found ICD coding variability across time and location so significant that "ICD codes in EHRs are insufficient to establish a semantically reliable cohort or phenotype" (JAMIA 2024, PMC11528819). This fragmentation directly impedes auto-adjudication: payer clinical criteria are typically expressed in one code system, while provider documentation arrives in another, with no reliable crosswalk between them.

### Identity matching breaks the chain

Patient identity discrepancies between provider and payer systems undermine PA routing before clinical content is even evaluated. Pew Charitable Trusts reported that healthcare facilities fail to link records for the same patient **as often as half the time** when exchanging data across organizations (Pew, October 2018). Duplicate record rates average **8 to 12%** within a single organization and reach **15 to 16%** in large systems (RAND Corporation; AHIMA). The financial impact is significant: **33% of all denied claims** result from inaccurate patient identification (Healthcare IT News), costing the average hospital **$1.5 million annually**. For PA specifically, identity mismatches cause requests to be misrouted, duplicated, or lost entirely. As Firely noted in March 2026, provider access and payer-to-payer exchange "live or die on identity accuracy. If you can't reliably match members and providers across enrollment, claims, care management, and external sources, no amount of FHIR conformance will save you."

### The structured data gap blocks automation

Approximately **80% of clinical data in EHRs is unstructured**: free-text notes, PDFs, scanned documents, and images. A 2025 JMIR study analyzing 1.8 million patient records found that **only 13% of extracted clinical concepts had structured counterparts** (JMIR 2025;27:e66910). PA documentation routinely requires months of patient records including clinical notes, diagnostic results, and evidence of prior treatment failure, most of which lives outside discrete coded fields. Premier Inc.'s 2024 survey found that **10.4% of claims denied were pre-approved via PA**, with insurers citing "missing progress notes, inconsistent dates, or incomplete treatment records" as leading denial reasons. Until unstructured clinical evidence can be reliably extracted, normalized, and matched to payer criteria, the documentation assembly step will remain a manual bottleneck.

### The N-by-M integration problem

Each payer maintains unique PA rules that differ not only between payers but between plans within the same payer organization. These rules change frequently and without standardization. A provider accepting 15 to 20 insurance plans faces a matrix of payer-specific documentation requirements, coding expectations, and submission formats that multiplies integration complexity. The Da Vinci Coverage Requirements Discovery (CRD) implementation guide explicitly acknowledges this problem, noting that CRD servers must handle clinical terminologies that "might not contain billing terminologies" and must perform mapping between clinical and billing code systems (HL7 Da Vinci CRD IG v2.1.0). Without a semantic normalization layer, every new payer connection requires custom integration work, and the maintenance burden grows at a rate approaching N times M.

### FHIR APIs without data quality deliver bad answers faster

CMS-0057-F mandates FHIR-based PA APIs by January 2027, but the regulation addresses the transport layer, not the data quality layer. Multiple industry analysts have flagged this gap. Firely wrote in March 2026 that "FHIR APIs expose data; they don't fix it," warning that organizations can be "FHIR-ready and still fail in production." CareEvolution observed that "converting poor quality data simply results in poor quality FHIR data" (CareEvolution, July 2025). SPsoft documented a concrete example: a legacy system recording "Body Part = Left Arm" and "Problem = Fracture" in two separate fields. Without semantic enrichment, a FHIR mapping creates two unlinked codes rather than the correct single SNOMED CT concept (Fracture of left arm, SCTID: 125603006), losing clinical precision. The WEDI February 2026 survey found that **25% of payers estimate compliance costs exceeding $5 million**, and data quality challenges surface late in implementation, typically in months five through nine, when "identity mismatches, consent ambiguities, and terminology gaps" emerge during integration testing.

---

## Executives are buying solutions but many investments fail at the data layer

### What payers are investing in

Health plan executives are deploying capital across several categories. AI-assisted auto-adjudication platforms include Availity's AuthAI (automating up to 80% of utilization management workload), Cohere Health ($106 million raised; acquired ZignaAI in September 2025 to enter payment integrity), and Basys.ai (backed by Eli Lilly and Mayo Clinic, claiming 90% PA automation). Gold-carding programs are expanding: UnitedHealthcare's national gold card program saw a **40% increase in qualifying provider groups in 2025**, and Highmark has gold-carded over **25,000 providers**. For CMS-0057-F compliance, payers are investing in FHIR-native middleware from vendors including Firely, CareEvolution, PilotFish, and InterSystems.

### What providers are investing in

Provider organizations are pursuing EHR-integrated workflows, dedicated staffing models, and third-party automation. Epic's Payer Platform implementation at Ballad Health with Ensemble/UnitedHealthcare achieved **88% touchless accounts**, reduced turnaround from three days to one hour, and drove denial rates below 2% (KLAS 2025 Points of Light). Surescripts launched Touchless Prior Authorization in February 2025, achieving **22-second median approvals** at Cleveland Clinic, UNC Health, and Ohio State University Wexner Medical Center, with **88% fewer appeals** and **68% fewer denials from incomplete information**. CoverMyMeds continues to dominate pharmacy ePA with roughly 90% market share.

### Why PA technology investments fail

Despite significant spending, outcomes disappoint. At the KLAS K2 Summit, **60% of payer attendees and over 75% of provider attendees** reported little to no PA improvement over the past year; some reported it had gotten worse. Five failure patterns recur across the industry.

**Data quality undermines automation.** At one leading health system, 94% of prospective ePA alerts for albuterol inhalers were false positives because benefit data was outdated. Sutter Health's ePA implementation routed only 1.9% of orders through ePA with no improvement in fill rates due to medication misclassification.

**Payer-specific rules require constant maintenance.** Each insurer's PA requirements change frequently and without coordination. Point solutions that hard-code rules for individual payers create brittle integrations.

**Semantic interoperability is absent.** PA automation vendors build to specific EHR platforms and payer interfaces. Without a shared semantic layer, each new connection requires custom mapping work.

**Workflow adoption stalls.** A 2022 provider survey found that ePA users saw faster decisions but no reduction in total time spent on PA tasks, because the surrounding data preparation and documentation steps remained manual.

**Vendor overexpansion without integration focus.** Olive AI, once valued at $4 billion with $902 million raised, shut down in October 2023 after expanding into PA, population health, and surgery analytics without delivering on core promises. The CEO attributed the failure to "fast-paced growth and lack of focus" (Becker's Hospital Review, 2023).

### How executives evaluate PA technology

Buying decisions for PA technology are cross-functional. On the payer side, ownership spans IT, operations, compliance, and provider relations; Black Book Research noted that "API-first prior authorization and FHIR interoperability are now production requirements" (2026). On the provider side, revenue cycle leadership typically holds the budget, with input from IT and clinical operations. FinThrive's 2024 RCM Transformative Trends Report identified electronic PA as a "top investment" priority. Key ROI metrics include cost per transaction reduction, turnaround time, denial rate, FTE recovery, and increasingly, Star Rating impact.

---

## Rural and small organizations face the same problems at breaking-point intensity

The PA burden does not scale down gracefully with organization size. A two-provider rural practice absorbs the same payer PA requirements as a 200-physician group but without dedicated staff, modern IT systems, or negotiating leverage. MGMA specifically identified the PA burden as "especially problematic for independent practices, particularly in rural and underserved areas."

### The amplification effect

The nation's **1,381 critical access hospitals** (Flex Monitoring Team, January 2026) and over **1,500 FQHCs operating at 17,000+ locations** (NACHC 2024/2025) face unique constraints. CAHs typically employ **0.5 to 2 FTE IT staff**, often shared with other administrative roles. **27% of CAHs** cite lack of IT personnel as a significant challenge (ONC), and **only 48% of rural hospitals** participate in all four domains of EHR interoperability versus 62% of all hospitals nationally (ONC 2021). Budget room is nearly nonexistent: **46% of rural hospitals operate with negative margins** (Chartis 2024), and in non-Medicaid-expansion states, that figure rises to **52.2%**.

### Geographic isolation compounds delay

PA delays in rural settings carry compounded consequences. When a specialist appointment delayed by PA must be rescheduled, a rural patient may face another 100-mile round trip. The AAFP has documented that PA criteria "can worsen health disparities and create barriers to care for medically underserved patients, patients in rural areas, and those at risk for poor health outcomes." Rural pharmacy access adds another dimension: between 2018 and 2023, rural retail pharmacies declined **5.9%** (RUPRI), leaving **138 counties with no retail pharmacy** and at least **2.4 million rural residents** without adequate pharmacy access. PA denials requiring medication switches hit these patients hardest.

### The technology gap creates a compliance cliff

CMS-0057-F's MIPS Promoting Interoperability measure will require eligible hospitals and CAHs to attest to using the Prior Authorization API for at least one request starting in the CY 2027 reporting period. This requires EHR systems capable of connecting to payer FHIR APIs, a capability that many rural systems lack. **11 to 17% of CAHs** do not have adequate broadband speeds for current electronic clinical functions, let alone real-time FHIR API transactions. Cloud-based, low-IT-footprint solutions that bridge API, portal, and fax workflows are the only realistic path for these organizations. The per-transaction cost differential is compelling even for tight budgets: electronic PA costs **$1.88 per transaction versus $10.92 for manual** (CAQH), an 83% reduction.

---

## Where semantic data preparation creates the highest leverage

Given the data integration failures diagnosed above, MTN's core capabilities (automatic schema mapping to a shared semantic layer, cross-code-system normalization at approximately 99% accuracy and approximately $3.30 per field mapping, and integration timelines compressed from months to minutes) align with four high-leverage intervention points in the PA workflow.

### Pre-submission normalization eliminates the top cause of denials

Incomplete or inconsistently coded documentation is the leading driver of PA denials. **68% of providers** identify inaccurate or incomplete patient data at intake as a primary driver of denials (Aptarro). Semantic data preparation that normalizes SNOMED, ICD-10, CPT, and LOINC codes across source systems before submission could ensure that clinical evidence matches the terminology payer adjudication engines expect. This directly attacks the problem that killed Sutter Health's ePA implementation (medication misclassification) and the false-positive alert problem documented at other health systems.

### Payer auto-adjudication depends on clean, normalized input

On the payer side, auto-adjudication engines evaluate PA requests against clinical criteria. When incoming data arrives in inconsistent coding formats, or when a single clinical concept is split across fields without semantic linkage (as in the fracture-of-left-arm example documented by SPsoft), auto-adjudication fails and the request falls to manual clinical review. A semantic preparation layer that normalizes incoming provider data to the payer's criteria vocabulary could meaningfully increase auto-adjudication rates. Even modest improvements matter at scale: across 53 million MA PA requests annually, each percentage point of increased auto-adjudication eliminates hundreds of thousands of manual reviews.

### Solving the N-by-M problem with a shared semantic layer

The most structurally significant value proposition is reducing the N-by-M integration burden. Today, each provider-payer connection requires custom mapping between the provider's coding schema and the payer's documentation requirements. With 15 to 20 payers per provider and thousands of providers per payer, the integration matrix is enormous. A concept-based semantic layer that maps diverse source schemas to a shared ontology converts this from an N-times-M problem (where each connection requires unique work) to an N-plus-M problem (where each source or destination is mapped once to the shared layer). At MTN's reported cost of approximately **$3.30 per field mapping** with roughly constant maintenance cost as connections grow, the economics shift dramatically compared to the quadratic cost growth of manual, pairwise mapping.

### CMS-0057-F compliance requires the data layer MTN provides

The January 2027 FHIR API deadline creates urgent demand for exactly this capability. WEDI data shows that data quality issues surface in months five through nine of implementation. Organizations that have built FHIR APIs but not addressed underlying semantic normalization will discover in production that "providers get inconsistent data, prior authorization decisions don't align with policies, and compliance reports can't be generated without heroic manual work" (Firely, March 2026). MTN's technology addresses the layer between legacy systems and FHIR APIs that the regulation does not specify but that operational success requires.

### The quantifiable business case

An executive-ready business case for semantic data preparation in PA can be constructed from publicly available benchmarks. For a mid-size health plan processing 500,000 PAs annually: converting even 10% of manual clinical reviews to auto-adjudication (by improving incoming data quality) saves approximately **50,000 reviews at $3.52 each**, or **$176,000 per year** in direct adjudication costs alone, plus staff redeployment value. For a 200-provider health system: reducing documentation assembly time by 30% through pre-normalized data saves approximately **4 minutes per PA across 200,000 annual requests**, equivalent to roughly **7 FTEs at $60,000 each**, or **$420,000 annually**. Compliance cost avoidance from avoiding CMS enforcement actions, reputational damage from public reporting, or Star Rating degradation adds further value that is harder to quantify but potentially larger.

---

## Strategic implications for MTN

The following seven insights synthesize the research findings into actionable guidance for Mountain Biometrics' product positioning, sales messaging, and partnership strategy.

- **Position as the "data quality layer for CMS-0057-F compliance," not a PA workflow tool.** The January 2027 deadline creates time-bounded urgency, and the market gap is clear: payers and providers are building FHIR APIs but not solving the underlying semantic normalization problem. MTN should frame its value as the critical infrastructure that makes PA APIs actually work in production, citing Firely's warning that "FHIR APIs expose data; they don't fix it." The target buyer is the CTO, CISO, or VP of Interoperability leading CMS-0057-F implementation, not the PA operations manager.

- **Lead with the N-by-M cost curve in payer sales conversations.** Health plan executives managing hundreds or thousands of provider connections will immediately understand the economics of quadratic versus linear integration cost growth. MTN's roughly constant maintenance cost as connections scale is a board-level differentiator. Frame the pitch around total cost of integration over three years, not per-transaction savings.

- **Target Medicare Advantage plans facing public reporting pressure first.** The March 2026 public reporting requirement means PA denial rates, turnaround times, and appeal overturn rates are now visible to members, regulators, and competitors. Plans with denial rates above industry average (UnitedHealthcare at 12.8%, Centene at 12.3%, Aetna at 11.9% per KFF 2026) have the strongest immediate incentive to improve auto-adjudication rates through better incoming data quality. MTN's sales messaging should connect semantic normalization directly to reportable metric improvement.

- **Build a "rural-ready" deployment model to access FQHC and CAH markets.** The 1,381 CAHs and 1,500+ FQHCs represent an underserved segment with acute need and almost no internal IT capacity. A cloud-based, low-touch deployment requiring zero on-site IT staff aligns with MTN's technology profile (minutes-per-source integration). Partnership with rural-focused EHR vendors (Azalea Health, Elation Health) or with HRSA-funded technical assistance programs could provide distribution at scale. The ROI story is simple: an 83% reduction in per-transaction cost from manual to electronic PA, enabled by semantic normalization that makes electronic submission possible with older EHR systems.

- **Partner with Da Vinci Implementation Guide vendors, not compete with them.** Firely, CareEvolution, InterSystems, and PilotFish are building the FHIR transport layer. They need a data quality layer underneath. MTN should position as a complementary partner that solves the terminology gaps, identity mismatches, and schema inconsistencies these vendors encounter in months five through nine of implementation. A joint go-to-market with one or two of these vendors would accelerate credibility and pipeline.

- **Develop a "PA readiness score" diagnostic product.** Given that 33% of providers and 10% of payers have not started CMS-0057-F implementation (WEDI, February 2026), a low-cost assessment tool that quantifies an organization's semantic data quality gaps (code consistency, identity match rates, structured data coverage) would serve as both a lead generation instrument and a proof of value. Frame it as a compliance risk assessment that produces a board-ready report.

- **Anchor sales messaging in clinician burnout and patient outcomes, not just operational efficiency.** The AMA data showing 89% of physicians attribute burnout to PA and 29% report serious adverse patient events creates emotional urgency that operational cost metrics alone do not. MTN's technology is several layers removed from the bedside, but the causal chain is direct: better data preparation leads to fewer incomplete submissions, which leads to fewer denials and faster approvals, which leads to less rework, less physician frustration, and faster patient access to care. Frame the narrative around the 100,000-nurse-equivalent workforce recovery that PA automation could unlock, and position MTN as the foundation that makes that automation reliable.
