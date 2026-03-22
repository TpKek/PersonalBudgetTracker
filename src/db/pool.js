/**
 * Database Connection Pool
 *
 * Configures and manages PostgreSQL connection pool using node-postgres (pg).
 * Supports both local development and production SSL connections.
 *
 * @module db/pool
 */

import pg from 'pg';
const { Pool } = pg;

/**
 * Database connection pool configuration
 *
 * Uses DATABASE_URL from environment variables for connection string.
 * Enables SSL in production for secure database connections.
 *
 * Environment variables:
 *   - DATABASE_URL: Full PostgreSQL connection string
 *   - NODE_ENV: Set to 'production' for SSL connections
 *
 * @example
 * // Development (no SSL)
 * DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
 *
 * // Production (with SSL)
 * DATABASE_URL=postgresql://user:pass@host:5432/mydb
 * NODE_ENV=production
 */
const pool = new Pool({
  // Connection string from environment
  connectionString: process.env.DATABASE_URL,

  // SSL configuration
  // In production, use SSL to encrypt database connection
  // rejectUnauthorized: false allows self-signed certificates
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

// Export pool for use in route handlers
export default pool;

// ============================================================================
// CONNECTION TESTING
// ============================================================================

// Test database connection on startup
// Logs success or failure to console
pool
  .connect()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection failed:', err.message));
