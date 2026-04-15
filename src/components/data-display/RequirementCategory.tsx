import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { PARequirementCategory } from '../../types/pa';
import { RequirementRow } from './RequirementRow';

interface RequirementCategoryProps {
  category: PARequirementCategory;
  highlightedRequirementId: string | null;
  onAcceptRequirement?: (id: string) => void;
  onSelectRequirement: (id: string) => void;
}

export function RequirementCategory({
  category,
  highlightedRequirementId,
  onAcceptRequirement,
  onSelectRequirement,
}: RequirementCategoryProps) {
  // Auto-expand if category has any review or missing items
  const hasReviewOrMissing = category.children.some(
    (r) => r.status === 'review' || r.status === 'missing'
  );
  const [isExpanded, setIsExpanded] = useState(hasReviewOrMissing);

  const metCount = category.children.filter((r) => r.status === 'met').length;
  const reviewCount = category.children.filter((r) => r.status === 'review').length;
  const missingCount = category.children.filter((r) => r.status === 'missing').length;
  const totalCount = category.children.length;

  // Badge color based on worst-case child status
  let badgeClasses = 'bg-emerald-50 text-emerald-700';
  if (missingCount > 0) {
    badgeClasses = 'bg-red-50 text-red-700';
  } else if (reviewCount > 0) {
    badgeClasses = 'bg-amber-50 text-amber-700';
  }

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronDown size={16} className="text-gray-400" />
        ) : (
          <ChevronRight size={16} className="text-gray-400" />
        )}
        <span className="flex-1 text-sm font-medium text-gray-900">{category.name}</span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${badgeClasses}`}>
          {metCount}/{totalCount} met
        </span>
      </button>

      {isExpanded && (
        <div className="space-y-0.5 pb-2 pl-4">
          {category.children.map((requirement) => (
            <RequirementRow
              key={requirement.id}
              requirement={requirement}
              isHighlighted={requirement.id === highlightedRequirementId}
              onAccept={
                onAcceptRequirement ? () => onAcceptRequirement(requirement.id) : undefined
              }
              onSelect={() => onSelectRequirement(requirement.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
