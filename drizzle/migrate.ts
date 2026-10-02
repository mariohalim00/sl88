import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { resolve } from 'node:path';
import dbConfig from '../drizzle.config';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const db = drizzle(databaseUrl);

async function main() {
  console.log('Running database migrations...');

  await migrate(db, {
    migrationsFolder: resolve(dbConfig.out || './drizzle/migrations'),
    migrationsTable: dbConfig.migrations?.table || 'drizzle_migrations',
    migrationsSchema: dbConfig.migrations?.schema || 'public',
  });

  console.log('Database migrations completed.');
}

await main()
  .catch((error) => {
    console.error('Database migration failed:');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$client.end();
  });
