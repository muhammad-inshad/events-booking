import { Request, Response, NextFunction } from 'express';

export interface IAdminController {
  getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleUserBlock(req: Request, res: Response, next: NextFunction): Promise<void>;
}
