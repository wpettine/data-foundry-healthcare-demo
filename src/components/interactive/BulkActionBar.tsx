import { X, CheckCircle, Flag, UserPlus } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  onAcceptAllHigh: () => void;
  onFlag?: () => void;
  onReassign?: () => void;
  onDismiss: () => void;
}

export function BulkActionBar({
  selectedCount,
  onAcceptAllHigh,
  onFlag,
  onReassign,
  onDismiss,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-blue-200 bg-blue-50 px-4 py-2">
      <span className="text-sm font-medium text-blue-900">
        {selectedCount} selected
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={onAcceptAllHigh}
          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
        >
          <CheckCircle size={14} />
          Accept All High
        </button>

        {onFlag && (
          <button
            onClick={onFlag}
            className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
          >
            <Flag size={14} />
            Flag
          </button>
        )}

        {onReassign && (
          <button
            onClick={onReassign}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            <UserPlus size={14} />
            Reassign
          </button>
        )}
      </div>

      <div className="flex-1" />

      <button
        onClick={onDismiss}
        className="rounded p-1 text-gray-500 hover:bg-blue-100 hover:text-gray-700"
        aria-label="Dismiss selection"
      >
        <X size={16} />
      </button>
    </div>
  );
}
