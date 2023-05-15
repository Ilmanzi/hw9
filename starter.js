const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
var morgan = require('morgan');

const swaggerDocument = require('./config/swagger_output.json'); // Replace with the path to your generated Swagger specification file
const routerMovies = require('./mover/movies.js');
const routerUsers = require('./mover/users.js');
const routerLogin = require('./mover/login')
const routerRegis = require('./mover/register')

const pool = require('./config/config');

const app = express();
const PORT = 3000 || process.env.PORT;

app.use(morgan('combined'))

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routerMovies)
app.use(routerUsers)
app.use(routerLogin)
app.use(routerRegis)

// const swaggerOptions =  {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Hw9',
//       version: '0.1.0'
//     },
//     servers: [
//       {
//         url: 'http://localhost:3000',
//         description: 'Local development server'
//       },
//     ],
//   },
//   apis: ['./mover/*']
// };
// const specs = swaggerJSDoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  });

  