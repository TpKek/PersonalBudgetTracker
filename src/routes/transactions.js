import express from "express"
import pool from "../db/pool.js"
import authenticate from "../middleware/authenticate.js"

const router = express.Router()

const VALID_TYPES = ['income', 'expense'];
const VALID_CATEGORIES = ['food', 'transport', 'entertainment', 'salary', 'other'];
const VALID_STATUSES = ['pending', 'completed', 'failed'];

router.get("/",authenticate, async (req, res) => {
 try {
      const result = await pool.query("SELECT *, amount_cents::int FROM transactions WHERE user_id = $1 ORDER BY created_at DESC",
       [req.user.userId]
      )
      res.json({ success : true, data : result.rows})
 } catch (error) {
    res.status(500).json({ success : false, error : error.message})
 }
})

router.get("/:id",authenticate, async (req, res) => {
 try {
    const result = await pool.query("SELECT *, amount_cents::int FROM transactions WHERE id = $1 AND user_id = $2 ", [req.params.id, req.user.userId])
      if (!result.rows[0]){
      return res.status(404).json({ success : false, error : "Transaction not found"})
      }

    res.json({ success : true, data : result.rows[0]})

 } catch (error) {
    res.status(500).json({ success : false, error : error.message})
 }})

router.post('/', authenticate, async (req, res) => {
 try {
    // Input validation
    const { amount_cents, description, type, category } = req.body;

    if (!amount_cents || typeof amount_cents !== 'number' || amount_cents <= 0) {
      return res.status(400).json({ success: false, error: 'Valid positive amount_cents required' });
    }
    if (!type || !VALID_TYPES.includes(type)) {
      return res.status(400).json({ success: false, error: 'Valid type required (income or expense)' });
    }
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, error: 'Valid category required' });
    }

    const idempotencyKey = req.headers['idempotency-key'];

    // If idempotency key provided, check for existing transaction
    if (idempotencyKey) {
      const existing = await pool.query(
        'SELECT *, amount_cents::int FROM transactions WHERE idempotency_key = $1 AND user_id = $2',
        [idempotencyKey, req.user.userId]
      );
      if (existing.rows[0]) {
        return res.json({ success: true, data: existing.rows[0], idempotent: true });
      }
    }

    const result = await pool.query(
      'INSERT INTO transactions (user_id, amount_cents, description, type, category, idempotency_key) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *, amount_cents::int',
      [
        req.user.userId,
        amount_cents,
        description || '',
        type,
        category,
        idempotencyKey || null,
      ]
    );

    res.status(201).json({ success : true, data : result.rows[0]})
 } catch (error) {
    res.status(500).json({ success : false, error : error.message})
 }
})

router.patch('/:id/status',authenticate, async (req,res) => {
 try {
      const { status } = req.body;

      if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' })
 }

      const result = await pool.query("UPDATE transactions SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *, amount_cents::int", [status, req.params.id, req.user.userId])

      if (!result.rows[0]) {
        return res.status(404).json({ success: false, error: 'Transaction not found' })
      }

      res.json({ success : true, data : result.rows[0]})
 } catch (error) {
    res.status(500).json({ success : false, error : error.message})
 }
})
export default router
