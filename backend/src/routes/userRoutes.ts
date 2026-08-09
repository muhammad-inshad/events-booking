import { Router } from 'express';
import { createUserBooking, getUserBookings } from '../controllers/userController';
import jwt from 'jsonwebtoken';

const router = Router();

const authMiddleware = (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.use(authMiddleware);

router.post('/bookings', createUserBooking);
router.get('/bookings', getUserBookings);

export { router as userRoutes };
