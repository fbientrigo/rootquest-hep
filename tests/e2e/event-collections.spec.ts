import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/event-collections/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('B3 separates entry count from collection multiplicity before the RVec bridge', async ({ page }) => {
  await expect(page.locator('#b3-photon-count')).toHaveText('2');
  await expect(page.locator('#b3-event-weight')).toHaveText('1');

  await page.locator('#b3-entry').fill('1');
  await expect(page.locator('#b3-entry-value')).toHaveText('1');
  await expect(page.locator('#b3-photon-count')).toHaveText('1');
  await expect(page.locator('#b3-event-weight')).toHaveText('0.82');
  await expect(page.locator('#b3-summary')).toContainText('still one entry');

  await page.getByLabel('photon_pt has three values inside that entry; event_weight is still one scalar').check();
  await page.locator('#b3-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#b3-prediction rq-feedback')).toContainText('One entry, several objects');

  await page.getByLabel('One entry with three jet values and one scalar run_number').check();
  await page.locator('#b3-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#b3-transfer rq-feedback')).toContainText('Event and collection separated');
  await expect(page.locator('#b3-code')).toContainText('photon_pt.size()');
});

test('B3 is complete in Spanish including dynamic and accessibility text', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Colecciones dentro de eventos');
  await page.locator('#b3-entry').fill('1');
  await expect(page.locator('#b3-summary')).toContainText('sigue siendo una sola entrada');
  await expect(page.locator('#b3-photon-values')).toHaveAttribute('aria-label', 'valores de photon_pt en la entrada seleccionada');
  await page.getByLabel('photon_pt tiene tres valores dentro de esa entrada; event_weight sigue siendo un escalar').check();
  await page.locator('#b3-prediction').getByRole('button', { name: 'Confirmar predicción' }).click();
  await expect(page.locator('#b3-prediction rq-feedback')).toContainText('Una entrada, varios objetos');
});

test('B3 has no automated WCAG A or AA violations and no mobile overflow', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
