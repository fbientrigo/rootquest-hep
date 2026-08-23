export type RootQuestLanguage = 'en' | 'es';

export const LANGUAGE_STORAGE_KEY = 'rootquest-language';

const spanishText: Record<string, string> = {
  // Shared chrome
  'Skip to content': 'Saltar al contenido',
  'Primary navigation': 'Navegación principal',
  'Home': 'Inicio',
  'Course': 'Curso',
  'Theme': 'Tema',
  'Light': 'Claro',
  'Dark': 'Oscuro',
  'Switch color theme': 'Cambiar tema de color',
  'Switch to light theme': 'Cambiar al tema claro',
  'Switch to dark theme': 'Cambiar al tema oscuro',
  'Language': 'Idioma',
  'Independent educational experiment. Not an official ROOT or CERN project.':
    'Experimento educativo independiente. No es un proyecto oficial de ROOT ni de CERN.',

  // Shared learning vocabulary
  'Context': 'Contexto',
  'Manipulate': 'Manipula',
  'Observe': 'Observa',
  'See': 'Observa',
  'Predict': 'Predice',
  'Cut': 'Corte',
  'Plot': 'Histograma',
  'Code': 'Código',
  'Transfer': 'Transferencia',
  'Manipulate → observe': 'Manipula → observa',
  'Event': 'Evento',
  'Events': 'Eventos',
  'Photons': 'Fotones',
  'Signal': 'Señal',
  'Background': 'Fondo',
  'Distribution': 'Distribución',
  'Evidence': 'Evidencia',
  'Summary': 'Resumen',
  'Mean': 'Media',
  'StdDev': 'Desv. estándar',
  'Current': 'Actual',
  'Locked': 'Bloqueado',
  'Available': 'Disponible',
  'Next': 'Siguiente',
  'Planned': 'Planificada',
  'Back': 'Atrás',
  'Continue': 'Continuar',
  'Previous': 'Anterior',
  'Reset': 'Reiniciar',
  'dimensionless': 'adimensional',
  'compact deposit': 'depósito compacto',
  'broad spray': 'cascada amplia',
  'photon-like': 'compatible con un fotón',
  'jet-like': 'compatible con un jet',
  ', and': ' y',

  // Metadata
  'ROOT Quest — Interactive ROOT and HEP learning': 'ROOT Quest — Aprendizaje interactivo de ROOT y HEP',
  'Learn ROOT and HEP analysis by manipulating events, making cuts, reading distributions, and connecting the result to real ROOT code.':
    'Aprende análisis con ROOT y HEP manipulando eventos, aplicando cortes, leyendo distribuciones y conectando el resultado con código ROOT real.',
  'Course — ROOT Quest': 'Curso — ROOT Quest',
  'Follow the ROOT Quest 80/20 curriculum from distributions and ROOT files to RDataFrame, HEP kinematics, fitting, and independent analysis.':
    'Sigue el currículo 80/20 de ROOT Quest desde distribuciones y archivos ROOT hasta RDataFrame, cinemática de HEP, ajustes y análisis independiente.',
  'Same data, different bins — ROOT Quest': 'Mismos datos, distintos bins — ROOT Quest',
  'Learn what histogram binning changes, what stays fixed, and how the same idea appears in ROOT.':
    'Aprende qué cambia el binning de un histograma, qué permanece fijo y cómo aparece la misma idea en ROOT.',
  'Build a histogram — ROOT Quest': 'Construye un histograma — ROOT Quest',
  'See how each measurement becomes one ROOT Fill call and increments one histogram bin.':
    'Observa cómo cada medición se convierte en una llamada ROOT Fill e incrementa un bin del histograma.',
  'Read and compare histograms — ROOT Quest': 'Lee y compara histogramas — ROOT Quest',
  'Compare histogram yields and shapes, then decide when normalization answers the question and when it hides it.':
    'Compara rendimientos y formas de histogramas y decide cuándo la normalización responde la pregunta y cuándo la oculta.',
  'Higgs Hunt — ROOT Quest': 'Higgs Hunt — ROOT Quest',
  'Build a diphoton selection visually, discover a mass structure, and recognize the equivalent ROOT analysis.':
    'Construye visualmente una selección de dos fotones, descubre una estructura en masa y reconoce el análisis ROOT equivalente.',
  'Learning Engine Lab — ROOT Quest': 'Laboratorio del motor de aprendizaje — ROOT Quest',
  "Three small probes that validate ROOT Quest's portable learning runtime and accessible teaching primitives.":
    'Tres pruebas pequeñas que validan el runtime educativo portable de ROOT Quest y sus primitivas de enseñanza accesibles.',

  // Home
  'Interactive ROOT + HEP learning': 'Aprendizaje interactivo de ROOT + HEP',
  'See the event. Find the signal.': 'Observa el evento. Encuentra la señal.',
  'Learn analysis by changing the data first. Inspect events, make selections, observe distributions, predict what happens next, then connect the result to ROOT code.':
    'Aprende análisis cambiando primero los datos. Inspecciona eventos, haz selecciones, observa distribuciones, predice qué ocurrirá después y conecta el resultado con código ROOT.',
  'Enter Higgs Hunt': 'Entrar a Higgs Hunt',
  'View the course →': 'Ver el curso →',
  'ROOT 80/20 course': 'Curso ROOT 80/20',
  'Learn the machinery behind the hunt': 'Aprende la mecánica detrás de la búsqueda',
  'Open →': 'Abrir →',
  'Next:': 'Siguiente:',
  'See all six units and the full path →': 'Ver las seis unidades y la ruta completa →',
  'Practice the loop': 'Practica el ciclo',
  'Train one analysis move at a time': 'Entrena un paso de análisis a la vez',
  'ROOT Quest learning loop': 'Ciclo de aprendizaje de ROOT Quest',
  'Selection Lab': 'Laboratorio de selección',
  'Change a real analysis choice.': 'Cambia una decisión real de análisis.',
  'Event Detective': 'Detective de eventos',
  'See its consequence immediately.': 'Observa su consecuencia de inmediato.',
  'Prediction Trials': 'Pruebas de predicción',
  'Commit to what should happen next.': 'Comprométete con lo que debería ocurrir después.',
  'ROOT Builder': 'Constructor ROOT',
  'Express the idea in ROOT.': 'Expresa la idea en ROOT.',
  'Enter →': 'Entrar →',
  'Research basis': 'Base de investigación',
  'Why the interaction works this way': 'Por qué la interacción funciona así',
  'Next reference': 'Siguiente referencia',
  'Effect here: game mechanics stay subordinate to reasoning. Progress and feedback matter more than an XP layer.':
    'Aplicación aquí: las mecánicas de juego quedan subordinadas al razonamiento. El progreso y el feedback importan más que una capa de XP.',
  'Effect here: act or predict before the explanation or ROOT syntax is revealed.':
    'Aplicación aquí: actúa o predice antes de revelar la explicación o la sintaxis de ROOT.',
  'Effect here: feedback states what changed and why, not only whether an answer was correct.':
    'Aplicación aquí: el feedback explica qué cambió y por qué, no solo si una respuesta fue correcta.',
  'Effect here: short challenges require a committed decision or recall instead of passive exposure.':
    'Aplicación aquí: los desafíos breves exigen una decisión comprometida o recuperación activa, en vez de exposición pasiva.',

  // Curriculum
  'Data become distributions': 'Los datos se convierten en distribuciones',
  'Build histogram and measurement intuition before ROOT syntax becomes the focus.':
    'Construye intuición sobre histogramas y mediciones antes de que la sintaxis de ROOT sea el foco.',
  'Same data, different bins': 'Mismos datos, distintos bins',
  'Build a histogram': 'Construye un histograma',
  'Read and compare histograms': 'Lee y compara histogramas',
  'Measurements with errors': 'Mediciones con incertidumbres',
  'Open the ROOT file': 'Abre el archivo ROOT',
  'Make ROOT files, trees, branches and entries inspectable rather than opaque.':
    'Haz que archivos ROOT, árboles, ramas y entradas sean inspeccionables en vez de opacos.',
  'Open and inspect a ROOT file': 'Abre e inspecciona un archivo ROOT',
  'Tree, branch, entry': 'Árbol, rama, entrada',
  'Collections inside events': 'Colecciones dentro de eventos',
  'Use ROOT without memorizing ROOT': 'Usa ROOT sin memorizar ROOT',
  'Analysis as a data pipeline': 'El análisis como pipeline de datos',
  'Build fluent everyday analysis around RDataFrame transformations and actions.':
    'Construye un análisis cotidiano fluido alrededor de transformaciones y acciones de RDataFrame.',
  'A pipeline transforms a dataset': 'Un pipeline transforma un conjunto de datos',
  'Filter: keep rows for a reason': 'Filter: conserva filas por una razón',
  'Define: create an observable': 'Define: crea un observable',
  'Actions summarize the sample': 'Las acciones resumen la muestra',
  'Cutflow: where did the events go?': 'Cutflow: ¿adónde fueron los eventos?',
  'Keep a useful derived sample': 'Conserva una muestra derivada útil',
  'Events contain physics objects': 'Los eventos contienen objetos físicos',
  'Connect particle collections to the kinematics used in introductory HEP analysis.':
    'Conecta colecciones de partículas con la cinemática usada en análisis HEP introductorio.',
  'Coordinates of a reconstructed object': 'Coordenadas de un objeto reconstruido',
  'Select objects, then events': 'Selecciona objetos y luego eventos',
  'Work with collections': 'Trabaja con colecciones',
  'Angular separation': 'Separación angular',
  'Four-vectors and invariant mass': 'Cuadrivectores y masa invariante',
  'Build a candidate': 'Construye un candidato',
  'From plots to evidence': 'De gráficos a evidencia',
  'Add the minimum normalization and fitting machinery needed for responsible interpretation.':
    'Añade la normalización y el ajuste mínimos necesarios para una interpretación responsable.',
  'Signal and background trade-offs': 'Compromisos entre señal y fondo',
  'Event weights and normalization': 'Pesos de eventos y normalización',
  'Data vs simulation': 'Datos vs. simulación',
  'Fit a simple model': 'Ajusta un modelo simple',
  'Read a fit critically': 'Lee un ajuste críticamente',
  'Signal and control regions': 'Regiones de señal y de control',
  'Work independently': 'Trabaja de forma independiente',
  'Fade support until a learner can transfer the workflow to an unfamiliar small analysis.':
    'Reduce el apoyo hasta que el estudiante pueda transferir el flujo de trabajo a un análisis pequeño y desconocido.',
  'Assemble an analysis from a question': 'Construye un análisis a partir de una pregunta',
  'Higgs Hunt — discovery revisit': 'Higgs Hunt — regreso en modo descubrimiento',
  'Independent mini-analysis': 'Mini-análisis independiente',
  'Leave ROOT Quest': 'Deja ROOT Quest',

  // Course page
  'Your path through ROOT': 'Tu ruta por ROOT',
  'Start with the whole analysis loop, then learn the machinery underneath it one useful idea at a time. Available lessons are interactive; future units stay visible so the destination is always clear.':
    'Empieza con el ciclo completo de análisis y luego aprende la mecánica que hay debajo, una idea útil a la vez. Las lecciones disponibles son interactivas; las unidades futuras permanecen visibles para que el destino siempre sea claro.',
  'core lessons available': 'lecciones troncales disponibles',
  'Higgs Hunt — guided': 'Higgs Hunt — guiada',
  'Experience event selection, cuts, a mass distribution, and the ROOT code they become before studying each piece separately.':
    'Experimenta la selección de eventos, los cortes, una distribución de masa y el código ROOT en que se convierten antes de estudiar cada pieza por separado.',
  'Next lesson': 'Siguiente lección',
  'This is the next curriculum increment being built. Finish the available Unit A lessons while it is prepared.':
    'Este es el siguiente incremento del currículo que se está construyendo. Completa las lecciones disponibles de la Unidad A mientras se prepara.',
  'The path is intentionally smaller than ROOT itself. The goal is to become able to inspect data, build a small modern ROOT analysis, interpret it, and continue independently from official ROOT documentation.':
    'La ruta es intencionalmente más pequeña que ROOT. La meta es poder inspeccionar datos, construir un análisis ROOT moderno y pequeño, interpretarlo y continuar de forma independiente usando la documentación oficial de ROOT.',

  // A1 — binning
  'Unit A · Lesson A1': 'Unidad A · Lección A1',
  'A histogram does not create data. Change the bins, watch the picture change, and identify what stayed exactly the same.':
    'Un histograma no crea datos. Cambia los bins, observa cómo cambia la imagen e identifica qué permaneció exactamente igual.',
  'Start from the measurements': 'Empieza por las mediciones',
  'These 20 synthetic measurements are fixed for the whole lesson.':
    'Estas 20 mediciones sintéticas permanecen fijas durante toda la lección.',
  'Fixed source measurements': 'Mediciones fuente fijas',
  'Histogram range:': 'Rango del histograma:',
  '. A value below 0 is underflow; a value at or above 8 is overflow. ROOT uses dedicated underflow and overflow bins.':
    '. Un valor menor que 0 va a underflow; un valor igual o mayor que 8 va a overflow. ROOT usa bins dedicados para underflow y overflow.',
  'Regroup the same measurements': 'Reagrupa las mismas mediciones',
  'Move only the number of bins. The source measurements and range stay fixed.':
    'Cambia solo el número de bins. Las mediciones fuente y el rango permanecen fijos.',
  'Histogram of the fixed measurements': 'Histograma de las mediciones fijas',
  'Twenty fixed measurements grouped into five bins.': 'Veinte mediciones fijas agrupadas en cinco bins.',
  'measurement value': 'valor de la medición',
  'Number of bins': 'Número de bins',
  'Histogram state': 'Estado del histograma',
  'Bin width': 'Ancho de bin',
  '20 measurements remain fixed.': '20 mediciones permanecen fijas.',
  'Read exact bin counts': 'Ver los conteos exactos por bin',
  'Change the bin count and compare the grouping.': 'Cambia el número de bins y compara la agrupación.',
  'Commit before changing it again': 'Comprométete antes de volver a cambiarlo',
  'If you increase the number of bins while keeping [0, 8) fixed, what must happen?':
    'Si aumentas el número de bins manteniendo fijo [0, 8), ¿qué debe ocurrir?',
  'The intervals become narrower': 'Los intervalos se vuelven más estrechos',
  'More measurements are created': 'Se crean más mediciones',
  'The intervals become wider': 'Los intervalos se vuelven más anchos',
  'Commit prediction': 'Confirmar predicción',
  'After committing, move the bin slider once more to test your prediction.':
    'Después de confirmar, mueve otra vez el control de bins para poner a prueba tu predicción.',
  'ROOT records the grouping choice': 'ROOT registra la elección de agrupación',
  'The third constructor argument is the number of bins; the last two set the displayed x range. Changing only that bin count changes the partition, not the measurements you started from.':
    'El tercer argumento del constructor es el número de bins; los dos últimos fijan el rango x mostrado. Cambiar solo ese número modifica la partición, no las mediciones de partida.',
  'In ROOT, the lower edge is included and the upper edge is excluded; values outside the range are accounted for in underflow or overflow bins.':
    'En ROOT, el borde inferior se incluye y el superior se excluye; los valores fuera del rango se contabilizan en los bins de underflow u overflow.',
  'What is invariant?': '¿Qué permanece invariante?',
  'You change a histogram from 5 to 10 bins, but keep the same measurements and [0, 8) range. What definitely stays the same?':
    'Cambias un histograma de 5 a 10 bins, pero mantienes las mismas mediciones y el rango [0, 8). ¿Qué permanece igual con certeza?',
  'The source measurements': 'Las mediciones fuente',
  'Every bar height': 'La altura de cada barra',
  'Every bin width': 'El ancho de cada bin',
  'Check understanding': 'Comprobar comprensión',
  'Same measurements, new grouping.': 'Mismas mediciones, nueva agrupación.',
  'Prediction supported.': 'Predicción confirmada.',
  'Separate data from representation.': 'Separa los datos de su representación.',
  'Transfer complete.': 'Transferencia completada.',
  'Try the invariant.': 'Busca lo que permanece invariante.',
  'More bins divide the same fixed range into narrower intervals. The measurements did not multiply; only their grouping changed.':
    'Más bins dividen el mismo rango fijo en intervalos más estrechos. Las mediciones no se multiplicaron; solo cambió su agrupación.',
  'The measurements and range stayed fixed. Increasing the bin count makes each interval narrower, so the same measurements are redistributed among more bins.':
    'Las mediciones y el rango permanecieron fijos. Al aumentar el número de bins, cada intervalo se estrecha y las mismas mediciones se redistribuyen entre más bins.',
  'Exactly. Rebinning changes the representation, not the source measurements. With the same range, the same measurements still enter the histogram.':
    'Exacto. Cambiar el binning modifica la representación, no las mediciones fuente. Con el mismo rango, las mismas mediciones siguen entrando al histograma.',
  'Changing only the number of bins does not create or remove source measurements. It changes how the fixed range is partitioned.':
    'Cambiar solo el número de bins no crea ni elimina mediciones fuente. Cambia cómo se particiona el rango fijo.',

  // A2 — Fill
  'Unit A · Lesson A2': 'Unidad A · Lección A2',
  'A histogram is accumulated one measurement at a time. Follow each value into its bin, then read the ROOT that records the same operation.':
    'Un histograma se acumula una medición a la vez. Sigue cada valor hasta su bin y luego lee el ROOT que registra la misma operación.',
  'Eight measurements, four fixed bins': 'Ocho mediciones, cuatro bins fijos',
  'The range is': 'El rango es',
  ', split into [0,2), [2,4), [4,6), and [6,8). No bar exists because of its x value alone: a bar grows when measurements are filled into that interval.':
    ', dividido en [0,2), [2,4), [4,6) y [6,8). Ninguna barra existe solo por su valor x: una barra crece cuando se llenan mediciones dentro de ese intervalo.',
  'Add one measurement': 'Añade una medición',
  'Before pressing the button, locate the next value on the x-axis. Then watch exactly one bin count increase.':
    'Antes de presionar el botón, ubica el siguiente valor en el eje x. Luego observa cómo aumenta exactamente un conteo de bin.',
  'Histogram being filled one measurement at a time': 'Histograma llenado una medición a la vez',
  'No measurements filled yet.': 'Aún no se ha llenado ninguna medición.',
  'Fill state': 'Estado del llenado',
  'Next x': 'Siguiente x',
  'Bin containing x': 'Bin que contiene x',
  'Calls completed': 'Llamadas completadas',
  '0 measurements have contributed.': '0 mediciones han contribuido.',
  'Where will 4.8 contribute?': '¿Dónde contribuirá 4.8?',
  'If ROOT executes': 'Si ROOT ejecuta',
  ', which visible bin is incremented?': ', ¿qué bin visible se incrementa?',
  'Your clicks are': 'Tus clics son llamadas a',
  'calls': '',
  'defines the histogram. Each unweighted': 'define el histograma. Cada llamada sin peso',
  'finds the bin containing x and increments that bin by one.': 'encuentra el bin que contiene x e incrementa ese bin en uno.',
  'displays the accumulated histogram.': 'muestra el histograma acumulado.',
  'What does': '¿Qué significa',
  'mean?': '?',
  "Choose the statement that matches ROOT's operation.": 'Elige la afirmación que corresponde a la operación de ROOT.',
  'Set one bar height to 5.7': 'Fijar la altura de una barra en 5.7',
  'Find the bin containing 5.7 and increment it by one': 'Encontrar el bin que contiene 5.7 e incrementarlo en uno',
  'Create a new bin centered at 5.7': 'Crear un nuevo bin centrado en 5.7',
  'complete': 'completo',
  'All measurements filled': 'Todas las mediciones llenadas',
  'Locate x before counting.': 'Ubica x antes de contar.',
  'Separate x from bin content.': 'Separa x del contenido del bin.',
  'Correct. 4.8 lies inside [4, 6), so Fill(4.8) increments that bin by one.':
    'Correcto. 4.8 está dentro de [4, 6), por lo que Fill(4.8) incrementa ese bin en uno.',
  'Use the x value to locate its interval. With four equal bins over [0, 8), 4.8 belongs to [4, 6).':
    'Usa el valor x para ubicar su intervalo. Con cuatro bins iguales sobre [0, 8), 4.8 pertenece a [4, 6).',
  'Exactly. Fill(5.7) finds the bin containing 5.7 and increments that bin by one for an unweighted fill.':
    'Exacto. Fill(5.7) encuentra el bin que contiene 5.7 y lo incrementa en uno para un llenado sin peso.',
  'Fill does not set a bar height to x and it does not add a new bin. It finds the bin containing x and increments its content.':
    'Fill no fija la altura de una barra en x ni añade un bin nuevo. Encuentra el bin que contiene x e incrementa su contenido.',

  // A3 — comparison
  'Unit A · Lesson A3': 'Unidad A · Lección A3',
  'Two histograms can differ because they contain different numbers of entries, because their shapes differ, or both. Decide which question you are asking before you normalize.':
    'Dos histogramas pueden diferir porque contienen distinto número de entradas, porque sus formas difieren o por ambas razones. Decide qué pregunta estás haciendo antes de normalizar.',
  'Same pattern, different yield': 'Mismo patrón, distinto rendimiento',
  'Sample A contains 12 measurements. Sample B contains the same relative pattern twice, for 24 measurements. Raw counts preserve that yield difference; unit-area normalization deliberately removes it so shape can be compared.':
    'La muestra A contiene 12 mediciones. La muestra B contiene dos veces el mismo patrón relativo, con 24 mediciones. Los conteos crudos conservan esa diferencia de rendimiento; la normalización a área unitaria la elimina deliberadamente para comparar la forma.',
  'Change the question, then change the view': 'Cambia la pregunta y luego cambia la vista',
  'What should the histogram emphasize?': '¿Qué debería enfatizar el histograma?',
  'Raw counts — preserve total yield': 'Conteos crudos — conservan el rendimiento total',
  'Unit area — compare relative shape': 'Área unitaria — compara la forma relativa',
  'Histogram samples': 'Muestras del histograma',
  'Sample A': 'Muestra A',
  'Sample B': 'Muestra B',
  'Paired histograms for samples A and B': 'Histogramas emparejados de las muestras A y B',
  'Raw histogram counts for two samples.': 'Conteos crudos de histograma para dos muestras.',
  'Sample B has twice as many entries as sample A.': 'La muestra B tiene el doble de entradas que la muestra A.',
  'Histogram summaries': 'Resúmenes de histogramas',
  'Read the bin contents numerically': 'Lee numéricamente el contenido de los bins',
  'What information disappears?': '¿Qué información desaparece?',
  'If each histogram is scaled so its integral is 1, what information is no longer visible?':
    'Si cada histograma se escala para que su integral sea 1, ¿qué información deja de ser visible?',
  'Which x interval each bin represents': 'Qué intervalo x representa cada bin',
  'The 12-versus-24 total-yield difference': 'La diferencia de rendimiento total entre 12 y 24',
  'The relative shape across bins': 'La forma relativa entre los bins',
  'ROOT expresses the question you chose': 'ROOT expresa la pregunta que elegiste',
  'PyROOT · histogram comparison': 'PyROOT · comparación de histogramas',
  'reads the in-range bin content here.': 'lee aquí el contenido de los bins dentro del rango.',
  'summarize the histogram.': 'resumen el histograma.',
  'changes the bin contents, so unit-area normalization should be a deliberate analysis choice rather than an automatic plotting step.':
    'cambia el contenido de los bins, por lo que la normalización a área unitaria debe ser una decisión deliberada de análisis y no un paso automático al graficar.',
  "For these prepared samples every value is inside the displayed range. ROOT's default mean and standard deviation use statistics accumulated while filling when no axis range is set.":
    'Para estas muestras preparadas, todos los valores están dentro del rango mostrado. La media y la desviación estándar por defecto de ROOT usan las estadísticas acumuladas durante el llenado cuando no se fija un rango del eje.',
  'Should you normalize?': '¿Deberías normalizar?',
  'Your question is: “Which sample contains more selected events?” What should you do before comparing the histograms?':
    'Tu pregunta es: “¿Qué muestra contiene más eventos seleccionados?”. ¿Qué deberías hacer antes de comparar los histogramas?',
  'Scale both histograms to integral 1': 'Escalar ambos histogramas a integral 1',
  'Keep the raw/physically normalized yields': 'Conservar los rendimientos crudos o normalizados físicamente',
  'Compare only the highest bin': 'Comparar solo el bin más alto',
  'Ask what scaling removes.': 'Pregunta qué elimina el escalado.',
  'Match normalization to the question.': 'Haz que la normalización corresponda a la pregunta.',
  'Correct. Scaling each histogram to unit area preserves this shape comparison but removes the fact that sample B contains twice as many entries.':
    'Correcto. Escalar cada histograma a área unitaria conserva esta comparación de forma, pero elimina el hecho de que la muestra B contiene el doble de entradas.',
  'Normalization does not add information. Unit-area scaling deliberately removes the overall-yield difference so the relative bin pattern can be compared.':
    'La normalización no añade información. El escalado a área unitaria elimina deliberadamente la diferencia de rendimiento total para poder comparar el patrón relativo entre bins.',
  'Correct. If the question is which sample contains more events, keep the yield information. Unit-area normalization would erase the quantity you are trying to compare.':
    'Correcto. Si la pregunta es qué muestra contiene más eventos, conserva la información de rendimiento. La normalización a área unitaria borraría la cantidad que intentas comparar.',
  'First identify the question. A shape comparison may justify unit-area normalization; a yield comparison requires preserving the event totals.':
    'Primero identifica la pregunta. Una comparación de forma puede justificar la normalización a área unitaria; una comparación de rendimiento exige conservar los totales de eventos.',

  // Higgs Hunt
  'ROOT Quest · Main experience': 'ROOT Quest · Experiencia principal',
  'Begin with one collision. End with the ROOT analysis you already understand.':
    'Empieza con una colisión. Termina con el análisis ROOT que ya comprendes.',
  'Exit Higgs Hunt': 'Salir de Higgs Hunt',
  'Fixed synthetic sample': 'Muestra sintética fija',
  'One collision': 'Una colisión',
  'Find the two photons': 'Encuentra los dos fotones',
  'Select the reconstructed objects that could form a diphoton candidate. You can always change your choice.':
    'Selecciona los objetos reconstruidos que podrían formar un candidato de dos fotones. Siempre puedes cambiar tu elección.',
  'Conceptual transverse view of one collision event': 'Vista transversal conceptual de un evento de colisión',
  'Two photon-like energy deposits and one broad jet emerge from the collision point.':
    'Dos depósitos de energía compatibles con fotones y un jet ancho emergen del punto de colisión.',
  'Simplified teaching view—not a detector display. Photons end as compact calorimeter deposits; the jet is broader.':
    'Vista didáctica simplificada; no es una visualización real del detector. Los fotones terminan como depósitos compactos en el calorímetro; el jet es más ancho.',
  'Choose a pair': 'Elige un par',
  'Reconstructed objects': 'Objetos reconstruidos',
  'Object A': 'Objeto A',
  'Object B': 'Objeto B',
  'Object C': 'Objeto C',
  '48 GeV · compact deposit': '48 GeV · depósito compacto',
  '42 GeV · compact deposit': '42 GeV · depósito compacto',
  '36 GeV · broad spray': '36 GeV · cascada amplia',
  'Select two objects and compare their detector signatures.': 'Selecciona dos objetos y compara sus firmas en el detector.',
  'From eye to rule': 'De la vista a la regla',
  'Predict what the first filter keeps': 'Predice qué conserva el primer filtro',
  'Manual inspection does not scale. The rule below applies the same decision to every event:':
    'La inspección manual no escala. La regla siguiente aplica la misma decisión a cada evento:',
  'Leading pT': 'pT líder',
  'Which events survive this rule?': '¿Qué eventos sobreviven a esta regla?',
  'A and C': 'A y C',
  'A and D': 'A y D',
  'B and D': 'B y D',
  'One rule, many events': 'Una regla, muchos eventos',
  'Move the cut and watch the trade-off': 'Mueve el corte y observa el compromiso',
  'Tightening a transverse-momentum cut removes background—but it can also discard useful signal.':
    'Endurecer un corte de momento transverso elimina fondo, pero también puede descartar señal útil.',
  'Leading photon transverse-momentum distribution': 'Distribución del momento transverso del fotón líder',
  'Events are shown along a transverse-momentum axis with a movable threshold.':
    'Los eventos se muestran sobre un eje de momento transverso con un umbral móvil.',
  'leading photon pT [GeV]': 'pT del fotón líder [GeV]',
  'Minimum leading photon pT': 'pT mínimo del fotón líder',
  'Training metrics': 'Métricas de entrenamiento',
  'Signal kept': 'Señal conservada',
  'Background removed': 'Fondo rechazado',
  'The line is the cut. Events to its left are removed from the sample.':
    'La línea es el corte. Los eventos a su izquierda se eliminan de la muestra.',
  'Events become a distribution': 'Los eventos se convierten en una distribución',
  'Look for structure, not individual rows': 'Busca estructura, no filas individuales',
  'The labels are gone. Each selected event contributes one diphoton-mass value to the histogram.':
    'Las etiquetas desaparecieron. Cada evento seleccionado aporta un valor de masa de dos fotones al histograma.',
  'Diphoton mass histogram after selection': 'Histograma de masa de dos fotones después de la selección',
  'A histogram of selected synthetic events between 100 and 160 GeV.':
    'Histograma de eventos sintéticos seleccionados entre 100 y 160 GeV.',
  'diphoton mass [GeV]': 'masa de dos fotones [GeV]',
  'Histogram bins': 'Bins del histograma',
  'Selected events are grouped into 12 mass intervals.': 'Los eventos seleccionados se agrupan en 12 intervalos de masa.',
  'The shaded region is near 125 GeV. Change the bins: the events stay fixed while their grouping changes.':
    'La región sombreada está cerca de 125 GeV. Cambia los bins: los eventos permanecen fijos mientras cambia su agrupación.',
  'Meaning becomes syntax': 'El significado se vuelve sintaxis',
  'You already built this ROOT analysis': 'Ya construiste este análisis ROOT',
  'The code is not a new idea. It is a compact record of the selections and histogram you just manipulated.':
    'El código no es una idea nueva. Es un registro compacto de las selecciones y el histograma que acabas de manipular.',
  'Copy code': 'Copiar código',
  'Selection → distribution → code.': 'Selección → distribución → código.',
  'ROOT formalizes decisions whose consequences you have already seen.':
    'ROOT formaliza decisiones cuyas consecuencias ya observaste.',
  'Higgs Hunt stages': 'Etapas de Higgs Hunt',
  'Stage 1 of 5: See': 'Etapa 1 de 5: Observa',
  'Start again': 'Empezar de nuevo',
  'This experience uses a small fixed synthetic sample to expose cause and effect; it is not experimental data or a statistical claim.':
    'Esta experiencia usa una muestra sintética pequeña y fija para mostrar causa y efecto; no son datos experimentales ni una afirmación estadística.',
  'A diphoton candidate': 'Un candidato de dos fotones',
  'Objects A and B stay highlighted: two compact photon-like deposits now describe one candidate event.':
    'Los objetos A y B permanecen destacados: dos depósitos compactos compatibles con fotones describen ahora un evento candidato.',
  'Compare the shapes': 'Compara las formas',
  'One selected object is a broad jet-like spray. Deselect it, then inspect the remaining compact deposit.':
    'Uno de los objetos seleccionados es un jet con una cascada amplia. Deselecciónalo y luego inspecciona el depósito compacto restante.',
  'The data did not move': 'Los datos no se movieron',
  'Only the boundaries changed. More bins reveal detail, but each bin contains fewer events and the shape becomes noisier.':
    'Solo cambiaron los límites. Más bins revelan detalle, pero cada bin contiene menos eventos y la forma se vuelve más ruidosa.',
  'Prediction committed': 'Predicción registrada',
  'Test the AND rule': 'Comprueba la regla AND',
  'A and C each have exactly two photons. Their transverse momentum does not matter until the next cut.':
    'A y C tienen exactamente dos fotones. Su momento transverso no importa hasta el siguiente corte.',
  'The rule checks photon count only. A and C survive because photon_n equals 2; B and D do not.':
    'La regla solo comprueba el número de fotones. A y C sobreviven porque photon_n es igual a 2; B y D no.',
  'Code copied': 'Código copiado',
  'Your analysis choices are now expressed as a ROOT RDataFrame pipeline.':
    'Tus decisiones de análisis ahora están expresadas como un pipeline ROOT RDataFrame.',
  'Copy manually': 'Copia manualmente',
  'Select the code block and copy it with your keyboard.': 'Selecciona el bloque de código y cópialo con el teclado.',

  // Learning engine lab
  'Internal foundation lab': 'Laboratorio interno de fundamentos',
  'Three ways to learn from one small engine': 'Tres formas de aprender con un motor pequeño',
  'These probes test continuous manipulation, linked hierarchy views, and sequential data transformations. The examples are synthetic on purpose: the engine coordinates learning mechanics, while each lesson owns its meaning.':
    'Estas pruebas examinan manipulación continua, vistas jerárquicas enlazadas y transformaciones secuenciales de datos. Los ejemplos son sintéticos a propósito: el motor coordina las mecánicas de aprendizaje mientras cada lección conserva su propio significado.',
  'Probe A': 'Prueba A',
  'Probe B': 'Prueba B',
  'Probe C': 'Prueba C',
  'Change a distribution': 'Cambia una distribución',
  'Move the controls and watch the same small dataset be selected and grouped.':
    'Mueve los controles y observa cómo se selecciona y agrupa el mismo conjunto pequeño de datos.',
  'Histogram controls': 'Controles del histograma',
  'Number of bins:': 'Número de bins:',
  'Keep values at or above:': 'Conserva valores iguales o mayores que:',
  'Reset histogram': 'Reiniciar histograma',
  'Histogram of the selected synthetic values': 'Histograma de los valores sintéticos seleccionados',
  'Five bins containing all twenty values.': 'Cinco bins que contienen los veinte valores.',
  'Interactive bars load when JavaScript is available.': 'Las barras interactivas se cargan cuando JavaScript está disponible.',
  '20 of 20 values remain in 5 bins.': '20 de 20 valores permanecen en 5 bins.',
  'Read the bin counts': 'Lee los conteos de los bins',
  'Changing bins changes the grouping. Changing the threshold changes which values enter the grouping.':
    'Cambiar los bins modifica la agrupación. Cambiar el umbral modifica qué valores entran en la agrupación.',
  'Predict before moving the bin control again: what will more bins do?':
    'Predice antes de volver a mover el control de bins: ¿qué harán más bins?',
  'Create more, narrower intervals': 'Crear más intervalos, más estrechos',
  'Create more data values': 'Crear más valores de datos',
  'Leave the bars unchanged': 'Dejar las barras sin cambios',
  'Connect structure to values': 'Conecta la estructura con los valores',
  'Expand a ROOT-like hierarchy and select a branch. The adjacent view is a second representation of the same lesson state.':
    'Expande una jerarquía similar a ROOT y selecciona una rama. La vista adyacente es una segunda representación del mismo estado de la lección.',
  'Synthetic ROOT object hierarchy': 'Jerarquía sintética de objetos ROOT',
  'Selected branch': 'Rama seleccionada',
  'Stored type': 'Tipo almacenado',
  'Unit': 'Unidad',
  'Example entry values': 'Valores de entradas de ejemplo',
  'Select a branch to connect its place in the hierarchy to the values it stores.':
    'Selecciona una rama para conectar su lugar en la jerarquía con los valores que almacena.',
  'Trace a filtering pipeline': 'Sigue un pipeline de filtrado',
  'Follow six events through two filters. Each frame reports what entered, what was removed, and what remains.':
    'Sigue seis eventos a través de dos filtros. Cada cuadro informa qué entró, qué se eliminó y qué permanece.',
  'Inspect the six input events': 'Inspecciona los seis eventos de entrada',
  'Photon count': 'Número de fotones',
  'Leading photon pT': 'pT del fotón líder',
  'Mass': 'Masa',
  'Which events will remain after requiring exactly two photons?':
    '¿Qué eventos permanecerán después de exigir exactamente dos fotones?',
  'E1, E3, E4, and E6': 'E1, E3, E4 y E6',
  'E1, E4, and E6': 'E1, E4 y E6',
  'E2 and E5': 'E2 y E5',
  'Filter pipeline steps': 'Pasos del pipeline de filtrado',
  'Reset trace': 'Reiniciar recorrido',
  'Input events': 'Eventos de entrada',
  'No filter has run yet.': 'Aún no se ha ejecutado ningún filtro.',
  'Six events enter and six remain.': 'Entran seis eventos y permanecen seis.',
  'Surviving mass values': 'Valores de masa supervivientes',
  'Commit a prediction, then advance to compare it with the first filter.':
    'Confirma una predicción y luego avanza para compararla con el primer filtro.',
  'Why these mechanics exist': 'Por qué existen estas mecánicas',
  'Mechanic': 'Mecánica',
  'Learner dynamic': 'Dinámica del estudiante',
  'Learning result': 'Resultado de aprendizaje',
  'Move ranges and commit a prediction': 'Mover rangos y confirmar una predicción',
  'Compare immediate changes, then test a hypothesis': 'Comparar cambios inmediatos y luego probar una hipótesis',
  'Separate sample selection from histogram grouping': 'Separar la selección de la muestra de la agrupación del histograma',
  'Select a branch in a hierarchy': 'Seleccionar una rama en una jerarquía',
  'Move between structure, metadata, and values': 'Moverse entre estructura, metadatos y valores',
  'Relate a branch to per-entry data': 'Relacionar una rama con datos por entrada',
  'Predict and step through filters': 'Predecir y avanzar por los filtros',
  'Compare entering, removed, and surviving events': 'Comparar eventos que entran, se eliminan y sobreviven',
  'See a pipeline as sequential dataset transformations': 'Ver un pipeline como transformaciones secuenciales del conjunto de datos',
  'Visible consequence.': 'Consecuencia visible.',
  'Compare the cause.': 'Compara la causa.',
  'Each tree entry stores a list because one event can contain more than one reconstructed photon.':
    'Cada entrada del árbol almacena una lista porque un evento puede contener más de un fotón reconstruido.',
  'This branch keeps the pseudorapidity values aligned with the photons stored in photon_pt.':
    'Esta rama mantiene los valores de pseudorapidez alineados con los fotones almacenados en photon_pt.',
  'There is one scalar weight per tree entry, so each event contributes its own amount to a later distribution.':
    'Hay un peso escalar por entrada del árbol, por lo que cada evento aporta su propia cantidad a una distribución posterior.',
  'Require exactly two photons': 'Exigir exactamente dos fotones',
  'Keep events where photonCount === 2.': 'Conserva los eventos donde photonCount === 2.',
  'Require leading photon pT > 35 GeV': 'Exigir pT del fotón líder > 35 GeV',
  'Apply the pT requirement to the events that survived step 2.': 'Aplica el requisito de pT a los eventos que sobrevivieron al paso 2.',
  'Build the mass distribution': 'Construye la distribución de masa',
  'Fill one mass value for every event that survived both filters.': 'Añade un valor de masa por cada evento que sobrevivió a ambos filtros.',
  'Removed at this step': 'Eliminado en este paso',
  'Removed earlier': 'Eliminado antes',
  'Remains in the sample': 'Permanece en la muestra',
  'Ready to test.': 'Listo para comprobar.',
  'Predict before advancing.': 'Predice antes de avanzar.',
  'Use Next to run the photon-count filter and compare its consequence.':
    'Usa Siguiente para ejecutar el filtro por número de fotones y comparar su consecuencia.',
  'Inspect photon counts, commit a prediction, then run the first filter.':
    'Inspecciona el número de fotones, confirma una predicción y luego ejecuta el primer filtro.',
  'Pause and predict.': 'Detente y predice.',
  'Choose which events should survive before the filter reveals them.':
    'Elige qué eventos deberían sobrevivir antes de que el filtro lo revele.',
  'Compare event counts.': 'Compara el número de eventos.',
  'E1, E3, E4, and E6 each contain exactly two photons. The filter removes E2 and E5 for having one and three photons.':
    'E1, E3, E4 y E6 contienen exactamente dos fotones. El filtro elimina E2 y E5 por tener uno y tres fotones.',
  'The filter checks photon count only: E2 has one photon and E5 has three. E1, E3, E4, and E6 remain.':
    'El filtro solo comprueba el número de fotones: E2 tiene uno y E5 tiene tres. E1, E3, E4 y E6 permanecen.',
};

