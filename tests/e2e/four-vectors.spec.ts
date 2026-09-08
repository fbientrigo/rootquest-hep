import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/four-vectors/';

test.beforeEach(async ({ page }) => { await page.goto(lessonPath); });

test('D5 connects photon four-momenta to candidate invariant mass', async ({ page }) => {
  await expect(page.locator('#d5-mass')).toHaveText('19.9');
  await page.getByLabel('Pair B · 50 + 50 GeV, opposite in phi').check();
  await expect(page.locator('#d5-mass')).toHaveText('100.0');

  await page.getByLabel('Pair B: the opposite photons produce a larger mass').check();
  await page.locator('#d5-opening').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#d5-opening rq-feedback')).toContainText('Geometry changes the mass');
  await expect(page.locator('#d5-opening rq-feedback')).toContainText('19.9 to 100.0 GeV');

  await page.getByLabel('It doubles to 200 GeV').check();
  await page.locator('#d5-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#d5-transfer rq-feedback')).toContainText('Correct scaling');
});

test('D5 Spanish interaction preserves the same invariant-mass reasoning and language preference', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('h1')).toHaveText('Cuatro-vectores y masa invariante');
  await page.getByLabel('Par B: los fotones opuestos producen una masa mayor').check();
  await page.locator('#d5-opening').getByRole('button', { name: 'Confirmar predicción' }).click();
  await expect(page.locator('#d5-opening rq-feedback')).toContainText('La geometría cambia la masa');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Construye un cuatro-vector de dos fotones, predice cómo la cinemática cambia la masa candidata y calcula masa invariante con ROOT Math.');
  await page.goto('course/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('D5 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('D5 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.locator('#d5-mass')).toHaveText('19.9');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
