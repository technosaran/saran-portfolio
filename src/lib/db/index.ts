import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

declare global {
  var __drizzle_pool: Pool | undefined;
  var __drizzle_db: NodePgDatabase<typeof schema> | undefined;
}

function getNormalizedConnectionString(): string {
  const url = process.env.DATABASE_URL || '';
  if (!url) return '';
  // Normalize sslmode=require to sslmode=verify-full to avoid pg security deprecation warning
  return url.replace(/([?&])sslmode=require\b/g, '$1sslmode=verify-full');
}

export function getDbPool(): Pool {
  const connectionString = getNormalizedConnectionString();
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }

  if (!global.__drizzle_pool) {
    global.__drizzle_pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: true },
      max: process.env.NODE_ENV === 'production' ? 10 : 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    global.__drizzle_pool.on('error', (err) => {
      console.error('[DATABASE POOL ERROR] Unexpected error on idle PostgreSQL client:', err);
    });
  }

  return global.__drizzle_pool;
}

export function getDb(): NodePgDatabase<typeof schema> {
  if (!global.__drizzle_db) {
    const pool = getDbPool();
    global.__drizzle_db = drizzle(pool, { schema });
  }
  return global.__drizzle_db;
}

export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_target, prop) {
    const instance = getDb();
    // @ts-expect-error - Dynamic proxy delegation to Drizzle instance
    return instance[prop];
  },
});

export * from './schema';
