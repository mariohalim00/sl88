import { Elysia } from 'elysia';

export const healthRoute = new Elysia({ prefix: '/api' }).get(
  '/health',
  () => ({
    status: 'ok' as const,
    service: 'api' as const,
    timestamp: new Date().toISOString(),
  }),
);
