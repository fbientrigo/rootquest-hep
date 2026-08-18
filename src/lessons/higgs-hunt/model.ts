export const HUNT_STAGES = ['See', 'Predict', 'Cut', 'Plot', 'ROOT'] as const;

export interface HuntObject {
  id: string;
  label: string;
  kind: 'photon' | 'jet';
  energy: number;
  eta: number;
}

export const HUNT_OBJECTS: readonly HuntObject[] = [
  { id: 'photon-1', label: 'Object A', kind: 'photon', energy: 48, eta: 0.42 },
  { id: 'photon-2', label: 'Object B', kind: 'photon', energy: 42, eta: -0.71 },
  { id: 'jet-1', label: 'Object C', kind: 'jet', energy: 36, eta: 1.14 },
] as const;

export interface TeachingEvent {
  id: string;
  photonCount: number;
  leadingPhotonPt: number;
  diphotonMass: number;
  kind: 'signal' | 'background';
}

const BACKGROUND_EVENTS: readonly TeachingEvent[] = [
  { id: 'B01', photonCount: 2, leadingPhotonPt: 27, diphotonMass: 102, kind: 'background' },
  { id: 'B02', photonCount: 1, leadingPhotonPt: 60, diphotonMass: 105, kind: 'background' },
  { id: 'B03', photonCount: 2, leadingPhotonPt: 31, diphotonMass: 108, kind: 'background' },
  { id: 'B04', photonCount: 3, leadingPhotonPt: 70, diphotonMass: 111, kind: 'background' },
  { id: 'B05', photonCount: 2, leadingPhotonPt: 36, diphotonMass: 114, kind: 'background' },
  { id: 'B06', photonCount: 2, leadingPhotonPt: 41, diphotonMass: 117, kind: 'background' },
  { id: 'B07', photonCount: 1, leadingPhotonPt: 29, diphotonMass: 119, kind: 'background' },
  { id: 'B08', photonCount: 2, leadingPhotonPt: 46, diphotonMass: 121, kind: 'background' },
  { id: 'B09', photonCount: 2, leadingPhotonPt: 52, diphotonMass: 129, kind: 'background' },
  { id: 'B10', photonCount: 3, leadingPhotonPt: 58, diphotonMass: 132, kind: 'background' },
  { id: 'B11', photonCount: 2, leadingPhotonPt: 34, diphotonMass: 135, kind: 'background' },
  { id: 'B12', photonCount: 2, leadingPhotonPt: 39, diphotonMass: 138, kind: 'background' },
  { id: 'B13', photonCount: 1, leadingPhotonPt: 44, diphotonMass: 141, kind: 'background' },
  { id: 'B14', photonCount: 2, leadingPhotonPt: 49, diphotonMass: 144, kind: 'background' },
  { id: 'B15', photonCount: 2, leadingPhotonPt: 55, diphotonMass: 147, kind: 'background' },
  { id: 'B16', photonCount: 3, leadingPhotonPt: 63, diphotonMass: 150, kind: 'background' },
  { id: 'B17', photonCount: 2, leadingPhotonPt: 29, diphotonMass: 153, kind: 'background' },
  { id: 'B18', photonCount: 2, leadingPhotonPt: 43, diphotonMass: 156, kind: 'background' },
  { id: 'B19', photonCount: 1, leadingPhotonPt: 57, diphotonMass: 158, kind: 'background' },
  { id: 'B20', photonCount: 2, leadingPhotonPt: 61, diphotonMass: 112, kind: 'background' },
] as const;

const SIGNAL_EVENTS: readonly TeachingEvent[] = [
  { id: 'S01', photonCount: 2, leadingPhotonPt: 32, diphotonMass: 121.8, kind: 'signal' },
  { id: 'S02', photonCount: 2, leadingPhotonPt: 35, diphotonMass: 123.1, kind: 'signal' },
  { id: 'S03', photonCount: 2, leadingPhotonPt: 38, diphotonMass: 123.8, kind: 'signal' },
  { id: 'S04', photonCount: 2, leadingPhotonPt: 41, diphotonMass: 124.3, kind: 'signal' },
  { id: 'S05', photonCount: 2, leadingPhotonPt: 44, diphotonMass: 124.8, kind: 'signal' },
  { id: 'S06', photonCount: 2, leadingPhotonPt: 47, diphotonMass: 125.2, kind: 'signal' },
  { id: 'S07', photonCount: 2, leadingPhotonPt: 50, diphotonMass: 125.6, kind: 'signal' },
  { id: 'S08', photonCount: 2, leadingPhotonPt: 53, diphotonMass: 126.1, kind: 'signal' },
  { id: 'S09', photonCount: 2, leadingPhotonPt: 56, diphotonMass: 126.7, kind: 'signal' },
  { id: 'S10', photonCount: 2, leadingPhotonPt: 59, diphotonMass: 128, kind: 'signal' },
] as const;

