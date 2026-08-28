import { expect, test, type Page } from '@playwright/test';

const spanishRoutes = [
  { path: '', heading: 'Observa el evento. Encuentra la señal.' },
  { path: 'course/', heading: 'Tu ruta por ROOT' },
  { path: 'learn/histogram-binning/', heading: 'Mismos datos, distintos bins' },
  { path: 'learn/histogram-fill/', heading: 'Construye un histograma' },
  { path: 'learn/histogram-compare/', heading: 'Lee y compara histogramas' },
  { path: 'learn/measurement-errors/', heading: 'Mediciones con incertidumbres' },
  { path: 'learn/root-file-inspection/', heading: 'Abre e inspecciona un archivo ROOT' },
  { path: 'learn/tree-branch-entry/', heading: 'Árbol, rama, entrada' },
  { path: 'learn/event-collections/', heading: 'Colecciones dentro de eventos' },
  { path: 'learn/root-documentation/', heading: 'Usa ROOT sin memorizar ROOT' },
  { path: 'learn/higgs-hunt/', heading: 'Higgs Hunt', secondary: 'Encuentra los dos fotones' },
  { path: 'lab/learning-engine/', heading: 'Tres formas de aprender con un motor pequeño' },
  { path: 'practice/manipulate/', heading: 'Laboratorio de selección' },
  { path: 'practice/observe/', heading: 'Detective de eventos' },
  { path: 'practice/predict/', heading: 'Pruebas de predicción' },
  { path: 'practice/code/', heading: 'Constructor ROOT' },
] as const;

async function chooseSpanish(page: Page) {
  await page.goto('./');
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'en'));
  await page.reload();
  await Promise.all([page.waitForNavigation(), page.locator('[data-language-option="es"]').click()]);
}

test('language choice persists across every current learner-facing route', async ({ page }) => {
  await chooseSpanish(page);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('[data-language-option="es"]')).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => localStorage.getItem('rootquest-language'))).toBe('es');

  for (const route of spanishRoutes) {
    await page.goto(route.path || './');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('h1').first()).toHaveText(route.heading);
    if ('secondary' in route) await expect(page.locator('#hunt-stage-title')).toHaveText(route.secondary);
  }

  await page.goto('learn/measurement-errors/');
  await expect(page.locator('#a4-summary')).toContainText('el valor central permanece en 4.6');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Distingue una distribución de puntos medidos y aprende cómo TGraphErrors representa incertidumbres sin mover los valores centrales.');

  await page.goto('learn/root-file-inspection/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Aprende el flujo cotidiano de ROOT: abrir un archivo, inspeccionar sus objetos almacenados y recuperar un objeto por nombre sólo después de saber qué contiene.');

  await page.goto('learn/tree-branch-entry/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Aprende cómo un TTree organiza valores de ramas a través de entradas y usa con cuidado la analogía dataset/columna/registro.');

  await page.goto('learn/event-collections/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Aprende por qué una entrada de TTree puede contener colecciones de tamaño variable de objetos reconstruidos mientras las ramas escalares mantienen un valor por entrada.');

  await page.goto('learn/root-documentation/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Aprende a convertir una intención de análisis en la clase, método, firma y ejemplo correctos usando la referencia oficial, tutoriales y ayuda local de ROOT.');

  await Promise.all([page.waitForNavigation(), page.locator('[data-language-option="en"]').click()]);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await page.evaluate(() => localStorage.getItem('rootquest-language'))).toBe('en');
  await page.goto('course/');
  await expect(page.locator('h1')).toHaveText('Your path through ROOT');
});

test('Spanish copy stays natural across inline code and dynamic lesson feedback', async ({ page }) => {
  await chooseSpanish(page);
  await page.goto('course/');
  await expect(page.locator('#anchor-title')).toHaveText('Higgs Hunt — guiada');

  await page.goto('learn/histogram-fill/');
  await expect(page.locator('#code-heading')).toHaveText('Tus clics son llamadas a Fill');
  await expect(page.locator('#transfer-heading')).toHaveText('¿Qué significa Fill(5.7)?');

  await page.goto('learn/histogram-compare/');
  const comparisonExplanation = page.locator('.lesson-card[aria-labelledby="code-heading"] > p:not(.stage-kicker)').first();
  await expect(comparisonExplanation).toContainText('GetMean y GetStdDev');
  await expect(comparisonExplanation).not.toContainText(', and ');

  await page.goto('learn/measurement-errors/');
  await page.getByLabel('El punto central queda fijo y la barra vertical de error duplica su ancho').check();
  await page.locator('#a4-prediction').getByRole('button', { name: 'Confirmar predicción' }).click();
  await expect(page.locator('#a4-prediction rq-feedback')).toContainText('Predicción confirmada');

  await page.goto('learn/root-file-inspection/');
  await page.locator('#b1-prediction').getByRole('radio', { name: 'm_gg' }).check();
  await page.locator('#b1-prediction').getByRole('button', { name: 'Confirmar elección' }).click();
  await expect(page.locator('#b1-prediction rq-feedback')).toContainText('Objeto identificado');

  await page.goto('learn/tree-branch-entry/');
  await page.getByLabel('Lees otro campo de la misma entrada').check();
  await page.locator('#b2-prediction').getByRole('button', { name: 'Confirmar predicción' }).click();
  await expect(page.locator('#b2-prediction rq-feedback')).toContainText('Misma entrada, otro campo');

  await page.goto('learn/event-collections/');
  await page.getByLabel('photon_pt tiene tres valores dentro de esa entrada; event_weight sigue siendo un escalar').check();
  await page.locator('#b3-prediction').getByRole('button', { name: 'Confirmar predicción' }).click();
  await expect(page.locator('#b3-prediction rq-feedback')).toContainText('Una entrada, varios objetos');

  await page.goto('learn/root-documentation/');
  await page.getByLabel('Referencia oficial de ROOT::RDataFrame: lista de métodos y firmas').check();
  await page.locator('#b4-source-choice').getByRole('button', { name: 'Confirmar elección' }).click();
  await expect(page.locator('#b4-source-choice rq-feedback')).toContainText('Buena ruta');
  await page.getByLabel('Count() — cuenta las entradas procesadas').check();
  await page.locator('#b4-transfer').getByRole('button', { name: 'Comprobar comprensión' }).click();
  await expect(page.locator('#b4-transfer rq-feedback')).toContainText('Transferencia completa');

  await page.goto('learn/higgs-hunt/');
  await expect(page.locator('#hunt-stage-label')).toHaveText('1 de 5 · Observa');
  await page.locator('[data-object-id="photon-1"]').click();
  await expect(page.locator('#object-feedback')).toContainText('depósito compacto');
  await expect(page.locator('#object-feedback')).toContainText('Este objeto es compatible con un fotón.');
});
