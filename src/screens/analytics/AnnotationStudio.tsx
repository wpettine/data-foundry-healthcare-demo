import { useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { useScenario } from '../../scenarios/ScenarioContext';
import { PatientSwitcher } from '../../components/interactive/PatientSwitcher';
import { PatientInfoPanel } from '../../components/clinical/PatientInfoPanel';
import { TimeSeriesChart } from '../../components/visualization/TimeSeriesChart';
import { ClinicalEventsTimeline } from '../../components/clinical/ClinicalEventsTimeline';
import { FindingCard } from '../../components/data-display/FindingCard';
import { ClinicalEventCard } from '../../components/data-display/ClinicalEventCard';
import { ReasoningNarrative } from '../../components/clinical/ReasoningNarrative';
import { useAnnotationStore } from '../../store/annotationStore';
import type { AnnotationTab } from '../../store/annotationStore';

const TABS: { key: AnnotationTab; label: string }[] = [
  { key: 'timeline', label: 'Timeline' },
  { key: 'events', label: 'Events' },
  { key: 'findings', label: 'Findings' },
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

  // Build system color map for event cards
  const systemColorMap = useMemo(
    () => new Map(systems.map((s) => [s.id, s.accentColor])),
    [systems],
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

  const selectedFinding = useMemo(
    () => findingsWithStatus.find((f) => f.id === selectedFindingId) ?? null,
    [findingsWithStatus, selectedFindingId],
  );

  if (!analytics) {
    return <Navigate to="/dashboard" replace />;
  }

  const { biometricStreams, clinicalEvents } = analytics;

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <PanelGroup>
        {/* Left Panel: Patient Context */}
        <Panel defaultSize={25} minSize={18}>
          <div className="flex h-full flex-col overflow-y-auto border-r border-gray-200 bg-gray-50/50 p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Patient Context
            </h2>
            <PatientSwitcher
              patients={patients}
              selectedId={selectedPatientId}
              onSelect={selectPatient}
            />
            {selectedPatient && (
              <div className="mt-4">
                <PatientInfoPanel patient={selectedPatient} />
              </div>
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
              onEventClick={(id) => {
                setSelectedEvent(id);
                setActiveTab('events');
              }}
            />
            <TimeSeriesChart
              channel={biometricStreams.heartRate}
              events={clinicalEvents}
              onEventClick={(id) => {
                setSelectedEvent(id);
                setActiveTab('events');
              }}
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
              {/* Timeline tab */}
              {activeTab === 'timeline' && (
                <ClinicalEventsTimeline
                  events={clinicalEvents}
                  systems={systems}
                  selectedEventId={selectedEventId}
                  onEventSelect={setSelectedEvent}
                />
              )}

              {/* Events tab */}
              {activeTab === 'events' && (
                <div className="space-y-3">
                  {[...clinicalEvents]
                    .sort((a, b) => a.day - b.day)
                    .map((event) => (
                      <div
                        key={event.id}
                        className={`cursor-pointer rounded-lg transition-all ${
                          selectedEventId === event.id ? 'ring-2 ring-blue-400' : ''
                        }`}
                        onClick={() => setSelectedEvent(event.id)}
                      >
                        <ClinicalEventCard
                          event={event}
                          accentColor={systemColorMap.get(event.sourceSystemId) ?? '#6B7280'}
                        />
                      </div>
                    ))}
                </div>
              )}

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
                  {selectedFinding ? (
                    <ReasoningNarrative
                      narrative={selectedFinding.reasoningNarrative}
                      finding={selectedFinding}
                    />
                  ) : (
                    <div className="flex h-32 items-center justify-center text-sm text-gray-400">
                      Select a finding in the Findings tab to view reasoning
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
