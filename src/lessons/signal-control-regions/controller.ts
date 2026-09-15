import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { evaluatePrediction, evaluateTransfer, summarizePreparedRegions } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';

const prediction = document.getElementById('e6-prediction') as RQPredictElement;
prediction.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluatePrediction(event.detail.value);
  prediction.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Primero fija la prueba; después mira el resultado.' : 'Freeze the test first; inspect the result second.')
      : (spanish() ? 'Mirar y luego mover la región cambia la pregunta.' : 'Looking first and then moving the region changes the question.'),
    message: spanish()
      ? 'La región de señal se define usando la hipótesis, simulación y estudios de fondo antes de inspeccionar sus datos. Moverla después de ver una fluctuación puede optimizar hacia esa misma fluctuación.'
      : 'Define the signal region from the hypothesis, simulation and background studies before inspecting its data. Moving it after seeing a fluctuation can optimize toward that same fluctuation.',
  });

  const summary = summarizePreparedRegions();
  for (const region of ['control-low', 'signal', 'control-high'] as const) {
    document.getElementById(`e6-${region}-observed`)!.textContent = String(summary[region].observed);
    document.getElementById(`e6-${region}-expected`)!.textContent = String(summary[region].expectedBackground);
  }
  document.getElementById('e6-after-prediction')?.removeAttribute('hidden');
});

const transfer = document.getElementById('e6-transfer') as RQPredictElement;
transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateTransfer(event.detail.value);
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Usas la región de control para aprender sobre el fondo.' : 'You use the control region to learn about background.')
      : (spanish() ? 'No conviertas la región de señal en una herramienta de ajuste.' : 'Do not turn the signal region into a tuning tool.'),
    message: spanish()
      ? 'Una región de control se diseña para ser informativa sobre el fondo y tener poca contribución de señal. Eso permite probar o constreñir el fondo sin usar el contenido observado de la región de señal para decidir sus propios cortes.'
      : 'A control region is designed to be informative about background while having little signal contribution. That lets you test or constrain background without using the observed signal-region content to choose its own cuts.',
  });
});
