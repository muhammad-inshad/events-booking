import { IService } from '../../../models/Service';
import { PublicServiceListQueryDTO } from '../../../dto/service.dto';
import { PaginatedResult } from '../../../dto/pagination.dto';

export interface IPublicService {
  getServiceCategories(): Promise<string[]>;
  getPublicServices(query: PublicServiceListQueryDTO): Promise<PaginatedResult<IService>>;
  getPublicServiceById(id: string): Promise<IService>;
}
