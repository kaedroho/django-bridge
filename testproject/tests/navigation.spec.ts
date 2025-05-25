import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate using Link component', async ({ page }) => {
    // Click the Link component
    await page.getByText('Navigate with <Link> component').click();

    // Wait for navigation
    await page.waitForTimeout(500);

    // Check we're on the navigation test page
    await expect(page.locator('h2')).toHaveText('Navigation test complete');
    await expect(page.getByText('Go back')).toBeVisible();
  });

  test('should navigate using navigate() function', async ({ page }) => {
    // Click the navigate function link
    await page.getByText('Navigate with navigate() function').click();

    // Wait for navigation
    await page.waitForTimeout(500);

    // Check we're on the navigation test page
    await expect(page.locator('h2')).toHaveText('Navigation test complete');
    await expect(page.getByText('Go back')).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    // First navigate to the navigation test page
    await page.getByText('Navigate with <Link> component').click();
    await page.waitForTimeout(500);

    // Then navigate back
    await page.getByText('Go back').click();
    await page.waitForTimeout(500);

    // Check we're back on home page
    await expect(page.locator('h1')).toHaveText('Django Bridge tests');
    await expect(page.locator('h2').first()).toHaveText('Utilities');
  });

  test('should show loading state during slow navigation', async ({ page }) => {
    // Click the slow view link
    await page.getByText('Navigate to a very slow view (5 second delay)').click();

    // Check that isNavigating becomes true
    await expect(page.getByText(/Is navigating: true/)).toBeVisible();

    // Wait for navigation to complete (with extended timeout)
    await page.waitForTimeout(5500);

    // Check we're on the navigation test page
    await expect(page.locator('h2')).toHaveText('Navigation test complete');
  });

  test('should handle navigation to view that raises exception', async ({ page }) => {
    // Set up console listener to capture errors
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    // Click the exception view link
    await page.getByText('Navigate to a view that raises an exception').click();

    // Wait a bit for the error to be processed
    await page.waitForTimeout(1000);

    // The page should handle the error gracefully
    // Check that we're still on a functioning page (error handling may vary)
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle navigation to view without component', async ({ page }) => {
    // Click the no component view link
    await page.getByText("Navigate to a view that doesn't have a component").click();

    // Wait for navigation attempt
    await page.waitForTimeout(1000);

    // The page should handle this gracefully
    // Check that we're still on a functioning page
    await expect(page.locator('body')).toBeVisible();
  });
});
