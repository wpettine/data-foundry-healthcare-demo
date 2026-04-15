import type { ClinicalEvent } from '../../types/clinical';
import type { SourceSystem } from '../../types/system';

interface ClinicalEventsTimelineProps {
  events: ClinicalEvent[];
  systems: SourceSystem[];
  selectedEventId: string | null;
  onEventSelect: (id: string) => void;
}

export function ClinicalEventsTimeline({
  events,
  systems,
  selectedEventId,
  onEventSelect,
}: ClinicalEventsTimelineProps) {
  const systemMap = new Map(systems.map((s) => [s.id, s]));

  const sortedEvents = [...events].sort((a, b) => a.day - b.day);

  return (
    <div className="space-y-0">
      {sortedEvents.map((event, idx) => {
        const system = systemMap.get(event.sourceSystemId);
        const accentColor = system?.accentColor ?? '#6B7280';
        const isSelected = event.id === selectedEventId;
        const isLast = idx === sortedEvents.length - 1;

        return (
          <div key={event.id} className="flex gap-3">
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
              <div
                className="h-3 w-3 rounded-full border-2"
                style={{
                  borderColor: accentColor,
                  backgroundColor: isSelected ? accentColor : 'white',
                }}
              />
              {!isLast && (
                <div className="w-px flex-1 bg-gray-200" />
              )}
            </div>

            {/* Event card */}
            <button
              onClick={() => onEventSelect(event.id)}
              className={`mb-3 w-full rounded-lg border p-3 text-left transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-[JetBrains_Mono] text-[10px] text-gray-400">
                  Day {event.day}
                </span>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {system?.name ?? event.sourceSystemId}
                </span>
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                  {event.type}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900">{event.title}</p>
              <p className="mt-0.5 text-xs text-gray-500">{event.description}</p>
            </button>
          </div>
        );
      })}
    </div>
  );
}
