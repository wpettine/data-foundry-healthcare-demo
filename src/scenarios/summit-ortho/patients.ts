import type { Patient } from '../../types/patient';
import type { IdentityResolution } from '../../types/scenario';
import { SYSTEM_IDS } from './_constants';
import { mulberry32 } from '../../utils/prng';

const heroIdentity: IdentityResolution = {
  matchedSystems: [SYSTEM_IDS.EPIC, SYSTEM_IDS.ATHENA, SYSTEM_IDS.WEBPT],
  matchMethod: 'DOB + last name',
  matchConfidence: 0.928,
};

const heroPatient: Patient = {
  id: 'patient-mk',
  initials: 'M.K.',
  mrn: '4821937',
  dateOfBirth: '1959-03-15',
  sex: 'F',
  age: 67,
  diagnoses: [
    { code: 'M17.11', description: 'Primary osteoarthritis, right knee', system: 'ICD-10' },
    { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia', system: 'ICD-10' },
    { code: 'Z87.891', description: 'Personal history of nicotine dependence', system: 'ICD-10' },
  ],
  medications: [
    { name: 'Metformin', dose: '1000mg', frequency: 'BID', sourceSystemId: SYSTEM_IDS.EPIC },
    { name: 'Enoxaparin', dose: '40mg', frequency: 'Daily', sourceSystemId: SYSTEM_IDS.EPIC },
    { name: 'Acetaminophen', dose: '1000mg', frequency: 'Q6H PRN', sourceSystemId: SYSTEM_IDS.EPIC },
  ],
  allergies: ['Sulfa drugs'],
  preOpValues: {
    BMI: { value: '31.2', sourceSystemId: SYSTEM_IDS.EPIC },
    LEFS: { value: '28/80', sourceSystemId: SYSTEM_IDS.WEBPT },
    HbA1c: { value: '7.8%', sourceSystemId: SYSTEM_IDS.EPIC },
    ROM: { value: '95°', sourceSystemId: SYSTEM_IDS.ATHENA },
    'KL Grade': { value: '3', sourceSystemId: SYSTEM_IDS.RADIOLOGY },
  },
  identityResolution: heroIdentity,
  riskLevel: 'moderate',
};

// --- Filler patients ---

const fillerPatients: Patient[] = [
  {
    id: 'patient-rj',
    initials: 'R.J.',
    mrn: '5130284',
    dateOfBirth: '1961-07-22',
    sex: 'M',
    age: 64,
    diagnoses: [
      { code: 'M16.11', description: 'Primary osteoarthritis, right hip', system: 'ICD-10' },
      { code: 'I10', description: 'Essential hypertension', system: 'ICD-10' },
    ],
    medications: [
      { name: 'Lisinopril', dose: '20mg', frequency: 'Daily' },
      { name: 'Celecoxib', dose: '200mg', frequency: 'Daily' },
    ],
    allergies: [],
    preOpValues: {
      BMI: '27.4',
      'Harris Hip Score': '42/100',
      HbA1c: '5.9%',
    },
    identityResolution: {
      matchedSystems: [SYSTEM_IDS.EPIC, SYSTEM_IDS.ATHENA],
      matchMethod: 'MRN crosswalk',
      matchConfidence: 0.97,
    },
    riskLevel: 'low',
  },
  {
    id: 'patient-dt',
    initials: 'D.T.',
    mrn: '4927561',
    dateOfBirth: '1968-11-03',
    sex: 'F',
    age: 57,
    diagnoses: [
      { code: 'M17.12', description: 'Primary osteoarthritis, left knee', system: 'ICD-10' },
      { code: 'E66.01', description: 'Morbid obesity due to excess calories', system: 'ICD-10' },
    ],
    medications: [
      { name: 'Semaglutide', dose: '1mg', frequency: 'Weekly' },
      { name: 'Naproxen', dose: '500mg', frequency: 'BID' },
    ],
    allergies: ['Penicillin'],
    preOpValues: {
      BMI: '38.7',
      LEFS: '22/80',
      HbA1c: '6.1%',
      ROM: '85°',
      'KL Grade': '4',
    },
    identityResolution: {
      matchedSystems: [SYSTEM_IDS.EPIC, SYSTEM_IDS.MODMED, SYSTEM_IDS.WEBPT],
      matchMethod: 'DOB + last name',
      matchConfidence: 0.912,
    },
    riskLevel: 'high',
  },
  {
    id: 'patient-wh',
    initials: 'W.H.',
    mrn: '5284710',
    dateOfBirth: '1956-02-18',
    sex: 'M',
    age: 70,
    diagnoses: [
      { code: 'M16.12', description: 'Primary osteoarthritis, left hip', system: 'ICD-10' },
      { code: 'M81.0', description: 'Age-related osteoporosis without pathological fracture', system: 'ICD-10' },
    ],
    medications: [
      { name: 'Alendronate', dose: '70mg', frequency: 'Weekly' },
      { name: 'Calcium + D3', dose: '600mg/400IU', frequency: 'BID' },
    ],
    allergies: [],
    preOpValues: {
      BMI: '24.1',
      'Harris Hip Score': '38/100',
      'DEXA T-score': '-2.8',
    },
    identityResolution: {
      matchedSystems: [SYSTEM_IDS.EPIC, SYSTEM_IDS.ATHENA],
      matchMethod: 'SSN last-4 + DOB',
      matchConfidence: 0.985,
    },
    riskLevel: 'moderate',
  },
  {
    id: 'patient-sm',
    initials: 'S.M.',
    mrn: '4756893',
    dateOfBirth: '1948-09-30',
    sex: 'F',
    age: 77,
    diagnoses: [
      { code: 'M17.0', description: 'Bilateral primary osteoarthritis of knee', system: 'ICD-10' },
      { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery', system: 'ICD-10' },
      { code: 'N18.3', description: 'Chronic kidney disease, stage 3', system: 'ICD-10' },
    ],
    medications: [
      { name: 'Atorvastatin', dose: '40mg', frequency: 'Daily' },
      { name: 'Aspirin', dose: '81mg', frequency: 'Daily' },
      { name: 'Metoprolol', dose: '50mg', frequency: 'BID' },
    ],
    allergies: ['Codeine', 'Latex'],
    preOpValues: {
      BMI: '29.3',
      LEFS: '18/80',
      HbA1c: '5.7%',
      ROM: '80°',
      'KL Grade': '4',
      eGFR: '48',
    },
    identityResolution: {
      matchedSystems: [SYSTEM_IDS.EPIC, SYSTEM_IDS.ATHENA, SYSTEM_IDS.ECW],
      matchMethod: 'DOB + last name',
      matchConfidence: 0.895,
    },
    riskLevel: 'high',
  },
  {
    id: 'patient-jc',
    initials: 'J.C.',
    mrn: '5341026',
    dateOfBirth: '1965-05-14',
    sex: 'M',
    age: 60,
    diagnoses: [
      { code: 'M16.11', description: 'Primary osteoarthritis, right hip', system: 'ICD-10' },
    ],
    medications: [
      { name: 'Ibuprofen', dose: '600mg', frequency: 'TID PRN' },
    ],
    allergies: [],
    preOpValues: {
      BMI: '26.0',
      'Harris Hip Score': '45/100',
      HbA1c: '5.4%',
    },
    identityResolution: {
      matchedSystems: [SYSTEM_IDS.MODMED, SYSTEM_IDS.WEBPT],
      matchMethod: 'MRN crosswalk',
      matchConfidence: 0.961,
    },
    riskLevel: 'low',
  },
  {
    id: 'patient-ag',
    initials: 'A.G.',
    mrn: '5089347',
    dateOfBirth: '1953-12-08',
    sex: 'F',
    age: 72,
    diagnoses: [
      { code: 'M17.11', description: 'Primary osteoarthritis, right knee', system: 'ICD-10' },
      { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', system: 'ICD-10' },
      { code: 'G47.33', description: 'Obstructive sleep apnea', system: 'ICD-10' },
    ],
    medications: [
      { name: 'Metformin', dose: '500mg', frequency: 'BID' },
      { name: 'Meloxicam', dose: '15mg', frequency: 'Daily' },
      { name: 'CPAP', dose: 'N/A', frequency: 'Nightly' },
    ],
    allergies: ['Iodine contrast'],
    preOpValues: {
      BMI: '33.5',
      LEFS: '25/80',
      HbA1c: '7.2%',
      ROM: '90°',
      'KL Grade': '3',
    },
    identityResolution: {
      matchedSystems: [SYSTEM_IDS.ATHENA, SYSTEM_IDS.WEBPT, SYSTEM_IDS.PHARMACY],
      matchMethod: 'DOB + last name',
      matchConfidence: 0.938,
    },
    riskLevel: 'moderate',
  },
];

// Generate additional filler patients to match PA cases
function generateFillerPatients() {
  const rand = mulberry32(20260310);
  const initials = ['A.B.', 'C.D.', 'E.F.', 'G.H.', 'I.J.', 'K.L.', 'M.N.', 'O.P.', 'Q.R.', 'S.T.', 'U.V.', 'W.X.', 'Y.Z.'];
  const riskLevels: Array<'low' | 'moderate' | 'high'> = ['low', 'moderate', 'high'];
  const matchMethods = ['DOB + last name', 'MRN crosswalk', 'SSN last-4 + DOB'];

  const patients: Patient[] = [];

  for (let i = 0; i < 33; i++) {
    const ageBase = 50 + Math.floor(rand() * 30); // 50-80 years old
    const isMale = rand() > 0.5;
    const bmi = (22 + rand() * 16).toFixed(1); // 22-38

    patients.push({
      id: `patient-filler-${i}`,
      initials: initials[i % initials.length],
      mrn: String(5000000 + Math.floor(rand() * 999999)),
      dateOfBirth: `19${70 - (ageBase - 50)}-${String(1 + Math.floor(rand() * 12)).padStart(2, '0')}-${String(1 + Math.floor(rand() * 28)).padStart(2, '0')}`,
      sex: isMale ? 'M' : 'F',
      age: ageBase,
      diagnoses: [],
      medications: [],
      allergies: [],
      preOpValues: {
        BMI: { value: bmi, sourceSystemId: SYSTEM_IDS.EPIC },
      },
      identityResolution: {
        matchedSystems: [SYSTEM_IDS.EPIC, SYSTEM_IDS.ATHENA],
        matchMethod: matchMethods[i % matchMethods.length],
        matchConfidence: 0.85 + rand() * 0.14,
      },
      riskLevel: riskLevels[i % riskLevels.length],
    });
  }

  return patients;
}

export const PATIENTS: Patient[] = [heroPatient, ...fillerPatients, ...generateFillerPatients()];
