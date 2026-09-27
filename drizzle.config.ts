import { defineConfig } from 'drizzle-kit';

const databaseUrl =
  process.env['DATABASE_URL'] ??
  'postgresql://postgres:postgres@localhost:5432/sl88_dev';

export default defineConfig({
  schema: './apps/api/src/db/schema/*.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
  casing: 'snake_case',
  migrations: {
    schema: 'public',
    table: 'drizzle_migrations',
  },
  tablesFilter: []
});
