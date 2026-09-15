import { HttpStatus } from '../constants/httpStatus';

export class AppError extends Error {
  public readonly statusCode: HttpStatus;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: HttpStatus, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
