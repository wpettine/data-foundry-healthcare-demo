import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  createColumnHelper,
  flexRender,
  type ExpandedState,
} from '@tanstack/react-table';
import { ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import type { KPISummaryRow } from './kpi-helpers';
import { formatKpiValue } from './kpi-helpers';
import { useKPIStore } from '../../store/kpiStore';

interface Props {
  rows: KPISummaryRow[];
  onReconcile: (kpiId: string) => void;
}

const columnHelper = createColumnHelper<KPISummaryRow>();

export function KPISummaryTable({ rows, onReconcile }: Props) {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const kpisReconciled = useKPIStore((s) => s.kpisReconciled);

  const columns = [
    columnHelper.display({
      id: 'expand',
      header: '',
      cell: ({ row }) => (
        <button
          onClick={() => row.toggleExpanded()}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
        >
          <ChevronRight
            size={16}
            className={`transition-transform ${row.getIsExpanded() ? 'rotate-90' : ''}`}
          />
        </button>
      ),
      size: 40,
    }),
    columnHelper.accessor('kpiName', {
      header: 'KPI Name',
      cell: (info) => <div className="font-medium">{info.getValue()}</div>,
      size: 200,
    }),
    columnHelper.accessor('variantCount', {
      header: 'Variants',
      cell: (info) => (
        <div className="text-sm text-gray-600">
          {info.getValue()} {info.getValue() === 1 ? 'system' : 'systems'}
        </div>
      ),
      size: 100,
    }),
    columnHelper.accessor('localRange', {
      header: 'Local Range',
      cell: (info) => <div className="font-mono text-sm">{info.getValue()}</div>,
      size: 150,
    }),
    columnHelper.accessor('canonicalValue', {
      header: 'Canonical Value',
      cell: (info) => <div className="font-mono text-sm font-medium">{info.getValue()}</div>,
      size: 150,
    }),
    columnHelper.accessor('dollarImpact', {
      header: 'Dollar Impact',
      cell: (info) => (
        <div className="font-mono text-sm">
          ${(info.getValue() / 1_000_000).toFixed(1)}M
        </div>
      ),
      size: 120,
    }),
    columnHelper.display({
      id: 'action',
      header: '',
      cell: ({ row }) => {
        const isReconciled = kpisReconciled.includes(row.original.kpiId);
        return (
          <div className="flex items-center justify-end">
            {isReconciled ? (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle size={16} />
                <span>Reconciled</span>
              </div>
            ) : (
              <button
                onClick={() => onReconcile(row.original.kpiId)}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Reconcile
              </button>
            )}
          </div>
        );
      },
      size: 140,
    }),
  ];

  const table = useReactTable({
    data: rows,
    columns,
    state: { expanded },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
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
          {table.getRowModel().rows.map((row) => {
            const isReconciled = kpisReconciled.includes(row.original.kpiId);
            return (
              <>
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    isReconciled ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-amber-500'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() && (
                  <tr className="bg-gray-50">
                    <td colSpan={columns.length} className="px-4 py-4">
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                            Canonical Definition
                          </div>
                          <div className="text-sm text-gray-700">{row.original.canonicalDefinition}</div>
                        </div>

                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                            System Variants
                          </div>
                          <div className="space-y-3">
                            {row.original.definitionVariants.map((variant, idx) => (
                              <div
                                key={idx}
                                className="border border-gray-200 rounded p-3 bg-white"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="font-medium text-sm">{variant.systemName}</div>
                                  <div className="flex items-center gap-4 text-sm">
                                    <div className="text-gray-500">
                                      Local: <span className="font-mono">{formatKpiValue(variant.valueUnderLocal, row.original.kpiId)}</span>
                                    </div>
                                    <div className="text-gray-700">
                                      Canonical: <span className="font-mono font-medium">{formatKpiValue(variant.valueUnderCanonical, row.original.kpiId)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                  {variant.definitionText}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Source fields: {variant.sourceFields.join(', ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded">
                          <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-amber-900 mb-1">
                              ${(row.original.dollarImpact / 1_000_000).toFixed(1)}M Impact
                            </div>
                            <div className="text-sm text-amber-800">
                              {row.original.dollarImpactDescription}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
