import type { SourceSystem } from '../../types/system';
import type { TopologyConfig } from '../../types/scenario';
import { SYSTEM_IDS, SOURCE_COLORS } from './_constants';


// ---------------------------------------------------------------------------
// Hub node ID (Data Foundry central node in the topology)
// ---------------------------------------------------------------------------
const HUB_ID = 'data-foundry-hub';

// ---------------------------------------------------------------------------
// Color palette for filler systems
// ---------------------------------------------------------------------------
const FILLER_COLORS = [
  '#0EA5E9', '#6366F1', '#14B8A6', '#F59E0B', '#8B5CF6',
  '#F97316', '#22C55E', '#3B82F6', '#F43F5E', '#D97706',
  '#EC4899', '#10B981', '#EF4444',
] as const;

// ---------------------------------------------------------------------------
// 7 Hero Systems — field counts lock to design doc values
// Hero total: 1247 + 892 + 634 + 578 + 412 + 289 + 345 = 4 397
// Budget for 13 fillers: 4 847 − 4 397 = 450
// ---------------------------------------------------------------------------
const HERO_SYSTEMS: SourceSystem[] = [
  {
    id: SYSTEM_IDS.EPIC,
    name: 'Summit Flagship Orthopedics',
    platform: 'Epic',
    accentColor: SOURCE_COLORS[SYSTEM_IDS.EPIC],
    systemCategory: 'ehr',
    locationCount: 4,
    fieldCount: 1247,
    annotationCompletion: 97.8,
    lastSync: '2026-03-28T14:32:00Z',
    status: 'integrated',
  },
  {
    id: SYSTEM_IDS.ATHENA,
    name: 'Peak Performance Sports Medicine',
    platform: 'Athenahealth',
    accentColor: SOURCE_COLORS[SYSTEM_IDS.ATHENA],
    systemCategory: 'ehr',
    locationCount: 3,
    fieldCount: 892,
    annotationCompletion: 95.1,
    lastSync: '2026-03-28T13:47:00Z',
    status: 'integrated',
  },
  {
    id: SYSTEM_IDS.MODMED,
    name: 'Alpine Joint & Spine Center',
    platform: 'ModMed',
    accentColor: SOURCE_COLORS[SYSTEM_IDS.MODMED],
    systemCategory: 'ehr',
    locationCount: 2,
    fieldCount: 634,
    annotationCompletion: 93.4,
    lastSync: '2026-03-28T12:15:00Z',
    status: 'integrated',
  },
  {
    id: SYSTEM_IDS.ECW,
    name: 'Ridgeline Orthopedic Associates',
    platform: 'eCW',
    accentColor: SOURCE_COLORS[SYSTEM_IDS.ECW],
    systemCategory: 'ehr',
    locationCount: 2,
    fieldCount: 578,
    annotationCompletion: 91.7,
    lastSync: '2026-03-27T22:05:00Z',
    status: 'review',
  },
  {
    id: SYSTEM_IDS.WEBPT,
    name: 'Summit PT & Rehabilitation',
    platform: 'WebPT',
    accentColor: SOURCE_COLORS[SYSTEM_IDS.WEBPT],
    systemCategory: 'rehab',
    locationCount: 5,
    fieldCount: 412,
    annotationCompletion: 96.3,
    lastSync: '2026-03-28T15:01:00Z',
    status: 'integrated',
  },
  {
    id: SYSTEM_IDS.PHARMACY,
    name: 'Summit Pharmacy Services',
    platform: 'Pharmacy Feed',
    accentColor: SOURCE_COLORS[SYSTEM_IDS.PHARMACY],
    systemCategory: 'ancillary',
    locationCount: 1,
    fieldCount: 289,
    annotationCompletion: 98.1,
    lastSync: '2026-03-28T14:58:00Z',
    status: 'integrated',
  },
  {
    id: SYSTEM_IDS.RADIOLOGY,
    name: 'Cascade Imaging Partners',
    platform: 'Radiology PACS',
    accentColor: SOURCE_COLORS[SYSTEM_IDS.RADIOLOGY],
    systemCategory: 'ancillary',
    locationCount: 1,
    fieldCount: 345,
    annotationCompletion: 89.2,
    lastSync: '2026-03-27T18:30:00Z',
    status: 'review',
  },
];

