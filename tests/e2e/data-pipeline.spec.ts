import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const path = 'learn/data-pipeline/';

test.beforeEach(async ({ page }) => { await page.goto(path); });

test('C1 requires prediction then traces survivors through sequential filters', async ({ page }) => {
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('#c1-feedback')).toContainText('Predict first');
  await page.getByLabel('E1, E3, E4, E6').check();
  await page.locator('#c1-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('#c1-summary')).toHaveText('6 enter; 2 are removed here; 4 remain.');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('#c1-summary')).toHaveText('4 enter; 1 are removed here; 3 remain.');
  await expect(page.locator('#c1-events [data-status="removed-before"] strong')).toContainText(['E2', 'E5']);
  await page.getByLabel('Only E1, E3, E4 and E6').check();
  await page.locator('#c1-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#c1-transfer rq-feedback')).toContainText('Transfer complete');
});

test('C1 is complete in Spanish and preserves the same causal path', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('h1')).toHaveText('Un pipeline transforma un conjunto de datos');
  await page.getByLabel('E1, E3, E4, E6').check();
  await page.locator('#c1-prediction').getByRole('button', { name: 'Confirmar predicción' }).click();
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await expect(page.locator('#c1-summary')).toContainText('6 entran; 2 se eliminan aquí; 4 permanecen');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Sigue eventos a través de filtros sucesivos de RDataFrame y observa cómo cada transformación recibe los sobrevivientes del paso anterior.');
});

test('C1 has no automated WCAG A/AA violations and no mobile overflow', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
