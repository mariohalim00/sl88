import { describe, expect, it } from 'bun:test';
import {
  mapCart,
  mapProductDetail,
  mapProductsList,
} from '../../src/services/storefront/mappers.js';

describe('Storefront schema and mapper coverage', () => {
  it('maps products list payload to storefront response shape', () => {
    const mapped = mapProductsList({
      products: {
        edges: [
          {
            node: {
              id: 'gid://shopify/Product/1',
              handle: 'woven-mat',
              title: 'Woven Mat',
              productType: 'Welcome Mats',
              tags: ['welcome mat', 'jute'],
              availableForSale: true,
              selectedOrFirstAvailableVariant: {
                id: 'gid://shopify/ProductVariant/1',
              },
              featuredImage: { url: 'https://cdn.test/mat.jpg' },
              priceRange: {
                minVariantPrice: { amount: '10.00', currencyCode: 'USD' },
                maxVariantPrice: { amount: '12.00', currencyCode: 'USD' },
              },
            },
          },
        ],
        pageInfo: { hasNextPage: false, endCursor: null },
      },
    });

    expect(mapped.products).toHaveLength(1);
    expect(mapped.products[0]?.title).toBe('Woven Mat');
    expect(mapped.products[0]?.productType).toBe('Welcome Mats');
    expect(mapped.products[0]?.selectedOrFirstAvailableVariantId).toBe(
      'gid://shopify/ProductVariant/1',
    );
  });

  it('maps product detail payload to storefront response shape', () => {
    const mapped = mapProductDetail({
      product: {
        id: 'gid://shopify/Product/1',
        handle: 'woven-mat',
        title: 'Woven Mat',
        productType: 'Welcome Mats',
        descriptionHtml: '<p>Soft</p>',
        images: {
          nodes: [{ url: 'https://cdn.test/mat.jpg', altText: 'Front' }],
        },
        variants: {
          nodes: [
            {
              id: 'gid://shopify/ProductVariant/1',
              title: 'Default',
              availableForSale: true,
              image: null,
              price: { amount: '10.00', currencyCode: 'USD' },
              selectedOptions: [],
            },
          ],
        },
        selectedOrFirstAvailableVariant: {
          id: 'gid://shopify/ProductVariant/1',
        },
      },
    });

    expect(mapped.product.handle).toBe('woven-mat');
    expect(mapped.product.productType).toBe('Welcome Mats');
    expect(mapped.product.variants).toHaveLength(1);
  });

  it('maps cart payload to storefront response shape', () => {
    const mapped = mapCart({
      id: 'gid://shopify/Cart/1',
      checkoutUrl: 'https://shop.test/checkouts/cart-1',
      totalQuantity: 1,
      cost: {
        subtotalAmount: { amount: '10.00', currencyCode: 'USD' },
        totalAmount: { amount: '10.00', currencyCode: 'USD' },
        totalTaxAmount: null,
      },
      lines: {
        nodes: [
          {
            id: 'gid://shopify/CartLine/1',
            quantity: 1,
            merchandise: {
              id: 'gid://shopify/ProductVariant/1',
              title: 'Default',
              image: { url: 'https://cdn.test/mat.jpg' },
              product: { title: 'Woven Mat' },
              price: { amount: '10.00', currencyCode: 'USD' },
            },
            cost: {
              totalAmount: { amount: '10.00', currencyCode: 'USD' },
            },
          },
        ],
      },
    });

    expect(mapped.cart.totalQuantity).toBe(1);
    expect(mapped.cart.lines[0]?.title).toContain('Woven Mat');
  });
});
