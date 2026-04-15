import { X } from 'lucide-react';
import type { ModelFeature } from '../../types/model';

interface LiteraturePanelProps {
  feature: ModelFeature | null;
  onClose: () => void;
}

export function LiteraturePanel({ feature, onClose }: LiteraturePanelProps) {
  if (!feature) {
    return (
      <div className="flex h-full items-center justify-center border-l border-gray-200 bg-gray-50/50 p-6">
        <p className="text-sm text-gray-500">Select a feature to view literature citations</p>
      </div>
    );
  }

  const sortedCitations = [...feature.literatureCitations].sort(
    (a, b) => b.relevanceScore - a.relevanceScore,
  );

  return (
    <div className="flex h-full flex-col border-l border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{feature.name}</h3>
            <p className="mt-1 text-xs text-gray-500">
              {sortedCitations.length} supporting publication
              {sortedCitations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Citations list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {sortedCitations.map((citation, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-gray-200 bg-white p-3 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium text-gray-900">{citation.title}</h4>
                <span className="flex-shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium font-[JetBrains_Mono] text-blue-700">
                  {Math.round(citation.relevanceScore * 100)}%
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                {citation.source} · {citation.year}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
