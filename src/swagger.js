const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');

const doc = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Spera Labs Cryptocurrency API',
      version: '1.0.0',
      description: 'API documentation for the Cryptocurrency project',
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);

doc.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = doc;
