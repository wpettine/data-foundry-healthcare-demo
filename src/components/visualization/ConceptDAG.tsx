import { useMemo, useState } from 'react';
import type { SchemaAnnotation } from '../../types/system';
import type { SourceSystem } from '../../types/system';

interface ConceptDAGProps {
  schemaFields: SchemaAnnotation[];
  systems: SourceSystem[];
}

interface SystemContribution {
  systemId: string;
  systemName: string;
  accentColor: string;
  abbreviation: string;
  fieldCount: number;
  avgConfidence: number;
  exampleField: { table: string; field: string; confidence: number };
}

interface ConceptCard {
  conceptId: string;
  conceptLabel: string;
  category: string;
  totalFields: number;
  avgConfidence: number;
  avgConfidenceLevel: 'high' | 'medium' | 'low';
  systemContributions: SystemContribution[];
}

// ---------------------------------------------------------------------------
// Category classification
// ---------------------------------------------------------------------------
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Clinical: ['diagnosis', 'procedure', 'imaging', 'functional', 'kellgren', 'patient', 'severity', 'outcome', 'vitals', 'allergy', 'lab', 'radiology'],
  Billing: ['adjustment', 'charge', 'payment', 'claim', 'ndc', 'medication', 'insurance', 'billing', 'revenue', 'drug', 'dispens'],
  Operational: ['encounter', 'schedule', 'appointment', 'sync', 'provider', 'location', 'referral', 'order', 'status'],
};

const CATEGORY_STYLE: Record<string, { dot: string; headerBg: string }> = {
  Clinical: { dot: 'bg-teal-500', headerBg: 'bg-teal-50' },
  Billing: { dot: 'bg-purple-500', headerBg: 'bg-purple-50' },
  Operational: { dot: 'bg-gray-400', headerBg: 'bg-gray-50' },
};

function categorize(conceptLabel: string): string {
  const lower = conceptLabel.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return cat;
  }
  return 'Operational';
}

function confidenceLevel(avg: number): 'high' | 'medium' | 'low' {
  if (avg >= 85) return 'high';
  if (avg >= 65) return 'medium';
  return 'low';
}

