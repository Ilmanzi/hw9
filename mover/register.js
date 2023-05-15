const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/config');

const registerRoute = express.Router();

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