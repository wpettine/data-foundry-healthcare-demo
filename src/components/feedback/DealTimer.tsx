interface DealTimerProps {
  currentDay: number;
  totalDays: number;
  label: string;
}

export function DealTimer({ currentDay, totalDays, label }: DealTimerProps) {
  const pct = totalDays > 0 ? (currentDay / totalDays) * 100 : 0;

  let barColor: string;
  if (pct < 50) {
    barColor = 'bg-emerald-500';
  } else if (pct < 80) {
    barColor = 'bg-amber-500';
  } else {
    barColor = 'bg-red-500';
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-700">
        Day {currentDay} of {totalDays} &mdash; {label}
      </span>
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}