/** Fixed, synthetic teaching data. It illustrates selection and distributions; it is not experimental data. */
export const HUNT_EVENTS: readonly TeachingEvent[] = [
  ...BACKGROUND_EVENTS,
  ...SIGNAL_EVENTS,
];

export const RULE_EVENTS = [
  { id: 'A', photonCount: 2, leadingPhotonPt: 48 },
  { id: 'B', photonCount: 1, leadingPhotonPt: 60 },
  { id: 'C', photonCount: 2, leadingPhotonPt: 34 },
  { id: 'D', photonCount: 3, leadingPhotonPt: 55 },
] as const;

export interface HiggsHuntState {
  stage: number;
  selectedObjectIds: string[];
  rulePrediction: string | null;
  photonPtThreshold: number;
  binCount: number;
}

export const createHiggsHuntState = (): HiggsHuntState => ({
  stage: 0,
  selectedObjectIds: [],
  rulePrediction: null,
  photonPtThreshold: 35,
  binCount: 12,
});

export function toggleObjectSelection(
  selectedIds: readonly string[],
  objectId: string,
): string[] {
  if (selectedIds.includes(objectId)) {
    return selectedIds.filter((id) => id !== objectId);
  }
  if (selectedIds.length < 2) return [...selectedIds, objectId];
  return [selectedIds[1], objectId];
}

export function objectSelectionState(selectedIds: readonly string[]) {
  const photonIds = HUNT_OBJECTS
    .filter((object) => object.kind === 'photon')
    .map((object) => object.id);
  const correct =
    selectedIds.length === photonIds.length &&
    photonIds.every((id) => selectedIds.includes(id));

  return {
    correct,
    selectedCount: selectedIds.length,
    includesJet: selectedIds.includes('jet-1'),
  };
}

export function evaluateRulePrediction(prediction: string) {
  const correct = prediction === 'a-c';
  return {
    correct,
    message: correct
      ? 'A and C each have exactly two photons. Their transverse momentum does not matter until the next cut.'
      : 'The rule checks photon count only. A and C survive because photon_n equals 2; B and D do not.',
  };
}

export function selectedEvents(
  state: Pick<HiggsHuntState, 'photonPtThreshold'>,
  events: readonly TeachingEvent[] = HUNT_EVENTS,
) {
  return events.filter(
    (event) =>
      event.photonCount === 2 &&
      event.leadingPhotonPt >= state.photonPtThreshold,
  );
}

export function deriveTrainingMetrics(
  state: Pick<HiggsHuntState, 'photonPtThreshold'>,
  events: readonly TeachingEvent[] = HUNT_EVENTS,
) {
  const selected = selectedEvents(state, events);
  const signalTotal = events.filter((event) => event.kind === 'signal').length;
  const backgroundTotal = events.filter((event) => event.kind === 'background').length;
  const signalSelected = selected.filter((event) => event.kind === 'signal').length;
  const backgroundSelected = selected.filter(
    (event) => event.kind === 'background',
  ).length;

  return {
    selected,
    signalEfficiency: signalSelected / signalTotal,
    backgroundRejection: 1 - backgroundSelected / backgroundTotal,
  };
}

export interface HuntHistogramBin {
  start: number;
  end: number;
  count: number;
}

export function deriveMassHistogram(
  state: Pick<HiggsHuntState, 'photonPtThreshold' | 'binCount'>,
  events: readonly TeachingEvent[] = HUNT_EVENTS,
  range: readonly [number, number] = [100, 160],
) {
  const selected = selectedEvents(state, events);
  const width = (range[1] - range[0]) / state.binCount;
  const bins: HuntHistogramBin[] = Array.from(
    { length: state.binCount },
    (_, index) => ({
      start: range[0] + index * width,
      end: range[0] + (index + 1) * width,
      count: 0,
    }),
  );

  for (const event of selected) {
    if (event.diphotonMass < range[0] || event.diphotonMass > range[1]) continue;
    const index = Math.min(
      Math.floor((event.diphotonMass - range[0]) / width),
      bins.length - 1,
    );
    bins[index].count += 1;
  }

  return {
    bins,
    selectedCount: selected.length,
    maxCount: Math.max(1, ...bins.map((bin) => bin.count)),
  };
}

export function canAdvance(state: Readonly<HiggsHuntState>) {
  if (state.stage === 0) return objectSelectionState(state.selectedObjectIds).correct;
  if (state.stage === 1) return state.rulePrediction !== null;
  return state.stage < HUNT_STAGES.length - 1;
}

export function formatRootCode(state: Readonly<HiggsHuntState>) {
  return `ROOT::RDataFrame events("Events", "events.root");

auto selected = events
  .Filter("photon_n == 2")
  .Filter("leading_photon_pt >= ${state.photonPtThreshold}");

auto mass = selected.Histo1D(
  {"m_gg", "Diphoton mass;m_{γγ} [GeV];Events", ${state.binCount}, 100., 160.},
  "diphoton_mass"
);`;
}
