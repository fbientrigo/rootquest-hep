import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/tree-branch-entry/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('B2 links tree branch entry and value before the ROOT code bridge', async ({ page }) => {
  await page.locator('[data-b2-branch="event-weight"]').click();
  await page.locator('#b2-entry').fill('1');
  await expect(page.locator('#b2-branch-name')).toHaveText('event_weight');
  await expect(page.locator('#b2-entry-value')).toHaveText('1');
  await expect(page.locator('#b2-selected-value')).toHaveText('0.82');
  await expect(page.locator('#b2-code')).toContainText('if i == 1');
  await expect(page.locator('#b2-code')).toContainText('entry.event_weight');

  await page.getByLabel('You read a different field from the same entry').check();
  await page.locator('#b2-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#b2-prediction rq-feedback')).toContainText('Same entry, different field');

  await page.getByLabel('Branch ≈ column; entry ≈ row-like record').check();
  await page.locator('#b2-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#b2-transfer rq-feedback')).toContainText('Useful mental model');
});

test('B2 is complete in Spanish including dynamic feedback', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Árbol, rama, entrada');
  await page.locator('[data-b2-branch="event-weight"]').click();
  await expect(page.locator('#b2-coordinate-summary')).toContainText('Estás leyendo la entrada 0');
  await page.getByLabel('Lees otro campo de la misma entrada').check();
  await page.locator('#b2-prediction').getByRole('button', { name: 'Confirmar predicción' }).click();
  await expect(page.locator('#b2-prediction rq-feedback')).toContainText('Misma entrada, otro campo');
});

test('B2 has no automated WCAG A or AA violations and no mobile overflow', async ({ page }) => {
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
