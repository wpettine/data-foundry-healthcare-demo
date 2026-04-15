import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useScenario } from '../../scenarios/ScenarioContext';
import { DataTable, type ColumnDef } from '../../components/data-display/DataTable';
import { SourceBadge } from '../../components/feedback/SourceBadge';
import { ConfidenceBadge } from '../../components/feedback/ConfidenceBadge';
import ScreenContainer from '../../components/layout/ScreenContainer';

interface RecordRow {
  id: string;
  patientInitials: string;
  sourceSystemName: string;
  recordType: string;
  date: string;
  description: string;
  confidence: number;
  confidenceLevel: 'high' | 'medium' | 'low';
}

export default function PatientRecords() {
  const { paWorkbench } = useScenario();

  if (!paWorkbench) {
    return <Navigate to="/dashboard" replace />;
  }

  const { patients, cases } = paWorkbench;

  const rows: RecordRow[] = useMemo(() => {
    const patientMap = new Map(patients.map((p) => [p.id, p]));
    const seen = new Set<string>();
    const records: RecordRow[] = [];

    for (const c of cases) {
      const patient = patientMap.get(c.patientId);
      for (const ev of c.evidence) {
        if (seen.has(ev.id)) continue;
        seen.add(ev.id);
        records.push({
          id: ev.id,
          patientInitials: patient?.initials ?? '??',
          sourceSystemName: ev.sourceSystemName,
          recordType: ev.recordType,
          date: ev.date,
          description: ev.description,
          confidence: ev.confidence,
          confidenceLevel: ev.confidenceLevel,
        });
      }
    }

    return records;
  }, [patients, cases]);

  const columns: ColumnDef<RecordRow, any>[] = useMemo(
    () => [
      {
        accessorKey: 'patientInitials',
        header: 'Patient',
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-900">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'sourceSystemName',
        header: 'Source System',
        cell: ({ getValue }) => (
          <SourceBadge systemName={getValue<string>()} accentColor="#6B7280" />
        ),
      },
      {
        accessorKey: 'recordType',
        header: 'Record Type',
      },
      {
        accessorKey: 'date',
        header: 'Date',
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ getValue }) => (
          <span className="max-w-[300px] truncate font-sans text-sm text-gray-700">
            {getValue<string>()}
          </span>
        ),
      },
      {
        id: 'confidence',
        header: 'Confidence',
        accessorFn: (row) => row.confidence,
        cell: ({ row }) => (
          <ConfidenceBadge
            level={row.original.confidenceLevel}
            value={row.original.confidence}
          />
        ),
      },
    ],
    [],
  );

  return (
    <ScreenContainer>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Patient Records</h1>
        <p className="text-sm text-gray-500 mt-1">
          {rows.length} unique record{rows.length !== 1 ? 's' : ''} across all cases
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <DataTable columns={columns} data={rows} />
      </div>
    </ScreenContainer>
  );
}
