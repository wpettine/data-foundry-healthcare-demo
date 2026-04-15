import type { PayerCriteria, PayerCriterionCell, PayerDivergence } from '../../types/payer';
import type { PayerCriteriaSet } from '../../types/scenario';
import { PAYER_IDS } from './_constants';
import { PATIENTS } from './patients';

// ---------------------------------------------------------------------------
// Criterion row IDs
// ---------------------------------------------------------------------------
const CRITERIA_IDS = {
  CONSERVATIVE: 'crit-conservative-duration',
  BMI: 'crit-bmi-threshold',
  HBA1C: 'crit-hba1c-threshold',
  SMOKING: 'crit-smoking-cessation',
  KL_GRADE: 'crit-kl-grade',
  FUNCTIONAL: 'crit-functional-score',
  IMAGING: 'crit-imaging-recency',
  PEER_TO_PEER: 'crit-peer-to-peer',
} as const;

// ---------------------------------------------------------------------------
// Helper: build a cell
// ---------------------------------------------------------------------------
function cell(
  id: string,
  criterionName: string,
  requirement: string,
  status: PayerCriterionCell['status'],
): PayerCriterionCell {
  return { id, criterionName, requirement, status };
}

// ---------------------------------------------------------------------------
// BCBS MA - evaluated for M.K. (67F, BMI 31.2, HbA1c 7.8%, LEFS 28/80, KL Grade 3)
// ---------------------------------------------------------------------------
const bcbs: PayerCriteria = {
  id: `payer-${PAYER_IDS.BCBS}-tka`,
  payerName: 'BCBS MA',
  procedureType: 'TKA',
  criteria: [
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.CONSERVATIVE}`, 'Conservative Therapy Duration', '≥12 weeks', 'met'), // M.K. has ~16 weeks
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.BMI}`, 'BMI Threshold', '<42', 'met'), // M.K. BMI 31.2
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.HBA1C}`, 'HbA1c Threshold', '<9.0', 'met'), // M.K. 7.8%
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.SMOKING}`, 'Smoking Cessation', 'Documented status', 'met'), // M.K. former smoker, documented
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.KL_GRADE}`, 'KL Grade Minimum', '≥3', 'met'), // M.K. KL Grade 3
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.FUNCTIONAL}`, 'Functional Score Requirement', 'LEFS <40', 'met'), // M.K. LEFS 28/80
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.IMAGING}`, 'Imaging Recency', '12 months', 'met'), // Assumed recent imaging
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.PEER_TO_PEER}`, 'Peer-to-Peer Required', 'No', 'not-required'),
  ],
};

// ---------------------------------------------------------------------------
// Aetna MA - evaluated for M.K.
// ---------------------------------------------------------------------------
const aetna: PayerCriteria = {
  id: `payer-${PAYER_IDS.AETNA}-tka`,
  payerName: 'Aetna MA',
  procedureType: 'TKA',
  criteria: [
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.CONSERVATIVE}`, 'Conservative Therapy Duration', '≥3 months', 'met'), // M.K. has ~16 weeks (4 months)
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.BMI}`, 'BMI Threshold', '<40', 'met'), // M.K. BMI 31.2
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.HBA1C}`, 'HbA1c Threshold', '<8.0', 'partial'), // M.K. 7.8% - borderline, may need review
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.SMOKING}`, 'Smoking Cessation', '30-day cessation', 'met'), // M.K. former smoker (sufficient time)
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.KL_GRADE}`, 'KL Grade Minimum', '≥3', 'met'), // M.K. KL Grade 3
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.FUNCTIONAL}`, 'Functional Score Requirement', 'KOOS <50', 'met'), // M.K. LEFS 28/80 indicates significant impairment
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.IMAGING}`, 'Imaging Recency', '12 months', 'met'),
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.PEER_TO_PEER}`, 'Peer-to-Peer Required', 'If denied', 'not-required'),
  ],
};