// ---------------------------------------------------------------------------
// Filter bar (chip-toggle pattern from reference demo)
// ---------------------------------------------------------------------------
function FilterGroup({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-gray-400 uppercase tracking-wider mr-1">{label}</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            active === opt.value
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// System pill
// ---------------------------------------------------------------------------
function SystemPill({ contribution }: { contribution: SystemContribution }) {
  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[9px] font-bold text-white flex-shrink-0 cursor-default"
      style={{ backgroundColor: contribution.accentColor }}
      title={`${contribution.systemName}: ${contribution.fieldCount} fields, ${contribution.avgConfidence}% avg confidence`}
    >
      {contribution.abbreviation}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function ConceptDAG({ schemaFields, systems }: ConceptDAGProps) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [systemFilter, setSystemFilter] = useState('all');

  const systemMap = useMemo(() => {
    const m = new Map<string, SourceSystem>();
    for (const s of systems) m.set(s.id, s);
    return m;
  }, [systems]);

  // Build all cards (unfiltered)
  const allCards = useMemo(() => {
    const byConcept = new Map<string, { label: string; fields: SchemaAnnotation[] }>();
    for (const f of schemaFields) {
      let entry = byConcept.get(f.mappedConceptId);
      if (!entry) {
        entry = { label: f.mappedConceptLabel, fields: [] };
        byConcept.set(f.mappedConceptId, entry);
      }
      entry.fields.push(f);
    }

    const result: ConceptCard[] = [];

    for (const [conceptId, { label, fields }] of byConcept) {
      const bySystem = new Map<string, SchemaAnnotation[]>();
      for (const f of fields) {
        let arr = bySystem.get(f.systemId);
        if (!arr) {
          arr = [];
          bySystem.set(f.systemId, arr);
        }
        arr.push(f);
      }

      const contributions: SystemContribution[] = [];
      for (const [sysId, sysFields] of bySystem) {
        const sys = systemMap.get(sysId);
        const avgConf = Math.round(sysFields.reduce((s, f) => s + f.confidence, 0) / sysFields.length);
        const best = sysFields.reduce((a, b) => (a.confidence >= b.confidence ? a : b));
        const platform = sys?.platform ?? sysId;

        contributions.push({
          systemId: sysId,
          systemName: sys?.name ?? sysId,
          accentColor: sys?.accentColor ?? '#6B7280',
          abbreviation: platform.slice(0, 2).toUpperCase(),
          fieldCount: sysFields.length,
          avgConfidence: avgConf,
          exampleField: { table: best.sourceTable, field: best.sourceField, confidence: best.confidence },
        });
      }

      contributions.sort((a, b) => b.fieldCount - a.fieldCount);

      const totalFields = fields.length;
      const avg = Math.round(fields.reduce((s, f) => s + f.confidence, 0) / totalFields);

      result.push({
        conceptId,
        conceptLabel: label,
        category: categorize(label),
        totalFields,
        avgConfidence: avg,
        avgConfidenceLevel: confidenceLevel(avg),
        systemContributions: contributions,
      });
    }

    const catOrder = ['Clinical', 'Billing', 'Operational'];
    result.sort((a, b) => {
      const ci = catOrder.indexOf(a.category) - catOrder.indexOf(b.category);
      if (ci !== 0) return ci;
      return b.totalFields - a.totalFields;
    });

    return result;
  }, [schemaFields, systemMap]);

  // Derive unique system names for filter options
  const systemOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const card of allCards) {
      for (const sys of card.systemContributions) {
        if (!seen.has(sys.systemId)) {
          const platform = systemMap.get(sys.systemId)?.platform ?? sys.systemId;
          seen.set(sys.systemId, platform);
        }
      }
    }
    // Dedupe by platform name
    const byPlatform = new Map<string, string>();
    for (const [id, platform] of seen) {
      if (!byPlatform.has(platform)) byPlatform.set(platform, id);
    }
    return Array.from(byPlatform.entries())
      .map(([platform, id]) => ({ value: id, label: platform }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [allCards, systemMap]);

  // Apply filters
  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      if (categoryFilter !== 'all' && card.category !== categoryFilter) return false;
      if (confidenceFilter !== 'all' && card.avgConfidenceLevel !== confidenceFilter) return false;
      if (systemFilter !== 'all') {
        const platform = systemMap.get(systemFilter)?.platform;
        if (!card.systemContributions.some((sys) => {
          const sysPlatform = systemMap.get(sys.systemId)?.platform;
          return sysPlatform === platform;
        })) return false;
      }
      return true;
    });
  }, [allCards, categoryFilter, confidenceFilter, systemFilter, systemMap]);

  // Summary counts
  const totalConcepts = allCards.length;
  const shownConcepts = filteredCards.length;
  const totalFields = filteredCards.reduce((s, c) => s + c.totalFields, 0);

  return (
    <div className="h-full flex flex-col">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white rounded-t-lg">
        <FilterGroup
          label="Category"
          options={[
            { value: 'all', label: 'All' },
            { value: 'Clinical', label: 'Clinical' },
            { value: 'Billing', label: 'Billing' },
            { value: 'Operational', label: 'Operational' },
          ]}
          active={categoryFilter}
          onChange={setCategoryFilter}
        />
        <span className="text-gray-300">|</span>
        <FilterGroup
          label="Confidence"
          options={[
            { value: 'all', label: 'All' },
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' },
          ]}
          active={confidenceFilter}
          onChange={setConfidenceFilter}
        />
        <span className="text-gray-300">|</span>
        <FilterGroup
          label="System"
          options={[
            { value: 'all', label: 'All' },
            ...systemOptions,
          ]}
          active={systemFilter}
          onChange={setSystemFilter}
        />

        {/* Summary */}
        <div className="ml-auto text-[11px] text-gray-400 tabular-nums">
          {shownConcepts === totalConcepts
            ? `${totalConcepts} concepts · ${totalFields.toLocaleString()} fields`
            : `${shownConcepts} of ${totalConcepts} concepts · ${totalFields.toLocaleString()} fields`}
        </div>
      </div>

      {/* Card grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredCards.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            No concepts match the current filters
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filteredCards.map((card) => {
              const style = CATEGORY_STYLE[card.category] ?? CATEGORY_STYLE.Operational;

              return (
                <div
                  key={card.conceptId}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
                >
                  {/* Card header */}
                  <div className={`px-4 py-3 ${style.headerBg} border-b border-gray-100`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${style.dot}`} />
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide truncate">
                          {card.conceptLabel}
                        </h4>
                      </div>
                      <span className="font-['JetBrains_Mono'] text-xs text-gray-500 font-medium tabular-nums flex-shrink-0 ml-2">
                        {card.totalFields} fld
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      From {card.systemContributions.length} systems · {card.avgConfidence}% avg confidence
                    </div>
                  </div>

                  {/* System contribution rows */}
                  <div className="divide-y divide-gray-50">
                    {card.systemContributions.map((sys) => (
                      <div key={sys.systemId} className="px-4 py-2.5 flex items-center gap-2">
                        <SystemPill contribution={sys} />
                        <div className="flex-1 min-w-0">
                          <code className="text-[10px] text-gray-600 bg-gray-50 px-1 py-0.5 rounded truncate block font-['JetBrains_Mono']">
                            {sys.exampleField.table}.{sys.exampleField.field}
                          </code>
                        </div>
                        <div className="font-['JetBrains_Mono'] text-[10px] text-gray-400 tabular-nums flex-shrink-0">
                          {sys.exampleField.confidence}% · {sys.fieldCount} fld
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
