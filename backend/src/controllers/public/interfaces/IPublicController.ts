import { Request, Response, NextFunction } from 'express';

export interface IPublicController {
  getServiceCategories(req: Request, res: Response, next: NextFunction): Promise<void>;
  getPublicServices(req: Request, res: Response, next: NextFunction): Promise<void>;
  getPublicServiceById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
