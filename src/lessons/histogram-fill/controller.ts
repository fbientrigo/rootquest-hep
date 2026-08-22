import {
  RQPredictElement,
  createLessonSession,
  type PredictionCommitDetail,
} from '../../learning';
import {
  FILL_BIN_COUNT,
  FILL_VALUES,
  createFillLessonState,
  deriveFillState,
  evaluateFillPrediction,
  evaluateFillTransfer,
  findDisplayBin,
} from './model';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

function byId<ElementType extends Element>(id: string): ElementType {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Histogram Fill lesson is missing #${id}.`);
  return element as ElementType;
}

const session = createLessonSession(createFillLessonState);
const abortController = new AbortController();
session.onDispose(() => abortController.abort());

const addButton = byId<HTMLButtonElement>('a2-add-value');
const resetButton = byId<HTMLButtonElement>('a2-reset');
const nextValue = byId<HTMLOutputElement>('a2-next-value');
const fillCount = byId<HTMLOutputElement>('a2-fill-count');
const activeBin = byId<HTMLOutputElement>('a2-active-bin');
const summary = byId<HTMLParagraphElement>('a2-summary');
const description = byId<SVGDescElement>('a2-histogram-description');
const bars = byId<SVGGElement>('a2-histogram-bars');
const code = byId<HTMLElement>('a2-root-code');
const prediction = byId<RQPredictElement>('a2-prediction');
const transfer = byId<RQPredictElement>('a2-transfer');

function render() {
  const state = session.getState();
  const derived = deriveFillState(state.filledCount);

  fillCount.value = `${derived.filledCount} / ${FILL_VALUES.length}`;
  nextValue.value = derived.nextValue === null ? 'complete' : derived.nextValue.toFixed(1);
  activeBin.value = derived.nextValue === null ? '—' : findDisplayBin(derived.nextValue);
  addButton.disabled = derived.complete;
  addButton.textContent = derived.complete ? 'All measurements filled' : `Fill(${derived.nextValue?.toFixed(1)})`;

  summary.textContent = derived.complete
    ? `All ${FILL_VALUES.length} measurements have contributed once. The bar heights are the accumulated bin counts.`
    : `${derived.filledCount} measurements have contributed. The next Fill call will place ${derived.nextValue?.toFixed(1)} in ${findDisplayBin(derived.nextValue ?? 0)}.`;
  description.textContent = `${derived.filledCount} of ${FILL_VALUES.length} measurements filled into four equal bins over [0, 8). Bin counts are ${derived.bins.map((bin) => bin.count).join(', ')}.`;

  const plot = { x: 52, y: 24, width: 600, height: 210 };
  const slotWidth = plot.width / FILL_BIN_COUNT;
  bars.replaceChildren(
    ...derived.bins.flatMap((bin, index) => {
      const height = (bin.count / Math.max(1, derived.maxCount)) * plot.height;
      const rectangle = document.createElementNS(SVG_NAMESPACE, 'rect');
      rectangle.setAttribute('x', String(plot.x + index * slotWidth + 4));
      rectangle.setAttribute('y', String(plot.y + plot.height - height));
      rectangle.setAttribute('width', String(slotWidth - 8));
      rectangle.setAttribute('height', String(height));
      rectangle.setAttribute('rx', '3');
      rectangle.setAttribute('aria-hidden', 'true');

      const label = document.createElementNS(SVG_NAMESPACE, 'text');
      label.setAttribute('x', String(plot.x + (index + 0.5) * slotWidth));
      label.setAttribute('y', String(Math.max(18, plot.y + plot.height - height - 7)));
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('aria-hidden', 'true');
      label.textContent = String(bin.count);
      return [rectangle, label];
    }),
  );

  const fillLines = derived.filledValues.map((value) => `h.Fill(${value.toFixed(1)})`);
  code.textContent = [
    'h = ROOT.TH1D("h", "Measurements", 4, 0.0, 8.0)',
    ...fillLines,
    derived.complete ? 'h.Draw()' : '# add another measurement with h.Fill(x)',
  ].join('\n');
}

session.subscribe(render);

addButton.addEventListener(
  'click',
  () => {
    session.update(
      (state) => ({ ...state, filledCount: Math.min(FILL_VALUES.length, state.filledCount + 1) }),
      'A2 measurement filled',
    );
  },
  { signal: abortController.signal },
);

resetButton.addEventListener(
  'click',
  () => session.reset(),
  { signal: abortController.signal },
);

prediction.addEventListener(
  'rq-prediction-commit',
  (event) => {
    const { value } = (event as CustomEvent<PredictionCommitDetail>).detail;
    const result = evaluateFillPrediction(value);
    prediction.reveal({
      kind: result.correct ? 'success' : 'misconception',
      heading: result.correct ? 'Prediction supported.' : 'Locate x before counting.',
      message: result.message,
    });
  },
  { signal: abortController.signal },
);

transfer.addEventListener(
  'rq-prediction-commit',
  (event) => {
    const { value } = (event as CustomEvent<PredictionCommitDetail>).detail;
    const result = evaluateFillTransfer(value);
    transfer.reveal({
      kind: result.correct ? 'success' : 'misconception',
      heading: result.correct ? 'Transfer complete.' : 'Separate x from bin content.',
      message: result.message,
    });
  },
  { signal: abortController.signal },
);
