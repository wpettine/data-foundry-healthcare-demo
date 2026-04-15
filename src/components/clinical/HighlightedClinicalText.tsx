import type { DerivedFieldExtraction } from '../../utils/auditTrail';

interface HighlightedClinicalTextProps {
  text: string;
  extractions: DerivedFieldExtraction[];
  onFieldClick?: (fieldName: string) => void;
  highlightedFieldName?: string | null;
}

interface Span {
  text: string;
  extraction?: DerivedFieldExtraction;
}

export function HighlightedClinicalText({
  text,
  extractions,
  onFieldClick,
  highlightedFieldName,
}: HighlightedClinicalTextProps) {
  // Build spans array from text and extractions
  const spans: Span[] = [];
  let currentPos = 0;

  // Filter out extractions that don't have valid positions (not found in text)
  const validExtractions = extractions.filter((e) => e.startChar >= 0 && e.endChar > e.startChar);

  // Sort by start position to handle overlapping/nested spans
  const sortedExtractions = [...validExtractions].sort((a, b) => a.startChar - b.startChar);

  sortedExtractions.forEach((extraction) => {
    // Add gap text before this extraction
    if (currentPos < extraction.startChar) {
      spans.push({ text: text.slice(currentPos, extraction.startChar) });
    }

    // Add the highlighted extraction
    spans.push({ text: text.slice(extraction.startChar, extraction.endChar), extraction });

    currentPos = extraction.endChar;
  });

  // Add remaining text after last extraction
  if (currentPos < text.length) {
    spans.push({ text: text.slice(currentPos) });
  }

  // If no valid extractions, just show plain text
  if (validExtractions.length === 0) {
    spans.push({ text });
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="font-sans text-sm leading-relaxed text-gray-900 p-4">
        {spans.map((span, idx) => {
          if (!span.extraction) {
            // Plain text
            return <span key={idx}>{span.text}</span>;
          }

          // Highlighted extraction
          const extraction = span.extraction;
          const isHighlighted = highlightedFieldName === extraction.fieldName;

          // Confidence-based opacity (higher confidence = brighter)
          let opacity = '30';
          if (extraction.confidence >= 95) opacity = '30';
          else if (extraction.confidence >= 85) opacity = '25';
          else opacity = '20';

          return (
            <span
              key={idx}
              className={`
                cursor-pointer font-medium transition-all
                ${isHighlighted ? 'ring-2 ring-blue-500 ring-offset-1' : 'hover:bg-opacity-50'}
              `}
              style={{
                backgroundColor: `${extraction.highlightColor}${opacity}`,
                borderBottom: `2px solid ${extraction.highlightColor}`,
              }}
              onClick={() => onFieldClick?.(extraction.fieldName)}
              title={`${extraction.fieldName}: ${extraction.confidence}% confidence`}
            >
              {span.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
