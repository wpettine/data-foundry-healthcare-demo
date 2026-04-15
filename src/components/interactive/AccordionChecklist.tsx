import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { PARequirementCategory } from '../../types/pa';
import { RequirementCategory } from '../data-display/RequirementCategory';

interface AccordionChecklistProps {
  categories: PARequirementCategory[];
  highlightedId: string | null;
  onAcceptRequirement?: (id: string) => void;
  onSelectRequirement: (id: string) => void;
}

export function AccordionChecklist({
  categories,
  highlightedId,
  onAcceptRequirement,
  onSelectRequirement,
}: AccordionChecklistProps) {
  const [, setAllExpanded] = useState(true);
  const [expandKey, setExpandKey] = useState(0);

  const totalMet = categories.reduce(
    (sum, cat) => sum + cat.children.filter((r) => r.status === 'met').length,
    0,
  );
  const totalItems = categories.reduce((sum, cat) => sum + cat.children.length, 0);

  function handleExpandAll() {
    setAllExpanded(true);
    setExpandKey((k) => k + 1);
  }

  function handleCollapseAll() {
    setAllExpanded(false);
    setExpandKey((k) => k + 1);
  }

  function handleExpandFailing() {
    // This will trigger a re-render with new key, causing categories to reinitialize
    // Categories with review/missing will auto-expand due to their internal logic
    setExpandKey((k) => k + 1);
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
        <span className="text-xs font-medium text-gray-500">
          {totalMet}/{totalItems} requirements met
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExpandFailing}
            className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100"
          >
            Expand Failing
          </button>
          <button
            onClick={handleExpandAll}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
          >
            <ChevronDown size={12} />
            Expand all
          </button>
          <button
            onClick={handleCollapseAll}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
          >
            <ChevronRight size={12} />
            Collapse all
          </button>
        </div>
      </div>

      <div key={expandKey}>
        {categories.map((category) => (
          <RequirementCategory
            key={category.id}
            category={category}
            highlightedRequirementId={highlightedId}
            onAcceptRequirement={onAcceptRequirement}
            onSelectRequirement={onSelectRequirement}
          />
        ))}
      </div>
    </div>
  );
}
