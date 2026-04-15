import { useMemo } from 'react';
import type { PAEvidence, PARequirementCategory } from '../../types/pa';

interface SwimLaneTimelineProps {
  evidence: PAEvidence[];
  requirements: PARequirementCategory[];
  highlightedRequirementId: string | null;
  onEvidenceSelect: (id: string) => void;
}

const LANE_HEIGHT = 56;
const DOT_RADIUS = 8;
const LANE_PADDING = 16;

export function SwimLaneTimeline({
  evidence,
  requirements,
  highlightedRequirementId,
  onEvidenceSelect,
}: SwimLaneTimelineProps) {
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

  const confidenceColor = {
    high: 'bg-emerald-500',
    medium: 'bg-amber-500',
    low: 'bg-red-500',
  } as const;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <div className="min-w-[600px]">
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
              {/* Highlight band */}
              {highlightColor && (
                <div
                  className="absolute inset-0 opacity-10"
                  style={{ backgroundColor: highlightColor }}
                />
              )}

              {/* Evidence dots */}
              {items.map((ev) => {
                const left = xPosition(ev.date);
                const linked = isLinkedToHighlighted(ev);
                return (
                  <button
                    key={ev.id}
                    onClick={() => onEvidenceSelect(ev.id)}
                    className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-125 ${
                      linked ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                    } ${confidenceColor[ev.confidenceLevel]}`}
                    style={{
                      left: `${left}%`,
                      width: DOT_RADIUS * 2,
                      height: DOT_RADIUS * 2,
                    }}
                    title={`${ev.description} (${ev.date})`}
                    aria-label={ev.description}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
