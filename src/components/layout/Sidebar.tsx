import { useState } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useScenario } from '../../scenarios/ScenarioContext';
import {
  LayoutDashboard,
  Table2,
  GitBranch,
  Shield,
  Users,
  FileCheck,
  FlaskConical,
  Microscope,
  BarChart3,
  Activity,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  module?: 'paWorkbench' | 'payerCriteria' | 'analytics' | 'kpiDashboard';
}

const NAV_SECTIONS: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'WORKSPACE',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    title: 'INTEGRATION',
    items: [
      { label: 'Schema Explorer', path: '/schema-explorer', icon: <Table2 size={18} /> },
      { label: 'Concept Map', path: '/concept-map', icon: <GitBranch size={18} />, module: 'payerCriteria' },
      { label: 'Payer Criteria', path: '/payer-criteria', icon: <Shield size={18} />, module: 'payerCriteria' },
    ],
  },
  {
    title: 'CLINICAL',
    items: [
      { label: 'Patient Records', path: '/patient-records', icon: <Users size={18} />, module: 'paWorkbench' },
      { label: 'PA Workbench', path: '/pa-workbench', icon: <FileCheck size={18} />, module: 'paWorkbench' },
    ],
  },
  {
    title: 'ANALYTICS',
    items: [
      { label: 'Model Builder', path: '/model-builder', icon: <FlaskConical size={18} />, module: 'analytics' },
      { label: 'Annotation Studio', path: '/annotation-studio', icon: <Microscope size={18} />, module: 'analytics' },
      { label: 'KPI Dashboard', path: '/kpi-dashboard', icon: <BarChart3 size={18} />, module: 'kpiDashboard' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Pipeline Health', path: '/pipeline-health', icon: <Activity size={18} /> },
    ],
  },
];

export default function Sidebar() {
  const scenario = useScenario();
  const [searchParams] = useSearchParams();
  const search = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav
      className={`border-r border-gray-200 bg-white overflow-y-auto shrink-0 transition-[width] duration-200 ${
        collapsed ? 'w-14' : 'w-60'
      }`}
    >
      {/* Collapse / expand toggle */}
      <div className={`flex ${collapsed ? 'justify-center' : 'justify-end'} px-2 pt-2`}>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <div className="py-2">
        {NAV_SECTIONS.map((section) => {
          const visibleItems = section.items.filter((item) => {
            if (!item.module) return true;
            return scenario[item.module] !== null;
          });
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="mb-4">
              {!collapsed && (
                <div className="px-4 mb-1 text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                  {section.title}
                </div>
              )}
              {collapsed && <div className="mb-1 border-t border-gray-100 mx-2" />}
              {visibleItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path + search}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center ${collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-4 py-2'} text-sm ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 border-l-2 border-transparent'
                    }`
                  }
                >
                  {item.icon}
                  {!collapsed && item.label}
                </NavLink>
              ))}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
