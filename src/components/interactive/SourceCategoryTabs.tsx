interface SourceCategoryTabsProps {
  categories: string[];
  active: string;
  onChange: (value: string) => void;
}

export function SourceCategoryTabs({ categories, active, onChange }: SourceCategoryTabsProps) {
  return (
    <div className="flex border-b border-gray-200">
      {categories.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {category}
            {isActive && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-700" />
            )}
          </button>
        );
      })}
    </div>
  );
}
