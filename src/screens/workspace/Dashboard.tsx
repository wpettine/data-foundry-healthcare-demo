import { useMemo } from 'react';
import { useScenario } from '../../scenarios/ScenarioContext';
import { MetricCard } from '../../components/data-display/MetricCard';
import { DataTable, type ColumnDef } from '../../components/data-display/DataTable';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import ScreenContainer from '../../components/layout/ScreenContainer';
import type { SourceSystem } from '../../types/system';

export default function Dashboard() {
  const { dashboardSummary, systems, dealTimer } = useScenario();

  const sortedSystems = useMemo(
    () => [...systems].sort((a, b) => a.name.localeCompare(b.name)),
    [systems],
  );

  const columns = useMemo<ColumnDef<SourceSystem, any>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ getValue }) => (
          <span className="font-[Inter] font-medium text-gray-900">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'platform',
        header: 'Platform',
        cell: ({ getValue }) => (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 font-[Inter] text-xs font-medium text-gray-700">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'locationCount',
        header: 'Locations',
        cell: ({ getValue }) => getValue<number>(),
      },
      {
        accessorKey: 'fieldCount',
        header: 'Fields Mapped',
        cell: ({ getValue }) => (
          <span className="font-[JetBrains_Mono]">
            {getValue<number>().toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: 'annotationCompletion',
        header: 'Annotation',
        cell: ({ getValue }) => {
          const pct = getValue<number>();
          return (
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="font-[JetBrains_Mono] text-xs text-gray-600">{pct}%</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue<SourceSystem['status']>();
          return (
            <StatusBadge
              status={status === 'integrated' ? 'Integrated' : 'Review'}
              variant={status === 'integrated' ? 'success' : 'warning'}
            />
          );
        },
      },
    ],
    [],
  );

  return (
    <ScreenContainer>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <span className="font-[JetBrains_Mono] text-sm text-gray-500">
          Day {dealTimer.currentDay} / {dealTimer.totalDays} &mdash; {dealTimer.label}
        </span>
      </div>

      <div className="mb-8 grid grid-cols-4 gap-4">
        <MetricCard label="Sources Connected" value={dashboardSummary.totalSystems} />
        <MetricCard
          label="Fields Mapped"
          value={dashboardSummary.totalFields.toLocaleString()}
        />
        <MetricCard
          label="Auto-Annotated"
          value={`${dashboardSummary.autoAnnotatedPercent}%`}
        />
        <MetricCard label="Payer Criteria Sets" value={dashboardSummary.payerCriteriaSets} />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Source Systems</h2>
        </div>
        <DataTable columns={columns} data={sortedSystems} />
      </div>
    </ScreenContainer>
  );
}
