import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { buildCutflow, evaluateFinalCountInference, evaluateTransfer, largestAbsoluteLoss } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const inference = document.getElementById('c5-inference') as RQPredictElement;
const diagnosis = document.getElementById('c5-diagnosis') as RQPredictElement;
const transfer = document.getElementById('c5-transfer') as RQPredictElement;
const revealButton = document.getElementById('c5-run-report') as HTMLButtonElement;
const report = document.getElementById('c5-report') as HTMLElement;
const reportFeedback = document.getElementById('c5-report-feedback') as HTMLElement;

inference.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateFinalCountInference(event.detail.value);
  inference.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'El conteo final no localiza la pérdida.' : 'The final count does not locate the loss.')
      : (spanish() ? 'Falta información por etapa.' : 'Stage-by-stage evidence is missing.'),
    message: spanish()
      ? 'Saber que sobreviven 3 de 6 eventos no dice cuántos rechazó cada filtro. Para diagnosticar el pipeline hay que medir cada etapa.'
      : 'Knowing that 3 of 6 events survive does not tell you how many each filter rejected. Diagnose the pipeline by measuring each stage.',
  });
  revealButton.disabled = false;
});

revealButton.addEventListener('click', () => {
  report.hidden = false;
  diagnosis.hidden = false;
  reportFeedback.textContent = spanish()
    ? 'Report hace visible dónde cambia la muestra: el primer filtro rechaza 2 eventos; el segundo rechaza 1 de los 4 que recibe.'
    : 'Report makes the losses visible: the first filter rejects 2 events; the second rejects 1 of the 4 it receives.';
  revealButton.disabled = true;
});

diagnosis.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const largest = largestAbsoluteLoss(buildCutflow());
  const correct = event.detail.value === largest.id;
  diagnosis.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Pérdida localizada.' : 'Loss located.')
      : (spanish() ? 'Compara rejected, no sólo passed.' : 'Compare rejected, not only passed.'),
    message: spanish()
      ? 'Exactly two photons elimina 2 eventos, la mayor pérdida absoluta de este cutflow. Leading photon pT > 35 GeV elimina 1.'
      : 'Exactly two photons removes 2 events, the largest absolute loss in this cutflow. Leading photon pT > 35 GeV removes 1.',
  });
});

transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateTransfer(event.detail.value);
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Transferencia completa.' : 'Transfer complete.')
      : (spanish() ? 'Mide la pérdida entre etapas.' : 'Measure the loss between stages.'),
    message: spanish()
      ? 'Cut A conserva 90 de 100 y pierde 10; Cut B conserva 45 de 90 y pierde 45. Cut B es la primera etapa que conviene investigar.'
      : 'Cut A keeps 90 of 100 and loses 10; Cut B keeps 45 of 90 and loses 45. Cut B is the first stage to investigate.',
  });
});
