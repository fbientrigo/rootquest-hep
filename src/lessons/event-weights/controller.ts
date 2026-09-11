import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { displayedBinValues, evaluatePrediction, evaluateTransfer, totalWeight, type HistogramMode } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const modeInputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="e2-mode"]'));
const bars = Array.from(document.querySelectorAll<HTMLElement>('[data-e2-bin-value]'));
const total = document.getElementById('e2-total')!;
const summary = document.getElementById('e2-summary')!;

function render() {
  const selected = modeInputs.find((input) => input.checked)?.value as HistogramMode | undefined;
  const mode: HistogramMode = selected ?? 'entries';
  const values = displayedBinValues(mode);
  bars.forEach((bar, index) => {
    bar.textContent = String(values[index]);
  });
  total.textContent = mode === 'entries' ? '6' : totalWeight().toFixed(1);
  summary.textContent = spanish()
    ? mode === 'entries'
      ? 'El conteo bruto da 6 entradas. Cada fila aporta exactamente una unidad.'
      : 'La suma ponderada da 8.0. Cada fila aporta su event_weight, no necesariamente una unidad.'
    : mode === 'entries'
      ? 'The raw count is 6 entries. Every row contributes exactly one unit.'
      : 'The weighted sum is 8.0. Each row contributes its event_weight, not necessarily one unit.';
}

modeInputs.forEach((input) => input.addEventListener('change', render));
render();

const prediction = document.getElementById('e2-prediction') as RQPredictElement;
prediction.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluatePrediction(event.detail.value);
  prediction.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Los pesos cambian la contribución, no las filas.' : 'Weights change contribution, not rows.')
      : (spanish() ? 'Mira qué fila tiene el mayor peso.' : 'Look at which row has the largest weight.'),
    message: spanish()
      ? 'El bin 140–160 GeV contiene una sola entrada, M6, pero su peso 2.5 hace que pase de altura 1 a 2.5: es el mayor aumento de los tres bins.'
      : 'The 140–160 GeV bin contains only M6, but its weight 2.5 changes its height from 1 to 2.5: the largest increase of the three bins.',
  });
  document.getElementById('e2-after-prediction')?.removeAttribute('hidden');
});

const transfer = document.getElementById('e2-transfer') as RQPredictElement;
transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateTransfer(event.detail.value);
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Sumaste contribuciones, no eventos.' : 'You summed contributions, not events.')
      : (spanish() ? 'No cuentes filas cuando la pregunta pide peso.' : 'Do not count rows when the question asks for weight.'),
    message: spanish()
      ? 'Dos eventos con pesos 0.4 y 1.6 producen contenido ponderado 2.0 en ese bin, aunque el conteo bruto siga siendo 2.'
      : 'Two events with weights 0.4 and 1.6 produce weighted bin content 2.0, even though the raw entry count remains 2.',
  });
});
