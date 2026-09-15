import { Router } from 'express';
import { HttpStatus } from '../constants/httpStatus';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getPublicCategories 
} from '../controllers/categoryController';
import jwt from 'jsonwebtoken';

const router = Router();

const authMiddleware = (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
  }
};

const providerMiddleware = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'event_owner') {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Event Owner or Admin access required' });
  }
  next();
};

// Public endpoint
router.get('/public', getPublicCategories);

// Protected endpoints for provider
router.use(authMiddleware);
router.use(providerMiddleware);

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export { router as categoryRoutes };
