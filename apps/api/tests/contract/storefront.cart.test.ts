import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { app } from '../../src/app/index.js';

const originalFetch = globalThis.fetch;

function buildCartResponse(totalQuantity: number) {
  return {
    cart: {
      id: 'gid://shopify/Cart/1',
      checkoutUrl: 'https://shop.test/checkouts/cart-1',
      totalQuantity,
      cost: {
        subtotalAmount: { amount: '100.00', currencyCode: 'USD' },
        totalAmount: { amount: '100.00', currencyCode: 'USD' },
        totalTaxAmount: null,
      },
      lines: {
        nodes:
          totalQuantity === 0
            ? []
            : [
                {
                  id: 'gid://shopify/CartLine/1',
                  quantity: totalQuantity,
                  merchandise: {
                    id: 'gid://shopify/ProductVariant/1',
                    title: 'Default',
                    image: { url: 'https://cdn.test/mat.jpg' },
                    product: { title: 'Woven Mat' },
                    price: { amount: '100.00', currencyCode: 'USD' },
                  },
                  cost: {
                    totalAmount: { amount: '100.00', currencyCode: 'USD' },
                  },
                },
              ],
      },
    },
    userErrors: [],
  };
}

describe('Storefront cart contract', () => {
  beforeEach(() => {
    process.env['SHOPIFY_STORE_DOMAIN'] = 'example.myshopify.com';
    process.env['SHOPIFY_STOREFRONT_API_VERSION'] = '2026-01';
    process.env['SHOPIFY_STOREFRONT_ACCESS_TOKEN'] = 'token';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    mock.restore();
  });

  it('creates cart with POST /api/storefront/cart', async () => {
    globalThis.fetch = mock(async () => {
      return new Response(
        JSON.stringify({
          data: {
            cartCreate: buildCartResponse(1),
          },
        }),
        { status: 200 },
      );
    }) as unknown as typeof fetch;

    const res = await app.handle(
      new Request('http://localhost/api/storefront/cart', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          lines: [{ merchandiseId: 'gid://shopify/ProductVariant/1', quantity: 1 }],
        }),
      }),
    );

    expect(res.status).toBe(201);
    const body = (await res.json()) as { cart: { totalQuantity: number } };
    expect(body.cart.totalQuantity).toBe(1);
  });

  it('adds, updates, and removes lines through cart line endpoints', async () => {
    globalThis.fetch = mock(async (request: RequestInfo | URL, init?: RequestInit) => {
      const body = typeof init?.body === 'string' ? init.body : '{}';

      if (body.includes('cartLinesAdd')) {
        return new Response(
          JSON.stringify({ data: { cartLinesAdd: buildCartResponse(2) } }),
          { status: 200 },
        );
      }

      if (body.includes('cartLinesUpdate')) {
        return new Response(
          JSON.stringify({ data: { cartLinesUpdate: buildCartResponse(3) } }),
          { status: 200 },
        );
      }

      return new Response(
        JSON.stringify({ data: { cartLinesRemove: buildCartResponse(0) } }),
        { status: 200 },
      );
    }) as unknown as typeof fetch;

    const addRes = await app.handle(
      new Request('http://localhost/api/storefront/cart/cart-1/lines', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          lines: [{ merchandiseId: 'gid://shopify/ProductVariant/1', quantity: 2 }],
        }),
      }),
    );

    expect(addRes.status).toBe(200);

    const updateRes = await app.handle(
      new Request('http://localhost/api/storefront/cart/cart-1/lines', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          lines: [{ id: 'gid://shopify/CartLine/1', quantity: 3 }],
        }),
      }),
    );

    expect(updateRes.status).toBe(200);

    const removeRes = await app.handle(
      new Request('http://localhost/api/storefront/cart/cart-1/lines', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          lineIds: ['gid://shopify/CartLine/1'],
        }),
      }),
    );

    expect(removeRes.status).toBe(200);
    const removePayload = (await removeRes.json()) as {
      cart: { totalQuantity: number };
    };
    expect(removePayload.cart.totalQuantity).toBe(0);
  });
});
