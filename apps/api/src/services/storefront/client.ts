import { z } from 'zod';
import { getStorefrontConfig } from '../../env/index.js';
import { StorefrontUpstreamError, StorefrontValidationError } from './errors.js';

const graphqlResponseSchema = z.object({
  data: z.unknown().optional(),
  errors: z
    .array(
      z.object({
        message: z.string(),
      }),
    )
    .optional(),
});

export async function runStorefrontOperation<TSchema extends z.ZodTypeAny>(args: {
  query: string;
  variables?: Record<string, unknown>;
  schema: TSchema;
}): Promise<z.infer<TSchema>> {
  const config = getStorefrontConfig();

  const response = await fetch(
    `https://${config.storeDomain}/api/${config.apiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-shopify-storefront-access-token': config.accessToken,
      },
      body: JSON.stringify({
        query: args.query,
        variables: args.variables ?? {},
      }),
    },
  );

  if (!response.ok) {
    throw new StorefrontUpstreamError('Storefront request failed', {
      status: response.status,
      detail: response.statusText,
    });
  }

  const payload = graphqlResponseSchema.safeParse(await response.json());

  if (!payload.success) {
    throw new StorefrontUpstreamError('Invalid Storefront response shape', {
      status: 502,
      detail: payload.error.message,
    });
  }

  if ((payload.data.errors?.length ?? 0) > 0) {
    throw new StorefrontUpstreamError('Storefront responded with GraphQL errors', {
      status: 502,
      detail:
        payload.data.errors?.map((error) => error.message).join('; ') ??
        'Unknown GraphQL error',
    });
  }

  const parsed = args.schema.safeParse(payload.data.data);
  if (!parsed.success) {
    throw new StorefrontValidationError('Failed to validate Storefront payload', {
      detail: parsed.error.message,
    });
  }

  return parsed.data;
}
