import { z } from 'zod';

// --- Address ---

const storefrontAddressRawSchema = z.object({
  id: z.string().min(1),
  address1: z.string().nullable(),
  address2: z.string().nullable(),
  city: z.string().nullable(),
  province: z.string().nullable(),
  zip: z.string().nullable(),
  country: z.string().nullable(),
  phone: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  company: z.string().nullable(),
});

export const storefrontAddressSchema = z.object({
  id: z.string().min(1),
  address1: z.string(),
  address2: z.string().nullable(),
  city: z.string(),
  province: z.string().nullable(),
  zip: z.string(),
  country: z.string(),
  phone: z.string().nullable(),
  firstName: z.string(),
  lastName: z.string(),
  company: z.string().nullable(),
});

export type StorefrontAddress = z.infer<typeof storefrontAddressSchema>;

// --- Order ---

const storefrontOrderRawSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  orderNumber: z.number().int().positive(),
  processedAt: z.string().nullable(),
  fulfillmentStatus: z.string(),
  financialStatus: z.string().nullable(),
  totalPrice: z.object({
    amount: z.string().min(1),
    currencyCode: z.string().min(1),
  }),
  totalShippingPrice: z.object({
    amount: z.string().min(1),
    currencyCode: z.string().min(1),
  }),
  subtotalPrice: z.object({
    amount: z.string().min(1),
    currencyCode: z.string().min(1),
  }),
  totalTax: z
    .object({
      amount: z.string().min(1),
      currencyCode: z.string().min(1),
    })
    .nullable(),
  lineItems: z.object({
    nodes: z.array(
      z.object({
        title: z.string().min(1),
        quantity: z.number().int().positive(),
        variant: z
          .object({
            id: z.string().min(1),
            title: z.string().min(1),
            image: z.object({ url: z.string().url() }).nullable(),
            price: z.object({
              amount: z.string().min(1),
              currencyCode: z.string().min(1),
            }),
          })
          .nullable(),
      }),
    ),
  }),
});

export const storefrontOrderSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  orderNumber: z.number().int().positive(),
  processedAt: z.string().nullable(),
  fulfillmentStatus: z.string(),
  financialStatus: z.string().nullable(),
  totalPrice: z.string().min(1),
  totalShippingPrice: z.string().min(1),
  subtotalPrice: z.string().min(1),
  totalTax: z.string().nullable(),
  currencyCode: z.string().min(1),
  lineItems: z.array(
    z.object({
      title: z.string().min(1),
      quantity: z.number().int().positive(),
      variantTitle: z.string().nullable(),
      imageUrl: z.string().url().nullable(),
      unitPrice: z.string().min(1),
      currencyCode: z.string().min(1),
    }),
  ),
});

export type StorefrontOrder = z.infer<typeof storefrontOrderSchema>;

// --- Customer ---

const storefrontCustomerRawSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string(),
  phone: z.string().nullable(),
  displayName: z.string(),
  createdAt: z.string(),
  defaultAddress: storefrontAddressRawSchema.nullable(),
  addresses: z.object({
    nodes: z.array(storefrontAddressRawSchema),
  }),
  orders: z.object({
    nodes: z.array(storefrontOrderRawSchema),
  }),
});

export const storefrontCustomerSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string(),
  phone: z.string().nullable(),
  displayName: z.string(),
  createdAt: z.string(),
  defaultAddress: storefrontAddressSchema.nullable(),
  addresses: z.array(storefrontAddressSchema),
  orders: z.array(storefrontOrderSchema),
});

export type StorefrontCustomer = z.infer<typeof storefrontCustomerSchema>;

// --- Auth ---

export const storefrontCustomerAccessTokenSchema = z.object({
  accessToken: z.string().min(1),
  expiresAt: z.string(),
});

export const storefrontCustomerLoginResponseSchema = z.object({
  customerAccessToken: storefrontCustomerAccessTokenSchema,
});

export const storefrontCustomerRegisterResponseSchema = z.object({
  customer: z.object({
    id: z.string().min(1),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string(),
    phone: z.string().nullable(),
    displayName: z.string(),
    createdAt: z.string(),
  }),
});

export const storefrontCustomerUpdateResponseSchema = z.object({
  customer: z.object({
    id: z.string().min(1),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string(),
    phone: z.string().nullable(),
    displayName: z.string(),
  }),
});

