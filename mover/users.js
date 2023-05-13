const express = require('express');
const pool = require('../config/config');
const app = express();
const userRoute = express.Router();
const authorize = require('../config/authen')

// Define a Swagger schema for the User object
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 */

// Define a Swagger operation for the GET /users route
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users
 *     description: Retrieve a list of all users from the database.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token to authorize access to the API.
 *     responses:
 *       '200':
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized access to the API.
 */

userRoute.get('/users', authorize, async (req, res) => {
    try {
      const result = await pool.query('SELECT * from users');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.send('Error ' + err);
    }
  });

  /**
 * @swagger
 * /users/{numberpage}:
 *   get:
 *     summary: Get a list of users with pagination
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: numberpage
 *         schema:
 *           type: integer
 *         required: true
 *         description: Page number to retrieve
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number to retrieve, overrides the path parameter
 *     responses:
 *       200:
 *         description: A list of users with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

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

  