import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { errorHandler } from "../middleware/error.js";
import { healthRoute } from "../routes/health.js";
import { scaffoldRoute } from "../routes/scaffold.js";
import { env } from "../env/index.js";

const baseApp = new Elysia().use(cors()).use(errorHandler).use(healthRoute).use(scaffoldRoute);

// Bun Fullstack Dev Server: serve the web app alongside the API.
// Only wired when running as the main entry point (not during tests).
let app = baseApp;

if (import.meta.main) {
  const { staticPlugin } = await import("@elysiajs/static");
  const { resolve } = await import("node:path");
  const { fileURLToPath } = await import("node:url");

  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const webRoot = process.env["STATIC_ASSETS"] ?? resolve(__dirname, "../../../../web");

  app = baseApp.use(
    await staticPlugin({
      assets: webRoot,
      prefix: "/",
    }),
  );

  app.listen(env.API_PORT, ({ hostname, port }) => {
    console.log(`[api] Listening on http://${hostname}:${port}`);
  });
}

export { app };
export type App = typeof baseApp;
