import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface IdentitySystem {
  systemId: string;
  systemName: string;
  patientId: string;
  matchMethod: string;
  confidence: number;
  verified: string;
}

interface IdentityResolutionTableProps {
  matchedSystemsCount: number;
  overallConfidence: number;
  matchMethod: string;
  systems: IdentitySystem[];
}

export function IdentityResolutionTable({
  matchedSystemsCount,
  overallConfidence,
  matchMethod,
  systems,
}: IdentityResolutionTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const confidencePercent = (overallConfidence * 100).toFixed(1);

  return (
    <div className="rounded-lg border border-gray-200 bg-slate-50 p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Identity Resolution
        </h3>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        )}
      </button>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-gray-500">Matched Across</span>
          <span className="font-medium text-gray-900">{matchedSystemsCount} systems</span>
        </div>
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-gray-500">Match Method</span>
          <span className="text-gray-900">{matchMethod}</span>
        </div>
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-gray-500">Overall Confidence</span>
          <span className="font-[JetBrains_Mono] text-gray-900">{confidencePercent}%</span>
        </div>
      </div>

      {isExpanded && systems.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left font-semibold text-gray-500">System</th>
                <th className="pb-2 text-left font-semibold text-gray-500">Patient ID</th>
                <th className="pb-2 text-left font-semibold text-gray-500">Match Method</th>
                <th className="pb-2 text-right font-semibold text-gray-500">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {systems.map((sys, i) => (
                <tr key={sys.systemId} className={i > 0 ? 'border-t border-gray-100' : ''}>
                  <td className="py-2 text-gray-700">{sys.systemName}</td>
                  <td className="py-2 font-[JetBrains_Mono] text-gray-900">{sys.patientId}</td>
                  <td className="py-2 text-gray-600">{sys.matchMethod}</td>
                  <td className="py-2 text-right font-[JetBrains_Mono] text-gray-900">
                    {sys.confidence ? `${sys.confidence.toFixed(1)}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
