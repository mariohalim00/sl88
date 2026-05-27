import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { z } from 'zod';
import { getStorefrontConfig } from '../../env/index.js';
import {
  StorefrontUpstreamError,
  StorefrontValidationError,
} from './errors.js';

const storefrontClientResponseSchema = z.object({
  data: z.unknown().optional(),
  errors: z
    .object({
      networkStatusCode: z.number().optional(),
      message: z.string().optional(),
      graphQLErrors: z.array(z.object({ message: z.string() })).optional(),
    })
    .optional(),
});

function getStorefrontClient() {
  const config = getStorefrontConfig();

  return createStorefrontApiClient({
    storeDomain: config.storeDomain,
    apiVersion: config.apiVersion,
    publicAccessToken: config.accessToken,
    clientName: 'sl88-api',
    retries: 1,
  });
}

export async function runStorefrontOperation<
  TSchema extends z.ZodTypeAny,
>(args: {
  query: string;
  variables?: Record<string, unknown>;
  schema: TSchema;
}): Promise<z.infer<TSchema>> {
  const client = getStorefrontClient();
  const rawResponse = await client.request(args.query, {
    variables: args.variables ?? {},
  });

  const payload = storefrontClientResponseSchema.safeParse(rawResponse);

  if (!payload.success) {
    throw new StorefrontUpstreamError('Invalid Storefront response shape', {
      status: 502,
      detail: payload.error.message,
    });
  }

  if (payload.data.errors != null) {
    const networkStatusCode = payload.data.errors.networkStatusCode;
    const graphQLErrors = payload.data.errors.graphQLErrors;
    const joinedGraphQLErrors =
      graphQLErrors?.map((error) => error.message).join('; ') ??
      undefined;

    throw new StorefrontUpstreamError(
      'Storefront request returned errors',
      {
        status: networkStatusCode ?? 502,
        detail:
          joinedGraphQLErrors ??
          payload.data.errors.message ??
          'Unknown Storefront API error',
      },
    );
  }

  const parsed = args.schema.safeParse(payload.data.data);
  if (!parsed.success) {
    throw new StorefrontValidationError(
      'Failed to validate Storefront payload',
      {
        detail: parsed.error.message,
      },
    );
  }

  return parsed.data;
}