// ---------------------------------------------------------------------------
// United - evaluated for M.K.
// ---------------------------------------------------------------------------
const united: PayerCriteria = {
  id: `payer-${PAYER_IDS.UNITED}-tka`,
  payerName: 'United',
  procedureType: 'TKA',
  criteria: [
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.CONSERVATIVE}`, 'Conservative Therapy Duration', '≥90 days', 'met'), // M.K. has ~16 weeks (112 days)
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.BMI}`, 'BMI Threshold', 'No requirement', 'not-required'),
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.HBA1C}`, 'HbA1c Threshold', '<8.5', 'met'), // M.K. 7.8%
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.SMOKING}`, 'Smoking Cessation', 'No requirement', 'not-required'),
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.KL_GRADE}`, 'KL Grade Minimum', '≥3', 'met'), // M.K. KL Grade 3
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.FUNCTIONAL}`, 'Functional Score Requirement', 'Any standardized', 'met'), // M.K. has LEFS documented
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.IMAGING}`, 'Imaging Recency', '6 months', 'partial'), // May need updated imaging for 6-month requirement
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.PEER_TO_PEER}`, 'Peer-to-Peer Required', 'If denied', 'not-required'),
  ],
};

// ---------------------------------------------------------------------------
// Humana MA - evaluated for M.K.
// ---------------------------------------------------------------------------
const humana: PayerCriteria = {
  id: `payer-${PAYER_IDS.HUMANA}-tka`,
  payerName: 'Humana MA',
  procedureType: 'TKA',
  criteria: [
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.CONSERVATIVE}`, 'Conservative Therapy Duration', '≥6 months', 'partial'), // M.K. has ~16 weeks (4 months) - needs 2 more months
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.BMI}`, 'BMI Threshold', '<40', 'met'), // M.K. BMI 31.2
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.HBA1C}`, 'HbA1c Threshold', '<8.0', 'partial'), // M.K. 7.8% - borderline
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.SMOKING}`, 'Smoking Cessation', '90-day cessation', 'met'), // M.K. former smoker (sufficient time)
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.KL_GRADE}`, 'KL Grade Minimum', '≥3', 'met'), // M.K. KL Grade 3
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.FUNCTIONAL}`, 'Functional Score Requirement', 'WOMAC >50', 'partial'), // M.K. uses LEFS not WOMAC - scoring mismatch
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.IMAGING}`, 'Imaging Recency', '12 months', 'met'),
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.PEER_TO_PEER}`, 'Peer-to-Peer Required', 'Yes, always', 'partial'), // Required step, not yet scheduled
  ],
};

// ---------------------------------------------------------------------------
// Divergences — criteria where payers disagree
// ---------------------------------------------------------------------------
const divergences: PayerDivergence[] = [
  {
    criterionName: 'Conservative Therapy Duration',
    diverging: true,
    details: 'BCBS requires ≥12 weeks, Aetna ≥3 months, United ≥90 days (roughly equivalent), but Humana requires ≥6 months — 2x longer than others.',
  },
  {
    criterionName: 'BMI Threshold',
    diverging: true,
    details: 'BCBS allows <42, Aetna and Humana require <40, United has no BMI requirement. A patient with BMI 41 would pass BCBS but fail Aetna/Humana.',
  },
  {
    criterionName: 'HbA1c Threshold',
    diverging: true,
    details: 'BCBS most lenient at <9.0, United at <8.5, Aetna and Humana strictest at <8.0. Patient M.K. (7.8%) passes BCBS and United but is borderline for Aetna/Humana.',
  },
  {
    criterionName: 'Smoking Cessation',
    diverging: true,
    details: 'BCBS requires documented status only. Aetna requires 30-day cessation, Humana requires 90-day cessation. United has no requirement.',
  },
  {
    criterionName: 'Functional Score Requirement',
    diverging: true,
    details: 'Each payer uses a different scoring instrument: BCBS (LEFS <40), Aetna (KOOS <50), United (any standardized), Humana (WOMAC >50). Cross-mapping between instruments introduces semantic uncertainty.',
  },
  {
    criterionName: 'Imaging Recency',
    diverging: true,
    details: 'United requires imaging within 6 months — stricter than the 12-month window allowed by BCBS, Aetna, and Humana.',
  },
  {
    criterionName: 'Peer-to-Peer Required',
    diverging: true,
    details: 'Humana always requires peer-to-peer review. BCBS never requires it. Aetna and United require it only after initial denial.',
  },
];

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
const referencedPatient = PATIENTS.find((p) => p.id === 'patient-mk')!;

export const PAYER_CRITERIA_SET: PayerCriteriaSet = {
  patientId: 'patient-mk',
  procedureType: 'TKA',
  payers: [bcbs, aetna, united, humana],
  procedures: ['TKA'],
  divergences,
  patients: [referencedPatient],
};
