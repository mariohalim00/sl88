import { Elysia, t } from 'elysia';
import { authGuard } from '../middleware/auth.js';

export const scaffoldRoute = new Elysia({ prefix: '/api/scaffold' })
  .use(authGuard)
  .get(
    '/ping',
    ({ query }) => ({
      message: 'pong' as const,
      echo: {
        name: query.name ?? 'world',
      },
    }),
    {
      query: t.Object({
        name: t.Optional(t.String({ maxLength: 60 })),
      }),
    },
  )
  .get(
    '/protected',
    () => ({
      message: 'authorized scaffold route' as const,
    }),
    {
      isAuthenticated: true,
    },
  );
