import type { PracticeModeDefinition } from './content';
import type { PracticeMode, SelectionSnapshot } from './model';

export type PracticeLocale = 'en' | 'es';

const spanishModes: Record<PracticeMode, PracticeModeDefinition> = {
  manipulate: {
    action: 'Manipula',
    name: 'Laboratorio de selección',
    description: 'Mueve un umbral real de análisis y aprende el compromiso entre señal y fondo viendo cómo cambia la muestra de inmediato.',
    stages: [
      {
        title: 'Conserva la mayor parte de la señal',
        prompt: 'Sube el umbral de pT del fotón hasta conservar al menos 4 ejemplos de señal mientras el fondo baja a 5 o menos.',
        kind: 'selection',
        goal: 'Señal ≥ 4 · Fondo ≤ 5',
      },
      {
        title: 'Endurece la selección',
        prompt: 'Ahora conserva al menos 3 ejemplos de señal mientras reduces el fondo a 3 o menos.',
        kind: 'selection',
        goal: 'Señal ≥ 3 · Fondo ≤ 3',
      },
      {
        title: 'Encuentra un compromiso más fino',
        prompt: 'Termina con al menos 2 ejemplos de señal y no más de 2 ejemplos de fondo.',
        kind: 'selection',
        goal: 'Señal ≥ 2 · Fondo ≤ 2',
      },
    ],
  },
  observe: {
    action: 'Observa',
    name: 'Detective de eventos',
    description: 'Lee un registro compacto de eventos, identifica qué observable importa y elimina candidatos una razón a la vez.',
    stages: [
      {
        title: 'Aplica la primera pista',
        prompt: 'El análisis requiere exactamente dos fotones. ¿Qué evento se puede rechazar de inmediato?',
        kind: 'choice',
        options: [
          { value: 'a', label: 'Evento A' },
          { value: 'b', label: 'Evento B' },
          { value: 'c', label: 'Evento C' },
        ],
        success: 'Correcto. El evento C tiene solo un fotón, así que falla antes de que importe cualquier otro observable.',
        miss: 'Revisa primero la multiplicidad de fotones. La regla exige exactamente dos fotones.',
      },
      {
        title: 'Usa la aceptación del detector',
        prompt: 'Entre los eventos con dos fotones, ¿cuál falla |η| < 2.5?',
        kind: 'choice',
        options: [
          { value: 'a', label: 'Evento A' },
          { value: 'b', label: 'Evento B' },
        ],
        success: 'Correcto. El evento B tiene |η| = 2.8, fuera de la aceptación indicada.',
        miss: 'Compara los valores absolutos de η con 2.5.',
      },
      {
        title: 'Inspecciona lo que sobrevive',
        prompt: '¿Qué evento superviviente es el candidato diphotón tipo Higgs cercano a 125 GeV?',
        kind: 'choice',
        options: [
          { value: 'a', label: 'Evento A' },
          { value: 'b', label: 'Evento B' },
          { value: 'c', label: 'Evento C' },
        ],
        success: 'Correcto. El evento A supera los cortes indicados y tiene mγγ = 125 GeV.',
        miss: 'Primero conserva solo los eventos que superaron las reglas anteriores y luego compara la masa diphotón.',
      },
    ],
  },
  predict: {
    action: 'Predice',
    name: 'Pruebas de predicción',
    description: 'Comprométete con una consecuencia antes de verla. La meta es construir un modelo causal, no acertar por suerte.',
    stages: [
      {
        title: 'Endurece un corte',
        prompt: 'El umbral sube de 30 a 40 GeV. ¿Qué ocurre con el número de eventos seleccionados en esta muestra?',
        kind: 'choice',
        options: [
          { value: 'more', label: 'Sobreviven más eventos' },
          { value: 'fewer', label: 'Sobreviven menos eventos' },
          { value: 'same', label: 'Sobreviven exactamente los mismos eventos' },
        ],
        success: 'Correcto. Endurecer el umbral elimina los eventos que estaban entre 30 y 40 GeV.',
        miss: 'Un umbral inferior más estricto no puede añadir un evento que antes no lo superaba.',
      },
      {
        title: 'Predice la eficiencia',
        prompt: 'Para la misma muestra, ¿qué ocurre con la eficiencia de señal cuando el umbral pasa de 30 a 40 GeV?',
        kind: 'choice',
        options: [
          { value: 'increase', label: 'Aumenta' },
          { value: 'decrease', label: 'Disminuye' },
          { value: 'unchanged', label: 'No cambia' },
        ],
        success: 'Correcto. Se elimina un ejemplo de señal, así que la eficiencia baja de 4/5 a 3/5.',
        miss: 'La eficiencia cuenta la señal retenida respecto de la muestra de señal original.',
      },
      {
        title: 'Separa datos de representación',
        prompt: 'Mantienes fijos los eventos seleccionados pero aumentas el número de bins del histograma. ¿Qué cambió?',
        kind: 'choice',
        options: [
          { value: 'events', label: 'Cambiaron los eventos subyacentes' },
          { value: 'grouping', label: 'Solo cambió la agrupación de los valores' },
          { value: 'selection', label: 'La selección se volvió más estricta' },
        ],
        success: 'Correcto. El binning cambia la representación, no qué eventos pertenecen a la muestra.',
        miss: 'En este paso no cambió ninguna regla de selección.',
      },
    ],
  },
  code: {
    action: 'Programa',
    name: 'Constructor ROOT',
    description: 'Traduce una decisión de análisis que ya comprendes a la operación de ROOT que la expresa.',
    stages: [
      {
        title: 'Expresa una selección',
        prompt: 'Quieres conservar solo eventos con exactamente dos fotones. ¿Qué operación de RDataFrame corresponde a esa acción?',
        kind: 'choice',
        options: [
          { value: 'filter', label: 'Filter' },
          { value: 'define', label: 'Define' },
          { value: 'histo1d', label: 'Histo1D' },
        ],
        success: 'Correcto. Filter conserva las filas que satisfacen una condición.',
        miss: 'Elige la operación cuyo significado es conservar o rechazar filas.',
        reveal: 'df.Filter("photon_n == 2")',
      },
      {
        title: 'Crea un observable',
        prompt: 'Tienes dos cuadrivectores de fotones y quieres una nueva columna con la masa diphotón. ¿Qué operación lo expresa?',
        kind: 'choice',
        options: [
          { value: 'filter', label: 'Filter' },
          { value: 'define', label: 'Define' },
          { value: 'histo1d', label: 'Histo1D' },
        ],
        success: 'Correcto. Define crea una columna derivada a partir de información existente del evento.',
        miss: 'La tarea es crear una cantidad nueva, no rechazar eventos ni dibujar una distribución.',
        reveal: 'df.Define("mgg", "(photon_p4[0] + photon_p4[1]).M()")',
      },
      {
        title: 'Resume muchos eventos',
        prompt: 'Ahora quieres la distribución de mγγ en toda la muestra seleccionada. ¿Qué operación es el siguiente paso natural?',
        kind: 'choice',
        options: [
          { value: 'filter', label: 'Filter' },
          { value: 'define', label: 'Define' },
          { value: 'histo1d', label: 'Histo1D' },
        ],
        success: 'Correcto. Histo1D convierte los valores de una columna en una distribución unidimensional.',
        miss: 'El observable ya existe; ahora quieres resumir sus valores a través de muchos eventos.',
        reveal: 'df.Histo1D({"mgg", "Diphoton mass", 30, 100., 160.}, "mgg")',
      },
    ],
  },
};

