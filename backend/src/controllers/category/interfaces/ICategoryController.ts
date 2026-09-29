import { Request, Response, NextFunction } from 'express';

export interface ICategoryController {
  getPublicCategories(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCategories(req: Request, res: Response, next: NextFunction): Promise<void>;
  createCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
}