// ---------------------------------------------------------------------------
// 13 Filler Systems — smaller acquired practices & ancillary feeds
// Total filler fields: 450 (to reach 4 847 across all 20 systems)
// ---------------------------------------------------------------------------
const FILLER_SYSTEMS: SourceSystem[] = [
  {
    id: 'crestview-ortho',
    name: 'Crestview Orthopedic Clinic',
    platform: 'Athenahealth',
    accentColor: FILLER_COLORS[0],
    systemCategory: 'ehr',
    locationCount: 1,
    fieldCount: 48,
    annotationCompletion: 92.3,
    lastSync: '2026-03-28T11:20:00Z',
    status: 'integrated',
  },
  {
    id: 'valley-spine',
    name: 'Valley Spine & Pain Management',
    platform: 'Epic',
    accentColor: FILLER_COLORS[1],
    systemCategory: 'ehr',
    locationCount: 2,
    fieldCount: 52,
    annotationCompletion: 90.5,
    lastSync: '2026-03-28T10:45:00Z',
    status: 'integrated',
  },
  {
    id: 'lakeshore-sports',
    name: 'Lakeshore Sports Medicine',
    platform: 'ModMed',
    accentColor: FILLER_COLORS[2],
    systemCategory: 'ehr',
    locationCount: 1,
    fieldCount: 38,
    annotationCompletion: 88.7,
    lastSync: '2026-03-27T16:30:00Z',
    status: 'review',
  },
  {
    id: 'pinecrest-rehab',
    name: 'Pinecrest Rehabilitation Center',
    platform: 'WebPT',
    accentColor: FILLER_COLORS[3],
    systemCategory: 'rehab',
    locationCount: 2,
    fieldCount: 41,
    annotationCompletion: 94.1,
    lastSync: '2026-03-28T09:15:00Z',
    status: 'integrated',
  },
  {
    id: 'westfield-joint',
    name: 'Westfield Joint Replacement',
    platform: 'eCW',
    accentColor: FILLER_COLORS[4],
    systemCategory: 'ehr',
    locationCount: 1,
    fieldCount: 36,
    annotationCompletion: 87.9,
    lastSync: '2026-03-27T21:40:00Z',
    status: 'review',
  },
  {
    id: 'highland-ortho',
    name: 'Highland Orthopedic Surgery',
    platform: 'Greenway',
    accentColor: FILLER_COLORS[5],
    systemCategory: 'ehr',
    locationCount: 1,
    fieldCount: 33,
    annotationCompletion: 91.2,
    lastSync: '2026-03-28T08:50:00Z',
    status: 'integrated',
  },
  {
    id: 'summit-hand',
    name: 'Summit Hand & Upper Extremity',
    platform: 'ModMed',
    accentColor: FILLER_COLORS[6],
    systemCategory: 'ehr',
    locationCount: 1,
    fieldCount: 29,
    annotationCompletion: 95.6,
    lastSync: '2026-03-28T14:10:00Z',
    status: 'integrated',
  },
  {
    id: 'cedar-pt',
    name: 'Cedar Creek Physical Therapy',
    platform: 'WebPT',
    accentColor: FILLER_COLORS[7],
    systemCategory: 'rehab',
    locationCount: 2,
    fieldCount: 34,
    annotationCompletion: 93.8,
    lastSync: '2026-03-28T13:22:00Z',
    status: 'integrated',
  },
  {
    id: 'riverdale-ortho',
    name: 'Riverdale Orthopedics & Sports',
    platform: 'NextGen',
    accentColor: FILLER_COLORS[8],
    systemCategory: 'ehr',
    locationCount: 1,
    fieldCount: 28,
    annotationCompletion: 86.4,
    lastSync: '2026-03-27T15:55:00Z',
    status: 'review',
  },
  {
    id: 'brookside-imaging',
    name: 'Brookside Diagnostic Imaging',
    platform: 'Radiology PACS',
    accentColor: FILLER_COLORS[9],
    systemCategory: 'ancillary',
    locationCount: 1,
    fieldCount: 25,
    annotationCompletion: 90.1,
    lastSync: '2026-03-28T07:40:00Z',
    status: 'integrated',
  },
  {
    id: 'eastside-foot',
    name: 'Eastside Foot & Ankle Specialists',
    platform: 'Athenahealth',
    accentColor: FILLER_COLORS[10],
    systemCategory: 'ehr',
    locationCount: 1,
    fieldCount: 30,
    annotationCompletion: 92.7,
    lastSync: '2026-03-28T12:05:00Z',
    status: 'integrated',
  },
  {
    id: 'granite-pain',
    name: 'Granite Peak Pain Center',
    platform: 'eCW',
    accentColor: FILLER_COLORS[11],
    systemCategory: 'ehr',
    locationCount: 1,
    fieldCount: 27,
    annotationCompletion: 89.3,
    lastSync: '2026-03-27T19:15:00Z',
    status: 'review',
  },
  {
    id: 'blueridge-ortho',
    name: 'Blue Ridge Orthopedic Group',
    platform: 'Greenway',
    accentColor: FILLER_COLORS[12],
    systemCategory: 'ehr',
    locationCount: 1,
    fieldCount: 29,
    annotationCompletion: 91.8,
    lastSync: '2026-03-28T10:30:00Z',
    status: 'integrated',
  },
];

// ---------------------------------------------------------------------------
// Combined export — all 20 systems
// ---------------------------------------------------------------------------
export const SYSTEMS: SourceSystem[] = [...HERO_SYSTEMS, ...FILLER_SYSTEMS];

// ---------------------------------------------------------------------------
// Build-time assertion: field count must match constants
// ---------------------------------------------------------------------------
const totalFields = SYSTEMS.reduce((sum, s) => sum + s.fieldCount, 0);
if (totalFields !== 4_847) {
  console.warn(
    `[systems.ts] Total field count mismatch: expected 4847, got ${totalFields}. ` +
    `Fix filler field counts so hero (${HERO_SYSTEMS.reduce((s, h) => s + h.fieldCount, 0)}) ` +
    `+ filler (${FILLER_SYSTEMS.reduce((s, f) => s + f.fieldCount, 0)}) = 4847.`
  );
}

// ---------------------------------------------------------------------------
// Topology — hub-and-spoke from Data Foundry Hub to every source system
// ---------------------------------------------------------------------------
const HUB_NODE = {
  id: HUB_ID,
  type: 'hub' as const,
  label: 'Data Foundry',
  platform: 'Data Foundry',
  accentColor: '#2563EB',
};

export const TOPOLOGY_CONFIG: TopologyConfig = {
  nodes: [
    HUB_NODE,
    ...SYSTEMS.map((s) => ({
      id: s.id,
      type: 'system' as const,
      label: s.name,
      platform: s.platform,
      accentColor: s.accentColor,
    })),
  ],
  edges: SYSTEMS.map((s) => ({
    id: `edge-${HUB_ID}-${s.id}`,
    source: s.id,
    target: HUB_ID,
  })),
};
