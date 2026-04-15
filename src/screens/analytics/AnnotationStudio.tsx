import { useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { useScenario } from '../../scenarios/ScenarioContext';
import { PatientSwitcher } from '../../components/interactive/PatientSwitcher';
import { PatientInfoPanel } from '../../components/clinical/PatientInfoPanel';
import { TimeSeriesChart } from '../../components/visualization/TimeSeriesChart';
import { ClinicalEventsTimeline } from '../../components/clinical/ClinicalEventsTimeline';
import { FindingCard } from '../../components/data-display/FindingCard';
import { ReasoningNarrative } from '../../components/clinical/ReasoningNarrative';
import { useAnnotationStore } from '../../store/annotationStore';
import type { AnnotationTab } from '../../store/annotationStore';

const TABS: { key: AnnotationTab; label: string }[] = [
  { key: 'findings', label: 'AI Findings' },
  { key: 'reasoning', label: 'Reasoning' },
];

export default function AnnotationStudio() {
  const { analytics, paWorkbench, systems } = useScenario();
  const {
    selectedPatientId,
    approvedFindingIds,
    rejectedFindingIds,
    selectedFindingId,
    selectedEventId,
    activeTab,
    selectPatient,
    approveFinding,
    rejectFinding,
    setSelectedFinding,
    setSelectedEvent,
    setActiveTab,
  } = useAnnotationStore();

  const patients = paWorkbench?.patients ?? [];

  // Auto-select first patient if none selected
  useEffect(() => {
    if (!selectedPatientId && patients.length > 0) {
      selectPatient(patients[0].id);
    }
  }, [selectedPatientId, patients, selectPatient]);

  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === selectedPatientId) ?? patients[0] ?? null,
    [patients, selectedPatientId],
  );


  // Derive finding statuses from store
  const findingsWithStatus = useMemo(() => {
    if (!analytics) return [];
    return analytics.aiFindings.map((f) => {
      if (approvedFindingIds.includes(f.id)) return { ...f, status: 'approved' as const };
      if (rejectedFindingIds.includes(f.id)) return { ...f, status: 'rejected' as const };
      return f;
    });
  }, [analytics, approvedFindingIds, rejectedFindingIds]);

  if (!analytics) {
    return <Navigate to="/dashboard" replace />;
  }

  const { biometricStreams, clinicalEvents } = analytics;

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
      {/* Horizontal patient strip above panels */}
      <div className="border-b border-gray-200 bg-white px-4 py-2 flex-shrink-0">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Monitoring Queue
        </h3>
        <PatientSwitcher
          patients={patients}
          selectedId={selectedPatientId}
          onSelect={selectPatient}
        />
      </div>

      {/* Three-panel layout below */}
      <PanelGroup className="flex-1">
        {/* Left Panel: Patient Context */}
        <Panel defaultSize={25} minSize={18}>
          <div className="flex h-full flex-col overflow-y-auto border-r border-gray-200 bg-gray-50/50 p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Patient Context
            </h2>
            {selectedPatient && (
              <PatientInfoPanel patient={selectedPatient} systems={systems} />
            )}
          </div>
        </Panel>

        <PanelResizeHandle className="w-1.5 bg-gray-100 hover:bg-blue-200 transition-colors" />

        {/* Center Panel: Time-Series Charts */}
        <Panel defaultSize={45} minSize={30}>
          <div className="flex h-full flex-col overflow-y-auto p-4 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Biometric Streams
            </h2>
            <TimeSeriesChart
              channel={biometricStreams.temperature}
              events={clinicalEvents}
              onEventClick={setSelectedEvent}
            />
            <TimeSeriesChart
              channel={biometricStreams.heartRate}
              events={clinicalEvents}
              onEventClick={setSelectedEvent}
            />
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Clinical Events
              </h3>
              <ClinicalEventsTimeline
                events={clinicalEvents}
                systems={systems}
                selectedEventId={selectedEventId}
                onEventSelect={setSelectedEvent}
              />
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1.5 bg-gray-100 hover:bg-blue-200 transition-colors" />

        {/* Right Panel: Context Tabs */}
        <Panel defaultSize={30} minSize={20}>
          <div className="flex h-full flex-col overflow-hidden border-l border-gray-200">
            {/* Tab bar */}
            <div className="flex border-b border-gray-200 bg-white">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Findings tab */}
              {activeTab === 'findings' && (
                <div className="space-y-3">
                  {findingsWithStatus.map((finding) => (
                    <FindingCard
                      key={finding.id}
                      finding={finding}
                      isSelected={finding.id === selectedFindingId}
                      onApprove={() => approveFinding(finding.id)}
                      onReject={() => rejectFinding(finding.id)}
                      onSelect={() => setSelectedFinding(finding.id)}
                    />
                  ))}
                </div>
              )}

              {/* Reasoning tab */}
              {activeTab === 'reasoning' && (
                <>
                  {(() => {
                    const patientNarrative = analytics.patientReasoningNarratives?.find(
                      (n) => n.patientId === selectedPatientId
                    );

                    if (!patientNarrative) {
                      return (
                        <div className="flex h-32 items-center justify-center text-sm text-gray-400">
                          No reasoning narrative available for this patient
                        </div>
                      );
                    }

                    // Find the primary finding to pass signal contributions and KB sources for highlighting
                    const primaryFinding = findingsWithStatus.find((f) => f.confidenceLevel === 'high')
                      || findingsWithStatus[0];

                    return (
                      <ReasoningNarrative
                        narrative={patientNarrative.narrative}
                        finding={primaryFinding}
                      />
                    );
                  })()}
                </>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
