# ─── base: shared oven/bun alpine foundation ──────────────────────────────
FROM oven/bun:1-alpine AS base
WORKDIR /app

# ─── deps: install monorepo dependencies once for all builder stages ───────
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/api/package.json        ./apps/api/package.json
COPY apps/web/package.json        ./apps/web/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN bun install --frozen-lockfile

# ─── web-builder: compile Vite frontend ────────────────────────────────────
FROM deps AS web-builder
COPY apps/web        ./apps/web
COPY packages/shared ./packages/shared
COPY tsconfig.base.json tsconfig.json ./
RUN bun run build

# ─── api-builder: compile Elysia API to standalone binary ──────────────────
FROM deps AS api-builder
COPY apps/api        ./apps/api
COPY packages/shared ./packages/shared
COPY tsconfig.base.json tsconfig.json ./
ENV NODE_ENV=production
RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun-linux-x64 \
    --outfile server \
    apps/api/src/app/index.ts

# ─── runner: production runtime (no migration step at startup) ─────────────
FROM base AS runner
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# API binary
COPY --from=api-builder /app/server ./server
RUN chmod +x /app/server

# Frontend static assets
COPY --from=web-builder /app/apps/web/dist ./web/dist

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
ENV NODE_ENV=production
ENV STATIC_ASSETS=/app/web/dist

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["/app/server"]

# ─── migrator: optional target for one-off DB migration job ────────────────
FROM deps AS migrator
COPY drizzle ./drizzle
COPY drizzle.config.ts ./
CMD ["bun", "run", "db:migrate"]
