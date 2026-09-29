import { Types } from 'mongoose';
import { HttpStatus } from '../../../constants/httpStatus';
import { AppError } from '../../../errors/AppError';
import { ICategory } from '../../../models/Category';
import { ICategoryRepository } from '../../../repositories/category/interfaces/ICategoryRepository';
import { ICategoryService } from '../interfaces/ICategoryService';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../../../dto/category.dto';

export class CategoryService implements ICategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async getPublicCategoryNames(): Promise<string[]> {
    return await this.categoryRepository.findDistinctNames();
  }

  async getCategoriesForAdmin(adminId: string): Promise<ICategory[]> {
    return await this.categoryRepository.findByAdmin(adminId);
  }

  async createCategory(adminId: string, dto: CreateCategoryDTO): Promise<ICategory> {
    const existing = await this.categoryRepository.findByNameForAdmin(adminId, dto.name);
    if (existing) {
      throw new AppError('Category already exists', HttpStatus.BAD_REQUEST);
    }

    return await this.categoryRepository.create({ name: dto.name, adminId: new Types.ObjectId(adminId) });
  }

  async updateCategory(id: string, adminId: string, dto: UpdateCategoryDTO): Promise<ICategory> {
    const category = await this.categoryRepository.updateForAdmin(id, adminId, { name: dto.name });
    if (!category) {
      throw new AppError('Category not found or unauthorized', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async deleteCategory(id: string, adminId: string): Promise<void> {
    const category = await this.categoryRepository.deleteForAdmin(id, adminId);
    if (!category) {
      throw new AppError('Category not found or unauthorized', HttpStatus.NOT_FOUND);
    }
  }
}
