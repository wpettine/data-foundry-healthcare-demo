import { useMemo } from 'react';
import { useScenario } from '../../scenarios/ScenarioContext';
import { MetricCard } from '../../components/data-display/MetricCard';
import { DataTable, type ColumnDef } from '../../components/data-display/DataTable';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import ScreenContainer from '../../components/layout/ScreenContainer';
import type { PipelineAlert } from '../../types/pipeline';

export default function PipelineHealth() {
  const { pipelineAlerts } = useScenario();

  const activeAlerts = pipelineAlerts.filter((a) => !a.resolved).length;
  const resolvedToday = pipelineAlerts.filter((a) => a.resolved).length;
  const systemsAffected = new Set(pipelineAlerts.filter((a) => !a.resolved).map((a) => a.systemId)).size;

  const columns = useMemo<ColumnDef<PipelineAlert>[]>(
    () => [
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ getValue }) => {
          const t = getValue<string>();
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
              {t.replace(/-/g, ' ')}
            </span>
          );
        },
      },
      {
        accessorKey: 'systemName',
        header: 'System',
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-700 line-clamp-2">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'timestamp',
        header: 'Time',
        cell: ({ getValue }) => {
          const d = new Date(getValue<string>());
          return (
            <span className="font-['JetBrains_Mono'] text-sm text-gray-600">
              {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}
              {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          );
        },
      },
      {
        accessorKey: 'severity',
        header: 'Severity',
        cell: ({ getValue }) => {
          const s = getValue<string>();
          const variant = s === 'critical' ? 'error' : s === 'warning' ? 'warning' : 'default';
          return <StatusBadge status={s} variant={variant} />;
        },
      },
      {
        accessorKey: 'resolved',
        header: 'Status',
        cell: ({ getValue }) => (
          <StatusBadge
            status={getValue<boolean>() ? 'Resolved' : 'Active'}
            variant={getValue<boolean>() ? 'success' : 'warning'}
          />
        ),
      },
    ],
    [],
  );

  // Sort: unresolved first, then by timestamp desc
  const sortedAlerts = useMemo(
    () =>
      [...pipelineAlerts].sort((a, b) => {
        if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }),
    [pipelineAlerts],
  );

  return (
    <ScreenContainer>
      <h1 className="mb-6 text-lg font-semibold text-gray-900">Pipeline Health</h1>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <MetricCard label="Active Alerts" value={activeAlerts} />
        <MetricCard label="Resolved" value={resolvedToday} />
        <MetricCard label="Systems Affected" value={systemsAffected} />
      </div>

      <DataTable columns={columns} data={sortedAlerts} />
    </ScreenContainer>
  );
}
