import { createContext, useContext, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ScenarioData } from './types';
import { SCENARIOS } from './manifest';
import { resetAllStores } from '../store/resetDemo';

const ScenarioContext = createContext<ScenarioData | null>(null);

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const demoId = searchParams.get('demo') || SCENARIOS[0]?.id || '';

  const activeScenario = useMemo(
    () => SCENARIOS.find((s) => s.id === demoId)?.data ?? SCENARIOS[0]?.data ?? null,
    [demoId]
  );

  useEffect(() => {
    resetAllStores();
    // Apply snapshot after reset if present
    const snapshotName = searchParams.get('snapshot');
    if (snapshotName && activeScenario?.storeSnapshots[snapshotName]) {
      // Snapshot application will be wired in Phase 7
    }
  }, [demoId, searchParams, activeScenario]);

  if (!activeScenario) {
    return <div className="p-8 text-red-600">No scenario loaded</div>;
  }

  return (
    <ScenarioContext.Provider value={activeScenario}>
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario(): ScenarioData {
  const ctx = useContext(ScenarioContext);
  if (!ctx) throw new Error('useScenario must be used within ScenarioProvider');
  return ctx;
}
