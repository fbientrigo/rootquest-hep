import { HISTOGRAM_RANGE, deriveHistogram } from '../histogram-binning/model.ts';

export const COMPARE_BIN_COUNT = 4;
export const SAMPLE_A = [0.8, 1.2, 2.1, 2.7, 3.4, 3.8, 4.2, 4.7, 5.1, 5.6, 6.4, 7.2] as const;
export const SAMPLE_B = SAMPLE_A.flatMap((value) => [value, value]);

export type ComparisonMode = 'counts' | 'shape';

export interface ComparisonLessonState {
  mode: ComparisonMode;
}

export const createComparisonLessonState = (): ComparisonLessonState => ({ mode: 'counts' });

function mean(values: readonly number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function stdDev(values: readonly number[]) {
  const average = mean(values);
  const variance = values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function normalizeBinCounts(counts: readonly number[]) {
  const integral = counts.reduce((sum, count) => sum + count, 0);
  if (integral === 0) return counts.map(() => 0);
  return counts.map((count) => count / integral);
}

export function deriveComparison(mode: ComparisonMode) {
  const histogramA = deriveHistogram({ binCount: COMPARE_BIN_COUNT }, SAMPLE_A, HISTOGRAM_RANGE);
  const histogramB = deriveHistogram({ binCount: COMPARE_BIN_COUNT }, SAMPLE_B, HISTOGRAM_RANGE);
  const countsA = histogramA.bins.map((bin) => bin.count);
  const countsB = histogramB.bins.map((bin) => bin.count);
  const displayA = mode === 'shape' ? normalizeBinCounts(countsA) : countsA;
  const displayB = mode === 'shape' ? normalizeBinCounts(countsB) : countsB;

  return {
    mode,
    bins: histogramA.bins.map((bin, index) => ({
      start: bin.start,
      end: bin.end,
      a: displayA[index],
      b: displayB[index],
      rawA: countsA[index],
      rawB: countsB[index],
    })),
    integralA: histogramA.inRangeCount,
    integralB: histogramB.inRangeCount,
    meanA: mean(SAMPLE_A),
    meanB: mean(SAMPLE_B),
    stdDevA: stdDev(SAMPLE_A),
    stdDevB: stdDev(SAMPLE_B),
    maxDisplay: Math.max(1e-9, ...displayA, ...displayB),
  };
}

export function evaluateNormalizationPrediction(answer: string) {
  const correct = answer === 'totals-disappear';
  return {
    correct,
    message: correct
      ? 'Correct. Scaling each histogram to unit area preserves this shape comparison but removes the fact that sample B contains twice as many entries.'
      : 'Normalization does not add information. Unit-area scaling deliberately removes the overall-yield difference so the relative bin pattern can be compared.',
  };
}

export function evaluateNormalizationTransfer(answer: string) {
  const correct = answer === 'keep-counts';
  return {
    correct,
    message: correct
      ? 'Correct. If the question is which sample contains more events, keep the yield information. Unit-area normalization would erase the quantity you are trying to compare.'
      : 'First identify the question. A shape comparison may justify unit-area normalization; a yield comparison requires preserving the event totals.',
  };
}
