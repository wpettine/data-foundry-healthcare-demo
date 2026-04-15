import { useState, useMemo } from 'react';
import type { PAEvidence } from '../../types/pa';
import { deriveFieldExtractions } from '../../utils/auditTrail';
import { HighlightedClinicalText } from './HighlightedClinicalText';
import { ExtractedFieldsTable } from './ExtractedFieldsTable';

interface AuditTrailPanelProps {
  evidence: PAEvidence;
}

export function AuditTrailPanel({ evidence }: AuditTrailPanelProps) {
  const [highlightedField, setHighlightedField] = useState<string | null>(null);

  const extractions = useMemo(() => deriveFieldExtractions(evidence), [evidence]);

  const handleFieldClick = (fieldName: string) => {
    // Toggle: if already highlighted, clear; otherwise set
    setHighlightedField((prev) => (prev === fieldName ? null : fieldName));
  };

  return (
    <div className="border-t border-gray-200 bg-white py-4">
      {/* Original Clinical Text Section */}
      <div className="mb-4 border-b border-gray-200">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-gray-700">
            Original Clinical Text
          </h3>
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          <HighlightedClinicalText
            text={evidence.description}
            extractions={extractions}
            onFieldClick={handleFieldClick}
            highlightedFieldName={highlightedField}
          />
        </div>
      </div>

      {/* Extracted Fields Section */}
      <div>
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-gray-700">
            Extracted Fields
          </h3>
        </div>
        <div className="max-h-[250px] overflow-y-auto">
          <ExtractedFieldsTable
            extractions={extractions}
            onFieldClick={handleFieldClick}
            highlightedFieldName={highlightedField}
          />
        </div>
      </div>
    </div>
  );
}
