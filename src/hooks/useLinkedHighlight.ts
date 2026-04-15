import { usePAStore } from '../store/paStore';

export function useLinkedHighlight() {
  const highlightedRequirementId = usePAStore((s) => s.highlightedRequirementId);
  const highlightedEvidenceId = usePAStore((s) => s.highlightedEvidenceId);
  const setHighlightedRequirement = usePAStore((s) => s.setHighlightedRequirement);
  const setHighlightedEvidence = usePAStore((s) => s.setHighlightedEvidence);

  return {
    highlightedRequirementId,
    highlightedEvidenceId,
    setHighlightedRequirement,
    setHighlightedEvidence,
  };
}
