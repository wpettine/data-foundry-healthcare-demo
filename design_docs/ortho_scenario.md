## The Total Knee Arthroplasty Prior Authorization Scenario: A $15,000–$30,000 Decision Built on a Longitudinal Paper Trail

### Setting the stage

A 67-year-old female patient presents to a PE-backed orthopedic group with a 14-month history of progressively worsening right knee pain. She has been seen three times in the past year: once by her primary care physician, once by a physical therapist at a separate outpatient PT clinic, and twice by the orthopedic surgeon who is now recommending a total knee arthroplasty. She has tried ibuprofen, a corticosteroid injection administered at her PCP's office, and eight weeks of formal physical therapy. Her imaging shows grade 3 Kellgren-Lawrence osteoarthritis on weight-bearing X-rays. The surgeon has determined she is a surgical candidate.

The facility revenue for a primary total knee arthroplasty (CPT 27447) ranges from $15,000 to $30,000 depending on setting and payer. The national average initial denial rate reached 11.8% across healthcare in 2024, with orthopedic ASC cases routinely seeing 14 to 22% denial rates due to prior authorization complexity, implant bundling rules, and global period violations. Her coverage is a Medicare Advantage plan through a regional carrier.

The PA request must now be submitted. What follows is a complete map of that process, the data it requires, and where it breaks.

---

### The governing coverage framework

Before assembling documentation, the PA specialist must understand the specific criteria the payer will apply. The framework is more fragmented than LVAD coverage, because unlike the nationally uniform NCD 20.9.1, joint arthroplasty coverage is governed by a patchwork of Local Coverage Determinations that vary by Medicare Administrative Contractor region.

LCD L33618 requires that the documentation demonstrate a history of a reasonable attempt at conservative therapy, usually three months or more, as appropriate for the patient in their current episode of care. CMS requires documentation of a history of a reasonable attempt at conservative therapy including a documented trial of NSAIDs or contraindication to such therapy, documented supervised physical therapy, and diminished activities of daily living due to pain or disability despite non-surgical medical management.

Medical necessity accounted for 92.8% of improper payments for major hip and knee joint replacement during the 2024 reporting period, while insufficient documentation accounted for 4.5%, no documentation 1.8%, and incorrect coding 0.9%. That 92.8% medical necessity figure is particularly telling: it means nearly all improper payments in this category are attributable to failures in proving the patient met the criteria, not to errors in coding or billing mechanics.

The improper payment rate for major hip and knee replacements or reattachment of lower extremity is 43.6%, with a projected improper payment amount of $546.7 million, making it the highest projected improper payment category of all Medicare Part A service types.

---

### The data types and sources required for total knee arthroplasty PA

#### 1. Conservative treatment history: the central documentation burden

**Data type:** Clinical encounter notes; physical therapy session records; pharmacy records; injection procedure notes