export function getPracticeLocale(): PracticeLocale {
  return new URLSearchParams(window.location.search).get('lang') === 'es' ? 'es' : 'en';
}

function setText(root: ParentNode, selector: string, text: string) {
  const element = root.querySelector<HTMLElement>(selector);
  if (element) element.textContent = text;
}

function setTextAroundOutput(element: HTMLElement | null, prefix: string) {
  if (!element) return;
  const output = element.querySelector('output');
  if (!output) {
    element.textContent = prefix;
    return;
  }
  [...element.childNodes].forEach((node) => {
    if (node !== output) node.remove();
  });
  element.insertBefore(document.createTextNode(prefix), output);
}

function setLegendText(root: ParentNode, selector: string, labels: readonly string[]) {
  root.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
    if (!labels[index]) return;
    [...element.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) node.remove();
    });
    element.append(document.createTextNode(` ${labels[index]}`));
  });
}

export function installPracticeLanguageSwitch(root: HTMLElement, locale: PracticeLocale) {
  const header = root.querySelector<HTMLElement>('.practice-header');
  if (!header || header.querySelector('.practice-language')) return;

  const nav = document.createElement('nav');
  nav.className = 'practice-language';
  nav.setAttribute('aria-label', locale === 'es' ? 'Idioma' : 'Language');

  (['en', 'es'] as const).forEach((code) => {
    const link = document.createElement('a');
    const url = new URL(window.location.href);
    if (code === 'es') url.searchParams.set('lang', 'es');
    else url.searchParams.delete('lang');
    link.href = `${url.pathname}${url.search}${url.hash}`;
    link.textContent = code.toUpperCase();
    link.lang = code;
    if (code === locale) link.setAttribute('aria-current', 'page');
    nav.append(link);
  });

  header.append(nav);
}

