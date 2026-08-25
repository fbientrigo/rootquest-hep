import { RQPredictElement, type PredictionCommitDetail } from '../../learning';
import { demoRootFile, evaluateInspectionTransfer, evaluateObjectChoice, getRootObject } from './model.ts';

const spanish = document.documentElement.dataset.language === 'es';

function byId<T extends Element>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`ROOT file inspection lesson is missing #${id}.`);
  return element as T;
}

const objectButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-root-object]')];
const selectedName = byId<HTMLElement>('b1-selected-name');
const selectedClass = byId<HTMLElement>('b1-selected-class');
const selectedTitle = byId<HTMLElement>('b1-selected-title');
const selectedDetail = byId<HTMLElement>('b1-selected-detail');
const getCode = byId<HTMLElement>('b1-get-code');
const selectionSummary = byId<HTMLElement>('b1-selection-summary');
const prediction = byId<RQPredictElement>('b1-prediction');
const transfer = byId<RQPredictElement>('b1-transfer');

function selectObject(name: string) {
  const object = getRootObject(name);
  if (!object) return;

  for (const button of objectButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.rootObject === name));
  }

  selectedName.textContent = object.name;
  selectedClass.textContent = object.kind;
  selectedTitle.textContent = object.title;
  selectedDetail.textContent = object.detail;
  getCode.textContent = `obj = f.Get("${object.name}")`;
  selectionSummary.textContent = spanish
    ? `Seleccionaste ${object.name}, un ${object.kind}. El nombre almacenado es lo que usa Get para recuperar ese objeto.`
    : `You selected ${object.name}, a ${object.kind}. The stored name is what Get uses to retrieve that object.`;
}

for (const button of objectButtons) {
  button.addEventListener('click', () => selectObject(button.dataset.rootObject ?? ''));
}

prediction.addEventListener('rq-prediction-commit', (event) => {
  const { value } = (event as CustomEvent<PredictionCommitDetail>).detail;
  const result = evaluateObjectChoice(value);
  prediction.reveal({
    kind: result.correct ? 'success' : 'misconception',
    heading: spanish
      ? (result.correct ? 'Objeto identificado.' : 'Lee primero el inventario.')
      : (result.correct ? 'Object identified.' : 'Read the inventory first.'),
    message: spanish
      ? (result.correct
        ? 'El histograma de masa está almacenado con el nombre m_gg; por eso Get("m_gg") recupera ese objeto.'
        : 'El listado muestra primero nombres y clases. Recupera el objeto cuyo nombre y tipo responden a la pregunta.')
      : result.message,
  });
});

transfer.addEventListener('rq-prediction-commit', (event) => {
  const { value } = (event as CustomEvent<PredictionCommitDetail>).detail;
  const result = evaluateInspectionTransfer(value);
  transfer.reveal({
    kind: result.correct ? 'success' : 'misconception',
    heading: spanish
      ? (result.correct ? 'Transferencia completa.' : 'No adivines la estructura.')
      : (result.correct ? 'Transfer complete.' : 'Do not guess the structure.'),
    message: spanish
      ? (result.correct
        ? 'Primero inspecciona el contenido del archivo; después recupera el objeto cuyo nombre y clase puedes justificar.'
        : 'Adivinar un nombre omite la evidencia que entrega el propio archivo. Lista o inspecciona su contenido primero.')
      : result.message,
  });
});

selectObject(demoRootFile.objects[0].name);
