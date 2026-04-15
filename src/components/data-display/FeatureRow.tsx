import { ChevronRight, ChevronDown } from 'lucide-react';
import type { ModelFeature } from '../../types/model';
import { ConfidenceBadge } from '../feedback/ConfidenceBadge';

interface FeatureRowProps {
  feature: ModelFeature;
  onToggle: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
  isExpanded?: boolean;
  onToggleExpansion?: () => void;
}

export function FeatureRow({
  feature,
  onToggle,
  onSelect,
  isSelected,
  isExpanded,
  onToggleExpansion,
}: FeatureRowProps) {
  const hasNormalizationNote = !!feature.normalizationNote;

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      {/* Main row */}
      <div
        className={`flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors ${
          isSelected ? 'bg-blue-50 ring-1 ring-inset ring-blue-200' : ''
        }`}
      >
      {/* Expansion chevron (only show if normalizationNote exists) */}
      {hasNormalizationNote ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpansion?.();
          }}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      ) : (
        <span className="w-4" /> /* Spacer for alignment */
      )}

      {/* Toggle switch */}
      <button
        className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${
          feature.included ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={feature.included ? 'Exclude feature' : 'Include feature'}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            feature.included ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>

      {/* Feature name - now clickable for selection */}
      <button
        className="flex-1 text-left text-sm text-gray-900 hover:text-blue-600 transition-colors"
        onClick={() => onSelect?.()}
      >
        {feature.name}
      </button>

      {/* Source systems */}
      <div className="flex flex-wrap gap-1">
        {feature.sources.map((src) => (
          <span
            key={src}
            className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600"
          >
            {src}
          </span>
        ))}
      </div>

      {/* Coverage fraction */}
      <span className="w-16 text-center font-[JetBrains_Mono] text-xs text-gray-700">
        {feature.coverageSites}
      </span>

      {/* Confidence */}
      <ConfidenceBadge level={feature.confidenceLevel} value={feature.mappingConfidence} />

      {/* Literature citation count */}
      <span className="w-12 text-center text-xs text-gray-500" title="Literature citations">
        {feature.literatureCitations.length} cite{feature.literatureCitations.length !== 1 && 's'}
      </span>
      </div>

      {/* Expanded content */}
      {isExpanded && feature.normalizationNote && (
        <div className="border-t border-gray-100 bg-gray-50 px-3 py-3 pl-12">
          <div className="rounded-md bg-white p-3 text-sm text-gray-700">
            <span className="font-medium text-gray-500">Normalization: </span>
            {feature.normalizationNote}
          </div>
        </div>
      )}
    </div>
  );
}
