const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['../starter.js']; // Replace './app.js' with the path to your Express.js application file

const doc = {
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'Description of your API',
    },
    host: 'localhost:3000', // Replace with your API's hostname and port
    basePath: '/',
    schemes: ['http', 'https'], // Specify the protocols used by your API
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    security: [{ bearerAuth: [] }],
  };

swaggerAutogen(outputFile, endpointsFiles, doc);
