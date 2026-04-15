import { useCallback, useMemo, useState } from 'react';
import ReactFlow, { Background, MarkerType, Position, Handle } from 'reactflow';
import 'reactflow/dist/style.css';
import type { Node, Edge, NodeProps } from 'reactflow';
import type { SourceSystem, SystemCategory } from '../../types/system';
import { formatNumber } from '../../utils/formatters';

// ---------------------------------------------------------------------------
// Dimensions
// ---------------------------------------------------------------------------
const SYSTEM_W = 210;
const SYSTEM_H = 88;
const HUB_W = 300;
const HUB_H = 80;

// ---------------------------------------------------------------------------
// Lane configuration
// ---------------------------------------------------------------------------
const LANE_COLORS: Record<SystemCategory, string> = {
  ehr: '#3B82F6',
  rehab: '#22C55E',
  ancillary: '#F97316',
};

const LANE_LABELS: Record<SystemCategory, string> = {
  ehr: 'EHR Systems',
  rehab: 'Rehab / PT',
  ancillary: 'Ancillary',
};

/** Lanes above the hub */
const TOP_LANES: SystemCategory[] = ['ehr'];
/** Lanes below the hub */
const BOTTOM_LANES: SystemCategory[] = ['rehab', 'ancillary'];

// ---------------------------------------------------------------------------
// Abbreviation helper
// ---------------------------------------------------------------------------
function abbreviate(platform: string): string {
  const abbrevMap: Record<string, string> = {
    Epic: 'EP',
    Athenahealth: 'ATH',
    ModMed: 'MM',
    eCW: 'eCW',
    WebPT: 'WPT',
    NextGen: 'NG',
    Greenway: 'GW',
    'Pharmacy Feed': 'Rx',
    'Radiology PACS': 'RAD',
  };
  return abbrevMap[platform] ?? platform.slice(0, 2).toUpperCase();
}

// ---------------------------------------------------------------------------
// Custom node: SystemCardNode
// ---------------------------------------------------------------------------
interface SystemNodeData {
  label: string;
  platform: string;
  accentColor: string;
  status: 'integrated' | 'review';
  fieldCount: number;
  locationCount: number;
  category: SystemCategory;
  dimmed: boolean;
  highlighted: boolean;
  lanePosition: 'top' | 'bottom';
}

