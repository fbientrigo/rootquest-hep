import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/actions-summary/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('C4 maps analysis questions to result-producing actions', async ({ page }) => {
  await page.getByLabel('Analysis question').selectOption('mean-mass');
  await page.getByLabel('Mean').check();
  await page.locator('#c4-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#c4-summary')).toContainText('Mean directly answers');
  await expect(page.locator('#c4-code')).toContainText('df.Mean("mass")');

  await page.getByLabel('Analysis question').selectOption('mass-shape');
  await page.getByLabel('Histo1D').check();
  await page.locator('#c4-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#c4-summary')).toContainText('Histo1D directly answers');

  await page.locator('#c4-transfer').getByLabel('Min').check();
  await page.locator('#c4-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#c4-transfer rq-feedback')).toContainText('Transfer complete');
});

test('C4 exposes the same causal learner flow in Spanish', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('h1')).toHaveText('Las acciones resumen la muestra');
  await page.getByLabel('Pregunta de análisis').selectOption('sum-weight');
  await page.getByLabel('Sum').check();
  await page.locator('#c4-prediction').getByRole('button', { name: 'Confirmar predicción' }).click();
  await expect(page.locator('#c4-summary')).toContainText('Sum responde directamente');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Elige la acción de RDataFrame que responde una pregunta de análisis: contar filas, resumir una columna o construir una distribución.');
});

test('C4 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('C4 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByLabel('Analysis question').selectOption('sum-weight');
  await page.getByLabel('Sum').check();
  await page.locator('#c4-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
