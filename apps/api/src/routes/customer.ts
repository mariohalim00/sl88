import { createProblemDetail } from '@sl88/shared/schemas';
import { eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import { db } from '../db/index.js';
import { customerCarts } from '../db/schema/carts.js';
import { customerOAuthStates } from '../db/schema/oauth-states.js';
import { customerSessions } from '../db/schema/sessions.js';
import { getAppPublicUrl } from '../env/index.js';
import {
  buildAuthorizationUrl,
  exchangeAuthorizationCode,
  getOpenIdConfig,
  runCustomerOperation,
} from '../services/customer-account/client.js';
import {
  createCustomerAddress,
  deleteCustomerAddress,
  getCustomer,
  updateCustomer,
  updateCustomerAddress,
} from '../services/customer-account/customer.js';
import { toStorefrontProblem } from '../services/storefront/errors.js';
import { parseSessionId, CUSTOMER_SESSION_COOKIE } from './customer-session.js';

// Covers both /api/customer (account) and /api/storefront (signed-in checkout).
const COOKIE_PATH = '/api';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

const CUSTOMER_ID_QUERY = /* GraphQL */ `
  query CustomerId {
    customer {
      id
    }
  }
`;

function requireSessionId(request: Request): string {
  const sessionId = parseSessionId(request);
  if (sessionId == null) {
    throw Object.assign(new Error('Customer not authenticated'), {
      statusCode: 401,
    });
  }
  return sessionId;
}

function setSessionCookie(headers: Record<string, unknown>, id: string) {
  headers['Set-Cookie'] =
    `${CUSTOMER_SESSION_COOKIE}=${encodeURIComponent(id)}; HttpOnly; Secure; SameSite=Lax; Path=${COOKIE_PATH}; Max-Age=${COOKIE_MAX_AGE}`;
}

function clearSessionCookie(headers: Record<string, unknown>) {
  headers['Set-Cookie'] =
    `${CUSTOMER_SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=${COOKIE_PATH}; Max-Age=0`;
}

// --- PKCE helpers ---

function base64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function randomBase64url(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return base64url(bytes);
}

function generateCodeVerifier(): string {
  return randomBase64url(32);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    { name: 'SHA-256' },
    new TextEncoder().encode(verifier),
  );
  return base64url(new Uint8Array(digest));
}

function generateState(): string {
  return randomBase64url(16);
}

// --- Schemas ---

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

