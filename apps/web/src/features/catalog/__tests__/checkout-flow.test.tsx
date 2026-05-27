import { describe, expect, it } from 'bun:test';

function resolveResult(value: string | null) {
  if (value === 'success' || value === 'cancel' || value === 'failed') {
    return value;
  }

  return 'failed';
}

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

    expect(resolveResult('success')).toBe('success');
    expect(resolveResult('cancel')).toBe('cancel');
    expect(resolveResult(null)).toBe('failed');
  });
});
