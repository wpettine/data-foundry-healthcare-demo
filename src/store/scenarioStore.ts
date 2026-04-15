import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ScenarioStoreState {
  scenarioId: string;
  setScenario: (id: string) => void;
}

export const useScenarioStore = create<ScenarioStoreState>()(
  persist(
    (set) => ({
      scenarioId: '',
      setScenario: (id) => set({ scenarioId: id }),
    }),
    {
      name: 'scenario-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
