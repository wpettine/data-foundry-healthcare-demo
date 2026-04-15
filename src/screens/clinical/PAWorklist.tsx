import { useMemo, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useScenario } from '../../scenarios/ScenarioContext';
import { DataTable, type ColumnDef } from '../../components/data-display/DataTable';
import { MiniProgressBar } from '../../components/data-display/MiniProgressBar';
import { SLACountdown } from '../../components/feedback/SLACountdown';
import { BulkActionBar } from '../../components/interactive/BulkActionBar';
import { SummaryMetricsBar } from '../../components/interactive/SummaryMetricsBar';
import { FilterBar } from '../../components/interactive/FilterBar';
import { PriorityBorder } from '../../components/feedback/PriorityBorder';
import { PayerBadge } from '../../components/feedback/PayerBadge';
import ScreenContainer from '../../components/layout/ScreenContainer';
import { usePAStore } from '../../store/paStore';
import { AlertCircle } from 'lucide-react';

interface WorklistRow {
  id: string;
  patientInitials: string;
  patientMRN: string;
  procedureLabel: string;
  procedureCPT: string;
  payerName: string;
  payerId: string;
  filedDate: string;
  surgeryDate: string;
  slaDeadline: string;
  slaUrgency: 'high' | 'medium' | 'low';
  met: number;
  review: number;
  missing: number;
  total: number;
  statusBadge: 'ready' | 'review' | 'incomplete';
  assignedTo: string;
}

