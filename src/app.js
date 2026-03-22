/**
 * Personal Budget Tracker - Main Express Application
 *
 * This is the entry point for the backend API. It sets up:
 * - Express server with security middleware
 * - CORS configuration
 * - Database connection
 * - Route handlers
 *
 * @module app
 */

// Load environment variables from .env file
import 'dotenv/config';

// Express framework for building REST APIs
import express from 'express';

// Helmet.js - adds security headers to HTTP responses
import helmet from 'helmet';

// Database connection pool
import pool from './db/pool.js';

// CORS middleware for cross-origin requests
import cors from 'cors';

// Route handlers
import transactionRoutes from './routes/transactions.js';
import authRoutes from './routes/auth.js';

// Custom middleware
import logger from './middleware/logger.js';

// Create Express application instance
const app = express();

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

// Helmet.js: Sets various HTTP headers for security
// Includes: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, etc.
app.use(helmet());

// CORS: Configure Cross-Origin Resource Sharing
// Only allows requests from the specified origin (frontend URL)
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: corsOrigin,
    credentials: true, // Allow cookies to be sent cross-origin
  })
);

// ============================================================================
// REQUEST PARSING MIDDLEWARE
// ============================================================================

// Parse JSON request bodies
// Limits payload to prevent DoS attacks with large requests
app.use(express.json());

// Custom logging middleware for requests
app.use(logger);

// ============================================================================
// API ROUTES
// ============================================================================

// Transaction endpoints: /transactions
app.use('/transactions', transactionRoutes);

// Authentication endpoints: /auth
app.use('/auth', authRoutes);

// ============================================================================
// HEALTH CHECK ENDPOINTS
// ============================================================================

/**
 * GET /
 * Root endpoint - returns a simple greeting
 */
app.get('/', (req, res) => {
  res.send('Hello world!');
});

/**
 * GET /health
 * Health check endpoint for load balancers and monitoring
 * Returns server status
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

// Start the Express server on the specified port
const port = process.env.PORT;

app.listen(port, () => {
  // Server running
});

// Export app for testing purposes
export default app;
