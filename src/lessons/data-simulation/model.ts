export type ComparisonMode = 'yield' | 'shape';

export const DATA_COUNTS = [6, 9, 6] as const;
export const MC_BACKGROUND = [2, 3, 2] as const;
export const MC_SIGNAL = [1, 1.5, 1] as const;
export const BIN_LABELS = ['100–120 GeV', '120–140 GeV', '140–160 GeV'] as const;

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function addHistograms(a: readonly number[], b: readonly number[]): number[] {
  if (a.length !== b.length) throw new Error('Histogram binning must match');
  return a.map((value, index) => value + b[index]);
}

export function normalizeToUnitArea(values: readonly number[]): number[] {
  const integral = sum(values);
  if (integral === 0) return values.map(() => 0);
  return values.map((value) => value / integral);
}

export function divideHistograms(numerator: readonly number[], denominator: readonly number[]): number[] {
  if (numerator.length !== denominator.length) throw new Error('Histogram binning must match');
  return numerator.map((value, index) => denominator[index] === 0 ? Number.NaN : value / denominator[index]);
}

export function deriveDataSimulation(mode: ComparisonMode) {
  const mcTotal = addHistograms(MC_BACKGROUND, MC_SIGNAL);
  const data = mode === 'shape' ? normalizeToUnitArea(DATA_COUNTS) : [...DATA_COUNTS];
  const mc = mode === 'shape' ? normalizeToUnitArea(mcTotal) : mcTotal;
  return {
    mode,
    data,
    mc,
    ratio: divideHistograms(data, mc),
    dataTotal: sum(data),
    mcTotal: sum(mc),
  };
}

export function evaluatePrediction(value: string): boolean {
  return value === 'yield-disappears';
}

export function evaluateTransfer(value: string): boolean {
  return value === 'keep-yield';
}
