import type { PAEvidence } from '../types/pa';
import { LINKING_COLORS } from '../scenarios/summit-ortho/_constants';

export interface DerivedFieldExtraction {
  fieldName: string;
  value: string;
  confidence: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  startChar: number;
  endChar: number;
  highlightColor: string;
}

/**
 * Simple hash function for deterministic jitter in confidence scores
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Derive per-field confidence from overall confidence with deterministic jitter
 */
function deriveFieldConfidence(
  overallConf: number,
  evidenceId: string,
  fieldName: string
): number {
  const hash = simpleHash(`${evidenceId}-${fieldName}`);
  const jitterRange = overallConf >= 95 ? 4 : 8;
  const jitter = (hash % (jitterRange * 2)) - jitterRange;
  return Math.max(75, Math.min(100, overallConf + jitter));
}

/**
 * Get confidence level badge from numeric confidence
 */
function getConfidenceLevel(confidence: number): 'high' | 'medium' | 'low' {
  if (confidence >= 95) return 'high';
  if (confidence >= 85) return 'medium';
  return 'low';
}

/**
 * Derive field extractions with spans, colors, and per-field confidence from evidence
 */
export function deriveFieldExtractions(evidence: PAEvidence): DerivedFieldExtraction[] {
  const extractions: DerivedFieldExtraction[] = [];
  const text = evidence.description;
  const colors = LINKING_COLORS;

  if (!evidence.extractedValues) return [];

  Object.entries(evidence.extractedValues).forEach(([fieldName, value], idx) => {
    const startChar = text.indexOf(value);
    if (startChar === -1) {
      // Value not found in text - add extraction but with no span position
      // This will be handled in the UI by showing the field in right panel only
      extractions.push({
        fieldName,
        value,
        confidence: deriveFieldConfidence(evidence.confidence, evidence.id, fieldName),
        confidenceLevel: getConfidenceLevel(
          deriveFieldConfidence(evidence.confidence, evidence.id, fieldName)
        ),
        startChar: -1,
        endChar: -1,
        highlightColor: colors[idx % colors.length],
      });
      return;
    }

    const endChar = startChar + value.length;
    const confidence = deriveFieldConfidence(evidence.confidence, evidence.id, fieldName);

    extractions.push({
      fieldName,
      value,
      confidence,
      confidenceLevel: getConfidenceLevel(confidence),
      startChar,
      endChar,
      highlightColor: colors[idx % colors.length],
    });
  });

  // Sort by startChar for proper rendering order (fields not found go to end)
  return extractions.sort((a, b) => {
    if (a.startChar === -1) return 1;
    if (b.startChar === -1) return -1;
    return a.startChar - b.startChar;
  });
}
