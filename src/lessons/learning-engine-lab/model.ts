export {
  HISTOGRAM_VALUES,
  createHistogramState,
  deriveHistogram,
  evaluateBinPrediction,
  type HistogramBin,
  type HistogramState,
} from '../histogram-binning/model.ts';

import {
  PIPELINE_EVENTS,
  buildPipelineFrames,
  evaluateFirstFilterPrediction,
  type PipelineEvent,
} from '../data-pipeline/model.ts';

export interface BranchDefinition {
  id: string;
  name: string;
  type: string;
  unit: string;
  values: readonly string[];
  explanation: string;
}

export const BRANCHES: readonly BranchDefinition[] = [
  { id: 'photon-pt', name: 'photon_pt', type: 'vector<float>', unit: 'GeV', values: ['[42.1, 31.8]', '[56.4]', '[45.0, 28.2]'], explanation: 'Each tree entry stores a list because one event can contain more than one reconstructed photon.' },
  { id: 'photon-eta', name: 'photon_eta', type: 'vector<float>', unit: 'dimensionless', values: ['[0.42, -1.18]', '[0.09]', '[-0.33, 1.04]'], explanation: 'This branch keeps the pseudorapidity values aligned with the photons stored in photon_pt.' },
  { id: 'event-weight', name: 'event_weight', type: 'float', unit: 'dimensionless', values: ['1.0', '0.82', '1.14'], explanation: 'There is one scalar weight per tree entry, so each event contributes its own amount to a later distribution.' },
] as const;

export interface TreeState { selectedBranchId: string }
export const createTreeState = (): TreeState => ({ selectedBranchId: BRANCHES[0].id });
export function selectedBranch(state: TreeState) { return BRANCHES.find((branch) => branch.id === state.selectedBranchId) ?? BRANCHES[0]; }

export type TraceEvent = PipelineEvent;
export const TRACE_EVENTS = PIPELINE_EVENTS;
export interface TraceFrame {
  label: string;
  rule: string;
  entered: readonly string[];
  removed: readonly string[];
  remaining: readonly string[];
  distribution?: readonly number[];
}

export function buildTraceFrames(events: readonly TraceEvent[] = TRACE_EVENTS): readonly TraceFrame[] {
  const frames = buildPipelineFrames(events);
  const labels = [
    ['Input events', 'No filter has run yet.'],
    ['Require exactly two photons', 'Keep events where photonCount === 2.'],
    ['Require leading photon pT > 35 GeV', 'Apply the pT requirement to the events that survived step 2.'],
  ] as const;
  const presentation = frames.map((frame, index) => ({ ...frame, label: labels[index][0], rule: labels[index][1] }));
  const final = frames[2];
  return [
    ...presentation,
    {
      label: 'Build the mass distribution',
      rule: 'Fill one mass value for every event that survived both filters.',
      entered: final.remaining,
      removed: [],
      remaining: final.remaining,
      distribution: events.filter((event) => final.remaining.includes(event.id)).map((event) => event.mass),
    },
  ];
}

export function evaluateTracePrediction(prediction: string) {
  const result = evaluateFirstFilterPrediction(prediction);
  return {
    correct: result.correct,
    message: result.correct
      ? 'E1, E3, E4, and E6 each contain exactly two photons. The filter removes E2 and E5 for having one and three photons.'
      : 'The filter checks photon count only: E2 has one photon and E5 has three. E1, E3, E4, and E6 remain.',
  };
}

export interface TraceState { currentStep: number; prediction: string | null; predictionRevealed: boolean }
export const createTraceState = (): TraceState => ({ currentStep: 0, prediction: null, predictionRevealed: false });
