import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = 'learn/root-file-inspection/';

test.beforeEach(async ({ page }) => {
  await page.goto(lessonPath);
});

test('B1 teaches inspect then retrieve from a named ROOT object inventory', async ({ page }) => {
  await expect(page.locator('#b1-selected-name')).toHaveText('Events');
  await page.getByRole('button', { name: /m_gg/ }).click();
  await expect(page.locator('#b1-selected-class')).toHaveText('TH1D');
  await expect(page.locator('#b1-get-code')).toHaveText('obj = f.Get("m_gg")');

  await page.locator('#b1-prediction').getByRole('radio', { name: 'm_gg' }).check();
  await page.locator('#b1-prediction').getByRole('button', { name: 'Commit choice' }).click();
  await expect(page.locator('#b1-prediction rq-feedback')).toContainText('Object identified');

  await page.getByLabel('List the contents and decide which object answers your question').check();
  await page.locator('#b1-transfer').getByRole('button', { name: 'Check understanding' }).click();
  await expect(page.locator('#b1-transfer rq-feedback')).toContainText('Transfer complete');
});

test('B1 is complete in Spanish including dynamic feedback', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('rootquest-language', 'es'));
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Abre e inspecciona un archivo ROOT');
  await page.locator('#b1-prediction').getByRole('radio', { name: 'm_gg' }).check();
  await page.locator('#b1-prediction').getByRole('button', { name: 'Confirmar elección' }).click();
  await expect(page.locator('#b1-prediction rq-feedback')).toContainText('Objeto identificado');
});

test('B1 has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('B1 remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByRole('button', { name: /m_gg/ }).click();
  await expect(page.locator('#b1-selected-class')).toHaveText('TH1D');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