const patterns: Array<[RegExp, (match: RegExpMatchArray) => string]> = [
  [/^(\d+) lessons available$/, (m) => `${m[1]} lecciones disponibles`],
  [/^(\d+) of (\d+) core lessons available$/, (m) => `${m[1]} de ${m[2]} lecciones troncales disponibles`],
  [/^([A-Z]\d+) · Start here$/, (m) => `${m[1]} · Empieza aquí`],
  [/^Unit ([A-F])$/, (m) => `Unidad ${m[1]}`],
  [/^(\d+) measurements remain fixed\. They are grouped into (\d+) bins across \[([^\]]+)\), each ([\d.]+) units wide\.$/,
    (m) => `${m[1]} mediciones permanecen fijas. Se agrupan en ${m[2]} bins a lo largo de [${m[3]}), cada uno de ${m[4]} unidades de ancho.`],
  [/^(\d+) fixed measurements grouped into (\d+) equal-width bins\. Underflow (\d+); overflow (\d+)\.$/,
    (m) => `${m[1]} mediciones fijas agrupadas en ${m[2]} bins de igual ancho. Underflow ${m[3]}; overflow ${m[4]}.`],
  [/^(\d+) source values are unchanged\. Only the (\d+) interval boundaries and resulting counts changed\.$/,
    (m) => `${m[1]} valores fuente no cambiaron. Solo cambiaron los límites de los ${m[2]} intervalos y los conteos resultantes.`],
  [/^All (\d+) measurements have contributed once\. The bar heights are the accumulated bin counts\.$/,
    (m) => `Las ${m[1]} mediciones han contribuido una vez. Las alturas de las barras son los conteos acumulados por bin.`],
  [/^(\d+) measurements have contributed\. The next Fill call will place ([\d.]+) in (.+)\.$/,
    (m) => `${m[1]} mediciones han contribuido. La próxima llamada Fill colocará ${m[2]} en ${m[3]}.`],
  [/^(\d+) of (\d+) measurements filled into four equal bins over \[0, 8\)\. Bin counts are (.+)\.$/,
    (m) => `${m[1]} de ${m[2]} mediciones se han llenado en cuatro bins iguales sobre [0, 8). Los conteos son ${m[3]}.`],
  [/^Both histograms now have area 1\. Their bin fractions overlap exactly, so the common shape is easy to see; the 12-versus-24 yield difference is intentionally hidden\.$/,
    () => 'Ambos histogramas ahora tienen área 1. Sus fracciones por bin se superponen exactamente, por lo que la forma común es fácil de ver; la diferencia de rendimiento entre 12 y 24 queda oculta deliberadamente.'],
  [/^Sample B has twice as many entries as sample A\. Its raw bin counts are therefore twice as high even though the relative pattern across bins is the same\.$/,
    () => 'La muestra B tiene el doble de entradas que la muestra A. Por eso sus conteos crudos por bin son el doble, aunque el patrón relativo entre bins sea el mismo.'],
  [/^Paired histogram bars shown as (.+)\. Sample A has (\d+) entries and sample B has (\d+)\.$/,
    (m) => `Barras de histogramas emparejadas mostradas como ${m[1] === 'unit-area shape' ? 'forma con área unitaria' : 'conteos crudos'}. La muestra A tiene ${m[2]} entradas y la muestra B tiene ${m[3]}.`],
  [/^(\d+) of 5 · (See|Predict|Cut|Plot|ROOT)$/, (m) => `${m[1]} de 5 · ${translateTrimmed(m[2])}`],
  [/^Step (\d+) of (\d+)(?:: (.+))?$/, (m) => `Paso ${m[1]} de ${m[2]}${m[3] ? `: ${translateTrimmed(m[3])}` : ''}`],
  [/^Stage (\d+) of (\d+): (.+)$/, (m) => `Etapa ${m[1]} de ${m[2]}: ${translateTrimmed(m[3])}`],
  [/^Object ([ABC]) selected$/, (m) => `Objeto ${m[1]} seleccionado`],
  [/^(\d+) GeV · η ([^·]+) · (compact deposit|broad spray)\. This object is (photon-like|jet-like)\. Inspect another object and compare what changes\.$/,
    (m) => `${m[1]} GeV · η ${m[2].trim()} · ${translateTrimmed(m[3])}. Este objeto es ${translateTrimmed(m[4])}. Inspecciona otro objeto y compara qué cambia.`],
  [/^(\d+) of (\d+) teaching events remain after a (\d+) GeV threshold\. Circles represent signal examples and diamonds represent background examples\.$/,
    (m) => `${m[1]} de ${m[2]} eventos didácticos permanecen tras un umbral de ${m[3]} GeV. Los círculos representan ejemplos de señal y los rombos ejemplos de fondo.`],
  [/^A (\d+)-bin mass histogram of (\d+) selected synthetic events\. A concentration appears near 125 GeV; changing the bins changes its visible shape, not the underlying event masses\.$/,
    (m) => `Histograma de masa con ${m[1]} bins para ${m[2]} eventos sintéticos seleccionados. Aparece una concentración cerca de 125 GeV; cambiar los bins modifica su forma visible, no las masas subyacentes de los eventos.`],
  [/^(\d+) selected events · concentration near 125 GeV$/, (m) => `${m[1]} eventos seleccionados · concentración cerca de 125 GeV`],
  [/^(\d+) events remain$/, (m) => `${m[1]} eventos permanecen`],
  [/^This cut keeps (\d+)% of the signal examples while rejecting (\d+)% of the background examples\. A cut trades sample size for purity\.$/,
    (m) => `Este corte conserva el ${m[1]}% de los ejemplos de señal mientras rechaza el ${m[2]}% de los ejemplos de fondo. Un corte intercambia tamaño de muestra por pureza.`],
  [/^(\d+) values remain in (\d+) bins$/, (m) => `${m[1]} valores permanecen en ${m[2]} bins`],
  [/^(\d+) of (\d+) values remain in (\d+) bins\. The tallest bin contains (\d+) values\.$/,
    (m) => `${m[1]} de ${m[2]} valores permanecen en ${m[3]} bins. El bin más alto contiene ${m[4]} valores.`],
  [/^(\d+) bins contain (\d+) of (\d+) values after keeping values at or above ([\d.]+)\.$/,
    (m) => `${m[1]} bins contienen ${m[2]} de ${m[3]} valores después de conservar los valores iguales o mayores que ${m[4]}.`],
  [/^([\d.]+) to ([\d.]+): (\d+) value$/, (m) => `${m[1]} a ${m[2]}: ${m[3]} valor`],
  [/^([\d.]+) to ([\d.]+): (\d+) values$/, (m) => `${m[1]} a ${m[2]}: ${m[3]} valores`],
  [/^The threshold admits (\d+) values; the bin count only changes how those values are grouped\.$/,
    (m) => `El umbral admite ${m[1]} valores; el número de bins solo cambia cómo se agrupan esos valores.`],
  [/^Entry (\d+): (.+)$/, (m) => `Entrada ${m[1]}: ${m[2]}`],
  [/^(.+) selected\.$/, (m) => `${m[1]} seleccionada.`],
  [/^(\d+) event enters; (\d+) is removed at this step; (\d+) remain\.$/,
    (m) => `Entra ${m[1]} evento; ${m[2]} se elimina en este paso; permanecen ${m[3]}.`],
  [/^(\d+) events enter; (\d+) are removed at this step; (\d+) remain\.$/,
    (m) => `Entran ${m[1]} eventos; ${m[2]} se eliminan en este paso; permanecen ${m[3]}.`],
  [/^(\d+) removed; (\d+) remain\.$/, (m) => `${m[1]} eliminados; permanecen ${m[2]}.`],
  [/^(Removed at this step|Removed earlier|Remains in the sample) · (\d+) photons · leading pT (\d+) GeV$/,
    (m) => `${translateTrimmed(m[1])} · ${m[2]} fotones · pT líder ${m[3]} GeV`],
];