export function applySpanishPracticeCopy(root: HTMLElement, mode: PracticeMode) {
  const data = spanishModes[mode];
  document.documentElement.lang = 'es';
  document.title = `${data.name} — ROOT Quest`;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', data.description);

  setText(root, '.practice-back', '← Rutas de aprendizaje');
  setText(root, '.practice-header .eyebrow', data.action);
  setText(root, '.practice-header h1', data.name);
  setText(root, '.practice-header .lede', data.description);
  root.querySelector('.practice-path')?.setAttribute('aria-label', `Progreso de ${data.name}`);

  root.querySelectorAll<HTMLElement>('[data-stage-marker]').forEach((marker, index) => {
    const stage = data.stages[index];
    if (!stage) return;
    const title = marker.querySelector<HTMLElement>('strong');
    const status = marker.querySelector<HTMLElement>('[data-stage-status]');
    if (title) title.textContent = stage.title;
    if (status) status.textContent = index === 0 ? 'Actual' : 'Bloqueado';
  });

  if (mode === 'observe') {
    setText(root, '.evidence-panel .section-label', 'Evidencia');
    setText(root, '#event-record-heading', 'Tres registros compactos de eventos');
    const headers = root.querySelectorAll<HTMLElement>('.evidence-panel thead th');
    if (headers[0]) headers[0].textContent = 'Evento';
    if (headers[1]) headers[1].textContent = 'Fotones';
  }

  if (mode === 'manipulate') {
    const visualization = root.querySelector<HTMLElement>('[data-selection-visualization]');
    visualization?.setAttribute('aria-label', 'Vistas en vivo de la selección');
    setText(root, '.event-view .section-label', 'Eventos');
    setText(root, '#event-view-heading', 'Muestra 3D');
    root.querySelector('.event-space')?.setAttribute(
      'aria-label',
      'Doce objetos de eventos. La señal usa esferas, el fondo usa rombos y los objetos rechazados se atenúan al aumentar el corte de pT del fotón.',
    );
    setLegendText(root, '.event-view .visual-legend span', ['Señal', 'Fondo']);
    setText(root, '.visual-note', 'Un objeto = un ejemplo. La posición solo organiza la vista.');
    setText(root, '.histogram-view .section-label', 'Distribución');
    setText(root, '#pt-histogram-heading', 'pT del fotón');
    setText(root, '#pt-histogram-title', 'Histograma del momento transverso de fotones de señal y fondo');
    setLegendText(root, '.histogram-view .visual-legend span', ['Señal', 'Fondo']);
  }

  root.querySelectorAll<HTMLElement>('[data-stage-panel]').forEach((panel, index) => {
    const stage = data.stages[index];
    if (!stage) return;
    setText(panel, '.section-label', `Desafío ${index + 1} de 3`);
    setText(panel, 'h2', stage.title);
    setText(panel, '.stage-prompt', stage.prompt);

    if (stage.kind === 'selection') {
      setTextAroundOutput(panel.querySelector<HTMLElement>('.selection-challenge > label'), 'Umbral de pT del fotón: ');
      const target = panel.querySelector<HTMLElement>('.target');
      if (target) {
        const strong = document.createElement('strong');
        strong.textContent = 'Objetivo';
        target.replaceChildren(strong, document.createTextNode(` ${stage.goal ?? ''}`));
      }
      const retention = panel.querySelectorAll<HTMLElement>('.retention-grid span');
      setTextAroundOutput(retention[0] ?? null, 'Señal conservada ');
      setTextAroundOutput(retention[1] ?? null, 'Fondo conservado ');
      setText(panel, '[data-feedback]', 'Mueve el umbral y observa cómo responden ambas partes de la muestra.');
    } else {
      panel.querySelectorAll<HTMLElement>('.choice-challenge label span').forEach((option, optionIndex) => {
        const translated = stage.options?.[optionIndex];
        if (translated) option.textContent = translated.label;
      });
      const form = panel.querySelector<HTMLFormElement>('[data-answer-form]');
      if (form) {
        form.dataset.success = stage.success ?? 'Correcto.';
        form.dataset.miss = stage.miss ?? 'Inténtalo de nuevo.';
      }
      setText(panel, '.choice-challenge button', 'Confirmar respuesta');
      setText(panel, '[data-feedback]', 'Confirma tu respuesta antes de revelar la consecuencia.');
    }
  });

  setText(root, '[data-continue]', 'Desbloquear siguiente desafío');
  setText(root, '.practice-complete .section-label', 'Ruta completada');
  setText(root, '#complete-heading', 'Tres decisiones, un modelo mental.');
  setText(root, '.practice-complete > p:not(.section-label)', 'La búsqueda guiada del Higgs combina estas mecánicas en un análisis más largo.');
  const completionLinks = root.querySelectorAll<HTMLElement>('.completion-links a');
  if (completionLinks[0]) completionLinks[0].textContent = 'Entrar a Higgs Hunt';
  if (completionLinks[1]) completionLinks[1].textContent = 'Elegir otra ruta';
}

