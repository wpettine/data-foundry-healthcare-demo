import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, ExternalLink } from 'lucide-react';
import { ConfidenceBadge } from '../feedback/ConfidenceBadge';
import { StatusBadge } from '../feedback/StatusBadge';
import { MiniProgressBar } from './MiniProgressBar';
import { getConfidenceTier } from '../../utils/confidenceHelpers';
import type { SystemFieldStats } from '../../utils/confidenceHelpers';
import { formatNumber, formatDate } from '../../utils/formatters';
import type { SourceSystem } from '../../types/system';

interface SystemDetailPanelProps {
  system: SourceSystem;
  fieldStats: SystemFieldStats;
  onClose: () => void;
}

export function SystemDetailPanel({ system, fieldStats, onClose }: SystemDetailPanelProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleViewSchema = () => {
    const params = new URLSearchParams(searchParams);
    params.set('system', system.id);
    navigate(`/schema-explorer?${params.toString()}`);
  };

  const tier = getConfidenceTier(system.annotationCompletion);

  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{system.name}</h3>
        <button
          onClick={onClose}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Left: Field breakdown by table */}
        <div className="col-span-3">
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
            Field Mapping by Table
          </h4>
          {fieldStats.byTable.length === 0 ? (
            <p className="text-sm text-gray-400">No field data available</p>
          ) : (
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                    <th className="pb-1.5 pr-3 text-left">Table</th>
                    <th className="pb-1.5 pr-3 text-right">Fields</th>
                    <th className="pb-1.5 pr-3 text-right">Confidence</th>
                    <th className="pb-1.5 w-28">Status Distribution</th>
                  </tr>
                </thead>
                <tbody>
                  {fieldStats.byTable.map((t) => {
                    const total = t.autoAccepted + t.pendingReview + t.manual;
                    return (
                      <tr key={t.table} className="border-b border-gray-50">
                        <td className="py-1.5 pr-3 font-mono text-xs text-gray-700">
                          {t.table}
                        </td>
                        <td className="py-1.5 pr-3 text-right font-[JetBrains_Mono] text-xs text-gray-600">
                          {t.fieldCount}
                        </td>
                        <td className="py-1.5 pr-3 text-right font-[JetBrains_Mono] text-xs text-gray-600">
                          {t.avgConfidence}%
                        </td>
                        <td className="py-1.5">
                          <MiniProgressBar
                            met={total > 0 ? (t.autoAccepted / total) * 100 : 0}
                            review={total > 0 ? (t.pendingReview / total) * 100 : 0}
                            missing={total > 0 ? (t.manual / total) * 100 : 0}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: System metadata */}
        <div className="col-span-2 rounded-lg bg-gray-50 p-3">
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
            System Details
          </h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Platform</dt>
              <dd className="font-medium text-gray-900">{system.platform}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Status</dt>
              <dd>
                <StatusBadge
                  status={system.status === 'integrated' ? 'Connected' : 'In Review'}
                  variant={system.status === 'integrated' ? 'success' : 'warning'}
                />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Confidence</dt>
              <dd><ConfidenceBadge level={tier} /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Locations</dt>
              <dd className="font-[JetBrains_Mono] text-gray-900">{system.locationCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Total Fields</dt>
              <dd className="font-[JetBrains_Mono] text-gray-900">
                {formatNumber(system.fieldCount)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Completion</dt>
              <dd className="font-[JetBrains_Mono] text-gray-900">
                {system.annotationCompletion.toFixed(1)}%
              </dd>
            </div>
            {fieldStats.totalFields > 0 && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Auto-accepted</dt>
                <dd className="font-[JetBrains_Mono] text-gray-900">
                  {fieldStats.autoAccepted} / {fieldStats.totalFields}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Last Sync</dt>
              <dd className="text-gray-900">{formatDate(system.lastSync)}</dd>
            </div>
          </dl>

          <button
            onClick={handleViewSchema}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            View in Schema Explorer
            <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
