import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/histogram-fill/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('A2 connects Fill calls to one-bin increments and completes transfer', async ({ page }) => {
  await expect(page.locator('#a2-fill-count')).toHaveText('0 / 8');
  await expect(page.locator('#a2-active-bin')).toHaveText('[0, 2)');

  await page.getByRole('button', { name: 'Fill(0.8)' }).click();
  await expect(page.locator('#a2-fill-count')).toHaveText('1 / 8');
  await expect(page.locator('#a2-root-code')).toContainText('h.Fill(0.8)');

  await page.getByLabel('[4, 6)').check();
  await page.locator('#a2-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#a2-prediction rq-feedback')).toContainText('Prediction supported');

  await page.getByLabel('Find the bin containing 5.7 and increment it by one').check();
  await page.locator('#a2-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#a2-transfer rq-feedback')).toContainText('Transfer complete');
});

test('A2 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('A2 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByRole('button', { name: 'Fill(0.8)' }).click();
  await expect(page.locator('#a2-fill-count')).toHaveText('1 / 8');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
