import type { AIFinding } from '../../types/annotation';

const heroFinding: AIFinding = {
  id: 'finding-ssi-01',
  title: 'Early infection signal detected',
  onsetDay: 11,
  confidence: 94,
  confidenceLevel: 'high',
  detectionMethod: 'Multi-signal change-point detection',
  signalContributions: [
    {
      signal: 'Temperature trajectory deviation',
      percentage: 42,
      color: '#EF4444',
      detail:
        '37.2°C observed vs. 36.8°C expected at Day 11. Deviation exceeds confidence interval.',
    },
    {
      signal: 'HR baseline shift',
      percentage: 28,
      color: '#3B82F6',
      detail:
        '82 bpm observed vs. 74 bpm expected. Resting HR elevated 8 bpm above patient-adjusted baseline.',
    },
    {
      signal: 'Patient risk profile',
      percentage: 18,
      color: '#F59E0B',
      detail:
        'T2DM (HbA1c 7.8), BMI 31.2, age 67 — combined SSI risk multiplier 2.1x vs. baseline.',
    },
    {
      signal: 'Conservative treatment duration',
      percentage: 12,
      color: '#8B5CF6',
      detail:
        '14-month symptom duration, LEFS 28/80 — associated with delayed wound healing.',
    },
  ],
  knowledgeSources: [
    {
      id: 'kb-aaos-2023',
      label: 'Post-TKA SSI risk factors (AAOS 2023)',
      excerpt:
        'Diabetes mellitus, BMI >30, and smoking history are independent risk factors. SSI typically presents Days 7–14 post-operatively.',
    },
    {
      id: 'kb-jarthro-2024',
      label:
        'Temperature trajectory modeling in joint arthroplasty (J Arthroplasty 2024)',
      excerpt:
        'Patient-specific expected recovery curves reduced false-positive SSI alerts by 34% compared to fixed-threshold monitoring (n=2,847).',
    },
    {
      id: 'kb-corr-2025',
      label:
        'Multi-signal infection detection (Clin Orthop Relat Res 2025)',
      excerpt:
        'Bayesian online CPD applied to combined temp and HR signals achieved sensitivity 89%, specificity 94% for early SSI detection.',
    },
  ],
  differential: [
    {
      condition: 'Surgical site infection',
      probability: 'high',
      reasoning:
        'Thermal + HR pattern match, patient risk factors (T2DM, BMI 31.2), presentation timing consistent with SSI window (Days 7–14).',
    },
    {
      condition: 'DVT',
      probability: 'low',
      reasoning:
        'No unilateral HR/temp dissociation pattern, patient on prophylactic enoxaparin.',
    },
    {
      condition: 'Medication reaction',
      probability: 'low',
      reasoning:
        'No new agents introduced since Day 4 (acetaminophen only).',
    },
  ],
  clinicalCorrelates: [
    {
      eventId: 'evt-wound-check',
      relationship:
        'Mild erythema noted at incision site — clinical correlate documented before thermal signal threshold.',
    },
    {
      eventId: 'evt-antibiotic',
      relationship:
        'Cephalexin initiated 2 days after biometric detection.',
    },
  ],
  reasoningNarrative: `### Detection Summary

**Posterior probability: 94%** for early surgical site infection (SSI) based on multi-signal change-point detection.

#### SSI Window Alignment
The detection at **Day 11** falls squarely within the established SSI presentation window of Days 7–14 post-TKA. Temperature trajectory analysis identified a sustained deviation beginning Day 10, with the signal exceeding the patient-specific confidence interval by Day 11 morning.

#### Risk Multiplier
Patient-specific risk factors — T2DM with HbA1c 7.8, BMI 31.2, and age 67 — yield a combined SSI risk multiplier of **2.1x** relative to the population baseline. This elevated prior shifts the posterior probability substantially compared to a patient without comorbidities presenting with the same biometric pattern.

#### Lead Time
Biometric signal detection preceded clinical wound assessment documentation by approximately **36 hours** and antibiotic initiation by **48 hours**, suggesting the multi-signal approach provides actionable early warning.

#### Methodology
Bayesian online change-point detection (CPD) was applied simultaneously to normalized temperature and heart-rate streams. Signal contributions were estimated via Shapley value decomposition across the four input channels. The model was calibrated on a retrospective cohort of 2,847 TKA patients with known outcomes.`,
  status: 'pending',
};

export const AI_FINDINGS: AIFinding[] = [heroFinding];
