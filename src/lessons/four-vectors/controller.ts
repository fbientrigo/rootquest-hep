import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { D5_SCENARIOS, diphotonInvariantMass, evaluateOpeningPrediction, evaluateTransfer } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const scenarioInputs = [...document.querySelectorAll<HTMLInputElement>('input[name="d5-scenario"]')];
const pt1Output = document.getElementById('d5-pt1')!;
const pt2Output = document.getElementById('d5-pt2')!;
const eta1Output = document.getElementById('d5-eta1')!;
const eta2Output = document.getElementById('d5-eta2')!;
const phi1Output = document.getElementById('d5-phi1')!;
const phi2Output = document.getElementById('d5-phi2')!;
const massOutput = document.getElementById('d5-mass')!;
const summary = document.getElementById('d5-summary')!;

function renderScenario() {
  const index = Number(scenarioInputs.find((input) => input.checked)?.value ?? '0');
  const scenario = D5_SCENARIOS[index] ?? D5_SCENARIOS[0];
  const mass = diphotonInvariantMass(scenario);
  pt1Output.textContent = scenario.photon1.pt.toFixed(0);
  pt2Output.textContent = scenario.photon2.pt.toFixed(0);
  eta1Output.textContent = scenario.photon1.eta.toFixed(2);
  eta2Output.textContent = scenario.photon2.eta.toFixed(2);
  phi1Output.textContent = scenario.photon1.phi.toFixed(2);
  phi2Output.textContent = scenario.photon2.phi.toFixed(2);
  massOutput.textContent = mass.toFixed(1);
  summary.textContent = spanish()
    ? `Par ${scenario.label}: al sumar los dos cuatro-momentos, la masa invariante del candidato es ${mass.toFixed(1)} GeV.`
    : `Pair ${scenario.label}: after adding the two four-momenta, the candidate invariant mass is ${mass.toFixed(1)} GeV.`;
}

scenarioInputs.forEach((input) => input.addEventListener('change', renderScenario));
renderScenario();

const opening = document.getElementById('d5-opening') as RQPredictElement;
opening.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateOpeningPrediction(event.detail.value);
  const closeMass = diphotonInvariantMass(D5_SCENARIOS[0]);
  const backMass = diphotonInvariantMass(D5_SCENARIOS[1]);
  opening.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct ? (spanish() ? 'La geometría cambia la masa.' : 'Geometry changes the mass.') : (spanish() ? 'La masa no depende sólo de pT.' : 'Mass does not depend on pT alone.'),
    message: correct
      ? (spanish() ? `Con 50 GeV por fotón, abrir el par desde Δφ = 0.40 hasta π eleva mγγ de ${closeMass.toFixed(1)} a ${backMass.toFixed(1)} GeV.` : `With 50 GeV per photon, opening the pair from Δφ = 0.40 to π raises mγγ from ${closeMass.toFixed(1)} to ${backMass.toFixed(1)} GeV.`)
      : (spanish() ? 'Los dos casos tienen los mismos pT. Lo que cambia es cómo se combinan energía y momento al sumar los cuatro-vectores.' : 'Both cases have the same pT values. What changes is how energy and momentum combine when the four-vectors are added.'),
  });
});

const transfer = document.getElementById('d5-transfer') as RQPredictElement;
transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateTransfer(event.detail.value);
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct ? (spanish() ? 'Escala correcta.' : 'Correct scaling.') : (spanish() ? 'Suma primero los cuatro-momentos.' : 'Add the four-momenta first.'),
    message: correct
      ? (spanish() ? 'Manteniendo la misma geometría y duplicando ambos pT, cada cuatro-momento se duplica y la masa del sistema también: 100 GeV pasa a 200 GeV en este caso idealizado.' : 'Keeping the same geometry and doubling both pT values doubles each four-momentum and the system mass as well: 100 GeV becomes 200 GeV in this idealized case.')
      : (spanish() ? 'La masa candidata no es la suma de las masas individuales. Para fotones tratados como sin masa, mγγ proviene del cuatro-momento total p1 + p2.' : 'The candidate mass is not the sum of the individual masses. For photons treated as massless, mγγ comes from the total four-momentum p1 + p2.'),
  });
});
