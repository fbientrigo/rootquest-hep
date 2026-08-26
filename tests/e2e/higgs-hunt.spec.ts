import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const huntPath = 'learn/higgs-hunt/';

test.beforeEach(async ({ page }) => {
  await page.goto(huntPath);
});

test('object selection stays visible and unlocks Continue', async ({ page }) => {
  const next = page.locator('#hunt-stepper').getByRole('button', { name: 'Continue' });
  const objectA = page.locator('.object-buttons [data-object-id="photon-1"]');
  const objectB = page.locator('.object-buttons [data-object-id="photon-2"]');
  const visualA = page.locator('[data-object-visual="photon-1"]');
  const visualB = page.locator('[data-object-visual="photon-2"]');

  await expect(objectA).toBeVisible();
  await expect(objectB).toBeVisible();
  await expect(next).toBeDisabled();

  await objectA.click();
  await expect(objectA).toHaveAttribute('aria-pressed', 'true');
  await expect(visualA).toHaveAttribute('data-selected', 'true');
  await expect(next).toBeDisabled();

  await objectB.click();
  await expect(objectB).toHaveAttribute('aria-pressed', 'true');
  await expect(visualB).toHaveAttribute('data-selected', 'true');
  await expect(page.locator('#object-feedback')).toContainText('diphoton candidate');
  await expect(next).toBeEnabled();
});

test('clicking the event visual updates the same selection state', async ({ page }) => {
  const objectA = page.locator('.object-buttons [data-object-id="photon-1"]');
  const visualA = page.locator('[data-object-visual="photon-1"]');

  await visualA.locator('rect').click();
  await expect(objectA).toHaveAttribute('aria-pressed', 'true');
  await expect(visualA).toHaveAttribute('data-selected', 'true');
});

test('phone viewport behaves as one immersive lesson session', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();

  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.site-footer')).toBeHidden();
  await expect(page.locator('.hunt-intro')).toBeHidden();
  await expect(page.getByRole('link', { name: 'Exit Higgs Hunt' })).toBeVisible();

  const layout = await page.evaluate(() => {
    const shell = document.querySelector<HTMLElement>('.hunt-shell')!;
    const stage = document.querySelector<HTMLElement>('.hunt-stage-viewport')!;
    const navigation = document.querySelector<HTMLElement>('.hunt-navigation')!;
    return {
      viewportHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      shell: shell.getBoundingClientRect().toJSON(),
      stage: stage.getBoundingClientRect().toJSON(),
      navigation: navigation.getBoundingClientRect().toJSON(),
      outerScrollY: window.scrollY,
    };
  });

  expect(Math.abs(layout.shell.height - layout.viewportHeight)).toBeLessThanOrEqual(2);
  expect(layout.documentHeight).toBeLessThanOrEqual(layout.viewportHeight + 2);
  expect(layout.stage.bottom).toBeLessThanOrEqual(layout.navigation.top + 1);
  expect(layout.navigation.bottom).toBeGreaterThanOrEqual(layout.viewportHeight - 2);
  expect(layout.navigation.bottom).toBeLessThanOrEqual(layout.viewportHeight + 2);
  expect(layout.outerScrollY).toBe(0);

  const objectA = page.getByRole('button', { name: /Object A/ });
  const objectB = page.getByRole('button', { name: /Object B/ });
  const next = page.getByRole('button', { name: 'Continue' });
  const targetHeight = await objectA.evaluate((element) => element.getBoundingClientRect().height);
  expect(targetHeight).toBeGreaterThanOrEqual(48);

  await objectA.click();
  await objectB.click();
  await expect(next).toBeEnabled();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
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
  await threshold.fill('60');
  await expect(page.locator('#photon-pt-value')).toHaveText('60 GeV');
  await expect(page.locator('#cut-feedback')).toContainText('0% of the signal');
  await next.click();

  const bins = page.getByLabel('Histogram bins');
  await bins.fill('16');
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
