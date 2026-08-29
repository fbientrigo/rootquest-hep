import {
  RQFeedbackElement,
  RQPredictElement,
  RQStepperElement,
  type PredictionCommitDetail,
  type StepRequestDetail,
} from '../../learning';
import {
  PIPELINE_EVENTS,
  buildPipelineFrames,
  evaluateFirstFilterPrediction,
  eventStatus,
} from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const frames = buildPipelineFrames();
const copy = {
  input: { en: ['Input', 'No filter has run yet.'], es: ['Entrada', 'Todavía no se ha ejecutado ningún filtro.'] },
  photons: { en: ['Exactly two photons', 'Keep entries where photonCount == 2.'], es: ['Exactamente dos fotones', 'Conserva entradas donde photonCount == 2.'] },
  pt: { en: ['Leading pT > 35 GeV', 'Apply the pT filter only to the survivors of the first filter.'], es: ['pT líder > 35 GeV', 'Aplica el filtro de pT sólo a los sobrevivientes del primer filtro.'] },
} as const;

function byId<T extends Element>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`C1 is missing #${id}`);
  return element as T;
}

const prediction = byId<RQPredictElement>('c1-prediction');
const transfer = byId<RQPredictElement>('c1-transfer');
const stepper = byId<RQStepperElement>('c1-stepper');
const title = byId<HTMLElement>('c1-frame-title');
const rule = byId<HTMLElement>('c1-rule');
const list = byId<HTMLUListElement>('c1-events');
const summary = byId<HTMLElement>('c1-summary');
const feedback = byId<RQFeedbackElement>('c1-feedback');
let step = 0;
let committed = false;

function render() {
  const frame = frames[step];
  const text = copy[frame.id][spanish() ? 'es' : 'en'];
  stepper.setPosition(step, frames.length, text[0]);
  title.textContent = text[0];
  rule.textContent = text[1];
  list.replaceChildren(...PIPELINE_EVENTS.map((event) => {
    const item = document.createElement('li');
    const status = eventStatus(frame, event.id);
    item.className = 'event-card';
    item.dataset.status = status;
    const name = document.createElement('strong');
    name.textContent = event.id;
    const details = document.createElement('span');
    const statusLabel = status === 'removed-now'
      ? (spanish() ? 'Eliminado en este paso' : 'Removed at this step')
      : status === 'removed-before'
        ? (spanish() ? 'Eliminado antes' : 'Removed earlier')
        : (spanish() ? 'Permanece' : 'Remains');
    details.textContent = `${statusLabel} · ${event.photonCount} ${spanish() ? 'fotones' : 'photons'} · ${event.leadingPhotonPt} GeV`;
    item.append(name, details);
    return item;
  }));
  if (spanish()) {
    summary.textContent = `${frame.entered.length} entran; ${frame.removed.length} se eliminan aquí; ${frame.remaining.length} permanecen.`;
  } else {
    const removedVerb = frame.removed.length === 1 ? 'is' : 'are';
    summary.textContent = `${frame.entered.length} enter; ${frame.removed.length} ${removedVerb} removed here; ${frame.remaining.length} remain.`;
  }
}

prediction.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  committed = true;
  const result = evaluateFirstFilterPrediction(event.detail.value);
  prediction.reveal({
    kind: result.correct ? 'success' : 'misconception',
    heading: result.correct
      ? (spanish() ? 'Predicción correcta.' : 'Prediction supported.')
      : (spanish() ? 'Revisa el número de fotones.' : 'Check the photon counts.'),
    message: spanish()
      ? 'E1, E3, E4 y E6 tienen exactamente dos fotones.'
      : 'E1, E3, E4 and E6 each have exactly two photons.',
  });
});

stepper.addEventListener('rq-step-request', (rawEvent) => {
  const event = rawEvent as CustomEvent<StepRequestDetail>;
  if (event.detail.action === 'reset') {
    step = 0;
    committed = false;
    prediction.resetPrediction();
    render();
    return;
  }
  if (event.detail.action === 'next' && step === 0 && !committed) {
    event.preventDefault();
    feedback.show({
      kind: 'hint',
      heading: spanish() ? 'Predice primero.' : 'Predict first.',
      message: spanish()
        ? 'Compromete una predicción antes de revelar el primer filtro.'
        : 'Commit a prediction before revealing the first filter.',
    });
    return;
  }
  step = event.detail.requestedIndex;
  render();
});

transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = event.detail.value === 'survivors';
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Transferencia completa.' : 'Transfer complete.')
      : (spanish() ? 'El pipeline conserva el estado.' : 'The pipeline carries state forward.'),
    message: spanish()
      ? 'El segundo filtro recibe sólo las entradas que sobrevivieron el primero.'
      : 'The second filter receives only entries that survived the first filter.',
  });
});

render();
