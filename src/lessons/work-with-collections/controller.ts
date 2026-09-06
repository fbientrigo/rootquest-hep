import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { D3_EVENTS, evaluatePrediction, evaluateTransfer, summarizeCollection } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const eventInputs = [...document.querySelectorAll<HTMLInputElement>('input[name="d3-event"]')];
const thresholdInputs = [...document.querySelectorAll<HTMLInputElement>('input[name="d3-threshold"]')];
const sourceOutput = document.getElementById('d3-source')!;
const maskOutput = document.getElementById('d3-mask')!;
const selectedOutput = document.getElementById('d3-selected')!;
const countOutput = document.getElementById('d3-count')!;
const sumOutput = document.getElementById('d3-sum')!;
const summary = document.getElementById('d3-summary')!;

function currentValue(inputs: HTMLInputElement[]) {
  return inputs.find((input) => input.checked)?.value ?? inputs[0]?.value ?? '0';
}

function render() {
  const eventIndex = Number(currentValue(eventInputs));
  const threshold = Number(currentValue(thresholdInputs));
  const event = D3_EVENTS[eventIndex] ?? D3_EVENTS[0];
  const snapshot = summarizeCollection(event.photonPt, threshold);

  sourceOutput.textContent = `[${snapshot.source.join(', ')}] GeV`;
  maskOutput.textContent = `[${snapshot.mask.map((value) => value ? 'true' : 'false').join(', ')}]`;
  selectedOutput.textContent = `[${snapshot.selected.join(', ')}] GeV`;
  countOutput.textContent = String(snapshot.count);
  sumOutput.textContent = `${snapshot.sumPt} GeV`;
  summary.textContent = spanish()
    ? `El evento ${event.label} contiene ${snapshot.source.length} fotones. Con pT > ${threshold} GeV, RVec conserva ${snapshot.count} y su suma de pT es ${snapshot.sumPt} GeV.`
    : `Event ${event.label} contains ${snapshot.source.length} photons. With pT > ${threshold} GeV, RVec keeps ${snapshot.count} and their summed pT is ${snapshot.sumPt} GeV.`;
}

[...eventInputs, ...thresholdInputs].forEach((input) => input.addEventListener('change', render));
render();

const prediction = document.getElementById('d3-predict') as RQPredictElement;
prediction.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluatePrediction(event.detail.value);
  prediction.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct ? (spanish() ? 'La colección se resume directamente.' : 'The collection summarizes directly.') : (spanish() ? 'No cuentes entradas a mano.' : 'Do not count entries by hand.'),
    message: correct
      ? (spanish() ? 'Para [65, 44, 31, 18] con pT > 40 GeV quedan [65, 44]: size() da 2 y Sum da 109 GeV.' : 'For [65, 44, 31, 18] with pT > 40 GeV, [65, 44] remain: size() gives 2 and Sum gives 109 GeV.')
      : (spanish() ? 'La máscara actúa sobre todos los elementos de la colección. Después size() y Sum() resumen la colección resultante sin bookkeeping manual.' : 'The mask acts on every collection element. Then size() and Sum() summarize the resulting collection without manual bookkeeping.'),
  });
});

const transfer = document.getElementById('d3-transfer') as RQPredictElement;
transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateTransfer(event.detail.value);
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct ? (spanish() ? 'Patrón transferido.' : 'Pattern transferred.') : (spanish() ? 'Resume la colección seleccionada.' : 'Summarize the selected collection.'),
    message: correct
      ? (spanish() ? 'Primero seleccionas con la máscara; después Sum(selectedJetPt) produce un escalar por evento con el pT total de los jets seleccionados.' : 'First select with the mask; then Sum(selectedJetPt) produces one scalar per event with the total pT of the selected jets.')
      : (spanish() ? 'No necesitas un loop manual para sumar los jets seleccionados: VecOps puede resumir la RVec directamente.' : 'You do not need a manual loop to add the selected jets: VecOps can summarize the RVec directly.'),
  });
});
