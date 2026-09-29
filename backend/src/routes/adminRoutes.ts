import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateRoleSchema, toggleBlockSchema } from '../dto/admin.schema';
import { userContainer } from '../di/user.di';

const router = Router();
const { adminController } = userContainer();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/users', adminController.getUsers);
router.put('/users/:id/role', validate(updateRoleSchema), adminController.updateUserRole);
router.put('/users/:id/block', validate(toggleBlockSchema), adminController.toggleUserBlock);

export { router as adminRoutes };
