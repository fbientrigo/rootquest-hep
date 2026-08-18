import {
  RQFeedbackElement,
  RQPredictElement,
  RQStepperElement,
  createLessonSession,
  type LessonSession,
  type PredictionCommitDetail,
  type StepRequestDetail,
} from '../../learning';
import {
  BRANCHES,
  HISTOGRAM_VALUES,
  TRACE_EVENTS,
  buildTraceFrames,
  createHistogramState,
  createTraceState,
  createTreeState,
  deriveHistogram,
  evaluateBinPrediction,
  evaluateTracePrediction,
  selectedBranch,
  type HistogramState,
  type TraceState,
  type TreeState,
} from './model';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

function byId<ElementType extends Element>(id: string): ElementType {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Learning Engine Lab is missing #${id}.`);
  return element as ElementType;
}

function replaceList(list: HTMLOListElement | HTMLUListElement, items: string[]) {
  list.replaceChildren(
    ...items.map((text) => {
      const item = document.createElement('li');
      item.textContent = text;
      return item;
    }),
  );
}

function initializeHistogramProbe(): LessonSession<HistogramState> {
  const session = createLessonSession(createHistogramState);
  const controller = new AbortController();
  session.onDispose(() => controller.abort());

  const binInput = byId<HTMLInputElement>('bin-count');
  const thresholdInput = byId<HTMLInputElement>('threshold');
  const binOutput = byId<HTMLOutputElement>('bin-count-value');
  const thresholdOutput = byId<HTMLOutputElement>('threshold-value');
  const summary = byId<HTMLParagraphElement>('histogram-summary');
  const description = byId<SVGDescElement>('histogram-description');
  const binList = byId<HTMLOListElement>('histogram-bin-list');
  const bars = document.querySelector<SVGGElement>('[data-histogram-bars]');
  const feedback = byId<RQFeedbackElement>('histogram-feedback');
  const prediction = byId<RQPredictElement>('histogram-prediction');

  if (!bars) throw new Error('Learning Engine Lab is missing histogram bars.');

  const render = (state: Readonly<HistogramState>) => {
    const histogram = deriveHistogram(state);
    binInput.value = String(state.binCount);
    thresholdInput.value = String(state.threshold);
    binOutput.value = String(state.binCount);
    thresholdOutput.value = state.threshold.toFixed(1);

    const tallest = Math.max(...histogram.bins.map((bin) => bin.count));
    summary.textContent = `${histogram.selectedCount} of ${histogram.totalCount} values remain in ${state.binCount} bins. The tallest bin contains ${tallest} values.`;
    description.textContent = `${state.binCount} bins contain ${histogram.selectedCount} of ${histogram.totalCount} values after keeping values at or above ${state.threshold.toFixed(1)}.`;

    replaceList(
      binList,
      histogram.bins.map(
        (bin) =>
          `${bin.start.toFixed(1)} to ${bin.end.toFixed(1)}: ${bin.count} ${
            bin.count === 1 ? 'value' : 'values'
          }`,
      ),
    );

    const plot = { x: 36, y: 14, width: 546, height: 168 };
    const slotWidth = plot.width / histogram.bins.length;
    bars.replaceChildren(
      ...histogram.bins.flatMap((bin, index) => {
        const height = (bin.count / histogram.maxCount) * plot.height;
        const rectangle = document.createElementNS(SVG_NAMESPACE, 'rect');
        rectangle.setAttribute('x', String(plot.x + index * slotWidth + 2));
        rectangle.setAttribute('y', String(plot.y + plot.height - height));
        rectangle.setAttribute('width', String(Math.max(1, slotWidth - 4)));
        rectangle.setAttribute('height', String(height));
        rectangle.setAttribute('rx', '2');
        rectangle.setAttribute('aria-hidden', 'true');

        const count = document.createElementNS(SVG_NAMESPACE, 'text');
        count.setAttribute('x', String(plot.x + (index + 0.5) * slotWidth));
        count.setAttribute('y', String(Math.max(11, plot.y + plot.height - height - 5)));
        count.setAttribute('text-anchor', 'middle');
        count.setAttribute('aria-hidden', 'true');
        count.textContent = String(bin.count);

        const edge = document.createElementNS(SVG_NAMESPACE, 'text');
        edge.setAttribute('x', String(plot.x + index * slotWidth + 2));
        edge.setAttribute('y', '202');
        edge.setAttribute('aria-hidden', 'true');
        edge.textContent = bin.start.toFixed(1);
        return [rectangle, count, edge];
      }),
    );

    feedback.show({
      kind: 'observation',
      heading: 'Visible consequence.',
      message: `The threshold admits ${histogram.selectedCount} values; the bin count only changes how those values are grouped.`,
    });
  };

  session.subscribe(render);

  binInput.addEventListener(
    'input',
    () => {
      const previous = session.getState();
      const binCount = Number(binInput.value);
      const reveal =
        previous.prediction !== null &&
        !previous.predictionRevealed &&
        binCount !== previous.predictionAtBins;

      session.update(
        {
          ...previous,
          binCount,
          predictionRevealed: previous.predictionRevealed || reveal,
        },
        'histogram bin count changed',
      );

      if (reveal && previous.prediction) {
        const result = evaluateBinPrediction(previous.prediction);
        prediction.reveal({
          kind: result.correct ? 'success' : 'misconception',
          heading: result.correct ? 'Prediction supported.' : 'Compare the cause.',
          message: result.message,
        });
      }
    },
    { signal: controller.signal },
  );

  thresholdInput.addEventListener(
    'input',
    () => {
      session.update(
        (state) => ({ ...state, threshold: Number(thresholdInput.value) }),
        'histogram threshold changed',
      );
    },
    { signal: controller.signal },
  );

  prediction.addEventListener(
    'rq-prediction-commit',
    (event) => {
      const { value } = (event as CustomEvent<PredictionCommitDetail>).detail;
      session.update(
        (state) => ({
          ...state,
          prediction: value,
          predictionAtBins: state.binCount,
          predictionRevealed: false,
        }),
        'histogram prediction committed',
      );
    },
    { signal: controller.signal },
  );

  byId<HTMLButtonElement>('histogram-reset').addEventListener(
    'click',
    () => {
      prediction.resetPrediction();
      session.reset('histogram reset');
    },
    { signal: controller.signal },
  );

  return session;
}

