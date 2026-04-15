import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './screens/LandingPage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Lazy-load screen components so heavy deps (ReactFlow, Plotly) are code-split.
// Suspense boundary is inside AppShell to keep the shell mounted during loads.
const Dashboard = lazy(() => import('./screens/workspace/Sources'));
const SchemaExplorer = lazy(() => import('./screens/integration/SchemaExplorer'));
const ConceptMap = lazy(() => import('./screens/integration/ConceptMap'));
const PayerCriteria = lazy(() => import('./screens/integration/PayerCriteria'));
const PatientRecords = lazy(() => import('./screens/clinical/PatientRecords'));
const PAWorklist = lazy(() => import('./screens/clinical/PAWorklist'));
const PADetail = lazy(() => import('./screens/clinical/PADetail'));
const ModelBuilderProject = lazy(() => import('./screens/analytics/ModelBuilderProject'));
const ModelBuilderDataset = lazy(() => import('./screens/analytics/ModelBuilderDataset'));
const AnnotationStudio = lazy(() => import('./screens/analytics/AnnotationStudio'));
const KPIDashboard = lazy(() => import('./screens/analytics/KPIDashboard'));
const PipelineHealth = lazy(() => import('./screens/system/PipelineHealth'));

export default function App() {
  useKeyboardShortcuts();

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schema-explorer" element={<SchemaExplorer />} />
          <Route path="/concept-map" element={<ConceptMap />} />
          <Route path="/payer-criteria" element={<PayerCriteria />} />
          <Route path="/patient-records" element={<PatientRecords />} />
          <Route path="/pa-workbench" element={<PAWorklist />} />
          <Route path="/pa-workbench/:caseId" element={<PADetail />} />
          <Route path="/model-builder" element={<ModelBuilderProject />} />
          <Route path="/model-builder/dataset" element={<ModelBuilderDataset />} />
          <Route path="/annotation-studio" element={<AnnotationStudio />} />
          <Route path="/kpi-dashboard" element={<KPIDashboard />} />
          <Route path="/pipeline-health" element={<PipelineHealth />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
