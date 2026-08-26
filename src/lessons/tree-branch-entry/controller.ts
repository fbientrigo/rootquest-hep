import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import {
  TREE_BRANCHES,
  TREE_ENTRIES,
  createTreeBranchEntryState,
  describeCoordinate,
  evaluateBranchPrediction,
  evaluateTransfer,
  getSelectedBranch,
} from './model.ts';

const spanish = document.documentElement.dataset.language === 'es';
let state = createTreeBranchEntryState();

function byId<T extends Element>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Tree, branch, entry lesson is missing #${id}.`);
  return element as T;
}

const branchButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-b2-branch]')];
const entryInput = byId<HTMLInputElement>('b2-entry');
const entryOutput = byId<HTMLOutputElement>('b2-entry-value');
const selectedBranchName = byId<HTMLElement>('b2-branch-name');
const selectedBranchType = byId<HTMLElement>('b2-branch-type');
const selectedValue = byId<HTMLElement>('b2-selected-value');
const coordinateSummary = byId<HTMLElement>('b2-coordinate-summary');
const code = byId<HTMLElement>('b2-code');
const prediction = byId<RQPredictElement>('b2-prediction');
const transfer = byId<RQPredictElement>('b2-transfer');

function render() {
  const branch = getSelectedBranch(state);
  const coordinate = describeCoordinate(state);

  for (const button of branchButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.b2Branch === branch.id));
  }

  entryInput.value = String(state.entryIndex);
  entryOutput.value = String(state.entryIndex);
  selectedBranchName.textContent = branch.name;
  selectedBranchType.textContent = branch.type;
  selectedValue.textContent = `${coordinate.value}${branch.unit === 'dimensionless' ? '' : ` ${branch.unit}`}`;
  coordinateSummary.textContent = spanish
    ? `Estás leyendo la entrada ${coordinate.entry} de Events y, dentro de esa entrada, la rama ${coordinate.branch}. Cambiar de rama mantiene fija la entrada; cambiar de entrada avanza al siguiente registro del árbol.`
    : `You are reading entry ${coordinate.entry} of Events and, within that entry, branch ${coordinate.branch}. Changing branch keeps the entry fixed; changing entry moves to another record in the tree.`;
  code.textContent = `tree = f.Get("Events")\nfor i, entry in enumerate(tree):\n    if i == ${coordinate.entry}:\n        print(entry.${coordinate.branch})`;
}

for (const button of branchButtons) {
  button.addEventListener('click', () => {
    const selectedBranchId = button.dataset.b2Branch;
    if (!selectedBranchId || !TREE_BRANCHES.some((branch) => branch.id === selectedBranchId)) return;
    state = { ...state, selectedBranchId };
    render();
  });
}

entryInput.addEventListener('input', () => {
  const entryIndex = Math.max(0, Math.min(TREE_ENTRIES - 1, Number(entryInput.value)));
  state = { ...state, entryIndex };
  render();
});

prediction.addEventListener('rq-prediction-commit', (event) => {
  const { value } = (event as CustomEvent<PredictionCommitDetail>).detail;
  const result = evaluateBranchPrediction(value);
  prediction.reveal({
    kind: result.correct ? 'success' : 'misconception',
    heading: spanish
      ? (result.correct ? 'Misma entrada, otro campo.' : 'Separa rama de entrada.')
      : (result.correct ? 'Same entry, different field.' : 'Separate branch from entry.'),
    message: spanish
      ? (result.correct
        ? 'Cambiar de rama conserva el índice de entrada y lee otro campo almacenado para ese mismo registro.'
        : 'Elegir otra rama cambia el campo que inspeccionas; no crea una entrada nueva ni avanza a otro registro.')
      : result.message,
  });
});

transfer.addEventListener('rq-prediction-commit', (event) => {
  const { value } = (event as CustomEvent<PredictionCommitDetail>).detail;
  const result = evaluateTransfer(value);
  transfer.reveal({
    kind: result.correct ? 'success' : 'misconception',
    heading: spanish
      ? (result.correct ? 'Modelo mental útil.' : 'Reasigna los roles.')
      : (result.correct ? 'Useful mental model.' : 'Reassign the roles.'),
    message: spanish
      ? (result.correct
        ? 'Como modelo mental: TTree ≈ dataset, branch ≈ columna y entry ≈ registro tipo fila. Es una analogía para razonar, no una descripción literal de la implementación interna de ROOT.'
        : 'Las ramas organizan campos a través de las entradas; una entrada agrupa los valores correspondientes a un registro del árbol.')
      : result.message,
  });
});

render();
