import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { deriveDataSimulation, evaluatePrediction, evaluateTransfer, type ComparisonMode } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const modeInputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="e3-mode"]'));
const dataCells = Array.from(document.querySelectorAll<HTMLElement>('[data-e3-data]'));
const mcCells = Array.from(document.querySelectorAll<HTMLElement>('[data-e3-mc]'));
const ratioCells = Array.from(document.querySelectorAll<HTMLElement>('[data-e3-ratio]'));
const dataTotal = document.getElementById('e3-data-total')!;
const mcTotal = document.getElementById('e3-mc-total')!;
const summary = document.getElementById('e3-summary')!;

function format(value: number, mode: ComparisonMode): string {
  return mode === 'shape' ? value.toFixed(3) : value.toFixed(1).replace(/\.0$/, '');
}

function render() {
  const selected = modeInputs.find((input) => input.checked)?.value as ComparisonMode | undefined;
  const mode: ComparisonMode = selected ?? 'yield';
  const comparison = deriveDataSimulation(mode);

  dataCells.forEach((cell, index) => { cell.textContent = format(comparison.data[index], mode); });
  mcCells.forEach((cell, index) => { cell.textContent = format(comparison.mc[index], mode); });
  ratioCells.forEach((cell, index) => { cell.textContent = comparison.ratio[index].toFixed(2); });
  dataTotal.textContent = format(comparison.dataTotal, mode);
  mcTotal.textContent = format(comparison.mcTotal, mode);

  summary.textContent = spanish()
    ? mode === 'yield'
      ? 'En rendimiento absoluto, Data contiene el doble del MC total en cada bin: Data/MC = 2.00. La discrepancia de normalización es parte de la comparación.'
      : 'Al normalizar ambas distribuciones a área unitaria, las formas coinciden y Data/MC pasa a 1.00. La información del rendimiento total fue eliminada deliberadamente.'
    : mode === 'yield'
      ? 'In absolute yield, Data contains twice the total MC in every bin: Data/MC = 2.00. The normalization mismatch is part of the comparison.'
      : 'After normalizing both distributions to unit area, the shapes coincide and Data/MC becomes 1.00. The total-yield information was deliberately removed.';
}

modeInputs.forEach((input) => input.addEventListener('change', render));
render();

const prediction = document.getElementById('e3-prediction') as RQPredictElement;
prediction.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluatePrediction(event.detail.value);
  prediction.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Normalizar cambia la pregunta.' : 'Normalization changes the question.')
      : (spanish() ? 'Sigue la información del total.' : 'Track the total-yield information.'),
    message: spanish()
      ? 'Data y MC tienen aquí la misma forma relativa, pero Data tiene el doble de rendimiento. Escalar cada histograma a integral 1 conserva la forma y borra esa diferencia de rendimiento.'
      : 'Data and MC have the same relative shape here, but Data has twice the yield. Scaling each histogram to integral 1 preserves the shape and erases that yield difference.',
  });
  document.getElementById('e3-after-prediction')?.removeAttribute('hidden');
});

const transfer = document.getElementById('e3-transfer') as RQPredictElement;
transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateTransfer(event.detail.value);
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Conservaste la cantidad que quieres probar.' : 'You preserved the quantity you want to test.')
      : (spanish() ? 'No normalices antes de decidir la pregunta.' : 'Do not normalize before deciding the question.'),
    message: spanish()
      ? 'Si preguntas si la simulación predice el rendimiento observado después de una selección, debes conservar la normalización esperada. Área unitaria es apropiada para una pregunta de forma, no para ocultar una diferencia de rendimiento.'
      : 'If you ask whether simulation predicts the observed yield after a selection, keep the expected normalization. Unit-area scaling is appropriate for a shape question, not for hiding a yield difference.',
  });
});
