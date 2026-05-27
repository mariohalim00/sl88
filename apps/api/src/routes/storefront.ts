import { Elysia, t } from 'elysia';
import {
  addStorefrontCartLines,
  createStorefrontCart,
  removeStorefrontCartLines,
  updateStorefrontCartLines,
} from '../services/storefront/mutations/cart.js';
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

const cartParamsSchema = t.Object({
  cartId: t.String({ minLength: 1 }),
});

const cartLineInputSchema = t.Object({
  merchandiseId: t.String({ minLength: 1 }),
  quantity: t.Numeric({ minimum: 1 }),
});

const cartLineUpdateSchema = t.Object({
  id: t.String({ minLength: 1 }),
  quantity: t.Numeric({ minimum: 0 }),
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
  .post(
    '/cart',
    async ({ body, request, set }) => {
      try {
        const response = await createStorefrontCart(body.lines);
        set.status = 201;
        return response;
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
      body: t.Object({
        lines: t.Array(cartLineInputSchema),
      }),
    },
  )
  .post(
    '/cart/:cartId/lines',
    async ({ body, params, request, set }) => {
      try {
        return await addStorefrontCartLines(params.cartId, body.lines);
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
      params: cartParamsSchema,
      body: t.Object({
        lines: t.Array(cartLineInputSchema),
      }),
    },
  )
  .patch(
    '/cart/:cartId/lines',
    async ({ body, params, request, set }) => {
      try {
        return await updateStorefrontCartLines(params.cartId, body.lines);
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
      params: cartParamsSchema,
      body: t.Object({
        lines: t.Array(cartLineUpdateSchema),
      }),
    },
  )
  .delete(
    '/cart/:cartId/lines',
    async ({ body, params, request, set }) => {
      try {
        return await removeStorefrontCartLines(params.cartId, body.lineIds);
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
      params: cartParamsSchema,
      body: t.Object({
        lineIds: t.Array(t.String({ minLength: 1 })),
      }),
    },
  )
  .post('/cart/:cartId/checkout', () => ({
    checkoutUrl: 'https://example.com/checkout/pending',
    mode: 'hosted_redirect' as const,
  }));
