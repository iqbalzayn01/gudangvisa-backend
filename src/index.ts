import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRoutes from './routes/api';
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
app.use('/api', apiRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'Gudangvisa API is running 🚀' });
});

export default app;
