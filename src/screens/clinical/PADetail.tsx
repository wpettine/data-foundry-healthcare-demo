import { useMemo, useState } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { useScenario } from '../../scenarios/ScenarioContext';
import { PatientInfoPanel } from '../../components/clinical/PatientInfoPanel';
import { EvidenceCard } from '../../components/data-display/EvidenceCard';
import { StackedProgressBar } from '../../components/data-display/StackedProgressBar';
import { AccordionChecklist } from '../../components/interactive/AccordionChecklist';
import { ViewToggle } from '../../components/interactive/ViewToggle';
import { SourceCategoryTabs } from '../../components/interactive/SourceCategoryTabs';
import { SwimLaneTimeline } from '../../components/visualization/SwimLaneTimeline';
import { usePAStore } from '../../store/paStore';

export default function PADetail() {
  const { paWorkbench } = useScenario();
  const { caseId } = useParams<{ caseId: string }>();
  const [searchParams] = useSearchParams();

  const evidenceView = usePAStore((s) => s.evidenceView);
  const setEvidenceView = usePAStore((s) => s.setEvidenceView);
  const highlightedRequirementId = usePAStore((s) => s.highlightedRequirementId);
  const highlightedEvidenceId = usePAStore((s) => s.highlightedEvidenceId);
  const setHighlightedRequirement = usePAStore((s) => s.setHighlightedRequirement);
  const setHighlightedEvidence = usePAStore((s) => s.setHighlightedEvidence);
  const acceptRequirement = usePAStore((s) => s.acceptRequirement);

  const [activeSourceTab, setActiveSourceTab] = useState('All');

  if (!paWorkbench) {
    return <Navigate to="/dashboard" replace />;
  }

  const paCase = paWorkbench.cases.find((c) => c.id === caseId)!;
  if (!paCase) {
    const params = searchParams.toString();
    return <Navigate to={`/pa-worklist${params ? `?${params}` : ''}`} replace />;
  }

  const patient = paWorkbench.patients.find((p) => p.id === paCase.patientId);
  if (!patient) {
    return <Navigate to="/dashboard" replace />;
  }

  // Derive source categories from evidence
  const sourceCategories = useMemo(() => {
    const systemNames = new Set(paCase.evidence.map((e) => e.sourceSystemName));
    return ['All', ...Array.from(systemNames).sort()];
  }, [paCase.evidence]);

  // Filter evidence by active source tab
  const filteredEvidence = useMemo(() => {
    if (activeSourceTab === 'All') return paCase.evidence;
    return paCase.evidence.filter((e) => e.sourceSystemName === activeSourceTab);
  }, [paCase.evidence, activeSourceTab]);

  // Evidence highlighted when linked to selected requirement
  const highlightedEvidenceIds = useMemo(() => {
    if (!highlightedRequirementId) return new Set<string>();
    const ids = new Set<string>();
    for (const ev of paCase.evidence) {
      if (ev.linkedRequirementIds.includes(highlightedRequirementId)) {
        ids.add(ev.id);
      }
    }
    return ids;
  }, [highlightedRequirementId, paCase.evidence]);

  // Progress bar segments
  const allReqs = paCase.requirements.flatMap((cat) => cat.children);
  const met = allReqs.filter((r) => r.status === 'met').length;
  const review = allReqs.filter((r) => r.status === 'review').length;
  const missing = allReqs.filter((r) => r.status === 'missing').length;
  const total = met + review + missing;

  const progressSegments = [
    { value: met, color: '#059669', label: 'Met' },
    { value: review, color: '#D97706', label: 'Review' },
    { value: missing, color: '#D1D5DB', label: 'Missing' },
  ];

  function handleRequirementSelect(id: string) {
    // Toggle: if already highlighted, clear it
    if (highlightedRequirementId === id) {
      setHighlightedRequirement(null);
      setHighlightedEvidence(null);
    } else {
      setHighlightedRequirement(id);
      setHighlightedEvidence(null);
    }
  }

  function handleEvidenceSelect(evidenceId: string) {
    // Set highlighted evidence; find and highlight linked requirement
    if (highlightedEvidenceId === evidenceId) {
      setHighlightedEvidence(null);
      setHighlightedRequirement(null);
    } else {
      setHighlightedEvidence(evidenceId);
      const ev = paCase.evidence.find((e) => e.id === evidenceId);
      if (ev && ev.linkedRequirementIds.length > 0) {
        setHighlightedRequirement(ev.linkedRequirementIds[0]);
      }
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {paCase.procedure.description} ({paCase.procedure.laterality})
            </h1>
            <p className="text-sm text-gray-500">
              {patient.initials} &middot; {paCase.payerName} &middot; Filed {paCase.filedDate}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-48">
              <StackedProgressBar segments={progressSegments} total={total} />
            </div>
          </div>
        </div>
      </div>

      {/* Three-panel layout */}
      <PanelGroup className="flex-1">
        {/* Left: Patient Context */}
        <Panel defaultSize={25} minSize={15}>
          <div className="h-full overflow-y-auto border-r border-gray-200 bg-gray-50 p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Patient Context
            </h2>
            <PatientInfoPanel patient={patient} />

            {/* Identity Resolution Summary */}
            <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Identity Resolution
              </h3>
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-gray-500">Method</span>
                  <span className="font-[JetBrains_Mono] text-gray-900">
                    {paCase.identityResolution.matchMethod}
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-gray-500">Confidence</span>
                  <span className="font-[JetBrains_Mono] text-gray-900">
                    {paCase.identityResolution.matchConfidence}%
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-gray-500">Systems Matched</span>
                  <span className="font-[JetBrains_Mono] text-gray-900">
                    {paCase.identityResolution.matchedSystems.length}
                  </span>
                </div>
                {paCase.identityResolution.matchedSystems.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {paCase.identityResolution.matchedSystems.map((sys) => (
                      <span
                        key={sys}
                        className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600"
                      >
                        {sys}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-blue-300 transition-colors" />

        {/* Center: Evidence */}
        <Panel defaultSize={40} minSize={25}>
          <div className="flex h-full flex-col overflow-y-auto bg-white">
            {/* Evidence toolbar */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Evidence
              </h2>
              <ViewToggle
                options={['Cards', 'Timeline']}
                active={evidenceView === 'cards' ? 'Cards' : 'Timeline'}
                onChange={(v) => setEvidenceView(v === 'Cards' ? 'cards' : 'timeline')}
              />
            </div>

            {evidenceView === 'cards' && (
              <>
                <SourceCategoryTabs
                  categories={sourceCategories}
                  active={activeSourceTab}
                  onChange={setActiveSourceTab}
                />
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {filteredEvidence.map((ev) => (
                    <EvidenceCard
                      key={ev.id}
                      evidence={ev}
                      isHighlighted={
                        highlightedEvidenceIds.has(ev.id) || highlightedEvidenceId === ev.id
                      }
                      onSelect={() => handleEvidenceSelect(ev.id)}
                    />
                  ))}
                  {filteredEvidence.length === 0 && (
                    <p className="py-8 text-center text-sm text-gray-400">
                      No evidence in this category
                    </p>
                  )}
                </div>
              </>
            )}

            {evidenceView === 'timeline' && (
              <div className="flex-1 overflow-y-auto p-4">
                <SwimLaneTimeline
                  evidence={paCase.evidence}
                  requirements={paCase.requirements}
                  highlightedRequirementId={highlightedRequirementId}
                  onEvidenceSelect={handleEvidenceSelect}
                />
              </div>
            )}
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-blue-300 transition-colors" />

        {/* Right: Requirements */}
        <Panel defaultSize={35} minSize={20}>
          <div className="flex h-full flex-col overflow-y-auto bg-gray-50">
            <div className="border-b border-gray-200 px-4 py-3">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Requirements
              </h2>
              <StackedProgressBar segments={progressSegments} total={total} />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <AccordionChecklist
                categories={paCase.requirements}
                highlightedId={highlightedRequirementId}
                onAcceptRequirement={acceptRequirement}
                onSelectRequirement={handleRequirementSelect}
              />
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
