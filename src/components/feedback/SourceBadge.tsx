interface SourceBadgeProps {
  systemName: string;
  accentColor: string;
}

export function SourceBadge({ systemName, accentColor }: SourceBadgeProps) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 py-0.5 pr-2.5 pl-2 text-xs font-medium text-gray-700"
      style={{ borderLeftColor: accentColor, borderLeftWidth: 3 }}
    >
      <span className="max-w-[120px] truncate">{systemName}</span>
    </span>
  );
}
