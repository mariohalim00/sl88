import { describe, expect, it } from 'bun:test';
import { resolveCheckoutResult } from '../hooks/useCheckout';

function buildHostedRedirect(url: string) {
  return {
    checkoutUrl: url,
    mode: 'hosted_redirect' as const,
  };
}

describe('Checkout flow integration', () => {
  it('supports guest hosted redirect payload and return states', () => {
    const redirect = buildHostedRedirect('https://shop.test/checkouts/cart-1');
    expect(redirect.mode).toBe('hosted_redirect');
    expect(redirect.checkoutUrl).toContain('checkouts');

    expect(resolveCheckoutResult('success')).toBe('success');
    expect(resolveCheckoutResult('cancel')).toBe('cancel');
    expect(resolveCheckoutResult(null)).toBe('failed');
  });
});
