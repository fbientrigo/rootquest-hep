import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/data-vs-simulation/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('E3 requires a normalization prediction before revealing Data/MC comparison modes', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Data vs simulation' })).toBeVisible();
  await expect(page.locator('#e3-after-prediction')).toBeHidden();

  await page.getByLabel('The yield difference disappears and only the shapes remain').check();
  await page.locator('#e3-prediction').getByRole('button', { name: 'Commit prediction' }).click();

  await expect(page.locator('#e3-prediction rq-feedback')).toContainText('Normalization changes the question.');
  await expect(page.locator('#e3-after-prediction')).toBeVisible();
});

test('E3 preserves the yield mismatch unless the learner explicitly chooses shape-only normalization', async ({ page }) => {
  await page.getByLabel('The yield difference disappears and only the shapes remain').check();
  await page.locator('#e3-prediction').getByRole('button', { name: 'Commit prediction' }).click();

  await expect(page.locator('[data-e3-ratio]')).toHaveText(['2.00', '2.00', '2.00']);
  await expect(page.locator('#e3-data-total')).toHaveText('21');
  await expect(page.locator('#e3-mc-total')).toHaveText('10.5');

  await page.getByLabel('Shape only · unit area').check();
  await expect(page.locator('[data-e3-ratio]')).toHaveText(['1.00', '1.00', '1.00']);
  await expect(page.locator('#e3-data-total')).toHaveText('1.000');
  await expect(page.locator('#e3-mc-total')).toHaveText('1.000');
  await expect(page.locator('#e3-summary')).toContainText('total-yield information was deliberately removed');
});

test('E3 transfer keeps expected normalization for an event-yield question', async ({ page }) => {
  await page.locator('#e3-transfer').getByLabel('Keep the expected normalization and compare yields').check();
  await page.locator('#e3-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#e3-transfer rq-feedback')).toContainText('You preserved the quantity you want to test.');
});

test('E3 critical interaction is complete in Spanish', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { name: 'Datos frente a simulación' })).toBeVisible();
  await page.getByLabel('Desaparece la diferencia de rendimiento y quedan sólo las formas').check();
  await page.locator('#e3-prediction').getByRole('button', { name: 'Confirmar predicción' }).click();
  await expect(page.locator('#e3-prediction rq-feedback')).toContainText('Normalizar cambia la pregunta.');
  await page.getByLabel('Sólo forma · área unitaria').check();
  await expect(page.locator('#e3-summary')).toContainText('La información del rendimiento total fue eliminada deliberadamente.');
  await page.locator('#e3-transfer').getByLabel('Conservar la normalización esperada y comparar rendimientos').check();
  await page.locator('#e3-transfer').getByRole('button', { name: 'Comprobar comprensión' }).click();
  await expect(page.locator('#e3-transfer rq-feedback')).toContainText('Conservaste la cantidad que quieres probar.');
});

test('E3 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('E3 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Data vs simulation' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
