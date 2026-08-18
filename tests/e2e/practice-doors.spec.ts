import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const doors = [
  ['Manipulate — Selection Lab', 'practice/manipulate/', 'Selection Lab'],
  ['Observe — Event Detective', 'practice/observe/', 'Event Detective'],
  ['Predict — Prediction Trials', 'practice/predict/', 'Prediction Trials'],
  ['Code — ROOT Builder', 'practice/code/', 'ROOT Builder'],
] as const;

test('landing turns the four learning-loop verbs into working doors', async ({ page }) => {
  await page.goto('./');

  for (const [accessibleName, href] of doors) {
    await expect(page.getByRole('link', { name: accessibleName })).toHaveAttribute('href', new RegExp(`${href}$`));
  }

  const quote = page.locator('[data-research-item]:not([hidden]) blockquote');
  await expect(quote).toContainText('gamified learning');
  await page.getByRole('button', { name: 'Next reference' }).click();
  await expect(quote).toContainText('PS-I');
});

test('each door reaches its named micro-experience', async ({ page }) => {
  for (const [, href, heading] of doors) {
    await page.goto(href);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    await expect(page.locator('[data-stage-marker="1"]')).toHaveAttribute('data-state', 'current');
    await expect(page.locator('[data-stage-marker="2"]')).toHaveAttribute('data-state', 'locked');
  }
});

test('selection lab links the cut to the 3D sample, histogram, and challenge state', async ({ page }) => {
  await page.goto('practice/manipulate/');

  const continueButton = page.getByRole('button', { name: 'Unlock next challenge' });
  const liveThreshold = page.locator('[data-live-threshold]');
  await expect(continueButton).toBeDisabled();
  await expect(page.getByRole('heading', { name: '3D sample' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Photon pT' })).toBeVisible();
  await expect(page.locator('[data-selection-event][data-selected="true"]')).toHaveCount(12);

  const firstThreshold = page.locator('[data-stage-panel="1"] input[type="range"]');
  await firstThreshold.fill('30');
  await expect(liveThreshold).toHaveText('30 GeV');
  await expect(page.locator('[data-selection-event][data-selected="true"]')).toHaveCount(9);
  await expect(page.locator('[data-histogram-bar][data-selected="false"]')).toHaveCount(4);
  await expect(page.locator('[data-stage-marker="1"]')).toHaveAttribute('data-state', 'complete');
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  await expect(page.locator('[data-stage-marker="2"]')).toHaveAttribute('data-state', 'current');
  await page.locator('[data-stage-panel="2"] input[type="range"]').fill('40');
  await expect(page.locator('[data-selection-event][data-selected="true"]')).toHaveCount(6);
  await continueButton.click();

  await page.locator('[data-stage-panel="3"] input[type="range"]').fill('50');
  await expect(page.getByRole('heading', { name: 'Three decisions, one mental model.' })).toBeVisible();
});

test('code builder gives explanatory feedback and reveals ROOT only after commitment', async ({ page }) => {
  await page.goto('practice/code/');

  const firstStage = page.locator('[data-stage-panel="1"]');
  await expect(firstStage.locator('[data-reveal]')).toBeHidden();
  await firstStage.getByLabel('Filter').check();
  await firstStage.getByRole('button', { name: 'Commit answer' }).click();
  await expect(firstStage.locator('[data-feedback]')).toContainText('keeps rows');
  await expect(firstStage.locator('[data-reveal]')).toContainText('df.Filter');
});

test('landing and a practice route have no automated WCAG A or AA violations', async ({ page }) => {
  for (const path of ['./', 'practice/manipulate/']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});
