import { Response } from 'express';
import { HttpStatus } from '../constants/httpStatus';

export const sendResponse = <T>(
  res: Response,
  statusCode: HttpStatus,
  success: boolean,
  message: string,
  data?: T
) => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};
