import { useMemo } from 'react';
import _createPlotlyComponent from 'react-plotly.js/factory';
import _Plotly from 'plotly.js-dist-min';
import type { BiometricChannel } from '../../types/clinical';
import type { ClinicalEvent } from '../../types/clinical';

// CJS interop: Vite may deliver { default: fn } or fn directly
const createPlotlyComponent = typeof _createPlotlyComponent === 'function'
  ? _createPlotlyComponent
  : (_createPlotlyComponent as unknown as { default: typeof _createPlotlyComponent }).default;
const Plotly = typeof _Plotly === 'object' && 'newPlot' in (_Plotly as Record<string, unknown>)
  ? _Plotly
  : (_Plotly as unknown as { default: typeof _Plotly }).default;

const Plot = createPlotlyComponent(Plotly);

interface TimeSeriesChartProps {
  channel: BiometricChannel;
  events?: ClinicalEvent[];
  onEventClick?: (id: string) => void;
}

export function TimeSeriesChart({ channel, events, onEventClick }: TimeSeriesChartProps) {
  const { traces, layout } = useMemo(() => {
    const actualX = channel.actual.map((p) => p.timestamp);
    const actualY = channel.actual.map((p) => p.value);
    const expectedX = channel.expected.map((p) => p.timestamp);
    const expectedY = channel.expected.map((p) => p.value);

    const upperX = channel.confidenceBand.upper.map((p) => p.timestamp);
    const upperY = channel.confidenceBand.upper.map((p) => p.value);
    const lowerX = channel.confidenceBand.lower.map((p) => p.timestamp);
    const lowerY = channel.confidenceBand.lower.map((p) => p.value);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plotTraces: any[] = [
      {
        x: upperX, y: upperY,
        type: 'scatter', mode: 'lines',
        line: { width: 0 }, showlegend: false, hoverinfo: 'skip',
      },
      {
        x: lowerX, y: lowerY,
        type: 'scatter', mode: 'lines',
        line: { width: 0 }, fill: 'tonexty',
        fillcolor: `${channel.color}15`,
        showlegend: false, hoverinfo: 'skip',
      },
      {
        x: expectedX, y: expectedY,
        type: 'scatter', mode: 'lines',
        name: 'Expected',
        line: { color: channel.color, width: 1.5, dash: 'dash' },
      },
      {
        x: actualX, y: actualY,
        type: 'scatter', mode: 'lines',
        name: 'Actual',
        line: { color: channel.color, width: 2 },
      },
    ];

    if (events && events.length > 0) {
      const eventX = events.map((e) => {
        if (e.day < actualX.length) return actualX[e.day];
        return actualX[actualX.length - 1];
      });
      const minY = actualY.reduce((a, b) => Math.min(a ?? Infinity, b ?? Infinity), Infinity);
      const eventY = events.map(() => minY);

      plotTraces.push({
        x: eventX, y: eventY,
        type: 'scatter', mode: 'markers',
        name: 'Events',
        marker: { symbol: 'triangle-up', size: 10, color: '#6B7280' },
        text: events.map((e) => e.title),
        hoverinfo: 'text',
        customdata: events.map((e) => e.id),
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plotShapes: any[] = channel.changePoints.map((cp) => ({
      type: 'line',
      xref: 'x', yref: 'paper',
      x0: cp.day < actualX.length ? actualX[cp.day] : actualX[0],
      x1: cp.day < actualX.length ? actualX[cp.day] : actualX[0],
      y0: 0, y1: 1,
      line: { color: '#DC2626', width: 1.5, dash: 'dot' },
    }));

    channel.anomalyRegions.forEach((region) => {
      plotShapes.push({
        type: 'rect',
        xref: 'x', yref: 'paper',
        x0: region.startDay < actualX.length ? actualX[region.startDay] : actualX[0],
        x1: region.endDay < actualX.length ? actualX[region.endDay] : actualX[actualX.length - 1],
        y0: 0, y1: 1,
        fillcolor: '#E91E6320',
        line: { width: 0 },
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plotAnnotations: any[] = channel.changePoints.map((cp) => ({
      x: cp.day < actualX.length ? actualX[cp.day] : actualX[0],
      y: 1,
      xref: 'x', yref: 'paper',
      text: `CP (p=${cp.posteriorProbability.toFixed(2)})`,
      showarrow: false,
      font: { size: 10, color: '#DC2626', family: 'JetBrains Mono' },
      yanchor: 'bottom',
    }));

    const plotLayout = {
      title: {
        text: `${channel.label} (${channel.unit})`,
        font: { size: 14, family: 'Inter', color: '#111827' },
      },
      margin: { t: 40, r: 16, b: 40, l: 48 },
      xaxis: {
        showgrid: true, gridcolor: '#F3F4F6',
        tickfont: { size: 10, family: 'JetBrains Mono', color: '#6B7280' },
      },
      yaxis: {
        title: { text: channel.unit, font: { size: 11, family: 'Inter', color: '#6B7280' } },
        showgrid: true, gridcolor: '#F3F4F6',
        tickfont: { size: 10, family: 'JetBrains Mono', color: '#6B7280' },
      },
      legend: {
        orientation: 'h' as const,
        yanchor: 'bottom' as const,
        y: -0.2,
        font: { size: 11, family: 'Inter' },
      },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'white',
      shapes: plotShapes,
      annotations: plotAnnotations,
    };

    return { traces: plotTraces, layout: plotLayout };
  }, [channel, events]);

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-2">
      <Plot
        data={traces}
        layout={layout}
        config={{ displayModeBar: false, responsive: true }}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
        onClick={(data: { points: Array<{ customdata?: unknown }> }) => {
          if (onEventClick && data.points[0]?.customdata) {
            onEventClick(data.points[0].customdata as string);
          }
        }}
      />
    </div>
  );
}
