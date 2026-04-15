import type { Patient } from '../../types/patient';

interface PatientSwitcherProps {
  patients: Patient[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const riskColors = {
  low: 'bg-emerald-50 text-emerald-700',
  moderate: 'bg-amber-50 text-amber-700',
  high: 'bg-red-50 text-red-700',
} as const;

export function PatientSwitcher({ patients, selectedId, onSelect }: PatientSwitcherProps) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      {patients.map((patient) => {
        const isSelected = patient.id === selectedId;
        return (
          <button
            key={patient.id}
            onClick={() => onSelect(patient.id)}
            className={`flex flex-shrink-0 items-center gap-3 rounded-lg border-2 bg-white px-4 py-3 text-left transition-colors ${
              isSelected
                ? 'border-blue-500 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
              {patient.initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {patient.initials}
                </span>
                <span className="font-[JetBrains_Mono] text-xs text-gray-500">
                  {patient.age}{patient.sex}
                </span>
              </div>
              {patient.riskLevel && (
                <span
                  className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${riskColors[patient.riskLevel]}`}
                >
                  {patient.riskLevel} risk
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
