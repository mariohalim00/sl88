import { z } from 'zod';
import { runCustomerOperation } from './client.js';

// Output DTOs mirror the previous Storefront API customer shapes so the web
// app's zod schemas and components keep working unchanged.

export type CustomerAddressDto = {
  id: string;
  address1: string;
  address2: string | null;
  city: string;
  province: string | null;
  zip: string;
  country: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  company: string | null;
};

export type CustomerOrderLineItemDto = {
  title: string;
  quantity: number;
  variantTitle: string | null;
  imageUrl: string | null;
  unitPrice: string;
  currencyCode: string;
};

export type CustomerOrderDto = {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string | null;
  fulfillmentStatus: string;
  financialStatus: string | null;
  totalPrice: string;
  totalShippingPrice: string;
  subtotalPrice: string;
  totalTax: string | null;
  currencyCode: string;
  lineItems: CustomerOrderLineItemDto[];
};

export type CustomerDto = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  displayName: string;
  createdAt: string;
  defaultAddress: CustomerAddressDto | null;
  addresses: CustomerAddressDto[];
  orders: CustomerOrderDto[];
};

// --- GraphQL ---

const CUSTOMER_FRAGMENT = /* GraphQL */ `
  fragment CustomerFields on Customer {
    id
    firstName
    lastName
    displayName
    creationDate
    emailAddress {
      emailAddress
    }
    phoneNumber {
      phoneNumber
    }
    defaultAddress {
      ...AddressFields
    }
    addresses(first: 10) {
      nodes {
        ...AddressFields
      }
    }
    orders(first: 50, reverse: true) {
      nodes {
        ...OrderFields
      }
    }
  }
`;

const ADDRESS_FRAGMENT = /* GraphQL */ `
  fragment AddressFields on CustomerAddress {
    id
    address1
    address2
    city
    province
    zoneCode
    country
    zip
    phoneNumber
    firstName
    lastName
    company
  }
`;

const ORDER_FRAGMENT = /* GraphQL */ `
  fragment OrderFields on Order {
    id
    name
    number
    processedAt
    fulfillmentStatus
    financialStatus
    currencyCode
    subtotal {
      amount
    }
    totalPrice {
      amount
    }
    totalShipping {
      amount
    }
    totalTax {
      amount
    }
    lineItems(first: 50) {
      nodes {
        title
        quantity
        variantTitle
        image {
          url
        }
        price {
          amount
        }
      }
    }
  }
`;

export const CUSTOMER_QUERY = /* GraphQL */ `
  query Customer {
    customer {
      ...CustomerFields
    }
  }
  ${CUSTOMER_FRAGMENT}
  ${ADDRESS_FRAGMENT}
  ${ORDER_FRAGMENT}
`;

const CUSTOMER_UPDATE_MUTATION = /* GraphQL */ `
  mutation CustomerUpdate($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      userErrors {
        code
        field
        message
      }
    }
  }
`;

const ADDRESS_CREATE_MUTATION = /* GraphQL */ `
  mutation CustomerAddressCreate(
    $address: CustomerAddressInput!
    $defaultAddress: Boolean
  ) {
    customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
      customerAddress {
        ...AddressFields
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${ADDRESS_FRAGMENT}
`;

const ADDRESS_UPDATE_MUTATION = /* GraphQL */ `
  mutation CustomerAddressUpdate(
    $addressId: ID!
    $address: CustomerAddressInput!
  ) {
    customerAddressUpdate(addressId: $addressId, address: $address) {
      customerAddress {
        ...AddressFields
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${ADDRESS_FRAGMENT}
`;

const ADDRESS_DELETE_MUTATION = /* GraphQL */ `
  mutation CustomerAddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors {
        code
        field
        message
      }
    }
  }
`;

// --- Mapping ---

