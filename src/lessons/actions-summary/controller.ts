import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { ACTION_LABELS, actionMatchesQuestion, questionById } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const prediction = document.getElementById('c4-prediction') as RQPredictElement;
const transfer = document.getElementById('c4-transfer') as RQPredictElement;
const questionSelect = document.getElementById('c4-question') as HTMLSelectElement;
const summary = document.getElementById('c4-summary') as HTMLElement;
const code = document.getElementById('c4-code') as HTMLElement;

let questionId = questionSelect.value;

function resetForQuestion() {
  const question = questionById(questionId);
  prediction.resetPrediction();
  code.textContent = question.code;
  summary.textContent = spanish()
    ? 'Predice primero qué acción corresponde.'
    : 'Predict first which action fits.';
}

questionSelect.addEventListener('change', () => {
  questionId = questionSelect.value;
  resetForQuestion();
});

prediction.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const question = questionById(questionId);
  const correct = actionMatchesQuestion(questionId, event.detail.value);
  const expected = ACTION_LABELS[question.action];

  summary.textContent = spanish()
    ? `${expected} responde directamente esta pregunta. El pipeline no cambia: la acción produce un resultado a partir de sus filas actuales.`
    : `${expected} directly answers this question. The pipeline does not change: the action produces a result from its current rows.`;

  prediction.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Pregunta y acción alineadas.' : 'Question and action aligned.')
      : (spanish() ? `La pregunta pide ${expected}.` : `The question calls for ${expected}.`),
    message: spanish()
      ? 'Elige la acción por la forma del resultado que necesitas: conteo, resumen escalar o distribución.'
      : 'Choose the action by the shape of the result you need: count, scalar summary, or distribution.',
  });
});

transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = event.detail.value === 'min';
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Transferencia completa.' : 'Transfer complete.')
      : (spanish() ? 'Busca la acción que responde directamente.' : 'Look for the action that answers directly.'),
    message: spanish()
      ? 'Min devuelve el valor mínimo procesado de una columna. Histo2D construye una distribución bidimensional y Define crea una columna nueva.'
      : 'Min returns the minimum processed value of a column. Histo2D builds a two-dimensional distribution, while Define creates a new column.',
  });
});

resetForQuestion();
