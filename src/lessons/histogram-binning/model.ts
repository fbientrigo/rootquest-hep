export const HISTOGRAM_VALUES = [
  0.4, 0.8, 1.1, 1.4, 1.8, 2.0, 2.2, 2.5, 2.9, 3.1,
  3.4, 3.8, 4.1, 4.4, 4.8, 5.2, 5.7, 6.1, 6.6, 7.3,
] as const;

export const HISTOGRAM_RANGE = [0, 8] as const;

export interface HistogramState {
  binCount: number;
  threshold: number;
  prediction: string | null;
  predictionAtBins: number | null;
  predictionRevealed: boolean;
}

export interface HistogramBin {
  start: number;
  end: number;
  count: number;
}

export const createHistogramState = (): HistogramState => ({
  binCount: 5,
  threshold: 0,
  prediction: null,
  predictionAtBins: null,
  predictionRevealed: false,
});

export function deriveHistogram(
  state: Pick<HistogramState, 'binCount'> & Partial<Pick<HistogramState, 'threshold'>>,
  values: readonly number[] = HISTOGRAM_VALUES,
  range: readonly [number, number] = HISTOGRAM_RANGE,
) {
  const threshold = state.threshold ?? Number.NEGATIVE_INFINITY;
  const selectedValues = values.filter((value) => value >= threshold);
  const width = (range[1] - range[0]) / state.binCount;
  const bins: HistogramBin[] = Array.from(
    { length: state.binCount },
    (_, index) => ({
      start: range[0] + index * width,
      end: range[0] + (index + 1) * width,
      count: 0,
    }),
  );
  let underflow = 0;
  let overflow = 0;

  for (const value of selectedValues) {
    if (value < range[0]) {
      underflow += 1;
      continue;
    }
    if (value >= range[1]) {
      overflow += 1;
      continue;
    }
    const index = Math.floor((value - range[0]) / width);
    bins[index].count += 1;
  }

  return {
    bins,
    sourceCount: values.length,
    selectedCount: selectedValues.length,
    totalCount: values.length,
    inRangeCount: bins.reduce((sum, bin) => sum + bin.count, 0),
    underflow,
    overflow,
    binWidth: width,
    maxCount: Math.max(1, ...bins.map((bin) => bin.count)),
  };
}

export function evaluateBinPrediction(prediction: string) {
  const correct = prediction === 'narrower';
  return {
    correct,
    message: correct
      ? 'More bins divide the same fixed range into narrower intervals. The measurements did not multiply; only their grouping changed.'
      : 'The measurements and range stayed fixed. Increasing the bin count makes each interval narrower, so the same measurements are redistributed among more bins.',
  };
}

export function evaluateTransferAnswer(answer: string) {
  const correct = answer === 'same-values';
  return {
    correct,
    message: correct
      ? 'Exactly. Rebinning changes the representation, not the source measurements. With the same range, the same measurements still enter the histogram.'
      : 'Changing only the number of bins does not create or remove source measurements. It changes how the fixed range is partitioned.',
  };
}
