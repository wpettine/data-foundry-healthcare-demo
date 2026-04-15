interface PASummarySectionProps {
  requestNumber: string;
  filedDate: string;
  procedure: string;
  payerName: string;
  assignedTo: string;
}

export function PASummarySection({
  requestNumber,
  filedDate,
  procedure,
  payerName,
  assignedTo,
}: PASummarySectionProps) {
  const formattedDate = new Date(filedDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        PA Request Summary
      </h3>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-gray-500">Request #</span>
          <span className="font-[JetBrains_Mono] text-gray-900">{requestNumber}</span>
        </div>
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-gray-500">Filed</span>
          <span className="text-gray-900">{formattedDate}</span>
        </div>
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-gray-500">Procedure</span>
          <span className="text-gray-900">{procedure}</span>
        </div>
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-gray-500">Payer</span>
          <span className="text-gray-900">{payerName}</span>
        </div>
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-gray-500">Assigned To</span>
          <span className="text-gray-900">{assignedTo}</span>
        </div>
      </div>
    </div>
  );
}
