export {
  HISTOGRAM_VALUES,
  createHistogramState,
  deriveHistogram,
  evaluateBinPrediction,
  type HistogramBin,
  type HistogramState,
} from '../histogram-binning/model.ts';

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

export {
  PIPELINE_EVENTS as TRACE_EVENTS,
  buildPipelineFrames as buildTraceFrames,
  evaluateFirstFilterPrediction as evaluateTracePrediction,
  type PipelineEvent as TraceEvent,
  type PipelineFrame as TraceFrame,
} from '../data-pipeline/model.ts';

export interface TraceState { currentStep: number; prediction: string | null; predictionRevealed: boolean }
export const createTraceState = (): TraceState => ({ currentStep: 0, prediction: null, predictionRevealed: false });
