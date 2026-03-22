/**
 * Authentication Routes
 *
 * Handles user registration, login, token refresh, and logout.
 * All endpoints return JSON responses with success/error status.
 *
 * @module routes/auth
 */

import express from "express";
import pool from '../db/pool.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Rate limiter for general auth endpoints (register, etc.)
 * Limits each IP to 100 requests per 15 minutes
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, error: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Stricter rate limiter for login attempts
 * Limits each IP to 10 login attempts per 15 minutes
 * Helps prevent brute force password attacks
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per windowMs
  message: { success: false, error: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================================================
// TOKEN GENERATION
// ============================================================================

/**
 * Generates JWT access and refresh tokens for a user
 *
 * @param {Object} user - User object containing user ID
 * @returns {Object} Object containing accessToken and refreshToken
 *
 * @example
 * const { accessToken, refreshToken } = generateTokens(user);
 */
const generateTokens = user => {
  // Access token: short-lived (15 minutes) for API access
  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  // Refresh token: long-lived (7 days) for obtaining new access tokens
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// ============================================================================
// INPUT VALIDATION
// ============================================================================

/**
 * Validates email format using regex
 *
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

/**
 * POST /auth/register
 *
 * Creates a new user account with email and password.
 * Returns access and refresh tokens upon successful registration.
 *
 * Request body:
 *   - name: User's display name (required)
 *   - email: Valid email address (required, must be unique)
 *   - password: Password (required, min 6 characters)
 *
 * Response (201):
 *   { success: true, data: { accessToken, refreshToken } }
 */
router.post('/register', authLimiter, async (req,res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Valid email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    // Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in database
    const result = await pool.query(
      'INSERT INTO users (name, password_hash, email) VALUES ($1, $2, $3) RETURNING *',
      [name.trim(), hashedPassword, email]
    );

    // Generate JWT tokens for the new user
    const { accessToken, refreshToken } = generateTokens(result.rows[0]);

    // Store refresh token in database for token rotation
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)',
      [refreshToken, result.rows[0].id, expiresAt]
    );

    // Return tokens to client
    res.status(201).json({ success: true, data: { accessToken, refreshToken } });

  } catch (error) {
    res.status(500).json({ success : false, error : error.message})
  }
})

/**
 * POST /auth/login
 *
 * Authenticates user with email and password.
 * Returns user info and tokens upon successful login.
 *
 * Request body:
 *   - email: Valid email address (required)
 *   - password: User's password (required)
 *
 * Response (200):
 *   { success: true, data: { user, accessToken, refreshToken } }
 */
router.post('/login', loginLimiter, async (req,res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Valid email is required' });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ success: false, error: 'Password is required' });
    }

    // Find user by email
    const checkEmail = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    )

    // Generic error message to prevent user enumeration
    if (checkEmail.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Compare provided password with stored hash
    const isPasswordValid = await bcrypt.compare(password, checkEmail.rows[0].password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Generate new tokens
    const { accessToken, refreshToken } = generateTokens(checkEmail.rows[0]);

    // Store refresh token in database
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)',
      [refreshToken, checkEmail.rows[0].id, expiresAt]
    );

    // Return user info and tokens
    res.json({
      success: true,
      data: {
        user: {
          id: checkEmail.rows[0].id,
          name: checkEmail.rows[0].name,
          email: checkEmail.rows[0].email,
        },
        accessToken,
        refreshToken,
      },
    });

  } catch (error) {
    res.status(500).json({ success : false, error : error.message})
  }
})

/**
 * POST /auth/refresh-token
 *
 * Exchanges a valid refresh token for new access and refresh tokens.
 * Implements token rotation - old token is invalidated and replaced.
 *
 * Request body:
 *   - refreshToken: Valid refresh token (required)
 *
 * Response (200):
 *   { success: true, data: { accessToken, refreshToken } }
 */
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ success: false, error: 'No refresh token provided' });
    }

    // Verify refresh token exists and hasn't expired
    const tokenRecord = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );

    if (tokenRecord.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
    }

    // Get user associated with the token
    const user = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [tokenRecord.rows[0].user_id]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    // Generate new tokens (token rotation)
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.rows[0]);

    // Update refresh token in database (invalidate old, store new)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      'UPDATE refresh_tokens SET token = $1, expires_at = $2 WHERE token = $3',
      [newRefreshToken, expiresAt, refreshToken]
    );

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /auth/logout
 *
 * Invalidates the provided refresh token, logging the user out.
 *
 * Request body:
 *   - refreshToken: Refresh token to invalidate (required)
 *
 * Response (200):
 *   { success: true, message: 'Logged out successfully' }
 */
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'No refresh token provided' });
    }

    // Remove refresh token from database
    await pool.query(
      'DELETE FROM refresh_tokens WHERE token = $1',
      [refreshToken]
    );

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
