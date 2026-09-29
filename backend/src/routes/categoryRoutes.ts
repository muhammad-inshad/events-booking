import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCategorySchema, categoryIdParamSchema } from '../dto/category.schema';
import { categoryContainer } from '../di/category.di';

const router = Router();
const { categoryController } = categoryContainer();

// Public endpoint
router.get('/public', categoryController.getPublicCategories);

// Protected endpoints for provider
router.use(authenticate);
router.use(authorize('admin', 'event_owner'));

router.get('/', categoryController.getCategories);
router.post('/', validate(createCategorySchema), categoryController.createCategory);
router.put('/:id', validate(categoryIdParamSchema), categoryController.updateCategory);
router.delete('/:id', validate(categoryIdParamSchema), categoryController.deleteCategory);

export { router as categoryRoutes };
