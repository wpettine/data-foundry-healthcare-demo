export interface KPIDefinitionVariant {
  systemId: string;
  systemName: string;
  definitionText: string;
  sourceFields: string[];
  valueUnderLocal: number;
  valueUnderCanonical: number;
}

export interface DownstreamCascadeItem {
  type: 'exhibit' | 'risk-flag' | 'integration-baseline';
  label: string;
  previousState: string;
  newState: string;
  detail?: string;
}

export interface KPIReconciliation {
  kpiId: string;
  kpiName: string;
  category: 'revenue' | 'cost' | 'operational';
  definitionVariants: KPIDefinitionVariant[];
  canonicalDefinition: string;
  downstreamCascade: DownstreamCascadeItem[];
  dollarImpact: { amount: number; description: string };
  integrationBaseline: { value: number; label: string };
}

export interface KPIDashboardData {
  kpiReconciliations: KPIReconciliation[];
}
