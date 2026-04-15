import type { SchemaAnnotation } from '../types/system';

const HIGH_THRESHOLD = 85;
const MEDIUM_THRESHOLD = 60;

export function getConfidenceTier(annotationCompletion: number): 'high' | 'medium' | 'low' {
  if (annotationCompletion >= HIGH_THRESHOLD) return 'high';
  if (annotationCompletion >= MEDIUM_THRESHOLD) return 'medium';
  return 'low';
}

export interface TableFieldStats {
  table: string;
  fieldCount: number;
  avgConfidence: number;
  autoAccepted: number;
  pendingReview: number;
  manual: number;
}

export interface SystemFieldStats {
  totalFields: number;
  autoAccepted: number;
  pendingReview: number;
  manual: number;
  avgConfidence: number;
  byTable: TableFieldStats[];
}

export function computeSystemFieldStats(
  systemId: string,
  schemaFields: SchemaAnnotation[],
): SystemFieldStats {
  const fields = schemaFields.filter((f) => f.systemId === systemId);

  if (fields.length === 0) {
    return {
      totalFields: 0,
      autoAccepted: 0,
      pendingReview: 0,
      manual: 0,
      avgConfidence: 0,
      byTable: [],
    };
  }

  let autoAccepted = 0;
  let pendingReview = 0;
  let manual = 0;
  let confidenceSum = 0;

  const tableMap = new Map<string, SchemaAnnotation[]>();

  for (const f of fields) {
    if (f.status === 'auto-accepted') autoAccepted++;
    else if (f.status === 'pending-review') pendingReview++;
    else manual++;

    confidenceSum += f.confidence;

    const existing = tableMap.get(f.sourceTable);
    if (existing) existing.push(f);
    else tableMap.set(f.sourceTable, [f]);
  }

  const byTable: TableFieldStats[] = [];
  for (const [table, tableFields] of tableMap) {
    let tAuto = 0;
    let tReview = 0;
    let tManual = 0;
    let tConfSum = 0;

    for (const tf of tableFields) {
      if (tf.status === 'auto-accepted') tAuto++;
      else if (tf.status === 'pending-review') tReview++;
      else tManual++;
      tConfSum += tf.confidence;
    }

    byTable.push({
      table,
      fieldCount: tableFields.length,
      avgConfidence: Math.round(tConfSum / tableFields.length),
      autoAccepted: tAuto,
      pendingReview: tReview,
      manual: tManual,
    });
  }

  byTable.sort((a, b) => b.fieldCount - a.fieldCount);

  return {
    totalFields: fields.length,
    autoAccepted,
    pendingReview,
    manual,
    avgConfidence: Math.round(confidenceSum / fields.length),
    byTable,
  };
}
