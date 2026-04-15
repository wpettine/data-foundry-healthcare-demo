import { create } from 'zustand';

export interface PAStoreState {
  selectedCaseId: string | null;
  acceptedRequirementIds: string[];
  highlightedRequirementId: string | null;
  highlightedEvidenceId: string | null;
  evidenceView: 'cards' | 'timeline';
  bulkAcceptedCount: number;
  selectCase: (id: string) => void;
  acceptRequirement: (id: string) => void;
  setHighlightedRequirement: (id: string | null) => void;
  setHighlightedEvidence: (id: string | null) => void;
  setEvidenceView: (view: 'cards' | 'timeline') => void;
  bulkAcceptHigh: () => void;
  reset: () => void;
}

const initialState = {
  selectedCaseId: null,
  acceptedRequirementIds: [] as string[],
  highlightedRequirementId: null,
  highlightedEvidenceId: null,
  evidenceView: 'cards' as const,
  bulkAcceptedCount: 0,
};

export const usePAStore = create<PAStoreState>()((set) => ({
  ...initialState,
  selectCase: (id) => set({ selectedCaseId: id }),
  acceptRequirement: (id) =>
    set((state) => ({
      acceptedRequirementIds: [...state.acceptedRequirementIds, id],
    })),
  setHighlightedRequirement: (id) => set({ highlightedRequirementId: id }),
  setHighlightedEvidence: (id) => set({ highlightedEvidenceId: id }),
  setEvidenceView: (view) => set({ evidenceView: view }),
  bulkAcceptHigh: () =>
    set((state) => ({ bulkAcceptedCount: state.bulkAcceptedCount + 1 })),
  reset: () => set(initialState),
}));
