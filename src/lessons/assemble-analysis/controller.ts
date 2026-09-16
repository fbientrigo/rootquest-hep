import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { evaluatePlan, evaluateTransfer } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';

const prediction = document.getElementById('f1-plan') as RQPredictElement;
prediction.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluatePlan(event.detail.value);
  prediction.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'La pregunta determina el análisis.' : 'The question determines the analysis.')
      : (spanish() ? 'No empieces por el gráfico o por todas las columnas.' : 'Do not start from a plot or from every column.'),
    message: spanish()
      ? 'Primero traduce la pregunta a entradas, columnas necesarias, cantidades derivadas, selección y salida. Así cada operación tiene una razón.'
      : 'First translate the question into inputs, required columns, derived quantities, selection and output. Then every operation has a reason.',
  });
  document.getElementById('f1-after-plan')?.removeAttribute('hidden');
});

const transfer = document.getElementById('f1-transfer') as RQPredictElement;
transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateTransfer(event.detail.value);
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Deriva, selecciona y recién entonces resume.' : 'Derive, select, then summarize.')
      : (spanish() ? 'Ordena las operaciones por dependencia causal.' : 'Order operations by causal dependency.'),
    message: spanish()
      ? 'Si el corte usa una cantidad derivada, debes crearla antes. El histograma debe recibir sólo los eventos que sobreviven a la selección.'
      : 'If the cut uses a derived quantity, create it first. The histogram should receive only events that survive the selection.',
  });
});