export const storefrontAddressMutationResponseSchema = z.object({
  customerAddress: storefrontAddressRawSchema,
  customerUserErrors: z.array(
    z.object({
      code: z.string().optional(),
      field: z.array(z.string()).nullable().optional(),
      message: z.string(),
    }),
  ),
});

export const storefrontAddressDeleteResponseSchema = z.object({
  deletedCustomerAddressId: z.string().nullable(),
  customerUserErrors: z.array(
    z.object({
      code: z.string().optional(),
      field: z.array(z.string()).nullable().optional(),
      message: z.string(),
    }),
  ),
});

// --- Raw query schemas (for runStorefrontOperation) ---

export const customerQueryRawSchema = z.object({
  customer: storefrontCustomerRawSchema.nullable(),
});

export const customerAccessTokenCreateRawSchema = z.object({
  customerAccessTokenCreate: z.object({
    customerAccessToken: z
      .object({
        accessToken: z.string().min(1),
        expiresAt: z.string(),
      })
      .nullable(),
    customerUserErrors: z.array(
      z.object({
        code: z.string().optional(),
        field: z.array(z.string()).nullable().optional(),
        message: z.string(),
      }),
    ),
  }),
});

export const customerCreateRawSchema = z.object({
  customerCreate: z.object({
    customer: z
      .object({
        id: z.string().min(1),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        email: z.string(),
        phone: z.string().nullable(),
        displayName: z.string(),
        createdAt: z.string(),
      })
      .nullable(),
    customerUserErrors: z.array(
      z.object({
        code: z.string().optional(),
        field: z.array(z.string()).nullable().optional(),
        message: z.string(),
      }),
    ),
  }),
});

export const customerRecoverRawSchema = z.object({
  customerRecover: z.object({
    customerUserErrors: z.array(
      z.object({
        code: z.string().optional(),
        field: z.array(z.string()).nullable().optional(),
        message: z.string(),
      }),
    ),
  }),
});

export const customerResetByUrlRawSchema = z.object({
  customerResetByUrl: z.object({
    customerAccessToken: z
      .object({
        accessToken: z.string().min(1),
        expiresAt: z.string(),
      })
      .nullable(),
    customerUserErrors: z.array(
      z.object({
        code: z.string().optional(),
        field: z.array(z.string()).nullable().optional(),
        message: z.string(),
      }),
    ),
  }),
});

export const customerAccessTokenDeleteRawSchema = z.object({
  customerAccessTokenDelete: z.object({
    deletedAccessToken: z.string().nullable(),
    userErrors: z.array(
      z.object({
        field: z.array(z.string()).nullable().optional(),
        message: z.string(),
      }),
    ),
  }),
});

export const customerUpdateRawSchema = z.object({
  customerUpdate: z.object({
    customer: z
      .object({
        id: z.string().min(1),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        email: z.string(),
        phone: z.string().nullable(),
        displayName: z.string(),
      })
      .nullable(),
    customerUserErrors: z.array(
      z.object({
        code: z.string().optional(),
        field: z.array(z.string()).nullable().optional(),
        message: z.string(),
      }),
    ),
  }),
});

export const customerAddressCreateRawSchema = z.object({
  customerAddressCreate: z.object({
    customerAddress: storefrontAddressRawSchema.nullable(),
    customerUserErrors: z.array(
      z.object({
        code: z.string().optional(),
        field: z.array(z.string()).nullable().optional(),
        message: z.string(),
      }),
    ),
  }),
});

export const customerAddressUpdateRawSchema = z.object({
  customerAddressUpdate: z.object({
    customerAddress: storefrontAddressRawSchema.nullable(),
    customerUserErrors: z.array(
      z.object({
        code: z.string().optional(),
        field: z.array(z.string()).nullable().optional(),
        message: z.string(),
      }),
    ),
  }),
});

export const customerAddressDeleteRawSchema = z.object({
  customerAddressDelete: z.object({
    deletedCustomerAddressId: z.string().nullable(),
    customerUserErrors: z.array(
      z.object({
        code: z.string().optional(),
        field: z.array(z.string()).nullable().optional(),
        message: z.string(),
      }),
    ),
  }),
});

export const customerDefaultAddressUpdateRawSchema = z.object({
  customerDefaultAddressUpdate: z.object({
    customer: z
      .object({
        defaultAddress: storefrontAddressRawSchema.nullable(),
      })
      .nullable(),
    customerUserErrors: z.array(
      z.object({
        code: z.string().optional(),
        field: z.array(z.string()).nullable().optional(),
        message: z.string(),
      }),
    ),
  }),
});
