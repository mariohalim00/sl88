import {
  storefrontProductDetailResponseSchema,
  storefrontProductsResponseSchema,
  type StorefrontProductDetail,
  type StorefrontProductSummary,
} from '../types/storefront';
import { storefrontApi } from '@/treaty/client';

function unwrapTreatyData<TData>(response: {
  data: TData | null;
  error: { value: unknown } | null;
}): TData {
  if (response.error != null || response.data == null) {
    throw new Error('Storefront request failed');
  }

  return response.data;
}

export async function listProducts(input?: {
  limit?: number;
  cursor?: string;
}): Promise<StorefrontProductSummary[]> {
  const query: { limit?: number; cursor?: string } = {};
  if (input?.limit != null) {
    query.limit = input.limit;
  }
  if (input?.cursor != null) {
    query.cursor = input.cursor;
  }

  const response = await storefrontApi.products.get({
    query,
  });

  const payload = storefrontProductsResponseSchema.parse(
    unwrapTreatyData(response),
  );

  return payload.products;
}

export async function getProductDetail(
  handle: string,
): Promise<StorefrontProductDetail> {
  const response = await storefrontApi.products({ handle }).get();
  const payload = storefrontProductDetailResponseSchema.parse(
    unwrapTreatyData(response),
  );

  return payload.product;
}
