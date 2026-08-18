import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const huntPath = 'learn/higgs-hunt/';

test.beforeEach(async ({ page }) => {
  await page.goto(huntPath);
});

test('completes the focused learning loop and derives ROOT code', async ({ page }) => {
  const next = page.locator('#hunt-stepper').getByRole('button', { name: 'Continue' });
  await expect(next).toBeDisabled();

  await page.getByRole('button', { name: /Object A/ }).click();
  await page.getByRole('button', { name: /Object B/ }).click();
  await expect(page.locator('#object-feedback')).toContainText('diphoton candidate');
  await expect(next).toBeEnabled();
  await next.click();

  await expect(page.getByRole('heading', { name: 'Predict what the first filter keeps' })).toBeFocused();
  await expect(page.locator('.hunt-navigation')).toBeHidden();
  await page.getByLabel('A and C').check();
  await page.getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.locator('#rule-prediction rq-feedback')).toContainText('exactly two photons');
  await expect(page.locator('.hunt-navigation')).toBeVisible();
  await next.click();

  const threshold = page.getByLabel('Minimum leading photon pT');
  await threshold.focus();
  await page.keyboard.press('End');
  await expect(page.locator('#photon-pt-value')).toHaveText('60 GeV');
  await expect(page.locator('#cut-feedback')).toContainText('0% of the signal');
  await next.click();

  const bins = page.getByLabel('Histogram bins');
  await bins.focus();
  await page.keyboard.press('End');
  await expect(page.locator('#mass-bin-value')).toHaveText('16');
  await next.click();

  await expect(page.locator('#root-code')).toContainText('leading_photon_pt >= 60');
  await expect(page.locator('#root-code')).toContainText('16, 100., 160.');

  await page.getByRole('button', { name: 'Start again' }).click();
  await expect(page.getByRole('heading', { name: 'Find the two photons' })).toBeFocused();
  await expect(next).toBeDisabled();
  await expect(page.locator('#hunt-progress')).toHaveAttribute('value', '1');
});

test('supports a keyboard-only path through the gated stages', async ({ page }) => {
  const selectA = page.getByRole('button', { name: /Object A/ });
  await selectA.focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /Object B/ }).focus();
  await page.keyboard.press('Enter');

  const next = page.getByRole('button', { name: 'Continue' });
  await next.focus();
  await page.keyboard.press('Enter');
  await page.getByLabel('A and C').focus();
  await page.keyboard.press('Space');
  await page.getByRole('button', { name: 'Commit prediction' }).focus();
  await page.keyboard.press('Enter');
  await next.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Move the cut and watch the trade-off' })).toBeFocused();
});

test('has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});

test('reduced motion keeps the cut consequence explicit', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: /Object A/ }).click();
  await page.getByRole('button', { name: /Object B/ }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('A and C').check();
  await page.getByRole('button', { name: 'Commit prediction' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Minimum leading photon pT').fill('50');

  await expect(page.locator('#cut-feedback')).toContainText('keeps 40% of the signal');
  await expect(page.locator('#cut-description')).toContainText('Circles represent signal examples');
});
