import { Link2 } from 'lucide-react';

interface IdentityResolutionBadgeProps {
  systemCount: number;
  confidence: number;
}

export function IdentityResolutionBadge({ systemCount, confidence }: IdentityResolutionBadgeProps) {
  // Confidence color: green >95%, amber 85-95%, red <85%
  const confidenceColor =
    confidence >= 0.95
      ? 'text-emerald-600'
      : confidence >= 0.85
        ? 'text-amber-600'
        : 'text-red-600';

  const badgeColor =
    confidence >= 0.95
      ? 'bg-emerald-50 border-emerald-200'
      : confidence >= 0.85
        ? 'bg-amber-50 border-amber-200'
        : 'bg-red-50 border-red-200';

  const confidencePercent = (confidence * 100).toFixed(1);

  return (
    <div className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 ${badgeColor}`}>
      <Link2 className={`h-4 w-4 ${confidenceColor}`} />
      <span className="text-sm text-gray-700">
        Matched across <span className="font-medium">{systemCount} systems</span>
      </span>
      <span className={`font-[JetBrains_Mono] text-sm font-medium ${confidenceColor}`}>
        {confidencePercent}%
      </span>
    </div>
  );
}
