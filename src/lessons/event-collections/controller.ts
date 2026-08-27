import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import {
  COLLECTION_ENTRIES,
  evaluateCollectionTransfer,
  evaluateMultiplicityPrediction,
  getEventCollectionSnapshot,
} from './model.ts';

const spanish = document.documentElement.dataset.language === 'es';
let entryIndex = 0;

function byId<T extends Element>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Collections inside events lesson is missing #${id}.`);
  return element as T;
}

const entryInput = byId<HTMLInputElement>('b3-entry');
const entryOutput = byId<HTMLOutputElement>('b3-entry-value');
const photonValues = byId<HTMLElement>('b3-photon-values');
const photonCount = byId<HTMLElement>('b3-photon-count');
const eventWeight = byId<HTMLElement>('b3-event-weight');
const summary = byId<HTMLElement>('b3-summary');
const code = byId<HTMLElement>('b3-code');
const prediction = byId<RQPredictElement>('b3-prediction');
const transfer = byId<RQPredictElement>('b3-transfer');

function render() {
  const snapshot = getEventCollectionSnapshot(entryIndex);
  entryInput.value = String(snapshot.entryIndex);
  entryOutput.value = String(snapshot.entryIndex);
  photonCount.textContent = String(snapshot.photonCount);
  eventWeight.textContent = String(snapshot.eventWeight);

  photonValues.replaceChildren(
    ...snapshot.photonPt.map((value, index) => {
      const item = document.createElement('li');
      item.textContent = spanish
        ? `fotón ${index + 1}: ${value} GeV`
        : `photon ${index + 1}: ${value} GeV`;
      return item;
    }),
  );

  summary.textContent = spanish
    ? `La entrada ${snapshot.entryIndex} sigue siendo una sola entrada: photon_pt contiene ${snapshot.photonCount} ${snapshot.photonCount === 1 ? 'valor' : 'valores'} dentro de ella, mientras event_weight contiene un solo escalar.`
    : `Entry ${snapshot.entryIndex} is still one entry: photon_pt contains ${snapshot.photonCount} ${snapshot.photonCount === 1 ? 'value' : 'values'} inside it, while event_weight contains one scalar.`;

  code.textContent = `df = ROOT.RDataFrame("Events", "events.root")\nwith_counts = df.Define("n_photons", "photon_pt.size()")`;
}

entryInput.addEventListener('input', () => {
  entryIndex = Math.max(0, Math.min(COLLECTION_ENTRIES - 1, Number(entryInput.value)));
  render();
});

prediction.addEventListener('rq-prediction-commit', (event) => {
  const { value } = (event as CustomEvent<PredictionCommitDetail>).detail;
  const result = evaluateMultiplicityPrediction(value);
  prediction.reveal({
    kind: result.correct ? 'success' : 'misconception',
    heading: spanish
      ? (result.correct ? 'Una entrada, varios objetos.' : 'No confundas objetos con entradas.')
      : (result.correct ? 'One entry, several objects.' : 'Do not confuse objects with entries.'),
    message: spanish
      ? (result.correct
        ? 'Una rama-colección puede guardar tres valores de fotones dentro de una sola entrada, mientras event_weight mantiene un escalar para esa misma entrada.'
        : 'La colección cambia cuántos valores puede guardar una rama dentro de una entrada; no convierte esos valores en entradas separadas.')
      : result.message,
  });
});

transfer.addEventListener('rq-prediction-commit', (event) => {
  const { value } = (event as CustomEvent<PredictionCommitDetail>).detail;
  const result = evaluateCollectionTransfer(value);
  transfer.reveal({
    kind: result.correct ? 'success' : 'misconception',
    heading: spanish
      ? (result.correct ? 'Separaste evento y colección.' : 'Cuenta niveles distintos.')
      : (result.correct ? 'Event and collection separated.' : 'Count different levels.'),
    message: spanish
      ? (result.correct
        ? 'Un jet_pt con tres elementos representa tres valores de jets dentro de una sola entrada tipo evento; run_number sigue siendo un escalar para esa entrada.'
        : 'Cuenta por separado las entradas y los elementos de una colección: tres elementos de jet_pt pueden pertenecer a una sola entrada.')
      : result.message,
  });
});

render();
