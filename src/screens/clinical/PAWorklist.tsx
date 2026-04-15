import { useMemo } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useScenario } from '../../scenarios/ScenarioContext';
import { DataTable, type ColumnDef } from '../../components/data-display/DataTable';
import { MiniProgressBar } from '../../components/data-display/MiniProgressBar';
import { SLACountdown } from '../../components/feedback/SLACountdown';
import { BulkActionBar } from '../../components/interactive/BulkActionBar';
import ScreenContainer from '../../components/layout/ScreenContainer';
import { usePAStore } from '../../store/paStore';

interface WorklistRow {
  id: string;
  patientInitials: string;
  procedureLabel: string;
  payerName: string;
  filedDate: string;
  surgeryDate: string;
  slaDeadline: string;
  met: number;
  review: number;
  missing: number;
  assignedTo: string;
}

export default function PAWorklist() {
  const { paWorkbench } = useScenario();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bulkAcceptHigh = usePAStore((s) => s.bulkAcceptHigh);
  const bulkAcceptedCount = usePAStore((s) => s.bulkAcceptedCount);

  if (!paWorkbench) {
    return <Navigate to="/dashboard" replace />;
  }

  const { patients, cases } = paWorkbench;

  const rows: WorklistRow[] = useMemo(() => {
    const patientMap = new Map(patients.map((p) => [p.id, p]));

    return [...cases]
      .sort((a, b) => new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime())
      .map((c) => {
        const allReqs = c.requirements.flatMap((cat) => cat.children);
        const met = allReqs.filter((r) => r.status === 'met').length;
        const review = allReqs.filter((r) => r.status === 'review').length;
        const missing = allReqs.filter((r) => r.status === 'missing').length;
        const patient = patientMap.get(c.patientId);

        return {
          id: c.id,
          patientInitials: patient?.initials ?? '??',
          procedureLabel: `${c.procedure.description} (${c.procedure.laterality})`,
          payerName: c.payerName,
          filedDate: c.filedDate,
          surgeryDate: c.surgeryDate,
          slaDeadline: c.slaDeadline,
          met,
          review,
          missing,
          assignedTo: c.assignedTo,
        };
      });
  }, [cases, patients]);

  const columns: ColumnDef<WorklistRow, any>[] = useMemo(
    () => [
      {
        accessorKey: 'patientInitials',
        header: 'Patient',
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-900">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'procedureLabel',
        header: 'Procedure',
        cell: ({ getValue }) => (
          <span className="font-sans text-sm text-gray-700">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'payerName',
        header: 'Payer',
      },
      {
        accessorKey: 'filedDate',
        header: 'Filed Date',
      },
      {
        id: 'sla',
        header: 'Surgery / SLA',
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
        header: 'Progress',
        accessorFn: (row) => row.met / (row.met + row.review + row.missing || 1),
        cell: ({ row }) => (
          <div className="w-32">
            <MiniProgressBar
              met={row.original.met}
              review={row.original.review}
              missing={row.original.missing}
            />
            <span className="mt-0.5 block text-[10px] text-gray-400">
              {row.original.met}/{row.original.met + row.original.review + row.original.missing} met
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'assignedTo',
        header: 'Assigned To',
      },
    ],
    [],
  );

  function handleRowClick(row: WorklistRow) {
    const params = searchParams.toString();
    navigate(`/pa-workbench/${row.id}${params ? `?${params}` : ''}`);
  }

  return (
    <ScreenContainer>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Prior Authorization Worklist</h1>
        <p className="text-sm text-gray-500 mt-1">
          {cases.length} active case{cases.length !== 1 ? 's' : ''} sorted by SLA deadline
        </p>
      </div>

      <BulkActionBar
        selectedCount={bulkAcceptedCount}
        onAcceptAllHigh={bulkAcceptHigh}
        onDismiss={() => {}}
      />

      <div className="rounded-lg border border-gray-200 bg-white">
        <DataTable columns={columns} data={rows} onRowClick={handleRowClick} />
      </div>
    </ScreenContainer>
  );
}
