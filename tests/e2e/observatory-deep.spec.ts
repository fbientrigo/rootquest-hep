import { expect, test } from '@playwright/test';

test('the course map uses a persistent WIRED node inspector', async ({ page }) => {
  await page.goto('course/');
  await expect(page.locator('.observatory-rail')).toBeVisible();
  await expect(page.locator('.rail-kicker').first()).toContainText('NAVIGATION_TREE');
  await expect(page.locator('#unit-A')).toBeVisible();
  await expect(page.locator('#unit-A')).toHaveCSS('border-top-left-radius', '0px');
  await expect(page.locator('#unit-A summary')).toHaveCSS('border-top-left-radius', '0px');
  await expect(page.locator('.course-lesson--live .lesson-status').first()).toHaveCSS('border-top-left-radius', '0px');

  await page.locator('.rail-unit-links a[href$="#unit-C"]').click();
  await expect(page).toHaveURL(/#unit-C$/);
  await expect(page.locator('#unit-C')).toHaveAttribute('open', '');
  await expect(page.getByRole('link', { name: /A pipeline transforms a dataset/ })).toBeVisible();
});

test('the lesson workbench keeps predictions and sharp stages', async ({ page }) => {
  await page.goto('learn/histogram-binning/');
  await expect(page.locator('.observatory-rail')).toBeVisible();
  await expect(page.locator('.lesson-flow > .lesson-card').first()).toHaveCSS('border-top-left-radius', '0px');
  await expect(page.locator('.lesson-flow rq-predict').first()).toBeVisible();
  await expect(page.locator('#a1-bin-count')).toBeVisible();
  await expect(page.locator('.lesson-header')).toHaveCSS('border-top-left-radius', '0px');
});

test('the workspace remains usable at narrow widths and with the dark theme', async ({ page }) => {
  await page.goto('');
  await page.evaluate(() => localStorage.setItem('rootquest-theme', 'dark'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('course/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.rail-primary a').first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
