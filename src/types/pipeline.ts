export interface PipelineAlert {
  id: string;
  type: string;
  systemId: string;
  systemName: string;
  description: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  resolved: boolean;
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
