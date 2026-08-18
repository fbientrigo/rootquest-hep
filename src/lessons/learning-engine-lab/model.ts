export const HISTOGRAM_VALUES = [
  0.4, 0.8, 1.1, 1.4, 1.8, 2.0, 2.2, 2.5, 2.9, 3.1,
  3.4, 3.8, 4.1, 4.4, 4.8, 5.2, 5.7, 6.1, 6.6, 7.3,
] as const;

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
  state: Pick<HistogramState, 'binCount' | 'threshold'>,
  values: readonly number[] = HISTOGRAM_VALUES,
  range: readonly [number, number] = [0, 8],
) {
  const selectedValues = values.filter((value) => value >= state.threshold);
  const width = (range[1] - range[0]) / state.binCount;
  const bins: HistogramBin[] = Array.from(
    { length: state.binCount },
    (_, index) => ({
      start: range[0] + index * width,
      end: range[0] + (index + 1) * width,
      count: 0,
    }),
  );

  for (const value of selectedValues) {
    if (value < range[0] || value > range[1]) continue;
    const index = Math.min(
      Math.floor((value - range[0]) / width),
      bins.length - 1,
    );
    bins[index].count += 1;
  }

  return {
    bins,
    selectedCount: selectedValues.length,
    totalCount: values.length,
    maxCount: Math.max(1, ...bins.map((bin) => bin.count)),
  };
}

export function evaluateBinPrediction(prediction: string) {
  const correct = prediction === 'narrower';
  return {
    correct,
    message: correct
      ? 'More bins divide the same fixed range into narrower intervals. The values did not multiply; their grouping changed.'
      : 'The dataset and range stayed fixed. Increasing the bin count makes each interval narrower, so the same values are split among more bars.',
  };
}

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
