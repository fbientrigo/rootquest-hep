import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const path = 'learn/assemble-analysis/';

test('F1 commits a plan before revealing the ROOT pipeline', async ({ page }) => {
  await page.goto(path);
  await expect(page.getByRole('heading', { name: 'Assemble an analysis from a question' })).toBeVisible();
  await expect(page.locator('#f1-after-plan')).toBeHidden();
  await page.getByLabel(/Use photon pt\/eta\/phi/).check();
  await page.getByRole('button', { name: 'Commit plan' }).click();
  await expect(page.locator('#f1-after-plan')).toBeVisible();
  await expect(page.getByText('ROOT::RDataFrame df')).toBeVisible();
  await page.getByLabel(/Define\(x\).*Filter/).check();
  await page.getByRole('button', { name: 'Check plan' }).click();
  await expect(page.getByText('Derive, select, then summarize.')).toBeVisible();
});

test('F1 is complete in Spanish and accessible', async ({ page }) => {
  await page.goto(path);
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Construye un análisis a partir de una pregunta' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Fijar plan' })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('F1 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(path);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
