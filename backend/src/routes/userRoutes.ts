import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createBookingSchema } from '../dto/booking.schema';
import { createUserBooking, getUserBookings, getCurrentUser } from '../controllers/userController';

const router = Router();

router.use(authenticate);

router.get('/me', getCurrentUser);
router.post('/bookings', validate(createBookingSchema), createUserBooking);
router.get('/bookings', getUserBookings);

export { router as userRoutes };
