import { z } from 'zod';
import { runStorefrontOperation } from '../client.js';
import { StorefrontNotFoundError } from '../errors.js';
import { mapProductDetail } from '../mappers.js';

const PRODUCT_DETAIL_QUERY = /* GraphQL */ `
  query ProductDetail($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      productType
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
          image {
            url
            altText
          }
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
      productType: z.string(),
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
            image: z
              .object({
                url: z.string().url(),
                altText: z.string().nullable(),
              })
              .nullable(),
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

  const product = raw.product;
  return mapProductDetail({ product });
}
