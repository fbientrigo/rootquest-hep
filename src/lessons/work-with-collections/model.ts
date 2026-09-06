export type CollectionEvent = { label: string; photonPt: readonly number[] };

export const D3_EVENTS: readonly CollectionEvent[] = [
  { label: 'A', photonPt: [52, 34, 22] },
  { label: 'B', photonPt: [41, 27] },
  { label: 'C', photonPt: [65, 44, 31, 18] },
] as const;

export type CollectionSummary = {
  source: readonly number[];
  mask: readonly boolean[];
  selected: readonly number[];
  count: number;
  sumPt: number;
};

export function summarizeCollection(photonPt: readonly number[], ptMin: number): CollectionSummary {
  const mask = photonPt.map((pt) => pt > ptMin);
  const selected = photonPt.filter((_, index) => mask[index]);
  return {
    source: photonPt,
    mask,
    selected,
    count: selected.length,
    sumPt: selected.reduce((sum, pt) => sum + pt, 0),
  };
}

export function evaluatePrediction(value: string) {
  return value === 'two-values-109';
}

export function evaluateTransfer(value: string) {
  return value === 'sum-selected';
}
