import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { X } from 'lucide-react';
import type { CascadeImpactRow } from './kpi-helpers';
import { useKPIStore } from '../../store/kpiStore';

interface Props {
  rows: CascadeImpactRow[];
  kpiReconciliations: Array<{ kpiId: string; kpiName: string }>;
}

const columnHelper = createColumnHelper<CascadeImpactRow>();

export function CascadeImpactTable({ rows, kpiReconciliations }: Props) {
  const { cascadeFilters, setCascadeFilter } = useKPIStore();

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (cascadeFilters.kpi !== 'all' && row.kpiId !== cascadeFilters.kpi) return false;
      if (cascadeFilters.type !== 'all' && row.type !== cascadeFilters.type) return false;
      return true;
    });
  }, [rows, cascadeFilters]);

  const columns = [
    columnHelper.accessor('kpiName', {
      header: 'KPI',
      cell: (info) => <div className="font-medium text-sm">{info.getValue()}</div>,
      size: 180,
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => {
        const type = info.getValue();
        const colors = {
          exhibit: 'bg-blue-100 text-blue-700',
          'risk-flag': 'bg-amber-100 text-amber-700',
          'integration-baseline': 'bg-green-100 text-green-700',
        };
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${colors[type]}`}>
            {type === 'risk-flag' ? 'Risk Flag' : type === 'integration-baseline' ? 'Integration Baseline' : 'Exhibit'}
          </span>
        );
      },
      size: 160,
    }),
    columnHelper.accessor('label', {
      header: 'Label',
      cell: (info) => <div className="text-sm">{info.getValue()}</div>,
      size: 280,
    }),
    columnHelper.accessor('previousState', {
      header: 'Previous State',
      cell: (info) => <div className="text-sm text-gray-600 font-mono">{info.getValue()}</div>,
      size: 200,
    }),
    columnHelper.accessor('newState', {
      header: 'New State',
      cell: (info) => <div className="text-sm font-mono font-medium">{info.getValue()}</div>,
      size: 200,
    }),
    columnHelper.accessor('detail', {
      header: 'Detail',
      cell: (info) => {
        const detail = info.getValue();
        return detail ? <div className="text-sm text-gray-500">{detail}</div> : <div className="text-gray-300">—</div>;
      },
      size: 300,
    }),
  ];

  const table = useReactTable({
    data: filteredRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const hasActiveFilters = cascadeFilters.kpi !== 'all' || cascadeFilters.type !== 'all';

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="kpi-filter" className="text-sm font-medium text-gray-700">
            KPI:
          </label>
          <select
            id="kpi-filter"
            value={cascadeFilters.kpi}
            onChange={(e) => setCascadeFilter('kpi', e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All KPIs</option>
            {kpiReconciliations.map((kpi) => (
              <option key={kpi.kpiId} value={kpi.kpiId}>
                {kpi.kpiName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="type-filter" className="text-sm font-medium text-gray-700">
            Type:
          </label>
          <select
            id="type-filter"
            value={cascadeFilters.type}
            onChange={(e) => setCascadeFilter('type', e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="exhibit">Exhibit</option>
            <option value="risk-flag">Risk Flag</option>
            <option value="integration-baseline">Integration Baseline</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setCascadeFilter('kpi', 'all');
              setCascadeFilter('type', 'all');
            }}
            className="flex items-center gap-1.5 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X size={14} />
            Clear filters
          </button>
        )}

        <div className="ml-auto text-sm text-gray-500">
          {filteredRows.length} {filteredRows.length === 1 ? 'impact' : 'impacts'}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-gray-500">
                  No impacts match the current filters
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