const addressRawSchema = z.object({
  id: z.string(),
  address1: z.string().nullable(),
  address2: z.string().nullable(),
  city: z.string().nullable(),
  province: z.string().nullable(),
  zoneCode: z.string().nullable(),
  country: z.string().nullable(),
  zip: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  company: z.string().nullable(),
});

function mapAddress(raw: z.infer<typeof addressRawSchema>): CustomerAddressDto {
  return {
    id: raw.id,
    address1: raw.address1 ?? '',
    address2: raw.address2,
    city: raw.city ?? '',
    province: raw.province ?? raw.zoneCode,
    zip: raw.zip ?? '',
    country: raw.country ?? '',
    phone: raw.phoneNumber,
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    company: raw.company,
  };
}

const moneySchema = z.object({ amount: z.string() });

const lineItemRawSchema = z.object({
  title: z.string(),
  quantity: z.number(),
  variantTitle: z.string().nullable(),
  image: z.object({ url: z.string() }).nullable(),
  price: moneySchema.nullable(),
});

const orderRawSchema = z.object({
  id: z.string(),
  name: z.string(),
  number: z.number(),
  processedAt: z.string().nullable(),
  fulfillmentStatus: z.string(),
  financialStatus: z.string().nullable(),
  currencyCode: z.string(),
  subtotal: moneySchema.nullable(),
  totalPrice: moneySchema,
  totalShipping: moneySchema.nullable(),
  totalTax: moneySchema.nullable(),
  lineItems: z.object({ nodes: z.array(lineItemRawSchema) }),
});

function mapOrder(raw: z.infer<typeof orderRawSchema>): CustomerOrderDto {
  return {
    id: raw.id,
    name: raw.name,
    orderNumber: raw.number,
    processedAt: raw.processedAt,
    fulfillmentStatus: raw.fulfillmentStatus,
    financialStatus: raw.financialStatus,
    totalPrice: raw.totalPrice.amount,
    totalShippingPrice: raw.totalShipping?.amount ?? '0',
    subtotalPrice: raw.subtotal?.amount ?? raw.totalPrice.amount,
    totalTax: raw.totalTax?.amount ?? null,
    currencyCode: raw.currencyCode,
    lineItems: raw.lineItems.nodes.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      variantTitle: item.variantTitle,
      imageUrl: item.image?.url ?? null,
      unitPrice: item.price?.amount ?? '0',
      currencyCode: raw.currencyCode,
    })),
  };
}

const customerRawSchema = z.object({
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  displayName: z.string(),
  creationDate: z.string(),
  emailAddress: z.object({ emailAddress: z.string().nullable() }).nullable(),
  phoneNumber: z.object({ phoneNumber: z.string().nullable() }).nullable(),
  defaultAddress: addressRawSchema.nullable(),
  addresses: z.object({ nodes: z.array(addressRawSchema) }),
  orders: z.object({ nodes: z.array(orderRawSchema) }),
});

export function mapCustomer(
  raw: z.infer<typeof customerRawSchema>,
): CustomerDto {
  return {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.emailAddress?.emailAddress ?? '',
    phone: raw.phoneNumber?.phoneNumber ?? null,
    displayName: raw.displayName,
    createdAt: raw.creationDate,
    defaultAddress: raw.defaultAddress ? mapAddress(raw.defaultAddress) : null,
    addresses: raw.addresses.nodes.map(mapAddress),
    orders: raw.orders.nodes.map(mapOrder),
  };
}

const customerResponseSchema = z.object({
  customer: customerRawSchema.nullable(),
});

const userErrorsSchema = z.object({
  userErrors: z.array(
    z.object({
      code: z.string().optional(),
      field: z.array(z.string()).nullable().optional(),
      message: z.string(),
    }),
  ),
});

const addressResponseSchema = z.object({
  customerAddress: addressRawSchema.nullable(),
  ...userErrorsSchema.shape,
});

const addressDeleteResponseSchema = z.object({
  deletedAddressId: z.string().nullable(),
  ...userErrorsSchema.shape,
});

