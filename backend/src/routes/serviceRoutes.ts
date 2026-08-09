import { Router } from 'express';
import { 
  getServices, 
  createService, 
  updateService, 
  deleteService, 
  getAdminBookings 
} from '../controllers/serviceController';
import jwt from 'jsonwebtoken';
import { upload } from '../middleware/upload';

const router = Router();

// Simple auth middleware for now
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

const adminMiddleware = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Public routes
router.get('/', getServices);

// Admin only routes
router.use(authMiddleware);
router.use(adminMiddleware);

router.post('/', upload.single('imageFile'), createService);
router.put('/:id', upload.single('imageFile'), updateService);
router.delete('/:id', deleteService);
router.get('/bookings', getAdminBookings);

export { router as serviceRoutes };
