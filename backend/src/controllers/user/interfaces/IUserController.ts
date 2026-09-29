import { Request, Response, NextFunction } from 'express';

export interface IUserController {
  getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}
