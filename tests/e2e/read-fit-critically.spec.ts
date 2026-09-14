import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/read-fit-critically/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('E5 compares fit diagnostics rather than parameter values alone', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Read a fit critically' })).toBeVisible();
  await expect(page.locator('#e5-slope')).toHaveText('1.50');
  await expect(page.locator('#e5-slope-error')).toHaveText('0.06');
  await expect(page.locator('#e5-reduced-chi2')).toHaveText('0.6');

  await page.getByLabel(/0 ≤ x ≤ 6/).check();
  await expect(page.locator('#e5-slope')).toHaveText('2.67');
  await expect(page.locator('#e5-slope-error')).toHaveText('0.04');
  await expect(page.locator('#e5-reduced-chi2')).toHaveText('108.8');
  await expect(page.locator('#e5-report-summary')).toContainText('does not rescue an inadequate model');
});

test('E5 prediction separates parameter precision from model adequacy', async ({ page }) => {
  await page.getByLabel('No. The full range reveals that the straight line is inadequate for those points.').check();
  await page.locator('#e5-prediction').getByRole('button', { name: 'Commit diagnosis' }).click();
  await expect(page.locator('#e5-prediction rq-feedback')).toContainText('Parameter uncertainty does not diagnose the model by itself.');
  await expect(page.locator('#e5-after-prediction')).toBeVisible();
  await expect(page.getByText(/TFitResultPtr result/)).toBeVisible();
});

test('E5 transfer prioritizes residuals and goodness-of-fit cues', async ({ page }) => {
  await page.getByLabel('No. The full range reveals that the straight line is inadequate for those points.').check();
  await page.locator('#e5-prediction').getByRole('button', { name: 'Commit diagnosis' }).click();
  await page.locator('#e5-transfer').getByLabel(/The residual pattern and goodness-of-fit/).check();
  await page.locator('#e5-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#e5-transfer rq-feedback')).toContainText('reading the fit as evidence');
});

test('E5 critical interaction is complete in Spanish', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { name: 'Lee un ajuste críticamente' })).toBeVisible();
  await page.getByLabel(/0 ≤ x ≤ 6/).check();
  await expect(page.locator('#e5-report-summary')).toContainText('Más precisión sobre un parámetro no rescata un modelo inadecuado');
  await page.getByLabel('No. El rango completo revela que la recta es inadecuada para esos puntos.').check();
  await page.locator('#e5-prediction').getByRole('button', { name: 'Confirmar diagnóstico' }).click();
  await expect(page.locator('#e5-prediction rq-feedback')).toContainText('La incertidumbre del parámetro no diagnostica el modelo por sí sola.');
  await page.locator('#e5-transfer').getByLabel(/El patrón de residuos y la bondad de ajuste/).check();
  await page.locator('#e5-transfer').getByRole('button', { name: 'Comprobar comprensión' }).click();
  await expect(page.locator('#e5-transfer rq-feedback')).toContainText('Lees el ajuste como evidencia');
});

test('E5 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('E5 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Read a fit critically' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
