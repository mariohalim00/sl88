#!/bin/sh
set -e

echo "[entrypoint] Running database migrations..."
bun run db:migrate

echo "[entrypoint] Starting API server..."
exec bun run apps/api/src/app/index.ts
