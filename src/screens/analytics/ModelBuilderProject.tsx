import { useEffect, useCallback, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { useScenario } from '../../scenarios/ScenarioContext';
import { MetricCard } from '../../components/data-display/MetricCard';
import { FeatureRow } from '../../components/data-display/FeatureRow';
import { LiteraturePanel } from '../../components/data-display/LiteraturePanel';
import { ProcessingOverlay } from '../../components/feedback/ProcessingOverlay';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import { SourceCategoryTabs } from '../../components/interactive/SourceCategoryTabs';
import ScreenContainer from '../../components/layout/ScreenContainer';
import { useModelStore, type FeatureCategory } from '../../store/modelStore';

const ASSEMBLY_PHASES = [
  'Connecting to sites',
  'Resolving identities',
  'Normalizing features',
  'Validating completeness',
  'Assembling dataset',
  'Complete',
];

const PHASE_MAP: Record<string, number> = {
  idle: -1,
  connecting: 0,
  resolving: 1,
  normalizing: 2,
  validating: 3,
  assembling: 4,
  complete: 5,
};

const CATEGORY_LABELS: Record<FeatureCategory, string> = {
  all: 'All',
  'pre-op': 'Pre-Op',
  procedure: 'Procedure',
  'post-op-biometric': 'Post-Op Biometrics',
};

const STATUS_CONFIG = {
  idle: { text: 'Ready to Assemble', variant: 'default' as const },
  connecting: { text: 'Assembling', variant: 'warning' as const },
  resolving: { text: 'Assembling', variant: 'warning' as const },
  normalizing: { text: 'Assembling', variant: 'warning' as const },
  validating: { text: 'Assembling', variant: 'warning' as const },
  assembling: { text: 'Assembling', variant: 'warning' as const },
  complete: { text: 'Dataset Assembled', variant: 'success' as const },
};

export default function ModelBuilderProject() {
  const { analytics } = useScenario();
  const navigate = useNavigate();
  const {
    excludedFeatureIds,
    assemblyPhase,
    selectedCategory,
    selectedFeatureId,
    expandedFeatureIds,
    toggleFeature,
    startAssembly,
    advancePhase,
    setSelectedCategory,
    selectFeature,
    toggleFeatureExpansion,
  } = useModelStore();

  // Auto-advance phases every 1.5s when assembly is running
  useEffect(() => {
    if (assemblyPhase === 'idle' || assemblyPhase === 'complete') return;

    const timer = setInterval(() => {
      advancePhase();
    }, 1500);

    return () => clearInterval(timer);
  }, [assemblyPhase, advancePhase]);

  const handleToggle = useCallback(
    (id: string) => {
      toggleFeature(id);
    },
    [toggleFeature],
  );

  const activeFeatures = useMemo(() => {
    if (!analytics) return [];
    let filtered = analytics.modelProject.features;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((f) => f.category === selectedCategory);
    }

    return filtered.map((f) => ({
      ...f,
      included: !excludedFeatureIds.includes(f.id),
    }));
  }, [analytics, excludedFeatureIds, selectedCategory]);

  if (!analytics) {
    return <Navigate to="/dashboard" replace />;
  }

  const { modelProject } = analytics;
  const currentPhaseIdx = PHASE_MAP[assemblyPhase] ?? -1;
  const isAssembling = assemblyPhase !== 'idle' && assemblyPhase !== 'complete';
  const { text: statusText, variant: statusVariant } = STATUS_CONFIG[assemblyPhase];

  return (
    <ScreenContainer>
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-gray-900">{modelProject.name}</h1>
        <StatusBadge status={statusText} variant={statusVariant} />
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {modelProject.targetVariable} &middot; {modelProject.population}
      </p>

      {/* Metric cards */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <MetricCard label="Eligible Cases" value={modelProject.eligibleCases.toLocaleString()} />
        <MetricCard
          label="Contributing Sites"
          value={`${modelProject.contributingSites}/${modelProject.totalSites}`}
        />
        <MetricCard
          label="Feature Completeness"
          value={`${modelProject.featureCompleteness}%`}
        />
        <MetricCard
          label="Cases with Biometrics"
          value={modelProject.casesWithBiometrics.toLocaleString()}
        />
      </div>

      {/* Category tabs */}
      <div className="mt-8">
        <SourceCategoryTabs
          categories={Object.values(CATEGORY_LABELS)}
          active={CATEGORY_LABELS[selectedCategory]}
          onChange={(label) => {
            const category = (Object.keys(CATEGORY_LABELS) as FeatureCategory[]).find(
              (key) => CATEGORY_LABELS[key] === label,
            );
            if (category) setSelectedCategory(category);
          }}
        />
      </div>

      {/* Feature list with resizable literature panel */}
      <section className="mt-6 h-[600px]">
        <PanelGroup>
          {/* Feature table panel */}
          <Panel defaultSize={selectedFeatureId ? 70 : 100} minSize={50}>
            <div className="h-full overflow-y-auto pr-2">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                  Features ({activeFeatures.filter((f) => f.included).length}/
                  {activeFeatures.length})
                </h2>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white">
                {/* Header row */}
                <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <span className="w-9">On</span>
                  <span className="flex-1">Feature</span>
                  <span>Sources</span>
                  <span className="w-16 text-center">Coverage</span>
                  <span className="w-20 text-center">Confidence</span>
                  <span className="w-12 text-center">Lit.</span>
                </div>
                {activeFeatures.map((feature) => (
                  <FeatureRow
                    key={feature.id}
                    feature={feature}
                    onToggle={() => handleToggle(feature.id)}
                    onSelect={() =>
                      selectFeature(feature.id === selectedFeatureId ? null : feature.id)
                    }
                    isSelected={selectedFeatureId === feature.id}
                    isExpanded={expandedFeatureIds.includes(feature.id)}
                    onToggleExpansion={() => toggleFeatureExpansion(feature.id)}
                  />
                ))}
              </div>
            </div>
          </Panel>

          {/* Resize handle (only show when panel open) */}
          {selectedFeatureId && (
            <>
              <PanelResizeHandle className="w-1.5 bg-gray-200 hover:bg-blue-400 transition-colors" />
              <Panel defaultSize={30} minSize={20}>
                <LiteraturePanel
                  feature={activeFeatures.find((f) => f.id === selectedFeatureId) ?? null}
                  onClose={() => selectFeature(null)}
                />
              </Panel>
            </>
          )}
        </PanelGroup>
      </section>

      {/* Action buttons */}
      <div className="mt-6 flex items-center gap-3">
        {assemblyPhase === 'idle' && (
          <button
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
            onClick={startAssembly}
          >
            Assemble Dataset
          </button>
        )}
        {assemblyPhase === 'complete' && (
          <button
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
            onClick={() => navigate('/model-builder/dataset')}
          >
            View Dataset
          </button>
        )}
      </div>

      {/* Processing overlay */}
      <ProcessingOverlay
        phases={ASSEMBLY_PHASES}
        currentPhase={currentPhaseIdx}
        isActive={isAssembling}
      />
    </ScreenContainer>
  );
}
