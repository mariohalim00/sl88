import {
  storefrontAddressSchema,
  storefrontCustomerSchema,
  storefrontCustomerLoginResponseSchema,
  storefrontCustomerRegisterResponseSchema,
  storefrontCustomerUpdateResponseSchema,
  storefrontOrderSchema,
  type StorefrontAddress,
  type StorefrontCustomer,
  type StorefrontOrder,
} from '../schemas/customer.js';

export function mapAddress(raw: {
  id: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  country: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
}): StorefrontAddress {
  return storefrontAddressSchema.parse({
    id: raw.id,
    address1: raw.address1 ?? '',
    address2: raw.address2,
    city: raw.city ?? '',
    province: raw.province,
    zip: raw.zip ?? '',
    country: raw.country ?? '',
    phone: raw.phone,
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    company: raw.company,
  });
}

function mapOrder(raw: {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string | null;
  fulfillmentStatus: string;
  financialStatus: string | null;
  totalPrice: { amount: string; currencyCode: string };
  totalShippingPrice: { amount: string; currencyCode: string };
  subtotalPrice: { amount: string; currencyCode: string };
  totalTax: { amount: string; currencyCode: string } | null;
  lineItems: {
    nodes: Array<{
      title: string;
      quantity: number;
      variant: {
        id: string;
        title: string;
        image: { url: string } | null;
        price: { amount: string; currencyCode: string };
      } | null;
    }>;
  };
}): StorefrontOrder {
  return storefrontOrderSchema.parse({
    id: raw.id,
    name: raw.name,
    orderNumber: raw.orderNumber,
    processedAt: raw.processedAt,
    fulfillmentStatus: raw.fulfillmentStatus,
    financialStatus: raw.financialStatus,
    totalPrice: raw.totalPrice.amount,
    totalShippingPrice: raw.totalShippingPrice.amount,
    subtotalPrice: raw.subtotalPrice.amount,
    totalTax: raw.totalTax?.amount ?? null,
    currencyCode: raw.totalPrice.currencyCode,
    lineItems: raw.lineItems.nodes.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      variantTitle: item.variant?.title ?? null,
      imageUrl: item.variant?.image?.url ?? null,
      unitPrice: item.variant?.price.amount ?? '0',
      currencyCode:
        item.variant?.price.currencyCode ?? raw.totalPrice.currencyCode,
    })),
  });
}

export function mapCustomer(raw: {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  displayName: string;
  createdAt: string;
  defaultAddress: {
    id: string;
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    zip: string | null;
    country: string | null;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
  } | null;
  addresses: {
    nodes: Array<{
      id: string;
      address1: string | null;
      address2: string | null;
      city: string | null;
      province: string | null;
      zip: string | null;
      country: string | null;
      phone: string | null;
      firstName: string | null;
      lastName: string | null;
      company: string | null;
    }>;
  };
  orders: {
    nodes: Array<{
      id: string;
      name: string;
      orderNumber: number;
      processedAt: string | null;
      fulfillmentStatus: string;
      financialStatus: string | null;
      totalPrice: { amount: string; currencyCode: string };
      totalShippingPrice: { amount: string; currencyCode: string };
      subtotalPrice: { amount: string; currencyCode: string };
      totalTax: { amount: string; currencyCode: string } | null;
      lineItems: {
        nodes: Array<{
          title: string;
          quantity: number;
          variant: {
            id: string;
            title: string;
            image: { url: string } | null;
            price: { amount: string; currencyCode: string };
          } | null;
        }>;
      };
    }>;
  };
}): StorefrontCustomer {
  return storefrontCustomerSchema.parse({
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.email,
    phone: raw.phone,
    displayName: raw.displayName,
    createdAt: raw.createdAt,
    defaultAddress: raw.defaultAddress ? mapAddress(raw.defaultAddress) : null,
    addresses: raw.addresses.nodes.map(mapAddress),
    orders: raw.orders.nodes.map(mapOrder),
  });
}

export function mapLoginResponse(raw: {
  customerAccessTokenCreate: {
    customerAccessToken: { accessToken: string; expiresAt: string } | null;
    customerUserErrors: Array<{ message: string }>;
  };
}) {
  return storefrontCustomerLoginResponseSchema.parse({
    customerAccessToken: raw.customerAccessTokenCreate.customerAccessToken
      ? {
          accessToken:
            raw.customerAccessTokenCreate.customerAccessToken.accessToken,
          expiresAt:
            raw.customerAccessTokenCreate.customerAccessToken.expiresAt,
        }
      : null,
  });
}

export function mapRegisterResponse(raw: {
  customerCreate: {
    customer: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string;
      phone: string | null;
      displayName: string;
      createdAt: string;
    } | null;
    customerUserErrors: Array<{ message: string }>;
  };
}) {
  return storefrontCustomerRegisterResponseSchema.parse({
    customer: raw.customerCreate.customer,
  });
}

export function mapCustomerUpdateResponse(raw: {
  customerUpdate: {
    customer: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string;
      phone: string | null;
      displayName: string;
    } | null;
    customerUserErrors: Array<{ message: string }>;
  };
}) {
  return storefrontCustomerUpdateResponseSchema.parse({
    customer: raw.customerUpdate.customer,
  });
}
