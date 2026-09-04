import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/object-coordinates/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('D1 isolates pT, eta and phi changes and transfers coordinate choice', async ({ page }) => {
  await page.getByLabel('More forward · only eta changes').check();
  await expect(page.locator('#d1-pt')).toHaveText('45 GeV');
  await expect(page.locator('#d1-eta')).toHaveText('2.00');
  await expect(page.locator('#d1-phi')).toHaveText('0.00 rad');
  await expect(page.locator('#d1-summary')).toContainText('changed: eta');

  await page.getByLabel('phi', { exact: true }).first().check();
  await page.locator('#d1-predict').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#d1-predict rq-feedback')).toContainText('Correct coordinate');

  await page.locator('#d1-transfer').getByLabel('eta', { exact: true }).check();
  await page.locator('#d1-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#d1-transfer rq-feedback')).toContainText('Correct coordinate');
});

test('D1 Spanish interaction preserves scientific meaning', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Coordenadas de un objeto reconstruido');
  await page.getByLabel('Rotado · sólo phi cambia').check();
  await expect(page.locator('#d1-summary')).toContainText('cambia: phi');
  await page.locator('#d1-predict').getByLabel('phi', { exact: true }).check();
  await page.locator('#d1-predict').getByRole('button', { name: 'Confirmar predicción' }).click();
  await expect(page.locator('#d1-predict rq-feedback')).toContainText('Coordenada correcta');
});

test('D1 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('D1 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByLabel('Harder · only pT changes').check();
  await expect(page.locator('#d1-pt')).toHaveText('70 GeV');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
