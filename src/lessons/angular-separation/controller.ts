import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { D4_PAIRS, angularSeparation, evaluateBoundaryPrediction, evaluateTransfer } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const pairInputs = [...document.querySelectorAll<HTMLInputElement>('input[name="d4-pair"]')];
const deltaEtaOutput = document.getElementById('d4-deta')!;
const deltaPhiOutput = document.getElementById('d4-dphi')!;
const deltaROutput = document.getElementById('d4-dr')!;
const summary = document.getElementById('d4-summary')!;

function renderPair() {
  const index = Number(pairInputs.find((input) => input.checked)?.value ?? '0');
  const pair = D4_PAIRS[index] ?? D4_PAIRS[0];
  const separation = angularSeparation(pair);
  deltaEtaOutput.textContent = separation.deltaEta.toFixed(2);
  deltaPhiOutput.textContent = separation.deltaPhi.toFixed(2);
  deltaROutput.textContent = separation.deltaR.toFixed(2);
  summary.textContent = spanish()
    ? `Par ${pair.label}: Δη = ${separation.deltaEta.toFixed(2)}, Δφ = ${separation.deltaPhi.toFixed(2)} rad y ΔR = ${separation.deltaR.toFixed(2)}.`
    : `Pair ${pair.label}: Δη = ${separation.deltaEta.toFixed(2)}, Δφ = ${separation.deltaPhi.toFixed(2)} rad and ΔR = ${separation.deltaR.toFixed(2)}.`;
}

pairInputs.forEach((input) => input.addEventListener('change', renderPair));
renderPair();

const boundary = document.getElementById('d4-boundary') as RQPredictElement;
boundary.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateBoundaryPrediction(event.detail.value);
  const separation = angularSeparation(D4_PAIRS[2]);
  boundary.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct ? (spanish() ? 'El azimut es periódico.' : 'Azimuth is periodic.') : (spanish() ? 'No restes phi como una recta.' : 'Do not subtract phi as a line.'),
    message: correct
      ? (spanish() ? `3.05 y -3.05 rad están a ambos lados del mismo borde angular. La separación corta es Δφ ≈ ${separation.deltaPhi.toFixed(2)} rad, así que ΔR ≈ ${separation.deltaR.toFixed(2)}.` : `3.05 and -3.05 rad sit on opposite sides of the same angular boundary. The short separation is Δφ ≈ ${separation.deltaPhi.toFixed(2)} rad, so ΔR ≈ ${separation.deltaR.toFixed(2)}.`)
      : (spanish() ? 'phi vuelve a empezar después de ±π. La distancia usa la diferencia angular envuelta más corta, no |3.05 - (-3.05)|.' : 'phi wraps after ±π. The distance uses the shortest wrapped angular difference, not |3.05 - (-3.05)|.'),
  });
});

const transfer = document.getElementById('d4-transfer') as RQPredictElement;
transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateTransfer(event.detail.value);
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct ? (spanish() ? 'Comparaste la distancia completa.' : 'You compared the full distance.') : (spanish() ? 'Usa ambas coordenadas.' : 'Use both coordinates.'),
    message: correct
      ? (spanish() ? 'Para Δη = 0.3 y Δφ = 0.4, ΔR = 0.5. El otro par tiene ΔR ≈ 0.81, aunque su Δη aislado sea menor.' : 'For Δη = 0.3 and Δφ = 0.4, ΔR = 0.5. The other pair has ΔR ≈ 0.81 even though its Δη alone is smaller.')
      : (spanish() ? 'Cerca en eta no basta: ΔR combina la separación en eta y la separación angular envuelta en phi.' : 'Being close in eta is not enough: ΔR combines eta separation with the wrapped angular separation in phi.'),
  });
});
