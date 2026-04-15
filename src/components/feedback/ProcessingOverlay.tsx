interface ProcessingOverlayProps {
  phases: string[];
  currentPhase: number;
  isActive: boolean;
}

export function ProcessingOverlay({ phases, currentPhase, isActive }: ProcessingOverlayProps) {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-xl">
        <ul className="flex flex-col gap-3">
          {phases.map((phase, idx) => {
            const isCompleted = idx < currentPhase;
            const isCurrent = idx === currentPhase;

            return (
              <li
                key={idx}
                className={`flex items-center gap-3 text-sm ${
                  isCompleted
                    ? 'text-emerald-700'
                    : isCurrent
                      ? 'font-medium text-gray-900'
                      : 'text-gray-400'
                }`}
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                  {isCompleted ? (
                    <svg
                      className="h-4 w-4 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isCurrent ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
                  ) : (
                    <span className="inline-block h-2 w-2 rounded-full bg-gray-300" />
                  )}
                </span>
                {phase}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
