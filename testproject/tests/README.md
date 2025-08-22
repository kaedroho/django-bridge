# Django Bridge Playwright Test Suite

This directory contains end-to-end tests for the Django Bridge test project using Playwright.

## Test Structure

- `home.spec.ts` - Tests for the home page functionality including:
  - Page element verification
  - Props refresh functionality
  - URL manipulation without page reload
  - Path replacement without reload

- `navigation.spec.ts` - Tests for navigation features including:
  - Navigation using Link component
  - Navigation using navigate() function
  - Navigation back functionality
  - Loading states during slow navigation
  - Error handling for views that raise exceptions
  - Handling views without components

- `integration.spec.ts` - Integration tests for Django Bridge framework:
  - Frame context persistence
  - Path context updates
  - Multiple rapid navigations
  - React state preservation
  - Browser back/forward navigation
  - Direct URL navigation

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. Ensure the Django Bridge test project is running:
   ```bash
   make start
   ```

### Running Tests

Run all tests:
```bash
npm test
```

Run tests in UI mode (recommended for development):
```bash
npm run test:ui
```

Run tests in debug mode:
```bash
npm run test:debug
```

View test report:
```bash
npm run test:report
```

### Running Specific Tests

Run a specific test file:
```bash
npx playwright test tests/home.spec.ts
```

Run tests in a specific browser:
```bash
npx playwright test --project=chromium
```

## Writing New Tests

When adding new tests:

1. Create a new `.spec.ts` file in the `tests` directory
2. Import necessary Playwright test utilities:
   ```typescript
   import { test, expect } from '@playwright/test';
   ```
3. Group related tests using `test.describe()`
4. Use `test.beforeEach()` for common setup
5. Write individual tests using `test()`

## Best Practices

1. **Wait for network idle**: Use `await page.waitForLoadState('networkidle')` after navigation
2. **Use specific selectors**: Prefer text content and test IDs over generic selectors
3. **Handle timing**: Use Playwright's built-in waiting mechanisms instead of arbitrary timeouts
4. **Test isolation**: Each test should be independent and not rely on previous test state
5. **Meaningful assertions**: Use descriptive assertions that clearly indicate what's being tested

## Debugging

- Use `page.pause()` to pause test execution
- Enable headed mode: `npx playwright test --headed`
- Use `--debug` flag for step-by-step debugging
- Check screenshots in `test-results/` folder for failed tests
- View traces for failed tests to understand the sequence of actions

## CI/CD Integration

The test suite is configured to work in CI environments:
- Tests run in parallel locally but sequentially in CI
- Automatic retries are enabled for CI (2 retries)
- The web server is automatically started before tests
