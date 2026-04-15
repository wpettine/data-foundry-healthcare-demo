import { ConfidenceBadge } from '../feedback/ConfidenceBadge';
import type { DerivedFieldExtraction } from '../../utils/auditTrail';

interface ExtractedFieldsTableProps {
  extractions: DerivedFieldExtraction[];
  onFieldClick?: (fieldName: string) => void;
  highlightedFieldName?: string | null;
}

export function ExtractedFieldsTable({
  extractions,
  onFieldClick,
  highlightedFieldName,
}: ExtractedFieldsTableProps) {
  if (extractions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">No structured fields extracted</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-white">
          <tr className="border-b border-gray-200">
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Field
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Value
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Confidence
            </th>
          </tr>
        </thead>
        <tbody>
          {extractions.map((extraction) => {
            const isHighlighted = highlightedFieldName === extraction.fieldName;
            return (
              <tr
                key={extraction.fieldName}
                className={`
                  border-b border-gray-100 transition-colors
                  ${isHighlighted ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  ${onFieldClick ? 'cursor-pointer' : ''}
                `}
                onClick={() => onFieldClick?.(extraction.fieldName)}
              >
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: extraction.highlightColor }}
                      title={`Color: ${extraction.highlightColor}`}
                    />
                    <span className="font-medium text-gray-700 text-sm">
                      {extraction.fieldName}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <span className="font-[JetBrains_Mono] text-sm text-gray-900">
                    {extraction.value}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <ConfidenceBadge
                    level={extraction.confidenceLevel}
                    value={extraction.confidence}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
