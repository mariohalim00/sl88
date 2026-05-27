import { Elysia } from 'elysia';
import { logger } from '../lib/logger.js';

const HEALTH_PATH = '/api/health';

const requestStartedAt = new WeakMap<Request, number>();

export const requestLogger = new Elysia({ name: 'request-logger' })
  .onRequest(({ request }) => {
    const url = new URL(request.url);

    if (url.pathname === HEALTH_PATH) {
      return;
    }

    requestStartedAt.set(request, Date.now());
  })
  .onAfterHandle(({ request, set }) => {
    const url = new URL(request.url);

    if (url.pathname === HEALTH_PATH) {
      return;
    }

    const startedAt = requestStartedAt.get(request);
    const durationMs = startedAt == null ? undefined : Date.now() - startedAt;
    const status = typeof set.status === 'number' ? set.status : 200;

    logger.info(
      {
        method: request.method,
        path: url.pathname,
        status,
        durationMs,
      },
      'request completed',
    );
  });