import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/measurement-errors/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('A4 keeps central measurements fixed while uncertainty bars change', async ({ page }) => {
  await expect(page.locator('#a4-summary')).toContainText('central value stays 4.6');
  await page.locator('#a4-error-scale').fill('2');
  await expect(page.locator('#a4-error-scale-output')).toHaveValue('2.0×');
  await expect(page.locator('#a4-summary')).toContainText('±1.00');
  await expect(page.locator('#a4-summary')).toContainText('central value stays 4.6');

  await page.getByLabel('The central point stays fixed and the vertical error bar becomes twice as wide').check();
  await page.locator('#a4-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#a4-prediction rq-feedback')).toContainText('Prediction supported');

  await page.getByLabel('A graph of measured points with error bars').check();
  await page.locator('#a4-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#a4-transfer rq-feedback')).toContainText('Transfer complete');
});

test('A4 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('A4 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.locator('#a4-error-scale').fill('1.5');
  await expect(page.locator('#a4-error-scale-output')).toHaveValue('1.5×');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
