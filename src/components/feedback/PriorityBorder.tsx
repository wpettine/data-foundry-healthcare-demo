interface PriorityBorderProps {
  urgency: 'high' | 'medium' | 'low';
  children: React.ReactNode;
}

export function PriorityBorder({ urgency, children }: PriorityBorderProps) {
  const borderColorClass =
    urgency === 'high'
      ? 'border-l-red-500'
      : urgency === 'medium'
        ? 'border-l-amber-500'
        : 'border-l-emerald-500';

  return <div className={`border-l-4 ${borderColorClass}`}>{children}</div>;
}
