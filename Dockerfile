# ─── base: shared oven/bun alpine foundation ──────────────────────────────
FROM oven/bun:1-alpine AS base
WORKDIR /app

# ─── deps: install all workspace dependencies ──────────────────────────────
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/api/package.json        ./apps/api/package.json
COPY apps/web/package.json        ./apps/web/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN bun install --frozen-lockfile

# ─── web-builder: compile Vite frontend ────────────────────────────────────
FROM base AS web-builder
COPY --from=deps /app/node_modules ./node_modules
COPY packages/shared ./packages/shared
COPY apps/web        ./apps/web
COPY tsconfig.base.json tsconfig.json package.json ./
RUN bun run build

# ─── api-builder: compile Elysia API to a standalone binary ────────────────
FROM base AS api-builder
COPY --from=deps /app/node_modules ./node_modules
COPY packages/shared ./packages/shared
COPY apps/api        ./apps/api
COPY tsconfig.base.json tsconfig.json package.json ./
ENV NODE_ENV=production
RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun-linux-x64 \
    --outfile server \
    apps/api/src/app/index.ts

# ─── runner: lean production image ─────────────────────────────────────────
# bun is kept here solely to run drizzle-kit migrations at startup.
# The API itself runs as a self-contained binary (no bun needed for it).
FROM base AS runner

RUN addgroup -g 1001 -S appgroup && \
    adduser  -S appuser -u 1001 -G appgroup

# Install all deps so drizzle-kit (a devDep) is available for migrations.
COPY package.json bun.lock ./
COPY apps/api/package.json        ./apps/api/package.json
COPY apps/web/package.json        ./apps/web/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN bun install --frozen-lockfile

# Compiled API binary (self-contained, no bun runtime required to execute)
COPY --from=api-builder /app/server ./server
RUN chmod +x server

# Compiled frontend assets served by the binary via @elysia/static
COPY --from=web-builder /app/apps/web/dist ./web/dist

# Drizzle migrations + config — needed by drizzle-kit at container startup
COPY drizzle        ./drizzle
COPY drizzle.config.ts ./

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
    chown -R appuser:appgroup /app

USER appuser
EXPOSE 3000

ENV NODE_ENV=production
# STATIC_ASSETS tells the binary where to find the compiled frontend files.
ENV STATIC_ASSETS=/app/web/dist

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
