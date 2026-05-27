import { z } from 'zod';
import { runStorefrontOperation } from '../client.js';
import { mapProductsList } from '../mappers.js';

const LIST_PRODUCTS_QUERY = /* GraphQL */ `
  query ListProducts($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: UPDATED_AT, reverse: true) {
      edges {
        cursor
        node {
          id
          handle
          title
          productType
          tags
          availableForSale
          selectedOrFirstAvailableVariant {
            id
          }
          featuredImage {
            url
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const listProductsRawSchema = z.object({
  products: z.object({
    edges: z.array(
      z.object({
        cursor: z.string(),
        node: z.object({
          id: z.string().min(1),
          handle: z.string().min(1),
          title: z.string().min(1),
          productType: z.string(),
          tags: z.array(z.string()),
          availableForSale: z.boolean(),
          selectedOrFirstAvailableVariant: z
            .object({
              id: z.string().min(1),
            })
            .nullable(),
          featuredImage: z
            .object({
              url: z.string().url(),
            })
            .nullable(),
          priceRange: z.object({
            minVariantPrice: z.object({
              amount: z.string().min(1),
              currencyCode: z.string().min(1),
            }),
            maxVariantPrice: z.object({
              amount: z.string().min(1),
              currencyCode: z.string().min(1),
            }),
          }),
        }),
      }),
    ),
    pageInfo: z.object({
      hasNextPage: z.boolean(),
      endCursor: z.string().nullable(),
    }),
  }),
});

export async function listStorefrontProducts(input?: {
  limit?: number;
  cursor?: string;
}) {
  const first = input?.limit ?? 20;
  const after = input?.cursor ?? null;

  const raw = await runStorefrontOperation({
    query: LIST_PRODUCTS_QUERY,
    variables: {
      first,
      after,
    },
    schema: listProductsRawSchema,
  });

  return mapProductsList(raw);
}
