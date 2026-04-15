interface Segment {
  value: number;
  color: string;
  label: string;
}

interface StackedProgressBarProps {
  segments: Segment[];
  total: number;
}

export function StackedProgressBar({ segments, total }: StackedProgressBarProps) {
  if (total === 0) return null;

  const metSegment = segments.find((s) => s.label.toLowerCase().includes('met'));
  const metCount = metSegment ? metSegment.value : segments[0]?.value ?? 0;

  return (
    <div className="w-full">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
        {segments.map((segment, i) => {
          const widthPct = (segment.value / total) * 100;
          if (widthPct === 0) return null;
          return (
            <div
              key={i}
              style={{ width: `${widthPct}%`, backgroundColor: segment.color }}
            />
          );
        })}
      </div>
      <p className="mt-1 text-xs text-gray-500">
        {metCount}/{total} met
      </p>
    </div>
  );
}
