import { test, expect } from '@playwright/test';

test.describe('Django Bridge Integration', () => {
  test('should update path correctly', async ({ page }) => {
    // Go to home page
    await page.goto('/');

    // Check initial path
    await expect(page.getByText(/Path: \//)).toBeVisible();

    // Replace path
    await page.getByText('Replace the path, without reloading the page').click();

    // Check path updated in window
    await expect(page).toHaveURL('replace_path');

    // Check path updated in context
    // FIXME: Not currently working
    // await expect(page.getByText(/Path: \/replace_path/)).toBeVisible();
  });

  /* FIXME: Replace path not working for get paramters
  test('should update query params correctly', async ({ page }) => {
    // Go to home page
    await page.goto('/');

    // Check initial path
    await expect(page.getByText(/Path: \//)).toBeVisible();

    // Modify query params
    await page.getByText('Modify query params, without reloading the page').click();

    // Check path updated
    await expect(page.getByText(/Path: \/\?test=replace_path/)).toBeVisible();
  });
  */

  test('should handle multiple rapid navigations', async ({ page }) => {
    await page.goto('/');

    // Perform multiple rapid navigations
    await page.getByText('Navigate with <Link> component').click();
    await page.getByText('Go back').click();
    await page.getByText('Navigate with navigate() function').click();
    await page.getByText('Go back').click();

    // Wait for everything to settle
    await page.waitForTimeout(500);

    // Verify we're back on the home page and everything is working
    await expect(page.locator('h1')).toHaveText('Django Bridge tests');
    await expect(page.getByText(/Is navigating: false/)).toBeVisible();
  });

  test('should preserve React state during path updates', async ({ page }) => {
    await page.goto('/');

    // Get the current time
    const initialTime = await page.getByText(/The time is:/).textContent();

    // Wait a bit for the time to change
    await page.waitForTimeout(1000);

    // Update path without reloading
    await page.getByText('Modify query params, without reloading the page').click();

    // Time should remain the same (React component not re-mounted)
    const timeAfterPathUpdate = await page.getByText(/The time is:/).textContent();
    expect(initialTime).toBe(timeAfterPathUpdate);

    // But after refresh props, time should update
    await page.getByText('Refresh props from server').click();
    await page.waitForTimeout(500);

    const timeAfterRefresh = await page.getByText(/The time is:/).textContent();
    expect(initialTime).not.toBe(timeAfterRefresh);
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    await page.goto('/');

    // Navigate to test page
    await page.getByText('Navigate with <Link> component').click();
    await page.waitForTimeout(500);

    // Use browser back button
    await page.goBack();
    await page.waitForTimeout(500);

    // Should be on home page
    await expect(page.locator('h1')).toHaveText('Django Bridge tests');

    // Use browser forward button
    await page.goForward();
    await page.waitForTimeout(500);

    // Should be on navigation test page
    await expect(page.locator('h2')).toHaveText('Navigation test complete');
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Navigate directly to the navigation test URL
    await page.goto('/navigation/');
    await page.waitForTimeout(500);

    // Should load the correct component
    await expect(page.locator('h2')).toHaveText('Navigation test complete');
    await expect(page.getByText('Go back')).toBeVisible();
  });
});
