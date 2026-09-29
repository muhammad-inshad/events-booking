import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createServiceSchema, serviceIdParamSchema } from '../dto/service.schema';
import { serviceContainer } from '../di/service.di';
import { bookingContainer } from '../di/booking.di';
import { upload } from '../middleware/upload';

const router = Router();
const { serviceController } = serviceContainer();
const { bookingController } = bookingContainer();

// Public endpoint
router.get('/', serviceController.getServices);

// Protected endpoints for provider
router.use(authenticate);
router.use(authorize('admin', 'event_owner'));

router.post('/', upload.single('imageFile'), validate(createServiceSchema), serviceController.createService);
router.put('/:id', upload.single('imageFile'), serviceController.updateService);
router.delete('/:id', validate(serviceIdParamSchema), serviceController.deleteService);
router.get('/bookings', bookingController.getProviderBookings);
router.get('/dashboard-stats', bookingController.getDashboardStats);

export { router as serviceRoutes };
