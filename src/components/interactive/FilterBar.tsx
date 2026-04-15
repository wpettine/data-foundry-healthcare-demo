import { Search } from 'lucide-react';

interface FilterBarProps {
  savedView: string | null;
  searchTerm: string;
  payerId: string | null;
  statusFilter: 'all' | 'ready' | 'review' | 'incomplete' | 'at-risk';
  onSavedViewChange: (view: string | null) => void;
  onSearchChange: (term: string) => void;
  onPayerChange: (payerId: string | null) => void;
  onStatusChange: (status: 'all' | 'ready' | 'review' | 'incomplete' | 'at-risk') => void;
  payers: Array<{ id: string; name: string }>;
}

export function FilterBar({
  savedView,
  searchTerm,
  payerId,
  statusFilter,
  onSavedViewChange,
  onSearchChange,
  onPayerChange,
  onStatusChange,
  payers,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
      {/* Saved Views Dropdown */}
      <select
        value={savedView || 'all-cases'}
        onChange={(e) => onSavedViewChange(e.target.value === 'all-cases' ? null : e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="all-cases">All Cases</option>
        <option value="my-urgent">My Cases — Urgent</option>
        <option value="this-week">All TKA — This Week</option>
      </select>

      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search patient, procedure, or payer..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Payer Filter */}
      <select
        value={payerId || 'all'}
        onChange={(e) => onPayerChange(e.target.value === 'all' ? null : e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="all">All Payers</option>
        {payers.map((payer) => (
          <option key={payer.id} value={payer.id}>
            {payer.name}
          </option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) =>
          onStatusChange(e.target.value as 'all' | 'ready' | 'review' | 'incomplete' | 'at-risk')
        }
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="all">All Status</option>
        <option value="ready">Ready</option>
        <option value="review">In Review</option>
        <option value="incomplete">Incomplete</option>
        <option value="at-risk">At Risk</option>
      </select>
    </div>
  );
}
