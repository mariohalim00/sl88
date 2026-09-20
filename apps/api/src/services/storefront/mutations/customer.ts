import { runStorefrontOperation } from '../client.js';
import { StorefrontValidationError } from '../errors.js';
import { mapAddress, mapCustomerUpdateResponse } from '../mappers/customer.js';
import {
  customerAddressCreateRawSchema,
  customerAddressDeleteRawSchema,
  customerAddressUpdateRawSchema,
  customerUpdateRawSchema,
} from '../schemas/customer.js';

const CUSTOMER_UPDATE_MUTATION = /* GraphQL */ `
  mutation CustomerUpdate(
    $customerAccessToken: String!
    $customer: CustomerUpdateInput!
  ) {
    customerUpdate(
      customerAccessToken: $customerAccessToken
      customer: $customer
    ) {
      customer {
        id
        firstName
        lastName
        email
        phone
        displayName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ADDRESS_CREATE_MUTATION = /* GraphQL */ `
  mutation CustomerAddressCreate(
    $customerAccessToken: String!
    $address: MailingAddressInput!
  ) {
    customerAddressCreate(
      customerAccessToken: $customerAccessToken
      address: $address
    ) {
      customerAddress {
        id
        address1
        address2
        city
        province
        zip
        country
        phone
        firstName
        lastName
        company
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ADDRESS_UPDATE_MUTATION = /* GraphQL */ `
  mutation CustomerAddressUpdate(
    $customerAccessToken: String!
    $id: ID!
    $address: MailingAddressInput!
  ) {
    customerAddressUpdate(
      customerAccessToken: $customerAccessToken
      id: $id
      address: $address
    ) {
      customerAddress {
        id
        address1
        address2
        city
        province
        zip
        country
        phone
        firstName
        lastName
        company
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ADDRESS_DELETE_MUTATION = /* GraphQL */ `
  mutation CustomerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export type CustomerUpdateInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type MailingAddressInput = {
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zip?: string;
  country?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
};

export async function updateStorefrontCustomer(
  accessToken: string,
  input: CustomerUpdateInput,
) {
  const raw = await runStorefrontOperation({
    query: CUSTOMER_UPDATE_MUTATION,
    variables: { customerAccessToken: accessToken, customer: input },
    schema: customerUpdateRawSchema,
  });

  const errors = raw.customerUpdate.customerUserErrors;
  if (errors.length > 0) {
    throw new StorefrontValidationError('Customer update failed', {
      detail: errors.map((e) => e.message).join('; '),
    });
  }

  return mapCustomerUpdateResponse(raw);
}

export async function createStorefrontCustomerAddress(
  accessToken: string,
  address: MailingAddressInput,
) {
  const raw = await runStorefrontOperation({
    query: CUSTOMER_ADDRESS_CREATE_MUTATION,
    variables: { customerAccessToken: accessToken, address },
    schema: customerAddressCreateRawSchema,
  });

  const errors = raw.customerAddressCreate.customerUserErrors;
  if (errors.length > 0) {
    throw new StorefrontValidationError('Address creation failed', {
      detail: errors.map((e) => e.message).join('; '),
    });
  }

  const addressResult = raw.customerAddressCreate.customerAddress;

  if (addressResult == null) {
    throw new StorefrontValidationError('Address creation failed', {
      detail: 'No address returned',
    });
  }

  return mapAddress(addressResult);
}

export async function updateStorefrontCustomerAddress(
  accessToken: string,
  addressId: string,
  address: MailingAddressInput,
) {
  const raw = await runStorefrontOperation({
    query: CUSTOMER_ADDRESS_UPDATE_MUTATION,
    variables: { customerAccessToken: accessToken, id: addressId, address },
    schema: customerAddressUpdateRawSchema,
  });

  const errors = raw.customerAddressUpdate.customerUserErrors;
  if (errors.length > 0) {
    throw new StorefrontValidationError('Address update failed', {
      detail: errors.map((e) => e.message).join('; '),
    });
  }

  const addressResult = raw.customerAddressUpdate.customerAddress;

  if (addressResult == null) {
    throw new StorefrontValidationError('Address update failed', {
      detail: 'No address returned',
    });
  }

  return mapAddress(addressResult);
}

export async function deleteStorefrontCustomerAddress(
  accessToken: string,
  addressId: string,
) {
  const raw = await runStorefrontOperation({
    query: CUSTOMER_ADDRESS_DELETE_MUTATION,
    variables: { customerAccessToken: accessToken, id: addressId },
    schema: customerAddressDeleteRawSchema,
  });

  const errors = raw.customerAddressDelete.customerUserErrors;
  if (errors.length > 0) {
    throw new StorefrontValidationError('Address deletion failed', {
      detail: errors.map((e) => e.message).join('; '),
    });
  }
}
