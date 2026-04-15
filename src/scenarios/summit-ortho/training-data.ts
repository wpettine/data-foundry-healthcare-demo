import type { TrainingRecord } from '../../types/model';
import type { ModelFeature } from '../../types/model';
import { mulberry32 } from '../../utils/prng';
import { MODEL_FEATURES } from './model-features';

/** Hash a string to a 32-bit integer for seeding the PRNG. */
function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

/**
 * Generate filler training rows for the model builder dataset view.
 *
 * Each row has a patient, a site, feature values drawn from clinically
 * plausible ranges, a complication outcome, and a completeness percentage.
 */
export function generateFillerTrainingRows(
  count: number,
  seedContext: string,
  features: ModelFeature[],
  outcomeDistribution: { complication: number; noComplication: number },
): TrainingRecord[] {
  const seed = hashString(seedContext);
  const rand = mulberry32(seed);

  const complicationRate =
    outcomeDistribution.complication /
    (outcomeDistribution.complication + outcomeDistribution.noComplication);

  const anesthesiaTypes = ['general', 'spinal', 'epidural', 'regional-block'];
  const implantManufacturers = ['Stryker', 'Zimmer Biomet', 'Smith & Nephew', 'DePuy Synthes', 'Exactech'];
  const smokingValues = [0, 0, 0, 1, 1, 2]; // weighted toward never/former

  const records: TrainingRecord[] = [];

  for (let i = 0; i < count; i++) {
    const patientNum = String(i + 1).padStart(4, '0');
    const siteNum = String(Math.floor(rand() * 20) + 1).padStart(2, '0');

    const isComplication = rand() < complicationRate;

    const featureValues: Record<string, number | string | null> = {};

    for (const feature of features) {
      // Randomly null-out some features to simulate incomplete data
      if (rand() < 0.04) {
        featureValues[feature.id] = null;
        continue;
      }

      switch (feature.id) {
        case 'patient_age':
          featureValues[feature.id] = Math.floor(rand() * 30) + 50; // 50-79
          break;
        case 'bmi':
          featureValues[feature.id] = Math.round((rand() * 20 + 20) * 10) / 10; // 20.0-40.0
          break;
        case 'hba1c':
          featureValues[feature.id] = Math.round((rand() * 4.5 + 4.5) * 10) / 10; // 4.5-9.0%
          break;
        case 'pre_op_lefs':
          featureValues[feature.id] = Math.floor(rand() * 50) + 15; // 15-64 out of 80
          break;
        case 'smoking_history':
          featureValues[feature.id] = smokingValues[Math.floor(rand() * smokingValues.length)];
          break;
        case 'surgical_duration_min':
          featureValues[feature.id] = Math.floor(rand() * 90) + 55; // 55-144 min
          break;
        case 'anesthesia_type':
          featureValues[feature.id] = anesthesiaTypes[Math.floor(rand() * anesthesiaTypes.length)];
          break;
        case 'implant_manufacturer':
          featureValues[feature.id] = implantManufacturers[Math.floor(rand() * implantManufacturers.length)];
          break;
        case 'tourniquet_time_min':
          featureValues[feature.id] = Math.floor(rand() * 50) + 30; // 30-79 min
          break;
        case 'temp_day3_deviation':
          // Deviation from 37°C, slight skew toward positive for complications
          featureValues[feature.id] =
            Math.round((rand() * 2.0 - 0.5 + (isComplication ? 0.4 : 0)) * 100) / 100;
          break;
        case 'hr_baseline_shift_day5':
          // % change from baseline, higher for complications
          featureValues[feature.id] =
            Math.round((rand() * 30 - 5 + (isComplication ? 8 : 0)) * 10) / 10;
          break;
        default:
          featureValues[feature.id] = Math.round(rand() * 100) / 100;
      }
    }

    // Completeness: 85-100%, biased toward higher values
    const completeness = Math.floor(rand() * 8 + 85 + rand() * 8);
    const clampedCompleteness = Math.min(completeness, 100);

    records.push({
      id: `tr-${patientNum}`,
      patientId: `P-${patientNum}`,
      siteId: `site-${siteNum}`,
      features: featureValues,
      outcome: isComplication ? 'complication' : 'no-complication',
      completeness: clampedCompleteness,
    });
  }

  return records;
}

export const TRAINING_DATA: TrainingRecord[] = generateFillerTrainingRows(
  3200,
  'summit-ortho-tka-v1',
  MODEL_FEATURES,
  { complication: 12, noComplication: 88 },
);
