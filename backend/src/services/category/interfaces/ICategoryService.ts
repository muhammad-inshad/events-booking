import { ICategory } from '../../../models/Category';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../../../dto/category.dto';

export interface ICategoryService {
  getPublicCategoryNames(): Promise<string[]>;
  getCategoriesForAdmin(adminId: string): Promise<ICategory[]>;
  createCategory(adminId: string, dto: CreateCategoryDTO): Promise<ICategory>;
  updateCategory(id: string, adminId: string, dto: UpdateCategoryDTO): Promise<ICategory>;
  deleteCategory(id: string, adminId: string): Promise<void>;
}
