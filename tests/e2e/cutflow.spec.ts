import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/cutflow/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('C5 diagnoses where a selection pipeline loses events', async ({ page }) => {
  await page.getByLabel('No, I need stage-by-stage counts').check();
  await page.locator('#c5-inference').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#c5-inference rq-feedback')).toContainText('final count does not locate the loss');

  await page.getByRole('button', { name: 'Show counts per filter' }).click();
  await expect(page.locator('#c5-report')).toBeVisible();
  await expect(page.locator('#c5-report')).toContainText('Exactly two photons');
  await expect(page.locator('#c5-report-feedback')).toContainText('first filter rejects 2 events');

  await page.locator('#c5-diagnosis').getByLabel('Exactly two photons').check();
  await page.locator('#c5-diagnosis').getByRole('button', { name: 'Diagnose' }).click();
  await expect(page.locator('#c5-diagnosis rq-feedback')).toContainText('Loss located');

  await page.locator('#c5-transfer').getByLabel('Cut B').check();
  await page.locator('#c5-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#c5-transfer rq-feedback')).toContainText('Transfer complete');
});

test('C5 exposes the same causal path in Spanish', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('h1')).toHaveText('Cutflow: ¿adónde fueron los eventos?');
  await page.getByLabel('No, necesito conteos por etapa').check();
  await page.locator('#c5-inference').getByRole('button', { name: 'Confirmar predicción' }).click();
  await page.getByRole('button', { name: 'Mostrar conteos por filtro' }).click();
  await expect(page.locator('#c5-report-feedback')).toContainText('el primer filtro rechaza 2 eventos');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Diagnostica un pipeline de selección de RDataFrame midiendo cuántas entradas pasan cada filtro nombrado con Report.');
});

test('C5 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('C5 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByLabel('No, I need stage-by-stage counts').check();
  await page.locator('#c5-inference').getByRole('button', { name: 'Commit prediction' }).click();
  await page.getByRole('button', { name: 'Show counts per filter' }).click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
