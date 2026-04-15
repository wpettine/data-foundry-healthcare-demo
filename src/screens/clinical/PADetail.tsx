import { useMemo, useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { ArrowLeft } from 'lucide-react';
import { useScenario } from '../../scenarios/ScenarioContext';
import { PatientInfoPanel } from '../../components/clinical/PatientInfoPanel';
import { PASummarySection } from '../../components/clinical/PASummarySection';
import { IdentityResolutionTable } from '../../components/clinical/IdentityResolutionTable';
import { IdentityResolutionBadge } from '../../components/feedback/IdentityResolutionBadge';
import { EvidenceCard } from '../../components/data-display/EvidenceCard';
import { StackedProgressBar } from '../../components/data-display/StackedProgressBar';
import { AccordionChecklist } from '../../components/interactive/AccordionChecklist';
import { ViewToggle } from '../../components/interactive/ViewToggle';
import { SourceCategoryTabs } from '../../components/interactive/SourceCategoryTabs';
import { SwimLaneTimeline } from '../../components/visualization/SwimLaneTimeline';
import { Toast } from '../../components/feedback/Toast';
import { usePAStore } from '../../store/paStore';

export default function PADetail() {
  const { paWorkbench } = useScenario();
  const { caseId } = useParams<{ caseId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const evidenceView = usePAStore((s) => s.evidenceView);
  const setEvidenceView = usePAStore((s) => s.setEvidenceView);
  const highlightedRequirementId = usePAStore((s) => s.highlightedRequirementId);
  const highlightedEvidenceId = usePAStore((s) => s.highlightedEvidenceId);
  const setHighlightedRequirement = usePAStore((s) => s.setHighlightedRequirement);
  const setHighlightedEvidence = usePAStore((s) => s.setHighlightedEvidence);
  const acceptRequirement = usePAStore((s) => s.acceptRequirement);
  const acceptedRequirementIds = usePAStore((s) => s.acceptedRequirementIds);

  const [activeSourceTab, setActiveSourceTab] = useState('All');
  const [toast, setToast] = useState<{ message: string; onUndo?: () => void } | null>(null);

  const evidencePanelRef = useRef<HTMLDivElement>(null);
  const requirementsPanelRef = useRef<HTMLDivElement>(null);

  if (!paWorkbench) {
    return <Navigate to="/dashboard" replace />;
  }

  const paCase = paWorkbench.cases.find((c) => c.id === caseId)!;
  if (!paCase) {
    const params = searchParams.toString();
    return <Navigate to={`/pa-workbench${params ? `?${params}` : ''}`} replace />;
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

  // Smooth scroll to first matching evidence when requirement selected
  useEffect(() => {
    if (highlightedRequirementId && evidencePanelRef.current && highlightedEvidenceIds.size > 0) {
      const firstMatchId = Array.from(highlightedEvidenceIds)[0];
      const element = evidencePanelRef.current.querySelector(`[data-evidence-id="${firstMatchId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedRequirementId, highlightedEvidenceIds]);

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

  // Calculate submit button state
  const canSubmit = met === total || (met + acceptedRequirementIds.length >= total);
  const missingCount = missing + (review - acceptedRequirementIds.filter(id =>
    allReqs.find(r => r.id === id && r.status === 'review')
  ).length);

  // Count high-confidence review items
  const highConfidenceReviewCount = allReqs.filter(
    (r) =>
      r.status === 'review' &&
      !acceptedRequirementIds.includes(r.id) &&
      r.linkedEvidenceIds.length > 0 &&
      r.linkedEvidenceIds.every((evId) => {
        const ev = paCase.evidence.find((e) => e.id === evId);
        return ev && ev.confidence >= 0.95;
      })
  ).length;

  function handleAcceptAllHigh() {
    const toAccept = allReqs.filter(
      (r) =>
        r.status === 'review' &&
        !acceptedRequirementIds.includes(r.id) &&
        r.linkedEvidenceIds.length > 0 &&
        r.linkedEvidenceIds.every((evId) => {
          const ev = paCase.evidence.find((e) => e.id === evId);
          return ev && ev.confidence >= 0.95;
        })
    );
    toAccept.forEach((r) => acceptRequirement(r.id));
    setToast({
      message: `${toAccept.length} high-confidence requirements accepted`,
      onUndo: () => {
        // TODO: Implement undo logic
        console.log('Undo accept all high');
      },
    });
  }

  function handleAcceptSingle(id: string) {
    acceptRequirement(id);
    const req = allReqs.find((r) => r.id === id);
    setToast({
      message: `Requirement accepted${req ? `: ${req.criterionText.substring(0, 40)}...` : ''}`,
      onUndo: () => {
        // TODO: Implement undo logic
        console.log('Undo accept:', id);
      },
    });
  }

  // Format patient info for header
  const patientAge = patient.age;
  const patientSex = patient.sex;
  const patientDOB = new Date(patient.dateOfBirth).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className="flex h-full flex-col">
      {/* Enhanced Header */}
      <div className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/pa-workbench')}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="h-8 w-px bg-gray-200" />
          <div className="flex flex-col gap-1">
            <h1 className="text-base font-semibold text-gray-900">
              {patient.initials}, {patientAge}{patientSex} | DOB {patientDOB} | {paCase.procedure.cpt} {paCase.procedure.description} ({paCase.procedure.laterality})
            </h1>
            <p className="text-sm text-gray-500">
              {paCase.payerName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <IdentityResolutionBadge
            systemCount={paCase.identityResolution.matchedSystems.length}
            confidence={paCase.identityResolution.matchConfidence}
          />
          <button
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Save Draft
          </button>
          <button
            disabled={!canSubmit}
            title={!canSubmit ? `${missingCount} requirements incomplete` : undefined}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit to {paCase.payerName}
          </button>
        </div>
      </div>

      {/* Three-panel layout */}
      <PanelGroup className="flex-1">
        {/* Left: Patient Context */}
        <Panel defaultSize={25} minSize={15}>
          <div className="h-full space-y-4 overflow-y-auto border-r border-gray-200 bg-gray-50 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Patient Context
            </h2>

            {/* Patient Demographics */}
            <PatientInfoPanel patient={patient} />

            {/* PA Request Summary */}
            {paCase.requestNumber && (
              <PASummarySection
                requestNumber={paCase.requestNumber}
                filedDate={paCase.filedDate}
                procedure={`${paCase.procedure.cpt} ${paCase.procedure.description} (${paCase.procedure.laterality})`}
                payerName={paCase.payerName}
                assignedTo={paCase.assignedTo}
              />
            )}

            {/* Identity Resolution Detail */}
            {paCase.identityDetail && (
              <IdentityResolutionTable
                matchedSystemsCount={paCase.identityResolution.matchedSystems.length}
                overallConfidence={paCase.identityResolution.matchConfidence}
                matchMethod={paCase.identityResolution.matchMethod}
                systems={paCase.identityDetail.systems}
              />
            )}
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
                <div ref={evidencePanelRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                  {filteredEvidence.map((ev) => {
                    const isHighlighted = highlightedEvidenceIds.has(ev.id) || highlightedEvidenceId === ev.id;
                    const linkedReq = highlightedRequirementId
                      ? paCase.requirements.flatMap(cat => cat.children).find(r => r.id === highlightedRequirementId)
                      : null;
                    const highlightColor = linkedReq?.highlightColor;
                    const isDimmed = highlightedRequirementId ? !highlightedEvidenceIds.has(ev.id) && highlightedEvidenceId !== ev.id : false;

                    return (
                      <div key={ev.id} data-evidence-id={ev.id}>
                        <EvidenceCard
                          evidence={ev}
                          isHighlighted={isHighlighted}
                          highlightColor={highlightColor}
                          isDimmed={isDimmed}
                          onSelect={() => handleEvidenceSelect(ev.id)}
                        />
                      </div>
                    );
                  })}
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
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Requirements
                </h2>
                {highConfidenceReviewCount > 0 && (
                  <button
                    onClick={handleAcceptAllHigh}
                    className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                  >
                    Accept all High-confidence ({highConfidenceReviewCount})
                  </button>
                )}
              </div>
              <StackedProgressBar segments={progressSegments} total={total} />
            </div>

            <div ref={requirementsPanelRef} className="flex-1 overflow-y-auto p-4">
              <AccordionChecklist
                categories={paCase.requirements}
                highlightedId={highlightedRequirementId}
                onAcceptRequirement={handleAcceptSingle}
                onSelectRequirement={handleRequirementSelect}
              />
            </div>
          </div>
        </Panel>
      </PanelGroup>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          onUndo={toast.onUndo}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
