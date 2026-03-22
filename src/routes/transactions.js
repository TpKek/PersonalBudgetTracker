import express from "express"
import pool from "../db/pool.js"
import authenticate from "../middleware/authenticate.js"

const router = express.Router()

router.get("/",authenticate, async (req, res) => {
    // res.json({ success : true, data :[]})
 try {
     const result = await pool.query("SELECT *, amount_cents::int FROM transactions ORDER BY created_at DESC")
     res.json({ success : true, data : result.rows})
 } catch (error) {
    res.status(500).json({ success : false, error : error.message})
 }
})

router.get("/:id",authenticate, async (req, res) => {
    // res.json({ success : true, data :{}})
try {
    const result = await pool.query("SELECT *, amount_cents::int FROM transactions WHERE id = $1", [req.params.id])
      if (!result.rows[0]){
      return res.status(404).json({ success : false, error : "Transaction not found"})
      }

    res.json({ success : true, data : result.rows[0]})

} catch (error) {
    res.status(500).json({ success : false, error : error.message})
}})

router.get('/user/:userId',authenticate, async (req,res) => {
try {
      // res.json({ success : true, data :[]})
      const result = await pool.query("SELECT *, amount_cents::int FROM transactions WHERE user_id = $1 ORDER BY created_at DESC", [req.params.userId])
      res.json({ success : true, data : result.rows})
} catch (error) {
  res.status(500).json({ success : false, error : error.message})
}
})

router.post('/', authenticate, async (req, res) => {
try {
    // res.json({ success : true, data :{}})
    const result = await pool.query(
      'INSERT INTO transactions (user_id, amount_cents, description, type, category) VALUES ($1, $2, $3, $4, $5) RETURNING *, amount_cents::int',
      [
        req.body.user_id,
        req.body.amount_cents,
        req.body.description,
        req.body.type,
        req.body.category,
      ]
    );
    if(!result.rows[0]){
      return res.status(404).json({ success : false, error : "Transaction not found"})
      }
    res.json({ success : true, data : result.rows[0]})
} catch (error) {
   res.status(500).json({ success : false, error : error.message})
}
})

router.patch('/:id/status',authenticate, async (req,res) => {
try {
      // res.json({ success : true, data :{}})

      const validStatuses = ['pending', 'completed', 'failed']
      if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' })
}

      const result = await pool.query("UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *, amount_cents::int", [req.body.status, req.params.id])
      res.json({ success : true, data : result.rows[0]})
} catch (error) {
   res.status(500).json({ success : false, error : error.message})
}
})
export default router
