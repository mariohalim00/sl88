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
# Edit DATABASE_URL / API_PORT if needed
```

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
# → http://localhost:3000  (API + frontend on a single port)
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

| Command                 | Description                                     |
| ----------------------- | ----------------------------------------------- |
| `bun run dev`           | Start Bun fullstack dev server (API + frontend) |
| `bun run format`        | Format all files with oxfmt via vite-plus       |
| `bun run lint`          | Lint with oxlint + tsgolint via vite-plus       |
| `bun run typecheck`     | TypeScript type-check only                      |
| `bun run check`         | Format + lint + typecheck in one pass           |
| `bun run test:contract` | Run contract smoke tests                        |
| `bun run db:generate`   | Generate Drizzle migrations from schema         |
| `bun run db:migrate`    | Apply pending migrations                        |
| `bun run build`         | Production build for `apps/web`                 |

---

## Architecture notes

- **Single port dev server**: `bun run dev` starts ElysiaJS which serves the React app via `@elysia/static`. No separate Vite dev server needed.
- **Eden Treaty**: The frontend imports `typeof app` from `apps/api` via tsconfig path alias `@api/*`, giving end-to-end type safety without code generation.
- **RFC 9457 error format**: All non-2xx API responses use `application/problem+json` with `type`, `title`, `status`, `detail`, and `instance` fields.
- **Zod at boundaries**: All external input is validated with `safeParse()` at the system boundary (env vars, incoming request bodies, etc.).
- **No `any`**: The entire codebase uses `noImplicitAny: true` and `exactOptionalPropertyTypes: true`.

---

## API endpoints (scaffold)

| Method | Path                      | Auth   | Description                      |
| ------ | ------------------------- | ------ | -------------------------------- |
| `GET`  | `/api/health`             | —      | Liveness check                   |
| `GET`  | `/api/scaffold/ping`      | —      | Echo demo with optional `?name=` |
| `GET`  | `/api/scaffold/protected` | Bearer | Auth-guarded demo route          |
