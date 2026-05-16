import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../env/index.js';
import { errorHandler } from '../middleware/error.js';
import { healthRoute } from '../routes/health.js';
import { scaffoldRoute } from '../routes/scaffold.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const staticRoot =
  process.env['STATIC_ASSETS'] ?? resolve(__dirname, '../../../web/dist');
const staticAssets = resolve(staticRoot, 'assets');
const indexHtmlPath = resolve(staticRoot, 'index.html');

const app = new Elysia()
  .use(cors())
  .use(errorHandler)
  .use(healthRoute)
  .use(scaffoldRoute);

if (import.meta.main) {
  const { staticPlugin } = await import('@elysia/static');

  app
    .get('/', () => Bun.file(indexHtmlPath))
    .use(
      await staticPlugin({
        assets: staticAssets,
        prefix: '/assets',
      }),
    );

  app.listen(env.API_PORT, ({ hostname, port }) => {
    console.log(`[api] Listening on http://${hostname}:${port}`);
  });
}

export { app };
export type App = typeof app;
