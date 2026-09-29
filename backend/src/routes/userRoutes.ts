import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createBookingSchema } from '../dto/booking.schema';
import { userContainer } from '../di/user.di';
import { bookingContainer } from '../di/booking.di';

const router = Router();
const { userController } = userContainer();
const { bookingController } = bookingContainer();

router.use(authenticate);

router.get('/me', userController.getCurrentUser);
router.post('/bookings', validate(createBookingSchema), bookingController.createBooking);
router.get('/bookings', bookingController.getUserBookings);

export { router as userRoutes };
