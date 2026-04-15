interface SummaryMetricsBarProps {
  pending: number;
  ready: number;
  needEvidence: number;
  review: number;
  atRisk: number;
}

export function SummaryMetricsBar({
  pending,
  ready,
  needEvidence,
  review,
  atRisk,
}: SummaryMetricsBarProps) {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-600">
      <span>
        <span className="font-medium text-gray-900">{pending}</span> pending
      </span>
      <span className="text-gray-300">|</span>
      <span>
        <span className="font-medium text-emerald-600">{ready}</span> ready
      </span>
      <span className="text-gray-300">|</span>
      <span>
        <span className="font-medium text-amber-600">{needEvidence}</span> need evidence
      </span>
      <span className="text-gray-300">|</span>
      <span>
        <span className="font-medium text-blue-600">{review}</span> review
      </span>
      <span className="text-gray-300">|</span>
      <span>
        <span className="font-medium text-red-600">{atRisk}</span> at risk
      </span>
    </div>
  );
}
