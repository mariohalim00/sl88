import { mockProducts } from '../data/mock-products';
import { productListSchema, type Product } from '../types';

const MOCK_RESPONSE_DELAY_MS = 240;

export async function listProducts(): Promise<Product[]> {
  const payload = productListSchema.parse(mockProducts);

  return new Promise((resolve) => {
    setTimeout(() => resolve(payload), MOCK_RESPONSE_DELAY_MS);
  });
}
