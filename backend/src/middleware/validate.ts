import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { HttpStatus } from '../constants/httpStatus';

/**
 * Generic validation middleware using Zod.
 * Validates req.body, req.params, and req.query against the provided schema.
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });
    }

    next();
  };
};
