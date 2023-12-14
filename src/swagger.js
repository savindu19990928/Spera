const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');

const doc = express();

// const securitySchemes = {
//   BearerAuth: {
//     type: 'http',
//     in: 'header',
//     scheme: 'bearer',
//     bearerFormat: 'JWT',
//     name: 'Authorization',
//     description: 'Enter your JWT token in the format "Bearer {token}"',
//   }
// };

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Spera Labs Cryptocurrency API',
      version: '1.0.0',
      description: 'API documentation for the Spera Labs Cryptocurrency API',
    }
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);

doc.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = doc;
