/**
 * Authentication Middleware
 *
 * Validates JWT access tokens on protected routes.
 * Attaches user information to the request object if valid.
 *
 * @module middleware/authenticate
 */

import jwt from 'jsonwebtoken'

/**
 * Middleware function to authenticate JWT tokens
 *
 * Checks for Bearer token in Authorization header,
 * verifies the token using JWT_ACCESS_SECRET,
 * and attaches user data to req.user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @returns {void} Calls next() on success, sends 401 on failure
 *
 * @example
 * router.get('/protected', authenticate, (req, res) => {
 *   // req.user contains decoded JWT payload
 *   res.json({ userId: req.user.userId });
 * });
 */
const authenticate = (req,res,next) => {
  // Extract token from Authorization header (format: "Bearer <token>")
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    // Verify token using the access secret from environment
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Attach decoded user information to request object
    req.user = decoded;

    // Continue to next middleware/route handler
    next();
  } catch {
    // Token is invalid or expired
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

export default authenticate
