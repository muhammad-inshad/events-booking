import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../../constants/httpStatus';
import { IPublicService } from '../../../services/public/interfaces/IPublicService';
import { IPublicController } from '../interfaces/IPublicController';
import { PublicServiceListQueryDTO } from '../../../dto/service.dto';

export class PublicController implements IPublicController {
  constructor(private publicService: IPublicService) {}

  getServiceCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.publicService.getServiceCategories();
      res.status(HttpStatus.OK).json({ status: 'success', data: categories });
    } catch (error) {
      next(error);
    }
  };

  getPublicServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as PublicServiceListQueryDTO;
      const result = await this.publicService.getPublicServices(query);
      res.status(HttpStatus.OK).json({ status: 'success', ...result });
    } catch (error) {
      next(error);
    }
  };

  getPublicServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const service = await this.publicService.getPublicServiceById(id);
      res.status(HttpStatus.OK).json({ status: 'success', data: service });
    } catch (error) {
      next(error);
    }
  };
}
