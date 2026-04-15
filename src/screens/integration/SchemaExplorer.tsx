import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useScenario } from '../../scenarios/ScenarioContext';
import { ConfidenceBadge } from '../../components/feedback/ConfidenceBadge';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import { FilterChips, type FilterGroupDef } from '../../components/interactive/FilterChips';
import { BulkActionBar } from '../../components/interactive/BulkActionBar';
import { PaginationControls } from '../../components/interactive/PaginationControls';
import ScreenContainer from '../../components/layout/ScreenContainer';
import { useSchemaStore } from '../../store/schemaStore';
import type { SchemaAnnotation } from '../../types/system';
import SchemaDetailPanel from './components/SchemaDetailPanel';

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------
const statusVariant = (status: SchemaAnnotation['status']) => {
  switch (status) {
    case 'auto-accepted':
      return 'success' as const;
    case 'pending-review':
      return 'warning' as const;
    case 'manual':
      return 'error' as const;
  }
};

const statusLabel = (status: SchemaAnnotation['status']) => {
  switch (status) {
    case 'auto-accepted':
      return 'Accepted';
    case 'pending-review':
      return 'Pending';
    case 'manual':
      return 'Manual';
  }
};

// Map filter chip values to data values
const STATUS_FILTER_MAP: Record<string, SchemaAnnotation['status']> = {
  accepted: 'auto-accepted',
  pending: 'pending-review',
  manual: 'manual',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
type ResolvedField = SchemaAnnotation & { resolvedStatus: SchemaAnnotation['status'] };

export default function SchemaExplorer() {
  const { schemaFields, systems } = useScenario();
  const {
    acceptedFieldIds,
    bulkAccepted,
    bulkAcceptHigh,
    acceptField,
    filters,
    setFilter,
    selectedFieldId,
    setSelectedFieldId,
  } = useSchemaStore();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [showBulkBar, setShowBulkBar] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Resolve statuses based on store state
  const resolvedFields = useMemo<ResolvedField[]>(() => {
    return schemaFields.map((f) => {
      const isAccepted = bulkAccepted
        ? f.confidenceLevel === 'high' || acceptedFieldIds.includes(f.id)
        : acceptedFieldIds.includes(f.id);
      return {
        ...f,
        resolvedStatus:
          isAccepted && f.status !== 'auto-accepted'
            ? ('auto-accepted' as const)
            : f.status,
      };
    });
  }, [schemaFields, acceptedFieldIds, bulkAccepted]);

  // Apply filters
  const filteredFields = useMemo(() => {
    return resolvedFields.filter((f) => {
      if (filters.system !== 'all' && f.systemId !== filters.system) return false;
      if (filters.status !== 'all') {
        const targetStatus = STATUS_FILTER_MAP[filters.status];
        if (targetStatus && f.resolvedStatus !== targetStatus) return false;
      }
      if (filters.confidence !== 'all' && f.confidenceLevel !== filters.confidence) return false;
      return true;
    });
  }, [resolvedFields, filters]);

  // Stats
  const acceptedCount = resolvedFields.filter((f) => f.resolvedStatus === 'auto-accepted').length;
  const pendingCount = resolvedFields.filter((f) => f.resolvedStatus === 'pending-review').length;
  const manualCount = resolvedFields.filter((f) => f.resolvedStatus === 'manual').length;

  const highConfidencePendingCount = useMemo(
    () =>
      resolvedFields.filter(
        (f) => f.confidenceLevel === 'high' && f.resolvedStatus !== 'auto-accepted',
      ).length,
    [resolvedFields],
  );

  // Filter chip groups
  const filterGroups = useMemo<FilterGroupDef[]>(
    () => [
      {
        label: 'System',
        options: [
          { value: 'all', label: 'All' },
          ...systems.map((s) => ({ value: s.id, label: s.name })),
        ],
        active: filters.system,
        onChange: (v) => setFilter('system', v),
      },
      {
        label: 'Status',
        options: [
          { value: 'all', label: 'All' },
          { value: 'accepted', label: 'Accepted' },
          { value: 'pending', label: 'Pending' },
          { value: 'manual', label: 'Manual' },
        ],
        active: filters.status,
        onChange: (v) => setFilter('status', v),
      },
      {
        label: 'Confidence',
        options: [
          { value: 'all', label: 'All' },
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' },
        ],
        active: filters.confidence,
        onChange: (v) => setFilter('confidence', v),
      },
    ],
    [systems, filters, setFilter],
  );

  // Selected field for detail panel
  const selectedField = useMemo(
    () => (selectedFieldId ? filteredFields.find((f) => f.id === selectedFieldId) ?? null : null),
    [filteredFields, selectedFieldId],
  );

  const selectedSystem = useMemo(
    () => (selectedField ? systems.find((s) => s.id === selectedField.systemId) : undefined),
    [selectedField, systems],
  );

  // Columns
  const columns = useMemo<ColumnDef<ResolvedField, unknown>[]>(
    () => [
      {
        accessorKey: 'sourceTable',
        header: 'Source Table',
        size: 160,
        cell: ({ getValue }) => (
          <span className="font-[Inter] text-gray-900">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'sourceField',
        header: 'Source Field',
        size: 150,
        cell: ({ getValue }) => (
          <span className="font-[JetBrains_Mono] text-gray-900">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'dataType',
        header: 'Data Type',
        size: 110,
        cell: ({ getValue }) => (
          <span className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 font-[JetBrains_Mono] text-xs text-gray-600">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'mappedConceptLabel',
        header: 'Mapped Concept',
        size: 170,
        cell: ({ getValue }) => (
          <span className="font-[Inter] text-gray-900">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'confidenceLevel',
        header: 'Confidence',
        size: 110,
        cell: ({ row }) => (
          <ConfidenceBadge
            level={row.original.confidenceLevel}
            value={Math.round(row.original.confidence)}
          />
        ),
      },
      {
        accessorKey: 'resolvedStatus',
        header: 'Status',
        size: 100,
        cell: ({ getValue }) => {
          const status = getValue<SchemaAnnotation['status']>();
          return <StatusBadge status={statusLabel(status)} variant={statusVariant(status)} />;
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredFields,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters.system, filters.status, filters.confidence]);

  // Handle selected row tracking when filters change
  useEffect(() => {
    if (!selectedFieldId) return;

    const selectedIndex = filteredFields.findIndex((f) => f.id === selectedFieldId);
    if (selectedIndex === -1) {
      // Row filtered out - close detail panel
      setSelectedFieldId(null);
    }
  }, [selectedFieldId, filteredFields, setSelectedFieldId]);

  // Handle bulk accept with pagination reset
  const handleBulkAcceptHigh = useCallback(() => {
    bulkAcceptHigh();
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [bulkAcceptHigh]);

  return (
    <ScreenContainer>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Schema Explorer</h1>
        </div>

        {/* Summary stats bar */}
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5">
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <Stat label="fields" value={resolvedFields.length.toLocaleString()} />
            <Sep />
            <Stat label="accepted" value={acceptedCount.toLocaleString()} color="text-emerald-600" />
            <Sep />
            <Stat label="pending" value={pendingCount.toLocaleString()} color="text-amber-600" />
            <Sep />
            <Stat label="manual" value={manualCount.toLocaleString()} color="text-red-600" />
            <Sep />
            <Stat label="systems" value={systems.length} />
            {filteredFields.length !== resolvedFields.length && (
              <>
                <Sep />
                <span className="font-medium text-blue-600">
                  {filteredFields.length.toLocaleString()} shown
                </span>
              </>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <FilterChips groups={filterGroups} />

        {/* Bulk action bar */}
        {highConfidencePendingCount > 0 && showBulkBar && (
          <BulkActionBar
            selectedCount={highConfidencePendingCount}
            onAcceptAllHigh={handleBulkAcceptHigh}
            onDismiss={() => setShowBulkBar(false)}
          />
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {table.getHeaderGroups()[0].headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-gray-500 select-none"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className={`flex items-center gap-1 ${
                          header.column.getCanSort()
                            ? 'cursor-pointer hover:text-gray-700'
                            : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                        disabled={!header.column.getCanSort()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() &&
                          (header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp size={12} />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown size={12} />
                          ) : (
                            <ChevronsUpDown size={12} className="text-gray-300" />
                          ))}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() =>
                    setSelectedFieldId(
                      selectedFieldId === row.original.id ? null : row.original.id,
                    )
                  }
                  className={`border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedFieldId === row.original.id
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-3 py-1.5 text-[14px]"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {filteredFields.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-3 py-8 text-center text-sm text-gray-400"
                  >
                    No fields match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {filteredFields.length > 0 && (
          <PaginationControls
            currentPage={pagination.pageIndex + 1}
            pageSize={pagination.pageSize}
            totalItems={filteredFields.length}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))}
            onPageSizeChange={(size) => setPagination({ pageIndex: 0, pageSize: size })}
          />
        )}

        {/* Detail panel */}
        {selectedField && (
          <SchemaDetailPanel
            field={selectedField}
            system={selectedSystem}
            onAccept={acceptField}
            onClose={() => setSelectedFieldId(null)}
          />
        )}
      </div>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Stat / Sep helpers (matches hold-period pattern)
// ---------------------------------------------------------------------------
function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <span>
      <span className={`font-semibold ${color ?? 'text-gray-800'}`}>{value}</span> {label}
    </span>
  );
}

function Sep() {
  return <span className="text-gray-300">|</span>;
}
