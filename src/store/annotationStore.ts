import { create } from 'zustand';

export type AnnotationTab = 'timeline' | 'events' | 'findings' | 'reasoning';

export interface AnnotationStoreState {
  selectedPatientId: string;
  approvedFindingIds: string[];
  rejectedFindingIds: string[];
  selectedFindingId: string | null;
  selectedEventId: string | null;
  activeTab: AnnotationTab;
  selectPatient: (id: string) => void;
  approveFinding: (id: string) => void;
  rejectFinding: (id: string) => void;
  setSelectedFinding: (id: string | null) => void;
  setSelectedEvent: (id: string | null) => void;
  setActiveTab: (tab: AnnotationTab) => void;
  reset: () => void;
}

const initialState = {
  selectedPatientId: '',
  approvedFindingIds: [] as string[],
  rejectedFindingIds: [] as string[],
  selectedFindingId: null,
  selectedEventId: null,
  activeTab: 'timeline' as AnnotationTab,
};

export const useAnnotationStore = create<AnnotationStoreState>()((set) => ({
  ...initialState,
  selectPatient: (id) => set({ selectedPatientId: id }),
  approveFinding: (id) =>
    set((state) => ({
      approvedFindingIds: [...state.approvedFindingIds, id],
      rejectedFindingIds: state.rejectedFindingIds.filter((fid) => fid !== id),
    })),
  rejectFinding: (id) =>
    set((state) => ({
      rejectedFindingIds: [...state.rejectedFindingIds, id],
      approvedFindingIds: state.approvedFindingIds.filter((fid) => fid !== id),
    })),
  setSelectedFinding: (id) => set({ selectedFindingId: id }),
  setSelectedEvent: (id) => set({ selectedEventId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  reset: () => set(initialState),
}));
