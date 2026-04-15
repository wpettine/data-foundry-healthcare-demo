import { useMemo } from 'react';
import type { ClinicalEvent } from '../../types/clinical';
import type { AIFinding } from '../../types/annotation';
import type { SourceSystem } from '../../types/system';
import { ClinicalEventCard } from '../data-display/ClinicalEventCard';
import { FindingCard } from '../data-display/FindingCard';

interface InterleavedTimelineProps {
  events: ClinicalEvent[];
  findings: AIFinding[];
  systems: SourceSystem[];
  selectedEventId: string | null;
  selectedFindingId: string | null;
  onEventSelect: (id: string) => void;
  onFindingSelect: (id: string) => void;
  onApproveFinding: (id: string) => void;
  onRejectFinding: (id: string) => void;
}

type TimelineItem =
  | { type: 'event'; data: ClinicalEvent; day: number }
  | { type: 'finding'; data: AIFinding; day: number };

export function InterleavedTimeline({
  events,
  findings,
  systems,
  selectedEventId,
  selectedFindingId,
  onEventSelect,
  onFindingSelect,
  onApproveFinding,
  onRejectFinding,
}: InterleavedTimelineProps) {
  // Build system color map for event cards
  const systemColorMap = useMemo(
    () => new Map(systems.map((s) => [s.id, s.accentColor])),
    [systems],
  );

  // Merge events and findings into single timeline
  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [
      ...events.map((e) => ({ type: 'event' as const, data: e, day: e.day })),
      ...findings.map((f) => ({ type: 'finding' as const, data: f, day: f.onsetDay })),
    ];
    return items.sort((a, b) => a.day - b.day);
  }, [events, findings]);

  return (
    <div className="relative space-y-3">
      {timelineItems.map((item, idx) => (
        <div key={`${item.type}-${item.data.id}`} className="relative">
          {/* Timeline spine - vertical line connecting items */}
          {idx < timelineItems.length - 1 && (
            <div className="absolute left-[7px] top-8 h-full w-0.5 bg-gray-200" />
          )}

          {/* Timeline dot */}
          <div className="relative flex items-start gap-3">
            <div
              className={`relative z-10 mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 transition-colors ${
                (item.type === 'event' && selectedEventId === item.data.id) ||
                (item.type === 'finding' && selectedFindingId === item.data.id)
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 bg-white'
              }`}
            />

            <div className="flex-1">
              {item.type === 'event' ? (
                <div
                  className={`cursor-pointer rounded-lg transition-all ${
                    selectedEventId === item.data.id ? 'ring-2 ring-blue-400' : ''
                  }`}
                  onClick={() => onEventSelect(item.data.id)}
                >
                  <ClinicalEventCard
                    event={item.data}
                    accentColor={systemColorMap.get(item.data.sourceSystemId) ?? '#6B7280'}
                  />
                </div>
              ) : (
                <FindingCard
                  finding={item.data}
                  isSelected={selectedFindingId === item.data.id}
                  onApprove={() => onApproveFinding(item.data.id)}
                  onReject={() => onRejectFinding(item.data.id)}
                  onSelect={() => onFindingSelect(item.data.id)}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
