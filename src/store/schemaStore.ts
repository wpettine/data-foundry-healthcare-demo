import { create } from 'zustand';

export interface SchemaFilters {
  system: string;
  status: string;
  confidence: string;
}

export interface SchemaStoreState {
  acceptedFieldIds: string[];
  bulkAccepted: boolean;
  filters: SchemaFilters;
  selectedFieldId: string | null;
  acceptField: (id: string) => void;
  bulkAcceptHigh: () => void;
  setFilter: (key: keyof SchemaFilters, value: string) => void;
  setSelectedFieldId: (id: string | null) => void;
  reset: () => void;
}

const initialState = {
  acceptedFieldIds: [] as string[],
  bulkAccepted: false,
  filters: { system: 'all', status: 'all', confidence: 'all' } as SchemaFilters,
  selectedFieldId: null as string | null,
};

export const useSchemaStore = create<SchemaStoreState>()((set) => ({
  ...initialState,
  acceptField: (id) =>
    set((state) => ({
      acceptedFieldIds: [...state.acceptedFieldIds, id],
    })),
  bulkAcceptHigh: () => set({ bulkAccepted: true }),
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  setSelectedFieldId: (id) => set({ selectedFieldId: id }),
  reset: () => set(initialState),
}));
