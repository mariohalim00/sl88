#!/bin/sh
set -e

echo "[entrypoint] Running database migrations..."
bun run db:migrate

echo "[entrypoint] Starting API server..."
exec /app/server
