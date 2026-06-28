import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { app } from '../../src/app/index.js';

const originalFetch = globalThis.fetch;

describe('Storefront checkout contract', () => {
  beforeEach(() => {
    process.env['APP_PUBLIC_URL'] = 'https://storefront.example';
    process.env['SHOPIFY_STORE_DOMAIN'] = 'example.myshopify.com';
    process.env['SHOPIFY_STOREFRONT_API_VERSION'] = '2026-01';
    process.env['SHOPIFY_STOREFRONT_ACCESS_TOKEN'] = 'token';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env['APP_PUBLIC_URL'];
  });

  it('returns hosted redirect checkout URL', async () => {
    globalThis.fetch = (async () => {
      return new Response(
        JSON.stringify({
          data: {
            cart: {
              checkoutUrl: 'https://shop.test/checkouts/cart-1',
            },
          },
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      );
    }) as unknown as typeof fetch;

    const res = await app.handle(
      new Request('http://localhost/api/storefront/cart/cart-1/checkout', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({}),
      }),
    );

    expect(res.status).toBe(200);
    const payload = (await res.json()) as { checkoutUrl: string; mode: string };
    expect(payload.checkoutUrl).toContain('checkouts');
    expect(payload.checkoutUrl).toContain(
      encodeURIComponent(
        'https://storefront.example/checkout/result?status=success',
      ),
    );
    expect(payload.checkoutUrl).toContain('continue_shopping_url=');
    expect(payload.mode).toBe('hosted_redirect');
  });

  it('falls back to localhost app public URL when APP_PUBLIC_URL is unset', async () => {
    delete process.env['APP_PUBLIC_URL'];

    globalThis.fetch = (async () => {
      return new Response(
        JSON.stringify({
          data: {
            cart: {
              checkoutUrl: 'https://shop.test/checkouts/cart-2',
            },
          },
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      );
    }) as unknown as typeof fetch;

    const res = await app.handle(
      new Request('http://localhost/api/storefront/cart/cart-2/checkout', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({}),
      }),
    );

    expect(res.status).toBe(200);
    const payload = (await res.json()) as { checkoutUrl: string; mode: string };
    expect(payload.checkoutUrl).toContain(
      encodeURIComponent(
        'http://localhost:5173/checkout/result?status=success',
      ),
    );
    expect(payload.mode).toBe('hosted_redirect');
  });
});
