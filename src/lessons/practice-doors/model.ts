export type PracticeMode = 'manipulate' | 'observe' | 'predict' | 'code';

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

const selectionEvents = [
  { kind: 'signal', pt: 28 },
  { kind: 'signal', pt: 35 },
  { kind: 'signal', pt: 42 },
  { kind: 'signal', pt: 55 },
  { kind: 'signal', pt: 62 },
  { kind: 'background', pt: 22 },
  { kind: 'background', pt: 26 },
  { kind: 'background', pt: 31 },
  { kind: 'background', pt: 37 },
  { kind: 'background', pt: 45 },
  { kind: 'background', pt: 58 },
  { kind: 'background', pt: 64 },
] as const;

export const selectionGoals: readonly SelectionGoal[] = [
  { minSignal: 4, maxBackground: 5 },
  { minSignal: 3, maxBackground: 3 },
  { minSignal: 2, maxBackground: 2 },
];

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
