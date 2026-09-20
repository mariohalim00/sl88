import { z } from 'zod';

export const customerAddressSchema = z.object({
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

export const customerOrderLineItemSchema = z.object({
  title: z.string().min(1),
  quantity: z.number().int().positive(),
  variantTitle: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  unitPrice: z.string().min(1),
  currencyCode: z.string().min(1),
});

const isoDateString = z
  .union([z.string(), z.date()])
  .transform((val) => (val instanceof Date ? val.toISOString() : val));

export const customerOrderSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  orderNumber: z.number().int().positive(),
  processedAt: isoDateString.nullable(),
  fulfillmentStatus: z.string(),
  financialStatus: z.string().nullable(),
  totalPrice: z.string().min(1),
  totalShippingPrice: z.string().min(1),
  subtotalPrice: z.string().min(1),
  totalTax: z.string().nullable(),
  currencyCode: z.string().min(1),
  lineItems: z.array(customerOrderLineItemSchema),
});

export const customerSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string(),
  phone: z.string().nullable(),
  displayName: z.string(),
  createdAt: isoDateString,
  defaultAddress: customerAddressSchema.nullable(),
  addresses: z.array(customerAddressSchema),
  orders: z.array(customerOrderSchema),
});

export type CustomerAddress = z.infer<typeof customerAddressSchema>;
export type CustomerOrder = z.infer<typeof customerOrderSchema>;
export type Customer = z.infer<typeof customerSchema>;
