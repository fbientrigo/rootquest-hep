import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { deriveTradeoff, evaluateDirectionPrediction, evaluateTransfer } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const threshold = document.getElementById('e1-threshold') as HTMLInputElement;
const thresholdOutput = document.getElementById('e1-threshold-value')!;
const signalOutput = document.getElementById('e1-signal-efficiency')!;
const rejectionOutput = document.getElementById('e1-background-rejection')!;
const signalCount = document.getElementById('e1-signal-count')!;
const backgroundCount = document.getElementById('e1-background-count')!;
const summary = document.getElementById('e1-summary')!;

const pct = (value: number) => `${Math.round(value * 100)}%`;

function render() {
  const snapshot = deriveTradeoff(Number(threshold.value));
  thresholdOutput.textContent = `${snapshot.threshold} GeV`;
  signalOutput.textContent = pct(snapshot.signalEfficiency);
  rejectionOutput.textContent = pct(snapshot.backgroundRejection);
  signalCount.textContent = `${snapshot.signalKept}/${snapshot.signalTotal}`;
  backgroundCount.textContent = `${snapshot.backgroundKept}/${snapshot.backgroundTotal}`;
  summary.textContent = spanish()
    ? `Con pT ≥ ${snapshot.threshold} GeV se conserva ${snapshot.signalKept} de ${snapshot.signalTotal} señales y se rechaza ${snapshot.backgroundTotal - snapshot.backgroundKept} de ${snapshot.backgroundTotal} fondos.`
    : `At pT ≥ ${snapshot.threshold} GeV, ${snapshot.signalKept} of ${snapshot.signalTotal} signal examples survive and ${snapshot.backgroundTotal - snapshot.backgroundKept} of ${snapshot.backgroundTotal} background examples are rejected.`;
}

threshold.addEventListener('input', render);
render();

const prediction = document.getElementById('e1-direction') as RQPredictElement;
prediction.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateDirectionPrediction(event.detail.value);
  const loose = deriveTradeoff(30);
  const tight = deriveTradeoff(40);
  prediction.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'El corte compra rechazo con eficiencia.' : 'The cut buys rejection with efficiency.')
      : (spanish() ? 'Un corte más estricto no mejora ambas cosas a la vez.' : 'A tighter cut does not improve both quantities at once.'),
    message: spanish()
      ? `Al subir de 30 a 40 GeV, la eficiencia de señal baja de ${pct(loose.signalEfficiency)} a ${pct(tight.signalEfficiency)}, mientras el rechazo de fondo sube de ${pct(loose.backgroundRejection)} a ${pct(tight.backgroundRejection)}.`
      : `Raising the threshold from 30 to 40 GeV lowers signal efficiency from ${pct(loose.signalEfficiency)} to ${pct(tight.signalEfficiency)}, while background rejection rises from ${pct(loose.backgroundRejection)} to ${pct(tight.backgroundRejection)}.`,
  });
  document.getElementById('e1-after-prediction')?.removeAttribute('hidden');
});

const transfer = document.getElementById('e1-transfer') as RQPredictElement;
transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateTransfer(event.detail.value);
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Compromiso identificado.' : 'Trade-off identified.')
      : (spanish() ? 'Comprueba ambas restricciones.' : 'Check both constraints.'),
    message: spanish()
      ? '40 GeV conserva 3/5 = 60% de la señal y rechaza 4/7 ≈ 57% del fondo. 30 GeV no rechaza suficiente fondo; 50 GeV pierde demasiada señal.'
      : '40 GeV keeps 3/5 = 60% of the signal and rejects 4/7 ≈ 57% of the background. 30 GeV does not reject enough background; 50 GeV loses too much signal.',
  });
});