function translateTrimmed(value: string): string {
  const exact = spanishText[value];
  if (exact !== undefined) return exact;
  for (const [pattern, replace] of patterns) {
    const match = value.match(pattern);
    if (match) return replace(match);
  }
  return value;
}

export function translateToSpanish(value: string): string {
  const match = value.match(/^(\s*)(.*?)(\s*)$/s);
  if (!match) return value;
  const [, leading, body, trailing] = match;
  if (!body) return value;
  const translated = translateTrimmed(body);
  if (translated === '') return '';
  const safeLeading = /^[?!.:,;]/.test(translated) ? '' : leading;
  return `${safeLeading}${translated}${trailing}`;
}

function shouldSkip(node: Node): boolean {
  const element = node.nodeType === Node.ELEMENT_NODE
    ? node as Element
    : node.parentElement;
  return Boolean(element?.closest('code, pre, script, style, [data-i18n-skip]'));
}

function translateAttributes(element: Element) {
  for (const attribute of ['aria-label', 'title', 'placeholder']) {
    const current = element.getAttribute(attribute);
    if (!current) continue;
    const translated = translateToSpanish(current);
    if (translated !== current) element.setAttribute(attribute, translated);
  }
}

function translateTextNode(node: Node) {
  if (node.nodeType !== Node.TEXT_NODE || shouldSkip(node)) return;
  const current = node.nodeValue;
  if (!current) return;
  const translated = translateToSpanish(current);
  if (translated !== current) node.nodeValue = translated;
}

