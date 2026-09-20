import { runStorefrontOperation } from '../client.js';
import { customerQueryRawSchema } from '../schemas/customer.js';
import { mapCustomer } from '../mappers/customer.js';

const CUSTOMER_QUERY = /* GraphQL */ `
  query Customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      displayName
      createdAt
      defaultAddress {
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
      addresses(first: 10) {
        nodes {
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
      }
      orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          orderNumber
          processedAt
          fulfillmentStatus
          financialStatus
          totalPrice {
            amount
            currencyCode
          }
          totalShippingPrice {
            amount
            currencyCode
          }
          subtotalPrice {
            amount
            currencyCode
          }
          totalTax {
            amount
            currencyCode
          }
          lineItems(first: 50) {
            nodes {
              title
              quantity
              variant {
                id
                title
                image {
                  url
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getStorefrontCustomer(accessToken: string) {
  const raw = await runStorefrontOperation({
    query: CUSTOMER_QUERY,
    variables: { customerAccessToken: accessToken },
    schema: customerQueryRawSchema,
  });

  if (raw.customer == null) {
    return null;
  }

  return mapCustomer(raw.customer);
}
