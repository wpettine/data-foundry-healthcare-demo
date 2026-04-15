import React from 'react';
import type { AIFinding } from '../../types/annotation';

interface ReasoningNarrativeProps {
  narrative: string;
  finding: AIFinding;
}

/**
 * Simple markdown-like rendering: bold, headers, lists, and inline highlights
 * for signal contributions and KB references found in the finding data.
 */
export function ReasoningNarrative({ narrative, finding }: ReasoningNarrativeProps) {
  const signalTerms = finding.signalContributions.map((s) => s.signal);
  const kbLabels = finding.knowledgeSources.map((k) => k.label);

  function renderLine(line: string, idx: number): React.ReactElement {
    // Headers
    if (line.startsWith('### ')) {
      return (
        <h4 key={idx} className="mb-1 mt-3 text-xs font-semibold text-gray-900">
          {highlightTerms(line.slice(4))}
        </h4>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <h3 key={idx} className="mb-1 mt-4 text-sm font-semibold text-gray-900">
          {highlightTerms(line.slice(3))}
        </h3>
      );
    }
    if (line.startsWith('# ')) {
      return (
        <h2 key={idx} className="mb-2 mt-4 text-base font-bold text-gray-900">
          {highlightTerms(line.slice(2))}
        </h2>
      );
    }

    // Unordered list items
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return (
        <li key={idx} className="ml-4 list-disc text-sm text-gray-700">
          {highlightTerms(processBold(line.slice(2)))}
        </li>
      );
    }

    // Empty line
    if (line.trim() === '') {
      return <div key={idx} className="h-2" />;
    }

    // Regular paragraph
    return (
      <p key={idx} className="text-sm leading-relaxed text-gray-700">
        {highlightTerms(processBold(line))}
      </p>
    );
  }

  function processBold(text: string): string {
    // Just returns the text — actual bold rendering happens in highlightTerms
    return text;
  }

  function highlightTerms(text: string): React.ReactElement {
    // Split text on **bold** markers first
    const boldParts = text.split(/\*\*(.*?)\*\*/g);
    const elements: React.ReactElement[] = [];

    boldParts.forEach((part, i) => {
      if (i % 2 === 1) {
        // Bold segment
        elements.push(
          <strong key={`b-${i}`} className="font-semibold text-gray-900">
            {part}
          </strong>,
        );
      } else {
        // Check for signal and KB highlights within plain text
        let remaining = part;
        let partIdx = 0;

        // Highlight signal contributions
        for (const term of signalTerms) {
          if (remaining.includes(term)) {
            const contribution = finding.signalContributions.find((s) => s.signal === term);
            const pieces = remaining.split(term);
            pieces.forEach((piece, j) => {
              if (piece) {
                elements.push(<span key={`s-${i}-${partIdx++}`}>{piece}</span>);
              }
              if (j < pieces.length - 1) {
                elements.push(
                  <span
                    key={`sig-${i}-${partIdx++}`}
                    className="rounded px-1 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: contribution ? `${contribution.color}20` : '#EFF6FF',
                      color: contribution?.color ?? '#1D4ED8',
                    }}
                  >
                    {term}
                  </span>,
                );
              }
            });
            remaining = '';
            break;
          }
        }

        // Highlight KB references
        for (const label of kbLabels) {
          if (remaining.includes(label)) {
            const pieces = remaining.split(label);
            pieces.forEach((piece, j) => {
              if (piece) {
                elements.push(<span key={`k-${i}-${partIdx++}`}>{piece}</span>);
              }
              if (j < pieces.length - 1) {
                elements.push(
                  <span
                    key={`kb-${i}-${partIdx++}`}
                    className="rounded bg-purple-50 px-1 py-0.5 text-xs font-medium text-purple-700"
                  >
                    {label}
                  </span>,
                );
              }
            });
            remaining = '';
            break;
          }
        }

        // If no highlights matched, just output the remaining text
        if (remaining) {
          elements.push(<span key={`r-${i}-${partIdx}`}>{remaining}</span>);
        }
      }
    });

    return <>{elements}</>;
  }

  const lines = narrative.split('\n');

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="space-y-0.5">{lines.map((line, idx) => renderLine(line, idx))}</div>

      {/* Signal contribution legend */}
      {finding.signalContributions.length > 0 && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Signal Contributions
          </h4>
          <div className="flex flex-wrap gap-2">
            {finding.signalContributions.map((sig) => (
              <div
                key={sig.signal}
                className="flex items-center gap-1.5 rounded-full border px-2 py-0.5"
                style={{ borderColor: `${sig.color}40`, backgroundColor: `${sig.color}10` }}
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: sig.color }}
                />
                <span className="text-xs text-gray-700">{sig.signal}</span>
                <span className="font-[JetBrains_Mono] text-[10px] font-medium text-gray-500">
                  {sig.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KB sources */}
      {finding.knowledgeSources.length > 0 && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Knowledge Sources
          </h4>
          <div className="space-y-1.5">
            {finding.knowledgeSources.map((kb) => (
              <div key={kb.id} className="rounded bg-gray-50 px-3 py-2">
                <span className="text-xs font-medium text-purple-700">{kb.label}</span>
                <p className="mt-0.5 text-xs text-gray-500">{kb.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
