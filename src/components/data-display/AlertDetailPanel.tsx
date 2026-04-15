import { X } from 'lucide-react';
import { ConfidenceBadge } from '../feedback/ConfidenceBadge';
import type {
  PipelineAlert,
  SchemaChangeDetail,
  CriteriaUpdateDetail,
} from '../../types/pipeline';

interface AlertDetailPanelProps {
  alert: PipelineAlert & { accentColor: string; systemFullName: string };
  onClose: () => void;
}

export function AlertDetailPanel({ alert, onClose }: AlertDetailPanelProps) {
  const hasDetail = alert.detail !== undefined;

  return (
    <div
      className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
      style={{ animation: 'fadeIn 300ms ease-out' }}
    >
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Alert Detail</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>

      {/* Render type-specific detail */}
      {hasDetail && alert.detail?.type === 'schema-change' && (
        <SchemaChangeDetail detail={alert.detail as SchemaChangeDetail} />
      )}
      {hasDetail && alert.detail?.type === 'criteria-update' && (
        <CriteriaUpdateDetail detail={alert.detail as CriteriaUpdateDetail} />
      )}
      {!hasDetail && <GenericAlertDetail alert={alert} />}

      {/* Action buttons */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Accept Resolution
        </button>
        <button
          type="button"
          className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Flag for Review
        </button>
      </div>
    </div>
  );
}

// Type-specific detail components
function SchemaChangeDetail({ detail }: { detail: SchemaChangeDetail }) {
  return (
    <div className="space-y-4">
      {/* Before/After */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
          Field Change
        </p>
        <div className="rounded bg-white p-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-['JetBrains_Mono'] text-gray-900">{detail.fieldBefore}</span>
            <span className="text-gray-400">→</span>
            <span className="font-['JetBrains_Mono'] text-gray-900">{detail.fieldAfter}</span>
          </div>
        </div>
      </div>

      {/* Affected Mappings */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
          Affected Concept Mappings
        </p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-1.5 text-left font-medium text-gray-500">Concept</th>
              <th className="py-1.5 text-right font-medium text-gray-500">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {detail.affectedMappings.map((mapping) => (
              <tr key={mapping.conceptId} className="border-b border-gray-100">
                <td className="py-1.5 text-gray-700">{mapping.conceptLabel}</td>
                <td className="py-1.5 text-right">
                  <ConfidenceBadge
                    level={
                      mapping.confidence >= 0.9
                        ? 'high'
                        : mapping.confidence >= 0.7
                          ? 'medium'
                          : 'low'
                    }
                    value={Math.round(mapping.confidence * 100)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Auto-remapping status */}
      {detail.autoRemapped && (
        <div className="rounded bg-emerald-50 border border-emerald-200 p-3 text-sm">
          <p className="font-medium text-emerald-900">
            Auto-remapped at {Math.round((detail.remappingConfidence ?? 0) * 100)}% confidence
          </p>
          <p className="mt-1 text-xs text-emerald-700">
            All affected mappings were automatically updated to the new field name with high
            confidence.
          </p>
        </div>
      )}
    </div>
  );
}

function CriteriaUpdateDetail({ detail }: { detail: CriteriaUpdateDetail }) {
  return (
    <div className="space-y-4">
      {/* Criterion Info */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
          Criterion
        </p>
        <div className="rounded bg-white p-3 text-sm">
          <p className="font-medium text-gray-900">{detail.criterionName}</p>
          <p className="mt-1 text-xs text-gray-500">Payer: {detail.payerName}</p>
        </div>
      </div>

      {/* Before/After Values */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
          Criteria Change
        </p>
        <div className="space-y-2">
          <div className="rounded bg-white p-3">
            <p className="text-xs font-medium text-gray-500">Before</p>
            <p className="mt-1 text-sm text-gray-900">{detail.valueBefore}</p>
          </div>
          <div className="rounded bg-white p-3">
            <p className="text-xs font-medium text-gray-500">
              After (Effective {detail.effectiveDate})
            </p>
            <p className="mt-1 text-sm text-gray-900">{detail.valueAfter}</p>
          </div>
        </div>
      </div>

      {/* Impact */}
      <div className="rounded bg-amber-50 border border-amber-200 p-3 text-sm">
        <p className="font-medium text-amber-900">{detail.affectedCases} active PA cases affected</p>
        <p className="mt-1 text-xs text-amber-700">
          Cases currently in review will need reassessment against the updated criteria.
        </p>
      </div>
    </div>
  );
}

function GenericAlertDetail({ alert }: { alert: PipelineAlert }) {
  return (
    <div className="rounded bg-white p-4">
      <p className="text-sm text-gray-700">{alert.description}</p>
      {alert.impact && (
        <p className="mt-2 text-xs text-gray-500">
          <span className="font-medium">Impact:</span> {alert.impact}
        </p>
      )}
    </div>
  );
}
