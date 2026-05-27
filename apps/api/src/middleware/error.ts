import { createProblemDetail } from '@sl88/shared/schemas';
import { Elysia } from 'elysia';
import { logger } from '../lib/logger.js';

/**
 * RFC 9457-compliant global error handler.
 * All non-2xx responses use content-type `application/problem+json`.
 */
export const errorHandler = new Elysia({ name: 'error-handler' }).onError(
  { as: 'global' },
  ({ code, error, set, request }) => {
    set.headers['content-type'] = 'application/problem+json';

    const instance = new URL(request.url).pathname;
    const status =
      typeof set.status === 'number' && set.status >= 400 && set.status < 600
        ? set.status
        : code === 'VALIDATION'
          ? 422
          : code === 'NOT_FOUND'
            ? 404
            : 500;

    logger.error(
      {
        code,
        status,
        method: request.method,
        path: instance,
        err: error,
      },
      'request failed',
    );

    switch (code) {
      case 'VALIDATION':
        set.status = 422;
        return createProblemDetail(
          'https://example.dev/problems/validation-error',
          'Validation Error',
          422,
          { detail: error.message, instance },
        );

      case 'NOT_FOUND':
        set.status = 404;
        return createProblemDetail(
          'https://example.dev/problems/not-found',
          'Not Found',
          404,
          {
            detail: 'The requested resource was not found',
            instance,
          },
        );

      default: {
        // Preserve the status code if it was already set (e.g. by auth guard)
        set.status = status;

        // If the error body looks like a ProblemDetail already, pass it through
        if (
          error != null &&
          typeof error === 'object' &&
          'type' in error &&
          'title' in error &&
          'status' in error
        ) {
          return error;
        }

        return createProblemDetail(
          'https://example.dev/problems/internal-server-error',
          'Internal Server Error',
          status,
          { detail: 'An unexpected error occurred', instance },
        );
      }
    }
  },
);
