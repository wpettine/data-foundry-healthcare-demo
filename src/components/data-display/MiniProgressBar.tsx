interface MiniProgressBarProps {
  met: number;
  review: number;
  missing: number;
}

export function MiniProgressBar({ met, review, missing }: MiniProgressBarProps) {
  const total = met + review + missing;
  if (total === 0) return null;

  const metPct = (met / total) * 100;
  const reviewPct = (review / total) * 100;
  const missingPct = (missing / total) * 100;

  return (
    <div className="flex h-1 w-full overflow-hidden rounded-full">
      {metPct > 0 && (
        <div className="bg-emerald-500" style={{ width: `${metPct}%` }} />
      )}
      {reviewPct > 0 && (
        <div className="bg-amber-500" style={{ width: `${reviewPct}%` }} />
      )}
      {missingPct > 0 && (
        <div className="bg-gray-300" style={{ width: `${missingPct}%` }} />
      )}
    </div>
  );
}
