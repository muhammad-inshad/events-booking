import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../constants/httpStatus';
import { AppError } from '../errors/AppError';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = HttpStatus.BAD_REQUEST;
    message = err.message;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = HttpStatus.UNAUTHORIZED;
    message = 'Invalid token. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = HttpStatus.UNAUTHORIZED;
    message = 'Your token has expired! Please log in again.';
  }

  // Log error in development or if it's not operational
  if (process.env.NODE_ENV === 'development' || !(err instanceof AppError) || !err.isOperational) {
    console.error('ERROR 💥:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
