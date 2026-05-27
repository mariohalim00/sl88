import { Elysia, t } from 'elysia';
import { toStorefrontProblem } from '../services/storefront/errors.js';
import { getStorefrontProductDetail } from '../services/storefront/queries/product-detail.js';
import { listStorefrontProducts } from '../services/storefront/queries/products.js';

const listProductsQuerySchema = t.Object({
  cursor: t.Optional(t.String()),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50 })),
});

const productParamsSchema = t.Object({
  handle: t.String({ minLength: 1 }),
});

export const storefrontRoute = new Elysia({ prefix: '/api/storefront' })
  .get(
    '/products',
    async ({ query, request, set }) => {
      try {
        const input: { limit?: number; cursor?: string } = {};
        if (query.limit != null) {
          input.limit = query.limit;
        }
        if (query.cursor != null) {
          input.cursor = query.cursor;
        }

        return await listStorefrontProducts(input);
      } catch (error) {
        const problem = toStorefrontProblem(
          error,
          new URL(request.url).pathname,
        );
        set.status = problem.status;
        set.headers['content-type'] = 'application/problem+json';
        return problem.body;
      }
    },
    {
      query: listProductsQuerySchema,
    },
  )
  .get(
    '/products/:handle',
    async ({ params, request, set }) => {
      try {
        return await getStorefrontProductDetail(params.handle);
      } catch (error) {
        const problem = toStorefrontProblem(
          error,
          new URL(request.url).pathname,
        );
        set.status = problem.status;
        set.headers['content-type'] = 'application/problem+json';
        return problem.body;
      }
    },
    {
      params: productParamsSchema,
    },
  )
  .post('/cart', () => ({
    cart: {
      id: 'pending',
      checkoutUrl: 'https://example.com/checkout/pending',
      totalQuantity: 0,
      cost: {
        subtotalAmount: '0.00',
        totalAmount: '0.00',
        totalTaxAmount: null,
        currencyCode: 'USD',
      },
      lines: [],
    },
  }))
  .post('/cart/:cartId/lines', () => ({
    cart: {
      id: 'pending',
      checkoutUrl: 'https://example.com/checkout/pending',
      totalQuantity: 0,
      cost: {
        subtotalAmount: '0.00',
        totalAmount: '0.00',
        totalTaxAmount: null,
        currencyCode: 'USD',
      },
      lines: [],
    },
  }))
  .patch('/cart/:cartId/lines', () => ({
    cart: {
      id: 'pending',
      checkoutUrl: 'https://example.com/checkout/pending',
      totalQuantity: 0,
      cost: {
        subtotalAmount: '0.00',
        totalAmount: '0.00',
        totalTaxAmount: null,
        currencyCode: 'USD',
      },
      lines: [],
    },
  }))
  .delete('/cart/:cartId/lines', () => ({
    cart: {
      id: 'pending',
      checkoutUrl: 'https://example.com/checkout/pending',
      totalQuantity: 0,
      cost: {
        subtotalAmount: '0.00',
        totalAmount: '0.00',
        totalTaxAmount: null,
        currencyCode: 'USD',
      },
      lines: [],
    },
  }))
  .post('/cart/:cartId/checkout', () => ({
    checkoutUrl: 'https://example.com/checkout/pending',
    mode: 'hosted_redirect' as const,
  }));
