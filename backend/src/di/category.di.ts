import { CategoryRepository } from '../repositories/category/implementations/CategoryRepository';
import { CategoryService } from '../services/category/implementations/CategoryService';
import { CategoryController } from '../controllers/category/implementations/CategoryController';

export const categoryContainer = () => {
  const categoryRepository = new CategoryRepository();
  const categoryService = new CategoryService(categoryRepository);
  const categoryController = new CategoryController(categoryService);

  return {
    categoryRepository,
    categoryService,
    categoryController
  };
};
