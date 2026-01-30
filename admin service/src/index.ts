import express from 'express';
import dotenv from 'dotenv';
import sql from './lib/db.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './lib/swagger.js';
import adminRoutes from './routes/admin.route.js';
import cloudinary from 'cloudinary';
import redis from 'redis';

const app = express();
dotenv.config();

export const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD || "",
  socket: {
    host: "redis-19030.crce263.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 19030
  }
});

redisClient.connect().then(() => {
  console.log("Connected to Redis");
}).catch((error) => {
  console.error("Redis connection error:", error);
});

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary environment variables are not set. Please check your .env file.');
}

cloudinary.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
});
app.use(express.json());
app.use(cors(
    {
        origin: '*',
        credentials: true,
    }
));

async function initDB() {
    // Database initialization logic can be added here
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS albums (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumnail VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        )
        `;
         await sql`
        CREATE TABLE IF NOT EXISTS songs (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumnail VARCHAR(255),
            audio VARCHAR(255) NOT NULL,
            album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        )
        `;
        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
        
    }
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', adminRoutes);

const PORT = process.env.PORT || 5000;

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Admin service is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to start server:", error);
});