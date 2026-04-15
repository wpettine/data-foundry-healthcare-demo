import type { SourceSystem, SchemaAnnotation } from './system';
import type { Patient } from './patient';
import type { PACase } from './pa';
import type { PayerCriteria, PayerDivergence } from './payer';
import type { ModelProject, TrainingRecord } from './model';
import type { BiometricStreamSet, ClinicalEvent } from './clinical';
import type { AIFinding, PatientReasoningNarrative } from './annotation';
import type { PipelineAlert } from './pipeline';
import type { KPIDashboardData } from './kpi';

export interface ScenarioData {
  id: string;
  company: CompanyInfo;
  dealTimer: DealTimerConfig;

  // Core — required for all scenarios
  dashboardSummary: DashboardSummary;
  systems: SourceSystem[];
  schemaFields: SchemaAnnotation[];
  topology: TopologyConfig;
  pipelineAlerts: PipelineAlert[];
  storeSnapshots: Record<string, ScenarioSnapshot>;

  // Optional modules — null if the scenario doesn't support them
  paWorkbench: PAWorkbenchData | null;
  payerCriteria: PayerCriteriaSet | null;
  analytics: AnalyticsModuleData | null;
  kpiDashboard: KPIDashboardData | null;
}

export interface DashboardSummary {
  totalSystems: number;
  totalFields: number;
  autoAnnotatedPercent: number;
  payerCriteriaSets: number;
}

export interface PAWorkbenchData {
  patients: Patient[];
  cases: PACase[];
}

export interface AnalyticsModuleData {
  modelProject: ModelProject;
  trainingData: TrainingRecord[];
  biometricStreams: BiometricStreamSet;
  clinicalEvents: ClinicalEvent[];
  aiFindings: AIFinding[];
  patientReasoningNarratives: PatientReasoningNarrative[];
}

export interface CompanyInfo {
  name: string;
  industry: string;
  locationCount: number;
}

export interface DealTimerConfig {
  currentDay: number;
  totalDays: number;
  label: string;
}

export interface TopologyConfig {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
}

export interface TopologyNode {
  id: string;
  type?: 'hub' | 'system';
  label: string;
  platform: string;
  accentColor: string;
  position?: { x: number; y: number };
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface PayerCriteriaSet {
  patientId: string; // Single patient being evaluated
  procedureType: string; // Procedure requiring authorization (e.g., "TKA")
  payers: PayerCriteria[];
  procedures: string[]; // Kept for backward compatibility
  divergences: PayerDivergence[];
  patients: Patient[]; // Patient lookup (typically contains just the evaluated patient)
}

export interface ScenarioSnapshot {
  paStore?: Record<string, unknown>;
  schemaStore?: Record<string, unknown>;
  modelStore?: Record<string, unknown>;
  annotationStore?: Record<string, unknown>;
}

export interface IdentityResolution {
  matchedSystems: string[];
  matchMethod: string;
  matchConfidence: number;
  conflictingFields?: Array<{ field: string; values: Record<string, string> }>;
}
