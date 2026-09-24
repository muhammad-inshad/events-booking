import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpStatus } from '../constants/httpStatus';
import { UserModel } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

/**
 * Verifies JWT token AND checks if user still exists / is not blocked.
 * Attaches { id, role } to req.user on success.
 */
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No token provided' });
    }
    const jwtSecret: string = String(process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Server configuration error' });
    }
    const decoded = jwt.verify(token, jwtSecret) as unknown as { id: string; role: string };

    // Verify user still exists and is not blocked
    const user = await UserModel.findById(decoded.id).select('role isBlocked');
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'User no longer exists' });
    }
    if (user.isBlocked) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Your account has been suspended' });
    }

    req.user = { id: String(user._id), role: user.role };
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Token expired. Please log in again.' });
    }
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
  }
};

/**
 * Role-based authorization. Must be used AFTER authenticate.
 * Usage: authorize('admin', 'event_owner')
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};
