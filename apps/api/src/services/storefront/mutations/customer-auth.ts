import { runStorefrontOperation } from '../client.js';
import { StorefrontValidationError } from '../errors.js';
import { mapLoginResponse, mapRegisterResponse } from '../mappers/customer.js';
import {
  customerAccessTokenCreateRawSchema,
  customerAccessTokenDeleteRawSchema,
  customerCreateRawSchema,
} from '../schemas/customer.js';

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = /* GraphQL */ `
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_CREATE_MUTATION = /* GraphQL */ `
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        phone
        displayName
        createdAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = /* GraphQL */ `
  mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;

export async function createStorefrontCustomerAccessToken(
  email: string,
  password: string,
) {
  const raw = await runStorefrontOperation({
    query: CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
    variables: { input: { email, password } },
    schema: customerAccessTokenCreateRawSchema,
  });

  const errors = raw.customerAccessTokenCreate.customerUserErrors;
  if (errors.length > 0) {
    throw new StorefrontValidationError('Customer login failed', {
      detail: errors.map((e) => e.message).join('; '),
    });
  }

  if (raw.customerAccessTokenCreate.customerAccessToken == null) {
    throw new StorefrontValidationError('Customer login failed', {
      detail: 'Invalid email or password',
    });
  }

  return mapLoginResponse(raw);
}

export async function createStorefrontCustomer(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const raw = await runStorefrontOperation({
    query: CUSTOMER_CREATE_MUTATION,
    variables: { input },
    schema: customerCreateRawSchema,
  });

  const errors = raw.customerCreate.customerUserErrors;
  if (errors.length > 0) {
    throw new StorefrontValidationError('Customer registration failed', {
      detail: errors.map((e) => e.message).join('; '),
    });
  }

  return mapRegisterResponse(raw);
}

export async function deleteStorefrontCustomerAccessToken(accessToken: string) {
  const raw = await runStorefrontOperation({
    query: CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
    variables: { customerAccessToken: accessToken },
    schema: customerAccessTokenDeleteRawSchema,
  });

  // Swallow user errors on logout — token may already be invalid.
  // We log but don't throw; logout should always succeed from the user's POV.
  const errors = raw.customerAccessTokenDelete.userErrors;
  if (errors.length > 0) {
    // Best-effort: the token is cleared client-side regardless.
    return;
  }
}
