#!/bin/sh
set -e

echo "[entrypoint] Starting API server..."
exec /app/server
