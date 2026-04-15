import { useScenario } from '../../scenarios/ScenarioContext';
import { ConceptDAG } from '../../components/visualization/ConceptDAG';

export default function ConceptMap() {
  const { schemaFields, systems } = useScenario();

  return (
    <div className="flex flex-col h-full px-8 py-6 max-w-[1400px]">
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-900">Clinical Concept Linkages</h1>
      </div>
      <div className="flex-1 min-h-0">
        <ConceptDAG schemaFields={schemaFields} systems={systems} />
      </div>
    </div>
  );
}
