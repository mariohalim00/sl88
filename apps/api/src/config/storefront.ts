import { z } from 'zod';

const storefrontConfigSchema = z.object({
  storeDomain: z.string().min(1),
  apiVersion: z.string().min(1),
  accessToken: z.string().min(1),
});

export type StorefrontConfig = z.infer<typeof storefrontConfigSchema>;

export function parseStorefrontConfig(env: {
  SHOPIFY_STORE_DOMAIN?: string;
  SHOPIFY_STOREFRONT_API_VERSION?: string;
  SHOPIFY_STOREFRONT_ACCESS_TOKEN?: string;
}): StorefrontConfig {
  const result = storefrontConfigSchema.safeParse({
    storeDomain: env.SHOPIFY_STORE_DOMAIN,
    apiVersion: env.SHOPIFY_STOREFRONT_API_VERSION,
    accessToken: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  });

  if (result.success) {
    return result.data;
  }

  const errors = result.error.flatten().fieldErrors;
  const messages = Object.entries(errors)
    .flatMap(([field, value]) => value?.map((message) => `${field}: ${message}`))
    .join(', ');

  throw new Error(
    `[env] Invalid Shopify storefront configuration: ${messages || 'unknown error'}`,
  );
}
