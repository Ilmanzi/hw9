const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/config');

const registerRoute = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *             example:
 *               email: user@example.com
 *               gender: male
 *               password: Password123
 *               role: user
 *     responses:
 *       '200':
 *         description: Successfully registered a new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                 gender:
 *                   type: string
 *                   enum: [male, female, other]
 *                 role:
 *                   type: string
 *                   enum: [user, admin]
 *                 id:
 *                   type: number
 *               example:
 *                 email: user@example.com
 *                 gender: male
 *                 role: user
 *                 id: 1
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal server error
 */

registerRoute.post('/register', async(req,res) => {
    try {
        const { email, gender, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO users (email, gender, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
            [email, gender, hashedPassword, role]
        );
        const user = {email, gender, role, id: result.rows[0].id};
        res.json(user);
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error'})
    }
});

module.exports = registerRoute