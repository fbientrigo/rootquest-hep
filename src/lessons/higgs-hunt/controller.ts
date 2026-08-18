import {
  createLessonSession,
  type PredictionCommitDetail,
  type RQFeedbackElement,
  type RQPredictElement,
  type RQStepperElement,
  type StepRequestDetail,
} from '../../learning';
import {
  HUNT_OBJECTS,
  HUNT_EVENTS,
  HUNT_STAGES,
  canAdvance,
  createHiggsHuntState,
  deriveMassHistogram,
  deriveTrainingMetrics,
  evaluateRulePrediction,
  formatRootCode,
  objectSelectionState,
  selectedEvents,
  toggleObjectSelection,
} from './model';

const byId = <T extends Element>(id: string): T => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing Higgs Hunt element: #${id}`);
  return element as unknown as T;
};

const svgNamespace = 'http://www.w3.org/2000/svg';
const session = createLessonSession(createHiggsHuntState());
const abortController = new AbortController();
const signal = abortController.signal;

const progressLabel = byId<HTMLElement>('hunt-stage-label');
const progress = byId<HTMLProgressElement>('hunt-progress');
const stepper = byId<RQStepperElement>('hunt-stepper');
const nav = stepper.querySelector<HTMLElement>('.hunt-navigation')!;
const previousButton = stepper.querySelector<HTMLButtonElement>('[data-stepper-action="previous"]')!;
const nextButton = stepper.querySelector<HTMLButtonElement>('[data-stepper-action="next"]')!;
const resetButton = stepper.querySelector<HTMLButtonElement>('[data-stepper-action="reset"]')!;
const selectionFeedback = byId<RQFeedbackElement>('object-feedback');
const prediction = byId<RQPredictElement>('rule-prediction');
const cutFeedback = byId<RQFeedbackElement>('cut-feedback');
const histogramFeedback = byId<RQFeedbackElement>('mass-feedback');
const codeFeedback = byId<RQFeedbackElement>('root-feedback');
const thresholdInput = byId<HTMLInputElement>('photon-pt-cut');
const binInput = byId<HTMLInputElement>('mass-bin-count');

function renderSelection(selectedIds: string[]): void {
  const selection = objectSelectionState(selectedIds);

  for (const object of HUNT_OBJECTS) {
    const selected = selectedIds.includes(object.id);
    const button = byId<HTMLButtonElement>(`select-${object.id}`);
    button.setAttribute('aria-pressed', String(selected));
    const visual = document.querySelector<SVGElement>(`[data-object-visual="${object.id}"]`);
    if (visual) visual.dataset.selected = String(selected);
  }

  if (selection.correct) {
    selectionFeedback.show({
      kind: 'success',
      heading: 'A diphoton candidate',
      message: 'The two narrow electromagnetic deposits are photon-like. Their combined properties can now describe the event.',
    });
  } else if (selection.includesJet) {
    selectionFeedback.show({
      kind: 'misconception',
      heading: 'Compare the shapes',
      message: 'The broad spray is jet-like. Look for the two compact deposits that point back toward the collision.',
    });
  } else if (selection.selectedCount === 1) {
    selectionFeedback.show({
      kind: 'observation',
      heading: 'One photon-like object found',
      message: 'Find its compact partner so the event can form a two-photon candidate.',
    });
  } else {
    selectionFeedback.show({
      kind: 'hint',
      heading: 'Inspect the event',
      message: 'Select the two compact deposits. You can change your choice without penalty.',
    });
  }
}

