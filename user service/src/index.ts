import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './lib/db.js';
import { getRedisClient } from './lib/redis.js';
import userRoutes from './routes/user.route.js';
import paymentRoutes from './routes/payment.route.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './lib/swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors(
    {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    }
));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);

connectDB().then(async () => {
    // Initialize Redis connection
    await getRedisClient();
    console.log('✓ Redis cache connected successfully');
    
    app.listen(PORT, () => {
        console.log(`✓ Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('✗ Failed to start server:', error);
});