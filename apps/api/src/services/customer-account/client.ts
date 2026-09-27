import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { getCustomerAccountConfig } from '../../config/customer-account.js';
import { db } from '../../db/index.js';
import { customerSessions } from '../../db/schema/sessions.js';

type OpenIdConfig = {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
};

type ApiConfig = { graphql_api: string };

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const DISCOVERY_TTL_MS = 60 * 60 * 1000;

let openIdCache: CacheEntry<OpenIdConfig> | null = null;
let apiCache: CacheEntry<ApiConfig> | null = null;

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${url}`);
  }
  return (await response.json()) as T;
}

export async function getOpenIdConfig(): Promise<OpenIdConfig> {
  if (openIdCache != null && openIdCache.expiresAt > Date.now()) {
    return openIdCache.value;
  }

  const { storeDomain } = getCustomerAccountConfig();
  const value = await fetchJson<OpenIdConfig>(
    `https://${storeDomain}/.well-known/openid-configuration`,
  );
  openIdCache = { value, expiresAt: Date.now() + DISCOVERY_TTL_MS };
  return value;
}

export async function getGraphqlEndpoint(): Promise<string> {
  if (apiCache != null && apiCache.expiresAt > Date.now()) {
    return apiCache.value.graphql_api;
  }

  const { storeDomain } = getCustomerAccountConfig();
  const value = await fetchJson<ApiConfig>(
    `https://${storeDomain}/.well-known/customer-account-api`,
  );
  apiCache = { value, expiresAt: Date.now() + DISCOVERY_TTL_MS };
  return value.graphql_api;
}

const rawGraphqlResponseSchema = z.object({
  data: z.unknown().optional(),
  errors: z.array(z.object({ message: z.string() })).optional(),
});

export class CustomerAccountError extends Error {
  readonly detail: string | undefined;

  constructor(message: string, detail?: string) {
    super(message);
    this.name = 'CustomerAccountError';
    this.detail = detail;
  }
}

export class CustomerAccountUnauthorizedError extends CustomerAccountError {}

async function graphqlRequest(
  accessToken: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<{ data: Record<string, unknown> | null }> {
  const endpoint = await getGraphqlEndpoint();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 401 || response.status === 403) {
    throw new CustomerAccountUnauthorizedError('Customer token rejected');
  }

  const json = await response.json();
  const parsed = rawGraphqlResponseSchema.parse(json);

  if (parsed.errors != null && parsed.errors.length > 0) {
    throw new CustomerAccountError(
      'Customer Account API request failed',
      parsed.errors.map((e) => e.message).join('; '),
    );
  }

  return { data: (parsed.data ?? null) as Record<string, unknown> | null };
}

/**
 * Run a Customer Account API operation against the given session, refreshing
 * the access token (and retrying once) if Shopify rejects it as expired.
 */
export async function runCustomerOperation<T>(args: {
  sessionId: string;
  query: string;
  variables?: Record<string, unknown>;
  parse: (data: Record<string, unknown>) => T;
}): Promise<T> {
  const attempt = async (accessToken: string) => {
    const { data } = await graphqlRequest(
      accessToken,
      args.query,
      args.variables ?? {},
    );
    if (data == null) {
      throw new CustomerAccountError('Customer Account API returned no data');
    }
    return args.parse(data);
  };

  const [session] = await db
    .select()
    .from(customerSessions)
    .where(eq(customerSessions.id, args.sessionId));

  if (session == null) {
    throw new CustomerAccountUnauthorizedError('Customer session not found');
  }

  try {
    return await attempt(session.accessToken);
  } catch (error) {
    if (
      !(error instanceof CustomerAccountUnauthorizedError) ||
      session.refreshToken == null
    ) {
      throw error;
    }
  }

  // Token expired — refresh once and retry.
  const refreshed = await refreshAccessToken(session.refreshToken);
  await db
    .update(customerSessions)
    .set({
      accessToken: refreshed.accessToken,
      accessTokenExpiresAt: refreshed.expiresAt,
      refreshToken: refreshed.refreshToken ?? session.refreshToken,
    })
    .where(eq(customerSessions.id, args.sessionId));

  return attempt(refreshed.accessToken);
}

// --- OAuth token endpoints ---

export interface TokenResponse {
  accessToken: string;
  expiresAt: Date;
  refreshToken: string | null;
  idToken: string | null;
}

const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  id_token: z.string().optional(),
});

async function tokenRequest(
  body: Record<string, string>,
): Promise<TokenResponse> {
  const { clientId, clientSecret } = getCustomerAccountConfig();
  const { token_endpoint: tokenEndpoint } = await getOpenIdConfig();

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new CustomerAccountError(
      'Customer Account token request failed',
      text.slice(0, 500),
    );
  }

  const parsed = tokenResponseSchema.parse(await response.json());
  return {
    accessToken: parsed.access_token,
    expiresAt: new Date(Date.now() + parsed.expires_in * 1000),
    refreshToken: parsed.refresh_token ?? null,
    idToken: parsed.id_token ?? null,
  };
}

export async function exchangeAuthorizationCode(args: {
  code: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<TokenResponse> {
  const { clientId } = getCustomerAccountConfig();
  return tokenRequest({
    grant_type: 'authorization_code',
    client_id: clientId,
    redirect_uri: args.redirectUri,
    code: args.code,
    code_verifier: args.codeVerifier,
  });
}

async function refreshAccessToken(
  refreshToken: string,
): Promise<TokenResponse> {
  const { clientId } = getCustomerAccountConfig();
  return tokenRequest({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: refreshToken,
  });
}

// --- Authorization redirect URL ---

export async function buildAuthorizationUrl(args: {
  redirectUri: string;
  state: string;
  codeChallenge: string;
  loginHint?: string;
}): Promise<string> {
  const { clientId } = getCustomerAccountConfig();
  const { authorization_endpoint: authorizationEndpoint } =
    await getOpenIdConfig();

  const url = new URL(authorizationEndpoint);
  url.searchParams.set('scope', 'openid email customer-account-api:full');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', args.redirectUri);
  url.searchParams.set('state', args.state);
  url.searchParams.set('code_challenge', args.codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  if (args.loginHint != null && args.loginHint !== '') {
    url.searchParams.set('login_hint', args.loginHint);
  }
  return url.toString();
}

/**
 * Best-effort logout on the Customer Accounts domain.
 * ponytail: browser redirect flow; if Shopify's session outlives ours the
 * next sign-in is one click via prompt=none. Add end_session redirect if
 * shared-device logout matters.
 */
export async function logout(_args: { sessionId: string }): Promise<void> {
  await db
    .delete(customerSessions)
    .where(eq(customerSessions.id, _args.sessionId));
}
