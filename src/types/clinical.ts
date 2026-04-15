export interface BiometricStreamSet {
  temperature: BiometricChannel;
  heartRate: BiometricChannel;
}

export interface BiometricChannel {
  label: string;
  unit: string;
  color: string;
  actual: TimeSeriesPoint[];
  expected: TimeSeriesPoint[];
  confidenceBand: { upper: TimeSeriesPoint[]; lower: TimeSeriesPoint[] };
  changePoints: ChangePoint[];
  anomalyRegions: Array<{ startDay: number; endDay: number }>;
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number | null;
}

export interface ChangePoint {
  day: number;
  posteriorProbability: number;
  method: string;
  expectedValue: number;
  observedValue: number;
  unit: string;
}

export interface ClinicalEvent {
  id: string;
  day: number;
  type: string;
  title: string;
  description: string;
  sourceSystemId: string;
  icon: string;
  knowledgeContext?: string;
}