function renderCutPlot(threshold: number): void {
  const group = document.querySelector<SVGGElement>('[data-cut-events]')!;
  const marker = document.querySelector<SVGGElement>('[data-cut-marker]')!;
  const description = byId<SVGDescElement>('cut-description');
  const events = HUNT_EVENTS.filter((event) => event.photonCount === 2);
  const xFor = (value: number) => 46 + ((value - 25) / 45) * 642;

  group.replaceChildren();
  for (const [index, event] of events.entries()) {
    const x = xFor(event.leadingPhotonPt);
    const y = event.kind === 'signal' ? 75 + (index % 3) * 7 : 142 + (index % 3) * 7;
    const kept = event.leadingPhotonPt >= threshold;
    let mark: SVGElement;

    if (event.kind === 'signal') {
      mark = document.createElementNS(svgNamespace, 'circle');
      mark.setAttribute('cx', String(x));
      mark.setAttribute('cy', String(y));
      mark.setAttribute('r', '6');
    } else {
      mark = document.createElementNS(svgNamespace, 'rect');
      mark.setAttribute('x', String(x - 5));
      mark.setAttribute('y', String(y - 5));
      mark.setAttribute('width', '10');
      mark.setAttribute('height', '10');
      mark.setAttribute('transform', `rotate(45 ${x} ${y})`);
    }

    mark.classList.add(
      'cut-event',
      `cut-event--${event.kind}`,
      kept ? 'cut-event--kept' : 'cut-event--removed',
    );
    group.append(mark);
  }

  const markerX = xFor(threshold);
  marker.setAttribute('transform', `translate(${markerX} 0)`);
  marker.querySelector('text')!.textContent = `${threshold}`;
  description.textContent = `${events.filter((event) => event.leadingPhotonPt >= threshold).length} of ${events.length} teaching events remain after a ${threshold} GeV threshold. Circles represent signal examples and diamonds represent background examples.`;
}

function renderHistogram(binCount: number, threshold: number): void {
  const group = document.querySelector<SVGGElement>('[data-mass-bars]')!;
  const description = byId<SVGDescElement>('mass-description');
  const histogram = deriveMassHistogram({ binCount, photonPtThreshold: threshold });
  const bins = histogram.bins;
  const maxCount = Math.max(1, ...bins.map((bin) => bin.count));
  const plotX = 52;
  const plotWidth = 634;
  const baseline = 266;
  const plotHeight = 222;
  const slotWidth = plotWidth / bins.length;

  group.replaceChildren();
  for (const [index, bin] of bins.entries()) {
    const height = (bin.count / maxCount) * plotHeight;
    const bar = document.createElementNS(svgNamespace, 'rect');
    bar.setAttribute('x', String(plotX + index * slotWidth + 1.5));
    bar.setAttribute('y', String(baseline - height));
    bar.setAttribute('width', String(Math.max(2, slotWidth - 3)));
    bar.setAttribute('height', String(height));
    bar.classList.add('histogram-bar');
    bar.dataset.peak = String(bin.start < 128 && bin.end > 122);
    group.append(bar);
  }

  const retained = selectedEvents({ photonPtThreshold: threshold }).length;
  description.textContent = `A ${binCount}-bin mass histogram of ${retained} selected synthetic events. A concentration appears near 125 GeV; changing the bins changes its visible shape, not the underlying event masses.`;
  byId<HTMLElement>('mass-summary').textContent = `${retained} selected events · concentration near 125 GeV`;
}

