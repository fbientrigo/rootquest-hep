import { expect, test } from '@playwright/test';

test('Unit E learner routes share the persisted global language preference', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'en'));
  await page.reload();

  await Promise.all([page.waitForNavigation(), page.locator('[data-language-option="es"]').click()]);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  expect(await page.evaluate(() => localStorage.getItem('rootquest-language'))).toBe('es');

  await page.goto('learn/event-weights-normalization/');
  await expect(page.getByRole('heading', { name: 'Pesos de eventos y normalización' })).toBeVisible();

  await page.goto('learn/data-vs-simulation/');
  await expect(page.getByRole('heading', { name: 'Datos frente a simulación' })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Compara Data con predicciones simuladas sin normalizar silenciosamente la cantidad que la pregunta del análisis intenta probar.');

  await Promise.all([page.waitForNavigation(), page.locator('[data-language-option="en"]').click()]);
  expect(await page.evaluate(() => localStorage.getItem('rootquest-language'))).toBe('en');
  await page.goto('learn/data-vs-simulation/');
  await expect(page.getByRole('heading', { name: 'Data vs simulation' })).toBeVisible();
});
