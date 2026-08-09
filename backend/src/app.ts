import express, { Application, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './errors/AppError';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow frontend to load images
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

import { authRoutes } from './routes/authRoutes';
import { serviceRoutes } from './routes/serviceRoutes';
import { publicRoutes } from './routes/publicRoutes';
import { userRoutes } from './routes/userRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/user', userRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

app.use((req: Request, res: Response, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


app.use(errorHandler);

export default app;
