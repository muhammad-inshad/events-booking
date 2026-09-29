import { Response, NextFunction } from 'express';
import { HttpStatus } from '../../../constants/httpStatus';
import { AppError } from '../../../errors/AppError';
import { AuthRequest } from '../../../middleware/auth';
import { IServiceService } from '../../../services/service/interfaces/IServiceService';
import { IServiceController } from '../interfaces/IServiceController';
import { CreateServiceDTO, ServiceListQueryDTO, UpdateServiceDTO } from '../../../dto/service.dto';

const getRequiredUserId = (req: AuthRequest): string => {
  if (!req.user) {
    throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
  return req.user.id;
};

export class ServiceController implements IServiceController {
  constructor(private serviceService: IServiceService) {}

  getServices = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as ServiceListQueryDTO;
      const result = await this.serviceService.listServices(query);
      res.status(HttpStatus.OK).json({ status: 'success', ...result });
    } catch (error) {
      next(error);
    }
  };

  createService = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = getRequiredUserId(req);
      const dto: CreateServiceDTO = req.body;
      const service = await this.serviceService.createService(adminId, dto, req.file?.buffer);
      res.status(HttpStatus.CREATED).json({ status: 'success', data: service });
    } catch (error) {
      next(error);
    }
  };

  updateService = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = getRequiredUserId(req);
      const { id } = req.params as { id: string };
      const dto: UpdateServiceDTO = req.body;
      const service = await this.serviceService.updateService(id, adminId, dto, req.file?.buffer);
      res.status(HttpStatus.OK).json({ status: 'success', data: service });
    } catch (error) {
      next(error);
    }
  };

  deleteService = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = getRequiredUserId(req);
      const { id } = req.params as { id: string };
      await this.serviceService.deleteService(id, adminId);
      res.status(HttpStatus.OK).json({ status: 'success', message: 'Service deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
