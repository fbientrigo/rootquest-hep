import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { D6_EVENT, buildCandidate, evaluatePairPrediction, evaluateTransfer } from './model.ts';

const spanish = () => document.documentElement.dataset.language === 'es';
const snapshot = buildCandidate(D6_EVENT, 30);
const reveal = document.getElementById('d6-after-prediction')!;
const maskOutput = document.getElementById('d6-mask')!;
const selectedOutput = document.getElementById('d6-selected')!;
const orderedOutput = document.getElementById('d6-ordered')!;
const candidateOutput = document.getElementById('d6-candidate')!;
const massOutput = document.getElementById('d6-mass')!;

function renderSnapshot() {
  maskOutput.textContent = snapshot.mask.map((keep) => keep ? '✓' : '×').join('  ');
  selectedOutput.textContent = snapshot.selected.map((photon) => `${photon.id} (${photon.pt} GeV)`).join(' · ');
  orderedOutput.textContent = snapshot.ordered.map((photon) => `${photon.id} (${photon.pt} GeV)`).join(' → ');
  candidateOutput.textContent = snapshot.candidate
    ? `${snapshot.candidate[0].id} + ${snapshot.candidate[1].id}`
    : (spanish() ? 'sin candidato' : 'no candidate');
  massOutput.textContent = snapshot.mass === null ? '—' : `${snapshot.mass.toFixed(1)} GeV`;
}

renderSnapshot();

const pairPrediction = document.getElementById('d6-pair') as RQPredictElement;
pairPrediction.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluatePairPrediction(event.detail.value);
  reveal.hidden = false;
  pairPrediction.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Selecciona primero; ordena después.' : 'Select first; order second.')
      : (spanish() ? 'El orden original no define el candidato.' : 'Input order does not define the candidate.'),
    message: correct
      ? (spanish()
          ? 'D, C y A pasan pT > 30 GeV. Al ordenarlos por pT quedan A, C, D; por eso el candidato usa A + C.'
          : 'D, C and A pass pT > 30 GeV. Ordering them by pT gives A, C, D, so the candidate uses A + C.')
      : (spanish()
          ? 'La selección elimina B, pero todavía debes ordenar los supervivientes por pT. Tomar simplemente los dos primeros elementos conservaría un orden accidental del archivo.'
          : 'The selection removes B, but the survivors still need to be ordered by pT. Simply taking the first two elements would preserve an accidental file order.'),
  });
});

const transfer = document.getElementById('d6-transfer') as RQPredictElement;
transfer.addEventListener('rq-prediction-commit', (rawEvent) => {
  const event = rawEvent as CustomEvent<PredictionCommitDetail>;
  const correct = evaluateTransfer(event.detail.value);
  const tight = buildCandidate(D6_EVENT, 50);
  transfer.reveal({
    kind: correct ? 'success' : 'misconception',
    heading: correct
      ? (spanish() ? 'Primero garantiza dos objetos.' : 'Guarantee two objects first.')
      : (spanish() ? 'No indexes un segundo objeto que no existe.' : 'Do not index a second object that does not exist.'),
    message: correct
      ? (spanish()
          ? `Con pT > 50 GeV sólo sobrevive ${tight.selected[0]?.id ?? 'un fotón'}. El evento debe fallar el requisito de multiplicidad antes de construir p1 y p2.`
          : `With pT > 50 GeV only ${tight.selected[0]?.id ?? 'one photon'} survives. The event must fail the multiplicity requirement before p1 and p2 are constructed.`)
      : (spanish()
          ? 'Subir el corte cambia la colección seleccionada. Si queda un solo fotón, no hay un candidato diphotón de dos objetos que construir.'
          : 'Raising the cut changes the selected collection. If only one photon remains, there is no two-object diphoton candidate to build.'),
  });
});
