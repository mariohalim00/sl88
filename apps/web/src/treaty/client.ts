import { treaty } from '@elysiajs/eden';

import type { App } from '@api/app/index';

/**
 * Eden Treaty typed client for the SL88 API.
 *
 * All frontend-to-backend calls MUST go through this client so that
 * request/response shapes remain aligned with the server definition.
 */
export const api = treaty<App>(
  typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:3000',
);
