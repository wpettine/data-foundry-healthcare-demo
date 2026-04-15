export interface AIFinding {
  id: string;
  title: string;
  onsetDay: number;
  confidence: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  detectionMethod: string;
  signalContributions: SignalContribution[];
  knowledgeSources: KBSource[];
  differential: DifferentialItem[];
  clinicalCorrelates: Array<{ eventId: string; relationship: string }>;
  reasoningNarrative: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SignalContribution {
  signal: string;
  percentage: number;
  color: string;
  detail: string;
}

export interface KBSource {
  id: string;
  label: string;
  excerpt: string;
}

export interface DifferentialItem {
  condition: string;
  probability: 'high' | 'low';
  reasoning: string;
}

export interface PatientReasoningNarrative {
  patientId: string;
  narrative: string;
  lastUpdated: string;
}
