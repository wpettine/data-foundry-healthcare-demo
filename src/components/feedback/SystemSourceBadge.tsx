import { Stethoscope, Activity, Bone, Pill, ScanLine } from 'lucide-react';

interface SystemSourceBadgeProps {
  systemType: 'pcp-emr' | 'pt' | 'ortho-emr' | 'pharmacy' | 'radiology';
  systemName: string;
  facility?: string;
  recordDate?: string;
  documentType?: string;
}

const SYSTEM_CONFIG = {
  'pcp-emr': {
    color: 'bg-blue-100 text-blue-700',
    icon: Stethoscope,
  },
  'pt': {
    color: 'bg-purple-100 text-purple-700',
    icon: Activity,
  },
  'ortho-emr': {
    color: 'bg-teal-100 text-teal-700',
    icon: Bone,
  },
  'pharmacy': {
    color: 'bg-amber-100 text-amber-700',
    icon: Pill,
  },
  'radiology': {
    color: 'bg-rose-100 text-rose-700',
    icon: ScanLine,
  },
} as const;

export function SystemSourceBadge({
  systemType,
  systemName,
  facility,
  recordDate,
  documentType,
}: SystemSourceBadgeProps) {
  const config = SYSTEM_CONFIG[systemType];
  const Icon = config.icon;

  // Build tooltip content
  const tooltipParts = [systemName];
  if (facility) tooltipParts.push(facility);
  if (recordDate) {
    const formatted = new Date(recordDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    tooltipParts.push(formatted);
  }
  if (documentType) tooltipParts.push(documentType);
  const tooltip = tooltipParts.join(' | ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}
      title={tooltip}
    >
      <Icon className="h-4 w-4" />
      {systemName}
    </span>
  );
}
