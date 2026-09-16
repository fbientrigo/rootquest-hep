export type AnalysisPlanChoice = 'question-first' | 'plot-first' | 'all-columns';
export type TransferChoice = 'define-filter-histogram' | 'filter-histogram-define' | 'histogram-only';

export function evaluatePlan(choice: string): boolean {
  return choice === 'question-first';
}

export function evaluateTransfer(choice: string): boolean {
  return choice === 'define-filter-histogram';
}

export const F1_PLAN = {
  question: 'What is the diphoton invariant-mass distribution for events with at least two photons above 30 GeV?',
  input: 'Events tree in photons.root',
  columns: ['Photon_pt', 'Photon_eta', 'Photon_phi'],
  derived: ['selected photon collection', 'm_gg'],
  selection: 'at least two selected photons',
  output: 'Histo1D(m_gg)',
} as const;
