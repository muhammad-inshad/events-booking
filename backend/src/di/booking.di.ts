import { BookingRepository } from '../repositories/booking/implementations/BookingRepository';
import { ServiceRepository } from '../repositories/service/implementations/ServiceRepository';
import { BookingService } from '../services/booking/implementations/BookingService';
import { BookingController } from '../controllers/booking/implementations/BookingController';

export const bookingContainer = () => {
  const bookingRepository = new BookingRepository();
  const serviceRepository = new ServiceRepository();
  const bookingService = new BookingService(bookingRepository, serviceRepository);
  const bookingController = new BookingController(bookingService);

  return {
    bookingRepository,
    serviceRepository,
    bookingService,
    bookingController
  };
};
