const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/config');
var loginRoute = express.Router();

require('dotenv').config();

loginRoute.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if the email exists in the database
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Check if the password is correct
  if (password !== user.password) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  // Generate a JWT token
  const token = jwt.sign({ email: user.email, role: user.role }, process.env.SECRET_KEY, { expiresIn: '12h' });

  // Return the token to the client
  res.json({ token, email: user.email, id: user.id, role: user.role });
});

module.exports = loginRoute;