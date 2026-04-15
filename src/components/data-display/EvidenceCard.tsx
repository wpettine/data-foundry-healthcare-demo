import type { PAEvidence } from '../../types/pa';
import { ConfidenceBadge } from '../feedback/ConfidenceBadge';
import { SourceBadge } from '../feedback/SourceBadge';

interface EvidenceCardProps {
  evidence: PAEvidence;
  isHighlighted: boolean;
  onSelect: () => void;
}

export function EvidenceCard({ evidence, isHighlighted, onSelect }: EvidenceCardProps) {
  return (
    <div
      className={`cursor-pointer rounded-lg border bg-white p-4 transition-colors ${
        isHighlighted
          ? 'border-l-4 border-l-blue-500 border-t-gray-200 border-r-gray-200 border-b-gray-200'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <SourceBadge systemName={evidence.sourceSystemName} accentColor="#6B7280" />
          <span className="text-xs text-gray-400">{evidence.recordType}</span>
        </div>
        <ConfidenceBadge level={evidence.confidenceLevel} value={evidence.confidence} />
      </div>

      <p className="mt-2 text-sm text-gray-900">{evidence.description}</p>

      {evidence.extractedValues && Object.keys(evidence.extractedValues).length > 0 && (
        <div className="mt-2 space-y-1">
          {Object.entries(evidence.extractedValues).map(([key, val]) => (
            <div key={key} className="flex items-baseline gap-2 text-xs">
              <span className="font-medium text-gray-500">{key}:</span>
              <span className="font-[JetBrains_Mono] text-gray-900">{val}</span>
            </div>
          ))}
        </div>
      )}

      <p className="mt-2 text-[11px] text-gray-400">{evidence.date}</p>
    </div>
  );
}
