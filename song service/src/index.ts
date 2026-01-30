import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './lib/swagger.js';
import songRoutes from './routes/song.route.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true,
}));

const PORT = process.env.PORT || 5000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', songRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});