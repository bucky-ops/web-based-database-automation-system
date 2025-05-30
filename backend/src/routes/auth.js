const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Register endpoint
router.post(
  '/register',
  [
    body('username').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;
    try {
      // Check if user exists
      const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userCheck.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      // Insert user
      const newUser = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, role',
        [username, email, password_hash]
      );
      // Generate JWT
      const token = jwt.sign(
        { userId: newUser.rows[0].id, role: newUser.rows[0].role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      res.status(201).json({ user: newUser.rows[0], token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login endpoint
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userRes.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const user = userRes.rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role }, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router; 