function initializeTreeProbe(): LessonSession<TreeState> {
  const session = createLessonSession(createTreeState);
  const controller = new AbortController();
  session.onDispose(() => controller.abort());

  const branchName = byId<HTMLHeadingElement>('branch-name');
  const branchType = byId<HTMLElement>('branch-type');
  const branchUnit = byId<HTMLElement>('branch-unit');
  const branchValues = byId<HTMLOListElement>('branch-values');
  const feedback = byId<RQFeedbackElement>('branch-feedback');
  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-branch-id]'),
  );

  session.subscribe((state) => {
    const branch = selectedBranch(state);
    branchName.textContent = branch.name;
    branchType.textContent = branch.type;
    branchUnit.textContent = branch.unit;
    replaceList(
      branchValues,
      branch.values.map(
        (value, index) => `Entry ${index}: ${value} ${branch.unit}`,
      ),
    );
    for (const button of buttons) {
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.branchId === branch.id),
      );
    }
    feedback.show({
      kind: 'explanation',
      heading: `${branch.name} selected.`,
      message: branch.explanation,
    });
  });

  for (const button of buttons) {
    button.addEventListener(
      'click',
      () => {
        const selectedBranchId = button.dataset.branchId;
        if (!selectedBranchId || !BRANCHES.some(({ id }) => id === selectedBranchId)) {
          return;
        }
        session.update({ selectedBranchId }, 'tree branch selected');
      },
      { signal: controller.signal },
    );
  }

  return session;
}

