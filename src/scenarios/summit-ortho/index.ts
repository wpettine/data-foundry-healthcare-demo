import { COMPANY, DEAL_TIMER, SCHEMA_COUNTS } from './_constants';
import type { ScenarioData } from '../types';
import { SYSTEMS, TOPOLOGY_CONFIG } from './systems';
import { SCHEMA_FIELDS } from './schema-fields';
import { PATIENTS } from './patients';
import { PA_CASES } from './pa-cases';
import { PAYER_CRITERIA_SET } from './payer-criteria';
import { MODEL_PROJECT } from './model-features';
import { TRAINING_DATA } from './training-data';
import { BIOMETRIC_STREAMS } from './biometric-streams';
import { CLINICAL_EVENTS } from './clinical-events';
import { AI_FINDINGS } from './ai-findings';
import { PATIENT_REASONING_NARRATIVES } from './patient-reasoning';
import { PIPELINE_ALERTS } from './pipeline-alerts';
import { SNAPSHOTS } from './snapshots';
import { KPI_RECONCILIATIONS } from './kpi-reconciliations';

export const summitOrthoData: ScenarioData = {
  id: 'summit-ortho',
  company: { name: COMPANY.name, industry: COMPANY.industry, locationCount: COMPANY.locationCount },
  dealTimer: { ...DEAL_TIMER },
  dashboardSummary: {
    totalSystems: SCHEMA_COUNTS.totalSystems,
    totalFields: SCHEMA_COUNTS.totalFields,
    autoAnnotatedPercent: SCHEMA_COUNTS.autoAnnotated,
    payerCriteriaSets: SCHEMA_COUNTS.payerCriteriaSets,
  },
  systems: SYSTEMS,
  schemaFields: SCHEMA_FIELDS,
  topology: TOPOLOGY_CONFIG,
  pipelineAlerts: PIPELINE_ALERTS,
  storeSnapshots: SNAPSHOTS,
  paWorkbench: { patients: PATIENTS, cases: PA_CASES },
  payerCriteria: PAYER_CRITERIA_SET,
  analytics: {
    modelProject: MODEL_PROJECT,
    trainingData: TRAINING_DATA,
    biometricStreams: BIOMETRIC_STREAMS,
    clinicalEvents: CLINICAL_EVENTS,
    aiFindings: AI_FINDINGS,
    patientReasoningNarratives: PATIENT_REASONING_NARRATIVES,
  },
  kpiDashboard: {
    kpiReconciliations: KPI_RECONCILIATIONS,
  },
};
