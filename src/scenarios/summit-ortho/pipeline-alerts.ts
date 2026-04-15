import type { PipelineAlert } from '../../types/pipeline';
import { SYSTEM_IDS } from './_constants';

const heroSchemaDrift: PipelineAlert = {
  id: 'alert-schema-drift',
  type: 'schema-change',
  systemId: SYSTEM_IDS.ECW,
  systemName: 'Site 12 — eClinicalWorks',
  description:
    "Field 'adj_type' renamed to 'adjustment_category' — 3 concept mappings affected. Auto-remapped at 97% confidence.",
  impact: '3 concept mappings',
  timestamp: '2026-03-18T14:32:00Z',
  severity: 'warning',
  resolved: false,
  detail: {
    type: 'schema-change',
    fieldBefore: 'adj_type',
    fieldAfter: 'adjustment_category',
    affectedMappings: [
      { conceptId: 'adj-001', conceptLabel: 'Contractual Adjustment', confidence: 0.97 },
      { conceptId: 'adj-002', conceptLabel: 'Prompt Pay Discount', confidence: 0.96 },
      { conceptId: 'adj-003', conceptLabel: 'Withhold Adjustment', confidence: 0.95 },
    ],
    autoRemapped: true,
    remappingConfidence: 0.97,
  },
};

const heroCriteriaUpdate: PipelineAlert = {
  id: 'alert-criteria-update',
  type: 'criteria-update',
  systemId: 'payer-bcbs',
  systemName: 'BCBS MA',
  description:
    'TKA coverage criteria updated — Conservative therapy duration changed from ≥3 months to ≥90 days PT + ≥30 days NSAID. 4 active cases affected.',
  impact: '4 active cases',
  timestamp: '2026-03-17T09:15:00Z',
  severity: 'critical',
  resolved: false,
  detail: {
    type: 'criteria-update',
    payerName: 'BCBS MA',
    criterionName: 'Conservative therapy duration',
    valueBefore: '≥3 months documented conservative treatment',
    valueAfter: '≥90 days supervised PT + ≥30 days NSAID trial',
    affectedCases: 4,
    effectiveDate: '2026-04-01',
  },
};

const fillerAlerts: PipelineAlert[] = [
  {
    id: 'alert-dup-patient',
    type: 'duplicate-detection',
    systemId: SYSTEM_IDS.ATHENA,
    systemName: 'Site 5 — athenahealth',
    description:
      'Potential duplicate patient record: MRN 3817294 and MRN 3817295 share DOB, last name, and SSN-last-4. Confidence 99%.',
    timestamp: '2026-03-18T11:04:00Z',
    severity: 'warning',
    resolved: false,
  },
  {
    id: 'alert-feed-latency',
    type: 'feed-latency',
    systemId: SYSTEM_IDS.PHARMACY,
    systemName: 'Pharmacy Feed',
    description:
      'Pharmacy data feed delayed 4h 12m past SLA window. Last successful sync: 2026-03-18T06:00:00Z.',
    timestamp: '2026-03-18T10:12:00Z',
    severity: 'critical',
    resolved: false,
  },
  {
    id: 'alert-mapping-gap',
    type: 'mapping-gap',
    systemId: SYSTEM_IDS.MODMED,
    systemName: 'Site 8 — ModMed',
    description:
      '12 CPT codes in ModMed billing export have no concept mapping. Most frequent: 29881 (knee arthroscopy, meniscectomy).',
    impact: '12 CPT codes',
    timestamp: '2026-03-17T16:45:00Z',
    severity: 'warning',
    resolved: false,
  },
  {
    id: 'alert-schema-version',
    type: 'schema-change',
    systemId: SYSTEM_IDS.EPIC,
    systemName: 'Flagship — Epic',
    description:
      'Epic FHIR R4 endpoint updated to v2026-03. 2 new extensions detected on Condition resource. No breaking changes.',
    timestamp: '2026-03-16T22:30:00Z',
    severity: 'info',
    resolved: true,
  },
  {
    id: 'alert-payer-denial-spike',
    type: 'anomaly-detection',
    systemId: 'payer-aetna',
    systemName: 'Aetna MA',
    description:
      'Denial rate for TKA pre-auth jumped from 8% to 19% over 14-day window. Possible criteria interpretation change.',
    timestamp: '2026-03-16T14:00:00Z',
    severity: 'warning',
    resolved: false,
  },
  {
    id: 'alert-field-null-spike',
    type: 'data-quality',
    systemId: SYSTEM_IDS.WEBPT,
    systemName: 'Site 14 — WebPT',
    description:
      'NULL rate for PT visit notes field increased from 2% to 11% since 2026-03-10. 47 records affected.',
    impact: '47 records',
    timestamp: '2026-03-15T09:20:00Z',
    severity: 'warning',
    resolved: true,
  },
  {
    id: 'alert-rad-hl7-parse',
    type: 'ingestion-error',
    systemId: SYSTEM_IDS.RADIOLOGY,
    systemName: 'Radiology PACS',
    description:
      '3 HL7 ORU messages failed parsing — malformed OBX-5 segment. Messages queued for manual review.',
    timestamp: '2026-03-14T17:55:00Z',
    severity: 'info',
    resolved: true,
  },
  {
    id: 'alert-consent-expiry',
    type: 'compliance',
    systemId: SYSTEM_IDS.EPIC,
    systemName: 'Flagship — Epic',
    description:
      '8 patient data-sharing consents expire within 30 days. Re-consent workflow triggered for care coordinators.',
    timestamp: '2026-03-14T08:00:00Z',
    severity: 'info',
    resolved: true,
  },
];

export const PIPELINE_ALERTS: PipelineAlert[] = [
  heroSchemaDrift,
  heroCriteriaUpdate,
  ...fillerAlerts,
];
