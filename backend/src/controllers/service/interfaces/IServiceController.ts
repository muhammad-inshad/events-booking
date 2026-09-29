import { Request, Response, NextFunction } from 'express';

export interface IServiceController {
  getServices(req: Request, res: Response, next: NextFunction): Promise<void>;
  createService(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateService(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteService(req: Request, res: Response, next: NextFunction): Promise<void>;
}
