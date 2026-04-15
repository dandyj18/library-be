'use strict';

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'API documentation for Library App',
    },
    servers: [
      {
        url: '/',
        description: 'Current server origin',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/algoritma/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
