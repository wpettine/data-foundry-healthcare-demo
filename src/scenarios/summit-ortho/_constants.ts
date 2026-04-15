// === Company ===
export const COMPANY = { name: 'Summit Orthopedics Group', industry: 'Orthopedics', locationCount: 20 } as const;
export const DEAL_TIMER = { currentDay: 22, totalDays: 90, label: 'Integration Sprint' } as const;

// === Dashboard Summary ===
export const SCHEMA_COUNTS = { totalSystems: 20, totalFields: 4_847, autoAnnotated: 94.2, payerCriteriaSets: 12 } as const;

// === Source Systems (Situation 1) ===
export const SYSTEM_IDS = {
  EPIC: 'epic-flagship',
  ATHENA: 'athena-midsize',
  MODMED: 'modmed-small',
  ECW: 'ecw-small',
  WEBPT: 'webpt-pt',
  PHARMACY: 'pharmacy-feed',
  RADIOLOGY: 'radiology',
} as const;

// === PA Workbench (Situation 2) ===
export const PA_COUNTS = { pending: 34, ready: 12, needEvidence: 8, inPayerReview: 14 } as const;
export const PA_HERO_CASE = { patientInitials: 'M.K.', mrn: '4821937' } as const;
export const REQUIREMENT_COUNTS = { total: 12, met: 8, review: 2, missing: 2 } as const;

// === Payer Names (Situation 3) ===
export const PAYER_IDS = { BCBS: 'bcbs-ma', AETNA: 'aetna-ma', UNITED: 'united', HUMANA: 'humana-ma' } as const;

// === Model Builder (Situation 4) ===
export const MODEL_COUNTS = { eligibleCases: 3_247, sites: 18, totalSites: 20, completeness: 94, withBiometrics: 2_891 } as const;

// === Source System Colors ===
export const SOURCE_COLORS = {
  [SYSTEM_IDS.EPIC]: '#3B82F6',
  [SYSTEM_IDS.ATHENA]: '#8B5CF6',
  [SYSTEM_IDS.MODMED]: '#F97316',
  [SYSTEM_IDS.ECW]: '#F59E0B',
  [SYSTEM_IDS.WEBPT]: '#22C55E',
  [SYSTEM_IDS.PHARMACY]: '#D97706',
  [SYSTEM_IDS.RADIOLOGY]: '#F43F5E',
} as const;

// === Linking Palette (PA bidirectional highlighting) ===
export const LINKING_COLORS = ['#3B82F6', '#22C55E', '#D97706', '#8B5CF6', '#F43F5E', '#14B8A6'] as const;
