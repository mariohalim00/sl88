import { z } from 'zod';
import { runStorefrontOperation } from '../client.js';
import {
  StorefrontNotFoundError,
  StorefrontValidationError,
} from '../errors.js';
import { storefrontCheckoutResponseSchema } from '../schemas.js';

const CHECKOUT_URL_QUERY = /* GraphQL */ `
  query CartCheckoutUrl($cartId: ID!) {
    cart(id: $cartId) {
      checkoutUrl
    }
  }
`;

const checkoutRawSchema = z.object({
  cart: z
    .object({
      checkoutUrl: z.string().url(),
    })
    .nullable(),
});

export async function getStorefrontCheckoutUrl(cartId: string) {
  const raw = await runStorefrontOperation({
    query: CHECKOUT_URL_QUERY,
    variables: {
      cartId,
    },
    schema: checkoutRawSchema,
  });

  if (raw.cart == null) {
    throw new StorefrontNotFoundError(`Cart not found: ${cartId}`);
  }

  const parsed = storefrontCheckoutResponseSchema.safeParse({
    checkoutUrl: raw.cart.checkoutUrl,
    mode: 'hosted_redirect',
  });

  if (!parsed.success) {
    throw new StorefrontValidationError('Invalid checkout URL payload', {
      detail: parsed.error.message,
    });
  }

  return parsed.data;
}
