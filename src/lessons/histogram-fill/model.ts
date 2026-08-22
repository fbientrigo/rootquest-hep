import {
  HISTOGRAM_RANGE,
  deriveHistogram,
} from '../histogram-binning/model.ts';

export const FILL_VALUES = [0.8, 1.4, 2.2, 2.9, 4.1, 4.8, 5.7, 7.3] as const;
export const FILL_BIN_COUNT = 4;

export interface FillLessonState {
  filledCount: number;
}

export const createFillLessonState = (): FillLessonState => ({ filledCount: 0 });

export function deriveFillState(filledCount: number) {
  const safeCount = Math.max(0, Math.min(FILL_VALUES.length, Math.trunc(filledCount)));
  const filledValues = FILL_VALUES.slice(0, safeCount);
  const nextValue = FILL_VALUES[safeCount] ?? null;
  const histogram = deriveHistogram(
    { binCount: FILL_BIN_COUNT },
    filledValues,
    HISTOGRAM_RANGE,
  );

  return {
    ...histogram,
    filledCount: safeCount,
    filledValues,
    nextValue,
    complete: safeCount === FILL_VALUES.length,
  };
}

export function findDisplayBin(value: number) {
  if (value < HISTOGRAM_RANGE[0]) return 'underflow';
  if (value >= HISTOGRAM_RANGE[1]) return 'overflow';

  const width = (HISTOGRAM_RANGE[1] - HISTOGRAM_RANGE[0]) / FILL_BIN_COUNT;
  const index = Math.floor((value - HISTOGRAM_RANGE[0]) / width);
  const start = HISTOGRAM_RANGE[0] + index * width;
  const end = start + width;
  return `[${start.toFixed(0)}, ${end.toFixed(0)})`;
}

export function evaluateFillPrediction(answer: string) {
  const correct = answer === '4-6';
  return {
    correct,
    message: correct
      ? 'Correct. 4.8 lies inside [4, 6), so Fill(4.8) increments that bin by one.'
      : 'Use the x value to locate its interval. With four equal bins over [0, 8), 4.8 belongs to [4, 6).',
  };
}

export function evaluateFillTransfer(answer: string) {
  const correct = answer === 'increment-bin';
  return {
    correct,
    message: correct
      ? 'Exactly. Fill(5.7) finds the bin containing 5.7 and increments that bin by one for an unweighted fill.'
      : 'Fill does not set a bar height to x and it does not add a new bin. It finds the bin containing x and increments its content.',
  };
}
