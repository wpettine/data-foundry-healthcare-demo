import type { PARequirementCategory } from '../../types/pa';
import { LINKING_COLORS } from './_constants';

// Helper: cycle through the 6 linking colors
const color = (i: number): string => LINKING_COLORS[i % LINKING_COLORS.length];

// ---------------------------------------------------------------------------
// Category 1 — Conservative Therapy
// ---------------------------------------------------------------------------
const conservativeTherapy: PARequirementCategory = {
  id: 'cat-conservative',
  name: 'Conservative Therapy',
  children: [
    {
      id: 'req-nsaid',
      categoryId: 'cat-conservative',
      criterionText: 'Documented NSAID trial (drug, dose, duration, response)',
      status: 'met',
      linkedEvidenceIds: ['ev-pharmacy-nsaid', 'ev-pcp-nsaid'],
      highlightColor: color(0),
    },
    {
      id: 'req-pt',
      categoryId: 'cat-conservative',
      criterionText: 'Supervised physical therapy ≥3 months with functional outcome scores',
      status: 'met',
      linkedEvidenceIds: ['ev-pt-initial', 'ev-pt-progress', 'ev-pt-discharge'],
      highlightColor: color(1),
    },
    {
      id: 'req-injection',
      categoryId: 'cat-conservative',
      criterionText: 'Corticosteroid injection with documented response',
      status: 'met',
      linkedEvidenceIds: ['ev-pcp-injection'],
      highlightColor: color(2),
    },
    {
      id: 'req-failure',
      categoryId: 'cat-conservative',
      criterionText: 'Documentation of failure of conservative measures',
      status: 'review',
      confidence: 78,
      semanticInference: {
        sourceText: 'Patient demonstrated inadequate improvement after 14 weeks of supervised PT',
        mappedConcept: 'Failure of conservative therapy',
        explanation:
          '"Inadequate improvement" in PT discharge notes needs explicit mapping to payer-required language ("failure of conservative measures"). The clinical meaning aligns but the terminology does not match the payer criterion verbatim.',
        alternatives: [
          { concept: 'Partial response to conservative therapy', confidence: 65 },
          { concept: 'Plateau in functional recovery', confidence: 58 },
        ],
      },
      linkedEvidenceIds: ['ev-pt-discharge', 'ev-ortho-exam'],
      highlightColor: color(3),
    },
  ],
};

// ---------------------------------------------------------------------------
// Category 2 — Radiographic Evidence
// ---------------------------------------------------------------------------
const radiographicEvidence: PARequirementCategory = {
  id: 'cat-radiographic',
  name: 'Radiographic Evidence',
  children: [
    {
      id: 'req-imaging',
      categoryId: 'cat-radiographic',
      criterionText: 'Weight-bearing X-rays within 12 months (AP, lateral views)',
      status: 'met',
      linkedEvidenceIds: ['ev-xray'],
      highlightColor: color(4),
    },
    {
      id: 'req-kl-grade',
      categoryId: 'cat-radiographic',
      criterionText: 'Kellgren-Lawrence Grade ≥3 documented by radiologist',
      status: 'met',
      linkedEvidenceIds: ['ev-xray'],
      highlightColor: color(5),
    },
    {
      id: 'req-laterality',
      categoryId: 'cat-radiographic',
      criterionText: 'Laterality-specific imaging confirming surgical side',
      status: 'met',
      linkedEvidenceIds: ['ev-xray'],
      highlightColor: color(6),
    },
  ],
};

// ---------------------------------------------------------------------------
// Category 3 — Functional Assessment
// ---------------------------------------------------------------------------
const functionalAssessment: PARequirementCategory = {
  id: 'cat-functional',
  name: 'Functional Assessment',
  children: [
    {
      id: 'req-rom',
      categoryId: 'cat-functional',
      criterionText: 'Range of motion documented (flexion/extension)',
      status: 'met',
      linkedEvidenceIds: ['ev-ortho-exam'],
      highlightColor: color(7),
    },
    {
      id: 'req-adl',
      categoryId: 'cat-functional',
      criterionText: 'Documented functional disability impacting ADLs',
      status: 'review',
      confidence: 72,
      semanticInference: {
        sourceText: 'Patient reports significant limitation in walking and stair climbing',
        mappedConcept: 'Functional disability impacting ADLs',
        explanation:
          '"Significant limitation" is qualitative. Payer criteria expect quantified functional scores (LEFS ≤36 or equivalent). PT discharge LEFS of 34/80 supports the claim but the orthopedic exam note lacks an explicit LEFS reference, requiring cross-document mapping.',
        alternatives: [
          { concept: 'Moderate functional impairment', confidence: 68 },
          { concept: 'Activity limitation requiring assistive device', confidence: 45 },
        ],
      },
      linkedEvidenceIds: ['ev-pt-discharge', 'ev-ortho-exam'],
      highlightColor: color(8),
    },
    {
      id: 'req-scores',
      categoryId: 'cat-functional',
      criterionText: 'Standardized outcome scores (LEFS, KOOS, or WOMAC)',
      status: 'met',
      linkedEvidenceIds: ['ev-pt-initial', 'ev-pt-discharge'],
      highlightColor: color(9),
    },
  ],
};

// ---------------------------------------------------------------------------
// Category 4 — Medical Clearance
// ---------------------------------------------------------------------------
const medicalClearance: PARequirementCategory = {
  id: 'cat-medical',
  name: 'Medical Clearance',
  children: [
    {
      id: 'req-bmi',
      categoryId: 'cat-medical',
      criterionText: 'BMI documented',
      status: 'met',
      linkedEvidenceIds: ['ev-ortho-planning'],
      highlightColor: color(10),
    },
    {
      id: 'req-hba1c',
      categoryId: 'cat-medical',
      criterionText: 'HbA1c <8.0 for diabetic patients',
      status: 'missing',
      linkedEvidenceIds: [],
      missingExplanation:
        'HbA1c of 7.8% documented at PCP but no formal pre-operative medical clearance letter from PCP on file',
      highlightColor: color(11),
    },
  ],
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export const HERO_REQUIREMENTS: PARequirementCategory[] = [
  conservativeTherapy,
  radiographicEvidence,
  functionalAssessment,
  medicalClearance,
];
