import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CredExis API Documentation',
      version: '1.0.0',
      description: 'API documentation for CredExis backend services',
      contact: {
        name: 'CredExis Support',
        email: 'support@credexis.com',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3001',
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options); 