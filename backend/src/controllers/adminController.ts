import { Request, Response } from 'express';
import { HttpStatus } from '../constants/httpStatus';
import { UserModel as User } from '../models/User';
import { AppError } from '../errors/AppError';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(HttpStatus.OK).json({ status: 'success', data: users });
  } catch (error: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'event_owner', 'admin'].includes(role)) {
      throw new AppError('Invalid role', HttpStatus.BAD_REQUEST);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    res.status(HttpStatus.OK).json({ status: 'success', data: user });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ status: 'error', message: error.message });
  }
};

export const toggleUserBlock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    if (typeof isBlocked !== 'boolean') {
      throw new AppError('isBlocked must be a boolean', HttpStatus.BAD_REQUEST);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    res.status(HttpStatus.OK).json({ status: 'success', data: user });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ status: 'error', message: error.message });
  }
};
