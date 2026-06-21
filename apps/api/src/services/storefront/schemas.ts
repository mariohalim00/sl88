import { z } from 'zod';

export const storefrontMoneySchema = z.object({
  amount: z.string().min(1),
  currencyCode: z.string().min(1),
});

export const storefrontSelectedOptionSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

export const storefrontProductSummarySchema = z.object({
  id: z.string().min(1),
  handle: z.string().min(1),
  title: z.string().min(1),
  productType: z.string(),
  tags: z.array(z.string()),
  selectedOrFirstAvailableVariantId: z.string().nullable(),
  featuredImageUrl: z.string().url().nullable(),
  priceMin: z.string().min(1),
  priceMax: z.string().min(1),
  currencyCode: z.string().min(1),
  availableForSale: z.boolean(),
});

export const storefrontProductDetailSchema = z.object({
  id: z.string().min(1),
  handle: z.string().min(1),
  title: z.string().min(1),
  productType: z.string(),
  descriptionHtml: z.string(),
  images: z.array(
    z.object({
      url: z.string().url(),
      altText: z.string().optional(),
    }),
  ),
  variants: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      availableForSale: z.boolean(),
      price: z.string().min(1),
      currencyCode: z.string().min(1),
      imageUrl: z.string().url().nullable(),
      selectedOptions: z.array(storefrontSelectedOptionSchema),
    }),
  ),
  selectedOrFirstAvailableVariantId: z.string().nullable(),
});

export const storefrontProductsResponseSchema = z.object({
  products: z.array(storefrontProductSummarySchema),
  pageInfo: z.object({
    hasNextPage: z.boolean(),
    endCursor: z.string().nullable(),
  }),
});

export const storefrontProductDetailResponseSchema = z.object({
  product: storefrontProductDetailSchema,
});

export const storefrontCartLineInputSchema = z.object({
  merchandiseId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const storefrontCartLineUpdateInputSchema = z.object({
  id: z.string().min(1),
  quantity: z.number().int().nonnegative(),
});

export const storefrontCartSchema = z.object({
  id: z.string().min(1),
  checkoutUrl: z.string().url(),
  totalQuantity: z.number().int().nonnegative(),
  cost: z.object({
    subtotalAmount: z.string().min(1),
    totalAmount: z.string().min(1),
    totalTaxAmount: z.string().nullable(),
    currencyCode: z.string().min(1),
  }),
  lines: z.array(
    z.object({
      id: z.string().min(1),
      quantity: z.number().int().positive(),
      merchandiseId: z.string().min(1),
      title: z.string().min(1),
      imageUrl: z.string().url().nullable(),
      unitAmount: z.string().min(1),
      lineAmount: z.string().min(1),
      currencyCode: z.string().min(1),
    }),
  ),
});

export const storefrontCartResponseSchema = z.object({
  cart: storefrontCartSchema,
});

export const storefrontCheckoutResponseSchema = z.object({
  checkoutUrl: z.string().url(),
  mode: z.literal('hosted_redirect'),
});

export type StorefrontProductsResponse = z.infer<
  typeof storefrontProductsResponseSchema
>;
export type StorefrontProductDetailResponse = z.infer<
  typeof storefrontProductDetailResponseSchema
>;
export type StorefrontCartResponse = z.infer<
  typeof storefrontCartResponseSchema
>;
export type StorefrontCheckoutResponse = z.infer<
  typeof storefrontCheckoutResponseSchema
>;
