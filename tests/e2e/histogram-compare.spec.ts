import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/histogram-compare/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('A3 distinguishes yield comparison from unit-area shape comparison', async ({ page }) => {
  await expect(page.locator('#a3-integral-a')).toHaveText('12');
  await expect(page.locator('#a3-integral-b')).toHaveText('24');
  await expect(page.locator('#a3-summary')).toContainText('twice as many entries');

  await page.getByLabel('Unit area — compare relative shape').check();
  await expect(page.locator('#a3-summary')).toContainText('area 1');
  await expect(page.locator('#a3-root-code')).toContainText('Scale(1.0 / hA.Integral())');

  await page.getByLabel('The 12-versus-24 total-yield difference').check();
  await page.locator('#a3-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#a3-prediction rq-feedback')).toContainText('Prediction supported');

  await page.getByLabel('Keep the raw/physically normalized yields').check();
  await page.locator('#a3-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#a3-transfer rq-feedback')).toContainText('Transfer complete');
});

test('A3 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('A3 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByLabel('Unit area — compare relative shape').check();
  await expect(page.locator('#a3-summary')).toContainText('area 1');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