function SystemCardNode({ data }: NodeProps<SystemNodeData>) {
  const dotColor =
    data.status === 'integrated' ? 'bg-green-500' : 'bg-amber-500';
  const statusLabel =
    data.status === 'integrated' ? 'Connected' : 'In Review';

  const opacity = data.dimmed ? 'opacity-30' : 'opacity-100';
  const ring = data.highlighted ? 'ring-2 ring-blue-400' : '';

  const handlePos = data.lanePosition === 'top' ? Position.Bottom : Position.Top;

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm transition-all duration-200 ${opacity} ${ring}`}
      style={{
        width: SYSTEM_W,
        height: SYSTEM_H,
        borderLeft: `3px solid ${data.accentColor}`,
      }}
    >
      <Handle type="source" position={handlePos} className="!bg-gray-300 !w-2 !h-2" />

      {/* Row 1: abbreviation + name + status */}
      <div className="flex items-center gap-2 mb-1">
        <div
          className="flex items-center justify-center rounded-full text-white text-[10px] font-bold shrink-0"
          style={{ width: 26, height: 26, backgroundColor: data.accentColor }}
        >
          {abbreviate(data.platform)}
        </div>
        <span className="text-xs font-semibold text-gray-900 truncate flex-1">
          {data.label}
        </span>
        <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} title={statusLabel} />
      </div>

      {/* Row 2: platform */}
      <div className="text-[11px] text-gray-500 truncate mb-0.5 pl-[34px]">
        {data.platform}
      </div>

      {/* Row 3: stats */}
      <div className="text-[10px] text-gray-400 pl-[34px]">
        {formatNumber(data.fieldCount)} fields &middot; {data.locationCount} loc
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom node: HubNode
// ---------------------------------------------------------------------------
interface HubNodeData {
  totalSystems: number;
  totalFields: number;
  dimmed: boolean;
}

function HubNode({ data }: NodeProps<HubNodeData>) {
  const opacity = data.dimmed ? 'opacity-30' : 'opacity-100';

  return (
    <div
      className={`bg-blue-600 rounded-xl shadow-lg px-4 py-2 text-white text-center transition-all duration-200 ${opacity}`}
      style={{ width: HUB_W, height: HUB_H }}
    >
      <Handle type="target" position={Position.Top} className="!bg-blue-300 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-blue-300 !w-2 !h-2" />

      <div className="font-bold text-sm mb-1">Data Foundry</div>
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {['Clinical', 'Financial', 'Operational'].map((c) => (
          <span
            key={c}
            className="text-[9px] bg-blue-500/50 px-1.5 py-0.5 rounded-full"
          >
            {c}
          </span>
        ))}
      </div>
      <div className="text-[10px] text-blue-200">
        {data.totalSystems} systems &middot; {formatNumber(data.totalFields)} fields
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom node: LaneLabelNode
// ---------------------------------------------------------------------------
interface LaneLabelData {
  label: string;
  color: string;
}

function LaneLabelNode({ data }: NodeProps<LaneLabelData>) {
  return (
    <div
      className="text-[11px] font-bold uppercase tracking-wider"
      style={{ color: data.color }}
    >
      {data.label}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Node types registry
// ---------------------------------------------------------------------------
const nodeTypes = {
  systemCard: SystemCardNode,
  hub: HubNode,
  laneLabel: LaneLabelNode,
};

// ---------------------------------------------------------------------------
// Layout: compute positions for hub-and-spoke lane layout
// ---------------------------------------------------------------------------
function buildLayout(
  systems: SourceSystem[],
  hoveredId: string | null,
): { nodes: Node[]; edges: Edge[] } {

  // Group systems by category
  const byCategory: Record<SystemCategory, SourceSystem[]> = {
    ehr: [],
    rehab: [],
    ancillary: [],
  };
  for (const sys of systems) {
    byCategory[sys.systemCategory].push(sys);
  }

  // Determine which systems share category with hovered node
  const hoveredSystem = hoveredId ? systems.find((s) => s.id === hoveredId) : null;
  const hoveredCategory = hoveredSystem?.systemCategory ?? null;

  const nodes: Node[] = [];
  const HUB_X = 0;
  const HUB_Y = 0;
  const LANE_GAP = 140; // vertical gap between hub and first row of systems
  const ROW_GAP = 110; // vertical gap between rows within a lane
  const COL_GAP = 230; // horizontal gap between system cards
  const MAX_PER_ROW = 6;

  // Hub node
  nodes.push({
    id: 'hub',
    type: 'hub',
    position: { x: HUB_X - HUB_W / 2, y: HUB_Y - HUB_H / 2 },
    data: {
      totalSystems: systems.length,
      totalFields: systems.reduce((sum, s) => sum + s.fieldCount, 0),
      dimmed: hoveredId !== null && hoveredId !== 'hub',
    },
    draggable: false,
    selectable: false,
    connectable: false,
  });

  // Place systems in lanes
  function placeSystemsInLane(
    laneSystems: SourceSystem[],
    category: SystemCategory,
    startY: number,
    direction: 'up' | 'down',
  ) {
    if (laneSystems.length === 0) return;

    const rows: SourceSystem[][] = [];
    for (let i = 0; i < laneSystems.length; i += MAX_PER_ROW) {
      rows.push(laneSystems.slice(i, i + MAX_PER_ROW));
    }

    rows.forEach((row, rowIdx) => {
      const totalWidth = (row.length - 1) * COL_GAP;
      const offsetX = -totalWidth / 2;
      const rowY =
        direction === 'up'
          ? startY - rowIdx * ROW_GAP
          : startY + rowIdx * ROW_GAP;

      row.forEach((sys, colIdx) => {
        const isDimmed =
          hoveredId !== null &&
          hoveredId !== sys.id &&
          hoveredCategory !== sys.systemCategory;
        const isHighlighted = hoveredId === sys.id;

        nodes.push({
          id: sys.id,
          type: 'systemCard',
          position: {
            x: offsetX + colIdx * COL_GAP - SYSTEM_W / 2,
            y: rowY - SYSTEM_H / 2,
          },
          data: {
            label: sys.name,
            platform: sys.platform,
            accentColor: sys.accentColor,
            status: sys.status,
            fieldCount: sys.fieldCount,
            locationCount: sys.locationCount,
            category: sys.systemCategory,
            dimmed: isDimmed,
            highlighted: isHighlighted,
            lanePosition: direction === 'up' ? 'top' : 'bottom',
          } satisfies SystemNodeData,
          draggable: false,
          connectable: false,
        });
      });

      // Lane label on the first row only
      if (rowIdx === 0) {
        const labelY =
          direction === 'up' ? rowY - SYSTEM_H / 2 - 28 : rowY + SYSTEM_H / 2 + 10;
        nodes.push({
          id: `label-${category}`,
          type: 'laneLabel',
          position: { x: offsetX - SYSTEM_W / 2, y: labelY },
          data: {
            label: LANE_LABELS[category],
            color: LANE_COLORS[category],
          } satisfies LaneLabelData,
          draggable: false,
          selectable: false,
          connectable: false,
        });
      }
    });
  }

  // Top lanes (above hub)
  let topOffset = -LANE_GAP;
  for (const cat of TOP_LANES) {
    const laneSys = byCategory[cat];
    const rowCount = Math.ceil(laneSys.length / MAX_PER_ROW);
    placeSystemsInLane(laneSys, cat, topOffset, 'up');
    topOffset -= rowCount * ROW_GAP + 40;
  }

  // Bottom lanes (below hub)
  let bottomOffset = LANE_GAP;
  for (const cat of BOTTOM_LANES) {
    const laneSys = byCategory[cat];
    placeSystemsInLane(laneSys, cat, bottomOffset, 'down');
    const rowCount = Math.ceil(laneSys.length / MAX_PER_ROW);
    bottomOffset += rowCount * ROW_GAP + 40;
  }

  // Edges — from each system to hub
  const edges: Edge[] = systems.map((sys) => {
    const laneColor = LANE_COLORS[sys.systemCategory];
    const edgeDimmed =
      hoveredId !== null &&
      hoveredId !== sys.id &&
      hoveredCategory !== sys.systemCategory;

    return {
      id: `e-${sys.id}-hub`,
      source: sys.id,
      target: 'hub',
      type: 'smoothstep',
      animated: !edgeDimmed,
      style: {
        stroke: edgeDimmed ? '#D1D5DB' : laneColor,
        strokeWidth: 1.5,
        opacity: edgeDimmed ? 0.2 : 1,
        transition: 'opacity 200ms, stroke 200ms',
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: edgeDimmed ? '#D1D5DB' : laneColor,
        width: 14,
        height: 14,
      },
    };
  });

  return { nodes, edges };
}

// ---------------------------------------------------------------------------
// TopologyGraph component
// ---------------------------------------------------------------------------
interface TopologyGraphProps {
  systems: SourceSystem[];
  onNodeClick?: (nodeId: string) => void;
}

export function TopologyGraph({ systems, onNodeClick }: TopologyGraphProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { nodes, edges } = useMemo(
    () => buildLayout(systems, hoveredId),
    [systems, hoveredId],
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === 'systemCard') {
        onNodeClick?.(node.id);
      }
    },
    [onNodeClick],
  );

  const handleNodeMouseEnter = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === 'systemCard') {
        setHoveredId(node.id);
      }
    },
    [],
  );

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        minZoom={0.3}
        maxZoom={1.2}
      >
        <Background gap={20} size={1} color="#F1F5F9" />
      </ReactFlow>
    </div>
  );
}
