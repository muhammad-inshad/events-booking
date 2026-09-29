import { Types } from 'mongoose';
import { IBaseRepository } from '../../base/interfaces/IBaseRepository';
import { IBooking } from '../../../models/Booking';

export interface IBookingRepository extends IBaseRepository<IBooking> {
  findOverlapping(serviceId: string, startDate: Date, endDate: Date): Promise<IBooking | null>;
  findOverlappingServiceIds(startDate: Date, endDate: Date): Promise<Types.ObjectId[]>;
  findByUser(userId: string): Promise<IBooking[]>;
  findByServiceIds(serviceIds: Types.ObjectId[], skip: number, limit: number): Promise<IBooking[]>;
  countByServiceIds(serviceIds: Types.ObjectId[]): Promise<number>;
  findByServiceIdsSince(serviceIds: Types.ObjectId[], since: Date): Promise<IBooking[]>;
}
