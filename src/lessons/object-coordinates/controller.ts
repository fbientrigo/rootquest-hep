import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { changedCoordinates, coordinateForQuestion, etaRegion, getPreset } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const reference = getPreset('baseline');
const summary = document.getElementById('d1-summary')!;
const values = {
  pt: document.getElementById('d1-pt')!,
  eta: document.getElementById('d1-eta')!,
  phi: document.getElementById('d1-phi')!,
};
const transverseArrow = document.getElementById('d1-transverse-arrow') as HTMLElement;
const sideArrow = document.getElementById('d1-side-arrow') as HTMLElement;

function renderPreset(id: string) {
  const preset = getPreset(id);
  values.pt.textContent = `${preset.pt.toFixed(0)} GeV`;
  values.eta.textContent = preset.eta.toFixed(2);
  values.phi.textContent = `${preset.phi.toFixed(2)} rad`;
  transverseArrow.style.setProperty('--phi', `${preset.phi}rad`);
  transverseArrow.style.setProperty('--pt-scale', String(Math.min(1, preset.pt / 70)));
  const region = etaRegion(preset.eta);
  sideArrow.dataset.region = region;

  const changed = changedCoordinates(reference, preset);
  const label = changed.length === 0 ? 'none' : changed.join(', ');
  summary.textContent = spanish()
    ? `Fotón sintético: pT=${preset.pt.toFixed(0)} GeV, eta=${preset.eta.toFixed(2)}, phi=${preset.phi.toFixed(2)} rad. Respecto al fotón base cambia: ${label}.`
    : `Synthetic photon: pT=${preset.pt.toFixed(0)} GeV, eta=${preset.eta.toFixed(2)}, phi=${preset.phi.toFixed(2)} rad. Relative to the baseline photon, changed: ${label}.`;
}

document.querySelectorAll<HTMLInputElement>('input[name="photon-preset"]').forEach((input) => {
  input.addEventListener('change', () => renderPreset(input.value));
});
renderPreset('baseline');

function wirePrediction(id: string, question: 'transverse-hardness' | 'around-beam' | 'beam-direction') {
  const predict = document.getElementById(id) as RQPredictElement;
  predict.addEventListener('rq-prediction-commit', (rawEvent) => {
    const event = rawEvent as CustomEvent<PredictionCommitDetail>;
    const answer = coordinateForQuestion(question);
    const correct = event.detail.value === answer;
    predict.reveal({
      kind: correct ? 'success' : 'misconception',
      heading: correct
        ? (spanish() ? 'Coordenada correcta.' : 'Correct coordinate.')
        : (spanish() ? 'Esa coordenada responde otra pregunta.' : 'That coordinate answers a different question.'),
      message: question === 'transverse-hardness'
        ? (spanish() ? 'pT mide la magnitud del momento en el plano perpendicular al haz.' : 'pT measures the momentum magnitude in the plane perpendicular to the beam.')
        : question === 'around-beam'
          ? (spanish() ? 'phi es el ángulo azimutal alrededor del eje del haz, medido en el plano transversal.' : 'phi is the azimuthal angle around the beam axis, measured in the transverse plane.')
          : (spanish() ? 'eta codifica la dirección respecto al eje del haz: eta=0 es transversal y valores grandes de |eta| son más forward.' : 'eta encodes direction relative to the beam axis: eta=0 is transverse and large |eta| is more forward.'),
    });
  });
}

wirePrediction('d1-predict', 'around-beam');
wirePrediction('d1-transfer', 'beam-direction');
