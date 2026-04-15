import type { IdentityResolution } from './scenario';

export interface IdentitySystem {
  systemId: string;
  systemName: string;
  patientId: string;
  matchMethod: string;
  confidence: number;
  verified: string;
}

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
  requestNumber?: string;
  requirements: PARequirementCategory[];
  evidence: PAEvidence[];
  identityResolution: IdentityResolution;
  identityDetail?: {
    systems: IdentitySystem[];
  };
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
  systemType?: 'pcp-emr' | 'pt' | 'ortho-emr' | 'pharmacy' | 'radiology';
  recordType: string;
  date: string;
  description: string;
  extractedValues?: Record<string, string>;
  confidence: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  linkedRequirementIds: string[];
  identityNote?: string;
  facility?: string;
  recordDate?: string;
  documentType?: string;
  extractionDetails?: {
    extractionConfidence: number;
    semanticMatchConfidence: number;
    originalTextSnippet: string;
    highlightedSpans?: Array<{ start: number; end: number; field: string }>;
    historicalAccuracy: string;
  };
  eventType?: 'duration' | 'point';
  startDate?: string;
  endDate?: string;
}
