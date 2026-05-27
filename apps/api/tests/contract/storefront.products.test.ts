import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { app } from '../../src/app/index.js';

const originalFetch = globalThis.fetch;

describe('Storefront products contract', () => {
  beforeEach(() => {
    process.env['SHOPIFY_STORE_DOMAIN'] = 'example.myshopify.com';
    process.env['SHOPIFY_STOREFRONT_API_VERSION'] = '2026-01';
    process.env['SHOPIFY_STOREFRONT_ACCESS_TOKEN'] = 'token';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('returns normalized products from GET /api/storefront/products', async () => {
    globalThis.fetch = (async () => {
      return new Response(
        JSON.stringify({
          data: {
            products: {
              edges: [
                {
                  cursor: 'cursor-1',
                  node: {
                    id: 'gid://shopify/Product/1',
                    handle: 'woven-mat',
                    title: 'Woven Mat',
                    availableForSale: true,
                    featuredImage: { url: 'https://cdn.test/mat.jpg' },
                    priceRange: {
                      minVariantPrice: { amount: '50.00', currencyCode: 'USD' },
                      maxVariantPrice: { amount: '70.00', currencyCode: 'USD' },
                    },
                  },
                },
              ],
              pageInfo: {
                hasNextPage: false,
                endCursor: null,
              },
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
      new Request('http://localhost/api/storefront/products?limit=1'),
    );

    expect(res.status).toBe(200);
    const payload = (await res.json()) as {
      products: Array<{ handle: string; title: string }>;
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };

    expect(payload.products).toHaveLength(1);
    expect(payload.products[0]?.handle).toBe('woven-mat');
    expect(payload.products[0]?.title).toBe('Woven Mat');
    expect(payload.pageInfo.hasNextPage).toBe(false);
  });

  it('returns 404 problem+json for unknown product handle', async () => {
    globalThis.fetch = (async () => {
      return new Response(
        JSON.stringify({
          data: {
            product: null,
          },
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      );
    }) as unknown as typeof fetch;

    const res = await app.handle(
      new Request('http://localhost/api/storefront/products/unknown-handle'),
    );

    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toContain(
      'application/problem+json',
    );

    const payload = (await res.json()) as { title: string; status: number };
    expect(payload.status).toBe(404);
    expect(payload.title).toContain('Not Found');
  });
});
