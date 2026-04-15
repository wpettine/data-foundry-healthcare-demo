import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { PAEvidence } from '../../types/pa';
import { SystemSourceBadge } from '../feedback/SystemSourceBadge';

interface EvidenceCardProps {
  evidence: PAEvidence;
  isHighlighted: boolean;
  highlightColor?: string;
  isDimmed?: boolean;
  onSelect: () => void;
}

export function EvidenceCard({
  evidence,
  isHighlighted,
  highlightColor,
  isDimmed,
  onSelect
}: EvidenceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Layer 1: Confidence display
  const confidencePercent = Math.round(evidence.confidence * 100);
  const isHigh = evidence.confidenceLevel === 'high';
  const isReview = evidence.confidenceLevel === 'medium';
  const isManual = evidence.confidenceLevel === 'low';

  // Determine system type from name
  const systemType = evidence.systemType || inferSystemType(evidence.sourceSystemName);

  // Border and background styling
  const borderClass = isHighlighted && highlightColor
    ? `border-l-2`
    : 'border-l-2 border-l-transparent';

  const bgClass = isHighlighted && highlightColor
    ? 'bg-opacity-5'
    : 'bg-white';

  const opacityClass = isDimmed ? 'opacity-70' : 'opacity-100';

  return (
    <div
      className={`cursor-pointer rounded-lg border border-gray-200 p-4 transition-all ${borderClass} ${bgClass} ${opacityClass} hover:shadow-sm`}
      style={{
        borderLeftColor: isHighlighted && highlightColor ? highlightColor : undefined,
        backgroundColor: isHighlighted && highlightColor ? `${highlightColor}10` : undefined,
      }}
      onClick={onSelect}
    >
      {/* Header: Source badge + Record type + Confidence */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <SystemSourceBadge
            systemType={systemType}
            systemName={evidence.sourceSystemName}
            facility={evidence.facility}
            recordDate={evidence.recordDate || evidence.date}
            documentType={evidence.documentType}
          />
          <span className="text-xs text-gray-500">{evidence.recordType}</span>
        </div>

        {/* Layer 1: Confidence Badge */}
        <div className="flex items-center gap-2">
          {isHigh && (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
          )}
          {isReview && (
            <div className="flex items-center gap-1.5 border-l-2 border-amber-400 pl-2">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="font-[JetBrains_Mono] text-xs text-amber-600">
                {confidencePercent}%
              </span>
            </div>
          )}
          {isManual && (
            <div className="flex items-center gap-1.5 border-l-3 border-red-500 pl-2">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="font-[JetBrains_Mono] text-sm font-semibold text-red-600">
                {confidencePercent}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-gray-900">{evidence.description}</p>

      {/* Date */}
      <p className="mt-2 text-xs text-gray-500">
        {new Date(evidence.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>

      {/* Identity Note */}
      {evidence.identityNote && (
        <p className="mt-2 text-xs text-gray-400">{evidence.identityNote}</p>
      )}

      {/* Extracted Values */}
      {evidence.extractedValues && Object.keys(evidence.extractedValues).length > 0 && (
        <div className="mt-3 space-y-1 rounded bg-gray-50 p-2">
          {Object.entries(evidence.extractedValues).map(([key, val]) => (
            <div key={key} className="flex items-baseline gap-2 text-xs">
              <span className="font-medium text-gray-500">{key}:</span>
              <span className="font-[JetBrains_Mono] text-gray-900">{val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Layer 3: Expandable Detail (if extraction details exist) */}
      {evidence.extractionDetails && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-xs font-medium text-gray-600">
              {isExpanded ? 'Hide' : 'Show'} extraction details
            </span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-3">
              {/* Confidence Breakdown */}
              <div className="rounded-lg bg-slate-50 p-3 text-xs">
                <div className="mb-2 font-semibold text-gray-700">Confidence Breakdown</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Extraction:</span>
                    <span className="font-[JetBrains_Mono] text-gray-900">
                      {Math.round(evidence.extractionDetails.extractionConfidence * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Semantic match:</span>
                    <span className="font-[JetBrains_Mono] text-gray-900">
                      {Math.round(evidence.extractionDetails.semanticMatchConfidence * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Combined:</span>
                    <span className="font-[JetBrains_Mono] font-medium text-gray-900">
                      {confidencePercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Original Text Snippet */}
              {evidence.extractionDetails.originalTextSnippet && (
                <div className="rounded-lg bg-slate-50 p-3 text-xs">
                  <div className="mb-2 font-semibold text-gray-700">Original Text</div>
                  <p className="text-gray-700 italic">
                    "{evidence.extractionDetails.originalTextSnippet}"
                  </p>
                </div>
              )}

              {/* Historical Accuracy */}
              {evidence.extractionDetails.historicalAccuracy && (
                <p className="text-xs text-gray-500">
                  {evidence.extractionDetails.historicalAccuracy}
                </p>
              )}

              {/* Override Controls */}
              <div className="flex gap-2">
                <button className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700">
                  Accept Extraction
                </button>
                <button className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                  Mark Manual
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual verification prompt for low confidence */}
      {isManual && !evidence.extractionDetails && (
        <div className="mt-3 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          Manual verification required
        </div>
      )}
    </div>
  );
}

// Helper to infer system type from name
function inferSystemType(systemName: string): 'pcp-emr' | 'pt' | 'ortho-emr' | 'pharmacy' | 'radiology' {
  const lower = systemName.toLowerCase();
  if (lower.includes('pcp') || lower.includes('epic')) return 'pcp-emr';
  if (lower.includes('pt') || lower.includes('webpt')) return 'pt';
  if (lower.includes('ortho') || lower.includes('athena')) return 'ortho-emr';
  if (lower.includes('pharmacy') || lower.includes('surescripts')) return 'pharmacy';
  if (lower.includes('radiology') || lower.includes('pacs')) return 'radiology';
  return 'pcp-emr'; // default
}
