import {
  RQFeedbackElement,
  RQPredictElement,
  createLessonSession,
  type PredictionCommitDetail,
} from '../../learning';
import {
  HISTOGRAM_RANGE,
  HISTOGRAM_VALUES,
  createHistogramState,
  deriveHistogram,
  evaluateBinPrediction,
  evaluateTransferAnswer,
  type HistogramState,
} from './model';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

function byId<ElementType extends Element>(id: string): ElementType {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Histogram Binning lesson is missing #${id}.`);
  return element as ElementType;
}

function renderBinList(list: HTMLOListElement, bins: ReturnType<typeof deriveHistogram>['bins']) {
  list.replaceChildren(
    ...bins.map((bin) => {
      const item = document.createElement('li');
      item.textContent = `[${bin.start.toFixed(1)}, ${bin.end.toFixed(1)}): ${bin.count}`;
      return item;
    }),
  );
}

const session = createLessonSession(createHistogramState);
const abortController = new AbortController();
session.onDispose(() => abortController.abort());

const binInput = byId<HTMLInputElement>('a1-bin-count');
const binOutput = byId<HTMLOutputElement>('a1-bin-count-value');
const widthOutput = byId<HTMLOutputElement>('a1-bin-width-value');
const summary = byId<HTMLParagraphElement>('a1-histogram-summary');
const description = byId<SVGDescElement>('a1-histogram-description');
const bars = byId<SVGGElement>('a1-histogram-bars');
const binList = byId<HTMLOListElement>('a1-bin-list');
const feedback = byId<RQFeedbackElement>('a1-feedback');
const prediction = byId<RQPredictElement>('a1-prediction');
const transfer = byId<RQPredictElement>('a1-transfer');
const rootCode = byId<HTMLElement>('a1-root-code');

function render(state: Readonly<HistogramState>) {
  const histogram = deriveHistogram({ binCount: state.binCount });
  binInput.value = String(state.binCount);
  binOutput.value = String(state.binCount);
  widthOutput.value = histogram.binWidth.toFixed(2);

  summary.textContent = `${histogram.sourceCount} measurements remain fixed. They are grouped into ${state.binCount} bins across [${HISTOGRAM_RANGE[0]}, ${HISTOGRAM_RANGE[1]}), each ${histogram.binWidth.toFixed(2)} units wide.`;
  description.textContent = `${histogram.sourceCount} fixed measurements grouped into ${state.binCount} equal-width bins. Underflow ${histogram.underflow}; overflow ${histogram.overflow}.`;
  rootCode.textContent = `ROOT.TH1D("h", "Measurements", ${state.binCount}, ${HISTOGRAM_RANGE[0]}.0, ${HISTOGRAM_RANGE[1]}.0)`;

  renderBinList(binList, histogram.bins);

  const plot = { x: 42, y: 18, width: 620, height: 206 };
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
      count.setAttribute('y', String(Math.max(14, plot.y + plot.height - height - 6)));
      count.setAttribute('text-anchor', 'middle');
      count.setAttribute('aria-hidden', 'true');
      count.textContent = String(bin.count);
      return [rectangle, count];
    }),
  );

  feedback.show({
    kind: 'observation',
    heading: 'Same measurements, new grouping.',
    message: `${HISTOGRAM_VALUES.length} source values are unchanged. Only the ${state.binCount} interval boundaries and resulting counts changed.`,
  });
}

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
      'A1 bin count changed',
    );

    if (reveal && previous.prediction) {
      const result = evaluateBinPrediction(previous.prediction);
      prediction.reveal({
        kind: result.correct ? 'success' : 'misconception',
        heading: result.correct ? 'Prediction supported.' : 'Separate data from representation.',
        message: result.message,
      });
    }
  },
  { signal: abortController.signal },
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
      'A1 prediction committed',
    );
  },
  { signal: abortController.signal },
);

transfer.addEventListener(
  'rq-prediction-commit',
  (event) => {
    const { value } = (event as CustomEvent<PredictionCommitDetail>).detail;
    const result = evaluateTransferAnswer(value);
    transfer.reveal({
      kind: result.correct ? 'success' : 'misconception',
      heading: result.correct ? 'Transfer complete.' : 'Try the invariant.',
      message: result.message,
    });
  },
  { signal: abortController.signal },
);
