import type { KPIReconciliation } from '../../types/kpi';

export interface KPISummaryRow {
  kpiId: string;
  kpiName: string;
  category: 'revenue' | 'cost' | 'operational';
  variantCount: number;
  localRange: string;
  canonicalValue: string;
  dollarImpact: number;
  dollarImpactDescription: string;
  canonicalDefinition: string;
  definitionVariants: KPIReconciliation['definitionVariants'];
}

export interface CascadeImpactRow {
  kpiId: string;
  kpiName: string;
  type: 'exhibit' | 'risk-flag' | 'integration-baseline';
  label: string;
  previousState: string;
  newState: string;
  detail?: string;
}

export function formatKpiValue(value: number, kpiId: string): string {
  if (kpiId === 'kpi-cost-per-claim') {
    return `$${value.toFixed(2)}`;
  }
  if (kpiId === 'kpi-provider-utilization') {
    return value.toLocaleString();
  }
  // Default: percentage
  return `${value.toFixed(1)}%`;
}

export function buildKPISummaryRows(reconciliations: KPIReconciliation[]): KPISummaryRow[] {
  return reconciliations.map((rec) => {
    const localValues = rec.definitionVariants.map((v) => v.valueUnderLocal);
    const min = Math.min(...localValues);
    const max = Math.max(...localValues);

    const localRange =
      min === max
        ? formatKpiValue(min, rec.kpiId)
        : `${formatKpiValue(min, rec.kpiId)} – ${formatKpiValue(max, rec.kpiId)}`;

    const canonicalValue = formatKpiValue(rec.integrationBaseline.value, rec.kpiId);

    return {
      kpiId: rec.kpiId,
      kpiName: rec.kpiName,
      category: rec.category,
      variantCount: rec.definitionVariants.length,
      localRange,
      canonicalValue,
      dollarImpact: rec.dollarImpact.amount,
      dollarImpactDescription: rec.dollarImpact.description,
      canonicalDefinition: rec.canonicalDefinition,
      definitionVariants: rec.definitionVariants,
    };
  });
}

export function buildCascadeImpactRows(reconciliations: KPIReconciliation[]): CascadeImpactRow[] {
  const rows: CascadeImpactRow[] = [];
  for (const rec of reconciliations) {
    for (const cascade of rec.downstreamCascade) {
      rows.push({
        kpiId: rec.kpiId,
        kpiName: rec.kpiName,
        type: cascade.type,
        label: cascade.label,
        previousState: cascade.previousState,
        newState: cascade.newState,
        detail: cascade.detail,
      });
    }
  }
  return rows;
}
