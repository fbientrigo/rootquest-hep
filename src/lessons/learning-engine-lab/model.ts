export {
  HISTOGRAM_VALUES,
  createHistogramState,
  deriveHistogram,
  evaluateBinPrediction,
  type HistogramBin,
  type HistogramState,
} from '../histogram-binning/model';

export interface BranchDefinition {
  id: string;
  name: string;
  type: string;
  unit: string;
  values: readonly string[];
  explanation: string;
}

export const BRANCHES: readonly BranchDefinition[] = [
  {
    id: 'photon-pt',
    name: 'photon_pt',
    type: 'vector<float>',
    unit: 'GeV',
    values: ['[42.1, 31.8]', '[56.4]', '[45.0, 28.2]'],
    explanation:
      'Each tree entry stores a list because one event can contain more than one reconstructed photon.',
  },
  {
    id: 'photon-eta',
    name: 'photon_eta',
    type: 'vector<float>',
    unit: 'dimensionless',
    values: ['[0.42, -1.18]', '[0.09]', '[-0.33, 1.04]'],
    explanation:
      'This branch keeps the pseudorapidity values aligned with the photons stored in photon_pt.',
  },
  {
    id: 'event-weight',
    name: 'event_weight',
    type: 'float',
    unit: 'dimensionless',
    values: ['1.0', '0.82', '1.14'],
    explanation:
      'There is one scalar weight per tree entry, so each event contributes its own amount to a later distribution.',
  },
] as const;

export interface TreeState {
  selectedBranchId: string;
}

export const createTreeState = (): TreeState => ({
  selectedBranchId: BRANCHES[0].id,
});

export function selectedBranch(state: TreeState) {
  return (
    BRANCHES.find((branch) => branch.id === state.selectedBranchId) ??
    BRANCHES[0]
  );
}

export interface TraceEvent {
  id: string;
  photonCount: number;
  leadingPhotonPt: number;
  mass: number;
}

export const TRACE_EVENTS: readonly TraceEvent[] = [
  { id: 'E1', photonCount: 2, leadingPhotonPt: 48, mass: 122 },
  { id: 'E2', photonCount: 1, leadingPhotonPt: 60, mass: 109 },
  { id: 'E3', photonCount: 2, leadingPhotonPt: 31, mass: 117 },
  { id: 'E4', photonCount: 2, leadingPhotonPt: 42, mass: 125 },
  { id: 'E5', photonCount: 3, leadingPhotonPt: 70, mass: 138 },
  { id: 'E6', photonCount: 2, leadingPhotonPt: 55, mass: 127 },
] as const;

export interface TraceFrame {
  label: string;
  rule: string;
  entered: readonly string[];
  removed: readonly string[];
  remaining: readonly string[];
  distribution?: readonly number[];
}

export function buildTraceFrames(
  events: readonly TraceEvent[] = TRACE_EVENTS,
): readonly TraceFrame[] {
  const all = events.map((event) => event.id);
  const afterPhotonCount = events
    .filter((event) => event.photonCount === 2)
    .map((event) => event.id);
  const afterPt = events
    .filter(
      (event) =>
        afterPhotonCount.includes(event.id) && event.leadingPhotonPt > 35,
    )
    .map((event) => event.id);

  return [
    {
      label: 'Input events',
      rule: 'No filter has run yet.',
      entered: all,
      removed: [],
      remaining: all,
    },
    {
      label: 'Require exactly two photons',
      rule: 'Keep events where photonCount === 2.',
      entered: all,
      removed: all.filter((id) => !afterPhotonCount.includes(id)),
      remaining: afterPhotonCount,
    },
    {
      label: 'Require leading photon pT > 35 GeV',
      rule: 'Apply the pT requirement to the events that survived step 2.',
      entered: afterPhotonCount,
      removed: afterPhotonCount.filter((id) => !afterPt.includes(id)),
      remaining: afterPt,
    },
    {
      label: 'Build the mass distribution',
      rule: 'Fill one mass value for every event that survived both filters.',
      entered: afterPt,
      removed: [],
      remaining: afterPt,
      distribution: events
        .filter((event) => afterPt.includes(event.id))
        .map((event) => event.mass),
    },
  ];
}

export interface TraceState {
  currentStep: number;
  prediction: string | null;
  predictionRevealed: boolean;
}

export const createTraceState = (): TraceState => ({
  currentStep: 0,
  prediction: null,
  predictionRevealed: false,
});

export function evaluateTracePrediction(prediction: string) {
  const correct = prediction === 'e1-e3-e4-e6';
  return {
    correct,
    message: correct
      ? 'E1, E3, E4, and E6 each contain exactly two photons. The filter removes E2 and E5 for having one and three photons.'
      : 'The filter checks photon count only: E2 has one photon and E5 has three. E1, E3, E4, and E6 remain.',
  };
}
