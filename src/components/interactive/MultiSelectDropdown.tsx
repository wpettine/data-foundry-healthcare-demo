import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allSelected = selected.length === 0 || selected.length === options.length;
  const someSelected = selected.length > 0 && selected.length < options.length;

  const displayText = allSelected
    ? `All ${label} (${options.length})`
    : `${selected.length} ${selected.length === 1 ? label.slice(0, -1) : label.toLowerCase()} selected`;

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      const newSelected = selected.filter((v) => v !== value);
      onChange(newSelected.length === 0 ? [] : newSelected);
    } else {
      onChange([...selected, value]);
    }
  };

  const toggleAll = () => {
    if (allSelected) {
      // If all selected, deselect all
      onChange([]);
    } else {
      // If some or none selected, select all (which is represented by empty array)
      onChange([]);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
          {label}
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <span>{displayText}</span>
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="max-h-80 overflow-y-auto">
            {/* All option */}
            <button
              type="button"
              onClick={toggleAll}
              className="flex w-full items-center gap-2 border-b border-gray-200 px-3 py-2 text-left text-sm hover:bg-gray-50"
            >
              <div className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white">
                {allSelected && <Check size={12} className="text-blue-600" />}
                {someSelected && (
                  <div className="h-2 w-2 rounded-sm bg-blue-600" />
                )}
              </div>
              <span className="font-medium text-gray-900">
                All {label} ({options.length})
              </span>
            </button>

            {/* Individual options */}
            {options.map((option) => {
              const isSelected = allSelected || selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleOption(option.value)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white">
                    {isSelected && <Check size={12} className="text-blue-600" />}
                  </div>
                  <span className="text-gray-700">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
