const express = require('express');
const pool = require('../config/config');
const app = express();
const userRoute = express.Router();
const authorize = require('../config/authen')

userRoute.get('/users', authorize, async (req, res) => {
    try {
      const result = await pool.query('SELECT * from users');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.send('Error ' + err);
    }
  });

userRoute.get('/users/:numberpage', authorize, async (req, res) => {
    const page = parseInt(req.query.page) || req.params.numberpage;
    const limit = 10;
    const offset = (page - 1) * limit;
  
      try {
        const result = await pool.query('SELECT * from users ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.send('Error ' + err);
      }
    });

  module.exports = userRoute;

  