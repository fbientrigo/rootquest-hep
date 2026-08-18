import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const labPath = 'lab/learning-engine/';

test.beforeEach(async ({ page }) => {
  await page.goto(labPath);
});

test('all three probes expose traceable learner-visible behavior', async ({ page }) => {
  const histogramSummary = page.locator('#histogram-summary');
  await expect(histogramSummary).toContainText('20 of 20 values remain in 5 bins');

  await page.locator('#threshold').focus();
  await page.keyboard.press('End');
  await expect(histogramSummary).toContainText('3 of 20 values remain');

  await page.getByLabel('Create more, narrower intervals').check();
  await page.locator('#histogram-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await expect(page.getByLabel('Create more, narrower intervals')).toBeDisabled();
  await page.locator('#bin-count').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#histogram-prediction rq-feedback')).toContainText('same fixed range into narrower intervals');

  await page.getByRole('button', { name: 'event_weight' }).click();
  await expect(page.locator('#branch-name')).toHaveText('event_weight');
  await expect(page.locator('#branch-values')).toContainText('Entry 1: 0.82');
  await expect(page.locator('#branch-feedback')).toContainText('one scalar weight per tree entry');

  const next = page.locator('#filter-stepper').getByRole('button', { name: 'Next' });
  await next.click();
  await expect(page.locator('#trace-feedback')).toContainText('Pause and predict');

  await page.getByLabel('E1, E3, E4, and E6').check();
  await page.locator('#trace-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await next.click();
  await expect(page.locator('[data-stepper-status]')).toHaveText('Step 2 of 4: Require exactly two photons');
  await expect(page.locator('#trace-summary')).toContainText('2 are removed at this step; 4 remain');
  await expect(page.locator('#trace-prediction rq-feedback')).toContainText('E2 and E5');

  await page.locator('#filter-stepper').getByRole('button', { name: 'Reset trace' }).click();
  await expect(page.locator('[data-stepper-status]')).toHaveText('Step 1 of 4: Input events');
  await expect(page.getByLabel('E1, E3, E4, and E6')).toBeEnabled();
});

test('the lab can be completed using keyboard actions', async ({ page }) => {
  const bins = page.locator('#bin-count');
  await bins.focus();
  await page.keyboard.press('ArrowRight');
  await expect(bins).toHaveValue('6');

  const histogramChoice = page.getByLabel('Create more, narrower intervals');
  await histogramChoice.focus();
  await page.keyboard.press('Space');
  const histogramCommit = page.locator('#histogram-prediction').getByRole('button', { name: 'Commit prediction' });
  await histogramCommit.focus();
  await page.keyboard.press('Enter');
  await bins.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#histogram-prediction rq-feedback')).toContainText('Prediction supported');

  const etaBranch = page.getByRole('button', { name: 'photon_eta' });
  await etaBranch.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#branch-name')).toHaveText('photon_eta');

  const traceChoice = page.getByLabel('E1, E3, E4, and E6');
  await traceChoice.focus();
  await page.keyboard.press('Space');
  const traceCommit = page.locator('#trace-prediction').getByRole('button', { name: 'Commit prediction' });
  await traceCommit.focus();
  await page.keyboard.press('Enter');
  const next = page.locator('#filter-stepper').getByRole('button', { name: 'Next' });
  await next.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-stepper-status]')).toContainText('Step 2 of 4');

  const reset = page.locator('#filter-stepper').getByRole('button', { name: 'Reset trace' });
  await reset.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-stepper-status]')).toContainText('Step 1 of 4');
});

test('has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});

test('reduced motion preserves textual meaning and interaction', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(
    page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
  ).resolves.toBe(true);

  await page.getByLabel('E1, E3, E4, and E6').check();
  await page.locator('#trace-prediction').getByRole('button', { name: 'Commit prediction' }).click();
  await page.locator('#filter-stepper').getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('#trace-summary')).toContainText('2 are removed at this step; 4 remain');
  await expect(page.locator('.event-card[data-status="removed-now"]')).toHaveCount(2);
});
