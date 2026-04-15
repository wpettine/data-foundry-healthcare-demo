import type { BiometricStreamSet, BiometricChannel, TimeSeriesPoint, ChangePoint } from '../../types/clinical';

// --- Helpers ---

function ts(day: number): string {
  return `Day ${day}`;
}

/** Linear interpolation between two values over a day range (inclusive). */
function lerp(startDay: number, endDay: number, startVal: number, endVal: number): Array<{ day: number; value: number }> {
  const points: Array<{ day: number; value: number }> = [];
  const span = endDay - startDay;
  for (let d = startDay; d <= endDay; d++) {
    const t = span === 0 ? 1 : (d - startDay) / span;
    points.push({ day: d, value: +(startVal + t * (endVal - startVal)).toFixed(2) });
  }
  return points;
}

function toTimeSeries(dayValues: Array<{ day: number; value: number }>): TimeSeriesPoint[] {
  return dayValues.map(({ day, value }) => ({ timestamp: ts(day), value }));
}

function bandFromExpected(expected: TimeSeriesPoint[], delta: number): { upper: TimeSeriesPoint[]; lower: TimeSeriesPoint[] } {
  return {
    upper: expected.map((p) => ({ timestamp: p.timestamp, value: p.value !== null ? +(p.value + delta).toFixed(2) : null })),
    lower: expected.map((p) => ({ timestamp: p.timestamp, value: p.value !== null ? +(p.value - delta).toFixed(2) : null })),
  };
}

// --- Temperature Channel ---

const tempActualRaw = [
  ...lerp(0, 3, 37.5, 37.0),             // Post-op elevated
  ...lerp(3, 10, 37.0, 36.6).slice(1),   // Normal recovery
  ...lerp(10, 20, 36.6, 37.2).slice(1),  // Gradual rise
  ...lerp(20, 29, 37.2, 37.4).slice(1),  // Continued rise
];

const tempExpectedRaw = [
  ...lerp(0, 10, 37.4, 36.6),            // Post-op to baseline
  ...lerp(10, 29, 36.6, 36.8).slice(1),  // Flat baseline
];

const tempChangePoints: ChangePoint[] = [
  {
    day: 11,
    posteriorProbability: 0.94,
    method: 'Bayesian online CPD',
    expectedValue: 36.8,
    observedValue: 37.2,
    unit: '\u00B0C',
  },
];

const temperatureChannel: BiometricChannel = {
  label: 'Temperature',
  unit: '\u00B0C',
  color: '#22C55E',
  actual: toTimeSeries(tempActualRaw),
  expected: toTimeSeries(tempExpectedRaw),
  confidenceBand: bandFromExpected(toTimeSeries(tempExpectedRaw), 0.3),
  changePoints: tempChangePoints,
  anomalyRegions: [{ startDay: 11, endDay: 30 }],
};

// --- Heart Rate Channel ---

const hrActualRaw = [
  ...lerp(0, 5, 88, 82),                // Post-op elevated
  ...lerp(5, 10, 82, 74).slice(1),      // Settling
  ...lerp(10, 20, 76, 80).slice(1),     // Subtle rise
  ...lerp(20, 29, 80, 82).slice(1),     // Continued rise
];

const hrExpectedRaw = [
  ...lerp(0, 8, 88, 72),                // Post-op to baseline
  ...lerp(8, 29, 72, 72).slice(1),      // Flat baseline
];

const hrChangePoints: ChangePoint[] = [
  {
    day: 12,
    posteriorProbability: 0.78,
    method: 'Bayesian online CPD',
    expectedValue: 74,
    observedValue: 82,
    unit: 'bpm',
  },
];

const heartRateChannel: BiometricChannel = {
  label: 'Heart Rate',
  unit: 'bpm',
  color: '#3B82F6',
  actual: toTimeSeries(hrActualRaw),
  expected: toTimeSeries(hrExpectedRaw),
  confidenceBand: bandFromExpected(toTimeSeries(hrExpectedRaw), 6),
  changePoints: hrChangePoints,
  anomalyRegions: [{ startDay: 12, endDay: 30 }],
};

// --- Exported stream set ---

export const BIOMETRIC_STREAMS: BiometricStreamSet = {
  temperature: temperatureChannel,
  heartRate: heartRateChannel,
};