function translateSubtree(root: Node) {
  if (shouldSkip(root)) return;
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root);
    return;
  }
  if (!(root instanceof Element) && root !== document) return;

  if (root instanceof Element) translateAttributes(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) translateAttributes(current as Element);
    else translateTextNode(current);
    current = walker.nextNode();
  }
}

function translateMetadata() {
  document.title = translateToSpanish(document.title);
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (description) description.content = translateToSpanish(description.content);
}

function storeLanguage(language: RootQuestLanguage) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // The selected language still applies to the current navigation when storage is unavailable.
  }
}

function syncPracticeQuery(language: RootQuestLanguage) {
  if (!window.location.pathname.includes('/practice/')) return;
  const url = new URL(window.location.href);
  if (language === 'es') url.searchParams.set('lang', 'es');
  else url.searchParams.delete('lang');
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}

export function installLanguageRuntime() {
  const root = document.documentElement;
  const language: RootQuestLanguage = root.dataset.language === 'es' ? 'es' : 'en';
  root.lang = language;
  syncPracticeQuery(language);

  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-language-option]')) {
    const option = button.dataset.languageOption as RootQuestLanguage;
    button.setAttribute('aria-pressed', String(option === language));
    button.addEventListener('click', () => {
      if (option !== 'en' && option !== 'es') return;
      storeLanguage(option);
      syncPracticeQuery(option);
      window.location.reload();
    });
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const practiceLanguageLink = target.closest<HTMLAnchorElement>('.practice-language a');
    if (!practiceLanguageLink) return;
    const targetUrl = new URL(practiceLanguageLink.href, window.location.href);
    storeLanguage(targetUrl.searchParams.get('lang') === 'es' ? 'es' : 'en');
  });

  if (language !== 'es') return;

  translateMetadata();
  translateSubtree(document.body);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        translateTextNode(mutation.target);
        continue;
      }
      if (mutation.type === 'attributes' && mutation.target instanceof Element) {
        translateAttributes(mutation.target);
        continue;
      }
      for (const node of mutation.addedNodes) translateSubtree(node);
    }
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['aria-label', 'title', 'placeholder'],
  });
}
