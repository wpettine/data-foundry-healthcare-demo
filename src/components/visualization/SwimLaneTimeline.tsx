import { useMemo, useState } from 'react';
import type { PAEvidence, PARequirementCategory } from '../../types/pa';
import { TimelineZoomControls } from './TimelineZoomControls';

interface SwimLaneTimelineProps {
  evidence: PAEvidence[];
  requirements: PARequirementCategory[];
  highlightedRequirementId: string | null;
  onEvidenceSelect: (id: string) => void;
}

type ZoomLevel = 'year' | 'quarter' | 'month' | 'week' | 'day';

const LANE_HEIGHT = 56;
const DOT_RADIUS = 8;
const LANE_PADDING = 16;
const DURATION_HEIGHT = 28;

export function SwimLaneTimeline({
  evidence,
  requirements,
  highlightedRequirementId,
  onEvidenceSelect,
}: SwimLaneTimelineProps) {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('month');

  const { lanes, minDate, maxDate, highlightColor } = useMemo(() => {
    const systemMap = new Map<string, PAEvidence[]>();
    evidence.forEach((e) => {
      const list = systemMap.get(e.sourceSystemName) || [];
      list.push(e);
      systemMap.set(e.sourceSystemName, list);
    });

    const dates = evidence.map((e) => new Date(e.date).getTime());
    const min = Math.min(...dates);
    const max = Math.max(...dates);

    let hColor: string | null = null;
    if (highlightedRequirementId) {
      for (const cat of requirements) {
        const req = cat.children.find((r) => r.id === highlightedRequirementId);
        if (req) {
          hColor = req.highlightColor;
          break;
        }
      }
    }

    return {
      lanes: Array.from(systemMap.entries()),
      minDate: min,
      maxDate: max,
      highlightColor: hColor,
    };
  }, [evidence, requirements, highlightedRequirementId]);

  const range = maxDate - minDate || 1;

  function xPosition(date: string): number {
    const t = new Date(date).getTime();
    return ((t - minDate) / range) * 100;
  }

  function isLinkedToHighlighted(ev: PAEvidence): boolean {
    return highlightedRequirementId !== null && ev.linkedRequirementIds.includes(highlightedRequirementId);
  }

  // System type color mapping
  const systemTypeColors = {
    'pcp-emr': { border: '#3B82F6', bg: '#DBEAFE' },
    'pt': { border: '#A855F7', bg: '#F3E8FF' },
    'ortho-emr': { border: '#14B8A6', bg: '#CCFBF1' },
    'pharmacy': { border: '#F59E0B', bg: '#FEF3C7' },
    'radiology': { border: '#F43F5E', bg: '#FFE4E6' },
  } as const;

  // Generate time axis labels
  const timeLabels = useMemo(() => {
    const labels: Array<{ date: Date; label: string; position: number }> = [];
    const numLabels = 6;
    for (let i = 0; i <= numLabels; i++) {
      const fraction = i / numLabels;
      const time = minDate + fraction * range;
      const date = new Date(time);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      labels.push({ date, label, position: fraction * 100 });
    }
    return labels;
  }, [minDate, maxDate, range]);

  return (
    <div className="flex flex-col gap-3">
      {/* Zoom controls */}
      <div className="flex items-center justify-between px-4">
        <span className="text-xs font-medium text-gray-500">
          Timeline View
        </span>
        <TimelineZoomControls activeZoom={zoomLevel} onZoomChange={setZoomLevel} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <div className="min-w-[600px]">
          {/* Time axis header */}
          <div className="relative flex items-center border-b border-gray-200 bg-gray-50" style={{ height: 32 }}>
            <div className="w-36 flex-shrink-0 border-r border-gray-200 px-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Source
              </span>
            </div>
            <div className="relative flex-1 px-4">
              {timeLabels.map((label, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${label.position}%` }}
                >
                  <span className="text-[10px] font-medium text-gray-500">{label.label}</span>
                </div>
              ))}
            </div>
          </div>

          {lanes.map(([systemName, items]) => (
            <div
              key={systemName}
              className="relative flex items-center border-b border-gray-100 last:border-b-0"
              style={{ height: LANE_HEIGHT + LANE_PADDING * 2 }}
            >
              {/* Lane label */}
              <div className="w-36 flex-shrink-0 border-r border-gray-100 px-3">
                <span className="text-xs font-medium text-gray-600">{systemName}</span>
              </div>

              {/* Timeline area */}
              <div className="relative flex-1 px-4" style={{ height: LANE_HEIGHT }}>
                {/* Vertical grid lines */}
                {timeLabels.map((label, i) => (
                  <div
                    key={`grid-${i}`}
                    className="absolute top-0 h-full border-l border-gray-100"
                    style={{ left: `${label.position}%` }}
                  />
                ))}

                {/* Highlight band */}
                {highlightColor && (
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundColor: highlightColor }}
                  />
                )}

                {/* Evidence items (duration bars or point events) */}
                {items.map((ev) => {
                  const linked = isLinkedToHighlighted(ev);
                  const formattedDate = new Date(ev.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  const systemType = ev.systemType || 'pcp-emr';
                  const colors = systemTypeColors[systemType];

                  // Duration event (horizontal bar)
                  if (ev.eventType === 'duration' && ev.startDate && ev.endDate) {
                    const leftPos = xPosition(ev.startDate);
                    const rightPos = xPosition(ev.endDate);
                    const width = Math.max(rightPos - leftPos, 2);

                    return (
                      <button
                        key={ev.id}
                        onClick={() => onEvidenceSelect(ev.id)}
                        className={`absolute top-1/2 -translate-y-1/2 rounded-lg transition-all hover:shadow-md ${
                          linked ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        style={{
                          left: `${leftPos}%`,
                          width: `${width}%`,
                          height: DURATION_HEIGHT,
                          borderLeft: `4px solid ${colors.border}`,
                          backgroundColor: colors.bg,
                        }}
                        title={`${ev.startDate} to ${ev.endDate}\n${ev.recordType}: ${ev.description}`}
                      >
                        <div className="flex h-full flex-col justify-center px-2 text-left">
                          <span className="text-xs font-medium text-gray-700 truncate">
                            {ev.recordType}
                          </span>
                          {ev.extractedValues && Object.keys(ev.extractedValues).length > 0 && (
                            <span className="font-[JetBrains_Mono] text-[10px] text-gray-500 truncate">
                              {Object.entries(ev.extractedValues)[0][1]}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  }

                  // Point event (circle/diamond)
                  const left = xPosition(ev.date);
                  const confidenceColor = {
                    high: 'bg-emerald-500',
                    medium: 'bg-amber-500',
                    low: 'bg-red-500',
                  } as const;

                  return (
                    <button
                      key={ev.id}
                      onClick={() => onEvidenceSelect(ev.id)}
                      className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all hover:scale-150 ${
                        linked ? 'ring-4 ring-blue-500 ring-offset-2 scale-125' : ''
                      } ${confidenceColor[ev.confidenceLevel]}`}
                      style={{
                        left: `${left}%`,
                        width: DOT_RADIUS * 2,
                        height: DOT_RADIUS * 2,
                      }}
                      title={`${formattedDate}\n${ev.recordType}: ${ev.description}`}
                      aria-label={`${ev.recordType} on ${formattedDate}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
