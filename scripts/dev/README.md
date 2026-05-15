# Dev Scripts

Scripts in this directory support local development workflows.

## Conventions

- All dev scripts are invoked via root-level `bun run <script>` commands defined in the root `package.json`.
- Never commit secrets; use `.env` (not `.env.example`) for local values.
- Use `docker compose up -d` to start the local Postgres instance before running database commands.

## Quick Reference

| Command                 | What it does                                         |
| ----------------------- | ---------------------------------------------------- |
| `bun run dev`           | Start Elysia API + Bun fullstack frontend dev server |
| `bun run db:generate`   | Generate Drizzle migration files from schema changes |
| `bun run db:migrate`    | Apply pending Drizzle migrations to local Postgres   |
| `bun run check`         | Format + lint + typecheck in one pass (Vite+)        |
| `bun run format`        | Format source files with oxfmt via Vite+             |
| `bun run lint`          | Lint source files with oxlint via Vite+              |
| `bun run typecheck`     | TypeScript type-check only (no format/lint)          |
| `bun run test:contract` | Run API contract smoke tests                         |

## Database Setup (first time)

```bash
docker compose up -d          # Start Postgres container
bun run db:generate            # Generate initial migration
bun run db:migrate             # Apply migration
```
