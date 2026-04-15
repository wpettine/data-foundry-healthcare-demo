import { X } from 'lucide-react';
import { ConfidenceBadge } from '../../../components/feedback/ConfidenceBadge';
import { StatusBadge } from '../../../components/feedback/StatusBadge';
import type { SchemaAnnotation, SourceSystem } from '../../../types/system';

interface SchemaDetailPanelProps {
  field: SchemaAnnotation & { resolvedStatus: SchemaAnnotation['status'] };
  system: SourceSystem | undefined;
  onAccept: (id: string) => void;
  onClose: () => void;
}

const statusVariant = (status: SchemaAnnotation['status']) => {
  switch (status) {
    case 'auto-accepted':
      return 'success' as const;
    case 'pending-review':
      return 'warning' as const;
    case 'manual':
      return 'error' as const;
  }
};

const statusLabel = (status: SchemaAnnotation['status']) => {
  switch (status) {
    case 'auto-accepted':
      return 'Accepted';
    case 'pending-review':
      return 'Pending Review';
    case 'manual':
      return 'Manual';
  }
};

export default function SchemaDetailPanel({
  field,
  system,
  onAccept,
  onClose,
}: SchemaDetailPanelProps) {
  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-5"
      style={{ animation: 'fadeIn 300ms ease-out' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          <span className="font-[JetBrains_Mono]">{field.sourceTable}.{field.sourceField}</span>
          <span className="mx-2 text-gray-400">&rarr;</span>
          {field.mappedConceptLabel}
        </h3>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left: Field Mapping Details */}
        <div className="col-span-3 space-y-4">
          {/* Mapping summary table */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
              Field Mapping
            </p>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-1.5 text-left font-medium text-gray-500">Source Table</th>
                  <th className="py-1.5 text-left font-medium text-gray-500">Source Field</th>
                  <th className="py-1.5 text-left font-medium text-gray-500">Data Type</th>
                  <th className="py-1.5 text-left font-medium text-gray-500">Mapped Concept</th>
                  <th className="py-1.5 text-right font-medium text-gray-500">Confidence</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1.5 font-[JetBrains_Mono] text-gray-800">
                    {field.sourceTable}
                  </td>
                  <td className="py-1.5 font-[JetBrains_Mono] text-gray-800">
                    {field.sourceField}
                  </td>
                  <td className="py-1.5">
                    <span className="inline-flex rounded bg-gray-100 px-1.5 py-0.5 font-[JetBrains_Mono] text-gray-600">
                      {field.dataType}
                    </span>
                  </td>
                  <td className="py-1.5 font-medium text-indigo-700">
                    {field.mappedConceptLabel}
                  </td>
                  <td className="py-1.5 text-right">
                    <ConfidenceBadge
                      level={field.confidenceLevel}
                      value={Math.round(field.confidence * 100)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Sample Values */}
          {field.sampleValues.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                Sample Values
              </p>
              <div className="flex flex-wrap gap-1.5">
                {field.sampleValues.map((val) => (
                  <span
                    key={val}
                    className="inline-flex rounded bg-gray-100 px-2 py-0.5 font-[JetBrains_Mono] text-xs text-gray-700"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Mappings */}
          {field.alternatives && field.alternatives.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                Alternative Mappings
              </p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-1.5 text-left font-medium text-gray-500">Concept</th>
                    <th className="py-1.5 text-right font-medium text-gray-500">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {field.alternatives.map((alt) => (
                    <tr key={alt.conceptId} className="border-b border-gray-100 last:border-0">
                      <td className="py-1.5 text-gray-700">{alt.conceptLabel}</td>
                      <td className="py-1.5 text-right font-[JetBrains_Mono] text-gray-600">
                        {(alt.confidence * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Metadata */}
        <div className="col-span-2">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
            Field Details
          </p>
          <dl className="space-y-1.5 text-xs">
            <MetaRow label="System" value={system?.name ?? field.systemId} />
            <MetaRow label="Platform" value={system?.platform ?? '—'} />
            <MetaRow
              label="Category"
              value={system ? system.systemCategory.toUpperCase() : '—'}
            />
            <MetaRow label="Concept ID" value={field.mappedConceptId} />
            <MetaRow
              label="Confidence"
              value={`${(field.confidence * 100).toFixed(1)}%`}
            />
            <MetaRow label="Last Sync" value={system?.lastSync ?? '—'} />
          </dl>

          <div className="mt-3">
            <StatusBadge
              status={statusLabel(field.resolvedStatus)}
              variant={statusVariant(field.resolvedStatus)}
            />
          </div>

          <div className="mt-3 space-y-1">
            <button
              type="button"
              className="block cursor-pointer text-xs text-blue-600 hover:underline"
              onClick={() => {/* no-op in demo */}}
            >
              View field-level mappings &rarr;
            </button>
            <button
              type="button"
              className="block cursor-pointer text-xs text-blue-600 hover:underline"
              onClick={() => {/* no-op in demo */}}
            >
              View change history &rarr;
            </button>
          </div>

          {field.resolvedStatus !== 'auto-accepted' && (
            <button
              type="button"
              onClick={() => onAccept(field.id)}
              className="mt-4 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Accept Mapping
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-800">{value}</dd>
    </div>
  );
}
