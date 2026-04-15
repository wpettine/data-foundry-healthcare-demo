This is a rich area to build a scenario around because the LVAD PA process touches nearly every data integration failure mode described in the report. Here is the full scenario.

---

## The LVAD Prior Authorization Scenario: A $150,000–$300,000 Decision Made on Fragmented Data

### Setting the stage

A 62-year-old male patient with ischemic cardiomyopathy has been managed at a large academic medical center for three years. His heart failure has progressed despite maximum guideline-directed medical therapy. The advanced heart failure team has evaluated him and determined he is a candidate for a HeartMate 3 LVAD as destination therapy, since he is not a transplant candidate due to moderate chronic kidney disease and diabetes. The procedure will generate approximately $150,000 to $250,000 in total facility revenue for the implant, plus $30,000 to $60,000 annually in outpatient follow-up, device monitoring, and supply reimbursement. The patient's coverage is Medicare Advantage through a large regional plan.

The PA request must now be assembled and submitted. What follows is a complete map of that process.

---

## The governing coverage framework

Before any data can be assembled, the clinical team must understand what the payer will actually require. Under CMS NCD 20.9.1, LVADs are covered if FDA-approved for mechanical circulatory support in heart failure patients who meet all of the following: New York Heart Association Class IV heart failure; left ventricular ejection fraction of 25% or less; and inotrope dependence or a cardiac index below 2.2 L/min/m2 while not on inotropes, plus either optimal medical management for at least 45 of the last 60 days with failure to respond, or advanced heart failure for at least 14 days with dependence on an intra-aortic balloon pump or similar temporary mechanical circulatory support for at least 7 days.

Medicare Advantage plans are required to seek prior authorization to ensure appropriate adherence to their LVAD coverage criteria, especially in light of the December 2020 NCD update, and MA plans must align with the coverage criteria in NCD 20.9.1.

That NCD language sounds straightforward on paper. In practice, proving compliance with each criterion requires data from at least eight distinct clinical systems, expressed in formats that do not naturally align with each other or with the payer's adjudication criteria.

CMS also requires that facilities be credentialed by an approved organization and that all cases be enrolled in the INTERMACS registry, which serves as the required national audited registry for LVAD cases.

---

## The data types and sources required for LVAD PA

### 1. Functional classification data (NYHA Class IV)

**Data type:** Clinician-documented functional assessment, text-based

**Source:** Physician clinic notes, cardiology follow-up notes, and heart failure program notes in the EHR

**The problem:** NYHA functional class is documented as free text by the treating cardiologist, typically embedded within narrative progress notes rather than in a discrete structured field. Most EHR systems do not have a structured NYHA class field that flows reliably into the problem list or a queryable registry. Even where it exists, the documentation is inconsistently worded: one cardiologist writes "NYHA Class IV," another writes "markedly limited functional capacity consistent with Class IV heart failure," and a third uses a local template that populates the field as "FC4." None of these are semantically equivalent in a machine-readable sense, yet all mean the same thing clinically. The PA reviewer at the payer needs to confirm NYHA Class IV. Without semantic normalization, they may require a peer-to-peer call simply to verify a classification the record already contains.

**INTERMACS classification:** Related but distinct is the INTERMACS profile, which stratifies patients from 1 (critical cardiogenic shock) to 7 (advanced NYHA III). INTERMACS Registry data captures patient profiles, device strategy, survival rates, and competing outcomes that provide CMS a better understanding of patients who receive and perform optimally on VADs. INTERMACS profile must be documented for registry enrollment, but it is not a native EHR field in most systems.

---

### 2. Echocardiographic data (LVEF ≤ 25%)

**Data type:** Structured and semi-structured diagnostic report; numeric measurements embedded in text

**Source:** Echocardiography laboratory information system (LIS), often a separate cardiology-specific system (e.g., Philips XCELERA, GE Centricity Cardiology, or Merge Cardio) that feeds a PDF report into the EHR

