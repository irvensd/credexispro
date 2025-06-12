import { Pool } from 'pg';
import logger from './logger';

// Create a new pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
});

// Log pool events
pool.on('connect', () => {
  logger.info('New client connected to database');
});

pool.on('error', (err, client) => {
  logger.error('Unexpected error on idle client', err);
});

// Test database connection
export const testQuery = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    logger.info('Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
};

// Export pool for use in other modules
export default pool; 