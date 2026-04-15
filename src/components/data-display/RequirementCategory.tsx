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
  const [isExpanded, setIsExpanded] = useState(true);

  const metCount = category.children.filter((r) => r.status === 'met').length;
  const totalCount = category.children.length;

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
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
            metCount === totalCount
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
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
