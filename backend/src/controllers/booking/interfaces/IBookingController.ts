import { Request, Response, NextFunction } from 'express';

export interface IBookingController {
  createBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserBookings(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProviderBookings(req: Request, res: Response, next: NextFunction): Promise<void>;
  getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void>;
}
