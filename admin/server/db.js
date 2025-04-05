import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from '../../shared/schema.js';

const { Pool } = pkg;

// Create PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create drizzle instance
export const db = drizzle(pool, { schema });