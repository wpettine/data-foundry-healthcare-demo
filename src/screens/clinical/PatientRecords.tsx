import { useMemo, useState, Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  flexRender,
  type ColumnDef,
  type ExpandedState,
} from '@tanstack/react-table';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useScenario } from '../../scenarios/ScenarioContext';
import { SourceBadge } from '../../components/feedback/SourceBadge';
import { ConfidenceBadge } from '../../components/feedback/ConfidenceBadge';
import { AuditTrailPanel } from '../../components/clinical/AuditTrailPanel';
import { PatientSelector } from '../../components/interactive/PatientSelector';
import ScreenContainer from '../../components/layout/ScreenContainer';
import type { PAEvidence } from '../../types/pa';
import type { Patient } from '../../types/patient';

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
  const [expanded, setExpanded] = useState<ExpandedState>({});

  if (!paWorkbench) {
    return <Navigate to="/dashboard" replace />;
  }

  const { patients, cases } = paWorkbench;

  // Use all patients from scenario
  const allPatients: Patient[] = patients;

  // State for selected patient
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    () => allPatients[0]?.id || ''
  );

  // Create evidence lookup map for audit trail panel
  const evidenceMap = useMemo(() => {
    const map = new Map<string, PAEvidence>();
    for (const c of cases) {
      for (const ev of c.evidence) {
        map.set(ev.id, ev);
      }
    }
    return map;
  }, [cases]);

  // Filter records by selected patient
  const rows: RecordRow[] = useMemo(() => {
    const patientMap = new Map(patients.map((p) => [p.id, p]));
    const seen = new Set<string>();
    const records: RecordRow[] = [];

    for (const c of cases) {
      // Only include cases for the selected patient
      if (c.patientId !== selectedPatientId) continue;

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
  }, [patients, cases, selectedPatientId]);

  // Calculate record counts per patient for the selector
  const recordCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const seen = new Map<string, Set<string>>(); // patientId -> Set of evidence IDs

    for (const c of cases) {
      if (!seen.has(c.patientId)) {
        seen.set(c.patientId, new Set());
      }
      const patientEvidenceIds = seen.get(c.patientId)!;
      for (const ev of c.evidence) {
        patientEvidenceIds.add(ev.id);
      }
    }

    for (const [patientId, evidenceIds] of seen.entries()) {
      counts[patientId] = evidenceIds.size;
    }

    // Add simulated counts for patients without real data
    // Use a simple hash of patient ID to generate stable random counts
    allPatients.forEach((patient) => {
      if (counts[patient.id] === undefined || counts[patient.id] === 0) {
        // Generate a plausible record count (8-18 records)
        const hash = patient.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        counts[patient.id] = 8 + (hash % 11); // 8-18 records
      }
    });

    return counts;
  }, [cases, allPatients]);

  const columns: ColumnDef<RecordRow, any>[] = useMemo(
    () => [
      {
        id: 'expand',
        header: '',
        cell: ({ row }) => (
          <button
            onClick={() => row.toggleExpanded()}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="text-gray-500" size={16} />
            ) : (
              <ChevronRight className="text-gray-500" size={16} />
            )}
          </button>
        ),
      },
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
        cell: ({ getValue }) => {
          const fullText = getValue<string>();
          // Extract first sentence (up to first period, or first 80 chars)
          const firstSentenceMatch = fullText.match(/^[^.!?]+[.!?]/);
          const brief = firstSentenceMatch ? firstSentenceMatch[0].trim() : fullText.slice(0, 80) + '...';
          return (
            <span className="font-sans text-sm text-gray-700">
              {brief}
            </span>
          );
        },
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

  const table = useReactTable({
    data: rows,
    columns,
    state: { expanded },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Get the selected patient for the header
  const selectedPatient = allPatients.find((p) => p.id === selectedPatientId);

  // Count cases for selected patient
  const selectedPatientCaseCount = cases.filter((c) => c.patientId === selectedPatientId).length;

  return (
    <ScreenContainer>
      <PatientSelector
        patients={allPatients}
        selectedPatientId={selectedPatientId}
        onSelectPatient={setSelectedPatientId}
        recordCounts={recordCounts}
      />

      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">
          Patient Records — {selectedPatient?.initials || 'Unknown'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {selectedPatient && (
            <>
              <span className="font-medium">
                {selectedPatient.age}
                {selectedPatient.sex}, DOB {selectedPatient.dateOfBirth}
              </span>
              {' · '}
            </>
          )}
          {rows.length} record{rows.length !== 1 ? 's' : ''} across {selectedPatientCaseCount}{' '}
          case
          {selectedPatientCaseCount !== 1 ? 's' : ''}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-gray-500">
            No records available for {selectedPatient?.initials}.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Select M.K. to view sample patient records.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-200 bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-1.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr className="bg-gray-50">
                      <td colSpan={columns.length} className="p-0">
                        <AuditTrailPanel evidence={evidenceMap.get(row.original.id)!} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ScreenContainer>
  );
}
