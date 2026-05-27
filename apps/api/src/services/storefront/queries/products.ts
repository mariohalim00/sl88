import { z } from 'zod';
import { runStorefrontOperation } from '../client.js';
import { storefrontProductsResponseSchema } from '../schemas.js';

const LIST_PRODUCTS_QUERY = /* GraphQL */ `
  query ListProducts($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: UPDATED_AT, reverse: true) {
      edges {
        cursor
        node {
          id
          handle
          title
          availableForSale
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
          availableForSale: z.boolean(),
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
