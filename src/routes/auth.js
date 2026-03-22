import express from "express";
import pool from '../db/pool.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const router = express.Router();


  const generateTokens = user => {
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
  };

router.post('/register', async (req,res) => {

  try {

    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [req.body.email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, password_hash, email) VALUES ($1, $2, $3) RETURNING *',
      [req.body.name, hashedPassword, req.body.email]
    );

    const { accessToken, refreshToken } = generateTokens(
      result.rows[0]
      );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)',
      [refreshToken, result.rows[0].id, expiresAt]
    );

        res.status(201).json({ success: true, data: { accessToken, refreshToken } });

  } catch (error) {
      console.error('FULL ERROR:', error);
    res.status(500).json({ success : false, error : error.message})
  }
})

router.post('/login', async (req,res) => {
  try {
    const checkEmail = await pool.query(
      'SELECT * FROM users WHERE email = $1', [req.body.email]
    )


    if (checkEmail.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, checkEmail.rows[0].password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateTokens(
      checkEmail.rows[0]
    );
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)',
      [refreshToken, checkEmail.rows[0].id, expiresAt]
    );

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

router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ success: false, error: 'No refresh token provided' });
    }

    const tokenRecord = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );

    if (tokenRecord.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
    }

    const user = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [tokenRecord.rows[0].user_id]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.rows[0]);

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

router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'No refresh token provided' });
    }

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
