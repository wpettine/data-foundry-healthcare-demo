import type { ClinicalEvent } from '../../types/clinical';

interface ClinicalEventCardProps {
  event: ClinicalEvent;
  accentColor: string;
}

export function ClinicalEventCard({ event, accentColor }: ClinicalEventCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-sm text-gray-400">{event.icon}</span>
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-medium text-gray-900">{event.title}</p>
            <span className="font-[JetBrains_Mono] text-[11px] text-gray-400">
              Day {event.day}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-600">{event.description}</p>
          <span
            className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
            style={{ backgroundColor: accentColor }}
          >
            {event.sourceSystemId}
          </span>
        </div>
      </div>
    </div>
  );
}