export function stageStatus(locale: PracticeLocale, state: 'complete' | 'current' | 'locked') {
  if (locale === 'en') return state === 'complete' ? 'Complete' : state === 'current' ? 'Current' : 'Locked';
  return state === 'complete' ? 'Completado' : state === 'current' ? 'Actual' : 'Bloqueado';
}

export function visualSummary(locale: PracticeLocale, threshold: number, snapshot: SelectionSnapshot) {
  if (locale === 'en') {
    return `At ${threshold} GeV, ${snapshot.signalKept} of ${snapshot.signalTotal} signal and ${snapshot.backgroundKept} of ${snapshot.backgroundTotal} background examples remain.`;
  }
  return `A ${threshold} GeV permanecen ${snapshot.signalKept} de ${snapshot.signalTotal} ejemplos de señal y ${snapshot.backgroundKept} de ${snapshot.backgroundTotal} ejemplos de fondo.`;
}

export function histogramDescription(locale: PracticeLocale, threshold: number, snapshot: SelectionSnapshot) {
  if (locale === 'en') {
    return `Photon transverse momentum distribution. The rejected region extends below ${threshold} GeV. ${snapshot.signalKept} signal and ${snapshot.backgroundKept} background examples remain.`;
  }
  return `Distribución del momento transverso del fotón. La región rechazada queda por debajo de ${threshold} GeV. Permanecen ${snapshot.signalKept} ejemplos de señal y ${snapshot.backgroundKept} de fondo.`;
}

export function selectionFeedback(locale: PracticeLocale, solved: boolean, snapshot: SelectionSnapshot) {
  if (locale === 'en') {
    return solved
      ? `Target reached: ${snapshot.signalKept} signal examples remain with ${snapshot.backgroundKept} background examples.`
      : `This cut keeps ${snapshot.signalKept} signal and ${snapshot.backgroundKept} background examples. Adjust the threshold toward the target.`;
  }
  return solved
    ? `Objetivo alcanzado: permanecen ${snapshot.signalKept} ejemplos de señal con ${snapshot.backgroundKept} ejemplos de fondo.`
    : `Este corte conserva ${snapshot.signalKept} ejemplos de señal y ${snapshot.backgroundKept} de fondo. Ajusta el umbral hacia el objetivo.`;
}

export function fallbackAnswer(locale: PracticeLocale, correct: boolean) {
  if (locale === 'en') return correct ? 'Correct.' : 'Try again.';
  return correct ? 'Correcto.' : 'Inténtalo de nuevo.';
}
