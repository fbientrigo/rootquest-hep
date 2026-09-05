import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/object-event-selection/';

test.beforeEach(async ({ page }) => { await page.goto(lessonPath); });

test('D2 separates object masks from event requirements', async ({ page }) => {
  await expect(page.locator('#d2-mask')).toHaveText('[true, true, false]');
  await expect(page.locator('#d2-event-result')).toHaveText('passes');

  await page.getByLabel('Event B · pT [41, 27, 19] GeV').check();
  await expect(page.locator('#d2-mask')).toHaveText('[true, false, false]');
  await expect(page.locator('#d2-event-result')).toHaveText('fails');

  await page.getByLabel('The mask selects photons; a later scalar condition decides the event').check();
  await page.locator('#d2-predict').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#d2-predict rq-feedback')).toContainText('Objects first, event second');

  await page.getByLabel('Build jet_pt > threshold mask, select jets, then require selectedJets.size() >= 3').check();
  await page.locator('#d2-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#d2-transfer rq-feedback')).toContainText('Correct separation');
});

test('D2 Spanish interaction preserves the same causal distinction', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Selecciona objetos y luego eventos');
  await page.getByLabel('La máscara selecciona fotones; una condición escalar posterior decide el evento').check();
  await page.locator('#d2-predict').getByRole('button', { name: 'Confirmar predicción' }).click();
  await expect(page.locator('#d2-predict rq-feedback')).toContainText('Objeto primero, evento después');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Aprende a separar máscaras a nivel de objeto de requisitos a nivel de evento usando colecciones RVec de ROOT.');
});

test('D2 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('D2 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByLabel('Event B · pT [41, 27, 19] GeV').check();
  await expect(page.locator('#d2-event-result')).toHaveText('fails');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
