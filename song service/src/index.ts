import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './lib/swagger.js';
import songRoutes from './routes/song.route.js';
import redis from 'redis';

dotenv.config();

export const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD || "",
  socket: {
    host: process.env.REDIS_HOST || "redis-19030.crce263.ap-south-1-1.ec2.cloud.redislabs.com",
    port: parseInt(process.env.REDIS_PORT || "19030")
  }
});

redisClient.connect().then(() => {
  console.log("Connected to Redis");
}).catch((err) => {
  console.error("Redis connection error:", err);
});

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

const PORT = process.env.PORT || 5000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', songRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});