export default function PAWorklist() {
  const { paWorkbench } = useScenario();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedRowIds = usePAStore((s) => s.selectedRowIds);
  const toggleRowSelection = usePAStore((s) => s.toggleRowSelection);
  const clearSelection = usePAStore((s) => s.clearSelection);
  const filters = usePAStore((s) => s.filters);
  const setFilter = usePAStore((s) => s.setFilter);
  const bulkAcceptHigh = usePAStore((s) => s.bulkAcceptHigh);

  if (!paWorkbench) {
    return <Navigate to="/dashboard" replace />;
  }

  const { patients, cases } = paWorkbench;

  const rows: WorklistRow[] = useMemo(() => {
    const patientMap = new Map(patients.map((p) => [p.id, p]));
    const now = new Date();

    return [...cases]
      .map((c) => {
        const allReqs = c.requirements.flatMap((cat) => cat.children);
        const met = allReqs.filter((r) => r.status === 'met').length;
        const review = allReqs.filter((r) => r.status === 'review').length;
        const missing = allReqs.filter((r) => r.status === 'missing').length;
        const total = allReqs.length;
        const patient = patientMap.get(c.patientId);

        // Calculate SLA urgency
        const slaDate = new Date(c.slaDeadline);
        const hoursUntilSLA = (slaDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        const slaUrgency: 'high' | 'medium' | 'low' =
          hoursUntilSLA < 24 ? 'high' : hoursUntilSLA < 48 ? 'medium' : 'low';

        // Calculate status badge
        let statusBadge: 'ready' | 'review' | 'incomplete';
        if (met === total) {
          statusBadge = 'ready';
        } else if (missing > 0) {
          statusBadge = 'incomplete';
        } else {
          statusBadge = 'review';
        }

        return {
          id: c.id,
          patientInitials: patient?.initials ?? '??',
          patientMRN: patient?.mrn ?? '',
          procedureLabel: `${c.procedure.description} (${c.procedure.laterality})`,
          procedureCPT: c.procedure.cpt,
          payerName: c.payerName,
          payerId: c.payerId,
          filedDate: c.filedDate,
          surgeryDate: c.surgeryDate,
          slaDeadline: c.slaDeadline,
          slaUrgency,
          met,
          review,
          missing,
          total,
          statusBadge,
          assignedTo: c.assignedTo,
        };
      })
      .sort((a, b) => new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime());
  }, [cases, patients]);

  // Apply filters
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          row.patientInitials.toLowerCase().includes(searchLower) ||
          row.procedureLabel.toLowerCase().includes(searchLower) ||
          row.payerName.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Payer filter
      if (filters.payerId && row.payerId !== filters.payerId) {
        return false;
      }

      // Status filter
      if (filters.statusFilter !== 'all') {
        if (filters.statusFilter === 'at-risk' && row.slaUrgency !== 'high') {
          return false;
        } else if (
          filters.statusFilter !== 'at-risk' &&
          row.statusBadge !== filters.statusFilter
        ) {
          return false;
        }
      }

      return true;
    });
  }, [rows, filters]);

  // Compute summary metrics
  const metrics = useMemo(() => {
    const pending = rows.length;
    const ready = rows.filter((r) => r.statusBadge === 'ready').length;
    const needEvidence = rows.filter((r) => r.missing > 0).length;
    const review = rows.filter((r) => r.statusBadge === 'review').length;
    const atRisk = rows.filter((r) => r.slaUrgency === 'high').length;

    return { pending, ready, needEvidence, review, atRisk };
  }, [rows]);

  // Get unique payers for filter dropdown
  const payers = useMemo(() => {
    const payerMap = new Map<string, string>();
    cases.forEach((c) => payerMap.set(c.payerId, c.payerName));
    return Array.from(payerMap.entries()).map(([id, name]) => ({ id, name }));
  }, [cases]);

  const columns: ColumnDef<WorklistRow, any>[] = useMemo(
    () => [
      {
        id: 'checkbox',
        header: () => null,
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedRowIds.has(row.original.id)}
            onChange={(e) => {
              e.stopPropagation();
              toggleRowSelection(row.original.id);
            }}
            className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label={`Select case for ${row.original.patientInitials}`}
          />
        ),
        size: 48,
      },
      {
        accessorKey: 'patientInitials',
        header: 'Patient',
        cell: ({ getValue, row }) => (
          <PriorityBorder urgency={row.original.slaUrgency}>
            <div className="pl-3 py-1">
              <div className="font-medium text-gray-900">{getValue<string>()}</div>
              <div className="text-xs text-gray-500">{row.original.patientMRN}</div>
            </div>
          </PriorityBorder>
        ),
      },
      {
        accessorKey: 'procedureLabel',
        header: 'Procedure',
        cell: ({ getValue, row }) => (
          <div>
            <div className="font-[JetBrains_Mono] text-sm text-gray-900">{row.original.procedureCPT}</div>
            <div className="text-sm text-gray-600">{getValue<string>()}</div>
          </div>
        ),
      },
      {
        accessorKey: 'payerName',
        header: 'Payer',
        cell: ({ getValue }) => <PayerBadge payerName={getValue<string>()} />,
      },
      {
        id: 'sla',
        header: 'Deadlines',
        accessorFn: (row) => row.slaDeadline,
        cell: ({ row }) => (
          <SLACountdown
            surgeryDate={row.original.surgeryDate}
            slaDeadline={row.original.slaDeadline}
          />
        ),
      },
      {
        id: 'progress',
        header: 'Evidence',
        accessorFn: (row) => row.met / (row.total || 1),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="w-28">
              <MiniProgressBar
                met={row.original.met}
                review={row.original.review}
                missing={row.original.missing}
              />
              <span className="mt-0.5 block font-[JetBrains_Mono] text-[10px] text-gray-400">
                {row.original.met}/{row.original.total} met
              </span>
            </div>
            {row.original.missing > 0 && (
              <AlertCircle className="h-4 w-4 text-amber-500" />
            )}
          </div>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessorFn: (row) => row.statusBadge,
        cell: ({ row }) => {
          const status = row.original.statusBadge;
          const colorClass =
            status === 'ready'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : status === 'review'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-red-50 text-red-700 border-red-200';

          const label =
            status === 'ready' ? 'Ready' : status === 'review' ? 'In Review' : 'Incomplete';

          return (
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
            >
              {label}
            </span>
          );
        },
      },
      {
        accessorKey: 'assignedTo',
        header: 'Assigned To',
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-600">{getValue<string>()}</span>
        ),
      },
    ],
    [selectedRowIds, toggleRowSelection],
  );

  function handleRowClick(row: WorklistRow) {
    // Don't navigate if clicking checkbox
    const params = searchParams.toString();
    navigate(`/pa-workbench/${row.id}${params ? `?${params}` : ''}`);
  }

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // TODO: Implement full keyboard shortcuts in separate hook
      // For now, just handle Escape to clear selection
      if (e.key === 'Escape') {
        clearSelection();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection]);

  return (
    <ScreenContainer>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Prior Authorization Worklist</h1>
        <p className="mt-1 text-sm text-gray-500">
          {filteredRows.length} case{filteredRows.length !== 1 ? 's' : ''} sorted by SLA deadline
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="mb-4">
        <SummaryMetricsBar
          pending={metrics.pending}
          ready={metrics.ready}
          needEvidence={metrics.needEvidence}
          review={metrics.review}
          atRisk={metrics.atRisk}
        />
      </div>

      {/* Filter Bar */}
      <div className="mb-4">
        <FilterBar
          savedView={filters.savedView}
          searchTerm={filters.searchTerm}
          payerId={filters.payerId}
          statusFilter={filters.statusFilter}
          onSavedViewChange={(view) => setFilter('savedView', view)}
          onSearchChange={(term) => setFilter('searchTerm', term)}
          onPayerChange={(payerId) => setFilter('payerId', payerId)}
          onStatusChange={(status) => setFilter('statusFilter', status)}
          payers={payers}
        />
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedRowIds.size}
        onAcceptAllHigh={bulkAcceptHigh}
        onDismiss={clearSelection}
      />

      {/* Data Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <DataTable columns={columns} data={filteredRows} onRowClick={handleRowClick} />
      </div>
    </ScreenContainer>
  );
}
