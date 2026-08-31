import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { DERIVED_OBSERVABLES, rootDefineCode, rowsWithDefinedColumn, transferPredictionIsCorrect, type DerivedObservableId } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const prediction = document.getElementById('c3-prediction') as RQPredictElement;
const transfer = document.getElementById('c3-transfer') as RQPredictElement;
const summary = document.getElementById('c3-summary') as HTMLElement;
const tbody = document.getElementById('c3-derived-body') as HTMLTableSectionElement;
const derivedHeading = document.getElementById('c3-derived-heading') as HTMLElement;
const code = document.getElementById('c3-code') as HTMLElement;
const observableInputs = [...document.querySelectorAll<HTMLInputElement>('input[name="observable"]')];

let observableId: DerivedObservableId = 'mass-offset';

function formatValue(value: number | boolean) {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return `${value > 0 ? '+' : ''}${value.toFixed(1)} GeV`;
}

function renderHidden() {
  const observable = DERIVED_OBSERVABLES[observableId];
  derivedHeading.textContent = observable.column;
  code.textContent = rootDefineCode(observableId);
  summary.textContent = spanish()
    ? 'Predice primero si Define cambia el número de filas.'
    : 'Predict first whether Define changes the number of rows.';
  tbody.replaceChildren();
}

function revealRows() {
  const rows = rowsWithDefinedColumn(observableId);
  summary.textContent = spanish()
    ? `${rows.length} de ${rows.length} filas siguen presentes. Define añadió ${DERIVED_OBSERVABLES[observableId].column}; no aplicó una selección.`
    : `${rows.length} of ${rows.length} rows are still present. Define added ${DERIVED_OBSERVABLES[observableId].column}; it did not apply a selection.`;
  tbody.replaceChildren(...rows.map((row) => {
    const tr = document.createElement('tr');
    const id = document.createElement('th');
    id.scope = 'row';
    id.textContent = row.id;
    const mass = document.createElement('td');
    mass.textContent = `${row.mass} GeV`;
    const pt = document.createElement('td');
    pt.textContent = `${row.leadingPhotonPt} GeV`;
    const derived = document.createElement('td');
    derived.textContent = formatValue(row.derivedValue);
    tr.append(id, mass, pt, derived);
    return tr;
  }));
}

observableInputs.forEach((input) => input.addEventListener('change', () => {
  if (!input.checked) return;
  observableId = input.value as DerivedObservableId;
  prediction.resetPrediction();
  renderHidden();
}));

prediction.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = event.detail.value === 'same';
  revealRows();
  prediction.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Mismas filas, nueva columna.' : 'Same rows, new column.')
      : (spanish() ? 'Define no es Filter.' : 'Define is not Filter.'),
    message: spanish()
      ? 'Define calcula un valor nuevo para cada fila que llega a ese nodo. No elimina filas sólo porque el valor resulte negativo o false.'
      : 'Define computes a new value for each row that reaches that node. It does not remove rows just because the value is negative or false.',
  });
});

transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = transferPredictionIsCorrect(event.detail.value);
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Transferencia completa.' : 'Transfer complete.')
      : (spanish() ? 'Una columna booleana no es una selección.' : 'A boolean column is not a selection.'),
    message: spanish()
      ? 'df.Define("isHard", "leadingPhotonPt > 35") conserva todas las filas y añade true/false. Para eliminar las false necesitarías Filter.'
      : 'df.Define("isHard", "leadingPhotonPt > 35") keeps every row and adds true/false. Removing the false rows would require Filter.',
  });
});

renderHidden();
