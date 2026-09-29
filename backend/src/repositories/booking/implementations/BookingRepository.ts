import { Types } from 'mongoose';
import { BaseRepository } from '../../base/implementations/BaseRepository';
import { IBookingRepository } from '../interfaces/IBookingRepository';
import { Booking, IBooking } from '../../../models/Booking';

export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {
  constructor() {
    super(Booking);
  }

  async findOverlapping(serviceId: string, startDate: Date, endDate: Date): Promise<IBooking | null> {
    return await this._model
      .findOne({
        serviceId,
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      })
      .exec();
  }

  async findOverlappingServiceIds(startDate: Date, endDate: Date): Promise<Types.ObjectId[]> {
    const bookings = await this._model
      .find({ startDate: { $lte: endDate }, endDate: { $gte: startDate } })
      .select('serviceId')
      .exec();

    return bookings.map((booking) => booking.serviceId as Types.ObjectId);
  }

  async findByUser(userId: string): Promise<IBooking[]> {
    return await this._model
      .find({ userId })
      .populate('serviceId', 'title category location')
      .sort({ startDate: -1 })
      .exec();
  }

  async findByServiceIds(serviceIds: Types.ObjectId[], skip: number, limit: number): Promise<IBooking[]> {
    return await this._model
      .find({ serviceId: { $in: serviceIds } })
      .populate('serviceId', 'title')
      .populate('userId', 'name email')
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async countByServiceIds(serviceIds: Types.ObjectId[]): Promise<number> {
    return await this._model.countDocuments({ serviceId: { $in: serviceIds } }).exec();
  }

  async findByServiceIdsSince(serviceIds: Types.ObjectId[], since: Date): Promise<IBooking[]> {
    return await this._model
      .find({ serviceId: { $in: serviceIds }, createdAt: { $gte: since } })
      .sort({ createdAt: 1 })
      .exec();
  }
}
