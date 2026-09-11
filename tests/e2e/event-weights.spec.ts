import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/event-weights-normalization/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('E2 requires prediction before revealing raw versus weighted summaries', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Event weights and normalization' })).toBeVisible();
  await expect(page.locator('#e2-after-prediction')).toBeHidden();

  await page.getByLabel('140–160 GeV').check();
  await page.locator('#e2-prediction').getByRole('button', { name: 'Commit prediction' }).click();

  await expect(page.locator('#e2-prediction rq-feedback')).toContainText('Weights change contribution, not rows.');
  await expect(page.locator('#e2-after-prediction')).toBeVisible();
  await expect(page.locator('[data-e2-bin-value]')).toHaveText(['2', '3', '1']);
});

test('E2 switches the same sample from entry counts to weighted bin contents', async ({ page }) => {
  await page.getByLabel('140–160 GeV').check();
  await page.locator('#e2-prediction').getByRole('button', { name: 'Commit prediction' }).click();

  await page.getByLabel('Sum event_weight').check();
  await expect(page.locator('[data-e2-bin-value]')).toHaveText(['2', '3.5', '2.5']);
  await expect(page.locator('#e2-total')).toHaveText('8.0');
  await expect(page.locator('#e2-summary')).toContainText('Each row contributes its event_weight');

  await page.getByLabel('Count entries').check();
  await expect(page.locator('[data-e2-bin-value]')).toHaveText(['2', '3', '1']);
  await expect(page.locator('#e2-total')).toHaveText('6');
});

test('E2 transfer distinguishes a weighted sum from the number of events', async ({ page }) => {
  await page.locator('#e2-transfer').getByLabel('2.0').check();
  await page.locator('#e2-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#e2-transfer rq-feedback')).toContainText('You summed contributions, not events.');
  await expect(page.locator('#e2-transfer rq-feedback')).toContainText('0.4 and 1.6');
});

test('E2 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('E2 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Event weights and normalization' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
