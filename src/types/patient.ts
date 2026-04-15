import type { IdentityResolution } from './scenario';

export interface Patient {
  id: string;
  initials: string;
  mrn: string;
  dateOfBirth: string;
  sex: 'M' | 'F';
  age: number;
  diagnoses: Array<{ code: string; description: string; system: 'ICD-10' | 'SNOMED' }>;
  medications: Array<{
    name: string;
    dose: string;
    frequency: string;
    sourceSystemId?: string;
  }>;
  allergies: string[];
  preOpValues?: Record<string, { value: string; sourceSystemId?: string } | string>;
  identityResolution: IdentityResolution;
  riskLevel?: 'low' | 'moderate' | 'high';
}
