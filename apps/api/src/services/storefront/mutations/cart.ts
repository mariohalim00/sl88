import { z } from 'zod';
import { runStorefrontOperation } from '../client.js';
import { StorefrontValidationError } from '../errors.js';
import {
  storefrontCartResponseSchema,
  type StorefrontCartResponse,
} from '../schemas.js';

const CART_SELECTION = /* GraphQL */ `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
    totalTaxAmount {
      amount
      currencyCode
    }
  }
  lines(first: 100) {
    nodes {
      id
      quantity
      merchandise {
        ... on ProductVariant {
          id
          title
          image {
            url
          }
          product {
            title
          }
          price {
            amount
            currencyCode
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        ${CART_SELECTION}
      }
      userErrors {
        message
      }
    }
  }
`;

const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_SELECTION}
      }
      userErrors {
        message
      }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_SELECTION}
      }
      userErrors {
        message
      }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ${CART_SELECTION}
      }
      userErrors {
        message
      }
    }
  }
`;

const cartResponseRawSchema = z.object({
  cart: z
    .object({
      id: z.string().min(1),
      checkoutUrl: z.string().url(),
      totalQuantity: z.number().int().nonnegative(),
      cost: z.object({
        subtotalAmount: z.object({
          amount: z.string().min(1),
          currencyCode: z.string().min(1),
        }),
        totalAmount: z.object({
          amount: z.string().min(1),
          currencyCode: z.string().min(1),
        }),
        totalTaxAmount: z
          .object({
            amount: z.string().min(1),
            currencyCode: z.string().min(1),
          })
          .nullable(),
      }),
      lines: z.object({
        nodes: z.array(
          z.object({
            id: z.string().min(1),
            quantity: z.number().int().positive(),
            merchandise: z.object({
              id: z.string().min(1),
              title: z.string().min(1),
              image: z
                .object({
                  url: z.string().url(),
                })
                .nullable(),
              product: z.object({
                title: z.string().min(1),
              }),
              price: z.object({
                amount: z.string().min(1),
                currencyCode: z.string().min(1),
              }),
            }),
            cost: z.object({
              totalAmount: z.object({
                amount: z.string().min(1),
                currencyCode: z.string().min(1),
              }),
            }),
          }),
        ),
      }),
    })
    .nullable(),
  userErrors: z.array(
    z.object({
      message: z.string().min(1),
    }),
  ),
});

const cartMutationRawSchema = z.object({
  cartCreate: cartResponseRawSchema.optional(),
  cartLinesAdd: cartResponseRawSchema.optional(),
  cartLinesUpdate: cartResponseRawSchema.optional(),
  cartLinesRemove: cartResponseRawSchema.optional(),
});

function mapCartResponse(raw: z.infer<typeof cartResponseRawSchema>): StorefrontCartResponse {
  if (raw.userErrors.length > 0) {
    throw new StorefrontValidationError('Storefront cart mutation returned user errors', {
      detail: raw.userErrors.map((item) => item.message).join('; '),
    });
  }

  if (raw.cart == null) {
    throw new StorefrontValidationError('Storefront cart mutation returned empty cart');
  }

  return storefrontCartResponseSchema.parse({
    cart: {
      id: raw.cart.id,
      checkoutUrl: raw.cart.checkoutUrl,
      totalQuantity: raw.cart.totalQuantity,
      cost: {
        subtotalAmount: raw.cart.cost.subtotalAmount.amount,
        totalAmount: raw.cart.cost.totalAmount.amount,
        totalTaxAmount: raw.cart.cost.totalTaxAmount?.amount ?? null,
        currencyCode: raw.cart.cost.totalAmount.currencyCode,
      },
      lines: raw.cart.lines.nodes.map((line) => ({
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

export async function createStorefrontCart(lines: Array<{ merchandiseId: string; quantity: number }>) {
  const raw = await runStorefrontOperation({
    query: CART_CREATE_MUTATION,
    variables: {
      input: {
        lines,
      },
    },
    schema: cartMutationRawSchema,
  });

  if (raw.cartCreate == null) {
    throw new StorefrontValidationError('cartCreate response missing');
  }

  return mapCartResponse(raw.cartCreate);
}

export async function addStorefrontCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
) {
  const raw = await runStorefrontOperation({
    query: CART_LINES_ADD_MUTATION,
    variables: {
      cartId,
      lines,
    },
    schema: cartMutationRawSchema,
  });

  if (raw.cartLinesAdd == null) {
    throw new StorefrontValidationError('cartLinesAdd response missing');
  }

  return mapCartResponse(raw.cartLinesAdd);
}

export async function updateStorefrontCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>,
) {
  const raw = await runStorefrontOperation({
    query: CART_LINES_UPDATE_MUTATION,
    variables: {
      cartId,
      lines,
    },
    schema: cartMutationRawSchema,
  });

  if (raw.cartLinesUpdate == null) {
    throw new StorefrontValidationError('cartLinesUpdate response missing');
  }

  return mapCartResponse(raw.cartLinesUpdate);
}

export async function removeStorefrontCartLines(cartId: string, lineIds: string[]) {
  const raw = await runStorefrontOperation({
    query: CART_LINES_REMOVE_MUTATION,
    variables: {
      cartId,
      lineIds,
    },
    schema: cartMutationRawSchema,
  });

  if (raw.cartLinesRemove == null) {
    throw new StorefrontValidationError('cartLinesRemove response missing');
  }

  return mapCartResponse(raw.cartLinesRemove);
}
