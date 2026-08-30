import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { FILTER_CRITERIA, predictionIsCorrect, rootFilterCode, survivorsFor, type FilterCriterionId } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const prediction = document.getElementById('c2-prediction') as RQPredictElement;
const transfer = document.getElementById('c2-transfer') as RQPredictElement;
const legend = document.getElementById('c2-prediction-legend') as HTMLElement;
const options = document.getElementById('c2-options') as HTMLElement;
const summary = document.getElementById('c2-summary') as HTMLElement;
const survivorList = document.getElementById('c2-survivors') as HTMLUListElement;
const code = document.getElementById('c2-code') as HTMLElement;
const criterionInputs = [...document.querySelectorAll<HTMLInputElement>('input[name="criterion"]')];

let criterion: FilterCriterionId = 'two-photons';
let revealed = false;

const labels = {
  'two-photons': { en: 'Exactly two photons: which rows survive?', es: 'Exactamente dos fotones: ¿qué filas sobreviven?' },
  'hard-leading': { en: 'leading pT > 35 GeV: which rows survive?', es: 'leading pT > 35 GeV: ¿qué filas sobreviven?' },
  'mass-window': { en: '120 ≤ mass < 130 GeV: which rows survive?', es: '120 ≤ mass < 130 GeV: ¿qué filas sobreviven?' },
} as const;

const choices: Record<FilterCriterionId, readonly string[][]> = {
  'two-photons': [['E1','E3','E4','E6'], ['E1','E4','E6'], ['E2','E5']],
  'hard-leading': [['E1','E2','E4','E5','E6'], ['E1','E4','E6'], ['E3']],
  'mass-window': [['E1','E4','E6'], ['E1','E3','E4','E6'], ['E2','E5']],
};

function renderOptions() {
  options.replaceChildren(...choices[criterion].map((ids, index) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'survivors';
    input.required = index === 0;
    input.value = ids.join('-').toLowerCase();
    const span = document.createElement('span');
    span.textContent = ids.join(', ');
    label.append(input, span);
    return label;
  }));
}

function renderUnrevealed() {
  legend.textContent = labels[criterion][spanish() ? 'es' : 'en'];
  summary.textContent = spanish() ? 'Predice primero para revelar la selección.' : 'Predict first to reveal the selection.';
  survivorList.replaceChildren();
  code.textContent = rootFilterCode(criterion);
  renderOptions();
}

function revealSelection() {
  revealed = true;
  const survivors = survivorsFor(criterion);
  summary.textContent = spanish()
    ? `${survivors.length} de 6 filas cumplen ${FILTER_CRITERIA[criterion].expression} y permanecen.`
    : `${survivors.length} of 6 rows satisfy ${FILTER_CRITERIA[criterion].expression} and remain.`;
  survivorList.replaceChildren(...survivors.map((id) => {
    const item = document.createElement('li');
    item.textContent = `${id} · ${spanish() ? 'conservado' : 'kept'}`;
    return item;
  }));
}

criterionInputs.forEach((input) => input.addEventListener('change', () => {
  if (!input.checked) return;
  criterion = input.value as FilterCriterionId;
  revealed = false;
  prediction.resetPrediction();
  renderUnrevealed();
}));

prediction.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = predictionIsCorrect(criterion, event.detail.value);
  revealSelection();
  prediction.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct ? (spanish() ? 'Predicción correcta.' : 'Prediction supported.') : (spanish() ? 'Revisa fila por fila.' : 'Check each row.'),
    message: spanish()
      ? 'Filter evalúa el mismo criterio para cada entrada y conserva sólo aquellas donde la condición es verdadera.'
      : 'Filter evaluates the same criterion for each entry and keeps only those where the condition is true.',
  });
});

transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = event.detail.value === 'gte';
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct ? (spanish() ? 'Transferencia completa.' : 'Transfer complete.') : (spanish() ? 'Traduce “al menos”.' : 'Translate “at least”.'),
    message: spanish()
      ? '“Al menos dos” incluye 2, 3, 4…; por eso la condición es photonCount >= 2.'
      : '“At least two” includes 2, 3, 4…; therefore the condition is photonCount >= 2.',
  });
});

renderUnrevealed();
void revealed;
