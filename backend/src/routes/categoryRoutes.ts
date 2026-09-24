import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCategorySchema, categoryIdParamSchema } from '../dto/category.schema';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getPublicCategories 
} from '../controllers/categoryController';

const router = Router();

// Public endpoint
router.get('/public', getPublicCategories);

// Protected endpoints for provider
router.use(authenticate);
router.use(authorize('admin', 'event_owner'));

router.get('/', getCategories);
router.post('/', validate(createCategorySchema), createCategory);
router.put('/:id', validate(categoryIdParamSchema), updateCategory);
router.delete('/:id', validate(categoryIdParamSchema), deleteCategory);

export { router as categoryRoutes };
