import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateRoleSchema, toggleBlockSchema } from '../dto/admin.schema';
import { getUsers, updateUserRole, toggleUserBlock } from '../controllers/adminController';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.put('/users/:id/role', validate(updateRoleSchema), updateUserRole);
router.put('/users/:id/block', validate(toggleBlockSchema), toggleUserBlock);

export { router as adminRoutes };
