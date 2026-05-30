import { z } from 'zod';
import {
  parseStorefrontConfig,
  type StorefrontConfig,
} from '../config/storefront.js';
import { logger } from '../lib/logger.js';

const DEFAULT_DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/sl88_dev';
const DEFAULT_APP_PUBLIC_URL = 'http://localhost:5173';

const runtimeEnvSchema = z.object({
  API_PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(3000)
    .describe('Port the API server listens on'),
});

const runtimeResult = runtimeEnvSchema.safeParse(process.env);

if (!runtimeResult.success) {
  console.error('[env] Invalid environment configuration:');
  for (const [field, messages] of Object.entries(
    runtimeResult.error.flatten().fieldErrors,
  )) {
    console.error(`  ${field}: ${messages?.join(', ')}`);
  }
  process.exit(1);
}

const databaseUrlSchema = z
  .string()
  .min(1, 'DATABASE_URL is required')
  .describe('PostgreSQL connection string');

const appPublicUrlSchema = z
  .string()
  .trim()
  .min(1, 'APP_PUBLIC_URL is required')
  .url('APP_PUBLIC_URL must be a valid absolute URL')
  .describe('Public storefront base URL used for hosted checkout returns');

export const env = runtimeResult.data;

let cachedStorefrontConfig: StorefrontConfig | null = null;
let hasWarnedPublicTokenFallback = false;

export const getDatabaseUrl = (): string => {
  const candidate = process.env['DATABASE_URL'] ?? DEFAULT_DATABASE_URL;
  const result = databaseUrlSchema.safeParse(candidate);

  if (result.success) {
    return result.data;
  }

  const messages =
    result.error.flatten().formErrors.join(', ') || 'Invalid DATABASE_URL';
  throw new Error(`[env] ${messages}`);
};

export const getAppPublicUrl = (): string => {
  const candidate = process.env['APP_PUBLIC_URL'] ?? DEFAULT_APP_PUBLIC_URL;
  const result = appPublicUrlSchema.safeParse(candidate);

  if (result.success) {
    if (process.env['APP_PUBLIC_URL'] == null) {
      logger.warn(
        `[env] APP_PUBLIC_URL is not set. Falling back to ${DEFAULT_APP_PUBLIC_URL} for hosted checkout returns.`,
      );
    }

    return result.data;
  }

  const messages =
    result.error.flatten().formErrors.join(', ') || 'Invalid APP_PUBLIC_URL';
  throw new Error(`[env] ${messages}`);
};

export const getStorefrontConfig = (): StorefrontConfig => {
  if (cachedStorefrontConfig != null) {
    return cachedStorefrontConfig;
  }

  const storefrontEnv: {
    SHOPIFY_STORE_DOMAIN?: string;
    SHOPIFY_STOREFRONT_API_VERSION?: string;
    SHOPIFY_STOREFRONT_ACCESS_TOKEN?: string;
    SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN?: string;
    SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN?: string;
  } = {};

  const storeDomain = process.env['SHOPIFY_STORE_DOMAIN'];
  const apiVersion = process.env['SHOPIFY_STOREFRONT_API_VERSION'];
  const accessToken = process.env['SHOPIFY_STOREFRONT_ACCESS_TOKEN'];
  const publicAccessToken =
    process.env['SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN'];
  const privateAccessToken =
    process.env['SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN'];

  if (storeDomain != null) {
    storefrontEnv.SHOPIFY_STORE_DOMAIN = storeDomain;
  }
  if (apiVersion != null) {
    storefrontEnv.SHOPIFY_STOREFRONT_API_VERSION = apiVersion;
  }
  if (accessToken != null) {
    storefrontEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN = accessToken;
  }
  if (publicAccessToken != null) {
    storefrontEnv.SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN = publicAccessToken;
  }
  if (privateAccessToken != null) {
    storefrontEnv.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN =
      privateAccessToken;
  }

  cachedStorefrontConfig = parseStorefrontConfig(storefrontEnv);

  if (
    cachedStorefrontConfig.privateAccessToken == null &&
    cachedStorefrontConfig.publicAccessToken != null &&
    !hasWarnedPublicTokenFallback
  ) {
    hasWarnedPublicTokenFallback = true;
    logger.warn(
      '[env] Shopify Storefront client is using public token fallback. Set SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN for server-to-server usage.',
    );
  }

  return cachedStorefrontConfig;
};

export { DEFAULT_DATABASE_URL };
