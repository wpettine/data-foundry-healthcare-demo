import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export function PaginationControls({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startRow = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5">
      {/* Left: Row count info */}
      <div className="text-xs text-gray-600">
        Showing{' '}
        <span className="font-semibold font-[JetBrains_Mono] text-gray-800">
          {startRow.toLocaleString()}
        </span>
        {' – '}
        <span className="font-semibold font-[JetBrains_Mono] text-gray-800">
          {endRow.toLocaleString()}
        </span>
        {' of '}
        <span className="font-semibold font-[JetBrains_Mono] text-gray-800">
          {totalItems.toLocaleString()}
        </span>
        {' rows'}
      </div>

      {/* Right: Page size selector + navigation */}
      <div className="flex items-center gap-4">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <span className="h-4 w-px bg-gray-200" />

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
            className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          <span className="px-2 text-xs text-gray-600">
            Page{' '}
            <span className="font-semibold font-[JetBrains_Mono] text-gray-800">
              {currentPage}
            </span>
            {' of '}
            <span className="font-semibold font-[JetBrains_Mono] text-gray-800">
              {totalPages}
            </span>
          </span>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Go to next page"
            className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
