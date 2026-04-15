import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import type { PARequirement } from '../../types/pa';
import { ConfidenceBadge } from '../feedback/ConfidenceBadge';

interface RequirementRowProps {
  requirement: PARequirement;
  isHighlighted: boolean;
  onAccept?: () => void;
  onSelect: () => void;
}

const statusConfig = {
  met: { icon: CheckCircle2, iconColor: 'text-emerald-500' },
  review: { icon: AlertCircle, iconColor: 'text-amber-500' },
  missing: { icon: XCircle, iconColor: 'text-red-500' },
} as const;

export function RequirementRow({
  requirement,
  isHighlighted,
  onAccept,
  onSelect,
}: RequirementRowProps) {
  const { icon: Icon, iconColor } = statusConfig[requirement.status];

  return (
    <div
      className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors ${
        isHighlighted ? 'border-l-4 border-l-blue-500 bg-blue-50' : 'hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <Icon size={16} className={iconColor} />

      <span className="flex-1 text-sm text-gray-900">{requirement.criterionText}</span>

      {requirement.status === 'review' && requirement.confidence !== undefined && (
        <ConfidenceBadge level="medium" value={requirement.confidence} />
      )}

      {requirement.linkedEvidenceIds.length > 0 && (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
          {requirement.linkedEvidenceIds.length} evidence
        </span>
      )}

      {onAccept && requirement.status === 'review' && (
        <button
          className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
          onClick={(e) => {
            e.stopPropagation();
            onAccept();
          }}
        >
          Accept
        </button>
      )}
    </div>
  );
}
