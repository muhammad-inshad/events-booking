import { Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { Service } from '../models/Service';
import { AppError } from '../errors/AppError';

export const createUserBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { serviceId, startDate, endDate, totalPrice } = req.body;

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    // Validate service exists
    const service = await Service.findById(serviceId);
    if (!service) throw new AppError('Service not found', 404);

    // Check for overlapping bookings
    const overlapping = await Booking.findOne({
      serviceId,
      $or: [
        { startDate: { $lte: eDate }, endDate: { $gte: sDate } }
      ]
    });

    if (overlapping) {
      throw new AppError('Service is already booked for these dates', 400);
    }

    const booking = await Booking.create({
      userId,
      serviceId,
      startDate: sDate,
      endDate: eDate,
      totalPrice
    });

    res.status(201).json({ status: 'success', data: booking });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError('Unauthorized', 401);

    const bookings = await Booking.find({ userId })
      .populate('serviceId', 'title category location')
      .sort({ startDate: -1 });

    res.status(200).json({ status: 'success', data: bookings });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
