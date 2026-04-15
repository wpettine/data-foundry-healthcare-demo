interface ToastProps {
  message: string;
  onUndo?: () => void;
  onDismiss: () => void;
}

export function Toast({ message, onUndo, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <span className="text-sm text-gray-700">{message}</span>
      {onUndo && (
        <button
          type="button"
          onClick={onUndo}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Undo
        </button>
      )}
      <button
        type="button"
        onClick={onDismiss}
        className="ml-1 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
