import type { PatientReasoningNarrative } from '../../types/annotation';

export const PATIENT_REASONING_NARRATIVES: PatientReasoningNarrative[] = [
  {
    patientId: 'patient-mk', // Hero patient (67F, TKA Day 14, M.K.)
    lastUpdated: '2026-04-15T08:00:00Z',
    narrative: `## Day 11, 08:00 — Change-point detected (posterior probability 0.94)

Temperature began trending above patient-specific expected recovery curve. Observed 37.2°C vs. expected 36.8°C, adjusted for **T2DM** (HbA1c 7.8), **BMI 31.2**, and primary TKA. The expected curve for this patient's risk profile predicts a slower return to baseline than the general population, so the threshold for deviation is already elevated — this is not a generic fever alert, it's a departure from what was expected *for this patient*.

Concurrent **HR elevation** of 8 bpm above adjusted baseline corroborates. Multi-signal correlation raised combined detection confidence. HR signal alone would not have triggered alert (CPD posterior: 0.78).

## Knowledge base assessment

Presentation timing (Day 11) falls within the SSI presentation window of Days 7–14 (**AAOS 2023**). Patient's T2DM and BMI >30 are independent SSI risk factors, contributing a combined **risk multiplier of 2.1x**. **Temperature trajectory modeling** literature (**J Arthroplasty 2024**) indicates that patient-adjusted curves reduce false positives by 34% compared to fixed thresholds — this detection was generated against the adjusted curve, not a static cutoff.

## Clinical correlation

**Day 10:** Wound check documented "mild erythema noted at incision site" — the clinical team observed a visual correlate one day before the biometric signal crossed the detection threshold. The biometric signal provides quantitative confirmation and temporal precision that the visual assessment alone does not.

**Day 13:** Antibiotics (cephalexin 500mg QID) initiated. Clinical response occurred **2 days after algorithmic detection** and 3 days after the earliest biometric deviation.

## Differential

**DVT:** Low probability — no unilateral pattern, prophylactic anticoagulation active. **Medication reaction:** Low — no new agents since Day 4. **Assessment:** superficial SSI, early detection enabled pre-systemic intervention.`,
  },
  {
    patientId: 'patient-rj',
    lastUpdated: '2026-04-15T08:00:00Z',
    narrative: `## Post-operative recovery — Day 8, uneventful

Patient R.J. (64M) is progressing normally through expected post-TKA recovery trajectory. Temperature and heart rate remain within patient-adjusted confidence intervals. No anomalies detected.`,
  },
  {
    patientId: 'patient-ap',
    lastUpdated: '2026-04-15T08:00:00Z',
    narrative: `## Post-operative recovery — Day 5, uneventful

Patient A.P. (59F) shows expected early post-operative elevation in temperature (Days 1-3) with normal return to baseline. All biometric signals within expected ranges for age and comorbidity profile.`,
  },
  {
    patientId: 'patient-lt',
    lastUpdated: '2026-04-15T08:00:00Z',
    narrative: `## Post-operative recovery — Day 12, uneventful

Patient L.T. (71M) continues normal recovery trajectory. Biometric signals consistent with expected post-TKA recovery curve adjusted for age and baseline cardiovascular status.`,
  },
  {
    patientId: 'patient-dg',
    lastUpdated: '2026-04-15T08:00:00Z',
    narrative: `## Post-operative recovery — Day 6, uneventful

Patient D.G. (55F) progressing through expected recovery trajectory. No significant deviations from patient-specific expected recovery curve.`,
  },
  {
    patientId: 'patient-jw',
    lastUpdated: '2026-04-15T08:00:00Z',
    narrative: `## Post-operative recovery — Day 3, early post-op

Patient J.W. (68M) in early post-operative period. Temperature and HR show expected surgical elevation. Monitoring continues through standard post-TKA surveillance window.`,
  },
  {
    patientId: 'patient-cb',
    lastUpdated: '2026-04-15T08:00:00Z',
    narrative: `## Post-operative recovery — Day 15, late recovery

Patient C.B. (62F) in late recovery phase. All biometric signals have returned to baseline. No complications detected during 15-day post-operative surveillance period.`,
  },
];
