import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './modules/auth/auth.routes.js';
import trackingRoutes from './modules/tracking/tracking.routes.js';
import documentRoutes from './modules/documents/documents.routes.js';
import userRoutes from './modules/users/users.routes.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { AppError } from './utils/AppError.js';
import path from 'path';
import fs from 'fs';

const app: Application = express();

const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Global Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use('/uploads', express.static(uploadDir));

// Base Route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Gudang Visa API is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tracking', trackingRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/users', userRoutes);

// 404 Catch-All Route
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

export default app;
