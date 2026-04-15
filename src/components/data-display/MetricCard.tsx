import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: { direction: 'up' | 'down' | 'flat'; label: string };
}

const trendConfig = {
  up: { icon: TrendingUp, color: 'text-emerald-600' },
  down: { icon: TrendingDown, color: 'text-red-600' },
  flat: { icon: Minus, color: 'text-gray-500' },
} as const;

export function MetricCard({ label, value, trend }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="font-[Inter] text-[12px] font-normal text-gray-500">{label}</p>
      <p className="mt-1 font-[JetBrains_Mono] text-[24px] font-bold leading-tight text-gray-900">
        {value}
      </p>
      {trend && (
        <div className={`mt-2 flex items-center gap-1 ${trendConfig[trend.direction].color}`}>
          {(() => {
            const Icon = trendConfig[trend.direction].icon;
            return <Icon size={14} />;
          })()}
          <span className="text-xs font-medium">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
