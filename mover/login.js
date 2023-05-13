const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/config');
var loginRoute = express.Router();

require('dotenv').config();

// Define a Swagger schema for the JWT token
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Token:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 */

// Define a Swagger operation for the POST /login route
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     description: Log in a user and generate a JWT token.
 *     tags:
 *       - authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       '401':
 *         description: Invalid email or password
 */

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