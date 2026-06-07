import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../env/index.js';
import { errorHandler } from '../middleware/error.js';
import { requestLogger } from '../middleware/request-logger.js';
import { logger } from '../lib/logger.js';
import { healthRoute } from '../routes/health.js';
import { scaffoldRoute } from '../routes/scaffold.js';
import { storefrontRoute } from '../routes/storefront.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const staticRoot =
  process.env['STATIC_ASSETS'] ?? resolve(__dirname, '../../../web/dist');
const staticAssets = resolve(staticRoot, 'assets');
const brandingAssets = resolve(staticRoot, 'branding');
const indexHtmlPath = resolve(staticRoot, 'index.html');

const app = new Elysia()
  .use(cors())
  .use(requestLogger)
  .use(errorHandler)
  .use(healthRoute)
  .use(scaffoldRoute)
  .use(storefrontRoute);

if (import.meta.main) {
  const { staticPlugin } = await import('@elysia/static');

  app
    .get('/', () => Bun.file(indexHtmlPath))
    .use(
      await staticPlugin({
        assets: staticAssets,
        prefix: '/assets',
      }),
    )
    .use(
      await staticPlugin({
        assets: brandingAssets,
        prefix: '/branding',
      }),
    )
    // SPA fallback: serve index.html for any route not handled above so that
    // React Router can take over on hard refresh or direct URL access.
    .get('/*', () => Bun.file(indexHtmlPath));

  app.listen(env.API_PORT, ({ hostname, port }) => {
    logger.info(
      {
        hostname,
        port,
      },
      'api server listening',
    );
  });
}

export { app };
export type App = typeof app;
