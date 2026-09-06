import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/work-with-collections/';

test.beforeEach(async ({ page }) => { await page.goto(lessonPath); });

test('D3 filters and summarizes variable-length collections', async ({ page }) => {
  await expect(page.locator('#d3-selected')).toHaveText('[52, 34] GeV');
  await expect(page.locator('#d3-count')).toHaveText('2');
  await expect(page.locator('#d3-sum')).toHaveText('86 GeV');

  await page.getByLabel('Event C · [65, 44, 31, 18] GeV').check();
  await page.getByLabel('pT > 40 GeV').check();
  await expect(page.locator('#d3-selected')).toHaveText('[65, 44] GeV');
  await expect(page.locator('#d3-count')).toHaveText('2');
  await expect(page.locator('#d3-sum')).toHaveText('109 GeV');

  await page.getByLabel('[65, 44] remain, size() = 2 and Sum() = 109 GeV').check();
  await page.locator('#d3-predict').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#d3-predict rq-feedback')).toContainText('The collection summarizes directly');

  await page.getByLabel('ROOT::VecOps::Sum(selectedJetPt)').check();
  await page.locator('#d3-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#d3-transfer rq-feedback')).toContainText('Pattern transferred');
});

test('D3 Spanish interaction preserves the same collection reasoning and language preference', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('h1')).toHaveText('Trabaja con colecciones');
  await page.getByLabel('Quedan [65, 44], size() = 2 y Sum() = 109 GeV').check();
  await page.locator('#d3-predict').getByRole('button', { name: 'Confirmar predicción' }).click();
  await expect(page.locator('#d3-predict rq-feedback')).toContainText('La colección se resume directamente');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Filtra y resume colecciones de partículas de longitud variable con RVec de ROOT sin bookkeeping manual.');
  await page.goto('course/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await page.goto(lessonPath);
  await expect(page.locator('h1')).toHaveText('Trabaja con colecciones');
});

test('D3 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('D3 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByLabel('Event C · [65, 44, 31, 18] GeV').check();
  await expect(page.locator('#d3-source')).toHaveText('[65, 44, 31, 18] GeV');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
