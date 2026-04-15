interface ConfidenceBadgeProps {
  level: 'high' | 'medium' | 'low';
  value?: number;
}

const config = {
  high: {
    dotColor: 'bg-[#059669]',
    label: 'High',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  medium: {
    dotColor: 'bg-[#D97706]',
    label: 'Review',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  low: {
    dotColor: 'bg-[#DC2626]',
    label: 'Manual',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
} as const;

export function ConfidenceBadge({ level, value }: ConfidenceBadgeProps) {
  const { dotColor, label, textColor, bgColor, borderColor } = config[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${bgColor} ${borderColor} ${textColor}`}
    >
      <span className={`inline-block h-2 w-2 rounded-full ${dotColor}`} aria-hidden="true" />
      {level === 'high' ? label : value !== undefined ? `${label} ${value}%` : label}
    </span>
  );
}
