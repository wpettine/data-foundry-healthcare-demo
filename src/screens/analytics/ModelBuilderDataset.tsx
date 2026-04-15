import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useScenario } from '../../scenarios/ScenarioContext';
import { MetricCard } from '../../components/data-display/MetricCard';
import { DataTable, type ColumnDef } from '../../components/data-display/DataTable';
import ScreenContainer from '../../components/layout/ScreenContainer';
import { useModelStore } from '../../store/modelStore';
import type { TrainingRecord } from '../../types/model';

const outcomeBadge = {
  complication: 'bg-red-50 text-red-700 border-red-200',
  'no-complication': 'bg-emerald-50 text-emerald-700 border-emerald-200',
} as const;

export default function ModelBuilderDataset() {
  const { analytics } = useScenario();
  const { assemblyPhase } = useModelStore();

  const columns = useMemo<ColumnDef<TrainingRecord, unknown>[]>(() => {
    if (!analytics) return [];

    // Pick 2-3 key feature columns from the first record's feature keys
    const sampleFeatures = analytics.trainingData[0]?.features ?? {};
    const featureKeys = Object.keys(sampleFeatures).slice(0, 3);

    const baseCols: ColumnDef<TrainingRecord, unknown>[] = [
      {
        accessorKey: 'patientId',
        header: 'Patient ID',
        cell: (info) => (
          <span className="font-[JetBrains_Mono] text-xs">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'siteId',
        header: 'Site',
        cell: (info) => (
          <span className="text-xs text-gray-700">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'outcome',
        header: 'Outcome',
        cell: (info) => {
          const val = info.getValue() as TrainingRecord['outcome'];
          return (
            <span
              className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium ${outcomeBadge[val]}`}
            >
              {val}
            </span>
          );
        },
      },
      {
        accessorKey: 'completeness',
        header: 'Completeness',
        cell: (info) => {
          const val = info.getValue() as number;
          return (
            <span className="font-[JetBrains_Mono] text-xs">
              {val}%
            </span>
          );
        },
      },
    ];

    // Add dynamic feature columns
    const featureCols: ColumnDef<TrainingRecord, unknown>[] = featureKeys.map((key) => ({
      id: `feature_${key}`,
      header: key,
      accessorFn: (row: TrainingRecord) => row.features[key] ?? '--',
      cell: (info: { getValue: () => unknown }) => (
        <span className="font-[JetBrains_Mono] text-xs text-gray-600">
          {String(info.getValue())}
        </span>
      ),
    }));

    return [...baseCols, ...featureCols];
  }, [analytics]);

  if (!analytics) {
    return <Navigate to="/dashboard" replace />;
  }

  if (assemblyPhase !== 'complete') {
    return <Navigate to="/model-builder" replace />;
  }

  const { trainingData, modelProject } = analytics;
  const displayRows = trainingData.slice(0, 50);

  const avgCompleteness =
    trainingData.length > 0
      ? Math.round(
          trainingData.reduce((sum, r) => sum + r.completeness, 0) / trainingData.length,
        )
      : 0;

  return (
    <ScreenContainer>
      <h1 className="text-lg font-semibold text-gray-900">Assembled Dataset</h1>
      <p className="mt-1 text-sm text-gray-500">
        {modelProject.name} &middot; {modelProject.population}
      </p>

      {/* Metric cards */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <MetricCard label="Total Rows" value={trainingData.length.toLocaleString()} />
        <MetricCard label="Feature Count" value={modelProject.features.length} />
        <MetricCard label="Avg Completeness" value={`${avgCompleteness}%`} />
      </div>

      {/* Data table */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">
            Training Data (showing {displayRows.length} of {trainingData.length})
          </h2>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white">
          <DataTable columns={columns} data={displayRows} />
        </div>
      </section>
    </ScreenContainer>
  );
}
