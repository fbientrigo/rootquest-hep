import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/angular-separation/';

test.beforeEach(async ({ page }) => { await page.goto(lessonPath); });

test('D4 builds DeltaR intuition and handles the phi boundary', async ({ page }) => {
  await expect(page.locator('#d4-dr')).toHaveText('0.25');
  await page.getByLabel('Pair B · larger differences in eta and phi').check();
  await expect(page.locator('#d4-dr')).toHaveText('1.20');

  await page.getByLabel('Close: phi is periodic and the short separation crosses ±π').check();
  await page.locator('#d4-boundary').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#d4-boundary rq-feedback')).toContainText('Azimuth is periodic');
  await expect(page.locator('#d4-boundary rq-feedback')).toContainText('ΔR ≈ 0.19');

  await page.getByLabel('Pair 1: Δη = 0.3, Δφ = 0.4').check();
  await page.locator('#d4-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#d4-transfer rq-feedback')).toContainText('You compared the full distance');
});

test('D4 Spanish interaction preserves the same angular reasoning and language preference', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('h1')).toHaveText('Separación angular');
  await page.getByLabel('Cerca: phi es periódico y la separación corta cruza ±π').check();
  await page.locator('#d4-boundary').getByRole('button', { name: 'Confirmar predicción' }).click();
  await expect(page.locator('#d4-boundary rq-feedback')).toContainText('El azimut es periódico');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Construye intuición geométrica para la separación angular en eta-phi y calcula DeltaR con VecOps de ROOT.');
  await page.goto('course/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('D4 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('D4 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.locator('#d4-dr')).toHaveText('0.25');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
