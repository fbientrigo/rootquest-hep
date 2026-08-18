export type PracticeMode = 'manipulate' | 'observe' | 'predict' | 'code';
export type SelectionKind = 'signal' | 'background';

export interface SelectionGoal {
  minSignal: number;
  maxBackground: number;
}

export interface SelectionSnapshot {
  signalKept: number;
  backgroundKept: number;
  signalTotal: number;
  backgroundTotal: number;
}

export interface SelectionEvent {
  id: string;
  kind: SelectionKind;
  pt: number;
  eta: number;
  x: number;
  y: number;
  z: number;
}

export interface SelectionHistogramBin {
  min: number;
  max: number;
  signal: number;
  background: number;
}

export const selectionEvents: readonly SelectionEvent[] = [
  { id: 'S1', kind: 'signal', pt: 28, eta: 0.8, x: 18, y: 68, z: -42 },
  { id: 'S2', kind: 'signal', pt: 35, eta: 0.4, x: 34, y: 27, z: 28 },
  { id: 'S3', kind: 'signal', pt: 42, eta: 1.0, x: 48, y: 58, z: 66 },
  { id: 'S4', kind: 'signal', pt: 55, eta: 0.3, x: 68, y: 30, z: -18 },
  { id: 'S5', kind: 'signal', pt: 62, eta: 0.6, x: 82, y: 64, z: 40 },
  { id: 'B1', kind: 'background', pt: 22, eta: 1.4, x: 15, y: 35, z: 54 },
  { id: 'B2', kind: 'background', pt: 26, eta: 0.9, x: 27, y: 76, z: 18 },
  { id: 'B3', kind: 'background', pt: 31, eta: 1.6, x: 39, y: 44, z: -55 },
  { id: 'B4', kind: 'background', pt: 37, eta: 0.5, x: 53, y: 77, z: 5 },
  { id: 'B5', kind: 'background', pt: 45, eta: 1.2, x: 61, y: 50, z: 54 },
  { id: 'B6', kind: 'background', pt: 58, eta: 0.7, x: 75, y: 78, z: -38 },
  { id: 'B7', kind: 'background', pt: 64, eta: 0.2, x: 86, y: 40, z: 8 },
];

export const selectionGoals: readonly SelectionGoal[] = [
  { minSignal: 4, maxBackground: 5 },
  { minSignal: 3, maxBackground: 3 },
  { minSignal: 2, maxBackground: 2 },
];

export function selectionEventEnergy(event: Pick<SelectionEvent, 'pt' | 'eta'>): number {
  return Math.round(event.pt * Math.cosh(event.eta));
}

export function buildSelectionHistogram(): SelectionHistogramBin[] {
  const bins: SelectionHistogramBin[] = [];

  for (let min = 20; min < 70; min += 5) {
    const max = min + 5;
    const inBin = selectionEvents.filter((event) => event.pt >= min && event.pt < max);
    bins.push({
      min,
      max,
      signal: inBin.filter((event) => event.kind === 'signal').length,
      background: inBin.filter((event) => event.kind === 'background').length,
    });
  }

  return bins;
}

export function deriveSelection(threshold: number): SelectionSnapshot {
  const signal = selectionEvents.filter((event) => event.kind === 'signal');
  const background = selectionEvents.filter((event) => event.kind === 'background');

  return {
    signalKept: signal.filter((event) => event.pt >= threshold).length,
    backgroundKept: background.filter((event) => event.pt >= threshold).length,
    signalTotal: signal.length,
    backgroundTotal: background.length,
  };
}

export function meetsSelectionGoal(stage: number, snapshot: SelectionSnapshot): boolean {
  const goal = selectionGoals[stage - 1];
  if (!goal) return false;

  return snapshot.signalKept >= goal.minSignal && snapshot.backgroundKept <= goal.maxBackground;
}

const answers: Record<Exclude<PracticeMode, 'manipulate'>, readonly string[]> = {
  observe: ['c', 'b', 'a'],
  predict: ['fewer', 'decrease', 'grouping'],
  code: ['filter', 'define', 'histo1d'],
};

export function evaluatePracticeAnswer(mode: PracticeMode, stage: number, answer: string): boolean {
  if (mode === 'manipulate') return false;
  return answers[mode][stage - 1] === answer;
}
