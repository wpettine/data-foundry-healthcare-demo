import { create } from 'zustand';

export type AssemblyPhase = 'idle' | 'connecting' | 'resolving' | 'normalizing' | 'validating' | 'assembling' | 'complete';
export type FeatureCategory = 'all' | 'pre-op' | 'procedure' | 'post-op-biometric';

export interface ModelStoreState {
  excludedFeatureIds: string[];
  assemblyPhase: AssemblyPhase;
  selectedCategory: FeatureCategory;
  selectedFeatureId: string | null;
  expandedFeatureIds: string[];
  toggleFeature: (id: string) => void;
  startAssembly: () => void;
  advancePhase: () => void;
  setSelectedCategory: (category: FeatureCategory) => void;
  selectFeature: (id: string | null) => void;
  toggleFeatureExpansion: (id: string) => void;
  reset: () => void;
}

const PHASE_ORDER: AssemblyPhase[] = ['idle', 'connecting', 'resolving', 'normalizing', 'validating', 'assembling', 'complete'];

const initialState = {
  excludedFeatureIds: [] as string[],
  assemblyPhase: 'idle' as AssemblyPhase,
  selectedCategory: 'all' as FeatureCategory,
  selectedFeatureId: null as string | null,
  expandedFeatureIds: [] as string[],
};

export const useModelStore = create<ModelStoreState>()((set) => ({
  ...initialState,
  toggleFeature: (id) =>
    set((state) => ({
      excludedFeatureIds: state.excludedFeatureIds.includes(id)
        ? state.excludedFeatureIds.filter((fid) => fid !== id)
        : [...state.excludedFeatureIds, id],
    })),
  startAssembly: () => set({ assemblyPhase: 'connecting' }),
  advancePhase: () =>
    set((state) => {
      const idx = PHASE_ORDER.indexOf(state.assemblyPhase);
      const next = idx < PHASE_ORDER.length - 1 ? PHASE_ORDER[idx + 1] : state.assemblyPhase;
      return { assemblyPhase: next };
    }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  selectFeature: (id) => set({ selectedFeatureId: id }),
  toggleFeatureExpansion: (id) =>
    set((state) => ({
      expandedFeatureIds: state.expandedFeatureIds.includes(id)
        ? state.expandedFeatureIds.filter((fid) => fid !== id)
        : [...state.expandedFeatureIds, id],
    })),
  reset: () => set(initialState),
}));
