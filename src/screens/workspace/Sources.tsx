import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Network } from 'lucide-react';
import { useScenario } from '../../scenarios/ScenarioContext';
import { useSourcesStore } from '../../store/sourcesStore';
import { TopologyGraph } from '../../components/visualization/TopologyGraph';
import { FilterChips } from '../../components/interactive/FilterChips';
import { SystemsTable } from '../../components/data-display/SystemsTable';
import { SystemDetailPanel } from '../../components/data-display/SystemDetailPanel';
import ScreenContainer from '../../components/layout/ScreenContainer';
import { formatNumber, formatPercentage } from '../../utils/formatters';
import { getConfidenceTier, computeSystemFieldStats } from '../../utils/confidenceHelpers';
import type { CategoryFilter, StatusFilter, ConfidenceFilter } from '../../store/sourcesStore';

const CATEGORY_MAP: Record<string, string> = { EHR: 'ehr', Rehab: 'rehab', Ancillary: 'ancillary' };
const STATUS_MAP: Record<string, string> = { Connected: 'integrated', 'In Review': 'review' };

export default function Sources() {
  const { systems, schemaFields, dashboardSummary } = useScenario();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    activeView,
    categoryFilter,
    statusFilter,
    confidenceFilter,
    selectedSystemId,
    setActiveView,
    setCategoryFilter,
    setStatusFilter,
    setConfidenceFilter,
    selectSystem,
  } = useSourcesStore();

  // Filter systems for table view
  const filteredSystems = useMemo(() => {
    return systems.filter((s) => {
      if (categoryFilter !== 'All' && s.systemCategory !== CATEGORY_MAP[categoryFilter]) return false;
      if (statusFilter !== 'All' && s.status !== STATUS_MAP[statusFilter]) return false;
      if (confidenceFilter !== 'All' && getConfidenceTier(s.annotationCompletion) !== confidenceFilter.toLowerCase()) return false;
      return true;
    });
  }, [systems, categoryFilter, statusFilter, confidenceFilter]);

  // Resolve selected system
  const selectedSystem = useMemo(
    () => (selectedSystemId ? systems.find((s) => s.id === selectedSystemId) ?? null : null),
    [systems, selectedSystemId],
  );

  // Compute field stats for selected system
  const selectedFieldStats = useMemo(
    () => (selectedSystem ? computeSystemFieldStats(selectedSystem.id, schemaFields) : null),
    [selectedSystem, schemaFields],
  );

  // Architecture view: click node → schema explorer
  const handleTopologyNodeClick = useCallback(
    (nodeId: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('system', nodeId);
      navigate(`/schema-explorer?${params.toString()}`);
    },
    [navigate, searchParams],
  );

  // Toggle view
  const handleToggleView = useCallback(() => {
    setActiveView(activeView === 'systems' ? 'architecture' : 'systems');
  }, [activeView, setActiveView]);

  const filterGroups = useMemo(
    () => [
      {
        label: 'Category',
        options: ['All', 'EHR', 'Rehab', 'Ancillary'],
        active: categoryFilter,
        onChange: (v: string) => setCategoryFilter(v as CategoryFilter),
      },
      {
        label: 'Status',
        options: ['All', 'Connected', 'In Review'],
        active: statusFilter,
        onChange: (v: string) => setStatusFilter(v as StatusFilter),
      },
      {
        label: 'Confidence',
        options: ['All', 'High', 'Medium', 'Low'],
        active: confidenceFilter,
        onChange: (v: string) => setConfidenceFilter(v as ConfidenceFilter),
      },
    ],
    [categoryFilter, statusFilter, confidenceFilter, setCategoryFilter, setStatusFilter, setConfidenceFilter],
  );

  return (
    <ScreenContainer>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Sources</h1>
          <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
            <span>
              <span className="font-semibold text-gray-700">{dashboardSummary.totalSystems}</span>{' '}
              systems connected
            </span>
            <span className="text-gray-300">&middot;</span>
            <span>
              <span className="font-semibold text-gray-700">
                {formatNumber(dashboardSummary.totalFields)}
              </span>{' '}
              fields catalogued
            </span>
            <span className="text-gray-300">&middot;</span>
            <span>
              <span className="font-semibold text-gray-700">
                {formatPercentage(dashboardSummary.autoAnnotatedPercent)}
              </span>{' '}
              auto-annotated
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleView}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Network size={16} />
          {activeView === 'systems' ? 'View architecture' : 'Back to systems'}
        </button>
      </div>

      {/* Content */}
      {activeView === 'systems' ? (
        <>
          {/* Filter chips */}
          <div className="mb-3">
            <FilterChips groups={filterGroups} />
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <SystemsTable
              systems={filteredSystems}
              selectedSystemId={selectedSystemId}
              onSelectSystem={selectSystem}
            />
          </div>

          {/* Detail panel */}
          {selectedSystem && selectedFieldStats && (
            <SystemDetailPanel
              system={selectedSystem}
              fieldStats={selectedFieldStats}
              onClose={() => selectSystem(null)}
            />
          )}
        </>
      ) : (
        <div className="h-[calc(100vh-200px)] rounded-lg border border-gray-200 bg-white">
          <TopologyGraph systems={systems} onNodeClick={handleTopologyNodeClick} />
        </div>
      )}
    </ScreenContainer>
  );
}
