import { expect, test, type Page } from '@playwright/test';

const spanishRoutes = [
  { path: '', heading: 'Observa el evento. Encuentra la señal.' },
  { path: 'course/', heading: 'Tu ruta por ROOT' },
  { path: 'learn/histogram-binning/', heading: 'Mismos datos, distintos bins' },
  { path: 'learn/histogram-fill/', heading: 'Construye un histograma' },
  { path: 'learn/histogram-compare/', heading: 'Lee y compara histogramas' },
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
  await Promise.all([
    page.waitForNavigation(),
    page.locator('[data-language-option="es"]').click(),
  ]);
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
    if ('secondary' in route) {
      await expect(page.locator('#hunt-stage-title')).toHaveText(route.secondary);
    }
  }

  await page.goto('learn/histogram-binning/');
  await expect(page.locator('#a1-feedback')).toContainText('Mismas mediciones, nueva agrupación.');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Aprende qué cambia el binning de un histograma, qué permanece fijo y cómo aparece la misma idea en ROOT.',
  );

  await Promise.all([
    page.waitForNavigation(),
    page.locator('[data-language-option="en"]').click(),
  ]);

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

  await page.goto('learn/higgs-hunt/');
  await expect(page.locator('#hunt-stage-label')).toHaveText('1 de 5 · Observa');
  await page.locator('[data-object-id="photon-1"]').click();
  await expect(page.locator('#object-feedback')).toContainText('depósito compacto');
  await expect(page.locator('#object-feedback')).toContainText('Este objeto es compatible con un fotón.');
});
