# Quickstart: Scaffold Monorepo Foundation

## Prerequisites

- Bun installed
- Docker running with local PostgreSQL available

## 1. Install dependencies

```bash
bun install
```

## 2. Configure environment

Create local env files for api/web according to scaffold templates.

Minimum expected API variables:

- `DATABASE_URL` (PostgreSQL connection string)
- `API_PORT`

## 3. Prepare database baseline

```bash
bun run db:generate
bun run db:migrate
```

## 4. Start full-stack dev workflow

```bash
bun run dev
```

Expected result:

- Web app available locally
- API available locally
- Frontend can call scaffold typed endpoint via Eden Treaty

## 5. Run required quality gates

```bash
bun run format
bun run lint
bun run typecheck
bun run test:contract
```

## 6. Smoke-check scaffold API

```bash
curl http://localhost:${API_PORT:-3000}/api/health
curl "http://localhost:${API_PORT:-3000}/api/scaffold/ping?name=dev"
```

Non-2xx responses should use `application/problem+json` per RFC 9457.
