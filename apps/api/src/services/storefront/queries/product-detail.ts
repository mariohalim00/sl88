import { z } from 'zod';
import { runStorefrontOperation } from '../client.js';
import { StorefrontNotFoundError } from '../errors.js';
import { storefrontProductDetailResponseSchema } from '../schemas.js';

const PRODUCT_DETAIL_QUERY = /* GraphQL */ `
  query ProductDetail($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      descriptionHtml
      images(first: 8) {
        nodes {
          url
          altText
        }
      }
      variants(first: 20) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
      selectedOrFirstAvailableVariant {
        id
      }
    }
  }
`;

const productDetailRawSchema = z.object({
  product: z
    .object({
      id: z.string().min(1),
      handle: z.string().min(1),
      title: z.string().min(1),
      descriptionHtml: z.string(),
      images: z.object({
        nodes: z.array(
          z.object({
            url: z.string().url(),
            altText: z.string().nullable(),
          }),
        ),
      }),
      variants: z.object({
        nodes: z.array(
          z.object({
            id: z.string().min(1),
            title: z.string().min(1),
            availableForSale: z.boolean(),
            price: z.object({
              amount: z.string().min(1),
              currencyCode: z.string().min(1),
            }),
            selectedOptions: z.array(
              z.object({
                name: z.string().min(1),
                value: z.string().min(1),
              }),
            ),
          }),
        ),
      }),
      selectedOrFirstAvailableVariant: z
        .object({
          id: z.string().min(1),
        })
        .nullable(),
    })
    .nullable(),
});

export async function getStorefrontProductDetail(handle: string) {
  const raw = await runStorefrontOperation({
    query: PRODUCT_DETAIL_QUERY,
    variables: {
      handle,
    },
    schema: productDetailRawSchema,
  });

  if (raw.product == null) {
    throw new StorefrontNotFoundError(`No product found for handle: ${handle}`);
  }

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
