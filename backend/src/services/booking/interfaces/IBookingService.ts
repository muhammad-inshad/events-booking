import { IBooking } from '../../../models/Booking';
import { CreateBookingDTO, DashboardStatPoint } from '../../../dto/booking.dto';
import { PaginatedResult } from '../../../dto/pagination.dto';

export interface IBookingService {
  createBooking(userId: string, dto: CreateBookingDTO): Promise<IBooking>;
  getBookingsForUser(userId: string): Promise<IBooking[]>;
  getBookingsForProvider(adminId: string, page: number, limit: number): Promise<PaginatedResult<IBooking>>;
  getDashboardStats(adminId: string): Promise<DashboardStatPoint[]>;
}
