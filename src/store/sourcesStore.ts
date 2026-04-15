import { create } from 'zustand';

export type SourcesView = 'systems' | 'architecture';
export type CategoryFilter = 'All' | 'EHR' | 'Rehab' | 'Ancillary';
export type StatusFilter = 'All' | 'Connected' | 'In Review';
export type ConfidenceFilter = 'All' | 'High' | 'Medium' | 'Low';

interface SourcesStoreState {
  activeView: SourcesView;
  categoryFilter: CategoryFilter;
  statusFilter: StatusFilter;
  confidenceFilter: ConfidenceFilter;
  selectedSystemId: string | null;

  setActiveView: (view: SourcesView) => void;
  setCategoryFilter: (f: CategoryFilter) => void;
  setStatusFilter: (f: StatusFilter) => void;
  setConfidenceFilter: (f: ConfidenceFilter) => void;
  selectSystem: (id: string | null) => void;
  reset: () => void;
}

const initialState = {
  activeView: 'systems' as SourcesView,
  categoryFilter: 'All' as CategoryFilter,
  statusFilter: 'All' as StatusFilter,
  confidenceFilter: 'All' as ConfidenceFilter,
  selectedSystemId: null as string | null,
};

export const useSourcesStore = create<SourcesStoreState>()((set) => ({
  ...initialState,
  setActiveView: (view) => set({ activeView: view, selectedSystemId: null }),
  setCategoryFilter: (f) => set({ categoryFilter: f }),
  setStatusFilter: (f) => set({ statusFilter: f }),
  setConfidenceFilter: (f) => set({ confidenceFilter: f }),
  selectSystem: (id) => set({ selectedSystemId: id }),
  reset: () => set(initialState),
}));
