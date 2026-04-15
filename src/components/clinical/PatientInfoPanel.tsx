import type { Patient } from '../../types/patient';
import type { SourceSystem } from '../../types/system';

interface PatientInfoPanelProps {
  patient: Patient;
  systems?: SourceSystem[];
}

export function PatientInfoPanel({ patient, systems = [] }: PatientInfoPanelProps) {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
      {/* Demographics */}
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Demographics
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-base font-semibold text-gray-700">
            {patient.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{patient.initials}</span>
              <span className="font-[JetBrains_Mono] text-xs text-gray-500">
                {patient.age}{patient.sex}
              </span>
            </div>
            <div className="font-[JetBrains_Mono] text-xs text-gray-500">
              MRN: {patient.mrn}
            </div>
            <div className="font-[JetBrains_Mono] text-xs text-gray-500">
              DOB: {patient.dateOfBirth}
            </div>
          </div>
        </div>
      </section>

      {/* Diagnoses */}
      {patient.diagnoses.length > 0 && (
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Diagnoses
          </h3>
          <ul className="space-y-1">
            {patient.diagnoses.map((dx, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 rounded bg-gray-100 px-1.5 py-0.5 font-[JetBrains_Mono] text-[10px] text-gray-600">
                  {dx.code}
                </span>
                <span className="text-gray-700">{dx.description}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Medications */}
      {patient.medications.length > 0 && (
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Medications
          </h3>
          <ul className="space-y-2">
            {patient.medications.map((med, i) => {
              const system = systems.find((s) => s.id === med.sourceSystemId);
              return (
                <li key={i} className="text-sm">
                  <div>
                    <span className="font-medium text-gray-900">{med.name}</span>
                    <span className="ml-1 font-[JetBrains_Mono] text-xs text-gray-500">
                      {med.dose} {med.frequency}
                    </span>
                  </div>
                  {system && (
                    <span
                      className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${system.accentColor}15`,
                        color: system.accentColor,
                      }}
                    >
                      {system.name}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Allergies */}
      {patient.allergies.length > 0 && (
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Allergies
          </h3>
          <div className="flex flex-wrap gap-1">
            {patient.allergies.map((allergy) => (
              <span
                key={allergy}
                className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs text-red-700"
              >
                {allergy}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Pre-op Values */}
      {patient.preOpValues && Object.keys(patient.preOpValues).length > 0 && (
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Pre-Op Values
          </h3>
          <div className="space-y-2">
            {Object.entries(patient.preOpValues).map(([key, val]) => {
              const valueData = typeof val === 'string' ? { value: val } : val;
              const system = systems.find((s) => s.id === valueData.sourceSystemId);
              return (
                <div key={key}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-gray-500">{key}</span>
                    <span className="font-[JetBrains_Mono] text-xs font-medium text-gray-900">
                      {valueData.value}
                    </span>
                  </div>
                  {system && (
                    <span
                      className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${system.accentColor}15`,
                        color: system.accentColor,
                      }}
                    >
                      {system.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
