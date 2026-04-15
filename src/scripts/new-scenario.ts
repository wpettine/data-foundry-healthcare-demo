import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [,, id, name] = process.argv;

if (!id || !name) {
  console.error('Usage: npx tsx scripts/new-scenario.ts <id> "<Company Name>"');
  process.exit(1);
}

const scenariosDir = path.resolve(__dirname, '../scenarios');
const dir = path.join(scenariosDir, id);

if (fs.existsSync(dir)) {
  console.error(`Directory already exists: ${dir}`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });

// _constants.ts
fs.writeFileSync(path.join(dir, '_constants.ts'), `export const COMPANY = { name: '${name}', industry: '', locationCount: 0 } as const;
export const DEAL_TIMER = { currentDay: 1, totalDays: 90, label: 'Integration Sprint' } as const;
export const SCHEMA_COUNTS = { totalSystems: 0, totalFields: 0, autoAnnotated: 0, payerCriteriaSets: 0 } as const;
export const SYSTEM_IDS = {} as const;
export const SOURCE_COLORS = {} as const;
export const LINKING_COLORS = ['#3B82F6', '#22C55E', '#D97706', '#8B5CF6', '#F43F5E', '#14B8A6'] as const;
`);

// Empty fixture files
const fixtures = ['systems', 'schema-fields', 'payer-criteria', 'patients', 'pa-cases', 'pa-requirements', 'pa-evidence', 'model-features', 'training-data', 'biometric-streams', 'clinical-events', 'ai-findings', 'pipeline-alerts', 'snapshots'];
for (const fixture of fixtures) {
  fs.writeFileSync(path.join(dir, `${fixture}.ts`), `// ${fixture} fixture — stub\n`);
}

// validate.ts
fs.writeFileSync(path.join(dir, 'validate.ts'), `import { createValidator } from '../../utils/validation';

export function validate${id.replace(/-/g, '')}() {
  const { finish } = createValidator('${id}');
  // Add validation assertions here: const { check, finish } = createValidator(...)
  finish();
}
`);

// index.ts
fs.writeFileSync(path.join(dir, 'index.ts'), `import { COMPANY, DEAL_TIMER, SCHEMA_COUNTS } from './_constants';
import type { ScenarioData } from '../types';

export const ${id.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())}Data: ScenarioData = {
  id: '${id}',
  company: { name: COMPANY.name, industry: COMPANY.industry, locationCount: COMPANY.locationCount },
  dealTimer: { ...DEAL_TIMER },
  dashboardSummary: {
    totalSystems: SCHEMA_COUNTS.totalSystems,
    totalFields: SCHEMA_COUNTS.totalFields,
    autoAnnotatedPercent: SCHEMA_COUNTS.autoAnnotated,
    payerCriteriaSets: SCHEMA_COUNTS.payerCriteriaSets,
  },
  systems: [],
  schemaFields: [],
  topology: { nodes: [], edges: [] },
  pipelineAlerts: [],
  storeSnapshots: {},
  paWorkbench: null,
  payerCriteria: null,
  analytics: null,
};
`);

// Add to manifest
const manifestPath = path.join(scenariosDir, 'manifest.ts');
let manifest = fs.readFileSync(manifestPath, 'utf-8');
const varName = id.replace(/-(\w)/g, (_, c: string) => c.toUpperCase()) + 'Data';
const importLine = `import { ${varName} } from './${id}';`;
const entryLine = `  { id: '${id}', data: ${varName} },`;

manifest = manifest.replace(
  /(import .* from '\.\/.*';)\n/,
  `$1\n${importLine}\n`
);
manifest = manifest.replace(
  /(\];)/,
  `${entryLine}\n$1`
);

fs.writeFileSync(manifestPath, manifest);
console.log(`Scenario '${id}' scaffolded at ${dir}`);
console.log(`Manifest updated at ${manifestPath}`);
