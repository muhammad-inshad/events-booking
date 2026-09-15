import express, { Application, Request, Response } from 'express';
import { HttpStatus } from './constants/httpStatus';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './errors/AppError';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

import { authRoutes } from './routes/authRoutes';
import { serviceRoutes } from './routes/serviceRoutes';
import { publicRoutes } from './routes/publicRoutes';
import { userRoutes } from './routes/userRoutes';
import { adminRoutes } from './routes/adminRoutes';
import { categoryRoutes } from './routes/categoryRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', (req: Request, res: Response) => {
  res.status(HttpStatus.OK).json({ success: true, message: 'Server is healthy' });
});

app.use((req: Request, res: Response, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, HttpStatus.NOT_FOUND));
});


app.use(errorHandler);

export default app;
