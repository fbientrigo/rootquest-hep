import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/histogram-binning/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('A1 preserves source measurements while rebinning and completes transfer', async ({ page }) => {
  const summary = page.locator('#a1-histogram-summary');
  const bins = page.locator('#a1-bin-count');

  await expect(summary).toContainText('20 measurements remain fixed');
  await expect(page.locator('#a1-bin-width-value')).toHaveValue('1.60');

  await bins.focus();
  await page.keyboard.press('End');
  await expect(bins).toHaveValue('12');
  await expect(summary).toContainText('20 measurements remain fixed');

  await page.getByLabel('The intervals become narrower').check();
  await page.locator('#a1-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.getByLabel('The intervals become narrower')).toBeDisabled();
  await bins.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#a1-prediction rq-feedback')).toContainText('Prediction supported');
  await expect(summary).toContainText('20 measurements remain fixed');

  await page.getByLabel('The source measurements').check();
  await page.locator('#a1-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#a1-transfer rq-feedback')).toContainText('Transfer complete');
  await expect(page.locator('#a1-root-code')).toContainText('ROOT.TH1D');
});

test('A1 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});

test('A1 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();

  const bins = page.locator('#a1-bin-count');
  await expect(bins).toBeVisible();
  await bins.focus();
  await page.keyboard.press('ArrowRight');
  await expect(bins).toHaveValue('6');
  await expect(page.locator('#a1-histogram-summary')).toContainText('20 measurements remain fixed');
  await expect(page.locator('body')).not.toHaveJSProperty('scrollWidth', 0);
});
