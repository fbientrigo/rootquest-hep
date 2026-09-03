import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/derived-sample/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('C6 distinguishes Snapshot persistence from Range inspection', async ({ page }) => {
  await page.getByLabel('Persist the useful rows and columns with Snapshot').check();
  await page.locator('#c6-persist').getByRole('button', { name: 'Commit decision' }).click();
  await expect(page.locator('#c6-persist rq-feedback')).toContainText('Persistence has a concrete reason');
  await expect(page.getByRole('region', { name: 'Express the decision after understanding why you persist' }).locator('pre')).toContainText('Snapshot');

  await page.getByLabel('Use Range(5) on a temporary pipeline branch').check();
  await page.locator('#c6-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#c6-transfer rq-feedback')).toContainText('Range is for processing less, not for saving');
});

test('C6 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('C6 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByLabel('Use Range(5) on a temporary pipeline branch').check();
  await page.locator('#c6-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#c6-transfer rq-feedback')).toContainText('Range is for processing less');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
