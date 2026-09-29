import { Response, NextFunction } from 'express';
import { HttpStatus } from '../../../constants/httpStatus';
import { AppError } from '../../../errors/AppError';
import { AuthRequest } from '../../../middleware/auth';
import { ICategoryService } from '../../../services/category/interfaces/ICategoryService';
import { ICategoryController } from '../interfaces/ICategoryController';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../../../dto/category.dto';

const getRequiredUserId = (req: AuthRequest): string => {
  if (!req.user) {
    throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
  return req.user.id;
};

export class CategoryController implements ICategoryController {
  constructor(private categoryService: ICategoryService) {}

  getPublicCategories = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.categoryService.getPublicCategoryNames();
      res.status(HttpStatus.OK).json({ status: 'success', data: categories });
    } catch (error) {
      next(error);
    }
  };

  getCategories = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = getRequiredUserId(req);
      const categories = await this.categoryService.getCategoriesForAdmin(adminId);
      res.status(HttpStatus.OK).json({ status: 'success', data: categories });
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = getRequiredUserId(req);
      const dto: CreateCategoryDTO = req.body;
      const category = await this.categoryService.createCategory(adminId, dto);
      res.status(HttpStatus.CREATED).json({ status: 'success', data: category });
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = getRequiredUserId(req);
      const { id } = req.params as { id: string };
      const dto: UpdateCategoryDTO = req.body;
      const category = await this.categoryService.updateCategory(id, adminId, dto);
      res.status(HttpStatus.OK).json({ status: 'success', data: category });
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = getRequiredUserId(req);
      const { id } = req.params as { id: string };
      await this.categoryService.deleteCategory(id, adminId);
      res.status(HttpStatus.OK).json({ status: 'success', message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
