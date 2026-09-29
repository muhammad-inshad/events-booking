import { Response, NextFunction } from 'express';
import { HttpStatus } from '../../../constants/httpStatus';
import { AppError } from '../../../errors/AppError';
import { AuthRequest } from '../../../middleware/auth';
import { IBookingService } from '../../../services/booking/interfaces/IBookingService';
import { IBookingController } from '../interfaces/IBookingController';
import { CreateBookingDTO } from '../../../dto/booking.dto';

const DEFAULT_PAGE_SIZE = 5;

const getRequiredUserId = (req: AuthRequest): string => {
  if (!req.user) {
    throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
  return req.user.id;
};

export class BookingController implements IBookingController {
  constructor(private bookingService: IBookingService) {}

  createBooking = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getRequiredUserId(req);
      const dto: CreateBookingDTO = req.body;
      const booking = await this.bookingService.createBooking(userId, dto);
      res.status(HttpStatus.CREATED).json({ status: 'success', data: booking });
    } catch (error) {
      next(error);
    }
  };

  getUserBookings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getRequiredUserId(req);
      const bookings = await this.bookingService.getBookingsForUser(userId);
      res.status(HttpStatus.OK).json({ status: 'success', data: bookings });
    } catch (error) {
      next(error);
    }
  };

  getProviderBookings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = getRequiredUserId(req);
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || DEFAULT_PAGE_SIZE;
      const result = await this.bookingService.getBookingsForProvider(adminId, page, limit);
      res.status(HttpStatus.OK).json({ status: 'success', ...result });
    } catch (error) {
      next(error);
    }
  };

  getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = getRequiredUserId(req);
      const stats = await this.bookingService.getDashboardStats(adminId);
      res.status(HttpStatus.OK).json({ status: 'success', data: stats });
    } catch (error) {
      next(error);
    }
  };
}
