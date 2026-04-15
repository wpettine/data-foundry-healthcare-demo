import { useMemo, useState, useCallback, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useScenario } from '../../scenarios/ScenarioContext';
import { MetricCard } from '../../components/data-display/MetricCard';
import { DataTable, type ColumnDef } from '../../components/data-display/DataTable';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import { SourceBadge } from '../../components/feedback/SourceBadge';
import ScreenContainer from '../../components/layout/ScreenContainer';
import { AlertDetailPanel } from '../../components/data-display/AlertDetailPanel';

export default function PipelineHealth() {
  const { pipelineAlerts, systems } = useScenario();
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  // Sort: unresolved first, then by timestamp desc
  const sortedAlerts = useMemo(
    () =>
      [...pipelineAlerts].sort((a, b) => {
        if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }),
    [pipelineAlerts],
  );

  // Enrich alerts with system accent colors
  const enrichedAlerts = useMemo(
    () =>
      sortedAlerts.map((alert) => {
        const system = systems.find((s) => s.id === alert.systemId);
        return {
          ...alert,
          accentColor: system?.accentColor ?? '#6B7280', // Gray fallback for non-system sources
          systemFullName: system?.name ?? alert.systemName,
        };
      }),
    [sortedAlerts, systems],
  );

  // Find the selected alert for the detail panel
  const selectedAlert = useMemo(
    () => enrichedAlerts.find((a) => a.id === selectedAlertId) ?? null,
    [enrichedAlerts, selectedAlertId],
  );

  // Handle row click
  const handleRowClick = useCallback((alert: typeof enrichedAlerts[0]) => {
    setSelectedAlertId((prev) => (prev === alert.id ? null : alert.id));
  }, []);

  // Close detail panel when selected alert is filtered out
  useEffect(() => {
    if (!selectedAlertId) return;
    const stillExists = enrichedAlerts.some((a) => a.id === selectedAlertId);
    if (!stillExists) {
      setSelectedAlertId(null);
    }
  }, [selectedAlertId, enrichedAlerts]);

  // Metric 1: Sources Active
  const sourcesActive = systems.length;
  const totalSources = systems.length;

  // Metric 2: Last Full Sync
  const lastSyncTimestamp = useMemo(() => {
    if (pipelineAlerts.length === 0) return new Date();
    const allTimestamps = pipelineAlerts.map((a) => new Date(a.timestamp));
    return new Date(Math.max(...allTimestamps.map((d) => d.getTime())));
  }, [pipelineAlerts]);

  // Metric 3: Schema Drift Alerts
  const schemaDriftAlerts = pipelineAlerts.filter(
    (a) => a.type === 'schema-change' && !a.resolved,
  ).length;

  // Metric 4: Data Quality Score (fixture value per spec)
  const dataQualityScore = 96.8;

  const columns = useMemo<ColumnDef<typeof enrichedAlerts[0]>[]>(
    () => [
      {
        accessorKey: 'systemName',
        header: 'Source',
        cell: ({ row }) => (
          <SourceBadge
            systemName={row.original.systemFullName}
            accentColor={row.original.accentColor}
          />
        ),
      },
      {
        accessorKey: 'type',
        header: 'Alert Type',
        cell: ({ getValue }) => {
          const type = getValue<string>();
          // Format type for display: 'schema-change' → 'Schema Change'
          const formatted = type
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          return (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
              {formatted}
            </span>
          );
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-700 line-clamp-2">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'impact',
        header: 'Impact',
        cell: ({ getValue }) => {
          const impact = getValue<string | undefined>();
          return impact ? (
            <span className="text-sm text-gray-600">{impact}</span>
          ) : (
            <span className="text-sm text-gray-400">—</span>
          );
        },
      },
      {
        accessorKey: 'resolved',
        header: 'Status',
        cell: ({ row }) => {
          const { resolved, severity } = row.original;
          if (resolved) {
            return <StatusBadge status="Auto-resolved" variant="success" />;
          }
          // Map severity to spec-compliant status semantics
          const statusText = severity === 'critical' ? 'Action required' : 'Review needed';
          const variant = severity === 'critical' ? 'error' : 'warning';
          return <StatusBadge status={statusText} variant={variant} />;
        },
      },
      {
        accessorKey: 'timestamp',
        header: 'Detected',
        cell: ({ getValue }) => {
          const timestamp = getValue<string>();
          const date = new Date(timestamp);
          const relativeTime = formatDistanceToNow(date, { addSuffix: true });
          const absoluteTime = date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <span
              className="font-['JetBrains_Mono'] text-sm text-gray-600 cursor-help"
              title={absoluteTime}
            >
              {relativeTime}
            </span>
          );
        },
      },
    ],
    [],
  );

  return (
    <ScreenContainer>
      <h1 className="mb-6 text-lg font-semibold text-gray-900">Pipeline Health</h1>

      <div className="mb-6 grid grid-cols-4 gap-4">
        <MetricCard label="Sources Active" value={`${sourcesActive}/${totalSources}`} />
        <MetricCard
          label="Last Full Sync"
          value={formatDistanceToNow(lastSyncTimestamp, { addSuffix: true })}
        />
        <MetricCard label="Schema Drift Alerts" value={schemaDriftAlerts} />
        <MetricCard label="Data Quality Score" value={`${dataQualityScore}%`} />
      </div>

      <DataTable
        columns={columns}
        data={enrichedAlerts}
        onRowClick={handleRowClick}
        isRowSelected={(alert) => alert.id === selectedAlertId}
      />

      {selectedAlert && (
        <AlertDetailPanel alert={selectedAlert} onClose={() => setSelectedAlertId(null)} />
      )}
    </ScreenContainer>
  );
}
