import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/signal-control-regions/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('learner freezes the analysis before revealing prepared signal-region data', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Signal and control regions' })).toBeVisible();
  await expect(page.locator('#e6-after-prediction')).toBeHidden();

  await page.getByLabel(/Freeze regions and selection/).check();
  await page.getByRole('button', { name: 'Commit plan' }).click();

  await expect(page.locator('#e6-after-prediction')).toBeVisible();
  await expect(page.locator('#e6-signal-observed')).toHaveText('49');
  await expect(page.locator('#e6-signal-expected')).toHaveText('40');
  await expect(page.getByText(/Freeze the test first/)).toBeVisible();

  await page.getByLabel('The control region.').check();
  await page.getByRole('button', { name: 'Check decision' }).click();
  await expect(page.getByText(/use the control region to learn about background/i)).toBeVisible();
});

test('Spanish interaction preserves the same scientific decision', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Regiones de señal y control' })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Separa una región de señal/);

  await page.getByLabel(/Fijar regiones y selección/).check();
  await page.getByRole('button', { name: 'Fijar el plan' }).click();
  await expect(page.getByText(/Primero fija la prueba/)).toBeVisible();
  await expect(page.locator('.region-grid')).toHaveAttribute('aria-label', 'Rendimientos sintéticos preparados por región');
});

test('E6 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('E6 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Signal and control regions' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
