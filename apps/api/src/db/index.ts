import { drizzle } from 'drizzle-orm/bun-sql';
import { getDatabaseUrl } from '../env/index.js';

export const db = drizzle(getDatabaseUrl());