export function parseCustomer(data: Record<string, unknown>): CustomerDto {
  const parsed = customerResponseSchema.parse(data);
  if (parsed.customer == null) {
    throw new Error('Customer not found');
  }
  return mapCustomer(parsed.customer);
}

export function parseNullableCustomer(
  data: Record<string, unknown>,
): CustomerDto | null {
  const parsed = customerResponseSchema.parse(data);
  return parsed.customer == null ? null : mapCustomer(parsed.customer);
}

function assertNoUserErrors(
  errors: Array<{ message: string }>,
  message: string,
) {
  if (errors.length > 0) {
    throw new Error(`${message}: ${errors.map((e) => e.message).join('; ')}`);
  }
}

// --- Public operations ---

export function getCustomer(sessionId: string): Promise<CustomerDto> {
  return runCustomerOperation({
    sessionId,
    query: CUSTOMER_QUERY,
    parse: parseCustomer,
  });
}

export async function updateCustomer(
  sessionId: string,
  input: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  },
): Promise<void> {
  const apiInput: Record<string, unknown> = {};
  if (input.firstName != null) apiInput.firstName = input.firstName;
  if (input.lastName != null) apiInput.lastName = input.lastName;
  if (input.email != null)
    apiInput.emailAddress = { emailAddress: input.email };
  if (input.phone != null) apiInput.phoneNumber = { phoneNumber: input.phone };

  const data = await runCustomerOperation({
    sessionId,
    query: CUSTOMER_UPDATE_MUTATION,
    variables: { input: apiInput },
    parse: (d) => userErrorsSchema.parse(d).userErrors,
  });
  assertNoUserErrors(data, 'Customer update failed');
}

function toAddressInput(address: Record<string, string | undefined>) {
  const input: Record<string, unknown> = {};
  if (address.address1 != null) input.address1 = address.address1;
  if (address.address2 != null) input.address2 = address.address2;
  if (address.city != null) input.city = address.city;
  if (address.zip != null) input.zip = address.zip;
  if (address.province != null) input.zoneCode = address.province;
  if (address.country != null) input.territoryCode = address.country;
  if (address.phone != null) input.phoneNumber = address.phone;
  if (address.firstName != null) input.firstName = address.firstName;
  if (address.lastName != null) input.lastName = address.lastName;
  if (address.company != null) input.company = address.company;
  return input;
}

export async function createCustomerAddress(
  sessionId: string,
  address: Record<string, string | undefined>,
): Promise<CustomerAddressDto> {
  const data = await runCustomerOperation({
    sessionId,
    query: ADDRESS_CREATE_MUTATION,
    variables: { address: toAddressInput(address) },
    parse: (d) => addressResponseSchema.parse(d),
  });

  assertNoUserErrors(data.userErrors, 'Address creation failed');
  if (data.customerAddress == null) {
    throw new Error('Address creation failed: no address returned');
  }
  return mapAddress(data.customerAddress);
}

export async function updateCustomerAddress(
  sessionId: string,
  addressId: string,
  address: Record<string, string | undefined>,
): Promise<CustomerAddressDto> {
  const data = await runCustomerOperation({
    sessionId,
    query: ADDRESS_UPDATE_MUTATION,
    variables: { addressId, address: toAddressInput(address) },
    parse: (d) => addressResponseSchema.parse(d),
  });

  assertNoUserErrors(data.userErrors, 'Address update failed');
  if (data.customerAddress == null) {
    throw new Error('Address update failed: no address returned');
  }
  return mapAddress(data.customerAddress);
}

export async function deleteCustomerAddress(
  sessionId: string,
  addressId: string,
): Promise<void> {
  const data = await runCustomerOperation({
    sessionId,
    query: ADDRESS_DELETE_MUTATION,
    variables: { addressId },
    parse: (d) => addressDeleteResponseSchema.parse(d),
  });

  assertNoUserErrors(data.userErrors, 'Address deletion failed');
}
