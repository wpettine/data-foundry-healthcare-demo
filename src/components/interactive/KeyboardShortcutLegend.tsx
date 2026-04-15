import { X } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
  context: string;
}

interface KeyboardShortcutLegendProps {
  shortcuts: Shortcut[];
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutLegend({ shortcuts, isOpen, onClose }: KeyboardShortcutLegendProps) {
  if (!isOpen) return null;

  const grouped = shortcuts.reduce<Record<string, Shortcut[]>>((acc, shortcut) => {
    if (!acc[shortcut.context]) acc[shortcut.context] = [];
    acc[shortcut.context].push(shortcut);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          {Object.entries(grouped).map(([context, items]) => (
            <div key={context} className="mb-5 last:mb-0">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {context}
              </h3>
              <div className="space-y-2">
                {items.map((shortcut) => (
                  <div key={shortcut.key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{shortcut.description}</span>
                    <kbd className="rounded bg-gray-100 px-2 py-0.5 font-[JetBrains_Mono] text-xs text-gray-600">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
