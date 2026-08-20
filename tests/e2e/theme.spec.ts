import { expect, test } from '@playwright/test';

const huntPath = 'learn/higgs-hunt/';

const geometry = async (page: Parameters<typeof test>[0]['page']) => {
  const selectors = ['.hunt-shell', '.event-display', '.object-buttons button', '.hunt-navigation'];
  const boxes = await Promise.all(selectors.map((selector) => page.locator(selector).first().boundingBox()));
  return boxes.map((box) => {
    if (!box) throw new Error('Expected themed element to have layout geometry');
    return {
      x: Math.round(box.x),
      y: Math.round(box.y),
      width: Math.round(box.width),
      height: Math.round(box.height),
    };
  });
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('rootquest-theme', 'light'));
});

test('Higgs Hunt switches palette without changing its layout', async ({ page }) => {
  await page.goto(huntPath);

  const root = page.locator('html');
  const shell = page.locator('.hunt-shell');
  const toggle = page.getByRole('button', { name: 'Switch to dark theme' });

  await expect(root).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveCSS('background-color', 'rgb(244, 246, 244)');
  const lightGeometry = await geometry(page);

  await toggle.click();

  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect(shell).toHaveCSS('background-color', 'rgb(15, 23, 25)');
  await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('rootquest-theme'))).toBe('dark');

  const darkGeometry = await geometry(page);
  expect(darkGeometry).toEqual(lightGeometry);
});

test('theme choice persists and the rest of ROOT Quest uses the same palette', async ({ page }) => {
  await page.goto(huntPath);
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page.goto('');

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(15, 23, 25)');
  await expect(page.locator('.learning-loop li').first()).toHaveCSS('background-color', 'rgb(22, 33, 36)');
  await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
});
