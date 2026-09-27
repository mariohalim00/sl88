import { z } from 'zod';

const customerAccountConfigSchema = z.object({
  storeDomain: z.string().min(1),
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
});

export type CustomerAccountConfig = z.infer<typeof customerAccountConfigSchema>;

let cached: CustomerAccountConfig | null = null;

export function getCustomerAccountConfig(): CustomerAccountConfig {
  if (cached != null) return cached;

  const result = customerAccountConfigSchema.safeParse({
    storeDomain: process.env['SHOPIFY_STORE_DOMAIN'],
    clientId: process.env['SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID'],
    clientSecret: process.env['SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET'],
  });

  if (!result.success) {
    const messages = z.treeifyError(result.error);
    throw new Error(
      `[env] SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID and SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET are required (${messages.errors.join(' ,')})`,
    );
  }

  cached = result.data;
  return cached;
}
