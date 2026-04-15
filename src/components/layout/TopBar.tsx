import { useScenario } from '../../scenarios/ScenarioContext';

export default function TopBar() {
  const scenario = useScenario();

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center px-6 gap-6 shrink-0">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Data Foundry" className="h-8 w-8" />
        <span className="font-semibold text-gray-900">Data Foundry</span>
      </div>
      <div className="text-sm text-gray-500">{scenario.company.name}</div>
    </header>
  );
}
