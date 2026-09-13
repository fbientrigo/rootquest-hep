import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import {
  FIXED_INTERCEPT,
  fitLinearLeastSquares,
  linearValue,
  evaluatePrediction,
  evaluateTransfer,
  type FitRange,
} from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const slopeInput = document.getElementById('e4-slope') as HTMLInputElement;
const slopeOutput = document.getElementById('e4-slope-output')!;
const previewSummary = document.getElementById('e4-preview-summary')!;
const modelLine = document.getElementById('e4-model-line') as SVGLineElement;
const chartDescription = document.getElementById('e4-chart-description')!;
const rangeInputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="e4-fit-range"]'));
const fitButton = document.getElementById('e4-run-fit') as HTMLButtonElement;
const fitIntercept = document.getElementById('e4-fit-intercept')!;
const fitSlope = document.getElementById('e4-fit-slope')!;
const fitSummary = document.getElementById('e4-fit-summary')!;

const xToSvg = (x: number) => 50 + x * 75;
const yToSvg = (y: number) => 220 - y * 10;

function renderLine(intercept: number, slope: number, minX: number, maxX: number) {
  modelLine.setAttribute('x1', String(xToSvg(minX)));
  modelLine.setAttribute('y1', String(yToSvg(linearValue(minX, intercept, slope))));
  modelLine.setAttribute('x2', String(xToSvg(maxX)));
  modelLine.setAttribute('y2', String(yToSvg(linearValue(maxX, intercept, slope))));
}

function renderPreview() {
  const slope = Number(slopeInput.value);
  const yAtFour = linearValue(4, FIXED_INTERCEPT, slope);
  slopeOutput.textContent = slope.toFixed(1);
  previewSummary.textContent = spanish()
    ? `Con [0] = ${FIXED_INTERCEPT.toFixed(1)} fijo, [1] = ${slope.toFixed(1)} da y(4) = ${yAtFour.toFixed(1)}. Aumentar [1] inclina la recta hacia arriba para x > 0.`
    : `With [0] = ${FIXED_INTERCEPT.toFixed(1)} fixed, [1] = ${slope.toFixed(1)} gives y(4) = ${yAtFour.toFixed(1)}. Increasing [1] tilts the line upward for x > 0.`;
  chartDescription.textContent = spanish()
    ? `Siete puntos sintéticos y una recta de modelo con intercepto ${FIXED_INTERCEPT.toFixed(1)} y pendiente ${slope.toFixed(1)}.`
    : `Seven synthetic points and a model line with intercept ${FIXED_INTERCEPT.toFixed(1)} and slope ${slope.toFixed(1)}.`;
  renderLine(FIXED_INTERCEPT, slope, 0, 6);
}

slopeInput.addEventListener('input', renderPreview);
renderPreview();

const prediction = document.getElementById('e4-prediction') as RQPredictElement;
prediction.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluatePrediction(event.detail.value);
  prediction.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'El rango cambia qué datos tiran del modelo.' : 'The range changes which data pull on the model.')
      : (spanish() ? 'Mira los dos puntos de x alto.' : 'Look at the two high-x points.'),
    message: spanish()
      ? 'Los puntos x = 5 y 6 están muy por encima de la tendencia lineal del intervalo 0–4. Si los incluyes en el mismo ajuste lineal, empujan la pendiente hacia arriba. El rango debe venir del dominio donde el modelo está justificado, no de buscar el resultado que prefieres.'
      : 'The x = 5 and 6 points sit well above the linear trend in 0–4. Including them in the same linear fit pulls the slope upward. The range should come from where the model is justified, not from searching for a preferred result.',
  });
  document.getElementById('e4-after-prediction')?.removeAttribute('hidden');
});

fitButton.addEventListener('click', () => {
  const selected = rangeInputs.find((input) => input.checked)?.value as FitRange | undefined;
  const range: FitRange = selected ?? 'model-window';
  const fit = fitLinearLeastSquares(range);
  fitIntercept.textContent = fit.intercept.toFixed(2);
  fitSlope.textContent = fit.slope.toFixed(2);
  renderLine(fit.intercept, fit.slope, fit.minX, fit.maxX);
  fitSummary.textContent = spanish()
    ? range === 'model-window'
      ? 'Ajustando sólo 0 ≤ x ≤ 4, la recta recupera aproximadamente [0] = 2.04 y [1] = 1.50. Ese es el intervalo donde esta muestra sintética fue construida para obedecer el modelo lineal.'
      : 'Al extender el mismo modelo hasta x = 6, los puntos altos externos tiran de la recta y la pendiente sube a aproximadamente 2.67. El algoritmo no sabe que el modelo dejó de ser apropiado.'
    : range === 'model-window'
      ? 'Fitting only 0 ≤ x ≤ 4 recovers about [0] = 2.04 and [1] = 1.50. That is the interval where this synthetic sample was constructed to follow the linear model.'
      : 'Extending the same model through x = 6 lets the outer high points pull the line, increasing the slope to about 2.67. The algorithm does not know that the model stopped being appropriate.';
  chartDescription.textContent = spanish()
    ? `Siete puntos sintéticos y el resultado del ajuste lineal en el intervalo ${fit.minX} a ${fit.maxX}: intercepto ${fit.intercept.toFixed(2)}, pendiente ${fit.slope.toFixed(2)}.`
    : `Seven synthetic points and the linear-fit result over ${fit.minX} to ${fit.maxX}: intercept ${fit.intercept.toFixed(2)}, slope ${fit.slope.toFixed(2)}.`;
});

const transfer = document.getElementById('e4-transfer') as RQPredictElement;
transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateTransfer(event.detail.value);
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'El código conserva el contrato del modelo.' : 'The code preserves the model contract.')
      : (spanish() ? 'El rango también es parte del modelo.' : 'The range is part of the model too.'),
    message: spanish()
      ? 'Si el modelo está justificado sólo entre 1 y 3, define TF1 en ese intervalo y usa la opción R para que TH1::Fit respete ese rango. No amplíes el ajuste sólo porque existen más bins.'
      : 'If the model is justified only from 1 to 3, define TF1 on that interval and use option R so TH1::Fit respects that range. Do not widen the fit merely because more bins exist.',
  });
});
