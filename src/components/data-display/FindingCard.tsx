import { CheckCircle2, XCircle } from 'lucide-react';
import type { AIFinding } from '../../types/annotation';
import { ConfidenceBadge } from '../feedback/ConfidenceBadge';
import { StatusBadge } from '../feedback/StatusBadge';

interface FindingCardProps {
  finding: AIFinding;
  isSelected: boolean;
  onApprove: () => void;
  onReject: () => void;
  onSelect: () => void;
}

const statusVariant = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
} as const;

export function FindingCard({
  finding,
  isSelected,
  onApprove,
  onReject,
  onSelect,
}: FindingCardProps) {
  return (
    <div
      className={`cursor-pointer rounded-lg border bg-white transition-colors ${
        isSelected ? 'border-blue-300 shadow-sm' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Collapsed header — always visible */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{finding.title}</p>
          <p className="mt-0.5 text-xs text-gray-500">
            Onset Day {finding.onsetDay} &middot; {finding.detectionMethod}
          </p>
        </div>
        <ConfidenceBadge level={finding.confidenceLevel} value={finding.confidence} />
        <StatusBadge status={finding.status} variant={statusVariant[finding.status]} />
      </div>

      {/* Expanded detail — only when selected */}
      {isSelected && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-4">
          {/* Signal contributions stacked bar */}
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Signal Contributions
            </p>
            <div className="flex h-5 w-full overflow-hidden rounded">
              {finding.signalContributions.map((sc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center text-[10px] font-medium text-white"
                  style={{ width: `${sc.percentage}%`, backgroundColor: sc.color }}
                  title={`${sc.signal}: ${sc.percentage}%`}
                >
                  {sc.percentage >= 12 && `${sc.percentage}%`}
                </div>
              ))}
            </div>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
              {finding.signalContributions.map((sc, i) => (
                <span key={i} className="flex items-center gap-1 text-[11px] text-gray-600">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: sc.color }}
                  />
                  {sc.signal} ({sc.percentage}%)
                </span>
              ))}
            </div>
          </div>

          {/* Knowledge base source pills */}
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Knowledge Sources
            </p>
            <div className="flex flex-wrap gap-1.5">
              {finding.knowledgeSources.map((kb) => (
                <span
                  key={kb.id}
                  className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700"
                  title={kb.excerpt}
                >
                  {kb.label}
                </span>
              ))}
            </div>
          </div>

          {/* Differential table */}
          {finding.differential.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Differential
              </p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-1 text-left font-medium text-gray-500">Condition</th>
                    <th className="py-1 text-left font-medium text-gray-500">Probability</th>
                    <th className="py-1 text-left font-medium text-gray-500">Reasoning</th>
                  </tr>
                </thead>
                <tbody>
                  {finding.differential.map((d, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-1 font-medium text-gray-900">{d.condition}</td>
                      <td className="py-1">
                        <span
                          className={`text-xs font-medium ${
                            d.probability === 'high' ? 'text-emerald-600' : 'text-gray-500'
                          }`}
                        >
                          {d.probability}
                        </span>
                      </td>
                      <td className="py-1 text-gray-600">{d.reasoning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Clinical correlates */}
          {finding.clinicalCorrelates.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Clinical Correlates
              </p>
              <ul className="space-y-0.5">
                {finding.clinicalCorrelates.map((cc, i) => (
                  <li key={i} className="text-xs text-gray-700">
                    <span className="font-medium">{cc.eventId}</span>
                    <span className="text-gray-400"> — </span>
                    {cc.relationship}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action buttons */}
          {finding.status === 'pending' && (
            <div className="flex items-center gap-2 pt-1">
              <button
                className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove();
                }}
              >
                <CheckCircle2 size={14} />
                Approve
              </button>
              <button
                className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject();
                }}
              >
                <XCircle size={14} />
                Reject
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
