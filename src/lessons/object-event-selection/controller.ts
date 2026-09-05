import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { D2_EVENTS, evaluateMaskPrediction, evaluateTransfer, selectObjects } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const eventInputs = [...document.querySelectorAll<HTMLInputElement>('input[name="d2-event"]')];
const maskOutput = document.getElementById('d2-mask')!;
const selectedOutput = document.getElementById('d2-selected')!;
const eventOutput = document.getElementById('d2-event-result')!;
const summary = document.getElementById('d2-summary')!;

function render(index: number) {
  const snapshot = selectObjects(D2_EVENTS[index]);
  maskOutput.textContent = `[${snapshot.mask.map((value) => value ? 'true' : 'false').join(', ')}]`;
  selectedOutput.textContent = `[${snapshot.selected.map((photon) => photon.pt).join(', ')}] GeV`;
  eventOutput.textContent = snapshot.eventPasses
    ? (spanish() ? 'pasa' : 'passes')
    : (spanish() ? 'no pasa' : 'fails');
  summary.textContent = spanish()
    ? `La máscara conserva ${snapshot.selected.length} de ${snapshot.photons.length} fotones. El evento ${snapshot.eventPasses ? 'pasa' : 'no pasa'} porque exige al menos 2 fotones seleccionados.`
    : `The mask keeps ${snapshot.selected.length} of ${snapshot.photons.length} photons. The event ${snapshot.eventPasses ? 'passes' : 'fails'} because it requires at least 2 selected photons.`;
}

eventInputs.forEach((input) => input.addEventListener('change', () => render(Number(input.value))));
render(0);

const prediction = document.getElementById('d2-predict') as RQPredictElement;
prediction.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateMaskPrediction(event.detail.value);
  prediction.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct ? (spanish() ? 'Objeto primero, evento después.' : 'Objects first, event second.') : (spanish() ? 'La máscara todavía no decide el evento.' : 'The mask does not decide the event yet.'),
    message: correct
      ? (spanish() ? 'La máscara responde una pregunta por fotón. La condición del evento usa después cuántos objetos quedaron seleccionados.' : 'The mask answers one question per photon. The event condition then uses how many selected objects remain.')
      : (spanish() ? 'Una máscara selecciona elementos de la colección. Hace falta una condición escalar posterior para aceptar o rechazar la entrada completa.' : 'A mask selects elements of the collection. A later scalar condition is needed to accept or reject the whole entry.'),
  });
});

const transfer = document.getElementById('d2-transfer') as RQPredictElement;
transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateTransfer(event.detail.value);
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct ? (spanish() ? 'Separación correcta.' : 'Correct separation.') : (spanish() ? 'No mezcles los dos niveles.' : 'Keep the two levels separate.'),
    message: correct
      ? (spanish() ? 'Primero seleccionas jets con una máscara; después preguntas si el evento contiene suficientes jets seleccionados.' : 'First select jets with a mask; then ask whether the event contains enough selected jets.')
      : (spanish() ? 'El corte por objeto produce una colección seleccionada. El requisito de multiplicidad decide después el evento.' : 'The object cut produces a selected collection. The multiplicity requirement decides the event afterward.'),
  });
});
