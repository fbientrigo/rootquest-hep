import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const coursePath = 'course/';

test.beforeEach(async ({ page }) => {
  await page.goto(coursePath);
});

test('course exposes available lessons and the next curriculum step', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Your path through ROOT' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Same data, different bins/ })).toHaveAttribute('href', /learn\/histogram-binning\/$/);
  await expect(page.getByRole('link', { name: /Build a histogram/ })).toHaveAttribute('href', /learn\/histogram-fill\/$/);
  await expect(page.getByRole('link', { name: /Read and compare histograms/ })).toHaveAttribute('href', /learn\/histogram-compare\/$/);
  await expect(page.getByRole('link', { name: /Measurements with errors/ })).toHaveAttribute('href', /learn\/measurement-errors\/$/);
  await expect(page.locator('a[href$="learn/root-file-inspection/"]')).toHaveCount(1);
  await expect(page.locator('a[href$="learn/tree-branch-entry/"]')).toHaveCount(1);
  await expect(page.locator('a[href$="learn/event-collections/"]')).toHaveCount(1);
  await expect(page.locator('a[href$="learn/root-documentation/"]')).toHaveCount(1);
  await expect(page.locator('a[href$="learn/data-pipeline/"]')).toHaveCount(1);
  await expect(page.locator('a[href$="learn/filter-reason/"]')).toHaveCount(1);
  await expect(page.locator('a[href$="learn/define-observable/"]')).toHaveCount(1);
  await expect(page.locator('a[href$="learn/actions-summary/"]')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'C5 · Cutflow: where did the events go?' })).toBeVisible();
  await expect(page.getByText('12 / 30')).toBeVisible();
});

test('course has no automated WCAG A or AA violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('course remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.locator('a[href$="learn/actions-summary/"]')).toHaveCount(1);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('home exposes the current curriculum unit without requiring hidden URLs', async ({ page }) => {
  await page.goto('');
  await expect(page.getByRole('link', { name: 'View the course →' })).toBeVisible();
  await expect(page.getByText('Unit C')).toBeVisible();
  await expect(page.getByText('Next:')).toContainText('C5 · Cutflow: where did the events go?');
  await expect(page.getByRole('link', { name: 'Course', exact: true })).toBeVisible();
});
