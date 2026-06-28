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

function buildCheckoutUrlWithReturnTargets(
  checkoutUrl: string,
  options?: {
    successUrl?: string;
    cancelUrl?: string;
  },
) {
  const url = new URL(checkoutUrl);

  if (options?.successUrl != null) {
    url.searchParams.set('return_to', options.successUrl);
    url.searchParams.set('return_url', options.successUrl);
    url.searchParams.set('continue_shopping_url', options.successUrl);
    url.searchParams.set('checkout[return_url]', options.successUrl);
  }

  if (options?.cancelUrl != null) {
    url.searchParams.set('cancel_url', options.cancelUrl);
    url.searchParams.set('checkout[cancel_url]', options.cancelUrl);
  }

  return url.toString();
}

export async function getStorefrontCheckoutUrl(
  cartId: string,
  options?: {
    successUrl?: string;
    cancelUrl?: string;
  },
) {
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
    checkoutUrl: buildCheckoutUrlWithReturnTargets(
      raw.cart.checkoutUrl,
      options,
    ),
    mode: 'hosted_redirect',
  });

  if (!parsed.success) {
    throw new StorefrontValidationError('Invalid checkout URL payload', {
      detail: parsed.error.message,
    });
  }

  return parsed.data;
}