**Key measurements required:**
- Left ventricular ejection fraction (LVEF), expressed as a percentage
- Left ventricular end-diastolic dimension (LVEDD)
- Left ventricular end-systolic dimension (LVESD)
- Presence of mitral regurgitation and severity grade
- Presence of right ventricular dysfunction (critical for LVAD candidacy, as severe RV failure may contraindicate LVAD)
- Estimated right ventricular systolic pressure (RVSP)
- Diastolic function assessment (E/A ratio, E/e' ratio, deceleration time)

**The problem:** Echo reports are generated in the cardiology lab as structured measurement tables but are typically transmitted to the EHR as a PDF or as narrative text. The numeric LVEF value that would allow auto-adjudication sits inside a PDF attachment, not in a discrete field the payer's system can query. Across different echo platforms and report templates, the same measurement may be labeled "EF," "LVEF," "Ejection Fraction by biplane Simpson's," or "Systolic function (visual estimate)" — semantically the same concept, but machine-unreadable without extraction and normalization. If the most recent echo is six months old, the payer may require a current study, triggering additional scheduling delay.

---

### 3. Hemodynamic data (Cardiac Index, inotrope dependence)

**Data type:** Structured numeric data from right heart catheterization; medication administration records (MAR) for inotrope documentation

**Source:** Catheterization laboratory reporting system; hospital inpatient MAR (pharmacy system); critical care flowsheets

**Key measurements required:**
- Cardiac output (CO) in L/min
- Cardiac index (CI) in L/min/m2, calculated from CO divided by body surface area
- Pulmonary capillary wedge pressure (PCWP), indicating filling pressures
- Pulmonary artery pressures (systolic, diastolic, mean)
- Right atrial pressure
- Systemic vascular resistance (SVR)
- Transpulmonary gradient (TPG) and pulmonary vascular resistance (PVR) — critical for transplant eligibility and LVAD candidacy assessment
- Inotrope name, dose, duration, and response documentation

**The problem:** Right heart catheterization data is documented in yet another system, typically the cath lab reporting software, and flows into the EHR as a procedure note. Cardiac index requires a calculation (CO divided by BSA) that is not always explicitly stated in the note, meaning a reviewer must derive it. More critically, if the patient is on inotropes at the time of catheterization, the raw hemodynamics reflect the drug-supported state, not the native cardiac function. The NCD requires CI below 2.2 *while not on inotropes* as one qualifying criterion, so the timing and medication context of the hemodynamic measurement is essential, and that context is almost never captured in a machine-readable field.

Inotrope dependence documentation comes from the pharmacy MAR, a completely separate system. Proving that the patient has been inotrope-dependent for 14 or more days requires pulling MAR records, confirming the agent (typically dobutamine or milrinone), dose, and continuous administration period, and reconciling this against the clinical timeline in the physician notes. These systems use different patient identifiers, different time formats, and different drug naming conventions (generic vs. brand name, with or without concentration qualifiers).

---

### 4. Medical management history (Optimal Medical Management for 45 of last 60 days)

**Data type:** Medication history records; cardiology clinic notes; pharmacy dispensing records

**Source:** Outpatient EHR medication history module; community pharmacy dispensing records (accessible via Surescripts or state PDMP); cardiology clinic encounter notes

**Key data elements required:**
- Documented beta-blocker therapy (carvedilol or metoprolol succinate), dose, and duration
- Documented ACE inhibitor or ARB or ARNI (sacubitril/valsartan) therapy, dose, and duration
- Documentation of contraindications or intolerances where guideline-directed agents could not be used
- Aldosterone antagonist therapy (spironolactone or eplerenone)
- SGLT2 inhibitor (dapagliflozin or empagliflozin) documentation
- Documentation of dose titration attempts and response

**The problem:** This is the most documentation-intensive requirement and the one most likely to generate a denial. "Optimal medical management for 45 of the last 60 days" sounds like a retrievable fact, but it requires constructing a longitudinal medication timeline across the outpatient and inpatient settings. Medications prescribed in the outpatient EHR may not be visible in the inpatient system, and vice versa. Community pharmacy fill records are a separate data source. If a patient was intolerant of an ACE inhibitor and switched to an ARNI, the clinical rationale must be explicitly documented in a way the payer can find. Medication list data in EHRs routinely contains duplicates, outdated entries, and drugs listed without clear start and stop dates, making the 45-of-60-day requirement nearly impossible to confirm programmatically without manual chart review.

---

### 5. Laboratory data

**Data type:** Discrete numeric results from laboratory information system (LIS)

**Source:** Hospital LIS (Epic Beaker, Cerner PathNet, Sunquest); reference lab results (Quest, LabCorp) that must be reconciled into the EHR

**Key measurements required:**
- Serum creatinine and estimated GFR (eGFR) — to assess renal function and candidacy risk
- Blood urea nitrogen (BUN)
- Hepatic function panel (AST, ALT, total bilirubin, albumin) — hepatic congestion is a prognostic factor
- Coagulation studies (INR, PTT) — anticoagulation management is central to LVAD therapy
- Hemoglobin A1c — diabetes control affects candidacy and outcomes
- Sodium level (hyponatremia is a prognostic marker in advanced heart failure)
- Brain natriuretic peptide (BNP or NT-proBNP) — quantifies heart failure severity and guides monitoring
- Complete blood count — anemia and platelet levels affect LVAD risk

**The problem:** Laboratory data is the most structured data type in clinical care, and yet it introduces a critical semantic problem: LOINC codes for the same test vary by instrument, laboratory, and institution. NT-proBNP and BNP measure related but different molecules, have different reference ranges, and are non-interchangeable without conversion, but payer criteria and clinical decision tools may not distinguish them consistently. eGFR is calculated using formulas (CKD-EPI, MDRD) that are not always disclosed in the result, so a payer's criteria referencing "eGFR < 30" may be compared against a value derived from a different equation. Reference lab results that arrive as HL7 messages may have LOINC codes that do not match the institution's internal code mapping, creating apparent data gaps.

---

### 6. Imaging for surgical planning

**Data type:** DICOM images and structured radiology reports

**Source:** Radiology information system (RIS) and PACS; separate from cardiology imaging systems

**Key studies required:**
- CT chest/abdomen/pelvis with contrast — to assess aorta size and anatomy for cannula sizing, and to screen for comorbidities
- CT of the heart (cardiac gating) — for LV geometry and apex assessment
- Chest X-ray — baseline cardiothoracic ratio
- In some cases, cardiac MRI for LV viability assessment

**The problem:** Radiology reports are generated in the RIS and are largely free-text. The specific anatomic findings relevant to LVAD candidacy (aortic root dimensions, LV apex geometry, presence of prior pericardial adhesions) are embedded in narrative prose and are not extractable by payer systems. DICOM images live in PACS and are essentially inaccessible to payers. The PA submission must include the radiology report as a document attachment, which a human reviewer must read.

---

### 7. Psychosocial and quality-of-life assessments

**Data type:** Survey instruments; social work assessments; patient-reported outcomes

**Source:** Social work notes, psychiatry consultation notes, patient-reported outcome tools (KCCQ, PHQ-9) captured in EHR or separate PRO platforms

**Key assessments required:**
- Kansas City Cardiomyopathy Questionnaire (KCCQ) — quantified quality of life, required for INTERMACS enrollment and expected by some payers
- Psychosocial evaluation — payers and clinical guidelines require evidence that the patient has an adequate support system for home LVAD management (driveline care, device alarms, emergency response)
- Cognitive assessment — to confirm the patient can manage or be supported in managing the device
- Nutritional assessment — malnutrition elevates LVAD risk and affects candidacy

**The problem:** Psychosocial and PRO data is almost entirely unstructured, living in social work notes, psychiatry consultation documents, and in some cases paper forms. The KCCQ score, which is a numeric instrument that could theoretically be captured discretely, is often recorded only as narrative ("patient completed KCCQ, scores in range consistent with severe limitation") rather than as discrete numeric domain scores. Cognitive assessments range from brief validated tools (MoCA, MMSE) to narrative neuropsychology reports, with no standardized data field.

---

### 8. Comorbidity and contraindication documentation

**Data type:** Discrete problem list entries and unstructured clinical notes

**Source:** EHR problem list; specialist consultation notes (nephrology, pulmonology, neurology)

**Key comorbidities that affect candidacy:**
- Severe right ventricular dysfunction (may contraindicate LVAD; requires biventricular support consideration)
- Severe aortic insufficiency (AI) — uncorrected AI creates a recirculation loop with an LVAD, requiring concurrent surgical correction
- Mechanical aortic valve — device interaction considerations
- Severe pulmonary hypertension with high PVR — may not respond to LVAD
- Active infection, particularly at potential driveline exit site
- Severe peripheral vascular disease — affects cannulation approach
- Active malignancy — may affect candidacy for destination therapy
- Coagulopathy or history of major bleeding — affects LVAD risk-benefit calculation
- Frailty assessment (e.g., Fried criteria, Clinical Frailty Scale)

**The problem:** Comorbidities documented in the problem list use ICD-10 codes chosen by the physician or automatically suggested by the EHR, with coding specificity that varies widely. "Chronic kidney disease, stage 3b" (N18.32) and "chronic kidney disease, unspecified" (N18.9) may both be in a patient's record simultaneously. Severe aortic insufficiency may be coded with ICD-10 I35.1 or documented only in the echocardiography report text, never appearing in the problem list. Right ventricular dysfunction has no single ICD-10 code and is typically described only in echo reports and clinical notes.

---

## The major sources of medical knowledge governing LVAD PA decisions

Payer clinical reviewers and their auto-adjudication engines draw on a defined set of external knowledge sources that the PA submission must implicitly satisfy.

**CMS NCD 20.9.1** is the governing federal coverage determination for Medicare and Medicare Advantage. It specifies the exact patient selection criteria described above. CMS is removing the NCD at section 20.9 (for artificial hearts) and permitting coverage determinations to be made by Medicare Administrative Contractors, but the LVAD-specific NCD 20.9.1 with its patient selection and facility requirements remains in effect.

**INTERMACS Registry** is the federally designated clinical data repository for all LVAD cases. INTERMACS is named as the registry satisfying the CMS reporting requirement, and facilities must be approved under the Joint Commission's Disease-Specific Care Certification Program for Ventricular Assist Devices. INTERMACS profiles (1 through 7) define patient acuity at the time of implant and are increasingly referenced in payer coverage policies as a required clinical descriptor.

**ACC/AHA Heart Failure Guidelines (2022)** define "advanced heart failure" clinical criteria, guideline-directed medical therapy requirements, and the evidence basis for LVAD therapy at specific stages of heart failure. Payers cite these guidelines in their coverage policies but do not always update their policies in sync with guideline revisions.

**HFSA Comprehensive Heart Failure Practice Guideline** provides additional granularity on LVAD patient selection, particularly around timing of referral, right heart catheterization requirements, and multidisciplinary team evaluation.

**FDA device labeling** for HeartMate 3 (Abbott) and other approved LVADs defines the approved indications, contraindications, and patient population specifications that both Medicare NCD and commercial payer policies incorporate by reference.

**InterQual and MCG clinical decision support criteria** are the proprietary evidence-based guideline products used by most commercial payers and some MA plans to adjudicate medical necessity. Their LVAD criteria may differ from the NCD criteria in specific ways (different ejection fraction thresholds, different inotrope duration requirements, additional comorbidity exclusions) without any public notification that these differences exist.

**The MOMENTUM 3 trial** is the pivotal clinical trial for the HeartMate 3 LVAD, providing the foundational evidence base for current coverage policy. The MOMENTUM 3 trial showed that bridge-to-transplant and destination therapy patients show equivalent benefit from LVADs regardless of intent to treat, which informed recommendations to move away from the bridge-to-transplant versus destination therapy classification framework in the NCD.

---

## The PA difficulties and roadblocks: where and why it breaks

### Roadblock 1: Intent classification at the time of implant

The original NCD required that providers declare at the time of implant whether the device was being used as bridge-to-transplant (BTT) or destination therapy (DT), because coverage criteria and institutional requirements differed between the two. Clinicians expressed the challenges of designating patients based on coverage descriptors at the time of implant because patients' clinical conditions change with disease progression or treatment during the management cycle. At two years, 43.5% of BTT patients were no longer listed for transplant, meaning the LVAD functioned as destination therapy in retrospect. This classification problem creates a documentation dilemma: providers must commit to a coverage category at a moment when the clinical picture has not resolved, and a mismatch between the declared intent and the patient's subsequent trajectory can trigger a retroactive coverage challenge.

### Roadblock 2: The multi-system documentation assembly burden

A complete LVAD PA submission requires pulling clinical evidence from at minimum eight systems: the inpatient EHR, the cardiology echo archive, the cath lab reporting system, the pharmacy MAR, the outpatient medication history module, community pharmacy records, the radiology PACS/RIS, and the social work documentation module. None of these systems use a common patient identifier, common terminology, or common data format. The cardiac coordinator or PA specialist must manually open each system, locate the relevant data, extract it (usually by copying text or attaching PDFs), and reformat it to match the payer's submission template. This process routinely takes three to five clinical business days for a single LVAD PA request, during which the patient may be deteriorating in the hospital on inotropic support.

### Roadblock 3: Proving "45 of the last 60 days" of optimal medical management

This is the single most common source of LVAD PA denial and the hardest to resolve without manual audit. The NCD requirement is a precisely bounded time criterion applied to a medication history that spans multiple care settings, multiple EHR instances, and potentially multiple prescribers. The typical approach is to have a nurse or pharmacist manually review the full medication record for the preceding two months, construct a timeline, and write a summary letter. This is skilled clinical labor applied to a data retrieval and reconciliation problem. If even one drug class (typically the ARNI or SGLT2 inhibitor) has a documentation gap, the payer may cite incomplete OMM and deny or pend the request.

### Roadblock 4: Separate authorizations for the procedure and the device

For LVAD accessories and supplies, documentation of medical necessity is required for payment, and all items must have such documentation. In practice, the implant procedure (CPT 33975 or 33976 for implant, 33999 for physician services) and the device itself (reported via HCPCS codes for the implantable pump and controller) may require separate PA submissions to the same payer through different review pathways. A procedure may be approved while the device is pended for additional documentation, or vice versa. Post-discharge, replacement supplies, batteries, and drive-line dressings require ongoing coverage verification with HCPCS codes that differ from the implant codes, creating a recurring administrative burden for the device clinic.

### Roadblock 5: Facility credentialing documentation

Facilities performing LVADs for Medicare coverage must be credentialed by a CMS-approved organization such as The Joint Commission or DNV GL. While most implanting centers maintain active certification, the payer's records of credentialed facilities may be outdated, and a certification verification that lapses or changes credentialing bodies can trigger a PA hold. The facility credentialing data exists in a completely separate administrative data domain that the clinical PA team typically does not manage, creating an organizational coordination problem on top of the clinical documentation burden.

### Roadblock 6: Right ventricular function assessment creates payer-specific ambiguity

Severe RV dysfunction is a relative contraindication to LVAD implant without biventricular support planning. Payers may require documentation that the multidisciplinary team specifically assessed RV function and determined the patient would tolerate LVAD support. This assessment is made using a combination of echo parameters (TAPSE, RV fractional area change, S-prime velocity), hemodynamic data (CVP/PCWP ratio, pulmonary vascular resistance), and clinical judgment. There is no single validated RV failure score with universal acceptance. Different payers may reference different thresholds, and the clinical note documenting the team's RV assessment may not use the specific language or numerical thresholds the payer's criteria reference.

### Roadblock 7: Commercial payer criteria divergence from the NCD

Many commercial payers have specific coverage criteria for LVADs, and it is important to verify the health plan's requirements if additional clinical criteria must be present to support bridge to transplantation or destination therapy classifications. Commercial payers and some MA plans layer proprietary InterQual or MCG criteria on top of the NCD, sometimes requiring lower LVEF thresholds, longer inotrope duration, specific peak VO2 measurements from cardiopulmonary exercise testing, or explicit documentation of right heart catheterization findings using terminology that differs from what appears in the cath lab report. Each payer's specific variant of the criteria is maintained in their coverage policy documents, which are updated on payer-specific schedules without standardized notification to providers.

---

## Where MTN's semantic data preparation creates value in this scenario

The LVAD scenario crystallizes the MTN opportunity with unusual clarity, because every data problem described above is a semantic data preparation problem.

The LVEF measurement lives in an echo PDF, not a discrete field. Semantic extraction and normalization from the echo report into a structured LVEF value, tagged with the measurement method, date, and clinical context, would make this criterion machine-verifiable rather than manually confirmed.

The OMM timeline problem is a longitudinal data integration problem across medication systems that use different drug identifiers, different dates formats, and different patient identifiers. A semantic layer that normalizes drug concepts (RxNorm), maps dates, and reconciles patient identity across the outpatient EHR, inpatient MAR, and community pharmacy records would allow this criterion to be constructed algorithmically rather than manually.

The ICD-10/CPT mismatch problem is a classic semantic normalization gap. The clinical documentation uses SNOMED concepts, the billing team translates to ICD-10, and the payer's criteria reference clinical concepts that may map to neither. A shared semantic layer that maintains concept-level equivalence across SNOMED, ICD-10, LOINC, and payer-specific vocabulary would eliminate the mismatch denials that account for a large fraction of cardiology claim rejections.

The N-by-M problem is directly visible here: a major heart failure center may have contracts with 15 to 20 MA plans and commercial insurers, each with their own specific LVAD coverage policy. Without a semantic normalization layer, staff must learn and maintain 15 to 20 versions of "what does this payer need to see, in what format, expressed in what terminology." With a shared semantic layer, the clinical evidence is assembled once and mapped to each payer's specific criteria vocabulary at the point of submission.

At $150,000 to $250,000 per procedure, a single prevented denial on an LVAD case generates ROI that dwarfs the cost of the data integration investment many times over.
