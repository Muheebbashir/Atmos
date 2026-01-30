import swaggerjsdoc from 'swagger-jsdoc';

const options: swaggerjsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Spotify Clone',
            version: '1.0.0',
            description: 'API documentation for the Song Service',
        },
        servers: [{url: 'http://localhost:8000'}],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Album: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Album Title' },
                        description: { type: 'string', example: 'Album description' },
                        thumnail: { type: 'string', example: 'https://example.com/image.jpg' },
                        created_at: { type: 'string', format: 'date-time', example: '2026-01-30T12:00:00Z' },
                    },
                },
                Song: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Song Title' },
                        description: { type: 'string', example: 'Song description' },
                        thumnail: { type: 'string', example: 'https://example.com/song.jpg' },
                        audio: { type: 'string', example: 'https://example.com/audio.mp3' },
                        album_id: { type: 'integer', example: 1, nullable: true },
                        created_at: { type: 'string', format: 'date-time', example: '2026-01-30T12:00:00Z' },
                    },
                },
            },
        },
        security: [{bearerAuth: []}],
    },
    apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerjsdoc(options);

export default swaggerjsdoc;