import { ServiceRepository } from '../repositories/service/implementations/ServiceRepository';
import { CloudinaryImageUploadService } from '../services/upload/implementations/CloudinaryImageUploadService';
import { ServiceService } from '../services/service/implementations/ServiceService';
import { ServiceController } from '../controllers/service/implementations/ServiceController';

export const serviceContainer = () => {
  const serviceRepository = new ServiceRepository();
  const imageUploadService = new CloudinaryImageUploadService();
  const serviceService = new ServiceService(serviceRepository, imageUploadService);
  const serviceController = new ServiceController(serviceService);

  return {
    serviceRepository,
    imageUploadService,
    serviceService,
    serviceController
  };
};
