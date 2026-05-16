import { mockCatalog } from '@/features/catalog/data/mock-catalog';

import type { MockProduct } from '@/features/catalog/model/schemas';

const productById = new Map(
  mockCatalog.products.map((product) => [product.id, product]),
);

export function getCatalogProducts(): MockProduct[] {
  return mockCatalog.products;
}

export function getCatalogProductById(
  productId: string,
): MockProduct | undefined {
  return productById.get(productId);
}

export function getCatalogProductBySlug(slug: string): MockProduct | undefined {
  return mockCatalog.products.find((product) => product.slug === slug);
}

export function getCollectionProducts(collectionId: string): MockProduct[] {
  const collection = mockCatalog.collections.find(
    (item) => item.id === collectionId,
  );
  if (collection == null) {
    return [];
  }

  return collection.productIds.flatMap((productId) => {
    const product = productById.get(productId);
    return product == null ? [] : [product];
  });
}
