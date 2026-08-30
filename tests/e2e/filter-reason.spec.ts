import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => { await page.goto('learn/filter-reason/'); });

test('C2 translates a criterion into survivors and ROOT Filter code', async ({ page }) => {
  await page.getByLabel('Keep events with leading pT > 35 GeV').check();
  await page.getByLabel('E1, E2, E4, E5, E6').check();
  await page.locator('#c2-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#c2-summary')).toContainText('5 of 6 rows');
  await expect(page.locator('#c2-code')).toHaveText('selected = df.Filter("leadingPhotonPt > 35")');
  await page.getByLabel('photonCount >= 2').check();
  await page.locator('#c2-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#c2-transfer rq-feedback')).toContainText('Transfer complete');
});

test('C2 works in Spanish', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Filter: conserva filas por una razón');
  await page.getByLabel('Conservar eventos con exactamente 2 fotones').check();
  await page.getByLabel('E1, E3, E4, E6').check();
  await page.locator('#c2-prediction').getByRole('button', { name: 'Aplicar predicción' }).click();
  await expect(page.locator('#c2-summary')).toContainText('4 de 6 filas');
});

test('C2 has no WCAG A/AA violations and no narrow-screen overflow', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
