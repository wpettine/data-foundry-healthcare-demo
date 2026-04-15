interface TimelineZoomControlsProps {
  activeZoom: 'year' | 'quarter' | 'month' | 'week' | 'day';
  onZoomChange: (zoom: 'year' | 'quarter' | 'month' | 'week' | 'day') => void;
}

const ZOOM_LEVELS = [
  { value: 'year' as const, label: 'Year' },
  { value: 'quarter' as const, label: 'Quarter' },
  { value: 'month' as const, label: 'Month' },
  { value: 'week' as const, label: 'Week' },
  { value: 'day' as const, label: 'Day' },
];

export function TimelineZoomControls({ activeZoom, onZoomChange }: TimelineZoomControlsProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
      {ZOOM_LEVELS.map((level) => (
        <button
          key={level.value}
          onClick={() => onZoomChange(level.value)}
          className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
            activeZoom === level.value
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
}
