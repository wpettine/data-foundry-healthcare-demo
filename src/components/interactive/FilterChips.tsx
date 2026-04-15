export type FilterOption = string | { value: string; label: string };

function normalizeOption(opt: FilterOption): { value: string; label: string } {
  return typeof opt === 'string' ? { value: opt, label: opt } : opt;
}

export interface FilterGroupDef {
  label: string;
  options: FilterOption[];
  active: string;
  onChange: (value: string) => void;
}

interface FilterChipsProps {
  groups: FilterGroupDef[];
}

export function FilterChips({ groups }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {groups.map((group, gi) => (
        <div key={group.label} className="flex items-center gap-2">
          {gi > 0 && <span className="mr-2 h-4 w-px bg-gray-200" />}
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            {group.label}
          </span>
          <div className="flex items-center gap-1">
            {group.options.map((raw) => {
              const opt = normalizeOption(raw);
              const isActive = opt.value === group.active;
              return (
                <button
                  key={opt.value}
                  onClick={() => group.onChange(opt.value)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
