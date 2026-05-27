import { z } from 'zod';
import { parseStorefrontConfig, type StorefrontConfig } from '../config/storefront.js';

const DEFAULT_DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/sl88_dev';

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

export const env = runtimeResult.data;

let cachedStorefrontConfig: StorefrontConfig | null = null;

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

export const getStorefrontConfig = (): StorefrontConfig => {
  if (cachedStorefrontConfig != null) {
    return cachedStorefrontConfig;
  }

  const storefrontEnv: {
    SHOPIFY_STORE_DOMAIN?: string;
    SHOPIFY_STOREFRONT_API_VERSION?: string;
    SHOPIFY_STOREFRONT_ACCESS_TOKEN?: string;
  } = {};

  const storeDomain = process.env['SHOPIFY_STORE_DOMAIN'];
  const apiVersion = process.env['SHOPIFY_STOREFRONT_API_VERSION'];
  const accessToken = process.env['SHOPIFY_STOREFRONT_ACCESS_TOKEN'];

  if (storeDomain != null) {
    storefrontEnv.SHOPIFY_STORE_DOMAIN = storeDomain;
  }
  if (apiVersion != null) {
    storefrontEnv.SHOPIFY_STOREFRONT_API_VERSION = apiVersion;
  }
  if (accessToken != null) {
    storefrontEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN = accessToken;
  }

  cachedStorefrontConfig = parseStorefrontConfig(storefrontEnv);
  return cachedStorefrontConfig;
};

export { DEFAULT_DATABASE_URL };
