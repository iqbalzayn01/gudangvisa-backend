import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './modules/auth/auth.routes';
import trackingRoutes from './modules/tracking/tracking.routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import { AppError } from './utils/AppError';
import fs from 'fs';

const app: Application = express();

if (!fs.existsSync('src/uploads')) {
  fs.mkdirSync('src/uploads', { recursive: true });
}

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tracking', trackingRoutes);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      404,
      `Route ${req.originalUrl} tidak ditemukan pada server ini!`,
    ),
  );
});

app.get('/', (_req, res) => {
  res.json({ message: 'Gudangvisa API is running 🚀' });
});

app.use(globalErrorHandler);

export default app;
