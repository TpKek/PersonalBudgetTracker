/**
 * Transaction Routes
 *
 * Handles CRUD operations for user transactions.
 * All endpoints require authentication (valid JWT access token).
 * Implements BOLA (Broken Object Level Authorization) protection.
 *
 * @module routes/transactions
 */

import express from "express"
import pool from "../db/pool.js"
import authenticate from "../middleware/authenticate.js"

const router = express.Router();

// ============================================================================
// CONSTANTS
// ============================================================================

// Valid transaction types
const VALID_TYPES = ['income', 'expense'];

// Valid transaction categories
const VALID_CATEGORIES = ['food', 'transport', 'entertainment', 'salary', 'other'];

// Valid transaction statuses
const VALID_STATUSES = ['pending', 'completed', 'failed'];

// ============================================================================
// TRANSACTION ROUTES
// ============================================================================

/**
 * GET /transactions
 *
 * Retrieves all transactions for the authenticated user.
 * Returns transactions in descending order by creation date.
 *
 * Headers:
 *   - Authorization: Bearer <access_token>
 *
 * Response (200):
 *   { success: true, data: [...] }
 */
router.get("/",authenticate, async (req, res) => {
 try {
   // Query transactions for the authenticated user only
   // Uses parameterized query to prevent SQL injection
   // Casts amount_cents to int for proper JavaScript number handling
   const result = await pool.query(
     "SELECT *, amount_cents::int FROM transactions WHERE user_id = $1 ORDER BY created_at DESC",
     [req.user.userId] // userId from JWT payload
   );
   res.json({ success : true, data : result.rows})
 } catch (error) {
   res.status(500).json({ success : false, error : error.message})
 }
})

/**
 * GET /transactions/:id
 *
 * Retrieves a single transaction by ID.
 * Only returns if the transaction belongs to the authenticated user.
 *
 * Headers:
 *   - Authorization: Bearer <access_token>
 *
 * Params:
 *   - id: Transaction ID
 *
 * Response (200):
 *   { success: true, data: {...} }
 * Response (404):
 *   { success: false, error: 'Transaction not found' }
 */
router.get("/:id",authenticate, async (req, res) => {
 try {
   // BOLA Protection: Ensure user can only access their own transactions
   const result = await pool.query(
     "SELECT *, amount_cents::int FROM transactions WHERE id = $1 AND user_id = $2 ",
     [req.params.id, req.user.userId]
   );

   if (!result.rows[0]){
     return res.status(404).json({ success : false, error: "Transaction not found"})
   }

   res.json({ success : true, data : result.rows[0]})

 } catch (error) {
   res.status(500).json({ success : false, error : error.message})
 }
})

/**
 * POST /transactions
 *
 * Creates a new transaction for the authenticated user.
 * Supports idempotency to prevent duplicate transactions.
 *
 * Headers:
 *   - Authorization: Bearer <access_token>
 *   - Idempotency-Key: (optional) UUID to prevent duplicates
 *
 * Request body:
 *   - amount_cents: Amount in cents (required, positive number)
 *   - type: 'income' or 'expense' (required)
 *   - category: Category from VALID_CATEGORIES (required)
 *   - description: Transaction description (optional)
 *
 * Response (201):
 *   { success: true, data: {...} }
 */
router.post('/', authenticate, async (req, res) => {
 try {
   // Extract and validate input
   const { amount_cents, description, type, category } = req.body;

   // Validate amount_cents
   if (!amount_cents || typeof amount_cents !== 'number' || amount_cents <= 0) {
     return res.status(400).json({ success: false, error: 'Valid positive amount_cents required' });
   }

   // Validate type
   if (!type || !VALID_TYPES.includes(type)) {
     return res.status(400).json({ success: false, error: 'Valid type required (income or expense)' });
   }

   // Validate category
   if (!category || !VALID_CATEGORIES.includes(category)) {
     return res.status(400).json({ success: false, error: 'Valid category required' });
   }

   // Get idempotency key from headers
   const idempotencyKey = req.headers['idempotency-key'];

   // If idempotency key provided, check for existing transaction
   // This prevents duplicate transactions if client retries the request
   if (idempotencyKey) {
     const existing = await pool.query(
       'SELECT *, amount_cents::int FROM transactions WHERE idempotency_key = $1 AND user_id = $2',
       [idempotencyKey, req.user.userId]
     );
     // Return existing transaction if found
     if (existing.rows[0]) {
       return res.json({ success: true, data: existing.rows[0], idempotent: true });
     }
   }

   // Insert new transaction
   const result = await pool.query(
     'INSERT INTO transactions (user_id, amount_cents, description, type, category, idempotency_key) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *, amount_cents::int',
     [
       req.user.userId,  // From JWT payload
       amount_cents,
       description || '',  // Default to empty string if not provided
       type,
       category,
       idempotencyKey || null,  // Store idempotency key if provided
     ]
   );

   res.status(201).json({ success : true, data : result.rows[0]})
 } catch (error) {
   res.status(500).json({ success : false, error : error.message})
 }
})

/**
 * PATCH /transactions/:id/status
 *
 * Updates the status of an existing transaction.
 * Only the transaction owner can update its status.
 *
 * Headers:
 *   - Authorization: Bearer <access_token>
 *
 * Params:
 *   - id: Transaction ID
 *
 * Request body:
 *   - status: 'pending', 'completed', or 'failed'
 *
 * Response (200):
 *   { success: true, data: {...} }
 */
router.patch('/:id/status',authenticate, async (req,res) => {
 try {
   const { status } = req.body;

   // Validate status value
   if (!status || !VALID_STATUSES.includes(status)) {
     return res.status(400).json({ success: false, error: 'Invalid status value' })
  }

   // BOLA Protection: Only update if transaction belongs to user
   const result = await pool.query(
     "UPDATE transactions SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *, amount_cents::int",
     [status, req.params.id, req.user.userId]
   );

   if (!result.rows[0]) {
     return res.status(404).json({ success: false, error: 'Transaction not found' })
   }

   res.json({ success : true, data : result.rows[0]})
 } catch (error) {
   res.status(500).json({ success : false, error : error.message})
 }
})

export default router
