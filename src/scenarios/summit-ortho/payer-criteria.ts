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
  patientId: string,
): PayerCriterionCell {
  return { id, criterionName, requirement, status, patientId };
}

// ---------------------------------------------------------------------------
// BCBS MA
// ---------------------------------------------------------------------------
const bcbs: PayerCriteria = {
  id: `payer-${PAYER_IDS.BCBS}-tka`,
  payerName: 'BCBS MA',
  procedureType: 'TKA',
  criteria: [
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.CONSERVATIVE}`, 'Conservative Therapy Duration', '≥12 weeks', 'met', 'patient-mk'),
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.BMI}`, 'BMI Threshold', '<42', 'met', 'patient-dt'),
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.HBA1C}`, 'HbA1c Threshold', '<9.0', 'met', 'patient-ag'),
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.SMOKING}`, 'Smoking Cessation', 'Documented status', 'met', 'patient-mk'),
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.KL_GRADE}`, 'KL Grade Minimum', '≥3', 'met', 'patient-sm'),
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.FUNCTIONAL}`, 'Functional Score Requirement', 'LEFS <40', 'met', 'patient-dt'),
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.IMAGING}`, 'Imaging Recency', '12 months', 'met', 'patient-ag'),
    cell(`${PAYER_IDS.BCBS}-${CRITERIA_IDS.PEER_TO_PEER}`, 'Peer-to-Peer Required', 'No', 'not-required', 'patient-mk'),
  ],
};

// ---------------------------------------------------------------------------
// Aetna MA
// ---------------------------------------------------------------------------
const aetna: PayerCriteria = {
  id: `payer-${PAYER_IDS.AETNA}-tka`,
  payerName: 'Aetna MA',
  procedureType: 'TKA',
  criteria: [
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.CONSERVATIVE}`, 'Conservative Therapy Duration', '≥3 months', 'met', 'patient-mk'),
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.BMI}`, 'BMI Threshold', '<40', 'met', 'patient-dt'),
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.HBA1C}`, 'HbA1c Threshold', '<8.0', 'partial', 'patient-ag'),
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.SMOKING}`, 'Smoking Cessation', '30-day cessation', 'met', 'patient-mk'),
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.KL_GRADE}`, 'KL Grade Minimum', '≥3', 'met', 'patient-sm'),
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.FUNCTIONAL}`, 'Functional Score Requirement', 'KOOS <50', 'met', 'patient-dt'),
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.IMAGING}`, 'Imaging Recency', '12 months', 'met', 'patient-ag'),
    cell(`${PAYER_IDS.AETNA}-${CRITERIA_IDS.PEER_TO_PEER}`, 'Peer-to-Peer Required', 'If denied', 'not-required', 'patient-mk'),
  ],
};

// ---------------------------------------------------------------------------
// United
// ---------------------------------------------------------------------------
const united: PayerCriteria = {
  id: `payer-${PAYER_IDS.UNITED}-tka`,
  payerName: 'United',
  procedureType: 'TKA',
  criteria: [
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.CONSERVATIVE}`, 'Conservative Therapy Duration', '≥90 days', 'met', 'patient-mk'),
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.BMI}`, 'BMI Threshold', 'No requirement', 'not-required', 'patient-dt'),
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.HBA1C}`, 'HbA1c Threshold', '<8.5', 'met', 'patient-ag'),
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.SMOKING}`, 'Smoking Cessation', 'No requirement', 'not-required', 'patient-mk'),
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.KL_GRADE}`, 'KL Grade Minimum', '≥3', 'met', 'patient-sm'),
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.FUNCTIONAL}`, 'Functional Score Requirement', 'Any standardized', 'met', 'patient-dt'),
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.IMAGING}`, 'Imaging Recency', '6 months', 'partial', 'patient-ag'),
    cell(`${PAYER_IDS.UNITED}-${CRITERIA_IDS.PEER_TO_PEER}`, 'Peer-to-Peer Required', 'If denied', 'not-required', 'patient-mk'),
  ],
};

// ---------------------------------------------------------------------------
// Humana MA
// ---------------------------------------------------------------------------
const humana: PayerCriteria = {
  id: `payer-${PAYER_IDS.HUMANA}-tka`,
  payerName: 'Humana MA',
  procedureType: 'TKA',
  criteria: [
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.CONSERVATIVE}`, 'Conservative Therapy Duration', '≥6 months', 'partial', 'patient-mk'),
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.BMI}`, 'BMI Threshold', '<40', 'met', 'patient-dt'),
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.HBA1C}`, 'HbA1c Threshold', '<8.0', 'partial', 'patient-ag'),
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.SMOKING}`, 'Smoking Cessation', '90-day cessation', 'met', 'patient-mk'),
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.KL_GRADE}`, 'KL Grade Minimum', '≥3', 'met', 'patient-sm'),
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.FUNCTIONAL}`, 'Functional Score Requirement', 'WOMAC >50', 'partial', 'patient-dt'),
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.IMAGING}`, 'Imaging Recency', '12 months', 'met', 'patient-ag'),
    cell(`${PAYER_IDS.HUMANA}-${CRITERIA_IDS.PEER_TO_PEER}`, 'Peer-to-Peer Required', 'Yes, always', 'partial', 'patient-mk'),
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
const referencedPatients = PATIENTS.filter((p) =>
  ['patient-mk', 'patient-dt', 'patient-ag', 'patient-sm'].includes(p.id),
);

export const PAYER_CRITERIA_SET: PayerCriteriaSet = {
  payers: [bcbs, aetna, united, humana],
  procedures: ['TKA'],
  divergences,
  patients: referencedPatients,
};
