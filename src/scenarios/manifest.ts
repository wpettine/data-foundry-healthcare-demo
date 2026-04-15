import type { ScenarioData } from './types';
import { summitOrthoData } from './summit-ortho';

export const SCENARIOS: Array<{ id: string; data: ScenarioData }> = [
  { id: 'summit-ortho', data: summitOrthoData },
];
