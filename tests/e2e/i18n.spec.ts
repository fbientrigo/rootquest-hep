import { expect, test } from '@playwright/test';

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

test('language choice persists across every current learner-facing route', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'en'));
  await page.reload();

  await Promise.all([
    page.waitForNavigation(),
    page.locator('[data-language-option="es"]').click(),
  ]);

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

test('legacy practice language links update the global preference', async ({ page }) => {
  await page.goto('practice/manipulate/?lang=es');
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();

  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('.practice-language a[lang="en"]')).toHaveCount(1);
  await page.locator('.practice-language a[lang="en"]').click({ force: true });
  await page.waitForLoadState('domcontentloaded');

  expect(await page.evaluate(() => localStorage.getItem('rootquest-language'))).toBe('en');
});
