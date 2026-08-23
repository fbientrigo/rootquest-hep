import {
  RQPredictElement,
  createLessonSession,
  type PredictionCommitDetail,
} from '../../learning';
import {
  createComparisonLessonState,
  deriveComparison,
  evaluateNormalizationPrediction,
  evaluateNormalizationTransfer,
  type ComparisonMode,
} from './model';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

function byId<ElementType extends Element>(id: string): ElementType {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Histogram Compare lesson is missing #${id}.`);
  return element as ElementType;
}

const session = createLessonSession(createComparisonLessonState);
const abortController = new AbortController();
session.onDispose(() => abortController.abort());

const modeControls = byId<HTMLFieldSetElement>('a3-mode');
const description = byId<SVGDescElement>('a3-histogram-description');
const bars = byId<SVGGElement>('a3-bars');
const tableBody = byId<HTMLTableSectionElement>('a3-bin-table-body');
const summary = byId<HTMLParagraphElement>('a3-summary');
const integralA = byId<HTMLOutputElement>('a3-integral-a');
const integralB = byId<HTMLOutputElement>('a3-integral-b');
const meanA = byId<HTMLOutputElement>('a3-mean-a');
const meanB = byId<HTMLOutputElement>('a3-mean-b');
const stdA = byId<HTMLOutputElement>('a3-std-a');
const stdB = byId<HTMLOutputElement>('a3-std-b');
const code = byId<HTMLElement>('a3-root-code');
const prediction = byId<RQPredictElement>('a3-prediction');
const transfer = byId<RQPredictElement>('a3-transfer');

function formatValue(value: number, mode: ComparisonMode) {
  return mode === 'shape' ? value.toFixed(3) : value.toFixed(0);
}

function render() {
  const state = session.getState();
  const derived = deriveComparison(state.mode);
  const modeLabel = state.mode === 'shape' ? 'unit-area shape' : 'raw counts';

  integralA.value = String(derived.integralA);
  integralB.value = String(derived.integralB);
  meanA.value = derived.meanA.toFixed(2);
  meanB.value = derived.meanB.toFixed(2);
  stdA.value = derived.stdDevA.toFixed(2);
  stdB.value = derived.stdDevB.toFixed(2);

  summary.textContent = state.mode === 'shape'
    ? 'Both histograms now have area 1. Their bin fractions overlap exactly, so the common shape is easy to see; the 12-versus-24 yield difference is intentionally hidden.'
    : 'Sample B has twice as many entries as sample A. Its raw bin counts are therefore twice as high even though the relative pattern across bins is the same.';

  description.textContent = `Paired histogram bars shown as ${modeLabel}. Sample A has ${derived.integralA} entries and sample B has ${derived.integralB}.`;

  const plot = { x: 56, y: 28, width: 600, height: 220 };
  const slotWidth = plot.width / derived.bins.length;
  const barWidth = Math.min(54, slotWidth * 0.34);
  bars.replaceChildren(
    ...derived.bins.flatMap((bin, index) => {
      const center = plot.x + (index + 0.5) * slotWidth;
      const heightA = (bin.a / derived.maxDisplay) * plot.height;
      const heightB = (bin.b / derived.maxDisplay) * plot.height;
      const makeBar = (x: number, height: number, sample: 'A' | 'B') => {
        const rectangle = document.createElementNS(SVG_NAMESPACE, 'rect');
        rectangle.setAttribute('x', String(x));
        rectangle.setAttribute('y', String(plot.y + plot.height - height));
        rectangle.setAttribute('width', String(barWidth));
        rectangle.setAttribute('height', String(height));
        rectangle.setAttribute('rx', '3');
        rectangle.setAttribute('class', `sample-bar sample-bar--${sample.toLowerCase()}`);
        rectangle.setAttribute('aria-hidden', 'true');
        return rectangle;
      };
      return [
        makeBar(center - barWidth - 2, heightA, 'A'),
        makeBar(center + 2, heightB, 'B'),
      ];
    }),
  );

  tableBody.replaceChildren(
    ...derived.bins.map((bin) => {
      const row = document.createElement('tr');
      row.innerHTML = `<th scope="row">[${bin.start.toFixed(0)}, ${bin.end.toFixed(0)})</th><td>${formatValue(bin.a, state.mode)}</td><td>${formatValue(bin.b, state.mode)}</td>`;
      return row;
    }),
  );

  code.textContent = state.mode === 'shape'
    ? [
        '# compare shape, not total yield',
        'hA.Scale(1.0 / hA.Integral())',
        'hB.Scale(1.0 / hB.Integral())',
      ].join('\n')
    : [
        '# inspect the unscaled histograms',
        'hA.Integral()          # total in-range bin content',
        'hA.GetBinContent(1)    # one bin count',
        'hA.GetMean()',
        'hA.GetStdDev()',
      ].join('\n');
}

session.subscribe(render);

modeControls.addEventListener(
  'change',
  (event) => {
    const target = event.target as HTMLInputElement;
    if (target.name !== 'comparison-mode') return;
    const mode = target.value as ComparisonMode;
    session.update((state) => ({ ...state, mode }), `A3 comparison mode: ${mode}`);
  },
  { signal: abortController.signal },
);

prediction.addEventListener(
  'rq-prediction-commit',
  (event) => {
    const { value } = (event as CustomEvent<PredictionCommitDetail>).detail;
    const result = evaluateNormalizationPrediction(value);
    prediction.reveal({
      kind: result.correct ? 'success' : 'misconception',
      heading: result.correct ? 'Prediction supported.' : 'Ask what scaling removes.',
      message: result.message,
    });
  },
  { signal: abortController.signal },
);

transfer.addEventListener(
  'rq-prediction-commit',
  (event) => {
    const { value } = (event as CustomEvent<PredictionCommitDetail>).detail;
    const result = evaluateNormalizationTransfer(value);
    transfer.reveal({
      kind: result.correct ? 'success' : 'misconception',
      heading: result.correct ? 'Transfer complete.' : 'Match normalization to the question.',
      message: result.message,
    });
  },
  { signal: abortController.signal },
);
