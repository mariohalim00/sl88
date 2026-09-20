import { createProblemDetail } from '@sl88/shared/schemas';
import { Elysia, t } from 'elysia';
import {
  toStorefrontProblem,
  StorefrontValidationError,
} from '../services/storefront/errors.js';
import {
  createStorefrontCustomerAccessToken,
  createStorefrontCustomer,
  deleteStorefrontCustomerAccessToken,
} from '../services/storefront/mutations/customer-auth.js';
import {
  updateStorefrontCustomer,
  createStorefrontCustomerAddress,
  updateStorefrontCustomerAddress,
  deleteStorefrontCustomerAddress,
} from '../services/storefront/mutations/customer.js';
import { getStorefrontCustomer } from '../services/storefront/queries/customer.js';

const COOKIE_NAME = 'sl88_customer_token';
const COOKIE_PATH = '/api/customer';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

function parseCustomerToken(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader == null) return null;

  for (const pair of cookieHeader.split(';')) {
    const [name, ...rest] = pair.trim().split('=');
    if (name === COOKIE_NAME) {
      const value = decodeURIComponent(rest.join('='));
      return value || null;
    }
  }
  return null;
}

function requireCustomerToken(request: Request): string {
  const token = parseCustomerToken(request);
  if (token == null) {
    throw Object.assign(new Error('Customer not authenticated'), {
      statusCode: 401,
    });
  }
  return token;
}

