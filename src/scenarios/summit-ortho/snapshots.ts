import type { ScenarioSnapshot } from '../../types/scenario';

export const SNAPSHOTS: Record<string, ScenarioSnapshot> = {
  'day-22': {
    // Default state — no bulk accepts, no case selected, model idle
  },
  'pa-active': {
    paStore: {
      selectedCaseId: 'case-mk',
      evidenceView: 'cards',
      acceptedRequirementIds: [],
      bulkAcceptedCount: 0,
    },
  },
  'model-ready': {
    modelStore: {
      assemblyPhase: 'complete',
      excludedFeatureIds: [],
    },
    annotationStore: {
      selectedPatientId: 'patient-mk',
      activeTab: 'reasoning',
    },
  },
};
