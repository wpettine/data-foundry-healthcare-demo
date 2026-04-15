interface PayerBadgeProps {
  payerName: string;
}

// Map payer names to colors (extend as needed)
const payerColorMap: Record<string, string> = {
  'BCBS MA': 'bg-blue-100 text-blue-700',
  'Aetna MA': 'bg-purple-100 text-purple-700',
  UnitedHealthcare: 'bg-teal-100 text-teal-700',
  'Humana MA': 'bg-amber-100 text-amber-700',
  Medicare: 'bg-emerald-100 text-emerald-700',
};

export function PayerBadge({ payerName }: PayerBadgeProps) {
  const colorClass = payerColorMap[payerName] || 'bg-gray-100 text-gray-700';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {payerName}
    </span>
  );
}
