import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createServiceSchema, serviceIdParamSchema } from '../dto/service.schema';
import { 
  getServices, 
  createService, 
  updateService, 
  deleteService, 
  getAdminBookings,
  getDashboardStats
} from '../controllers/serviceController';
import { upload } from '../middleware/upload';

const router = Router();

// Public endpoint
router.get('/', getServices);

// Protected endpoints for provider
router.use(authenticate);
router.use(authorize('admin', 'event_owner'));

router.post('/', upload.single('imageFile'), validate(createServiceSchema), createService);
router.put('/:id', upload.single('imageFile'), updateService);
router.delete('/:id', validate(serviceIdParamSchema), deleteService);
router.get('/bookings', getAdminBookings);
router.get('/dashboard-stats', getDashboardStats);

export { router as serviceRoutes };
