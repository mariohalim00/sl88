#!/bin/sh
set -e

echo "[entrypoint] Running database migrations..."
/app/migrate

echo "[entrypoint] Starting API server..."
exec /app/server
