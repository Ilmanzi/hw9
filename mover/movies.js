const express = require('express');
const pool = require('../config/config');
const app = express();
const movieRoute = express.Router();
const authorize = require('../config/authen')

/**
 * @swagger
 * /Movies:
 *   get:
 *     summary: Retrieve a list of movies
 *     description: Retrieve a paginated list of movies
 *     tags:
 *       - Movies
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number of the result set
 *     responses:
 *       200:
 *         description: A paginated list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

movieRoute.get('/movies', authorize, async (req, res) => {
    try {
      const result = await pool.query('SELECT * from movies');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.send('Error ' + err);
    }
  });

  /**
 * @swagger
 * /movies/{numberpage}:
 *   get:
 *     summary: Get a paginated list of movies
 *     description: Returns a paginated list of movies
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: numberpage
 *         description: The page number to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         description: The page number to retrieve
 *         required: false
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovieList'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

movieRoute.get('/movies/:numberpage', authorize, async (req, res) => {
    const page = parseInt(req.query.page) || req.params.numberpage;
    const limit = 10;
    const offset = (page - 1) * limit;
  
      try {
        const result = await pool.query('SELECT * from movies ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.send('Error ' + err);
      }
    });

    /**
 * @swagger
 * /movies/add:
 *   post:
 *     summary: Add a new movie
 *     tags:
 *       - Movies
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the movie.
 *                 example: "The Shawshank Redemption"
 *               genres:
 *                 type: string
 *                 description: The genres of the movie, separated by commas.
 *                 example: "Drama, Crime"
 *               year:
 *                 type: integer
 *                 description: The release year of the movie.
 *                 example: 1994
 *     responses:
 *       201:
 *         description: Movie added successfully.
 *       400:
 *         description: Input field is empty.
 *       401:
 *         description: Unauthorized user.
 *       500:
 *         description: Internal server error.
 */

movieRoute.post('/movies/add', authorize, async (req, res) => {
  const {title, genres, year } = req.body;

  if (!title || !genres || !year) {
    return res.status(400).json({ error: 'Input field kosong'})
  };

    try {
      const query = {
        text: 'INSERT INTO movies(title, genres, year) VALUES($1, $2, $3)',
        values: [title, genres, year],
      }

      await pool.query(query)
      res.status(201).send('Movies berhasil ditambah');

    } catch (err) {
      console.error(err);
      res.send('Error ' + err);
    }
  });

  /**
 * @swagger
 * /movies/del/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the movie to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The movie was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: Movie berhasil dihapus
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: The movie with the specified ID was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message
 *                   example: Movie tidak ditemukan
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message
 *                   example: Internal server error
 */

movieRoute.delete('/movies/del/:id', authorize, async (req, res) => {
    const { id } = req.params;

    try {
      const result = await pool.query('DELETE FROM movies WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Movie tidak ditemukan'});
      }
      res.json({ message: 'Movie berhasil dihapus'});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server eror'})
    }
  })

  /**
 * @swagger
 * /movies/put/{id}:
 *   put:
 *     summary: Update a movie by ID
 *     description: Update a movie by ID
 *     tags:
 *       - Movies
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the movie to update
 *       - in: body
 *         name: movie
 *         description: The movie to update
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - genres
 *             - year
 *           properties:
 *             title:
 *               type: string
 *             genres:
 *               type: string
 *             year:
 *               type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       400:
 *         description: Invalid input fields
 *       401:
 *         description: Unauthorized user
 *       500:
 *         description: Internal server error
 */

movieRoute.put('/movies/put/:id', authorize, async (req, res) => {
    const id = req.params.id;
    const { title, genres, year } = req.body;

    try {
      const query = {
        text: 'UPDATE movies SET title=$1, genres=$2, year=$3 WHERE id=$4',
        values: [title, genres, year, id]
      };
      const result = await pool.query(query);
      res.json({ message: 'Movie telah diperbaharui'})
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error'})
    }
  })

  module.exports = movieRoute;