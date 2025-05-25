import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the home page with correct elements', async ({ page }) => {
    // Check main heading
    await expect(page.locator('h1')).toHaveText('Django Bridge tests');

    // Check frame information is displayed
    await expect(page.getByText(/Frame ID:/)).toBeVisible();
    await expect(page.getByText(/Path:/)).toBeVisible();
    await expect(page.getByText(/Is navigating: false/)).toBeVisible();

    // Check time is displayed
    await expect(page.getByText(/The time is:/)).toBeVisible();

    // Check section headings
    await expect(page.locator('h2').first()).toHaveText('Utilities');
    await expect(page.locator('h2').nth(1)).toHaveText('Navigation');
  });

  test('should refresh props from server', async ({ page }) => {
    // Get initial time
    const initialTimeText = await page.getByText(/The time is:/).textContent();

    // Wait a bit to ensure time difference
    await page.waitForTimeout(1000);

    // Click refresh props link
    await page.getByText('Refresh props from server').click();

    // Wait a bit for the refresh to complete
    await page.waitForTimeout(500);

    // Check that time has updated
    const updatedTimeText = await page.getByText(/The time is:/).textContent();
    expect(initialTimeText).not.toBe(updatedTimeText);
  });

  test('should modify query params without reloading', async ({ page }) => {
    // Click the modify query params link
    await page.getByText('Modify query params, without reloading the page').click();

    // Check URL has changed
    await expect(page).toHaveURL('/?test=replace_path');

    // Verify page didn't reload (time should remain the same)
    const timeBeforeClick = await page.getByText(/The time is:/).textContent();
    await page.waitForTimeout(100);
    const timeAfterClick = await page.getByText(/The time is:/).textContent();
    expect(timeBeforeClick).toBe(timeAfterClick);
  });

  test('should replace path without reloading', async ({ page }) => {
    // Get initial time
    const initialTimeText = await page.getByText(/The time is:/).textContent();

    // Click the replace path link
    await page.getByText('Replace the path, without reloading the page').click();

    // Check URL has changed
    await expect(page).toHaveURL('/replace_path');

    // Verify page didn't reload (time should remain the same)
    const updatedTimeText = await page.getByText(/The time is:/).textContent();
    expect(initialTimeText).toBe(updatedTimeText);
  });
});
