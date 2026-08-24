import { RQPredictElement, createLessonSession, type PredictionCommitDetail } from '../../learning';
import { evaluateErrorPrediction, evaluateRepresentationTransfer, scaledPoints, yInterval } from './model';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const spanish = document.documentElement.dataset.language === 'es';
function byId<T extends Element>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Measurement Errors lesson is missing #${id}.`);
  return element as T;
}
const session = createLessonSession(() => ({ scale: 1 }));
const abortController = new AbortController();
session.onDispose(() => abortController.abort());
const scale = byId<HTMLInputElement>('a4-error-scale');
const scaleOutput = byId<HTMLOutputElement>('a4-error-scale-output');
const marks = byId<SVGGElement>('a4-points');
const description = byId<SVGDescElement>('a4-graph-description');
const summary = byId<HTMLParagraphElement>('a4-summary');
const code = byId<HTMLElement>('a4-root-code');
const prediction = byId<RQPredictElement>('a4-prediction');
const transfer = byId<RQPredictElement>('a4-transfer');

function render() {
  const { scale: errorScale } = session.getState();
  const points = scaledPoints(errorScale);
  scaleOutput.value = `${errorScale.toFixed(1)}×`;
  const plot = { left: 64, top: 28, width: 560, height: 230, yMin: 1, yMax: 7 };
  const sx = (x: number) => plot.left + ((x - 0.5) / 5) * plot.width;
  const sy = (y: number) => plot.top + plot.height - ((y - plot.yMin) / (plot.yMax - plot.yMin)) * plot.height;
  const nodes: SVGElement[] = [];
  for (const point of points) {
    const [low, high] = yInterval(point);
    const x = sx(point.x); const y = sy(point.y); const yLow = sy(low); const yHigh = sy(high);
    for (const [x1, x2, y1, y2] of [[x, x, yHigh, yLow], [x - 7, x + 7, yHigh, yHigh], [x - 7, x + 7, yLow, yLow]]) {
      const line = document.createElementNS(SVG_NAMESPACE, 'line');
      line.setAttribute('x1', String(x1)); line.setAttribute('x2', String(x2)); line.setAttribute('y1', String(y1)); line.setAttribute('y2', String(y2)); line.setAttribute('class', 'error-line'); nodes.push(line);
    }
    const circle = document.createElementNS(SVG_NAMESPACE, 'circle');
    circle.setAttribute('cx', String(x)); circle.setAttribute('cy', String(y)); circle.setAttribute('r', '6'); circle.setAttribute('class', 'measurement-point'); nodes.push(circle);
  }
  marks.replaceChildren(...nodes);
  const fourth = points[3]; const [low, high] = yInterval(fourth);
  summary.textContent = spanish
    ? `En x = 4, el valor central permanece en ${fourth.y.toFixed(1)} mientras la incertidumbre en y es ±${fourth.ey.toFixed(2)}; el intervalo mostrado va de ${low.toFixed(2)} a ${high.toFixed(2)}.`
    : `At x = 4, the central value stays ${fourth.y.toFixed(1)} while the y uncertainty is ±${fourth.ey.toFixed(2)}; the interval shown is ${low.toFixed(2)} to ${high.toFixed(2)}.`;
  description.textContent = spanish
    ? `Cinco puntos medidos con barras verticales de error escaladas por ${errorScale.toFixed(1)}. Los valores centrales de y no se mueven al cambiar la incertidumbre.`
    : `Five measured points with vertical error bars scaled by ${errorScale.toFixed(1)}. Central y values do not move when uncertainty changes.`;
  code.textContent = ['x  = array("d", [1, 2, 3, 4, 5])','y  = array("d", [2.2, 3.1, 4.0, 4.6, 5.4])','ex = array("d", [0, 0, 0, 0, 0])',`ey = array("d", [${points.map((point) => point.ey.toFixed(2)).join(', ')}])`,'g = ROOT.TGraphErrors(5, x, y, ex, ey)'].join('\n');
}
session.subscribe(render);
scale.addEventListener('input', () => { const value = Number(scale.value); session.update((state) => ({ ...state, scale: value }), `A4 uncertainty scale: ${value}`); }, { signal: abortController.signal });

prediction.addEventListener('rq-prediction-commit', (event) => {
  const { value } = (event as CustomEvent<PredictionCommitDetail>).detail; const result = evaluateErrorPrediction(value);
  prediction.reveal({ kind: result.correct ? 'success' : 'misconception', heading: spanish ? (result.correct ? 'Predicción confirmada.' : 'Separa valor e incertidumbre.') : (result.correct ? 'Prediction supported.' : 'Separate value from uncertainty.'), message: spanish ? (result.correct ? 'Duplicar la incertidumbre en y deja fijo el valor central medido y duplica el semiancho de la barra vertical.' : 'Una barra de incertidumbre describe la incertidumbre reportada alrededor de un punto; no crea eventos ni mueve el valor central medido.') : result.message });
}, { signal: abortController.signal });
transfer.addEventListener('rq-prediction-commit', (event) => {
  const { value } = (event as CustomEvent<PredictionCommitDetail>).detail; const result = evaluateRepresentationTransfer(value);
  transfer.reveal({ kind: result.correct ? 'success' : 'misconception', heading: spanish ? (result.correct ? 'Transferencia completa.' : 'Pregunta qué representa cada marca.') : (result.correct ? 'Transfer complete.' : 'Ask what each mark represents.'), message: spanish ? (result.correct ? 'Usa puntos medidos con barras de error: las posiciones x son condiciones elegidas, los valores y son resultados y las barras llevan sus incertidumbres.' : 'Un histograma sirve para una distribución de muchas observaciones. Aquí cada posición x tiene una medición reportada con su incertidumbre.') : result.message });
}, { signal: abortController.signal });
