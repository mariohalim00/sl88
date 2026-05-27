# SL88

Full-stack TypeScript monorepo — **Bun** + **ElysiaJS** + **React 19** + **Drizzle ORM**.

---

## Quick start

### 1. Prerequisites

| Tool                                                           | Version    |
| -------------------------------------------------------------- | ---------- |
| [Bun](https://bun.sh)                                          | ≥ 1.3      |
| [Docker](https://docs.docker.com/get-docker/) + Docker Compose | any recent |

### 2. Clone and install

```sh
git clone <repo-url>
cd sl88
bun install
```

### 3. Environment

```sh
cp .env.example .env
# Edit DATABASE_URL / API_PORT / SHOPIFY_* values if needed
```

Required storefront proxy variables:

- `SHOPIFY_STORE_DOMAIN` (example: `your-shop.myshopify.com`)
- `SHOPIFY_STOREFRONT_API_VERSION` (example: `2026-01`)
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

Storefront credentials must remain server-side only and are never exposed to browser code.

### 4. Start Postgres

```sh
docker compose up -d
```

### 5. Run database migrations

```sh
bun run db:generate   # generate SQL from schema
bun run db:migrate    # apply to the database
```

### 6. Start the dev server

```sh
bun run dev
# → API: http://localhost:3000
# → Frontend (Vite): http://localhost:5173
```

---

## Project structure

```
sl88/
├── apps/
│   ├── api/          # ElysiaJS backend  (@sl88/api)
│   └── web/          # React 19 frontend  (@sl88/web)
├── packages/
│   └── shared/       # Shared Zod schemas & utilities  (@sl88/shared)
├── drizzle/
│   ├── schema/       # Drizzle table definitions
│   └── migrations/   # Generated SQL migrations
├── specs/            # SpecKit feature specs, plans & tasks
└── scripts/dev/      # Developer tooling docs
```

---

## Key commands

| Command                 | Description                               |
| ----------------------- | ----------------------------------------- |
| `bun run dev`           | Start API + Vite dev server in parallel   |
| `bun run format`        | Format all files with oxfmt via vite-plus |
| `bun run lint`          | Lint with oxlint + tsgolint via vite-plus |
| `bun run typecheck`     | TypeScript type-check only                |
| `bun run check`         | Format + lint + typecheck in one pass     |
| `bun run test:contract` | Run contract smoke tests                  |
| `bun run db:generate`   | Generate Drizzle migrations from schema   |
| `bun run db:migrate`    | Apply pending migrations                  |
| `bun run build`         | Production build for `apps/web`           |

---

## Architecture notes

- **Two-process dev workflow**: `bun run dev` starts ElysiaJS on port 3000 and Vite on port 5173. In development, Vite proxies `/api` requests to the backend.
- **Eden Treaty**: The frontend imports `typeof app` from `apps/api` via tsconfig path alias `@api/*`, giving end-to-end type safety without code generation.
- **RFC 9457 error format**: All non-2xx API responses use `application/problem+json` with `type`, `title`, `status`, `detail`, and `instance` fields.
- **Zod at boundaries**: All external input is validated with `safeParse()` at the system boundary (env vars, incoming request bodies, etc.).
- **No `any`**: The entire codebase uses `noImplicitAny: true` and `exactOptionalPropertyTypes: true`.
- **Frontend architecture discipline**: Prefer shadcn primitives before custom UI, keep React features modular instead of monolithic TSX files, and use TanStack for advanced client-side state management (no Redux by default).

---

## API endpoints (scaffold)

| Method | Path                      | Auth   | Description                      |
| ------ | ------------------------- | ------ | -------------------------------- |
| `GET`  | `/api/health`             | —      | Liveness check                   |
| `GET`  | `/api/scaffold/ping`      | —      | Echo demo with optional `?name=` |
| `GET`  | `/api/scaffold/protected` | Bearer | Auth-guarded demo route          |

## API endpoints (storefront)

| Method   | Path                                    | Description                                  |
| -------- | --------------------------------------- | -------------------------------------------- |
| `GET`    | `/api/storefront/products`              | List storefront products                     |
| `GET`    | `/api/storefront/products/:handle`      | Get storefront product detail by handle      |
| `POST`   | `/api/storefront/cart`                  | Create cart with initial lines               |
| `POST`   | `/api/storefront/cart/:cartId/lines`    | Add cart lines                               |
| `PATCH`  | `/api/storefront/cart/:cartId/lines`    | Update cart line quantities                  |
| `DELETE` | `/api/storefront/cart/:cartId/lines`    | Remove cart lines                            |
| `POST`   | `/api/storefront/cart/:cartId/checkout` | Resolve Shopify hosted checkout redirect URL |

## Shopper flow behavior

- Listing (`/shop/all`) and product detail (`/products/:handle`) consume live storefront payloads through the API proxy.
- Cart operations are server-synchronized and persisted in browser local storage for continuity between pages.
- Checkout always redirects to Shopify-hosted checkout.
- App return screen (`/checkout/result?status=success|cancel|failed`) handles post-checkout outcomes for guest shoppers.
