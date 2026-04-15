import { create } from 'zustand';

interface CascadeFilters {
  kpi: 'all' | string;
  type: 'all' | 'exhibit' | 'risk-flag' | 'integration-baseline';
}

interface KPIStoreState {
  kpisReconciled: string[];
  cascadeFilters: CascadeFilters;
  reconcileKpi: (kpiId: string) => void;
  setCascadeFilter: (key: keyof CascadeFilters, value: string) => void;
  reset: () => void;
}

const initialState = {
  kpisReconciled: [] as string[],
  cascadeFilters: { kpi: 'all' as const, type: 'all' as const },
};

export const useKPIStore = create<KPIStoreState>((set) => ({
  ...initialState,

  reconcileKpi: (kpiId: string) =>
    set((state) => ({
      kpisReconciled: state.kpisReconciled.includes(kpiId)
        ? state.kpisReconciled
        : [...state.kpisReconciled, kpiId],
    })),

  setCascadeFilter: (key, value) =>
    set((state) => ({
      cascadeFilters: { ...state.cascadeFilters, [key]: value },
    })),

  reset: () => set(initialState),
}));