function render(state = session.getState()): void {
  const stageName = HUNT_STAGES[state.stage];
  progressLabel.textContent = `${state.stage + 1} of ${HUNT_STAGES.length} · ${stageName}`;
  progress.value = state.stage + 1;

  document.querySelectorAll<HTMLElement>('[data-hunt-stage]').forEach((stage) => {
    stage.hidden = Number(stage.dataset.huntStage) !== state.stage;
  });

  const predictionPending = state.stage === 1 && state.rulePrediction === null;
  nav.hidden = predictionPending;
  stepper.setPosition(state.stage, HUNT_STAGES.length, stageName);
  previousButton.hidden = state.stage === 0;
  nextButton.hidden = state.stage === HUNT_STAGES.length - 1;
  resetButton.hidden = state.stage !== HUNT_STAGES.length - 1;
  nextButton.disabled = !canAdvance(state);

  renderSelection(state.selectedObjectIds);

  thresholdInput.value = String(state.photonPtThreshold);
  byId<HTMLOutputElement>('photon-pt-value').value = `${state.photonPtThreshold} GeV`;
  const metrics = deriveTrainingMetrics({ photonPtThreshold: state.photonPtThreshold });
  byId<HTMLElement>('signal-efficiency').textContent = `${Math.round(metrics.signalEfficiency * 100)}%`;
  byId<HTMLElement>('background-rejection').textContent = `${Math.round(metrics.backgroundRejection * 100)}%`;
  cutFeedback.show({
    kind: 'observation',
    heading: `${metrics.selected.length} events remain`,
    message: `This cut keeps ${Math.round(metrics.signalEfficiency * 100)}% of the signal examples while rejecting ${Math.round(metrics.backgroundRejection * 100)}% of the background examples. A cut trades sample size for purity.`,
  });
  renderCutPlot(state.photonPtThreshold);

  binInput.value = String(state.binCount);
  byId<HTMLOutputElement>('mass-bin-value').value = String(state.binCount);
  renderHistogram(state.binCount, state.photonPtThreshold);
  histogramFeedback.show({
    kind: 'explanation',
    heading: 'The data did not move',
    message: 'Only the boundaries changed. More bins reveal detail, but each bin contains fewer events and the shape becomes noisier.',
  });

  byId<HTMLElement>('root-code').textContent = formatRootCode(state);
}

function focusActiveStage(): void {
  requestAnimationFrame(() => {
    document.querySelector<HTMLElement>('[data-hunt-stage]:not([hidden]) h2')?.focus();
  });
}

document.querySelectorAll<HTMLButtonElement>('[data-object-id]').forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.dataset.objectId;
    if (!id) return;
    session.update((state) => ({
      ...state,
      selectedObjectIds: toggleObjectSelection(state.selectedObjectIds, id),
    }));
  }, { signal });
});

prediction.addEventListener('rq-prediction-commit', (event) => {
  const { value } = (event as CustomEvent<PredictionCommitDetail>).detail;
  const result = evaluateRulePrediction(value);
  session.update((state) => ({ ...state, rulePrediction: value }));
  prediction.reveal({
    kind: result.correct ? 'success' : 'misconception',
    heading: result.correct ? 'Prediction committed' : 'Test the AND rule',
    message: result.message,
  });
}, { signal });

thresholdInput.addEventListener('input', () => {
  session.update((state) => ({ ...state, photonPtThreshold: thresholdInput.valueAsNumber }));
}, { signal });

binInput.addEventListener('input', () => {
  session.update((state) => ({ ...state, binCount: binInput.valueAsNumber }));
}, { signal });

stepper.addEventListener('rq-step-request', (event) => {
  const { action } = (event as CustomEvent<StepRequestDetail>).detail;
  if (action === 'reset') {
    prediction.resetPrediction();
    session.reset();
    focusActiveStage();
    return;
  }

  const state = session.getState();
  if (action === 'next' && !canAdvance(state)) return;
  const delta = action === 'next' ? 1 : -1;
  session.update((current) => ({
    ...current,
    stage: Math.max(0, Math.min(HUNT_STAGES.length - 1, current.stage + delta)),
  }));
  focusActiveStage();
}, { signal });

byId<HTMLButtonElement>('copy-root-code').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(formatRootCode(session.getState()));
    codeFeedback.show({
      kind: 'success',
      heading: 'Code copied',
      message: 'Your analysis choices are now expressed as a ROOT RDataFrame pipeline.',
    });
  } catch {
    codeFeedback.show({
      kind: 'hint',
      heading: 'Copy manually',
      message: 'Select the code block and copy it with your keyboard.',
    });
  }
}, { signal });

const unsubscribe = session.subscribe((state) => render(state));
session.onDispose(() => {
  unsubscribe();
  abortController.abort();
});

window.addEventListener('pagehide', (event) => {
  if (!event.persisted) session.dispose();
}, { signal });
