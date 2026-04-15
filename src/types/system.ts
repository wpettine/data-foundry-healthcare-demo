export type SystemCategory = 'ehr' | 'rehab' | 'ancillary';

export interface SourceSystem {
  id: string;
  name: string;
  platform: string;
  accentColor: string;
  systemCategory: SystemCategory;
  locationCount: number;
  fieldCount: number;
  annotationCompletion: number;
  lastSync: string;
  status: 'integrated' | 'review';
}

export interface SchemaAnnotation {
  id: string;
  systemId: string;
  sourceTable: string;
  sourceField: string;
  dataType: string;
  sampleValues: string[];
  mappedConceptId: string;
  mappedConceptLabel: string;
  confidence: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  status: 'auto-accepted' | 'pending-review' | 'manual';
  alternatives?: Array<{ conceptId: string; conceptLabel: string; confidence: number }>;
}
