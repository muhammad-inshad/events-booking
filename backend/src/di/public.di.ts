import { ServiceRepository } from '../repositories/service/implementations/ServiceRepository';
import { BookingRepository } from '../repositories/booking/implementations/BookingRepository';
import { PublicService } from '../services/public/implementations/PublicService';
import { PublicController } from '../controllers/public/implementations/PublicController';

export const publicContainer = () => {
  const serviceRepository = new ServiceRepository();
  const bookingRepository = new BookingRepository();
  const publicService = new PublicService(serviceRepository, bookingRepository);
  const publicController = new PublicController(publicService);

  return {
    serviceRepository,
    bookingRepository,
    publicService,
    publicController
  };
};
