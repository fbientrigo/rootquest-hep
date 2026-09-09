import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/build-candidate/';

test.beforeEach(async ({ page }) => { await page.goto(lessonPath); });

test('D6 selects, orders and combines photons into one event-level candidate', async ({ page }) => {
  await expect(page.locator('#d6-after-prediction')).toBeHidden();
  await page.getByLabel('A + C, because they have the two highest pT values among selected photons').check();
  await page.locator('#d6-pair').getByRole('button', { name: 'Commit candidate' }).click();
  await expect(page.locator('#d6-pair rq-feedback')).toContainText('Select first; order second.');
  await expect(page.locator('#d6-selected')).toHaveText('D (35 GeV) · C (44 GeV) · A (62 GeV)');
  await expect(page.locator('#d6-ordered')).toHaveText('A (62 GeV) → C (44 GeV) → D (35 GeV)');
  await expect(page.locator('#d6-candidate')).toHaveText('A + C');
  await expect(page.locator('#d6-mass')).toHaveText('108.5 GeV');

  await page.getByLabel('Require at least two selected photons and reject this event before building the candidate').check();
  await page.locator('#d6-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#d6-transfer rq-feedback')).toContainText('Guarantee two objects first.');
});

test('D6 Spanish interaction preserves candidate-building reasoning and language preference', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('h1')).toHaveText('Construye un candidato');
  await page.getByLabel('A + C, porque son los dos pT más altos entre los seleccionados').check();
  await page.locator('#d6-pair').getByRole('button', { name: 'Confirmar candidato' }).click();
  await expect(page.locator('#d6-pair rq-feedback')).toContainText('Selecciona primero; ordena después.');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Combina selección de objetos, ordenamiento por pT y cuatro-vectores para construir un candidato event-level de dos fotones con RVec y RDataFrame.');
  await page.goto('course/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('D6 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('D6 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByLabel('A + C, because they have the two highest pT values among selected photons').check();
  await page.locator('#d6-pair').getByRole('button', { name: 'Commit candidate' }).click();
  await expect(page.locator('#d6-mass')).toHaveText('108.5 GeV');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
