import {
  storefrontCartResponseSchema,
  storefrontProductDetailResponseSchema,
  storefrontProductsResponseSchema,
} from './schemas.js';

export function mapProductsList(raw: {
  products: {
    edges: Array<{
      node: {
        id: string;
        handle: string;
        title: string;
        availableForSale: boolean;
        featuredImage: { url: string } | null;
        priceRange: {
          minVariantPrice: { amount: string; currencyCode: string };
          maxVariantPrice: { amount: string; currencyCode: string };
        };
      };
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}) {
  return storefrontProductsResponseSchema.parse({
    products: raw.products.edges.map((edge) => ({
      id: edge.node.id,
      handle: edge.node.handle,
      title: edge.node.title,
      featuredImageUrl: edge.node.featuredImage?.url ?? null,
      priceMin: edge.node.priceRange.minVariantPrice.amount,
      priceMax: edge.node.priceRange.maxVariantPrice.amount,
      currencyCode: edge.node.priceRange.minVariantPrice.currencyCode,
      availableForSale: edge.node.availableForSale,
    })),
    pageInfo: raw.products.pageInfo,
  });
}

export function mapProductDetail(raw: {
  product: {
    id: string;
    handle: string;
    title: string;
    descriptionHtml: string;
    images: { nodes: Array<{ url: string; altText: string | null }> };
    variants: {
      nodes: Array<{
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
        selectedOptions: Array<{ name: string; value: string }>;
      }>;
    };
    selectedOrFirstAvailableVariant: { id: string } | null;
  };
}) {
  return storefrontProductDetailResponseSchema.parse({
    product: {
      id: raw.product.id,
      handle: raw.product.handle,
      title: raw.product.title,
      descriptionHtml: raw.product.descriptionHtml,
      images: raw.product.images.nodes.map((image) => ({
        url: image.url,
        altText: image.altText ?? undefined,
      })),
      variants: raw.product.variants.nodes.map((variant) => ({
        id: variant.id,
        title: variant.title,
        availableForSale: variant.availableForSale,
        price: variant.price.amount,
        currencyCode: variant.price.currencyCode,
        selectedOptions: variant.selectedOptions,
      })),
      selectedOrFirstAvailableVariantId:
        raw.product.selectedOrFirstAvailableVariant?.id ?? null,
    },
  });
}

export function mapCart(raw: {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
    totalTaxAmount: { amount: string; currencyCode: string } | null;
  };
  lines: {
    nodes: Array<{
      id: string;
      quantity: number;
      merchandise: {
        id: string;
        title: string;
        image: { url: string } | null;
        product: { title: string };
        price: { amount: string; currencyCode: string };
      };
      cost: {
        totalAmount: { amount: string; currencyCode: string };
      };
    }>;
  };
}) {
  return storefrontCartResponseSchema.parse({
    cart: {
      id: raw.id,
      checkoutUrl: raw.checkoutUrl,
      totalQuantity: raw.totalQuantity,
      cost: {
        subtotalAmount: raw.cost.subtotalAmount.amount,
        totalAmount: raw.cost.totalAmount.amount,
        totalTaxAmount: raw.cost.totalTaxAmount?.amount ?? null,
        currencyCode: raw.cost.totalAmount.currencyCode,
      },
      lines: raw.lines.nodes.map((line) => ({
        id: line.id,
        quantity: line.quantity,
        merchandiseId: line.merchandise.id,
        title: `${line.merchandise.product.title} - ${line.merchandise.title}`,
        imageUrl: line.merchandise.image?.url ?? null,
        unitAmount: line.merchandise.price.amount,
        lineAmount: line.cost.totalAmount.amount,
        currencyCode: line.cost.totalAmount.currencyCode,
      })),
    },
  });
}
