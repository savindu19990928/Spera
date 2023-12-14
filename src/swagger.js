const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');

const doc = express();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Spera Labs CryptoAPI',
    version: '1.0.0',
  },
  security: [{
    bearerAuth: [],
  }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

doc.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = doc;