function initializeTraceProbe(): LessonSession<TraceState> {
  const session = createLessonSession(createTraceState);
  const controller = new AbortController();
  session.onDispose(() => controller.abort());

  const frames = buildTraceFrames();
  const prediction = byId<RQPredictElement>('trace-prediction');
  const stepper = byId<RQStepperElement>('filter-stepper');
  const frameTitle = byId<HTMLHeadingElement>('trace-frame-title');
  const rule = byId<HTMLParagraphElement>('trace-rule');
  const eventList = byId<HTMLUListElement>('trace-events');
  const summary = byId<HTMLParagraphElement>('trace-summary');
  const distribution = byId<HTMLDivElement>('trace-distribution');
  const masses = byId<HTMLOutputElement>('trace-masses');
  const feedback = byId<RQFeedbackElement>('trace-feedback');

  session.subscribe((state) => {
    const frame = frames[state.currentStep];
    stepper.setPosition(state.currentStep, frames.length, frame.label);
    frameTitle.textContent = frame.label;
    rule.textContent = frame.rule;
    summary.textContent = `${frame.entered.length} ${
      frame.entered.length === 1 ? 'event enters' : 'events enter'
    }; ${frame.removed.length} ${
      frame.removed.length === 1 ? 'is' : 'are'
    } removed at this step; ${frame.remaining.length} remain.`;

    eventList.replaceChildren(
      ...TRACE_EVENTS.map((event) => {
        const item = document.createElement('li');
        const removedNow = frame.removed.includes(event.id);
        const removedBefore = !frame.entered.includes(event.id);
        const status = removedNow
          ? 'removed-now'
          : removedBefore
            ? 'removed-before'
            : 'remains';
        const statusText = removedNow
          ? 'Removed at this step'
          : removedBefore
            ? 'Removed earlier'
            : 'Remains in the sample';

        item.className = 'event-card';
        item.dataset.status = status;
        const name = document.createElement('strong');
        name.textContent = event.id;
        const details = document.createElement('span');
        details.className = 'event-status';
        details.textContent = `${statusText} · ${event.photonCount} photons · leading pT ${event.leadingPhotonPt} GeV`;
        item.append(name, details);
        return item;
      }),
    );

    distribution.hidden = !frame.distribution;
    masses.value = frame.distribution
      ? frame.distribution.map((mass) => `${mass} GeV`).join(', ')
      : '';

    if (state.currentStep === 0) {
      feedback.show({
        kind: state.prediction ? 'observation' : 'hint',
        heading: state.prediction ? 'Ready to test.' : 'Predict before advancing.',
        message: state.prediction
          ? 'Use Next to run the photon-count filter and compare its consequence.'
          : 'Inspect photon counts, commit a prediction, then run the first filter.',
      });
    } else {
      feedback.show({
        kind: 'explanation',
        heading: `${frame.removed.length} removed; ${frame.remaining.length} remain.`,
        message: frame.rule,
      });
    }
  });

  prediction.addEventListener(
    'rq-prediction-commit',
    (event) => {
      const { value } = (event as CustomEvent<PredictionCommitDetail>).detail;
      session.update(
        (state) => ({ ...state, prediction: value }),
        'trace prediction committed',
      );
    },
    { signal: controller.signal },
  );

  stepper.addEventListener(
    'rq-step-request',
    (event) => {
      const request = event as CustomEvent<StepRequestDetail>;
      const state = session.getState();

      if (request.detail.action === 'reset') {
        prediction.resetPrediction();
        session.reset('trace reset');
        return;
      }

      if (
        request.detail.action === 'next' &&
        state.currentStep === 0 &&
        state.prediction === null
      ) {
        request.preventDefault();
        feedback.show({
          kind: 'hint',
          heading: 'Pause and predict.',
          message: 'Choose which events should survive before the filter reveals them.',
        });
        return;
      }

      const reveal =
        request.detail.requestedIndex === 1 &&
        state.prediction !== null &&
        !state.predictionRevealed;

      session.update(
        {
          ...state,
          currentStep: request.detail.requestedIndex,
          predictionRevealed: state.predictionRevealed || reveal,
        },
        `trace ${request.detail.action}`,
      );

      if (reveal && state.prediction) {
        const result = evaluateTracePrediction(state.prediction);
        prediction.reveal({
          kind: result.correct ? 'success' : 'misconception',
          heading: result.correct ? 'Prediction supported.' : 'Compare event counts.',
          message: result.message,
        });
      }
    },
    { signal: controller.signal },
  );

  return session;
}

const sessions = [
  initializeHistogramProbe(),
  initializeTreeProbe(),
  initializeTraceProbe(),
];

window.addEventListener(
  'pagehide',
  (event) => {
    if (!(event as PageTransitionEvent).persisted) {
      for (const session of sessions) session.dispose();
    }
  },
  { once: true },
);
