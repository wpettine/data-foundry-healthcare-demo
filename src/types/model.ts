export interface ModelProject {
  name: string;
  targetVariable: string;
  population: string;
  status: 'draft' | 'features-selected' | 'assembling' | 'assembled' | 'training';
  eligibleCases: number;
  contributingSites: number;
  totalSites: number;
  featureCompleteness: number;
  casesWithBiometrics: number;
  features: ModelFeature[];
}

export interface ModelFeature {
  id: string;
  name: string;
  category: 'pre-op' | 'procedure' | 'post-op-biometric';
  sources: string[];
  coverageSites: string;
  coverageCases: string;
  mappingConfidence: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  literatureCitations: LiteratureCitation[];
  included: boolean;
  normalizationNote?: string;
}

export interface LiteratureCitation {
  title: string;
  source: string;
  year: number;
  relevanceScore: number;
}

export interface TrainingRecord {
  id: string;
  patientId: string;
  siteId: string;
  features: Record<string, number | string | null>;
  outcome: 'complication' | 'no-complication';
  completeness: number;
}
