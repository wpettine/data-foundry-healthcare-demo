import { Navigate } from 'react-router-dom';
import { useScenario } from '../../scenarios/ScenarioContext';
import ScreenContainer from '../../components/layout/ScreenContainer';
import { StatusBadge } from '../../components/feedback/StatusBadge';

const cellVariant = (status: 'met' | 'partial' | 'not-required') => {
  switch (status) {
    case 'met':
      return 'success' as const;
    case 'partial':
      return 'warning' as const;
    case 'not-required':
      return 'default' as const;
  }
};

const cellLabel = (status: 'met' | 'partial' | 'not-required') => {
  switch (status) {
    case 'met':
      return 'Met';
    case 'partial':
      return 'Partial';
    case 'not-required':
      return 'N/A';
  }
};

export default function PayerCriteria() {
  const { payerCriteria } = useScenario();

  if (!payerCriteria) {
    return <Navigate to="/dashboard" replace />;
  }

  const { payers, divergences, patients, patientId, procedureType } = payerCriteria;

  // Build patient lookup map
  const patientMap = new Map(patients.map((p) => [p.id, p]));
  const patient = patientMap.get(patientId);

  // Collect all unique criterion names across payers
  const criterionNames = Array.from(
    new Set(payers.flatMap((p) => p.criteria.map((c) => c.criterionName))),
  );

  // Calculate aggregate readiness score
  const totalCriteria = payers.reduce((sum, payer) => sum + payer.criteria.length, 0);
  const metCriteria = payers.reduce(
    (sum, payer) => sum + payer.criteria.filter((c) => c.status === 'met').length,
    0,
  );
  const readinessPercent = Math.round((metCriteria / totalCriteria) * 100);

  return (
    <ScreenContainer>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">
          Prior Authorization Criteria Comparison
        </h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          <span className="font-mono font-semibold text-gray-900">{patient?.initials}</span>
          <span>&middot;</span>
          <span>
            {patient?.age}
            {patient?.sex}
          </span>
          <span>&middot;</span>
          <span>MRN {patient?.mrn}</span>
          <span>&middot;</span>
          <span>{procedureType}</span>
          <span>&middot;</span>
          <span>{payers.length} payers</span>
          <span>&middot;</span>
          <span className="font-semibold text-gray-900">{readinessPercent}% criteria met</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">
                Criterion
              </th>
              {payers.map((payer) => (
                <th
                  key={payer.id}
                  className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500"
                >
                  {payer.payerName}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">
                Divergence
              </th>
            </tr>
          </thead>
          <tbody>
            {criterionNames.map((criterionName) => {
              const divergence = divergences.find((d) => d.criterionName === criterionName);

              return (
                <tr key={criterionName} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm font-medium text-gray-900">
                    {criterionName}
                  </td>
                  {payers.map((payer) => {
                    const cell = payer.criteria.find((c) => c.criterionName === criterionName);
                    if (!cell) {
                      return (
                        <td key={payer.id} className="px-4 py-3 text-sm text-gray-400">
                          &mdash;
                        </td>
                      );
                    }
                    return (
                      <td key={payer.id} className="px-4 py-3">
                        <div className="space-y-1">
                          <StatusBadge
                            status={cellLabel(cell.status)}
                            variant={cellVariant(cell.status)}
                          />
                          <p className="text-xs text-gray-500">{cell.requirement}</p>
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3">
                    {divergence?.diverging ? (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                          <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                          Divergent
                        </span>
                        <p className="text-xs text-gray-500">{divergence.details}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Aligned</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ScreenContainer>
  );
}