const saveCartBodySchema = t.Object({
  cartId: t.String({ minLength: 1 }),
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

function problemFromError(error: unknown, request: Request, set: unknown) {
  const s = set as { status: number; headers: Record<string, unknown> };
  const err = error as { statusCode?: number };
  if (err?.statusCode === 401) {
    s.status = 401;
    s.headers['content-type'] = 'application/problem+json';
    return problemUnauthorized();
  }
  const problem = toStorefrontProblem(error, new URL(request.url).pathname);
  s.status = problem.status;
  s.headers['content-type'] = 'application/problem+json';
  return problem.body;
}

// --- Route ---

export const customerRoute = new Elysia({ prefix: '/api/customer' })
  .get('/auth/login', async ({ request, set }) => {
    try {
      const callbackUrl = new URL(
        '/api/customer/auth/callback',
        getAppPublicUrl(),
      ).toString();

      const state = generateState();
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      await db.insert(customerOAuthStates).values({ state, codeVerifier });

      const loginHint = new URL(request.url).searchParams.get('email');

      const authorizationUrl = await buildAuthorizationUrl({
        redirectUri: callbackUrl,
        state,
        codeChallenge,
        ...(loginHint != null ? { loginHint } : {}),
      });

      set.status = 302;
      set.headers['location'] = authorizationUrl;
      return undefined;
    } catch (error) {
      return problemFromError(error, request, set);
    }
  })
  .get('/auth/callback', async ({ request, set }) => {
    try {
      const url = new URL(request.url);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      if (code == null || state == null) {
        set.status = 400;
        set.headers['content-type'] = 'application/problem+json';
        return problemBadRequest('Missing code or state parameter.');
      }

      const [stored] = await db
        .select()
        .from(customerOAuthStates)
        .where(eq(customerOAuthStates.state, state));

      if (stored == null) {
        set.status = 400;
        set.headers['content-type'] = 'application/problem+json';
        return problemBadRequest('Invalid or expired login state.');
      }

      const callbackUrl = new URL(
        '/api/customer/auth/callback',
        getAppPublicUrl(),
      ).toString();

      const token = await exchangeAuthorizationCode({
        code,
        redirectUri: callbackUrl,
        codeVerifier: stored.codeVerifier,
      });

      await db
        .delete(customerOAuthStates)
        .where(eq(customerOAuthStates.state, state));

      const inserted = await db
        .insert(customerSessions)
        .values({
          shopifyCustomerId: '',
          accessToken: token.accessToken,
          accessTokenExpiresAt: token.expiresAt,
          refreshToken: token.refreshToken,
          idToken: token.idToken,
        })
        .returning();
      const session = inserted[0];
      if (session == null) {
        throw new Error('Failed to create customer session');
      }

      // Resolve the Shopify customer id for cart association.
      const customerData = await runCustomerOperation({
        sessionId: session.id,
        query: CUSTOMER_ID_QUERY,
        parse: (data) => {
          const customer = data['customer'] as { id: string } | null;
          return customer?.id ?? null;
        },
      });

      if (customerData != null) {
        await db
          .update(customerSessions)
          .set({ shopifyCustomerId: customerData })
          .where(eq(customerSessions.id, session.id));
      }

      setSessionCookie(set.headers as Record<string, unknown>, session.id);

      set.status = 302;
      set.headers['location'] = new URL(
        '/account',
        getAppPublicUrl(),
      ).toString();
      return undefined;
    } catch (error) {
      return problemFromError(error, request, set);
    }
  })
  .get('/auth/logout', async ({ request, set }) => {
    // Full-page navigation (not fetch): must send the browser through
    // Shopify's end_session_endpoint to kill its Customer Accounts session.
    const sessionId = parseSessionId(request);
    let idToken: string | null = null;
    if (sessionId != null) {
      // ponytail: sessions created before id_token was stored have no
      // idToken and get a local-only sign-out; new sessions always carry it.
      const [deleted] = await db
        .delete(customerSessions)
        .where(eq(customerSessions.id, sessionId))
        .returning({ idToken: customerSessions.idToken })
        .catch(() => []);
      idToken = deleted?.idToken ?? null;
    }
    clearSessionCookie(set.headers as Record<string, unknown>);

    let location = new URL('/login', getAppPublicUrl()).toString();
    if (idToken != null) {
      const { end_session_endpoint: endSessionEndpoint } =
        await getOpenIdConfig();
      const logoutUrl = new URL(endSessionEndpoint);
      logoutUrl.searchParams.set('id_token_hint', idToken);
      logoutUrl.searchParams.set('post_logout_redirect_uri', location);
      location = logoutUrl.toString();
    }

    set.status = 302;
    set.headers['location'] = location;
    return undefined;
  })
  .get('/me', async ({ request, set }) => {
    try {
      const sessionId = requireSessionId(request);
      return await getCustomer(sessionId);
    } catch (error) {
      return problemFromError(error, request, set);
    }
  })
  .put(
    '/me',
    async ({ body, request, set }) => {
      try {
        const sessionId = requireSessionId(request);
        await updateCustomer(sessionId, body);
        return await getCustomer(sessionId);
      } catch (error) {
        return problemFromError(error, request, set);
      }
    },
    { body: customerUpdateBodySchema },
  )
  .get('/addresses', async ({ request, set }) => {
    try {
      const sessionId = requireSessionId(request);
      const customer = await getCustomer(sessionId);
      return {
        addresses: customer.addresses,
        defaultAddress: customer.defaultAddress,
      };
    } catch (error) {
      return problemFromError(error, request, set);
    }
  })
  .post(
    '/addresses',
    async ({ body, request, set }) => {
      try {
        const sessionId = requireSessionId(request);
        const address = await createCustomerAddress(sessionId, body);
        set.status = 201;
        return address;
      } catch (error) {
        return problemFromError(error, request, set);
      }
    },
    { body: addressBodySchema },
  )
  .put(
    '/addresses/:id',
    async ({ body, params, request, set }) => {
      try {
        const sessionId = requireSessionId(request);
        return await updateCustomerAddress(sessionId, params.id, body);
      } catch (error) {
        return problemFromError(error, request, set);
      }
    },
    { params: addressParamsSchema, body: addressBodySchema },
  )
  .delete(
    '/addresses/:id',
    async ({ params, request, set }) => {
      try {
        const sessionId = requireSessionId(request);
        await deleteCustomerAddress(sessionId, params.id);
        set.status = 204;
        return undefined;
      } catch (error) {
        return problemFromError(error, request, set);
      }
    },
    { params: addressParamsSchema },
  )
  // --- Cross-device cart pointer ---
  .get('/cart', async ({ request, set }) => {
    try {
      const sessionId = requireSessionId(request);
      const [session] = await db
        .select()
        .from(customerSessions)
        .where(eq(customerSessions.id, sessionId));

      if (session == null || session.shopifyCustomerId === '') {
        return { cartId: null };
      }

      const [cart] = await db
        .select()
        .from(customerCarts)
        .where(eq(customerCarts.shopifyCustomerId, session.shopifyCustomerId));

      return { cartId: cart?.cartId ?? null };
    } catch (error) {
      return problemFromError(error, request, set);
    }
  })
  .put(
    '/cart',
    async ({ body, request, set }) => {
      try {
        const sessionId = requireSessionId(request);
        const [session] = await db
          .select()
          .from(customerSessions)
          .where(eq(customerSessions.id, sessionId));

        if (session == null || session.shopifyCustomerId === '') {
          set.status = 401;
          set.headers['content-type'] = 'application/problem+json';
          return problemUnauthorized();
        }

        await db
          .insert(customerCarts)
          .values({
            shopifyCustomerId: session.shopifyCustomerId,
            cartId: body.cartId,
          })
          .onConflictDoUpdate({
            target: customerCarts.shopifyCustomerId,
            set: { cartId: body.cartId, updatedAt: new Date() },
          });

        return { success: true };
      } catch (error) {
        return problemFromError(error, request, set);
      }
    },
    { body: saveCartBodySchema },
  );
