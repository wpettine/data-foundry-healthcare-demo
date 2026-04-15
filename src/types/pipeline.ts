export interface PipelineAlert {
  id: string;
  type: string;
  systemId: string;
  systemName: string;
  description: string;
  impact?: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  resolved: boolean;
  detail?: AlertDetail;
}

// Discriminated union for alert-type-specific details
export type AlertDetail = SchemaChangeDetail | CriteriaUpdateDetail;

export interface SchemaChangeDetail {
  type: 'schema-change';
  fieldBefore: string;
  fieldAfter: string;
  affectedMappings: Array<{
    conceptId: string;
    conceptLabel: string;
    confidence: number;
  }>;
  autoRemapped: boolean;
  remappingConfidence?: number;
}

export interface CriteriaUpdateDetail {
  type: 'criteria-update';
  payerName: string;
  criterionName: string;
  valueBefore: string;
  valueAfter: string;
  affectedCases: number;
  effectiveDate: string;
}

export interface SchemaChange {
  fieldId: string;
  changeType: 'added' | 'removed' | 'modified';
  oldValue?: string;
  newValue?: string;
}

export interface CriteriaUpdate {
  payerId: string;
  criterionName: string;
  changeDescription: string;
  effectiveDate: string;
}
