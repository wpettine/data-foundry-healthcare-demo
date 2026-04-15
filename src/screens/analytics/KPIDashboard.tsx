import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenContainer from '../../components/layout/ScreenContainer';
import { MetricCard } from '../../components/data-display/MetricCard';
import { ProcessingOverlay } from '../../components/feedback/ProcessingOverlay';
import { KPISummaryTable } from './KPISummaryTable';
import { CascadeImpactTable } from './CascadeImpactTable';
import { buildKPISummaryRows, buildCascadeImpactRows } from './kpi-helpers';
import { useScenario } from '../../scenarios/ScenarioContext';
import { useKPIStore } from '../../store/kpiStore';

const RECONCILE_PHASES = [
  'Loading system definitions',
  'Analyzing field mappings',
  'Computing canonical metric',
  'Projecting downstream impacts',
  'Writing reconciliation report',
];

export default function KPIDashboard() {
  const scenario = useScenario();
  const navigate = useNavigate();
  const kpisReconciled = useKPIStore((s) => s.kpisReconciled);
  const reconcileKpi = useKPIStore((s) => s.reconcileKpi);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);

  // Guard: redirect if no KPI data
  if (!scenario.kpiDashboard) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const { kpiReconciliations } = scenario.kpiDashboard;

  const summaryRows = useMemo(
    () => buildKPISummaryRows(kpiReconciliations),
    [kpiReconciliations]
  );

  const cascadeRows = useMemo(
    () => buildCascadeImpactRows(kpiReconciliations),
    [kpiReconciliations]
  );

  const handleReconcile = (kpiId: string) => {
    setIsProcessing(true);
    setCurrentPhase(0);

    const phaseInterval = setInterval(() => {
      setCurrentPhase((prev) => {
        if (prev >= RECONCILE_PHASES.length - 1) {
          clearInterval(phaseInterval);
          setTimeout(() => {
            reconcileKpi(kpiId);
            setIsProcessing(false);
            setCurrentPhase(0);
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  // Summary stats
  const totalKPIs = kpiReconciliations.length;
  const reconciledCount = kpisReconciled.length;
  const totalImpact = kpiReconciliations.reduce((sum, kpi) => sum + kpi.dollarImpact.amount, 0);
  const totalVariants = kpiReconciliations.reduce((sum, kpi) => sum + kpi.definitionVariants.length, 0);
  const totalCascadeImpacts = cascadeRows.length;

  return (
    <ScreenContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">KPI Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Financial metric reconciliation across {scenario.systems.length} source systems
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Day {scenario.dealTimer.currentDay} of {scenario.dealTimer.totalDays}
          </div>
        </div>

        {/* Summary Bar */}
        <div className="grid grid-cols-5 gap-4">
          <MetricCard label="Total KPIs" value={totalKPIs} />
          <MetricCard
            label="Reconciled"
            value={`${reconciledCount}/${totalKPIs}`}
            trend={
              reconciledCount > 0
                ? { direction: 'up', label: `${Math.round((reconciledCount / totalKPIs) * 100)}%` }
                : undefined
            }
          />
          <MetricCard
            label="Dollar Impact"
            value={`$${(totalImpact / 1_000_000).toFixed(1)}M`}
            trend={{ direction: 'down', label: 'Revenue/cost variance' }}
          />
          <MetricCard label="System Variants" value={totalVariants} />
          <MetricCard label="Downstream Impacts" value={totalCascadeImpacts} />
        </div>

        {/* KPI Summary Table */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-3">KPI Reconciliations</h2>
          <KPISummaryTable rows={summaryRows} onReconcile={handleReconcile} />
        </div>

        {/* Cascade Impact Table */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-3">Downstream Cascade Impact</h2>
          <CascadeImpactTable
            rows={cascadeRows}
            kpiReconciliations={kpiReconciliations.map((kpi) => ({
              kpiId: kpi.kpiId,
              kpiName: kpi.kpiName,
            }))}
          />
        </div>
      </div>

      <ProcessingOverlay
        phases={RECONCILE_PHASES}
        currentPhase={currentPhase}
        isActive={isProcessing}
      />
    </ScreenContainer>
  );
}
