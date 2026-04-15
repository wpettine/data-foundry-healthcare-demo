import { create } from 'zustand';
import type { PARequirementCategory } from '../types/pa';

export interface PAStoreState {
  selectedCaseId: string | null;
  acceptedRequirementIds: string[];
  highlightedRequirementId: string | null;
  highlightedEvidenceId: string | null;
  evidenceView: 'cards' | 'timeline';
  bulkAcceptedCount: number;

  // Multi-select for worklist
  selectedRowIds: Set<string>;
  toggleRowSelection: (id: string) => void;
  clearSelection: () => void;

  // Worklist filtering
  filters: {
    savedView: string | null;
    searchTerm: string;
    payerId: string | null;
    statusFilter: 'all' | 'ready' | 'review' | 'incomplete' | 'at-risk';
    procedureFilter: string | null;
  };
  setFilter: (key: keyof PAStoreState['filters'], value: any) => void;
  clearFilters: () => void;

  // Accordion state for requirements panel
  expandedCategoryIds: Set<string>;
  toggleCategory: (id: string) => void;
  expandAllCategories: () => void;
  collapseAllCategories: () => void;
  autoExpandByPriority: (categories: PARequirementCategory[]) => void;

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
  selectedRowIds: new Set<string>(),
  filters: {
    savedView: null,
    searchTerm: '',
    payerId: null,
    statusFilter: 'all' as const,
    procedureFilter: null,
  },
  expandedCategoryIds: new Set<string>(),
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

  // Multi-select actions
  toggleRowSelection: (id) =>
    set((state) => {
      const newSet = new Set(state.selectedRowIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { selectedRowIds: newSet };
    }),
  clearSelection: () => set({ selectedRowIds: new Set<string>() }),

  // Filter actions
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  clearFilters: () =>
    set({
      filters: {
        savedView: null,
        searchTerm: '',
        payerId: null,
        statusFilter: 'all',
        procedureFilter: null,
      },
    }),

  // Accordion actions
  toggleCategory: (id) =>
    set((state) => {
      const newSet = new Set(state.expandedCategoryIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { expandedCategoryIds: newSet };
    }),
  expandAllCategories: () =>
    set((state) => {
      // This will be called with actual category IDs from the component
      return state;
    }),
  collapseAllCategories: () => set({ expandedCategoryIds: new Set<string>() }),
  autoExpandByPriority: (categories) =>
    set(() => {
      const toExpand = new Set<string>();
      categories.forEach((cat) => {
        const hasReviewOrMissing = cat.children.some(
          (req) => req.status === 'review' || req.status === 'missing'
        );
        if (hasReviewOrMissing) {
          toExpand.add(cat.id);
        }
      });
      return { expandedCategoryIds: toExpand };
    }),

  reset: () => set(initialState),
}));
