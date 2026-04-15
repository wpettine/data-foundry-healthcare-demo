interface SLACountdownProps {
  surgeryDate: string;
  slaDeadline: string;
}

/** Fixed reference date for demo consistency. */
const DEMO_TODAY = new Date('2026-03-22T00:00:00');

function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function urgencyClasses(days: number): { text: string; dot: string } {
  if (days < 3) return { text: 'text-red-700', dot: 'bg-red-500' };
  if (days <= 7) return { text: 'text-amber-700', dot: 'bg-amber-500' };
  return { text: 'text-emerald-700', dot: 'bg-emerald-500' };
}

export function SLACountdown({ surgeryDate, slaDeadline }: SLACountdownProps) {
  const daysToSurgery = daysBetween(DEMO_TODAY, new Date(surgeryDate));
  const daysToSLA = daysBetween(DEMO_TODAY, new Date(slaDeadline));

  const surgeryUrgency = urgencyClasses(daysToSurgery);
  const slaUrgency = urgencyClasses(daysToSLA);

  return (
    <div className="flex items-center gap-4 text-xs font-medium">
      <span className={`inline-flex items-center gap-1.5 ${surgeryUrgency.text}`}>
        <span className={`inline-block h-2 w-2 rounded-full ${surgeryUrgency.dot}`} aria-hidden="true" />
        Surgery in {daysToSurgery} day{daysToSurgery !== 1 ? 's' : ''}
      </span>
      <span className={`inline-flex items-center gap-1.5 ${slaUrgency.text}`}>
        <span className={`inline-block h-2 w-2 rounded-full ${slaUrgency.dot}`} aria-hidden="true" />
        SLA deadline in {daysToSLA} day{daysToSLA !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
