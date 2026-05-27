import {
  storefrontCartResponseSchema,
  type StorefrontCart,
} from '../types/storefront';
import { storefrontApi } from '@/treaty/client';

function unwrapTreatyData<TData>(response: {
  data: TData | null;
  error: { value: unknown } | null;
}): TData {
  if (response.error != null || response.data == null) {
    throw new Error('Storefront cart request failed');
  }

  return response.data;
}

export async function createCart(
  lines: Array<{ merchandiseId: string; quantity: number }>,
): Promise<StorefrontCart> {
  const response = await storefrontApi.cart.post({ lines });
  return storefrontCartResponseSchema.parse(unwrapTreatyData(response)).cart;
}

export async function addCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
): Promise<StorefrontCart> {
  const response = await storefrontApi.cart({ cartId }).lines.post({ lines });
  return storefrontCartResponseSchema.parse(unwrapTreatyData(response)).cart;
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>,
): Promise<StorefrontCart> {
  const response = await storefrontApi.cart({ cartId }).lines.patch({ lines });
  return storefrontCartResponseSchema.parse(unwrapTreatyData(response)).cart;
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[],
): Promise<StorefrontCart> {
  const response = await storefrontApi
    .cart({ cartId })
    .lines.delete({ lineIds });
  return storefrontCartResponseSchema.parse(unwrapTreatyData(response)).cart;
}
