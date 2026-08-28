import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/root-documentation/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('B4 turns an analysis intention into an official ROOT API lookup', async ({ page }) => {
  await page.getByLabel('Official ROOT::RDataFrame reference: method list and signatures').check();
  await page.locator('#b4-source-choice').getByRole('button', { name: 'Commit choice' }).click();
  await expect(page.locator('#b4-source-choice rq-feedback')).toContainText('Good route');

  await expect(page.getByText('Filter(std::string_view expression, std::string_view name = "")')).toBeVisible();
  await expect(page.getByText('df.Filter("pt > 25")', { exact: true })).toBeVisible();

  await page.getByLabel('Count() — counts processed entries').check();
  await page.locator('#b4-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#b4-transfer rq-feedback')).toContainText('Transfer complete');
});

test('B4 gives causal feedback for a mismatched documentation source', async ({ page }) => {
  await page.getByLabel('TFile reference: opening files and retrieving stored objects').check();
  await page.locator('#b4-source-choice').getByRole('button', { name: 'Commit choice' }).click();
  await expect(page.locator('#b4-source-choice rq-feedback')).toContainText('answers a different question');
});

test('B4 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('B4 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByLabel('Official ROOT::RDataFrame reference: method list and signatures').check();
  await page.locator('#b4-source-choice').getByRole('button', { name: 'Commit choice' }).click();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
