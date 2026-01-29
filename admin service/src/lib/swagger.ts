import swaggerjsdoc from 'swagger-jsdoc';

const options: swaggerjsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Spotify Clone',
            version: '1.0.0',
            description: 'API documentation for the Admin Service',
        },
        servers: [{url: 'http://localhost:7000'}],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{bearerAuth: []}],
    },
    apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerjsdoc(options);

export default swaggerjsdoc;