import type { PARequirement } from '../../types/pa';

interface SemanticInferenceDetailProps {
  requirement: PARequirement;
  onAccept: () => void;
  onOverride: () => void;
  onFlag: () => void;
}

export function SemanticInferenceDetail({
  requirement,
  onAccept,
  onOverride,
  onFlag,
}: SemanticInferenceDetailProps) {
  if (!requirement.semanticInference) return null;

  const { sourceText, explanation, alternatives } = requirement.semanticInference;

  return (
    <div className="mt-3 space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
      {/* Payer's Criterion Text */}
      <div className="space-y-1">
        <div className="text-xs font-semibold text-gray-700">Payer's Criterion</div>
        <p className="text-xs leading-relaxed text-gray-600">{requirement.criterionText}</p>
      </div>

      {/* Extracted Evidence */}
      <div className="space-y-1 rounded-lg bg-slate-50 p-3">
        <div className="text-xs font-semibold text-gray-700">Extracted Evidence</div>
        <p className="text-xs italic leading-relaxed text-gray-700">"{sourceText}"</p>
      </div>

      {/* Semantic Inference */}
      <div className="space-y-1">
        <div className="text-xs font-semibold text-gray-700">Semantic Inference</div>
        <p className="text-xs leading-relaxed text-gray-600">{explanation}</p>
      </div>

      {/* Alternative Interpretations */}
      {alternatives && alternatives.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-700">Alternative Interpretations</div>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">Alternative</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">Confidence</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {alternatives.map((alt, i) => (
                  <tr key={i} className={i === alternatives.length - 1 ? 'bg-blue-50' : ''}>
                    <td className="px-3 py-2 text-gray-700">
                      {i === alternatives.length - 1 && <strong>{alt.concept}</strong>}
                      {i !== alternatives.length - 1 && alt.concept}
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-[JetBrains_Mono] text-gray-900">
                        {Math.round(alt.confidence * 100)}%
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-600">
                      {i === alternatives.length - 1 && <strong>Best match to payer language</strong>}
                      {i === 0 && '"Inadequate" suggests incomplete, not failed'}
                      {i === 1 && 'PT note shows LEFS score improvement slowed'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onAccept}
          className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
        >
          Accept (A)
        </button>
        <button
          onClick={onOverride}
          className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          Override & Edit
        </button>
        <button
          onClick={onFlag}
          className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          Flag for Review
        </button>
      </div>
    </div>
  );
}
