import { HttpStatus } from '../../../constants/httpStatus';
import { AppError } from '../../../errors/AppError';
import { IBooking } from '../../../models/Booking';
import { IBookingRepository } from '../../../repositories/booking/interfaces/IBookingRepository';
import { IServiceRepository } from '../../../repositories/service/interfaces/IServiceRepository';
import { IBookingService } from '../interfaces/IBookingService';
import { CreateBookingDTO, DashboardStatPoint } from '../../../dto/booking.dto';
import { PaginatedResult } from '../../../dto/pagination.dto';

const DASHBOARD_MONTH_WINDOW = 6;
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const monthKey = (date: Date): string => `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;

export class BookingService implements IBookingService {
  constructor(
    private bookingRepository: IBookingRepository,
    private serviceRepository: IServiceRepository
  ) {}

  async createBooking(userId: string, dto: CreateBookingDTO): Promise<IBooking> {
    const { serviceId, startDate, endDate, guests } = dto;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new AppError('End date must be after start date', HttpStatus.BAD_REQUEST);
    }

    const service = await this.serviceRepository.findById(serviceId);
    if (!service) {
      throw new AppError('Service not found', HttpStatus.NOT_FOUND);
    }

    const overlapping = await this.bookingRepository.findOverlapping(serviceId, start, end);
    if (overlapping) {
      throw new AppError('Service is already booked for these dates', HttpStatus.BAD_REQUEST);
    }

    // Calculate price server-side to prevent price manipulation
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const totalPrice = days * service.pricePerDay;

    return await this.bookingRepository.create({
      userId,
      serviceId,
      startDate: start,
      endDate: end,
      totalPrice,
      guests: guests ?? 1,
    } as unknown as Partial<IBooking>);
  }

  async getBookingsForUser(userId: string): Promise<IBooking[]> {
    return await this.bookingRepository.findByUser(userId);
  }

  async getBookingsForProvider(adminId: string, page: number, limit: number): Promise<PaginatedResult<IBooking>> {
    const serviceIds = await this.serviceRepository.findIdsByAdmin(adminId);
    const skip = (page - 1) * limit;

    const [total, bookings] = await Promise.all([
      this.bookingRepository.countByServiceIds(serviceIds),
      this.bookingRepository.findByServiceIds(serviceIds, skip, limit),
    ]);

    return {
      data: bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit) || 1,
        totalItems: total,
      },
    };
  }

  async getDashboardStats(adminId: string): Promise<DashboardStatPoint[]> {
    const serviceIds = await this.serviceRepository.findIdsByAdmin(adminId);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - DASHBOARD_MONTH_WINDOW);

    const bookings = await this.bookingRepository.findByServiceIdsSince(serviceIds, sixMonthsAgo);

    const monthlyStats: Record<string, number> = {};
    for (let i = DASHBOARD_MONTH_WINDOW - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      monthlyStats[monthKey(d)] = 0;
    }

    bookings.forEach((booking) => {
      const key = monthKey(new Date(booking.createdAt));
      const current = monthlyStats[key];
      if (current !== undefined) {
        monthlyStats[key] = current + 1;
      }
    });

    return Object.entries(monthlyStats).map(([name, count]) => ({ name, bookings: count }));
  }
}
