import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/simple-fit/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('E4 makes model parameters visible before fitting', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Fit a simple model' })).toBeVisible();
  await page.locator('#e4-slope').fill('2');
  await expect(page.locator('#e4-slope-output')).toHaveText('2.0');
  await expect(page.locator('#e4-preview-summary')).toContainText('y(4) = 10.0');
});

test('E4 predicts range sensitivity before revealing fit controls', async ({ page }) => {
  await expect(page.locator('#e4-after-prediction')).toBeHidden();
  await page.getByLabel('The fitted slope increases').check();
  await page.locator('#e4-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#e4-prediction rq-feedback')).toContainText('The range changes which data pull on the model.');
  await expect(page.locator('#e4-after-prediction')).toBeVisible();
});

test('E4 fit range changes the fitted parameters for the prepared sample', async ({ page }) => {
  await page.getByLabel('The fitted slope increases').check();
  await page.locator('#e4-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await page.getByRole('button', { name: 'Run teaching fit' }).click();
  await expect(page.locator('#e4-fit-intercept')).toHaveText('2.04');
  await expect(page.locator('#e4-fit-slope')).toHaveText('1.50');

  await page.getByLabel(/0 ≤ x ≤ 6/).check();
  await page.getByRole('button', { name: 'Run teaching fit' }).click();
  await expect(page.locator('#e4-fit-intercept')).toHaveText('0.37');
  await expect(page.locator('#e4-fit-slope')).toHaveText('2.67');
  await expect(page.locator('#e4-fit-summary')).toContainText('algorithm does not know');
});

test('E4 transfer maps a justified range to TF1 plus Fit option R', async ({ page }) => {
  await page.locator('#e4-transfer').getByLabel(/TF1\("model"/).first().check();
  await page.locator('#e4-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#e4-transfer rq-feedback')).toContainText('The code preserves the model contract.');
});

test('E4 critical interaction is complete in Spanish', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { name: 'Ajusta un modelo simple' })).toBeVisible();
  await page.getByLabel('La pendiente ajustada aumenta').check();
  await page.locator('#e4-prediction').getByRole('button', { name: 'Confirmar predicción' }).click();
  await expect(page.locator('#e4-prediction rq-feedback')).toContainText('El rango cambia qué datos tiran del modelo.');
  await page.getByRole('button', { name: 'Ejecutar ajuste educativo' }).click();
  await expect(page.locator('#e4-fit-summary')).toContainText('Ajustando sólo 0 ≤ x ≤ 4');
  await page.locator('#e4-transfer').getByLabel(/TF1\("model"/).first().check();
  await page.locator('#e4-transfer').getByRole('button', { name: 'Comprobar comprensión' }).click();
  await expect(page.locator('#e4-transfer rq-feedback')).toContainText('El código conserva el contrato del modelo.');
});

test('E4 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('E4 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Fit a simple model' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
