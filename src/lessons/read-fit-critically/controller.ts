import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { diagnoseLinearFit, evaluatePrediction, evaluateTransfer, POINT_UNCERTAINTY } from './model.ts';
import type { FitRange } from '../simple-fit/model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const rangeInputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="e5-fit-range"]'));
const slope = document.getElementById('e5-slope')!;
const slopeError = document.getElementById('e5-slope-error')!;
const chi2 = document.getElementById('e5-chi2')!;
const ndf = document.getElementById('e5-ndf')!;
const reducedChi2 = document.getElementById('e5-reduced-chi2')!;
const residualBody = document.getElementById('e5-residual-body')!;
const reportSummary = document.getElementById('e5-report-summary')!;
const residualCaption = document.getElementById('e5-residual-caption')!;

function selectedRange(): FitRange {
  return (rangeInputs.find((input) => input.checked)?.value as FitRange | undefined) ?? 'model-window';
}

function renderDiagnostics() {
  const report = diagnoseLinearFit(selectedRange());
  slope.textContent = report.slope.toFixed(2);
  slopeError.textContent = report.slopeError.toFixed(2);
  chi2.textContent = report.chi2.toFixed(1);
  ndf.textContent = String(report.ndf);
  reducedChi2.textContent = report.reducedChi2.toFixed(1);
  residualBody.replaceChildren(...report.points.map((point) => {
    const row = document.createElement('tr');
    for (const value of [point.x.toFixed(0), point.residual.toFixed(2), point.pull.toFixed(1)]) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    }
    return row;
  }));

  residualCaption.textContent = spanish()
    ? `Residuos para el ajuste seleccionado; cada punto preparado tiene incertidumbre σ = ${POINT_UNCERTAINTY.toFixed(1)}.`
    : `Residuals for the selected fit; each prepared point has uncertainty σ = ${POINT_UNCERTAINTY.toFixed(1)}.`;

  reportSummary.textContent = spanish()
    ? report.range === 'model-window'
      ? 'En 0 ≤ x ≤ 4 los residuos son pequeños y alternan alrededor de cero sin una estructura grande. χ²/ndf = 0.6 es compatible con que esta recta describa esta muestra preparada; no es una regla universal de aprobación.'
      : 'En 0 ≤ x ≤ 6 la incertidumbre de la pendiente es incluso menor, pero los residuos forman una estructura grande y χ²/ndf ≈ 108.8. Más precisión sobre un parámetro no rescata un modelo inadecuado.'
    : report.range === 'model-window'
      ? 'Over 0 ≤ x ≤ 4 the residuals are small and alternate around zero without a large structure. χ²/ndf = 0.6 is compatible with this line describing this prepared sample; it is not a universal pass rule.'
      : 'Over 0 ≤ x ≤ 6 the slope uncertainty is even smaller, but the residuals show a large structure and χ²/ndf ≈ 108.8. More parameter precision does not rescue an inadequate model.';
}

rangeInputs.forEach((input) => input.addEventListener('change', renderDiagnostics));
renderDiagnostics();

const prediction = document.getElementById('e5-prediction') as RQPredictElement;
prediction.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluatePrediction(event.detail.value);
  prediction.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'La incertidumbre del parámetro no diagnostica el modelo por sí sola.' : 'Parameter uncertainty does not diagnose the model by itself.')
      : (spanish() ? 'Separa precisión del parámetro y adecuación del modelo.' : 'Separate parameter precision from model adequacy.'),
    message: spanish()
      ? 'El ajuste de rango completo estima la pendiente con menor incertidumbre, pero deja residuos grandes y estructurados y un χ²/ndf enorme para las incertidumbres declaradas. Esas señales dicen que la recta es inadecuada para los puntos incluidos.'
      : 'The full-range fit estimates the slope with a smaller uncertainty, yet leaves large structured residuals and an enormous χ²/ndf for the stated uncertainties. Those cues say the straight line is inadequate for the included points.',
  });
  document.getElementById('e5-after-prediction')?.removeAttribute('hidden');
});

const transfer = document.getElementById('e5-transfer') as RQPredictElement;
transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateTransfer(event.detail.value);
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Lees el ajuste como evidencia, no como una tabla de parámetros.' : 'You are reading the fit as evidence, not as a parameter table.')
      : (spanish() ? 'Un parámetro preciso todavía puede venir de un modelo malo.' : 'A precise parameter can still come from a bad model.'),
    message: spanish()
      ? 'Primero inspecciona si los residuos muestran estructura y si la bondad de ajuste es coherente con las incertidumbres y el modelo usados. Luego interpreta los parámetros y sus errores. Ningún número aislado sustituye esa lectura conjunta.'
      : 'First inspect whether residuals show structure and whether the goodness-of-fit is consistent with the uncertainties and model used. Then interpret parameters and their errors. No single number replaces that joint reading.',
  });
});
