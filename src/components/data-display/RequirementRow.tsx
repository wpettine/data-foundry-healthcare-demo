import { useState } from 'react';
import { CheckCircle2, AlertCircle, XCircle, ChevronDown, ChevronRight } from 'lucide-react';
import type { PARequirement } from '../../types/pa';
import { ConfidenceBadge } from '../feedback/ConfidenceBadge';
import { SemanticInferenceDetail } from './SemanticInferenceDetail';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const { icon: Icon, iconColor } = statusConfig[requirement.status];
  const hasSemanticInference = requirement.status === 'review' && requirement.semanticInference;

  return (
    <div className={`rounded-md ${isHighlighted ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`}>
      <div
        className={`flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors ${
          !isHighlighted && 'hover:bg-gray-50'
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

        {hasSemanticInference && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}

        {onAccept && requirement.status === 'review' && !isExpanded && (
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

      {isExpanded && hasSemanticInference && (
        <div className="px-3 pb-3">
          <SemanticInferenceDetail
            requirement={requirement}
            onAccept={() => {
              setIsExpanded(false);
              if (onAccept) onAccept();
            }}
            onOverride={() => {
              // TODO: Implement override logic
              console.log('Override:', requirement.id);
            }}
            onFlag={() => {
              // TODO: Implement flag logic
              console.log('Flag:', requirement.id);
            }}
          />
        </div>
      )}
    </div>
  );
}
