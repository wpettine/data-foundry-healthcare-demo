import type { Patient } from '../../types/patient';

interface PatientSelectorProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
  recordCounts?: Record<string, number>; // Optional record counts per patient
}

export function PatientSelector({
  patients,
  selectedPatientId,
  onSelectPatient,
  recordCounts,
}: PatientSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
        Select Patient
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {patients.map((patient) => {
          const isSelected = patient.id === selectedPatientId;
          const recordCount = recordCounts?.[patient.id] || 0;

          return (
            <button
              key={patient.id}
              onClick={() => onSelectPatient(patient.id)}
              className={`
                flex-shrink-0 rounded-lg border-2 px-4 py-3 text-left transition-all
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-base font-semibold ${
                    isSelected ? 'text-blue-900' : 'text-gray-900'
                  }`}
                >
                  {patient.initials}
                </span>
                <span className="text-xs text-gray-500">
                  {patient.age}
                  {patient.sex}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                DOB {patient.dateOfBirth}
              </div>
              {recordCounts && (
                <div className="mt-2 text-xs font-medium text-gray-600">
                  {recordCount} record{recordCount !== 1 ? 's' : ''}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
