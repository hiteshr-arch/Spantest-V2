import type { Scenario } from '../types/generator'

// Mocked generator service; in future this can call a real backend.
export async function generateFromStory(story: string): Promise<{
  scenarios: Scenario[]
  script: string
}> {
  console.debug('Generating from story:', story)
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const scenarios: Scenario[] = [
    {
      id: 'scn-1',
      name: 'Valid coupon applied successfully',
      priority: 'High',
      description:
        'User can apply a valid discount coupon at checkout and see the discounted total.',
      testCase: {
        id: 'tc-1',
        name: 'Apply valid discount coupon',
        priority: 'High',
        expectedResult: '20% discount applied and total updated to $64.00',
        steps: [
          {
            n: 1,
            action: 'Navigate to /checkout with items in cart totalling $80',
            expected: 'Checkout page is displayed with correct cart total',
          },
          {
            n: 2,
            action: 'Enter coupon code "SAVE20" in the coupon field',
            expected: 'Coupon field accepts the value',
          },
          {
            n: 3,
            action: 'Click the "Apply" button',
            expected: '20% discount is shown and total updates to $64.00',
          },
        ],
      },
    },
    {
      id: 'scn-2',
      name: 'Invalid coupon code rejected',
      priority: 'Medium',
      description:
        'Entering an invalid coupon shows an error and does not change the total.',
      testCase: {
        id: 'tc-2',
        name: 'Reject invalid coupon',
        priority: 'Medium',
        expectedResult:
          'Error message shown and cart total remains unchanged when invalid coupon is used',
        steps: [
          {
            n: 1,
            action: 'Navigate to /checkout',
            expected: 'Checkout page is displayed',
          },
          {
            n: 2,
            action: 'Enter coupon code "INVALID123" in the coupon field',
            expected: 'Coupon field accepts the value',
          },
          {
            n: 3,
            action: 'Click the "Apply" button',
            expected: 'Error message appears and total stays the same',
          },
        ],
      },
    },
    {
      id: 'scn-3',
      name: 'Expired coupon shows error',
      priority: 'Medium',
      description:
        'Using an expired coupon shows a clear error and does not change totals.',
      testCase: {
        id: 'tc-3',
        name: 'Expired coupon error message',
        priority: 'Medium',
        expectedResult:
          '"Coupon has expired" message is displayed and totals remain unchanged',
        steps: [
          {
            n: 1,
            action: 'Navigate to /checkout',
            expected: 'Checkout page is displayed',
          },
          {
            n: 2,
            action: 'Enter an expired coupon code in the coupon field',
            expected: 'Coupon field accepts the value',
          },
          {
            n: 3,
            action: 'Click the "Apply" button',
            expected: '"Coupon has expired" error message is shown',
          },
        ],
      },
    },
  ]

  const script = `import { test, expect } from '@playwright/test';

test.describe('Discount Coupon', () => {
  test('apply valid coupon SAVE20', async ({ page }) => {
    await page.goto('/checkout');
    await page.fill('[data-testid="coupon-input"]', 'SAVE20');
    await page.click('[data-testid="apply-coupon"]');
    await expect(page.locator('.discount-amount')).toContainText('20%');
    await expect(page.locator('.cart-total')).toContainText('$64.00');
  });

  test('show error for invalid coupon', async ({ page }) => {
    await page.goto('/checkout');
    await page.fill('[data-testid="coupon-input"]', 'INVALID123');
    await page.click('[data-testid="apply-coupon"]');
    await expect(page.locator('.coupon-error')).toBeVisible();
    await expect(page.locator('.coupon-error')).toContainText('Invalid coupon code');
  });
});`

  return { scenarios, script }
}

