import { createProblemDetail } from '@sl88/shared/schemas';
import { logger } from '../../lib/logger.js';

export class StorefrontUpstreamError extends Error {
  status: number;
  detail: string | undefined;

  constructor(
    message: string,
    options?: {
      status?: number;
      detail?: string;
    },
  ) {
    super(message);
    this.name = 'StorefrontUpstreamError';
    this.status = options?.status ?? 502;
    this.detail = options?.detail;
  }
}

export class StorefrontValidationError extends Error {
  detail: string | undefined;

  constructor(message: string, options?: { detail?: string }) {
    super(message);
    this.name = 'StorefrontValidationError';
    this.detail = options?.detail;
  }
}

export class StorefrontNotFoundError extends Error {
  constructor(message = 'Requested storefront resource was not found') {
    super(message);
    this.name = 'StorefrontNotFoundError';
  }
}

export function toStorefrontProblem(error: unknown, instance: string) {
  if (error instanceof StorefrontNotFoundError) {
    logger.warn(
      {
        err: error,
        instance,
      },
      'storefront resource not found',
    );

    return {
      status: 404,
      body: createProblemDetail(
        'https://example.dev/problems/storefront-not-found',
        'Storefront Not Found',
        404,
        {
          detail: error.message,
          instance,
        },
      ),
    };
  }

  if (error instanceof StorefrontValidationError) {
    logger.error(
      {
        err: error,
        instance,
      },
      'storefront payload validation failed',
    );

    return {
      status: 502,
      body: createProblemDetail(
        'https://example.dev/problems/storefront-invalid-payload',
        'Storefront Payload Validation Failed',
        502,
        {
          detail: error.detail ?? error.message,
          instance,
        },
      ),
    };
  }

  if (error instanceof StorefrontUpstreamError) {
    logger.error(
      {
        err: error,
        instance,
        status: error.status,
      },
      'storefront upstream error',
    );

    return {
      status: error.status,
      body: createProblemDetail(
        'https://example.dev/problems/storefront-upstream-error',
        'Storefront Upstream Error',
        error.status,
        {
          detail: error.detail ?? error.message,
          instance,
        },
      ),
    };
  }

  logger.error(
    {
      err: error,
      instance,
    },
    'storefront unknown error',
  );

  return {
    status: 500,
    body: createProblemDetail(
      'https://example.dev/problems/storefront-unknown-error',
      'Storefront Unknown Error',
      500,
      {
        detail: 'Unexpected storefront failure',
        instance,
      },
    ),
  };
}