**Sources:** PCP EHR (often a different system than the orthopedic group's EHR); outpatient physical therapy clinic records (frequently a standalone PT-specific EMR such as WebPT or Clinicient, not integrated with either the PCP or orthopedic EHR); orthopedic surgeon's own visit notes; pharmacy dispensing records for NSAIDs; hospital or urgent care records if steroid injection was administered outside the surgeon's office

**What the payer needs to confirm:**

- Specific NSAID trial: drug name, dose, duration, and documented response or intolerance
- Documented supervised physical therapy: modalities used, session frequency, total duration, and documented functional outcome scores before and after
- Corticosteroid or hyaluronic acid injection: date, agent, site (must match the surgical site), and documented response
- Explicit documentation that conservative measures failed: a statement by the treating provider that the patient's pain and functional limitation persisted despite the above

Surgeries represent 99% of denials in total joint arthroplasty, and denials occur because nonoperative treatment had not been tried in 71% of cases or had not been attempted for enough time in 67% of cases. Payers require date-specific, dosage-specific evidence of failed nonoperative therapy mapped to their own coverage policy criteria, not generic clinical notes.

**The problem:** The conservative treatment history is distributed across at minimum three organizations, each running a different EHR or EMR system. The PCP documents the NSAID prescription in their system under one patient identifier. The PT clinic documents sessions in WebPT under a separate patient identifier, with session notes that use PT-specific functional outcome terminology (LEFS score, KOOS score, VAS pain scale) that do not appear in a discrete field accessible to the orthopedic group. The injection administered at the PCP office appears in the PCP's system, not the orthopedic surgeon's. The pharmacy dispenses the NSAID and records it under yet another identifier.

The orthopedic PA specialist must manually contact the PCP office to request records, request PT records separately from the PT clinic, confirm the injection was documented and at the correct anatomic site, and synthesize all of this into a coherent timeline that maps precisely to the payer's step therapy language. If the payer requires "three months of supervised physical therapy" and the records show eight weeks of attendance with two missed appointments, the specialist must decide whether to submit and risk denial or call the PT clinic to obtain a supplemental attendance record.

#### 2. Radiographic imaging documentation

**Data type:** Plain film X-rays (primary); MRI reports (sometimes required for complex cases or younger patients); structured radiology reports plus DICOM image availability

**Sources:** Orthopedic group's own imaging if they have in-house X-ray (most do); independent radiology group if films were taken elsewhere; hospital radiology department for prior studies; PACS system for image retrieval

**What the payer needs:**

- Weight-bearing X-rays of the affected knee in multiple views (AP, lateral, and ideally merchant/sunrise for patellofemoral assessment)
- Radiology interpretation documenting the degree of joint space narrowing, using the Kellgren-Lawrence grading scale (Grade 3 or 4 typically required for PA approval)
- Date of imaging: payers require a copy of the radiologist's report for diagnostic imaging performed within the past 12 months and read by an independent radiologist when submitting requests for treatment related to osteoarthritis or degenerative joint disease.
- Correlation between imaging findings and clinical symptoms: the radiologist's report must describe findings in both knees if bilateral disease exists, to confirm the correct surgical side

UnitedHealthcare requires a complete diagnostic interpretation of imaging findings including at minimum the specialty of the provider who interpreted the images, and may require the specific diagnostic images showing the abnormality for which surgery is being requested.

**The problem:** The Kellgren-Lawrence grading scale is a radiographic classification system, but it is not a discrete coded field in any standard radiology reporting template. A radiologist may document "severe tricompartmental osteoarthritis with significant joint space narrowing" without ever using the words "Kellgren-Lawrence Grade 3" or specifying numeric criteria. The payer's auto-adjudication engine, if it is keyword-matching for "Grade 3" or "Grade 4," will not find it and will either pend or deny the request. This is a direct semantic mismatch: the radiologist and the orthopedic surgeon understand "severe tricompartmental osteoarthritis" to be equivalent to KL Grade 3 or 4, but the payer's system does not.

An example was documented in an AAHKS comment letter: a patient's history, failed conservative measures, physical exam, and radiographs all showed matching need for replacement, but the plan denied authorization because imaging did not show "at least moderate joint space narrowing" in the specific language the plan used. The denial was overturned after the surgeon spent time on a peer-to-peer call, but this suggests the plan had a coverage criterion intended to deny authorization for a single reason without consideration of all clinical factors.

#### 3. Functional status and patient-reported outcomes

**Data type:** Standardized outcome instruments; physical examination findings; activities of daily living documentation

**Sources:** Orthopedic surgeon clinic notes; physical therapy records; PCP visit notes

**Key data elements:**

- Knee Injury and Osteoarthritis Outcome Score (KOOS) or KOOS-JR: captures pain, symptoms, functional limitation in ADLs, sport/recreation function, and quality of life as patient-reported numeric scores
- Western Ontario and McMaster Universities Osteoarthritis Index (WOMAC): pain, stiffness, and physical function subscores
- Lower Extremity Functional Scale (LEFS): captures functional limitation across 20 activities
- Visual Analog Scale (VAS) or Numeric Rating Scale (NRS) for pain: used by both PT and ortho
- Physical examination findings: range of motion measurements (degrees of flexion, extension deficit), gait observation, quadriceps strength assessment, varus/valgus deformity measurement, crepitus documentation

**The problem:** Most commercial and MA payers require documentation that the patient has "functional disability" or "significant limitation in activities of daily living" as a prerequisite for surgical authorization. This is a subjective clinical determination that clinicians express in narrative prose ("patient is unable to climb stairs without severe pain," "patient reports inability to perform grocery shopping"). Payers want to see it; auto-adjudication engines cannot reliably extract it from free text.

Where structured outcome scores exist, they live in the PT clinic's EMR in a completely separate data environment from the orthopedic surgeon's EHR. A KOOS score documented at the PT clinic after eight weeks of therapy, showing persistent severe limitation, is exactly the evidence that would support the PA. But the orthopedic surgeon's office typically has no access to it unless they explicitly request it. Payers do not distinguish between "the score was never captured" and "the score was captured but not transmitted." Both result in a documentation gap that triggers review or denial.

#### 4. Comorbidity documentation

**Data type:** Problem list entries; laboratory values; consultation notes; medication lists

**Sources:** PCP EHR; specialist records (endocrinology for diabetes, cardiology for cardiac risk, nephrology for CKD); hospital records for prior surgeries; orthopedic surgeon preoperative assessment notes

**Key comorbidities that affect PA decisions:**

- Obesity (BMI documentation): many payers require BMI to be documented and may impose weight thresholds or require documented weight loss attempts before approving joint replacement
- Uncontrolled diabetes (HbA1c): payers may require HbA1c below a threshold (often 8.0 or 9.0) before authorizing elective surgery
- Active smoking status: some payers require documented smoking cessation counseling or cessation before approving elective orthopedic procedures
- Anticoagulation status: relevant for perioperative risk planning; documentation of warfarin, DOAC, or antiplatelet therapy
- Prior ipsilateral knee surgery: must be documented to distinguish primary from revision arthroplasty, which carries different CPT codes and different coverage criteria
- Knee injection history at the surgical site: relevant to infection risk documentation and timing of surgery

**The problem:** The patient's BMI and HbA1c live in the PCP's EHR, not the orthopedic group's system. If the patient's HbA1c was last measured six months ago at 8.4% and the orthopedic group does not have access to that record, they may submit the PA without it. The payer may then either deny for uncontrolled diabetes or pend the request for additional documentation, adding days to the authorization timeline. Smoking status may be documented as "current smoker" in one system and "history of tobacco use, quit date unknown" in another, creating apparent contradictions that trigger manual review.

#### 5. Laterality and surgical site specificity

**Data type:** Discrete coded fields and narrative documentation across all submitted records

**Sources:** Every document in the PA submission package

**What must be consistent:**

- ICD-10-CM code laterality (M17.11 for primary osteoarthritis, right knee vs. M17.12 for left knee vs. M17.9 for unspecified)
- CPT code selection (27447 for total knee arthroplasty, bilateral would be 27447-50 or two separate claims)
- Radiograph interpretation: must specify the correct knee
- Physical examination findings: must document the correct knee
- Conservative treatment history: injection records must specify the correct site
- Surgical scheduling: OR booking must match the authorized side

Submitting M17.9 (knee osteoarthritis, unspecified) instead of M17.11 (primary osteoarthritis, right knee) triggers immediate medical necessity review or outright rejection across Medicare Advantage and commercial payers. Laterality errors caught post-denial cost 3 to 5 times more in staff time than laterality accuracy enforced at submission.

**The problem:** When records come from multiple sources—the PCP documents "bilateral knee pain, right greater than left," the PT clinic documents "right knee pain and stiffness," the radiologist reads bilateral films but the report leads with bilateral findings before specifying the right knee as more severe—the PA submission may contain documents where laterality is implicit rather than explicit. An auto-adjudication engine applying keyword rules for "right knee" may pass some documents and fail others, creating an inconsistency that flags the request for manual review.

#### 6. The implant: a separate authorization category

**Data type:** Device specifications, implant cost documentation, payer-specific implant coverage policies

**Sources:** Orthopedic group's implant vendor agreements; payer formulary and implant coverage policies

**What payers require separately:**

For many commercial payers and some MA plans, the implant itself requires authorization distinct from the surgical procedure. Payer implant formularies specify which manufacturers and product lines are preferred or covered. A surgeon who prefers a specific implant design (such as a patient-specific implant, a cementless fixation system, or a robotically assisted component) may face a separate coverage challenge if the implant is not on the payer's preferred list.

Because requirements differ across payers, it is vital to track and comply with guidelines including prior authorization, documentation standards, and reimbursement for assistants. One payer may cover an assistant surgeon for a spinal fusion with modifier 80, while another requires documentation proving medical necessity for the assistant. The same logic applies to implants: what one payer covers as a standard implant, another considers premium and requires additional justification.

**The problem:** Implant formulary data lives in the payer's plan documents, which are updated periodically and not standardized across payers. An orthopedic group with contracts across 15 to 20 payers must maintain current knowledge of which implant systems are covered by which payers. This is manually maintained institutional knowledge, not a machine-readable data feed.

#### 7. Site of service authorization: inpatient versus outpatient ASC

**Data type:** Clinical criteria for site-of-service determination; patient comorbidity documentation

**Sources:** Surgeon clinical assessment; anesthesia preoperative evaluation; payer site-of-service coverage policies

**What must be justified:**

CMS removed total knee arthroplasty from the Medicare Inpatient-Only list, allowing it to be performed in hospital outpatient and ASC settings. However, a patient with significant comorbidities may need an inpatient stay. If the surgeon schedules the patient as inpatient, the PA must justify that decision against the payer's criteria for inpatient medical necessity.

For elective total knee replacement to be approved as inpatient, the patient must meet specific criteria including coexisting neurologic conditions such as multiple sclerosis, hemiparesis, or severe Parkinson's disease that would likely seriously affect ambulation. If the patient does not meet inpatient criteria but is scheduled inpatient, the payer may authorize only at the outpatient rate, leaving the hospital absorbing the difference.

**The problem:** The site-of-service decision is made by the surgeon based on a clinical judgment about risk, often communicated verbally to the scheduling coordinator, without explicit documentation in the chart. If the PA is submitted for inpatient surgery without documentation of the specific comorbidities that justify inpatient status, the payer will auto-downgrade to outpatient authorization, creating a surprise financial exposure that is discovered only when the claim is filed.

---

### The major sources of medical knowledge governing TKA PA decisions

**CMS LCD L33618** (Major Joint Replacement, Hip and Knee) is the primary Medicare coverage determination covering medical necessity criteria for total hip and knee replacement. Unlike the LVAD's single national NCD, joint arthroplasty is governed by this LCD and its companion billing and coding article L36007, with regional variation across MAC jurisdictions.

**AAOS Clinical Practice Guidelines** for the management of osteoarthritis of the knee are the foundational evidence basis cited by payers in their coverage policies. The 2021 update strengthened evidence for exercise, weight loss, and NSAIDs as first-line treatments before surgery, which payers use to justify step therapy requirements.

**Kellgren-Lawrence Grading System** is the radiographic classification schema for osteoarthritis severity, with grades 0 through 4, that most payers embed in their coverage criteria as a minimum threshold for surgical authorization. Grade 3 (marked joint space narrowing, some osteophytes, and possible mild bony deformity) is typically the minimum threshold, though payer policies vary.

**InterQual and MCG clinical decision support criteria** are the proprietary guideline products used by most commercial payers and many MA plans to adjudicate TKA medical necessity. Their criteria may differ from the LCD in specific ways: different minimum durations of conservative therapy, different BMI handling, different functional score thresholds. These criteria are updated by the vendors independently of CMS and are not publicly disclosed.

**AAHKS clinical evidence and advocacy research** plays an important role in shaping understanding of PA's clinical and administrative impact. An AAHKS study found that current criteria found in prior authorization policies for TKA and THA are unsubstantiated, and that insurance companies implementing prior authorization criteria should be held to a standard in which recommendations are grounded in evidence-based medicine, which is currently not the case.

**UpToDate** (Wolters Kluwer) is the standard clinical decision support reference cited in most payer medical policies, including the Premera knee arthroplasty policy last updated August 2025. Payer medical directors cite UpToDate review articles as supporting documentation for their coverage criteria.

---

### The PA difficulties and roadblocks: where and why it breaks

#### Roadblock 1: The multi-site conservative treatment documentation problem

This is the dominant source of TKA PA denials, and it is entirely a data infrastructure problem rather than a clinical one. On a survey of 2,802 AAHKS members, 95% of surgeons noted a five-year increase in prior authorization, 71% of practices employ at least one staff member exclusively for prior authorization work, and average time spent on prior authorization was 15 hours per week. Surgeries were denied because nonoperative treatment had not been tried in 71% of cases or had not been attempted for enough time in 67% of cases.

That 71% figure is the key data point. It does not mean patients did not receive conservative treatment. It means the documentation of that treatment, scattered across multiple care settings and EHR systems, could not be assembled into a form the payer could verify. The treatment happened; the data did not travel with the patient.

A PE-backed orthopedic group with 20 locations across three states may have 3,000 to 5,000 TKA cases annually. At a 10% denial rate, that is 300 to 500 cases per year requiring appeals, peer-to-peer calls, and resubmission. At one high-volume institution, from 509 TKA patients with initial denials, peer-to-peer calls were requested for 55 and only 26 were upheld after the full PA process. The mean time to denial in the TKA group was 63.4 days. Every one of those 63-day denial cycles represents a delayed surgery, a patient in pain, and a revenue stream held in limbo.

#### Roadblock 2: The semantic mismatch between clinical documentation and payer criteria

Payers express their coverage criteria in policy language that uses specific terms: "Kellgren-Lawrence Grade 3 or greater," "minimum three months of conservative therapy," "documented functional disability interfering with ADLs," "BMI less than 40 at time of surgery." Clinical documentation uses clinical language: "severe tricompartmental osteoarthritis," "patient has completed a course of physical therapy with inadequate improvement," "significant functional limitation affecting daily activities." These describe the same clinical reality but are semantically non-equivalent from a machine-matching perspective.

Payers require date-specific, dosage-specific evidence of failed nonoperative therapy mapped to their own coverage policy criteria, not generic clinical notes. A note that says "patient tried physical therapy without benefit" does not satisfy criteria that requires "documented supervised physical therapy of at least three months duration with documented functional outcome scores." The information may exist in the PT clinic's records, but it is not in the right format, from the right source, or using the right terminology to satisfy the payer's specific language.

This is where the N-by-M problem becomes fully visible in orthopedics. A 20-location orthopedic group contracting with 15 payers faces 300 distinct combinations of documentation requirements, each with its own terminology, its own thresholds, and its own update schedule. Staff who handle PA learn payer-specific patterns through experience and institutional memory, not through any systematic semantic mapping.

#### Roadblock 3: ICD-10 specificity failures cascade through the entire submission

Submitting M17.9 (knee osteoarthritis, unspecified) instead of M17.11 (primary osteoarthritis, right knee) triggers immediate medical necessity review or outright rejection. Laterality errors caught post-denial cost 3 to 5 times more in staff time than laterality accuracy enforced at submission.

This is a semantic normalization failure at the coding level. The physician documents "osteoarthritis of the right knee" in the clinical note. The coder translates this to ICD-10. If the coder selects M17.9 (unspecified) rather than M17.11 (right knee, primary), the claim fails payer automated edits. If the radiologist's report specifies bilateral findings without explicitly stating which side is worse, the coder may default to the bilateral or unspecified code. If the conservative treatment records from the PT clinic document "right knee" throughout but the PCP records say "knee pain" without laterality, the overall submission contains inconsistent laterality signals.

The downstream cost is significant. The most common reason for denial in TKA was not specified by the payer in 46.1% of cases, which typically means automated rejections where the payer's system flagged a criteria failure without generating a detailed explanation, forcing the provider's staff to diagnose what went wrong.

#### Roadblock 4: Payer-specific criteria divergence from the LCD

The LCD establishes minimum Medicare requirements, but commercial payers and MA plans layer proprietary criteria on top. These additions are not publicly disclosed in a standardized format and change on payer-specific schedules without mandatory provider notification.

Common payer-specific additions beyond the LCD baseline include BMI thresholds (some plans deny or require a separate weight management consultation if BMI exceeds 40), smoking cessation requirements (some require documented cessation for 30 to 90 days), HbA1c thresholds for diabetic patients, age minimums for certain patient populations, and specific functional score cutoffs using proprietary scoring systems. None of these are in the LCD. All of them must be known, documented, and satisfied for a clean first-pass submission.

A 2024 AAHKS study examining references from payer coverage policies found that current criteria for TKA and THA are unsubstantiated and that insurance companies should be held to a standard in which recommendations are grounded in evidence-based medicine, which is currently not the case.

#### Roadblock 5: The 90-day global surgical package creates ongoing authorization complexity

Once a TKA is performed, a 90-day global surgical period begins. All services related to the procedure during this window are bundled into the global payment and cannot be billed separately without modifiers. This creates a secondary PA and billing challenge when complications occur.

A patient who undergoes a total knee replacement and later requires manipulation under anesthesia during the global period needs modifier 58 (staged or related procedure during postoperative care) to prevent the second procedure from being bundled into the global payment and denied for separate reimbursement.

If the patient develops a wound complication, requires additional imaging, or needs physical therapy at a higher intensity than anticipated, each service must be correctly classified as either within the global bundle (no separate billing) or outside it (requires modifier and sometimes PA). The rules differ by payer, and a group with 15 to 20 payer relationships must maintain payer-specific knowledge of modifier requirements across thousands of active global periods simultaneously.

#### Roadblock 6: Revision arthroplasty documentation is exponentially more complex

When a primary TKA fails and the patient requires revision surgery (CPT 27486 or 27487), the documentation burden escalates considerably. The PA submission must now include documentation of the failure mechanism (aseptic loosening, instability, infection, periprosthetic fracture, component wear), prior operative reports from the original surgery (which may have been performed at a different institution years earlier), current imaging showing the failure mode, laboratory evidence if infection is suspected (ESR, CRP, aspiration results), and often a second orthopedic surgical opinion.

Spine procedures carry the highest prior authorization denial rates of any orthopedic surgical codes, and practices that do not systematically document conservative treatment face denial rates of 15 to 25% on these procedures. Revision arthroplasty approaches similar denial rates because the documentation requirements span multiple care episodes and multiple institutions, often with records that are years old and stored in systems no longer accessible.

---

### Where MTN's semantic data preparation creates value in this scenario

The TKA scenario is in many respects a cleaner MTN value proposition than the LVAD scenario, because the problem is higher-volume, more amenable to standardization, and directly tied to the PE rollup economics that make the buyer motivation clear.

The ICD-10 laterality problem is a classic semantic normalization failure. Clinical documentation uses natural language that implies laterality. A concept-based semantic layer that identifies the clinical concept (osteoarthritis, right knee, primary, tricompartmental) and maps it to the most specific valid ICD-10 code (M17.11) eliminates the downstream coding errors that are currently caught only at the point of denial.

The N-by-M payer criteria problem is where MTN's economics become most compelling for a PE platform buyer. A PE-backed orthopedic group with 20 locations and 15 payer relationships today maintains 300 effectively distinct documentation templates and workflow variants. At MTN's reported cost of approximately $3.30 per field mapping with roughly constant maintenance cost as connections scale, the economics of a shared semantic layer dramatically outperform the cost of maintaining payer-specific institutional knowledge across a growing platform.
