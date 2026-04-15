import { create } from 'zustand';

export type AssemblyPhase = 'idle' | 'connecting' | 'resolving' | 'normalizing' | 'validating' | 'assembling' | 'complete';

export interface ModelStoreState {
  excludedFeatureIds: string[];
  assemblyPhase: AssemblyPhase;
  toggleFeature: (id: string) => void;
  startAssembly: () => void;
  advancePhase: () => void;
  reset: () => void;
}

const PHASE_ORDER: AssemblyPhase[] = ['idle', 'connecting', 'resolving', 'normalizing', 'validating', 'assembling', 'complete'];

const initialState = {
  excludedFeatureIds: [] as string[],
  assemblyPhase: 'idle' as AssemblyPhase,
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
  reset: () => set(initialState),
}));
