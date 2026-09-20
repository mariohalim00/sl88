import { api } from '@/treaty/client';
import {
  customerAddressSchema,
  customerSchema,
  type Customer,
  type CustomerAddress,
  type CustomerOrder,
} from '../types/customer';

const customerApi = api.api.customer;

function unwrapTreatyData<TData>(response: {
  data: TData | null;
  error: { value: unknown } | null;
}): TData {
  if (response.error != null || response.data == null) {
    const errorValue = response.error?.value as
      | { detail?: string; title?: string; message?: string }
      | undefined;

    const message =
      errorValue?.detail ??
      errorValue?.title ??
      errorValue?.message ??
      'Storefront request failed';

    throw new Error(message);
  }

  return response.data;
}

export async function loginCustomer(
  email: string,
  password: string,
): Promise<Customer> {
  const response = await customerApi.login.post({ email, password });
  const raw = unwrapTreatyData(response);
  return customerSchema.parse(raw);
}

export async function registerCustomer(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<Customer> {
  const response = await customerApi.register.post(input);
  const raw = unwrapTreatyData(response);
  return customerSchema.parse(raw);
}

export async function logoutCustomer(): Promise<void> {
  await customerApi.logout.post();
}

export async function fetchCustomerMe(): Promise<Customer | null> {
  const response = await customerApi.me.get();

  if (response.error != null) {
    const errorValue = response.error.value as
      | { status?: number; detail?: string }
      | undefined;
    const status = errorValue?.status ?? 0;

    if (status === 401 || response.error.status === 401) {
      return null;
    }

    throw new Error(
      (errorValue as { detail?: string })?.detail ?? 'Failed to fetch customer',
    );
  }

  if (response.data == null) {
    return null;
  }

  return customerSchema.parse(response.data);
}

export async function updateCustomerMe(input: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}): Promise<Customer> {
  const response = await customerApi.me.put(input);
  const raw = unwrapTreatyData(response);
  return customerSchema.parse(raw);
}

export async function fetchCustomerAddresses(): Promise<{
  addresses: CustomerAddress[];
  defaultAddress: CustomerAddress | null;
}> {
  const response = await customerApi.addresses.get();
  const raw = unwrapTreatyData(response);
  return {
    addresses: (raw as { addresses: CustomerAddress[] }).addresses.map((a) =>
      customerAddressSchema.parse(a),
    ),
    defaultAddress: (raw as { defaultAddress: CustomerAddress | null }).defaultAddress,
  };
}

export async function createCustomerAddress(
  input: Record<string, string | undefined>,
): Promise<CustomerAddress> {
  const response = await customerApi.addresses.post(input);
  const raw = unwrapTreatyData(response);
  return customerAddressSchema.parse(raw);
}

export async function updateCustomerAddress(
  addressId: string,
  input: Record<string, string | undefined>,
): Promise<CustomerAddress> {
  const response = await customerApi
    .addresses({ id: addressId })
    .put(input);
  const raw = unwrapTreatyData(response);
  return customerAddressSchema.parse(raw);
}

export async function deleteCustomerAddress(
  addressId: string,
): Promise<void> {
  await customerApi.addresses({ id: addressId }).delete();
}
