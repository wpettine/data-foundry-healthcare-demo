import { useMemo } from 'react';
import { DataTable, type ColumnDef } from './DataTable';
import { ConfidenceBadge } from '../feedback/ConfidenceBadge';
import { StatusBadge } from '../feedback/StatusBadge';
import { MiniProgressBar } from './MiniProgressBar';
import { getConfidenceTier } from '../../utils/confidenceHelpers';
import { formatNumber, formatDate } from '../../utils/formatters';
import type { SourceSystem } from '../../types/system';

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  ehr: { bg: 'bg-blue-50', text: 'text-blue-700' },
  rehab: { bg: 'bg-green-50', text: 'text-green-700' },
  ancillary: { bg: 'bg-orange-50', text: 'text-orange-700' },
};

const CATEGORY_LABELS: Record<string, string> = {
  ehr: 'EHR',
  rehab: 'Rehab',
  ancillary: 'Ancillary',
};

interface SystemsTableProps {
  systems: SourceSystem[];
  selectedSystemId: string | null;
  onSelectSystem: (id: string) => void;
}

export function SystemsTable({ systems, selectedSystemId, onSelectSystem }: SystemsTableProps) {
  const columns = useMemo<ColumnDef<SourceSystem, any>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'System',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: row.original.accentColor }}
            />
            <div className="min-w-0">
              <div className="truncate font-sans text-sm font-medium text-gray-900">
                {row.original.name}
              </div>
              <div className="truncate font-sans text-[11px] text-gray-400">
                {row.original.platform}
              </div>
            </div>
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'systemCategory',
        header: 'Category',
        cell: ({ row }) => {
          const cat = row.original.systemCategory;
          const style = CATEGORY_STYLES[cat] ?? { bg: 'bg-gray-50', text: 'text-gray-700' };
          return (
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${style.bg} ${style.text}`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </span>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: 'locationCount',
        header: 'Locations',
        cell: ({ getValue }) => <span className="text-sm">{getValue<number>()}</span>,
        enableSorting: true,
      },
      {
        accessorKey: 'fieldCount',
        header: 'Fields',
        cell: ({ getValue }) => <span className="text-sm">{formatNumber(getValue<number>())}</span>,
        enableSorting: true,
      },
      {
        accessorKey: 'annotationCompletion',
        header: 'Completion',
        cell: ({ row }) => {
          const pct = row.original.annotationCompletion;
          const review = Math.min(100 - pct, 25);
          const missing = Math.max(0, 100 - pct - review);
          return (
            <div className="flex items-center gap-2">
              <span className="w-10 text-right text-sm">{pct.toFixed(1)}%</span>
              <div className="w-16">
                <MiniProgressBar met={pct} review={review} missing={missing} />
              </div>
            </div>
          );
        },
        enableSorting: true,
      },
      {
        id: 'confidence',
        header: 'Confidence',
        accessorFn: (row) => row.annotationCompletion,
        cell: ({ row }) => {
          const tier = getConfidenceTier(row.original.annotationCompletion);
          return <ConfidenceBadge level={tier} />;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s = row.original.status;
          return (
            <StatusBadge
              status={s === 'integrated' ? 'Connected' : 'In Review'}
              variant={s === 'integrated' ? 'success' : 'warning'}
            />
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: 'lastSync',
        header: 'Last Sync',
        cell: ({ getValue }) => (
          <span className="font-sans text-sm text-gray-500">{formatDate(getValue<string>())}</span>
        ),
        enableSorting: true,
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={systems}
      onRowClick={(row) => onSelectSystem(row.id)}
      isRowSelected={(row) => row.id === selectedSystemId}
    />
  );
}
