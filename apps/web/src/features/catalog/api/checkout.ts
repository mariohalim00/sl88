import {
  storefrontCheckoutResponseSchema,
  type StorefrontCheckoutResponse,
} from '../types/storefront';
import { storefrontApi } from '@/treaty/client';

function unwrapTreatyData<TData>(
  response: { data: TData | null; error: { value: unknown } | null },
): TData {
  if (response.error != null || response.data == null) {
    throw new Error('Storefront checkout request failed');
  }

  return response.data;
}

export async function createCheckoutRedirect(
  cartId: string,
): Promise<StorefrontCheckoutResponse> {
  const response = await storefrontApi.cart({ cartId }).checkout.post({});
  return storefrontCheckoutResponseSchema.parse(unwrapTreatyData(response));
}