function setAuthCookie(headers: Record<string, unknown>, token: string) {
  headers['Set-Cookie'] =
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=${COOKIE_PATH}; Max-Age=${COOKIE_MAX_AGE}`;
}

function clearAuthCookie(headers: Record<string, unknown>) {
  headers['Set-Cookie'] =
    `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=${COOKIE_PATH}; Max-Age=0`;
}

// --- Schemas ---

const loginBodySchema = t.Object({
  email: t.String({ format: 'email', minLength: 1 }),
  password: t.String({ minLength: 1 }),
});

const registerBodySchema = t.Object({
  firstName: t.String({ minLength: 1 }),
  lastName: t.String({ minLength: 1 }),
  email: t.String({ format: 'email', minLength: 1 }),
  password: t.String({ minLength: 5 }),
});

const customerUpdateBodySchema = t.Object({
  firstName: t.Optional(t.String({ minLength: 1 })),
  lastName: t.Optional(t.String({ minLength: 1 })),
  email: t.Optional(t.String({ format: 'email', minLength: 1 })),
  phone: t.Optional(t.String()),
});

const addressBodySchema = t.Object({
  address1: t.Optional(t.String()),
  address2: t.Optional(t.String()),
  city: t.Optional(t.String()),
  province: t.Optional(t.String()),
  zip: t.Optional(t.String()),
  country: t.Optional(t.String()),
  phone: t.Optional(t.String()),
  firstName: t.Optional(t.String()),
  lastName: t.Optional(t.String()),
  company: t.Optional(t.String()),
});

const addressParamsSchema = t.Object({
  id: t.String({ minLength: 1 }),
});

function problemUnauthorized(detail?: string) {
  return createProblemDetail(
    'https://example.dev/problems/unauthorized',
    'Unauthorized',
    401,
    {
      detail: detail ?? 'Customer not authenticated.',
    },
  );
}

function problemBadRequest(detail?: string) {
  return createProblemDetail(
    'https://example.dev/problems/validation-error',
    'Validation Error',
    400,
    detail != null ? { detail } : undefined,
  );
}

// --- Route ---

export const customerRoute = new Elysia({ prefix: '/api/customer' })
  .post(
    '/login',
    async ({ body, request, set }) => {
      try {
        const result = await createStorefrontCustomerAccessToken(
          body.email,
          body.password,
        );
        if (result.customerAccessToken == null) {
          set.status = 401;
          set.headers['content-type'] = 'application/problem+json';
          return problemUnauthorized('Invalid email or password.');
        }

        setAuthCookie(
          set.headers as Record<string, unknown>,
          result.customerAccessToken.accessToken,
        );

        const customer = await getStorefrontCustomer(
          result.customerAccessToken.accessToken,
        );
        return customer;
      } catch (error: unknown) {
        const err = error as { statusCode?: number };
        if (err?.statusCode === 401) {
          set.status = 401;
          set.headers['content-type'] = 'application/problem+json';
          return problemUnauthorized('Invalid email or password.');
        }
        if (error instanceof StorefrontValidationError) {
          set.status = 401;
          set.headers['content-type'] = 'application/problem+json';
          return problemUnauthorized(
            error.detail ?? 'Invalid email or password.',
          );
        }
        const problem = toStorefrontProblem(
          error,
          new URL(request.url).pathname,
        );
        set.status = problem.status;
        set.headers['content-type'] = 'application/problem+json';
        return problem.body;
      }
    },
    { body: loginBodySchema },
  )
  .post(
    '/register',
    async ({ body, request, set }) => {
      try {
        const registerResult = await createStorefrontCustomer(body);
        const loginResult = await createStorefrontCustomerAccessToken(
          body.email,
          body.password,
        );

        if (loginResult.customerAccessToken == null) {
          set.status = 201;
          return { customer: registerResult.customer };
        }

        setAuthCookie(
          set.headers as Record<string, unknown>,
          loginResult.customerAccessToken.accessToken,
        );

        const customer = await getStorefrontCustomer(
          loginResult.customerAccessToken.accessToken,
        );
        set.status = 201;
        return customer;
      } catch (error: unknown) {
        if (error instanceof StorefrontValidationError) {
          set.status = 400;
          set.headers['content-type'] = 'application/problem+json';
          return problemBadRequest(error.detail ?? 'Registration failed.');
        }
        const problem = toStorefrontProblem(
          error,
          new URL(request.url).pathname,
        );
        set.status = problem.status;
        set.headers['content-type'] = 'application/problem+json';
        return problem.body;
      }
    },
    { body: registerBodySchema },
  )
  .post('/logout', async ({ request, set }) => {
    const token = parseCustomerToken(request);
    if (token != null) {
      await deleteStorefrontCustomerAccessToken(token).catch(() => {});
    }
    clearAuthCookie(set.headers as Record<string, unknown>);
    return { success: true };
  })
  .get('/me', async ({ request, set }) => {
    try {
      const token = requireCustomerToken(request);
      const customer = await getStorefrontCustomer(token);

      if (customer == null) {
        clearAuthCookie(set.headers as Record<string, unknown>);
        set.status = 401;
        set.headers['content-type'] = 'application/problem+json';
        return problemUnauthorized('Session expired. Please log in again.');
      }

      return customer;
    } catch (error: unknown) {
      const err = error as { statusCode?: number };
      if (err?.statusCode === 401) {
        set.status = 401;
        set.headers['content-type'] = 'application/problem+json';
        return problemUnauthorized();
      }
      const problem = toStorefrontProblem(error, new URL(request.url).pathname);
      set.status = problem.status;
      set.headers['content-type'] = 'application/problem+json';
      return problem.body;
    }
  })
  .put(
    '/me',
    async ({ body, request, set }) => {
      try {
        const token = requireCustomerToken(request);
        const updateResult = await updateStorefrontCustomer(token, body);

        if (updateResult.customer == null) {
          set.status = 400;
          set.headers['content-type'] = 'application/problem+json';
          return problemBadRequest('Failed to update customer profile.');
        }

        const customer = await getStorefrontCustomer(token);
        return customer;
      } catch (error: unknown) {
        const err = error as { statusCode?: number };
        if (err?.statusCode === 401) {
          set.status = 401;
          set.headers['content-type'] = 'application/problem+json';
          return problemUnauthorized();
        }
        if (error instanceof StorefrontValidationError) {
          set.status = 400;
          set.headers['content-type'] = 'application/problem+json';
          return problemBadRequest(error.detail ?? 'Profile update failed.');
        }
        const problem = toStorefrontProblem(
          error,
          new URL(request.url).pathname,
        );
        set.status = problem.status;
        set.headers['content-type'] = 'application/problem+json';
        return problem.body;
      }
    },
    { body: customerUpdateBodySchema },
  )
  .get('/addresses', async ({ request, set }) => {
    try {
      const token = requireCustomerToken(request);
      const customer = await getStorefrontCustomer(token);

      if (customer == null) {
        set.status = 401;
        set.headers['content-type'] = 'application/problem+json';
        return problemUnauthorized();
      }

      return {
        addresses: customer.addresses,
        defaultAddress: customer.defaultAddress,
      };
    } catch (error: unknown) {
      const err = error as { statusCode?: number };
      if (err?.statusCode === 401) {
        set.status = 401;
        set.headers['content-type'] = 'application/problem+json';
        return problemUnauthorized();
      }
      const problem = toStorefrontProblem(error, new URL(request.url).pathname);
      set.status = problem.status;
      set.headers['content-type'] = 'application/problem+json';
      return problem.body;
    }
  })
  .post(
    '/addresses',
    async ({ body, request, set }) => {
      try {
        const token = requireCustomerToken(request);
        const address = await createStorefrontCustomerAddress(token, body);
        set.status = 201;
        return address;
      } catch (error: unknown) {
        const err = error as { statusCode?: number };
        if (err?.statusCode === 401) {
          set.status = 401;
          set.headers['content-type'] = 'application/problem+json';
          return problemUnauthorized();
        }
        if (error instanceof StorefrontValidationError) {
          set.status = 400;
          set.headers['content-type'] = 'application/problem+json';
          return problemBadRequest(error.detail ?? 'Failed to create address.');
        }
        const problem = toStorefrontProblem(
          error,
          new URL(request.url).pathname,
        );
        set.status = problem.status;
        set.headers['content-type'] = 'application/problem+json';
        return problem.body;
      }
    },
    { body: addressBodySchema },
  )
  .put(
    '/addresses/:id',
    async ({ body, params, request, set }) => {
      try {
        const token = requireCustomerToken(request);
        const address = await updateStorefrontCustomerAddress(
          token,
          params.id,
          body,
        );
        return address;
      } catch (error: unknown) {
        const err = error as { statusCode?: number };
        if (err?.statusCode === 401) {
          set.status = 401;
          set.headers['content-type'] = 'application/problem+json';
          return problemUnauthorized();
        }
        if (error instanceof StorefrontValidationError) {
          set.status = 400;
          set.headers['content-type'] = 'application/problem+json';
          return problemBadRequest(error.detail ?? 'Failed to update address.');
        }
        const problem = toStorefrontProblem(
          error,
          new URL(request.url).pathname,
        );
        set.status = problem.status;
        set.headers['content-type'] = 'application/problem+json';
        return problem.body;
      }
    },
    { params: addressParamsSchema, body: addressBodySchema },
  )
  .delete(
    '/addresses/:id',
    async ({ params, request, set }) => {
      try {
        const token = requireCustomerToken(request);
        await deleteStorefrontCustomerAddress(token, params.id);
        set.status = 204;
        return undefined;
      } catch (error: unknown) {
        const err = error as { statusCode?: number };
        if (err?.statusCode === 401) {
          set.status = 401;
          set.headers['content-type'] = 'application/problem+json';
          return problemUnauthorized();
        }
        if (error instanceof StorefrontValidationError) {
          set.status = 400;
          set.headers['content-type'] = 'application/problem+json';
          return problemBadRequest(error.detail ?? 'Failed to delete address.');
        }
        const problem = toStorefrontProblem(
          error,
          new URL(request.url).pathname,
        );
        set.status = problem.status;
        set.headers['content-type'] = 'application/problem+json';
        return problem.body;
      }
    },
    { params: addressParamsSchema },
  );
