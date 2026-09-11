export type WeightedEvent = { id: string; mass: number; weight: number };
export type HistogramMode = 'entries' | 'weighted';
export type BinSummary = { label: string; entries: number; weighted: number };

export const WEIGHTED_EVENTS: readonly WeightedEvent[] = [
  { id: 'M1', mass: 112, weight: 0.5 },
  { id: 'M2', mass: 118, weight: 1.5 },
  { id: 'M3', mass: 124, weight: 2.0 },
  { id: 'M4', mass: 128, weight: 0.5 },
  { id: 'M5', mass: 136, weight: 1.0 },
  { id: 'M6', mass: 145, weight: 2.5 },
];

const BINS = [
  { low: 100, high: 120, label: '100–120 GeV' },
  { low: 120, high: 140, label: '120–140 GeV' },
  { low: 140, high: 160, label: '140–160 GeV' },
] as const;

export function totalWeight(events: readonly WeightedEvent[] = WEIGHTED_EVENTS): number {
  return events.reduce((sum, event) => sum + event.weight, 0);
}

export function deriveBins(events: readonly WeightedEvent[] = WEIGHTED_EVENTS): BinSummary[] {
  return BINS.map((bin) => {
    const inside = events.filter((event) => event.mass >= bin.low && event.mass < bin.high);
    return {
      label: bin.label,
      entries: inside.length,
      weighted: inside.reduce((sum, event) => sum + event.weight, 0),
    };
  });
}

export function displayedBinValues(mode: HistogramMode): number[] {
  return deriveBins().map((bin) => mode === 'weighted' ? bin.weighted : bin.entries);
}

export function evaluatePrediction(value: string): boolean {
  return value === 'third-grows-most';
}

export function evaluateTransfer(value: string): boolean {
  return value === 'two-point-zero';
}
