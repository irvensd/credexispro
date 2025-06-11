import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = pool;

export async function testQuery() {
  const result = await db.query('SELECT NOW()');
  return result.rows[0];
} 