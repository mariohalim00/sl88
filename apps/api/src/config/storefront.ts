import { z } from 'zod';

const storefrontConfigSchema = z.object({
  storeDomain: z.string().min(1),
  apiVersion: z.string().min(1),
  publicAccessToken: z.string().min(1).optional(),
  privateAccessToken: z.string().min(1).optional(),
});

const storefrontConfigValidatedSchema = storefrontConfigSchema.refine(
  (value) =>
    value.publicAccessToken != null || value.privateAccessToken != null,
  {
    message:
      'Either SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN or SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN is required',
    path: ['publicAccessToken'],
  },
);

const normalizedStorefrontConfigSchema = storefrontConfigValidatedSchema.transform((value) => ({
  storeDomain: value.storeDomain,
  apiVersion: value.apiVersion,
  publicAccessToken: value.publicAccessToken,
  privateAccessToken: value.privateAccessToken,
}));

export type StorefrontConfig = z.infer<typeof normalizedStorefrontConfigSchema>;

export function parseStorefrontConfig(env: {
  SHOPIFY_STORE_DOMAIN?: string;
  SHOPIFY_STOREFRONT_API_VERSION?: string;
  SHOPIFY_STOREFRONT_ACCESS_TOKEN?: string;
  SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN?: string;
  SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN?: string;
}): StorefrontConfig {
  const result = normalizedStorefrontConfigSchema.safeParse({
    storeDomain: env.SHOPIFY_STORE_DOMAIN,
    apiVersion: env.SHOPIFY_STOREFRONT_API_VERSION,
    // Backward compatibility: legacy single token maps to public token.
    publicAccessToken:
      env.SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN ??
      env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    privateAccessToken: env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN,
  });

  if (result.success) {
    return result.data;
  }

  const errors = result.error.flatten().fieldErrors;
  const messages = Object.entries(errors)
    .flatMap(([field, value]) =>
      value?.map((message) => `${field}: ${message}`),
    )
    .join(', ');

  throw new Error(
    `[env] Invalid Shopify storefront configuration: ${messages || 'unknown error'}`,
  );
}
