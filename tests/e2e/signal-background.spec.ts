import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/signal-background-tradeoffs/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('E1 requires prediction before revealing the tradeoff manipulator', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Signal and background trade-offs' })).toBeVisible();
  await expect(page.locator('#e1-after-prediction')).toBeHidden();

  await page.getByLabel('Signal efficiency falls and background rejection rises').check();
  await page.locator('#e1-direction').getByRole('button', { name: 'Commit prediction' }).click();

  await expect(page.locator('#e1-direction rq-feedback')).toContainText('The cut buys rejection with efficiency.');
  await expect(page.locator('#e1-after-prediction')).toBeVisible();
  await expect(page.locator('#e1-signal-efficiency')).toHaveText('60%');
  await expect(page.locator('#e1-background-rejection')).toHaveText('57%');
});

test('E1 threshold changes signal efficiency and background rejection from one source of truth', async ({ page }) => {
  await page.getByLabel('Signal efficiency falls and background rejection rises').check();
  await page.locator('#e1-direction').getByRole('button', { name: 'Commit prediction' }).click();

  await page.locator('#e1-threshold').fill('30');
  await expect(page.locator('#e1-signal-efficiency')).toHaveText('80%');
  await expect(page.locator('#e1-background-rejection')).toHaveText('29%');

  await page.locator('#e1-threshold').fill('50');
  await expect(page.locator('#e1-signal-efficiency')).toHaveText('40%');
  await expect(page.locator('#e1-background-rejection')).toHaveText('71%');
});

test('E1 transfer checks both constraints instead of rewarding maximum rejection', async ({ page }) => {
  await page.locator('#e1-transfer').getByLabel('40 GeV').check();
  await page.locator('#e1-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#e1-transfer rq-feedback')).toContainText('Trade-off identified.');
  await expect(page.locator('#e1-transfer rq-feedback')).toContainText('60%');
  await expect(page.locator('#e1-transfer rq-feedback')).toContainText('57%');
});

test('E1 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('E1 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Signal and background trade-offs' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
