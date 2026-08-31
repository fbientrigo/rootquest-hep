import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/define-observable/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('C3 distinguishes creating a column from filtering rows', async ({ page }) => {
  await expect(page.locator('#c3-summary')).toContainText('Predict first');
  await page.getByLabel('All 6 rows remain').check();
  await page.locator('#c3-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#c3-summary')).toContainText('6 of 6 rows are still present');
  await expect(page.locator('#c3-derived-body tr')).toHaveCount(6);
  await expect(page.locator('#c3-code')).toContainText('df.Define("massOffset", "mass - 125.0")');

  await page.getByLabel('hardLeading = leadingPhotonPt > 35 GeV').check();
  await expect(page.locator('#c3-summary')).toContainText('Predict first');
  await page.getByLabel('All 6 rows remain').check();
  await page.locator('#c3-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#c3-derived-body')).toContainText('false');
  await expect(page.locator('#c3-derived-body tr')).toHaveCount(6);

  await page.getByLabel('Every row remains; isHard is true or false for each one').check();
  await page.locator('#c3-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#c3-transfer rq-feedback')).toContainText('Transfer complete');
});

test('C3 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('C3 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByLabel('All 6 rows remain').check();
  await page.locator('#c3-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
