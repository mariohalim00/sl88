# ─── base: shared oven/bun alpine foundation ──────────────────────────────
FROM oven/bun:1-alpine AS base
WORKDIR /app

# ─── deps: install all workspace dependencies ──────────────────────────────
FROM base AS deps
# Copy manifests first to maximise layer cache hits on bun install
COPY package.json bun.lock ./
COPY apps/api/package.json     ./apps/api/package.json
COPY apps/web/package.json     ./apps/web/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN bun install --frozen-lockfile

# ─── web-builder: compile frontend assets ──────────────────────────────────
FROM base AS web-builder
COPY --from=deps /app/node_modules ./node_modules
COPY packages/shared ./packages/shared
COPY apps/web        ./apps/web
COPY tsconfig.base.json tsconfig.json package.json ./
# "build" script: cd apps/web && vp build  →  outputs to apps/web/dist
RUN bun run build

# ─── runner: lean production image ─────────────────────────────────────────
FROM base AS runner

RUN addgroup -g 1001 -S appgroup && \
    adduser  -S appuser -u 1001 -G appgroup

# Re-install (api + shared only) so workspace symlinks are clean in this stage
COPY package.json bun.lock ./
COPY apps/api/package.json        ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN bun install --frozen-lockfile && \
    chown -R appuser:appgroup /app/node_modules /app/apps

# Application source
COPY --chown=appuser:appgroup packages/shared ./packages/shared
COPY --chown=appuser:appgroup apps/api        ./apps/api
COPY --chown=appuser:appgroup drizzle         ./drizzle
COPY --chown=appuser:appgroup drizzle.config.ts tsconfig.base.json tsconfig.json package.json ./

# Compiled frontend (API serves these via @elysia/static at /assets)
# Default staticRoot resolves to apps/web/dist relative to the entry point,
# so this path must stay here unless STATIC_ASSETS is overridden.
COPY --from=web-builder --chown=appuser:appgroup /app/apps/web/dist ./apps/web/dist

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
