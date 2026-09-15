import { Request, Response } from 'express';
import { HttpStatus } from '../constants/httpStatus';
import { Booking } from '../models/Booking';
import { Service } from '../models/Service';
import { UserModel } from '../models/User';
import { AppError } from '../errors/AppError';

export const createUserBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);

    const { serviceId, startDate, endDate, totalPrice, guests } = req.body;

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    
    const service = await Service.findById(serviceId);
    if (!service) throw new AppError('Service not found', HttpStatus.NOT_FOUND);

    const overlapping = await Booking.findOne({
      serviceId,
      $or: [
        { startDate: { $lte: eDate }, endDate: { $gte: sDate } }
      ]
    });

    if (overlapping) {
      throw new AppError('Service is already booked for these dates', HttpStatus.BAD_REQUEST);
    }

    const booking = await Booking.create({
      userId,
      serviceId,
      startDate: sDate,
      endDate: eDate,
      totalPrice,
      guests: guests || 1
    });

    res.status(HttpStatus.CREATED).json({ status: 'success', data: booking });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ status: 'error', message: error.message });
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);

    const bookings = await Booking.find({ userId })
      .populate('serviceId', 'title category location')
      .sort({ startDate: -1 });

    res.status(HttpStatus.OK).json({ status: 'success', data: bookings });
  } catch (error: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);

    const user = await UserModel.findById(userId).select('-password');
    if (!user) throw new AppError('User not found', HttpStatus.NOT_FOUND);

    res.status(HttpStatus.OK).json({ status: 'success', data: user });
  } catch (error: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: error.message });
  }
};
