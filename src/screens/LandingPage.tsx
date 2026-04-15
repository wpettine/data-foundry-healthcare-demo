import { useNavigate } from 'react-router-dom';
import { SCENARIOS } from '../scenarios/manifest';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center">
            <span className="text-white font-bold text-lg">DF</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Data Foundry</h1>
        </div>
        <p className="text-gray-500">Select a workspace to begin</p>
      </div>
      <div className="grid gap-4 max-w-lg w-full">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate(`/dashboard?demo=${s.id}`)}
            className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{s.data.company.name}</h2>
            <p className="text-sm text-gray-500 mb-3">{s.data.company.industry} — {s.data.company.locationCount} locations</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{s.data.dashboardSummary.totalSystems} sources</span>
              <span>{s.data.dashboardSummary.totalFields.toLocaleString()} fields</span>
              <span>{s.data.dashboardSummary.autoAnnotatedPercent}% annotated</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
