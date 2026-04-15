interface ViewToggleProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}

export function ViewToggle({ options, active, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5">
      {options.map((option) => {
        const isActive = option === active;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
