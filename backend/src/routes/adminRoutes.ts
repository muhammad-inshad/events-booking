import { Router } from 'express';
import { HttpStatus } from '../constants/httpStatus';
import { getUsers, updateUserRole, toggleUserBlock } from '../controllers/adminController';
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

const adminMiddleware = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Admin access required' });
  }
  next();
};

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/block', toggleUserBlock);

export { router as adminRoutes };
