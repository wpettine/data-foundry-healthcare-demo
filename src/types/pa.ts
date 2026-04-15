import type { IdentityResolution } from './scenario';

export interface PACase {
  id: string;
  patientId: string;
  procedure: { cpt: string; description: string; laterality: 'right' | 'left' | 'bilateral' };
  payerId: string;
  payerName: string;
  filedDate: string;
  surgeryDate: string;
  slaDeadline: string;
  assignedTo: string;
  requirements: PARequirementCategory[];
  evidence: PAEvidence[];
  identityResolution: IdentityResolution;
}

export interface PARequirementCategory {
  id: string;
  name: string;
  children: PARequirement[];
}

export interface PARequirement {
  id: string;
  categoryId: string;
  criterionText: string;
  status: 'met' | 'review' | 'missing';
  confidence?: number;
  linkedEvidenceIds: string[];
  highlightColor: string;
  semanticInference?: {
    sourceText: string;
    mappedConcept: string;
    explanation: string;
    alternatives: Array<{ concept: string; confidence: number }>;
  };
  missingExplanation?: string;
}

export interface PAEvidence {
  id: string;
  sourceSystemId: string;
  sourceSystemName: string;
  recordType: string;
  date: string;
  description: string;
  extractedValues?: Record<string, string>;
  confidence: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  linkedRequirementIds: string[];
  identityNote?: string;
}
