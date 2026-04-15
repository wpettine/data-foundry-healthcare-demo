import type { PACase } from '../../types/pa';
import type { IdentityResolution } from '../../types/scenario';
import { mulberry32 } from '../../utils/prng';
import { SYSTEM_IDS, PAYER_IDS, LINKING_COLORS } from './_constants';
import { HERO_REQUIREMENTS } from './pa-requirements';
import { HERO_EVIDENCE } from './pa-evidence';
import { PATIENTS } from './patients';

// ---------------------------------------------------------------------------
// Hero case — M.K. (TKA right knee)
// ---------------------------------------------------------------------------
const heroPatient = PATIENTS.find((p) => p.id === 'patient-mk')!;

const heroCase: PACase = {
  id: 'case-mk',
  patientId: 'patient-mk',
  procedure: { cpt: '27447', description: 'Total Knee Arthroplasty', laterality: 'right' },
  payerId: PAYER_IDS.BCBS,
  payerName: 'BCBS MA',
  filedDate: '2026-03-10',
  surgeryDate: '2026-04-08',
  slaDeadline: '2026-03-26',
  assignedTo: 'Dr. Sarah Chen',
  requirements: HERO_REQUIREMENTS,
  evidence: HERO_EVIDENCE,
  identityResolution: heroPatient.identityResolution,
};

// ---------------------------------------------------------------------------
// Filler case generator
// ---------------------------------------------------------------------------
const PROCEDURES = [
  { cpt: '27447', description: 'Total Knee Arthroplasty', laterality: 'right' as const },
  { cpt: '27447', description: 'Total Knee Arthroplasty', laterality: 'left' as const },
  { cpt: '27130', description: 'Total Hip Arthroplasty', laterality: 'right' as const },
  { cpt: '27130', description: 'Total Hip Arthroplasty', laterality: 'left' as const },
];

const PAYER_POOL = [
  { id: PAYER_IDS.BCBS, name: 'BCBS MA' },
  { id: PAYER_IDS.AETNA, name: 'Aetna MA' },
  { id: PAYER_IDS.UNITED, name: 'United' },
  { id: PAYER_IDS.HUMANA, name: 'Humana MA' },
];

const DOCTORS = [
  'Dr. Sarah Chen',
  'Dr. James Patel',
  'Dr. Maria Rodriguez',
  'Dr. Kevin O\'Brien',
  'Dr. Lisa Nguyen',
  'Dr. Robert Kim',
];

const MATCH_METHODS = [
  'DOB + last name',
  'MRN crosswalk',
  'SSN last-4 + DOB',
  'DOB + last name',
  'MRN crosswalk',
];

const color = (i: number): string => LINKING_COLORS[i % LINKING_COLORS.length];

function generateFillerPACases(): PACase[] {
  const rand = mulberry32(20260310); // deterministic seed
  const cases: PACase[] = [];

  for (let i = 0; i < 33; i++) {
    const proc = PROCEDURES[Math.floor(rand() * PROCEDURES.length)];
    const payer = PAYER_POOL[Math.floor(rand() * PAYER_POOL.length)];
    const doctor = DOCTORS[Math.floor(rand() * DOCTORS.length)];
    const matchMethod = MATCH_METHODS[Math.floor(rand() * MATCH_METHODS.length)];

    // Filed dates spread across March 2026
    const filedDay = 1 + Math.floor(rand() * 25);
    const filedDate = `2026-03-${String(filedDay).padStart(2, '0')}`;

    // Surgery 3-5 weeks after filing
    const surgeryOffset = 21 + Math.floor(rand() * 14);
    const surgeryDayTotal = filedDay + surgeryOffset;
    const surgeryMonth = surgeryDayTotal > 31 ? '04' : '03';
    const surgeryDay = surgeryDayTotal > 31 ? surgeryDayTotal - 31 : surgeryDayTotal;
    const surgeryDate = `2026-${surgeryMonth}-${String(surgeryDay).padStart(2, '0')}`;

    // SLA deadline 14-16 days after filing
    const slaOffset = 14 + Math.floor(rand() * 3);
    const slaDayTotal = filedDay + slaOffset;
    const slaMonth = slaDayTotal > 31 ? '04' : '03';
    const slaDay = slaDayTotal > 31 ? slaDayTotal - 31 : slaDayTotal;
    const slaDeadline = `2026-${slaMonth}-${String(slaDay).padStart(2, '0')}`;

    // Pick 2-3 matched systems
    const allSystems = [SYSTEM_IDS.EPIC, SYSTEM_IDS.ATHENA, SYSTEM_IDS.MODMED, SYSTEM_IDS.ECW, SYSTEM_IDS.WEBPT];
    const systemCount = 2 + Math.floor(rand() * 2);
    const matchedSystems: string[] = [];
    for (let s = 0; s < systemCount; s++) {
      const sys = allSystems[Math.floor(rand() * allSystems.length)];
      if (!matchedSystems.includes(sys)) matchedSystems.push(sys);
    }
    if (matchedSystems.length < 2) matchedSystems.push(SYSTEM_IDS.EPIC);

    const identity: IdentityResolution = {
      matchedSystems,
      matchMethod,
      matchConfidence: 0.85 + rand() * 0.14,
    };

    // Simple requirements: 2-3 categories with basic children
    const categoryTemplates = [
      {
        id: `cat-conservative-${i}`,
        name: 'Conservative Therapy',
        children: [
          { criterion: 'NSAID trial documented', statusRoll: rand() },
          { criterion: 'Physical therapy completed', statusRoll: rand() },
          { criterion: 'Injection trial documented', statusRoll: rand() },
        ],
      },
      {
        id: `cat-radiographic-${i}`,
        name: 'Radiographic Evidence',
        children: [
          { criterion: 'Weight-bearing X-rays within 12 months', statusRoll: rand() },
          { criterion: 'KL Grade ≥3 documented', statusRoll: rand() },
        ],
      },
      {
        id: `cat-medical-${i}`,
        name: 'Medical Clearance',
        children: [
          { criterion: 'BMI documented', statusRoll: rand() },
          { criterion: 'Pre-operative clearance', statusRoll: rand() },
        ],
      },
    ];

    // Use 2 or 3 categories
    const catCount = 2 + Math.floor(rand() * 2);
    const categories = categoryTemplates.slice(0, catCount);

    const requirements = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      children: cat.children.map((child, ci) => {
        const roll = child.statusRoll;
        const status = roll < 0.55 ? ('met' as const) : roll < 0.8 ? ('review' as const) : ('missing' as const);
        return {
          id: `req-${i}-${ci}`,
          categoryId: cat.id,
          criterionText: child.criterion,
          status,
          confidence: status === 'review' ? Math.round(60 + rand() * 30) : undefined,
          linkedEvidenceIds: [] as string[],
          highlightColor: color(ci),
          missingExplanation: status === 'missing' ? 'Documentation not found in connected systems' : undefined,
        };
      }),
    }));

    cases.push({
      id: `case-filler-${i}`,
      patientId: `patient-filler-${i}`,
      procedure: proc,
      payerId: payer.id,
      payerName: payer.name,
      filedDate,
      surgeryDate,
      slaDeadline,
      assignedTo: doctor,
      requirements,
      evidence: [],
      identityResolution: identity,
    });
  }

  return cases;
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export const PA_CASES: PACase[] = [heroCase, ...generateFillerPACases()];
